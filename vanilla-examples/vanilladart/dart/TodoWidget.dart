part of todomvc;

class TodoWidget {
	TodoApp todoApp;
	Todo todo;
	Element element;
	InputElement toggleElement;

	TodoWidget(this.todoApp, this.todo);

	var htmlEscape = new HtmlEscape();
	
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

		toggleElement.onClick.listen((e) {
			toggle();
			todoApp.updateCounts();
			todoApp.save();
		});

		contentElement.onDoubleClick.listen((e) {
			element.classes.add('editing');
			editElement.selectionStart = todo.title.length;
			editElement.focus();
		});

		void removeTodo() {
			element.remove();
			todoApp.removeTodo(this);
			todoApp.updateFooterDisplay();
		}

		element.querySelector('.destroy').onClick.listen((e) {
			removeTodo();
			todoApp.save();
		});

		void doneEditing() {
			todo.title = editElement.value.trim();
			if (todo.title != '') {
				contentElement.text = todo.title;
				element.classes.remove('editing');
			} else {
				removeTodo();
			}
			todoApp.save();
		}

		editElement
			..onKeyPress.listen((KeyboardEvent e) {
				if (e.keyCode == KeyCode.ENTER) {
					doneEditing();
				}
			})
			..onBlur.listen((e) => doneEditing());

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
