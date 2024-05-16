const express = require('express');

const router = express.Router();

router.post('/products/add', (req, res) => {
    res.send('Products Success!');
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