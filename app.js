// require the discord.js module and other config files
const Discord = require('discord.js');
const { prefix, token, status, activity } = require('./config.json');
const fs = require('fs');
const functions = require('./functions/functions.js');

// individual modules
const recruit = require('./recruit/recruit.js');

// create a new discord client and load command and storage files
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.storage = new Discord.Collection();
const storageFiles = fs.readdirSync('./storage').filter(file => file.endsWith('.json'));
for (const file of storageFiles) {
    const storage = require(`./storage/${file}`);
    client.storage.set(file.split('.')[0], storage);
}

// this event will only trigger one time after logging in
client.once('ready', () => {
    // connected
    console.log(client.storage.get('dictionary').system.ready);
});

// set status when bot is ready
client.on('ready', () => {
    client.user.setPresence({
        status: status,
        activity: activity
    })

    // bot is running
    console.log(`${client.user.tag} ${client.storage.get('dictionary').system.running}`);

    // start checking for new applications
    recruit.execute(client);
});

// message is sent
client.on('message', message => {
    // development channel log
    if (message.guild && message.channel == functions.getChannelByName(message.guild, client.storage.get('channel').bot.name) && !message.author.bot) {
        console.log(message);
    }

    // dm log
    if (message.channel.type == 'dm' && !message.author.bot) {
        console.log(`${message.author.tag}: ${message.content}`);
    }

    // pepelaugh react
    if (message.guild && message.content.includes(functions.getEmojiByName(message.guild, 'PepeLaugh')) && !message.author.bot) {
        message.react(functions.getEmojiByName(message.guild, 'PepeLaugh').id);
    }

    // bot is mentioned
    if (message.guild && message.content.includes(client.user.id)) {
        message.reply(`${client.storage.dictionary.bot.response.mention} ${getEmojiByName(message.guild, 'BOGGED')}`)
            .then(() => message.react(getEmojiByName(message.guild, 'PepegaCall').id))
            .catch(error => { console.error(error); message.reply(`${client.storage.get('dictionary').error.reaction}`); });
    }

    // prefix command was sent
    if (message.content.startsWith(prefix) && !message.author.bot) {

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        // storage object for commands
        const storage = {
            command: client.storage.get('command'),
            dict: client.storage.get('dictionary'),
            user: client.storage.get('user'),
            emoji: client.storage.get('emoji'),
            channel: client.storage.get('channel'),
        }

        // try to execute command
        try {
            client.commands.get(commandName).execute(message, args, storage);
        } catch (error) {
            console.error(error);
            message.reply(`${client.storage.get('dictionary').error.command}`);
        }
    }
});

// login to Discord with your app's token
client.login(token);
