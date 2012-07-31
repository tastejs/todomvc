// Load what we need
steal(
	'jquery',
	'jquery/controller',
	'jquery/controller/view',
	'jquery/controller/route',
	'jquery/model/list',
	'jquery/view/ejs',
	'jquery/lang/json',
	'./base.css',
	'./models/todo')
.then(
	'todo/todolist') //load todolist jmvc plugin
.then(function($){

/**
 * Helper methods on collections of todos.  But lists can also use their model's 
 * methods.  Ex:
 * 
 *   var todos = [new Todo({id: 5}) , new Todo({id: 6})],
 *       list = new Todo.List(todos);
 *       
 *   list.destroyAll() -> calls Todo.destroyAll with [5,6].
 */
$.Model.List('Todo.List',{
	
	/**
	 * Return a new Todo.List of only complete items
	 */
	completed : function(){
		return this.grep(function(item){
			return item.complete === true;
		});
	}
});

$.Controller("Router", {

	init: function(){
		$("#todoapp").todolist({list : new Todo.List()});
	},

	"route": function(){
		//default route
	},

	"active route": function(routeData){
		console.log("route active");	
	},

	"completed route": function(routeData){
		console.log("route completed");
	}

});

$(function(){
	//register the router
	new Router(document.body);	
});


});
