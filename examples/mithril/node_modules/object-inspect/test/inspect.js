var test = require('tape');
var hasSymbols = require('has-symbols')();
var utilInspect = require('../util.inspect');
var repeat = require('string.prototype.repeat');

var inspect = require('..');

test('inspect', function (t) {
    t.plan(3);
    var obj = [{ inspect: function xyzInspect() { return '!XYZ¡'; } }, []];
    t.equal(inspect(obj), '[ !XYZ¡, [] ]');
    t.equal(inspect(obj, { customInspect: true }), '[ !XYZ¡, [] ]');
    t.equal(inspect(obj, { customInspect: false }), '[ { inspect: [Function: xyzInspect] }, [] ]');
});

test('inspect custom symbol', { skip: !hasSymbols || !utilInspect || !utilInspect.custom }, function (t) {
    t.plan(3);

    var obj = { inspect: function stringInspect() { return 'string'; } };
    obj[utilInspect.custom] = function custom() { return 'symbol'; };

    t.equal(inspect([obj, []]), '[ ' + (utilInspect.custom ? 'symbol' : 'string') + ', [] ]');
    t.equal(inspect([obj, []], { customInspect: true }), '[ ' + (utilInspect.custom ? 'symbol' : 'string') + ', [] ]');
    t.equal(inspect([obj, []], { customInspect: false }), '[ { inspect: [Function: stringInspect] }, [] ]');
});

test('maxStringLength', function (t) {
    t.equal(
        inspect([repeat('a', 1e8)], { maxStringLength: 10 }),
        '[ \'aaaaaaaaaa\'... 99999990 more characters ]',
        'maxStringLength option limits output'
    );

    t.end();
});
