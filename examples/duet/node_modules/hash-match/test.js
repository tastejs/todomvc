var test = require('tape');
var match = require('./');

test('#test and #/test should return /test', function (t) {
  var a = match('#test');
  t.equal(a, '/test');
  
  var b = match('#/test');
  t.equal(b, '/test');
  t.end();
});

test('#test/ should return /test', function (t) {
  t.plan(1)
  t.equal(match('#test/'), '/test')
})

test('#/prefix/test and #prefix/test should return /test', function (t) {
  var a = match('#test', '/prefix');
  t.equal(a, '/test');
  
  var b = match('#/test', '/prefix');
  t.equal(b, '/test');
  t.end();
});
