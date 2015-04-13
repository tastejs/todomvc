define(function () {
  "use strict";

  var CAPTURE_STACK_TRACE = Error.captureStackTrace;

  return function (name) {
    var _Error = CAPTURE_STACK_TRACE
      ? function (message) {
        var me = this;

        CAPTURE_STACK_TRACE(me, _Error);

        Object.defineProperties(me, {
          "message": {
            "enumerable": false,
            "value": message
          }
        });
      }
      : function (message) {
        var error = new Error(message);

        Object.defineProperties(this, {
          "message": {
            "enumerable": false,
            "value": message
          },

          "stack": {
            "enumerable": false,
            "get": function () {
              return error.stack.replace(/.*\n/, "");
            }
          }
        });
      };

    _Error.prototype = Object.create(Error.prototype, {
      "name": {
        "enumerable": false,
        "value": name
      },
      "constructor": {
        "enumerable": false,
        "value": _Error
      }
    });

    return _Error;
  };
});