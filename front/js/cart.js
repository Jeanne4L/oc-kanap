let productData = [JSON.parse(localStorage.getItem('productData'))];

if(productData !== null) {
    console.log(productData);
} else {
    console.log('Hey non')
}
 