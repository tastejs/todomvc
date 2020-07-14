var inspect = require('../');
var test = require('tape');

test('deep', function (t) {
    t.plan(2);
    var obj = [[[[[[500]]]]]];
    t.equal(inspect(obj), '[ [ [ [ [ [Array] ] ] ] ] ]');
    t.equal(inspect(obj, { depth: 2 }), '[ [ [Array] ] ]');
});
