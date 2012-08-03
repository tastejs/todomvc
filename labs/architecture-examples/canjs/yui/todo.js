(function() {

YUI().use(/* CanJS */ 'can', 'json', 'node', function(Y) {

// Basic Todo entry model
// { text: 'todo', complete: false }
Todo = can.Model({

	// Implement local storage handling
	localStore: function(cb){
		var name = 'todos-canjs-yui',
			data = Y.JSON.parse( window.localStorage[name] || (window.localStorage[name] = '[]') ),
			res = cb.call(this, data);
		if(res !== false){
			can.each(data, function(todo) {
				delete todo.editing;
			});
			window.localStorage[name] = Y.JSON.stringify(data);
		}
	},

	findAll: function(params){
		var def = new can.Deferred();
		this.localStore(function(todos){
			var instances = [],
				self = this;
			can.each(todos, function(todo) {
				instances.push(new self(todo));
			});
			def.resolve({data: instances});
		})
		return def;
	},

	destroy: function(id){
		var def = new can.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					todos.splice(i, 1);
					break;
				}
			}
			def.resolve({});
		});
		return def
	},

	create: function(attrs){
		var def = new can.Deferred();
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random());
			todos.push(attrs);
		});
		def.resolve({id : attrs.id});
		return def
	},

	update: function(id, attrs){
		var def = new can.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					var todo = todos[i];
					break;
				}
			}
			can.extend(todo, attrs);
		});
		def.resolve({});
		return def
	}

},{});

// List for Todos
Todo.List = can.Model.List({

	completed: function() {
		// Ensure this triggers on length change
		this.attr('length');

		var completed = 0;
		this.each(function(todo) {
			completed += todo.attr('complete') ? 1 : 0
		});
		return completed;
	},

	remaining: function() {
		return this.attr('length') - this.completed();
	},

	allComplete: function() {
		return this.attr('length') === this.completed();
	}

});

Todos = can.Control({

	// Initialize the Todos list
	init : function(){
		// Render the Todos
		this.element.append(can.view('todo', {
			todos: this.options.todos
		}));

		// Clear the new todo field
		Y.one('#new-todo').set('value','').focus();
	},

	// Listen for when a new Todo has been entered
	'#new-todo keyup' : function(el, ev){
		if(ev.keyCode == 13){
			new Todo({
				text : el.get('value'),
				complete : false
			}).save(function() {
				el.set('value','');
			});
		}
	},

	// Handle a newly created Todo
	'{Todo} created' : function(list, ev, item){
		this.options.todos.push(item);
	},

	// Listen for editing a Todo
	'.todo dblclick' : function(el) {
		el.getData('todo').attr('editing', true).save(function() {
			el.one('.edit').focus();
		});
	},

	// Update a todo
	updateTodo: function(el) {
		el.ancestor('.todo').getData('todo')
			.attr({
				editing: false,
				text: el.get('value')
			}).save();
	},

	// Listen for an edited Todo
	'.todo .edit keyup' : function(el, ev){
		if(ev.keyCode == 13){
			this.updateTodo(el);
		}
	},
	'.todo .edit blur' : function(el, ev) {
		this.updateTodo(el);
	},

	// Listen for the toggled completion of a Todo
	'.todo .toggle click' : function(el, ev) {
		el.ancestor('.todo').getData('todo')
			.attr('complete', el.get('checked'))
			.save();
	},

	// Listen for a removed Todo
	'.todo .destroy click' : function(el){
		el.ancestor('.todo').getData('todo').destroy();
	},

	// Listen for toggle all completed Todos
	'#toggle-all click' : function(el, ev) {
		var toggle = el.get('checked');
		can.each(this.options.todos, function(todo) {
			todo.attr('complete', toggle).save();
		});
	},

	// Listen for removing all completed Todos
	'#clear-completed click' : function() {
		for (var i = this.options.todos.length - 1, todo; i > -1 && (todo = this.options.todos[i]); i--) {
			todo.attr('complete') && todo.destroy();
		}
	}

})

// Initialize the app
Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos
	});
});

});

})();
