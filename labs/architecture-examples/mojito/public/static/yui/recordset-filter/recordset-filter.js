/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('recordset-filter', function (Y, NAME) {

/**
 * Plugin that provides the ability to filter through a recordset.
 * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset.
 * @module recordset
 * @submodule recordset-filter
 */


var YArray = Y.Array,
Lang = Y.Lang;


/**
 * Plugin that provides the ability to filter through a recordset.
 * Uses the filter methods available on Y.Array (see arrayextras submodule) to filter the recordset. 
 * @class RecordsetFilter
 */
function RecordsetFilter(config) {
    RecordsetFilter.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetFilter, {
    NS: "filter",

    NAME: "recordsetFilter",

    ATTRS: {
    }

});


Y.extend(RecordsetFilter, Y.Plugin.Base, {


    /**
    Filter through the recordset with a custom filter function, or a key-value
    pair.
    
    @method filter
    @param {Function|String} filter A custom filter function or a string
        representing the key to filter by.
    @param {Any} [value] If filtering by key (_filter_ is a string), further
        filter by a specific value.
    @return {Recordset} A new filtered Recordset instance
    **/
    filter: function (filter, value) {
        var recs = this.get('host').get('records'),
            key;

        //If a key-value pair is passed in, generate a custom function
        if (value && Lang.isString(filter)) {
            key = filter;
            filter = function(item) {
                return (item.getValue(key) === value);
            };
        }

        //TODO: PARENT CHILD RELATIONSHIP
        return new Y.Recordset({
            records: YArray.filter(recs, filter)
        });
    },

    /**
    The inverse of filter. Executes the supplied function on each item. Returns
    a new Recordset containing the items that the supplied function returned
    `false` for.

    @method reject
    @param {Function} filter A boolean function, executed on each item.
    @return {Recordset} A new Recordset instance containing the items on which
        the supplied function returned false.
    **/
    reject: function (filter) {
        return new Y.Recordset({
            records: YArray.reject(this.get('host').get('records'), filter)
        });
    },

    /**
    Iterates over the Recordset, returning a new Recordset of all the elements
    that match the supplied regular expression

    @method grep
    @param {RegExp} pattern The regular expression to test against each record.
    @return {Recordset} A Recordset instance containing all the items in the
        collection that produce a match against the supplied regular
        expression. If no items match, an empty Recordset instance is returned.
    **/
    grep: function (pattern) {
        return new Y.Recordset({
            records: YArray.grep(this.get('host').get('records'), pattern)
        });
    }

    //TODO: Add more pass-through methods to arrayextras
});

Y.namespace("Plugin").RecordsetFilter = RecordsetFilter;


}, '3.7.3', {"requires": ["recordset-base", "array-extras", "plugin"]});
