/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('arraylist', function (Y, NAME) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module collection
 * @submodule arraylist
 */

var YArray      = Y.Array,
    YArray_each = YArray.each,
    ArrayListProto;

/**
 * Generic ArrayList class for managing lists of items and iterating operations
 * over them.  The targeted use for this class is for augmentation onto a
 * class that is responsible for managing multiple instances of another class
 * (e.g. NodeList for Nodes).  The recommended use is to augment your class with
 * ArrayList, then use ArrayList.addMethod to mirror the API of the constituent
 * items on the list's API.
 *
 * The default implementation creates immutable lists, but mutability can be
 * provided via the arraylist-add submodule or by implementing mutation methods
 * directly on the augmented class's prototype.
 *
 * @class ArrayList
 * @constructor
 * @param items { Array } array of items this list will be responsible for
 */
function ArrayList( items ) {
    if ( items !== undefined ) {
        this._items = Y.Lang.isArray( items ) ? items : YArray( items );
    } else {
        // ||= to support lazy initialization from augment
        this._items = this._items || [];
    }
}

ArrayListProto = {
    /**
     * Get an item by index from the list.  Override this method if managing a
     * list of objects that have a different public representation (e.g. Node
     * instances vs DOM nodes).  The iteration methods that accept a user
     * function will use this method for access list items for operation.
     *
     * @method item
     * @param i { Integer } index to fetch
     * @return { mixed } the item at the requested index
     */
    item: function ( i ) {
        return this._items[i];
    },

    /**
     * <p>Execute a function on each item of the list, optionally providing a
     * custom execution context.  Default context is the item.</p>
     *
     * <p>The callback signature is <code>callback( item, index )</code>.</p>
     *
     * @method each
     * @param fn { Function } the function to execute
     * @param context { mixed } optional override 'this' in the function
     * @return { ArrayList } this instance
     * @chainable
     */
    each: function ( fn, context ) {
        YArray_each( this._items, function ( item, i ) {
            item = this.item( i );

            fn.call( context || item, item, i, this );
        }, this);

        return this;
    },

    /**
     * <p>Execute a function on each item of the list, optionally providing a
     * custom execution context.  Default context is the item.</p>
     *
     * <p>The callback signature is <code>callback( item, index )</code>.</p>
     *
     * <p>Unlike <code>each</code>, if the callback returns true, the
     * iteratation will stop.</p>
     *
     * @method some
     * @param fn { Function } the function to execute
     * @param context { mixed } optional override 'this' in the function
     * @return { Boolean } True if the function returned true on an item
     */
    some: function ( fn, context ) {
        return YArray.some( this._items, function ( item, i ) {
            item = this.item( i );

            return fn.call( context || item, item, i, this );
        }, this);
    },

    /**
     * Finds the first index of the needle in the managed array of items.
     *
     * @method indexOf
     * @param needle { mixed } The item to search for
     * @return { Integer } Array index if found.  Otherwise -1
     */
    indexOf: function ( needle ) {
        return YArray.indexOf( this._items, needle );
    },

    /**
     * How many items are in this list?
     *
     * @method size
     * @return { Integer } Number of items in the list
     */
    size: function () {
        return this._items.length;
    },

    /**
     * Is this instance managing any items?
     *
     * @method isEmpty
     * @return { Boolean } true if 1 or more items are being managed
     */
    isEmpty: function () {
        return !this.size();
    },

    /**
     * Provides an array-like representation for JSON.stringify.
     *
     * @method toJSON
     * @return { Array } an array representation of the ArrayList
     */
    toJSON: function () {
        return this._items;
    }
};
// Default implementation does not distinguish between public and private
// item getter
/**
 * Protected method for optimizations that may be appropriate for API
 * mirroring. Similar in functionality to <code>item</code>, but is used by
 * methods added with <code>ArrayList.addMethod()</code>.
 *
 * @method _item
 * @protected
 * @param i { Integer } Index of item to fetch
 * @return { mixed } The item appropriate for pass through API methods
 */
ArrayListProto._item = ArrayListProto.item;

// Mixed onto existing proto to preserve constructor NOT being an own property.
// This has bitten me when composing classes by enumerating, copying prototypes.
Y.mix(ArrayList.prototype, ArrayListProto);

Y.mix( ArrayList, {

    /**
     * <p>Adds a pass through method to dest (typically the prototype of a list
     * class) that calls the named method on each item in the list with
     * whatever parameters are passed in.  Allows for API indirection via list
     * instances.</p>
     *
     * <p>Accepts a single string name or an array of string names.</p>
     *
     * <pre><code>list.each( function ( item ) {
     *     item.methodName( 1, 2, 3 );
     * } );
     * // becomes
     * list.methodName( 1, 2, 3 );</code></pre>
     *
     * <p>Additionally, the pass through methods use the item retrieved by the
     * <code>_item</code> method in case there is any special behavior that is
     * appropriate for API mirroring.</p>
     *
     * <p>If the iterated method returns a value, the return value from the
     * added method will be an array of values with each value being at the
     * corresponding index for that item.  If the iterated method does not
     * return a value, the added method will be chainable.
     *
     * @method addMethod
     * @static
     * @param dest {Object} Object or prototype to receive the iterator method
     * @param name {String|String[]} Name of method of methods to create
     */
    addMethod: function ( dest, names ) {

        names = YArray( names );

        YArray_each( names, function ( name ) {
            dest[ name ] = function () {
                var args = YArray( arguments, 0, true ),
                    ret  = [];

                YArray_each( this._items, function ( item, i ) {
                    item = this._item( i );

                    var result = item[ name ].apply( item, args );

                    if ( result !== undefined && result !== item ) {
                        ret[i] = result;
                    }
                }, this);

                return ret.length ? ret : this;
            };
        } );
    }
} );

Y.ArrayList = ArrayList;


}, '3.7.3', {"requires": ["yui-base"]});
