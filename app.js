var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            builder.Prompts.text(session, 'Hey!! Can I collect some basic info from u ? You are not registered to me');
        }
        else{
            session.beginDialog('/normal_chatting');
        }
    },
    function (session, results) {
        if (results.response == 'Yes' || results.response == 'yes'){
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
        builder.Prompts.number(session, 'Hi'+results.response+'your age ?');
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
        //session.beginDialog('/normal_chatting');
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
        session.send('listen mode');
        builder.Prompts.text(session, '');
    },
    function (session, results) {
        if (results.response != ''){
            session.beginDialog('/googling');
        }   
    }
]);

bot.dialog('/googling', [
    function (session,results) {
        builder.Prompts.text(session , 'Do u want me to google that for u ?');
    },
    function (session, results) {
        if (results.response == 'Yes' || results.response == 'yes'){
            session.beginDialog('/bingsearch');
        }
        else{
            session.send('Sorry then I cant help');
            session.endDialog();
        }
    }
]);

//------------------------------for the alarm part-------------------------------------------------//
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=62383e07722f440f9ffd28c4cb7ba535&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('builtin.intent.alarm.set_alarm', [
    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        var title = builder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
        var time = builder.EntityRecognizer.resolveTime(args.entities);
        var alarm = session.dialogData.alarm = {
          title: title ? title.entity : null,
          timestamp: time ? time.getTime() : null  
        };
        
        // Prompt for title
        if (!alarm.title) {
            builder.Prompts.text(session, 'What would you like to call your alarm?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        var alarm = session.dialogData.alarm;
        if (results.response) {
            alarm.title = results.response;
        }

        // Prompt for time (title will be blank if the user said cancel)
        if (alarm.title && !alarm.timestamp) {
            builder.Prompts.time(session, 'What time would you like to set the alarm for?');
        } else {
            next();
        }
    },
    function (session, results) {
        var alarm = session.dialogData.alarm;
        if (results.response) {
            var time = builder.EntityRecognizer.resolveTime([results.response]);
            alarm.timestamp = time ? time.getTime() : null;
        }
        
        // Set the alarm (if title or timestamp is blank the user said cancel)
        if (alarm.title && alarm.timestamp) {
            // Save address of who to notify and write to scheduler.
            alarm.address = session.message.address;
            alarms[alarm.title] = alarm;
            
            // Send confirmation to user
            var date = new Date(alarm.timestamp);
            var isAM = date.getHours() < 12;
            session.send('Creating alarm named "%s" for %d/%d/%d %d:%02d%s',
                alarm.title,
                date.getMonth() + 1, date.getDate(), date.getFullYear(),
                isAM ? date.getHours() : date.getHours() - 12, date.getMinutes(), isAM ? 'am' : 'pm');
        } else {
            session.send('Ok... no problem.');
        }
    }
]);


dialog.matches('builtin.intent.alarm.delete_alarm', [
    function (session, args, next) {
        // Resolve entities passed from LUIS.
        var title;
        var entity = builder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
        if (entity) {
            // Verify its in our set of alarms.
            title = builder.EntityRecognizer.findBestMatch(alarms, entity.entity);
        }
        
        // Prompt for alarm name
        if (!title) {
            builder.Prompts.choice(session, 'Which alarm would you like to delete?', alarms);
        } else {
            next({ response: title });
        }
    },
    function (session, results) {
        // If response is null the user canceled the task
        if (results.response) {
            delete alarms[results.response.entity];
            session.send("Deleted the '%s' alarm.", results.response.entity);
        } else {
            session.send('Ok... no problem.');
        }
    }
]);

dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

// Very simple alarm scheduler
var alarms = {};
setInterval(function () {
    var now = new Date().getTime();
    for (var key in alarms) {
        var alarm = alarms[key];
        if (now >= alarm.timestamp) {
            var msg = new builder.Message()
                .address(alarm.address)
                .text("Here's your '%s' alarm.", alarm.title);
            bot.send(msg);
            delete alarms[key];
        }
    }
}, 15000);
//------------------------------for the alarm part-------------------------------------------------//
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