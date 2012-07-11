YUI.add('model-sync-local', function(Y) {

/*
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

@module app
@submodule model-sync-local
@since 3.6.0
**/

/**
An extension which provides a sync implementation through locally stored
key value pairs, either through the HTML localStorage API or falling back
onto an in-memory cache, that can be mixed into a Model or ModelList subclass.

A group of Models/ModelLists is serialized in localStorage by either its 
class name, or a specified 'root' that is provided. 

    var User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
        root: 'user'
    });

    var Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {
        model: User,
        root  : 'user'
    });

@class ModelSync.Local
@extensionfor Model
@extensionfor ModelList
@since 3.6.0
**/
function LocalSync() {}

/**
Properties that shouldn't be turned into ad-hoc attributes when passed to a
Model or ModelList constructor.

@property _NON_ATTRS_CFG
@type Array
@default ['root', 'url']
@static
@protected
@since 3.6.0
**/
LocalSync._NON_ATTRS_CFG = ['root'];

/**
Object of key/value pairs to fall back on when localStorage is not available.

@property _data
@type Object
@private
**/
LocalSync._data = {};

LocalSync.prototype = {

    // -- Public Methods -------------------------------------------------------
    
    /**
    Root used as the key inside of localStorage and/or the in-memory store.
    
    @property root
    @type String
    @default ""
    @since 3.6.0
    **/
    root: '',

    /**
    Shortcut for access to localStorage.
    
    @property storage
    @type Storage
    @default null
    @since 3.6.0
    **/
    storage: null,

    // -- Lifecycle Methods -----------------------------------------------------
    initializer: function (config) {
        var store;

        config || (config = {});

        ('root' in config) && (this.root = config.root || this.constructor.NAME);
        try {
            this.storage = Y.config.win.localStorage;
            store = this.storage.getItem(this.root);
        } catch (e) {
            Y.log("Could not access localStorage.", "warn");
        }
        
        // Pull in existing data from localStorage, if possible
        LocalSync._data[this.root] = (store && Y.JSON.parse(store)) || {};
    },

    /**
    Generate a random GUID for our Models. This can be overriden if you have
    another method of generating different IDs.
    
    @method generateID
    @param {String} pre Optional GUID prefix
    **/
    generateID: function (pre) {
        return Y.guid(pre + '_');
    },
    
    // -- Public Methods -----------------------------------------------------------
    
    /**
    Creates a synchronization layer with the localStorage API, if available.
    Otherwise, falls back to a in-memory data store.

    This method is called internally by load(), save(), and destroy().

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * **create**: Store a newly-created model for the first time.
      * **read**  : Load an existing model.
      * **update**: Update an existing model.
      * **delete**: Delete an existing model.

    @param {Object} [options] Sync options
    @param {callback} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The response from our sync. This value will
        be passed to the parse() method, which is expected to parse it and
        return an attribute hash.
    **/
    sync: function (action, options, callback) {
        options || (options = {});
        var response;

        switch (action) {
            case 'read':
                if (this._isYUIModelList) {
                    response = this._index(options);
                } else {
                    response = this._show(options);
                }
                break;
            case 'create':
                response = this._create(options);
                break;
            case 'update':
                response = this._update(options);
                break;
            case 'delete':
                response = this._destroy(options);
                break;
        }

        if (response) {
            callback(null, response);
        } else {
            callback('Data not found');
        }
    },

    // -- Protected Methods ----------------------------------------------------
    
    /**
    Sync method correlating to the "read" operation, for a Model List
    
    @method _index
    @return {Object[]} Array of objects found for that root key
    @protected
    @since 3.6.0
    **/    
    _index: function (options) {
        return Y.Object.values(LocalSync._data[this.root]);
    },

    /**
    Sync method correlating to the "read" operation, for a Model
    
    @method _show
    @return {Object} Object found for that root key and model ID
    @protected
    @since 3.6.0
    **/ 
    _show: function (options) {
        return Y.JSON.parse(LocalSync._data[this.root][this.get('id')]);
    },
    
    /**
    Sync method correlating to the "create" operation
    
    @method _show
    @return {Object} The new object created.
    @protected
    @since 3.6.0
    **/ 
    _create: function (options) {
        var hash = this.toJSON();
        hash.id = this.generateID(this.root);
        LocalSync._data[this.root][hash.id] = hash;

        this._save();
        return hash;
    },

    /**
    Sync method correlating to the "update" operation
    
    @method _update
    @return {Object} The updated object.
    @protected
    @since 3.6.0
    **/ 
    _update: function (options) {
        var hash = Y.merge(this.toJSON(), options);
        LocalSync._data[this.root][this.get('id')] = hash;
        
        this._save();
        return hash;
    },

    /**
    Sync method correlating to the "delete" operation
    
    @method _destroy
    @return {Object} The deleted object.
    @protected
    @since 3.6.0
    **/ 
    _destroy: function (options) {
        delete LocalSync._data[this.root][this.get('id')];
        this._save();
        return this.toJSON();
    },
    
    /**
    Saves the current in-memory store into a localStorage key/value pair
    
    @method _save
    @protected
    @since 3.6.0
    **/ 
    _save: function () {
        this.storage && this.storage.setItem(
            this.root,
            Y.JSON.stringify(LocalSync._data[this.root])
        );
    }
};

// -- Namespace ---------------------------------------------------------------

Y.namespace('ModelSync').Local = LocalSync;


}, '@VERSION@' ,{requires:['model', 'io-base', 'json-stringify']});
