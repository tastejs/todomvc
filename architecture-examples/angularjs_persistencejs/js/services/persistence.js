todomvc.factory('persistencejs', function(){
	persistence.store.websql.config(persistence, 'todos-angularjs', 'todo database', 5*1024*1024);
	var Todo = persistence.define('todo', {
		title: 'TEXT',
		completed: 'BOOL'
	});
	persistence.schemaSync();
	return {
		add: function(item){
			var t = new Todo();
			t.title = item;
			t.completed = false;
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
				todo.completed = item.completed;
				persistence.flush();
			});
		},
		
		clearCompletedItems: function(){
			Todo.all().filter('completed','=',true).destroyAll();
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
						completed: item.completed,
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
