/*

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
			this.todos = this.store();
			this.cacheElements();
			this.bindEvents();
			this.render();
		},
		cacheElements: function() {
			this.template = Handlebars.compile( $('#todo-template').html() );
			this.$todoApp = $('#todoapp');
			this.$todoList = this.$todoApp.find('.items');
			this.$footer = this.$todoApp.find('footer');
			this.$count = this.$footer.find('.count');
			this.$clearBtn = this.$footer.find('.clear');
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
			var app = this.$todoApp,
				list = this.$todoList;
			app.on( 'click', '.clear', this.destroyDone );
			app.on( 'submit', 'form', this.create );
			list.on( 'change', '.toggle', this.toggle );
			list.on( 'dblclick', '.view', this.edit );
			list.on( 'keypress', '.edit input', this.blurOnEnter );
			list.on( 'blur', '.edit input', this.update );
			list.on( 'click', '.destroy', this.destroy );
		},
		render: function() {
			this.$todoList.html( this.template( this.todos ) );
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
			App.render();
		},
		// Accepts an element from inside the ".item" div and returns the corresponding todo in the todos array.
		getTodo: function( elem, callback ) {
			var id = $( elem ).closest('.item').data('id');
			$.each( this.todos, function( i, val ) {
				if ( val.id === id ) {
					callback.apply( App, arguments );
					return false;
				}
			});
		},
		create: function(e) {
			e.preventDefault();
			var $input = $(this).find('input'),
				inputVal = $input.val();
			if ( !inputVal ) {
				return;
			}
			App.todos.push({
				title: inputVal,
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
			$(this).closest('.item').addClass('editing').find('.edit input').focus();
		},
		blurOnEnter: function(e) {
			if ( e.keyCode === 13 ) {
				e.target.blur();
			}
		},
		update: function() {
			var val = $(this).removeClass('editing').val();
			App.getTodo( this, function(i) {
				this.todos[i].title = val;
			});
			App.render();
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
