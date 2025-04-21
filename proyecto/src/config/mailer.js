const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, text, html }) => {
    const msg = {
        from: process.env.EMAIL_FROM, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    };

    try {
        const info = await transporter.sendMail(msg);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email.');
    }
};

module.exports = {
    transporter,
    sendEmail,
}; 