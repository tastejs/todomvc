zuix.controller(function (cp) {
	'use strict';

	var toggle;
	var isChecked = false;
	var description;

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
			if (e.which == 13) {
				editEnd();
			}
		});
		cp.field('edit').on('blur', function () {
			editEnd();
		});
		// toggle and remove buttons/events
		toggle = cp.field('toggle').on('click', function () {
			updateChecked();
			// fire 'checked' event
			cp.trigger('checked', toggle.checked());
		});
		cp.field('remove').on('click', function () {
			// fire 'removed' event
			cp.trigger('removed');
		});
		// expose public methods
		cp.expose('checked', function (check) {
			if (check == null) {
				return toggle.checked();
			}
			toggle.checked(check);
			updateChecked();
		});
	};

	cp.destroy = function () {
		cp.log.i('Element disposed... G\'bye!');
	};

	// private methods

	function updateChecked() {
		if (toggle.checked()) {
			cp.view().addClass('completed');
		} else {
			cp.view().removeClass('completed');
		}
	}

	function editBegin() {
		cp.view().addClass('editing');
		var editField = cp.field('edit').get();
		editField.value = description;
		editField.focus();
	}

	function editEnd() {
		cp.view().removeClass('editing');
		description = cp.field('edit').get().value;
		if (description.trim().length == 0) {
			cp.trigger('removed');
		} else {
			cp.field('description').html(description);
		}
	}

});

