/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('recordset-sort', function (Y, NAME) {

/**
 * Adds default and custom sorting functionality to the Recordset utility
 * @module recordset
 * @submodule recordset-sort
 */

var Compare = Y.ArraySort.compare,
isValue = Y.Lang.isValue;

/**
 * Plugin that adds default and custom sorting functionality to the Recordset utility
 * @class RecordsetSort
 */

function RecordsetSort(field, desc, sorter) {
    RecordsetSort.superclass.constructor.apply(this, arguments);
}

Y.mix(RecordsetSort, {
    NS: "sort",

    NAME: "recordsetSort",

    ATTRS: {

        /**
        * @description The last properties used to sort. Consists of an object literal with the keys "field", "desc", and "sorter"
        *
        * @attribute lastSortProperties
        * @public
        * @type object
        */
        lastSortProperties: {
            value: {
                field: undefined,
                desc: true,
                sorter: undefined
            },
            validator: function(v) {
                return (isValue(v.field) && isValue(v.desc) && isValue(v.sorter));
            }
        },

        /**
        * @description Default sort function to use if none is specified by the user.
        * Takes two records, the key to sort by, and whether sorting direction is descending or not (boolean).
        * If two records have the same value for a given key, the ID is used as the tie-breaker.
        *
        * @attribute defaultSorter
        * @public
        * @type function
        */
        defaultSorter: {
            value: function(recA, recB, field, desc) {
                var sorted = Compare(recA.getValue(field), recB.getValue(field), desc);
                if (sorted === 0) {
                    return Compare(recA.get("id"), recB.get("id"), desc);
                }
                else {
                    return sorted;
                }
            }
        },

        /**
        * @description A boolean telling if the recordset is in a sorted state.
        *
        * @attribute defaultSorter
        * @public
        * @type function
        */
        isSorted: {
            value: false
        }
    }
});

Y.extend(RecordsetSort, Y.Plugin.Base, {

    /**
     * @description Sets up the default function to use when the "sort" event is fired.
     *
     * @method initializer
     * @protected
     */
    initializer: function(config) {

        var self = this,
        host = this.get('host');


        this.publish("sort", {
            defaultFn: Y.bind("_defSortFn", this)
        });

        //Toggle the isSorted ATTR based on events.
        //Remove events dont affect isSorted, as they are just popped/sliced out
        this.on("sort",
        function() {
            self.set('isSorted', true);
        });

        this.onHostEvent('add',
        function() {
            self.set('isSorted', false);
        },
        host);
        this.onHostEvent('update',
        function() {
            self.set('isSorted', false);
        },
        host);

    },

    destructor: function(config) {
        },

    /**
     * @description Method that all sort calls go through. 
     * Sets up the lastSortProperties object with the details of the sort, and passes in parameters 
     * to the "defaultSorter" or a custom specified sort function.
     *
     * @method _defSortFn
     * @private
     */
    _defSortFn: function(e) {
        //have to work directly with _items here - changing the recordset.
        this.get("host")._items.sort(function(a, b) {
            return (e.sorter)(a, b, e.field, e.desc);
        });
        
        this.set('lastSortProperties', e);
    },

    /**
     * @description Sorts the recordset.
     *
     * @method sort
     * @param field {string} A key to sort by.
     * @param desc {boolean} True if you want sort order to be descending, false if you want sort order to be ascending
     * @public
     */
    sort: function(field, desc, sorter) {
        this.fire("sort", {
            field: field,
            desc: desc,
            sorter: sorter || this.get("defaultSorter")
        });
    },

    /**
     * @description Resorts the recordset based on the last-used sort parameters (stored in 'lastSortProperties' ATTR)
     *
     * @method resort
     * @public
     */
    resort: function() {
        var p = this.get('lastSortProperties');
        this.fire("sort", {
            field: p.field,
            desc: p.desc,
            sorter: p.sorter || this.get("defaultSorter")
        });
    },

    /**
     * @description Reverses the recordset calling the standard array.reverse() method.
     *
     * @method reverse
     * @public
     */
    reverse: function() {
        this.get('host')._items.reverse();
    },

    /**
     * @description Sorts the recordset based on the last-used sort parameters, but flips the order. (ie: Descending becomes ascending, and vice versa).
     *
     * @method flip
     * @public
     */
    flip: function() {
        var p = this.get('lastSortProperties');

        //If a predefined field is not provided by which to sort by, throw an error
        if (isValue(p.field)) {
            this.fire("sort", {
                field: p.field,
                desc: !p.desc,
                sorter: p.sorter || this.get("defaultSorter")
            });
        }
        else {
            Y.log('You called flip before setting a field by which to sort by. Maybe you meant to call reverse().');
        }
    }
});

Y.namespace("Plugin").RecordsetSort = RecordsetSort;



}, '3.7.3', {"requires": ["arraysort", "recordset-base", "plugin"]});
