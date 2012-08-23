(function() {

// Basic Todo entry model
// { text: 'todo', complete: false }
Todo = can.Model({

	// Implement local storage handling
	localStore: function(cb){
		var name = 'todos-canjs-jquery',
			data = JSON.parse( window.localStorage[name] || (window.localStorage[name] = '[]') ),
			res = cb.call(this, data);
		if(res !== false){
			can.each(data, function(todo) {
				delete todo.editing;
			});
			window.localStorage[name] = JSON.stringify(data);
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
		});
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
		return def;
	},

	create: function(attrs){
		var def = new can.Deferred();
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random(), 10);
			todos.push(attrs);
		});
		def.resolve({id : attrs.id});
		return def;
	},

	update: function(id, attrs){
		var def = new can.Deferred(), todo;
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					todo = todos[i];
					break;
				}
			}
			can.extend(todo, attrs);
		});
		def.resolve({});
		return def;
	}

},{});

// List for Todos
Todo.List = can.Model.List({

	completed: function() {
		// Ensure this triggers on length change
		this.attr('length');

		var completed = 0;
		this.each(function(todo) {
			completed += todo.attr('complete') ? 1 : 0;
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
		$('#new-todo').val('').focus();
	},

	// Listen for when a new Todo has been entered
	'#new-todo keyup' : function(el, ev){
		if(ev.keyCode == 13){
			new Todo({
				text : el.val(),
				complete : false
			}).save(function() {
				el.val('');
			});
		}
	},

	// Handle a newly created Todo
	'{Todo} created' : function(list, ev, item){
		this.options.todos.push(item);
	},

	// Listen for editing a Todo
	'.todo dblclick' : function(el, ev) {
		el.data('todo').attr('editing', true).save(function() {
			el.children('.edit').focus();
		});
	},

	// Update a todo
	updateTodo: function(el) {
		el.closest('.todo').data('todo')
			.attr({
				editing: false,
				text: el.val()
			}).save();
	},

	// Listen for an edited Todo
	'.todo .edit keyup' : function(el, ev){
		if(ev.keyCode == 13){
			this.updateTodo(el);
		}
	},
	'.todo .edit focusout' : function(el, ev) {
		this.updateTodo(el);
	},

	// Listen for the toggled completion of a Todo
	'.todo .toggle click' : function(el, ev) {
		el.closest('.todo').data('todo')
			.attr('complete', el.is(':checked'))
			.save();
	},

	// Listen for a removed Todo
	'.todo .destroy click' : function(el){
		el.closest('.todo').data('todo').destroy();
	},

	// Listen for toggle all completed Todos
	'#toggle-all click' : function(el, ev) {
		var toggle = el.prop('checked');
		can.each(this.options.todos, function(todo) {
			todo.attr('complete', toggle).save();
		});
	},

	// Listen for removing all completed Todos
	'#clear-completed click' : function() {
		for (var i = this.options.todos.length - 1, todo; i > -1 && (todo = this.options.todos[i]); i--) {
			if ( todo.attr('complete') ) {
				todo.destroy();
			}
		}
	}

});

// Initialize the app
Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos
	});
});

})();
