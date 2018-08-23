const term = require('terminal-kit').terminal;
const util = require('util');
const stats = {
    info: 0,
    error: 0,
    warn: 0
};
term.reset().clear();

function update(s, ...args) {
    term.restoreCursor(util.format(s, ...args)).eraseLineAfter('\n');
    return this;
}

function overwrite(s, ...args) {
    term.eraseLine().previousLine();
    if (s != null) {
        info(s, ...args);
    }
    return this;
}

function br(s, ...args) {
    if (s == null) s = '';
    term.bgDefaultColor('\n').defaultColor('             ^#^k^W|^: ').saveCursor(util.format(s, ...args));
    return this;
}

function info(s, ...args) {
    if (s == null) s = '';
    t().bgBrightGreen().black('I')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.info++;
    return this;
}

function warn(s, ...args) {
    if (s == null) s = '';
    t().bgYellow().black('W')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.warn++;
    return this;
}

function error(s, ...args) {
    if (s == null) s = '';
    t().bgBrightRed().white('E')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.error++;
    return this;
}

function t() {
    return term.bgDefaultColor('\n').white(timestamp()+' ');
}

function timestamp() {
    const d = new Date();
    const ms = d.getTime() - d.getTimezoneOffset() * 60000;
    return new Date(ms).toISOString().slice(11, -1);
}

const busyCursorAnim = ['|', '/', '-', '\\', '/', '-'];
let busyCursorFrame = 0;
function busyCursor() {
    if (busyCursorFrame > busyCursorAnim.length-1) {
        busyCursorFrame = 0;
    }
    return busyCursorAnim[busyCursorFrame++];
}

module.exports = {
    info: info,
    error: error,
    warn: warn,
    update: update,
    overwrite: overwrite,
    br: br,
    stats: function() {
        return stats;
    },
    busyCursor: busyCursor,
    timestamp: timestamp,
    term: term
};
