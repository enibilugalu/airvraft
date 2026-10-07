const body = document.body

const h1 = document.createElement('h1')
h1.innerText = 'Aircraft'
body.append(h1)

const btn = document.createElement('button')
btn.innerText = 'Показать другой'
body.append(btn)

const result = document.createElement('div')
result.id = 'result'
body.append(result)

const resultCoords = document.createElement('div')
resultCoords.id = 'resultCoords'
body.append(resultCoords)

function createIcon(){
    const img = document.createElement('img')
    img.src = 'plane.svg'
    img.alt = 'Самолёт'
    img.classList.add('icon')
    return img
}

function createImageBox(url){
    const box = document.createElement('div')
    box.classList.add('image-box')
    
    if(url){
        const img = document.createElement('img')
        img.src = url
        img.onerror = function(){
            box.innerText = ''
            box.append(createIcon())
        }
        box.append(img)
    }else{
        box.append(createIcon())
    }
    
    return box
}

function createItem(label, value){
    const item = document.createElement('div')
    item.classList.add('item')
    
    const labelEl = document.createElement('p')
    labelEl.classList.add('label')
    labelEl.innerText = label
    
    const valueEl = document.createElement('p')
    valueEl.classList.add('value')
    valueEl.innerText = value || 'нет данных'
    
    item.append(labelEl, valueEl)
    
    return item
}

function showAircraft(data){
    result.innerText = ''
    
    const card = document.createElement('div')
    card.classList.add('card')
    
    card.append(createImageBox(data.url_photo))
    card.append(createItem('Регистрация', data.registration))
    card.append(createItem('Mode S', data.mode_s))
    card.append(createItem('Тип', data.type))
    card.append(createItem('Производитель', data.manufacturer))
    card.append(createItem('Владелец', data.registered_owner))
    card.append(createItem('Страна', data.registered_owner_country_name))
    
    result.append(card)
}

function showCoords(data){
    resultCoords.innerText = ''

    const originLat = data.origin.latitude
    const originLng = data.origin.longitude

    const dastLat = data.destination.latitude
    const dastLng = data.destination.longitude

    const coord_container = document.createElement('div')
    coord_container.classList.add('coords')

    coord_container.append(createItem('Широта места отправления', originLat))
    coord_container.append(createItem('Долгота места отправления', originLng))
    coord_container.append(createItem('Широта места прибытия', dastLat))
    coord_container.append(createItem('Долгота места прибытия', dastLng))

    resultCoords.append(coord_container)
}

function loadAircraft(){
    fetch('https://api.adsbdb.com/v0/aircraft/random')
        .then(response => response.json())
        .then(data=>{
            if(data.response && data.response.aircraft){
                showAircraft(data.response.aircraft)
            }
        })
        .catch(()=>{
            result.innerText = 'Ошибка загрузки'
        })
        .then(()=>{
            btn.innerText = 'Показать другой'
        })
}

function loadCallsign(){
    fetch('https://api.adsbdb.com/v0/callsign/random')
        .then(response => response.json())
        .then(data=>{
            if(data.response && data.response.callsign){
                showCoords(data.response.callsign)
            }
        })
        .catch(()=>{
            resultCoords.innerText = 'Ошибка загрузки'
        })
        .then(()=>{
            btn.innerText = 'Показать другой'
        })
}

btn.addEventListener('click', loadAircraft, loadCallsign)
loadAircraft()
loadCallsign()
