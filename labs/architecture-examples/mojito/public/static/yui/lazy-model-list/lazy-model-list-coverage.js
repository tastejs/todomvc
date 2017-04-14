/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/lazy-model-list/lazy-model-list.js",
    code: []
};
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"].code=["YUI.add('lazy-model-list', function (Y, NAME) {","","/**","Provides the LazyModelList class, which is a ModelList subclass that manages","plain objects instead of fully instantiated model instances.","","@module app","@submodule lazy-model-list","@since 3.6.0","**/","","/**","LazyModelList is a subclass of ModelList that maintains a list of plain","JavaScript objects rather than a list of Model instances. This makes it","well-suited for managing large amounts of data (on the order of thousands of","items) that would tend to bog down a vanilla ModelList.","","The API presented by LazyModelList is the same as that of ModelList, except that","in every case where ModelList would provide a Model instance, LazyModelList","provides a plain JavaScript object. LazyModelList also provides a `revive()`","method that can convert the plain object at a given index into a full Model","instance.","","Since the items stored in a LazyModelList are plain objects and not full Model","instances, there are a few caveats to be aware of:","","  * Since items are plain objects and not Model instances, they contain","    properties rather than Model attributes. To retrieve a property, use","    `item.foo` rather than `item.get('foo')`. To set a property, use","    `item.foo = 'bar'` rather than `item.set('foo', 'bar')`.","","  * Model attribute getters and setters aren't supported, since items in the","    LazyModelList are stored and manipulated as plain objects with simple","    properties rather than YUI attributes.","","  * Changes made to the plain object version of an item will not trigger or","    bubble up Model `change` events. However, once an item is revived into a","    full Model using the `revive()` method, changes to that Model instance","    will trigger and bubble change events as expected.","","  * Custom `idAttribute` fields are not supported.","","  * `id` and `clientId` properties _are_ supported. If an item doesn't have a","    `clientId` property, one will be generated automatically when the item is","    added to a LazyModelList.","","LazyModelList is generally much more memory efficient than ModelList when","managing large numbers of items, and adding/removing items is significantly","faster. However, the tradeoff is that LazyModelList is only well-suited for","storing very simple items without complex attributes, and consumers must","explicitly revive items into full Model instances as needed (this is not done","transparently for performance reasons).","","@class LazyModelList","@extends ModelList","@constructor","@since 3.6.0","**/","","var AttrProto = Y.Attribute.prototype,","    GlobalEnv = YUI.namespace('Env.Model'),","    Lang      = Y.Lang,","    YArray    = Y.Array,","","    EVT_ADD   = 'add',","    EVT_ERROR = 'error',","    EVT_RESET = 'reset';","","Y.LazyModelList = Y.Base.create('lazyModelList', Y.ModelList, [], {","    // -- Public Methods -------------------------------------------------------","","    /**","    Deletes the specified model from the model cache to release memory. The","    model won't be destroyed or removed from the list, just freed from the","    cache; it can still be instantiated again using `revive()`.","","    If no model or model index is specified, all cached models in this list will","    be freed.","","    Note: Specifying an index is faster than specifying a model instance, since","    the latter requires an `indexOf()` call.","","    @method free","    @param {Model|Number} [model] Model or index of the model to free. If not","        specified, all instantiated models in this list will be freed.","    @chainable","    @see revive()","    **/","    free: function (model) {","        var index;","","        if (model) {","            index = Lang.isNumber(model) ? model : this.indexOf(model);","","            if (index >= 0) {","                // We don't detach the model because it's not being removed from","                // the list, just being freed from memory. If something else","                // still holds a reference to it, it may still bubble events to","                // the list, but that's okay.","                //","                // `this._models` is a sparse array, which ensures that the","                // indices of models and items match even if we don't have model","                // instances for all items.","                delete this._models[index];","            }","        } else {","            this._models = [];","        }","","        return this;","    },","","    /**","    Overrides ModelList#get() to return a map of property values rather than","    performing attribute lookups.","","    @method get","    @param {String} name Property name.","    @return {String[]} Array of property values.","    @see ModelList.get()","    **/","    get: function (name) {","        if (this.attrAdded(name)) {","            return AttrProto.get.apply(this, arguments);","        }","","        return YArray.map(this._items, function (item) {","            return item[name];","        });","    },","","    /**","    Overrides ModelList#getAsHTML() to return a map of HTML-escaped property","    values rather than performing attribute lookups.","","    @method getAsHTML","    @param {String} name Property name.","    @return {String[]} Array of HTML-escaped property values.","    @see ModelList.getAsHTML()","    **/","    getAsHTML: function (name) {","        if (this.attrAdded(name)) {","            return Y.Escape.html(AttrProto.get.apply(this, arguments));","        }","","        return YArray.map(this._items, function (item) {","            return Y.Escape.html(item[name]);","        });","    },","","    /**","    Overrides ModelList#getAsURL() to return a map of URL-encoded property","    values rather than performing attribute lookups.","","    @method getAsURL","    @param {String} name Property name.","    @return {String[]} Array of URL-encoded property values.","    @see ModelList.getAsURL()","    **/","    getAsURL: function (name) {","        if (this.attrAdded(name)) {","            return encodeURIComponent(AttrProto.get.apply(this, arguments));","        }","","        return YArray.map(this._items, function (item) {","            return encodeURIComponent(item[name]);","        });","    },","","    /**","    Returns the index of the given object or Model instance in this","    LazyModelList.","","    @method indexOf","    @param {Model|Object} needle The object or Model instance to search for.","    @return {Number} Item index, or `-1` if not found.","    @see ModelList.indexOf()","    **/","    indexOf: function (model) {","        return YArray.indexOf(model && model._isYUIModel ?","            this._models : this._items, model);","    },","","    /**","    Overrides ModelList#reset() to work with plain objects.","","    @method reset","    @param {Object[]|Model[]|ModelList} [models] Models to add.","    @param {Object} [options] Options.","    @chainable","    @see ModelList.reset()","    **/","    reset: function (items, options) {","        items || (items  = []);","        options || (options = {});","","        var facade = Y.merge({src: 'reset'}, options);","","        // Convert `items` into an array of plain objects, since we don't want","        // model instances.","        items = items._isYUIModelList ? items.map(this._modelToObject) :","            YArray.map(items, this._modelToObject);","","        facade.models = items;","","        if (options.silent) {","            this._defResetFn(facade);","        } else {","            // Sort the items before firing the reset event.","            if (this.comparator) {","                items.sort(Y.bind(this._sort, this));","            }","","            this.fire(EVT_RESET, facade);","        }","","        return this;","    },","","    /**","    Revives an item (or all items) into a full Model instance. The _item_","    argument may be the index of an object in this list, an actual object (which","    must exist in the list), or may be omitted to revive all items in the list.","","    Once revived, Model instances are attached to this list and cached so that","    reviving them in the future doesn't require another Model instantiation. Use","    the `free()` method to explicitly uncache and detach a previously revived","    Model instance.","","    Note: Specifying an index rather than an object will be faster, since","    objects require an `indexOf()` lookup in order to retrieve the index.","","    @method revive","    @param {Number|Object} [item] Index of the object to revive, or the object","        itself. If an object, that object must exist in this list. If not","        specified, all items in the list will be revived and an array of models","        will be returned.","    @return {Model|Model[]|null} Revived Model instance, array of revived Model","        instances, or `null` if the given index or object was not found in this","        list.","    @see free()","    **/","    revive: function (item) {","        var i, len, models;","","        if (item || item === 0) {","            return this._revive(Lang.isNumber(item) ? item :","                this.indexOf(item));","        } else {","            models = [];","","            for (i = 0, len = this._items.length; i < len; i++) {","                models.push(this._revive(i));","            }","","            return models;","        }","    },","","    /**","    Overrides ModelList#toJSON() to use toArray() instead, since it's more","    efficient for LazyModelList.","","    @method toJSON","    @return {Object[]} Array of objects.","    @see ModelList.toJSON()","    **/","    toJSON: function () {","        return this.toArray();","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Overrides ModelList#add() to work with plain objects.","","    @method _add","    @param {Object|Model} item Object or model to add.","    @param {Object} [options] Options.","    @return {Object} Added item.","    @protected","    @see ModelList._add()","    **/","    _add: function (item, options) {","        var facade;","","        options || (options = {});","","        // If the item is a model instance, convert it to a plain object.","        item = this._modelToObject(item);","","        // Ensure that the item has a clientId.","        if (!('clientId' in item)) {","            item.clientId = this._generateClientId();","        }","","        if (this._isInList(item)) {","            this.fire(EVT_ERROR, {","                error: 'Model is already in the list.',","                model: item,","                src  : 'add'","            });","","            return;","        }","","        facade = Y.merge(options, {","            index: 'index' in options ? options.index : this._findIndex(item),","            model: item","        });","","        options.silent ? this._defAddFn(facade) : this.fire(EVT_ADD, facade);","","        return item;","    },","","    /**","    Overrides ModelList#clear() to support `this._models`.","","    @method _clear","    @protected","    @see ModelList.clear()","    **/","    _clear: function () {","        YArray.each(this._models, this._detachList, this);","","        this._clientIdMap = {};","        this._idMap       = {};","        this._items       = [];","        this._models      = [];","    },","","    /**","    Generates an ad-hoc clientId for a non-instantiated Model.","","    @method _generateClientId","    @return {String} Unique clientId.","    @protected","    **/","    _generateClientId: function () {","        GlobalEnv.lastId || (GlobalEnv.lastId = 0);","        return this.model.NAME + '_' + (GlobalEnv.lastId += 1);","    },","","    /**","    Returns `true` if the given item is in this list, `false` otherwise.","","    @method _isInList","    @param {Object} item Plain object item.","    @return {Boolean} `true` if the item is in this list, `false` otherwise.","    @protected","    **/","    _isInList: function (item) {","        return !!(('clientId' in item && this._clientIdMap[item.clientId]) ||","                ('id' in item && this._idMap[item.id]));","    },","","    /**","    Converts a Model instance into a plain object. If _model_ is not a Model","    instance, it will be returned as is.","","    This method differs from Model#toJSON() in that it doesn't delete the","    `clientId` property.","","    @method _modelToObject","    @param {Model|Object} model Model instance to convert.","    @return {Object} Plain object.","    @protected","    **/","    _modelToObject: function (model) {","        if (model._isYUIModel) {","            model = model.getAttrs();","            delete model.destroyed;","            delete model.initialized;","        }","","        return model;","    },","","    /**","    Overrides ModelList#_remove() to convert Model instances to indices","    before removing to ensure consistency in the `remove` event facade.","","    @method _remove","    @param {Object|Model} item Object or model to remove.","    @param {Object} [options] Options.","    @return {Object} Removed object.","    @protected","    **/","    _remove: function (item, options) {","        // If the given item is a model instance, turn it into an index before","        // calling the parent _remove method, since we only want to deal with","        // the plain object version.","        if (item._isYUIModel) {","            item = this.indexOf(item);","        }","","        return Y.ModelList.prototype._remove.call(this, item, options);","    },","","    /**","    Revives a single model at the specified index and returns it. This is the","    underlying implementation for `revive()`.","","    @method _revive","    @param {Number} index Index of the item to revive.","    @return {Model} Revived model.","    @protected","    **/","    _revive: function (index) {","        var item, model;","","        if (index < 0) {","            return null;","        }","","        item = this._items[index];","","        if (!item) {","            return null;","        }","","        model = this._models[index];","","        if (!model) {","            model = new this.model(item);","            this._attachList(model);","            this._models[index] = model;","        }","","        return model;","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Overrides ModelList#_defAddFn() to support plain objects.","","    @method _defAddFn","    @param {EventFacade} e","    @protected","    **/","    _defAddFn: function (e) {","        var item = e.model;","","        this._clientIdMap[item.clientId] = item;","","        if (Lang.isValue(item.id)) {","            this._idMap[item.id] = item;","        }","","        this._items.splice(e.index, 0, item);","    },","","    /**","    Overrides ModelList#_defRemoveFn() to support plain objects.","","    @method _defRemoveFn","    @param {EventFacade} e","    @protected","    **/","    _defRemoveFn: function (e) {","        var index = e.index,","            item  = e.model,","            model = this._models[index];","","        delete this._clientIdMap[item.clientId];","","        if ('id' in item) {","            delete this._idMap[item.id];","        }","","        if (model) {","            this._detachList(model);","        }","","        this._items.splice(index, 1);","        this._models.splice(index, 1);","    }","});","","","}, '3.7.3', {\"requires\": [\"model-list\"]});"];
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"].lines = {"1":0,"60":0,"69":0,"90":0,"92":0,"93":0,"95":0,"104":0,"107":0,"110":0,"123":0,"124":0,"127":0,"128":0,"142":0,"143":0,"146":0,"147":0,"161":0,"162":0,"165":0,"166":0,"180":0,"194":0,"195":0,"197":0,"201":0,"204":0,"206":0,"207":0,"210":0,"211":0,"214":0,"217":0,"244":0,"246":0,"247":0,"250":0,"252":0,"253":0,"256":0,"269":0,"285":0,"287":0,"290":0,"293":0,"294":0,"297":0,"298":0,"304":0,"307":0,"312":0,"314":0,"325":0,"327":0,"328":0,"329":0,"330":0,"341":0,"342":0,"354":0,"371":0,"372":0,"373":0,"374":0,"377":0,"394":0,"395":0,"398":0,"411":0,"413":0,"414":0,"417":0,"419":0,"420":0,"423":0,"425":0,"426":0,"427":0,"428":0,"431":0,"444":0,"446":0,"448":0,"449":0,"452":0,"463":0,"467":0,"469":0,"470":0,"473":0,"474":0,"477":0,"478":0};
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"].functions = {"free:89":0,"(anonymous 2):127":0,"get:122":0,"(anonymous 3):146":0,"getAsHTML:141":0,"(anonymous 4):165":0,"getAsURL:160":0,"indexOf:179":0,"reset:193":0,"revive:243":0,"toJSON:268":0,"_add:284":0,"_clear:324":0,"_generateClientId:340":0,"_isInList:353":0,"_modelToObject:370":0,"_remove:390":0,"_revive:410":0,"_defAddFn:443":0,"_defRemoveFn:462":0,"(anonymous 1):1":0};
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"].coveredLines = 94;
_yuitest_coverage["build/lazy-model-list/lazy-model-list.js"].coveredFunctions = 21;
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 1);
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

_yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "(anonymous 1)", 1);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 60);
var AttrProto = Y.Attribute.prototype,
    GlobalEnv = YUI.namespace('Env.Model'),
    Lang      = Y.Lang,
    YArray    = Y.Array,

    EVT_ADD   = 'add',
    EVT_ERROR = 'error',
    EVT_RESET = 'reset';

_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 69);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "free", 89);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 90);
var index;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 92);
if (model) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 93);
index = Lang.isNumber(model) ? model : this.indexOf(model);

            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 95);
if (index >= 0) {
                // We don't detach the model because it's not being removed from
                // the list, just being freed from memory. If something else
                // still holds a reference to it, it may still bubble events to
                // the list, but that's okay.
                //
                // `this._models` is a sparse array, which ensures that the
                // indices of models and items match even if we don't have model
                // instances for all items.
                _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 104);
delete this._models[index];
            }
        } else {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 107);
this._models = [];
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 110);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "get", 122);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 123);
if (this.attrAdded(name)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 124);
return AttrProto.get.apply(this, arguments);
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 127);
return YArray.map(this._items, function (item) {
            _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "(anonymous 2)", 127);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 128);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "getAsHTML", 141);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 142);
if (this.attrAdded(name)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 143);
return Y.Escape.html(AttrProto.get.apply(this, arguments));
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 146);
return YArray.map(this._items, function (item) {
            _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "(anonymous 3)", 146);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 147);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "getAsURL", 160);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 161);
if (this.attrAdded(name)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 162);
return encodeURIComponent(AttrProto.get.apply(this, arguments));
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 165);
return YArray.map(this._items, function (item) {
            _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "(anonymous 4)", 165);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 166);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "indexOf", 179);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 180);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "reset", 193);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 194);
items || (items  = []);
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 195);
options || (options = {});

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 197);
var facade = Y.merge({src: 'reset'}, options);

        // Convert `items` into an array of plain objects, since we don't want
        // model instances.
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 201);
items = items._isYUIModelList ? items.map(this._modelToObject) :
            YArray.map(items, this._modelToObject);

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 204);
facade.models = items;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 206);
if (options.silent) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 207);
this._defResetFn(facade);
        } else {
            // Sort the items before firing the reset event.
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 210);
if (this.comparator) {
                _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 211);
items.sort(Y.bind(this._sort, this));
            }

            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 214);
this.fire(EVT_RESET, facade);
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 217);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "revive", 243);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 244);
var i, len, models;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 246);
if (item || item === 0) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 247);
return this._revive(Lang.isNumber(item) ? item :
                this.indexOf(item));
        } else {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 250);
models = [];

            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 252);
for (i = 0, len = this._items.length; i < len; i++) {
                _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 253);
models.push(this._revive(i));
            }

            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 256);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "toJSON", 268);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 269);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_add", 284);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 285);
var facade;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 287);
options || (options = {});

        // If the item is a model instance, convert it to a plain object.
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 290);
item = this._modelToObject(item);

        // Ensure that the item has a clientId.
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 293);
if (!('clientId' in item)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 294);
item.clientId = this._generateClientId();
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 297);
if (this._isInList(item)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 298);
this.fire(EVT_ERROR, {
                error: 'Model is already in the list.',
                model: item,
                src  : 'add'
            });

            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 304);
return;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 307);
facade = Y.merge(options, {
            index: 'index' in options ? options.index : this._findIndex(item),
            model: item
        });

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 312);
options.silent ? this._defAddFn(facade) : this.fire(EVT_ADD, facade);

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 314);
return item;
    },

    /**
    Overrides ModelList#clear() to support `this._models`.

    @method _clear
    @protected
    @see ModelList.clear()
    **/
    _clear: function () {
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_clear", 324);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 325);
YArray.each(this._models, this._detachList, this);

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 327);
this._clientIdMap = {};
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 328);
this._idMap       = {};
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 329);
this._items       = [];
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 330);
this._models      = [];
    },

    /**
    Generates an ad-hoc clientId for a non-instantiated Model.

    @method _generateClientId
    @return {String} Unique clientId.
    @protected
    **/
    _generateClientId: function () {
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_generateClientId", 340);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 341);
GlobalEnv.lastId || (GlobalEnv.lastId = 0);
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 342);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_isInList", 353);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 354);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_modelToObject", 370);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 371);
if (model._isYUIModel) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 372);
model = model.getAttrs();
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 373);
delete model.destroyed;
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 374);
delete model.initialized;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 377);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_remove", 390);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 394);
if (item._isYUIModel) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 395);
item = this.indexOf(item);
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 398);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_revive", 410);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 411);
var item, model;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 413);
if (index < 0) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 414);
return null;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 417);
item = this._items[index];

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 419);
if (!item) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 420);
return null;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 423);
model = this._models[index];

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 425);
if (!model) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 426);
model = new this.model(item);
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 427);
this._attachList(model);
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 428);
this._models[index] = model;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 431);
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
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_defAddFn", 443);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 444);
var item = e.model;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 446);
this._clientIdMap[item.clientId] = item;

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 448);
if (Lang.isValue(item.id)) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 449);
this._idMap[item.id] = item;
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 452);
this._items.splice(e.index, 0, item);
    },

    /**
    Overrides ModelList#_defRemoveFn() to support plain objects.

    @method _defRemoveFn
    @param {EventFacade} e
    @protected
    **/
    _defRemoveFn: function (e) {
        _yuitest_coverfunc("build/lazy-model-list/lazy-model-list.js", "_defRemoveFn", 462);
_yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 463);
var index = e.index,
            item  = e.model,
            model = this._models[index];

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 467);
delete this._clientIdMap[item.clientId];

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 469);
if ('id' in item) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 470);
delete this._idMap[item.id];
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 473);
if (model) {
            _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 474);
this._detachList(model);
        }

        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 477);
this._items.splice(index, 1);
        _yuitest_coverline("build/lazy-model-list/lazy-model-list.js", 478);
this._models.splice(index, 1);
    }
});


}, '3.7.3', {"requires": ["model-list"]});
