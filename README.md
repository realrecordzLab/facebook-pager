# facebook-pager
### A simple bot to automate messages reply for facebook personal account

![scren](https://github.com/realrecordzLab/facebook-pager/blob/main/docs/screen.png "Facebook Pager screen")

This is a simple bot for facebook messenger personal account, it will listen for new incoming messages and will autoreply to inform your contacts that you are not connected at the moment. All the messages are displayed inside the terminal window that is executing the process. 
Under the hood the script use the [facebook chat api](https://github.com/Schmavery/facebook-chat-api) that is responsable to intercept messages received and [forever monitor](https://github.com/foreversd/forever-monitor) that will run the script until the terminal is closed. 

I've made this script for fun and as an exercise with nodejs.

### DISCLAIMER: I'm not responsable if your account gets banned for spammy activities such as sending lots of messages to people you don't know, sending messages very quickly, sending spammy looking URLs, logging in and out very quickly. Be responsable Facebook citizens.  

#### INSTALLATION

Clone or download this repo and navigate to the folder
```
$ cd /Users/pcuser/facebook-pager
```
Install the needed dependencies
```
$ facebook-pager npm install
```
Before you can run the script, you need to create your custom `.env` file inside the repo folder. It will contain your facebook login credentials. Don't share it with anyone.  
```
FB_EMAIL = yourfacebook@email.com
FB_PWD = yourSuperSecretPassword 
FORCE_COLOR = 1
```
After the `.env` file is in place, you will be able to run the script. 

Set a custom reply message for the bot by using the `-m` or `--message` command. Be sure to use the double quotes `"` to delimit your custom message and leave always a space after the `!` char and the next word of your message when you use it.
```
$ facebook-pager node index.js -m "Hi! This is my awesome custom bot message."
```




