// Todo Form
Skeleton.form({
	name: 'todo-form',
	inputs: {
		text: 'todo-input'
	},
	submit: {
		input: 'text',
		keyCode: 13 // Enter Key Code
	},
	onSubmit(e) {
		let text = this.text.value;
		if(!text) {
			return;
		}
		TodosList.push({ text }); // push and render todo
		Skeleton.form.clear(this.name); // clear form input
	}
});