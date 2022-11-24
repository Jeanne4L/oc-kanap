//get id from url
let productIdParams = new URLSearchParams(document.location.search)
let id = productIdParams.get('id')

let qty
let colorChoice

// get product information from API
async function fetchProduct() {
    const response = await fetch('http://localhost:3000/api/products/'+id)
    if(response.ok) {
        return response.json()
    }
    throw new Error('Impossible d\'accéder au serveur')
}

fetchProduct()
.then(function(product) {
    targetElement(product)
    getColors(product)
    calcPrice(product)
    sendToCart()
})

//select elements
function targetElement(product) {
    document.querySelector('title').textContent = product.name
    document.querySelector('.item__img').innerHTML += '<img src="'+product.imageUrl+'" alt="'+product.altTxt+'">'
    document.querySelector('#title').textContent = product.name
    document.querySelector('#description').textContent = product.description
}

// choose color
function getColors(product) {
    let colors = product.colors
    for(let i = 0; i < colors.length; i++) {
        colorChoice = document.querySelector('#colors')
        colorChoice.innerHTML += '<option value="'+colors[i]+'">'+colors[i]+'</option>'
    }
}

// change price according to quantity
function calcPrice(product) {
    let price = document.querySelector('#price')
    price.textContent = product.price
    qty = document.querySelector('#quantity')
    qty.setAttribute('value', 1)
    qty.addEventListener('input', () => {
        if(qty.value !== 0) {
            price.textContent = product.price * qty.value
        } 
    })
}
// send ID, chosen color and quantity to the cart with localStorage
function sendToCart() {
    document.querySelector('#addToCart').addEventListener('click', () => {
        if(colorChoice.value !== '') {
            let productData = []
            //if exists in LocalStorage => get it and push new information
            productData = JSON.parse(localStorage.getItem('productData'))
                
            if(productData) {
                productData.push({
                    id: id,
                    color: colorChoice.value,
                    quantity: qty.value
                })
                localStorage.setItem('productData', JSON.stringify(productData))
            } else {
                productData = []
                productData.push({
                    id: id,
                    color: colorChoice.value,
                    quantity: qty.value
                })
                localStorage.setItem('productData', JSON.stringify(productData))
            } 
        } 
    })
}