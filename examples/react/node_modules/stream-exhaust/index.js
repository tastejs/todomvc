var Writable = require('stream').Writable;
var inherits = require('util').inherits;

module.exports = resumer;

function resumer(stream) {
  if (!stream.readable) {
    return stream;
  }

  if (stream._read) {
    stream.pipe(new Sink);
    return stream;
  }

  if (typeof stream.resume === 'function') {
    stream.resume();
    return stream;
  }

  return stream;
}

function Sink() {
  Writable.call(this, {
    objectMode: true
  });
}

inherits(Sink, Writable);

Sink.prototype._write = function(chunk, encoding, cb) {
  setImmediate(cb);
};
