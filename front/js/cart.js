function NewCartLine(id, color, quantity, price, image, name, altText) {
    this.productId = id;
    this.productColor = color;
    this.productQty = quantity;
    this.productPrice = price;
    this.productImg = image;
    this.productName = name;
    this.productAltText = altText;
    this.addQty = function (quantity) {
        this.productQty += quantity;
    }
    this.getLinePrice = function() {
        var result = this.productPrice + this.productQty;
        return result;
    }
    this.getProductId = function() {
        return this.productId;
    }
}

function CreateCart() {
    this.list = [];
    this.addProduct = function () {
        var index = this.getProduct(productId);
        if (index == -1) {
            this.list.push(new NewCartLine(productId, productColor, productQty, productPrice, productImg, productAltText));
        } else {
            this.list[index].addQty(productQty);
        }
    }
    this.getCartPrice = function()
    {
        var total = 0;
        for(let i = 0 ; i < this.list.length ; i++)
            total += this.list[i].getLinePrice();
        return total;
    }
    this.getProduct = function(id)
    {
        for(let i = 0 ; i <this.list.length ; i++)
            if (id == this.list[i].getProductId()) return i;
        return -1;
    }
    this.deleteProduct = function(id)
    {
        var index = this.getProduct(id);
        if (index > -1) this.list.splice(index, 1);
    }
}


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



let productData = JSON.parse(localStorage.getItem('productData'));

function getProductData(products) {
    if(productData !== null) {
        for (i=0; i<productData.length; i++) {
            let product = productData[i];
            var productId = product.id;
            var productColor = product.color;
            var productQty = product.quantity; 
    
            for (let i =0; i<products.length;i++) {
                var productName = products[i].name;
                var productPrice = products[i].price;
                var productImg = products[i].imageUrl;
                var productAltText = products[i].altTxt;
        
                if(products[i]._id == productId) {
                    displayCart(productId, productColor, productImg, productAltText, productName, productPrice, productQty);
                }
            }
        }      
    }
}

function displayCart (productId, productColor, productImg, productAltText, productName, productPrice, productQty){
    document.querySelector('#cart__items').innerHTML += 
    '<article class="cart__item" data-id="'+productId+'" data-color="'+productColor+'">'+
        '<div class="cart__item__img">'+
            '<img src="'+productImg+'" alt="'+productAltText+'">'+
            '</div>'+
                '<div class="cart__item__content">'+
                    '<div class="cart__item__content__description">'+
                        '<h2>'+productName+'</h2>'+
                        '<p>'+productColor+'</p>'+
                        '<p>'+productPrice+' €</p>'+
                    '</div>'+
                    '<div class="cart__item__content__settings">'+
                        '<div class="cart__item__content__settings__quantity">'+
                            '<p>Qté : </p>'+
                            '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="'+productQty+'">'+
                        '</div>'+
                    '<div class="cart__item__content__settings__delete">'+
                    '<p class="deleteItem">Supprimer</p>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</article>';
}