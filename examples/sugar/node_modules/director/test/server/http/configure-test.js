/*
 * on-test.js: Tests for the on/route method.
 *
 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    vows = require('vows'),
    director = require('../../../lib/director');

vows.describe('director/core/configure').addBatch({
  "An instance of director.Router": {
    topic: new director.http.Router(),
    "the configure() method": {
      "called with an empty object": {
        "should default recurse to 'forward'": function(router) {
          router.configure({});
          assert.strictEqual(router.recurse, 'forward');
        }
      },
      "called with recurse = false": {
        "should set recurse to false": function(router) {
          router.configure({ recurse: false });
          assert.strictEqual(router.recurse, false);
        }
      },
      "called with recurse = 'backward'": {
        "should set recurse to 'backward'": function(router) {
          router.configure({ recurse: 'backward' });
          assert.strictEqual(router.recurse, 'backward');
        }
      }
    }
  }
}).export(module);
