goog.require('mvc.Model');

goog.require('goog.testing.jsunit');

var simpleModel;
var emptyModel;

var setUp = function() {
    simpleModel = new mvc.Model({attr:
        {'a':'exists'}});
    emptyModel = new mvc.Model();
};

var testSimpleModel = function() {
    assertNotNullNorUndefined("New model created", simpleModel);
    assertEquals("Should be able to get 'a'", simpleModel.get('a'), 'exists');
    assertUndefined("Should return undefined", simpleModel.get('b'));
    simpleModel.set('a', 'changed');
    assertEquals("Should be able to change 'a'", simpleModel.get('a'), 'changed');
    simpleModel.set('b', 'new');
    assertEquals("Should be able to add new attribute 'b'", simpleModel.get('b'), 'new');
    simpleModel.unset('b');
    assertUndefined("Should be able to remove attribute 'b'", simpleModel.get('b'));
};

var testEmptyModel = function() {
    assertNotNull(emptyModel);
};

var testAlias = function() {
    simpleModel.set('date', {day:1,month:1});
    simpleModel.alias('1jan2010', 'date');
    assertEquals(simpleModel.get('1jan2010'), simpleModel.get('date'));
};

var testFormat = function() {
    simpleModel.set('date', {day:1,month:1});
    simpleModel.format('date', function(date) {
        return date.day+"/"+date.month;
    });
    assertEquals(simpleModel.get('date'), "1/1");
};

var testMeta = function() {
    simpleModel.set('day',1);
    simpleModel.set('month',1);
    simpleModel.meta('jan1', ['day', 'month'], function(day, month) {
        return day+"/"+month;
    });
    assertEquals(simpleModel.get('jan1'),"1/1");
};

var testBinder = function() {
    simpleModel.set('a', 1);
    var a = simpleModel.getBinder('a');
    assertEquals("should get back 1", a(), 1);
    a(2);
    assertEquals("should get back 1", a(), 2);
};

var testSetter = function() {
    simpleModel.setter('a', function(a) {return 1;});
    simpleModel.set('a', 2);
    assertEquals("should get back 1", simpleModel.attr_['a'], 1);
};

var testValidate = function() {
    var b = false;
    simpleModel.set('a', 1);
    simpleModel.errorHandler(function() {b=true;});
    simpleModel.setter('a', function(a) {
        if(a%2 === 0)
            throw new Error("must be odd number");
        return a;
    });
    simpleModel.set('a', 2);
    assertEquals("should get back 1", simpleModel.attr_['a'], 1);
    assert("error should be handled", b);
    simpleModel.set('a', 3);
    assertEquals("should get back 3", simpleModel.attr_['a'], 3);
};
