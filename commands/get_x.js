const { range_maker, get_task_index, init3_to_full, hr_to_full } = require('../helper_functions/tools');

module.exports = {
    name: 'gx',
    description: '[prefix]gx [hour_00] [day_name_shortcut] --> gets the scheduled task for the argument hour in arg day',
    description2: 'gets the scheduled task for the argument hour in arg day',

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

        async function gsrun (cl) {
            const gsapi = google.sheets({version: "v4", auth: cl });
            
            // assigns a manually entered range to 'timestamps'
			const ts = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!B3:B26',
			}
			// gets the content of the cells in the assigned range
            // gets the values of the cells 
			// more of formatting to make them easier to work with
			let ts_array = (await gsapi.spreadsheets.values.get(ts)).data.values;

            // assigns the first argument from the command to be the desired time
            let xnow = args[0];
            
            // makes a variable that will later hold the desired day
            // it's created here because if referenced inside the switch you won't be able to reference it after
            let xday;

            // if no day is mentioned in the command: take today as a default
            if (args.length < 2) {
			    let day = {
				    spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				    range: 'Schedule!K3',
                }
			    let day_v = await gsapi.spreadsheets.values.get(day);
                xday = day_v.data.values[0][0];
			} else {
                // assigns the second argument from the command to be the desired day
                xday = args[1];
            }
            
            // makes a range string depending on the desired day to be used
            let xrange = range_maker(xday);
            
            // gets the index of the task in the array of tasks depending on the desired time
            let xindex = get_task_index(ts_array, xnow);
            
            const task = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: xrange,
            }
            let tinfo_v = (await gsapi.spreadsheets.values.get(task)).data.values;
            
            message.channel.send('Your task for ' + init3_to_full(xday) + ' at ' + hr_to_full(xnow) + ' is : ' + tinfo_v[xindex]);
        }
    }
}