Template.todo.onCreated(function () {
	// 'this' refers to the template instance within onCreated() and onRendered()
	this.editing = new ReactiveVar(false);
	this.previousText = new ReactiveVar(null);
});

// When the edit field is shown, set focus to the input and move the cursor
// to the end
Template.todoEdit.onRendered(function () {
	var inputField = this.find('input');
	var inputLength = inputField.value.length;

	inputField.focus();
	inputField.setSelectionRange(inputLength, inputLength);
})

Template.todo.events({
	'click input.toggle': function () {
		Todos.update(this._id, {$set: {completed: !this.completed}});
	},

	'dblclick label': function (event, template) {
		template.editing.set(true);
		template.previousText.set($(event.target).text());
	},

	'click button.destroy': function () {
		Todos.remove(this._id);
	},

	'keyup li.editing input.edit, focusout li.editing input.edit': function (event,
		template) {
		if ((event.type === 'keyup' && event.which === 13) ||
			event.type === 'focusout') {
			// save
			Todos.update(this._id, {$set: {title: event.target.value.trim()}});
			template.editing.set(false);
		} else if (event.type === 'keyup' && event.which === 27) {
			// cancel
			template.editing.set(false);
			event.target.value = template.previousText.get();
		}
	}
});

/*
 * Defining your own helpers here will allow you to call them in templates via
 * the syntax {{helperName}}. You can also supply arguments, e.g.
 * {{helperName 'hello'}}.
 */
Template.todo.helpers({
	todoCompleted: function () {
		return this.completed;
	},

	todoEditing: function () {
		// in a helper, use Template.instance() to refer to this template instance
		return Template.instance().editing.get();
	}
});
