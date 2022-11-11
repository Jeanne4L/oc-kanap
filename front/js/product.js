//get id from url
let params = new URLSearchParams(document.location.search);
let id = params.get('id');

let qty;
let colorChoice;

// localStorage.clear()

//request to get information whose product corresponds to id
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

            document.querySelector('#description').textContent = products[i].description;

            //loop through choice of color
            let colors = products[i].colors;
            for(let c = 0; c < colors.length; c++) {
                colorChoice = document.querySelector('#colors');
                colorChoice.innerHTML += '<option value="'+products[i].colors[c]+'">'+products[i].colors[c]+'</option>';
            }

            //change price according to quantity
            let price = document.querySelector('#price');
            price.textContent = products[i].price;
            qty = document.querySelector('#quantity');
            qty.addEventListener('input', () => {
                if(qty.value !== 0) {
                    price.textContent = products[i].price * qty.value;
                } 
            })
        }
    }
    // event click => send ID, chosen color and quantity to the cart with localStorage
    let submitBtn = document.querySelector('#addToCart');
    submitBtn.addEventListener('click', () => {
        let productData = [];
        //if exists in LocalStorage => get it and push new data else create it
        productData = JSON.parse(localStorage.getItem('productData'));
 
        if(productData) {
            productData.push({
                id: id,
                color: colorChoice.value,
                quantity: qty.value
            });
            localStorage.setItem('productData', JSON.stringify(productData));
        } else {
            productData = [];
            productData.push({
                id: id,
                color: colorChoice.value,
                quantity: qty.value
            });
            localStorage.setItem('productData', JSON.stringify(productData));
        }
        console.log(productData); 
    })
})