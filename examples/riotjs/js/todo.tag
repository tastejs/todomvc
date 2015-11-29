/*global riot, todoStorage */
<todo>
	<section class="todoapp">
		<header class="header">
			<h1>todos</h1>
			<input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" onkeyup={ addTodo }>
		</header>
		<section class="main" show={ todos.length }>
			<input class="toggle-all" type="checkbox" checked={ allDone } onclick={ toggleAll }>
			<ul class="todo-list">
				<li riot-tag="todoitem" each={ t, i in filteredTodos() } todo={ t } parent={ parent }
					class="todo { completed: t.completed, editing: t.editing }"></li>
			</ul>
		</section>
		<footer class="footer" show={ todos.length }>
			<span class="todo-count">
				<strong>{ remaining }</strong> { remaining === 1 ? 'item' : 'items' } left
			</span>
			<ul class="filters">
				<li><a class={ selected: activeFilter=='all' } href="#/all">All</a></li>
				<li><a class={ selected: activeFilter=='active' } href="#/active">Active</a></li>
				<li><a class={ selected: activeFilter=='completed' } href="#/completed">Completed</a></li>
			</ul>
			<button class="clear-completed" onclick={ removeCompleted } show={ todos.length> remaining }> Clear completed</button>
		</footer>
	</section>
	<footer class="info">
		<p>Double-click to edit a todo</p>
		<br>
		<p>Written by <a href="http://github.com/txchen">Tianxiang Chen</a></p>
		<p>Edited by <a href="http://github.com/lukeed">Luke Edwards</a></p>
		<br>
		<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	</footer>
	<script>
		var ENTER_KEY = 13;
		var self = this;

		this.todos = opts.data || [];

		riot.route.exec(function(base, filter) {
			self.activeFilter = filter || 'all';
		});

		riot.route(function(base, filter) {
			self.activeFilter = filter;
			self.update();
		});

		this.on('update', function() {
			this.remaining = this.todos.filter(function(t) {
				return !t.completed
			}).length;

			this.allDone = this.remaining == 0;

			this.saveTodos();
		});

		saveTodos() {
			todoStorage.set(this.todos);
		}

		filteredTodos() {
			if (this.activeFilter == 'active') {
				return this.todos.filter(function(t) {
					return !t.completed;
				});
			} else if (this.activeFilter == 'completed') {
				return this.todos.filter(function(t) {
					return t.completed;
				});
			} else {
				return this.todos;
			}
		}

		addTodo(e) {
			if (e.which == ENTER_KEY) {
				var value = e.target.value && e.target.value.trim();

				if (!value) {
					return;
				}

				this.todos.push({
					title: value,
					completed: false
				});

				e.target.value = '';
			}
		}

		removeTodo(todo) {
			this.todos.some(function(t) {
				if (todo === t) {
					self.todos.splice(self.todos.indexOf(t), 1);
				}
			});
			this.update()
		}

		toggleAll(e) {
			this.todos.forEach(function(t) {
				t.completed = e.target.checked;
			});

			return true;
		}

		removeCompleted() {
			this.todos = this.todos.filter(function(t) {
				return !t.completed;
			});
		}
	</script>
</todo>

<todoitem>
	<div class="view">
		<input class="toggle" type="checkbox" checked={ opts.todo.completed } onclick={ toggleTodo }>
		<label ondblclick={ editTodo }>{ opts.todo.title }</label>
		<button class="destroy" onclick={ removeTodo }></button>
	</div>
	<input name="todoeditbox" class="edit" type="text" onblur={ doneEdit } onkeyup={ editKeyUp }>
	<script>
		var ENTER_KEY = 13;
		var ESC_KEY = 27;

		opts.todo.editing = false;

		toggleTodo() {
			opts.todo.completed = !opts.todo.completed;
			opts.parent.saveTodos();
			return true;
		}

		editTodo() {
			opts.todo.editing = true;
			this.todoeditbox.value = opts.todo.title;
		}

		removeTodo() {
			opts.parent.removeTodo(opts.todo);
		}

		doneEdit() {
			if (!opts.todo.editing) {
				return;
			}

			opts.todo.editing = false;

			var enteredText = this.todoeditbox.value && this.todoeditbox.value.trim();

			if (enteredText) {
				opts.todo.title = enteredText;
				opts.parent.saveTodos();
			} else {
				this.removeTodo();
			}
		}

		editKeyUp(e) {
			if (e.which === ENTER_KEY) {
				this.doneEdit();
			} else if (e.which === ESC_KEY) {
				this.todoeditbox.value = opts.todo.title;
				this.doneEdit();
			}
		}

		this.on('update', function() {
			if (opts.todo.editing) {
				opts.parent.update();
				this.todoeditbox.focus();
			}
		});
	</script>
</todoitem>
