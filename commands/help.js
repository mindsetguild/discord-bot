const Discord = require('discord.js');
const { prefix, color, logo } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'show available bot commands',
	execute(message, args, storage) {
		sendHelpMessage(message, storage);
		// fs.readFile(storage.command.help.path.en, (error, data) => error ? console.error(error) : message.reply(`${message.author}, ${storage.dict.help.success}\n${data}`));
	},
};

function sendHelpMessage(message, storage) {
	const title = storage.command.help.keyword.charAt(0).toUpperCase() + storage.command.help.keyword.slice(1);
	const embedMessage = new Discord.MessageEmbed()
		.setAuthor(title, logo.small)
		.setColor(color)
		.addFields(
			{
				name: '\u200b',
				value: `\`${prefix}${storage.command.help.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.command.help}
				\`${prefix}${storage.command.delete.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.command.delete}
				\`${prefix}${storage.command.role.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.command.role}
				\`${prefix}${storage.command.cat.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.command.cat}
				\`${prefix}${storage.command.idea.keyword} ${storage.command.help.args || ''}\` - ${storage.dict.help.embed.command.idea}`,
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