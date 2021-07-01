const { init3_to_full } = require('../helper_functions/tools');

module.exports = {
    name: 'es', 
    description: '[prefix]es [Day] [Hour] [New Task] --> updates the task of a specific hour in a specific day',
    description2: 'updates the task of a specific hour in a specific day',
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

            // assign the args to their variables
            let day = init3_to_full(args[0]);
            let hour = args[1];
            let new_task = [[args[2].trim()]];

            // gets all the timestamps, get the index of the matching time slot
            const times = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Schedule!B3:B26'
            }
            let timestamps = (await gsapi.spreadsheets.values.get(times)).data.values;

            let time_index;
            for (let i = 0; i < timestamps.length; i++) {
                if (timestamps[i] == hour) {
                    time_index = i + 3; // it might be +3 or 4 on the real sheet
                    break;
                }
            }

            // gets all the days, get the index of the matching day, convert the index to a letter
            const yom = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Schedule!C2:I2'
            }
            let days = (await gsapi.spreadsheets.values.get(yom)).data.values;

            let day_index;
            for (let i = 0; i < days[0].length; i++) {
                if (days[0][i] == day) {
                    day_index = i + 1;
                    break;
                }
            }

            let day_index_letter = String.fromCharCode(66 + parseInt(day_index)); // this will be 66 or 67 once on the real sheet

            // update the cell
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Schedule!' + day_index_letter + time_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values : new_task}
            }
            let do_update = await gsapi.spreadsheets.values.update(update);

            // give feedback to the user
            message.channel.send('Your task on ' + day + ' at ' + hour + ' has been upated to "' + new_task + '" !');
        }
    }
}