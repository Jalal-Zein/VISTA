const { MessageAttachment } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'commands', 
    description: '[prefix]commands --> will list all the present active and inactive commands',
    description2: 'will list all the present active and inactive commands',

    execute(args, message, Discord) {
         // makes a google object to interact with
		const { google } = require('googleapis');
        
		// gets some important files 
		const keys = require(`../keys.json`);
        
		// makes a google client to interact with 
		const gclient = new google.auth.JWT(
            keys.client_email, 
            null, 
            keys.private_key, 
            ['https://www.googleapis.com/auth/spreadsheets'],
        )
        
		// authorizes the client 
		// kind of he main function that runs 
		gclient.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            } else {
                gsrun(gclient);
            }
        })

        async function gsrun(cl){
            // const gsapi = google.sheets({version: "v4", auth: cl });

            // gets all the commands' javascript files
            // const all_commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

            // loops all the commands
            // for ( let file of all_commands) {
                // let command = require(`../commands/${file}`);
                // message.channel.send(' # ' + command.name + '\n' + command.description2);
            // }

            message.channel.send(new MessageAttachment('./documents/commands.txt'));

            
        }
    }
}