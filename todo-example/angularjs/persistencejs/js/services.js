angular.service('persistencejs', function() {
	persistence.store.websql.config(persistence, 'todo', 'todo database', 5*1024*1024);
	var Todo = persistence.define('todo', {
		content: 'TEXT',
		done: 'BOOL'
	});
	persistence.schemaSync();
	return {
		add: function(item){
			var t = new Todo();
			t.content = item;
			t.done = false;
			persistence.add(t);
			persistence.flush();
		},
		
		edit: function(startContent, endContent){
			Todo.all().filter('content','=',startContent).one(function(item){
				item.content = endContent;
				persistence.flush();
			});
		},
		
		changeStatus: function(item){
			Todo.all().filter('content','=',item.content).one(function(todo){
				todo.done = item.done;
				persistence.flush();
			});
		},
		
		clearCompletedItems: function(){
			Todo.all().filter('done','=',true).destroyAll();
		},
		
		remove: function(item){
			Todo.all().filter('content','=',item.content).destroyAll();
		},
		
		fetchAll: function(controller){
			Todo.all().list(function(items){
				var itemCount = items.length;
				var todos = [];
				items.forEach(function(item){
					todos.push({
						content: item.content,
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