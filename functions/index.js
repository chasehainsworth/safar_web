require('babel-register')({
  presets: ['es2015']
})
const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const firestore = admin.firestore();
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.requestAccount = functions.https.onCall((data, context) => {
  const name = data.name;
  const email = data.email;
  const camp = data.camp;
  let adminEmail;

  firestore
    .collection('users')
    .where('role', '==', 'ADMIN')
    .where('camp', '==', camp)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc);
        adminEmail = doc.data().email;
      })
      const mailOptions = {
        from: '"Safar" <noreply@safarapp.org>',
        to: adminEmail,
        subject: 'Account Requested',
        text: `Organization ${name} with email ${email} has requested an account`
      };
    
      mailTransport.sendMail(mailOptions)
        .then(() => {
          console.log(`New account request email sent to:`, adminEmail);
          return adminEmail;
        })
        .catch(error => {
          console.error('There was an error while sending the email:', error);
        })
      return adminEmail;
    })
    .catch(error => {
      console.log(error);
    })

  });
