// products.router.js is used to define the routes for the products API

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { Product } = require('../model/models');

// DB Products (Simulation)
let products = [];

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
router.post('/add', isAuth, upload.single('image'), (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }

  const { name, description, price, quantity } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  const newProduct = new Product(products.length + 1, name, description, price, quantity, imageUrl);
  products.push(newProduct);
  res.redirect('/products');
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
