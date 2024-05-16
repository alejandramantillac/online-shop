// index.js

const express = require('express');
const routterApi = require('./routes');
const exphbs = require("express-handlebars");
const path = require("path");

const routerApi = require('./routes');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});


routerApi(app);

// Set Handlebars as the template engine
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Set the directory where the static files are located
app.use(express.static(path.join(__dirname, "public")));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


