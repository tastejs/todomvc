(function($) { "use strict";
  if ($.observable) return;

  $.observable = function(el) {
    var callbacks = {}, slice = [].slice;

    el.on = function(events, fn) {

      if (typeof fn === "function") {
        events = events.split(/\s+/);

        for (var i = 0, len = events.length, type; i < len; i++) {
          type = events[i];
          (callbacks[type] = callbacks[type] || []).push(fn);
          if (len > 1) fn.typed = true;
        }
      }
      return el;
    };

    el.off = function(events) {
      events = events.split(/\s+/);

      for (var i = 0; i < events.length; i++) {
        callbacks[events[i]] = [];
      }

      return el;
    };

    // only single event supported
    el.one = function(type, fn) {
      if (fn) fn.one = true;
      return el.on(type, fn);

    };

    el.trigger = function(type) {

      var args = slice.call(arguments, 1),
        fns = callbacks[type] || [];

      for (var i = 0, fn; i < fns.length; ++i) {
        fn = fns[i];

        if (fn.one && fn.done) continue;

        // add event argument when multiple listeners
        fn.apply(el, fn.typed ? [type].concat(args) : args);

        fn.done = true;
      }

      return el;
    };

    return el;
  };
})(typeof exports !== "undefined" ? exports : window.$ || (window.$ = {}));
