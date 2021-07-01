module.exports = {
    
    // name of the command and what the user would send / reference 
    name: 'opgg',
    description: 'links to YOUR op.gg!!',
    description2: 'links to YOUR op.gg!!',

    execute(client, message, args, Discord) {
        
        // sends the link to the channel in reference
        message.channel.send('https://eune.op.gg/summoner/userName=FMJaii');

        // just testing how to import functions from other files
        // const tools = require(`../helper functions/tools.js`);
        // tools.out_formatter('gay');
    }
}
