var split = require('..');
var test = require('tape');

test('split', function (t) {
  t.deepEqual(
    split('a b c d', ' '),
    ['a', 'b', 'c', 'd'],
    'basic use'
  );

  t.deepEqual(
    split('a b c d', ' ', 2),
    ['a', 'b'],
    'with limit'
  );

  t.deepEqual(
    split('..word1 word2..', /([a-z]+)(\d+)/i),
    ['..', 'word', '1', ' ', 'word', '2', '..'],
    'backreferences in result array'
  );

  t.end();
});
