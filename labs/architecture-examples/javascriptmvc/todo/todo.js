// Load what we need
steal(
	'jquery',
	'jquery/controller',
	'jquery/controller/route',
	'jquery/lang/json',
	'./base.css',
	'./models/todo')
.then(
	'//todo/controllers/todolist.js') //load todolist jmvc plugin
.then(function($){


$.Controller("Router", {

	init: function(){
		$("#todoapp").todolist({list : new Todo.List()});
		$.route.ready(true); //fires 1st route event
	},

	"route": function(){
		//default route
		$("#todoapp").controller().loadAll();
	},

	"active route": function(routeData){
		$("#todoapp").controller().loadActive();
	},

	"completed route": function(routeData){
		$("#todoapp").controller().loadCompleted();
	}

});

$(function(){
	//register the router
	new Router(document.body);	
});


});
