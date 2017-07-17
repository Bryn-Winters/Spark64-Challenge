//Basic Bot that can echo back any input, code obtained from microsoft: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-waterfall
//Uses botbuilder and restify packages

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());



// This bot ensures user's profile is up to date. Currently it just asks for the user's name.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('greetuser', session.userData.profile);
    },
    /*function (session, results) {
        session.userData.profile = results.response; // Save user profile.
        session.send('Hello %(name)s! I love %(company)s!', session.userData.profile);
    }*/
]);

//This function will be built later to enquire about the weather

/*bot.dialog('greetuser', [

function(session, args, next) {
    session.send("Hi!");
    session.send("Would you like to know the weather in your city?");
}*/

//This function asks for the user's name and greets them.
bot.dialog('greetuser', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    // Step 2
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
//]);


//Let over logging in function from another bot, may be useful later on

    /*function (session, args, next) {
        session.dialogData.profile = args || {}; // Set the profile or create the object.
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.company) {
            builder.Prompts.text(session, "What company do you work for?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results) {
        if (results.response) {
            // Save company name if we asked for it.
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }*/
]);