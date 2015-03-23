define([
	'./component',
	'troopjs-hub/emitter',
	'jquery',
	'poly/array',
	'poly/string',
	'poly/json'
], function (Component, hub, $) {
	'use strict';

	var ENTER_KEY = 13;
	var ESC_KEY = 27;
	var STORAGE = window.localStorage;

	function update() {
		var tasks = this.$element
			.children('li')
			.map(function (index, task) {
				var $task = $(task);

				return {
					title: $task
						.find('label')
						.text(),
					completed: $task
						.find('.toggle')
						.prop('checked')
				};
			})
			.get();

		return hub.emit('todos/change', tasks);
	}

	return Component.extend({
		'sig/start': function () {
			var storage = STORAGE.getItem('todos-troopjs');

			return hub.emit('todos/change', storage !== null ? JSON.parse(storage) : []);
		},

		'hub/todos/change(true)': function (tasks) {
			var $element = this.$element;
			var template = $element
				.find('script[type="text/x-html-template"]')
				.text();

			$element
				.children('li')
				.remove()
				.end()
				.append(tasks.map(function (task) {
					var title = task.title;
					var completed = task.completed;

					return $(template)
						.addClass(completed ? 'completed' : 'active')
						.find('.toggle')
						.prop('checked', completed)
						.end()
						.find('label')
						.text(title)
						.end();
				}));

			STORAGE.setItem('todos-troopjs', JSON.stringify(tasks));
		},

		'hub/todos/add': function (title) {
			var $element = this.$element;
			var template = $element
				.find('script[type="text/x-html-template"]')
				.text();

			$(template)
				.addClass('active')
				.find('label')
				.text(title)
				.end()
				.appendTo($element);

			return update.call(this)
				.yield(void 0);
		},

		'hub/todos/complete': function (toggle) {
			this.$element
				.find('.toggle')
				.prop('checked', toggle)
				.change();

			return update.call(this)
				.yield(void 0);
		},

		'hub/todos/clear': function () {
			this.$element
				.find('li:has(.toggle:checked) .destroy')
				.click();
		},

		'hub/todos/filter(true)': function (filter) {
			var $element = this.$element;

			$element
				.toggleClass('filter-completed', filter === '/completed')
				.toggleClass('filter-active', filter === '/active');
		},

		'dom/change(.toggle)': function ($event) {
			var $target = $($event.target);
			var toggle = $target.prop('checked');

			$target
				.closest('li')
				.toggleClass('completed', toggle)
				.toggleClass('active', !toggle);

			update.call(this);
		},

		'dom/click(.destroy)': function ($event) {
			$($event.target)
				.closest('li')
				.remove();

			update.call(this);
		},

		'dom/dblclick(label)': function ($event) {
			var $target = $($event.target);

			$target
				.closest('li')
				.addClass('editing')
				.find('.edit')
				.val($target.text())
				.focus();
		},

		'dom/keyup(.edit)': function ($event) {
			var $target = $($event.target);

			switch ($event.keyCode) {
				case ESC_KEY:
					$target.val(function () {
						return $(this)
							.closest('li')
							.find('label')
							.text();
					});
				// falls through

				case ENTER_KEY:
					$target.focusout();
					break;
			}
		},

		'dom/focusout(.edit)': function ($event) {
			$($event.target)
				.closest('li')
				.removeClass('editing');
		},

		'dom/change(.edit)': function ($event) {
			var $target = $($event.target);
			var title = $target
				.val()
				.trim();

			if (title !== '') {
				$target
					.val(title)
					.closest('li')
					.find('label')
					.text(title);

				update.call(this);
			} else {
				$target
					.closest('li')
					.find('.destroy')
					.click();
			}
		}
	});
});
