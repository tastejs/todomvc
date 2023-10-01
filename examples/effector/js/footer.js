import {h, spec} from 'effector-dom';
import {$todos, $activeFilter, filtered, completedRemoved} from './model';

export const Footer = () => {
  h('footer', () => {
    spec({attr: {class: 'footer'}});

    h('span', () => { // Каунтер активных задач
      spec({attr: {class: 'todo-count'}});

      const $activeCount = $todos.map(
        todos => todos.filter(todo => !todo.completed).length
      );

      h('strong', {text: $activeCount});
      h('span', {text: $activeCount.map(count => count === 1
        ? ' item left'
        : ' items left'
      )});
    });

    h('ul', () => { // кнопки фильтров, ничего нового
      spec({attr: {class: 'filters'}});

      h('li', () => {
        h('a', {
          attr: {class: $activeFilter.map(active => active === null
            ? 'selected'
            : false
          )},
          text: 'All',
          handler: {click: filtered.prepend(() => null)},
        });
      });

      h('li', () => {
        h('a', {
          attr: {class: $activeFilter.map(completed => completed === false
            ? 'selected'
            : false
          )},
          text: 'Active',
          handler: {click: filtered.prepend(() => false)},
        });
      });

      h('li', () => {
        h('a', {
          attr: {class: $activeFilter.map(completed => completed === true
            ? 'selected'
            : false
          )},
          text: 'Completed',
          handler: {click: filtered.prepend(() => true)},
        });
      });
    });

    h('button', {
      attr: {class: 'clear-completed'},
      text: 'Clear completed',
      handler: {click: completedRemoved},
    });
  });
};
