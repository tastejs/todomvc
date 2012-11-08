'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persist the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller( 'TodoCtrl', function TodoCtrl( $scope, $location, todoStorage, filterFilter ) {
  var todos = $scope.todos = todoStorage.get();

  $scope.newTodo = "";
  $scope.remainingCount = filterFilter(todos, {completed: false}).length;
  $scope.editedTodo = null;

  if ( $location.path() === '' ) $location.path('/');
  $scope.location = $location;

  $scope.$watch('location.path()', function( path ) {
    $scope.statusFilter = (path == '/active') ?
    { completed: false } : (path == '/completed') ?
    { completed: true } : null;
  });

  $scope.$watch('remainingCount == 0', function( val ) {
    $scope.allChecked = val;
  });


  $scope.addTodo = function() {
    if ($scope.newTodo.length === 0) return;

    todos.push({
      title: $scope.newTodo,
      completed: false
    });
    todoStorage.put(todos);

    $scope.newTodo = '';
    $scope.remainingCount++;
  };


  $scope.editTodo = function( todo ) {
    $scope.editedTodo = todo;
  };


  $scope.doneEditing = function( todo ) {
    $scope.editedTodo = null;
    if ( !todo.title ) $scope.removeTodo(todo);
    todoStorage.put(todos);
  };


  $scope.removeTodo = function( todo ) {
    $scope.remainingCount -= todo.completed ? 0 : 1;
    todos.splice(todos.indexOf(todo), 1);
    todoStorage.put(todos);
  };


  $scope.todoCompleted = function( todo ) {
    todo.completed ? $scope.remainingCount-- : $scope.remainingCount++;
    todoStorage.put(todos);
  };


  $scope.clearDoneTodos = function() {
    $scope.todos = todos = todos.filter(function( val ) {
      return !val.completed;
    });
    todoStorage.put(todos);
  };


  $scope.markAll = function( done ) {
    todos.forEach(function( todo ) {
      todo.completed = done;
    });
    $scope.remainingCount = done ? 0 : todos.length;
    todoStorage.put(todos);
  };
});
