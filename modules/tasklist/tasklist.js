const Discord = require('discord.js');
const tasklist = require('./config.json');
const { server, google, url, color, logo } = require('../../config.json');
const dict = require('../../storage/en.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = {
    name: 'tasklist',
    description: 'automatically send message to discord channel with new task information',
    execute(client) {

        let rowCount = run().then(response => rowCount = response.rowCount);

        setInterval(() => {
            run().then(response => {

                if (response.rowCount <= rowCount) return;

                const tasklistChannel = client.guilds.cache.find(guild => guild.id == server).channels.cache.find(channel => channel.name == tasklist.channel.name);

                try {
                    rowCount = response.rowCount;

                    sendTasklistMessage(tasklistChannel, response.rowData);
                }
                catch (error) {
                    console.error(error);
                    tasklistChannel.send(`${dict.tasklist.error}`);
                }
            });
        }, tasklist.interval);
    },
};

/**
 * Send embed message with new task
 * @param {Discord.Channel} channel
 * @param {Object} rowData
 */
function sendTasklistMessage(channel, rowData) {

    const embedMessage = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(dict.tasklist.embed.description)
        .setAuthor(rowData[tasklist.assigned], logo.small)
        .setThumbnail(logo.large)
        .addFields(
            { name: tasklist.id, value: rowData[tasklist.id], inline: true },
            { name: tasklist.date, value: rowData[tasklist.date], inline: true },
            { name: tasklist.status, value: rowData[tasklist.status], inline: true },
            { name: tasklist.task, value: `>>> ${rowData[tasklist.task]}` },
        );

    if (rowData[tasklist.comment]) embedMessage.addField(tasklist.comment, `>>> ${rowData[tasklist.comment]}`);
    if (rowData[tasklist.management]) embedMessage.addField(tasklist.management, `>>> ${rowData[tasklist.management]}`);

    channel.send(embedMessage).catch(error => console.error(error));
}

/**
 * Run google sheet api function
 */
async function run() {
    try {
        // spreadsheet url id
        const doc = new GoogleSpreadsheet(google.sheets.id);
        // load google credentials from config file
        await doc.useServiceAccountAuth(require('../../credentials/google.json'));
        // loads document properties and worksheets
        await doc.loadInfo();
        // get idea sheet
        const sheet = doc.sheetsByTitle['Tasklist'];
        // get current rows
        const rows = await sheet.getRows();

        // let rowCount = 0;
        // rows.forEach(row => row._rawData[0] && row._rawData[1] && row._rawData[3] ? rowCount++ : false);

        // build response object
        const rowData = {};
        let rowCount = 0;
        let lastRow;

        rows.forEach(row => {
            if (row.Status && row.Status != 'Error') rowCount++;
            if (row.Status == 'Pending') lastRow = row;
        });

        lastRow._sheet.headerValues.forEach((header, index) => rowData[header] = lastRow._rawData[index]);

        return {
            rowCount: rowCount,
            rowData: rowData,
        };
    }
    catch (error) {
        console.error(error);
    }
}