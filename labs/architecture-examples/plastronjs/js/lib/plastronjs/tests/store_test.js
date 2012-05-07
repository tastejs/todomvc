goog.require('mvc.Model');
goog.require('mvc.Collection');
goog.require('mvc.Store');

goog.require('goog.testing.jsunit');

var simpleModel;
var store;

var setUp = function() {
    simpleModel = new mvc.Model({
        'id':'abc123',
        'text': 'test model 1'
        });
    store = new mvc.Store();
};


var testGetStoredObject = function(){
    store.set(simpleModel);
    assertEquals(store.get('abc123'), simpleModel);
};

var testGetUnstoredObject = function(){
    assertEquals(store.get('xyz789').constructor, mvc.Model);
};

var testGetNewObject = function(){
    assertEquals(store.get().constructor, mvc.Model);
};

var testGetObjectOfType = function(){
    assertEquals(store.get('qwerty',mvc.Collection).constructor, mvc.Collection);
};
