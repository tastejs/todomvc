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
_yuitest_coverage["build/recordset-sort/recordset-sort.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/recordset-sort/recordset-sort.js",
    code: []
};
_yuitest_coverage["build/recordset-sort/recordset-sort.js"].code=["YUI.add('recordset-sort', function (Y, NAME) {","","/**"," * Adds default and custom sorting functionality to the Recordset utility"," * @module recordset"," * @submodule recordset-sort"," */","","var Compare = Y.ArraySort.compare,","isValue = Y.Lang.isValue;","","/**"," * Plugin that adds default and custom sorting functionality to the Recordset utility"," * @class RecordsetSort"," */","","function RecordsetSort(field, desc, sorter) {","    RecordsetSort.superclass.constructor.apply(this, arguments);","}","","Y.mix(RecordsetSort, {","    NS: \"sort\",","","    NAME: \"recordsetSort\",","","    ATTRS: {","","        /**","        * @description The last properties used to sort. Consists of an object literal with the keys \"field\", \"desc\", and \"sorter\"","        *","        * @attribute lastSortProperties","        * @public","        * @type object","        */","        lastSortProperties: {","            value: {","                field: undefined,","                desc: true,","                sorter: undefined","            },","            validator: function(v) {","                return (isValue(v.field) && isValue(v.desc) && isValue(v.sorter));","            }","        },","","        /**","        * @description Default sort function to use if none is specified by the user.","        * Takes two records, the key to sort by, and whether sorting direction is descending or not (boolean).","        * If two records have the same value for a given key, the ID is used as the tie-breaker.","        *","        * @attribute defaultSorter","        * @public","        * @type function","        */","        defaultSorter: {","            value: function(recA, recB, field, desc) {","                var sorted = Compare(recA.getValue(field), recB.getValue(field), desc);","                if (sorted === 0) {","                    return Compare(recA.get(\"id\"), recB.get(\"id\"), desc);","                }","                else {","                    return sorted;","                }","            }","        },","","        /**","        * @description A boolean telling if the recordset is in a sorted state.","        *","        * @attribute defaultSorter","        * @public","        * @type function","        */","        isSorted: {","            value: false","        }","    }","});","","Y.extend(RecordsetSort, Y.Plugin.Base, {","","    /**","     * @description Sets up the default function to use when the \"sort\" event is fired.","     *","     * @method initializer","     * @protected","     */","    initializer: function(config) {","","        var self = this,","        host = this.get('host');","","","        this.publish(\"sort\", {","            defaultFn: Y.bind(\"_defSortFn\", this)","        });","","        //Toggle the isSorted ATTR based on events.","        //Remove events dont affect isSorted, as they are just popped/sliced out","        this.on(\"sort\",","        function() {","            self.set('isSorted', true);","        });","","        this.onHostEvent('add',","        function() {","            self.set('isSorted', false);","        },","        host);","        this.onHostEvent('update',","        function() {","            self.set('isSorted', false);","        },","        host);","","    },","","    destructor: function(config) {","        },","","    /**","     * @description Method that all sort calls go through. ","     * Sets up the lastSortProperties object with the details of the sort, and passes in parameters ","     * to the \"defaultSorter\" or a custom specified sort function.","     *","     * @method _defSortFn","     * @private","     */","    _defSortFn: function(e) {","        //have to work directly with _items here - changing the recordset.","        this.get(\"host\")._items.sort(function(a, b) {","            return (e.sorter)(a, b, e.field, e.desc);","        });","        ","        this.set('lastSortProperties', e);","    },","","    /**","     * @description Sorts the recordset.","     *","     * @method sort","     * @param field {string} A key to sort by.","     * @param desc {boolean} True if you want sort order to be descending, false if you want sort order to be ascending","     * @public","     */","    sort: function(field, desc, sorter) {","        this.fire(\"sort\", {","            field: field,","            desc: desc,","            sorter: sorter || this.get(\"defaultSorter\")","        });","    },","","    /**","     * @description Resorts the recordset based on the last-used sort parameters (stored in 'lastSortProperties' ATTR)","     *","     * @method resort","     * @public","     */","    resort: function() {","        var p = this.get('lastSortProperties');","        this.fire(\"sort\", {","            field: p.field,","            desc: p.desc,","            sorter: p.sorter || this.get(\"defaultSorter\")","        });","    },","","    /**","     * @description Reverses the recordset calling the standard array.reverse() method.","     *","     * @method reverse","     * @public","     */","    reverse: function() {","        this.get('host')._items.reverse();","    },","","    /**","     * @description Sorts the recordset based on the last-used sort parameters, but flips the order. (ie: Descending becomes ascending, and vice versa).","     *","     * @method flip","     * @public","     */","    flip: function() {","        var p = this.get('lastSortProperties');","","        //If a predefined field is not provided by which to sort by, throw an error","        if (isValue(p.field)) {","            this.fire(\"sort\", {","                field: p.field,","                desc: !p.desc,","                sorter: p.sorter || this.get(\"defaultSorter\")","            });","        }","        else {","        }","    }","});","","Y.namespace(\"Plugin\").RecordsetSort = RecordsetSort;","","","","}, '3.7.3', {\"requires\": [\"arraysort\", \"recordset-base\", \"plugin\"]});"];
_yuitest_coverage["build/recordset-sort/recordset-sort.js"].lines = {"1":0,"9":0,"17":0,"18":0,"21":0,"42":0,"57":0,"58":0,"59":0,"62":0,"80":0,"90":0,"94":0,"100":0,"102":0,"105":0,"107":0,"110":0,"112":0,"131":0,"132":0,"135":0,"147":0,"161":0,"162":0,"176":0,"186":0,"189":0,"190":0,"201":0};
_yuitest_coverage["build/recordset-sort/recordset-sort.js"].functions = {"RecordsetSort:17":0,"validator:41":0,"value:56":0,"(anonymous 2):101":0,"(anonymous 3):106":0,"(anonymous 4):111":0,"initializer:88":0,"(anonymous 5):131":0,"_defSortFn:129":0,"sort:146":0,"resort:160":0,"reverse:175":0,"flip:185":0,"(anonymous 1):1":0};
_yuitest_coverage["build/recordset-sort/recordset-sort.js"].coveredLines = 30;
_yuitest_coverage["build/recordset-sort/recordset-sort.js"].coveredFunctions = 14;
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 1);
YUI.add('recordset-sort', function (Y, NAME) {

/**
 * Adds default and custom sorting functionality to the Recordset utility
 * @module recordset
 * @submodule recordset-sort
 */

_yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "(anonymous 1)", 1);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 9);
var Compare = Y.ArraySort.compare,
isValue = Y.Lang.isValue;

/**
 * Plugin that adds default and custom sorting functionality to the Recordset utility
 * @class RecordsetSort
 */

_yuitest_coverline("build/recordset-sort/recordset-sort.js", 17);
function RecordsetSort(field, desc, sorter) {
    _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "RecordsetSort", 17);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 18);
RecordsetSort.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/recordset-sort/recordset-sort.js", 21);
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
                _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "validator", 41);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 42);
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
                _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "value", 56);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 57);
var sorted = Compare(recA.getValue(field), recB.getValue(field), desc);
                _yuitest_coverline("build/recordset-sort/recordset-sort.js", 58);
if (sorted === 0) {
                    _yuitest_coverline("build/recordset-sort/recordset-sort.js", 59);
return Compare(recA.get("id"), recB.get("id"), desc);
                }
                else {
                    _yuitest_coverline("build/recordset-sort/recordset-sort.js", 62);
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

_yuitest_coverline("build/recordset-sort/recordset-sort.js", 80);
Y.extend(RecordsetSort, Y.Plugin.Base, {

    /**
     * @description Sets up the default function to use when the "sort" event is fired.
     *
     * @method initializer
     * @protected
     */
    initializer: function(config) {

        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "initializer", 88);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 90);
var self = this,
        host = this.get('host');


        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 94);
this.publish("sort", {
            defaultFn: Y.bind("_defSortFn", this)
        });

        //Toggle the isSorted ATTR based on events.
        //Remove events dont affect isSorted, as they are just popped/sliced out
        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 100);
this.on("sort",
        function() {
            _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "(anonymous 2)", 101);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 102);
self.set('isSorted', true);
        });

        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 105);
this.onHostEvent('add',
        function() {
            _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "(anonymous 3)", 106);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 107);
self.set('isSorted', false);
        },
        host);
        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 110);
this.onHostEvent('update',
        function() {
            _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "(anonymous 4)", 111);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 112);
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
        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "_defSortFn", 129);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 131);
this.get("host")._items.sort(function(a, b) {
            _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "(anonymous 5)", 131);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 132);
return (e.sorter)(a, b, e.field, e.desc);
        });
        
        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 135);
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
        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "sort", 146);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 147);
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
        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "resort", 160);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 161);
var p = this.get('lastSortProperties');
        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 162);
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
        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "reverse", 175);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 176);
this.get('host')._items.reverse();
    },

    /**
     * @description Sorts the recordset based on the last-used sort parameters, but flips the order. (ie: Descending becomes ascending, and vice versa).
     *
     * @method flip
     * @public
     */
    flip: function() {
        _yuitest_coverfunc("build/recordset-sort/recordset-sort.js", "flip", 185);
_yuitest_coverline("build/recordset-sort/recordset-sort.js", 186);
var p = this.get('lastSortProperties');

        //If a predefined field is not provided by which to sort by, throw an error
        _yuitest_coverline("build/recordset-sort/recordset-sort.js", 189);
if (isValue(p.field)) {
            _yuitest_coverline("build/recordset-sort/recordset-sort.js", 190);
this.fire("sort", {
                field: p.field,
                desc: !p.desc,
                sorter: p.sorter || this.get("defaultSorter")
            });
        }
        else {
        }
    }
});

_yuitest_coverline("build/recordset-sort/recordset-sort.js", 201);
Y.namespace("Plugin").RecordsetSort = RecordsetSort;



}, '3.7.3', {"requires": ["arraysort", "recordset-base", "plugin"]});
