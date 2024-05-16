const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
    res.send('Login Success!');
});

router.post('/register', (req, res) => {
    res.send('Register Success!');
});

module.exports = router;