// require the discord.js module and other config files
const Discord = require('discord.js');
const config = require('./config.json');
const dict = require('./storage/dictionary.json');
const emoji = require('./storage/emoji.json');
const user = require('./storage/user.json');
const channel = require('./storage/channel.json');
const command = require('./storage/command.json');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log(dict.system.ready);
});

client.on('message', message => {
    if (message.channel.id == channel.bot.id) {
        console.log(message);
        //const name = message.guild.members.find(member => member.name == message.author.username);
        //const emoji = message.guild.emojis.find(emoji => emoji.name == emoji.mindset.PepeLaugh.name);
    }

    if (message.content.includes(emoji.mindset.PepeLaugh.name) && message.author.id != config.bot) {
        message.react(emoji.mindset.PepeLaugh.id);
    }

    switch (message.author.id) {
        case user.doomed.id:
            //message.react(emoji.mindset.doomisx.id);
            break;
        case user.audonte.id:
            //message.react(emoji.mindset.CoolStoryMilan.id)
    }

    if (message.channel.id == channel.recruit.id && message.author.username == user.recruit.username && message.content.includes(dict.recruit.final.men)) {
        message.react('👍')
            .then(() => message.react('👎'))
            .catch(() => console.error(dict.error.reaction));
    }

    if (message.content.startsWith(config.prefix + command.delete) && message.author.id == user.rothius.id) {
        const args = message.content.split(' ').slice(1);
        console.log(args.length);
        args.length > 0 ? !isNaN(args[0]) ? deleteMessages(message.channel, parseInt(args[0]) + 1) : message.channel.send(dict.delete.nan) : message.channel.send(dict.delete.arguments);
    }
});

// login to Discord with your app's token
client.login(config.token);

/**
 * Delete messages in current channel
 * @param {Discord.Message} message 
 */
async function deleteMessages(message) {
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

/**
 * Delete amount number of messages in specified channel
 * @param {Discord.Channel} channel 
 * @param {Number} amount 
 */
function deleteMessages(channel, amount) {
    channel.bulkDelete(amount)
        .then(messages => console.log(`Bulk deleted ${messages.size - 1} messages`))
        .catch(console.error)
}