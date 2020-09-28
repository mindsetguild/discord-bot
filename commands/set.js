const { languages } = require('../config.json');
const { user } = require('../functions/database.js');

module.exports = {
    name: 'set',
    description: 'save specific setting for user',
    execute(message, args, storage) {

        if (args.length < 2) {
            message.reply(storage.dict.set.arguments);
            return;
        }

        if (storage.command.set.attributes.language.keyword.includes(args[0]) && languages.includes(args[1])) {
            user.findUserById(message.author.id, storage.db.user).then(response => {
                if (!response) {
                    user.addUser(message.author, args[1], storage.db.user);
                    message.reply(`${storage.dict.set.language.success}`);
                }
                else if (args[1] == response.get('language')) {
                    message.reply(`${storage.dict.set.language.error}`);
                }
                else {
                    user.updateUser(message.author.id, args[1], storage.db.user);
                    message.reply(`${storage.dict.set.language.success}`);
                }
            });
        }
        else {
            message.reply(storage.dict.set.language.missing);
        }
    },
};