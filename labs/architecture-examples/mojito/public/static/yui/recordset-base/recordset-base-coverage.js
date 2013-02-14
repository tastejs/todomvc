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
_yuitest_coverage["build/recordset-base/recordset-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/recordset-base/recordset-base.js",
    code: []
};
_yuitest_coverage["build/recordset-base/recordset-base.js"].code=["YUI.add('recordset-base', function (Y, NAME) {","","/**"," * Provides a wrapper around a standard javascript object. Can be inserted into a Recordset instance."," *"," * @class Record"," */","var Record = Y.Base.create('record', Y.Base, [], {","    _setId: function() {","        return Y.guid();","    },","","    initializer: function() {","    },","","    destructor: function() {","    },","","    /**","     * Retrieve a particular (or all) values from the object","     *","     * @param field {string} (optional) The key to retrieve the value from. If not supplied, the entire object is returned.","     * @method getValue","     * @public","     */","    getValue: function(field) {","        if (field === undefined) {","            return this.get(\"data\");","        }","        else {","            return this.get(\"data\")[field];","        }","        return null;","    }","},","{","    ATTRS: {","","        /**","        * @description Unique ID of the record instance","        * @attribute id","        * @type string","        */","        id: {","            valueFn: \"_setId\"","        },","","        /**","        * @description The object stored within the record instance","        * @attribute data","        * @type object","        */","        data: {","            value: null","        }","    }","});","","Y.Record = Record;","/**","The Recordset utility provides a standard way for dealing with","a collection of similar objects.","@module recordset","@main recordset","@submodule recordset-base","**/","","","var ArrayList = Y.ArrayList,","Lang = Y.Lang,","","/**","The Recordset utility provides a standard way for dealing with","a collection of similar objects.","","Provides the base Recordset implementation, which can be extended to add","additional functionality, such as custom indexing. sorting, and filtering.","","@class Recordset","@extends Base","@uses ArrayList","@param config {Object} Configuration object with initial attribute values","@constructor","**/","Recordset = Y.Base.create('recordset', Y.Base, [], {","","","    /**","     * Publish default functions for events. Create the initial hash table.","     *","     * @method initializer","     * @protected","     */","    initializer: function() {","        // The reason the conditional is needed is because of two scenarios:","        // 1. Instantiating new Y.Recordset() will not go into the setter of \"records\", and so it is necessary to create this._items in the initializer.","        // 2. Instantiating new Y.Recordset({records: [{...}]}) will call the setter of \"records\" and create this._items. In this case, we don't want that to be overwritten by [].","        if (!this._items) {","            this._items = [];","        }","","        //set up event listener to fire events when recordset is modified in anyway","        this.publish({","            /**","             * <p>At least one record is being added. Additional properties of","             * the event are:</p>","             * <dl>","             *     <dt>added</dt>","             *         <dd>Array of new records to be added</dd>","             *     <dt>index</dt>","             *         <dd>The insertion index in the Recordset's internal","             *         array</dd>","             * </dl>","             *","             * <p>Preventing this event will cause the new records NOT to be","             * added to the Recordset's internal collection.</p>","             *","             * @event add","             * @preventable _defAddFn","             */","            add: { defaultFn: this._defAddFn },","","            /**","             * <p>At least one record is being removed. Additional properties of","             * the event are:</p>","             * <dl>","             *     <dt>removed</dt>","             *         <dd>Array of records to be removed</dd>","             *     <dt>range</dt>","             *         <dd>Number of records to be removed</dd>","             *     <dt>index</dt>","             *         <dd>The starting index in the Recordset's internal","             *         array from which to remove records</dd>","             * </dl>","             *","             * <p>Preventing this event will cause the records NOT to be","             * removed from the Recordset's internal collection.</p>","             *","             * @event remove","             * @preventable _defRemoveFn","             */","            remove: { defaultFn: this._defRemoveFn },","","            /**","             * The Recordset is being flushed of all records.","             *","             * @event empty","             * @preventable _defEmptyFn","             */","            empty: { defaultFn: this._defEmptyFn },","","            /**","             * <p>At least one record is being updated. Additional properties of","             * the event are:</p>","             * <dl>","             *     <dt>updated</dt>","             *         <dd>Array of records with updated values</dd>","             *     <dt>overwritten</dt>","             *         <dd>Array of current records that will be replaced</dd>","             *     <dt>index</dt>","             *         <dd>The starting index in the Recordset's internal","             *         array from which to update will apply</dd>","             * </dl>","             *","             * <p>Preventing this event will cause the records NOT to be","             * updated in the Recordset's internal collection.</p>","             *","             * @event update","             * @preventable _defUpdateFn","             */","            update: { defaultFn: this._defUpdateFn }","        });","","        this._buildHashTable(this.get('key'));","","        this.after([","            'recordsChange',","            'add',","            'remove',","            'update',","            'empty'], this._updateHash);","    },","","    /**","     * Returns the record with particular ID or index","     *","     * @method getRecord","     * @param i {String, Number} The ID of the record if a string, or the index if a number.","     * @return {Record} A Y.Record instance","     */","    getRecord: function(i) {","","        if (Lang.isString(i)) {","            return this.get('table')[i];","        }","        else if (Lang.isNumber(i)) {","            return this._items[i];","        }","        return null;","    },","","","    /**","     * Returns the record at a particular index","     *","     * @method getRecordByIndex","     * @param i {Number} Index at which the required record resides","     * @return {Record} A Y.Record instance","     */","    getRecordByIndex: function(i) {","        return this._items[i];","    },","","    /**","     * Returns a range of records beginning at particular index","     *","     * @method getRecordsByIndex","     * @param index {Number} Index at which the required record resides","     * @param range {Number} (Optional) Number of records to retrieve. The default is 1","     * @return {Array} An array of Y.Record instances","     */","    getRecordsByIndex: function(index, range) {","        var i = 0,","        returnedRecords = [];","        //Range cannot take on negative values","        range = (Lang.isNumber(range) && (range > 0)) ? range: 1;","","        for (; i < range; i++) {","            returnedRecords.push(this._items[index + i]);","        }","        return returnedRecords;","    },","","    /**","     * Returns the length of the recordset","     *","     * @method getLength","     * @return {Number} Number of records in the recordset","     */","    getLength: function() {","        return this.size();","    },","","    /**","    Gets an array of values for a data _key_ in the set's records.  If no _key_","    is supplied, the returned array will contain the full data object for each","    record.","","    @method getValuesByKey","    @param {String} [key] Data property to get from all records","    @return {Array} An array of values for the given _key_ if supplied.","        Otherwise, an array of each record's data hash.","    **/","    getValuesByKey: function(key) {","        var i = 0,","        len = this._items.length,","        retVals = [];","        for (; i < len; i++) {","            retVals.push(this._items[i].getValue(key));","        }","        return retVals;","    },","","","    /**","     * Adds one or more Records to the RecordSet at the given index. If index is null, then adds the Records to the end of the RecordSet.","     *","     * @method add","     * @param {Record|Object|Array} oData A Y.Record instance, An object literal of data or an array of object literals","     * @param [index] {Number} [index] Index at which to add the record(s)","     * @return {Recordset} The updated recordset instance","     */","    add: function(oData, index) {","","        var newRecords = [],","        idx,","        i = 0;","","        idx = (Lang.isNumber(index) && (index > -1)) ? index: this._items.length;","","        //Passing in array of object literals for oData","        if (Lang.isArray(oData)) {","            for (; i < oData.length; i++) {","                newRecords[i] = this._changeToRecord(oData[i]);","            }","        } else if (Lang.isObject(oData)) {","            newRecords[0] = this._changeToRecord(oData);","        }","","        this.fire('add', {","            added: newRecords,","            index: idx","        });","        return this;","    },","","    /**","    Removes one or more Records to the RecordSet at the given index. If index","    is null, then removes a single Record from the end of the RecordSet.","    ","    @method remove","    @param {Number} [index] Index at which to remove the record(s) from","    @param {Number} [range] Number of records to remove (including the one","        at the index)","    @return {Recordset} The updated recordset instance","    **/","    remove: function(index, range) {","        var remRecords = [];","","        //Default is to only remove the last record - the length is always 1 greater than the last index","        index = (index > -1) ? index: (this._items.length - 1);","        range = (range > 0) ? range: 1;","","        remRecords = this._items.slice(index, (index + range));","        this.fire('remove', {","            removed: remRecords,","            range: range,","            index: index","        });","        //this._recordRemoved(remRecords, index);","        //return ({data: remRecords, index:index});","        return this;","    },","","    /**","     * Empties the recordset","     *","     * @method empty","     * @return {Recordset} The updated recordset instance","     */","    empty: function() {","        this.fire('empty', {});","        return this;","    },","","    /**","    Updates the recordset with the new records passed in. Overwrites existing","    records when updating the index with the new records.","    ","    @method update","    @param {Record|Object|Array} data A Y.Record instance, An object literal of","        data or an array of object literals","    @param {Number} [index] The index to start updating from. ","    @return {Recordset} The updated recordset instance","    **/","    update: function(data, index) {","        var rec,","            arr,","            i = 0;","","        // Whatever is passed in, we are changing it to an array so that it can","        // be easily iterated in the _defUpdateFn method","        arr = (!(Lang.isArray(data))) ? [data] : data;","        rec = this._items.slice(index, index + arr.length);","","        for (; i < arr.length; i++) {","            arr[i] = this._changeToRecord(arr[i]);","        }","","        this.fire('update', {","            updated: arr,","            overwritten: rec,","            index: index","        });","","        return this;","    },","","    /**","     * Default behavior for the \"add\" event. Adds Record instances starting from","     * the index specified in `e.index`.","     *","     * @method _defAddFn","     * @param {EventFacade} e The add event","     * @private","     */","    _defAddFn: function(e) {","        this._items.splice.apply(this._items, [e.index, 0].concat(e.added));","    },","","    /**","     * Default behavior for the \"remove\" event. Removes Records from the","     * internal array starting from `e.index`.  By default, it will remove one","     * Record. But if `e.range` is set, it will remove that many Records.","     *","     * @method _defRemoveFn","     * @param {EventFacade} e The remove event","     * @private","     */","    _defRemoveFn: function(e) {","        this._items.splice(e.index, e.range || 1);","    },","","    /**","     * Default behavior for the \"update\" event. Sets Record instances for each","     * item in `e.updated` at indexes starting from `e.index`.","     *","     * @method _defUpdateFn","     * @param {EventFacade} e The update event","     * @private","     */","    _defUpdateFn: function(e) {","        for (var i = 0; i < e.updated.length; i++) {","            this._items[e.index + i] = this._changeToRecord(e.updated[i]);","        }","    },","","    /**","     * Default behavior for the \"empty\" event. Clears the internal array of","     * Records.","     *","     * @method _defEmptyFn","     * @param {EventFacade} e The empty event","     * @private","     */","    _defEmptyFn: function(e) {","        this._items = [];","    },","","    /**","    Updates the internal hash table.","","    @method _defUpdateHash","    @param {EventFacade} e Event triggering the hash table update","    @private","    **/","    _updateHash: function (e) {","        var handler = \"_hash\",","            type = e.type.replace(/.*:/,''),","            newHash;","","        // _hashAdd, _hashRemove, _hashEmpty, etc","        // Not a switch or else if setup to allow for external expansion.","        handler += type.charAt(0).toUpperCase() + type.slice(1);","","        newHash = this[handler] &&","                    this[handler](this.get('table'), this.get('key'), e);","","        if (newHash) {","            this.set('table', newHash);","        }","    },","","    /**","    Regenerates the hash table from the current internal array of Records.","","    @method _hashRecordsChange","    @param {Object} hash The hash map before replacement","    @param {String} key The key by which to add items to the hash","    @param {Object} e The event or object containing the items to be added.","                      Items are expected to be stored in an array assigned to","                      the `added` property.","    @return {Object} The updated hash map","    @private","    **/","    _hashRecordsChange: function (hash, key, e) {","        return this._buildHashTable(key);","    },","","    /**","    Builds a hash table from the current internal array of Records.","","    @method _buildHashTable","    @param {String} key The Record key to hash the items by","    @return {Object} A new hash map of Records keyed by each Records' key","    @private","    **/","    _buildHashTable: function (key) {","        return this._hashAdd({}, key, { added: this._items });","    },","","    /**","    Adds items to the hash table.  Items are the values, and the keys are the","    values of the item's attribute named in the `key` parameter.","","    @method _hashAdd","    @param {Object} hash The hash map before adding items","    @param {String} key The key by which to add the items to the hash","    @param {Object} e The event or object containing the items to be added.","                      Items are expected to be stored in an array assigned to","                      the `added` property.","    @return {Object} The updated hash map","    @private","    **/","    _hashAdd: function(hash, key, e) {","        var items = e.added,","            i, len;","","        for (i = 0, len = e.added.length; i < len; ++i) {","            hash[items[i].get(key)] = items[i];","        }","","        return hash;","    },","","    /**","    Removes items from the hash table.","","    @method _hashRemove","    @param {Object} hash The hash map before removing items","    @param {String} key The key by which to remove the items from the hash","    @param {Object} e The event or object containing the items to be removed.","                      Items are expected to be stored in an array assigned to","                      the `removed` property.","    @return {Object} The updated hash map","    @private","    **/","    _hashRemove: function(hash, key, e) {","        for (var i = e.removed.length - 1; i >= 0; --i) {","            delete hash[e.removed[i].get(key)];","        }","","        return hash;","    },","","    /**","    Updates items in the hash table.","","    @method _hashUpdate","    @param {Object} hash The hash map before updating items","    @param {String} key The key by which to update the items to the hash","    @param {Object} e The event or object containing the items to be updated.","                      Items are expected to be stored in an array assigned to","                      the `updated` property. Optionally, items can be","                      identified for being overwritten by including them in an","                      array assigned to the `overwritten` property.","    @return {Object} The updated hash map","    @private","    **/","    _hashUpdate: function (hash, key, e) {","        if (e.overwritten && e.overwritten.length) {","            hash = this._hashRemove(hash, key, { removed: e.overwritten });","        }","","        return this._hashAdd(hash, key, { added: e.updated });","    },","","    /**","    Clears the hash table.","","    @method _hashEmpty","    @param {Object} hash The hash map before adding items","    @param {String} key The key by which to remove the items from the hash","    @param {Object} e The event or object containing the items to be removed.","                      Items are expected to be stored in an array assigned to","                      the `removed` property.","    @return {Object} An empty hash","    @private","    **/","    _hashEmpty: function() {","        return {};","    },","","    /**","     * Sets up the hashtable with all the records currently in the recordset","     *","     * @method _initHashTable","     * @private","     */","    _initHashTable: function() {","        return this._hashAdd({}, this.get('key'), { added: this._items || [] });","    },","","    /**","     * Helper method - it takes an object bag and converts it to a Y.Record","     *","     * @method _changeToRecord","     * @param obj {Object|Record} Any objet literal or Y.Record instance","     * @return {Record} A Record instance.","     * @private","     */","    _changeToRecord: function(obj) {","        return (obj instanceof Y.Record) ? obj : new Y.Record({ data: obj });","    },","","    /**","    Ensures the value being set is an array of Record instances. If array items","    are raw object data, they are turned into Records.","","    @method _setRecords","    @param {Record[]|Object[]} items The Records or data Objects to store as","                                     Records.","    @return {Record[]}","    **/","    _setRecords: function (items) {","        if (!Y.Lang.isArray(items)) {","            return Y.Attribute.INVALID_VALUE;","        }","","        var records = [],","            i, len;","","        // FIXME: This should use the flyweight pattern if possible","        for (i = 0, len = items.length; i < len; ++i) {","            records[i] = this._changeToRecord(items[i]);","        }","","        return (this._items = records);","    }","}, {","    ATTRS: {","","        /**","        * An array of Records that the Recordset is storing.  Passing an array","        * of raw record data is also accepted.  The data for each item will be","        * wrapped in a Record instance.","        *","        * @attribute records","        * @type {Record[]}","        */","        records: {","            // TODO: necessary? valueFn?","            lazyAdd: false,","            getter: function() {","                // give them a copy, not the internal object","                return Y.Array(this._items);","            },","            setter: \"_setRecords\"","        },","","        /**","        A hash table where the ID of the record is the key, and the record","        instance is the value.","        ","        @attribute table","        @type object","        **/","        table: {","            valueFn: '_initHashTable'","        },","","        /**","        The ID to use as the key in the hash table.","        ","        @attribute key","        @type string","        **/","        key: {","            value: 'id',","            readOnly: true","        }","","    }","});","Y.augment(Recordset, ArrayList);","Y.Recordset = Recordset;","","","","}, '3.7.3', {\"requires\": [\"base\", \"arraylist\"]});"];
_yuitest_coverage["build/recordset-base/recordset-base.js"].lines = {"1":0,"8":0,"10":0,"27":0,"28":0,"31":0,"33":0,"59":0,"69":0,"98":0,"99":0,"103":0,"174":0,"176":0,"193":0,"194":0,"196":0,"197":0,"199":0,"211":0,"223":0,"226":0,"228":0,"229":0,"231":0,"241":0,"255":0,"258":0,"259":0,"261":0,"275":0,"279":0,"282":0,"283":0,"284":0,"286":0,"287":0,"290":0,"294":0,"308":0,"311":0,"312":0,"314":0,"315":0,"322":0,"332":0,"333":0,"347":0,"353":0,"354":0,"356":0,"357":0,"360":0,"366":0,"378":0,"391":0,"403":0,"404":0,"417":0,"428":0,"434":0,"436":0,"439":0,"440":0,"457":0,"469":0,"486":0,"489":0,"490":0,"493":0,"509":0,"510":0,"513":0,"531":0,"532":0,"535":0,"551":0,"561":0,"573":0,"586":0,"587":0,"590":0,"594":0,"595":0,"598":0,"616":0,"645":0,"646":0};
_yuitest_coverage["build/recordset-base/recordset-base.js"].functions = {"_setId:9":0,"getValue:26":0,"initializer:94":0,"getRecord:191":0,"getRecordByIndex:210":0,"getRecordsByIndex:222":0,"getLength:240":0,"getValuesByKey:254":0,"add:273":0,"remove:307":0,"empty:331":0,"update:346":0,"_defAddFn:377":0,"_defRemoveFn:390":0,"_defUpdateFn:402":0,"_defEmptyFn:416":0,"_updateHash:427":0,"_hashRecordsChange:456":0,"_buildHashTable:468":0,"_hashAdd:485":0,"_hashRemove:508":0,"_hashUpdate:530":0,"_hashEmpty:550":0,"_initHashTable:560":0,"_changeToRecord:572":0,"_setRecords:585":0,"getter:614":0,"(anonymous 1):1":0};
_yuitest_coverage["build/recordset-base/recordset-base.js"].coveredLines = 88;
_yuitest_coverage["build/recordset-base/recordset-base.js"].coveredFunctions = 28;
_yuitest_coverline("build/recordset-base/recordset-base.js", 1);
YUI.add('recordset-base', function (Y, NAME) {

/**
 * Provides a wrapper around a standard javascript object. Can be inserted into a Recordset instance.
 *
 * @class Record
 */
_yuitest_coverfunc("build/recordset-base/recordset-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/recordset-base/recordset-base.js", 8);
var Record = Y.Base.create('record', Y.Base, [], {
    _setId: function() {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_setId", 9);
_yuitest_coverline("build/recordset-base/recordset-base.js", 10);
return Y.guid();
    },

    initializer: function() {
    },

    destructor: function() {
    },

    /**
     * Retrieve a particular (or all) values from the object
     *
     * @param field {string} (optional) The key to retrieve the value from. If not supplied, the entire object is returned.
     * @method getValue
     * @public
     */
    getValue: function(field) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getValue", 26);
_yuitest_coverline("build/recordset-base/recordset-base.js", 27);
if (field === undefined) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 28);
return this.get("data");
        }
        else {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 31);
return this.get("data")[field];
        }
        _yuitest_coverline("build/recordset-base/recordset-base.js", 33);
return null;
    }
},
{
    ATTRS: {

        /**
        * @description Unique ID of the record instance
        * @attribute id
        * @type string
        */
        id: {
            valueFn: "_setId"
        },

        /**
        * @description The object stored within the record instance
        * @attribute data
        * @type object
        */
        data: {
            value: null
        }
    }
});

_yuitest_coverline("build/recordset-base/recordset-base.js", 59);
Y.Record = Record;
/**
The Recordset utility provides a standard way for dealing with
a collection of similar objects.
@module recordset
@main recordset
@submodule recordset-base
**/


_yuitest_coverline("build/recordset-base/recordset-base.js", 69);
var ArrayList = Y.ArrayList,
Lang = Y.Lang,

/**
The Recordset utility provides a standard way for dealing with
a collection of similar objects.

Provides the base Recordset implementation, which can be extended to add
additional functionality, such as custom indexing. sorting, and filtering.

@class Recordset
@extends Base
@uses ArrayList
@param config {Object} Configuration object with initial attribute values
@constructor
**/
Recordset = Y.Base.create('recordset', Y.Base, [], {


    /**
     * Publish default functions for events. Create the initial hash table.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        // The reason the conditional is needed is because of two scenarios:
        // 1. Instantiating new Y.Recordset() will not go into the setter of "records", and so it is necessary to create this._items in the initializer.
        // 2. Instantiating new Y.Recordset({records: [{...}]}) will call the setter of "records" and create this._items. In this case, we don't want that to be overwritten by [].
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "initializer", 94);
_yuitest_coverline("build/recordset-base/recordset-base.js", 98);
if (!this._items) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 99);
this._items = [];
        }

        //set up event listener to fire events when recordset is modified in anyway
        _yuitest_coverline("build/recordset-base/recordset-base.js", 103);
this.publish({
            /**
             * <p>At least one record is being added. Additional properties of
             * the event are:</p>
             * <dl>
             *     <dt>added</dt>
             *         <dd>Array of new records to be added</dd>
             *     <dt>index</dt>
             *         <dd>The insertion index in the Recordset's internal
             *         array</dd>
             * </dl>
             *
             * <p>Preventing this event will cause the new records NOT to be
             * added to the Recordset's internal collection.</p>
             *
             * @event add
             * @preventable _defAddFn
             */
            add: { defaultFn: this._defAddFn },

            /**
             * <p>At least one record is being removed. Additional properties of
             * the event are:</p>
             * <dl>
             *     <dt>removed</dt>
             *         <dd>Array of records to be removed</dd>
             *     <dt>range</dt>
             *         <dd>Number of records to be removed</dd>
             *     <dt>index</dt>
             *         <dd>The starting index in the Recordset's internal
             *         array from which to remove records</dd>
             * </dl>
             *
             * <p>Preventing this event will cause the records NOT to be
             * removed from the Recordset's internal collection.</p>
             *
             * @event remove
             * @preventable _defRemoveFn
             */
            remove: { defaultFn: this._defRemoveFn },

            /**
             * The Recordset is being flushed of all records.
             *
             * @event empty
             * @preventable _defEmptyFn
             */
            empty: { defaultFn: this._defEmptyFn },

            /**
             * <p>At least one record is being updated. Additional properties of
             * the event are:</p>
             * <dl>
             *     <dt>updated</dt>
             *         <dd>Array of records with updated values</dd>
             *     <dt>overwritten</dt>
             *         <dd>Array of current records that will be replaced</dd>
             *     <dt>index</dt>
             *         <dd>The starting index in the Recordset's internal
             *         array from which to update will apply</dd>
             * </dl>
             *
             * <p>Preventing this event will cause the records NOT to be
             * updated in the Recordset's internal collection.</p>
             *
             * @event update
             * @preventable _defUpdateFn
             */
            update: { defaultFn: this._defUpdateFn }
        });

        _yuitest_coverline("build/recordset-base/recordset-base.js", 174);
this._buildHashTable(this.get('key'));

        _yuitest_coverline("build/recordset-base/recordset-base.js", 176);
this.after([
            'recordsChange',
            'add',
            'remove',
            'update',
            'empty'], this._updateHash);
    },

    /**
     * Returns the record with particular ID or index
     *
     * @method getRecord
     * @param i {String, Number} The ID of the record if a string, or the index if a number.
     * @return {Record} A Y.Record instance
     */
    getRecord: function(i) {

        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getRecord", 191);
_yuitest_coverline("build/recordset-base/recordset-base.js", 193);
if (Lang.isString(i)) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 194);
return this.get('table')[i];
        }
        else {_yuitest_coverline("build/recordset-base/recordset-base.js", 196);
if (Lang.isNumber(i)) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 197);
return this._items[i];
        }}
        _yuitest_coverline("build/recordset-base/recordset-base.js", 199);
return null;
    },


    /**
     * Returns the record at a particular index
     *
     * @method getRecordByIndex
     * @param i {Number} Index at which the required record resides
     * @return {Record} A Y.Record instance
     */
    getRecordByIndex: function(i) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getRecordByIndex", 210);
_yuitest_coverline("build/recordset-base/recordset-base.js", 211);
return this._items[i];
    },

    /**
     * Returns a range of records beginning at particular index
     *
     * @method getRecordsByIndex
     * @param index {Number} Index at which the required record resides
     * @param range {Number} (Optional) Number of records to retrieve. The default is 1
     * @return {Array} An array of Y.Record instances
     */
    getRecordsByIndex: function(index, range) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getRecordsByIndex", 222);
_yuitest_coverline("build/recordset-base/recordset-base.js", 223);
var i = 0,
        returnedRecords = [];
        //Range cannot take on negative values
        _yuitest_coverline("build/recordset-base/recordset-base.js", 226);
range = (Lang.isNumber(range) && (range > 0)) ? range: 1;

        _yuitest_coverline("build/recordset-base/recordset-base.js", 228);
for (; i < range; i++) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 229);
returnedRecords.push(this._items[index + i]);
        }
        _yuitest_coverline("build/recordset-base/recordset-base.js", 231);
return returnedRecords;
    },

    /**
     * Returns the length of the recordset
     *
     * @method getLength
     * @return {Number} Number of records in the recordset
     */
    getLength: function() {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getLength", 240);
_yuitest_coverline("build/recordset-base/recordset-base.js", 241);
return this.size();
    },

    /**
    Gets an array of values for a data _key_ in the set's records.  If no _key_
    is supplied, the returned array will contain the full data object for each
    record.

    @method getValuesByKey
    @param {String} [key] Data property to get from all records
    @return {Array} An array of values for the given _key_ if supplied.
        Otherwise, an array of each record's data hash.
    **/
    getValuesByKey: function(key) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getValuesByKey", 254);
_yuitest_coverline("build/recordset-base/recordset-base.js", 255);
var i = 0,
        len = this._items.length,
        retVals = [];
        _yuitest_coverline("build/recordset-base/recordset-base.js", 258);
for (; i < len; i++) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 259);
retVals.push(this._items[i].getValue(key));
        }
        _yuitest_coverline("build/recordset-base/recordset-base.js", 261);
return retVals;
    },


    /**
     * Adds one or more Records to the RecordSet at the given index. If index is null, then adds the Records to the end of the RecordSet.
     *
     * @method add
     * @param {Record|Object|Array} oData A Y.Record instance, An object literal of data or an array of object literals
     * @param [index] {Number} [index] Index at which to add the record(s)
     * @return {Recordset} The updated recordset instance
     */
    add: function(oData, index) {

        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "add", 273);
_yuitest_coverline("build/recordset-base/recordset-base.js", 275);
var newRecords = [],
        idx,
        i = 0;

        _yuitest_coverline("build/recordset-base/recordset-base.js", 279);
idx = (Lang.isNumber(index) && (index > -1)) ? index: this._items.length;

        //Passing in array of object literals for oData
        _yuitest_coverline("build/recordset-base/recordset-base.js", 282);
if (Lang.isArray(oData)) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 283);
for (; i < oData.length; i++) {
                _yuitest_coverline("build/recordset-base/recordset-base.js", 284);
newRecords[i] = this._changeToRecord(oData[i]);
            }
        } else {_yuitest_coverline("build/recordset-base/recordset-base.js", 286);
if (Lang.isObject(oData)) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 287);
newRecords[0] = this._changeToRecord(oData);
        }}

        _yuitest_coverline("build/recordset-base/recordset-base.js", 290);
this.fire('add', {
            added: newRecords,
            index: idx
        });
        _yuitest_coverline("build/recordset-base/recordset-base.js", 294);
return this;
    },

    /**
    Removes one or more Records to the RecordSet at the given index. If index
    is null, then removes a single Record from the end of the RecordSet.
    
    @method remove
    @param {Number} [index] Index at which to remove the record(s) from
    @param {Number} [range] Number of records to remove (including the one
        at the index)
    @return {Recordset} The updated recordset instance
    **/
    remove: function(index, range) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "remove", 307);
_yuitest_coverline("build/recordset-base/recordset-base.js", 308);
var remRecords = [];

        //Default is to only remove the last record - the length is always 1 greater than the last index
        _yuitest_coverline("build/recordset-base/recordset-base.js", 311);
index = (index > -1) ? index: (this._items.length - 1);
        _yuitest_coverline("build/recordset-base/recordset-base.js", 312);
range = (range > 0) ? range: 1;

        _yuitest_coverline("build/recordset-base/recordset-base.js", 314);
remRecords = this._items.slice(index, (index + range));
        _yuitest_coverline("build/recordset-base/recordset-base.js", 315);
this.fire('remove', {
            removed: remRecords,
            range: range,
            index: index
        });
        //this._recordRemoved(remRecords, index);
        //return ({data: remRecords, index:index});
        _yuitest_coverline("build/recordset-base/recordset-base.js", 322);
return this;
    },

    /**
     * Empties the recordset
     *
     * @method empty
     * @return {Recordset} The updated recordset instance
     */
    empty: function() {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "empty", 331);
_yuitest_coverline("build/recordset-base/recordset-base.js", 332);
this.fire('empty', {});
        _yuitest_coverline("build/recordset-base/recordset-base.js", 333);
return this;
    },

    /**
    Updates the recordset with the new records passed in. Overwrites existing
    records when updating the index with the new records.
    
    @method update
    @param {Record|Object|Array} data A Y.Record instance, An object literal of
        data or an array of object literals
    @param {Number} [index] The index to start updating from. 
    @return {Recordset} The updated recordset instance
    **/
    update: function(data, index) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "update", 346);
_yuitest_coverline("build/recordset-base/recordset-base.js", 347);
var rec,
            arr,
            i = 0;

        // Whatever is passed in, we are changing it to an array so that it can
        // be easily iterated in the _defUpdateFn method
        _yuitest_coverline("build/recordset-base/recordset-base.js", 353);
arr = (!(Lang.isArray(data))) ? [data] : data;
        _yuitest_coverline("build/recordset-base/recordset-base.js", 354);
rec = this._items.slice(index, index + arr.length);

        _yuitest_coverline("build/recordset-base/recordset-base.js", 356);
for (; i < arr.length; i++) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 357);
arr[i] = this._changeToRecord(arr[i]);
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 360);
this.fire('update', {
            updated: arr,
            overwritten: rec,
            index: index
        });

        _yuitest_coverline("build/recordset-base/recordset-base.js", 366);
return this;
    },

    /**
     * Default behavior for the "add" event. Adds Record instances starting from
     * the index specified in `e.index`.
     *
     * @method _defAddFn
     * @param {EventFacade} e The add event
     * @private
     */
    _defAddFn: function(e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_defAddFn", 377);
_yuitest_coverline("build/recordset-base/recordset-base.js", 378);
this._items.splice.apply(this._items, [e.index, 0].concat(e.added));
    },

    /**
     * Default behavior for the "remove" event. Removes Records from the
     * internal array starting from `e.index`.  By default, it will remove one
     * Record. But if `e.range` is set, it will remove that many Records.
     *
     * @method _defRemoveFn
     * @param {EventFacade} e The remove event
     * @private
     */
    _defRemoveFn: function(e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_defRemoveFn", 390);
_yuitest_coverline("build/recordset-base/recordset-base.js", 391);
this._items.splice(e.index, e.range || 1);
    },

    /**
     * Default behavior for the "update" event. Sets Record instances for each
     * item in `e.updated` at indexes starting from `e.index`.
     *
     * @method _defUpdateFn
     * @param {EventFacade} e The update event
     * @private
     */
    _defUpdateFn: function(e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_defUpdateFn", 402);
_yuitest_coverline("build/recordset-base/recordset-base.js", 403);
for (var i = 0; i < e.updated.length; i++) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 404);
this._items[e.index + i] = this._changeToRecord(e.updated[i]);
        }
    },

    /**
     * Default behavior for the "empty" event. Clears the internal array of
     * Records.
     *
     * @method _defEmptyFn
     * @param {EventFacade} e The empty event
     * @private
     */
    _defEmptyFn: function(e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_defEmptyFn", 416);
_yuitest_coverline("build/recordset-base/recordset-base.js", 417);
this._items = [];
    },

    /**
    Updates the internal hash table.

    @method _defUpdateHash
    @param {EventFacade} e Event triggering the hash table update
    @private
    **/
    _updateHash: function (e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_updateHash", 427);
_yuitest_coverline("build/recordset-base/recordset-base.js", 428);
var handler = "_hash",
            type = e.type.replace(/.*:/,''),
            newHash;

        // _hashAdd, _hashRemove, _hashEmpty, etc
        // Not a switch or else if setup to allow for external expansion.
        _yuitest_coverline("build/recordset-base/recordset-base.js", 434);
handler += type.charAt(0).toUpperCase() + type.slice(1);

        _yuitest_coverline("build/recordset-base/recordset-base.js", 436);
newHash = this[handler] &&
                    this[handler](this.get('table'), this.get('key'), e);

        _yuitest_coverline("build/recordset-base/recordset-base.js", 439);
if (newHash) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 440);
this.set('table', newHash);
        }
    },

    /**
    Regenerates the hash table from the current internal array of Records.

    @method _hashRecordsChange
    @param {Object} hash The hash map before replacement
    @param {String} key The key by which to add items to the hash
    @param {Object} e The event or object containing the items to be added.
                      Items are expected to be stored in an array assigned to
                      the `added` property.
    @return {Object} The updated hash map
    @private
    **/
    _hashRecordsChange: function (hash, key, e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_hashRecordsChange", 456);
_yuitest_coverline("build/recordset-base/recordset-base.js", 457);
return this._buildHashTable(key);
    },

    /**
    Builds a hash table from the current internal array of Records.

    @method _buildHashTable
    @param {String} key The Record key to hash the items by
    @return {Object} A new hash map of Records keyed by each Records' key
    @private
    **/
    _buildHashTable: function (key) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_buildHashTable", 468);
_yuitest_coverline("build/recordset-base/recordset-base.js", 469);
return this._hashAdd({}, key, { added: this._items });
    },

    /**
    Adds items to the hash table.  Items are the values, and the keys are the
    values of the item's attribute named in the `key` parameter.

    @method _hashAdd
    @param {Object} hash The hash map before adding items
    @param {String} key The key by which to add the items to the hash
    @param {Object} e The event or object containing the items to be added.
                      Items are expected to be stored in an array assigned to
                      the `added` property.
    @return {Object} The updated hash map
    @private
    **/
    _hashAdd: function(hash, key, e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_hashAdd", 485);
_yuitest_coverline("build/recordset-base/recordset-base.js", 486);
var items = e.added,
            i, len;

        _yuitest_coverline("build/recordset-base/recordset-base.js", 489);
for (i = 0, len = e.added.length; i < len; ++i) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 490);
hash[items[i].get(key)] = items[i];
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 493);
return hash;
    },

    /**
    Removes items from the hash table.

    @method _hashRemove
    @param {Object} hash The hash map before removing items
    @param {String} key The key by which to remove the items from the hash
    @param {Object} e The event or object containing the items to be removed.
                      Items are expected to be stored in an array assigned to
                      the `removed` property.
    @return {Object} The updated hash map
    @private
    **/
    _hashRemove: function(hash, key, e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_hashRemove", 508);
_yuitest_coverline("build/recordset-base/recordset-base.js", 509);
for (var i = e.removed.length - 1; i >= 0; --i) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 510);
delete hash[e.removed[i].get(key)];
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 513);
return hash;
    },

    /**
    Updates items in the hash table.

    @method _hashUpdate
    @param {Object} hash The hash map before updating items
    @param {String} key The key by which to update the items to the hash
    @param {Object} e The event or object containing the items to be updated.
                      Items are expected to be stored in an array assigned to
                      the `updated` property. Optionally, items can be
                      identified for being overwritten by including them in an
                      array assigned to the `overwritten` property.
    @return {Object} The updated hash map
    @private
    **/
    _hashUpdate: function (hash, key, e) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_hashUpdate", 530);
_yuitest_coverline("build/recordset-base/recordset-base.js", 531);
if (e.overwritten && e.overwritten.length) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 532);
hash = this._hashRemove(hash, key, { removed: e.overwritten });
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 535);
return this._hashAdd(hash, key, { added: e.updated });
    },

    /**
    Clears the hash table.

    @method _hashEmpty
    @param {Object} hash The hash map before adding items
    @param {String} key The key by which to remove the items from the hash
    @param {Object} e The event or object containing the items to be removed.
                      Items are expected to be stored in an array assigned to
                      the `removed` property.
    @return {Object} An empty hash
    @private
    **/
    _hashEmpty: function() {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_hashEmpty", 550);
_yuitest_coverline("build/recordset-base/recordset-base.js", 551);
return {};
    },

    /**
     * Sets up the hashtable with all the records currently in the recordset
     *
     * @method _initHashTable
     * @private
     */
    _initHashTable: function() {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_initHashTable", 560);
_yuitest_coverline("build/recordset-base/recordset-base.js", 561);
return this._hashAdd({}, this.get('key'), { added: this._items || [] });
    },

    /**
     * Helper method - it takes an object bag and converts it to a Y.Record
     *
     * @method _changeToRecord
     * @param obj {Object|Record} Any objet literal or Y.Record instance
     * @return {Record} A Record instance.
     * @private
     */
    _changeToRecord: function(obj) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_changeToRecord", 572);
_yuitest_coverline("build/recordset-base/recordset-base.js", 573);
return (obj instanceof Y.Record) ? obj : new Y.Record({ data: obj });
    },

    /**
    Ensures the value being set is an array of Record instances. If array items
    are raw object data, they are turned into Records.

    @method _setRecords
    @param {Record[]|Object[]} items The Records or data Objects to store as
                                     Records.
    @return {Record[]}
    **/
    _setRecords: function (items) {
        _yuitest_coverfunc("build/recordset-base/recordset-base.js", "_setRecords", 585);
_yuitest_coverline("build/recordset-base/recordset-base.js", 586);
if (!Y.Lang.isArray(items)) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 587);
return Y.Attribute.INVALID_VALUE;
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 590);
var records = [],
            i, len;

        // FIXME: This should use the flyweight pattern if possible
        _yuitest_coverline("build/recordset-base/recordset-base.js", 594);
for (i = 0, len = items.length; i < len; ++i) {
            _yuitest_coverline("build/recordset-base/recordset-base.js", 595);
records[i] = this._changeToRecord(items[i]);
        }

        _yuitest_coverline("build/recordset-base/recordset-base.js", 598);
return (this._items = records);
    }
}, {
    ATTRS: {

        /**
        * An array of Records that the Recordset is storing.  Passing an array
        * of raw record data is also accepted.  The data for each item will be
        * wrapped in a Record instance.
        *
        * @attribute records
        * @type {Record[]}
        */
        records: {
            // TODO: necessary? valueFn?
            lazyAdd: false,
            getter: function() {
                // give them a copy, not the internal object
                _yuitest_coverfunc("build/recordset-base/recordset-base.js", "getter", 614);
_yuitest_coverline("build/recordset-base/recordset-base.js", 616);
return Y.Array(this._items);
            },
            setter: "_setRecords"
        },

        /**
        A hash table where the ID of the record is the key, and the record
        instance is the value.
        
        @attribute table
        @type object
        **/
        table: {
            valueFn: '_initHashTable'
        },

        /**
        The ID to use as the key in the hash table.
        
        @attribute key
        @type string
        **/
        key: {
            value: 'id',
            readOnly: true
        }

    }
});
_yuitest_coverline("build/recordset-base/recordset-base.js", 645);
Y.augment(Recordset, ArrayList);
_yuitest_coverline("build/recordset-base/recordset-base.js", 646);
Y.Recordset = Recordset;



}, '3.7.3', {"requires": ["base", "arraylist"]});
