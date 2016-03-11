const {dom, modelFor} = require('duet');

module.exports = (state) => {
  const model = modelFor(state);
  const ids = Object.keys(state.todos);

  const selected = (filter) => state.filter === filter ? 'selected' : '';

  const clear = (model) => {
    ids.forEach((id) => {
      if (model.todos.get(id).completed) {
        model.todos['delete'](id);
      }
    });
  };

  const numCompleted = ids.reduce(function (sum, id) {
    return state.todos[id].completed ? sum + 1 : sum;
  }, 0);

  return dom`
    <footer class=${'footer' + (ids.length ? '' : ' hidden')}>
      <span class="todo-count"></span>
      <ul class="filters">
        <li><a class=${selected('all')} href="/#/">All</a></li>
        <li><a class=${selected('active')} href="/#/active">Active</a></li>
        <li><a class=${selected('completed')} href="/#/completed">Completed</a></li>
      </ul>
      <button
        class=${'clear-completed' + (numCompleted ? '' : ' hidden')}
        dataset=${{click: model.ev(clear)}}>Clear completed</button>
    </footer>
  `;
}
