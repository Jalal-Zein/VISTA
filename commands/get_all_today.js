const { out_formatter } = require('../helper_functions/tools');

module.exports = {
	// name of the command and what the user will type to get the command
	name: 'gat',
	description: '[prefix]gat --> gets all scheduled tasks in for the current day',
	description2: 'gets all scheduled tasks in for the current day',

	execute(client, message, args, Discord ) {
		
		// makes a google object to reference and interact with
		const { google } = require('googleapis');

		// connects this project with the google api through our key
		const keys = require(`../keys.json`);

		// creates a google client to interact with as a javascript web token
		const gclient = new google.auth.JWT(
			keys.client_email,
			null,
			keys.private_key,
			['https://www.googleapis.com/auth/spreadsheets'],
		);

		// authorizes the client and is the main thing that runs when the command is executed
		gclient.authorize(function (err, tokens) {
			// basically telling it to do nothing if it ecnounters an error 
			// or run if no errors are encountered
			if (err) {
				console.log(err);
				return;
			} else {
				gsrun(gclient);
			}
		})

		async function gsrun(cl) {
			const gsapi = google.sheets({ version: 'v4', auth: cl });

			// looks for the timestamps provided in the sheet through a range tha should be manually assigned
			const ts = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!B3:B26',
			}
			// gets the values of the content of the timestamps range 
			let info0 = await gsapi.spreadsheets.values.get(ts);
			
			
			// looks for the day we're in through a cell that should be manually assigned
			const day = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!K3:K3',
			}
			// gets the  values of the content of the day cell
			let day_v = await gsapi.spreadsheets.values.get(day);

			// displays the day to the user
			message.channel.send('Today is  : ' + day_v.data.values[0][0]);
			message.channel.send('Here is your default schedule!');

			// decides which column to send depending on the day of the week
			switch (day_v.data.values[0][0]) {
				
				case 'Monday':
					// gets the values of the column that should manually be assigned to monday (through the range var below)
					const mon = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!C3:C26',
					}
					// gets the values inside the assigned range
					let info1 = await gsapi.spreadsheets.values.get(mon);

					// formats the tasks to provide them with timestamps in a visually not cancer way
					ex1_mes = out_formatter(info1.data.values, info0.data.values);

					// sends the results to the channel where the command was referenced
					message.channel.send(ex1_mes);
					break;

				case 'Tuesday':
					const tues = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!D3:D26',
					}
					let info2 = await gsapi.spreadsheets.values.get(tues);

					ex2_mes = out_formatter(info2.data.values, info0.data.values);

					message.channel.send(ex2_mes);
					break;

				case 'Wednesday':
					const wednes = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!E3:E26',
					}
					let info3 = await gsapi.spreadsheets.values.get(wednes);

					ex3_mes = out_formatter(info3.data.values, info0.data.values);

					message.channel.send(ex3_mes);
					break;

				case 'Thursday':
					
					const thurs = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!F3:F26',
					}
					let info4 = await gsapi.spreadsheets.values.get(thurs);

					ex4_mes = out_formatter(info4.data.values, info0.data.values);

					message.channel.send(ex4_mes);
					break;

				case 'Friday':
					const fri = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!G3:G26',
					}
					let info5 = await gsapi.spreadsheets.values.get(fri);
					
					ex5_mes = out_formatter(info5.data.values, info0.data.values);
					
					message.channel.send(ex5_mes);
					break;

				case 'Saturday':
					const satur = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!H3:H26',
					}
					let info6 = await gsapi.spreadsheets.values.get(satur);

					ex6_mes = out_formatter(info6.data.values, info0.data.values);
					
					message.channel.send(ex6_mes);
					break;

				case 'Sunday':
					const sun = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!I3:I26',
					}
					let info7 = await gsapi.spreadsheets.values.get(sun);

					ex7_mes = out_formatter(info7.data.values, info0.data.values);
					
					message.channel.send(ex7_mes);
					break;
			}
		}
	}
}