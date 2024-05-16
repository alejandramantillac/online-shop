// users.router.js is used to define the routes for the users API

const express = require('express');
const router = express.Router();
const { User } = require('../model/models');

//  DB Users (Simulation)
let users = [];

// Register route
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

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(400).send('Usuario o contraseña incorrectos');
    }

    req.session.user = user;
    res.redirect('/products');
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
