import {button, div, input, label, li} from '@cycle/dom';

function view(state$) {
  return state$.map(({title, completed, editing}) => {
    let todoRootClasses = {
      completed,
      editing,
    };

    return li('.todoRoot', {class: todoRootClasses}, [
      div('.view', [
        input('.toggle', {
          props: {type: 'checkbox', checked: completed},
        }),
        label(title),
        button('.destroy')
      ]),
      input('.edit', {
        props: {type: 'text'},
        hook: {
          update: (oldVNode, {elm}) => {
            elm.value = title;
            if (editing) {
              elm.focus();
              elm.selectionStart = elm.value.length;
            }
          }
        }
      })
    ]);
  });
}

export default view;
