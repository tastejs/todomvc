goog.require('mvc.Collection');
goog.require('mvc.Model');

goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.jsunit');

/** @type {mvc.Model} */
var model1, model2, model3;

var setUp = function() {
    model1 = new mvc.Model({'sort':3});
    model2 = new mvc.Model({'sort':1});
    model3 = new mvc.Model({'sort':2});
};

var testUnsortedCollection = function() {
    var test = new mvc.Collection({'models':[model1, model2, model3]});
    assertEquals('first object should be mock 1', test.at(0), model1);
    assertEquals('second object should be mock 2', test.at(1), model2);
    assertEquals('third object should be mock 3', test.at(2), model3);
};

var testSortedCollection = function() {
    var sort = function(a, b) {return a.get('sort')-b.get('sort');};
    var test = new mvc.Collection();
    test.setComparator(sort);
    test.add(model1);
    assertEquals('first object should be mock 1', test.at(0), model1);
    test.add(model2);
    assertEquals('first object should be mock 2', test.at(0), model2);
    assertEquals('second object should be mock 1', test.at(1), model1);
    test.add(model3);
    assertEquals('first object should be mock 2', test.at(0), model2);
    assertEquals('second object should be mock 3', test.at(1), model3);
    assertEquals('third object should be mock 1', test.at(2), model1);
};

var testNewSortedCollection = function() {
    var sort = function(a, b) {return a.get('sort')-b.get('sort');};
    var test = new mvc.Collection({'models':[model1,model2,model3]});
    test.setComparator(sort);
    assertEquals('first object should be mock 2', test.at(0), model2);
    assertEquals('second object should be mock 3', test.at(1), model3);
    assertEquals('third object should be mock 1', test.at(2), model1);
};

var testAsModel = function() {
    var test = new mvc.Collection();
    test.set('a', 1);
    assertEquals('should have attribute a as 1', test.get('a'), 1);
};
