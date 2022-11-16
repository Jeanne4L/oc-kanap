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
}

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

        if(index !== null && index !== -1) {
            cart[index].price *= (cart[index].quantity += qty)
        } else {
            cart.push({
                id: id, 
                color: color,
                quantity: qty,
                name: name, 
                price: price,
                image: img, 
                altText: altText
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart.sort(tri)));
        localStorage.removeItem('productData');

    } else {
        cart = [];
        cart.push({
            id: id, 
            color: color,
            quantity: qty,
            name: name, 
            price: price,
            image: img, 
            altText: altText
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.removeItem('productData');
    }

    for(let i= 0; i<cart.length; i++) {   
        displayCart(cart[i].id, cart[i].color, cart[i].image, cart[i].altText, cart[i].name, cart[i].price, cart[i].quantity); 
    }
}

// sort product in alphabetical order
function tri(a,b) {
    return a.name > b.name ? 1 : -1;
};


function displayCart (id, color, image, altText, name, price, quantity){
    document.querySelector('#cart__items').innerHTML += 
    '<article class="cart__item" data-id="'+id+'" data-color="'+color+'">'+
        '<div class="cart__item__img">'+
            '<img src="'+image+'" alt="'+altText+'">'+
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
                '</div>'+
            '</div>'+
        '</div>'+
    '</article>';
    
    let qtyInput = document.querySelector('.itemQuantity');

    qtyInput.addEventListener('change', (e) => {
        var datasetId = qtyInput.closest('[data-id]').dataset.id
        var datasetColor = qtyInput.closest('[data-color]').dataset.color

        console.log(datasetId, datasetColor)
          
        // for (let i =0; i<cart.length; i++) {
        //     if(cart[i].id == datasetId && cart[i].color == datasetColor) {
        //         cart[i].price /= cart[i].quantity
        //         cart[i].quantity = e.target.value
        //         cart[i].price *= cart[i].quantity
        
        //         let div = document.querySelector('.cart__item__content__description')
        //         let p = div.lastChild
        //         p.textContent = cart[i].price + ' €';
        //     }
        // }
    })
}

//
//        GET PRODUCT CHANGES FROM CART PAGE
// 


