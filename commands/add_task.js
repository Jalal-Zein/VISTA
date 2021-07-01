module.exports = {
    name: 'at', 
    description: '[prefix]at [task_list_name] [task_to_add] --> adds a new task at the end of a specified list',
    description2: 'adds a new task at the end of a specified list',

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

            // assigns all args after the first to be the task value to be added
            let task_to_add = "";
            for (let i = 1; i < args.length; i++) {
                task_to_add += args[i] + ' ';
            }
            let tad = [[task_to_add.trim()]];

            // assigns the first arg to be the target list 
            let task_list_name = args[0];
            

            let tl_index;

            // gets all the titles of the tasks lists
            const all_lists = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				range: 'Tasks!A:A',
            }
            let all_list_info_v = (await  gsapi.spreadsheets.values.get(all_lists)).data.values;
            

            // loops through all the list titles to find a match with the uesr specified name 
            // gets the index of the item that matches :D
            for (let i = 0; i < all_list_info_v.length; i++) {
                if (all_list_info_v[i][0] == task_list_name) {
                    tl_index = i+1;
                }
            }
            
            //gets the number of tasks currently presnet in the target list
            let yyrange = 'Tasks!B' +  tl_index + ':Z' + tl_index;
            const ugly = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: yyrange,
            }
            let haha = await gsapi.spreadsheets.values.get(ugly);
            let num_of_tasks;
            try {
                let hahaha = haha.data.values;
                num_of_tasks = hahaha[0].length;
            } catch {
                num_of_tasks = 0;
            }
            

            // determines the first unoccupied slot to add to it 
            let abscissa = String.fromCharCode(66 + num_of_tasks);

            // do i need to explain ?
            let rrrange = 'Tasks!' + abscissa + tl_index;

            // actually updating the cell
            const mo = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: rrrange,
                valueInputOption: 'USER_ENTERED',
                resource: {values: tad}
            }
            let momo = await gsapi.spreadsheets.values.update(mo);
            
            // feedback to the user
            message.channel.send('A new task "' + task_to_add + '" has been added to ' + task_list_name);

        }
    }
}