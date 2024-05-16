// products.router.js is used to define the routes for the products API

const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { Product } = require('../model/models');

// DB Products (Simulation)
let products = [];

// Route to add a new product (only for admin users)
router.post('/add', isAuth, (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }

  const { name, description, price, quantity } = req.body;
  const newProduct = new Product(products.length + 1, name, description, price, quantity);
  products.push(newProduct);
  res.send('Producto agregado con éxito');
});

// Route to get all products
router.get('/', (req, res) => {
  res.json(products);
});

router.get('/products', (req, res) => {
    res.send('Products Success!');
});

router.post('/cart/add', (req, res) => {
    res.send('Cart Success!');
});

router.post('/buy', (req, res) => {
    res.send('Payment Success!');
});

router.get('/history', (req, res) => {
    res.send('History Success!');
});

module.exports = router;
