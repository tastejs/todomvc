steal(
	'jquery/controller',
	'jquery/view/ejs'
	)
.then(
	'./models/todo.js',
	// this is optional but allows for later 'embedding/compiling' the views
	// into the resulting production.js file during the minification process
	// using steal.build
	'//todo/todoitem/views/todo-template.ejs'
	)
.then(function(){

/*
*	This controller handles the logic for a single todo list entry.
*/
$.Controller('Todoitem', {

	init: function(){
		this.element.html('//todo/todoitem/views/todo-template.ejs', this.options.todoItem);
		
		this.element.toggleClass('completed', this.options.todoItem.completed);
	},

	// When a todo's destroy button is clicked.
	'.destroy click' : function(el){	
		this.element.find('.todo').model().destroy();
	},
		
	// when the checkbox changes, update the model
	'.toggle change' : function(el, ev){
		var isCompleted = el.is(':checked');

		var model = this.element.find('.todo').model().update({
					completed : isCompleted
				});
		
		//example of triggering a custom event
	    $.event.trigger('completionStatusChanged');
	},

	// switch to edit mode; Note the .todo class is added
	// since in the 'todo-list.ejs' template we have a <%= this[i] %>
	// on the li element. This binds the model onto the DOM element,
	// also adding a class with the same name as the model
	
	'.todo dblclick' : function(el){
		this.element.addClass('editing');
		this.element.find('.edit').focus();
	},
	
	// update the todo's text on blur
	'.edit focusout' : function(el, ev){
		this._updateTodo(el);
	},

	// when pressing the 'enter' key on the textbox
	// the todo should be updated
	'.edit keyup': function(el, ev){
		if(ev.keyCode == 13){
			this._updateTodo(el);	
		}
	},	

	'{todoItem} updated': function(item){
		this.element.html('//todo/todoitem/views/todo-template.ejs', item);
		this.element.toggleClass('completed', item.completed);
	},

	//privates

	//updates the completion status
	updateCompletedStatus: function(isCompleted){
		this.options.todoItem.update({
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
		var model = el.closest('li')
						.removeClass('editing') //remove editing from li
						.find('.todo').model(); //fetch model bound on the label.todo

		if(model){
			if(!todoVal){
				model.destroy();
			}else{
				model.update({
						title : el.val()
					});
			}
		}
	}

});



});