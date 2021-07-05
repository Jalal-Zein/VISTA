module.exports = {
    name: 'et', 
    description: '[prefix]et [task_list_name] [task_index] [new_values] --> changes arg task of arg list to arg value',
    description2: 'changes arg task of arg list to arg value',

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

            if (parseInt(args[1]) > num_of_tasks) {
                message.channel.send('You cannot edit a task that doesn\'t exist! Pay attention to the index you provided.')
            } else {

                // turns the string type provided index into a letter using ASCII
                let task_index_letter = String.fromCharCode(65 + parseInt(args[1]));
            
                // loops through all args after the second to make a string that will be uinput
                let uinput = "";
                for (let i = 2; i < args.length; i++) {
                    uinput += args[i] + ' ';
                }
                let uif = [[uinput]];

                // makes a range string based on the task list title and task index
                let xxrange = 'Tasks!' + task_index_letter + tl_index;

                // old task value
                const better = {
                    spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                    range: xxrange,
                }
                let old_task_value = (await gsapi.spreadsheets.values.get(better)).data.values;
            
                // updates the values on the sheet
                const good = {
				    spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
				    range: xxrange,
				    valueInputOption: 'USER_ENTERED',
                    resource : {values : uif} 
                }
			    let resp = await gsapi.spreadsheets.values.update(good);

                message.channel.send('" ' + old_task_value + '" has been updated to "' + task_list_name + '" !')
            }
        }
    }
}