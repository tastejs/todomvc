import {IoElement} from "../node_modules/io/build/io.js";
import {TodoModel} from "./todo-model.js";
import "./todo-item.js";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TodoApp extends IoElement {
  static get properties() {
    return {
      model: TodoModel,
      route: String
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this.hashChange);
    this.hashChange();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.hashChange);
  }
  hashChange() {
    this.route = window.location.hash.replace('#/', '');
  }
  changed() {
    const itemCount = this.model.items.length;
    const activeLeft = this.model.getActiveCount();
    const completedCount = this.model.getCompletedCount();
    const allCompleted = itemCount === completedCount;

    const items = this.model.items.filter(this.model.filters[this.route]);

    this.template([
      ['section', {className: 'todoapp'}, [
        ['header', {className: 'header'}, [
          ['h1', 'todos'],
        ]],
        ['input', {id: 'input', className: 'new-todo', placeholder: 'What needs to be done?', 'on-keyup': this.onInputKey, autofocus: true}],
        ['section', {className: 'main'}, [
          ['input', {type: 'checkbox', className: 'toggle-all', checked: allCompleted, 'on-click': this.model.toggleItemsCompleted}],
          ['ul', {className: 'todo-list'}, [
            items.map((item, i) => ['todo-item', {item: item, model: this.model}])
          ]]
        ]],
        itemCount ? ['footer', {className: 'footer'}, [
          ['span', {className: 'todo-count'}, String(activeLeft) + (activeLeft === 1 ? ' item' : ' items') + ' left'],
          ['ul', {className: 'filters'}, [
            ['li', [['a', {'href': '#/', className: !this.route ? 'selected' : ''}, 'All']]],
            ['li', [['a', {'href': '#/active', className: this.route === 'active' ? 'selected' : ''}, 'Active']]],
            ['li', [['a', {'href': '#/completed', className: this.route === 'completed' ? 'selected' : ''}, 'Completed']]]
          ]],
          completedCount? ['button', {className: 'clear-completed', 'on-click': this.model.clearCompletedItems}, 'Clear completed'] : null
        ]] : null
      ]],
      ['footer', {className: 'info'}, [
        ['p', 'Double-click to edit a todo'],
        ['p', 'Created by Aki Rodić'],
        ['p', 'Part of TodoMVC'],
      ]]
    ]);
  }
  onInputKey(event) {
    if (event.which === ENTER_KEY) {
      this.model.newItem(this.$.input.value);
      this.$.input.value = '';
      this.$.input.focus();
    }
    if (event.which === ESCAPE_KEY) {
      this.$.input.value = '';
      this.$.input.focus();
    }
  }
}

TodoApp.Register();
