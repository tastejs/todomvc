import {a, button, div, footer, h1, header, input, li,
        section, span, strong, ul} from '@cycle/dom';

function renderHeader() {
  return header('.header', [
    h1('todos'),
    input('.new-todo', {
      props: {
        type: 'text',
        placeholder: 'What needs to be done?',
        autofocus: true,
        name: 'newTodo'
      },
      hook: {
        update: (oldVNode, {elm}) => {
          elm.value = '';
        },
      },
    })
  ]);
}

function renderMainSection(todosData) {
  let allCompleted = todosData.list.reduce((x, y) => x && y.completed, true);
  let sectionStyle = {'display': todosData.list.length ? '' : 'none'};

  return section('.main', {style: sectionStyle}, [
    input('.toggle-all', {
      props: {type: 'checkbox', checked: allCompleted},
    }),
    ul('.todo-list', todosData.list
      .filter(todosData.filterFn)
      .map(data => data.todoItem.DOM)
    )
  ]);
}

function renderFilterButton(todosData, filterTag, path, label) {
  return li([
    a({
      props: {href: path},
      class: {selected: todosData.filter === filterTag}
    }, label)
  ]);
}

function renderFooter(todosData) {
  let amountCompleted = todosData.list
    .filter(todoData => todoData.completed)
    .length;
  let amountActive = todosData.list.length - amountCompleted;
  let footerStyle = {'display': todosData.list.length ? '' : 'none'};

  return footer('.footer', {style: footerStyle}, [
    span('.todo-count', [
      strong(String(amountActive)),
      ' item' + (amountActive !== 1 ? 's' : '') + ' left'
    ]),
    ul('.filters', [
      renderFilterButton(todosData, '', '/', 'All'),
      renderFilterButton(todosData, 'active', '/active', 'Active'),
      renderFilterButton(todosData, 'completed', '/completed', 'Completed'),
    ]),
    (amountCompleted > 0 ?
      button('.clear-completed', 'Clear completed (' + amountCompleted + ')')
      : null
    )
  ])
}

// THE VIEW
// This function expects the stream of todosData
// from the model function and turns it into a
// virtual DOM stream that is then ultimately returned into
// the DOM sink in the index.js.
export default function view(todos$) {
  return todos$.map(todos =>
    div([
      renderHeader(),
      renderMainSection(todos),
      renderFooter(todos)
    ])
  );
};
