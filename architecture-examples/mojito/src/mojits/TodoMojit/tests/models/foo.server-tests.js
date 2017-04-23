/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('TodoMojitModelFoo-tests', function(Y, NAME) {
    
    var suite = new YUITest.TestSuite(NAME),
        model = null,
        A = YUITest.Assert;
    
    suite.add(new YUITest.TestCase({
        
        name: 'TodoMojitModelFoo user tests',
        
        setUp: function() {
            model = Y.mojito.models.TodoMojitModelFoo;
        },
        tearDown: function() {
            model = null;
        },
        
        'test mojit model': function() {
            var called = false;
            A.isNotNull(model);
            A.isFunction(model.getData);
            model.getData(function(err, data) {
                called = true;
                A.isTrue(!err);
                A.isObject(data);
                A.areSame('data', data.some);
            });
            A.isTrue(called);
        }
        
    }));
    
    YUITest.TestRunner.add(suite);
    
}, '0.0.1', {requires: ['mojito-test', 'TodoMojitModelFoo']});
