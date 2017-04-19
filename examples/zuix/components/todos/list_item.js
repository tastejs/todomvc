zuix.controller(function (cp) {
	'use strict';

	var isChecked = false, description;

	cp.create = function () {
		description = cp.options().text;
		// register event handlers
		cp.field('description')
			.html(description)
			// edit start on double click
			.on('dblclick', function () {
				editBegin();
			});
		// edit mode end on blur or enter key
		cp.view().on('keydown', function (e) {
			if (e.which == 13) editEnd();
		});
		cp.field('edit').on('blur', function () {
			editEnd();
		});
		// toggle and remove buttons/events
		cp.field('toggle').on('click', function () {
			isChecked = this.checked();
			if (isChecked)
				cp.view().addClass('completed');
			else
				cp.view().removeClass('completed');
			// fire 'checked' event
			cp.trigger('checked', isChecked);
		});
		cp.field('remove').on('click', function () {
			// fire 'removed' event
			cp.trigger('removed');
		});
		// expose public methods
		cp.expose('checked', function () {
			return isChecked;
		});
	};

	cp.destroy = function () {
		cp.log.i('Element disposed... G\'bye!');
	};

	// private methods

	function editBegin() {
		cp.view().addClass('editing');
		var editField = cp.field('edit').get();
		editField.value = description;
		editField.focus();
	}

	function editEnd() {
		cp.view().removeClass('editing');
		description = cp.field('edit').get().value;
		if (description.trim().length == 0)
			cp.trigger('removed');
		else
			cp.field('description').html(description);
	}

});
