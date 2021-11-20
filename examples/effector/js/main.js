// src/view/main.js
import {h, spec, list} from 'effector-dom';
import {TodoItem} from './todoItem';
import {$filteredTodos, allCompleted, $isAllCompleted} from './model';

export const Main = (a) => {
  h('section', () => {
    spec({attr: {class: 'main'}});

    // выбор всех задач
    h('input', {
      attr: {id: 'toggle-all', class: 'toggle-all', type: 'checkbox', checked: $isAllCompleted},
	  handler: {change: allCompleted}
    });
    h('label', {attr: {for: 'toggle-all'}});

    // список задач
    h('ul', () => {
      spec({attr: {class: "todo-list"}});
      list({
        source: $filteredTodos,
        key: 'title',
        fields: ['title', 'completed']
        // в fields окажутся сторы с их значениям
      }, ({fields: [title, completed], key}) => TodoItem({title, completed, key}));
    });
  });
};
