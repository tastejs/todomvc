/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-core', function (Y, NAME) {

/**
The core implementation of the `DataTable` and `DataTable.Base` Widgets.

@module datatable
@submodule datatable-core
@since 3.5.0
**/

var INVALID = Y.Attribute.INVALID_VALUE,

    Lang         = Y.Lang,
    isFunction   = Lang.isFunction,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    isString     = Lang.isString,
    isNumber     = Lang.isNumber,

    toArray = Y.Array,

    keys = Y.Object.keys,

    Table;
    
/**
_API docs for this extension are included in the DataTable class._

Class extension providing the core API and structure for the DataTable Widget.

Use this class extension with Widget or another Base-based superclass to create
the basic DataTable model API and composing class structure.

@class DataTable.Core
@for DataTable
@since 3.5.0
**/
Table = Y.namespace('DataTable').Core = function () {};

Table.ATTRS = {
    /**
    Columns to include in the rendered table.
    
    If omitted, the attributes on the configured `recordType` or the first item
    in the `data` collection will be used as a source.

    This attribute takes an array of strings or objects (mixing the two is
    fine).  Each string or object is considered a column to be rendered.
    Strings are converted to objects, so `columns: ['first', 'last']` becomes
    `columns: [{ key: 'first' }, { key: 'last' }]`.

    DataTable.Core only concerns itself with a few properties of columns.
    These properties are:

    * `key` - Used to identify the record field/attribute containing content for
      this column.  Also used to create a default Model if no `recordType` or
      `data` are provided during construction.  If `name` is not specified, this
      is assigned to the `_id` property (with added incrementer if the key is
      used by multiple columns).
    * `children` - Traversed to initialize nested column objects
    * `name` - Used in place of, or in addition to, the `key`.  Useful for
      columns that aren't bound to a field/attribute in the record data.  This
      is assigned to the `_id` property.
    * `id` - For backward compatibility.  Implementers can specify the id of
      the header cell.  This should be avoided, if possible, to avoid the
      potential for creating DOM elements with duplicate IDs.
    * `field` - For backward compatibility.  Implementers should use `name`.
    * `_id` - Assigned unique-within-this-instance id for a column.  By order
      of preference, assumes the value of `name`, `key`, `id`, or `_yuid`.
      This is used by the rendering views as well as feature module
      as a means to identify a specific column without ambiguity (such as
      multiple columns using the same `key`.
    * `_yuid` - Guid stamp assigned to the column object.
    * `_parent` - Assigned to all child columns, referencing their parent
      column.

    @attribute columns
    @type {Object[]|String[]}
    @default (from `recordType` ATTRS or first item in the `data`)
    @since 3.5.0
    **/
    columns: {
        // TODO: change to setter to clone input array/objects
        validator: isArray,
        setter: '_setColumns',
        getter: '_getColumns'
    },

    /**
    Model subclass to use as the `model` for the ModelList stored in the `data`
    attribute.

    If not provided, it will try really hard to figure out what to use.  The
    following attempts will be made to set a default value:
    
    1. If the `data` attribute is set with a ModelList instance and its `model`
       property is set, that will be used.
    2. If the `data` attribute is set with a ModelList instance, and its
       `model` property is unset, but it is populated, the `ATTRS` of the
       `constructor of the first item will be used.
    3. If the `data` attribute is set with a non-empty array, a Model subclass
       will be generated using the keys of the first item as its `ATTRS` (see
       the `_createRecordClass` method).
    4. If the `columns` attribute is set, a Model subclass will be generated
       using the columns defined with a `key`. This is least desirable because
       columns can be duplicated or nested in a way that's not parsable.
    5. If neither `data` nor `columns` is set or populated, a change event
       subscriber will listen for the first to be changed and try all over
       again.

    @attribute recordType
    @type {Function}
    @default (see description)
    @since 3.5.0
    **/
    recordType: {
        getter: '_getRecordType',
        setter: '_setRecordType'
    },

    /**
    The collection of data records to display.  This attribute is a pass
    through to a `data` property, which is a ModelList instance.

    If this attribute is passed a ModelList or subclass, it will be assigned to
    the property directly.  If an array of objects is passed, a new ModelList
    will be created using the configured `recordType` as its `model` property
    and seeded with the array.

    Retrieving this attribute will return the ModelList stored in the `data`
    property.

    @attribute data
    @type {ModelList|Object[]}
    @default `new ModelList()`
    @since 3.5.0
    **/
    data: {
        valueFn: '_initData',
        setter : '_setData',
        lazyAdd: false
    },

    /**
    Content for the `<table summary="ATTRIBUTE VALUE HERE">`.  Values assigned
    to this attribute will be HTML escaped for security.

    @attribute summary
    @type {String}
    @default '' (empty string)
    @since 3.5.0
    **/
    //summary: {},

    /**
    HTML content of an optional `<caption>` element to appear above the table.
    Leave this config unset or set to a falsy value to remove the caption.

    @attribute caption
    @type HTML
    @default '' (empty string)
    @since 3.5.0
    **/
    //caption: {},

    /**
    Deprecated as of 3.5.0. Passes through to the `data` attribute.

    WARNING: `get('recordset')` will NOT return a Recordset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute recordset
    @type {Object[]|Recordset}
    @deprecated Use the `data` attribute
    @since 3.5.0
    **/
    recordset: {
        setter: '_setRecordset',
        getter: '_getRecordset',
        lazyAdd: false
    },

    /**
    Deprecated as of 3.5.0. Passes through to the `columns` attribute.

    WARNING: `get('columnset')` will NOT return a Columnset instance as of
    3.5.0.  This is a break in backward compatibility.

    @attribute columnset
    @type {Object[]}
    @deprecated Use the `columns` attribute
    @since 3.5.0
    **/
    columnset: {
        setter: '_setColumnset',
        getter: '_getColumnset',
        lazyAdd: false
    }
};

Y.mix(Table.prototype, {
    // -- Instance properties -------------------------------------------------
    /**
    The ModelList that manages the table's data.

    @property data
    @type {ModelList}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //data: null,

    // -- Public methods ------------------------------------------------------

    /**
    Gets the column configuration object for the given key, name, or index.  For
    nested columns, `name` can be an array of indexes, each identifying the index
    of that column in the respective parent's "children" array.

    If you pass a column object, it will be returned.

    For columns with keys, you can also fetch the column with
    `instance.get('columns.foo')`.

    @method getColumn
    @param {String|Number|Number[]} name Key, "name", index, or index array to
                identify the column
    @return {Object} the column configuration object
    @since 3.5.0
    **/
    getColumn: function (name) {
        var col, columns, i, len, cols;

        if (isObject(name) && !isArray(name)) {
            // TODO: support getting a column from a DOM node - this will cross
            // the line into the View logic, so it should be relayed

            // Assume an object passed in is already a column def
            col = name;
        } else {
            col = this.get('columns.' + name);
        }

        if (col) {
            return col;
        }

        columns = this.get('columns');

        if (isNumber(name) || isArray(name)) {
            name = toArray(name);
            cols = columns;

            for (i = 0, len = name.length - 1; cols && i < len; ++i) {
                cols = cols[name[i]] && cols[name[i]].children;
            }

            return (cols && cols[name[i]]) || null;
        }

        return null;
    },

    /**
    Returns the Model associated to the record `id`, `clientId`, or index (not
    row index).  If none of those yield a Model from the `data` ModelList, the
    arguments will be passed to the `view` instance's `getRecord` method
    if it has one.

    If no Model can be found, `null` is returned.

    @method getRecord
    @param {Number|String|Node} seed Record `id`, `clientId`, index, Node, or
        identifier for a row or child element
    @return {Model}
    @since 3.5.0
    **/
    getRecord: function (seed) {
        var record = this.data.getById(seed) || this.data.getByClientId(seed);

        if (!record) {
            if (isNumber(seed)) {
                record = this.data.item(seed);
            }
            
            // TODO: this should be split out to base somehow
            if (!record && this.view && this.view.getRecord) {
                record = this.view.getRecord.apply(this.view, arguments);
            }
        }

        return record || null;
    },

    // -- Protected and private properties and methods ------------------------

    /**
    This tells `Y.Base` that it should create ad-hoc attributes for config
    properties passed to DataTable's constructor. This is useful for setting
    configurations on the DataTable that are intended for the rendering View(s).

    @property _allowAdHocAttrs
    @type Boolean
    @default true
    @protected
    @since 3.6.0
    **/
    _allowAdHocAttrs: true,

    /**
    A map of column key to column configuration objects parsed from the
    `columns` attribute.

    @property _columnMap
    @type {Object}
    @default undefined (initially unset)
    @protected
    @since 3.5.0
    **/
    //_columnMap: null,

    /**
    The Node instance of the table containing the data rows.  This is set when
    the table is rendered.  It may also be set by progressive enhancement,
    though this extension does not provide the logic to parse from source.

    @property _tableNode
    @type {Node}
    @default undefined (initially unset)
    @protected
    @since 3.5.0
    **/
    //_tableNode: null,

    /**
    Updates the `_columnMap` property in response to changes in the `columns`
    attribute.

    @method _afterColumnsChange
    @param {EventFacade} e The `columnsChange` event object
    @protected
    @since 3.5.0
    **/
    _afterColumnsChange: function (e) {
        this._setColumnMap(e.newVal);
    },

    /**
    Updates the `modelList` attributes of the rendered views in response to the
    `data` attribute being assigned a new ModelList.

    @method _afterDataChange
    @param {EventFacade} e the `dataChange` event
    @protected
    @since 3.5.0
    **/
    _afterDataChange: function (e) {
        var modelList = e.newVal;

        this.data = e.newVal;

        if (!this.get('columns') && modelList.size()) {
            // TODO: this will cause a re-render twice because the Views are
            // subscribed to columnsChange
            this._initColumns();
        }
    },

    /**
    Assigns to the new recordType as the model for the data ModelList

    @method _afterRecordTypeChange
    @param {EventFacade} e recordTypeChange event
    @protected
    @since 3.6.0
    **/
    _afterRecordTypeChange: function (e) {
        var data = this.data.toJSON();

        this.data.model = e.newVal;

        this.data.reset(data);

        if (!this.get('columns') && data) {
            if (data.length) {
                this._initColumns();
            } else {
                this.set('columns', keys(e.newVal.ATTRS));
            }
        }
    },

    /**
    Creates a Model subclass from an array of attribute names or an object of
    attribute definitions.  This is used to generate a class suitable to
    represent the data passed to the `data` attribute if no `recordType` is
    set.

    @method _createRecordClass
    @param {String[]|Object} attrs Names assigned to the Model subclass's
                `ATTRS` or its entire `ATTRS` definition object
    @return {Model}
    @protected
    @since 3.5.0
    **/
    _createRecordClass: function (attrs) {
        var ATTRS, i, len;

        if (isArray(attrs)) {
            ATTRS = {};

            for (i = 0, len = attrs.length; i < len; ++i) {
                ATTRS[attrs[i]] = {};
            }
        } else if (isObject(attrs)) {
            ATTRS = attrs;
        }

        return Y.Base.create('record', Y.Model, [], null, { ATTRS: ATTRS });
    },

    /**
    Tears down the instance.

    @method destructor
    @protected
    @since 3.6.0
    **/
    destructor: function () {
        new Y.EventHandle(Y.Object.values(this._eventHandles)).detach();
    },

    /**
    The getter for the `columns` attribute.  Returns the array of column
    configuration objects if `instance.get('columns')` is called, or the
    specific column object if `instance.get('columns.columnKey')` is called.

    @method _getColumns
    @param {Object[]} columns The full array of column objects
    @param {String} name The attribute name requested
                         (e.g. 'columns' or 'columns.foo');
    @protected
    @since 3.5.0
    **/
    _getColumns: function (columns, name) {
        // Workaround for an attribute oddity (ticket #2529254)
        // getter is expected to return an object if get('columns.foo') is called.
        // Note 'columns.' is 8 characters
        return name.length > 8 ? this._columnMap : columns;
    },

    /**
    Relays the `get()` request for the deprecated `columnset` attribute to the
    `columns` attribute.

    THIS BREAKS BACKWARD COMPATIBILITY.  3.4.1 and prior implementations will
    expect a Columnset instance returned from `get('columnset')`.

    @method _getColumnset
    @param {Object} ignored The current value stored in the `columnset` state
    @param {String} name The attribute name requested
                         (e.g. 'columnset' or 'columnset.foo');
    @deprecated This will be removed with the `columnset` attribute in a future
                version.
    @protected
    @since 3.5.0
    **/
    _getColumnset: function (_, name) {
        return this.get(name.replace(/^columnset/, 'columns'));
    },

    /**
    Returns the Model class of the instance's `data` attribute ModelList.  If
    not set, returns the explicitly configured value.

    @method _getRecordType
    @param {Model} val The currently configured value
    @return {Model}
    **/
    _getRecordType: function (val) {
        // Prefer the value stored in the attribute because the attribute
        // change event defaultFn sets e.newVal = this.get('recordType')
        // before notifying the after() subs.  But if this getter returns
        // this.data.model, then after() subs would get e.newVal === previous
        // model before _afterRecordTypeChange can set
        // this.data.model = e.newVal
        return val || (this.data && this.data.model);
    },

    /**
    Initializes the `_columnMap` property from the configured `columns`
    attribute.  If `columns` is not set, but there are records in the `data`
    ModelList, use
    `ATTRS` of that class.

    @method _initColumns
    @protected
    @since 3.5.0
    **/
    _initColumns: function () {
        var columns = this.get('columns') || [],
            item;
        
        // Default column definition from the configured recordType
        if (!columns.length && this.data.size()) {
            // TODO: merge superclass attributes up to Model?
            item = this.data.item(0);

            if (item.toJSON) {
                item = item.toJSON();
            }

            this.set('columns', keys(item));
        }

        this._setColumnMap(columns);
    },

    /**
    Sets up the change event subscriptions to maintain internal state.

    @method _initCoreEvents
    @protected
    @since 3.6.0
    **/
    _initCoreEvents: function () {
        this._eventHandles.coreAttrChanges = this.after({
            columnsChange   : Y.bind('_afterColumnsChange', this),
            recordTypeChange: Y.bind('_afterRecordTypeChange', this),
            dataChange      : Y.bind('_afterDataChange', this)
        });
    },

    /**
    Defaults the `data` attribute to an empty ModelList if not set during
    construction.  Uses the configured `recordType` for the ModelList's `model`
    proeprty if set.

    @method _initData
    @protected
    @return {ModelList}
    @since 3.6.0
    **/
    _initData: function () {
        var recordType = this.get('recordType'),
            // TODO: LazyModelList if recordType doesn't have complex ATTRS
            modelList = new Y.ModelList();

        if (recordType) {
            modelList.model = recordType;
        }

        return modelList;
    },

    /**
    Initializes the instance's `data` property from the value of the `data`
    attribute.  If the attribute value is a ModelList, it is assigned directly
    to `this.data`.  If it is an array, a ModelList is created, its `model`
    property is set to the configured `recordType` class, and it is seeded with
    the array data.  This ModelList is then assigned to `this.data`.

    @method _initDataProperty
    @param {Array|ModelList|ArrayList} data Collection of data to populate the
            DataTable
    @protected
    @since 3.6.0
    **/
    _initDataProperty: function (data) {
        var recordType;

        if (!this.data) {
            recordType = this.get('recordType');

            if (data && data.each && data.toJSON) {
                this.data = data;

                if (recordType) {
                    this.data.model = recordType;
                }
            } else {
                // TODO: customize the ModelList or read the ModelList class
                // from a configuration option?
                this.data = new Y.ModelList();
                
                if (recordType) {
                    this.data.model = recordType;
                }
            }

            // TODO: Replace this with an event relay for specific events.
            // Using bubbling causes subscription conflicts with the models'
            // aggregated change event and 'change' events from DOM elements
            // inside the table (via Widget UI event).
            this.data.addTarget(this);
        }
    },

    /**
    Initializes the columns, `recordType` and data ModelList.

    @method initializer
    @param {Object} config Configuration object passed to constructor
    @protected
    @since 3.5.0
    **/
    initializer: function (config) {
        var data       = config.data,
            columns    = config.columns,
            recordType;

        // Referencing config.data to allow _setData to be more stringent
        // about its behavior
        this._initDataProperty(data);

        // Default columns from recordType ATTRS if recordType is supplied at
        // construction.  If no recordType is supplied, but the data is
        // supplied as a non-empty array, use the keys of the first item
        // as the columns.
        if (!columns) {
            recordType = (config.recordType || config.data === this.data) &&
                            this.get('recordType');

            if (recordType) {
                columns = keys(recordType.ATTRS);
            } else if (isArray(data) && data.length) {
                columns = keys(data[0]);
            }

            if (columns) {
                this.set('columns', columns);
            }
        }

        this._initColumns();

        this._eventHandles = {};

        this._initCoreEvents();
    },

    /**
    Iterates the array of column configurations to capture all columns with a
    `key` property.  An map is built with column keys as the property name and
    the corresponding column object as the associated value.  This map is then
    assigned to the instance's `_columnMap` property.

    @method _setColumnMap
    @param {Object[]|String[]} columns The array of column config objects
    @protected
    @since 3.6.0
    **/
    _setColumnMap: function (columns) {
        var map = {};
        
        function process(cols) {
            var i, len, col, key;

            for (i = 0, len = cols.length; i < len; ++i) {
                col = cols[i];
                key = col.key;

                // First in wins for multiple columns with the same key
                // because the first call to genId (in _setColumns) will
                // return the same key, which will then be overwritten by the
                // subsequent same-keyed column.  So table.getColumn(key) would
                // return the last same-keyed column.
                if (key && !map[key]) {
                    map[key] = col;
                }

                //TODO: named columns can conflict with keyed columns
                map[col._id] = col;

                if (col.children) {
                    process(col.children);
                }
            }
        }

        process(columns);

        this._columnMap = map;
    },

    /**
    Translates string columns into objects with that string as the value of its
    `key` property.

    All columns are assigned a `_yuid` stamp and `_id` property corresponding
    to the column's configured `name` or `key` property with any spaces
    replaced with dashes.  If the same `name` or `key` appears in multiple
    columns, subsequent appearances will have their `_id` appended with an
    incrementing number (e.g. if column "foo" is included in the `columns`
    attribute twice, the first will get `_id` of "foo", and the second an `_id`
    of "foo1").  Columns that are children of other columns will have the
    `_parent` property added, assigned the column object to which they belong.

    @method _setColumns
    @param {null|Object[]|String[]} val Array of config objects or strings
    @return {null|Object[]}
    @protected
    **/
    _setColumns: function (val) {
        var keys = {},
            known = [],
            knownCopies = [],
            arrayIndex = Y.Array.indexOf;
        
        function copyObj(o) {
            var copy = {},
                key, val, i;

            known.push(o);
            knownCopies.push(copy);

            for (key in o) {
                if (o.hasOwnProperty(key)) {
                    val = o[key];

                    if (isArray(val)) {
                        copy[key] = val.slice();
                    } else if (isObject(val, true)) {
                        i = arrayIndex(val, known);

                        copy[key] = i === -1 ? copyObj(val) : knownCopies[i];
                    } else {
                        copy[key] = o[key];
                    }
                }
            }

            return copy;
        }

        function genId(name) {
            // Sanitize the name for use in generated CSS classes.
            // TODO: is there more to do for other uses of _id?
            name = name.replace(/\s+/, '-');

            if (keys[name]) {
                name += (keys[name]++);
            } else {
                keys[name] = 1;
            }

            return name;
        }

        function process(cols, parent) {
            var columns = [],
                i, len, col, yuid;

            for (i = 0, len = cols.length; i < len; ++i) {
                columns[i] = // chained assignment
                col = isString(cols[i]) ? { key: cols[i] } : copyObj(cols[i]);

                yuid = Y.stamp(col);

                // For backward compatibility
                if (!col.id) {
                    // Implementers can shoot themselves in the foot by setting
                    // this config property to a non-unique value
                    col.id = yuid;
                }
                if (col.field) {
                    // Field is now known as "name" to avoid confusion with data
                    // fields or schema.resultFields
                    col.name = col.field;
                }

                if (parent) {
                    col._parent = parent;
                } else {
                    delete col._parent;
                }

                // Unique id based on the column's configured name or key,
                // falling back to the yuid.  Duplicates will have a counter
                // added to the end.
                col._id = genId(col.name || col.key || col.id);

                if (isArray(col.children)) {
                    col.children = process(col.children, col);
                }
            }

            return columns;
        }

        return val && process(val);
    },

    /**
    Relays attribute assignments of the deprecated `columnset` attribute to the
    `columns` attribute.  If a Columnset is object is passed, its basic object
    structure is mined.

    @method _setColumnset
    @param {Array|Columnset} val The columnset value to relay
    @deprecated This will be removed with the deprecated `columnset` attribute
                in a later version.
    @protected
    @since 3.5.0
    **/
    _setColumnset: function (val) {
        this.set('columns', val);

        return isArray(val) ? val : INVALID;
    },

    /**
    Accepts an object with `each` and `getAttrs` (preferably a ModelList or
    subclass) or an array of data objects.  If an array is passes, it will
    create a ModelList to wrap the data.  In doing so, it will set the created
    ModelList's `model` property to the class in the `recordType` attribute,
    which will be defaulted if not yet set.

    If the `data` property is already set with a ModelList, passing an array as
    the value will call the ModelList's `reset()` method with that array rather
    than replacing the stored ModelList wholesale.

    Any non-ModelList-ish and non-array value is invalid.

    @method _setData
    @protected
    @since 3.5.0
    **/
    _setData: function (val) {
        if (val === null) {
            val = [];
        }

        if (isArray(val)) {
            this._initDataProperty();

            // silent to prevent subscribers to both reset and dataChange
            // from reacting to the change twice.
            // TODO: would it be better to return INVALID to silence the
            // dataChange event, or even allow both events?
            this.data.reset(val, { silent: true });

            // Return the instance ModelList to avoid storing unprocessed
            // data in the state and their vivified Model representations in
            // the instance's data property.  Decreases memory consumption.
            val = this.data;
        } else if (!val || !val.each || !val.toJSON) {
            // ModelList/ArrayList duck typing
            val = INVALID;
        }

        return val;
    },

    /**
    Relays the value assigned to the deprecated `recordset` attribute to the
    `data` attribute.  If a Recordset instance is passed, the raw object data
    will be culled from it.

    @method _setRecordset
    @param {Object[]|Recordset} val The recordset value to relay
    @deprecated This will be removed with the deprecated `recordset` attribute
                in a later version.
    @protected
    @since 3.5.0
    **/
    _setRecordset: function (val) {
        var data;

        if (val && Y.Recordset && val instanceof Y.Recordset) {
            data = [];
            val.each(function (record) {
                data.push(record.get('data'));
            });
            val = data;
        }

        this.set('data', val);

        return val;
    },

    /**
    Accepts a Base subclass (preferably a Model subclass). Alternately, it will
    generate a custom Model subclass from an array of attribute names or an
    object defining attributes and their respective configurations (it is
    assigned as the `ATTRS` of the new class).

    Any other value is invalid.

    @method _setRecordType
    @param {Function|String[]|Object} val The Model subclass, array of
            attribute names, or the `ATTRS` definition for a custom model
            subclass
    @return {Function} A Base/Model subclass
    @protected
    @since 3.5.0
    **/
    _setRecordType: function (val) {
        var modelClass;

        // Duck type based on known/likely consumed APIs
        if (isFunction(val) && val.prototype.toJSON && val.prototype.setAttrs) {
            modelClass = val;
        } else if (isObject(val)) {
            modelClass = this._createRecordClass(val);
        }

        return modelClass || INVALID;
    }

});


}, '3.7.3', {"requires": ["escape", "model-list", "node-event-delegate"]});
