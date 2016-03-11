const {model, value, varhash} = require('duet');
const {store}                 = require('./utils');

const Todo = ({title, completed}, key) => {
  return {
    title,
    completed
  };
};

module.exports = (stored) => {
  const todos = stored != null && typeof stored === 'object' && stored || {};

  const appModel = model({
    isInitLoad: value(true),
    todos: varhash(todos, Todo),
    newTodo: value(''),
    editing: value(null),
    filter: value('all')
  });

  const initLoad = appModel(function (state) {
    if (state.isInitLoad) {
      initLoad();
      appModel.isInitLoad.set(false);
    }
  });

  appModel.todos((todosState) => {
    store('todos-duet', todosState);
  });

  return appModel;
};
