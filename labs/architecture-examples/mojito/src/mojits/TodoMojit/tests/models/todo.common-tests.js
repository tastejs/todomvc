YUI.add('TodoMojitModelTodo-tests', function(Y, NAME) {

	var suite = new YUITest.TestSuite('TodoMojitModelTodo-tests'),
		A = YUITest.Assert,
		todo = null;

	suite.add(new YUITest.TestCase({
		name: "Todo Model Tests",

		setUp: function() {
			todo = Y.mojito.models.Todo;
		},

		tearDown: function() {
			todo = null;
		},

		'test init': function() {
			todo.init({});
			A.skip();
		},

		'test getall': function() {
			todo.getAll(function(err, items) {
				Y.log('Items: ' + items);
				A.isNotNull(items);
			});
		}
	}));

	YUITest.TestRunner.add(suite);

}, "0.1.0", { requires: ["mojito-test", "TodoMojitModelTodo"] });
