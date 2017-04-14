/*global define*/
'use strict';
define(['Sauron', 'Builder', 'mvc!v/main', 'HtmlController', 'mvc!m/todos', 'mvc!c/todos', 'mvc!c/footer'], function (Sauron, builder, tmpl, htmlController) {
	var params = {
			'name': 'main',
			'start': function (cb) {
				// Grab the current todos
				Sauron.model('todos').retrieve(function (err, todos) {
					// Render our content
					var $html = builder(tmpl),
						$main = $html.filter('#main'),
						$todoList = $main.find('#todo-list'),
						$toggleAll = $main.find('#toggle-all'),
						$footer = $html.filter('#footer'),
						$mainGroup = $main.add($footer);

					// When a new todo is submitted
					var $newTodo = $html.find('#new-todo');
					$newTodo.on('keypress', function (e) {
						var wasNotEnter = e.which !== 13,
								val = $newTodo.val().trim();

						// If the keypress was not enter or there is no content, return
						if (wasNotEnter || !val) {
							return;
						}

						// Otherwise, create a new todo and clear out content
						Sauron.model('todos').create({'title': val});
						$newTodo.val('');
					});

					// When the toggle all is clicked, complete/uncomplete all todos
					$toggleAll.on('click', function () {
						var enabled = $toggleAll.prop('checked');
						if (enabled) {
							todos.forEach(function completeAll(todo) {
								todo.completed = true;
							});
						} else {
							todos.forEach(function uncompleteAll(todo) {
								todo.completed = false;
							});
						}

						// Save each todo
						todos.forEach(function saveTodo(todo) {
							Sauron.model('todos').update(todo);
						});
					});

					// Start up a child to handle the todos
					Sauron.start().controller('todos', $todoList, todos);
					Sauron.start().controller('footer', $footer, todos);

					// Callback with the content
					cb($html);

					function updateState(todos) {
						var allTodosCompleted;

						// If there are todos, show mainGroup
						if (todos.length) {
							$mainGroup.removeClass('hidden');
						} else {
						// Otherwise, don't show mainGroup
							$mainGroup.addClass('hidden');
						}

						// If all todos are/are not completed, tick/untick toggleAll
						allTodosCompleted = todos.every(function (todo) {
								return todo.completed;
							});
						$toggleAll.prop('checked', allTodosCompleted);
					}

					// Restart state now
					updateState(todos);

					// When there is a change, update the state
					function updateStateFn() {
						Sauron.model('todos').retrieve(function (err, todos) {
							updateState(todos);
						});
					}
					Sauron.model('todos').on().createEvent(updateStateFn);
					Sauron.model('todos').on().updateEvent(updateStateFn);
					Sauron.model('todos').on().deleteEvent(updateStateFn);


					// When there is a change (todos or state), re-render the list
					function restartList() {
						// DEV: It is preferred to run these via async.parallel
						Sauron.stop().controller('todos', function () {
							Sauron.model('todos').retrieve(function (err, todos) {
								// Start up the controller
								Sauron.start().controller('todos', $todoList, todos);
							});
						});
					}
					Sauron.model('todos').on().createEvent(restartList);
					Sauron.model('todos').on().updateEvent(restartList);
					Sauron.model('todos').on().deleteEvent(restartList);
					Sauron.model('state').on().updateEvent(restartList);

					// DEV: We can collapse updateState/restartList/restartFooter but it adds to complexity/readability
					// When there is a change, re-render the footer
					function restartFooter() {
						Sauron.stop().controller('footer', function () {
							Sauron.model('todos').retrieve(function (err, todos) {
								Sauron.start().controller('footer', $footer, todos);
							});
						});
					}
					Sauron.model('todos').on().createEvent(restartFooter);
					Sauron.model('todos').on().updateEvent(restartFooter);
					Sauron.model('todos').on().deleteEvent(restartFooter);
				});
			}
		};

	return htmlController(params);
});