/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('recordset-base', function (Y, NAME) {

/**
 * Provides a wrapper around a standard javascript object. Can be inserted into a Recordset instance.
 *
 * @class Record
 */
var Record = Y.Base.create('record', Y.Base, [], {
    _setId: function() {
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
        if (field === undefined) {
            return this.get("data");
        }
        else {
            return this.get("data")[field];
        }
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

Y.Record = Record;
/**
The Recordset utility provides a standard way for dealing with
a collection of similar objects.
@module recordset
@main recordset
@submodule recordset-base
**/


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
        if (!this._items) {
            this._items = [];
        }

        //set up event listener to fire events when recordset is modified in anyway
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

        this._buildHashTable(this.get('key'));

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

        if (Lang.isString(i)) {
            return this.get('table')[i];
        }
        else if (Lang.isNumber(i)) {
            return this._items[i];
        }
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
        var i = 0,
        returnedRecords = [];
        //Range cannot take on negative values
        range = (Lang.isNumber(range) && (range > 0)) ? range: 1;

        for (; i < range; i++) {
            returnedRecords.push(this._items[index + i]);
        }
        return returnedRecords;
    },

    /**
     * Returns the length of the recordset
     *
     * @method getLength
     * @return {Number} Number of records in the recordset
     */
    getLength: function() {
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
        var i = 0,
        len = this._items.length,
        retVals = [];
        for (; i < len; i++) {
            retVals.push(this._items[i].getValue(key));
        }
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

        var newRecords = [],
        idx,
        i = 0;

        idx = (Lang.isNumber(index) && (index > -1)) ? index: this._items.length;

        //Passing in array of object literals for oData
        if (Lang.isArray(oData)) {
            for (; i < oData.length; i++) {
                newRecords[i] = this._changeToRecord(oData[i]);
            }
        } else if (Lang.isObject(oData)) {
            newRecords[0] = this._changeToRecord(oData);
        }

        this.fire('add', {
            added: newRecords,
            index: idx
        });
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
        var remRecords = [];

        //Default is to only remove the last record - the length is always 1 greater than the last index
        index = (index > -1) ? index: (this._items.length - 1);
        range = (range > 0) ? range: 1;

        remRecords = this._items.slice(index, (index + range));
        this.fire('remove', {
            removed: remRecords,
            range: range,
            index: index
        });
        //this._recordRemoved(remRecords, index);
        //return ({data: remRecords, index:index});
        return this;
    },

    /**
     * Empties the recordset
     *
     * @method empty
     * @return {Recordset} The updated recordset instance
     */
    empty: function() {
        this.fire('empty', {});
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
        var rec,
            arr,
            i = 0;

        // Whatever is passed in, we are changing it to an array so that it can
        // be easily iterated in the _defUpdateFn method
        arr = (!(Lang.isArray(data))) ? [data] : data;
        rec = this._items.slice(index, index + arr.length);

        for (; i < arr.length; i++) {
            arr[i] = this._changeToRecord(arr[i]);
        }

        this.fire('update', {
            updated: arr,
            overwritten: rec,
            index: index
        });

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
        for (var i = 0; i < e.updated.length; i++) {
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
        this._items = [];
        Y.log('empty fired');
    },

    /**
    Updates the internal hash table.

    @method _defUpdateHash
    @param {EventFacade} e Event triggering the hash table update
    @private
    **/
    _updateHash: function (e) {
        var handler = "_hash",
            type = e.type.replace(/.*:/,''),
            newHash;

        // _hashAdd, _hashRemove, _hashEmpty, etc
        // Not a switch or else if setup to allow for external expansion.
        handler += type.charAt(0).toUpperCase() + type.slice(1);

        newHash = this[handler] &&
                    this[handler](this.get('table'), this.get('key'), e);

        if (newHash) {
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
        var items = e.added,
            i, len;

        for (i = 0, len = e.added.length; i < len; ++i) {
            hash[items[i].get(key)] = items[i];
        }

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
        for (var i = e.removed.length - 1; i >= 0; --i) {
            delete hash[e.removed[i].get(key)];
        }

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
        if (e.overwritten && e.overwritten.length) {
            hash = this._hashRemove(hash, key, { removed: e.overwritten });
        }

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
        return {};
    },

    /**
     * Sets up the hashtable with all the records currently in the recordset
     *
     * @method _initHashTable
     * @private
     */
    _initHashTable: function() {
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
        if (!Y.Lang.isArray(items)) {
            return Y.Attribute.INVALID_VALUE;
        }

        var records = [],
            i, len;

        // FIXME: This should use the flyweight pattern if possible
        for (i = 0, len = items.length; i < len; ++i) {
            records[i] = this._changeToRecord(items[i]);
        }

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
Y.augment(Recordset, ArrayList);
Y.Recordset = Recordset;



}, '3.7.3', {"requires": ["base", "arraylist"]});
