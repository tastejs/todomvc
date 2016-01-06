/* global sap, $ */

sap.ui.define([
	'sap/ui/core/Control'
], function (Control) {
	'use strict';

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

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
			if (evt.keyCode === ENTER_KEY) {
				var title = evt.target.value.trim();

				// prevent firing an event if title is empty
				if (!title || title.length === 0) {
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
				toDoId: parseInt(itemId.split('-')[0])
			});

			this.rerender();
		},

		_getAllToDosWithStatus: function (status) {
			var elems = this.getToDosObject();
			var toDoIds = [];

			for (var i = 0; i < elems.length; i++) {
				if (elems[i].completed === status) {
					toDoIds.push(parseInt(elems[i].id));
				}
			}

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
				toDoId: parseInt(itemId.split('-')[0]),
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
			if (evt.keyCode === ENTER_KEY) {
				this.onLeaveEditToDoFocus(evt);
			} else if (evt.keyCode === ESCAPE_KEY) {
				// no changes on ESC, just invalidate
				this.rerender();
			}
		},

		onLeaveEditToDoFocus: function (evt) {
			var toDoId = evt.target.id.split('-')[1];
			var newTitle = evt.target.value.trim();

			// destroy toDo if new title is empty
			if (!newTitle || newTitle.length === 0) {
				this.fireEvent('deleteToDoPressed', {
					toDoId: parseInt(toDoId)
				});
			} else {
				this.fireEvent('toDoChangedPressed', {
					toDoId: parseInt(toDoId),
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
				for (var i = 0; i < toDoIds.length; i++) {
					// fire changed event
					this.fireEvent('completedToDoPressed', {
						toDoId: toDoIds[i],
						completed: true
					});
				}
			} else {
				// uncomplete all toDos
				for (var j = 0; j < elems.length; j++) {
					// fire changed event
					this.fireEvent('completedToDoPressed', {
						toDoId: elems[j].id,
						completed: false
					});
				}
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

			for (var i = 0; i < allToDosObjects.length; i++) {

				// what happens when user delets toDo?
				$('#destroyToDo-' + allToDosObjects[i].id + '-' + controlId).click(this.onDeleteToDo.bind(this));

				// what happens when user double-clicks a toDo?
				$('#labelFor-' + allToDosObjects[i].id + '-' + controlId).dblclick(this.onEditToDo.bind(this));

				// what happens when user removes focus while editing a toDo?
				// captures blur events in IE as well
				$('#editField-' + allToDosObjects[i].id + '-' + controlId).focusout(this.onLeaveEditToDoFocus.bind(this));

				// what happens when user presses a key while editing a toDo?
				$('#editField-' + allToDosObjects[i].id + '-' + controlId).keydown(this._onEditKeyPress.bind(this));

				// what happens when user checks the completed checkbox for a toDo?
				$('#completeToDo-' + allToDosObjects[i].id + '-' + controlId).click(this.onToggleToDo.bind(this));
			}

			// set focus on input textfield
			document.getElementById('inputToDo-' + this.sId).focus();
		},

		/*
		 * Define how the ToDoMVC control should be rendered
		 */
		renderer: {
			render: function (oRm, oControl) {

				var controlID = oControl.getId();
				var toDos = oControl.getToDosObject();
				var filter = oControl.getFilter();
				var toDosAvailable = (toDos && toDos.length > 0) ? true : false;
				var toDosUncompleted = oControl._getAllToDosWithStatus(false);
				var sItem;
				var oBundle = oControl.getModel('i18n').getResourceBundle();

				//Create the control
				oRm.write('<div');
				oRm.writeControlData(oControl);
				oRm.write('>');
				oRm.write('<section class="todoapp">');
				oRm.write('<header class="header">');
				oRm.write('<h1>' + oBundle.getText('title') + '</h1>');
				oRm.write('<input id="inputToDo-' + controlID +
									'" class="new-todo" placeholder="' + oBundle.getText('newTodo') + '" autofocus>');

				oRm.write('</header>');

				if (toDosAvailable) {
					oRm.write('<section class="main">');
				} else {
					oRm.write('<section class="main" style="display:none;">');
				}

				if (toDosUncompleted.length === 0) {
					oRm.write('<input id="inputToDoToggle-' + controlID + '" class="toggle-all" type="checkbox" checked>');
				} else {
					oRm.write('<input id="inputToDoToggle-' + controlID + '" class="toggle-all" type="checkbox">');
				}

				oRm.write('<label id="labelToDo-' +
									controlID + '" for="toggle-all">' +
									oBundle.getText('markAllAsComplete') + '</label>');

				oRm.write('<ul id="listToDo" class="todo-list">');

				if (toDosAvailable) {

					for (var i = 0; i < toDos.length; i++) {
						var toDoObject = toDos[i];
						var shouldDisplayToDoObject = (filter === 'all' || (filter === 'completed' && toDoObject.completed) ||
							(filter === 'active' && !toDoObject.completed));

						if (shouldDisplayToDoObject) {

							if (toDoObject.completed) {
								oRm.write('<li id="' + toDoObject.id + '-' + controlID + '" class="completed">');
							} else {
								oRm.write('<li id="' + toDoObject.id + '-' + controlID + '">');
							}
							oRm.write('<div class="view">');

							if (toDoObject.completed) {
								oRm.write('<input id="completeToDo-' + toDoObject.id + '-' + controlID +
													'" class="toggle" type="checkbox" checked>');
							} else {
								oRm.write('<input id="completeToDo-' + toDoObject.id + '-' + controlID + '" class="toggle" type="checkbox">');
							}
							oRm.write('<label id="labelFor-' + toDoObject.id + '-' + controlID + '">' + toDoObject.title + '</label>');
							oRm.write('<button id="destroyToDo-' + toDoObject.id + '-' + controlID + '" class="destroy"></button>');
							oRm.write('</div>');
							oRm.write('<input id="editField-' + toDoObject.id + '-' + controlID + '" class="edit" value="' +
												toDoObject.title + '">');
							oRm.write('</li>');
						}
					}
				}

				oRm.write('</ul>');
				oRm.write('</section>');
				if (toDosAvailable) {
					oRm.write('<footer id="footer" class="footer">');
					oRm.write('<span id="toDoCounter" class="todo-count">');
					if (toDosUncompleted.length === 1) {
						sItem = oBundle.getText('singleLeft');
					} else {
						sItem = oBundle.getText('multipleLeft');
					}
					oRm.write('<strong>' + toDosUncompleted.length + '</strong> ' + sItem);
					oRm.write('</span>');
					oRm.write('<ul class="filters">');
					oRm.write('<li>');

					if (filter === 'all') {
						oRm.write('<a class="selected" href="#/">' + oBundle.getText('all') + '</a>');
					} else {
						oRm.write('<a href="#/">' + oBundle.getText('all') + '</a>');
					}

					oRm.write('</li>');
					oRm.write('<li>');

					if (filter === 'active') {
						oRm.write('<a class="selected" href="#/active">' + oBundle.getText('active') + '</a>');
					} else {
						oRm.write('<a href="#/active">' + oBundle.getText('active') + '</a>');
					}

					oRm.write('</li>');
					oRm.write('<li>');

					if (filter === 'completed') {
						oRm.write('<a class="selected" href="#/completed">' + oBundle.getText('completed') + '</a>');
					} else {
						oRm.write('<a href="#/completed">' + oBundle.getText('completed') + '</a>');
					}

					oRm.write('</li>');
					oRm.write('</ul>');
					if ((toDos.length - toDosUncompleted.length) > 0) {
						oRm.write('<button id="deleteAllCompleted-' + controlID + '" class="clear-completed">' +
											oBundle.getText('clearCompleted') + '</button>');
					}
					oRm.write('</footer>');
				} else {
					oRm.write('<footer id="footer" class="footer" style="display:none;"></footer>');
				}
				oRm.write('</section>');
				oRm.write('<footer class="info">');
				oRm.write('<p>' + oBundle.getText('doubleClickInfo') + '</p>');
				oRm.write('<p>' + oBundle.getText('credits') +
									' <a href="https://github.com/agraebe">Alexander Graebe</a> &amp;' +
									' <a href="https://github.com/alexis90">Alexander Hauck</a></p>');
				oRm.write('<p>' + oBundle.getText('partOf') + ' <a href="http://todomvc.com">TodoMVC</a></p>');
				oRm.write('</footer>');
				oRm.write('</div>');
			}
		}
	});
});
