const fetch = require('node-fetch');
const functions = require('../functions/functions.js');

module.exports = {
	name: 'cat',
	description: 'sends random cat image 🐈',
	execute(message, args, storage) {
        getCatImage(message, storage.command.cat.url);
        if (message.channel.guild) {
            message.react(functions.getRandomEmoji(message.guild, storage.command.cat.emojis).id)
                .catch(() => console.error(storage.dict.error.reaction));
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
function getCatImage(message, url) {
    try {
        fetch(url)
            .then(response => response.json())
            .then(json => message.channel.send(json.file));
    } catch (error) {
        console.log(error);
    }
}