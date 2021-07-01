const { Guild } = require('discord.js');
const { get_task_index, notification } = require('../../helper_functions/tools');

module.exports = (client, message, Discord, args) => {
	
	// sends "We out here, Baby! My prefix is .." when the bot goes online 
	console.log('We out here, Baby! My prefix is ..') 

	/*
	 	NOT SURE IF THIS BELGONS HERE BUT HERE WE ARE
	*/

	// this is the notification section
	// it's basically get_now but it sends in dms only and i made some necessary  adjustments to imports 
	// and such for things to work

	setInterval(function(){
		// makes a google object to interact with
		const { google } = require('googleapis');
		
		// gets some important files 
		const keys = require(`../../keys.json`);
		
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
			
			// establishes the google api connection sort of;
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

			const hour = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!O3'
			}
			let hour_string = (await gsapi.spreadsheets.values.get(hour)).data.values[0][0];

			// gets the current day 
			const day = {
				spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Schedule!K3',
			}
			let day_string = (await gsapi.spreadsheets.values.get(day)).data.values[0][0];

			// gets the index of the task that corresponds to the current timeslot
			let task_index = get_task_index(ts_array, hour_string);

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
					text_message =  mon_tasks[task_index];
					break;

				case 'Tuesday':
					const tues = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!D3:D26',
					}
					let tues_tasks = (await gsapi.spreadsheets.values.get(tues)).data.values;
					text_message = tues_tasks[task_index];
					break;

				case 'Wednesday':
					const wednes = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!E3:E26',
					}
					let wednes_tasks = (await gsapi.spreadsheets.values.get(wednes)).data.values;
					text_message = wednes_tasks[task_index];
					break;

				case 'Thursday':
					const thurs = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!F3:F26',
					}
					let thurs_tasks = (await gsapi.spreadsheets.values.get(thurs)).data.values;
					text_message = thurs_tasks[task_index];
					break;

				case 'Friday':
					const fri = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!G3:G26',
					}
					let fri_tasks = (await gsapi.spreadsheets.values.get(fri)).data.values;
					text_message =  fri_tasks[task_index];
					break;

				case 'Saturday':
					const satur = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!H3:H26',
					}
					let satur_tasks = (await gsapi.spreadsheets.values.get(satur)).data.values;
					text_message = satur_tasks[task_index];
					break;

				case 'Sunday':
					const sun = {
						spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
						range: 'Schedule!I3:I26',
					}
					let sun_tasks = (await gsapi.spreadsheets.values.get(sun)).data.values;
					text_message = sun_tasks[task_index];
					break;
			} 
			const user = client.users.cache.get('367386925323124748');
			if (text_message[0] !== 'sleep.') {
				user.send(text_message);
			}
		}
	}, 3600*1000) 

	// this is the routines section
	 
	// makes a google object to interact with
	const { google } = require('googleapis');
		
	// gets some important files 
	const keys = require(`../../keys.json`);
	
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
		const gsapi = google.sheets({ version: 'v4', auth: cl });

		const morning = {
			spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
			range: 'Routines!B1:Z1'
		}
		let morning_routine = (await gsapi.spreadsheets.values.get(morning)).data.values;

		const night = {
			spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
			range: 'Routines!B2:Z2'
		}
		let night_routine = (await gsapi.spreadsheets.values.get(night)).data.values;
	
		var cron = require("cron");

		global.morning_routine_time_string = '00 00 10 * * *';
		let routine_1 = new cron.CronJob(morning_routine_time_string, () => {
			const user = client.users.cache.get('367386925323124748');
			user.send('Good morning! It is 10 O\'Clock. Here is your default Morning Routine:');
			for (y of morning_routine) {
				user.send('- ' + y);
			}
		});

		global.night_routine_time_string = '00 30 01 * * *';
		let routine_2 = new cron.CronJob(night_routine_time_string, () => {
			const user = client.users.cache.get('367386925323124748');
			user.send('It is almost time for bed :/ \n Here is your default Night Routine :');
			for (x of night_routine) {
				user.send('- ' + x);
			}
		})

		routine_1.start()
		routine_2.start()
	}
}