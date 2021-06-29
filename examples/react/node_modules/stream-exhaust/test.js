var test = require('tape');
var exhaust = require('./index.js');
var Stream = require('stream');
var Readable = Stream.Readable;
var Writable = Stream.Writable;
var Duplex = Stream.Duplex;
var through = require('through2');
var S2Readable = require('readable-stream').Readable;

test('it should cause a Readable stream to complete if it\'s not piped anywhere', function(assert) {
  var rs = new Readable({highWaterMark: 2});
  var a = 0;
  var ended = false;
  rs._read = function() {
    if (a++ < 100) {
      rs.push(a + "");
    } else {
      ended = true;
      rs.push(null);
    }
  };

  rs.on("end", function() {
    assert.ok(a > 99, 'a should be > 99');
    assert.ok(ended, 'it should end');
    assert.end();
  });

  exhaust(rs);
});

test('should work with Readable streams in objectMode', function(assert) {
  var rs = new Readable({highWaterMark: 2, objectMode: true});
  var a = 0;
  var ended = false;
  rs._read = function() {
    if (a++ < 100) {
      rs.push(a);
    } else {
      ended = true;
      rs.push(null);
    }
  };

  rs.on("end", function() {
    assert.ok(a > 99, 'a > 99');
    assert.ok(ended, 'ended is true');
    assert.end();
  });

  exhaust(rs);
});

test('should not interfere with a Readable stream that is piped somewhere', function(assert) {
  var rs = new Readable({highWaterMark: 2});
  var a = 0;
  var ended = false;
  rs._read = function() {
    if (a++ < 100) {
      rs.push(".");
    } else {
      ended = true;
      rs.push(null);
    }
  };

  var sizeRead = 0;
  var ws = new Writable({highWaterMark: 2});
  ws._write = function(chunk, enc, next) {
    sizeRead += chunk.length;
    next();
  }

  ws.on("finish", function() {
    assert.ok(a > 99, 'a > 99');
    assert.ok(ended, 'ended is true');
    assert.equal(sizeRead, 100, 'sizeRead === 100');
    assert.end();
  });

  rs.pipe(ws);

  exhaust(rs);
});

test('should not interfere with a Writable stream', function(assert) {
  var rs = new Readable({highWaterMark: 2});
  var a = 0;
  var ended = false;
  rs._read = function() {
    if (a++ < 100) {
      rs.push(".");
    } else {
      ended = true;
      rs.push(null);
    }
  };

  var sizeRead = 0;
  var ws = new Writable({highWaterMark: 2});
  ws._write = function(chunk, enc, next) {
    sizeRead += chunk.length;
    next();
  }

  ws.on("finish", function() {
    assert.ok(a > 99, 'a > 99');
    assert.ok(ended, 'ended is true');
    assert.equal(sizeRead, 100, 'sizeRead === 100');
    assert.end();
  });

  rs.pipe(ws);

  exhaust(ws);
});

test('should handle a Transform stream', function(assert) {
  var rs = new Readable({highWaterMark: 2});
  var a = 0;
  var ended = false;
  rs._read = function() {
    if (a++ < 100) {
      rs.push(".");
    } else {
      ended = true;
      rs.push(null);
    }
  };

  var sizeRead = 0;
  var flushed = false;
  var ts = through({highWaterMark: 2}, function(chunk, enc, cb) {
    sizeRead += chunk.length;
    this.push(chunk);
    cb();
  }, function(cb) {
    flushed = true;
    cb();
  });

  ts.on("end", function() {
    assert.ok(a > 99, 'a > 99');
    assert.ok(ended, 'ended is true');
    assert.equal(sizeRead, 100, 'sizeRead === 100');
    assert.ok(flushed, 'flushed is true');
    assert.end();
  });

  rs.pipe(ts);

  exhaust(ts);
});

test('should handle a classic stream', function(assert) {
  var rs = new Stream();
  var ended = false;
  var i;

  rs.on("end", function() {
    assert.ok(ended, 'ended is true');
    assert.end();
  });

  exhaust(rs);

  for (i = 0; i < 100; i++) {
    rs.emit("data", i);
  }
  ended = true;
  rs.emit("end");
});

test('should not modify .pipe', function(assert) {
  var stream = new S2Readable;

  var pipe = stream.pipe;

  stream._read = function() {
    stream.push('ending');
    stream.push(null);
  };

  exhaust(stream);

  assert.equal(stream.pipe, pipe);
  assert.end();
});

test('does not error on no resume but readable set to true', function(assert) {
  var rs = new Stream();
  rs.readable = true;

  var ended = false;
  var i;

  rs.on("end", function() {
    assert.ok(ended, 'ended is true');
    assert.end();
  });

  exhaust(rs);

  for (i = 0; i < 100; i++) {
    rs.emit("data", i);
  }
  ended = true;
  rs.emit("end");
});
