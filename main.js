//making a discord "object"
const {Client, MessageAttachment, Collection} = require('discord.js');

// making a discord client to reference
const client = new Client();

// making a commands collection to facilitate the work of the commands handler
client.commands = new Collection();

// making an events collection to facilitate the work of the events handler
client.events = new Collection();

// DON'T REMEMBER EXACTLY WHAT THIS DOES
// tho it looks like its jsut assigning the contents inside the folders to their respective collections
['command_handler', 'event_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client, Client);
})

// connecting this code to discord's servers using the bot's token 
client.login(process.env.token);

