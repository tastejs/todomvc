export class TodoModel {
	completed = false;
	title = "";

	constructor(title){
		this.title = title.trim();
		this.completed = false;
	}
}
