/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('TodoMojit-tests', function(Y) {

	var suite = new YUITest.TestSuite('TodoMojit-tests'),
		controller = null,
		A = YUITest.Assert;

	suite.add(new YUITest.TestCase({
		
		name: 'TodoMojit user tests',
		
		setUp: function() {
			controller = Y.mojito.controllers.TodoMojit;
		},
		tearDown: function() {
			controller = null;
		},
		
		'test mojit': function() {
			var ac,
				modelData,
				assetsResults,
				doneResults;
			modelData = { x:'y' };
			ac = {
				assets: {
					addCss: function(css) {
						assetsResults = css;
					},
					addBlob: function(blob, loc) {
					}
				},
				models: {
					TodoMojitModelFoo: {
						getData: function(cb) {
							cb(null, modelData);
						}
					}
				},
				done: function(data) {
					doneResults = data;
				}
			};

			A.isNotNull(controller);
			A.isFunction(controller.index);
			controller.index(ac);
			//A.areSame('./index.css', assetsResults);
		}
		
	}));

	YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: ['mojito-test', 'TodoMojit']});
