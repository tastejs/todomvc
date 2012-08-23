(function() {

// Calculates the difference between two dates by number of days.
var difference = function(date1, date2) {
	date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
	date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
	return (date1 - date2) / (1000*60*60*24);
};

// Basic Todo entry model
// { text: 'todo', complete: false }
Todo = can.Model({

	// Implement local storage handling
	localStore: function(cb){
		var name = 'todos-canjs-jquery-widget',
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

},{

	prettyDate: function(raw){
		var raw = this.attr('dueDate');
		if (!raw) {
			return '';
		}

		var date = new Date(raw),
			diff = difference(new Date(), date);

		if(diff === -1) {
			return 'Tomorrow';
		} else if(diff === 0) {
			return 'Today';
		} else if(diff === 1) {
			return 'Yesterday';
		} else {
			return (date.getMonth()+1) + '/' + (date.getDate()) + '/' + date.getFullYear();
		}
	},

	isLate: function(raw) {
		var raw = this.attr('dueDate');
		return !raw ? false : difference(new Date(), new Date(raw)) > 0;
	}

});

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
			todo.attr('complete') && todo.destroy();
		}
	},

		// Listen for a change due date request
	'.todo .due-date click' : function(el, ev){
		ev.preventDefault();

		// Cache the todo
		var todo = el.closest('.todo').data('todo');

		// Display the calendar
		var cal = this.options.calendar;
		$('#calendar').css('top', el.offset().top + 'px');
		cal.datepicker('setDate', todo.dueDate || null);
		this._todo = todo;
		cal.show();
	},

	// Listen for a clear due date
	'.todo .clear-date click' : function(el, e){
		el.closest('.todo').data('todo').attr('dueDate', null).save();
	},

	// Date change for Todo
	'{calendar} datepickerselect': function(calendar, ev){
		// Update the todo if one exists
		if (this._todo) {
			this.options.calendar.hide();
			this._todo.attr('dueDate', this.options.calendar.datepicker('getDate')).save();
			delete this._todo;
		}
	}

})

// Initialize the app
Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos,
		calendar: $('#calendar').hide().datepicker({
			// Adding a workaround for date selection since the jQuery UI
			// datepicker widget doesn't fire the "datepickerselect" event
			onSelect: function(dateText, datepicker) {
				$(this).trigger({
					type: 'datepickerselect',
					text: dateText,
					target: datepicker
				});
			}
		})
	});
});

})();
