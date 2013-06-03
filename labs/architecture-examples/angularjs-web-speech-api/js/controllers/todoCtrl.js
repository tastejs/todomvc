/*global todomvc */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage, todoSpeech, filterFilter) {
	var todos = $scope.todos = todoStorage.get();
	$scope.newTodo = '';
	$scope.editedTodo = null;

    $scope.speechListening = false;

	// Voice Command triggers
	//   RegExps must be escaped.
	//   '/' delimeters and start of string ^ match must be omitted
	$scope.commands = {
		"edit ([0-9]+)$": function (match) {
			$scope.editTodo($scope.todos[parseInt(match[1]) - 1]);
		},
		'clear ([0-9]+)$': function (match) {
			$scope.removeTodo(todos[parseInt(match[1]) - 1]);
		},
		'complete ([0-9]+)$': function (match) {
			$scope.todos[parseInt(match[1]) - 1].completed = true;
		},
		'undo$': function (match) {
			$scope.removeTodo(todos.indexOf(todos.length + 1));
		},
		'clear all completed$': function (match) {
			$scope.clearCompletedTodos();
		},
		'clear all$': function (match) {
			$scope.allChecked = true;
			$scope.removeTodo();
		},
		'show all$': function (match) {
			$scope.location.path('/');
		},
		'show active$': function (match) {
			$scope.location.path('/active');
		},
		'show completed$': function (match) {
			$scope.location.path('/completed');
		}
	};

	$scope.$watch('todos', function () {
		$scope.remainingCount = filterFilter(todos, { completed: false }).length;
		$scope.completedCount = todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
		todoStorage.put(todos);
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
				{ completed: false } : (path === '/completed') ?
				{ completed: true } : null;
	});

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

		todos.push({
			title: newTodo,
			completed: false
		});

		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.removeTodo = function (todo) {
		if ($scope.allChecked) {
			todos.length = 0;
		} else {
			todos.splice(todos.indexOf(todo), 1);
		}
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos = todos = todos.filter(function (val) {
			return !val.completed;
		});
	};

	$scope.markAll = function (completed) {
		todos.forEach(function (todo) {
			todo.completed = completed;
		});
	};

	$scope.parseCommand = function (transcript) {
		var todo = transcript.toLowerCase(),
			commands = $scope.commands,
			cmd,
			cmds_len = commands.length,
			re,
			re_match;

		// search for and execute command
		for (cmd in commands) {
			re = new RegExp('^' + cmd);
			re_match = re.exec(todo);

			if (re_match) {
				$scope.$apply(commands[cmd](re_match));
				return re_match;
			}
		}
		return;
	};

	$scope.capitalize = function (s) {
        var first_char = /\S/;
		return s.replace(first_char, function (m) { return m.toUpperCase(); });
	};

	$scope.processTranscriptResult = function (transcript_args) {
		// Parse transcript for commands and return focus to New Todo
		if (transcript_args.isFinal) {
			var cmd = $scope.parseCommand(transcript_args.transcript);
			if (cmd) {
				$scope.newTodo = '';
				$scope.$apply(cmd);
				return;
			}
		}

		// Update todo in editing state,
		// or create new todo
		if ($scope.editedTodo) {
			$scope.editedTodo.title = $scope.capitalize(transcript_args.transcript);
			if (transcript_args.isFinal) {
				$scope.doneEditing($scope.editedTodo);
			}
		} else {
			$scope.newTodo = $scope.capitalize(transcript_args.transcript);
			if (transcript_args.isFinal) {
				$scope.addTodo();
				$scope.newTodo = '';
				document.getElementById('new-todo').focus();
			}
		}
		$scope.$apply();
	};

	$scope.$on('todoSpeech:startListening', function (event, args) {
		$scope.speechListening = true;
        $scope.$apply();
	});

	$scope.$on('todoSpeech:stopListening', function (event, args) {
        $scope.speechListening = false;
        $scope.$apply();
	});

	$scope.$on('todoSpeech:transcriptResult', function (event, args) {
		$scope.processTranscriptResult(args);
	});

    // Begin listening
    todoSpeech.startRecognition();
});
