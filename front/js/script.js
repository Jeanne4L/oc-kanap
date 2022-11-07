//if exist, get products information in localStorage, else get its in API
let products = window.localStorage.getItem('products');

if (products !== null) {
    products = JSON.parse(products);
} else {
    const response = await fetch('http://localhost:3000/api/products');
    let products = await response.json();
    const productsData = JSON.stringify(products);
    window.localStorage.setItem('products', productsData);
}

//Looop through products, create HTML elements and display informations
for (let i = 0; i< products.length; i++) {
    console.log(products[i].name);

    let section = document.querySelector('#items');
    
    let a = document.createElement('a');
    a.setAttribute('href', './product.html?id='+products[i]._id);
    section.appendChild(a);

    let article = document.createElement('article');
    a.appendChild(article);

    let img = document.createElement('img');
    img.setAttribute('src', products[i].imageUrl);
    img.setAttribute('alt', products[i].altTxt)
    article.appendChild(img);

    let title = document.createElement('h3');
    title.setAttribute('class', products[i].productName);
    title.textContent = products[i].name;
    article.appendChild(title);

    let p = document.createElement('p');
    p.setAttribute('class', products[i].productDescription);
    p.textContent = products[i].description;
    article.appendChild(p);
}