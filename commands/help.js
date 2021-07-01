
const fs = require('fs');
const { cpuUsage } = require('process');

module.exports = {
    name: 'help', 
    description: '[prefix]help [command_name] --> returns description and syntax of specified command',
    description2: 'returns description and syntax of specified command',

    execute(client, message, args, Discord) {
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
            const gsapi = google.sheets({version: "v4", auth: cl });

            // assigning the target command (this will be the short version of the command's name; so the "name" value of the command file)
            let command_name = args[0];

            // creates a variable to hold the final command file thing idk what i'm doing but it works
            let command_file;

            // get all the file in the commands directory that are js files
            const all_commands = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

            // loop through all the command files for one that has a matching name to the specified one
            // set this command file to command_file
            for ( let file of all_commands) {
                let command = require(`../commands/${file}`);
                if (command.name == command_name) {
                    command_file = command;
                    break;
                }
            }

            // give the user feedback
            message.channel.send(command_file.description);
        }
    }
}