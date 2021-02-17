const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const fs = require('fs');
const fb = require('facebook-chat-api'); 
const chalk = require('chalk');
const { showNotification } = require('./notifications');
const appStateFile = path.format({dir: __dirname, base: 'appstate.json'});

let username;
let repliedTo = [];

console.log(chalk.yellow.bold('Starting pager bot...'));

if( !fs.existsSync(appStateFile) ){
    //debug .env
    fb({email: process.env.FB_EMAIL, password: process.env.FB_PWD}, (err, api) => {
        if( err ){ 
            return console.log(chalk.red.bold(err));
        }
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log(chalk.magenta.bold('appstate.json file saved!'));
        api.setOptions({
            listenEvents: true
        });
        console.log(chalk.yellow.bold('Listening for incoming messages...'));    
        api.listenMqtt( (err, event) => {
            if( err ){ 
                return console.log(chalk.red.bold(err));
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        return console.log(chalk.red.bold(err));
                    }
                    for( var prop in user ){
                        username = user[prop].name;
                    }  
                });
                if( !repliedTo.includes(event.threadID) ){
                    repliedTo.push(event.threadID);
                    api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio è stato inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID)
                }
                //showNotification(username, event.body);
                console.log(chalk`{yellow.bold New message from ${username}:}\n${event.body}`);
            }
        });
    });
}else{
    console.log(chalk.magenta.bold('Loading appstate.json file!'));
    fb({appState: JSON.parse(fs.readFileSync(appStateFile))}, (err, api) => {
        if( err ){ 
            return console.log(chalk.red.bold(err));
        }
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log(chalk.magenta.bold('appstate.json file updated!'));
        api.setOptions({
            listenEvents: true
        });
        console.log(chalk.yellow.bold('Listening for incoming messages...'));
        api.listenMqtt( (err, event) => {
            if( err ){ 
                return console.log(chalk.red.bold(err));
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        return console.log(chalk.red.bold(err));
                    }
                    for(var prop in user){
                        username = user[prop].name;
                    }                    
                });
                if( !repliedTo.includes(event.threadID) ){
                    repliedTo.push(event.threadID);
                    api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio sarà inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID);
                }
                //showNotification(username, event.body);
                console.log(chalk`{yellow.bold New message from ${username}:}\n${event.body}`);
            }
        });
    });
}

