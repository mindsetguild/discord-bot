const fetch = require('node-fetch');
const functions = require('../functions/functions.js');

module.exports = {
	name: 'cat',
	description: 'sends random cat image 🐈',
	execute(message, args, storage) {
        getCatImage(message, storage);
        if (message.channel.guild) {
            message.react(functions.getRandomEmoji(message.guild, storage.command.cat.emojis).id)
                .catch(error => { console.error(error); message.reply(`${storage.dict.error.reaction}`); });
        }
        else {
            message.react('🐈');
        }
    }
};

/**
 * Send random cat picture to channel
 * @param {Discord.Channel} channel 
 */
function getCatImage(message, storage) {
    try {
        fetch(storage.command.cat.url)
            .then(response => response.json())
            .then(json => message.channel.send(json.file));
    } catch (error) {
        console.error(error);
        message.reply(`${storage.dict.cat.error}`);
    }
}