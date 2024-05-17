// products.router.js is used to define the routes for the products API

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { Product, User, Purchase } = require('../model/models');

// Multer configuration to upload files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route admin panel (only for admin users)
router.get('/admin', isAuth, (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }
  res.render('admin');
});

// Route to add a new product (only for admin users)
router.post('/admin/add', isAuth, upload.single('image'), (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }

  const { name, description, price, quantity } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  const newProduct = new Product(Product.products.length + 1, name, description, price, quantity, imageUrl);
  Product.products.push(newProduct);
  res.redirect('/products');
});

// Route to get all products
router.get('', isAuth, (req, res) => {

  res.render('products', { "products":Product.products });
});

router.get('/api/get', (req, res) => {
  res.json(Product.products);
});

router.post('/cart/add', (req, res) => {

  const { id, quantity, user_id } = req.body;
  const product = Product.products.find(product => product.id === parseInt(id));
  if (!product) {
      return res.status(404).send('Product not found');
  }

  if (product.quantity < quantity) {
      return res.status(400).send('Not enough stock');
  }
  return res.json(User.addToCart(product, quantity, user_id));
});

router.post('/buy', (req, res) => {
    res.send('Payment Success!');
});

router.get('/history', (req, res) => {
    res.send('History Success!');
});

module.exports = router;
