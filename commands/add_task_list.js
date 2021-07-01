module.exports = {
    name: 'atl', 
    description: '[prefix]atl [new_task_list_name] --> makes a new empty list titled [new_task_list_name]',
    description2: 'makes a new empty list titled [new_task_list_name]',
    
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

            // get a list of all the existing tasks
            const il = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Tasks!A:A'
            }
            let sam = (await gsapi.spreadsheets.values.get(il)).data.values;

            // gets the index of the new list 
            // makes a string range based on the index 
            let new_tl_index = sam.length + 1;
            let qqrange = 'Tasks!A' + new_tl_index;

            // assigns everything after the command name to be the new list title/name
            let new_task_list_name = '';
            for (let j = 0; j < args.length; j++) {
                new_task_list_name += args[j] + ' ';
            }
            let new_tl_name = [[new_task_list_name.trim()]];

            // actually updates the cell with the task list title
            const wa7ad = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: qqrange,
                valueInputOption: 'USER_ENTERED',
                resource: {values: new_tl_name}
            }
            let tnen = await gsapi.spreadsheets.values.update(wa7ad);

            // feedback to the user    
            message.channel.send('A new blank list "' + new_tl_name + '" has been added!');

        }
    }
}