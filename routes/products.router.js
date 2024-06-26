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
const QRCode = require('qrcode');

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
  return res.redirect('/products');
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
  return res.render('products', { "products": Product.products, admin: req.session.user.role === 'admin', bodyClass: 'products' });
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
router.get('/api', (req, res) => {
  return res.json(Product.products);
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
    var user = User.users.find(user => user.id === user_id);
    if (user && user.role === 'admin') {
      return res.status(403).send('Admin users cannot add products to the cart');
    }

    const cart = User.addToCart(product, quantity, user_id);
    return res.json(cart);
  } catch (error) {
    return res.status(500).send(error.message);
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
    const user = User.users.find(user => user.id === user_id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if(user.role === 'admin') {
      return res.status(403).send('Admin users cannot add products to the cart');
    }
    return res.json(user.cart);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * Route to remove products in the cart.
 *
 * @name GET /api/cart/remove
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.post('/api/cart/remove', (req, res) => {
  try {
    const { id, quantity } = req.body;
    const user_id = req.headers['authorization'];
    const product = Product.products.find(product => product.id === parseInt(id));

    if (!product) {
      return res.status(404).send('Product not found');
    }

    var user = User.users.find(user => user.id === user_id);
    if (user && user.role === 'admin') {
      return res.status(403).send('Admin users cannot modify the cart');
    }

    const productInCart = user.cart.find(item => item.product.id === parseInt(id));

    if (!productInCart || productInCart.quantity < quantity) {
      return res.status(400).send('Not enough items in the cart');
    }

    if (productInCart.quantity === quantity) {
      user.cart = user.cart.filter(item => item.product.id !== parseInt(id));
    } else {
      productInCart.quantity -= quantity;
    }

    return res.json(user.cart);
  } catch (error) {
    return res.status(500).send(error.message);
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
router.post('/api/buy', async (req, res) => {
  try {
    const user_id = req.headers['authorization'];
    const user = User.users.find(user => user.id === user_id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.role === 'admin') {
      return res.status(403).send('Admin users cannot buy products');
    }

    const totalAmount = user.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const purchaseId = Purchase.purchases.length + 1;
    const purchase = new Purchase(purchaseId, user.id, user.cart, totalAmount);

    // Generate qr code with relevant information
    const qrCodeData = `Purchase ID: ${purchase.id}\nClient: ${user.username}\nTotal Amount: $${totalAmount}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);

    purchase.qrCode = qrCode;

    user.cart.forEach(item => {
      const product = Product.products.find(p => p.id === item.product.id);
      product.reduceQuantity(item.quantity);
    });

    User.addPurchase(purchase, user_id);
    User.clearCart(user_id);

    return res.json(purchase);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * Route to view an invoice.
 *
 * @name GET /invoice/:id
 * @function
 * @memberof module:products.router
 * @inner
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
router.get('/invoice/:id', isAuth, (req, res) => {
  const user_id = req.session.user.id;
  const purchaseId = parseInt(req.params.id);
  const purchase = User.getPurchaseHistory(user_id).find(purchase => purchase.id === purchaseId);
  if (!purchase) {
    return res.status(404).send('Purchase not found');
  }
  return res.render('invoice', { purchase, user: req.session.user, bodyClass: 'invoice' });
});

router.get('/api/invoice/:id', (req, res) => {
  const user_id = req.headers['authorization'];
  const purchaseId = parseInt(req.params.id);
  const user = User.users.find((user) => user.id === user_id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.role === 'admin') {
    return res.status(403).send('Admin users cannot buy products');
  }

  if (user && user.role === 'admin') {
    return res.status(403).send('Admin users cannot view purchase history');
  }

  const purchase = User.getPurchaseHistory(user_id).find(purchase => purchase.id === purchaseId);

  if (!purchase) {
    return res.status(404).send('Purchase not found');
  }
  return res.json(purchase);
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
  let purchaseHistory = User.getPurchaseHistory(user_id);
  var user = User.users.find(user => user.id === user_id);
  if (user && user.role === 'admin') {
    return res.redirect('/products/admin');
  }

  // Add a purchase number to each purchase
  purchaseHistory = purchaseHistory.map((purchase, index) => {
    return {
      ...purchase,
      number: index + 1
    };
  });

  return res.render('history', { purchaseHistory, bodyClass: 'history' });
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
router.get('/api/history', (req, res) => {

  const user_id = req.headers['authorization'];
  const user = User.users.find((user) => user.id === user_id);

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.role === 'admin') {
    return res.status(403).send('Admin users cannot buy products');
  }

  let purchaseHistory = User.getPurchaseHistory(user_id);
  if (user && user.role === 'admin') {
    return res.status(403).send('Admin users cannot view purchase history');
  }

  // Add a purchase number to each purchase
  purchaseHistory = purchaseHistory.map((purchase, index) => {
    return {
      ...purchase,
      number: index + 1
    };
  });

  return res.json(purchaseHistory);
});

module.exports = router;
