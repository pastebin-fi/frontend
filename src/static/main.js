// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
function timeSince(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " vuotta";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " kuukautta";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " päivää";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " tuntia";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minuuttia";
    }
    return Math.floor(seconds) + " sekuntia";
}