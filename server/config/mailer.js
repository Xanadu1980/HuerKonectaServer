const nodemailer = require("nodemailer");

 // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // true for 465, false for other ports
	auth: {
	  user: 'joseeli12345@gmail.com', // generated ethereal user
	  pass: 'ttsqnsnxgsqrdziu', // generated ethereal password
	},
});

transporter.verify().then(() => {
	console.log('Email enviado satisfactoriamente');
}).catch(function (e) {
     console.log(e);
});

module.exports = transporter;