let params = new URLSearchParams(document.location.search);
let id = params.get('id');
console.log(id);

fetch('http://localhost:3000/api/products')
.then(function(response) {
    if(response.ok) {
        return response.json();
    }
})
.then(function(products) {
    for (let i =0; i<products.length;i++) {
        if(products[i]._id === id) {
            document.querySelector('.item__img').innerHTML += '<img src="'+products[i].imageUrl+'" alt="'+products[i].altTxt+'">';

            document.querySelector('#title').textContent = products[i].name;

            var price = document.querySelector('#price');
            price.textContent = products[i].price;

            document.querySelector('#description').textContent = products[i].description;
        }
    }
})