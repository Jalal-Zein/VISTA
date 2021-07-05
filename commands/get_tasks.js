module.exports = {
    name: 'gt', 
    description: '[prefix]gt [task_list_name] --> items inside specified list',
    description2: 'items inside specified list',

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

            // sets the user specified task name to a variable
            let ulist = args[0];

            // creates a variable that will hold the row of the task list to be gotten
            let task_index;
            
            // gets all the titles of the tasks lists
            const all_lists = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Tasks!A:A',
            }
            let all_list_info_v = (await gsapi.spreadsheets.values.get(all_lists)).data.values;  

            // loops through all the list titles to find a match with the uesr specified name 
            // gets the index of the item that matches :D
            for (let i = 0; i < all_list_info_v.length; i++) {
                if (all_list_info_v[i][0] == ulist) {
                    task_index = i+1;
                }
            }

            // makes a workable string for the range below
            let xrange = 'Tasks!B' + task_index + ':Z' + task_index
            
            const list = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: xrange,
            }
            let list_info_v = (await gsapi.spreadsheets.values.get(list)).data.values;

           for (let i = 0; i < list_info_v[0].length; i++){
               if (list_info_v[0][i] !== ''){
                    message.channel.send(list_info_v[0][i]);
                }
            }
        }
    }
}
