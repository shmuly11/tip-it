const tipContainer = document.querySelector("#all-tips")
const tipForm = document.querySelector('#create-tip')
const selectSort = document.querySelector('select')

function preload(){
    fetch("http://localhost:3000/tips")
    .then(res => res.json())
    .then(tips => {tips.forEach(tip => {
        renderTip(tip)
        
    })

    })
}

function renderTip(tip){
    tipContainer.innerHTML += `
    <div class="item card">
                <header>
                    <h3>${tip.restaurant} <span>| ${tip.experienceRating} / 10.0</span></h3>
                </header>
                <p>Total w/o Tip: <span>$${tip.total - tip.tip}</span></p>
                <p>Tip Amount <span>(${tip.percentage}%)</span>: <span>$${tip.tip}</span></p>
                <hr>
                <p>Total: <span>$${tip.total}</span></p>
            </div>
    `
}

function getFormData(e){
    
    let restaurant = e.target.restaurant.value
    let total = parseInt(e.target.total.value)
    let percentage = parseInt(e.target.percentage.value)
    let experienceRating = parseInt(e.target.experienceRating.value)
    let tip = (total * percentage) / 100
    total = total + tip
    
    return {restaurant, total, percentage, tip, experienceRating}
}

function handleForm(e){
    e.preventDefault()

    let newTip = getFormData(e)
    updateBackend(newTip)
    .then(renderTip)

    e.target.reset()
}

function updateBackend(tip){
    return fetch("http://localhost:3000/tips", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tip)
            })
            .then(res => res.json())  
}

function handleSelect(e){
    fetch('http://localhost:3000/tips')
    .then(res => res.json())
    .then(tips => sortTips(e, tips))
}

function sortTips(e, tips){
    switch (e.target.value) {
        case "Rating":
            tips.sort((a, b) => b.experienceRating - a.experienceRating)
            break;
        case "Total w/o Tip":  
            tips.sort((a, b) => (b.total - b.tip) - (a.total - a.tip))
            break;
        case 'Total Amount + Tip':
            tips.sort((a, b) => b.total - a.total)
            break;
        case "Percentage %":
            tips.sort((a, b) => b.percentage - a.percentage)  
            break;
        case "Tip Amount":
            tips.sort((a, b) => b.tip - a.tip)  
    }

    tipContainer.innerHTML = ""
    tips.forEach( tip => renderTip(tip))
}

selectSort.addEventListener('change', handleSelect)
tipForm.addEventListener('submit', handleForm)

preload()

