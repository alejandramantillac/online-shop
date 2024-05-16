// users.router.js is used to define the routes for the users API

const express = require('express');
const router = express.Router();
const { User } = require('../model/models');

// DB Users (Simulation)
let users = [];

// Predefined admin user
const adminUser = new User(1, 'admin', 'admin', 'admin');
users.push(adminUser);

// Register route for clients only
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    }

    const newUser = new User(users.length + 1, username, password, 'cliente');
    users.push(newUser);
    req.session.user = newUser;
    res.redirect('/api/v1/products');
});

// Login route for both admins and clients
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = User.authenticate(username, password, users);
    if (!user) {
        return res.status(400).send('Usuario o contraseña incorrectos');
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    if (user.role === 'admin') {
        return res.redirect('/api/v1/products');
    }

    res.redirect('/api/v1/products');
});

// Route to get the login form
router.get('/login', (req, res) => {
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
        res.redirect('/login');
    });
});

module.exports = router;
