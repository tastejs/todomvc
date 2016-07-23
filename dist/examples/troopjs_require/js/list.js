define([
	'./component',
	'troopjs-hub/emitter',
	'jquery',
	'poly/array',
	'poly/string',
	'poly/json'
], function (Component, hub, $) {
	'use strict';

	/**
	 * Component for the `.todo-list` list
	 */

	var ENTER_KEY = 13;
	var ESC_KEY = 27;
	var STORAGE = window.localStorage;

	/**
	 * Generates `tasks` JSON from HTML and triggers `todos/change` on `hub`
	 * @private
	 */
	function update() {
		var tasks = this.$element
			// Find all `li` `.children`
			.children('li')
			// `.map` to JSON
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
			// Get underlying Array
			.get();

		// Emit `todos/change` with the new `tasks` on `hub`
		return hub.emit('todos/change', tasks);
	}

	return Component.extend({
		/**
		 * SIG `start` handler.
		 * Called when this component is started
		 */
		'sig/start': function () {
			// Get previously stored tasks from `STORAGE` under the key `todos-troopjs`
			var storage = STORAGE.getItem('todos-troopjs');

			// Emit `todos/change` with deserialized tasks or `[]` on `hub`
			return hub.emit('todos/change', storage !== null ? JSON.parse(storage) : []);
		},

		/**
		 * HUB `todos/change` handler (memorized).
		 * Called whenever the task list is updated
		 * @param {Array} tasks Updated task array
		 */
		'hub/todos/change(true)': function (tasks) {
			var $element = this.$element;
			// Get template HTML
			var template = $element
				.find('script[type="text/x-html-template"]')
				.text();

			$element
				// `.remove` all `li` `.children`
				.children('li')
				.remove()
				.end()
				// `.append` the output from `tasks.map`
				.append(tasks.map(function (task) {
					var title = task.title;
					var completed = task.completed;

					// Create template element and populate
					return $(template)
						.addClass(completed ? 'completed' : 'active')
						.find('.toggle')
						.prop('checked', completed)
						.end()
						.find('label')
						.text(title)
						.end();
				}));

			// Serialize `tasks` to JSON and store in `STORAGE` under the key `todos-troopjs`
			STORAGE.setItem('todos-troopjs', JSON.stringify(tasks));
		},

		/**
		 * HUB `todos/add` handler.
		 * Called when a new task is created
		 * @param {String} title Task title
		 */
		'hub/todos/add': function (title) {
			var $element = this.$element;
			// Get template HTML
			var template = $element
				.find('script[type="text/x-html-template"]')
				.text();

			// Create template element, populate and `.appendTo` `$element`
			$(template)
				.addClass('active')
				.find('label')
				.text(title)
				.end()
				.appendTo($element);

			// Call `update`, yield `void 0` to not mutate arguments for next handler
			return update.call(this)
				.yield(void 0);
		},

		/**
		 * HUB `todos/complete` handler.
		 * Called whenever all tasks change their `completed` state in bulk
		 * @param {Boolean} toggle Completed state
		 */
		'hub/todos/complete': function (toggle) {
			// Find all `.toggle` elements, set `checked` property to `toggle`, trigger `change` DOM event
			this.$element
				.find('.toggle')
				.prop('checked', toggle)
				.change();

			// Call `update`, yield `void 0` to not mutate arguments for next handler
			return update.call(this)
				.yield(void 0);
		},

		/**
		 * HUB `todos/clear` handler.
		 * Called whenever all completed tasks should be cleared
		 */
		'hub/todos/clear': function () {
			// Find `.destroy` elements that are a descendants of `li:has(.toggle:checked)`, trigger `click` DOM event
			this.$element
				.find('li:has(.toggle:checked) .destroy')
				.click();
		},

		/**
		 * HUB `todos/filter` handler.
		 * Called whenever the task list filter is updated
		 * @param {String} filter New filter
		 */
		'hub/todos/filter(true)': function (filter) {
			var $element = this.$element;

			// Toggle CSS classes depending on `filter`
			$element
				.toggleClass('filter-completed', filter === '/completed')
				.toggleClass('filter-active', filter === '/active');
		},

		/**
		 * DOM `change` handler (delegate filter `.toggle`)
		 * Called when "task completed" checkbox is toggled
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/change(.toggle)': function ($event) {
			var $target = $($event.target);
			var toggle = $target.prop('checked');

			// Toggle CSS classes depending on `toggle`
			$target
				.closest('li')
				.toggleClass('completed', toggle)
				.toggleClass('active', !toggle);

			// Call `update`
			update.call(this);
		},

		/**
		 * DOM `click` handler (delegate filter `.destroy`)
		 * Called whenever "task destroy" is clicked
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/click(.destroy)': function ($event) {
			// `.remove` `.closest` `li`
			$($event.target)
				.closest('li')
				.remove();

			// Call `update`
			update.call(this);
		},

		/**
		 * DOM `dblclick` handler (delegate filter `label`)
		 * Called whenever "task title" is edited
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/dblclick(label)': function ($event) {
			var $target = $($event.target);

			$target
				// Add class `editing` to `.closest` `li`,
				.closest('li')
				.addClass('editing')
				// `.find` `.edit` and update `.val` with `$target.text()`,
				.find('.edit')
				.val($target.text())
				// `.focus` to trigger DOM event
				.focus();
		},

		/**
		 * DOM `keyup` handler (delegate filter `.edit`)
		 * Called each time a key is released while editing "task title"
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/keyup(.edit)': function ($event) {
			var $target = $($event.target);

			switch ($event.keyCode) {
				case ESC_KEY:
					// Restore "task title" `.val` from `label`
					$target.val(function () {
						return $(this)
							.closest('li')
							.find('label')
							.text();
					});
				// falls through

				case ENTER_KEY:
					// Trigger `focusout` DOM event
					$target.focusout();
					break;
			}
		},

		/**
		 * DOM `focusout` handler (delegate filter `.edit`)
		 * Called when focus is removed while editing "task title"
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/focusout(.edit)': function ($event) {
			// `.removeClass` `editing` from `.closest` `li`
			$($event.target)
				.closest('li')
				.removeClass('editing');
		},

		/**
		 * DOM `change` handler (delegate filter `.edit`)
		 * Called when "task title" is changed
		 * @param {Object} $event jQuery-like `$.Event` object
		 */
		'dom/change(.edit)': function ($event) {
			var $target = $($event.target);
			// Get and `.trim` `.val`
			var title = $target
				.val()
				.trim();

			// If `title` is _not_ empty ...
			if (title !== '') {
				// Update `val` with trimmed `title`, update `.closest` `li` descendant `label` `.text` with `title`
				$target
					.val(title)
					.closest('li')
					.find('label')
					.text(title);

				// Call `update`
				update.call(this);
			// ... otherwise
			} else {
				// Find `.closest` `li` ascendant, `.find` `.destroy`, trigger `click` DOM event
				$target
					.closest('li')
					.find('.destroy')
					.click();
			}
		}
	});
});
