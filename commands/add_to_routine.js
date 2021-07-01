module.exports = {
    name: 'atr', 
    description: '[prefix]atr [routine] [task] --> adds a task to a routine',
    description2: 'adds a task to a routine',
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

            // assign the first argument to be the targeted routine
            let t_routine = args[0].trim();

            // assigns everything after the first argument to be the new task
            let task_to_add = "";
            for (let i = 1; i < args.length; i++) {
                task_to_add += args[i] + ' ';
            }
            let tad = [[task_to_add.trim()]];

            // making the variable that will hold the routine index
            let r_index;

            // gets the values of all the cells in the first column of the sheet
            // which should be the routines titles
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            let routines_list = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // loops through all the routine titles to find a match with the user specified name
            // gets the index of the item that matches
            for (let i = 0; i < routines_list.length; i++) {
                if (routines_list[i][0] == t_routine) {
                    r_index = i+1;
                }
            }

            // gets the number of tasks currently present in the target routine
            let yyrange = 'Routines!B' + r_index + ':Z' + r_index;
            const one = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: yyrange,
            }
            let two = await gsapi.spreadsheets.values.get(one);
            let num_of_tasks;
            try {
                let three = two.data.values;
                num_of_tasks = three[0].length;
            } catch {
                num_of_tasks = 0;
            }

            // determines the first unoccupied slot to add to
            let target_task_index = String.fromCharCode(66 + num_of_tasks);

            // updating the target cell with the task
            const four = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!' + target_task_index + r_index,
                valueInputOption: 'USER_ENTERED',
                resource: {values : tad}
            }
            let five = await gsapi.spreadsheets.values.update(four);

            // giving the user feedback
            message.channel.send('A new task "' + task_to_add + '" has been added to "'+ t_routine + '"!');
            
        }
    }
}