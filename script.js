const body = document.body

const h1 = document.createElement('h1')
h1.innerText = 'Aircraft & Flights'
body.append(h1)

const mainContainer = document.createElement('div')
mainContainer.className = 'main-container'
body.append(mainContainer)

const leftPanel = document.createElement('div')
leftPanel.className = 'left-panel'
mainContainer.append(leftPanel)

const rightPanel = document.createElement('div')
rightPanel.className = 'right-panel'
mainContainer.append(rightPanel)

const controls = document.createElement('div')
controls.className = 'controls'

const countInput = document.createElement('input')
countInput.type = 'number'
countInput.className = 'count-input'
countInput.value = 1
countInput.min = 1
countInput.max = 15

const btn = document.createElement('button')
btn.innerText = 'Показать самолёты'

const btn5 = document.createElement('button')
btn5.className = 'btn-count'
btn5.innerText = '5 карточек'

const btn10 = document.createElement('button')
btn10.className = 'btn-count'
btn10.innerText = '10 карточек'

const btn15 = document.createElement('button')
btn15.className = 'btn-count'
btn15.innerText = '15 карточек'

btn5.addEventListener('click', () => {
    countInput.value = 5
    loadAircraft()
})

btn10.addEventListener('click', () => {
    countInput.value = 10
    loadAircraft()
})

btn15.addEventListener('click', () => {
    countInput.value = 15
    loadAircraft()
})

controls.append(countInput, btn, btn5, btn10, btn15)
leftPanel.append(controls)

const result = document.createElement('div')
result.id = 'result'
leftPanel.append(result)

const mapContainer = document.createElement('div')
mapContainer.id = 'map'
rightPanel.append(mapContainer)

const map = L.map('map', { attributionControl: false }).setView([51.505, -0.09], 3)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

let mapLayers = []
let loadedAircrafts = []

function createIcon() {
    const img = document.createElement('img')
    img.src = 'plane.svg'
    img.alt = 'Самолёт'
    img.classList.add('icon')
    img.onerror = function() {
        this.style.display = 'none'
    }
    return img
}

function createImageBox(url) {
    const box = document.createElement('div')
    box.classList.add('image-box')
    if (url) {
        const img = document.createElement('img')
        img.src = url
        img.onerror = function() {
            box.innerText = ''
            box.append(createIcon())
        }
        box.append(img)
    } else {
        box.append(createIcon())
    }
    return box
}

function createItem(label, value) {
    const item = document.createElement('div')
    item.classList.add('item')
    const labelEl = document.createElement('span')
    labelEl.classList.add('label')
    labelEl.innerText = label
    const valueEl = document.createElement('span')
    valueEl.classList.add('value')
    valueEl.innerText = value || 'нет данных'
    item.append(labelEl, valueEl)
    return item
}

function showAircraft(data, index) {
    const card = document.createElement('div')
    card.classList.add('card')
    
    card.append(createImageBox(data.url_photo))
    card.append(createItem('Регистрация', data.registration))
    card.append(createItem('Тип', data.type))
    card.append(createItem('Производитель', data.manufacturer))
    card.append(createItem('Владелец', data.registered_owner))
    
    const detailsBtn = document.createElement('button')
    detailsBtn.innerText = 'Подробнее'
    detailsBtn.addEventListener('click', () => showDetail(index))
    card.append(detailsBtn)
    
    result.append(card)
}

function showDetail(index) {
    const aircraft = loadedAircrafts[index]
    result.innerText = ''
    
    const card = document.createElement('div')
    card.classList.add('card', 'detail-card')
    
    card.append(createImageBox(aircraft.url_photo))
    card.append(createItem('Регистрация', aircraft.registration))
    card.append(createItem('Mode S', aircraft.mode_s))
    card.append(createItem('Тип', aircraft.type))
    card.append(createItem('Производитель', aircraft.manufacturer))
    card.append(createItem('Владелец', aircraft.registered_owner))
    card.append(createItem('Страна', aircraft.registered_owner_country_name))
    
    const coordsSection = document.createElement('div')
    coordsSection.className = 'coords-loading'
    coordsSection.innerText = 'Загрузка координат...'
    card.append(coordsSection)
    
    const backBtn = document.createElement('button')
    backBtn.innerText = 'Назад к списку'
    backBtn.addEventListener('click', showList)
    card.append(backBtn)
    
    result.append(card)

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

if (origin.latitude && origin.longitude) {
    originCoords = `${origin.latitude}, ${origin.longitude}`
} else {
    originCoords = 'нет данных'
}
                
                coordsSection.append(createItem('Аэропорт отправления', origin.name))
                coordsSection.append(createItem('Координаты отправления', originCoords))
                coordsSection.append(createItem('Аэропорт прибытия', destination.name))
                coordsSection.append(createItem('Координаты прибытия', destCoords))
                
                mapLayers.forEach(layer => map.removeLayer(layer))
                mapLayers = []
                
                if (origin.latitude && destination.latitude) {
                    const m1 = L.marker([origin.latitude, origin.longitude]).addTo(map)
                    .bindPopup(`${origin.longitude} место отправления ${origin.name}`).openPopup()

                    const m2 = L.marker([destination.latitude, destination.longitude]).addTo(map)
                    .bindPopup(`${destination.longitude} место прибытия ${destination.name}`).openPopup()

                    mapLayers.push(m1, m2)

                    
                    // const m1 = L.marker([origin.latitude, origin.longitude]).addTo(map)
                    //     .bindPopup(`<b>Отправление:</b><br>${origin.name || 'нет данных'}`)
                    // const m2 = L.marker([destination.latitude, destination.longitude]).addTo(map)
                    //     .bindPopup(`<b>Прибытие:</b><br>${destination.name || 'нет данных'}`)
                    // const line = L.polyline(
                    //     [[origin.latitude, origin.longitude], [destination.latitude, destination.longitude]], 
                    //     { color: '#2e7d32', weight: 3, dashArray: '10, 5' }
                    // ).addTo(map)
                    
                    // mapLayers.push(m1, m2, line)
                    // map.fitBounds(L.featureGroup([m1, m2]).getBounds().pad(0.2))
                }}

function showList() {
    result.innerText = ''
    loadedAircrafts.forEach((aircraft, idx) => showAircraft(aircraft, idx))
}

function loadAircraft() {
    let count = parseInt(countInput.value) || 1
    if (count > 15) count = 15
    if (count < 1) count = 1
    
    result.innerText = ''
    btn.innerText = 'Загрузка...'
    btn.disabled = true
    loadedAircrafts = []
    
    mapLayers.forEach(layer => map.removeLayer(layer))
    mapLayers = []
    
    let loadedCount = 0
    let totalCount = count
    
    for (let i = 0; i < count; i++) {
        fetch('https://api.adsbdb.com/v0/aircraft/random')
            .then(r => r.json())
            .then(data => {
                if (data.response && data.response.aircraft) {
                    const aircraft = data.response.aircraft
                    loadedAircrafts.push(aircraft)
                    showAircraft(aircraft, loadedAircrafts.length - 1)
                }
                loadedCount++
                checkIfDone()
            })
            .catch(() => {
                loadedCount++
                checkIfDone()
            })
    }
    
    function checkIfDone() {
        if (loadedCount === totalCount) {
            btn.innerText = 'Показать самолёты'
            btn.disabled = false
            
            if (loadedAircrafts.length === 0) {
                const empty = document.createElement('div')
                empty.className = 'empty'
                empty.innerText = 'Не удалось загрузить самолёты'
                result.append(empty)
            }
        }
    }
}

btn.addEventListener('click', loadAircraft)
loadAircraft()
