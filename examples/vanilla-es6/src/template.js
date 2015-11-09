let htmlEscapes = {
	'&': '&amp',
	'<': '&lt',
	'>': '&gt',
	'"': '&quot',
	'\'': '&#x27',
	'`': '&#x60'
}

let escape = (str) => (str && reHasUnescapedHtml.test(str)) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str
let escapeHtmlChar = (chr) => htmlEscapes[chr]

var reUnescapedHtml = /[&<>"'`]/g,
	reHasUnescapedHtml = new RegExp(reUnescapedHtml.source)

export default class Template {
	constructor() {
		this.defaultTemplate = `
			<li data-id="{{id}}" class="{{completed}}">
				<div class="view">
					<input class="toggle" type="checkbox" {{checked}}>
					<label>{{title}}</label>
					<button class="destroy"></button>
				</div>
			</li>
		`
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
	show(data){
		var i
		var len = data.length
		var view = ''

		for (i = 0; i < len; i++) {
			var template = this.defaultTemplate
			var completed = ''
			var checked = ''

			if (data[i].completed) {
				completed = 'completed'
				checked = 'checked'
			}

			template = template.replace('{{id}}', data[i].id)
			template = template.replace('{{title}}', escape(data[i].title))
			template = template.replace('{{completed}}', completed)
			template = template.replace('{{checked}}', checked)

			view = view + template
		}

		return view
	}

	/**
	 * Displays a counter of how many to dos are left to complete
	 *
	 * @param {number} activeTodos The number of active todos.
	 * @returns {string} String containing the count
	 */
	itemCounter(activeTodos){
		var plural = activeTodos === 1 ? '' : 's'
		return `<strong>${activeTodos}</strong> item${plural} left`
	}

	/**
	 * Updates the text within the "Clear completed" button
	 *
	 * @param  {[type]} completedTodos The number of completed todos.
	 * @returns {string} String containing the count
	 */
	clearCompletedButton(completedTodos){
		return (completedTodos > 0) ? 'Clear completed' : ''
	}
}
