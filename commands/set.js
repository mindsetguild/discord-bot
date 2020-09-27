const { languages } = require('../config.json');

module.exports = {
    name: 'set',
    description: 'save specific setting for user',
    execute(message, args, storage) {

        if (args.length < 2) {
            message.reply(storage.dict.set.arguments);
            return;
        }

        if (storage.command.set.attributes.language.keyword.includes(args[0]) && languages.includes(args[1])) {
            findUserById(message.author.id, storage.db.user).then(response => {
                if (!response) {
                    addUser(message.author, args[1], storage.db.user);
                    message.reply(`${storage.dict.set.language.success}`);
                }
                else if (args[1] == response.get('language')) {
                    message.reply(`${storage.dict.set.language.error}`);
                }
                else {
                    updateUser(message.author.id, args[1], storage.db.user);
                    message.reply(`${storage.dict.set.language.success}`);
                }
            });
        }
        else {
            message.reply(storage.dict.set.language.missing);
        }
    },
};

/**
 * Find user by id
 * @param {String} id
 * @param {Sequelize} table
 */
async function findUserById(id, table) {
    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await table.findOne({ where: { id: id } });
    return tag;
}

/**
 * Find users by language
 * @param {String} language
 * @param {Sequelize} table
 */
async function findUsersByLanguage(language, table) {
    const result = await table.findAll({ attributes: ['language'] });
    const tagString = result.map(t => t.name).join(', ') || 'No tags set.';
    console.log(`List of tags: ${tagString}`);
}

/**
 * Add new user to database
 * @param {Discord.User} author
 * @param {String} language
 * @param {Sequelize} table
 */
async function addUser(author, language, table) {
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const tag = await table.create({
            id: author.id,
            tag: author.tag,
            language: language,
        });
        console.log(`Tag ${tag.id} added.`);
    }

    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('That tag already exists.');
        }
        console.log('Something went wrong with adding a tag.');
    }
}

/**
 * Update language of existing user
 * @param {String} id
 * @param {String} language
 * @param {Sequelize} table
 */
async function updateUser(id, language, table) {
    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const result = await table.update({ language: language }, { where: { id: id } });
    if (result > 0) {
        console.log(`Tag ${id} was edited.`);
    }
}