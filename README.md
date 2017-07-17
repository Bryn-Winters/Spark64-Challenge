To run the weather bot, first clone the package, then navigate to the directory in a command line window.
Install the latest version of Node.js ( https://nodejs.org/en/download/ ), then install botbuilder and restify with these commands:

npm install --save botbuilder
npm install --save restify

Then install Microsoft Bot Framework Channel Emulator from here: https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.29
Next, navigate to the 'Weather bot' folder and run the program with:

node weatherbot.js

Run Microsoft Bot Framework Channel Emulator and connect to the weather bot using this address:

http://localhost:3978/api/messages

To start the bot, send a 'hi' or 'hello' message. When asked if you want to know the weather for a city, answer 'Yes' or 'yes' to continue, or anything else to end the conversation.
If you do continue, you will be prompted for the name of the city. Enter it and the basic weather, a slightly more in-depth description and the temperature in degrees celcius will be displayed.
You will then be asked if you want to view the weather for another city, as before, answer 'Yes' or 'yes' to continue, or anything else to end the conversation.


# Spark64-Challenge
A simple weather bot created as part of a hiring application process
