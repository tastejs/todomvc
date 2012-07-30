steal(
	'jquery',
	'jquery/controller'
	)
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
	},
	
	// adds existing and created to the list
	"{list} add" : function(list, ev, items){
	 	
		// uses the todosEJS template (in todo.html) to render a list of items
		// then adds those items to #list
		//this.find('#list').append("todosEJS",items)
	 	this.find('#todo-list').append(this.view("todo-list", items));

		// calls a helper to update the stats info
		this.updateStats();
	},
	
	// Creating a todo --------------
	
	// listens for key events and creates a new todo
	"#new-todo keyup" : function(el, ev){
		
		if(ev.keyCode == 13){
			new Todo({
				title : el.val(),
				complete : false
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
	".todo-clear click" : function(){
		// gets completed todos in the list, destroys them
		
		this.options.list.completed().destroyAll(); 
	},
	
	// When a todo's destroy button is clicked.
	".todo .todestroy click" : function(el){	
		el.closest('.todo').model().destroy();
	},
	
	// when an item is removed from the list ...
	"{list} remove" : function(list, ev, items){
		
		// get the elements in the list and remove them
		items.elements(this.element).slideUp(function(){
			$(this).remove();
		});
		
		this.updateStats();
	},
	
	
	// Updating a todo --------------
	
	// when the checkbox changes, update the model
	".todo [name=complete] change" : function(el, ev){
		
		var todo = el.closest('.todo').model().update({
			complete : el.is(':checked')
		});
	},
	
	// switch to edit mode
	".todo dblclick" : function(el){
		var input = $("<input name='text' class='text'/>").val(el.model().text)
		el.html(input);
		input[0].focus();
	},
	
	// update the todo's text on blur
	".todo [name=text] focusout" : function(el, ev){
		
		var todo = el.closest('.todo').model().update({
			text : el.val()
		});
	},
	
	// when an item is updated
	"{list} update" : function(list, ev, item){
		item.elements().html(this.view("todo-template", item));
		this.updateStats();
		//update completed
	},
	
	// a helper that updates the stats
	updateStats : function(){
		var list = this.options.list,
			completed = list.completed().length;
		$("#todo-count").html(this.view("todo-count",{
			completed : completed,
			total : list.length,
			remaining : list.length - completed
		}));
	}
});

});