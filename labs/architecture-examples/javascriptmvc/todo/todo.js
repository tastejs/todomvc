// Load what we need
steal(
	'jquery',
	'jquery/controller',
	'jquery/controller/route',
	'jquery/lang/json',
	//'./base.css', 		// should be loaded here if it is desired to compress it with steal; loaded
							// it in the html file instead to avoid flickering during app startup
	'./models/todo')
.then(
	'//todo/controllers/todolist.js') //load todolist jmvc plugin
.then(function($){


$.Controller("Router", {

	init: function(){
		$("#todoapp").todolist({list : new Todo.List()});
		$.route.ready(true); //fires 1st route event
	},

	//default route index.html#!
	"route": function(){
		$("#todoapp").controller().loadData();
	},

	//route index.html#!active
	"/active route": function(routeData){
		$("#todoapp").controller().loadData("active");
	},

	//route index.html#!completed
	"/completed route": function(routeData){
		$("#todoapp").controller().loadData("completed");
	}

});

$(function(){
	//register the router
	new Router(document.body);	
});


});
