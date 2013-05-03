/*jshint laxbreak:true */
(function (window) {
	'use strict';

	/**
	 * Sets up defaults for all the View methods such as a default template
	 *
	 * @constructor
	 */
	function View() {
		this.defaultTemplate
		=	'<li data-id="{{id}}" class="{{completed}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="destroy"></button>'
		+		'</div>'
		+	'</li>';
	}

	/**
	 * Creates an <li> HTML string and returns it for placement in your app.
	 *
	 * NOTE: In real life you should be using a templating engine such as Mustache
	 * or Handlebars, however, this is a vanilla JS example.
	 *
	 * @param {object} data The object containing keys you want to find in the
	 *                      template to replace.
	 * @returns {string} HTML String of an <li> element
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	View.prototype.show = function (data) {
		var i, l;
		var view = '';

		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';

			if (data[i].completed === 1) {
				completed = 'completed';
				checked = 'checked';
			}

			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', data[i].title);
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}

		return view;
	};

	/**
	 * Displays a counter of how many to dos are left to complete
	 *
	 * @param {number} activeTodos The number of active todos.
	 * @returns {string} String containing the count
	 */
	View.prototype.itemCounter = function (activeTodos) {
		var plural = activeTodos === 1 ? '' : 's';

		return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	};

	/**
	 * Updates the text within the "Clear completed" button
	 *
	 * @param  {[type]} completedTodos The number of completed todos.
	 * @returns {string} String containing the count
	 */
	View.prototype.clearCompletedButton = function (completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed (' + completedTodos + ')';
		} else {
			return '';
		}
	};

	// Export to window
	window.app.View = View;
})(window);
