module.exports = {
    name: 'ar', 
    description: '[prefix]ar [new routine name] --> add a blank new routine',
    description2 : 'add a blank new routine',
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

            // get all the existing routines
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            const all_routines = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // counts the number of existing routines
            let num_of_routines = all_routines.length;
            // get the index of the new routine
            let new_routine_index = num_of_routines + 1;

            // assigns everything after the command name to be the new routine title
            let new_routine = '';
            for (let j = 0; j < args.length; j++) {
                new_routine += args[j] + ' ';
            }
            let new_routine_name = [[new_routine.trim()]];

            // update the list 
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A' + new_routine_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values : new_routine_name}
            }
            let uupdate = await gsapi.spreadsheets.values.update(update);

            // give feedback to the user
            message.channel.send('A new blank routine "' + new_routine_name + '" has been added!');
        }
    }
}