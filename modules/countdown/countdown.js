const countdown = require('./config.json');
const { status, activity } = require('../../config.json');

module.exports = {
    name: 'countdown',
    description: 'set countdown as client status',
    execute(client) {
        try {
            setInterval(() => {
                client.user.setPresence({
                    status: status,
                    activity: {
                        name: getCountdown(countdown.target),
                        type: activity.type,
                        url: activity.url,
                    },
                });
            }, countdown.interval);
        }
        catch (error) {
            console.error(error);
        }
    },
};

/**
* Returns string with number in two digit format
* @param {Number} number
*/
function updateFormat(number) {
    return number < 10 ? '0' + number : number;
}

/**
* Returns object with calculated time values
* @param {Date} difference
*/
function calculateCountdown(difference) {
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: updateFormat(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
        minutes: updateFormat(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))),
        seconds: updateFormat(Math.floor((difference % (1000 * 60)) / 1000)),
    };
}

/**
* Returns text in countdown format
* @param {Object} countdownData
*/
function getCountdown(targetDate) {
    const countdownData = calculateCountdown(new Date(targetDate).getTime() - new Date().getTime());
    return `in ${countdownData.days}d ${countdownData.hours}h ${countdownData.minutes}m ${countdownData.seconds}s`;
}
