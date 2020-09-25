const functions = require('../functions/functions.js');
const { google } = require('../config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');


module.exports = {
    name: 'idea',
    description: 'add new idea to sheet',
    execute(message, args, storage) {

        const channel = functions.getChannelByName(message.guild, storage.channel.idea.name);

        if (message.channel != channel) { message.reply(`${storage.dict.idea.channel} ${channel}`); return; }

        run(message.author, args)
            .then(() => message.reply(`${storage.dict.idea.success} ${functions.getEmojiByName(message.guild, 'weSmart')}`))
            .catch(error => { console.error(error); message.reply(storage.dict.idea.error); });
    }
}

/**
 * Run google sheet api function
 */
async function run(author, args) {
    // spreadsheet url id
    const doc = new GoogleSpreadsheet(google.sheets.development);

    // load google credentials from config file
    await doc.useServiceAccountAuth(require('../credentials/google.json'));

    // loads document properties and worksheets
    await doc.loadInfo();

    // get idea sheet
    const sheet = doc.sheetsByIndex[4]; // or use doc.sheetsById[id]

    // add new idea as new row
    await sheet.addRow({ Name: author.username, Idea: args.join(' '), Verdict: 'TBD' });
}
