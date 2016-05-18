const vdom         = require('duet/bridges/virtual-dom');
const createModel  = require('./model');
const createRouter = require('./router');
const view         = require('./view');
const {store}      = require('./utils');

module.exports = () => {
  store('todos-duet', (stored) => {
    const model = createModel(stored);
    const update = vdom('.todoapp', view(model()));

    model((state) => update(view(state)));
    createRouter(model);
  });
};
