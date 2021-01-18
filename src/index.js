document.addEventListener("DOMContentLoaded", () => {

fetchDogs()
addFilterEventListener()
let currentDog = {}
let allDogs = []

//FETCHES
function fetchDogs(){
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(dogs => {
        allDogs = dogs
        allDogs.forEach(dog => renderDog(dog))
    })
}

function fetchOne(id) {
    fetch(`http://localhost:3000/pups/${id}`)
    .then(resp => resp.json())
    .then(dog => loadDog(dog))
}

function patchDog(dog) {
    fetch(`http://localhost:3000/pups/${dog.id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(dog)
    })
    .then(resp => resp.json())
    .then(dog => loadDog(dog))
    .catch(error => console.log(error))
  }



//RENDERS AND LOADS (also includes event handlers forEach)
function renderDog(dog){
    let bar = document.getElementById('dog-bar')

    let span = document.createElement('span')
    
    span.id = dog.id 
    span.innerText = dog.name

    bar.appendChild(span)
    span.addEventListener('click', handleClick)
}


function loadDog(dog){
    
    currentDog = dog

    let dogInfoDiv = document.getElementById('dog-info')
    dogInfoDiv.innerHTML = ''
    let img = document.createElement('img')
    let h2 = document.createElement('h2')
    let btn = document.createElement('button')

    img.src = dog.image
    h2.innerText = dog.name
    
    if (dog.isGoodDog) {
        btn.innerText = 'Good Dog!'
    } else {
        btn.innerText = 'Bad Dog!'
    }

    btn.addEventListener('click', goodDogBadDog) 
    
    dogInfoDiv.appendChild(img)
    dogInfoDiv.appendChild(h2)
    dogInfoDiv.appendChild(btn)
    }


//EVENT HANDLERS


function handleClick(e){
    console.log(e.target)
    fetchOne(e.target.id)
    
}
    
function goodDogBadDog() {
    if (currentDog.isGoodDog){
        let dog = {
            'id': currentDog.id,
            'name': currentDog.name,
            'isGoodDog': false,
            'image': currentDog.image
        }
        patchDog(dog)
    } else {
        let dog = {
            'id': currentDog.id,
            'name': currentDog.name,
            'isGoodDog': true,
            'image': currentDog.image
        }
        patchDog(dog)
    }
}

function addFilterEventListener() {
    let filterBtn = document.getElementById('good-dog-filter')
    filterBtn.addEventListener('click', filterDogs)
}


function filterDogs(e){
    let filteredDogs = []
    let bar = document.getElementById('dog-bar')


    if (e.target.innerText == 'Filter good dogs: ON') {
        filteredDogs = allDogs
        e.target.innerText = 'Filter good dogs: OFF'
    } else {
        filteredDogs = allDogs.filter(dog => dog.isGoodDog)
        e.target.innerText = 'Filter good dogs: ON'
    }
    bar.innerHTML = ''
    filteredDogs.forEach(dog => renderDog(dog))
}

})


