define([
  "./config",
  "./error"
], function (config, EmitterError) {
  "use strict";

  var UNDEFINED;
  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_FUNCTION = "[object Function]";
  var EMITTER = config.emitter;
  var TYPE = config.type;
  var CALLBACK = config.callback;
  var DATA = config.data;
  var SCOPE = config.scope;
  var LIMIT = config.limit;
  var COUNT = config.count;

  function Handler(emitter, type, callback, data) {
    var me = this;

    me[EMITTER] = emitter;
    me[TYPE] = type;
    me[DATA] = data;

    if (OBJECT_TOSTRING.call(callback) === TOSTRING_FUNCTION) {
      me[CALLBACK] = callback;
      me[SCOPE] = emitter;
    }
    else if (callback !== UNDEFINED) {
      me[CALLBACK] = callback[CALLBACK];
      me[SCOPE] = callback[SCOPE] || emitter;

      if (callback.hasOwnProperty(LIMIT)) {
        me[LIMIT] = callback[LIMIT];
        me[COUNT] = 0;
      }
    }
    else {
      throw new EmitterError("Unable to use 'callback'");
    }
  }

  Handler.prototype.handle = function (args) {
    // Let `me` be `this`
    var me = this;

    // Get result from execution of `handler[CALLBACK]`
    var result = me[CALLBACK].apply(me[SCOPE], args);

    // If there's a `me[LIMIT]` and `++me[COUNT]` is greater or equal to it ...
    if (me.hasOwnProperty(LIMIT) && ++me[COUNT] >= me[LIMIT]) {
      // ... `me[EMITTER].off` `me` (note that `me[CALLBACK]` and `me[SCOPE]` are used by `.off`)
      me[EMITTER].off(me[TYPE], me);
    }

    return result;
  };

  return Handler;
});
