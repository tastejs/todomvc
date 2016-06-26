import * as uuid from 'node-uuid';

export class TodoModel {
	completed;
	title;
	uid;

	setTitle(title) {
		this.title = title.trim();
	}

	constructor(title) {
		this.uid = uuid.v4();
		this.completed = false;
		this.title = title.trim();
	}
}
