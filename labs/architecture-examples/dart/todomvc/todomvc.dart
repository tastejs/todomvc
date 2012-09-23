#import('dart:html');

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
        <label>${todo.content}</label>
        <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.content}">
        </li>
    ''');
    element.query(".destroy").on.click.add((MouseEvent e) {
      element.remove();
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