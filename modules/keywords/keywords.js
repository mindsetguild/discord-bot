const { keywords, emoji } = require('./config.json');
const fs = require('fs');
const functions = require('../../functions/general');

module.exports = {
    name: 'keywords',
    description: 'send videos from storage if message contains keywords for video file names',
    execute(client) {
        client.on('message', message => {
            if (message.guild && !message.author.bot && !message.content.includes('/attachments/')) {
                // normalized message text
                const text = message.content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                // video folder path
                const videosPath = './storage/videos';
                // keyword is found
                let keywordFound = false;

                // loop through all keywords
                keywords.forEach(keyword => {
                    // message contains keyword
                    if (text.includes(keyword) && !keywordFound) {
                        // file count and file name
                        const videoFiles = fs.readdirSync(videosPath).filter(file => file.includes(keyword));
                        // react and send video
                        try {
                            // emoji react
                            message.react(functions.getEmojiByName(message.guild, emoji).id);
                            // send video file
                            message.channel.send({
                                files: [
                                    `${videosPath}/${videoFiles[Math.floor(Math.random() * videoFiles.length)]}`,
                                ],
                            });
                            // keyword is found and video has been sent
                            keywordFound = true;
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                });
            }
        });
    },
};