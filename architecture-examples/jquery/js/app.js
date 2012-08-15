/*global jQuery, Handlebars */
jQuery( function( $ ) {
	'use strict';

	var
		APP_STORAGE_KEY = 'todos-jquery',

		$main = $('#main'),
		$footer = $('#footer'),
		$todoList = $('#todo-list'),
		$toggleAll = $('#toggle-all'),

		templateTodo = Handlebars.compile( $('#todo-template').html() ),
		templateFooter = Handlebars.compile( $('#footer-template').html() ),

		todos = JSON.parse(localStorage.getItem(APP_STORAGE_KEY) || '[]');

	// Accepts an element from inside the ".item" div
	function getTodo( elem, callback ) {
		var
			id = $( elem ).closest('li').data('id');

		$.each( todos, function( i, val ) {
			if ( val.id === id ) {
				callback( i, val );
				return false;
			}
		} );
	}

	// https://gist.github.com/1308368
	function getUID(a, b) {
		for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');
		return b;
	}

	function update() {
		var todoCount = todos.length,
			activeTodoCount = 0;

		// save
		localStorage.setItem(APP_STORAGE_KEY, JSON.stringify( todos ) );

		// counting active todo items
		$.each( todos, function( i, val ) {
			if ( !val.completed ) {
				activeTodoCount++;
			}
		} );

		$todoList.html( templateTodo( todos ) );
		$main.toggle( !!todos.length );
		$toggleAll.prop( 'checked', !activeTodoCount );

		$footer.html( templateFooter( {
			activeTodoCount: activeTodoCount,
			activeTodoWord: 'item' + (activeTodoCount === 1 ? '' : 's'),
			completedTodos: todoCount - activeTodoCount
		} ) ).toggle( !!todoCount );
	}

	update();

	$('#new-todo').on( 'keyup', function(e) {
		var $input = $(this),
			val = $.trim( $input.val() );

		if ( e.which !== 13 || !val ) {
			return;
		}

		todos.push( {
			id: getUID(),
			title: val,
			completed: false
		} );

		$input.val('');

		update();
	} );

	$footer.on( 'click', '#clear-completed', function() {
		var
			l = todos.length;

		while ( l-- ) {
			if ( todos[l].completed ) {
				todos.splice( l, 1 );
			}
		}

		update();
	} );

	$todoList
		// toggle the todo item is completed
		.on( 'change', '.toggle', function() {
			getTodo( this, function( i, val ) {
				val.completed = !val.completed;
			} );

			update();
		} )
		// creating new todo item by double clicking
		.on( 'dblclick', 'label', function() {
			$(this)
				.closest('li')
				.addClass('editing')
				.find('.edit')
				.focus();
		} )
		// triggering blur event on enter is pressed
		.on( 'keypress', '.edit', function(e) {
			if ( e.keyCode === 13 ) {
				e.target.blur();
			}
		} )
		// updating todo after input is blurred
		.on( 'blur', '.edit', function() {
			var
				val = $.trim( $(this).removeClass('editing').val() );

			getTodo( this, function( i ) {
				if ( val ) {
					todos[ i ].title = val;
				} else {
					todos.splice( i, 1 );
				}

				update();
			});
		} )
		// removing todo item
		.on( 'click', '.destroy', function() {
			getTodo( this, function( i ) {
				todos.splice( i, 1 );

				update();
			} );
		} );

	$toggleAll.on( 'change', function(e) {
		var
			isChecked = $( this ).prop('checked');

		$.each( todos, function( i, val ) {
			val.completed = isChecked;
		});

		update();
	} );

} );
