// Initial code obtained from microsoft: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-waterfall
// Initial API call code obtained from here: https://teamtreehouse.com/community/im-trying-to-make-weather-app-with-nodejs-but-it-doesnt-work
// Uses botbuilder and restify packages

var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var http = require('http');

// Print errors to the console if they arise
function printError(error) {
    console.error(error.message);
};

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

// This part of the bot greets the user if they say 'hi' or 'hello', then begins the weather questioning portion
var bot = new builder.UniversalBot(connector, [
    function (session) {
        if ('hi' == session.message.text || 'hello' == session.message.text) {
            
            builder.Prompts.text(session, 'Hi!');
            // This dialog is ended so the bot will only greet the user once per conversation
            session.endDialog();
            // This firstrun variable is used to alter the question in the next section after it is asked once
            session.userData.firstRun = true;
            session.beginDialog('weatherbot', session.userData.profile);
        } else {
            // Does nothing if the user doesn't say 'hi' or 'hello'
        }  
    },
]);

//This function asks the user if they would like to know the weather in their city, prompts them for a city name, and gives them the weather.
bot.dialog('weatherbot', [
    // This Function asks about the weather, and the dialog changes if the inital question has already been asked
    function (session) {
        if(session.userData.firstRun){ // Initial question
            builder.Prompts.text(session, 'Would you like to know the weather in your city?');
            session.userData.firstRun = false;
        }else{  // Question asked when the bot loops
            builder.Prompts.text(session, 'Would you like to know the weather in another city?');
        }
    },
    // If the user answers 'Yes' or 'yes' when asked if the want to know the weather, this function prompts them to enter a city name
    function (session, results) {
        if ('yes' == results.response || 'Yes' == results.response) {         
            builder.Prompts.text(session, 'Please enter the name of your city:');
        }else {
            // If the user says anything else (presumably no), the bot says goodbye and ends the conversation
            session.endDialog('Okay, Goodbye!');
        }
    },

    function (session, results) {

        city = results.response;
        // This is the api call to openweathermap using the name of the city that the user entered
        var request = http.get('http://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=metric&APPID=476166aba86f67e20fbfdf8b1e394f84', function(response) {
            var body = '';
            // This reads in the JSON packet that is returned and saves adds it to an empty variable as it is received for later decoding
            response.on('data', function(chunk) {    
                    body += chunk;
            });
            // Once the end of the JSON packet is registered as having been received, it can the parsed in the information used
            response.on('end', function() {
                if (response.statusCode === 200) {
                    try {
                    // Parse the data
                    var weatherAPI = JSON.parse(body);
                    // Tells the user about the weather and the current temperature
                    builder.Prompts.text(session,'In ' + weatherAPI.name + ' the weather is ' + weatherAPI.weather[0].main + ', is decribed as ' + weatherAPI.weather[0].description + ', and it is ' + weatherAPI.main.temp + '°C.');
                    // This ends this dialog so the bot can loop to ask the user about if they want to know another city's weather
                    session.endDialog();
                    session.beginDialog('weatherbot', session.userData.profile);
                    } catch(error) {
                        // Catches errors so they can be printed to the console
                        printError(error);
                    }
                } else  {
                    // Error reached if the API call fails
                    builder.Prompts.text(session,'Error');
                    printError({message: 'There was an error getting the weather from ' + city + '. (' + http.STATUS_CODES[response.statusCode] + ')'});
                }
            });   
        });
    },
]);

