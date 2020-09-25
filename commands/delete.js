const functions = require('../functions/functions.js');

module.exports = {
    name: 'delete',
    description: 'delete specified number of messages in current channel',
    execute(message, args, storage) {
        
        if (!functions.getRoleByName(message.member, 'Management')) { message.reply(`${storage.dict.delete.permission}`); return; }

        args.length > 0 ? !isNaN(args[0]) ? deleteMessages(message.channel, parseInt(args[0]) + 1) : message.channel.send(storage.dict.delete.nan) : message.channel.send(dict.delete.arguments);
    }
};

/**
 * Delete amount number of messages in specified channel
 * @param {Discord.Channel} channel 
 * @param {Number} amount 
 */
function deleteMessages(channel, amount) {
    channel.bulkDelete(amount)
        .then(messages => console.log(`Deleted ${messages.size - 1} messages in channel #${channel.name}`))
        .catch(console.error)
}

/**
 * Delete messages in current channel
 * @param {Discord.Message} message 
 */
async function bulkDelete(message) {
    const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
    const amount = args.join(' '); // Amount of messages which should be deleted

    if (!amount) return msg.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
    if (isNaN(amount)) return msg.reply('The amount parameter isn`t a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error

    if (amount > 100) return msg.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return msg.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

    await msg.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
        msg.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
        )
    });
}