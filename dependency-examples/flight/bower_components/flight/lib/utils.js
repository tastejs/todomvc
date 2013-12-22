// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define(

  [],

  function() {
    'use strict';

    var arry = [];
    var DEFAULT_INTERVAL = 100;

    var utils = {

      isDomObj: function(obj) {
        return !!(obj.nodeType || (obj === window));
      },

      toArray: function(obj, from) {
        return arry.slice.call(obj, from);
      },

      // returns new object representing multiple objects merged together
      // optional final argument is boolean which specifies if merge is recursive
      // original objects are unmodified
      //
      // usage:
      //   var base = {a:2, b:6};
      //   var extra = {b:3, c:4};
      //   merge(base, extra); //{a:2, b:3, c:4}
      //   base; //{a:2, b:6}
      //
      //   var base = {a:2, b:6};
      //   var extra = {b:3, c:4};
      //   var extraExtra = {a:4, d:9};
      //   merge(base, extra, extraExtra); //{a:4, b:3, c:4. d: 9}
      //   base; //{a:2, b:6}
      //
      //   var base = {a:2, b:{bb:4, cc:5}};
      //   var extra = {a:4, b:{cc:7, dd:1}};
      //   merge(base, extra, true); //{a:4, b:{bb:4, cc:7, dd:1}}
      //   base; //{a:2, b:6}

      merge: function(/*obj1, obj2,....deepCopy*/) {
        // unpacking arguments by hand benchmarked faster
        var l = arguments.length,
            i = 0,
            args = new Array(l + 1);
        for (; i < l; i++) args[i + 1] = arguments[i];

        if (l === 0) {
          return {};
        }

        //start with empty object so a copy is created
        args[0] = {};

        if (args[args.length - 1] === true) {
          //jquery extend requires deep copy as first arg
          args.pop();
          args.unshift(true);
        }

        return $.extend.apply(undefined, args);
      },

      // updates base in place by copying properties of extra to it
      // optionally clobber protected
      // usage:
      //   var base = {a:2, b:6};
      //   var extra = {c:4};
      //   push(base, extra); //{a:2, b:6, c:4}
      //   base; //{a:2, b:6, c:4}
      //
      //   var base = {a:2, b:6};
      //   var extra = {b: 4 c:4};
      //   push(base, extra, true); //Error ("utils.push attempted to overwrite 'b' while running in protected mode")
      //   base; //{a:2, b:6}
      //
      // objects with the same key will merge recursively when protect is false
      // eg:
      // var base = {a:16, b:{bb:4, cc:10}};
      // var extra = {b:{cc:25, dd:19}, c:5};
      // push(base, extra); //{a:16, {bb:4, cc:25, dd:19}, c:5}
      //
      push: function(base, extra, protect) {
        if (base) {
          Object.keys(extra || {}).forEach(function(key) {
            if (base[key] && protect) {
              throw new Error('utils.push attempted to overwrite "' + key + '" while running in protected mode');
            }

            if (typeof base[key] == 'object' && typeof extra[key] == 'object') {
              // recurse
              this.push(base[key], extra[key]);
            } else {
              // no protect, so extra wins
              base[key] = extra[key];
            }
          }, this);
        }

        return base;
      },

      isEnumerable: function(obj, property) {
        return Object.keys(obj).indexOf(property) > -1;
      },

      // build a function from other function(s)
      // utils.compose(a,b,c) -> a(b(c()));
      // implementation lifted from underscore.js (c) 2009-2012 Jeremy Ashkenas
      compose: function() {
        var funcs = arguments;

        return function() {
          var args = arguments;

          for (var i = funcs.length-1; i >= 0; i--) {
            args = [funcs[i].apply(this, args)];
          }

          return args[0];
        };
      },

      // Can only unique arrays of homogeneous primitives, e.g. an array of only strings, an array of only booleans, or an array of only numerics
      uniqueArray: function(array) {
        var u = {}, a = [];

        for (var i = 0, l = array.length; i < l; ++i) {
          if (u.hasOwnProperty(array[i])) {
            continue;
          }

          a.push(array[i]);
          u[array[i]] = 1;
        }

        return a;
      },

      debounce: function(func, wait, immediate) {
        if (typeof wait != 'number') {
          wait = DEFAULT_INTERVAL;
        }

        var timeout, result;

        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          var callNow = immediate && !timeout;

          clearTimeout(timeout);
          timeout = setTimeout(later, wait);

          if (callNow) {
            result = func.apply(context, args);
          }

          return result;
        };
      },

      throttle: function(func, wait) {
        if (typeof wait != 'number') {
          wait = DEFAULT_INTERVAL;
        }

        var context, args, timeout, throttling, more, result;
        var whenDone = this.debounce(function(){
          more = throttling = false;
        }, wait);

        return function() {
          context = this; args = arguments;
          var later = function() {
            timeout = null;
            if (more) {
              result = func.apply(context, args);
            }
            whenDone();
          };

          if (!timeout) {
            timeout = setTimeout(later, wait);
          }

          if (throttling) {
            more = true;
          } else {
            throttling = true;
            result = func.apply(context, args);
          }

          whenDone();
          return result;
        };
      },

      countThen: function(num, base) {
        return function() {
          if (!--num) { return base.apply(this, arguments); }
        };
      },

      delegate: function(rules) {
        return function(e, data) {
          var target = $(e.target), parent;

          Object.keys(rules).forEach(function(selector) {
            if ((parent = target.closest(selector)).length) {
              data = data || {};
              data.el = parent[0];
              return rules[selector].apply(this, [e, data]);
            }
          }, this);
        };
      }

    };

    return utils;
  }
);
