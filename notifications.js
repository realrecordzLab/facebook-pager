const notifier = require('node-notifier');
const nodemailer = require('nodemailer');

exports.showNotification = (username, message) => {
    notifier.notify({
        title: `New message from ${username}`,
        message: message
    });
}

exports.forwardMessage = (config, username, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.user,
            pass: config.password
        }
    });

    transporter.sendMail({
        from: `${username} <noreply@fbpager.com>`,
        to: config.user,
        subject: `Facebook Pager - New message from ${username}`,
        text: message
    }, (err, info) => {
        if( err ){
            console.log(err)
        }
        console.log(`Message forwarded to ${config.user}`);
        console.log(`Message info: ${info.response}`);
    });
}
