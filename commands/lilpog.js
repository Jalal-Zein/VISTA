module.exports = {
    
    // name of the command and what the user will send 
    name: 'lilpog', 
    description: '[prefix]lilpog --> she guesses whether you are her little pogchamp',
    description2: 'she guesses whether you are her little pogchamp',

    execute(client, message, args, Discord){
       // sends an image at the link
        message.channel.send('https://i.kym-cdn.com/photos/images/original/001/945/570/977.jpg');
    }
}