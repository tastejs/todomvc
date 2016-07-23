System.register(['aurelia-binding', './todo-item', 'underscore'], function (_export) {
	'use strict';

	var ObserverLocator, TodoItem, _, STORAGE_NAME, ENTER_KEY, Todos;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	return {
		setters: [function (_aureliaBinding) {
			ObserverLocator = _aureliaBinding.ObserverLocator;
		}, function (_todoItem) {
			TodoItem = _todoItem.TodoItem;
		}, function (_underscore) {
			_ = _underscore['default'];
		}],
		execute: function () {
			STORAGE_NAME = 'todomvc-aurelia';
			ENTER_KEY = 13;

			Todos = (function () {
				_createClass(Todos, null, [{
					key: 'inject',
					value: function inject() {
						return [ObserverLocator];
					}
				}]);

				function Todos(observerLocator) {
					var storage = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

					_classCallCheck(this, Todos);

					this.items = [];
					this.filteredItems = [];
					this.filter = '';
					this.newTodoTitle = null;
					this.areAllChecked = false;

					this.observerLocator = observerLocator;
					this.storage = storage || localStorage;
					this.load();
				}

				_createClass(Todos, [{
					key: 'activate',
					value: function activate(params) {
						this.updateFilteredItems(params.filter);
					}
				}, {
					key: 'onKeyUp',
					value: function onKeyUp(ev) {
						if (ev.keyCode === ENTER_KEY) {
							this.addNewTodo(this.newTodoTitle);
						}
					}
				}, {
					key: 'addNewTodo',
					value: function addNewTodo() {
						var title = arguments.length <= 0 || arguments[0] === undefined ? this.newTodoTitle : arguments[0];

						if (title == undefined) {
							return;
						}

						title = title.trim();
						if (title.length === 0) {
							return;
						}

						var newTodoItem = new TodoItem(title);
						this.observeItem(newTodoItem);
						this.items.push(newTodoItem);
						this.newTodoTitle = null;
						this.updateAreAllCheckedState();
						this.updateFilteredItems(this.filter);
						this.save();
					}
				}, {
					key: 'observeItem',
					value: function observeItem(todoItem) {
						var _this = this;

						this.observerLocator.getObserver(todoItem, 'title').subscribe(function (o, n) {
							return _this.onTitleChanged(todoItem);
						});

						this.observerLocator.getObserver(todoItem, 'isCompleted').subscribe(function () {
							return _this.onIsCompletedChanged();
						});
					}
				}, {
					key: 'onTitleChanged',
					value: function onTitleChanged(todoItem) {
						if (todoItem.title === '') {
							this.deleteTodo(todoItem);
							this.updateAreAllCheckedState();
						}

						this.save();
					}
				}, {
					key: 'onIsCompletedChanged',
					value: function onIsCompletedChanged() {
						this.updateAreAllCheckedState();
						this.updateFilteredItems(this.filter);

						this.save();
					}
				}, {
					key: 'deleteTodo',
					value: function deleteTodo(todoItem) {
						this.items = _(this.items).without(todoItem);
						this.updateAreAllCheckedState();
						this.updateFilteredItems(this.filter);
						this.save();
					}
				}, {
					key: 'onToggleAllChanged',
					value: function onToggleAllChanged() {
						var _this2 = this;

						this.items = _.map(this.items, function (item) {
							item.isCompleted = _this2.areAllChecked;
							return item;
						});

						this.updateFilteredItems(this.filter);
					}
				}, {
					key: 'clearCompletedTodos',
					value: function clearCompletedTodos() {
						this.items = _(this.items).filter(function (i) {
							return !i.isCompleted;
						});
						this.areAllChecked = false;
						this.updateFilteredItems(this.filter);
						this.save();
					}
				}, {
					key: 'updateAreAllCheckedState',
					value: function updateAreAllCheckedState() {
						this.areAllChecked = _(this.items).all(function (i) {
							return i.isCompleted;
						});
					}
				}, {
					key: 'updateFilteredItems',
					value: function updateFilteredItems(filter) {
						this.filter = filter || '!';

						switch (filter) {
							case 'active':
								this.filteredItems = _(this.items).filter(function (i) {
									return !i.isCompleted;
								});
								break;
							case 'completed':
								this.filteredItems = _(this.items).filter(function (i) {
									return i.isCompleted;
								});
								break;
							default:
								this.filteredItems = this.items;
								break;
						}
					}
				}, {
					key: 'load',
					value: function load() {
						var _this3 = this;

						var storageContent = this.storage.getItem(STORAGE_NAME);
						if (storageContent == undefined) {
							return;
						}

						var simpleItems = JSON.parse(storageContent);
						this.items = _.map(simpleItems, function (item) {
							var todoItem = new TodoItem(item.title);
							todoItem.isCompleted = item.completed;

							_this3.observeItem(todoItem);

							return todoItem;
						});
						this.updateAreAllCheckedState();
					}
				}, {
					key: 'save',
					value: function save() {
						var simpleItems = _.map(this.items, function (item) {
							return {
								title: item.title,
								completed: item.isCompleted
							};
						});

						this.storage.setItem(STORAGE_NAME, JSON.stringify(simpleItems));
					}
				}, {
					key: 'countTodosLeft',
					get: function get() {
						return _(this.items).filter(function (i) {
							return !i.isCompleted;
						}).length;
					}
				}]);

				return Todos;
			})();

			_export('Todos', Todos);
		}
	};
});
//# sourceMappingURL=data:application/json;base64,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QUFFdEMsY0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTNCLGNBQU8sUUFBUSxDQUFDO09BQ2hCLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO01BQ2hDOzs7WUFFRyxnQkFBRztBQUNOLFVBQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFBLElBQUksRUFBSTtBQUFFLGNBQU87QUFDdEQsYUFBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVc7UUFDM0IsQ0FBQTtPQUFDLENBQUMsQ0FBQzs7QUFFSixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO01BQ2hFOzs7VUEvQ2lCLGVBQUc7QUFDcEIsYUFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7Y0FBSSxDQUFDLENBQUMsQ0FBQyxXQUFXO09BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztNQUN4RDs7O1dBMUZXLEtBQUsiLCJmaWxlIjoidG9kb3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09ic2VydmVyTG9jYXRvcn0gZnJvbSAnYXVyZWxpYS1iaW5kaW5nJztcbmltcG9ydCB7VG9kb0l0ZW19IGZyb20gJy4vdG9kby1pdGVtJztcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuXG5jb25zdCBTVE9SQUdFX05BTUUgPSAndG9kb212Yy1hdXJlbGlhJztcbmNvbnN0IEVOVEVSX0tFWSA9IDEzO1xuXG5leHBvcnQgY2xhc3MgVG9kb3Mge1xuXHRzdGF0aWMgaW5qZWN0KCkgeyByZXR1cm4gW09ic2VydmVyTG9jYXRvcl07IH1cblx0Y29uc3RydWN0b3Iob2JzZXJ2ZXJMb2NhdG9yLCBzdG9yYWdlID0gbnVsbCkge1xuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcblx0XHR0aGlzLmZpbHRlciA9ICcnO1xuXHRcdHRoaXMubmV3VG9kb1RpdGxlID0gbnVsbDtcblx0XHR0aGlzLmFyZUFsbENoZWNrZWQgPSBmYWxzZTtcblxuXHRcdHRoaXMub2JzZXJ2ZXJMb2NhdG9yID0gb2JzZXJ2ZXJMb2NhdG9yO1xuXHRcdHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2UgfHwgbG9jYWxTdG9yYWdlO1xuXHRcdHRoaXMubG9hZCgpO1xuXHR9XG5cblx0YWN0aXZhdGUocGFyYW1zKSB7XG5cdFx0dGhpcy51cGRhdGVGaWx0ZXJlZEl0ZW1zKHBhcmFtcy5maWx0ZXIpO1xuXHR9XG5cblx0b25LZXlVcChldikge1xuXHRcdGlmIChldi5rZXlDb2RlID09PSBFTlRFUl9LRVkpIHtcblx0XHRcdHRoaXMuYWRkTmV3VG9kbyh0aGlzLm5ld1RvZG9UaXRsZSk7XG5cdFx0fVxuXHR9XG5cblx0YWRkTmV3VG9kbyh0aXRsZSA9IHRoaXMubmV3VG9kb1RpdGxlKSB7XG5cdFx0aWYgKHRpdGxlID09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cblxuXHRcdHRpdGxlID0gdGl0bGUudHJpbSgpO1xuXHRcdGlmICh0aXRsZS5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG5cblx0XHRjb25zdCBuZXdUb2RvSXRlbSA9IG5ldyBUb2RvSXRlbSh0aXRsZSk7XG5cdFx0dGhpcy5vYnNlcnZlSXRlbShuZXdUb2RvSXRlbSk7XG5cdFx0dGhpcy5pdGVtcy5wdXNoKG5ld1RvZG9JdGVtKTtcblx0XHR0aGlzLm5ld1RvZG9UaXRsZSA9IG51bGw7XG5cdFx0dGhpcy51cGRhdGVBcmVBbGxDaGVja2VkU3RhdGUoKTtcblx0XHR0aGlzLnVwZGF0ZUZpbHRlcmVkSXRlbXModGhpcy5maWx0ZXIpO1xuXHRcdHRoaXMuc2F2ZSgpO1xuXHR9XG5cblx0b2JzZXJ2ZUl0ZW0odG9kb0l0ZW0pIHtcblx0XHR0aGlzLm9ic2VydmVyTG9jYXRvclxuXHRcdFx0LmdldE9ic2VydmVyKHRvZG9JdGVtLCAndGl0bGUnKVxuXHRcdFx0LnN1YnNjcmliZSgobywgbikgPT4gdGhpcy5vblRpdGxlQ2hhbmdlZCh0b2RvSXRlbSkpO1xuXG5cdFx0dGhpcy5vYnNlcnZlckxvY2F0b3Jcblx0XHRcdC5nZXRPYnNlcnZlcih0b2RvSXRlbSwgJ2lzQ29tcGxldGVkJylcblx0XHRcdC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vbklzQ29tcGxldGVkQ2hhbmdlZCgpKTtcblx0fVxuXG5cdG9uVGl0bGVDaGFuZ2VkKHRvZG9JdGVtKSB7XG5cdFx0aWYgKHRvZG9JdGVtLnRpdGxlID09PSAnJykge1xuXHRcdFx0dGhpcy5kZWxldGVUb2RvKHRvZG9JdGVtKTtcblx0XHRcdHRoaXMudXBkYXRlQXJlQWxsQ2hlY2tlZFN0YXRlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5zYXZlKCk7XG5cdH1cblxuXHRvbklzQ29tcGxldGVkQ2hhbmdlZCgpIHtcblx0XHR0aGlzLnVwZGF0ZUFyZUFsbENoZWNrZWRTdGF0ZSgpO1xuXHRcdHRoaXMudXBkYXRlRmlsdGVyZWRJdGVtcyh0aGlzLmZpbHRlcik7XG5cblx0XHR0aGlzLnNhdmUoKTtcblx0fVxuXG5cdGRlbGV0ZVRvZG8odG9kb0l0ZW0pIHtcblx0XHR0aGlzLml0ZW1zID0gXyh0aGlzLml0ZW1zKS53aXRob3V0KHRvZG9JdGVtKTtcblx0XHR0aGlzLnVwZGF0ZUFyZUFsbENoZWNrZWRTdGF0ZSgpO1xuXHRcdHRoaXMudXBkYXRlRmlsdGVyZWRJdGVtcyh0aGlzLmZpbHRlcik7XG5cdFx0dGhpcy5zYXZlKCk7XG5cdH1cblxuXHRvblRvZ2dsZUFsbENoYW5nZWQoKSB7XG5cdFx0dGhpcy5pdGVtcyA9IF8ubWFwKHRoaXMuaXRlbXMsIGl0ZW0gPT4ge1xuXHRcdFx0aXRlbS5pc0NvbXBsZXRlZCA9IHRoaXMuYXJlQWxsQ2hlY2tlZDtcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy51cGRhdGVGaWx0ZXJlZEl0ZW1zKHRoaXMuZmlsdGVyKTtcblx0fVxuXG5cdGNsZWFyQ29tcGxldGVkVG9kb3MoKSB7XG5cdFx0dGhpcy5pdGVtcyA9IF8odGhpcy5pdGVtcykuZmlsdGVyKGkgPT4gIWkuaXNDb21wbGV0ZWQpO1xuXHRcdHRoaXMuYXJlQWxsQ2hlY2tlZCA9IGZhbHNlO1xuXHRcdHRoaXMudXBkYXRlRmlsdGVyZWRJdGVtcyh0aGlzLmZpbHRlcik7XG5cdFx0dGhpcy5zYXZlKCk7XG5cdH1cblxuXHRnZXQgY291bnRUb2Rvc0xlZnQoKSB7XG5cdFx0cmV0dXJuIF8odGhpcy5pdGVtcykuZmlsdGVyKGkgPT4gIWkuaXNDb21wbGV0ZWQpLmxlbmd0aDtcblx0fVxuXG5cdHVwZGF0ZUFyZUFsbENoZWNrZWRTdGF0ZSgpIHtcblx0XHR0aGlzLmFyZUFsbENoZWNrZWQgPSBfKHRoaXMuaXRlbXMpLmFsbChpID0+IGkuaXNDb21wbGV0ZWQpO1xuXHR9XG5cblx0dXBkYXRlRmlsdGVyZWRJdGVtcyhmaWx0ZXIpIHtcblx0XHR0aGlzLmZpbHRlciA9IGZpbHRlciB8fCAnISc7XG5cblx0XHRzd2l0Y2ggKGZpbHRlcikge1xuXHRcdFx0Y2FzZSAnYWN0aXZlJzpcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gXyh0aGlzLml0ZW1zKS5maWx0ZXIoaSA9PiAhaS5pc0NvbXBsZXRlZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnY29tcGxldGVkJzpcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gXyh0aGlzLml0ZW1zKS5maWx0ZXIoaSA9Plx0aS5pc0NvbXBsZXRlZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0bG9hZCgpIHtcblx0XHRjb25zdCBzdG9yYWdlQ29udGVudCA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKFNUT1JBR0VfTkFNRSk7XG5cdFx0aWYgKHN0b3JhZ2VDb250ZW50ID09IHVuZGVmaW5lZCkgeyByZXR1cm47IH1cblxuXHRcdGNvbnN0IHNpbXBsZUl0ZW1zID0gSlNPTi5wYXJzZShzdG9yYWdlQ29udGVudCk7XG5cdFx0dGhpcy5pdGVtcyA9IF8ubWFwKHNpbXBsZUl0ZW1zLCBpdGVtID0+IHtcblx0XHRcdGNvbnN0IHRvZG9JdGVtID0gbmV3IFRvZG9JdGVtKGl0ZW0udGl0bGUpO1xuXHRcdFx0dG9kb0l0ZW0uaXNDb21wbGV0ZWQgPSBpdGVtLmNvbXBsZXRlZDtcblxuXHRcdFx0dGhpcy5vYnNlcnZlSXRlbSh0b2RvSXRlbSk7XG5cblx0XHRcdHJldHVybiB0b2RvSXRlbTtcblx0XHR9KTtcblx0XHR0aGlzLnVwZGF0ZUFyZUFsbENoZWNrZWRTdGF0ZSgpO1xuXHR9XG5cblx0c2F2ZSgpIHtcblx0XHRjb25zdCBzaW1wbGVJdGVtcyA9IF8ubWFwKHRoaXMuaXRlbXMsIGl0ZW0gPT4geyByZXR1cm4ge1xuXHRcdFx0dGl0bGU6IGl0ZW0udGl0bGUsXG5cdFx0XHRjb21wbGV0ZWQ6IGl0ZW0uaXNDb21wbGV0ZWRcblx0XHR9fSk7XG5cblx0XHR0aGlzLnN0b3JhZ2Uuc2V0SXRlbShTVE9SQUdFX05BTUUsIEpTT04uc3RyaW5naWZ5KHNpbXBsZUl0ZW1zKSk7XG5cdH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
