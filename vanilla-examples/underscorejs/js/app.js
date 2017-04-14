(function() {
	'use strict';

	var todos = [],
		stat = {},
		ENTER_KEY = 13;

	window.addEventListener( 'load', windowLoadHandler, false );

	function Todo( title, completed ) {
		this.id = getUuid();
		this.title = title;
		this.completed = completed;
	}

	function Stat() {
		this.todoLeft = 0;
		this.todoCompleted = 0;
		this.totalTodo = 0;
	}

	function windowLoadHandler() {
		loadTodos();
		refreshData();
		addEventListeners();
	}

	function addEventListeners() {
		document.getElementById('new-todo').addEventListener( 'keypress', newTodoKeyPressHandler, false );
		document.getElementById('toggle-all').addEventListener( 'change', toggleAllChangeHandler, false );
	}

	function inputEditTodoKeyPressHandler( event ) {
		var inputEditTodo = event.target,
			trimmedText = inputEditTodo.value.trim(),
			todoId = event.target.id.slice( 6 );

		if ( trimmedText ) {
			if ( event.keyCode === ENTER_KEY ) {
				editTodo( todoId, trimmedText );
			}
		} else {
			removeTodoById( todoId );
			refreshData();
		}
	}

	function inputEditTodoBlurHandler( event ) {
		var inputEditTodo = event.target,
			todoId = event.target.id.slice( 6 );

		editTodo( todoId, inputEditTodo.value );
	}

	function newTodoKeyPressHandler( event ) {
		if ( event.keyCode === ENTER_KEY ) {
			addTodo( document.getElementById('new-todo').value );
		}
	}

	function toggleAllChangeHandler( event ) {
		_.each( todos, function (todo) {
			todo.completed = event.target.checked;
		});

		refreshData();
	}

	function spanDeleteClickHandler( event ) {
		removeTodoById( event.target.getAttribute('data-todo-id') );
		refreshData();
	}

	function hrefClearClickHandler() {
		removeTodosCompleted();
		refreshData();
	}

	function todoContentHandler( event ) {
		var todoId = event.target.getAttribute('data-todo-id'),
			div = document.getElementById( 'li_' + todoId ),
			inputEditTodo = document.getElementById( 'input_' + todoId );

		div.className = 'editing';
		inputEditTodo.focus();
	}

	function checkboxChangeHandler( event ) {
		var checkbox = event.target,
			todo = getTodoById( checkbox.getAttribute('data-todo-id') );

		todo.completed = checkbox.checked;
		refreshData();
	}

	function loadTodos() {
		if ( !localStorage.getItem('todos-vanillajs') ) {
			localStorage.setItem( 'todos-vanillajs', JSON.stringify([]) );
		}

		todos = JSON.parse( localStorage.getItem('todos-vanillajs') );
	}

	function addTodo( text ) {
		var trimmedText = text.trim();

		if ( trimmedText ) {
			var todo = new Todo( trimmedText, false );
			todos.push( todo );
			refreshData();
		}
	}

	function editTodo( todoId, text ) {
		var todo = _.find( todos, function ( todo ) {
			return todo.id === todoId;
		});
		todo.title = text;

		refreshData();
	}

	function removeTodoById( id ) {
		// Filter will return the todos that do not pass the truth test
		todos = _.filter( todos, function ( todo ) {
			return todo.id === id;
		});
	}

	function removeTodosCompleted() {
		todos = _.filter( todos, function ( todo ) {
			return todo.completed === true;
		});
	}

	function getTodoById( id ) {
		return _.find( todos, function ( todo ) {
			return todo.id === id;
		});
	}

	function refreshData() {
		saveTodos();
		computeStats();
		redrawTodosUI();
		redrawStatsUI();
		changeToggleAllCheckboxState();
	}

	function saveTodos() {
		localStorage.setItem( 'todos-vanillajs', JSON.stringify( todos ) );
	}

	function computeStats() {
		stat = new Stat();
		stat.totalTodo = todos.length;

		// Reduce the todo list to a count of completed items
		stat.todoCompleted = _.reduce( todos, function ( memo, todo ) {
			if ( todo.completed ) {
				return memo + 1;
			}

			return memo;
		}, 0);

		// Todos left is just the total less the completed
		stat.todoLeft = stat.totalTodo - stat.todoCompleted;
	}


	function redrawTodosUI() {

		var todo, checkbox, label, deleteLink, divDisplay, inputEditTodo, li, i, l,
			ul = document.getElementById('todo-list');

		document.getElementById('main').style.display = todos.length ? 'block' : 'none';

		ul.innerHTML = '';
		document.getElementById('new-todo').value = '';

		_.each( todos, function ( todo, index ) {
			// create checkbox
			checkbox = document.createElement('input');
			checkbox.className = 'toggle';
			checkbox.setAttribute( 'data-todo-id', todo.id );
			checkbox.type = 'checkbox';
			checkbox.addEventListener( 'change', checkboxChangeHandler );

			// create div text
			label = document.createElement('label');
			label.setAttribute( 'data-todo-id', todo.id );
			label.appendChild( document.createTextNode( todo.title ) );
			label.addEventListener( 'dblclick', todoContentHandler );


			// create delete button
			deleteLink = document.createElement('button');
			deleteLink.className = 'destroy';
			deleteLink.setAttribute( 'data-todo-id', todo.id );
			deleteLink.addEventListener( 'click', spanDeleteClickHandler );

			// create divDisplay
			divDisplay = document.createElement('div');
			divDisplay.className = 'view';
			divDisplay.setAttribute( 'data-todo-id', todo.id );
			divDisplay.appendChild( checkbox );
			divDisplay.appendChild( label );
			divDisplay.appendChild( deleteLink );

			// create todo input
			inputEditTodo = document.createElement('input');
			inputEditTodo.id = 'input_' + todo.id;
			inputEditTodo.className = 'edit';
			inputEditTodo.value = todo.title;
			inputEditTodo.addEventListener( 'keypress', inputEditTodoKeyPressHandler );
			inputEditTodo.addEventListener( 'blur', inputEditTodoBlurHandler );


			// create li
			li = document.createElement('li');
			li.id = 'li_' + todo.id;
			li.appendChild( divDisplay );
			li.appendChild( inputEditTodo );


			if ( todo.completed ) {
				li.className += 'complete';
				checkbox.checked = true;
			}

			ul.appendChild( li );
		});
	}

	function changeToggleAllCheckboxState() {
		var toggleAll = document.getElementById('toggle-all');

		toggleAll.checked = stat.todoCompleted === todos.length;
	}

	function redrawStatsUI() {
		removeChildren( document.getElementsByTagName('footer')[0] );
		document.getElementById('footer').style.display = todos.length ? 'block' : 'none';

		if ( stat.todoCompleted ) {
			drawTodoClear();
		}

		if ( stat.totalTodo ) {
			drawTodoCount();
		}
	}

	function drawTodoCount() {
		var number = document.createElement('strong'),
			remaining = document.createElement('span'),
			text = ' ' + ( stat.todoLeft === 1 ? 'item' : 'items' ) + ' left';

		// create remaining count
		number.innerHTML = stat.todoLeft;

		remaining.id = 'todo-count';
		remaining.appendChild( number );
		remaining.appendChild( document.createTextNode( text ) );

		document.getElementsByTagName('footer')[0].appendChild( remaining );
	}

	function drawTodoClear() {
		var buttonClear = document.createElement('button');

		buttonClear.id = 'clear-completed';
		buttonClear.addEventListener( 'click', hrefClearClickHandler );
		buttonClear.innerHTML = 'Clear completed (' + stat.todoCompleted + ')';

		document.getElementsByTagName('footer')[0].appendChild( buttonClear );
	}

	function removeChildren( node ) {
		node.innerHTML = '';
	}

	function getUuid() {
		var i, random,
			uuid = '';

		for ( i = 0; i < 32; i++ ) {
			random = Math.random() * 16 | 0;
			if ( i === 8 || i === 12 || i === 16 || i === 20 ) {
				uuid += '-';
			}
			uuid += ( i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random) ).toString( 16 );
		}
		return uuid;
	}
})();
