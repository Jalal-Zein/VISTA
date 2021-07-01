module.exports = {
    name: 'dr', 
    description: '[prefix]dr [Routine Name] --> deletes the routine including all the tasks contained within it',
    description2: 'deletes the routine including all the tasks contained within it',
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

            // assign the first argument to be the target routine
            let target_routine = args[0];

            // get all the existing routines
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            let all_routines = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // loop through all of them and get the index of the matching routine
            let target_routine_index;
            for (let i = 0; i < all_routines.length; i++) {
                if (all_routines[i] == target_routine) {
                    target_routine_index = i + 1;
                }
            }

            // update the entire row with blank values
            let replacement = [['', '', '', '', '', '', '', '']];
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A' + target_routine_index + ':Z' + target_routine_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values: replacement}
            }
            let do_update = await gsapi.spreadsheets.values.update(update);

            // give the user feedback
            message.channel.send('Routine "' + target_routine + '" has been deleted!');

        }
    }
}