var Todo = function(app, title) {
	this._app = app;
	this._title = "";
	this._completed = false;

	this._dom = {
		node: document.createElement("li"),
		view: document.createElement("div"),
		checkbox: document.createElement("input"),
		edit: document.createElement("input"),
		label: document.createElement("label"),
		deleteLink: document.createElement("button")
	}

	this._build();
	this._setTitle(title);
}

Todo.fromJSON = function(app, data) {
	var todo = new this(app, data.title);
	todo.setCompleted(data.completed);
	return todo;
}

Todo.prototype.toJSON = function() {
	return {title:this._title, completed:this._completed};
}

Todo.prototype.getNode = function() {
	return this._dom.node;
}

Todo.prototype.setCompleted = function(completed) {
	this._completed = completed;

	this._dom.checkbox.checked = this._completed;
	this._dom.node.className = (this._completed ? "completed" : "");
	return this;
}

Todo.prototype.isCompleted = function() {
	return this._completed;
}

Todo.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			this.setCompleted(e.target.checked);
			this._app.refresh();
		break;

		case "dblclick":
			this._dom.node.className = "editing";
			this._dom.edit.value = this._title;
			this._dom.edit.focus();

		break;

		case "click":
			this._app.remove(this);
		break;

		case "keypress":
			if (e.keyCode != 13) { return; }
			this._endEditing();
		break;

		case "blur":
			this._endEditing();
		break;
	}
}

Todo.prototype._build = function() {
	this._dom.checkbox.type = "checkbox";
	this._dom.checkbox.className = "toggle";
	this._dom.checkbox.addEventListener("change", this);

	this._dom.label.appendChild(document.createTextNode(this._title));
	this._dom.label.addEventListener("dblclick", this);

	this._dom.deleteLink.className = "destroy";
	this._dom.deleteLink.addEventListener("click", this);

	this._dom.view.className = "view";
	this._dom.view.appendChild(this._dom.checkbox);
	this._dom.view.appendChild(this._dom.label);
	this._dom.view.appendChild(this._dom.deleteLink);

	this._dom.edit.className = "edit";
	this._dom.edit.addEventListener("keypress", this);
	this._dom.edit.addEventListener("blur", this);

	this._dom.node.appendChild(this._dom.view);
	this._dom.node.appendChild(this._dom.edit);
}

Todo.prototype._setTitle = function(title) {
	this._title = title;
	this._dom.label.innerHTML = "";
	this._dom.label.appendChild(document.createTextNode(title));
}

Todo.prototype._endEditing = function() {
	var title = this._dom.edit.value.trim();
	this._dom.node.className = "";

	if (title) {
		this._setTitle(title);
		this._app.refresh();
	} else {
		this._app.remove(this);
		return;
	}
}
