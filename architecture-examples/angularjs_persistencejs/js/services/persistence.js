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

		markAll: function( done, callback ) {
			Todo.all().list(function( items ) {
				var itemCount = items.length;
				items.forEach(function( item ) {
					item.completed = done;
					if( --itemCount == 0 ) {
						persistence.flush(callback);
					}
				});
			});
		},

		changeStatus: function( todo ) {
			Todo.all().filter( 'title', '=', todo.title ).one( function( todo ) {
				todo.completed = !todo.completed;
				persistence.flush();
			});
		},
	
		clearCompletedItems: function(){
			Todo.all().filter('completed','=',true).destroyAll();
		},
		
		remove: function(todo){
			Todo.all().filter('title','=',todo.title).destroyAll();
		},
		
		fetchAll: function( scope, callback ){
			Todo.all().list(function(items){
				if( !items ) return [];
				var itemCount = items.length;
				var todos = [];
				items.forEach(function(item){
					todos.push({
						title: item.title,
						completed: item.completed
					});
					if(--itemCount == 0){
						scope.todos = todos;
						callback();
					}
				});
			});
		},
	};
});
