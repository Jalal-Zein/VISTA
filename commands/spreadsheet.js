const { execute } = require("./ping");

module.exports = {
    
    // name of the command and what the user would send / reference 
    name: 'sheet',
    description: '[prefix]sheet --> sends a link to the spreadsheet that DARA runs on',
    description2: 'sends a link to the spreadsheet that DARA runs on',

    execute(client, message, args, Discord) {
        
        // sends the link to the channel in reference 
        message.channel.send('https://docs.google.com/spreadsheets/d/1EbdTodl_ZwQNLbEDHwpPhWLkYTCqH6sDGISSTF0PuPg/edit#gid=0')
    }
}