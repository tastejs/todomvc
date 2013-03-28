YUI.add('TodoMojitModelTodo-tests', function(Y, NAME) {

	var suite = new YUITest.TestSuite('TodoMojitModelTodo-tests'),
		A = YUITest.Assert,
		todo = null;

	suite.add(new YUITest.TestCase({
		name: "Todo Model Tests",

		setUp: function() {
			todo = Y.mojito.models.Todo;
			todo.removeAll(function() {
				todo.add({'title': 'Main Todo'});
			});
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
				A.isNotNull(items);
				A.areEqual(1, items.length);
			});
		},

		'test update': function() {
			todo.getAll(function(err, items) {
				var item, id;

				A.isNull(err);
				A.isNotNull(items);
				item = items[0];
				id = item.id;
				item.title = 'Changed';
				todo.update(item, function(err, item) {
					A.isNull(err);
					A.isNotNull(item);
					A.areEqual(id, item.id);

					todo.get(id, function(err, item) {
						A.isNull(err);
						A.isNotNull(item);
						A.areEqual('Changed', item.title);
					});
				});
			});
		},

		'test update-no-item': function() {
			todo.update(null, function(err, item) {
				A.isNotNull(err);
				A.isUndefined(item);
			});
		},

		'test update-empty-id': function() {
			todo.update({}, function(err, item) {
				A.isNotNull(err);
				A.isUndefined(item);
			});
		},

		'test get': function() {
			todo.getAll(function(err, items) {
				var id;

				A.isNull(err);
				A.isNotNull(items);
				id = items[0].id;
				todo.get(id, function(err, item) {
					A.isNull(err);
					A.isNotNull(item);
					A.areEqual(id, item.id);
				});
			});
		},

		'test get-empty-id': function() {
			todo.get(null, function(err, item) {
				A.isNotNull(err);
				A.isUndefined(item);
			});
		},

		'test add': function() {
			todo.add({'title': 'Second Todo'}, function(err, items) {
				var id = null;
				A.isNotNull(items);
				A.areEqual(2, items.length);

				items.forEach(function(item) {
					if(item.title == 'Second Todo') {
						id = item.id;
					}
				});
				A.isNotNull(id);
			});
		},

		'test getFiltered-completed': function() {
			todo.add({'title': 'Second Todo', 'completed': true}, function(err, items) {
				todo.getFiltered(true, function(err, items) {
					A.isNull(err);
					A.isNotNull(items);
					A.areEqual(1, items.length);
					A.areEqual('Second Todo', items[0].title);
				})
			});
		},

		'test getFiltered-incomplete': function() {
			todo.add({'title': 'Second Todo', 'completed': true}, function(err, items) {
				todo.getFiltered(false, function(err, items) {
					A.isNull(err);
					A.isNotNull(items);
					A.areEqual(1, items.length);
					A.areEqual('Main Todo', items[0].title);
				})
			});
		},

		'test remove': function() {
			todo.add({'title': 'To be deleted'}, function(err, items) {
				var id = null;

				items.forEach(function(item) {
					if(item.title == 'To be deleted') {
						id = item.id;
					}
				});
				todo.remove(id, function(err, item) {
					A.isNull(err);
					A.isNotNull(item);
					A.areEqual(id, item.id);

					todo.getAll(function(err, items) {
						A.areEqual(1, items.length);
					});
				});
			});
		},

		'test removeAll': function() {
			todo.removeAll(function(err, items) {
				A.isNull(err);
				todo.getAll(function(err, items) {
					A.areEqual(0, items.length);
				})
			});
		},

		'test batchMark-complete': function() {
			todo.batchMark(true, function(err, items) {
				A.isNull(err);

				items.forEach(function(item) {
					A.isTrue(item.completed);
				});
			});
		},

		'test batchMark-incomplete': function() {
			todo.batchMark(false, function(err, items) {
				A.isNull(err);

				items.forEach(function(item) {
					A.isFalse(item.completed);
				});
			});
		},

		'test toggle': function() {
			todo.getAll(function(err, items) {
				var id = items[0].id,
					completed = !!items[0].completed;

				todo.toggle(id, function(err, item) {
					A.areEqual(!completed, item.completed);
				});
			});
		},

		'test toggle-double': function() {
			todo.getAll(function(err, items) {
				var id = items[0].id,
					completed = !!items[0].completed;

				todo.toggle(id, function(err, item) {
					todo.toggle(item.id, function(err, ritem) {
						A.areEqual(completed, ritem.completed);
					});
				});
			});
		}
	}));

	YUITest.TestRunner.add(suite);

}, "0.1.0", { requires: ["mojito-test", "TodoMojitModelTodo"] });
