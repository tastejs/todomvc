const {dom, extend} = require('../utils');

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

module.exports = (state, send) => {
  const numActive = state.todos.filter((todo) => !todo.completed).length;

  const visibleTodos = state.todos.filter((todo) => {
    switch (state.filter) {
      case 'completed':
        return todo.completed;
      case 'active':
        return !todo.completed;
      default:
        return true;
    }
  });

  const Todo = (todo) => {
    return dom`
      <li class=${state.editing === todo.id ? 'editing' : ''} key=${'todo--' + todo.id}>
        <div class="view">
          <input type="checkbox"
            class="toggle"
            key=${'toggle--' + todo.id + (todo.completed ? '--checked' : '')}
            ${todo.completed ? 'checked' : ''}
            dataset=${{change: send.event('toggle', {id: todo.id})}} />
          <label dataset=${{dblclick: send.event('edit-start', {id: todo.id})}}>${todo.title}</label>
          <button class="destroy" dataset=${{click: send.event('remove', {id: todo.id})}}></button>
        </div>
        <input type="text"
          class="edit"
          name="title"
          value=${todo.title}
          dataset=${{
            keydown: (event, value) => {
              if (event.keyCode === ESCAPE_KEY) {
                return send('edit-end');
              }

              if (event.keyCode === ENTER_KEY) {
                send('update', {id: todo.id, title: value.title});
                send('edit-end');
              }
            },
            focusout: send.event('edit-end'),
            preventDefault: 'keydown'
          }}
          ${state.editing === todo.id ? 'autofocus' : ''} />
      </li>
    `;
  };

  return dom`
    <section class=${'main' + (visibleTodos.length ? '' : ' hidden')}>
      <input type="checkbox"
        class="toggle-all"
        key=${'toggle-all' + (numActive === 0 ? '--checked' : '')}
        ${numActive === 0 ? 'checked' : ''}
        dataset=${{change: send.event('toggle-visible')}} />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        ${visibleTodos.map(Todo)}
      </ul>
    </section>
  `;
};
