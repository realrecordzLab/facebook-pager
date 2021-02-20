const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const fs = require('fs');
const fb = require('facebook-chat-api'); 
const chalk = require('chalk');
const { showNotification } = require('./notifications');
const appStateFile = path.format({dir: __dirname, base: 'appstate.json'});
const options = {
    //userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
    userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Mobile Safari/537.36',
    listenEvents: true
}

let username;
let repliedTo = [];

console.log(chalk.magenta.bold('Starting Facebook Pager...'));

const appLogFile = path.format({dir: __dirname, base: `${Date.now()}.txt`});
const appLog = fs.createWriteStream(appLogFile, {flags: 'a+'});

console.log(chalk`{magenta.bold Log file created in ${appLogFile}}`);

if( !fs.existsSync(appStateFile) ){
    console.log(chalk.yellowBright.bold('appstate.json file not found. Logging in with .env file credentials...'));
    fb({email: process.env.FB_EMAIL, password: process.env.FB_PWD}, options, (err, api) => {       
        if( err ){ 
            appLog.write(err.error);
            appLog.end();
            return console.log(chalk.red.bold(err.error));
        }
        api.setOptions({
            listenEvents: true
        });

        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log(chalk.yellowBright.bold('appstate.json file created!'));
        console.log(chalk.magenta.bold('Listening for incoming messages...')); 
        api.listenMqtt( (err, event) => {
            if( err ){
                appLog.write(err.error); 
                appLog.end();
                return console.log(chalk.red.bold(err.error));
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        appLog.write(err.error);
                        appLog.end();
                        return console.log(chalk.red.bold(err.error));
                    }
                    for( var prop in user ){
                        username = user[prop].name;
                    } 

                    if( !repliedTo.includes(event.threadID) ){
                        repliedTo.push(event.threadID);
                        api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio è stato inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID)
                    }

                    showNotification(username, event.body);
                    console.log(chalk`{magenta.bold New message from ${username}:}\n${event.body}`); 

                    appLog.write(`${username}:`);
                    appLog.write(event.body);
                });
            }
        });
    });
}else{
    console.log(chalk.yellowBright.bold('Loading appstate.json file!'));
    fb({appState: JSON.parse(fs.readFileSync(appStateFile))}, (err, api) => {
        if( err ){ 
            appLog.write(err.error);
            appLog.end();
            return console.log(chalk.red.bold(err.error));
        }
        api.setOptions({
            listenEvents: true
        });

        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log(chalk.yellowBright.bold('appstate.json file updated!'));
        console.log(chalk.magenta.bold('Listening for incoming messages...'));
        api.listenMqtt( (err, event) => {
            if( err ){ 
                appLog.write(err.error);
                appLog.end();
                return console.log(chalk.red.bold(err.error));
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        appLog.write(err.error);
                        appLog.end();
                        return console.log(chalk.red.bold(err.error));
                    }
                    for(var prop in user){
                        username = user[prop].name;
                    }
                    if( !repliedTo.includes(event.threadID) ){
                        repliedTo.push(event.threadID);
                        api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio sarà inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID);
                    }

                    showNotification(username, event.body);
                    console.log(chalk`{magenta.bold New message from ${username}:}\n${event.body}`);
                    
                    appLog.write(`${username}:`);
                    appLog.write(event.body);
                });
            }
        });
    });
}

