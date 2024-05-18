function getCookie(name) {
  const cookie = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith(name));
  return cookie ? cookie.split('=')[1] : null;
}

function addToCart(id, quantity = 1) {
  fetch('/products/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getCookie('user_id'),
    },
    body: JSON.stringify({ id: id, quantity }),
  })
    .then((res) => res.json())
    .then((cart) => {
      document.getElementById('cart-count').textContent = cart.length;
      loadCart();
    });
}

/*
functions for this html:
<div class="cart">
        <button class="cart-button" onclick="toggleCart()">
          <i class="fas fa-shopping-cart"></i>
          <span id="cart-count">0</span>
        </button>
        <div class="cart-content">
          <h3>Carrito de Compras</h3>
          <ul id="cart-list">
          </ul>
          <h3>Total: $<span id="cart-total">0.00</span></h3>
          <button class="checkout-button" onclick="checkout()">Pagar</button>
        </div>
      </div>

*/

function toggleCart() {
  const cart = document.querySelector('.cart-content');
  if (cart.style.display === 'block') {
    cart.style.display = 'none';
  } else {
    cart.style.display = 'block';
    loadCart();
  }
}

function checkout() {
  fetch('/products/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getCookie('user_id'),
    },
  })
    .then((res) => res.text())
    .then((invoiceHtml) => {
      document.body.innerHTML = invoiceHtml;
    });
}

function loadCart() {
  fetch('/products/api/cart',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization':  getCookie('user_id')
    }
  })
    .then(res => res.json())
    .then(products => {
      const cartList = document.getElementById('cart-list');
      const cartTotal = document.getElementById('cart-total');
      let total = 0;
      cartList.innerHTML = '';
      products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.product.name} x ${product.quantity}`;
        cartList.appendChild(li);
        total += product.product.price * product.quantity;
      });
      cartTotal.textContent = total.toFixed(2);
    });
}

// Function to navigate to purchase history page
function viewPurchaseHistory() {
  window.location.href = '/products/history';
}

function logout(){
  fetch('/users/logout', {
    method: 'POST',
  })
    .then(() => {
      // Redirige al usuario a la página de inicio de sesión después de que la sesión se haya cerrado
      window.location.href = '/users/login';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
