module.exports = {
    name: 'dt', 
    description: '[prefix]dt [task_list_name] [task_index] --> deletes the task (and organizes the remaining tasks)',
    description2: 'deletes the task (and organizes the remaining tasks)',

    execute(client, message, args, Discord) {
         // makes a google object to interact with
		const { google, prod_tt_sasportal_v1alpha1 } = require('googleapis');
        
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

            // setting up the task list targeted 
            let task_list_name = args[0];
            
            // creates a variable that will hold the row of the task list to be gotten
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

            //from here on out it is experimenting with the edit/add differentiation
            
            let yyrange = 'Tasks!B' +  tl_index + ':Z' + tl_index;

            const ugly = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: yyrange,
            }
            let hahaha = (await gsapi.spreadsheets.values.get(ugly)).data.values;
            let num_of_tasks = hahaha[0].length;

            // turns the string type provided index into a letter using ASCII
            let task_index_letter = String.fromCharCode(65 + parseInt(args[1]));
            
            
            let uif = [[""]];

            // makes a range string based on the task list title and task index
            let xxrange = 'Tasks!' + task_index_letter + tl_index;
        
            // updates the values on the sheet
            const decent = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: xxrange,
                valueInputOption: 'USER_ENTERED',
                resource : {values : uif} 
            }
            let resp = await gsapi.spreadsheets.values.update(decent);

            // from here on out its the process of organising the tasks to get rid of empty cells in between

            for (let i = 0; i < (num_of_tasks - parseInt(args[1]) + 2); i++) {
                
                // the abscissa of the current cell
                let current_cell_abscissa = String.fromCharCode(66 + i + parseInt(args[1]));

                // range of the current cell 
                let current_cell_range = 'Tasks!' + current_cell_abscissa + tl_index;

                // this one will get the current temp value
                let ttv = {
                    spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                    range: current_cell_range
                }
                let temp_task_value = (await gsapi.spreadsheets.values.get(ttv)).data.values;
                
                // old thing is the abscissa of the previous cell
                let previous_cell_abscissa = String.fromCharCode(65 + i + parseInt(args[1]));
                let previous_cell_range = 'Tasks!' + previous_cell_abscissa + tl_index;

                if (temp_task_value == undefined) {
                    temp_task_value = [['']];
                }

                // this one will update the value. needs a range of previous and current temp value
                let ohgod = {
                    spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                    range: previous_cell_range,
                    valueInputOption: 'USER_ENTERED',
                    resource: {values: temp_task_value}
                }
                let ohgodhelpme = await gsapi.spreadsheets.values.update(ohgod);

                // feedback to the user 
                message.channel.send('Task ' + args[1] + ' of list "' + args[0] + '" has been deleted!')
            } 
        }
    }
}