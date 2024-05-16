const express = require('express');
const session = require('express-session');
const exphbs = require("express-handlebars");
const path = require('path');
const routerApi = require('./routes');
const { logErrors, errorHandler } = require('./middleware/error.handler');

const app = express();

// Mddleware session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set Handlebars as the template engine
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Set the directory where the static files are located
app.use(express.static(path.join(__dirname, "public")));

routerApi(app);

app.use(logErrors);
app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
