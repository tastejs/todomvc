const htmlEscapes = {
	'&': '&amp',
	'<': '&lt',
	'>': '&gt',
	'"': '&quot',
	'\'': '&#x27',
	'`': '&#x60'
};

const reUnescapedHtml = /[&<>"'`]/g;
const reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

const escape = str => (str && reHasUnescapedHtml.test(str)) ? str.replace(reUnescapedHtml, escapeHtmlChar) : str;
const escapeHtmlChar = chr => htmlEscapes[chr];

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
		`;
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
		const view = data.map(d => {
			const template = this.defaultTemplate;
			const completed = d.completed ? 'completed' : '';
			const checked = d.completed ? 'checked' : '';

			return this.defaultTemplate
				.replace('{{id}}', d.id)
				.replace('{{title}}', escape(d.title))
				.replace('{{completed}}', completed)
				.replace('{{checked}}', checked);
		});

		return view.join('');
	}

	/**
	 * Displays a counter of how many to dos are left to complete
	 *
	 * @param {number} activeTodos The number of active todos.
	 * @returns {string} String containing the count
	 */
	itemCounter(activeTodos){
		const plural = activeTodos === 1 ? '' : 's';
		return `<strong>${activeTodos}</strong> item${plural} left`;
	}

	/**
	 * Updates the text within the "Clear completed" button
	 *
	 * @param  {[type]} completedTodos The number of completed todos.
	 * @returns {string} String containing the count
	 */
	clearCompletedButton(completedTodos){
		return (completedTodos > 0) ? 'Clear completed' : '';
	}
}
