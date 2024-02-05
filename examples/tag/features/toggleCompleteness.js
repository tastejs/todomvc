export function showCompletenessToggle($) {
  // grab the items state
  const { items } = $.get()

  // true, if there are are COMPLETED items
  const hasIncompleteItems = items.some(x => !x.completed)

  const checked = hasIncompleteItems
    ? ''
    : 'checked="true"'

  return `
    <input data-toggle-all ${checked} id="toggle-all" class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
  `
}

// adds a click event listener for when the complete all action is performed
// all items will be marked as completed in the items state
export function onCompletenessToggle($) {
  $.on(
    'change',
    '[data-toggle-all]',
    (event) => handler($, event)
  )
}

function handler($, event) {
  const { checked } = event.target
  const { items } = $.get()
  const markedItems = items.map(x => ({
    ...x,
    completed: checked
  }))

  $.set({ items: markedItems })
}
