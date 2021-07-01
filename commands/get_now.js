const { get_task_index } = require('../helper_functions/tools');

module.exports = {
    name: 'gn',
    description: '[prefix]gn --> gets the task scheduled for the current hour in the current day',
	description2: 'gets the task scheduled for the current hour in the current day',
    execute (client, message, Discord, args) {
        
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
        
		// runs the client 
		async function gsrun(cl){
            
			// establishes the google api connection sort of
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

			// gets the current time as XX:XX string in a 24 hour format
            const now = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Schedule!P3'
            }
            let time_string = (await gsapi.spreadsheets.values.get(now)).data.values[0][0];

			// gets the current day 
			const day = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!K3',
			}
            let day_string = (await gsapi.spreadsheets.values.get(day)).data.values[0][0];

			// sends the user a message containing the current day and time
            message.channel.send('It\'s ' + time_string + ' on a ' + day_string + '!');

			// gets the index of the task that corresponds to the current timeslot
            let task_index = get_task_index(ts_array, time_string);

            switch (day_string) {

				case 'Monday':
					// assigns a manually entered range to the day
					const mon = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!C3:C26',
					}
					// gets the content of the assigned cells
					// gets all the values of all the tasks in a formatted way 
					let mon_tasks = (await gsapi.spreadsheets.values.get(mon)).data.values;
                    
					// sends to the user a message containing the task based on the previously gotten index
					message.channel.send('Your current task is : ' + mon_tasks[task_index]);
					break;

				case 'Tuesday':
					const tues = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!D3:D26',
					}
                    let tues_tasks = (await gsapi.spreadsheets.values.get(tues)).data.values;
					message.channel.send('Your current task is : ' + tues_tasks[task_index]);
					break;

				case 'Wednesday':
					const wednes = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!E3:E26',
					}
                    let wednes_tasks = (await gsapi.spreadsheets.values.get(wednes)).data.values;
                    message.channel.send('Your current task is : ' + wednes_tasks[task_index]);
					break;

				case 'Thursday':
					const thurs = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!F3:F26',
					}
                    let thurs_tasks = (await gsapi.spreadsheets.values.get(thurs)).data.values;
                    message.channel.send('Your current task is : ' + thurs_tasks[task_index]);
					break;

				case 'Friday':
					const fri = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!G3:G26',
					}
					let fri_tasks = (await gsapi.spreadsheets.values.get(fri)).data.values;
                    message.channel.send('Your current task is : ' + fri_tasks[task_index]);
					break;

				case 'Saturday':
					const satur = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!H3:H26',
					}
                    let satur_tasks = (await gsapi.spreadsheets.values.get(satur)).data.values;
                    message.channel.send('Your current task is : ' + satur_tasks[task_index]);
					break;

				case 'Sunday':
					const sun = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!I3:I26',
					}
                    let sun_tasks = (await gsapi.spreadsheets.values.get(sun)).data.values;
                    message.channel.send('Your current task is : ' + sun_tasks[task_index]);
					break;
			}

        }
    }
}