var inflate = require('../');
var zlib = require('zlib');
var fs = require('fs');
var assert = require('assert');
var uncompressed = fs.readFileSync(__dirname + '/lorem.txt');

describe('tiny-inflate', function() {
  var compressed, noCompression, fixed;
  
  function deflate(buf, options, fn) {    
    var chunks = [];
    zlib.createDeflateRaw(options)
      .on('data', function(chunk) {
        chunks.push(chunk);
      })
      .on('error', fn)
      .on('end', function() {
        fn(null, Buffer.concat(chunks));
      })
      .end(buf);
  }
  
  before(function(done) {
    zlib.deflateRaw(uncompressed, function(err, data) {
      compressed = data;
      done();
    });
  });
  
  before(function(done) {
    deflate(uncompressed, { level: zlib.Z_NO_COMPRESSION }, function(err, data) {
      noCompression = data;
      done();
    });
  });
  
  before(function(done) {
    deflate(uncompressed, { strategy: zlib.Z_FIXED }, function(err, data) {
      fixed = data;
      done();
    });
  });
  
  it('should inflate some data', function() {
    var out = Buffer.alloc(uncompressed.length);
    inflate(compressed, out);
    assert.deepEqual(out, uncompressed);
  });
  
  it('should slice output buffer', function() {
    var out = Buffer.alloc(uncompressed.length + 1024);
    var res = inflate(compressed, out);
    assert.deepEqual(res, uncompressed);
    assert.equal(res.length, uncompressed.length);
  });
  
  it('should handle uncompressed blocks', function() {
    var out = Buffer.alloc(uncompressed.length);
    inflate(noCompression, out);
    assert.deepEqual(out, uncompressed);
  });
  
  it('should handle fixed huffman blocks', function() {
    var out = Buffer.alloc(uncompressed.length);
    inflate(fixed, out);
    assert.deepEqual(out, uncompressed);
  });
  
  it('should handle typed arrays', function() {
    var input = new Uint8Array(compressed);
    var out = new Uint8Array(uncompressed.length);
    inflate(input, out);
    assert.deepEqual(out, new Uint8Array(uncompressed));
  });
});
