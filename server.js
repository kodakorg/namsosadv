const express = require('express');
const app = express();
const port = 3000

var morgan = require('morgan')
var favicon = require('serve-favicon');
var path = require("path");
require('dotenv').config()

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('combined'));
app.set('trust proxy', 1)

app.get('/', function (req, res) {
  res.render('pages/hovedside');
});

app.get('/omoss', function (req, res) {
  res.render('pages/omoss');
});

app.get('/finansiering', function (req, res) {
  res.render('pages/finansiering');
});

app.get('/forsikring', function (req, res) {
  res.render('pages/forsikring');
});

app.get('/kontakt', function (req, res) {
  res.render('pages/kontakt', { sjekk: false });
});

app.get('/kart', function (req, res) {
  res.render('pages/kart', { sjekk: false });
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})