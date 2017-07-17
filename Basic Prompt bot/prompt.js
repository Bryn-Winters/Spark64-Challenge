//Basic Bot that can echo back any input, code obtained from microsoft: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-waterfall
//Uses botbuilder and restify packages

var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var http = require('http');

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

//This function asks for the user's name and greets them.
bot.dialog('greetuser', [
    // Step 1
    function (session) {
        builder.Prompts.text(session, 'Hi! Would you like to know the weather in your city?');
        //builder.Prompts.text(session, 'Would your like to know the weather in your city?');
    },
    // Step 2
    function (session, results) {
        if (('yes' || 'Yes' )== results.response) {
            
            builder.Prompts.text(session, 'Please enter the name of your city:');

            //session.endDialog('Hello %s!', results.response);
        }else {
            //builder.Prompts.text('Okay');
            session.endDialog('Okay, Goodbye!');
            //next(); // Skip if we already have this info.
        }
    },

    function (session, results) {

        city = results.response;
        //city = 'New York';
        var request = http.get('http://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=metric&APPID=476166aba86f67e20fbfdf8b1e394f84', function(response) {
            var body = '';
            //Read the data
            response.on('data', function(chunk) {
                 body += chunk;
            });

            response.on('end', function() {
                if (response.statusCode === 200) {
                    try {
                    //Parse the data
                    var weatherAPI = JSON.parse(body);

                    //Print the data
                    builder.Prompts.text(session,'In ' + weatherAPI.name + ' the cloudiness is ' + weatherAPI.clouds.all + '%, and it is ' + weatherAPI.main.temp + ' degrees.');

                    } catch(error) {
                        //Parse error
                        printError(error);
                    }
                } else  {
                    //Status Code error
                    printError({message: 'There was an error getting the weather from ' + city + '. (' + http.STATUS_CODES[response.statusCode] + ')'});
                }
            });   
        });
    },

    


//Left over logging in function from another bot, may be useful later on

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

function printError(error) {
        console.error(error.message);
    };