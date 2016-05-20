const {dom} = require('../utils');

const ENTER_KEY = 13;

module.exports = (state, send) => {
  return dom`
    <header class="header">
      <h1>todos</h1>
      <input type="text"
        class="new-todo"
        name="new-todo"
        value=${state.newTodo}
        dataset=${{
          keydown: (event, value) => {
            if (event.keyCode !== ENTER_KEY) {
              return;
            }

            let title = value['new-todo'].trim();

            if (title) {
              send('create', {title: title})
            }
          },
          preventDefault: 'keydown'
        }}
        placeholder="What needs to be done?"
        ${state.isInitLoad ? 'autofocus' : ''} />
    </header>
  `;
};
