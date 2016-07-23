'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
	/**
  * Take a model & view, then act as controller between them
  * @param  {object} model The model instance
  * @param  {object} view  The view instance
  */

	function Controller(model, view) {
		var _this = this;

		_classCallCheck(this, Controller);

		this.model = model;
		this.view = view;

		this.view.bind('newTodo', function (title) {
			return _this.addItem(title);
		});
		this.view.bind('itemEdit', function (item) {
			return _this.editItem(item.id);
		});
		this.view.bind('itemEditDone', function (item) {
			return _this.editItemSave(item.id, item.title);
		});
		this.view.bind('itemEditCancel', function (item) {
			return _this.editItemCancel(item.id);
		});
		this.view.bind('itemRemove', function (item) {
			return _this.removeItem(item.id);
		});
		this.view.bind('itemToggle', function (item) {
			return _this.toggleComplete(item.id, item.completed);
		});
		this.view.bind('removeCompleted', function () {
			return _this.removeCompletedItems();
		});
		this.view.bind('toggleAll', function (status) {
			return _this.toggleAll(status.completed);
		});
	}

	/**
  * Load & Initialize the view
  * @param {string}  '' | 'active' | 'completed'
  */

	_createClass(Controller, [{
		key: 'setView',
		value: function setView(hash) {
			var route = hash.split('/')[1];
			var page = route || '';
			this._updateFilter(page);
		}

		/**
   * Event fires on load. Gets all items & displays them
   */

	}, {
		key: 'showAll',
		value: function showAll() {
			var _this2 = this;

			this.model.read(function (data) {
				return _this2.view.render('showEntries', data);
			});
		}

		/**
   * Renders all active tasks
   */

	}, {
		key: 'showActive',
		value: function showActive() {
			var _this3 = this;

			this.model.read({ completed: false }, function (data) {
				return _this3.view.render('showEntries', data);
			});
		}

		/**
   * Renders all completed tasks
   */

	}, {
		key: 'showCompleted',
		value: function showCompleted() {
			var _this4 = this;

			this.model.read({ completed: true }, function (data) {
				return _this4.view.render('showEntries', data);
			});
		}

		/**
   * An event to fire whenever you want to add an item. Simply pass in the event
   * object and it'll handle the DOM insertion and saving of the new item.
   */

	}, {
		key: 'addItem',
		value: function addItem(title) {
			var _this5 = this;

			if (title.trim() === '') {
				return;
			}

			this.model.create(title, function () {
				_this5.view.render('clearNewTodo');
				_this5._filter(true);
			});
		}

		/*
   * Triggers the item editing mode.
   */

	}, {
		key: 'editItem',
		value: function editItem(id) {
			var _this6 = this;

			this.model.read(id, function (data) {
				var title = data[0].title;
				_this6.view.render('editItem', { id: id, title: title });
			});
		}

		/*
   * Finishes the item editing mode successfully.
   */

	}, {
		key: 'editItemSave',
		value: function editItemSave(id, title) {
			var _this7 = this;

			title = title.trim();

			if (title.length !== 0) {
				this.model.update(id, { title: title }, function () {
					_this7.view.render('editItemDone', { id: id, title: title });
				});
			} else {
				this.removeItem(id);
			}
		}

		/*
   * Cancels the item editing mode.
   */

	}, {
		key: 'editItemCancel',
		value: function editItemCancel(id) {
			var _this8 = this;

			this.model.read(id, function (data) {
				var title = data[0].title;
				_this8.view.render('editItemDone', { id: id, title: title });
			});
		}

		/**
   * Find the DOM element with given ID,
   * Then remove it from DOM & Storage
   */

	}, {
		key: 'removeItem',
		value: function removeItem(id) {
			var _this9 = this;

			this.model.remove(id, function () {
				return _this9.view.render('removeItem', id);
			});
			this._filter();
		}

		/**
   * Will remove all completed items from the DOM and storage.
   */

	}, {
		key: 'removeCompletedItems',
		value: function removeCompletedItems() {
			var _this10 = this;

			this.model.read({ completed: true }, function (data) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						_this10.removeItem(item.id);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			});

			this._filter();
		}

		/**
   * Give it an ID of a model and a checkbox and it will update the item
   * in storage based on the checkbox's state.
   *
   * @param {number} id The ID of the element to complete or uncomplete
   * @param {object} checkbox The checkbox to check the state of complete
   *                          or not
   * @param {boolean|undefined} silent Prevent re-filtering the todo items
   */

	}, {
		key: 'toggleComplete',
		value: function toggleComplete(id, completed, silent) {
			var _this11 = this;

			this.model.update(id, { completed: completed }, function () {
				_this11.view.render('elementComplete', { id: id, completed: completed });
			});

			if (!silent) {
				this._filter();
			}
		}

		/**
   * Will toggle ALL checkboxes' on/off state and completeness of models.
   * Just pass in the event object.
   */

	}, {
		key: 'toggleAll',
		value: function toggleAll(completed) {
			var _this12 = this;

			this.model.read({ completed: !completed }, function (data) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						_this12.toggleComplete(item.id, completed, true);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			});

			this._filter();
		}

		/**
   * Updates the pieces of the page which change depending on the remaining
   * number of todos.
   */

	}, {
		key: '_updateCount',
		value: function _updateCount() {
			var _this13 = this;

			this.model.getCount(function (todos) {
				var completed = todos.completed;
				var visible = completed > 0;
				var checked = completed === todos.total;

				_this13.view.render('updateElementCount', todos.active);
				_this13.view.render('clearCompletedButton', { completed: completed, visible: visible });

				_this13.view.render('toggleAll', { checked: checked });
				_this13.view.render('contentBlockVisibility', { visible: todos.total > 0 });
			});
		}

		/**
   * Re-filters the todo items, based on the active route.
   * @param {boolean|undefined} force  forces a re-painting of todo items.
   */

	}, {
		key: '_filter',
		value: function _filter(force) {
			var active = this._activeRoute;
			var activeRoute = active.charAt(0).toUpperCase() + active.substr(1);

			// Update the elements on the page, which change with each completed todo
			this._updateCount();

			// If the last active route isn't "All", or we're switching routes, we
			// re-create the todo item elements, calling:
			//   this.show[All|Active|Completed]()
			if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
				this['show' + activeRoute]();
			}

			this._lastActiveRoute = activeRoute;
		}

		/**
   * Simply updates the filter nav's selected states
   */

	}, {
		key: '_updateFilter',
		value: function _updateFilter(currentPage) {
			// Store a reference to the active route, allowing us to re-filter todo
			// items as they are marked complete or incomplete.
			this._activeRoute = currentPage;

			if (currentPage === '') {
				this._activeRoute = 'All';
			}

			this._filter();

			this.view.render('setFilter', currentPage);
		}
	}]);

	return Controller;
}();

exports.default = Controller;