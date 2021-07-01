const { range_maker } = require(`../helper_functions/tools`);
const { init3_to_full } = require(`../helper_functions/tools`);
const { out_formatter } = require(`../helper_functions/tools`);

module.exports = {
    name: 'gax',
    description: '[prefix]gax [day_name_shortcut] --> all scheduled tasks for the specified argument', 
    description2: 'all scheduled tasks for the specified argument', 

    execute (Discord, message, args) {
        
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

        async function gsrun(cl) {

            // establishes the google sheets api as an object to interact with
            const gsapi = google.sheets({ version: 'v4', auth: cl });
            
            // assigns a manually entered range to 'timestamps'
			const ts = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!B3:B26',
			}
			// gets the content of the cells in the assigned range
            // gets the values of the cells 
			// more of formatting to make them easier to work with
			let ts_array = (await gsapi.spreadsheets.values.get(ts)).data.values;
            
            // assigns the first argument of the command to be the desired day
            const xday = args[0];

            // makes a range string to access the tasks
            let xrange = range_maker(xday);

            const tasks = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: xrange
            }
            let tasks_arr = (await gsapi.spreadsheets.values.get(tasks)).data.values;

            // formats the tasks array to add timestamps 
            let final_arr = out_formatter(tasks_arr, ts_array);
            
            // sending back this info to the user in the channel where the bot was called
            message.channel.send('Here is your default schedule for ' + init3_to_full(xday));
            message.channel.send(final_arr);
            

        }
    }
}