/**
 * Creates a new Model instance and hooks up the storage.
 * @constructor
 * @param {object} storage A reference to the client side storage class
 */
class Model {
    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Creates a new todo model
     *
     * @param {string} [title] The title of the task
     * @param {function} [callback] The callback to fire after the model is created
     */
    create(title, callback) {
        title = title || "";

        const newItem = {
            title: title.trim(),
            completed: false,
        };

        this.storage.save(newItem, callback);
    }

    /**
     * Finds and returns a model in storage. If no query is given it'll simply
     * return everything. If you pass in a string or number it'll look that up as
     * the ID of the model to find. Lastly, you can pass it an object to match
     * against.
     *
     * @param {string|number|object} [query] A query to match models against
     * @param {function} [callback] The callback to fire after the model is found
     *
     * @example
     * model.read(1, func) // Will find the model with an ID of 1
     * model.read('1') // Same as above
     * //Below will find a model with foo equalling bar and hello equalling world.
     * model.read({ foo: 'bar', hello: 'world' })
     */
    read(query, callback) {
        const queryType = typeof query;

        if (queryType === "function") {
            callback = query;
            this.storage.findAll(callback);
        } else if (queryType === "string" || queryType === "number") {
            query = parseInt(query, 10);
            this.storage.find({ id: query }, callback);
        } else {
            this.storage.find(query, callback);
        }
    }

    /**
     * Updates a model by giving it an ID, data to update, and a callback to fire when
     * the update is complete.
     *
     * @param {number} id The id of the model to update
     * @param {object} data The properties to update and their new value
     * @param {function} callback The callback to fire when the update is complete.
     */
    update(id, data, callback) {
        this.storage.save(data, callback, id);
    }

    /**
     * Removes a model from storage
     *
     * @param {number} id The ID of the model to remove
     * @param {function} callback The callback to fire when the removal is complete.
     */
    remove(id, callback) {
        this.storage.remove(id, callback);
    }

    /**
     * WARNING: Will remove ALL data from storage.
     *
     * @param {function} callback The callback to fire when the storage is wiped.
     */
    removeAll(callback) {
        this.storage.drop(callback);
    }

    /**
     * Returns a count of all todos
     */
    getCount(callback) {
        if (!callback)
            return;

        const stats = {
            active: 0,
            completed: 0,
            total: 0,
        };

        this.storage.findAll((data) => {
            for (let todo of data) {
                if (todo.completed)
                    stats.completed++;
                else
                    stats.active++;

                stats.total++;
            }

            callback(stats);
        });
    }
}

export default Model;
