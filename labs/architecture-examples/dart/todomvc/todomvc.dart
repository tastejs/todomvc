#import('dart:html');

// TODO XSS check
void main() {
  InputElement newTodoElement = query("#new-todo");
  Element todoListElement = query("#todo-list");
  
  newTodoElement.on.keyPress.add((KeyboardEvent e) {
    if(e.keyIdentifier == KeyName.ENTER) {
      Todo todo = new Todo();
      todo.done = false;
      todo.content = newTodoElement.value.trim();
      newTodoElement.value = "";
      todoListElement.nodes.add(new TodoElement(todo).element());
    }
  });
}

class TodoElement {
  Todo todo;
  
  TodoElement(this.todo) {
  }
  
  Element element() {
    Element element = new Element.html('''
        <li ${todo.done ? 'class="completed"' : ''}>
        <div class="view">
        <input class="toggle" type="checkbox" ${todo.done ? 'checked' : ''}>
        <label class="todo-content">${todo.content}</label>
        <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.content}">
        </li>
    ''');
    Element contentElement = element.query(".todo-content");
    InputElement editElement = element.query(".edit");

    element.query(".toggle").on.click.add((MouseEvent e) {
      todo.done = !todo.done;
    });
    contentElement.on.doubleClick.add((MouseEvent e) {
      element.classes.add("editing");
      editElement.focus();
    });
    element.query(".destroy").on.click.add((MouseEvent e) {
      element.remove();
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
}

class Todo {
  String content;
  bool done;
  
  void toggle() {
    done = !done;
  }
}