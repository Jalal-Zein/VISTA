//making a discord "object"
const Discord = require('discord.js');

// making a discord client to reference
const client = new Discord.Client();

// making a commands collection to facilitate the work of the commands handler
client.commands = new Discord.Collection();

// making an events collection to facilitate the work of the events handler
client.events = new Discord.Collection();

// DON'T REMEMBER EXACTLY WHAT THIS DOES
// tho it looks like its jsut assigning the contents inside the folders to their respective collections
['command_handler', 'event_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

// connecting this code to discord's servers using the bot's token 
// the token can be found and regenerated here in case of whatever : https://discord.com/developers/applications/780060200174485514/bot
client.login('NzgwMDYwMjAwMTc0NDg1NTE0.X7plrA.f83uFNBswWa7SzTXp5TI_lLQWPI');

