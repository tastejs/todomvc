part of todomvc;

class TodoApp {
  List<TodoElement> todoElements = new List();
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
    InputElement newTodoElement = query('#new-todo');

    newTodoElement.on.keyPress.add((KeyboardEvent e) {
      if(e.keyIdentifier == KeyName.ENTER) {
        String title = newTodoElement.value.trim();
        if(title != '') {
          addTodo(title);
          newTodoElement.value = '';
          updateFooterDisplay();
        }
      }
    });
    
    checkAllCheckboxElement.on.click.add((Event e) {
      InputElement target = e.srcElement;
      todoElements.forEach((TodoElement todoElement) {
        if(todoElement.todo.completed != target.checked) {
          todoElement.toggle();
        }
      });
      updateCounts();
    });

    clearCompletedElement.on.click.add((MouseEvent e) {
      List<TodoElement> newList = new List<TodoElement>();
      todoElements.forEach((TodoElement todoElement) {
        if(todoElement.todo.completed) {
          todoElement.element.remove();
        } else {
          newList.add(todoElement);
        }
      });
      todoElements = newList;
      updateFooterDisplay();
    });
    
    window.on.hashChange.add((e) => updateFilter());
    
    updateFooterDisplay();
  }
  
  void addTodo(String title, [bool completed = false]) {
    Todo todo = new Todo(title, completed);

    TodoElement todoElement = new TodoElement(this, todo);
    todoElements.add(todoElement);
    todoListElement.nodes.add(todoElement.createElement());
  }

  void updateFooterDisplay() {
    if(todoElements.length == 0) {
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
    todoElements.forEach((TodoElement todoElement) {
      if(todoElement.todo.completed) {
        complete++;
      }
    });
    checkAllCheckboxElement.checked = (complete == todoElements.length);
    int left = todoElements.length - complete;
    countElement.innerHTML = '<b>${left}</b> item${left != 1 ? 's' : ''} left';
    if(complete == 0) {
      clearCompletedElement.style.display = 'none';
    } else {
      clearCompletedElement.style.display = 'block';
      clearCompletedElement.innerHTML = 'Clear completed (${complete})';
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
    todoElements.forEach((TodoElement todoElement) {
      setTodoElementVisibility(todoElement, true);
    });
  }
  
  void showActive() {
    setSelectedFilter(showActiveElement);    
    todoElements.forEach((TodoElement todoElement) {
      setTodoElementVisibility(todoElement, !todoElement.todo.completed);
    });
  }
  
  void showCompleted() {
    setSelectedFilter(showCompletedElement);
    todoElements.forEach((TodoElement todoElement) {
      setTodoElementVisibility(todoElement, todoElement.todo.completed);
    });
  }
  
  void setSelectedFilter(Element e) {
    showAllElement.classes.remove('selected');
    showActiveElement.classes.remove('selected');
    showCompletedElement.classes.remove('selected');
    e.classes.add('selected');
  }
  
  void setTodoElementVisibility(TodoElement todoElement, bool show) {
    if(show) {
      todoElement.show();
    } else {
      todoElement.hide();
    }
  }
}
