part of todomvc;

class TodoApp {
  List<TodoElement> todoElements = [];
  
  Element todoListElement = query('#todo-list');
  Element mainElement = query('#main');
  InputElement checkAllCheckboxElement = query('#toggle-all');
  Element footerElement = query('#footer'); 
  Element countElement = query('#todo-count');
  Element clearCompletedElement = query('#clear-completed');
  Element showAllElement = query('#filters a[href="#/"]');
  Element showActiveElement = query('#filters a[href="#/active"]');
  Element showCompletedElement = query('#filters a[href="#/completed"]');
  
  TodoApp() {
    initLocalStorage();
    initElementEventListeners();
    
    window.on.hashChange.add((e) => updateFilter());
    
    updateFooterDisplay();
  }
  
  void initLocalStorage() {
    String jsonList = window.localStorage["todos-vanilladart"];
    if (jsonList != null) {
      try {
        List<Map> todos = JSON.parse(jsonList);
        for(Map todo in todos) {
          addTodo(new Todo.fromJson(todo));
        }
      } catch (e) {
        window.console.log("Could not load todos form local storage.");
      }
    }
  }
  
  void initElementEventListeners() {
    InputElement newTodoElement = query('#new-todo');

    newTodoElement.on.keyPress.add((KeyboardEvent e) {
      if (e.keyIdentifier == KeyName.ENTER) {
        String title = newTodoElement.value.trim();
        if (title != '') {
          addTodo(new Todo(UUID.createUuid(), title));
          newTodoElement.value = '';
          updateFooterDisplay();
          save();
        }
      }
    });
    
    checkAllCheckboxElement.on.click.add((Event e) {
      InputElement target = e.srcElement;
      for(TodoElement todoElement in todoElements) {
        if (todoElement.todo.completed != target.checked) {
          todoElement.toggle();
        }
      }
      updateCounts();
      save();
    });

    clearCompletedElement.on.click.add((MouseEvent e) {
      List<TodoElement> newList = [];
      for(TodoElement todoElement in todoElements) {
        if (todoElement.todo.completed) {
          todoElement.element.remove();
        } else {
          newList.add(todoElement);
        }
      }
      todoElements = newList;
      updateFooterDisplay();
      save();
    });
  }
  
  void addTodo(Todo todo) {
    TodoElement todoElement = new TodoElement(this, todo);
    todoElements.add(todoElement);
    todoListElement.nodes.add(todoElement.createElement());
  }

  void updateFooterDisplay() {
    if (todoElements.length == 0) {
      checkAllCheckboxElement.style.display = 'none';
      mainElement.style.display = 'none';
      footerElement.style.display = 'none';
    } else {
      checkAllCheckboxElement.style.display = 'block';
      mainElement.style.display = 'block';
      footerElement.style.display = 'block';
    }
    updateCounts();
  }

  void updateCounts() {
    int complete = 0;
    for(TodoElement todoElement in todoElements) {
      if (todoElement.todo.completed) {
        complete++;
      }
    }
    checkAllCheckboxElement.checked = (complete == todoElements.length);
    int left = todoElements.length - complete;
    countElement.innerHTML = '<b>${left}</b> item${left != 1 ? 's' : ''} left';
    if (complete == 0) {
      clearCompletedElement.style.display = 'none';
    } else {
      clearCompletedElement.style.display = 'block';
      clearCompletedElement.text = 'Clear completed (${complete})';
    }
    updateFilter();
  }
  
  void removeTodo(TodoElement todoElement) {
    todoElements.removeAt(todoElements.indexOf(todoElement));
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
    }
  }
  
  void showAll() {
    setSelectedFilter(showAllElement);
    for(TodoElement todoElement in todoElements) {
      setTodoElementVisibility(todoElement, true);
    }
  }
  
  void showActive() {
    setSelectedFilter(showActiveElement);    
    for(TodoElement todoElement in todoElements) {
      setTodoElementVisibility(todoElement, !todoElement.todo.completed);
    }
  }
  
  void showCompleted() {
    setSelectedFilter(showCompletedElement);
    for(TodoElement todoElement in todoElements) {
      setTodoElementVisibility(todoElement, todoElement.todo.completed);
    }
  }
  
  void setSelectedFilter(Element e) {
    showAllElement.classes.remove('selected');
    showActiveElement.classes.remove('selected');
    showCompletedElement.classes.remove('selected');
    e.classes.add('selected');
  }
  
  void setTodoElementVisibility(TodoElement todoElement, bool show) {
    if (show) {
      todoElement.show();
    } else {
      todoElement.hide();
    }
  }
  
  void save() {
    StringBuffer storage = new StringBuffer('[');
    List<Todo> todos = [];
    for(TodoElement todoElement in todoElements) {
      todos.add(todoElement.todo);
    }
    window.localStorage["todos-vanilladart"] = JSON.stringify(todos);
  }
}
