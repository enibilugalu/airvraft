const body = document.body

function createEl({nameEl, textEl, classNames = [], parentEl} = {}){
    const el = document.createElement(nameEl)

    if(!!textEl){
        el.innerText = textEl
    }
    
    if(classNames.length > 0){
        el.classList.add(...classNames)
    }

    if(!!parentEl){
        parentEl.append(el)
    }

    return el
}

const mainCont = createEl({nameEl: 'div', classNames: ['main'], textEl: '', parentEl: body})
const h1 = createEl({nameEl: 'h1', textEl: 'Aircraft', classNames: ['header'],  parentEl: mainCont})
const btn = createEl({nameEl: 'button', textEl: 'Показать другой', parentEl: mainCont})
const result = createEl({nameEl: 'div', classNames: ['result'], parentEl: mainCont})
const resultCoords = createEl({nameEl: 'div', classNames: ['resultCoords'], parentEl: mainCont})

const map = document.createElement('div')
    map.id = 'map'
    mainCont.append(map)

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
    
    let registration = data.registration
    let mode_s = data.mode_s
    let type = data.type
    let manufacturer = data.manufacturer
    let registered_owner = data.registered_owner
    let owner_country = data.registered_owner_country_name

    card.append(createImageBox(data.url_photo))
    card.append(createItem('Регистрация', registration))
    card.append(createItem('Mode S', mode_s))
    card.append(createItem('Тип', type))
    card.append(createItem('Производитель', manufacturer))
    card.append(createItem('Владелец', registered_owner))
    card.append(createItem('Страна', owner_country))
    
    result.append(card)
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
            if(data.response && data.response.flightroute){
                
                showCoords(data.response.flightroute)
            }
        })
        .catch(()=>{
            resultCoords.innerText = 'Ошибка загрузки'
        })
}

btn.addEventListener('click', () => {
    loadAircraft()
    loadCallsign()
})

loadAircraft()
loadCallsign()

function MAP(data){
    let map = L.map('map').setView([data.origin.latitude, data.origin.longitude], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);


    return map
    
}
let mapBox = MAP({
    origin: {
        latitude: 51.505,
        longitude:  -0.09,
    }
})




function showCoords(data){
    resultCoords.innerText = ''

    const coord_container = document.createElement('div')
    coord_container.classList.add('coords')

    coord_container.append(createItem('Широта места отправления', data.origin.latitude))
    coord_container.append(createItem('Долгота места отправления', data.origin.longitude))
    coord_container.append(createItem('Широта места прибытия', data.destination.latitude))
    coord_container.append(createItem('Долгота места прибытия', data.destination.longitude))

    resultCoords.append(coord_container)

    let testBtn =createEl({nameEl: 'button', textEl: 'test', parentEl: document.body})
    testBtn.addEventListener('click', () =>{
      mapBox.setView([data.origin.latitude, data.origin.longitude], 4) 
 
        /*  MAP({
            origin: {
                latitude: data.origin.latitude,
                longitude:  data.origin.longitude,
            }
        })  */
    })

  
}
