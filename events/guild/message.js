module.exports = (client, Discord, message) => {
	
	// the prefix the bot will be looking for 
	const prefix = '..';
	
	// ignore the message if it doesnt start with the prefix or if it was sent by the bot itself
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// seperates the message into the command and the prefix 
	const args = message.content.slice(prefix.length).split(/ +/);
	
	// shifts the command to lowercase 
	const cmnd = args.shift().toLowerCase();

	// gets the command file according to the command in the message 
	const command = client.commands.get(cmnd);

	// if the command exists, execute it 
	if (command) command.execute(client, message, args, Discord);
}