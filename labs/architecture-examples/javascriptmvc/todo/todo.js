// Load what we need
steal(
	'jquery',
	'jquery/controller',
	'jquery/controller/route',
	'jquery/lang/json',
	'./base.css',
	'./models/todo')
.then(
	'todo/todolist') //load todolist jmvc plugin
.then(function($){


$.Controller("Router", {

	init: function(){
		$("#todoapp").todolist({list : new Todo.List()});
	},

	"route": function(){
		//default route
	},

	"active route": function(routeData){
		//$("#todoapp").controller().listActive();
	},

	"completed route": function(routeData){
		//$("#todoapp").controller().listCompleted();
	}

});

$(function(){
	//register the router
	new Router(document.body);	
});


});
