// if cart exists, display it
let cart = [];
cart = JSON.parse(localStorage.getItem('cart')); 
if (cart !== null) {
    displayCart();  
    calcTotalPrice()
    changeQty()
    deleteProduct()
}

// get product information in API
async function fetchProductsInApi() {
    const response = await fetch('http://localhost:3000/api/products')
    if(response.ok) {
        return response.json();
    }
    throw new Error('Impossible d\'accéder au serveur')
}
fetchProductsInApi().then(products => getProductData(products))

// compare and gather product information
function getProductData(products) {
    let productData = JSON.parse(localStorage.getItem('productData'));

    if(productData !== null) {
        for (i=0; i<productData.length; i++) {
            var productId = productData[i].id;
            var productColor = productData[i].color;
            var productQty = Number(productData[i].quantity); 
    
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

        //get existing row index 
        for(let i= 0; i<cart.length; i++) { 
            if(cart[i].id == id && cart[i].color == color) {
                var index = cart.indexOf(cart[i]);
                break;
            } else {
                var index = -1;
            }
        }

        if(index !== null && index !== -1 && cart.length !== 0) {
            cart[index].price = price * (cart[index].quantity += qty)
        } else {
            pushProduct(id, color, qty, name, price, img, altText)
        }
        localStorage.setItem('cart', JSON.stringify(cart.sort(sorting)));
        localStorage.removeItem('productData');

    } else {
        cart = [];
        pushProduct()
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.removeItem('productData');
    }
    displayCart(); 
    calcTotalPrice()
    changeQty()
    deleteProduct()
}

// sort product in alphabetical order
function sorting(a,b) {
    return a.name > b.name ? 1 : -1;
};

// push new product
function pushProduct(id, color, qty, name, price, img, altText) {
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

function displayCart(){
    for(let i=0; i<cart.length; i++) {
        document.querySelector('#cart__items').innerHTML += 
        '<article class="cart__item" data-id="'+cart[i].id+'" data-color="'+cart[i].color+'">'+
            '<div class="cart__item__img">'+
                '<img src="'+cart[i].image+'" alt="'+cart[i].altText+'">'+
            '</div>'+
            '<div class="cart__item__content">'+
                '<div class="cart__item__content__description">'+
                    '<h2>'+cart[i].name+'</h2>'+
                    '<p>'+cart[i].color+'</p>'+
                    '<p>'+cart[i].price+' €</p>'+
                '</div>'+
                '<div class="cart__item__content__settings">'+
                    '<div class="cart__item__content__settings__quantity">'+
                        '<p>Qté : </p>'+
                        '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+cart[i].quantity+'">'+
                    '</div>'+
                    '<div class="cart__item__content__settings__delete">'+
                        '<p class="deleteItem">Supprimer</p>'+
                    '</div'+
                '</div>'+
            '</div>'+
        '</article>';
    }
}

function calcTotalPrice() {
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
//        WATCH FOR CHANGES
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
                calcTotalPrice()
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
                if(cart[j].id == datasetId && cart[j].color == datasetColor) {
                    let index = cart.indexOf(cart[j])
                    cart.splice(index, 1)
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            }
            document.querySelector('#cart__items').innerHTML = ''; 
            displayCart(); 
            calcTotalPrice()
            changeQty()
            deleteProduct()
        })
    }
}

// //
// //        FORM
// // 

let letterRegex = /[^A-Za-z]/
let nbAndLetterRegex = /[^\w\s]/
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let contact = {}
let products= []

// check input value
document.querySelector('#firstName').addEventListener('input', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#firstNameErrorMsg').textContent = 'Ce champ ne doit contenir que des lettres'
    } else {
        document.querySelector('#firstNameErrorMsg').textContent = ''
        contact.firstName = e.target.value
    }
})
document.querySelector('#lastName').addEventListener('input', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#lastNameErrorMsg').textContent = 'Ce champ ne doit contenir que des lettres'
    } else {
        document.querySelector('#lastNameErrorMsg').textContent = ''
        contact.lastName = e.target.value
    }
})
document.querySelector('#address').addEventListener('input', (e) => {
    if(nbAndLetterRegex.test(e.target.value)) {
        document.querySelector('#addressErrorMsg').textContent = 'Ce champ ne doit pas contenir de caractères spéciaux'
    } else {
        document.querySelector('#addressErrorMsg').textContent = ''
        contact.address = e.target.value
    }
})
document.querySelector('#city').addEventListener('input', (e) => {
    if(letterRegex.test(e.target.value)) {
        document.querySelector('#cityErrorMsg').textContent = 'Ce champ ne doit contenir que des lettres'
    } else {
        document.querySelector('#cityErrorMsg').textContent = ''
        contact.city = e.target.value
    }
})
document.querySelector('#email').addEventListener('change', (e) => {
    if(emailRegex.test(e.target.value)) {
        document.querySelector('#emailErrorMsg').textContent = ''
        contact.email = e.target.value
    } else {
        document.querySelector('#emailErrorMsg').textContent = 'Cet email est invalide'
    }
})

// submit form
document.querySelector('#order').addEventListener('click', (e) => {
    e.preventDefault()
    for (let i=0; i<cart.length; i++) {
        products.push(cart[i].id)
    }
    postProducts().then(function(order) {
        let orderId= order.orderId
        window.location.href='./confirmation.html?id='+orderId
    })
})

async function postProducts() {
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
    throw new Error('Impossible d\'accéder au serveur')
}