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
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatable-mutable/datatable-mutable.js",
    code: []
};
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"].code=["YUI.add('datatable-mutable', function (Y, NAME) {","","/**","Adds mutation convenience methods such as `table.addRow(data)` to `Y.DataTable`. (or other built class).","","@module datatable","@submodule datatable-mutable","@since 3.5.0","**/","var toArray = Y.Array,","    YLang   = Y.Lang,","    isString = YLang.isString,","    isArray  = YLang.isArray,","    isObject = YLang.isObject,","    isNumber = YLang.isNumber,","    arrayIndex = Y.Array.indexOf,","    Mutable;","","/**","_API docs for this extension are included in the DataTable class._","","Class extension to add mutation convenience methods to `Y.DataTable` (or other","built class).","","Column mutation methods are paired with new custom events:",""," * addColumn"," * removeColumn"," * modifyColumn"," * moveColumn","","Row mutation events are bubbled from the DataTable's `data` ModelList through","the DataTable instance.","","@class DataTable.Mutable","@for DataTable","@since 3.5.0","**/","Y.namespace('DataTable').Mutable = Mutable = function () {};","","Mutable.ATTRS = {","    /**","    Controls whether `addRow`, `removeRow`, and `modifyRow` should trigger the","    underlying Model's sync layer by default.","","    When `true`, it is unnecessary to pass the \"sync\" configuration property to","    those methods to trigger per-operation sync.","","","    @attribute autoSync","    @type {Boolean}","    @default `false`","    @since 3.5.0","    **/","    autoSync: {","        value: false,","        validator: YLang.isBoolean","    }","};","","Y.mix(Mutable.prototype, {","    /**","    Adds the column configuration to the DataTable's `columns` configuration.","    If the `index` parameter is supplied, it is injected at that index.  If the","    table has nested headers, inject a subcolumn by passing an array of indexes","    to identify the new column's final location.","","    The `index` parameter is required if adding a nested column.","","    This method is a convienience method for fetching the DataTable's `columns`","    attribute, updating it, and calling ","    `table.set('columns', _updatedColumnsDefs_)`","","    For example:","","    <pre><code>// Becomes last column","    table.addColumn('name');","","    // Inserted after the current second column, moving the current third column","    // to index 4","    table.addColumn({ key: 'price', formatter: currencyFormatter }, 2 );","","    // Insert a new column in a set of headers three rows deep.  The index array","    // translates to","    // [ 2, --  in the third column's children","    //   1, --  in the second child's children","    //   3 ] -- as the fourth child column","    table.addColumn({ key: 'age', sortable: true }, [ 2, 1, 3 ]);","    </code></pre>","","    @method addColumn","    @param {Object|String} config The new column configuration object","    @param {Number|Number[]} [index] the insertion index","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    addColumn: function (config, index) {","        if (isString(config)) {","            config = { key: config };","        }","","        if (config) {","            if (arguments.length < 2 || (!isNumber(index) && !isArray(index))) {","                index = this.get('columns').length;","            }","","            this.fire('addColumn', {","                column: config,","                index: index","            });","        }","        return this;","    },","","    /**","    Updates an existing column definition. Fires the `modifyColumn` event.","","    For example:","","    <pre><code>// Add a formatter to the existing 'price' column definition","    table.modifyColumn('price', { formatter: currencyFormatter });","","    // Change the label on a header cell in a set of nested headers three rows","    // deep.  The index array translates to","    // [ 2,  -- in the third column's children","    //   1,  -- the second child","    //   3 ] -- the fourth child column","    table.modifyColumn([2, 1, 3], { label: 'Experience' });","    </code></pre>","","    @method modifyColumn","    @param {String|Number|Number[]|Object} name The column key, name, index, or","                current configuration object","    @param {Object} config The new column configuration properties","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    modifyColumn: function (name, config) {","        if (isString(config)) {","            config = { key: config };","        }","","        if (isObject(config)) {","            this.fire('modifyColumn', {","                column: name,","                newColumnDef: config","            });","        }","","        return this;","    },","","    /**","    Moves an existing column to a new location. Fires the `moveColumn` event.","","    The destination index can be a number or array of numbers to place a column","    header in a nested header row.","","    @method moveColumn","    @param {String|Number|Number[]|Object} name The column key, name, index, or","                current configuration object","    @param {Number|Number[]} index The destination index of the column","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    moveColumn: function (name, index) {","        if (name !== undefined && (isNumber(index) || isArray(index))) {","            this.fire('moveColumn', {","                column: name,","                index: index","            });","        }","","        return this;","    },","","    /**","    Removes an existing column. Fires the `removeColumn` event.","","    @method removeColumn","    @param {String|Number|Number[]|Object} name The column key, name, index, or","                current configuration object","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    removeColumn: function (name) {","        if (name !== undefined) {","            this.fire('removeColumn', {","                column: name","            });","        }","","        return this;","    },","","    /**","    Adds a new record to the DataTable's `data` ModelList.  Record data can be","    an object of field values or an instance of the DataTable's configured","    `recordType` class.","","    This relays all parameters to the `data` ModelList's `add` method.","","    If a configuration object is passed as a second argument, and that object","    has `sync: true` set, the underlying Model will be `save()`d.","","    If the DataTable's `autoSync` attribute is set to `true`, the additional","    argument is not needed.","","    If syncing and the last argument is a function, that function will be used","    as a callback to the Model's `save()` method.","","    @method addRow","    @param {Object} data The data or Model instance for the new record","    @param {Object} [config] Configuration to pass along","    @param {Function} [callback] Callback function for Model's `save()`","      @param {Error|null} callback.err If an error occurred or validation","        failed, this parameter will contain the error. If the sync operation","        succeeded, _err_ will be `null`.","      @param {Any} callback.response The server's response. This value will","        be passed to the `parse()` method, which is expected to parse it and","        return an attribute hash.","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    addRow: function (data, config) {","        // Allow autoSync: true + addRow({ data }, { sync: false })","        var sync = (config && ('sync' in config)) ?","                config.sync :","                this.get('autoSync'),","            models, model, i, len, args;","","        if (data && this.data) {","            models = this.data.add.apply(this.data, arguments);","","            if (sync) {","                models = toArray(models);","                args   = toArray(arguments, 1, true);","","                for (i = 0, len = models.length; i < len; ++i) {","                    model = models[i];","","                    if (model.isNew()) {","                        models[i].save.apply(models[i], args);","                    }","                }","            }","        }","","        return this;","    },","","    /**","    Removes a record from the DataTable's `data` ModelList.  The record can be","    provided explicitly or targeted by it's `id` (see ModelList's `getById`","    method), `clientId`, or index in the ModelList.","","    After locating the target Model, this relays the Model and all other passed","    arguments to the `data` ModelList's `remove` method.","","    If a configuration object is passed as a second argument, and that object","    has `sync: true` set, the underlying Model will be destroyed, passing","    `{ delete: true }` to trigger calling the Model's sync layer.","","    If the DataTable's `autoSync` attribute is set to `true`, the additional","    argument is not needed.","","    If syncing and the last argument is a function, that function will be used","    as a callback to the Model's `destroy()` method.","","    @method removeRow","    @param {Object|String|Number} id The Model instance or identifier ","    @param {Object} [config] Configuration to pass along","    @param {Function} [callback] Callback function for Model's `save()`","      @param {Error|null} callback.err If an error occurred or validation","        failed, this parameter will contain the error. If the sync operation","        succeeded, _err_ will be `null`.","      @param {Any} callback.response The server's response. This value will","        be passed to the `parse()` method, which is expected to parse it and","        return an attribute hash.","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    removeRow: function (id, config) {","        var modelList = this.data,","            // Allow autoSync: true + addRow({ data }, { sync: false })","            sync      = (config && ('sync' in config)) ?","                            config.sync :","                            this.get('autoSync'),","            models, model, i, len, args;","","        // TODO: support removing via DOM element. This should be relayed to View","        if (isObject(id) && id instanceof this.get('recordType')) {","            model = id;","        } else if (modelList && id !== undefined) {","            model = modelList.getById(id) ||","                    modelList.getByClientId(id) ||","                    modelList.item(id);","        }","","        if (model) {","            args = toArray(arguments, 1, true);","","            models = modelList.remove.apply(modelList,","                [model].concat(args));","","            if (sync) {","                if (!isObject(args[0])) {","                    args.unshift({});","                }","","                args[0]['delete'] = true;","","                models = toArray(models);","","                for (i = 0, len = models.length; i < len; ++i) {","                    model = models[i];","                    model.destroy.apply(model, args);","                }","            }","        }","","        return this;","    },","","    /**","    Updates an existing record in the DataTable's `data` ModelList.  The record","    can be provided explicitly or targeted by it's `id` (see ModelList's","    `getById` method), `clientId`, or index in the ModelList.","","    After locating the target Model, this relays the all other passed","    arguments to the Model's `setAttrs` method.","","    If a configuration object is passed as a second argument, and that object","    has `sync: true` set, the underlying Model will be `save()`d.","","    If the DataTable's `autoSync` attribute is set to `true`, the additional","    argument is not needed.","","    If syncing and the last argument is a function, that function will be used","    as a callback to the Model's `save()` method.","","    @method modifyRow","    @param {Object|String|Number} id The Model instance or identifier ","    @param {Object} data New data values for the Model","    @param {Object} [config] Configuration to pass along to `setAttrs()`","    @param {Function} [callback] Callback function for Model's `save()`","      @param {Error|null} callback.err If an error occurred or validation","        failed, this parameter will contain the error. If the sync operation","        succeeded, _err_ will be `null`.","      @param {Any} callback.response The server's response. This value will","        be passed to the `parse()` method, which is expected to parse it and","        return an attribute hash.","    @return {DataTable}","    @chainable","    @since 3.5.0","    **/","    modifyRow: function (id, data, config) {","        var modelList = this.data,","            // Allow autoSync: true + addRow({ data }, { sync: false })","            sync      = (config && ('sync' in config)) ?","                            config.sync :","                            this.get('autoSync'),","            model, args;","","        if (isObject(id) && id instanceof this.get('recordType')) {","            model = id;","        } else if (modelList && id !== undefined) {","            model = modelList.getById(id) ||","                    modelList.getByClientId(id) ||","                    modelList.item(id);","        }","","        if (model && isObject(data)) {","            args = toArray(arguments, 1, true);","","            model.setAttrs.apply(model, args);","","            if (sync && !model.isNew()) {","                model.save.apply(model, args);","            }","        }","","        return this;","    },","","    // --------------------------------------------------------------------------","    // Protected properties and methods","    // --------------------------------------------------------------------------","","    /**","    Default function for the `addColumn` event.","","    Inserts the specified column at the provided index.","","    @method _defAddColumnFn","    @param {EventFacade} e The `addColumn` event","        @param {Object} e.column The new column definition object","        @param {Number|Number[]} e.index The array index to insert the new column","    @protected","    @since 3.5.0","    **/","    _defAddColumnFn: function (e) {","        var index   = toArray(e.index),","            columns = this.get('columns'),","            cols    = columns,","            i, len;","","        for (i = 0, len = index.length - 1; cols && i < len; ++i) {","            cols = cols[index[i]] && cols[index[i]].children;","        }","","        if (cols) {","            cols.splice(index[i], 0, e.column);","","            this.set('columns', columns, { originEvent: e });","        }","    },","","    /**","    Default function for the `modifyColumn` event.","","    Mixes the new column properties into the specified column definition.","","    @method _defModifyColumnFn","    @param {EventFacade} e The `modifyColumn` event","        @param {Object|String|Number|Number[]} e.column The column definition object or identifier","        @param {Object} e.newColumnDef The properties to assign to the column","    @protected","    @since 3.5.0","    **/","    _defModifyColumnFn: function (e) {","        var columns = this.get('columns'),","            column  = this.getColumn(e.column);","","        if (column) {","            Y.mix(column, e.newColumnDef, true);","            ","            this.set('columns', columns, { originEvent: e });","        }","    },","","    /**","    Default function for the `moveColumn` event.","","    Removes the specified column from its current location and inserts it at the","    specified array index (may be an array of indexes for nested headers).","","    @method _defMoveColumnFn","    @param {EventFacade} e The `moveColumn` event","        @param {Object|String|Number|Number[]} e.column The column definition object or identifier","        @param {Object} e.index The destination index to move to","    @protected","    @since 3.5.0","    **/","    _defMoveColumnFn: function (e) {","        var columns = this.get('columns'),","            column  = this.getColumn(e.column),","            toIndex = toArray(e.index),","            fromCols, fromIndex, toCols, i, len;","","        if (column) {","            fromCols  = column._parent ? column._parent.children : columns;","            fromIndex = arrayIndex(fromCols, column);","","            if (fromIndex > -1) {","                toCols = columns;","","                for (i = 0, len = toIndex.length - 1; toCols && i < len; ++i) {","                    toCols = toCols[toIndex[i]] && toCols[toIndex[i]].children;","                }","","                if (toCols) {","                    len = toCols.length;","                    fromCols.splice(fromIndex, 1);","                    toIndex = toIndex[i];","","                    if (len > toCols.lenth) {","                        // spliced off the same array, so adjust destination","                        // index if necessary","                        if (fromIndex < toIndex) {","                            toIndex--;","                        }","                    }","","                    toCols.splice(toIndex, 0, column);","","                    this.set('columns', columns, { originEvent: e });","                }","            }","        }","    },","","    /**","    Default function for the `removeColumn` event.","","    Splices the specified column from its containing columns array.","","    @method _defRemoveColumnFn","    @param {EventFacade} e The `removeColumn` event","        @param {Object|String|Number|Number[]} e.column The column definition object or identifier","    @protected","    @since 3.5.0","    **/","    _defRemoveColumnFn: function (e) {","        var columns = this.get('columns'),","            column  = this.getColumn(e.column),","            cols, index;","","        if (column) {","            cols = column._parent ? column._parent.children : columns;","            index = Y.Array.indexOf(cols, column);","","            if (index > -1) {","                cols.splice(index, 1);","","                this.set('columns', columns, { originEvent: e });","            }","        }","    },","","    /**","    Publishes the events used by the mutation methods:","","     * addColumn","     * removeColumn","     * modifyColumn","     * moveColumn","","    @method initializer","    @protected","    @since 3.5.0","    **/","    initializer: function () {","        this.publish({","            addColumn:    { defaultFn: Y.bind('_defAddColumnFn', this) },","            removeColumn: { defaultFn: Y.bind('_defRemoveColumnFn', this) },","            moveColumn:   { defaultFn: Y.bind('_defMoveColumnFn', this) },","            modifyColumn: { defaultFn: Y.bind('_defModifyColumnFn', this) }","        });","    }","});","","/**","Adds an array of new records to the DataTable's `data` ModelList.  Record data","can be an array of objects containing field values or an array of instance of","the DataTable's configured `recordType` class.","","This relays all parameters to the `data` ModelList's `add` method.","","Technically, this is an alias to `addRow`, but please use the appropriately","named method for readability.","","If a configuration object is passed as a second argument, and that object","has `sync: true` set, the underlying Models will be `save()`d.","","If the DataTable's `autoSync` attribute is set to `true`, the additional","argument is not needed.","","If syncing and the last argument is a function, that function will be used","as a callback to each Model's `save()` method.","","@method addRows","@param {Object[]} data The data or Model instances to add","@param {Object} [config] Configuration to pass along","@param {Function} [callback] Callback function for each Model's `save()`","  @param {Error|null} callback.err If an error occurred or validation","    failed, this parameter will contain the error. If the sync operation","    succeeded, _err_ will be `null`.","  @param {Any} callback.response The server's response. This value will","    be passed to the `parse()` method, which is expected to parse it and","    return an attribute hash.","@return {DataTable}","@chainable","@since 3.5.0","**/","Mutable.prototype.addRows = Mutable.prototype.addRow;","","// Add feature APIs to public Y.DataTable class","if (YLang.isFunction(Y.DataTable)) {","    Y.Base.mix(Y.DataTable, [Mutable]);","}","","/**","Fired by the `addColumn` method.","","@event addColumn","@preventable _defAddColumnFn","@param {Object} column The new column definition object","@param {Number|Number[]} index The array index to insert the new column","@since 3.5.0","**/","","/**","Fired by the `removeColumn` method.","","@event removeColumn","@preventable _defRemoveColumnFn","@param {Object|String|Number|Number[]} column The column definition object or identifier","@since 3.5.0","**/","","/**","Fired by the `modifyColumn` method.","","@event modifyColumn","@preventable _defModifyColumnFn","@param {Object|String|Number|Number[]} column The column definition object or identifier","@param {Object} newColumnDef The properties to assign to the column","@since 3.5.0","**/","","/**","Fired by the `moveColumn` method.","","@event moveColumn","@preventable _defMoveColumnFn","@param {Object|String|Number|Number[]} column The column definition object or identifier","@param {Object} index The destination index to move to","@since 3.5.0","**/","","","","}, '3.7.3', {\"requires\": [\"datatable-base\"]});"];
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"].lines = {"1":0,"10":0,"39":0,"41":0,"61":0,"99":0,"100":0,"103":0,"104":0,"105":0,"108":0,"113":0,"141":0,"142":0,"145":0,"146":0,"152":0,"170":0,"171":0,"177":0,"191":0,"192":0,"197":0,"232":0,"237":0,"238":0,"240":0,"241":0,"242":0,"244":0,"245":0,"247":0,"248":0,"254":0,"290":0,"298":0,"299":0,"300":0,"301":0,"306":0,"307":0,"309":0,"312":0,"313":0,"314":0,"317":0,"319":0,"321":0,"322":0,"323":0,"328":0,"364":0,"371":0,"372":0,"373":0,"374":0,"379":0,"380":0,"382":0,"384":0,"385":0,"389":0,"409":0,"414":0,"415":0,"418":0,"419":0,"421":0,"438":0,"441":0,"442":0,"444":0,"462":0,"467":0,"468":0,"469":0,"471":0,"472":0,"474":0,"475":0,"478":0,"479":0,"480":0,"481":0,"483":0,"486":0,"487":0,"491":0,"493":0,"511":0,"515":0,"516":0,"517":0,"519":0,"520":0,"522":0,"540":0,"582":0,"585":0,"586":0};
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"].functions = {"addColumn:98":0,"modifyColumn:140":0,"moveColumn:169":0,"removeColumn:190":0,"addRow:230":0,"removeRow:289":0,"modifyRow:363":0,"_defAddColumnFn:408":0,"_defModifyColumnFn:437":0,"_defMoveColumnFn:461":0,"_defRemoveColumnFn:510":0,"initializer:539":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"].coveredLines = 100;
_yuitest_coverage["build/datatable-mutable/datatable-mutable.js"].coveredFunctions = 13;
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 1);
YUI.add('datatable-mutable', function (Y, NAME) {

/**
Adds mutation convenience methods such as `table.addRow(data)` to `Y.DataTable`. (or other built class).

@module datatable
@submodule datatable-mutable
@since 3.5.0
**/
_yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 10);
var toArray = Y.Array,
    YLang   = Y.Lang,
    isString = YLang.isString,
    isArray  = YLang.isArray,
    isObject = YLang.isObject,
    isNumber = YLang.isNumber,
    arrayIndex = Y.Array.indexOf,
    Mutable;

/**
_API docs for this extension are included in the DataTable class._

Class extension to add mutation convenience methods to `Y.DataTable` (or other
built class).

Column mutation methods are paired with new custom events:

 * addColumn
 * removeColumn
 * modifyColumn
 * moveColumn

Row mutation events are bubbled from the DataTable's `data` ModelList through
the DataTable instance.

@class DataTable.Mutable
@for DataTable
@since 3.5.0
**/
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 39);
Y.namespace('DataTable').Mutable = Mutable = function () {};

_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 41);
Mutable.ATTRS = {
    /**
    Controls whether `addRow`, `removeRow`, and `modifyRow` should trigger the
    underlying Model's sync layer by default.

    When `true`, it is unnecessary to pass the "sync" configuration property to
    those methods to trigger per-operation sync.


    @attribute autoSync
    @type {Boolean}
    @default `false`
    @since 3.5.0
    **/
    autoSync: {
        value: false,
        validator: YLang.isBoolean
    }
};

_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 61);
Y.mix(Mutable.prototype, {
    /**
    Adds the column configuration to the DataTable's `columns` configuration.
    If the `index` parameter is supplied, it is injected at that index.  If the
    table has nested headers, inject a subcolumn by passing an array of indexes
    to identify the new column's final location.

    The `index` parameter is required if adding a nested column.

    This method is a convienience method for fetching the DataTable's `columns`
    attribute, updating it, and calling 
    `table.set('columns', _updatedColumnsDefs_)`

    For example:

    <pre><code>// Becomes last column
    table.addColumn('name');

    // Inserted after the current second column, moving the current third column
    // to index 4
    table.addColumn({ key: 'price', formatter: currencyFormatter }, 2 );

    // Insert a new column in a set of headers three rows deep.  The index array
    // translates to
    // [ 2, --  in the third column's children
    //   1, --  in the second child's children
    //   3 ] -- as the fourth child column
    table.addColumn({ key: 'age', sortable: true }, [ 2, 1, 3 ]);
    </code></pre>

    @method addColumn
    @param {Object|String} config The new column configuration object
    @param {Number|Number[]} [index] the insertion index
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    addColumn: function (config, index) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "addColumn", 98);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 99);
if (isString(config)) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 100);
config = { key: config };
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 103);
if (config) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 104);
if (arguments.length < 2 || (!isNumber(index) && !isArray(index))) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 105);
index = this.get('columns').length;
            }

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 108);
this.fire('addColumn', {
                column: config,
                index: index
            });
        }
        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 113);
return this;
    },

    /**
    Updates an existing column definition. Fires the `modifyColumn` event.

    For example:

    <pre><code>// Add a formatter to the existing 'price' column definition
    table.modifyColumn('price', { formatter: currencyFormatter });

    // Change the label on a header cell in a set of nested headers three rows
    // deep.  The index array translates to
    // [ 2,  -- in the third column's children
    //   1,  -- the second child
    //   3 ] -- the fourth child column
    table.modifyColumn([2, 1, 3], { label: 'Experience' });
    </code></pre>

    @method modifyColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Object} config The new column configuration properties
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    modifyColumn: function (name, config) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "modifyColumn", 140);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 141);
if (isString(config)) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 142);
config = { key: config };
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 145);
if (isObject(config)) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 146);
this.fire('modifyColumn', {
                column: name,
                newColumnDef: config
            });
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 152);
return this;
    },

    /**
    Moves an existing column to a new location. Fires the `moveColumn` event.

    The destination index can be a number or array of numbers to place a column
    header in a nested header row.

    @method moveColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @param {Number|Number[]} index The destination index of the column
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    moveColumn: function (name, index) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "moveColumn", 169);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 170);
if (name !== undefined && (isNumber(index) || isArray(index))) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 171);
this.fire('moveColumn', {
                column: name,
                index: index
            });
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 177);
return this;
    },

    /**
    Removes an existing column. Fires the `removeColumn` event.

    @method removeColumn
    @param {String|Number|Number[]|Object} name The column key, name, index, or
                current configuration object
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    removeColumn: function (name) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "removeColumn", 190);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 191);
if (name !== undefined) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 192);
this.fire('removeColumn', {
                column: name
            });
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 197);
return this;
    },

    /**
    Adds a new record to the DataTable's `data` ModelList.  Record data can be
    an object of field values or an instance of the DataTable's configured
    `recordType` class.

    This relays all parameters to the `data` ModelList's `add` method.

    If a configuration object is passed as a second argument, and that object
    has `sync: true` set, the underlying Model will be `save()`d.

    If the DataTable's `autoSync` attribute is set to `true`, the additional
    argument is not needed.

    If syncing and the last argument is a function, that function will be used
    as a callback to the Model's `save()` method.

    @method addRow
    @param {Object} data The data or Model instance for the new record
    @param {Object} [config] Configuration to pass along
    @param {Function} [callback] Callback function for Model's `save()`
      @param {Error|null} callback.err If an error occurred or validation
        failed, this parameter will contain the error. If the sync operation
        succeeded, _err_ will be `null`.
      @param {Any} callback.response The server's response. This value will
        be passed to the `parse()` method, which is expected to parse it and
        return an attribute hash.
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    addRow: function (data, config) {
        // Allow autoSync: true + addRow({ data }, { sync: false })
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "addRow", 230);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 232);
var sync = (config && ('sync' in config)) ?
                config.sync :
                this.get('autoSync'),
            models, model, i, len, args;

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 237);
if (data && this.data) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 238);
models = this.data.add.apply(this.data, arguments);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 240);
if (sync) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 241);
models = toArray(models);
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 242);
args   = toArray(arguments, 1, true);

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 244);
for (i = 0, len = models.length; i < len; ++i) {
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 245);
model = models[i];

                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 247);
if (model.isNew()) {
                        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 248);
models[i].save.apply(models[i], args);
                    }
                }
            }
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 254);
return this;
    },

    /**
    Removes a record from the DataTable's `data` ModelList.  The record can be
    provided explicitly or targeted by it's `id` (see ModelList's `getById`
    method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the Model and all other passed
    arguments to the `data` ModelList's `remove` method.

    If a configuration object is passed as a second argument, and that object
    has `sync: true` set, the underlying Model will be destroyed, passing
    `{ delete: true }` to trigger calling the Model's sync layer.

    If the DataTable's `autoSync` attribute is set to `true`, the additional
    argument is not needed.

    If syncing and the last argument is a function, that function will be used
    as a callback to the Model's `destroy()` method.

    @method removeRow
    @param {Object|String|Number} id The Model instance or identifier 
    @param {Object} [config] Configuration to pass along
    @param {Function} [callback] Callback function for Model's `save()`
      @param {Error|null} callback.err If an error occurred or validation
        failed, this parameter will contain the error. If the sync operation
        succeeded, _err_ will be `null`.
      @param {Any} callback.response The server's response. This value will
        be passed to the `parse()` method, which is expected to parse it and
        return an attribute hash.
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    removeRow: function (id, config) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "removeRow", 289);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 290);
var modelList = this.data,
            // Allow autoSync: true + addRow({ data }, { sync: false })
            sync      = (config && ('sync' in config)) ?
                            config.sync :
                            this.get('autoSync'),
            models, model, i, len, args;

        // TODO: support removing via DOM element. This should be relayed to View
        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 298);
if (isObject(id) && id instanceof this.get('recordType')) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 299);
model = id;
        } else {_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 300);
if (modelList && id !== undefined) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 301);
model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }}

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 306);
if (model) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 307);
args = toArray(arguments, 1, true);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 309);
models = modelList.remove.apply(modelList,
                [model].concat(args));

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 312);
if (sync) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 313);
if (!isObject(args[0])) {
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 314);
args.unshift({});
                }

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 317);
args[0]['delete'] = true;

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 319);
models = toArray(models);

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 321);
for (i = 0, len = models.length; i < len; ++i) {
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 322);
model = models[i];
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 323);
model.destroy.apply(model, args);
                }
            }
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 328);
return this;
    },

    /**
    Updates an existing record in the DataTable's `data` ModelList.  The record
    can be provided explicitly or targeted by it's `id` (see ModelList's
    `getById` method), `clientId`, or index in the ModelList.

    After locating the target Model, this relays the all other passed
    arguments to the Model's `setAttrs` method.

    If a configuration object is passed as a second argument, and that object
    has `sync: true` set, the underlying Model will be `save()`d.

    If the DataTable's `autoSync` attribute is set to `true`, the additional
    argument is not needed.

    If syncing and the last argument is a function, that function will be used
    as a callback to the Model's `save()` method.

    @method modifyRow
    @param {Object|String|Number} id The Model instance or identifier 
    @param {Object} data New data values for the Model
    @param {Object} [config] Configuration to pass along to `setAttrs()`
    @param {Function} [callback] Callback function for Model's `save()`
      @param {Error|null} callback.err If an error occurred or validation
        failed, this parameter will contain the error. If the sync operation
        succeeded, _err_ will be `null`.
      @param {Any} callback.response The server's response. This value will
        be passed to the `parse()` method, which is expected to parse it and
        return an attribute hash.
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    modifyRow: function (id, data, config) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "modifyRow", 363);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 364);
var modelList = this.data,
            // Allow autoSync: true + addRow({ data }, { sync: false })
            sync      = (config && ('sync' in config)) ?
                            config.sync :
                            this.get('autoSync'),
            model, args;

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 371);
if (isObject(id) && id instanceof this.get('recordType')) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 372);
model = id;
        } else {_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 373);
if (modelList && id !== undefined) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 374);
model = modelList.getById(id) ||
                    modelList.getByClientId(id) ||
                    modelList.item(id);
        }}

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 379);
if (model && isObject(data)) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 380);
args = toArray(arguments, 1, true);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 382);
model.setAttrs.apply(model, args);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 384);
if (sync && !model.isNew()) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 385);
model.save.apply(model, args);
            }
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 389);
return this;
    },

    // --------------------------------------------------------------------------
    // Protected properties and methods
    // --------------------------------------------------------------------------

    /**
    Default function for the `addColumn` event.

    Inserts the specified column at the provided index.

    @method _defAddColumnFn
    @param {EventFacade} e The `addColumn` event
        @param {Object} e.column The new column definition object
        @param {Number|Number[]} e.index The array index to insert the new column
    @protected
    @since 3.5.0
    **/
    _defAddColumnFn: function (e) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "_defAddColumnFn", 408);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 409);
var index   = toArray(e.index),
            columns = this.get('columns'),
            cols    = columns,
            i, len;

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 414);
for (i = 0, len = index.length - 1; cols && i < len; ++i) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 415);
cols = cols[index[i]] && cols[index[i]].children;
        }

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 418);
if (cols) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 419);
cols.splice(index[i], 0, e.column);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 421);
this.set('columns', columns, { originEvent: e });
        }
    },

    /**
    Default function for the `modifyColumn` event.

    Mixes the new column properties into the specified column definition.

    @method _defModifyColumnFn
    @param {EventFacade} e The `modifyColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.newColumnDef The properties to assign to the column
    @protected
    @since 3.5.0
    **/
    _defModifyColumnFn: function (e) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "_defModifyColumnFn", 437);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 438);
var columns = this.get('columns'),
            column  = this.getColumn(e.column);

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 441);
if (column) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 442);
Y.mix(column, e.newColumnDef, true);
            
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 444);
this.set('columns', columns, { originEvent: e });
        }
    },

    /**
    Default function for the `moveColumn` event.

    Removes the specified column from its current location and inserts it at the
    specified array index (may be an array of indexes for nested headers).

    @method _defMoveColumnFn
    @param {EventFacade} e The `moveColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
        @param {Object} e.index The destination index to move to
    @protected
    @since 3.5.0
    **/
    _defMoveColumnFn: function (e) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "_defMoveColumnFn", 461);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 462);
var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            toIndex = toArray(e.index),
            fromCols, fromIndex, toCols, i, len;

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 467);
if (column) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 468);
fromCols  = column._parent ? column._parent.children : columns;
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 469);
fromIndex = arrayIndex(fromCols, column);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 471);
if (fromIndex > -1) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 472);
toCols = columns;

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 474);
for (i = 0, len = toIndex.length - 1; toCols && i < len; ++i) {
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 475);
toCols = toCols[toIndex[i]] && toCols[toIndex[i]].children;
                }

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 478);
if (toCols) {
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 479);
len = toCols.length;
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 480);
fromCols.splice(fromIndex, 1);
                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 481);
toIndex = toIndex[i];

                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 483);
if (len > toCols.lenth) {
                        // spliced off the same array, so adjust destination
                        // index if necessary
                        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 486);
if (fromIndex < toIndex) {
                            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 487);
toIndex--;
                        }
                    }

                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 491);
toCols.splice(toIndex, 0, column);

                    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 493);
this.set('columns', columns, { originEvent: e });
                }
            }
        }
    },

    /**
    Default function for the `removeColumn` event.

    Splices the specified column from its containing columns array.

    @method _defRemoveColumnFn
    @param {EventFacade} e The `removeColumn` event
        @param {Object|String|Number|Number[]} e.column The column definition object or identifier
    @protected
    @since 3.5.0
    **/
    _defRemoveColumnFn: function (e) {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "_defRemoveColumnFn", 510);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 511);
var columns = this.get('columns'),
            column  = this.getColumn(e.column),
            cols, index;

        _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 515);
if (column) {
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 516);
cols = column._parent ? column._parent.children : columns;
            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 517);
index = Y.Array.indexOf(cols, column);

            _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 519);
if (index > -1) {
                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 520);
cols.splice(index, 1);

                _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 522);
this.set('columns', columns, { originEvent: e });
            }
        }
    },

    /**
    Publishes the events used by the mutation methods:

     * addColumn
     * removeColumn
     * modifyColumn
     * moveColumn

    @method initializer
    @protected
    @since 3.5.0
    **/
    initializer: function () {
        _yuitest_coverfunc("build/datatable-mutable/datatable-mutable.js", "initializer", 539);
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 540);
this.publish({
            addColumn:    { defaultFn: Y.bind('_defAddColumnFn', this) },
            removeColumn: { defaultFn: Y.bind('_defRemoveColumnFn', this) },
            moveColumn:   { defaultFn: Y.bind('_defMoveColumnFn', this) },
            modifyColumn: { defaultFn: Y.bind('_defModifyColumnFn', this) }
        });
    }
});

/**
Adds an array of new records to the DataTable's `data` ModelList.  Record data
can be an array of objects containing field values or an array of instance of
the DataTable's configured `recordType` class.

This relays all parameters to the `data` ModelList's `add` method.

Technically, this is an alias to `addRow`, but please use the appropriately
named method for readability.

If a configuration object is passed as a second argument, and that object
has `sync: true` set, the underlying Models will be `save()`d.

If the DataTable's `autoSync` attribute is set to `true`, the additional
argument is not needed.

If syncing and the last argument is a function, that function will be used
as a callback to each Model's `save()` method.

@method addRows
@param {Object[]} data The data or Model instances to add
@param {Object} [config] Configuration to pass along
@param {Function} [callback] Callback function for each Model's `save()`
  @param {Error|null} callback.err If an error occurred or validation
    failed, this parameter will contain the error. If the sync operation
    succeeded, _err_ will be `null`.
  @param {Any} callback.response The server's response. This value will
    be passed to the `parse()` method, which is expected to parse it and
    return an attribute hash.
@return {DataTable}
@chainable
@since 3.5.0
**/
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 582);
Mutable.prototype.addRows = Mutable.prototype.addRow;

// Add feature APIs to public Y.DataTable class
_yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 585);
if (YLang.isFunction(Y.DataTable)) {
    _yuitest_coverline("build/datatable-mutable/datatable-mutable.js", 586);
Y.Base.mix(Y.DataTable, [Mutable]);
}

/**
Fired by the `addColumn` method.

@event addColumn
@preventable _defAddColumnFn
@param {Object} column The new column definition object
@param {Number|Number[]} index The array index to insert the new column
@since 3.5.0
**/

/**
Fired by the `removeColumn` method.

@event removeColumn
@preventable _defRemoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@since 3.5.0
**/

/**
Fired by the `modifyColumn` method.

@event modifyColumn
@preventable _defModifyColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} newColumnDef The properties to assign to the column
@since 3.5.0
**/

/**
Fired by the `moveColumn` method.

@event moveColumn
@preventable _defMoveColumnFn
@param {Object|String|Number|Number[]} column The column definition object or identifier
@param {Object} index The destination index to move to
@since 3.5.0
**/



}, '3.7.3', {"requires": ["datatable-base"]});
