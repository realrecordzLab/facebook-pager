const notifier = require('node-notifier');

exports.showNotification = (username, message) => {
    notifier.notify({
        title: `New message from ${username}`,
        message: message
    });
}
