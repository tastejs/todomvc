part of todomvc;

class TodoWidget {
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
			<label class='todo-content'>${htmlEscape(todo.title)}</label>
			<button class='destroy'></button>
			</div>
			<input class='edit' value='${htmlEscape(todo.title)}'>
			</li>
		''');

		Element contentElement = element.query('.todo-content');
		InputElement editElement = element.query('.edit');

		toggleElement = element.query('.toggle');

		toggleElement.on.click.add((MouseEvent e) {
			toggle();
			todoApp.updateCounts();
			todoApp.save();
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

		element.query('.destroy').on.click.add((MouseEvent e) {
			removeTodo();
			todoApp.save();
		});

		void doneEditing(event) {
			todo.title = editElement.value.trim();
			if (todo.title != '') {
				contentElement.text = todo.title;
				element.classes.remove('editing');
			} else {
				removeTodo();
			}
			todoApp.save();
		}

		editElement.on
			..keyPress.add((KeyboardEvent e) {
				if (e.keyCode == KeyCode.ENTER) {
					doneEditing(e);
				}
			})
			..blur.add(doneEditing);

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
