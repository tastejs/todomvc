var debounce = require('./index.js');
var test = require('tape');

test('debauce', function (t) {
  t.plan(3);

  var fn = debounce(function (a, b) {
    t.deepEqual(this, { call: 3 }, 'context should be preserved');
    t.equal(a, 30, 'should preserve args');
    t.equal(b, 300, 'should preserve args');
  }, 10);

  fn.call({ call: 1 }, 10, 100);
  fn.call({ call: 2 }, 20, 200);

  setTimeout(function () {
    fn.call({ call: 3 }, 30, 300);
  }, 3);
});

test('multiple calls should extend delay', function (t) {
  t.plan(4);

  var wasDelayed = false;

  var fn = debounce(function (a, b) {
    t.deepEqual(this, { call: 3 }, 'context should be preserved');
    t.equal(a, 30, 'should preserve args');
    t.equal(b, 300, 'should preserve args');
    t.ok(wasDelayed, 'should have waited longer than debounce period');
  }, 6);

  setTimeout(function longer() {
    wasDelayed = true;
  }, 9);

  fn.call({ call: 1 }, 10, 100);

  setTimeout(function () {
    fn.call({ call: 2 }, 20, 200);

    setTimeout(function () {
      fn.call({ call: 3 }, 30, 300);
    }, 5);
  }, 3);
});

test('multiple calls should not extend delay when guarantee is true', function (t) {
  t.plan(8);

  var first = true;
  var wasDelayed = false;

  var fn = debounce(
    function (a, b) {
      if (first) {
        t.deepEqual(this, { call: 2 }, '1st context should be preserved');
        t.equal(a, 20, '1st should preserve 1st args');
        t.equal(b, 200, '1st should preserve 2nd args');
        t.notOk(wasDelayed, 'should not have waited longer than debounce period');
        first = false;
      } else {
        t.deepEqual(this, { call: 3 }, 'context should be preserved');
        t.equal(a, 30, 'should preserve args');
        t.equal(b, 300, 'should preserve args');
        t.ok(wasDelayed, 'should have waited longer than debounce period');
      }
    },
    6,
    false,
    true
  );

  setTimeout(function longer() {
    wasDelayed = true;
  }, 7);

  fn.call({ call: 1 }, 10, 100);

  setTimeout(function () {
    fn.call({ call: 2 }, 20, 200);

    setTimeout(function () {
      fn.call({ call: 3 }, 30, 300);
    }, 5);
  }, 3);
});

test('at start', function (t) {
  t.plan(9);

  var callCount = 0;

  var fn = debounce(
    function (a, b) {
      if (callCount === 0) {
        t.deepEqual(this, { call: 1 }, '1st context should be preserved');
        t.equal(a, 10, '1st should preserve 1st args');
        t.equal(b, 100, '1st should preserve 2nd args');
      } else if (callCount === 1) {
        t.deepEqual(this, { call: 3 }, 'context should be preserved');
        t.equal(a, 30, 'should preserve args');
        t.equal(b, 300, 'should preserve args');
      } else {
        t.deepEqual(this, { call: 4 }, 'context should be preserved');
        t.equal(a, 40, 'should preserve 1st args');
        t.equal(b, 400, 'should preserve 2nd args');
      }

      callCount += 1;
    },
    6,
    true
  );

  fn.call({ call: 1 }, 10, 100);
  fn.call({ call: 2 }, 20, 200);

  setTimeout(function () {
    fn.call({ call: 3 }, 30, 300);

    setTimeout(function () {
      fn.call({ call: 4 }, 40, 400);
    }, 10);

    setTimeout(function () {
      fn.call({ call: 5 }, 50, 500);
    }, 3);
  }, 10);
});
