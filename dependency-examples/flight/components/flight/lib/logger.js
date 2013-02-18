// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

"use strict";

define(

  [
    './compose',
    './utils'
  ],

  function (compose, util) {

    var actionSymbols = {
      on:'<-',
      trigger: '->',
      off: 'x '
    };

    function elemToString(elem) {
      var tagStr = elem.tagName ? elem.tagName.toLowerCase() : elem.toString();
      var classStr = elem.className ? "." + (elem.className) : "";
      var result = tagStr + classStr;
      return elem.tagName ? ['\'', '\''].join(result) : result;
    }

    function log(action, component, eventArgs) {

      var name, elem, fn, fnName, logFilter, toRegExp, actionLoggable, nameLoggable;

      if (typeof eventArgs[eventArgs.length-1] == 'function') {
        fn = eventArgs.pop();
        fn = fn.unbound || fn; //use unbound version if any (better info)
      }

      if (typeof eventArgs[eventArgs.length - 1] == 'object') {
        eventArgs.pop(); //trigger data arg - not logged right now
      }

      if (eventArgs.length == 2) {
        elem = eventArgs[0];
        name = eventArgs[1];
      } else {
        elem = component.$node[0];
        name = eventArgs[0];
      }

      if (window.DEBUG) {
        logFilter = DEBUG.events.logFilter;

        // no regex for you, actions...
        actionLoggable = logFilter.actions=="all" || (logFilter.actions.indexOf(action) > -1);
        // event name filter allow wildcards or regex...
        toRegExp = function(expr) {
          return expr.test ? expr : new RegExp("^" + expr.replace(/\*/g, ".*") + "$");
        };
        nameLoggable =
          logFilter.eventNames=="all" ||
          logFilter.eventNames.some(function(e) {return toRegExp(e).test(name)});

        if (actionLoggable && nameLoggable) {
          console.info(
            actionSymbols[action],
            action,
            '[' + name + ']',
            elemToString(elem),
            component.constructor.describe,
            fn && (fnName = fn.name || fn.displayName) && '->  ' + fnName
          );
        }
      }
    }


    function withLogging() {
      this.before('trigger', function() {
        log('trigger', this, util.toArray(arguments));
      });
      this.before('on', function() {
        log('on', this, util.toArray(arguments));
      });
      this.before('off', function(eventArgs) {
        log('off', this, util.toArray(arguments));
      });
    }

    return withLogging;
  }
);
