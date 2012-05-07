goog.require('mvc.Mediator');

goog.require('goog.testing.jsunit');

var med;
var listen;

var setUp = function() {
    med = new mvc.Mediator();
};

testRegister = function(){
    var a = {};
    med.register(a, ['test']);
    assertEquals(a, med.available_['test'][0]);
};

testUnregister = function() {
    var a = {};
    med.unregister(a, ['test']);
    assertUndefined(med.available_['test']);
};

testListen = function() {
    listen = med.on('test', function(){});
    assert(med.isListened('test'));
};

testUnlisten = function() {
    med.off(listen);
    assert(!med.isListened('test'));
};

testInit = function() {
    var a = false;
    var b = {};
    med.on('testInit', {
        fn: goog.nullFunction,
        init: function() {a = true;}
    });
    med.register(b, ['testInit']);
    assert("function should fire on init", a);
};

testDispose = function() {
    var a = false;
    var b = {};
    med.on('testDispose', {
        fn: goog.nullFunction,
        dispose: function() {a = true;}
    });
    med.register(b, ['testDispose']);
    assert("a is still false", !a);
    med.unregister(b);
     assert("a is now true", a);
};
