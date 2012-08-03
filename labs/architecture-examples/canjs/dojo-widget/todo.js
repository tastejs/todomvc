require({
	packages: [{
    	name: "can/dojo",
    	location: "http://canjs.us/release/latest/",
    	main: "can.dojo"
	}]
}, ['can/dojo',
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-geometry",
	"dojo/NodeList-manipulate",
	"dijit/CalendarLite",
	"dijit/place",
	"dijit/focus",
	"dojo/domReady!"],
function(can, dom, domConstruct, domAttr){

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
		var name = 'todos-canjs-dojo-widget',
			data = dojo.fromJson( window.localStorage[name] || (window.localStorage[name] = '[]') ),
			res = cb.call(this, data);
		if(res !== false){
			can.each(data, function(todo) {
				delete todo.editing;
			});
			window.localStorage[name] = dojo.toJson(data);
		}
	},

	findAll: function(params){
		var def = new dojo.Deferred();
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
		var def = new dojo.Deferred();
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
		var def = new dojo.Deferred();
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random());
			todos.push(attrs);
		});
		def.resolve({id : attrs.id});
		return def
	},

	update: function(id, attrs){
		var def = new dojo.Deferred();
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
		dijit.focus(dojo.byId('new-todo'));

		// Hide the calendar on page click
		var cal = this.options.calendar;
		dojo.query(document).on('click', function(ev) {
			if (!dojo.hasClass(ev.target, 'due-date') && !dojo.query(ev.target).closest('#calendar').length) {
				dojo.query(cal.domNode).style('visibility', 'hidden');
			}
		})
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
	'.todo dblclick' : function(el) {
		can.data(el, 'todo').attr('editing', true).save(function(){
			dijit.focus(el.children('.edit')[0].focus());
		});
	},

	// Update a todo
	updateTodo: function(el) {
		can.data(el.closest('.todo'), 'todo')
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
		can.data(el.closest('.todo'), 'todo')
			.attr('complete', el.attr('checked')[0])
			.save();
	},

	// Listen for a removed Todo
	'.todo .destroy click' : function(el){
		can.data(el.closest('.todo'), 'todo').destroy();
	},

	// Listen for toggle all completed Todos
	'#toggle-all click' : function(el, ev) {
		var toggle = el.attr('checked')[0];
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
		var todo = can.data(el.closest('.todo'), 'todo');

		// Display the calendar
		var cal = this.options.calendar;
		dijit.place.at(cal.domNode, {x: 510, y: dojo.position(el[0]).y}, ["TL"]);
		cal.set('value', todo.dueDate || "");
		this._todo = todo;
		dojo.query(cal.domNode).style('visibility', 'visible');
	},

	// Listen for a clear due date
	'.todo .clear-date click' : function(el, e){
		can.data(el.closest('.todo'), 'todo').attr('dueDate', null).save();
	},

	// Date change for Todo
	'{calendar} change': function(calendar, date){
		// Update the todo if one exists
		if (this._todo) {
			dojo.query(this.options.calendar.domNode).style('visibility', 'hidden');
			this._todo.attr('dueDate', date || null).save();
			delete this._todo;
		}
	}

})

// Initialize the app
Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos,
		calendar: new dijit.CalendarLite({}, "calendar")
	});
});

});
