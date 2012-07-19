// Load what we need
steal.css('todo')
	 .plugins('jquery/model/list',
		'jquery/controller',
		'jquery/view/ejs',
		'jquery/lang/json')
	 .then(function($){

/**
 * A todo model for CRUDing todos.
 */
$.Model('Todo',{
	/**
	 * Gets JSON data from localStorage.  Any changes that 
	 * get made in cb get written back to localStorage.
	 * 
	 * This is unimportant for understanding JavaScriptMVC!
	 */
	localStore: function(cb){
		var name = 'todo-javascriptmvc',
			data = $.evalJSON( window.localStorage[name] || (window.localStorage[name] = "{}") ),
			res = cb.call(this, data);
		if(res !== false){
			window.localStorage[name] = $.toJSON(data);
		}
	},
	/**
	 * Gets todos from localStorage.
	 * 
	 *     Todo.findAll({}, success(todos))
	 */
	findAll: function(params , success){
		this.localStore(function(todos){
			instances = [];
			for(var id in todos){
				instances.push( new this( todos[id]) )
			}
			success && success(instances)
		})
	},
	/**
	 * Destroys a list of todos by id from localStorage
	 *     
	 *     Todo.destroyAll([1,2], success())
	 */
	destroyAll: function(ids, success){
		this.localStore(function(todos){
			$.each(ids, function(){
				delete todos[this]
			});
		});
		success();
	},
	/**
	 * Destroys a single todo by id
	 *     
	 *     Todo.destroyAll(1, success())
	 */
	destroy: function(id, success){

		this.destroyAll(id, success);
		this.localStore(function(todos){
			delete todos[id]
		});
				
	},
	/**
	 * Creates a todo with the provided attrs.  This allows:
	 * 
	 *     new Todo({text: 'hello'}).save( success(todo) );
	 */
	create: function(attrs, success){
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random())
			todos[attrs.id] = attrs;
		});
		success({id : attrs.id})
	},
	/**
	 * Updates a todo by id with the provided attrs.  This allows:
	 * 
	 *     todo.update({text: 'world'}, success(todos) )
	 */
	update: function(id, attrs, success){
		this.localStore(function(todos){
			var todo = todos[id];
			$.extend(todo, attrs);
		});
		success({});
	}
	
},{});

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
		})
	}
});


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
$.Controller('Todos',{
	
	// sets up the widget
	init : function(){
		
		// empties the create input element
		this.find(".create").val("")[0].focus();
		
		// fills this list of items (creates add events on the list)
		this.options.list.findAll();
	},
	
	// adds existing and created to the list
	"{list} add" : function(list, ev, items){
	 	
		// uses the todosEJS template (in todo.html) to render a list of items
		// then adds those items to #list
		this.find('#list').append("todosEJS",items)
	 	
		// calls a helper to update the stats info
		this.updateStats();
	},
	
	// Creating a todo --------------
	
	// listens for key events and creates a new todo
	".create keyup" : function(el, ev){
		
		if(ev.keyCode == 13){
			new Todo({
				text : el.val(),
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
		
		this.options.list.completed()
			.destroyAll(); 

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
		item.elements().html("todoEJS", item);
		this.updateStats();
		//update completed
	},
	
	// a helper that updates the stats
	updateStats : function(){
		var list = this.options.list,
			completed = list.completed().length;
		$("#todo-stats").html("statsEJS",{
			completed : completed,
			total : list.length,
			remaining : list.length - completed
		})
	}
})



$(function(){
	// create a todos widget with a list
	$("#todos").todos({list : new Todo.List()});
})


});
