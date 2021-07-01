// makes fs... idk what fs is. Maybe look into it 
const fs = require('fs');

module.exports = (client, Discord) => {
	
	// gets the commands from the directory and filter them by javscript files
	const command_files = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));

	for (const file of command_files) {
		
		// assigns the command from the fils 
		const command = require(`../commands/${file}`);
		
		if (command.name) {
			// if the command exists, assign it 
			client.commands.set(command.name, command);
		} else {
			// if the command doesnt exist, act as if nothing ever happened 
			continue;
		}
	}
}