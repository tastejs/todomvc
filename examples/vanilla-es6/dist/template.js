'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var htmlEscapes = {
	'&': '&amp',
	'<': '&lt',
	'>': '&gt',
	'"': '&quot',
	'\'': '&#x27',
	'`': '&#x60'
};

var reUnescapedHtml = /[&<>"'`]/g;
var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

var escape = function escape(str) {
	return str && reHasUnescapedHtml.test(str) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str;
};
var escapeHtmlChar = function escapeHtmlChar(chr) {
	return htmlEscapes[chr];
};

var Template = function () {
	function Template() {
		_classCallCheck(this, Template);

		this.defaultTemplate = '\n\t\t\t<li data-id="{{id}}" class="{{completed}}">\n\t\t\t\t<div class="view">\n\t\t\t\t\t<input class="toggle" type="checkbox" {{checked}}>\n\t\t\t\t\t<label>{{title}}</label>\n\t\t\t\t\t<button class="destroy"></button>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t';
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
 	 * })
  */

	_createClass(Template, [{
		key: 'show',
		value: function show(data) {
			var _this = this;

			var view = data.map(function (d) {
				var template = _this.defaultTemplate;
				var completed = d.completed ? 'completed' : '';
				var checked = d.completed ? 'checked' : '';

				return _this.defaultTemplate.replace('{{id}}', d.id).replace('{{title}}', escape(d.title)).replace('{{completed}}', completed).replace('{{checked}}', checked);
			});

			return view.join('');
		}

		/**
   * Displays a counter of how many to dos are left to complete
   *
   * @param {number} activeTodos The number of active todos.
   * @returns {string} String containing the count
   */

	}, {
		key: 'itemCounter',
		value: function itemCounter(activeTodos) {
			var plural = activeTodos === 1 ? '' : 's';
			return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
		}

		/**
   * Updates the text within the "Clear completed" button
   *
   * @param  {[type]} completedTodos The number of completed todos.
   * @returns {string} String containing the count
   */

	}, {
		key: 'clearCompletedButton',
		value: function clearCompletedButton(completedTodos) {
			return completedTodos > 0 ? 'Clear completed' : '';
		}
	}]);

	return Template;
}();

exports.default = Template;