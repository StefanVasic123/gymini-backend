var nodemailer = require('nodemailer');

function mailService(client, password) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vasicstefan123@gmail.com',
      pass: 'jpjtgsnncdlziuap',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: 'vasicstefan123@gmail.com',
    to: client,
    subject: 'GYMINI Password',
    text: `Your current generic password for logging in to GYMINI app is: ${password}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Mail Service error: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = mailService;
