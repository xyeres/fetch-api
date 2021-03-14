const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
/*
Another way to compose multiple promises
    // store urls to fetch in an array
    const urls = [
    'https://dog.ceo/api/breeds/list',
    'https://dog.ceo/api/breeds/image/random'
    ];

    // use map() to perform a fetch and handle the response for each url
    Promise.all(urls.map(url =>
    fetch(url)
        .then(checkStatus)                 
        .then(parseJSON)
        .catch(logError)
    ))
    .then(data => {
    // do something with the data
    })
*/

function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(err => console.log('Looks like there was a problem ', err))

}

Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')
])
.then(data => {
    const breedList = data[0].message;
    const randomImage = data[1].message;

    generateOptions(breedList);
    generateImage(randomImage);
})

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(res) {
    if(res.ok) {
        return Promise.resolve(res);
    } else {
        return Promise.reject(new Error(res.statusText));
    }
}


function generateOptions(data) {
    const options = data.map(item => `
        <option value='${item}'>${item}</option>
    `).join("");
    select.innerHTML = options;
}

function generateImage(data) {
    const html = `
        <img src='${data}' alt=''>
        <p>Click to view images of ${select.value}s</p>
    `;
    card.innerHTML = html;
}

function fetchBreedImage() {
    const breed = select.value;
    const img = card.querySelector('img');
    const p = card.querySelector('p');
    
    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            img.src = data.message;
            img.alt = breed;
            p.textContent = `Click to view more ${breed}s`;
        })
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

select.addEventListener('change', fetchBreedImage);
card.addEventListener('click', fetchBreedImage);
form.addEventListener('submit', postData);

// ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment })
    }
    
    fetch('https://jsonplaceholder.typicode.com/comments', config)
        .then(checkStatus)
        .then(res => res.json())
        .then(data => console.log(data));
}