const storage = require('duet-local-storage');
const vdom    = require('duet-virtual-dom');
const model   = require('./model');
const router  = require('./router');
const view    = require('./view');

module.exports = () => {
  const update = vdom('.todoapp', {isTarget: true});

  const send = model((params, state) => {
    update(view(state, send));

    if (!state.isInitLoad) {
      storage('todos-duet', JSON.stringify(state.todos));
    }
  });

  router(send);

  storage('todos-duet', (todos) => {
    send('load', {todos: JSON.parse(todos)});
  });
};
