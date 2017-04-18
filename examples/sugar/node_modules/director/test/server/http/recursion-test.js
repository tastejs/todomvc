/*
 * recursion-test.js: Tests for recursive route retrieval.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
  vows = require('vows'),
  director = require('../../../lib/director');

vows.describe('director/http/index').addBatch({
  "the traverse() method" : {
    topic: new director.http.Router(),
    "/some/1/nested/2/route/3" : {
      "should return a stack of three functions and three captures" : function(router) {
        function alpha() {}
        function beta() {}
        function gamma() {}

        router.path('/some/:id', function() {
          this.get(alpha);
          this.path('/nested/:id', function() {
            this.get(beta);
            this.path('/route/:id', function() {
              this.get(gamma);
            });
          });
        });

        var fns = router.traverse('get', '/some/1/nested/2/route/3', router.routes, '');
        var runlist = router.runlist(fns);
        assert.equal(runlist[0], gamma);
        assert.equal(runlist[1], beta);
        assert.equal(runlist[2], alpha);
        assert.equal(runlist.captures[0], 1);
        assert.equal(runlist.captures[1], 2);
        assert.equal(runlist.captures[2], 3);
      }
    }
  }
}).export(module);
