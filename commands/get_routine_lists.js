module.exports = {
    name: 'grl', 
    description: '[prefix]grl --> gets the titles of all the existing routines',
    description2: 'gets the titles of all existing routines',
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

            // gets the values of all the cells in the first column of the sheet
            // which should be the routines titles
            const routines = {
                spreadsheetId: '1Q4ZlP7dChLUfMiY19-c6PpHvyg6WWqsCU8e6LabuTHQ',
                range: 'Routines!A:A'
            }
            let routines_list = (await gsapi.spreadsheets.values.get(routines)).data.values;

            // loops through all the routine titles and sends them individually
            for (x of routines_list) {
                message.channel.send(x)
            }

        }
    }
}