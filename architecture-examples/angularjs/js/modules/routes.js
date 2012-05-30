todomvc.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/:filter', {
		template: 'list.html',
		controller: TodoController
	}).otherwise({
		template: 'list.html',
		controller: TodoController
	});
}]);
