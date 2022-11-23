//
//        GET INFORMATION FROM PRODUCT TO CART AND DISPLAY ITS
// 

// if cart exists, display it
let cart = [];
cart = JSON.parse(localStorage.getItem('cart')); 
if (cart !== null) {
    for(let i= 0; i<cart.length; i++) {    
        displayCart(cart[i].id, cart[i].color, cart[i].image, cart[i].altText, cart[i].name, cart[i].price, cart[i].quantity);  
    }
    calcTotal()
}
changeQty()
deleteProduct()

// request to get information whose product corresponds to id
fetch('http://localhost:3000/api/products')
.then(function(response) {
    if(response.ok) {
        return response.json();
    }
})
.then(function(products) {
    getProductData(products);
})

// gather products information from API and localStorage
function getProductData(products) {
    let productData = JSON.parse(localStorage.getItem('productData'));

    if(productData !== null) {
        for (i=0; i<productData.length; i++) {
            var product = productData[i];
            var productId = product.id;
            var productColor = product.color;
            var productQty = Number(product.quantity); 
    
            for (var j =0; j<products.length; j++) {
                var productName = products[j].name;
                var productPrice = products[j].price;
                var productImg = products[j].imageUrl;
                var productAltText = products[j].altTxt;

                if(products[j]._id == productId) {
                    getCart(productId, productColor, productQty, productName, productPrice, productImg, productAltText);
                }
            }
        } 
    }
}

// if exists get cart in localStorage and add new products
function getCart(id, color, qty, name, price, img, altText) {
    cart = JSON.parse(localStorage.getItem('cart')); 
    if(cart) {  
        document.querySelector('#cart__items').innerHTML = ''; 

        for(let i= 0; i<cart.length; i++) { 
            //get existing row index 
            if(cart[i].id == id && cart[i].color == color) {
                var index = cart.indexOf(cart[i]);
                break;
            } else {
                var index = -1;
            }
        }

        if(index !== null && index !== -1 && cart.length !== 0) {
            cart[index].price *= (cart[index].quantity += qty)
        } else {
            cart.push({
                id: id, 
                color: color,
                quantity: qty,
                name: name, 
                price: price * qty,
                image: img, 
                altText: altText
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart.sort(sorting)));
        localStorage.removeItem('productData');

    } else {
        cart = [];
        cart.push({
            id: id, 
            color: color,
            quantity: qty,
            name: name, 
            price: price * qty,
            image: img, 
            altText: altText
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.removeItem('productData');
    }

    for(let i= 0; i<cart.length; i++) {   
        displayCart(cart[i].id, cart[i].color, cart[i].image, cart[i].altText, cart[i].name, cart[i].price, cart[i].quantity); 
    }
    calcTotal()
    changeQty()
    deleteProduct()
}

// sort product in alphabetical order
function sorting(a,b) {
    return a.name > b.name ? 1 : -1;
};

function displayCart (id, color, image, alt, name, price, quantity){
    document.querySelector('#cart__items').innerHTML += 
    '<article class="cart__item" data-id="'+id+'" data-color="'+color+'">'+
        '<div class="cart__item__img">'+
            '<img src="'+image+'" alt="'+alt+'">'+
        '</div>'+
        '<div class="cart__item__content">'+
            '<div class="cart__item__content__description">'+
                '<h2>'+name+'</h2>'+
                '<p>'+color+'</p>'+
                '<p>'+price+' €</p>'+
            '</div>'+
            '<div class="cart__item__content__settings">'+
                '<div class="cart__item__content__settings__quantity">'+
                    '<p>Qté : </p>'+
                    '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+quantity+'">'+
                '</div>'+
                '<div class="cart__item__content__settings__delete">'+
                    '<p class="deleteItem">Supprimer</p>'+
                '</div'+
            '</div>'+
        '</div>'+
    '</article>';
}

//
//        GET PRODUCT CHANGES FROM CART PAGE
// 

function changeQty() {
    let qtyInput = document.querySelectorAll('.itemQuantity');

    for( let i=0; i<qtyInput.length; i++) {
        qtyInput[i].addEventListener('change', (e) => {
            let inputValue = Number(e.target.value);
            let datasetId = qtyInput[i].closest('[data-id]').dataset.id
            let datasetColor = qtyInput[i].closest('[data-color]').dataset.color

            let containerDiv = qtyInput[i].closest('.cart__item__content')
            let descriptionDiv = containerDiv.firstChild;
            let priceDisplay = descriptionDiv.lastChild;
            
            for (let j =0; j<cart.length; j++) {
                if(cart[j].id == datasetId && cart[j].color == datasetColor) {
                    
                    cart[j].price /= cart[j].quantity 
                    cart[j].quantity = inputValue
                    if(inputValue == 0 || inputValue == null) {
                        cart[j].quantity = 1  
                        qtyInput[i].value = cart[j].quantity
                    }
                    cart[j].price *= cart[j].quantity

                    priceDisplay.textContent = cart[j].price + ' €';
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
                calcTotal()
            }
        })
    }
}

function deleteProduct() {
    let deleteBtn = document.querySelectorAll('.deleteItem');

    for( let i=0; i<deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', () => {
            let datasetId = deleteBtn[i].closest('[data-id]').dataset.id
            let datasetColor = deleteBtn[i].closest('[data-color]').dataset.color

            for (let j=0; j<cart.length; j++) {
                // if(cart.length == 1) {
                //     cart = null
                // }
                if(cart[j].id == datasetId && cart[j].color == datasetColor) {
                    let index = cart.indexOf(cart[j])
                    cart.splice(index, 1)
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            }
            document.querySelector('#cart__items').innerHTML = ''; 
            for(let i= 0; i<cart.length; i++) {   
                displayCart(cart[i].id, cart[i].color, cart[i].image, cart[i].altText, cart[i].name, cart[i].price, cart[i].quantity); 
            }
            calcTotal()
        })
    }
}

function calcTotal() {
    let totalPrice = 0;
    let totalQty = 0;

    for( let i=0; i<cart.length; i++) {
        totalPrice += cart[i].price
        totalQty += cart[i].quantity
    }
    document.querySelector('#totalQuantity').textContent = totalQty
    document.querySelector('#totalPrice').textContent = totalPrice
}

//
//        FORM
// 

let letterRegex = /[A-Za-z]/g
let nbAndLetterRegex = /\w/g
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

let contact = {}
let products= []

// check input value
document.querySelector('#firstName').addEventListener('change', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#firstNameErrorMsg').textContent = ''
        contact.firstName = e.target.value
    } else {
        document.querySelector('#firstNameErrorMsg').textContent = 'Vous devez saisir votre prénom'
    }
})
document.querySelector('#lastName').addEventListener('change', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#lastNameErrorMsg').textContent = ''
        contact.lastName = e.target.value
    } else {
        document.querySelector('#lastNameErrorMsg').textContent = 'Vous devez saisir votre nom de famille'
    }
})
document.querySelector('#address').addEventListener('change', (e) => {
    if(nbAndLetterRegex.test(e.target.value)) {
        document.querySelector('#addressErrorMsg').textContent = ''
        contact.address = e.target.value
    } else {
        document.querySelector('#addressErrorMsg').textContent = 'Vous devez saisir votre adresse'
    }
})
document.querySelector('#city').addEventListener('change', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#cityErrorMsg').textContent = ''
        contact.city = e.target.value
    } else {
        document.querySelector('#cityErrorMsg').textContent = 'Vous devez saisir votre ville'
    }
})
document.querySelector('#email').addEventListener('change', (e) => {
    if(emailRegex.test(e.target.value)) {
        document.querySelector('#emailErrorMsg').textContent = ''
        contact.email = e.target.value
    } else {
        document.querySelector('#emailErrorMsg').textContent = 'Email invalide'
    }
})

// submit
document.querySelector('#order').addEventListener('click', (e) => {
    e.preventDefault()
    for (let i=0; i<cart.length; i++) {
        products.push(cart[i].id)
    }
    fetchProducts().then(function(order) {
        let orderId= order.orderId
        window.location.href='./confirmation.html?id='+orderId
    })
})

async function fetchProducts() {
    const res = await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"										
        },
        body: JSON.stringify({
            contact,
            products
        })
    })
    if (res.ok) {
        return res.json()
    } 
    throw new Error(res.status)
}