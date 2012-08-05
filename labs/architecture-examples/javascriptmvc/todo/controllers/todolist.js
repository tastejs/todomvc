steal(
	'jquery/controller',
	'jquery/view/ejs'
	)
.then(
	// this is optional but allows for later "embedding/compiling" the views
	// into the resulting production.js file during the minification process
	// using steal.build
	'//todo/views/todo-list.ejs',
	'//todo/views/todo-template.ejs',
	'//todo/views/todo-stats.ejs')
.then(function(){

/**
 * A Todos widget created like
 * 
 *    $("#todos").todolist({ list: new Todo.List() });
 *    
 * It listens on changes to the list and items in the list with the following actions:
 * 
 *   - "{list} add"    - todos being added to the list
 *   - "{list} remove" - todos being removed from the list
 *   - "{list} updated" - todos being updated in the list
 *   
 */
$.Controller('Todolist',{
	
	// sets up the widget
	init : function(){
		
		// empties the create input element
		this.find("#new-todo").val("")[0].focus();
		
		// fills this list of items (creates add events on the list)
		this.options.list.findAll();
		this._updateStats();
	},

	//publics
	loadData: function(loadWhat){
		if(loadWhat){
			//dynamically invoke this.options.list.active() or this.options.list.completed()
			this._render(this.options.list[loadWhat]());
		}else{
			this._render(this.options.list); //no filter applied, just load the list
		}

		this.find('#filters li a')
			.removeClass('selected')
			.filter("[href='#!/" + (loadWhat || "") + "']")
			.addClass('selected');	
	},

	//events
	
	// adds existing and created to the list
	"{list} add" : function(list, ev, items){
		// uses the todosEJS template (in todo.html) to render a list of items
		// then adds those items to #list
		//this.find('#list').append("todosEJS",items)
	 	this.find('#todo-list').append("//todo/views/todo-list.ejs", items);

		// calls a helper to update the stats info
		this._updateStats();
	},

	// when an item is updated
	"{list} updated" : function(list, ev, item){
		item.elements().toggleClass("completed", item.completed)
					 .html("//todo/views/todo-template.ejs", item);
		this._updateStats();
	},
	
	// when an item is removed from the list ...
	"{list} remove" : function(list, ev, items){	
		items.elements(this.element).remove();
		this._updateStats();
	},		
		
	// listens for key events and creates a new todo
	"#new-todo keyup" : function(el, ev){
		var value = $.trim(el.val());
		if(ev.keyCode == 13 && value !== ""){
			new Todo({
				title : value,
				completed : false
			}).save(this.proxy('created')); //invoke the created function; proxy(...) to maintain the context of this
			
			el.val("");
		}
	},
	
	// When a todo is created, add it to this list
	"created" : function(todo){
		this.options.list.push(todo); //triggers 'add' event on the list
	},
	
	// the clear button is clicked
	"#clear-completed click" : function(){
		// gets completed todos in the list, destroys them
		this.options.list.completed().destroyAll();
	},
	
	// When a todo's destroy button is clicked.
	".todo .destroy click" : function(el){	
		el.closest('.todo').model().destroy();
	},
		
	// when the checkbox changes, update the model
	".toggle change" : function(el, ev){
		var isCompleted = el.is(':checked');

		this._updateCompletedStatus(isCompleted, el.closest('.todo'));
	},

	// listen for changes on the toggle all checkbox
	"#toggle-all change": function(el, ev){
		var isCompleted = el.is(':checked');
		this.find(".todo").each(this.proxy(function(idx, element){
			this._updateCompletedStatus(isCompleted, $(element));
		}));
	},
	
	// switch to edit mode; Note the .todo class is added
	// since in the 'todo-list.ejs' template we have a <%= this[i] %>
	// on the li element. This binds the model onto the DOM element,
	// also adding a class with the same name as the model
	".todo dblclick" : function(el){
		el.addClass("editing");
		el.find(".edit").focus();
	},
	
	// update the todo's text on blur
	".edit focusout" : function(el, ev){
		this._updateTodo(el);
	},

	// when pressing the "enter" key on the textbox
	// the todo should be updated
	".edit keyup": function(el, ev){
		if(ev.keyCode == 13){
			this._updateTodo(el);	
		}
	},
	
	// "private" helpers
	// They're not really private, per convention functions prefixed with _ shouldn't
	// be called from "outside" the controller

	// re-renders the list of items
	_render: function(items){
		this.find('#todo-list').html("//todo/views/todo-list.ejs", items);
		this._updateStats();
	},

	//updates the completion status
	_updateCompletedStatus: function(isCompleted, $todoElement){
		$todoElement.model().update({
			completed : isCompleted
		});
	},

	// performs the necessary operations for an update action,
	// such as removing the classes + calling the update function on
	// the model.
	_updateTodo: function(el){
		var todoVal = el.val().trim();

		//leaving editing mode and fetching the model instance
		//back from the DOM
		var model = el.closest("li")
						.removeClass("editing")
						.model();

		if(!todoVal){
			model.destroy();
		}else{
			model.update({
					title : el.val()
				});
		}
	},

	// a helper that updates the stats
	_updateStats : function(){
		var list = this.options.list,
			completed = list.completed().length,
			remaining = list.length - completed;
		
		this.find("#footer").html("//todo/views/todo-stats.ejs",{
			completed : completed,
			total : list.length,
			remaining : remaining
		});

		if(list.length > 0){
			this.find("#main, #footer").show();
		}else{
			this.find("#main, #footer").hide();
		}

		this.find("#toggle-all")[0].checked = !remaining;
	}
});

});