###
Creates a new client side storage object and will create an empty
collection if no collection already exists.

@param {string} name The name of our DB we want to use
@param {function} callback Our fake DB uses callbacks because in
real life you probably would be making AJAX calls
###
class Store
    constructor: (name, callback = (->)) ->
        dbName = @._dbName = name

        if !localStorage[dbName]
            data = {
                todos: []
            }

            localStorage[dbName] = JSON.stringify data

        callback.call @, JSON.parse(localStorage[dbName])

    ###
    Finds items based on a query given as a JS object

    @param {object} query The query to match against (i.e. {foo: 'bar'})
    @param {function} callback    The callback to fire when the query has
    completed running

    @example
    db.find({foo: 'bar', hello: 'world'}, function (data) {
      // data will return any items that have foo: bar and
      // hello: world in their properties
    });
    ###
    find: (query, callback) ->
        if !callback
            return

        todos = JSON.parse(localStorage[@._dbName]).todos

        callback.call @, todos.filter (todo) ->
            match = true
            for q of query
                if query[q] != todo[q]
                    match = false
            return match

    ###
    Will retrieve all data from the collection

    @param {function} callback The callback to fire upon retrieving data
    ###
    findAll: (callback = (->)) ->
        callback.call this, JSON.parse(localStorage[this._dbName]).todos

    ###
    Will save the given data to the DB. If no item exists it will create a new
    item, otherwise it'll simply update an existing item's properties

    @param {number} id An optional param to enter an ID of an item to update
    @param {object} data The data to save back into the DB
    @param {function} callback The callback to fire after saving
    ###
    save: (id, updateData, callback = (->)) ->
        data = JSON.parse localStorage[@._dbName]
        todos = data.todos;

        ###
        If an ID was actually given, find the item and update each property
        ###
        if typeof id != 'object'
            for todo in todos
                if `todo.id == id`
                    for x, update of updateData
                        todo[x] = update

            localStorage[@._dbName] = JSON.stringify data
            callback.call @, JSON.parse(localStorage[@._dbName]).todos
        else
            callback = updateData

            updateData = id

            ###
            Generate an ID
            ###
            updateData.id = new Date().getTime()

            todos.push updateData
            localStorage[@._dbName] = JSON.stringify data
            callback @, [updateData]

    ###
    Will remove an item from the Store based on its ID

    @param {number} id The ID of the item you want to remove
    @param {function} callback The callback to fire after saving
    ###
    remove: (id, callback) ->
        data = JSON.parse localStorage[@._dbName]
        todos = data.todos

        for todo, i in todos
            if `todo.id == id`
                todos.splice i, 1
                break

        localStorage[@._dbName] = JSON.stringify data
        callback.call @, JSON.parse(localStorage[@._dbName]).todos

    ###
    Will drop all storage and start fresh

    @param {function} callback The callback to fire after dropping the data
    ###
    drop: (callback) ->
        localStorage[@._dbName] = JSON.stringify {todos: []}
        callback.call @, JSON.parse(localStorage[@._dbName]).todos


window.app = window.app or {}
window.app.Store = Store