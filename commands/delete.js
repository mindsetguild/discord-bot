const functions = require('../functions/general.js');

module.exports = {
    name: 'delete',
    description: 'delete specified number of messages in current channel',
    execute(message, args, storage) {

        if (!functions.getRoleByName(message.member, 'Management')) {
            message.reply(`${storage.dict.delete.permission}`);
            return;
        }

        args.length > 0 ? !isNaN(args[0]) ? deleteMessages(message, parseInt(args[0]) + 1, storage) : message.reply(`${storage.dict.delete.nan}`) : message.reply(`${storage.dict.delete.arguments}`);
    },
};

/**
 * Delete amount number of messages in specified channel
 * @param {Discord.Channel} channel
 * @param {Number} amount
 * @param {Object} storage
 */
function deleteMessages(message, amount, storage) {
    message.channel.bulkDelete(amount)
        .then(messages => console.log(`Deleted ${messages.size - 1} messages in channel #${message.channel.name}`))
        .catch(error => { console.error(error); message.reply(`${storage.dict.delete.error}`); });
}