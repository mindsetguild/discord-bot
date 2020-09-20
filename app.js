// require the discord.js module
const Discord = require('discord.js');
const config = require('./config.json');
const dict = require('./storage/dictionary.json');
const emoji = require('./storage/emoji.json');
const user = require('./storage/user.json');
const channel = require('./storage/channel.json')


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log(dict.system.ready);
});

client.on('message', message => {
    if (message.channel.id == channel.bot_dev.id) {
        //var name = message.guild.members.find(member => member.name == message.author.username);
        //var emoji = message.guild.emojis.find(emoji => emoji.name == emoji.mindset.PepeLaugh.name);

        message.react('🍎')
        .then(() => message.react('🍊'))
        .then(() => message.react('🍇'))
        .catch(() => console.error('One of the emojis failed to react.'));

        console.log(message);
    }

    if (message.content.includes(emoji.mindset.PepeLaugh.name) && message.author.id != config.bot) {
        message.react(emoji.mindset.PepeLaugh.id);
    }

    switch (message.author.id) {
        case user.doomed.id:
            message.react(emoji.mindset.doomisx.id);
            break;
        case user.audonte.id:
            message.react(emoji.mindset.CoolStoryMilan.id)
    }
});

// login to Discord with your app's token
client.login(config.token);