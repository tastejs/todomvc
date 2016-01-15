import Controller from './controller';
import * as helpers from './helpers';
import Template from './template';
import Store from './store';
import Model from './model';
import View from './view';

const $on = helpers.$on;
const setView = () => todo.controller.setView(document.location.hash);

class Todo {
	/**
	 * Init new Todo List
	 * @param  {string} The name of your list
	 */
	constructor(name) {
		this.storage = new Store(name);
		this.model = new Model(this.storage);

		this.template = new Template();
		this.view = new View(this.template);

		this.controller = new Controller(this.model, this.view);
	}
}

const todo = new Todo('todos-vanillajs');

$on(window, 'load', setView);
$on(window, 'hashchange', setView);
