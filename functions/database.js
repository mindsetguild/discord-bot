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
        getUserById: async function (id, table) {
            // equivalent to SELECT * FROM table WHERE id = 'id' LIMIT 1;
            const user = await table.findOne({ where: { id: id } });
            return user;
        },

        /**
         * Find users by language
         * @param {String} language
         * @param {Sequelize} table
         */
        getAllUsers: async function (table) {
            const result = await table.findAll({ attributes: ['*'] });
            const users = result.map(user => user.id).join(', ') || 'No users added.';
            console.log(`List of users: ${users}`);
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
                const user = await table.create({
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