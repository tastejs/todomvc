(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	var uku = new Ukulele();
	var mainCtrl = new MainController(uku);
	uku.registerController("mainCtrl", mainCtrl);
	uku.registerComponent("info", "components/info.html");
	uku.registerComponent("footer", "components/footer.html");
	uku.registerComponent("header", "components/header.html");
	uku.registerComponent("main", "components/main.html");
	uku.registerComponent("task-item", "components/task-item.html");

	uku.addListener(Ukulele.INITIALIZED, function (e) {
		mainCtrl.registerEventListener();
	});

	uku.init();

	function MainController(uku) {
		var self = this;
		this.todos = [];
		this.todoTasksCount = getLeftCount();
		function getLeftCount() {
			var count = 0;
			for (var i = 0; i < self.todos.length; i++) {
				if (!self.todos[i].completed) {
					count++
				}
			}
			return count;
		};
		function updateStatus(){
			self.todoTasksCount = getLeftCount();
		}
		this.registerEventListener = function () {
			document.getElementById("myHeader").addEventListener("newtaskinputed", function (event) {
				var id = self.todos.length;
				var newTask = { id: id, title: event.data.message, completed: false };
				self.todos.push(newTask);
				updateStatus();
				uku.refresh("mainCtrl");
			});
			document.getElementById("myMain").addEventListener("removetask", function (event) {
				var task = event.data.message;
				for (var i = 0; i < self.todos.length; i++) {
					if (task.id === self.todos[i].id) {
						self.todos.splice(i, 1);
						updateStatus();
						uku.refresh("mainCtrl");
						break;
					}
				}
			});
			document.getElementById("myMain").addEventListener("toggletaskstatus", function (event) {
				updateStatus();
				uku.refresh("mainCtrl");
			});
		};

	}
})(window);
