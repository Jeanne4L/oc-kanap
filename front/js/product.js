let params = new URLSearchParams(document.location.search);
let id = params.get('id');

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

            //change price according to quantity
            let price = document.querySelector('#price');
            price.textContent = products[i].price;
            let qty = document.querySelector('#quantity');
            qty.addEventListener('input', () => {
                if(qty.value !== 0) {
                    price.textContent = products[i].price * qty.value;
                } 
            })

            document.querySelector('#description').textContent = products[i].description;

            let colors = products[i].colors;
            for(let c = 0; c < colors.length; c++) {
                document.querySelector('#colors').innerHTML += '<option value="'+products[i].colors[c]+'">'+products[i].colors[c]+'</option>';
            }
        }
    }
})