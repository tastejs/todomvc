import * as uuid from 'node-uuid';

export class TodoModel {
	completed;
	title;
	uid;
	due;

	setTitle(title) {
		this.title = title.trim();
	}

	constructor(title,due) {
		this.uid = uuid.v4();
		this.completed = false;
		this.title = title.trim();
		this.due = due
	}
}
