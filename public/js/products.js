function getCookie(name) {
  const cookie = document.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith(name));
  return cookie ? cookie.split('=')[1] : null;
}

function addToCart(id, quantity = 1) {
  fetch('/products/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id, quantity, user_id: getCookie('user_id')})
  })
    .then(res => res.json())
    .then(cart => {
      //Add the functionality to update the cart in the frontend
      console.log(cart);
    });
}
