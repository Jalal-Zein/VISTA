// makes fs, idk what fs is, look into it 
const fs = require('fs');

module.exports = (client, Discord) => {
	const load_dir = (dirs) => {
		
		// gets the events from the directory and filters them by javascript files
		const events_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

		// for each file in the directory :
		for (const file of events_files) {
			
			// gets all events from the directory
			const event = require(`../events/${dirs}/${file}`);
			
			// makes a name for the event by removing the file type indicator from the javascript name 
			const event_name = file.split('.')[0];
			
			// when the event happens : execute it 
			client.on(event_name, event.bind(null, client, Discord));

		}
	}

	// load the events 
	['client', 'guild'].forEach(e => load_dir(e));
}