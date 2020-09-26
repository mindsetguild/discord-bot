module.exports = {
    name: 'role',
    description: 'show all users for specified role name',
    execute(message, args, storage) {

        if (!message.guild || args.length < 1) {
            message.reply(`${storage.dict.role.arguments}`);
            return;
        }

        const members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role.name == args[0]))
            .map(member => member.user.username);

        members.length > 0 ? message.channel.send(`>>> **Total: ${members.length}**\n${members.join('\n')}`) : message.reply(`"${args[0]}" ${storage.dict.role.missing}`);
    },
};