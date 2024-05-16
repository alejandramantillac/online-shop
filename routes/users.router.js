// users.router.js is used to define the routes for the users API

const express = require('express');
const router = express.Router();
const { User } = require('../model/models');
const { ReturnDocument } = require('mongodb');

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
    res.redirect('/products');
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

    return res.redirect('/users/login');
});

// Route to get the login form
router.get('/login', (req, res) => {
    if (req.session.isLoggedIn) {
        if (req.session.user.role === 'admin') {
          return res.redirect('/products/admin');
        }

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
        res.redirect('/login');
    });
});

module.exports = router;
