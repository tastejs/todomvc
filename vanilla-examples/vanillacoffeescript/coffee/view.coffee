###
View that abstracts away the browser's DOM completely.
It has two simple entry points:

  - bind(eventName, handler)
    Takes a todo application event and registers the handler
  - render(command, parameterObject)
    Renders the given command with the options
###
class View
    constructor: (@template) ->
        @.ENTER_KEY = 13
        @.ESCAPE_KEY = 27

        @.$todoList = $$ '#todo-list'
        @.$todoItemCounter = $$ '#todo-count'
        @.$clearCompleted = $$ '#clear-completed'
        @.$main = $$ '#main'
        @.$footer = $$ '#footer'
        @.$toggleAll = $$ '#toggle-all'
        @.$newTodo = $$ '#new-todo'

    _removeItem: (id) ->
        elem = $$ '[data-id="' + id + '"]'

        if elem
            @.$todoList.removeChild elem

    _clearCompletedButton: (completedCount, visible) ->
        @.$clearCompleted.innerHTML = this.template.clearCompletedButton completedCount
        @.$clearCompleted.style.display = if visible then 'block' else 'none'

    _setFilter: (currentPage) ->
        # Remove all other selected states. We loop through all of them in case the
        # UI gets in a funky state with two selected.
        $('#filters .selected').forEach (item) ->
            item.className = ''

        $('#filters [href="#/' + currentPage + '"]').forEach (item) ->
            item.className = 'selected'

    _elementComplete: (id, completed) ->
        listItem = $$ '[data-id="' + id + '"]'

        if !listItem
            return

        listItem.className = if completed then 'completed' else ''

        # In case it was toggled from an event and not by clicking the checkbox
        listItem.querySelector('input').checked = completed;

    _editItem: (id, title) ->
        listItem = $$ '[data-id="' + id + '"]'

        if !listItem
            return

        listItem.className = listItem.className + ' editing'

        input = document.createElement 'input'
        input.className = 'edit'

        listItem.appendChild input
        input.focus()
        input.value = title

    _editItemDone: (id, title) ->
        listItem = $$ '[data-id="' + id + '"]'

        if !listItem
            return

        input = listItem.querySelector 'input.edit'
        listItem.removeChild input

        listItem.className = listItem.className.replace 'editing', ''

        listItem.querySelectorAll('label').forEach (label) ->
            label.textContent = title

    render: (viewCmd, parameter) ->
        viewCommands =
                showEntries: () =>
                    @.$todoList.innerHTML = @.template.show parameter
                removeItem: () =>
                    @._removeItem parameter
                updateElementCount: () =>
                    @.$todoItemCounter.innerHTML = @.template.itemCounter parameter
                clearCompletedButton: () =>
                    @._clearCompletedButton parameter.completed, parameter.visible
                contentBlockVisibility: () =>
                    @.$main.style.display = if @.$footer.style.display = parameter.visible then 'block' else 'none'
                toggleAll: () =>
                    @.$toggleAll.checked = parameter.checked
                setFilter: () =>
                    @._setFilter parameter
                clearNewTodo: () =>
                    @.$newTodo.value = ''
                elementComplete: () =>
                    @._elementComplete parameter.id, parameter.completed
                editItem: () =>
                    @._editItem parameter.id, parameter.title
                editItemDone: () =>
                    @._editItemDone parameter.id, parameter.title

        viewCommands[viewCmd]()

    _itemIdForEvent: (e) ->
        element = e.target
        li = $parent element, 'li'
        id = li.dataset.id

        return id

    _bindItemEditDone: (handler) ->
        $live '#todo-list li .edit', 'blur', (e) =>
            input = e.target
            id = @._itemIdForEvent e

            if !input.dataset.iscanceled
                handler {
                    id: id
                    title: input.value
                }

        $live '#todo-list li .edit', 'keypress', (e) =>
            input = e.target;
            if e.keyCode == @.ENTER_KEY
                # Remove the cursor from the input when you hit enter just like if it
                # were a real form
                input.blur()

    _bindItemEditCancel: (handler) ->
        $live '#todo-list li .edit', 'keyup', (e) =>
            input = e.target;
            id = @._itemIdForEvent e

            if e.keyCode == @.ESCAPE_KEY

                input.dataset.iscanceled = true
                input.blur()

                handler {id: id}

    bind: (event, handler) ->
        if event == 'newTodo'
            @.$newTodo.addEventListener 'change', () =>
                handler @.$newTodo.value

        else if event == 'removeCompleted'
            @.$clearCompleted.addEventListener 'click', () =>
                handler()

        else if event == 'toggleAll'
            @.$toggleAll.addEventListener 'click', (e) =>
                input = e.target;
                handler {completed: input.checked}

        else if event == 'itemEdit'
            $live '#todo-list li label', 'dblclick', (e) =>
                id = @._itemIdForEvent e
                handler {id: id}

        else if event == 'itemRemove'
            $live '#todo-list .destroy', 'click', (e) =>
                id = @._itemIdForEvent e
                handler {id: id}

        else if event == 'itemToggle'
            $live '#todo-list .toggle', 'click', (e) =>
                input = e.target
                id = @._itemIdForEvent e
                handler {id: id, completed: input.checked}

        else if event == 'itemEditDone'
            @._bindItemEditDone handler

        else if event == 'itemEditCancel'
            @._bindItemEditCancel handler

window.app = window.app or {}
window.app.View = View