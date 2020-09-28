const Discord = require('discord.js');
const recruit = require('./config.json');
const { server, google, url, color, logo } = require('../../config.json');
const dict = require('../../storage/en.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    name: 'recruit',
    description: 'automatic generation of applications from sheet form data',
    execute(client) {

        let rowCount = run().then(response => rowCount = response.rowCount);

        setInterval(() => {
            run().then(response => {

                if (response.rowCount <= rowCount) return;

                const recruitChannel = client.guilds.cache.find(guild => guild.id == server).channels.cache.find(channel => channel.name == client.storage.get('channel').recruit.name);

                try {
                    rowCount = response.rowCount;

                    sendRecruitMessage(recruitChannel, response.rowData);
                }
                catch (error) {
                    console.error(error);
                    recruitChannel.send(`${dict.recruit.error}`);
                }
            });
        }, recruit.interval);
    },
};

/**
 *
 * @param {Discord.Channel} channel
 * @param {Object} rowData
 */
function sendRecruitMessage(channel, rowData) {

    const recruitUrl = rowData[recruit.credentials].match(/\bhttps?:\/\/\S+/gi);
    const embedMessage = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(dict.recruit.embed.title)
        .setAuthor(rowData[recruit.name], logo.small, recruitUrl ? recruitUrl[0] : url)
        .setThumbnail(logo.large, recruit.url)
        .addFields(
            { name: recruit.introcution, value: `>>> ${rowData[recruit.introcution]}` },
            { name: recruit.credentials, value: `>>> ${rowData[recruit.credentials]}` },
            { name: recruit.additional, value: `>>> ${rowData[recruit.additional]}` },
            { name: recruit.contact, value: `>>> ${rowData[recruit.contact]}` },
            { name: recruit.testosterone, value: `>>> ${rowData[recruit.testosterone]}` },
        )
        .setFooter(`${dict.recruit.embed.footer} ${rowData[recruit.date]}`, logo.small);

    channel.send(embedMessage)
        .then(() => channel.lastMessage.react('👍'))
        .then(() => channel.lastMessage.react('👎'))
        .catch(error => { console.error(error); channel.send(`${dict.error.reaction}`); });
}

/**
 * Run google sheet api function
 */
async function run() {
    // spreadsheet url id
    const doc = new GoogleSpreadsheet(google.sheets.id);
    // load google credentials from config file
    await doc.useServiceAccountAuth(require('../../credentials/google.json'));
    // loads document properties and worksheets
    await doc.loadInfo();
    // get idea sheet
    const sheet = doc.sheetsByTitle['Recruit'];
    // get current rows
    const rows = await sheet.getRows();

    // let rowCount = 0;
    // rows.forEach(row => row._rawData[0] && row._rawData[1] && row._rawData[3] ? rowCount++ : false);

    // build response object
    const rowData = {};
    const lastRow = rows.pop();
    lastRow._sheet.headerValues.forEach((header, index) => rowData[header] = lastRow._rawData[index]);

    return {
        rowCount: Object.keys(rows).length,
        rowData: rowData,
    };
}