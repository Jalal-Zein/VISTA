module.exports = {
    name: 'drt', 
    description: '[prefix]drt [Routine] [Task index] --> deletes a specified task from a routine',
    description2: 'deletes a specified task from a routine',
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

            // assign the target routine
            let target_routine = args[0];

            // assign the target task
            let target_task_x_num = args[1];

            // convert the user assigned index to a working one
            let target_task_x_letter = String.fromCharCode(65 + parseInt(target_task_x_num));

            // get all the existing routines, get the index of the target
            const all_routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            let routines = (await gsapi.spreadsheets.values.get(all_routines)).data.values;

            let routine_index;
            for (let i = 0; i < routines.length; i++) {
                if (routines[i] == target_routine) {
                    routine_index = i + 1;
                }
            }

            // update the target cell with a blank value
            let update_value = [['']];
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!' + target_task_x_letter + routine_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values: update_value}
            }
            let do_update = await gsapi.spreadsheets.values.update(update);

            // re-arrange the remaining tasks to remove blank values in the middle of the routine
            // i think what i will do here is modify grx so that it doesn't send if a value is blank
            // it worked :D

            // give the user feedback
            message.channel.send('Task deleted from routine!');

        }
    }
}