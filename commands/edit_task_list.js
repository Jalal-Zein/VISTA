module.exports = {
    name: 'etl', 
    description: '[prefix]etl [task_list_name] [new_task_list_name] --> changes old title of the specified task list to a new specified one',
    description2: 'changes old title of the specified task list to a new specified one',

    /* 
    THIS COMMAND ONLY WORKS WITH TASK LISTS THAT ARE ONE WORD 
    NEW TASK LIST COULD BE MADE TO BE MORE THAN ONE WORD BUT WAS NOT BECAUSE I FEEL BAD FOR THE FIRST VARIABLE
    PLEASE FIGURE OUT A WAY TO FIX THIS BECAUSE IT *WILL* RESULT IN ISSUES AND ERRORS EVENTUALLY
    */

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

            // specifying the targeted list 
            let task_list_name = args[0];

            // assigning the new name 
            let new_task_list_name = [[args[1]]];

            // gets all the tasks 
            const all_task_lists = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Tasks!A:A'
            }
            let all_tl = (await gsapi.spreadsheets.values.get(all_task_lists)).data.values;

            // loops through all the tasks lists to find the index of the target list
            let tl_index;
            for (let x = 0; x < all_tl.length; x++)  {
                if (all_tl[x][0] == task_list_name) {
                    tl_index = x + 1;
                }
            }

            // make a range 
            let ggrange = 'Tasks!A' + tl_index;

            // update the value
            const update = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: ggrange,
                valueInputOption: 'USER_ENTERED',
                resource: {values: new_task_list_name}
            }
            let updated = await gsapi.spreadsheets.values.update(update);

            // give the user feedback
            message.channel.send(task_list_name + ' has been updated to : ' + new_task_list_name);
            
        }
    }
}