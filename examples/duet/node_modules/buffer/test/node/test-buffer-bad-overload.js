'use strict';
var Buffer = require('../../').Buffer;
if (Buffer.TYPED_ARRAY_SUPPORT) return;

var assert = require('assert');

assert.doesNotThrow(function() {
  Buffer.allocUnsafe(10);
});

assert.throws(function() {
  Buffer.from(10, 'hex');
});

assert.doesNotThrow(function() {
  Buffer.from('deadbeaf', 'hex');
});

