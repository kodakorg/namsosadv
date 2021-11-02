const express = require('express');
const app = express();
const port = 3000
const nodemailer = require('nodemailer');

var morgan = require('morgan')
var favicon = require('serve-favicon');
var path = require("path");
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('combined'));

app.set('view engine', 'ejs');
app.set('trust proxy', 1)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  },
});

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
  res.render('pages/kontakt');
});

app.get('/kontaktskjema', function (req, res) {
  res.render('pages/kontaktskjema');
});

app.get('/kart', function (req, res) {
  res.render('pages/kart');
});

app.post('/kontaktskjema', function (req, res) {
  var fnavn = req.body.fnavn;
  var enavn = req.body.enavn;
  var epost = req.body.epost;
  var tlf = req.body.tlf;
  var tekst = req.body.tekst;
  var html_string = "";

  html_string += "Fornavn: " + fnavn + "<br>";
  html_string += "Etternavn: " + enavn + "<br><br>";
  html_string += "Epost: " + epost + "<br>";
  html_string += "Telefonnummer: " + tlf + "<br><br>";
  html_string += "Forespørsel: " + tekst;

  if (typeof fnavn === 'undefined' || fnavn === null || fnavn === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Fornavn mangler eller er tom"
    })
  } else if (typeof enavn === 'undefined' || enavn === null || enavn === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Etternavn mangler eller er tom"
    })
  } else if (typeof epost === 'undefined' || epost === null || epost === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Epost mangler eller er tom"
    })
  } else if (typeof tlf === 'undefined' || tlf === null || tlf === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Telefonnummer mangler eller er tom"
    })
  } else if (typeof tekst === 'undefined' || tekst === null || tekst === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Forespørsel mangler eller er tom"
    })
  } else {
    const mailOptions = {
      from: "Kontaktskjema <namsosadv@gmail.com>",
      to: "ole.hustad@gmail.com",
      subject: "Kontaktskjema Namsosadvokatene",
      text: html_string,
      html: "<b>" + html_string + "</b>",
    }

    transporter.sendMail(mailOptions, function (err, result) {
      if (err) {
        res.render('pages/tilbakemelding', {
          sjekk: false,
          message: err
        })
      } else {
        transporter.close();
        res.render('pages/tilbakemelding', { sjekk: true })
      }
    })
  }
});

setInterval(function () {
  http.get("http://namsosadvokatene.no/");
}, 1200000);

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
