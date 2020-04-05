const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const rootDir = require('./utils/path')
const db = require('./utils/database');

const app = express();

// to set pug as view engine globally for application
app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminRoutes);
app.use(shopRoutes);

//404 error route
app.use(errorController.get404)

app.listen(3000);
