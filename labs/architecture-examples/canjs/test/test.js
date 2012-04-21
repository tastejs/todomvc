steal('funcunit', 'funcunit/qunit').then(function() {
	
	var library = TODOLIB;
	QUnit.config.testTimeout = 300000;
		
	// Handle multiple library testing
	window.oldmodule = window.oldmodule || window.module;
	window.module = function(name, testEnvironment) {
		oldmodule(library + '/' + name, testEnvironment);
	};
		
	// Helpers for easily modifying todos
	var helpers = window.helpers = {
		add: function(nthChild, text) {
			S('#new-todo').type(text + '\r');
			S('#todo-list .todo:nth-child('+nthChild+') label').text(text, 'added a todo');
		},
		
		edit: function(nthChild, text) {
			S('#todo-list .todo:nth-child('+nthChild+')').dblclick();
			S('#todo-list .todo:nth-child('+nthChild+') .edit').type(text + '\r');
			S('#todo-list .todo:nth-child('+nthChild+') label').text(text, 'edited a todo');
		},
		
		complete: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').then(function(el) {
				el.prop('checked', false);
			});
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').click();
			S('#todo-list .todo:nth-child('+nthChild+')').hasClass('done', true, 'completed a todo');
		},
		
		incomplete: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').then(function(el) {
				el.prop('checked', true);
			});
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').click();
			S('#todo-list .todo:nth-child('+nthChild+')').hasClass('done', false, 'incompleted a todo');
		},
		
		remove: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .destroy').click();
			S('#todo-list .todo:nth-child('+nthChild+')').missing('remove a todo');
		},
		
		reload: function() {
			S('#todoapp').then(function(el) {
				var doc = el[0].ownerDocument,
					win = doc.defaultView || doc.parentWindow;
				win.location.reload();
			});
		}
	};
	
	module('todo.js', {
		setup: function() {
			S.open('../' + library);
			S('#todoapp').then(function(el) {
				var doc = el[0].ownerDocument,
					win = doc.defaultView || doc.parentWindow;
				win.localStorage.removeItem('todos-canjs-' + library);
			});
			helpers.reload();
		},
		teardown: function() {
			S('#todoapp').then(function(el) {
				var doc = el[0].ownerDocument,
					win = doc.defaultView || doc.parentWindow;
				win.localStorage.removeItem('todos-canjs-' + library);
			});
		}
	});
		
	test('Add, edit, complete, incomplete, and remove a todo', function() {
		helpers.add(1, 'new todo');
		helpers.edit(1, 'edited todo (enter)');
		helpers.complete(1);
		helpers.incomplete(1);
		helpers.remove(1);

		helpers.add(1, 'new todo');
		S('#todo-list .todo:nth-child(1)').dblclick();
		S('#todo-list .todo:nth-child(1) .edit').type('more edits');
		S('#todo-list .todo:nth-child(1) .edit').then(function(el) {
			el[0].blur();
		});
		S('#todo-list .todo:nth-child(1) label').text('more edits', 'edited a todo (blur)');
	});
		
	test('Mark all complete', function() {
		helpers.add(1, 'one');
		helpers.add(2, 'two');
		helpers.add(3, 'three');
		
		// All incomplete
		S('#toggle-all').click();
		S('#todo-list .todo:nth-child(1)').hasClass('done', true, '1/3 complete (all)');
		S('#todo-list .todo:nth-child(2)').hasClass('done', true, '2/3 complete (all)');
		S('#todo-list .todo:nth-child(3)').hasClass('done', true, '3/3 complete (all)');
		
		// Some incomplete
		S('#todo-list .todo:nth-child(2) .toggle').click();
		S('#todo-list .todo:nth-child(2)').hasClass('done', false, 'some incomplete');
		S('#toggle-all').then(function(el) {
			equals(el[0].checked, false, 'mark all toggle unchecked');
		});
		S('#toggle-all').click();
		S('#todo-list .todo:nth-child(1)').hasClass('done', true, '1/3 complete (some)');
		S('#todo-list .todo:nth-child(2)').hasClass('done', true, '2/3 complete (some)');
		S('#todo-list .todo:nth-child(3)').hasClass('done', true, '3/3 complete (some)');
		
		// Incomplete all
		S('#toggle-all').click();
		S('#todo-list .todo:nth-child(1)').hasClass('done', false, '1/3 incomplete (all)');
		S('#todo-list .todo:nth-child(2)').hasClass('done', false, '2/3 incomplete (all)');
		S('#todo-list .todo:nth-child(3)').hasClass('done', false, '3/3 incomplete (all)');
		
		// Mark all toggle updating
		S('#todo-list .todo:nth-child(1) .toggle').click();
		S('#todo-list .todo:nth-child(2) .toggle').click();
		S('#todo-list .todo:nth-child(3) .toggle').click();
		S('#toggle-all').then(function(el) {
			equals(el[0].checked, true, 'mark all toggle checked');
		});
	});
	
	test('Persist todos', function() {
		helpers.add(1, 'one');
		helpers.add(2, 'two');
		helpers.add(3, 'three');
		helpers.edit(1, 'uno');
		helpers.complete(2);
		
		helpers.reload();
		S('#todo-list .todo:nth-child(1) label').text('uno', '1/4 persisted');
		S('#todo-list .todo:nth-child(2) label').text('two', '2/4 persisted');
		S('#todo-list .todo:nth-child(2)').hasClass('done', true, '3/4 persisted');
		S('#todo-list .todo:nth-child(3) label').text('three', '4/4 persisted');
		
		helpers.complete(1);
		helpers.complete(3);
	});
	
	test('Statistics', function() {
		helpers.add(1, 'one');
		S('#todo-count').text(/1\s+item left/, 'add first todo');
		helpers.add(2, 'two');
		helpers.add(3, 'three');
		S('#todo-count').text(/3\s+items left/, 'add more todos');
		S('#todo-list .todo:nth-child(2) .toggle').click();
		S('#todo-list .todo:nth-child(3) .toggle').click();
		S('#todo-count').text(/1\s+item left/, 'mark some complete');
		S('#toggle-all').click();
		S('#todo-count').text(/0\s+items left/, 'mark all complete');
		S('#toggle-all').click();
		S('#todo-count').text(/3\s+items left/, 'mark all incomplete');
	});
	
	test('Clear completed', function() {
		helpers.add(1, 'one');
		helpers.add(2, 'two');
		helpers.add(3, 'three');
		helpers.complete(1);
		S('#clear-completed').text(/Clear 1\s+completed item/, 'complete first todo');
		helpers.complete(2);
		S('#clear-completed').text(/Clear 2\s+completed items/, 'complete second todo');
		
		S('#clear-completed').click();
		S('#todo-list .todo:nth-child(1) label').text('three', 'completed todos removed');
		S('#clear-completed').text(/Clear 0\s+completed items/, 'completed todos removed (text)');
		S('#todo-count').text(/1\s+item left/, 'completed todos removed (stats)');
	});
	
	test('Section showing/hiding', function() {
		helpers.add(1, 'one');
		S('#toggle-all').visible('mark all toggle shown with todos');
		S('#todo-count').visible('statistics shown with todos');
		S('#clear-completed').visible('clear completed shown with todos');
		
		helpers.remove(1);
		S('#toggle-all').invisible('mark all toggle hidden when empty');
		S('#todo-count').invisible('statistics hidden when empty');
		S('#clear-completed').invisible('clear completed hidden when empty');
	});
	
});
