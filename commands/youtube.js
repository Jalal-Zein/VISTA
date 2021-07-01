const { execute } = require("./ping");

module.exports = {
    
    // name of the command and what the user would send / reference 
    name: 'youtube',
    description: 'sends youtube link to FMJaii\'s channel',
    description2: 'sends youtube link to FMJaii\'s channel',

    execute(client, message, args, Discord) {
        
        // sends the link to the channel in reference 
        message.channel.send('https://www.youtube.com/channel/UC6FDStWhAjgs04qZKcC-WSA?view_as=subscriber')
    }
}