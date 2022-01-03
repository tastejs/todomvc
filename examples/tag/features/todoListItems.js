const ENTER_KEY = 13

// a render helper for returning a create task form
export function showNewItemForm(_$) {
  return `
    <input data-new-item-input class="new-todo" placeholder="What needs to be done?" autofocus>
  `
}

// adds a submit event listener for the form
export function onNewItemInput($) {
  function newItemHandler($, event) {
    const input = event.target

    if (event.which === ENTER_KEY) {
      // if the input is valid, create a new item and clear the field
      if(validate(input)) {
        createNewTodoItem($, input.value.trim())
        input.value = ''
      }
    }
  }

  $.on(
    'keypress',
    '[data-new-item-input]',
    function (event) { newItemHandler($, event) }
  )
}

// add a keypress event listener for updating an item
export function onItemEdit($) {
  function editItemHandler($, event) {
    const id = event.target.dataset.editId
    const item = findItemById.call($, id)

    updateItem($, {
      ...item,
      editing: true,
    })
  }

  $.on(
    'dblclick',
    '[data-edit-id]',
    (event) => editItemHandler($, event)
  )
}
// add a keypress event listener for updating an item
export function onItemChange($) {
  function changeItemHandler($, event) {
    const id = event.target.dataset.changeId
    const { value } = event.target
    const item = findItemById.call($, id)

    updateItem($, {
      ...item,
      editing: false,
      task: value
    })
  }

  $.on(
    'keypress',
    '[data-change-id]',
    (event) => {
      if (event.which === ENTER_KEY) {
        changeItemHandler($, event)
      }
    }
  )

  $.on(
    'blur',
    '[data-change-id]',
    (event) => changeItemHandler($, event)
  )
}

// add a click event listener for toggling a task's completeness
export function onItemToggle($) {
  function toggleItemHandler($, event) {
    // get the id of the toggled task and locate the corresponding item in state
    const id = event.target.dataset.toggleId
    const item = findItemById.call($, id)

    // calls a helper function to update the items state for this updated item
    updateItem($, {
      ...item,
      completed: !item.completed
    })
  }

  $.on(
    'click',
    '[data-toggle-id]',
    (event) => toggleItemHandler($, event)
  )
}

// add a click event listener for removing an item from items state
export function onItemDelete($) {
  function deleteItemHandler($, event) {
    const id = event.target.dataset.deleteId
    const item = findItemById.call($, id)

    // calls a helper function to delete this item from the items state
    deleteItem($, item)
  }

  $.on(
    'click',
    '[data-delete-id]',
    (event) => deleteItemHandler($, event)
  )
}

// a quick check to see if the value is not empty
function validate({ value }) { return !!value }

// a helper function to locate an item by an id
function findItemById(id) {
  const { items } = this.get()
  return items.find(x => x.id === id)
}

// a helper function to add an item to the items state
function createNewTodoItem($, task) {
  // build a new item, with a random id for collision-free duplicates
  const item = {
    task,
    completed: false,
    editing: false,
    id: task +  Math.floor((Math.random() * 100) + 1)
  }

  // a helper function for appending an item into the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items,
        payload
      ]
    }
  }

  // add the new item to the items state
  $.set(item, handler)
}

// a helper function to update the items state for an item
function updateItem($, item) {
  // a helper function for merging an item with updates in the items state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.map((item) => {
          if(item.id !== payload.id) {
            return item
          }

          return {
            ...item,
            ...payload
          }
        })
      ]
    }
  }

  // update the item in the item state
  $.set(item, handler)
}

// a helper function to remove an item from the items state
function deleteItem($, item) {
  // a helper function for filtering the current item out of the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.filter((item) => {
          if(item.id !== payload.id) {
            return item
          }
        })
      ]
    }
  }

  // remove the item from the item state
  $.set(item, handler)
}
