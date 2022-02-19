const express = require('express');
const app = express();
const port = 3000
const nodemailer = require('nodemailer');
const http = require("http");

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

function validateEmail(email) {
  const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}

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
  } else if (!validateEmail(epost)) {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Epost er feil formatert"
    })
  } else if (typeof tlf === 'undefined' || tlf === null || tlf === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Telefonnummer mangler"
    })
  } else if (typeof tekst === 'undefined' || tekst === null || tekst === '') {
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Forespørsel er tom"
    })
  } else {
    const mailOptions = {
      from: 'namsosadv@gmail.com',
      to: "br@namsosadvokatene.no",
      replyTo: epost,
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

////////////////
// REDESIGN 1 //
////////////////
app.get('/redesign1', function (req, res) {
  res.render('redesign1/pages/hovedside');
});

app.get('/redesign1/kompetanse', function (req, res) {
  res.render('redesign1/pages/kompetanse');
});

app.get('/redesign1/omoss', function (req, res) {
  res.render('redesign1/pages/omoss');
});

app.get('/redesign1/priser', function (req, res) {
  res.render('redesign1/pages/priser');
});

app.get('/redesign1/forsikring', function (req, res) {
  res.render('redesign1/pages/forsikring');
});

app.get('/redesign1/kontakt', function (req, res) {
  res.render('redesign1/pages/kontakt', {
    sjekk: false,
    message: null
  })
});

app.get('/redesign1/kontaktskjema', function (req, res) {
  res.render('redesign1/pages/kontaktskjema', {
    sjekk: false,
    message: null
  })
});

app.post('/redesign1/skjema', function (req, res) {
  var navn = req.body.navn;
  var bosted = req.body.bosted;
  var epost = req.body.epost;
  var tlf = req.body.tlf;
  var tekst = req.body.tekst;
  var epostkopi = req.body['epostkopi'];
  var html_string = "";

  html_string += "Navn: " + navn + "<br><br>";
  html_string += "Bosted: " + bosted + "<br><br>";
  html_string += "Epost: " + epost + "<br>";
  html_string += "Telefonnummer: " + tlf + "<br><br>";
  html_string += "Forespørsel: " + tekst;

  if (typeof navn === 'undefined' || navn === null || navn === '') {
    res.render('redesign1/pages/tilbakemelding', {
      sjekk: false,
      message: "Fornavn mangler eller er tom"
    })
  } else if (typeof bosted === 'undefined' || bosted === null || bosted === '') {
    res.render('redesign1/pages/tilbakemelding', {
      sjekk: false,
      message: "Etternavn mangler eller er tom"
    })
  } else if (!validateEmail(epost)) {
    res.render('redesign1/pages/tilbakemelding', {
      sjekk: false,
      message: "Epost er feil formatert"
    })
  } else if (typeof tlf === 'undefined' || tlf === null || tlf === '') {
    res.render('redesign1/pages/tilbakemelding', {
      sjekk: false,
      message: "Telefonnummer mangler"
    })
  } else if (typeof tekst === 'undefined' || tekst === null || tekst === '') {
    res.render('redesign1/pages/tilbakemelding', {
      sjekk: false,
      message: "Forespørsel er tom"
    })
  } else {
    console.log("epostkopi: " + epostkopi);
    const mailOptions = {
      from: '"namsos advokat" <namsosadv@gmail.com>',
      to: "br@namsosadvokatene.no",
      replyTo: epost,
      subject: "Kontaktskjema Namsosadvokatene",
      text: html_string,
      html: "<b>" + html_string + "</b>",
    }

    if (epostkopi) {
      mailOptions.cc = epost;
    }

    transporter.sendMail(mailOptions, function (err, result) {
      if (err) {
        res.render('redesign1/pages/tilbakemelding', {
          sjekk: false,
          message: err
        })
      } else {
        transporter.close();
        res.render('redesign1/pages/tilbakemelding', { sjekk: true })
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
