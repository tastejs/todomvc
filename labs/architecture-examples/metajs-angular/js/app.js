"use strict"
// import active logoses;

// common extensions;



// common runtime functions;



var todomvc = angular.module("todomvc", []);

// Generic utils and helpers for AngularJS.;

//(macrojs within);


todomvc.factory("todoStorage", [(function() {
  var storageId = "todos-angularjs";
  return {
    get: (function() {
      return JSON.parse((localStorage.getItem(storageId) || "[]"));
    }),
    put: (function(__ArG_1) {
      return localStorage.setItem(storageId, JSON.stringify(__ArG_1));
    })
};
})]);


todomvc.directive("todoEscape", [(function() {
  var escapeKey = 27;
  return (function(scope, elem, attrs) {
    return elem.bind("keydown", (function(event) {
      if ((event.keyCode === escapeKey)) {
        return scope.$apply(attrs.todoEscape);
      }
    }));
  });
})]);


todomvc.directive("todoFocus", ["$timeout", (function($timeout) {
  return (function(scope, elem, attrs) {
    return scope.$watch(attrs.todoFocus, (function(newVal) {
      if (newVal) {
        return $timeout((function() {
          return (elem)[0].focus();
        }), 0, false);
      }
    }));
  });
})]);


todomvc.controller("TodoCtrl", ["$scope", "$location", "todoStorage", "filterFilter", (function($scope, $location, todoStorage, filterFilter) {
  $scope.todos = todoStorage.get();
  $scope.newTodo = "";
  $scope.editedTodo = null;
  $scope.originalTodo = null;
  $scope.location = $location;
  $scope.remainingCount = null;
  $scope.completedCount = null;
  $scope.allChecked = null;
  $scope.statusFilter = null;
  $scope.todoIndex = (function(todo) {
    return $scope.todos.indexOf(todo);
  });
  $scope.setTodo = (function(index, todo) {
    ($scope.todos)[index] = todo;
  });
  $scope.addTodo = (function() {
    return (function() {
      var text = $scope.newTodo.trim();
      if (text) {
        $scope.todos.push({
          title: text,
          completed: false
});
        $scope.newTodo = "";
      }
    })();
  });
  $scope.editTodo = (function(todo) {
    // Clone the original todo to restore it on demand.;
    $scope.editedTodo = todo;
    $scope.originalTodo = angular.extend({}, todo);
  });
  $scope.removeTodo = (function(todo) {
    return $scope.todos.splice($scope.todoIndex(todo) /*logos:1*/ , 1);
  });
  $scope.doneEditing = (function(todo) {
    $scope.editedTodo = null;
    todo.title = todo.title.trim();
    if (!todo.title) {
      return $scope.removeTodo(todo);
    }
  });
  $scope.revertEditing = (function(todo) {
    $scope.setTodo($scope.todoIndex(todo) /*logos:1*/ , $scope.originalTodo);
    return $scope.doneEditing($scope.originalTodo);
  });
  $scope.clearCompletedTodos = (function() {
    $scope.todos = $scope.todos.filter((function(__ArG_1) {
      return !__ArG_1.completed;
    }));
  });
  $scope.markAll = (function(completed) {
    return $scope.todos.forEach((function(__ArG_1) {
      __ArG_1.completed = !completed;
    }));
  });
  ($scope)["$watch"]("todos", (function(newValue, oldValue) {
    $scope.remainingCount = filterFilter($scope.todos, {completed: false}).length;
    $scope.completedCount = ($scope.todos.length - $scope.remainingCount);
    $scope.allChecked = !$scope.remainingCount;
    if ((newValue !== oldValue)) {
      return todoStorage.put($scope.todos);
    }
  }), true);
  if (($location.path() === "")) {
    $location.path("/");
  }
  ($scope)["$watch"]("location.path()", (function(path) {
    $scope.statusFilter = (function() {
      switch (path) {
        case "/active": return {completed: false};
        case "/completed": return {completed: true};
        default: return null;
        }
    })();
  }));
})]);


