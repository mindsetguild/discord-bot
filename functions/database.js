const Sequelize = require('sequelize');

module.exports = {
    /**
     * Establish database connection
     */
    connection: function () {
        return new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            // sqlite only
            storage: 'database.sqlite',
        });
    },

    user: {
        /**
         * Find user by id
         * @param {String} id
         * @param {Sequelize} table
         */
        findUserById: async function (id, table) {
            // equivalent to SELECT * FROM table WHERE id = 'id' LIMIT 1;
            const tag = await table.findOne({ where: { id: id } });
            return tag;
        },

        /**
         * Find users by language
         * @param {String} language
         * @param {Sequelize} table
         */
        findUsersByLanguage: async function (language, table) {
            const result = await table.findAll({ attributes: ['language'] });
            const tagString = result.map(t => t.name).join(', ') || 'No tags set.';
            console.log(`List of tags: ${tagString}`);
        },

        /**
         * Add new user to database
         * @param {Discord.User} author
         * @param {String} language
         * @param {Sequelize} table
         */
        addUser: async function (author, language, table) {
            try {
                // equivalent to INSERT INTO table (id, tag, language) VALUES (author.id, author.tag, language);
                const tag = await table.create({
                    id: author.id,
                    tag: author.tag,
                    language: language,
                });
                console.log(`User ${author.tag} with ID ${author.id} added.`);
            }

            catch (error) {
                if (error.name == 'SequelizeUniqueConstraintError') {
                    console.log('That user already exists.');
                }
                console.log('Something went wrong with adding a tag.');
            }
        },

        /**
         * Update language of existing user
         * @param {String} id
         * @param {String} language
         * @param {Sequelize} table
         */
        updateUser: async function (id, language, table) {
            // equivalent to UPDATE table (language) VALUES (language) WHERE id = id;
            const result = await table.update({ language: language }, { where: { id: id } });
            if (result > 0) {
                console.log(`User with ID ${id} edited language to ${language}.`);
            }
        },
    },

    model: {
        /**
         * Create database model for user
         * @param {Sequelize} sequelize
         */
        user: function (sequelize) {
            return sequelize.define('user', {
                id: {
                    type: Sequelize.TEXT,
                    unique: true,
                    primaryKey: true,
                },
                tag: {
                    type: Sequelize.STRING,
                    unique: true,
                },
                language: Sequelize.STRING,
            });
        },
    },
};