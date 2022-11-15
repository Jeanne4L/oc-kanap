//request to get information whose product corresponds to id
fetch('http://localhost:3000/api/products')
.then(function(response) {
    if(response.ok) {
        return response.json();
    }
})
.then(function(products) {
    getProductData(products);
})

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
                    cart = JSON.parse(localStorage.getItem('cart')); 
                    if(cart) {  
                        console.log(cart) 
                        for(let i= 0; i<cart.length; i++) {                       
                            if(cart[i].id == productId && cart[i].color == productColor) {
                                var index = cart.indexOf(cart[i]);
                                break;
                            } else {
                                var index = -1;
                            }
                        }
                        if(index !== null && index !== -1) {
                            cart[index].quantity += productQty
                            console.log('C\'est le même')
                        } else {
                            cart.push({
                                id: productId, 
                                color: productColor,
                                quantity: productQty,
                                name: productName, 
                                price: productPrice,
                                image: productImg, 
                                altText: productAltText
                            });
                            console.log('C\'est pas le même')
                        }
                        localStorage.setItem('cart', JSON.stringify(cart.sort(tri)));
                        localStorage.removeItem('productData');
                    } else {
                        cart = [];
                        cart.push({
                            id: productId, 
                            color: productColor,
                            quantity: productQty,
                            name: productName, 
                            price: productPrice,
                            image: productImg, 
                            altText: productAltText
                        });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        localStorage.removeItem('productData');
                        console.log('Ça va pas du tout là')
                    }
                    console.log(cart)
                }
            }
        } 
    }
}
function tri(a,b) {
    return a.name > b.name ? 1 : -1;
};

let cart = [];




//     // displayCart(productId, productColor, productImg, productAltText, productName, productPrice, productQty);
//     essaiClass = new NewProductInCart(productId, productColor, productQty, productName, productPrice, productImg, productAltText);
//     //console.log(productId, productColor, productQty, productName, productPrice, productImg, productAltText)
// }

// function displayCart (productId, productColor, productImg, productAltText, productName, productPrice, productQty){
//     document.querySelector('#cart__items').innerHTML += 
//     '<article class="cart__item" data-id="'+productId+'" data-color="'+productColor+'">'+
//         '<div class="cart__item__img">'+
//             '<img src="'+productImg+'" alt="'+productAltText+'">'+
//             '</div>'+
//                 '<div class="cart__item__content">'+
//                     '<div class="cart__item__content__description">'+
//                         '<h2>'+productName+'</h2>'+
//                         '<p>'+productColor+'</p>'+
//                         '<p>'+productPrice+' €</p>'+
//                     '</div>'+
//                     '<div class="cart__item__content__settings">'+
//                         '<div class="cart__item__content__settings__quantity">'+
//                             '<p>Qté : </p>'+
//                             '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+productQty+'">'+
//                         '</div>'+
//                     '<div class="cart__item__content__settings__delete">'+
//                     '<p class="deleteItem">Supprimer</p>'+
//                 '</div>'+
//             '</div>'+
//         '</div>'+
//     '</article>';
// }



                    
