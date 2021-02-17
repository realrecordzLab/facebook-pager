const notifier = require('node-notifier');

exports.showNotification = (username, message) => {
    notifier.notify({
        title: `New message from ${username}`,
        message: message,
        wait: true
    }, (err, response, metadata) => {
        if( err ){
            console.log(err);
        }
        console.log(response, metadata);
    });
}
