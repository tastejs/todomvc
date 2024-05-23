// a helper function for rendering the clear and complete actions
export function showClearCompletedAction($) {
  // grab the items state
  const { items } = $.get()
  const button = `
    <button data-clear-completed class="clear-completed">
      Clear completed
    </button>
  `
  // true, if there are are COMPLETED items
  const hasCompleteItems = items.some(x => x.completed)

  return hasCompleteItems ? button : ''
}

// adds a click event listener for when the clear completed action is performed
// the items state is then updated to contain only incomplete items
export function onClearCompletedAction($) {
  $.on(
    'click',
    '[data-clear-completed]',
    function clearCompleted() {
      const { items } = $.get()
      const onlyIncompleteItems = items.filter(x =>
        !x.completed
      )
      $.set({ items: onlyIncompleteItems })
    }
  )
}
