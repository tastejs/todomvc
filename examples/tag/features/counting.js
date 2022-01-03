// a render helper for returning the number of tasks remaining
export function showIncompleteCount($) {
  const { items } = $.get()
  const incomplete = items.filter(x => !x.completed)
  return `
    <span class="todo-count">
      ${incomplete.length} remaining
    </span>
  `
}
