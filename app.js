var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            builder.Prompts.text(session, 'Can I collect some basic info from u ? You are not registered to me');
        }
        else{
            session.beginDialog('/normal_chatting');
        }
    },
    function (session, results) {
        if (results.response == 'Yes'){
            session.beginDialog('/get_profile');
        }
        else{
            session.send('Your data isn\'t saved in my system! Sorry but I can\'t continue');
            session.endConversation('GoodBye..Until the next time');
        }
    }
]);

bot.dialog('/get_profile', [
    function (session) {
        builder.Prompts.text(session, 'Cool! your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.text(session, 'Hi'+results.response+'your age ?');
    },
    function (session, results) {
        session.userData.age = results.response;
        builder.Prompts.text(session, 'Where do u live (Can u tell ur full approximate address) ?');
    },
    function (session, results) {
        session.userData.address = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "In what language do you code ?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                     " you've been programming for " + session.userData.coding + 
                     " years and use " + session.userData.language + ".");
        session.beginDialog('/normal_chatting');
    },
    function (session, results){
        session.send('How\'s ur health' + session.userData.name + ' ?');
        builder.Prompts.choice(session,'','Very Good|Good|Normal|Bad|Very Bad');
    },
    var jsonfile = require('jsonfile');
for (i=0; i <11 ; i++){
   jsonfile.writeFile('.json', "id :" + i + " square :" + i*i);
}
    function (session,results){
        switch(results.response.index){
            case 0: session.beginDialog('/VeryGood');
                    break;
            case 1:session.beginDialog('/Good');
                    break;
            case 2:session.beginDialog('/Normal');
                    break;
            case 3:session.beginDialog('/Bad');
                    break;
            case 4:session.beginDialog('/VeryBad');
                    break;
            default:
                    session.endDialog();
                    break;
        }  
    }
]);

bot.dialog('/VeryGood',[
    function(session){
        session.send('Nice to hear that...Hope u r still taking ur medicines properly');

    }
]);

bot.dialog('/Good',[
    function(session){
        session.send('<Appropriate text>');

    }
]);
bot.dialog('/Normal',[
    function(session){
        session.send('<Appropriate text>');

    }
]);
bot.dialog('/Bad',[
    function(session){
        session.send('<Appropriate text>');

    }
]);
bot.dialog('/VeryBad',[
    function(session){
        session.send('<Appropriate text>');

    }
]);


bot.dialog('/normal_chatting', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.send('Nice name');
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/googling', [
    function (session) {
        builder.Prompts.text(session , 'Do u want me to google that for u ?');
    },
    function (session, results) {
        if (results.response == 'Yes' || results.response == 'yes'){
            session.beginDialog('/bingsearch');
        }
        else{
            session.send('Sorry then I cant help');
        }
    }
]);
/*
var imported = document.createElement('script');
imported.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js';
document.head.appendChild(imported);

bot.dialog('/bingsearch',[
    $(function() {
            var params = {
                // Request parameters
                "q": "",
                "count": "10",
                "offset": "0",
                "mkt": "en-us",
                "safesearch": "Moderate",
            };
          
            $.ajax({
                url: "https://api.cognitive.microsoft.com/bing/v5.0/search?" + $.param(params),
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","{bfffc8aa212146d8888ec572ac4eef1f}");
                },
                type: "GET",
                // Request body
                data: "{body}",
            })
            .done(function(data) {
                alert("success");
            })
            .fail(function() {
                alert("error");
            });
    })
]);
*/

