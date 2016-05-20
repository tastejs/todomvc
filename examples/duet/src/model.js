const sendAction = require('send-action');
const {uuid}     = require('./utils');

module.exports = (onchange) => {
  const send = sendAction({
    onaction: (params, state, send) => {
      if (state.isInitLoad) {
        state.isInitLoad = false;
      }

      switch (params.type) {
        case 'load':
          state.todos = params.todos || [];
          state.isInitLoad = true;
          break;
        case 'filter':
          state.filter = params.filter;
          break;
        case 'create':
          state.todos.unshift({id: uuid(), title: params.title, completed: false});
          state.newTodo = '';
          break;
        case 'edit-start':
          state.editing = params.id;
          break;
        case 'edit-end':
          state.editing = null;
          break;
        case 'update':
          state.todos = state.todos.map((todo) => {
            if (todo.id === params.id) {
              todo.title = params.title;
            };

            return todo;
          });
          break;
        case 'toggle':
          state.todos = state.todos.map((todo) => {
            if (todo.id === params.id) {
              todo.completed = !todo.completed;
            };

            return todo;
          });
          break;
        case 'toggle-visible':
          let active = state.todos.filter((todo) => !todo.completed);
          state.todos.forEach((todo) => { todo.completed = active.length > 0; });
          break;
        case 'remove':
          state.todos = state.todos.filter((todo) => todo.id !== params.id);
          break;
        case 'remove-completed':
          state.todos = state.todos.filter((todo) => !todo.completed);
          break;
        default:
          break;
      }

      return state;
    },
    onchange: onchange,
    state: {
      isInitLoad: false,
      todos: [],
      newTodo: '',
      editing: null,
      filter: 'all'
    }
  });

  return send;
}
