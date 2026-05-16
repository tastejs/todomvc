Rectangle {
	anchors.fill: context;
	color: "#f5f5f5";

	JsonStorage {
		id: storage;

		onLoaded: { todoModel.buildModel(this.getValue(todoModel.name)) }
	}

	TodoModel {
		id: todoModel;

		onSave: { storage.setValue(this.name, { rows: this._rows }) }
	}

	Text {
		id: header;
		anchors.top: parent.top;
		anchors.horizontalCenter: parent.horizontalCenter;
		anchors.topMargin: 10;
		font.pixelSize: 100;
		text: "todos";
		color: "#B12F2F26";
	}

	Item {
		anchors.fill: content;
		anchors.topMargin: 20;
		anchors.bottomMargin: 10;
		effects.shadow.y: 22;
		effects.shadow.blur: 50;
		effects.shadow.spread: 5;
		effects.shadow.color: "#00000015";
	}

	Column {
		id: content;
		property string location: context.location.hash;
		width: context.width > 550 ? 550 : context.width;
		anchors.top: header.bottom;
		anchors.horizontalCenter: parent.horizontalCenter;
		anchors.topMargin: 5;
		radius: 40;

		TodoInput {
			id: input;
			allCompleted: todoModel.count > 0 && todoModel.count == todoModel.completedCount;

			onAddTodo(title): { todoModel.append({ title: title, completed: false }) }
			onToggleAll: { todoModel.toggleAll() }
		}

		TodoList {
			id: todoList;
			filterMode: parent.location;

			onEditModeChanged: { if (!value) input.focusInput() }
		}

		TodoStatus {
			id: todoStatus;
			visible: todoModel.count;
			todoCount: todoModel.todoCount;
			completedCount: todoModel.completedCount;

			onClearCompleted: { todoModel.clearCompleted() }
			onFilterChanged: { window.location.hash = this.filter }
		}
	}

	Footer {
		anchors.top: content.bottom;
		anchors.topMargin: todoModel.count ? 54 : 63;
	}
}
