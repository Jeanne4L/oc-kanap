//request to get products information and if exist, display its
fetch('http://localhost:3000/api/products')
.then(function(response) {
    if(response.ok) {
        return response.json();
    }
})
.then(function(products){
    for (let i = 0; i< products.length; i++) {
        
        document.querySelector('#items').innerHTML += 
        '<a href="./product.html?id='+products[i]._id+'">' 
            +'<article>' +
                '<img src="'+products[i].imageUrl+'" alt="'+products[i].altTxt+'">' +
                '<h3 class="productName">'+products[i].name+'</h3>'+
                '<p class="productDescription">'+products[i].description+'</p>'+
            '</article>'+
        '</a>';
    }
})
.catch(function (erreur) {
    erreur = alert('Erreur');
})