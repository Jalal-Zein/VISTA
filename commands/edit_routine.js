module.exports = {
    name: 'er', 
    description: '[prefix]er [old routine name] [new routine name] --> changes the title of an existing routine',
    description2: 'changes the title of an existing routine',
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

            // assign the old routine name
            let old_routine_name = args[0];

            // assign the new routine name (everything after the first arg)
            let nrn = '';
            for (let i = 1; i < args.length; i++) {
                nrn += args[i];
            }
            let new_routine_name = [[nrn.trim()]];

            // get all existing routines 
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            } 
            let all_routines = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // loop through all the existing routines and get the index of the match
            let old_routine_index;
            for (let i = 0; i < all_routines.length; i++) {
                if (all_routines[i] == old_routine_name) {
                    old_routine_index = i + 1;
                }
            }

            // update the value 
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A' + old_routine_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values: new_routine_name}
            }
            let do_update = await gsapi.spreadsheets.values.update(update);

            // give the user feedback
            message.channel.send('"' + old_routine_name + '" has been updated to be "' + new_routine_name + '"!');
        }
    }
}