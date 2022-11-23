// get id from url and display it
let productIdParams = new URLSearchParams(document.location.search);
let id = productIdParams.get('id');

document.querySelector('#orderId').textContent = id

// clear localStorage
localStorage.clear();