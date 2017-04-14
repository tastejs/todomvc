###
Takes a model and view and acts as the controller between them

@constructor
@param {object} model The model instance
@param {object} view The view instance
###
class Controller
    constructor: (@model, @view) ->
        @view.bind 'newTodo', (title) =>
            @addItem title

        @view.bind 'itemEdit', (item) =>
            @editItem item.id

        @view.bind 'itemEditDone', (item) =>
            @editItemSave item.id, item.title

        @view.bind 'itemEditCancel', (item) =>
            @editItemCancel item.id

        @view.bind 'itemRemove', (item) =>
            @removeItem item.id

        @view.bind 'itemToggle', (item) =>
            @toggleComplete item.id, item.completed

        @view.bind 'removeCompleted', () =>
            @removeCompletedItems()

        @view.bind 'toggleAll', (status) =>
            @toggleAll status.completed

    ###
    Loads and initialises the view

    @param {string} '' | 'active' | 'completed'
    ###
    setView: (locationHash) ->
        route = locationHash.split('/')[1]
        page = route || '';
        @_updateFilterState page

    ###
    An event to fire on load. Will get all items and display them in the
    todo-list
    ###
    showAll: () ->
        @model.read (data) =>
            @view.render 'showEntries', data

    ###
    Renders all active tasks
    ###
    showActive: () ->
        @model.read { completed: false }, (data) =>
            @view.render 'showEntries', data

    ###
    Renders all completed tasks
    ###
    showCompleted: () ->
        @model.read { completed: true }, (data) =>
            @view.render 'showEntries', data

    ###
    An event to fire whenever you want to add an item. Simply pass in the event
    object and it'll handle the DOM insertion and saving of the new item.
    ###
    addItem: (title) ->
        if title.trim() == ''
            return

        @model.create title, () =>
            @view.render 'clearNewTodo'
            @_filter true

    ###
    Triggers the item editing mode.
    ###
    editItem: (id) ->
        @model.read id, (data) =>
            @view.render 'editItem', {id: id, title: data[0].title}
    ###
    Finishes the item editing mode successfully.
    ###
    editItemSave: (id, title) ->
        if title.trim()
            @model.update id, {title: title}, () =>
                @view.render 'editItemDone', {id: id, title: title}
        else
            @removeItem id

    ###
    Cancels the item editing mode.
    ###
    editItemCancel: (id) ->
        @model.read id, (data) =>
            @view.render 'editItemDone', {id: id, title: data[0].title}

    ###
    By giving it an ID it'll find the DOM element matching that ID,
    remove it from the DOM and also remove it from storage.

    @param {number} id The ID of the item to remove from the DOM and
    storage
    ###
    removeItem: (id) ->
        @model.remove id, () =>
            @view.render 'removeItem', id
        @_filter()

    ###
    Will remove all completed items from the DOM and storage.
    ###
    removeCompletedItems: () ->
        @model.read { completed: true }, (data) =>
            data.forEach (item) =>
                @removeItem item.id
        @_filter()

    ###
    Give it an ID of a model and a checkbox and it will update the item
    in storage based on the checkbox's state.

    @param {number} id The ID of the element to complete or uncomplete
    @param {object} checkbox The checkbox to check the state of complete
                             or not
    @param {boolean|undefined} silent Prevent re-filtering the todo items
    ###
    toggleComplete: (id, completed, silent) ->
        @model.update id, { completed: completed }, () =>
            @view.render 'elementComplete', {
                id: id,
                completed: completed
            }

        if !silent
            @_filter()

    ###
    Will toggle ALL checkboxe's on/off state and completeness of models.
    Just pass in the event object.
    ###
    toggleAll: (completed) ->
        @model.read { completed: !completed }, (data) =>
            data.forEach (item) =>
                @toggleComplete item.id, completed, true
        @_filter()

    ###
    Updates the pieces of the page which change depending on the remaining
    number of todos.
    ###
    _updateCount: () ->
        todos = @model.getCount()

        @view.render 'updateElementCount', todos.active
        @view.render 'clearCompletedButton', {
            completed: todos.completed,
            visible: todos.completed > 0
        }

        @view.render 'toggleAll', {checked: todos.completed == todos.total}
        @view.render 'contentBlockVisibility', {visible: todos.total > 0}

    ###
    Re-filters the todo items, based on the active route.
    @param {boolean|undefined} force  forces a re-painting of todo items.
    ###
    _filter: (force) ->
        activeRoute = @_activeRoute.charAt(0).toUpperCase() + @_activeRoute.substr(1)

        ###
        Update the elements on the page, which change with each completed todo
        ###
        @_updateCount()

        ###
        If the last active route isn't "All", or we're switching routes, we
        re-create the todo item elements, calling:
           @show[All|Active|Completed]();
        ###
        if force or @_lastActiveRoute != 'All' or @_lastActiveRoute != activeRoute
            this['show' + activeRoute]()

        @_lastActiveRoute = activeRoute

    ###
    Simply updates the filter nav's selected states
    ###
    _updateFilterState: (currentPage) ->
        ###
        Store a reference to the active route, allowing us to re-filter todo
        items as they are marked complete or incomplete.
        ###
        @_activeRoute = currentPage

        if currentPage == ''
            @_activeRoute = 'All'

        @_filter()

        @view.render 'setFilter', currentPage

window.app = window.app or {}
window.app.Controller = Controller