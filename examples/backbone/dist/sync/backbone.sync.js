/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
Backbone.sync = (function (method, model, options) {
    // we need to make sure we initialize a store, in this case
    // we will just use a JS object.
    const cache = {};

    // The size will be primarily used to assign ids to newly
    // created models. Each time a new model is created, the size
    // will be incremented.
    let size = 0;

    // since we need to create a store for the models/collections
    // we are actually going to invoke the outer function which will
    // return this function below as the Backbone.sync that will
    // actually be used.
    return function (method, model, options) {
        // create a new deferred object. standard sync returns the $.ajax
        // request, which internally returns a deferred. It's important to
        // do this so that people can chain on fetch using the standard .then/.fail
        // syntax, rather than just the success/error callbacks.
        const deferred = $.Deferred();

        // when creating a new model...
        if (method === "create") {
            // first assign it an id. The server would traditionally do this.
            model.id = size;
            // store it in our cache
            cache[model.id] = model;
            // make sure we increment the number of models we now have.
            size += 1;

            // if a success callback was provided, execute it.
            if (options.success)
                options.success(model, model.toJSON(), options);

            // resolve the deferred.
            deferred.resolve(model);

            // we are updating a model
        } else if (method === "update") {
            // as long as the model actually exists in our store
            if (cache[model.id]) {
                // overwrite what is currently in the store with this model.
                cache[model.id] = model;

                // if a success callback was provided, execute it.
                if (options.success)
                    options.success(model, model.toJSON(), options);

                deferred.resolve(model);

                // if this model doesn't exist yet, we can't update it
            } else {
                if (options.error)
                    options.error(model, "Model not found");
                deferred.reject(model);
            }

            // if we're trying to read a model...
        } else if (method === "read") {
            // as long as it exists
            if (cache[model.id]) {
                // if a success callback was provided, execute it.
                if (options.success)
                    options.success(model, cache[model.id].toJSON(), options);

                // resolve
                deferred.resolve(model);
            } else {
                if (options.error)
                    options.error(model, "Model not found");
                deferred.reject(model);
            }

            // if we're deleting a model...
        } else if (method === "delete") {
            // first make sure it exists in the cache
            if (cache[model.id]) {
                // then remove it from the cache
                delete cache[model.id];

                // and trigger the success callback. Note we're passing an
                // empty object as the second argument, because a deletion
                // would result in an empty return from the server.
                if (options.success)
                    options.success(model, {}, options);

                // resolve the deferred
                deferred.resolve(model);

                // otherwise, error that the model doesn't exist.
            } else {
                if (options.error)
                    options.error(model, "Model not found");
                deferred.reject(model);
            }
        }

        return deferred.promise();
    };
})();
