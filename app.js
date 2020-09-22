// require the discord.js module and other config files
const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const fetch = require('node-fetch');
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

client.on('ready', () => {
    client.user.setPresence({
        status: config.status,
        activity: {
            name: config.activity.name,
            type: config.activity.type,
            url: config.activity.url
        }
    })
    console.log(`${client.user.tag} is up and running!`);
});

client.on('message', message => {

    if (message.channel.id == channel.bot.id && !message.author.bot) {
        //const name = message.guild.members.find(member => member.name == message.author.username);
        //const emoji = message.guild.emojis.find(emoji => emoji.name == emoji.mindset.PepeLaugh.name);
    }

    // pepelaugh react
    if (message.content.includes(emoji.mindset.PepeLaugh.name) && !message.author.bot) {
        message.react(emoji.mindset.PepeLaugh.id);
    }

    switch (message.author.id) {
        case user.doomed.id:
            /*
            message.react(getEmojiByName(message.guild, 'doomisx').id)
                .then(() => message.react('🇩'))
                .then(() => message.react('🇴'))
                .then(() => message.react(getEmojiByName(message.guild, 'OMEGALUL').id))
                .then(() => message.react('🇲'))
                .then(() => message.react('🇮'))
                .then(() => message.react('🇸'))
                .then(() => message.react('🇽'))
                .then(() => message.react(getEmojiByName(message.guild, 'doomisW').id))
                .catch(() => console.error(dict.error.reaction));
                */
            break;
        case user.audonte.id:
        //message.react(emoji.mindset.CoolStoryMilan.id)
    }

    if (message.channel.id == channel.recruit.id && message.author.username == user.recruit.username && message.content.includes(dict.recruit.final.men)) {
        message.react('👍')
            .then(() => message.react('👎'))
            .catch(() => console.error(dict.error.reaction));
    }

    // prefix command was sent
    if (message.content.startsWith(config.prefix)) {
        let commandObject = getCommandObject(message.content);
        if (validateCommand(commandObject.command)) {
            console.log(`command: ${commandObject.command}\nparams: ${commandObject.parameters}`);

            switch (commandObject.command) {
                case command.help.keyword:
                    executeHelp(message.author, message.channel);
                    break;
                case command.delete.keyword:
                    executeDelete(message.author, message.channel, message.member, commandObject.parameters);
                    break;
                case command.private.keyword:
                    executePrivate(message.author);
                    break;
                case command.role.keyword:
                    executeRole(message.author, message.channel, message.guild, commandObject.parameters);
                    break;
                case command.cat.keyword:
                    getCatImage(message.channel);
                    if (message.channel.guild) {
                        const emojis = ['mericCat', 'CatWhat', 'catJAM', 'ThumbUpCat'];
                        message.react(getRandomEmoji(message.guild, emojis).id)
                            .catch(() => console.error(dict.error.reaction));
                    }
                    else {
                        message.react('🐈');
                    }
                    //executeCat(message.channel, message.guild);
                    break;
                case command.dog.keyword:
                    executeDog(message.channel, message.guild);
            }
        }

        else {
            let response = `${mention(message.author.id)} ${dict.error.command}`;
            message.channel.send(response)
        }
    }

    // bot is mentioned
    if (message.content.includes(client.user.id)) {
        message.channel.send(`${mention(message.author.id)} ${getEmojiByName(message.guild, 'BOGGED')} ${dict.bot.response.mention}`)
            .then(() => message.react(getEmojiByName(message.guild, 'PepegaCall').id))
            .catch(() => console.error(dict.error.reaction));
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
        .then(messages => console.log(`Deleted ${messages.size - 1} messages in channel #${channel.name}`))
        .catch(console.error)
}

/**
 * Validates if keyword is valid command
 * @param {String} keyword f
 */
function validateCommand(keyword) {
    for (let key in command) {
        if (command[key].keyword == keyword) {
            return true;
        }
    }
    return false;
}

/**
 * Returns discord mention format for specific type and id
 * @param {Number} id 
 * @param {String} type 
 */
function mention(id, type = 'author') {
    switch (type) {
        case 'author':
            return `<@${id}>`
        case 'channel':
            return `<#${id}>`
        case 'role':
            return `<@&${id}>`
        default:
            return false;
    }
}

/**
 * Returns first word as command and remaining as parameters
 * @param {String} content 
 */
function getCommandObject(content) {
    const args = content.split(' ');
    return args.length > 0 ? {
        command: args[0].slice(1),
        parameters: args.slice(1)
    } : false;
}

/**
 * Get emoji object by name from server or client cache
 * @param {Discord.Client | Discord.Guild} object
 * @param {String} name 
 */
function getEmojiByName(object, name) {
    return object.emojis.cache.find(emoji => emoji.name == name);
}

/**
 * Get role object by name from server or member cache
 * @param {Discord.User | Discord.Guild} object 
 * @param {String} name 
 */
function getRoleByName(object, name) {
    return object.roles.cache.find(role => role.name == name);
}

/**
 * Return random emoji from array
 * @param {Discord.Guild} guild 
 * @param {Array} emojis 
 */
function getRandomEmoji(guild, emojis) {
    const index = Math.floor(Math.random() * emojis.length);
    return getEmojiByName(guild, emojis[index]);
}


/**
 * Send help to current channel
 * @param {Discord.User} author 
 * @param {Discord.Channel} channel 
 */
function executeHelp(author, channel) {
    fs.readFile(command.help.path, (error, data) => error ? console.error(error) : channel.send(`${mention(author.id)} ${dict.help.success}\n${data}`));
}

/**
 * Delete messeges from current channel
 * @param {Discord.User} author
 * @param {Discord.Channel} channel 
 * @param {Discord.User} member
 * @param {Array} parameters 
 */
function executeDelete(author, channel, member, parameters) {
    if (getRoleByName(member, 'Management')) {
        parameters > 0 ? !isNaN(parameters[0]) ? deleteMessages(channel, parseInt(parameters[0]) + 1) : channel.send(dict.delete.nan) : channel.send(dict.delete.arguments);
    }
    else {
        channel.send(`${author} ${dict.delete.permission}`);
    }
}

/**
 * Send private message to user
 * @param {Discord.User} author 
 */
function executePrivate(author) {
    author.send(dict.private.success).catch(console.error);
}

/**
 * Show members for specified role
 * @param {Discord.User} author 
 * @param {Discord.Channel} channel 
 * @param {Discord.Guild} guild 
 * @param {Array} parameters 
 */
function executeRole(author, channel, guild, parameters) {
    if (guild && parameters.length > 0) {
        let members = guild.members.cache.filter(member => member.roles.cache.find(role => role.name == parameters[0]))
            .map(member => member.user.username);

        members.length > 0 ? channel.send(`>>> **Total: ${members.length}**\n${members.join('\n')}`) : channel.send(`${author} "${parameters[0]}" ${dict.role.missing}`);
    }
    else {
        channel.send(`${author} ${dict.role.arguments}`);
    }
}

/**
 * Send random cat emoji
 * @param {Discord.Channel} channel 
 * @param {Discord.Guild} guild 
 */
function executeCat(channel, guild) {
    const emojis = ['mericCat', 'CatWhat', 'catJAM', 'ThumbUpCat']
    channel.send(`${getRandomEmoji(guild, emojis)}`);
}

/**
 * Send random dog emoji
 * @param {Discord.Channel} channel 
 * @param {Discord.Guild} guild 
 */
function executeDog(channel, guild) {
    const emojis = ['WoweeW'];
    channel.send(`${getRandomEmoji(guild, emojis)}`);
}

/**
 * Send random cat picture to channel
 * @param {Discord.Channel} channel 
 */
function getCatImage(channel) {
    try {
        fetch('https://aws.random.cat/meow')
            .then(response => response.json())
            .then(json => channel.send(json.file));
    } catch (err) {
        console.log(err);
    }
}