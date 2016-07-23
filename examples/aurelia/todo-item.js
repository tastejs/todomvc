const ENTER_KEY = 13;
const ESC_KEY = 27;

export class TodoItem {
	constructor(title) {
		this.isCompleted = false;
		this.isEditing = false;
		this.title = title.trim();
		this.editTitle = null;
	}

	labelDoubleClicked() {
		this.editTitle = this.title;
		this.isEditing = true;
	}

	finishEditing() {
		this.title = this.editTitle.trim();
		this.isEditing = false;
	}

	onKeyUp(ev) {
		if (ev.keyCode === ENTER_KEY) {
			return this.finishEditing();
		}
		if (ev.keyCode === ESC_KEY) {
			this.editTitle = this.title;
			this.isEditing = false;
		}
	}
}
