export class Todo {
	completed: Boolean;
	editing: Boolean;

	private _title: String;
	private _tododate: String;
	private _colorCode: String;
	
	get title() {
		return this._title;
	}
	set title(value: String) {
		this._title = value.trim();
	}
	
	get tododate() {
		return this._tododate;
	}
	set tododate(value: String) {
		this._tododate = value;
	}
	
	get colorCode() {
		return this._colorCode;
	}
	set colorCode(value: String) {
		this._colorCode = value;
	}
	

	constructor(title: String, tododate: String, colorCode: String) {
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
		this.tododate = tododate;
		this.colorCode = colorCode;
	}
}

export class TodoStore {
	todos: Array<Todo>;

	constructor() {
		this.colorCodeMap = {
			"duesoon": "#E8E8E8",
			"overdue": "#6A6A6A"
		};
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-todos') || '[]');
		// Normalize back into classes
		this.todos = persistedTodos.map( (todo: {_title: String, _tododate: String, _colorCode: String, completed: Boolean}) => {
			var colorCode = this.colorCodeMap[this.checkDue(todo._tododate)];	
			let ret = new Todo(todo._title, todo._tododate, colorCode);
			ret.completed = todo.completed;
			return ret;
		});
	}

	private updateStore() {
		localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
	}

	private getWithCompleted(completed: Boolean) {
		return this.todos.filter((todo: Todo) => todo.completed === completed);
	}

	allCompleted() {
		return this.todos.length === this.getCompleted().length;
	}

	setAllTo(completed: Boolean) {
		this.todos.forEach((t: Todo) => t.completed = completed);
		this.updateStore();
	}

	removeCompleted() {
		this.todos = this.getWithCompleted(false);
		this.updateStore();
	}

	getRemaining() {
		return this.getWithCompleted(false);
	}

	getCompleted() {
		return this.getWithCompleted(true);
	}

	toggleCompletion(todo: Todo) {
		todo.completed = !todo.completed;
		this.updateStore();
	}

	remove(todo: Todo) {
		this.todos.splice(this.todos.indexOf(todo), 1);
		this.updateStore();
	}

	add(title: String, tododate: String) {
		var colorCode = this.colorCodeMap[this.checkDue(tododate)];		
		this.todos.push(new Todo(title, tododate, colorCode));
		this.updateStore();
	}
	
	checkDue(tododate: String) {
		var today = new Date().getTime(),
			datediff = Math.round(new Date(tododate).getTime() - today)/(1000 * 3600 * 24);
		if(datediff <0){
			return "overdue";
		} else if(datediff >0 && datediff<=2) {
			return "duesoon";
		}
		return true;
	}
}
