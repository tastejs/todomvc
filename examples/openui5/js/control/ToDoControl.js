/* global sap, $ */

sap.ui.define([
	'sap/ui/core/Control'
], function (Control) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// vars required for renderer
	var controlID, toDos, filter, toDosAvailable, toDosUncompleted,
		sItem, oBundle, shouldDisplayToDoObject;

	return Control.extend('ToDoMVC.control.ToDoControl', {
		metadata: {
			properties: {
				toDosObject: {
					type: 'object[]',
					defaultValue: []
				},
				filter: {
					type: 'string',
					defaultValue: 'all'
				}
			},
			events: {
				// Event for adding a new toDo
				addToDoPressed: {
					enablePreventDefault: true,
					parameters: {
						title: {
							type: 'string'
						}
					}
				},

				// Event for deleting a toDo
				deleteToDoPressed: {
					enablePreventDefault: true,
					parameters: {
						toDoId: {
							type: 'int'
						}
					}
				},

				// Event for deleting all completed toDos marked as completed
				deleteAllCompletedToDosPressed: {
					enablePreventDefault: true,
					toDoIds: {
						type: 'int[]'
					}
				},

				// Event for marking a toDo as completed
				completedToDoPressed: {
					enablePreventDefault: true,
					parameters: {
						toDoId: {
							type: 'int'
						},
						completed: {
							type: 'boolean'
						}
					}
				},

				// Event after one item has been changed
				toDoChangedPressed: {
					enablePreventDefault: true,
					parameters: {
						toDoId: {
							type: 'int'
						},
						title: {
							type: 'string'
						}
					}
				}
			}
		},

		onAddToDo: function (evt) {
			if (+evt.keyCode === ENTER_KEY) {
				var title = evt.target.value.trim();

				// prevent firing an event if title is empty
				if (!title || +title.length === 0) {
					return;
				}

				this.fireEvent('addToDoPressed', {
					title: title
				});

				this.rerender();
			}
		},

		onDeleteToDo: function (evt) {
			var itemId = evt.target.id.replace('destroyToDo-', '');

			this.fireEvent('deleteToDoPressed', {
				toDoId: +itemId.split('-')[0]
			});

			this.rerender();
		},

		_getAllToDosWithStatus: function (status) {
			var elems = this.getToDosObject();
			var toDoIds = [];

			elems.forEach(function (value) {
				if (value.completed === status) {
					toDoIds.push(+value.id);
				}
			}, this);

			return toDoIds;
		},

		onDeleteAllCompletedToDos: function () {
			this.fireEvent('deleteAllCompletedToDosPressed', {
				toDoIds: this._getAllToDosWithStatus(true)
			});

			this.rerender();
		},

		onToggleToDo: function (evt) {
			var itemId = evt.target.id.replace('completeToDo-', '');

			this.fireEvent('completedToDoPressed', {
				toDoId: +itemId.split('-')[0],
				completed: evt.target.checked
			});

			this.rerender();
		},

		onEditToDo: function (evt) {
			var liItem = evt.target.id.replace('labelFor-', '');
			var inputItem = evt.target.id.replace('labelFor-', 'editField-');

			// enter editing mode through li element
			document.getElementById(liItem).classList.add('editing');

			// set focus on label - not working yet
			document.getElementById(inputItem).focus();
		},

		_onEditKeyPress: function (evt) {
			// recognize ESC and RETURN
			if (+evt.keyCode === ENTER_KEY) {
				this.onLeaveEditToDoFocus(evt);
			} else if (+evt.keyCode === ESCAPE_KEY) {
				// no changes on ESC, just invalidate
				this.rerender();
			}
		},

		onLeaveEditToDoFocus: function (evt) {
			var toDoId = evt.target.id.split('-')[1];
			var newTitle = evt.target.value.trim();

			// destroy toDo if new title is empty
			if (!newTitle || +newTitle.length === 0) {
				this.fireEvent('deleteToDoPressed', {
					toDoId: +toDoId
				});
			} else {
				this.fireEvent('toDoChangedPressed', {
					toDoId: +toDoId,
					title: newTitle
				});
			}

			this.rerender();
		},

		onToggleAllToDos: function () {
			var toDoIds = this._getAllToDosWithStatus(false);
			var elems = this.getToDosObject();

			if (toDoIds.length > 0) {
				// complete all uncompleted toDos
				toDoIds.forEach(function (value) {
					// fire changed event
					this.fireEvent('completedToDoPressed', {
						toDoId: value,
						completed: true
					});
				}, this);

			} else {
				// uncomplete all toDos
				elems.forEach(function (value) {
					// fire changed event
					this.fireEvent('completedToDoPressed', {
						toDoId: value.id,
						completed: false
					});
				}, this);
			}

			this.rerender();
		},

		/*
		 * Set event bindings for click, double-click, focus events
		 * use jQuery eventhandling since it's using addEventListener
		 */
		onAfterRendering: function () {
			var controlId = this.getId();
			var allToDosObjects = this.getToDosObject();

			// what happens when user hits enter on text field?
			$('#inputToDo-' + controlId).keypress(this.onAddToDo.bind(this));

			// what happens when user clicks on the down arrow left to the input field?
			$('#inputToDoToggle-' + controlId).click(this.onToggleAllToDos.bind(this));

			// what happens when user clicks on 'Clear completed' link in the bottom right?
			$('#deleteAllCompleted-' + controlId).click(this.onDeleteAllCompletedToDos.bind(this));

			allToDosObjects.forEach(function (value) {
				// what happens when user delets toDo?
				$('#destroyToDo-' + value.id + '-' + controlId).click(this.onDeleteToDo.bind(this));

				// what happens when user double-clicks a toDo?
				$('#labelFor-' + value.id + '-' + controlId).dblclick(this.onEditToDo.bind(this));

				// what happens when user removes focus while editing a toDo?
				// captures blur events in IE as well
				$('#editField-' + value.id + '-' + controlId).focusout(this.onLeaveEditToDoFocus.bind(this));

				// what happens when user presses a key while editing a toDo?
				$('#editField-' + value.id + '-' + controlId).keydown(this._onEditKeyPress.bind(this));

				// what happens when user checks the completed checkbox for a toDo?
				$('#completeToDo-' + value.id + '-' + controlId).click(this.onToggleToDo.bind(this));
			}, this);

			// set focus on input textfield
			document.getElementById('inputToDo-' + this.sId).focus();
		},

		/*
		 * Define how the ToDoMVC control should be rendered
		 */
		renderer: {
			controlID,

			render: function (oRm, oControl) {
				controlID = oControl.getId();
				toDos = oControl.getToDosObject();
				filter = oControl.getFilter();
				toDosAvailable = (toDos && toDos.length > 0) ? true : false;
				toDosUncompleted = oControl._getAllToDosWithStatus(false);
				oBundle = oControl.getModel('i18n').getResourceBundle();

				//Create the control
				oRm.write('<div');
				oRm.writeControlData(oControl);
				oRm.write('><section class="todoapp"><header class="header">' +
					'<h1>' + oBundle.getText('title') + '</h1><input id="inputToDo-' + controlID +
					'" class="new-todo" placeholder="' + oBundle.getText('newTodo') +
					'" autofocus></header>');

				oRm.write(toDosAvailable ? '<section class="main">' : '<section class="main" style="display:none;">');

				oRm.write(+toDosUncompleted.length === 0 ? '<input id="inputToDoToggle-' + controlID +
					'" class="toggle-all" type="checkbox" checked>' : '<input id="inputToDoToggle-' + controlID +
					'" class="toggle-all" type="checkbox">');


				oRm.write('<label id="labelToDo-' +
					controlID + '" for="toggle-all">' +
					oBundle.getText('markAllAsComplete') + '</label>' +
					'<ul id="listToDo" class="todo-list">');

				if (toDosAvailable) {

					toDos.forEach(function (toDoObject) {
						shouldDisplayToDoObject = (filter === 'all' || (filter === 'completed' && toDoObject.completed) ||
							(filter === 'active' && !toDoObject.completed));

						if (shouldDisplayToDoObject) {

							if (toDoObject.completed) {
								oRm.write('<li id="' + toDoObject.id + '-' + controlID + '" class="completed"><div class="view">' +
									'<input id="completeToDo-' + toDoObject.id + '-' + controlID +
									'" class="toggle" type="checkbox" checked>');
							} else {
								oRm.write('<li id="' + toDoObject.id + '-' + controlID + '"><div class="view">' +
									'<input id="completeToDo-' + toDoObject.id + '-' + controlID + '" class="toggle" type="checkbox">');
							}

							oRm.write('<label id="labelFor-' + toDoObject.id + '-' + controlID + '">' + toDoObject.title + '</label>' +
								'<button id="destroyToDo-' + toDoObject.id + '-' + controlID + '" class="destroy"></button>' +
								'</div><input id="editField-' + toDoObject.id + '-' + controlID + '" class="edit" value="' +
								toDoObject.title + '"></li>');
						}
					}, this);
				}

				oRm.write('</ul></section>');

				if (toDosAvailable) {
					oRm.write('<footer id="footer" class="footer"><span id="toDoCounter" class="todo-count">');

					sItem = (+toDosUncompleted.length === 1 ? oBundle.getText('singleLeft') : oBundle.getText('multipleLeft'));

					oRm.write('<strong>' + toDosUncompleted.length + '</strong> ' + sItem +
						'</span><ul class="filters"><li>');

					oRm.write(filter === 'all' ? '<a class="selected" href="#/">' +
						oBundle.getText('all') + '</a></li><li>' : '<a href="#/">' + oBundle.getText('all') + '</a></li><li>');

					oRm.write(filter === 'active' ? '<a class="selected" href="#/active">' +
						oBundle.getText('active') + '</a></li><li>' : '<a href="#/active">' +
						oBundle.getText('active') + '</a></li><li>');

					oRm.write(filter === 'completed' ? '<a class="selected" href="#/completed">' +
						oBundle.getText('completed') + '</a></li></ul>' : '<a href="#/completed">' +
						oBundle.getText('completed') + '</a></li></ul>');


					if ((+toDos.length - +toDosUncompleted.length) > 0) {
						oRm.write('<button id="deleteAllCompleted-' + controlID + '" class="clear-completed">' +
							oBundle.getText('clearCompleted') + '</button>');
					}
					oRm.write('</footer>');
				} else {
					oRm.write('<footer id="footer" class="footer" style="display:none;"></footer>');
				}
				oRm.write('</section><footer class="info"><p>' + oBundle.getText('doubleClickInfo') + '</p>' +
					'<p>' + oBundle.getText('credits') +
					' <a href="https://github.com/agraebe">Alexander Graebe</a> &amp;' +
					' <a href="https://github.com/alexis90">Alexander Hauck</a></p>' +
					'<p>' + oBundle.getText('partOf') +
					' <a href="http://todomvc.com">TodoMVC</a></p></footer></div>');
			}
		}
	});
});
