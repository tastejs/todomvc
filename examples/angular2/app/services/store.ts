export class Todo {
	completed: Boolean;
	editing: Boolean;

	private _title: String;
	private _tododate: String;
	private _colorCode: String;
	private _priority: String;
	
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
	
	get priority() {
		return this._priority;
	}
	set priority(value: String) {
		this._priority = value;
	}

	constructor(title: String, tododate: String, colorCode: String, priority: String) {
		this.completed = false;
		this.editing = false;
		this.title = title.trim();
		this.tododate = tododate;
		this.colorCode = colorCode;
		this.priority = priority;
	}
}

export class TodoStore {
	todos: Array<Todo>;

	constructor() {
		this.priorityMap = {
			"1": "Low",
			"2": "Medium",
			"3": "High"
		};
		this.colorCodeMap = {
			"duesoon": "#E8E8E8",
			"overdue": "#6A6A6A"
		};
		let persistedTodos = JSON.parse(localStorage.getItem('angular2-todos') || '[]');
		// Normalize back into classes
		this.todos = persistedTodos.map( (todo: {_title: String, _tododate: String, _colorCode: String, _priority: String, completed: Boolean}) => {
			var colorCode = this.colorCodeMap[this.checkDue(todo._tododate)];	
			let ret = new Todo(todo._title, todo._tododate, colorCode, todo._priority);
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

	add(title: String, tododate: String, priority: String) {
		var colorCode = this.colorCodeMap[this.checkDue(tododate)];		
		this.todos.push(new Todo(title, tododate, colorCode, priority));
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