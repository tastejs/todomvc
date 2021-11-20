import {h, spec, using} from 'effector-dom';
import {Header} from './header';
import {Main} from './main';
import {Footer} from './footer';

export const App = () => {
  // создадим section элемент
  h('section', () => {
    // и укажем ему класс
    spec({attr: {class: 'todoapp'}});

    // также выведем остальные части приложения
    Header();
    Main();
    Footer();
  });
};

using(document.body, () => {
  App();
});
