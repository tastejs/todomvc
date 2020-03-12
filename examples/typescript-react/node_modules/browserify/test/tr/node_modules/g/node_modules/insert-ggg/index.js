var through = require('through');

module.exports = function (file) {
    return through(function (buf) {
        this.queue(String(buf).replace(/GGG/g, '111'));
    });
};
