/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.view({
	__name:"todoMVC.renderer",

	updateView : function( globalTodos ){
		var todos = globalTodos.todos,
			todoCount = todos.length,
			activeTodoCount = this.activeTodoCount( todos ),
			activeTodoWord = this.pluralize( activeTodoCount, 'item' ),
			footer = {
				activeTodoCount: activeTodoCount,
				activeTodoWord: activeTodoWord,
				completedTodos: todoCount - activeTodoCount
			};
		
		globalTodos.$todoList.html( this.renderTemplate({
			url:"./template/todos.html",
			data:todos
		}));
		globalTodos.$main.toggle( !!todos.length );
		globalTodos.$toggleAll.prop( 'checked', !activeTodoCount );
		globalTodos.$footer.toggle( !!todoCount );
		globalTodos.$footer.html( this.renderTemplate({
			url:"./template/footer.html",
			data:footer
		}));
	},
	activeTodoCount: function(todos) {
		var count = 0;
		$.each( todos, function( i, val ) {
			if ( !val.completed ) {
				count++;
			}
		});
		return count;
	},
	pluralize: function( count, word ) {
		return count === 1 ? word : word + 's';
	}
});
