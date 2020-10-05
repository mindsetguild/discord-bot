const Discord = require('discord.js');
const { prefix, color, logo, languages } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'show available bot commands',
	execute(message, args, storage) {
		sendHelpMessage(message, storage);
		// fs.readFile(storage.command.help.path.en, (error, data) => error ? console.error(error) : message.reply(`${message.author}, ${storage.dict.help.success}\n${data}`));
	},
};

/**
 * Send embed message with help information
 * @param {Discord.Message} message
 * @param {Object} storage
 */
function sendHelpMessage(message, storage) {
	const embedMessage = new Discord.MessageEmbed()
		.setAuthor(storage.dict.help.title, logo.small)
		.setColor(color)
		.addFields(
			{
				name: storage.dict.help.embed.general.title,
				value: `\`${prefix}${storage.command.help.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.general.help}
				\`${prefix}${storage.command.delete.keyword} ${storage.command.delete.args || ''}\` - ${storage.dict.help.embed.general.delete}
				\`${prefix}${storage.command.role.keyword} ${storage.command.role.args || ''}\` - ${storage.dict.help.embed.general.role}
				\`${prefix}${storage.command.cat.keyword} ${storage.command.cat.args || ''}\` - ${storage.dict.help.embed.general.cat}
				\`${prefix}${storage.command.idea.keyword} ${storage.command.idea.args || ''}\` - ${storage.dict.help.embed.general.idea}
				\`${prefix}${storage.command.set.keyword} ${storage.command.set.args || ''}\` - ${storage.dict.help.embed.general.set}`,
			},
			{
				name: storage.dict.help.embed.set.title,
				value: `\`${prefix}${storage.command.set.keyword} ${storage.command.set.attributes.language.keyword[0]} ${storage.command.set.attributes.language.args || ''}\` - ${storage.dict.help.embed.set.language} (${languages.join(', ')})`,
			},
		);

	message.reply(embedMessage).then(() => {
		const helpMessage = message.channel.lastMessage;
		helpMessage.react('🇭')
			.then(() => helpMessage.react('🇪'))
			.then(() => helpMessage.react('🇱'))
			.then(() => helpMessage.react('🇵'))
			.catch(error => { console.error(error); message.reply(`${storage.dict.error.reaction}`); });
	});
}