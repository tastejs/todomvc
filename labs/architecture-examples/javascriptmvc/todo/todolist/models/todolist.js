steal(
	'jquery/model/list')
.then(function(){

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
			return item.completed === true;
		});
	},

	active: function(){
		return this.grep(function(item){
			return item.completed === false;
		});
	},

	destroyAll: function(){
		for(var i=0, l=this.length; i<l; i++){
			this[i].destroy();
		}
	}
});

});