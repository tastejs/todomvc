'use strict';

var EvStore = require('./index.js');

var test = require('tape');
var document = require('global/document');

test('can fetch records out of DS', function t(assert) {
    var elem = document.body;
    var ds = EvStore(elem);

    ds.foo = 'bar';

    var ds2 = EvStore(elem);

    assert.equal(ds2.foo, 'bar');

    assert.end();
});

test('setting dash names', function t(assert) {
    var elem = document.createElement('div');
    EvStore(elem)['foo-bar'] = 'baz';

    var ds = EvStore(elem);

    assert.equal(ds['foo-bar'], 'baz');

    assert.end();
});
