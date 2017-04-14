/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('lazy-model-list', function (Y, NAME) {

/**
Provides the LazyModelList class, which is a ModelList subclass that manages
plain objects instead of fully instantiated model instances.

@module app
@submodule lazy-model-list
@since 3.6.0
**/

/**
LazyModelList is a subclass of ModelList that maintains a list of plain
JavaScript objects rather than a list of Model instances. This makes it
well-suited for managing large amounts of data (on the order of thousands of
items) that would tend to bog down a vanilla ModelList.

The API presented by LazyModelList is the same as that of ModelList, except that
in every case where ModelList would provide a Model instance, LazyModelList
provides a plain JavaScript object. LazyModelList also provides a `revive()`
method that can convert the plain object at a given index into a full Model
instance.

Since the items stored in a LazyModelList are plain objects and not full Model
instances, there are a few caveats to be aware of:

  * Since items are plain objects and not Model instances, they contain
    properties rather than Model attributes. To retrieve a property, use
    `item.foo` rather than `item.get('foo')`. To set a property, use
    `item.foo = 'bar'` rather than `item.set('foo', 'bar')`.

  * Model attribute getters and setters aren't supported, since items in the
    LazyModelList are stored and manipulated as plain objects with simple
    properties rather than YUI attributes.

  * Changes made to the plain object version of an item will not trigger or
    bubble up Model `change` events. However, once an item is revived into a
    full Model using the `revive()` method, changes to that Model instance
    will trigger and bubble change events as expected.

  * Custom `idAttribute` fields are not supported.

  * `id` and `clientId` properties _are_ supported. If an item doesn't have a
    `clientId` property, one will be generated automatically when the item is
    added to a LazyModelList.

LazyModelList is generally much more memory efficient than ModelList when
managing large numbers of items, and adding/removing items is significantly
faster. However, the tradeoff is that LazyModelList is only well-suited for
storing very simple items without complex attributes, and consumers must
explicitly revive items into full Model instances as needed (this is not done
transparently for performance reasons).

@class LazyModelList
@extends ModelList
@constructor
@since 3.6.0
**/

var AttrProto = Y.Attribute.prototype,
    GlobalEnv = YUI.namespace('Env.Model'),
    Lang      = Y.Lang,
    YArray    = Y.Array,

    EVT_ADD   = 'add',
    EVT_ERROR = 'error',
    EVT_RESET = 'reset';

Y.LazyModelList = Y.Base.create('lazyModelList', Y.ModelList, [], {
    // -- Public Methods -------------------------------------------------------

    /**
    Deletes the specified model from the model cache to release memory. The
    model won't be destroyed or removed from the list, just freed from the
    cache; it can still be instantiated again using `revive()`.

    If no model or model index is specified, all cached models in this list will
    be freed.

    Note: Specifying an index is faster than specifying a model instance, since
    the latter requires an `indexOf()` call.

    @method free
    @param {Model|Number} [model] Model or index of the model to free. If not
        specified, all instantiated models in this list will be freed.
    @chainable
    @see revive()
    **/
    free: function (model) {
        var index;

        if (model) {
            index = Lang.isNumber(model) ? model : this.indexOf(model);

            if (index >= 0) {
                // We don't detach the model because it's not being removed from
                // the list, just being freed from memory. If something else
                // still holds a reference to it, it may still bubble events to
                // the list, but that's okay.
                //
                // `this._models` is a sparse array, which ensures that the
                // indices of models and items match even if we don't have model
                // instances for all items.
                delete this._models[index];
            }
        } else {
            this._models = [];
        }

        return this;
    },

    /**
    Overrides ModelList#get() to return a map of property values rather than
    performing attribute lookups.

    @method get
    @param {String} name Property name.
    @return {String[]} Array of property values.
    @see ModelList.get()
    **/
    get: function (name) {
        if (this.attrAdded(name)) {
            return AttrProto.get.apply(this, arguments);
        }

        return YArray.map(this._items, function (item) {
            return item[name];
        });
    },

    /**
    Overrides ModelList#getAsHTML() to return a map of HTML-escaped property
    values rather than performing attribute lookups.

    @method getAsHTML
    @param {String} name Property name.
    @return {String[]} Array of HTML-escaped property values.
    @see ModelList.getAsHTML()
    **/
    getAsHTML: function (name) {
        if (this.attrAdded(name)) {
            return Y.Escape.html(AttrProto.get.apply(this, arguments));
        }

        return YArray.map(this._items, function (item) {
            return Y.Escape.html(item[name]);
        });
    },

    /**
    Overrides ModelList#getAsURL() to return a map of URL-encoded property
    values rather than performing attribute lookups.

    @method getAsURL
    @param {String} name Property name.
    @return {String[]} Array of URL-encoded property values.
    @see ModelList.getAsURL()
    **/
    getAsURL: function (name) {
        if (this.attrAdded(name)) {
            return encodeURIComponent(AttrProto.get.apply(this, arguments));
        }

        return YArray.map(this._items, function (item) {
            return encodeURIComponent(item[name]);
        });
    },

    /**
    Returns the index of the given object or Model instance in this
    LazyModelList.

    @method indexOf
    @param {Model|Object} needle The object or Model instance to search for.
    @return {Number} Item index, or `-1` if not found.
    @see ModelList.indexOf()
    **/
    indexOf: function (model) {
        return YArray.indexOf(model && model._isYUIModel ?
            this._models : this._items, model);
    },

    /**
    Overrides ModelList#reset() to work with plain objects.

    @method reset
    @param {Object[]|Model[]|ModelList} [models] Models to add.
    @param {Object} [options] Options.
    @chainable
    @see ModelList.reset()
    **/
    reset: function (items, options) {
        items || (items  = []);
        options || (options = {});

        var facade = Y.merge({src: 'reset'}, options);

        // Convert `items` into an array of plain objects, since we don't want
        // model instances.
        items = items._isYUIModelList ? items.map(this._modelToObject) :
            YArray.map(items, this._modelToObject);

        facade.models = items;

        if (options.silent) {
            this._defResetFn(facade);
        } else {
            // Sort the items before firing the reset event.
            if (this.comparator) {
                items.sort(Y.bind(this._sort, this));
            }

            this.fire(EVT_RESET, facade);
        }

        return this;
    },

    /**
    Revives an item (or all items) into a full Model instance. The _item_
    argument may be the index of an object in this list, an actual object (which
    must exist in the list), or may be omitted to revive all items in the list.

    Once revived, Model instances are attached to this list and cached so that
    reviving them in the future doesn't require another Model instantiation. Use
    the `free()` method to explicitly uncache and detach a previously revived
    Model instance.

    Note: Specifying an index rather than an object will be faster, since
    objects require an `indexOf()` lookup in order to retrieve the index.

    @method revive
    @param {Number|Object} [item] Index of the object to revive, or the object
        itself. If an object, that object must exist in this list. If not
        specified, all items in the list will be revived and an array of models
        will be returned.
    @return {Model|Model[]|null} Revived Model instance, array of revived Model
        instances, or `null` if the given index or object was not found in this
        list.
    @see free()
    **/
    revive: function (item) {
        var i, len, models;

        if (item || item === 0) {
            return this._revive(Lang.isNumber(item) ? item :
                this.indexOf(item));
        } else {
            models = [];

            for (i = 0, len = this._items.length; i < len; i++) {
                models.push(this._revive(i));
            }

            return models;
        }
    },

    /**
    Overrides ModelList#toJSON() to use toArray() instead, since it's more
    efficient for LazyModelList.

    @method toJSON
    @return {Object[]} Array of objects.
    @see ModelList.toJSON()
    **/
    toJSON: function () {
        return this.toArray();
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Overrides ModelList#add() to work with plain objects.

    @method _add
    @param {Object|Model} item Object or model to add.
    @param {Object} [options] Options.
    @return {Object} Added item.
    @protected
    @see ModelList._add()
    **/
    _add: function (item, options) {
        var facade;

        options || (options = {});

        // If the item is a model instance, convert it to a plain object.
        item = this._modelToObject(item);

        // Ensure that the item has a clientId.
        if (!('clientId' in item)) {
            item.clientId = this._generateClientId();
        }

        if (this._isInList(item)) {
            this.fire(EVT_ERROR, {
                error: 'Model is already in the list.',
                model: item,
                src  : 'add'
            });

            return;
        }

        facade = Y.merge(options, {
            index: 'index' in options ? options.index : this._findIndex(item),
            model: item
        });

        options.silent ? this._defAddFn(facade) : this.fire(EVT_ADD, facade);

        return item;
    },

    /**
    Overrides ModelList#clear() to support `this._models`.

    @method _clear
    @protected
    @see ModelList.clear()
    **/
    _clear: function () {
        YArray.each(this._models, this._detachList, this);

        this._clientIdMap = {};
        this._idMap       = {};
        this._items       = [];
        this._models      = [];
    },

    /**
    Generates an ad-hoc clientId for a non-instantiated Model.

    @method _generateClientId
    @return {String} Unique clientId.
    @protected
    **/
    _generateClientId: function () {
        GlobalEnv.lastId || (GlobalEnv.lastId = 0);
        return this.model.NAME + '_' + (GlobalEnv.lastId += 1);
    },

    /**
    Returns `true` if the given item is in this list, `false` otherwise.

    @method _isInList
    @param {Object} item Plain object item.
    @return {Boolean} `true` if the item is in this list, `false` otherwise.
    @protected
    **/
    _isInList: function (item) {
        return !!(('clientId' in item && this._clientIdMap[item.clientId]) ||
                ('id' in item && this._idMap[item.id]));
    },

    /**
    Converts a Model instance into a plain object. If _model_ is not a Model
    instance, it will be returned as is.

    This method differs from Model#toJSON() in that it doesn't delete the
    `clientId` property.

    @method _modelToObject
    @param {Model|Object} model Model instance to convert.
    @return {Object} Plain object.
    @protected
    **/
    _modelToObject: function (model) {
        if (model._isYUIModel) {
            model = model.getAttrs();
            delete model.destroyed;
            delete model.initialized;
        }

        return model;
    },

    /**
    Overrides ModelList#_remove() to convert Model instances to indices
    before removing to ensure consistency in the `remove` event facade.

    @method _remove
    @param {Object|Model} item Object or model to remove.
    @param {Object} [options] Options.
    @return {Object} Removed object.
    @protected
    **/
    _remove: function (item, options) {
        // If the given item is a model instance, turn it into an index before
        // calling the parent _remove method, since we only want to deal with
        // the plain object version.
        if (item._isYUIModel) {
            item = this.indexOf(item);
        }

        return Y.ModelList.prototype._remove.call(this, item, options);
    },

    /**
    Revives a single model at the specified index and returns it. This is the
    underlying implementation for `revive()`.

    @method _revive
    @param {Number} index Index of the item to revive.
    @return {Model} Revived model.
    @protected
    **/
    _revive: function (index) {
        var item, model;

        if (index < 0) {
            return null;
        }

        item = this._items[index];

        if (!item) {
            return null;
        }

        model = this._models[index];

        if (!model) {
            model = new this.model(item);
            this._attachList(model);
            this._models[index] = model;
        }

        return model;
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Overrides ModelList#_defAddFn() to support plain objects.

    @method _defAddFn
    @param {EventFacade} e
    @protected
    **/
    _defAddFn: function (e) {
        var item = e.model;

        this._clientIdMap[item.clientId] = item;

        if (Lang.isValue(item.id)) {
            this._idMap[item.id] = item;
        }

        this._items.splice(e.index, 0, item);
    },

    /**
    Overrides ModelList#_defRemoveFn() to support plain objects.

    @method _defRemoveFn
    @param {EventFacade} e
    @protected
    **/
    _defRemoveFn: function (e) {
        var index = e.index,
            item  = e.model,
            model = this._models[index];

        delete this._clientIdMap[item.clientId];

        if ('id' in item) {
            delete this._idMap[item.id];
        }

        if (model) {
            this._detachList(model);
        }

        this._items.splice(index, 1);
        this._models.splice(index, 1);
    }
});


}, '3.7.3', {"requires": ["model-list"]});
