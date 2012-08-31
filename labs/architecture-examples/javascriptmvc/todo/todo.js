// Load what we need
steal(
	'jquery',
	'jquery/controller',
	'jquery/controller/route',
	'jquery/view/ejs',
	'jquery/lang/json',
	//'./base.css', 		// should be loaded here if it is desired to compress it with steal; loaded
							// it in the html file instead to avoid flickering during app startup
	'./todoitem/models/todo.js')
.then(
	'//todo/todolist/todolist.js', //load todolist jmvc plugin
	'//todo/views/todo-stats.ejs'
	)
.then(function($){

// This controller is responsible for managing the entire todo app, basically
// to instantiate the required controllers and manage events such as updating
// statistics etc.
$.Controller('Todoapp',{

  listensTo: ['completionStatusChanged'] //custom event listener
    
}, {

	init: function(){
		this.find('#new-todo').val('')[0].focus();

		$('#todo-list').todolist({list : this.options.list });

		//load all the todos into the list
		this.options.list.findAll();
		this._updateStats();
	},

	// used for loading the data onto the list based on some filter
	loadData: function(filter){
		this._currentFilter = filter;

		if(filter){
			$('#todo-list').controller().render(this.options.list[filter]());
		}else{
			$('#todo-list').controller().render(this.options.list);
		}

		this._updateStats();
	},

	// handler for the custom event
	'completionStatusChanged': function(){
		this.loadData(this._currentFilter);
	},

	// listens for key events and creates a new todo
	'#new-todo keyup' : function(el, ev){
		var value = $.trim(el.val());

		if(ev.which === 13 && value !== ''){
			new Todo({
				title : value,
				completed : false
			}).save(); //invoke the created function; proxy(...) to maintain the context of this
			
			el.val('');
		}
	},

	// the clear button is clicked
	'#clear-completed click' : function(){
		// gets completed todos in the list, destroys them
		this.options.list.completed().destroyAll();
		this._updateStats();
	},

	// listen for changes on the toggle all checkbox
	'#toggle-all change': function(el, ev){
		var isCompleted = el.is(':checked');
		
		this.options.list.each(function(idx, el){
		   el.update({ completed: isCompleted });  
		});

		this.loadData(this._currentFilter);
	},

	// When a todo is created, add it to the list and reload everything
	// to also take the current filter into account
	'{Todo} created': function(Todo, ev, item){
		this.options.list.push(item); //triggers 'add' event on the list
		this.loadData(this._currentFilter);
	},
	
	'{Todo} destroyed': function(){
	    this._updateStats();    
	},

	// a helper that updates the stats
	_updateStats : function(){
		var list = this.options.list,
			completed = list.completed().length,
			remaining = list.length - completed;
		
		this.find('#footer').html('//todo/views/todo-stats.ejs',{
			completed : completed,
			remaining : remaining
		});

		this.find('#main, #footer').toggle( list.length > 0 );

		this.find('#filters li a')
			.removeClass('selected')
			.filter('[href="#!/' + (this._currentFilter || '') + '"]')
			.addClass('selected');
		
		this.find('#toggle-all')[0].checked = !remaining;
	}

});

// The router which initializes the entire app and watches for hash changes
// in the url
$.Controller('Router', {

	init: function(){
		//var todoList = new Todo.List();
		new Todoapp($('#todoapp'), { list: new Todo.List() });

		$.route.ready(true); //fires 1st route event
	},

	//default route index.html#!
	'route': function(){
		$('#todoapp').controller().loadData();
	},

	//route index.html#!/active
	'/active route': function(routeData){
		$('#todoapp').controller().loadData('active');
	},

	//route index.html#!/completed
	'/completed route': function(routeData){
		$('#todoapp').controller().loadData('completed');
	}

});

$(function(){
	//register the router
	new Router(document.body);
});


});
