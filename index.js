const path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  mailgun = require('mailgun.js'),
  mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-'}),
  app = express(),
  staticPath = path.join(__dirname, '/public');

// Para mandar mails hay que hacerse una cuenta en https://app.mailgun.com/
// Para correr la aplicacion primero hay que setear las variables de entorno:
// export MAILGUN_API_KEY=key
// export MAILGUN_DOMAIN=domain
// export MAILGUN_MAIL=mail
// Luego lo corremos con npm start

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(staticPath));

app.post("/send-mail", (req, res) => {
  mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `${req.body.name} <${req.body.email}>`,
    to: [process.env.MAILGUN_MAIL],
    subject: "Consulta para sistelab",
    text: req.body.message,
    html: req.body.message
  })
  .then(msg => res.redirect("/"))
  .catch(err => console.log(err)); // logs any error
});

app.listen(3000, function() {
  console.log('listening on 3000');
});