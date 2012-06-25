/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * -
 * exposes the model to the template and
 */

todomvc.controller( 'TodoCtrl', function TodoCtrl( $scope, $location, filterFilter, persistencejs ) {
	var todos = $scope.todos = [];
	$scope.newTodo = "";
	$scope.editedTodo = null;
	$scope.editTodoStartContent = "";
	
	$scope.$watch('todos', function() {
		$scope.remainingCount = filterFilter(todos, {completed: false}).length;
		$scope.doneCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	persistencejs.fetchAll($scope, function(){ todos = $scope.todos; $scope.refresh(); });

	if($location.path()=='') $location.path('/');
	$scope.location = $location;

	$scope.$watch(function() {return $location.path(); }, function(path) { 
		$scope.statusFilter = path == '/active' ? 
			{ completed: false } : path == '/completed' ?
				{ completed: true } : null;
	});

	$scope.refresh = function(){ $scope.$apply(); }

	$scope.addTodo = function() {
		if ( !$scope.newTodo.length ) { return; }

		todos.push({
			title: this.newTodo,
			completed: false
		});
		
		persistencejs.add(this.newTodo);
		this.newTodo = '';
	};

	$scope.editTodo = function(todo) {
		$scope.editedTodo = todo;
		$scope.editTodoStartContent = todo.title;
	};

	$scope.doneEditing = function(todo) {
		$scope.editedTodo = null;
		if ( !todo.title ) {
			$scope.removeTodo(todo);
			persistencejs.remove(todo);
		} else {
			persistencejs.edit($scope.editTodoStartContent, todo.title);
		}
	};

	$scope.removeTodo = function(todo) {
		todos.splice(todos.indexOf(todo), 1);
		persistencejs.remove(todo);
	};

	$scope.clearDoneTodos = function() {
		$scope.todos = todos = todos.filter(function(val) {
			return !val.completed;
		});
		persistencejs.clearCompletedItems();
	};

	$scope.toggleDone = function( todo ) {
		persistencejs.changeStatus(todo);
	};

	$scope.markAll = function( done ) {
		todos.forEach(function( todo ){
			todo.completed = done;
		});
		persistencejs.markAll( done, $scope.refresh );
	};
});
