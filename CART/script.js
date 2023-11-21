const api='https://fakestoreapi.com/products'
var data;    
let container=document.getElementById('container')  

let cartItems=[]

function addToCartHandler(productId) {

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const selectedProduct = data.find(product => product.id === productId);

    if (selectedProduct) {
        cartItems.push(selectedProduct);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert(`Added to Cart: ${selectedProduct.title}`);
    }
  }

  function removeToCart(productId){
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cartItems)
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === productId) {
            localStorage.removeItem(cartItems[[i]])
        }
    }

    const selectedProductIndex = cartItems.findIndex(product => product.id === productId);
    // console.log(selectedProductIndex)
    if (selectedProductIndex !== -1) {
        let arr= cartItems.filter((ele)=>{
            if(ele.id!=productId) return ele;
        })
        localStorage.setItem('cart', JSON.stringify(arr)); 
        alert(`Removed from Cart`);
    }
  }


  
async function getapi(url) {
    const response = await fetch(url);
    data = await response.json();
    console.log(data)
    
    data.map((ele)=>{
    let cardDiv=document.createElement('div');
    cardDiv.classList.add('card')
    let img=document.createElement('img')
    img.classList.add("card-img-top")
    img.src=ele.image
    cardDiv.appendChild(img);
    
    let textDiv=document.createElement('div');
    textDiv.classList.add("card-body");
    let htag=document.createElement('h5');
    htag.classList.add("card-title")
    htag.textContent=ele.title;
    let ptag=document.createElement('h6');
    ptag.classList.add("card-text")
    ptag.textContent=   `$ ${ele.price}`;

    textDiv.appendChild(htag)
    textDiv.appendChild(ptag)
    cardDiv.appendChild(textDiv)

    let knowMore=document.createElement('a')
    knowMore.textContent="know more"
    knowMore.classList.add("knowMore")
    cardDiv.appendChild(knowMore)

    let btnDiv=document.createElement('div');
    btnDiv.classList.add("btnDiv")
    let cart=document.createElement('button');
    cart.classList.add("cart")
    cart.classList.add("button")
    cart.textContent="Add to Cart";
    btnDiv.appendChild(cart)
    cardDiv.appendChild(btnDiv)
    container.appendChild(cardDiv)

    cart.addEventListener('click', () => {
        cart.textContent=="Add to Cart" ? cart.textContent="Remove" : cart.textContent="Add to Cart"
        cart.textContent=="Remove" ? addToCartHandler(ele.id) : removeToCart(ele.id)
    });
  
})
}
getapi(api);