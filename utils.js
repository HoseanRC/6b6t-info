/**takes a number of seconds and returns a string of total weeks, days, hours, minutes and seconds
 * @param {Number} totalSeconds total seconds to convert to a period
 * @returns {String}
 */
export function secondsToPeriod (totalSeconds) {
    let time = { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    time.weeks   = Math.floor(totalSeconds / 604800);
    time.days    = Math.floor((totalSeconds - (time.weeks * 604800)) / 86400);
    time.hours   = Math.floor((totalSeconds - (time.days * 86400) - (time.weeks * 604800)) / 3600);
    time.minutes = Math.floor((totalSeconds - (time.hours * 3600) - (time.days * 86400) - (time.weeks * 604800)) / 60);
    time.seconds = Math.ceil(totalSeconds - (time.hours * 3600) - (time.minutes * 60) - (time.days * 86400) - (time.weeks * 604800));
    
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