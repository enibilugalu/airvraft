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

const coords = document.createElement('div')
coords.classList.add('coords')
coords.innerText = 'Координаты: ...'
body.append(coords)

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
    
    const labelEl = document.createElement('span')
    labelEl.classList.add('label')
    labelEl.innerText = label
    
    const valueEl = document.createElement('span')
    valueEl.classList.add('value')
    valueEl.innerText = value || 'Н/Д'
    
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
        .finally(()=>{
            btn.innerText = 'Показать другой'
        })
}

btn.addEventListener('click', loadAircraft)
loadAircraft()