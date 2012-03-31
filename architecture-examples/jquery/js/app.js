/*

[MIT licensed](http://en.wikipedia.org/wiki/MIT_License)
(c) [Sindre Sorhus](http://sindresorhus.com)

*/
jQuery(function($) {

	"use strict";

	var Utils = {
		// https://gist.github.com/1308368
		uuid: function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},
		pluralize: function( count, word ) {
			return count === 1 ? word : word + 's';
		}
	};

	var App = {
		init: function() {
			this.ENTER_KEY = 13;
			this.todos = this.store();
			this.cacheElements();
			this.bindEvents();
			this.render();
		},
		cacheElements: function() {
			this.template = Handlebars.compile( $('#todo-template').html() );
			this.$todoApp = $('#todoapp');
			this.$newTodo = $('#new-todo');
			this.$toggleAll = $('#toggle-all');
			this.$main = $('#main');
			this.$todoList = $('#todo-list');
			this.$footer = this.$todoApp.find('footer');
			this.$count = $('#todo-count');
			this.$clearBtn = $('#clear-completed');
		},
		store: function( data ) {
			if ( arguments.length ) {
				return localStorage.setItem( 'todo-jquery', JSON.stringify( data ) );
			} else {
				var store = localStorage.getItem('todo-jquery');
				return ( store && JSON.parse( store ) ) || [];
			}
		},
		bindEvents: function() {
			var list = this.$todoList;
			this.$newTodo.on( 'keyup', this.create );
			this.$toggleAll.on( 'change', this.toggleAll );
			this.$clearBtn.on( 'click', this.destroyDone );
			list.on( 'change', '.toggle', this.toggle );
			list.on( 'dblclick', '.view', this.edit );
			list.on( 'keypress', '.edit', this.blurOnEnter );
			list.on( 'blur', '.edit', this.update );
			list.on( 'click', '.destroy', this.destroy );
		},
		render: function() {
			this.$todoList.html( this.template( this.todos ) );
			this.$main.toggle( !!this.todos.length );
			this.renderFooter();
			this.store( this.todos );
		},
		renderFooter: function() {
			var todoCount = this.todos.length,
				activeTodos = this.activeTodoCount(),
				completedTodos = todoCount - activeTodos,
				countTitle = '<b>' + activeTodos + '</b> ' + Utils.pluralize( activeTodos, 'item' ) + ' left',
				clearTitle = 'Clear ' + completedTodos + ' completed ' + Utils.pluralize( completedTodos, 'item' );
			// Only show the footer when there are at least one todo.
			this.$footer.toggle( !!todoCount );
			// Active todo count
			this.$count.html( countTitle );
			// Toggle clear button and update title
			this.$clearBtn.text( clearTitle ).toggle( !!completedTodos );
		},
		toggleAll: function() {
			var isChecked = !!$(this).attr('checked');
			$.each( App.todos, function( i, val ) {
				val.done = isChecked;
			});
			App.render();
		},
		activeTodoCount: function() {
			var count = 0;
			$.each( this.todos, function( i, val ) {
				if ( !val.done ) {
					count++;
				}
			});
			return count;
		},
		destroyDone: function() {
			var todos = App.todos,
				l = todos.length;
			while ( l-- ) {
				if ( todos[l].done ) {
					todos.splice( l, 1 );
				}
			}
			App.$toggleAll.attr( 'checked', false );
			App.render();
		},
		// Accepts an element from inside the ".item" div and returns the corresponding todo in the todos array.
		getTodo: function( elem, callback ) {
			var id = $( elem ).closest('li').data('id');
			$.each( this.todos, function( i, val ) {
				if ( val.id === id ) {
					callback.apply( App, arguments );
					return false;
				}
			});
		},
		create: function(e) {
			var $input = $(this),
				val = $.trim( $input.val() );
			if ( e.which !== App.ENTER_KEY || !val ) {
				return;
			}
			App.todos.push({
				title: val,
				id: Utils.uuid(),
				done: false
			});
			$input.val('');
			App.render();
		},
		toggle: function() {
			App.getTodo( this, function( i, val ) {
				val.done = !val.done;
			});
			App.render();
		},
		edit: function() {
			$(this).closest('li').addClass('editing').find('.edit').focus();
		},
		blurOnEnter: function(e) {
			if ( e.keyCode === App.ENTER_KEY ) {
				e.target.blur();
			}
		},
		update: function() {
			var val = $(this).removeClass('editing').val();
			App.getTodo( this, function(i) {
				if ( val ) {
					this.todos[i].title = val;
				} else {
					this.todos.splice( i, 1 );
				}
				this.render();
			});
		},
		destroy: function() {
			App.getTodo( this, function(i) {
				this.todos.splice( i, 1 );
				this.render();
			});
		}
	};

	window.TodoApp = App.init();

});
