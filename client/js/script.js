const commonConfig = {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
    credentials: "include",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'Hello'
    }
}

// Test Cookies
const usernameElement = document.getElementById('username');
const getUsername = () => {
// Access the cookie named "username"
const username = document.cookie.split('; ').find(cookie => cookie.startsWith('username='));
if (username) {
    return `Welcome back ${username.split('=')[1]}`;
}
return null;
};

usernameElement.textContent = getUsername() || 'New Visitor';
let cookieBtn = document.getElementById('fetch-btn-cookie');

cookieBtn.addEventListener('click', (e) => {
    fetch('http://localhost:3000/', commonConfig)
    .then((res) => res.json())
    .then((data) => {
        usernameElement.textContent = getUsername() || 'New Visitor'
        console.log(data);
    });
});

// Fetch API Methods
//GET
let getButton = document.getElementById('fetch-btn-get');

const renderData = (data) => {
    console.log(data, renderData);
    console.log(data, 'renderData');
    let containerEle = document.getElementById('content');
    containerEle.innerHTML = '';
    data.forEach(ele => {
        let itemElement = document.createElement('div');
        let idEle = document.createElement('h3');
        idEle.innerHTML = ele.id;
        let titleEle = document.createElement('p');
        titleEle.innerHTML = ele.title;
        itemElement.appendChild(idEle);
        itemElement.appendChild(titleEle);
        itemElement.id = ele.id;
        itemElement.style.padding = '10px';
        itemElement.style.borderBottom = '1px solid black';
        containerEle.appendChild(itemElement);
    });
}

getButton.addEventListener('click', (e) => {
    fetch('http://localhost:3000/data', commonConfig)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        renderData(data.data);
    });
});

//POST
let postButton = document.getElementById('fetch-btn-post');

postButton.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/create/data', { ...commonConfig, method: 'POST', body: JSON.stringify({
        "userId": 12,
        "id": 12,
        "title": "test entry",
        "completed": false
      }) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        renderData(data.data);
    });
});

//PUT
let putButton = document.getElementById('fetch-btn-put');

putButton.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/update/data/2', { ...commonConfig, method: 'PUT', body: JSON.stringify({
        "userId": 1,
        "id": 2,
        "title": "quis ut nam",
        "completed": false
      }) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        renderData(data.data);
    });
});

//DELETE

let deleteButton = document.getElementById('fetch-btn-delete');

deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/remove/data/1', { ...commonConfig, method: 'DELETE' })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        renderData(data.data);
    });
});

// HEAD
let headButton = document.getElementById('fetch-btn-head');

// const resourceUrl = 'https://images.pexels.com/photos/18016273/pexels-photo-18016273/free-photo-of-neon-text-glowing-against-a-dark-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

headButton.addEventListener('click', (e) => {
    fetch('https://images.pexels.com/photos/29399294/pexels-photo-29399294/free-photo-of-serene-winter-landscape-with-snowy-mountains.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        { ...commonConfig, method: 'HEAD', mode: 'no-cors' });
});

//OPTIONS
// curl -v -X OPTIONS http://localhost:3000/
// https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request


//==================
//====Request Size==
//==================

let requsetSizeButton = document.getElementById('fetch-btn-size');

requsetSizeButton.addEventListener('click', (e) => {
    fetch('http://localhost:3000/image', { ...commonConfig, method: 'GET', headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'x-header-1': 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssqqsqsjfsdfkjasdjfaskjdfjksadfkjasjkdfkjsadfjkasdfjkhasjkdfhjkasdfjksadjkfasjkdfhawermscxmzndkjnfjasfiasjkzkjxnckjzsdfuhasdfxv,mzxc kjnxkjcvnkjsdnksnkjnfkajnsdjfnasdkjnkjsdvkjbadskgbajsdkfnkjasdnfjkbsvxcnvmznxjkvnaskdjvjsjvkzxkjcvnzxhjvahbsdvnx cjn xzcjv jzhxcbvjhzxbckjvzxkjcvjlzdhjvasdjhfns sdfjasdjkfkjasdfkjasdjkfasdjkfajksdfbjkasdbfsadjbfjasdbfhjabsdhfjasd  ajsdfjkasdkfjasjkdfjasdf asdfjansdfjnajksdf asd fasdfjksnmczmxcmfjasdfjasdfknsjxznkcmdjkfakjdsfkjasdkfjnasdkfnkajsdnfasdfjknsdklnmz,xcnaskdnfajdsfkjasdfkasdfkasdjfamsdfasdknflaksndfkasklndflkasdjfklksjdfjlkkjlkkjlkjkljliasjfjl;nkkj;n;asdmfaks;ndfkasdkfnkasdfn;kas;dkfjajsdfjkasdjfajsdfkjasdjkfsdfknajksdfljasldf nsdkfajsdfjkasdnkjfajsndjnasdnjnjasdfhjlasehruewjkrjewjkrjkaejkrjkaejkfajksdfjhasdjkfhajksdhfjkasdfjkaksjhdfhjasdjfhajksdfjkasdfjkahsdfbsdjkvasdjfjaskdfjkasdkjfkjajkdgfjksdfkjgkjsdfjkgjkasdjfjkasdkjfhaknsdvjknsdkjfjkasdjfjasdjfhajksdvnmjkhaewhruqwerqiweiriqewruioqiwoerpioqweopirpioqwerioqwerfjkbsdjkfasjdkfjahsdfjadsjkllfkjasdjkfalkjdshfhguhiquwehriuqwherjqwejnkrjkqwejrkjhqwerhqihuweiuhrqiuwherhiuqwehiuhuirqwekjjnksadnjjknadsfkjdfskjfdsjkhsdafjkhfjbkasdjkfjkasdjhfkasjdhkfjhasdjhkfkajhsdjkhfkafhjkiwqoeirqweojrqjwfjksddfjkasjfipowaepriqwjerjkqwnejkrqjkwehrqwhuifhsadfjaksdhfjasdhjfkaskdjfjkasdkjfhakjsdnfkjasndkfjnasjkdnfjkasdkjfnkjasdfoijqweirqiowerqiweuriuqwerjksdnkjnasdjkfnjkasdnjkcnkjasnkjxcnajksdnjfksadjkgjkashdjfhasdhfjawejfroqweroqwerquweurqweiasufaiuseruweirskjdfnkasdfkasdfjkasdjkfjkasdhfjashdkfjasdhfkjasdkjfhaskdjfhasdkjnknxkjcnaksdnjasdfasdfiaoefiqiwoeruqweorioqweriskjdfkaksdfkaklklklkjsjkdfjaksldfjkasdkfkaljsdflkaklsdfjkakjsfdkljdsfakjlkfkkjfdsjklafsdjklafsdjklafsdjklafsdjklaojiqweoiweiorioqweirqwioeriouqwejklsckmnm,xzmkczxklncvlkxcmnvmn,xzmncvnzxckljvsijdfajiksdfkljaklsdfkljasdjklfaioeoirquweirqweoprpoqewirqwoeroiqweoroijqwerjkkjasdfkjlasdjklfkjlasdkfaknlsdkjfakjlklklasdfkljaskljdfajklsdfjklaskljdfkljasdkfasdklfklaslkdflkasjdflasjdlkfjaslkdjflkasdjfklajsdkfjlasdkjflkasdjflkjasdlkfklasdjflaksdjfklqweiruoquwerioqewuoriquoweiruqiowerioqweuroiqeuoiruqioeurioquewoiruqioeruoiqeuorqiewuxvxzcnvzxcmv,nzcxmvmzxc,mvzmxcnvm,zcxnvm,znxcvmzxcnvm,nxzcvkjksjdfasdfjasdfjoasidfjoiasdifjasdfiaisdjfasjdknkjasndfkjandsjkfnajdskfnkdsjn'
    }}).then((res) => res.json())
    .then((res) => console.log(res));
});

//==================
//====Abort Request==
//==================

    // Create an instance.
    let controller = new AbortController();

    function beginFetching() {
        controller = new AbortController();
        const signal = controller.signal
        console.log('Now fetching');
        fetch('http://localhost:3000/image', {...commonConfig, method: 'GET', signal: signal})
            .then((res) => {
                console.log(`Fetch complete. (Not aborted)`);
                console.log(res);
            }).catch((err) => {
                if(signal.aborted) {
                    if(signal.reason) {
                        console.log(signal.reason);
                    }
                }
            });
    }


    function abortFetching() {
        console.log('Now aborting');
        // Abort.
        controller.abort('I changes my mind!')
    }


    //===================
    //======CSP==========
    //===================


    let imageButton = document.getElementById('get-img-script');

    imageButton.addEventListener('click', (e) => {
        fetch('http://localhost:3000/script/image', { ...commonConfig })
        .then((res) => res.json())
        .then((res) => {
            document.getElementById('csp-demo-content').innerHTML = '';
            document.getElementById('csp-demo-content').innerHTML = `<p>${res}</p>`;
        });
    });




    // ---------------- toggle Theme ----------------


    // document.addEventListener('DOMContentLoaded', async () => {
    //     try {
    //         let toggleLight = document.getElementById('light');
    //         let tohggleDark = document.getElementById('dark');

    //         if(sessionStorage.getItem('theme')) {
    //             if(sessionStorage.getItem('theme') === 'dark') {
    //                 document.body.style.backgroundColor = 'black';
    //                 document.body.style.color = 'white';
    //             } else {
    //                 document.body.style.backgroundColor = 'white';
    //                 document.body.style.color = 'black';
    //             }
    //         }
        
    //         toggleLight.addEventListener('click', (e) => {
    //             document.body.style.backgroundColor = 'white';
    //             document.body.style.color = 'black';
    //             sessionStorage.setItem('theme', 'light');
    //         });
        
    //         tohggleDark.addEventListener('click', (e) => {
    //             document.body.style.backgroundColor = 'black';
    //             document.body.style.color = 'white';
    //             sessionStorage.setItem('theme', 'dark');
    //         });
    //     } catch (e) {
    //         console.error('Error toggling theme:', e);
    //     }
    // });