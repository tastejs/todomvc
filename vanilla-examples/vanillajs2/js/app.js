;(function(window, document) {

	var ENTER_KEY = 13;

	/*
	 * DOM utilities
	 */

	function $(el, selector) {
		if (arguments.length === 1) { selector = el; el = document; }
		return el.querySelector(selector);
	}

	function domOn(el, event, fn, ctx) {
		el.addEventListener(event, (ctx ? fn.bind(ctx) : fn), false);
	}

	function hasClass(el, klass) {
		return el.className.indexOf(klass) >= 0;
	}

	function addClass(el, klass) {
		if (hasClass(el, klass)) return;
		el.className += ' ' + klass;
	}

	function removeClass(el, klass) {
		if (!hasClass(el, klass)) return;
		el.className = el.className.replace(klass, '').trim();
	}

	function hide(el) { addClass(el, 'hidden'); }
	function show(el) { removeClass(el, 'hidden'); }


	/*
	 * A little event mixin.
	 */

	function Evented(obj) {
		obj.on = Evented.on;
		obj.off = Evented.off;
		obj.fire = Evented.fire;
	}

	function getEvents(obj, name) {
		obj._events || (obj._events = {});
		return obj._events[name] || (obj._events[name] = []);
	}

	Evented.on = function(name, fn, ctx) {
		getEvents(this, name).push(fn, ctx);
	};

	Evented.off = function(name, fn) {
		var list = getEvents(this, name),
			index = list.indexOf(fn);
		if (index >= 0) list.splice(index, 2);
	}

	Evented.fire = function(name) {
		var list = getEvents(this, name),
			args = [].slice.call(arguments, 1),
			i = 0, len = list.length;
		for(; i < len; i += 2) list[i].apply(list[i + 1], args);
	};


	/*
	 * A little router.
	 */

	function Router() {
		this.routes = {};
		this._default = function() {};
		domOn(window, 'hashchange', this.dispatch, this);
	}

	Router.prototype.dispatch = function(path) {
		var path = window.location.hash.substring(1) || '/';
		(this.routes[path] || this._default)();
	};

	Router.prototype.on = function(path, action) {
		this.routes[path] = action;
	};

	Router.prototype.default = function(action) {
		this._default = function() {
			window.location.hash = '/';
			action();
		};
	};


	/*
	 * The basic Todo object.
	 */

	function Todo(attrs) {
		this.text = attrs.text;
		this.completed = !!attrs.completed;
	}

	Evented(Todo.prototype);

	Todo.prototype.toggle = function() {
		this.completed = !this.completed;
		this.fire('change');
	};

	Todo.prototype.set = function(key, value) {
		this[key] = value;
		this.fire('change');
	};


	/*
	 * The Todos object manages the variouss Todo objects.
	 */

	function Todos() {
		this.key = 'todos-vanillajs2';
		this.todos = [];
	}

	Evented(Todos.prototype);

	Todos.prototype.load = function(cb) {
		var todos = JSON.parse(localStorage.getItem(this.key)) || []
		todos.forEach(function(todo) {
			this.push(new Todo(todo));
		}, this);
		cb();
	};

	Todos.prototype.save = function() {
		localStorage.setItem(this.key, JSON.stringify(this.serialize()));
		this.fire('saved', this);
	};

	Todos.prototype.serialize = function() {
		return this.todos.map(function(todo) {
			return {text: todo.text, completed: todo.completed};
		});
	};

	Todos.prototype.push = function(todo) {
		this.todos.push(todo);
		todo.on('change', this.save, this);
		this.save();
	};

	Todos.prototype.add = function(text) {
		var todo = new Todo({text: text, completed: false});
		this.push(todo);
		this.fire('added', todo);
	};

	Todos.prototype.remove = function(todo) {
		var index = this.todos.indexOf(todo);
		if (index < 0) return;
		this.todos.splice(index, 1);
		this.save();
		todo.fire('removed');
	};

	Todos.prototype.clearCompleted = function() {
		var active = this.active(),
			completed = this.completed();
		this.todos = active;
		completed.forEach(function(todo) {
			todo.fire('removed');
		});
		this.save();
	};

	Todos.prototype.length = function() {
		return this.todos.length;
	};

	Todos.prototype.each = function(fn, ctx) {
		this.todos.forEach(fn, ctx);
	};

	Todos.prototype.active = function() {
		return this.todos.filter(function(todo) {
			return !todo.completed;
		});
	};

	Todos.prototype.completed = function() {
		return this.todos.filter(function(todo) {
			return todo.completed;
		});
	};


	/*
	 * TodoView coordinates the view for a single Todo.
	 */

	function TodoView(todo) {
		this.todo = todo;
		this.render();
		this.listen()
		this.update()
	}

	Evented(TodoView.prototype);

	(function() {
		var el = $('#todo-template');
		el.parentNode.removeChild(el);
		TodoView.prototype.template = el;
	})();

	TodoView.prototype.render = function() {
		this.el = this.template.cloneNode(true);
		this.text = $(this.el, '.text');
		this.edit = $(this.el, '.edit');
		this.toggle = $(this.el, '.toggle');
		this.remove = $(this.el, '.destroy');
	};

	TodoView.prototype.listen = function() {
		domOn(this.remove, 'click', function() { this.fire('remove'); }, this);
		domOn(this.text, 'dblclick', this.startEdit, this);
		domOn(this.text, 'blur', this.cancelEdit, this);
		domOn(this.edit, 'keypress', this.saveOnEnter, this);
		domOn(this.toggle, 'change', function() { this.todo.toggle(); }, this);

		this.todo.on('removed', function() { this.fire('destroy'); }, this);
		this.todo.on('show', function() { removeClass(this.el, 'hidden'); }, this);
		this.todo.on('hide', function() { addClass(this.el, 'hidden'); }, this);
		this.todo.on('change', this.update, this);
	};

	TodoView.prototype.update = function() {
		(this.todo.completed ? addClass : removeClass)(this.el, 'completed');
		this.text.innerHTML = this.todo.text;
		this.toggle.checked = this.todo.completed;
	}

	TodoView.prototype.startEdit = function() {
		this.edit.value = this.todo.text;
		addClass(this.el, 'editing');
		this.edit.focus();
	};

	TodoView.prototype.cancelEdit = function() {
		this.edit.value = this.todo.text;
		removeClass(this.el, 'editing');
	};

	TodoView.prototype.saveOnEnter = function(event) {
		if (event.keyCode !== ENTER_KEY) return;
		this.todo.set('text', this.edit.value);
		removeClass(this.el, 'editing');
	};


	/*
	 * ListView handles the UI for the list
	 */

	function ListView(el, todos) {
		this.el = el;
		this.todos = todos;
		this.ul = $(el, '#todo-list');
		this.toggleAll = $(el, '#toggle-all');
		this.listen();
	}

	ListView.prototype.listen = function() {
		this.todos.on('added', this.add.bind(this));
		this.todos.on('saved', this.update.bind(this));
		domOn(this.toggleAll, 'change', this.updateAll, this);
	}

	ListView.prototype.update = function() {
		var len = todos.length();

		if (len > 0) {
			show(this.el);
			this.toggleAll.checked = todos.completed().length === len;
		} else {
			hide(this.el);
		}
	}

	ListView.prototype.updateAll = function() {
		var completed = this.toggleAll.checked;
		this.todos.each(function(todo) { todo.set('completed', completed); });
	};

	ListView.prototype.add = function(todo) {
		var todoView = new TodoView(todo);
		this.ul.appendChild(todoView.el);
		todoView.on('remove', function() { this.todos.remove(todo); }, this);
		todoView.on('destroy', function() { this.ul.removeChild(todoView.el); }, this);
	};

	ListView.prototype.filter = function(which) {
		this.todos.each(function(todo) {
			var event = 'show';
			switch(which) {
				case 'active': event = todo.completed ? 'hide' : 'show'; break;
				case 'completed': event = todo.completed ? 'show' : 'hide'; break;
			}
			todo.fire(event);
		});
	};


	/*
	 * FooterView
	 */

	function FooterView(el, todos) {
		this.el = el;
		this.todos = todos;
		this.countNum = $(el, '#todo-count strong');
		this.countText = $(el, '#todo-count span');
		this.clear = $(el, '#clear-completed');
		this.links = el.querySelectorAll('a');
		this.listen();
	}

	Evented(FooterView.prototype);

	FooterView.prototype.listen = function() {
		this.todos.on('saved', this.update.bind(this));
		domOn(this.clear, 'click', function() { this.todos.clearCompleted() }, this);
	};

	FooterView.prototype.update = function() {
		if (!this.todos.length()) {
			hide(this.el);
			return;
		}

		show(this.el);
		this.updateCounts();
	};

	FooterView.prototype.updateCounts = function() {
		var numActive = this.todos.active().length;
			numCompleted = this.todos.completed().length;

		this.countNum.innerHTML = numActive;
		this.countText.innerHTML = numActive == 1 ? 'item left' : 'items left';
		this.clear.innerHTML = 'Clear completed (' + numCompleted + ')';
	};

	FooterView.prototype.select = function(which) {
		[].forEach.call(this.links, function(link) {
			(hasClass(link, which) ? addClass : removeClass)(link, 'selected');
		});
	};


	/*
	 * Entering new todos.
	 */

	function newTodoListener(el, todos) {
		domOn(el, 'keypress', function(event) {
			var text = el.value.trim();
			if (!(event.keyCode === ENTER_KEY && text)) return;
			todos.add(text);
			el.value = '';
		});
	}


	/*
	 * Wire everything together
	 */

	var todos = new Todos(),
		router = new Router(),
		list = new ListView($('#main'), todos),
		footer = new FooterView($('#footer'), todos);

	newTodoListener($('#new-todo'), todos);

	router.on('/active', function() {
		list.filter('active');
		footer.select('active');
	});

	router.on('/completed', function() {
		list.filter('completed');
		footer.select('completed');
	});

	router.default(function() {
		list.filter('all');
		footer.select('all');
	});

	todos.load(function() {
		todos.each(list.add, list);
		footer.update();
	});

	todos.on('saved', router.dispatch.bind(router));

	router.dispatch();

})(window, document);
