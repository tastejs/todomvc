const {dom} = require('../utils');

module.exports = (state, send) => {
  const completed = state.todos.filter((todo) => todo.completed);
  const numActive = state.todos.length - completed.length;

  const selected = (filter) => state.filter === filter ? 'selected' : '';

  return dom`
    <footer class=${'footer' + (state.todos.length ? '' : ' hidden')}>
      <span class="todo-count"><strong>${numActive}</strong> item${numActive !== 1 ? 's' : ''} left</span>
      <ul class="filters">
        <li><a class=${selected('all')} href="#/">All</a></li>
        <li><a class=${selected('active')} href="#/active">Active</a></li>
        <li><a class=${selected('completed')} href="#/completed">Completed</a></li>
      </ul>
      <button
        class=${'clear-completed' + (completed.length ? '' : ' hidden')}
        dataset=${{click: send.event('remove-completed')}}>Clear completed</button>
    </footer>
  `;
}
