const express = require('express');
const cookieParse = require('cookie-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const data = require('./data/data.json');

app.use(express.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-header-1');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:3000/; style-src 'self' 'unsafe-inline'; img-src http://assets.clear.in; script-src 'self' 'unsafe-inline' http://localhost:3000/")
  next();
});

app.use(cookieParse());

app.get('/', (req, res) => {
  // Check if user has a cookie named "username"
  const username = req?.cookies?.username;
  console.log(req);
  if (username) {
    // Welcome the user by name
    res.json({msg: `Welcome back, ${username}!`});
  } else {
    // Set a new cookie named "username" with a value
    res.cookie('username', 'johndoe', { maxAge: 60*1000, sameSite: 'lax', secure: false, httpOnly: false }); 
    res.json({msg: 'Welcome, new visitor! Enjoy your exploration.'});
  }
});

app.get('/data', async (req, res) => {
  try {
    // Read the data from data.json
    const filePath = path.join(__dirname, 'data', 'data.json');
    const rawData = await fs.readFile(filePath);
    const data = JSON.parse(rawData);

    // Respond with the current data
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Endpoint for handling the POST request
app.post('/create/data', async (req, res) => {
  try {
    // Read the existing data from data.json
    const filePath = path.join(__dirname, 'data', 'data.json');
    const rawData = await fs.readFile(filePath);
    const data = JSON.parse(rawData);

    // Extract the new entry from the request body
    const newEntry = req.body;

    // Add the new entry to the existing data
    data.push(newEntry);

    // Write the updated data back to data.json
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Respond with the updated data
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.put('/update/data/:id', async (req, res) => {
  try {
    // Read the existing data from data.json
    const filePath = path.join(__dirname, 'data', 'data.json');
    const rawData = await fs.readFile(filePath);
    let data = JSON.parse(rawData);

    // Extract the ID from the request parameters
    const idToUpdate = parseInt(req.params.id);

    // Find the entry in data.json with the specified ID
    const entryToUpdate = data.find((entry) => entry.id === idToUpdate);

    if (!entryToUpdate) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    // Update the entry with the new data from the request body
    entryToUpdate.title = req.body.title;
    entryToUpdate.completed = req.body.completed;

    // Write the updated data back to data.json
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Respond with the updated data
    res.json({ success: true, data: entryToUpdate });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.delete('/remove/data/:id', async (req, res) => {
  try {
    // Read the existing data from data.json
    const filePath = path.join(__dirname, 'data', 'data.json');
    const rawData = await fs.readFile(filePath);
    let data = JSON.parse(rawData);

    // Extract the ID from the request parameters
    const idToDelete = parseInt(req.params.id);

    // Find the index of the entry in data.json with the specified ID
    const indexToDelete = data.findIndex((entry) => entry.id === idToDelete);

    if (indexToDelete === -1) {
      return res.status(404).json({ success: false, error: 'Entry not found' });
    }

    // Remove the entry from the array
    const deletedEntry = data.splice(indexToDelete, 1)[0];

    // Write the updated data back to data.json
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Respond with the deleted data
    res.json({ success: true, data: deletedEntry });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/image', async (req, res) => {
  try {
    req.on('close', () => console.log('aborted'));

    const imagePath = path.join(__dirname, 'assets', 'testPhoto.webp');
    // Read the image file as a buffer
    const imageBuffer = await fs.readFile(imagePath);

    // Convert the image buffer to a base64-encoded string
    const base64Image = imageBuffer.toString('base64');

    // Create a JSON object with the base64-encoded image
    const imageData = { image: base64Image };

    // Send the JSON object as the response
    // res.json(imageData)
    setTimeout(() => res.json(imageData), 10000);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Internal Server Error');
  }
});

// app.post('/csp-report', async (req, res) => {
//   try {
//     // Get the CSP report from the request body
//     const cspReport = req.body;

//     // Save the CSP report to the reports folder with a unique filename (e.g., timestamp)
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const reportFileName = `report-${timestamp}.json`;
//     const reportFilePath = path.join(__dirname, 'reports', reportFileName);

//     // Write the CSP report to the file
//     await fs.writeFile(reportFilePath, JSON.stringify(cspReport, null, 2));

//     // Respond with a success message
//     res.json({ success: true, message: 'CSP report saved successfully' });
//   } catch (error) {
//     console.error('Error saving CSP report:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

app.get('/script/image', (req, res) => {
  try {
    res.json('<img src="https://images.pexels.com/photos/18016273/pexels-photo-18016273/free-photo-of-neon-text-glowing-against-a-dark-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" height="100px" width="100px" />');
  // const data = '<script>alert("XSS Attack!")</script>'; // Malicious comment injected
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
