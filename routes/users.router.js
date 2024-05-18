// User.users.router.js is used to define the routes for the User.users API

const express = require('express');
const router = express.Router();
const { User } = require('../model/models');


// Register route for clients only
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const existingUser = User.users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    }

    const newUser = new User(User.users.length + 1, username, password, 'cliente');
    User.users.push(newUser);
    req.session.user = newUser;

    res.cookie('user_id', req.session.user.id);
    res.redirect('/products');
});

// Login route for both admins and clients
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = User.authenticate(username, password);
    if (!user) {
        return res.status(400).send('Usuario o contraseña incorrectos');
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    res.cookie('user_id', req.session.user.id);
    return res.redirect('/products');
});

  // Route to get the login form
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) {
        res.cookie('user_id', req.session.user.id);
        res.redirect('/products');
    }
    res.render('login');
});

// Route to get the register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Route to logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.clearCookie('sid');
        res.clearCookie('user_id');
        res.redirect('/login');
    });
});

module.exports = router;
