steal(
	'jquery/controller',
	'jquery/controller/view',
	'jquery/view/ejs'
	)
.then(
	'./views/todo-list.ejs',
	'./views/todo-template.ejs',
	'./views/todo-count.ejs')
.then(function(){

/**
 * A Todos widget created like
 * 
 *    $("#todos").todos({ list: new Todo.List() });
 *    
 * It listens on changes to the list and items in the list with the following actions:
 * 
 *   - "{list} add"    - todos being added to the list
 *   - "{list} remove" - todos being removed from the list
 *   - "{list} update" - todos being updated in the list
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
	
	// adds existing and created to the list
	"{list} add" : function(list, ev, items){
	 	
		// uses the todosEJS template (in todo.html) to render a list of items
		// then adds those items to #list
		//this.find('#list').append("todosEJS",items)
	 	this.find('#todo-list').append(this.view("//todo/todolist/views/todo-list.ejs", items));

		// calls a helper to update the stats info
		this._updateStats();
	},
	
	// Creating a todo --------------
	
	// listens for key events and creates a new todo
	"#new-todo keyup" : function(el, ev){
		if(ev.keyCode == 13){
			new Todo({
				title : el.val(),
				completed : false
			}).save(this.callback('created'));
			
			el.val("");
		}
	},
	
	// When a todo is created, add it to this list
	"created" : function(todo){
		this.options.list.push(todo); //triggers 'add' on the list
	},
	
	// Destroying a todo --------------
	
	// the clear button is clicked
	".clear-completed click" : function(){
		// gets completed todos in the list, destroys them
		this.options.list.completed().destroyAll(); 
	},
	
	// When a todo's destroy button is clicked.
	".todo .destroy click" : function(el){	
		el.closest('.todo').model().destroy();
	},
	
	// when an item is removed from the list ...
	"{list} remove" : function(list, ev, items){	
		items.elements(this.element).remove();
		this._updateStats();
	},
	
	// Updating a todo --------------
	
	// when the checkbox changes, update the model
	".toggle change" : function(el, ev){
		var isCompleted = el.is(':checked');

		var $todoElement = el.closest('.todo');
		if(isCompleted){
			$todoElement.addClass("completed");
		}else{
			$todoElement.removeClass("completed");
		}
		
		$todoElement.model().update({
			completed : isCompleted
		});
	},
	
	// switch to edit mode
	".todo dblclick" : function(el){
		el.addClass("editing");
		el.find(".edit").focus();
	},
	
	// update the todo's text on blur
	".edit focusout" : function(el, ev){
		this._updateTodo(el);
	},

	".edit keyup": function(el, ev){
		if(ev.keyCode == 13){
			this._updateTodo(el);	
		}
	},

	// when an item is updated
	"{list} updated" : function(list, ev, item){
		item.elements().html(this.view("//todo/todolist/views/todo-template.ejs", item));
		this._updateStats();
		//update completed
	},
	
	//"private" helpers
	_updateTodo: function(el){
		el.closest('li')
			.removeClass("editing")
			.model().update({
				title : el.val()
			});
	},

	// a helper that updates the stats
	_updateStats : function(){
		var list = this.options.list,
			completed = list.completed().length;
		$("#todo-count").html(this.view("//todo/todolist/views/todo-count.ejs",{
			completed : completed,
			total : list.length,
			remaining : list.length - completed
		}));

		if(completed > 0){
			$("#clear-completed")
				.text("Clear completed (" + completed + ")")
				.show();
		}else{
			$("#clear-completed").hide();
		}

		if(list.length > 0){
			this.find("#main").show();
			this.find("#footer").show();
		}else{
			this.find("#main").hide();
			this.find("#footer").hide();
		}
	}
});

});