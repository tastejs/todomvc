var through = require('through2');

module.exports = function () {
    var bufs = [];
    return through(write, end);
    function write (buf, enc, next) {
        bufs.push(buf);
        next();
    }
    function end () {
        this.push(Buffer.concat(bufs).toString().replace(/5/g, 9));
        this.push(null);
    }
};
