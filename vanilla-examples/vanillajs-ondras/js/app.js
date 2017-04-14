var App = function() {
	this._todos = [];
	this._filterCompleted = null;
	this._storageKey = "todos-vanillajs-ondras";

	this._dom = {
		newTodo: document.querySelector("#new-todo"),
		toggleAll: document.querySelector("#toggle-all"),
		todoList: document.querySelector("#todo-list"),
		footer: document.querySelector("#footer"),
		todoCount: document.querySelector("#todo-count"),
		clearCompleted: document.querySelector("#clear-completed")
	}

	this._load();
	this._syncLocation();
	this.refresh();

	this._dom.newTodo.addEventListener("keypress", this);
	this._dom.toggleAll.addEventListener("change", this);
	this._dom.clearCompleted.addEventListener("click", this);
	window.addEventListener("hashchange", this);
}

App.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "keypress":
			if (e.keyCode != 13 || !e.target.value.trim()) { return; }
			var todo = new Todo(this, e.target.value.trim());
			this._todos.push(todo);
			e.target.value = "";
		break;

		case "change":
			for (var i=0; i<this._todos.length;i++) {
				this._todos[i].setCompleted(e.target.checked);
			}
		break;

		case "click":
			for (var i=0; i<this._todos.length;i++) {
				var todo = this._todos[i];
				if (!todo.isCompleted()) { continue; }
				this._todos.splice(i, 1);
				i--;
			}
			this._dom.newTodo.focus();
		break;
		
		case "hashchange":
			this._syncLocation();
		break;
	}

	this.refresh();
}

App.prototype.refresh = function() {
	this._save();
	this._dom.todoList.innerHTML = "";

	var completedCount = 0;
	for (var i=0;i<this._todos.length;i++) {
		var todo = this._todos[i];

		if (todo.isCompleted()) { completedCount++; }

		if (this._filterCompleted !== null) {
			if (todo.isCompleted() != this._filterCompleted) { continue; }
		}
		
		this._dom.todoList.appendChild(todo.getNode());
	}

	this._dom.toggleAll.checked = (completedCount == this._todos.length);
	this._dom.toggleAll.style.display = (this._todos.length ? "" : "none");
	this._dom.footer.style.display = (this._todos.length ? "" : "none");

	this._dom.clearCompleted.innerHTML = "Clear completed (" + completedCount + ")";
	this._dom.clearCompleted.style.display = (completedCount ? "" : "none");

	var activeCount = this._todos.length - completedCount;
	var str = "<strong>" + activeCount + "</strong> ";
	str += (activeCount == 1 ? "item" : "items") + " left";
	this._dom.todoCount.innerHTML = str;
}

App.prototype.remove = function(todo) {
	var node = todo.getNode();
	node.parentNode.removeChild(node);

	var index = this._todos.indexOf(todo);
	this._todos.splice(index, 1);
	this.refresh();
}


App.prototype._load = function() {
	var data = localStorage.getItem(this._storageKey);
	if (!data) { return; }
	var items = JSON.parse(data);
	while (items.length) {
		var todo = Todo.fromJSON(this, items.shift());
		this._todos.push(todo);
	}
}

App.prototype._save = function() {
	var data = [];
	for (var i=0;i<this._todos.length;i++) {
		data.push(this._todos[i].toJSON());
	}
	localStorage.setItem(this._storageKey, JSON.stringify(data));
}

App.prototype._syncLocation = function() {
	var hash = location.hash || "#/";
	var oldLink = document.querySelector("#footer a.selected");
	if (oldLink) { oldLink.className = ""; }
	var newLink = document.querySelector("#footer a[href='" + hash + "']");
	if (!newLink) { return; } /* non-supported hash */
	
	newLink.className = "selected";
	this._filterCompleted = null;
	if (hash.indexOf("completed") != -1) { this._filterCompleted = true; }
	if (hash.indexOf("active") != -1) { this._filterCompleted = false; }
}
