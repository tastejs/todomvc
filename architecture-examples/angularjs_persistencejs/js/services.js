angular.service('persistencejs', function() {
	persistence.store.websql.config(persistence, 'todo', 'todo database', 5*1024*1024);
	var Todo = persistence.define('todo', {
		title: 'TEXT',
		done: 'BOOL'
	});
	persistence.schemaSync();
	
	return {
		add: function(item){
			var t = new Todo();
			t.title = item;
			t.done = false;
			persistence.add(t);
			persistence.flush();
		},
		
		edit: function(oldTitle, newTitle){
			Todo.all().filter('title','=',oldTitle).one(function(item){
				if(item){
					item.title = newTitle;
					persistence.flush();
				}
			});
		},
		
		changeStatus: function(item){
			Todo.all().filter('title','=',item.title).one(function(todo){
				todo.done = item.done;
				persistence.flush();
			});
		},
		
		clearCompletedItems: function(){
			Todo.all().filter('done','=',true).destroyAll();
		},
		
		remove: function(item){
			Todo.all().filter('title','=',item.title).destroyAll();
		},
		
		fetchAll: function(controller){
			Todo.all().list(function(items){
				var itemCount = items.length;
				var todos = [];
				items.forEach(function(item){
					todos.push({
						title: item.title,
						done: item.done,
						editing: false
					});
					if(--itemCount == 0){
						controller.todos = todos;
						controller.refresh();
					}
				});
			});
		},
	};
});
