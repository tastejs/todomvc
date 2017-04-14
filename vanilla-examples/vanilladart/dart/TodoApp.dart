part of todomvc;

class TodoApp {
	List<TodoWidget> todoWidgets = new List<TodoWidget>();

	Element todoListElement = querySelector('#todo-list');
	Element mainElement = querySelector('#main');
	InputElement checkAllCheckboxElement = querySelector('#toggle-all');
	Element footerElement = querySelector('#footer');
	Element countElement = querySelector('#todo-count');
	Element clearCompletedElement = querySelector('#clear-completed');
	Element showAllElement = querySelector('#filters a[href="#/"]');
	Element showActiveElement = querySelector('#filters a[href="#/active"]');
	Element showCompletedElement = querySelector('#filters a[href="#/completed"]');
	
	var uuid = new Uuid();

	TodoApp() {
		initLocalStorage();
		initElementEventListeners();

		window.onHashChange.listen((e) => updateFilter());

		updateFooterDisplay();
	}

	void initLocalStorage() {
		var jsonList = window.localStorage['todos-vanilladart'];
		if (jsonList != null) {
			try {
				var todos = JSON.decode(jsonList);
				for (Map todo in todos) {
					addTodo(new Todo.fromJson(todo));
				}
			} catch (e) {
				window.console.log('Could not load todos form local storage.');
			}
		}
	}

	void initElementEventListeners() {
		InputElement newTodoElement = querySelector('#new-todo');

		newTodoElement.onKeyPress.listen((KeyboardEvent e) {
			if (e.keyCode == KeyCode.ENTER) {
				var title = newTodoElement.value.trim();
				if (title != '') {
					addTodo(new Todo(uuid.v4(), title));
					newTodoElement.value = '';
					updateFooterDisplay();
					save();
				}
			}
		});

		checkAllCheckboxElement.onClick.listen((e) {
			for (TodoWidget todoWidget in todoWidgets) {
				if (todoWidget.todo.completed != checkAllCheckboxElement.checked) {
					todoWidget.toggle();
				}
			}
			updateCounts();
			save();
		});

		clearCompletedElement.onClick.listen((e) {
			var newList = new List<TodoWidget>();
			for (TodoWidget todoWidget in todoWidgets) {
				if (todoWidget.todo.completed) {
					todoWidget.element.remove();
				} else {
					newList.add(todoWidget);
				}
			}
			todoWidgets = newList;
			updateFooterDisplay();
			save();
		});
	}

	void addTodo(Todo todo) {
		var todoWidget = new TodoWidget(this, todo);
		todoWidgets.add(todoWidget);
		todoListElement.nodes.add(todoWidget.createElement());
	}

	void updateFooterDisplay() {
		var display = todoWidgets.length == 0 ? 'none' : 'block';
		checkAllCheckboxElement.style.display = display;
		mainElement.style.display = display;
		footerElement.style.display = display;
		updateCounts();
	}

	void updateCounts() {
		var complete = 0;
		for (TodoWidget todoWidget in todoWidgets) {
			if (todoWidget.todo.completed) {
				complete++;
			}
		}
		checkAllCheckboxElement.checked = (complete == todoWidgets.length);
		var left = todoWidgets.length - complete;
		countElement.innerHtml = '<strong>${left}</strong> item${left != 1 ? 's' : ''} left';
		if (complete == 0) {
			clearCompletedElement.style.display = 'none';
		} else {
			clearCompletedElement.style.display = 'block';
			clearCompletedElement.text = 'Clear completed (${complete})';
		}
		updateFilter();
	}

	void removeTodo(TodoWidget todoWidget) {
		todoWidgets.removeAt(todoWidgets.indexOf(todoWidget));
	}

	void updateFilter() {
		switch(window.location.hash) {
			case '#/active':
				showActive();
				break;
			case '#/completed':
				showCompleted();
				break;
			default:
				showAll();
				return;
		}
	}

	void showAll() {
		setSelectedFilter(showAllElement);
		for (TodoWidget todoWidget in todoWidgets) {
			todoWidget.visible = true;
		}
	}

	void showActive() {
		setSelectedFilter(showActiveElement);
		for (TodoWidget todoWidget in todoWidgets) {
			todoWidget.visible = !todoWidget.todo.completed;
		}
	}

	void showCompleted() {
		setSelectedFilter(showCompletedElement);
		for (TodoWidget todoWidget in todoWidgets) {
			todoWidget.visible = todoWidget.todo.completed;
		}
	}

	void setSelectedFilter(Element e) {
		showAllElement.classes.remove('selected');
		showActiveElement.classes.remove('selected');
		showCompletedElement.classes.remove('selected');
		e.classes.add('selected');
	}

	void save() {
		var todos = new List<Todo>();
		for (TodoWidget todoWidget in todoWidgets) {
			todos.add(todoWidget.todo);
		}
		window.localStorage['todos-vanilladart'] = JSON.encode(todos);
	}
}
