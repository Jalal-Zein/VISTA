module.exports = {
    name: 'dtl', 
    description: '[prefix]dtl [task_list_name] --> deletes the task list and all its contents',
    description2: 'deletes the task list and all its contents',

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

            // assigns all the arguments to be the task list title
            let task_list_name = '';
            for (let j = 0; j < args.length; j++) {
                task_list_name += args[j];
            }
            let tl_name = task_list_name.trim();

            // get all the tasks lists
            const all_tasks_lists = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Tasks!A:A'
            }
            let all_tl = (await gsapi.spreadsheets.values.get(all_tasks_lists)).data.values;

            // find the index of the required task list
            let tl_index;
            for (let x = 0; x < all_tl.length; x++) {
                let wtf = (all_tl[x][0]).trim();
                if (wtf == tl_name) {
                    tl_index = x + 1;
                }
            }

            // COMPLETE HERE // 
            let replacement = [['', '', '', '', ]];
            const maybe = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Tasks!A' + tl_index + ':Z' + tl_index,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: replacement
                } 
            }
            let mmaybe = await gsapi.spreadsheets.values.update(maybe);
            
            // feedback to the user
            message.channel.send('Task list "' + task_list_name + '" has been deleted.');
        }
    }
}