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
                        for(let i= 0; i<cart.length; i++) {                       
                            if(cart[i].id == productId && cart[i].color == productColor) {
                                var index = cart.indexOf(cart[i]);
                                break;
                            } else {
                                var index = -1;
                            }
                            displayCart(cart[i].id, cart[i].color, cart[i].image, cart[i].altText, cart[i].name, cart[i].price, cart[i].quantity);
                        }
                        if(index !== null && index !== -1) {
                            cart[index].quantity += productQty
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
                        '<p>'+price*quantity+' €</p>'+
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
}



                    
