module.exports = {
    name: 'ert', 
    description: '[prefix]ert [routine] [task index] [new task] --> updates an existing task in a routine',
    descrtiption2: 'updates an existing task in a routine',
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

            // assigning the first argument to be the target routine title
            let target_routine = args[0];            

            // assigning the second arguemnt to be the target task index
            let target_index = args[1];

            // assigning all that's after the second argument to be the new task
            let new_task = '';
            for (let i = 2; i < args.length; i++) {
                new_task += args[i] + ' ';
            }
            let new_task_name = [[new_task.trim()]];

            // gets all the existing routines
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            const routine_titles = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // loops through the existing routines to find a match with the target routine
            // gets the index of that match
            let tr_index;
            for (let i = 0; i < routine_titles.length; i++) {
                if (routine_titles[i] == routines) {
                    tr_index = i + 1;
                }
            }

            // transform the user provided index into a letter index
            let task_index_letter = String.fromCharCode(65 + parseInt(target_index));

            // give feedback to the user 
            const prev_value = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!' + task_index_letter + target_index,
            }
            let p_value = (await gsapi.spreadsheets.values.get(prev_value)).data.values;
            message.channel.send('"' + p_value + '" has been updated to be "' + new_task_name + '"!');

            // update the cell with the new task name
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!' + task_index_letter + target_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values: new_task_name}
            }
            let update_do = await gsapi.spreadsheets.values.update(update);

        }
    }
}