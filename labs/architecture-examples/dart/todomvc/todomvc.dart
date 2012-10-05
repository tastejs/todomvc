#import('dart:html');

// TODO XSS check

List<TodoElement> todoElements = new List();

void main() {
  InputElement newTodoElement = query("#new-todo");
  Element todoListElement = query("#todo-list");
  Element clearCompletedElement = query("#clear-completed");
  
  newTodoElement.on.keyPress.add((KeyboardEvent e) {
    if(e.keyIdentifier == KeyName.ENTER) {
      String content = newTodoElement.value.trim();
      if(content != "") {
        Todo todo = new Todo();
        todo.complete = false;
        todo.content = content;

        TodoElement todoElement = new TodoElement(todo);
        todoElements.add(todoElement);
        todoListElement.nodes.add(todoElement.createElement());

        newTodoElement.value = "";
      }
    }
  });
  
  clearCompletedElement.on.click.add((MouseEvent e) {
    for(int i = 0 ; i < todoElements.length ; i++) {
      if(todoElements[i].todo.complete) {
        todoElements[i].element.remove();
        todoElements.removeAt(i);
      }
    }
  });
}

class TodoElement {
  Todo todo;
  Element element;
  
  TodoElement(this.todo) {
  }
  
  Element createElement() {
    element = new Element.html('''
        <li ${todo.complete ? 'class="completed"' : ''}>
        <div class="view">
        <input class="toggle" type="checkbox" ${todo.complete ? 'checked' : ''}>
        <label class="todo-content">${todo.content}</label>
        <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.content}">
        </li>
    ''');
    Element contentElement = element.query(".todo-content");
    InputElement editElement = element.query(".edit");

    element.query(".toggle").on.click.add((MouseEvent e) {
      todo.toggle();
      if(todo.complete) {
        element.classes.add("completed");
      } else {
        element.classes.remove("completed");
      }
    });
    contentElement.on.doubleClick.add((MouseEvent e) {
      element.classes.add("editing");
      editElement.focus();
    });
    element.query(".destroy").on.click.add((MouseEvent e) {
      element.remove();
      // TODO throw an event to delete global todoElements
      todoElements.removeAt(todoElements.indexOf(this));
    });
    editElement.on.keyPress.add((KeyboardEvent e) {
      if(e.keyIdentifier == KeyName.ENTER) {
        todo.content = editElement.value.trim();
        element.classes.remove("editing");
        contentElement.innerHTML = todo.content;
      }
    });
    return element;
  }
  
  void hideIfComplete() {
    if(todo.complete) {
      element.classes.add("hidden");
    }
  }
}

class Todo {
  String content;
  bool complete;
  
  void toggle() {
    complete = !complete;
  }
}