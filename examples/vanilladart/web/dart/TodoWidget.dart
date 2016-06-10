part of todomvc;

class TodoWidget {
  static const HtmlEscape htmlEscape = const HtmlEscape();

  TodoApp todoApp;
  Todo todo;
  Element element;
  InputElement toggleElement;

  TodoWidget(this.todoApp, this.todo);

  Element createElement() {
    element = new Element.html('''
			<li ${todo.completed ? 'class="completed"' : ''}>
			<div class='view'>
			<input class='toggle' type='checkbox' ${todo.completed ? 'checked' : ''}>
			<label class='todo-content'>${htmlEscape.convert(todo.title)}</label>
			<button class='destroy'></button>
			</div>
			<input class='edit' value='${htmlEscape.convert(todo.title)}'>
			</li>
		''');

    Element contentElement = element.querySelector('.todo-content');
    InputElement editElement = element.querySelector('.edit');

    toggleElement = element.querySelector('.toggle');

    toggleElement.onClick.listen((_) {
      toggle();
      todoApp.updateCounts();
      todoApp.save();
    });

    contentElement.onDoubleClick.listen((_) {
      element.classes.add('editing');
      editElement.selectionStart = todo.title.length;
      editElement.focus();
    });

    void removeTodo() {
      element.remove();
      todoApp.removeTodo(this);
      todoApp.updateFooterDisplay();
    }

    element.querySelector('.destroy').onClick.listen((_) {
      removeTodo();
      todoApp.save();
    });

    void doneEditing() {
      editElement.value = editElement.value.trim();
      todo.title = editElement.value;
      if (todo.title.isNotEmpty) {
        contentElement.text = todo.title;
        element.classes.remove('editing');
      } else {
        removeTodo();
      }
      todoApp.save();
    }

    void undoEditing() {
      element.classes.remove('editing');
      editElement.value = todo.title;
    }

    editElement
      ..onKeyDown.listen((KeyboardEvent e) {
        switch (e.keyCode) {
          case KeyCode.ENTER:
            doneEditing();
            break;
          case KeyCode.ESC:
            undoEditing();
            break;
        }
      })
      ..onBlur.listen((_) => doneEditing());

    return element;
  }

  void set visible(bool visible) {
    element.style.display = visible ? 'block' : 'none';
  }

  void toggle() {
    todo.completed = !todo.completed;
    toggleElement.checked = todo.completed;
    if (todo.completed) {
      element.classes.add('completed');
    } else {
      element.classes.remove('completed');
    }
  }
}
