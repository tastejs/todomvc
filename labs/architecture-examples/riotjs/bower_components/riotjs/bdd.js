(function (global){
  "use strict"

  function describe(msg, fn) {
    if (console.group) {
      console.group(msg);
      fn();
      console.groupEnd();
    } else {
      console.info("\n--- " + msg + " ---");
      fn();
    }
  }

  function it(msg, fn) {
    console.log(msg);
    fn();
  }

  function assert(ok, msg) {
    console.assert(ok, msg);
  }

  assert.equal = function (value, expected) {
    assert(value === expected, '"'+ value +'" != "'+ expected +'"');
  };

  global.describe = describe;
  global.it = it;
  global.assert = assert;
}(typeof global !== "undefined" ? global : window))
