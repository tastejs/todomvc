/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.model({
	__name:"todoMVC.globalTodos",

	init: function() {
		this.ENTER_KEY = 13;
		this.STORE_KEY = 'todos-tipJS';
		this.todos = this.loadModel("utils").store(this.STORE_KEY);
		this.cacheElements();
	},
	cacheElements: function() {
		this.$todoApp = $('#todoapp');
		this.$newTodo = $('#new-todo');
		this.$toggleAll = $('#toggle-all');
		this.$main = $('#main');
		this.$todoList = $('#todo-list');
		this.$footer = this.$todoApp.find('#footer');
		this.$count = $('#todo-count');
		this.$clearBtn = $('#clear-completed');
	},
	// Accepts an element from inside the ".item" div and
	// returns the corresponding todo in the todos array
	getTodo: function( elem, callback ) {
		var id = $( elem ).closest('li').data('id');
		$.each( this.todos, function( i, val ) {
			if ( val.id === id ) {
				callback.apply( this, arguments );
				return false;
			}
		});
	}
});
