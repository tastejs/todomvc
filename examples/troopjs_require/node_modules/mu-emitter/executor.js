define([ "./config" ], function (config) {
  "use strict";

  var UNDEFINED;
  var CALLBACK = config.callback;
  var SCOPE = config.scope;
  var HEAD = config.head;
  var NEXT = config.next;


  return function executor(event, handlers, args) {
    var _handlers = [];
    var _handlersCount = 0;
    var _callback = event[CALLBACK];
    var _scope = event[SCOPE];
    var handler;

    for (handler = handlers[HEAD]; handler !== UNDEFINED; handler = handler[NEXT]) {
      if (_callback && handler[CALLBACK] !== _callback) {
        continue;
      }

      if (_scope && handler[SCOPE] !== _scope) {
        continue;
      }

      _handlers[_handlersCount++] = handler;
    }

    return _handlers.map(function (_handler) {
      return _handler.handle(args);
    });
  }
});