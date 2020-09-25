const functions = require('../functions/functions.js');
const fs = require('fs');

module.exports = {
	name: 'help',
	description: 'show available bot commands',
	execute(message, args, storage) {
        fs.readFile(storage.command.help.path.en, (error, data) => error ? console.error(error) : message.reply(`${message.author}, ${storage.dict.help.success}\n${data}`));
        console.log(functions);
    }
};