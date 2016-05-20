const vdom      = require('duet/bridges/virtual-dom');
const model     = require('./model');
const router    = require('./router');
const view      = require('./view');
const {storage} = require('./utils');

module.exports = () => {
  const update = vdom('.todoapp');

  const send = model((params, state, oldState) => {
    update(view(state, send));

    if (!state.isInitLoad) {
      storage('todos-duet', state.todos);
    }
  });

  router(send);

  storage('todos-duet', (todos) => {
    send('load', {todos: todos});
  });
};
