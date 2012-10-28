/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.controller({
	name : "todoMVC.toggleAll",
	
	invoke : function( chkboxAll ){
		tipJS.log(this.name);

		var isChecked = $( chkboxAll ).prop('checked'),
			globalTodos = this.loadModel("globalTodos", true);

		$.each( globalTodos.todos, function( i, val ) {
			val.completed = isChecked;
		});
		this.loadView("renderer").updateView( globalTodos );
		this.loadModel("utils").store( globalTodos.STORE_KEY, globalTodos.todos );
	}
});
