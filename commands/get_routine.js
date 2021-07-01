module.exports = {
    name: 'grx', 
    description: '[prefix]grx [routine name] --> gets all the tasks within that routine',
    description2: 'gets all the tasks within that routine',
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

            // sets the user specified routine
            let routine = args[0].trim();

            // creates the variable that will hold the index of the routine
            let routine_index;

            // get titles of all the routines
            const all_routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            let all_routines_info = (await gsapi.spreadsheets.values.get(all_routines)).data.values;

            // loops through all the routine titles to find a match with the user specified one
            // gets the index of the item that matches
            for (let i = 0; i < all_routines_info.length; i++) {
                if (all_routines_info[i][0] == routine) {
                    routine_index = i+1;
                    break;
                }
            }
            
            // makes a string that can be understood
            let rrange = 'Routines!B' + routine_index + ':Z' + routine_index;
            
            // gets the content of the row specified 
            const routine_tasks = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: rrange
            }
            let routine_tasks_final = (await gsapi.spreadsheets.values.get(routine_tasks)).data.values;

            // loops through the tasks to send them individually
            for (let i = 0; i < routine_tasks_final[0].length; i++) {
                if (routine_tasks_final[0][i] !== '') {
                    message.channel.send(routine_tasks_final[0][i]);
                }
            }

        }
    }
}