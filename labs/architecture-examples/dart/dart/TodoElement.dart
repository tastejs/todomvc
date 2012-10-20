part of todomvc;

class TodoElement {
  TodoApp todoApp;
  Todo todo;
  Element element;
  InputElement toggleElement;
  
  TodoElement(this.todoApp, this.todo) {
  }
  
  Element createElement() {
    element = new Element.html('''
        <li ${todo.completed ? 'class="completed"' : ''}>
        <div class='view'>
        <input class='toggle' type='checkbox' ${todo.completed ? 'checked' : ''}>
        <label class='todo-content'>${todo.title}</label>
        <button class='destroy'></button>
        </div>
        <input class='edit' value='${todo.title}'>
        </li>
    ''');
    Element contentElement = element.query('.todo-content');
    InputElement editElement = element.query('.edit');

    toggleElement = element.query('.toggle');
    
    toggleElement.on.click.add((MouseEvent e) {
      toggle();
      todoApp.updateCounts();
    });
    contentElement.on.doubleClick.add((MouseEvent e) {
      element.classes.add('editing');
      editElement.selectionStart = todo.title.length;
      editElement.focus();
    });
    
    void removeTodo() {
      element.remove();
      todoApp.removeTodo(this);
      todoApp.updateFooterDisplay();
    }
    
    element.query('.destroy').on.click.add((MouseEvent e) => removeTodo());
    
    void doneEditing() {
      todo.title = editElement.value.trim();
      if(todo.title != '') {
        contentElement.innerHTML = todo.title;
        element.classes.remove('editing');
      } else {
        removeTodo();
      }
    }
    
    editElement.on.keyPress.add((KeyboardEvent e) {
      if(e.keyIdentifier == KeyName.ENTER) {
        doneEditing();
      }
    });
    editElement.on.blur.add((Event e) => doneEditing());
    return element;
  }
  
  void show() {
    element.style.display = 'block';
  }

  void hide() {
    element.style.display = 'none';
  }

  void toggle() {
    todo.completed = !todo.completed;
    toggleElement.checked = todo.completed;
    if(todo.completed) {
      element.classes.add('completed');
    } else {
      element.classes.remove('completed');
    }
  }
}
