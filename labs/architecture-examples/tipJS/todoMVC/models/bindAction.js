/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.model({
	name:"todoMVC.bindAction",
	
	bindActions: function() {
		var globalTodos = this.loadModel("globalTodos", true);
		globalTodos.$newTodo.on( 'keyup', this.create );
		globalTodos.$toggleAll.on( 'change', this.toggleAll );
		globalTodos.$footer.on( 'click', '#clear-completed', this.destroyCompleted );
		
		var list = globalTodos.$todoList;
		list.on( 'change', '.toggle', this.toggle );
		list.on( 'dblclick', 'label', this.edit );
		list.on( 'keypress', '.edit', this.blurOnEnter );
		list.on( 'blur', '.edit', this.update );
		list.on( 'click', '.destroy', this.destroy );
	},
	create: function(e) {
		var params = {
			event : e,
			input : $(this)
		}
		tipJS.action("todoMVC.create", params);
	},
	toggleAll: function() {
		tipJS.action("todoMVC.toggleAll", this);
	},
	destroyCompleted: function() {
		tipJS.action("todoMVC.destroyCompleted");
	},
	toggle: function() {
		tipJS.action("todoMVC.toggle", this);
	},
	edit: function() {
		tipJS.action("todoMVC.edit", this);
	},
	blurOnEnter: function( e ) {
		tipJS.action("todoMVC.blurOnEnter", e);
	},
	update: function() {
		tipJS.action("todoMVC.update", this);
	},
	destroy: function() {
		tipJS.action("todoMVC.destroy", this);
	}
});
