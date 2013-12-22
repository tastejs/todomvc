// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

define(

  [
    './utils'
  ],

  function(utils) {
    'use strict';

    var actionSymbols = {
      on: '<-',
      trigger: '->',
      off: 'x '
    };

    function elemToString(elem) {
      var tagStr = elem.tagName ? elem.tagName.toLowerCase() : elem.toString();
      var classStr = elem.className ? '.' + (elem.className) : '';
      var result = tagStr + classStr;
      return elem.tagName ? ['\'', '\''].join(result) : result;
    }

    function log(action, component, eventArgs) {
      var name, elem, fn, logFilter, toRegExp, actionLoggable, nameLoggable;

      if (typeof eventArgs[eventArgs.length-1] == 'function') {
        fn = eventArgs.pop();
        fn = fn.unbound || fn; // use unbound version if any (better info)
      }

      if (typeof eventArgs[eventArgs.length - 1] == 'object') {
        eventArgs.pop(); // trigger data arg - not logged right now
      }

      if (eventArgs.length == 2) {
        elem = eventArgs[0];
        name = eventArgs[1];
      } else {
        elem = component.$node[0];
        name = eventArgs[0];
      }

      if (window.DEBUG && window.DEBUG.enabled) {
        logFilter = DEBUG.events.logFilter;

        // no regex for you, actions...
        actionLoggable = logFilter.actions == 'all' || (logFilter.actions.indexOf(action) > -1);
        // event name filter allow wildcards or regex...
        toRegExp = function(expr) {
          return expr.test ? expr : new RegExp('^' + expr.replace(/\*/g, '.*') + '$');
        };
        nameLoggable =
          logFilter.eventNames == 'all' ||
          logFilter.eventNames.some(function(e) {return toRegExp(e).test(name);});

        if (actionLoggable && nameLoggable) {
          console.info(
            actionSymbols[action],
            action,
            '[' + name + ']',
            elemToString(elem),
            component.constructor.describe.split(' ').slice(0,3).join(' ') // two mixins only
          );
        }
      }
    }

    function withLogging() {
      this.before('trigger', function() {
        log('trigger', this, utils.toArray(arguments));
      });
      this.before('on', function() {
        log('on', this, utils.toArray(arguments));
      });
      this.before('off', function() {
        log('off', this, utils.toArray(arguments));
      });
    }

    return withLogging;
  }
);
