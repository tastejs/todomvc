/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
        var items = this._items;

        if (Y.Lang.isNumber(index)) {
            items.splice(index, 0, item);
        }
        else {
            items.push(item);
        }

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
        comparator = comparator || this.itemsAreEqual;

        for (var i = this._items.length - 1; i >= 0; --i) {
            if (comparator.call(this, needle, this.item(i))) {
                this._items.splice(i, 1);
                if (!all) {
                    break;
                }
            }
        }

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
        return a === b;
    }

});


}, '3.7.3', {"requires": ["arraylist"]});
