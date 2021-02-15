//TODO: fix user.name e currentUser.name per mostrare nome utente - aggiungere inoltro email
require('dotenv').config();
const fs = require('fs');
const fb = require('facebook-chat-api'); 
const path = require('path');
const appStateFile = path.format({dir: __dirname, base: 'appstate.json'});

console.log('Starting pager bot...');
if( !fs.existsSync(appStateFile) ){
    //debug .env
    //console.log(process.env);
    fb({email: process.env.FB_EMAIL, password: process.env.FB_PWD}, (err, api) => {
        if(err){ 
            return console.log(err);
        }
        api.setOptions({
            listenEvents: true
        });
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log('appstate.json file saved!');
        console.log('Listening for incoming messages...')
        api.listenMqtt( (err, event) => {
            if(err){ 
                return console.log(err);
            }
            if(event.type === 'message'){
                api.getUserInfo(event.senderID, (err, user) => {
                    if(err){
                        return console.log(err);
                    }
                    console.log(`New message from ${user} \n${event.body}`);
                    api.sendMessage(`FB Pager v1.0\nCiao ${user.name}!Il tuo messaggio è stato inoltrato tramite email.\nRiceverai risposta quando sarò nuovamente online.`, event.threadID)
                });
            }
        });
    });
}else{
    console.log('Loading appstate.json file!')
    fb({appState: JSON.parse(fs.readFileSync(appStateFile))}, (err, api) => {
        if(err){ 
            return console.log(err);
        }
        fs.writeFileSync(appStateFile, JSON.stringify(api.getAppState()));
        console.log('appstate.json file updated!');
        api.setOptions({
            listenEvents: true
        });
        console.log('Listening for incoming messages...')
        api.listenMqtt( (err, event) => {
            if(err){ 
                return console.log(err);
            }
            if(event.type === 'message'){
                api.getUserInfo(event.senderID, (err, user) => {
                    if(err){
                        return console.log(err);
                    }
                    //debug
                    console.log(user['name'], user.name);

                    console.log(`New message from ${user} \n${event.body}`);
                    api.sendMessage(`FB Pager v1.0\nCiao ${user.name}!Il tuo messaggio è stato inoltrato tramite email.\n Riceverai risposta quando sarò nuovamente online.`, event.threadID)
                });
            }
        });
    });
}