var nodemailer = require('nodemailer');

function sendClientPassword(client, password) {
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

function sendResetPasswordLink(client, link) {
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
    subject: 'GYMINI Reset Password',
    text: `For reset password go to following link and enter new password for your GYMINI account: ${link}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Mail Service error: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendClientPassword, sendResetPasswordLink };
