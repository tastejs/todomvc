import {h, spec} from 'effector-dom';
import {toggled, removed} from './model';

// title и completed - сторы с конкретными значениями
export const TodoItem = ({title, completed, key}) => {
  h('li', () => {
    // новый наследуемый стор с классом по флагу
    spec({attr: {class: completed.map(flag => flag ? 'completed' : false)}});

    h('div', () => {
      spec({attr: {class: 'view'}});

      h('input', {
        attr: {class: 'toggle', type: 'checkbox', checked: completed},
        // новое событие с предустановкой параметров
        handler: {click: toggled.prepend(() => key)},
      });

      h('label', {text: title});

      h('button', {
        attr: {class: 'destroy'},
        // новое событие с предустановкой параметров
        handler: {click: removed.prepend(() => key)},
      });
    });
  });
};
