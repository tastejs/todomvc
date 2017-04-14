/*global define*/
'use strict';
define(['Sauron', 'Builder', 'mvc!v/footer', 'HtmlController', 'mvc!m/todos', 'mvc!m/state'], function (Sauron, builder, tmpl, htmlController) {
	var $ = builder.$,
		params = {
		'name': 'footer',
		'start': function (todos, cb) {
			// Grab the state
			Sauron.model('state').retrieve(function (err, state) {
				// Render our content
				var completedTodos = todos.filter(function (todo) {
						return todo.completed;
					}),
					completed = completedTodos.length,
					remaining = todos.length - completed,
					filter = state.filter,
					data = {
						remaining: remaining,
						completed: completed,
						plural: remaining > 1,
						filter: {
							byAll: filter === 'all',
							byActive: filter === 'active',
							byCompleted: filter === 'completed'
						}
					},
					$html = builder(tmpl, data),
					$clearCompleted = $html.filter('#clear-completed');

				// Stop link behavior
				$html.on('click', 'a', function (e) {
					e.preventDefault();
				});

				// When any of the footer links are clicked, update the state
				$html.on('radio-select', '.radio-item', function () {
					var $a = $(this),
							filter = $a.data('filter');
					Sauron.model('state').update({filter: filter});
				});

				// When the clear completed button is clicked
				$clearCompleted.on('click', function () {
					// Delete each of the completed todos
					completedTodos.forEach(function (todo) {
						Sauron.model('todos')['delete'](todo);
					});
				});

				// Callback with content
				cb($html);
			});
		}
	};

	return htmlController(params);
});