// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

"use strict";

define(

  [
    './utils',
    './compose'
  ],

  function (util, compose) {

    var advice = {

      around: function(base, wrapped) {
        return function() {
          var args = util.toArray(arguments);
          return wrapped.apply(this, [base.bind(this)].concat(args));
        }
      },

      before: function(base, before) {
        return this.around(base, function() {
          var args = util.toArray(arguments),
              orig = args.shift(),
              beforeFn;

          beforeFn = (typeof before == 'function') ? before : before.obj[before.fnName];
          beforeFn.apply(this, args);
          return (orig).apply(this, args);
        });
      },

      after: function(base, after) {
        return this.around(base, function() {
          var args = util.toArray(arguments),
              orig = args.shift(),
              afterFn;

          // this is a separate statement for debugging purposes.
          var res = (orig.unbound || orig).apply(this, args);

          afterFn = (typeof after == 'function') ? after : after.obj[after.fnName];
          afterFn.apply(this, args);
          return res;
        });
      },

      // a mixin that allows other mixins to augment existing functions by adding additional
      // code before, after or around.
      withAdvice: function() {
        ['before', 'after', 'around'].forEach(function(m) {
          this[m] = function(method, fn) {

            compose.unlockProperty(this, method, function() {
              if (typeof this[method] == 'function') {
                return this[method] = advice[m](this[method], fn);
              } else {
                return this[method] = fn;
              }
            });

          };
        }, this);
      }
    };

    return advice;
  }
);
