const express = require('express');
const app = express();
const port = 3333
const nodemailer = require('nodemailer');
const http = require("http");
const request = require('request');

var morgan = require('morgan')
var favicon = require('serve-favicon');
var path = require("path");
require('dotenv').config()

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('combined'));

app.set('view engine', 'ejs');
app.set('trust proxy', 1);

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

app.get('/kompetanse', function (req, res) {
  res.render('pages/kompetanse');
});

app.get('/omoss', function (req, res) {
  res.render('pages/omoss');
});

app.get('/priser', function (req, res) {
  res.render('pages/priser');
});

app.get('/forsikring', function (req, res) {
  res.render('pages/forsikring');
});

app.get('/kontakt', function (req, res) {
  res.render('pages/kontakt', {
    sjekk: false,
    message: null
  })
});

app.get('/kontaktskjema', function (req, res) {
  res.render('pages/kontaktskjema', {
    sjekk: false,
    message: null
  })
});

app.post('/skjema', function (req, res) {
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    console.log("Error! -> body: ");
    console.dir(body);
    res.render('pages/tilbakemelding', {
      sjekk: false,
      message: "Something went wrong"
    })
  }

  let navn = req.body.navn;
  let bosted = req.body.bosted;
  let epost = req.body.epost;
  let tlf = req.body.tlf;
  let tekst = req.body.tekst;
  let epostkopi = req.body['epostkopi'];
  let html_string = "";
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL, function (error, response, body) {
    body = JSON.parse(body);

    console.log("body: ");
    console.dir(body);

    if (body.success !== undefined && !body.success) {
      res.render('pages/tilbakemelding', {
        sjekk: false,
        message: "Failed captcha verification: " + body.score
      })
    }
    html_string += "Navn: " + navn + "<br><br>";
    html_string += "Bosted: " + bosted + "<br><br>";
    html_string += "Epost: " + epost + "<br>";
    html_string += "Telefonnummer: " + tlf + "<br><br>";
    html_string += "Forespørsel: " + tekst;

    if (typeof navn === 'undefined' || navn === null || navn === '') {
      res.render('pages/tilbakemelding', {
        sjekk: false,
        message: "Fornavn mangler eller er tom"
      })
    } else if (typeof bosted === 'undefined' || bosted === null || bosted === '') {
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
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
