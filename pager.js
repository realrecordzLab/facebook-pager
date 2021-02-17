const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const fs = require('fs');
const fb = require('facebook-chat-api'); 
const { showNotification } = require('./notifications');
const appStateFile = path.format({dir: __dirname, base: 'appstate.json'});

let username;
let repliedTo = [];

console.log('Starting pager bot...');

if( !fs.existsSync(appStateFile) ){
    //debug .env
    fb({email: process.env.FB_EMAIL, password: process.env.FB_PWD}, (err, api) => {
        if( err ){ 
            return console.log(err);
        }
        api.setOptions({
            listenEvents: true
        });
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));

        console.log('appstate.json file saved!');
        console.log('Listening for incoming messages...');
            
        api.listenMqtt( (err, event) => {
            if( err ){ 
                return console.log(err);
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        return console.log(err);
                    }
                    for( var prop in user ){
                        username = user[prop].name;
                    }  
                });
                if( !repliedTo.includes(event.senderID) ){
                    repliedTo.push(event.senderID);
                    api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio è stato inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID)
                }
                showNotification(username, event.body);
                console.log(`New message from ${username}:\n${event.body}`);
            }
        });
    });
}else{
    console.log('Loading appstate.json file!');
    fb({appState: JSON.parse(fs.readFileSync(appStateFile))}, (err, api) => {
        if( err ){ 
            return console.log(err);
        }
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log('appstate.json file updated!');
        api.setOptions({
            listenEvents: true
        });
        console.log('Listening for incoming messages...');
        api.listenMqtt( (err, event) => {
            if( err ){ 
                return console.log(err);
            }
            if( event.type === 'message' ){
                api.getUserInfo(event.senderID, (err, user) => {
                    if( err ){
                        return console.log(err);
                    }
                    for(var prop in user){
                        username = user[prop].name;
                    }                    
                });
                if( !repliedTo.includes(event.senderID) ){
                    repliedTo.push(event.senderID);
                    api.sendMessage(`FB Pager v1.0\nCiao ${username}!Il tuo messaggio sarà inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID);
                }
                showNotification(username, event.body);
                console.log(`New message from ${username}:\n${event.body}`);
            }
        });
    });
}

