zuix.controller(function (cp) {
	'use strict';

	var toggle;
	var item;
	var cancelEdit = false;

	cp.create = function () {
		item = cp.options().data;
		// register event handlers
		cp.field('description')
			.html(item.text)
			// edit start on double click
			.on('dblclick', function () {
				editBegin();
			});
		// edit mode end on blur or enter key
		cp.view().on('keydown', function (e) {
			switch (e.which) {
				case 13:
					editEnd();
					break;
				case 27:
					cancelEdit = true;
					editEnd();
					break;
			}
		});
		cp.field('edit').on('blur', function () {
			editEnd();
		});
		// toggle and remove buttons/events
		toggle = cp.field('toggle').on('click', function () {
			item.checked = toggle.checked();
			updateChecked();
			// fire 'checked' event
			cp.trigger('checked', item.checked);
		}).checked(item.checked);
		cp.field('remove').on('click', function () {
			// fire 'removed' event
			cp.trigger('removed');
		});
		// expose public methods
		cp.expose('checked', function (check) {
			if (check == null) {
				return item.checked;
			}
			item.checked = check;
			toggle.checked(check);
			updateChecked();
		});
		updateChecked();
	};

	cp.destroy = function () {
		cp.log.i('Element disposed... G\'bye!');
	};

	// private methods

	function updateChecked() {
		if (item.checked) {
			cp.view().addClass('completed');
		} else {
			cp.view().removeClass('completed');
		}
	}

	function editBegin() {
		cancelEdit = false;
		cp.view().addClass('editing');
		var editField = cp.field('edit').get();
		editField.value = item.text;
		editField.focus();
	}

	function editEnd() {
		cp.view().removeClass('editing');
		if (!cancelEdit) {
			item.text = cp.field('edit').get().value;
			if (item.text.trim().length == 0) {
				cp.trigger('removed');
			} else {
				cp.field('description').html(item.text);
			}
		}
	}

});

