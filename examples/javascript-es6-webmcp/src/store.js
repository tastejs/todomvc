let uniqueID = 1;
/* HOT MODULE SPECIFIC
 * Since hot reload blows away class instances, storage object is
 * moved outside of the class.
 */
let memoryStorage = {};

/**
 * Creates a new client side storage object and will create an empty
 * collection if no collection already exists.
 *
 * @param {string} name The name of our DB we want to use
 * @param {function} callback Our fake DB uses callbacks because in
 * real life you probably would be making AJAX calls
 */
export class Store {
    constructor(name, callback) {
        this._dbName = name;

        if (!memoryStorage[name]) {
            const data = {
                todos: [],
            };

            memoryStorage[name] = JSON.stringify(data);
        }

        if (callback)
            callback(JSON.parse(memoryStorage[name]));
    }

    /**
     * Finds items based on a query given as a JS object
     *
     * @param {object} query The query to match against (i.e. {foo: 'bar'})
     * @param {function} callback   The callback to fire when the query has
     * completed running
     *
     * @example
     * db.find({foo: 'bar', hello: 'world'}, function (data) {
     *   // data will return any items that have foo: bar and
     *   // hello: world in their properties
     * })
     */
    find(query, callback) {
        if (!callback)
            return;

        const { todos } = JSON.parse(memoryStorage[this._dbName]);

        callback(
            todos.filter((todo) => {
                for (let q in query) {
                    if (query[q] !== todo[q])
                        return false;
                }

                return true;
            })
        );
    }

    /**
     * Will retrieve all data from the collection
     *
     * @param {function} callback The callback to fire upon retrieving data
     */
    findAll(callback) {
        if (!callback)
            return;

        callback(JSON.parse(memoryStorage[this._dbName]).todos);
    }

    /**
     * Will save the given data to the DB. If no item exists it will create a new
     * item, otherwise it'll simply update an existing item's properties
     *
     * @param {object} updateData The data to save back into the DB
     * @param {function} callback The callback to fire after saving
     * @param {number} id An optional param to enter an ID of an item to update
     */
    save(updateData, callback, id) {
        const data = JSON.parse(memoryStorage[this._dbName]);
        const { todos } = data;

        // If an ID was actually given, find the item and update each property
        if (id) {
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === id) {
                    for (let key in updateData)
                        todos[i][key] = updateData[key];

                    break;
                }
            }

            memoryStorage[this._dbName] = JSON.stringify(data);

            if (callback)
                callback(JSON.parse(memoryStorage[this._dbName]).todos);
        } else {
            // Generate an ID
            updateData.id = uniqueID++;

            todos.push(updateData);
            memoryStorage[this._dbName] = JSON.stringify(data);

            if (callback)
                callback([updateData]);
        }
    }

    /**
     * Will remove an item from the Store based on its ID
     *
     * @param {number} id The ID of the item you want to remove
     * @param {function} callback The callback to fire after saving
     */
    remove(id, callback) {
        const data = JSON.parse(memoryStorage[this._dbName]);
        const { todos } = data;

        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
                todos.splice(i, 1);
                break;
            }
        }

        memoryStorage[this._dbName] = JSON.stringify(data);

        if (callback)
            callback(JSON.parse(memoryStorage[this._dbName]).todos);
    }

    /**
     * Will drop all storage and start fresh
     *
     * @param {function} callback The callback to fire after dropping the data
     */
    drop(callback) {
        memoryStorage[this._dbName] = JSON.stringify({ todos: [] });

        if (callback)
            callback(JSON.parse(memoryStorage[this._dbName]).todos);
    }
}

export default Store;
