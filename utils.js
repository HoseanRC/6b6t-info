/**takes a number of seconds and returns a string of total weeks, days, hours, minutes and seconds
 * @param {Number} totalSeconds total seconds to convert to a period
 * @returns {String}
 */
export function secondsToPeriod (totalSeconds) {
    let time = {
    weeks  : Math.floor(totalSeconds / 604800),
    days   : Math.floor((totalSeconds - (weeks * 604800)) / 86400),
    hours  : Math.floor((totalSeconds - (days * 86400) - (weeks * 604800)) / 3600),
    minutes: Math.floor((totalSeconds - (hours * 3600) - (days * 86400) - (weeks * 604800)) / 60),
    seconds: Math.ceil(totalSeconds - (hours * 3600) - (minutes * 60) - (days * 86400) - (weeks * 604800)),
    };
    return Object.keys(time).reduce(
        (timeArray, key) => time[key] != 0 ? timeArray.concat(
            [`${time[key]} ${time[key] > 1 ? key : key.substring(0, key.length - 1)}`]
        ) : timeArray, []
    ).reduce(
        (timeString, key, index, array) => `${timeString}${index == 0 ? "" : array.length - 1 == index ? " and " : ", "}${key}`
    , "");
}

/**takes a number and add points to it for every 3 digit\
 * (eg. 1234567 => 1,234,567)
 * @param {Number | String} number 
 * @returns 
 */
export function addPoints (number) {
    return `${number}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}