// users.router.js is used to define the routes for the users API

const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
    res.send('Login Success!');
});

router.post('/register', (req, res) => {
    res.send('Register Success!');
});

module.exports = router;