steal(
	'jquery/controller',
	'jquery/view/ejs'
	)
.then(
	'//todo/todoitem/todoitem.js',
	'./models/todolist.js')
.then(function(){

/**
 * A Todos widget created like
 * 
 *    $('#todos').todolist({ list: new Todo.List() });
 *    
 * It listens on changes to the list and items in the list with the following actions:
 * 
 *   - '{list} add'    - todos being added to the list
 *   - '{list} remove' - todos being removed from the list
 *   - '{list} updated' - todos being updated in the list
 *   
 */
$.Controller('Todolist', {
	
	// sets up the widget
	init : function(){
		
	},

	// adds existing and created to the list
	'{list} add' : function(list, ev, newItems){
		this._addElementsAndRegisterControllers(newItems);
	},
	
	// when an item is removed from the list ...
	'{list} remove' : function(list, ev, items){	
		items.elements(this.element).closest('li').remove();
	},

	render: function(data){
		//empty the entire list and reload everything
		this.element.empty();
		this._addElementsAndRegisterControllers(data);
	},

	//helper to factor out common logic
	_addElementsAndRegisterControllers: function(data){
		var $li;
		for(var i=0; i<data.length; i++){
			//register the todoitem controller on the newly created <li>
			// another way of writing this would be
			// 		var $li = $('<li>')
			//		new Todoitem($li, { todoItem: data[i] });
			$li = $('<li>').todoitem({ todoItem: data[i] });
			this.element.append($li);
		}
	}

});

});