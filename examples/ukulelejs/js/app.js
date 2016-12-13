/*global define, Ukulele */
/*jshint unused:false */
(function () {
	'use strict';

	// Your starting point. Enjoy the ride!
	function MainController(uku) {
		var self = this;
		this.currentFilterType = 'all';
		this.todos = [];
		this.displayTodos = [];
		var isInit = true;
		var routes = {
			'/:filter': function (filter) {
				self.currentFilterType = filter;
				if (isInit) {
					isInit = false;
				} else {
					updateStatus();
				}

			}
		};
		var router = Router(routes);
		router.init('all');

		(function loadData() {
			var savedData = localStorage.getItem('todos-ukulelejs');
			if (savedData) {
				savedData = JSON.parse(localStorage.getItem('todos-ukulelejs'));
				//self.currentFilterType = savedData.filter;
				self.todos = savedData.todos;
				filterTodos(self.currentFilterType);
			}
		})();

		function getLeftCount() {
			var count = 0;
			for (var i = 0; i < self.todos.length; i++) {
				if (!self.todos[i].completed) {
					count++;
				}
			}
			return count;
		}

		this.todoTasksCount = getLeftCount();
		this.isShowClearBtn = function () {
			for (var i = 0; i < this.todos.length; i++) {
				if (this.todos[i].completed === true) {
					return true;
				}
			}
			return false;
		};

		this.isShowFooter = function () {
			if (this.todos.length > 0) {
				return true;
			}
			return false;
		};

		this.isAllCompleted = function () {
			for (var i = 0; i < this.todos.length; i++) {
				if (this.todos[i].completed === false) {
					return false;
				}
			}
			return true;
		};

		function filterTodos(type) {
			self.displayTodos = [];
			switch (type) {
				case 'all':
					self.displayTodos = self.todos;
					break;
				case 'active':
					self.displayTodos = self.todos.filter(function (item) {
						if (item.completed === false) {
							return true;
						}
						return false;
					});
					break;
				case 'completed':
					self.displayTodos = self.todos.filter(function (item) {
						if (item.completed === true) {
							return true;
						}
						return false;
					});
					break;
				default:
					self.displayTodos = self.todos;
			}
		};

		function updateStatus() {
			self.todoTasksCount = getLeftCount();
			filterTodos(self.currentFilterType);
			localStorage.setItem('todos-ukulelejs', JSON.stringify({
				todos: self.todos
			}));
			uku.refresh('mainCtrl');

		}
		this.registerEventListener = function () {
			document.getElementById('myHeader').addEventListener('newtaskinputed', function (event) {
				var id = self.todos.length;
				var newTask = {
					id: id,
					title: event.data.message,
					completed: false
				};
				self.todos.push(newTask);
				updateStatus();
			});
			document.getElementById('myMain').addEventListener('removetask', function (event) {
				var task = event.data.message;
				for (var i = self.todos.length - 1; i >= 0; i--) {
					if (task.id === self.todos[i].id) {
						self.todos.splice(i, 1);
						updateStatus();
						break;
					}
				}
			});
			document.getElementById('myMain').addEventListener('toggletaskstatus', function (event) {
				updateStatus();
			});

			document.getElementById('myMain').addEventListener('toggleall', function (event) {
				var isAllCompleted = event.data.message;
				for (var i = 0; i < self.todos.length; i++) {
					self.todos[i].completed = isAllCompleted;
				}
				updateStatus();
			});

			document.getElementById('myFooter').addEventListener('filtertodos', function (event) {
				self.currentFilterType = event.data.message;
				updateStatus();
			});

			document.getElementById('myFooter').addEventListener('clearcompleted', function (event) {
				var removeCount = 0;
				for (var i = self.todos.length - 1; i >= 0; i--) {
					if (self.todos[i].completed === true) {
						self.todos.splice(i, 1);
						removeCount++;
					}
				}
				if (removeCount > 0) {
					updateStatus();
				}
			});
		};

	}
	var uku = new Ukulele();
	var mainCtrl = new MainController(uku);
	uku.registerController('mainCtrl', mainCtrl);
	uku.registerComponent('info', 'components/info.html');
	uku.registerComponent('footer', 'components/footer.html');
	uku.registerComponent('header', 'components/header.html');
	uku.registerComponent('main', 'components/main.html');
	uku.registerComponent('task-item', 'components/task-item.html');
	uku.addListener(Ukulele.INITIALIZED, function (event) {
		mainCtrl.registerEventListener();
	});

	uku.init();
})();
