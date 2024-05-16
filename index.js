const express = require('express');
const bodyParser = require("body-parser");
const { User, Product, Purchase } = require("./model/models");
const app = express();
const port = 3000;

app.use(bodyParser.json());
let users = [];
let products = [];
let purchases = [];

// Add default admin user
users.push(new User(1, "admin", "admin", "admin"));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
    res.send('Login Success!');
});

app.post('/register', (req, res) => {
    res.send('Register Success!');
});

app.post('/products/add', (req, res) => {
    res.send('Products Success!');
});

app.get('/products', (req, res) => {
    res.send('Products Success!');
});

app.post('/cart/add', (req, res) => {
    res.send('Cart Success!');
});

app.post('/buy', (req, res) => {
    res.send('Payment Success!');
});

app.get('/history', (req, res) => {
    res.send('History Success!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

