/* get cart total from session on load */
updateCartTotal();

/* button event listeners */
document.getElementById("emptycart").addEventListener("click", emptyCart);
var btns = document.getElementsByClassName('addtocart');
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('touchstart', function() {addToCart(this);});
    btns[i].addEventListener('click', function() {addToCart(this);});
}

function toWhatsAppMarkdown(text) {
    let result = text
      .replace(/_/g, "\\_") // escape underscores
      .replace(/\*/g, "\\*") // escape asterisks
      .replace(/~/g, "\\~") // escape tildes
      .replace(/`/g, "\\`") // escape backticks
      .replace(/\|/g, "\\|") // escape pipes
      .replace(/\n/g, "%0A"); // replace newlines with %0A
    return result;
  }
  

  
  let btnCheckout = document.getElementById("checkout");
  btnCheckout.addEventListener("click", function() {
    let mensaje = "*Muscle Factory Online Store - Lista de Productos*";
        mensaje +=  replaceTags(document.getElementById("carttable").innerHTML);
        mensaje +=   "\nCANTIDAD:"+ document.getElementById("itemsquantity").innerHTML;
        mensaje +=  "/TOTAL:"+document.getElementById("total").innerHTML;
        mensaje +=  "\nEntrega Gratis 24/48 horas";
    let mensajeMarkdown = toWhatsAppMarkdown(mensaje);
    let url = "https://wa.me/+50670764648?text=" + encodeURIComponent(mensajeMarkdown);
    window.open(url, "_blank");
  });
  
  function replaceTags(str) {
    return str.replace(/<tr>/g, '\n').replace(/<td>/g, '-').replace(/<\/tr>|<\/td>/g, '');
  }
/* ADD TO CART functions */

function addToCart(elem) {
    //init
    var sibs = [];
    var getprice;
    var getproductName;
    var cart = [];
     var stringCart;
    //cycles siblings for product info near the add button
    if(elem){
        getprice =    elem.parentNode.parentNode.parentElement.parentNode.parentElement.getElementsByClassName("price")[0].getInnerHTML();
        getproductName = elem.parentNode.parentNode.parentElement.parentNode.parentElement.getElementsByClassName("productname")[0].getInnerHTML();
    }
    //create product object
    var product = {
        productname : getproductName,
        price : getprice
    };
    //convert product data to JSON for storage
    var stringProduct = JSON.stringify(product);
    /*send product data to session storage */
    
    if(!sessionStorage.getItem('cart')){
        //append product JSON object to cart array
        cart.push(stringProduct);
        //cart to JSON
        stringCart = JSON.stringify(cart);
        //create session storage cart item
        sessionStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCartTotal();
    }
    else {
        //get existing cart data from storage and convert back into array
       cart = JSON.parse(sessionStorage.getItem('cart'));
        //append new product JSON object
        cart.push(stringProduct);
        //cart back to JSON
        stringCart = JSON.stringify(cart);
        //overwrite cart data in sessionstorage 
        sessionStorage.setItem('cart', stringCart);
        addedToCart(getproductName);
        updateCartTotal();
    }
}

function toWhatsAppMarkdown(text) {
    // Negrita
    text = text.replace(/\*\*([^*]+)\*\*/g, (_, p1) => {
      return '*' + p1.trim() + '*';
    });
  
    // Cursiva
    text = text.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, (_, p1, p2, p3) => {
      return p1 + '*' + p2.trim() + '*' + p3;
    });
  
    // Tachado
    text = text.replace(/~~([^~]+)~~/g, (_, p1) => {
      return '~' + p1.trim() + '~';
    });
  
    // Enlaces
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, p1, p2) => {
      return p1.trim() + ' (' + p2.trim() + ')';
    });
  
    // Imágenes
    text = text.replace(/!\[([^\]]+)\]\(([^\)]+)\)/g, (_, p1, p2) => {
      return '[Imagen: ' + p1.trim() + '](' + p2.trim() + ')';
    });
  
    // Listas
    text = text.replace(/^- (.*)$/gm, (_, p1) => {
      return '• ' + p1.trim() + '\n';
    });
  
    // Retornar texto convertido a Markdown
    return text;
  }

  
  
/* Calculate Cart Total */
function updateCartTotal(){
    //init
    var total = 0;
    var price = 0;
    var items = 0;
    var productname = "";
    var carttable = "";
    if(sessionStorage.getItem('cart')) {
        //get cart data & parse to array
        var cart = JSON.parse(sessionStorage.getItem('cart'));
        //get no of items in cart 
        items = cart.length;
        //loop over cart array
        for (var i = 0; i < items; i++){
            //convert each JSON product in array back into object
            var x = JSON.parse(cart[i]);
            //get property value of price
            if(!x.price){

                break;
            }
            price = x.price;
            productname = x.productname;
            //add price to total
            carttable += "<tr><td>" + productname + "</td><td>" + price + "</td></tr>";
            total = parseInt(price) +parseInt(total);
        }
        
    }
    //update total on website HTML
    document.getElementById("total").innerHTML = total;
    //insert saved products to cart table
    document.getElementById("carttable").innerHTML = carttable;
    //update items in cart on website HTML
    document.getElementById("itemsquantity").innerHTML = items;
}
//user feedback on successful add
function addedToCart(pname) {
  var message = pname + " was added to the cart";
  var alerts = document.getElementById("alerts");
  alerts.innerHTML = message;
  if(!alerts.classList.contains("message")){
     alerts.classList.add("message");
  }
}
/* User Manually empty cart */
function emptyCart() {
    //remove cart session storage object & refresh cart totals
    if(sessionStorage.getItem('cart')){
        sessionStorage.removeItem('cart');
        updateCartTotal();
      //clear message and remove class style
      var alerts = document.getElementById("alerts");
      alerts.innerHTML = "";
      if(alerts.classList.contains("message")){
          alerts.classList.remove("message");
      }
    }
}