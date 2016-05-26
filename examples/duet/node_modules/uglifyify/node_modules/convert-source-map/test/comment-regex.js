'use strict';
/*jshint asi: true */

var test = require('tap').test
  , generator = require('inline-source-map')
  , rx = require('..').commentRegex

function comment(s) {
  rx.lastIndex = 0;
  return rx.test(s + 'sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmdW5jdGlvbiBmb28oKSB7XG4gY29uc29sZS5sb2coXCJoZWxsbyBJIGFtIGZvb1wiKTtcbiBjb25zb2xlLmxvZyhcIndobyBhcmUgeW91XCIpO1xufVxuXG5mb28oKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSJ9')
}

test('comment regex', function (t) {
  [ '//@ '
  , '  //@ '
  , '\t//@ '
  ].forEach(function (x) { t.ok(comment(x), 'matches ' + x) })

  // if I don't assign this, I get: TypeError: Cannot read property ' @// @' of undefined
  var a = 
  [ '///@ ' 
  , '}}//@ '
  , ' @// @'
  ].forEach(function (x) { t.ok(!comment(x), 'does not match ' + x) })
  t.end()
})
