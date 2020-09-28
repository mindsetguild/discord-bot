// require the discord.js module and other config files
const Discord = require('discord.js');
const { prefix, token, status, activity } = require('./config.json');
const fs = require('fs');
const functions = require('./functions/general.js');
const db = require('./functions/database.js');

// individual modules
const recruit = require('./recruit/recruit.js');

// create a new discord client and load command storage files and local database
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

client.db = new Discord.Collection();
client.db.set('user', db.model.user(db.connection()));

// this event will only trigger one time after logging in
client.once('ready', () => {
    // connected
    console.log(`${client.user.tag} ${client.storage.get('en').system.ready}`);
    // synchronize user database model
    client.db.get('user').sync();
});

// set status when bot is ready
client.on('ready', () => {

    // set bot status and activity
    client.user.setPresence({
        status: status,
        activity: activity,
    });

    // bot is running
    console.log(`${client.user.tag} ${client.storage.get('en').system.running}`);

    // start checking for new applications
    recruit.execute(client);
});

// message is sent
client.on('message', message => {
    // check if user is in db and set language if user is found
    db.user.getUserById(message.author.id, client.db.get('user')).then(response => {
        // development channel log
        if (message.guild && message.channel == functions.getChannelByName(message.guild, client.storage.get('channel').bot.name) && !message.author.bot) {
            // console.log(message);
        }

        // dm log
        if (message.channel.type == 'dm' && !message.author.bot) {
            console.log(`${message.author.username}: ${message.content}`);
        }

        // pepelaugh react
        if (message.guild && message.content.includes(functions.getEmojiByName(message.guild, 'PepeLaugh')) && !message.author.bot) {
            message.react(functions.getEmojiByName(message.guild, 'PepeLaugh').id);
        }

        // bot is mentioned
        if (message.guild && message.content.includes(client.user.id)) {
            message.reply(`${client.storage.get('en').bot.response.mention} ${functions.getEmojiByName(message.guild, 'BOGGED')}`)
                .then(() => message.react(functions.getEmojiByName(message.guild, 'PepegaCall').id))
                .catch(error => { console.error(error); message.reply(`${client.storage.get('en').error.reaction}`); });
        }

        // prefix command was sent
        if (message.content.startsWith(prefix) && !message.author.bot) {

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();


            // storage object for commands
            const storage = {
                command: client.storage.get('command'),
                dict: response ? client.storage.get(response.get('language')) : client.storage.get('en'),
                user: client.storage.get('user'),
                emoji: client.storage.get('emoji'),
                channel: client.storage.get('channel'),
                db: {
                    user: client.db.get('user'),
                },
            };

            // command not found
            if (!client.commands.has(commandName)) {
                message.reply(`${storage.dict.error.missing}`);
                return;
            }
            // try to execute command
            try {
                client.commands.get(commandName).execute(message, args, storage);
            }
            catch (error) {
                console.error(error);
                message.reply(`${storage.dict.error.command}`);
            }
        }
    });
});

// login to Discord with your app's token
client.login(token);