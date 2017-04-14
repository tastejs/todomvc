/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.controller({
	name : "todoMVC.init",

	invoke : function(){
		tipJS.log(this.name);

		var globalTodos = this.loadModel("globalTodos", true);

		globalTodos.init();
		this.loadView("renderer").updateView( globalTodos );
		this.loadModel("utils").store( globalTodos.STORE_KEY, globalTodos.todos );
		this.loadModel("bindAction").bindActions();
	}
});
