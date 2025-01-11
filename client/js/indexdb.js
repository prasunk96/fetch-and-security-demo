// Initialize database
let db;
const dbName = 'NotesDB_1';
const dbVersion = 1;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            reject('Database error: ' + event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('notes')) {
                const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                store.createIndex('title', 'title');
                store.createIndex('category', 'category');
                store.createIndex('title_category', ['title', 'category']);
            }
        };
    });
}

async function addNote(noteTitle, noteText, noteCategory) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['notes'], 'readwrite');
        const store = transaction.objectStore('notes');
        
        const note = {
            title: noteTitle,
            text: noteText,
            category: noteCategory,
            date: new Date()
        };
        
        const request = store.add(note);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getNotes() {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getNotesByCategory(category) {
    if (!db) {
        await initDB();
    }
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const index = store.index('category');
        const request = index.getAll(category);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Usage example
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        
        const addButton = document.getElementById('addNote');
        const noteTitle = document.getElementById('noteTitle');
        const noteText = document.getElementById('noteText');
        const noteCategory = document.getElementById('noteCategory');
        const fetchNotesByCategory = document.getElementById('fetchNotesByCategory');
        
        addButton.addEventListener('click', async () => {
            try {
                await addNote(noteTitle.value,noteText.value, noteCategory.value);
                noteTitle.value = '';
                noteText.value = '';
                noteCategory.value = '';
                displayNotes();
            } catch (error) {
                console.error('Error adding note:', error);
            }
        });
        
        async function displayNotes() {
            try {
                const notes = await getNotes();
                const notesList = document.getElementById('notesList');
                notesList.innerHTML = notes
                    .map(note => `
                        <div class="note">
                            <p>${note.text}</p>
                            <small>${note.date.toLocaleString()}</small>
                        </div>
                    `)
                    .join('');
            } catch (error) {
                console.error('Error displaying notes:', error);
            }
        }

        fetchNotesByCategory.addEventListener('click', async () => {
            try {
                const category = document.getElementById('notesCategoryInput').value;
                const notes = await getNotesByCategory(category);
                const notesList = document.getElementById('notesByCategory');
                notesList.innerHTML = notes
                    .map(note => `
                        <div class="note">
                            <p>${note.text}</p>
                            <small>${note.date.toLocaleString()}</small>
                        </div>
                    `)
                    .join('');
            } catch (error) {
                console.error('Error adding note:', error);
            }
        });

        // Display initial notes
        displayNotes();
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
});
