import {h, spec} from 'effector-dom';
import {createEvent, createStore, forward, sample} from 'effector';
import {Title} from './title';
import {appended} from './model';

export const Header = () => {
  h('header', () => {
    Title();

    h('input', () => {
      const keypress = createEvent();
      const input = createEvent();

      // создадим фильтруемое событие,
      const submit = keypress.filter({fn: e => e.key === 'Enter'});

      // стор с текущим значением инпута
      const $value = createStore('')
        .on(input, (_, e) => e.target.value)
        .reset(appended); // заодно очистим при отправке

      // для перенаправления события в другое в эффекторе есть forward({from, to})
      forward({
        // возьмем текущее значение $value по триггеру submit,
        // и сразу сделаем фильтрацию для проверки значения
        from: sample($value, submit).filter({fn: Boolean}),
        to: appended,
      });

      spec({
        attr: {
          class: "new-todo",
          placeholder: 'What needs to be done?',
          value: $value
        },
        handler: {keypress, input},
      })
    });
  });
};
