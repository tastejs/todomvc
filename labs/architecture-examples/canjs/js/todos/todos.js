(function (namespace, undefined) {
	var Todos = can.Control({

		// Initialize the Todos list
		init : function () {
			// Render the Todos
			this.element.append(can.view('todos.ejs', this.options));

			// Clear the new todo field
			$('#new-todo').val('').focus();
		},

		// Listen for when a new Todo has been entered
		'#new-todo keyup' : function (el, ev) {
			var value = can.trim(el.val());
			if (ev.keyCode == 13 && value !== '') {
				new Models.Todo({
					text : value,
					complete : false
				}).save(function () {
						el.val('');
					});
			}
		},

		// Handle a newly created Todo
		'{Models.Todo} created' : function (list, ev, item) {
			this.options.todos.push(item);
			// Reset the filter so that you always see your new todo
			this.options.state.removeAttr('filter')
		},

		// Listen for editing a Todo
		'.todo dblclick' : function (el, ev) {
			el.data('todo').attr('editing', true).save(function () {
				el.children('.edit').focus();
			});
		},

		// Update a todo
		updateTodo : function (el) {
			var value = can.trim(el.val()),
				todo = el.closest('.todo').data('todo');

			if (value == '') {
				todo.destroy();
			} else {
				todo.attr({
					editing : false,
					text : value
				}).save();
			}
		},

		// Listen for an edited Todo
		'.todo .edit keyup' : function (el, ev) {
			if (ev.keyCode == 13) {
				this.updateTodo(el);
			}
		},
		'.todo .edit focusout' : function (el, ev) {
			this.updateTodo(el);
		},

		// Listen for the toggled completion of a Todo
		'.todo .toggle click' : function (el, ev) {
			el.closest('.todo').data('todo')
				.attr('complete', el.is(':checked'))
				.save();
		},

		// Listen for a removed Todo
		'.todo .destroy click' : function (el) {
			el.closest('.todo').data('todo').destroy();
		},

		// Listen for toggle all completed Todos
		'#toggle-all click' : function (el, ev) {
			var toggle = el.prop('checked');
			can.each(this.options.todos, function (todo) {
				todo.attr('complete', toggle).save();
			});
		},

		// Listen for removing all completed Todos
		'#clear-completed click' : function () {
			for (var i = this.options.todos.length - 1, todo; i > -1 && (todo = this.options.todos[i]); i--) {
				if (todo.attr('complete')) {
					todo.destroy();
				}
			}
			// Reset the filter
			this.options.state.removeAttr('filter');
		}
	});

	namespace.Todos = Todos;
})(this);