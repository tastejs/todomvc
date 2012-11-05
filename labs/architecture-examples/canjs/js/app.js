(function () {
	$(function () {
		can.route(':filter');
		// Initialize the app
		Models.Todo.findAll({}, function (todos) {
			new Todos('#todoapp', {
				todos : todos,
				state : can.route
			});
		});
	})
})();
