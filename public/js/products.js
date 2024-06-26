/**
 * Retrieves the value of a cookie by its name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The value of the cookie, or null if the cookie doesn't exist.
 */
function getCookie(name) {
  const cookie = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith(name));
  return cookie ? cookie.split('=')[1] : null;
}

/**
 * Adds a product to the cart.
 * @param {string} id - The ID of the product to add.
 * @param {number} [quantity=1] - The quantity of the product to add (default is 1).
 */
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

function removeFromCart(id, quantity = 1) {
  fetch('/products/api/cart/remove', {
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

/**
 * Toggles the visibility of the cart content and loads the cart if it's displayed.
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

/**
 * Performs the checkout process by sending a POST request to '/products/api/buy' endpoint
 * and updates the document body with the received invoice HTML.
 */
function checkout() {
  fetch('/products/api/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getCookie('user_id'),
    },
  })
    .then((res) => res.json())
    .then((purchase) => {
      console.log(purchase);
      if(purchase['id'] !== undefined) {
        window.location.href = '/products/invoice/' + purchase['id'];
        return;
      }
      if(purchase['message']) {
        alert(purchase['message']);
      }
    });
}

/**
 * Loads the user's cart by making a GET request to the '/products/api/cart' endpoint.
 * Updates the cart list and total on the page.
 */
function loadCart() {
  fetch('/products/api/cart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getCookie('user_id')
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
        li.innerHTML = `
          ${product.product.name} x ${product.quantity}
          <button onclick="removeFromCart(${product.product.id})">-</button>
          <button onclick="addToCart(${product.product.id})">+</button>
        `;
        cartList.appendChild(li);
        total += product.product.price * product.quantity;
      });
      cartTotal.textContent = total.toFixed(2);
    });
}

/**
 * Redirects the user to the purchase history page.
 */
function viewPurchaseHistory() {
  window.location.href = '/products/history';
}

/**
 * Logs out the user by sending a POST request to the server and redirecting to the login page.
 */
function logout(){
  fetch('/users/logout', {
    method: 'POST',
  })
    .then(() => {
      window.location.href = '/users/login';
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
  /**
   * Represents a collection of purchase date elements.
   * @type {NodeList}
   */
  const dateElements = document.querySelectorAll('.purchase-date');
  dateElements.forEach(function(element) {
    const date = new Date(element.textContent);
    element.textContent = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  });
});
