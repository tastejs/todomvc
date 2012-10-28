/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.model({
	__name:"todoMVC.renderer",

	render: function() {
		var globalTodos = this.globalTodos = this.loadModel("globalTodos", true);
		globalTodos.$todoList.html( globalTodos.todoTemplate( globalTodos.todos ) );
		globalTodos.$main.toggle( !!globalTodos.todos.length );
		globalTodos.$toggleAll.prop( 'checked', !globalTodos.activeTodoCount() );
		this.renderFooter();
		this.loadModel("utils").store( 'todos-jquery', globalTodos.todos );
	},
	renderFooter: function() {
		var globalTodos = this.globalTodos;
		var todoCount = globalTodos.todos.length,
			activeTodoCount = globalTodos.activeTodoCount(),
			footer = {
				activeTodoCount: activeTodoCount,
				activeTodoWord: this.loadModel("utils").pluralize( activeTodoCount, 'item' ),
				completedTodos: todoCount - activeTodoCount
			};

		globalTodos.$footer.toggle( !!todoCount );
		globalTodos.$footer.html( globalTodos.footerTemplate( footer ) );
	}
});
