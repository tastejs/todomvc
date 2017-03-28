/*global window, RSVP, rJS, jIO, Date */
/*jshint unused:false */
(function(window, RSVP, rJS, jIO, Date) {
	'use strict';


	rJS(window)

		// Initialize the gadget as soon as it is loaded in memory,
		// blocking all other methods in itself and its ancestors.
		.ready(function() {
			var gadget = this;

			// Create a new jIO storage that supports queries,
			// automatic IDs, and documents on local storage.
			return gadget.changeState({
				storage: jIO.createJIO({
					type: 'query',
					sub_storage: {
						type: 'uuid',
						sub_storage: {
							type: 'document',
							document_id: '/',
							sub_storage: {
								type: 'local'
							}
						}
					}
				})
			});
		})


		// Put a new todo into jIO storage, with an auto-generated ID.
		.declareMethod('postTodo', function(title) {
			var gadget = this;
			var storage = gadget.state.storage;
			return storage.post({
				title: title,
				completed: false,
				creation_date: Date.now()
			});
		})

		// Update the properties of an existing todo in jIO storage.
		.declareMethod('putTodo', function(id, todo) {
			var gadget = this;
			var storage = gadget.state.storage;

			// Get todo from storage first to get all its properties.
			return storage.get(id)
				.push(function(result) {
						var key;

						// Only overwrite the given properties.
						for (key in todo) {
							if (todo.hasOwnProperty(key)) {
								result[key] = todo[key];
							}
						}
						return result;
					},

					// Reject callback if todo is not found in storage.
					function() {
						return todo;
					})

				.push(function(todo) {
					return storage.put(id, todo);
				});
		})

		// Return a list of all todos in storage that match the given query.
		.declareMethod('getTodos', function(query) {
			var gadget = this;
			var storage = gadget.state.storage;

			// Get a list of all todos in storage that match the given query,
			// in chronological order, with 'title' and 'completed' properties.
			return storage.allDocs({
					query: query,
					sort_on: [
						['creation_date', 'ascending']
					],
					select_list: ['title', 'completed']
				})

				// Add the todo IDs into the list.
				.push(function(result_list) {
					var todo_list = [],
						todo, i;
					for (i = 0; i < result_list.data.total_rows; i += 1) {
						todo = result_list.data.rows[i];
						todo_list.push({
							id: todo.id,
							title: todo.value.title,
							completed: todo.value.completed
						});
					}
					return todo_list;
				});
		})

		// Get the count of all total todos and all active todos.
		.declareMethod('getTodoCountDict', function() {
			var gadget = this;
			var storage = gadget.state.storage;

			// Get a list of all todos in storage with the 'completed' property
			return storage.allDocs({
					select_list: ['completed']
				})
				.push(function(result_list) {
					var todo_count_dict = {
						total: result_list.data.total_rows,
						active: 0
					};

					// Iterate through all todos to count only the active ones.
					for (var i = 0; i < result_list.data.total_rows; i += 1) {
						if (!result_list.data.rows[i].value.completed) {
							todo_count_dict.active += 1;
						}
					}
					return todo_count_dict;
				});
		})

		// Change the title of a todo.
		.declareMethod('changeTitle', function(id, title) {
			var gadget = this;
			return gadget.putTodo(id, {
				title: title
			});
		})

		// Change the completion status of a todo.
		.declareMethod('toggleOne', function(id, completed) {
			var gadget = this;
			return gadget.putTodo(id, {
				completed: completed
			});
		})

		// Change the completion status of all todos.
		.declareMethod('toggleAll', function(completed) {
			var gadget = this;
			var storage = gadget.state.storage;

			// Get all todos, and change the completion status of each one.
			return storage.allDocs()
				.push(function(result_list) {
					var promise_list = [];
					for (var i = 0; i < result_list.data.total_rows; i += 1) {
						promise_list.push(gadget.toggleOne(
							result_list.data.rows[i].id, completed
						));
					}
					return RSVP.all(promise_list);
				});
		})

		// Remove one todo from the storage.
		.declareMethod('removeOne', function(id) {
			var gadget = this;
			var storage = gadget.state.storage;
			return storage.remove(id);
		})

		// Remove all completed todos from the storage.
		.declareMethod('removeCompleted', function() {
			var gadget = this;

			// Get a list of all todos, and only remove the completed ones.
			return gadget.getTodos()
				.push(function(todo_list) {
					var promise_list = [];
					for (var i = 0; i < todo_list.length; i += 1) {
						if (todo_list[i].completed) {
							promise_list.push(gadget.removeOne(todo_list[i].id));
						}
					}
					return RSVP.all(promise_list);
				});
		});

}(window, RSVP, rJS, jIO, Date));
