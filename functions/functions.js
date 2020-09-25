const { Client, Guild } = require("discord.js");

module.exports = {
    /**
     * Returns discord mention format for specific type and id
     * @param {Number} id 
     * @param {String} type 
     */
    mention: function (id, type = 'author') {
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
    },

    /**
     * Get emoji object by name from server or client cache
     * @param {Discord.Client | Discord.Guild} object
     * @param {String} name 
     */
    getEmojiByName: function (object, name) {
        return object.emojis.cache.find(emoji => emoji.name == name);
    },

    /**
     * Get role object by name from server or member cache
     * @param {Discord.User | Discord.Guild} object 
     * @param {String} name 
     */
    getRoleByName: function (object, name) {
        return object.roles.cache.find(role => role.name == name);
    },

    /**
     * Get channel object by name from server or client cache
     * @param {Discord.Client | Discord.Guild} object 
     * @param {String} name
     */
    getChannelByName: function (object, name) {
        return object.channels.cache.find(channel => channel.name == name);
    },

    /**
     * Return random emoji from array
     * @param {Discord.Guild} guild 
     * @param {Array} emojis 
     */
    getRandomEmoji: function (guild, emojis) {
        const index = Math.floor(Math.random() * emojis.length);
        return this.getEmojiByName(guild, emojis[index]);
    }
}