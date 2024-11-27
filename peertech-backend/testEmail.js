const nodemailer = require('nodemailer');
const config = require('config');

const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey', // This is the fixed user for SendGrid
        pass: config.get('sendgridApiKey')
    }
});

const mailOptions = {
    from: config.get('emailUser'),
    to: 'nhialmajok12@gmail.com', // Replace with your email
    subject: 'Test Email',
    text: 'This is a test email from PeerTech.',
    html: '<strong>This is a test email from PeerTech.</strong>'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent:', info.response);
    }
});