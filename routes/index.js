// index.js is the entry point for the routes folder. It will be responsible for defining the routes for the API.
const express = require('express');

const productsRouter = require('./products.router');
const usersRouter = require('./users.router');

/**
 * Sets up the API routes for the application.
 * @param {Object} app - The Express application object.
 */
function routerApi(app) {
    const router = express.Router();
    router.get('/', (req, res) => { res.redirect('/users/login'); });
    app.use('', router);
    router.use('/products', productsRouter);
    router.use('/users', usersRouter);
}

module.exports = routerApi;
