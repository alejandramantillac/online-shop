/**
 * @file products.router.js is used to define the routes for the products API.
 * @module products.router
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { Product, User, Purchase } = require('../model/models');

/**
 * Multer disk storage configuration.
 *
 * @type {multer.diskStorage}
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/**
 * Route for the admin panel (only for admin users).
 *
 * @name GET /admin
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/admin', isAuth, (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }
  res.render('admin', { bodyClass: 'admin' });
});

/**
 * Route to add a new product (only for admin users).
 *
 * @name POST /admin/add
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/admin/add', isAuth, upload.single('image'), (req, res) => {
  if (req.session.user.role !== 'admin') {
      return res.status(403).send('Acceso denegado');
  }

  const { name, description, price, quantity } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  /**
   * Represents a new product.
   * @typedef {Object} NewProduct
   * @property {number} id - The unique identifier of the product.
   * @property {string} name - The name of the product.
   * @property {string} description - The description of the product.
   * @property {number} price - The price of the product.
   * @property {number} quantity - The quantity of the product.
   * @property {string} imageUrl - The URL of the product image.
   */
  const newProduct = new Product(Product.products.length + 1, name, description, price, quantity, imageUrl);
  Product.products.push(newProduct);
  res.redirect('/products');
});

/**
 * Route to get all products.
 *
 * @name GET /
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('', isAuth, (req, res) => {
  res.render('products', { "products": Product.products, admin: req.session.user.role === 'admin', bodyClass: 'products' });
});

/**
 * Route to get a JSON with all products.
 *
 * @name GET /api/get
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/api/get', (req, res) => {
  res.json(Product.products);
});

/**
 * Route to add a product to the cart.
 *
 * @name POST /api/cart/add
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/api/cart/add', (req, res) => {
  try {
    const { id, quantity } = req.body;
    const user_id = req.headers['authorization'];
    const product = Product.products.find(product => product.id === parseInt(id));

    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (product.quantity < quantity) {
      return res.status(400).send('Not enough stock');
    }
    var user = User.users.find(user => user.id === parseInt(user_id));
    if (user && user.role === 'admin') {
      return res.status(403).send('Admin users cannot add products to the cart');
    }

    const cart = User.addToCart(product, quantity, user_id);
    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to get all products in the cart.
 *
 * @name GET /api/cart
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/api/cart', (req, res) => {
  try {
    const user_id = req.headers['authorization'];
    const user = User.users.find(user => user.id === parseInt(user_id));
    if (!user) {
      return res.status(404).send('User not found');
    }
    if(user.role === 'admin') {
      return res.status(403).send('Admin users cannot add products to the cart');
    }
    res.json(user.cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to buy products in the cart.
 *
 * @name POST /buy
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/buy', (req, res) => {
  try {
    const user_id = req.headers['authorization'];
    const user = User.users.find(user => user.id === parseInt(user_id));

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.role === 'admin') {
      return res.status(403).send('Admin users cannot buy products');
    }

    const totalAmount = user.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const purchase = new Purchase(Purchase.purchases.length + 1, user.id, user.cart, totalAmount);

    user.cart.forEach(item => {
      const product = Product.products.find(p => p.id === item.product.id);
      product.reduceQuantity(item.quantity);
    });

    User.addPurchase(purchase, user_id);
    User.clearCart(user_id);

    res.render('invoice', { purchase, user, bodyClass: 'invoice' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Route to view purchase history.
 *
 * @name GET /history
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/history', isAuth, (req, res) => {
  const user_id = req.session.user.id;
  const purchaseHistory = User.getPurchaseHistory(user_id);
  var user = User.users.find(user => user.id === parseInt(user_id));
  if (user && user.role === 'admin') {
    return res.redirect('/products/admin');
  }
  res.render('history', { purchaseHistory, bodyClass: 'history' });
});

/**
 * Route to get purchase history in JSON format.
 *
 * @name GET /api/history
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('api/history', isAuth, (req, res) => {
  const user_id = req.session.user.id;
  const purchaseHistory = User.getPurchaseHistory(user_id);
  res.json(purchaseHistory);
});

module.exports = router;
