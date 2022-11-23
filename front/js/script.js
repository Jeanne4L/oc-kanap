// GET request to API
async function fetchProducts() {
    const response = await fetch('http://localhost:3000/api/products')
    if(response.ok) {
        return response.json();
    }
    throw new Error('Impossible d\'accéder au serveur')
}

// display products
fetchProducts()
.then(function(products) {
    for (let i = 0; i< products.length; i++) {
        
        document.querySelector('#items').innerHTML += 
        '<a href="./product.html?id='+products[i]._id+'">' 
            +'<article>' +
                '<img src="'+products[i].imageUrl+'" alt="'+products[i].altTxt+'">' +
                '<h3 class="productName">'+products[i].name+'</h3>'+
                '<p class="productDescription">'+products[i].description+'</p>'+
            '</article>'+
        '</a>'
    }
})