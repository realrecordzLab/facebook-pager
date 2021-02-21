# facebook-pager
This is a simple bot for facebook messenger personal account, it will listen for new incoming messages and will autoreply to inform your contacts that you are not connected at the moment. All the messages are displayed inside the terminal window that is executing the process. 
Under the hood the script use the [facebook chat api](https://github.com/Schmavery/facebook-chat-api) that is responsable to intercept messages received and [forever monitor](https://github.com/foreversd/forever-monitor) that will run the script until the terminal is closed. 

I've made this script for fun and as an exercise with nodejs but I'm planning to integrate some cool functions like received message forwarding to a specified email address and the customization of the bot reply. 

### DISCLAIMER: I'm not responsable if your account gets banned for spammy activities such as sending lots of messages to people you don't know, sending messages very quickly, sending spammy looking URLs, logging in and out very quickly. Be responsable Facebook citizens.  

#### USAGE

Before you can use the script, you need to create your custom `.env` file inside the repo folder. It will contain your login credentials. Don't share it with anyone.  
```
FB_EMAIL = yourfacebook@email.com
FB_PWD = yourSuperSecretPassword 
GMAIL_USER = youremail@gmail.com
GMAIL_PWD = yourGmailPassword
FORCE_COLOR = 1
```

```
// navigate to the repo folder
$ cd /Users/pcuser/facebook-pager
// install dependencies
$ facebook-pager npm install
// run the script
$ facebook-pager node index.js
```

To enable the message forward on an email address using Gmail, you need to [configure your account first](https://blog.mailtrap.io/nodemailer-gmail/). 




