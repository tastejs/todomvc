// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/*

By Sindre Sorhus
sindresorhus.com

*/
jQuery(function($){

	var Utils = {
		// https://gist.github.com/823878
		uuid: function() {
			var uuid = "", i, random;
			for ( i = 0; i < 32; i++ ) {
				random = Math.random() * 16 | 0;
				if ( i == 8 || i == 12 || i == 16 || i == 20 ) {
					uuid += "-";
				}
				uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
			}
			return uuid;
		}
	};
		
	var App = {
		init: function() {
			this.element = $('#todoapp');
			this.todoList = $('.items');
			// localStorage support
			this.store = new Store('todoapp');
			this.todos = this.store.get('todos') || [];
			this.bindEvents();
			this.render();
		},
		render: function() {
			var template = $('#todo-template').tmpl( this.todos );
			this.todoList.html( template );
			this.renderActiveTodoCount();
			this.store.set('todos', this.todos);
			// Only show the footer when there are at least one todo.
			$('footer').toggle( !!this.todos.length );
			// Only show the clear button when there are done todos.
			$('.clear').toggle( !!( this.todos.length - this.renderActiveTodoCount() ) );
		},
		bindEvents: function() {
			var elem = this.element,
				list = this.todoList;
			elem.on('click', '.clear', this.destroyDone);
			elem.on('submit', 'form', this.create);
			list.on('change', 'input[type="checkbox"]', this.toggle);
			list.on('dblclick', '.view', this.edit);
			list.on('keypress', 'input[type="text"]', this.blurOnEnter);
			list.on('blur', 'input[type="text"]', this.update);
			list.on('click', '.destroy', this.destroy);
		},
		renderActiveTodoCount: function() {
			var count = 0;
			$.each(this.todos, function(i, val) {
				if ( !val.done ) {
					count++;
				}
			});
			$('.countVal').text( count );
			return count;
		},
		destroyDone: function() {
			// Reverse loop; since we are dynamically removing items from the todos array
			for ( var i = App.todos.length; i--; ) {
				if ( App.todos[i].done ) {
					App.todos.remove(i);
				}
			}
			App.render();
		},
		// Accepts an element from inside the ".item" div, and returns the corresponding todo in the todos array.
		getTodo: function(elem, callback) {
			var id = $(elem).closest('.item').data('id');
			$.each(this.todos, function(i, val) {
				if ( val.id === id ) {
					callback.apply(App, arguments);
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
			App.getTodo(this, function(i, val) {
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
			var newVal = $(this).removeClass('editing').val();
			App.getTodo(this, function(i) {
				this.todos[i].title = newVal;
			});
			App.render();
		},
		destroy: function() {
			App.getTodo(this, function(i) {
				this.todos.remove(i);
				this.render();
			});
		}
	};

	window.TodoApp = App.init();
	
});