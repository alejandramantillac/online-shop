const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
    res.send('Login Success!');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', (req, res) => {
    res.send('Register Success!');
});

module.exports = router;