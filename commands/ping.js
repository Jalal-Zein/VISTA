module.exports = {
    
    // name of the command and what the user would send 
    name: 'ping', 
    description: 'responds to YOUR pings, with pongs!!',
    description2: 'responds to YOUR pings, with pongs!!',

    execute(client, message, args, Discord){
        
        // sends "pong!!"
        message.channel.send('pong!!');
    }
}
