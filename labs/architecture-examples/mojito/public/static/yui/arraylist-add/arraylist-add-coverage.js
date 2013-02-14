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
_yuitest_coverage["build/arraylist-add/arraylist-add.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/arraylist-add/arraylist-add.js",
    code: []
};
_yuitest_coverage["build/arraylist-add/arraylist-add.js"].code=["YUI.add('arraylist-add', function (Y, NAME) {","","/**"," * Collection utilities beyond what is provided in the YUI core"," * @module collection"," * @submodule arraylist-add"," * @deprecated Use ModelList or a custom ArrayList subclass"," */","","/*"," * Adds methods add and remove to Y.ArrayList"," */","Y.mix(Y.ArrayList.prototype, {","","    /**","     * Add a single item to the ArrayList.  Does not prevent duplicates.","     *","     * @method add","     * @param { mixed } item Item presumably of the same type as others in the","     *                       ArrayList.","     * @param {Number} index (Optional.)  Number representing the position at","     * which the item should be inserted.","     * @return {ArrayList} the instance.","     * @for ArrayList","     * @deprecated Use ModelList or a custom ArrayList subclass","     * @chainable","     */","    add: function(item, index) {","        var items = this._items;","","        if (Y.Lang.isNumber(index)) {","            items.splice(index, 0, item);","        }","        else {","            items.push(item);","        }","","        return this;","    },","","    /**","     * Removes first or all occurrences of an item to the ArrayList.  If a","     * comparator is not provided, uses itemsAreEqual method to determine","     * matches.","     *","     * @method remove","     * @param { mixed } needle Item to find and remove from the list.","     * @param { Boolean } all If true, remove all occurrences.","     * @param { Function } comparator optional a/b function to test equivalence.","     * @return {ArrayList} the instance.","     * @for ArrayList","     * @deprecated Use ModelList or a custom ArrayList subclass","     * @chainable","     */","    remove: function(needle, all, comparator) {","        comparator = comparator || this.itemsAreEqual;","","        for (var i = this._items.length - 1; i >= 0; --i) {","            if (comparator.call(this, needle, this.item(i))) {","                this._items.splice(i, 1);","                if (!all) {","                    break;","                }","            }","        }","","        return this;","    },","","    /**","     * Default comparator for items stored in this list.  Used by remove().","     *","     * @method itemsAreEqual","     * @param { mixed } a item to test equivalence with.","     * @param { mixed } b other item to test equivalance.","     * @return { Boolean } true if items are deemed equivalent.","     * @for ArrayList","     * @deprecated Use ModelList or a custom ArrayList subclass","     */","    itemsAreEqual: function(a, b) {","        return a === b;","    }","","});","","","}, '3.7.3', {\"requires\": [\"arraylist\"]});"];
_yuitest_coverage["build/arraylist-add/arraylist-add.js"].lines = {"1":0,"13":0,"29":0,"31":0,"32":0,"35":0,"38":0,"56":0,"58":0,"59":0,"60":0,"61":0,"62":0,"67":0,"81":0};
_yuitest_coverage["build/arraylist-add/arraylist-add.js"].functions = {"add:28":0,"remove:55":0,"itemsAreEqual:80":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arraylist-add/arraylist-add.js"].coveredLines = 15;
_yuitest_coverage["build/arraylist-add/arraylist-add.js"].coveredFunctions = 4;
_yuitest_coverline("build/arraylist-add/arraylist-add.js", 1);
YUI.add('arraylist-add', function (Y, NAME) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module collection
 * @submodule arraylist-add
 * @deprecated Use ModelList or a custom ArrayList subclass
 */

/*
 * Adds methods add and remove to Y.ArrayList
 */
_yuitest_coverfunc("build/arraylist-add/arraylist-add.js", "(anonymous 1)", 1);
_yuitest_coverline("build/arraylist-add/arraylist-add.js", 13);
Y.mix(Y.ArrayList.prototype, {

    /**
     * Add a single item to the ArrayList.  Does not prevent duplicates.
     *
     * @method add
     * @param { mixed } item Item presumably of the same type as others in the
     *                       ArrayList.
     * @param {Number} index (Optional.)  Number representing the position at
     * which the item should be inserted.
     * @return {ArrayList} the instance.
     * @for ArrayList
     * @deprecated Use ModelList or a custom ArrayList subclass
     * @chainable
     */
    add: function(item, index) {
        _yuitest_coverfunc("build/arraylist-add/arraylist-add.js", "add", 28);
_yuitest_coverline("build/arraylist-add/arraylist-add.js", 29);
var items = this._items;

        _yuitest_coverline("build/arraylist-add/arraylist-add.js", 31);
if (Y.Lang.isNumber(index)) {
            _yuitest_coverline("build/arraylist-add/arraylist-add.js", 32);
items.splice(index, 0, item);
        }
        else {
            _yuitest_coverline("build/arraylist-add/arraylist-add.js", 35);
items.push(item);
        }

        _yuitest_coverline("build/arraylist-add/arraylist-add.js", 38);
return this;
    },

    /**
     * Removes first or all occurrences of an item to the ArrayList.  If a
     * comparator is not provided, uses itemsAreEqual method to determine
     * matches.
     *
     * @method remove
     * @param { mixed } needle Item to find and remove from the list.
     * @param { Boolean } all If true, remove all occurrences.
     * @param { Function } comparator optional a/b function to test equivalence.
     * @return {ArrayList} the instance.
     * @for ArrayList
     * @deprecated Use ModelList or a custom ArrayList subclass
     * @chainable
     */
    remove: function(needle, all, comparator) {
        _yuitest_coverfunc("build/arraylist-add/arraylist-add.js", "remove", 55);
_yuitest_coverline("build/arraylist-add/arraylist-add.js", 56);
comparator = comparator || this.itemsAreEqual;

        _yuitest_coverline("build/arraylist-add/arraylist-add.js", 58);
for (var i = this._items.length - 1; i >= 0; --i) {
            _yuitest_coverline("build/arraylist-add/arraylist-add.js", 59);
if (comparator.call(this, needle, this.item(i))) {
                _yuitest_coverline("build/arraylist-add/arraylist-add.js", 60);
this._items.splice(i, 1);
                _yuitest_coverline("build/arraylist-add/arraylist-add.js", 61);
if (!all) {
                    _yuitest_coverline("build/arraylist-add/arraylist-add.js", 62);
break;
                }
            }
        }

        _yuitest_coverline("build/arraylist-add/arraylist-add.js", 67);
return this;
    },

    /**
     * Default comparator for items stored in this list.  Used by remove().
     *
     * @method itemsAreEqual
     * @param { mixed } a item to test equivalence with.
     * @param { mixed } b other item to test equivalance.
     * @return { Boolean } true if items are deemed equivalent.
     * @for ArrayList
     * @deprecated Use ModelList or a custom ArrayList subclass
     */
    itemsAreEqual: function(a, b) {
        _yuitest_coverfunc("build/arraylist-add/arraylist-add.js", "itemsAreEqual", 80);
_yuitest_coverline("build/arraylist-add/arraylist-add.js", 81);
return a === b;
    }

});


}, '3.7.3', {"requires": ["arraylist"]});
