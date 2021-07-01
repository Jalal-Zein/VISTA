module.exports = {
    name: 'test', 
    description: 'i literally wouldn\'t be able to tell you. just read the code if you wanna know or something',
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

			let uinput = args.join(" ");
            console.log('uinput : ' + uinput);
            console.log(typeof uinput);
            
            //trying to make uimput into a list in a list so maybe the error is solved
            let uilist = [[uinput]];
			
			const bad = {
				spreadsheetId: '1EbdTodl_ZwQNLbEDHwpPhWLkYTCqH6sDGISSTF0PuPg',
				range: 'Tasks!B1',
				valueInputOption: 'USER_ENTERED',
                resource : {values : uilist} 
			}
			let resp = await gsapi.spreadsheets.values.update(bad);
			//console.log(resp);
            
        }
    }
}