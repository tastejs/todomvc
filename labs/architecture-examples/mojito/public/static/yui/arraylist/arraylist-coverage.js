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
_yuitest_coverage["build/arraylist/arraylist.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/arraylist/arraylist.js",
    code: []
};
_yuitest_coverage["build/arraylist/arraylist.js"].code=["YUI.add('arraylist', function (Y, NAME) {","","/**"," * Collection utilities beyond what is provided in the YUI core"," * @module collection"," * @submodule arraylist"," */","","var YArray      = Y.Array,","    YArray_each = YArray.each,","    ArrayListProto;","","/**"," * Generic ArrayList class for managing lists of items and iterating operations"," * over them.  The targeted use for this class is for augmentation onto a"," * class that is responsible for managing multiple instances of another class"," * (e.g. NodeList for Nodes).  The recommended use is to augment your class with"," * ArrayList, then use ArrayList.addMethod to mirror the API of the constituent"," * items on the list's API."," *"," * The default implementation creates immutable lists, but mutability can be"," * provided via the arraylist-add submodule or by implementing mutation methods"," * directly on the augmented class's prototype."," *"," * @class ArrayList"," * @constructor"," * @param items { Array } array of items this list will be responsible for"," */","function ArrayList( items ) {","    if ( items !== undefined ) {","        this._items = Y.Lang.isArray( items ) ? items : YArray( items );","    } else {","        // ||= to support lazy initialization from augment","        this._items = this._items || [];","    }","}","","ArrayListProto = {","    /**","     * Get an item by index from the list.  Override this method if managing a","     * list of objects that have a different public representation (e.g. Node","     * instances vs DOM nodes).  The iteration methods that accept a user","     * function will use this method for access list items for operation.","     *","     * @method item","     * @param i { Integer } index to fetch","     * @return { mixed } the item at the requested index","     */","    item: function ( i ) {","        return this._items[i];","    },","","    /**","     * <p>Execute a function on each item of the list, optionally providing a","     * custom execution context.  Default context is the item.</p>","     *","     * <p>The callback signature is <code>callback( item, index )</code>.</p>","     *","     * @method each","     * @param fn { Function } the function to execute","     * @param context { mixed } optional override 'this' in the function","     * @return { ArrayList } this instance","     * @chainable","     */","    each: function ( fn, context ) {","        YArray_each( this._items, function ( item, i ) {","            item = this.item( i );","","            fn.call( context || item, item, i, this );","        }, this);","","        return this;","    },","","    /**","     * <p>Execute a function on each item of the list, optionally providing a","     * custom execution context.  Default context is the item.</p>","     *","     * <p>The callback signature is <code>callback( item, index )</code>.</p>","     *","     * <p>Unlike <code>each</code>, if the callback returns true, the","     * iteratation will stop.</p>","     *","     * @method some","     * @param fn { Function } the function to execute","     * @param context { mixed } optional override 'this' in the function","     * @return { Boolean } True if the function returned true on an item","     */","    some: function ( fn, context ) {","        return YArray.some( this._items, function ( item, i ) {","            item = this.item( i );","","            return fn.call( context || item, item, i, this );","        }, this);","    },","","    /**","     * Finds the first index of the needle in the managed array of items.","     *","     * @method indexOf","     * @param needle { mixed } The item to search for","     * @return { Integer } Array index if found.  Otherwise -1","     */","    indexOf: function ( needle ) {","        return YArray.indexOf( this._items, needle );","    },","","    /**","     * How many items are in this list?","     *","     * @method size","     * @return { Integer } Number of items in the list","     */","    size: function () {","        return this._items.length;","    },","","    /**","     * Is this instance managing any items?","     *","     * @method isEmpty","     * @return { Boolean } true if 1 or more items are being managed","     */","    isEmpty: function () {","        return !this.size();","    },","","    /**","     * Provides an array-like representation for JSON.stringify.","     *","     * @method toJSON","     * @return { Array } an array representation of the ArrayList","     */","    toJSON: function () {","        return this._items;","    }","};","// Default implementation does not distinguish between public and private","// item getter","/**"," * Protected method for optimizations that may be appropriate for API"," * mirroring. Similar in functionality to <code>item</code>, but is used by"," * methods added with <code>ArrayList.addMethod()</code>."," *"," * @method _item"," * @protected"," * @param i { Integer } Index of item to fetch"," * @return { mixed } The item appropriate for pass through API methods"," */","ArrayListProto._item = ArrayListProto.item;","","// Mixed onto existing proto to preserve constructor NOT being an own property.","// This has bitten me when composing classes by enumerating, copying prototypes.","Y.mix(ArrayList.prototype, ArrayListProto);","","Y.mix( ArrayList, {","","    /**","     * <p>Adds a pass through method to dest (typically the prototype of a list","     * class) that calls the named method on each item in the list with","     * whatever parameters are passed in.  Allows for API indirection via list","     * instances.</p>","     *","     * <p>Accepts a single string name or an array of string names.</p>","     *","     * <pre><code>list.each( function ( item ) {","     *     item.methodName( 1, 2, 3 );","     * } );","     * // becomes","     * list.methodName( 1, 2, 3 );</code></pre>","     *","     * <p>Additionally, the pass through methods use the item retrieved by the","     * <code>_item</code> method in case there is any special behavior that is","     * appropriate for API mirroring.</p>","     *","     * <p>If the iterated method returns a value, the return value from the","     * added method will be an array of values with each value being at the","     * corresponding index for that item.  If the iterated method does not","     * return a value, the added method will be chainable.","     *","     * @method addMethod","     * @static","     * @param dest {Object} Object or prototype to receive the iterator method","     * @param name {String|String[]} Name of method of methods to create","     */","    addMethod: function ( dest, names ) {","","        names = YArray( names );","","        YArray_each( names, function ( name ) {","            dest[ name ] = function () {","                var args = YArray( arguments, 0, true ),","                    ret  = [];","","                YArray_each( this._items, function ( item, i ) {","                    item = this._item( i );","","                    var result = item[ name ].apply( item, args );","","                    if ( result !== undefined && result !== item ) {","                        ret[i] = result;","                    }","                }, this);","","                return ret.length ? ret : this;","            };","        } );","    }","} );","","Y.ArrayList = ArrayList;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/arraylist/arraylist.js"].lines = {"1":0,"9":0,"29":0,"30":0,"31":0,"34":0,"38":0,"50":0,"66":0,"67":0,"69":0,"72":0,"90":0,"91":0,"93":0,"105":0,"115":0,"125":0,"135":0,"150":0,"154":0,"156":0,"188":0,"190":0,"191":0,"192":0,"195":0,"196":0,"198":0,"200":0,"201":0,"205":0,"211":0};
_yuitest_coverage["build/arraylist/arraylist.js"].functions = {"ArrayList:29":0,"item:49":0,"(anonymous 2):66":0,"each:65":0,"(anonymous 3):90":0,"some:89":0,"indexOf:104":0,"size:114":0,"isEmpty:124":0,"toJSON:134":0,"(anonymous 5):195":0,"]:191":0,"(anonymous 4):190":0,"addMethod:186":0,"(anonymous 1):1":0};
_yuitest_coverage["build/arraylist/arraylist.js"].coveredLines = 33;
_yuitest_coverage["build/arraylist/arraylist.js"].coveredFunctions = 15;
_yuitest_coverline("build/arraylist/arraylist.js", 1);
YUI.add('arraylist', function (Y, NAME) {

/**
 * Collection utilities beyond what is provided in the YUI core
 * @module collection
 * @submodule arraylist
 */

_yuitest_coverfunc("build/arraylist/arraylist.js", "(anonymous 1)", 1);
_yuitest_coverline("build/arraylist/arraylist.js", 9);
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
_yuitest_coverline("build/arraylist/arraylist.js", 29);
function ArrayList( items ) {
    _yuitest_coverfunc("build/arraylist/arraylist.js", "ArrayList", 29);
_yuitest_coverline("build/arraylist/arraylist.js", 30);
if ( items !== undefined ) {
        _yuitest_coverline("build/arraylist/arraylist.js", 31);
this._items = Y.Lang.isArray( items ) ? items : YArray( items );
    } else {
        // ||= to support lazy initialization from augment
        _yuitest_coverline("build/arraylist/arraylist.js", 34);
this._items = this._items || [];
    }
}

_yuitest_coverline("build/arraylist/arraylist.js", 38);
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
        _yuitest_coverfunc("build/arraylist/arraylist.js", "item", 49);
_yuitest_coverline("build/arraylist/arraylist.js", 50);
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
        _yuitest_coverfunc("build/arraylist/arraylist.js", "each", 65);
_yuitest_coverline("build/arraylist/arraylist.js", 66);
YArray_each( this._items, function ( item, i ) {
            _yuitest_coverfunc("build/arraylist/arraylist.js", "(anonymous 2)", 66);
_yuitest_coverline("build/arraylist/arraylist.js", 67);
item = this.item( i );

            _yuitest_coverline("build/arraylist/arraylist.js", 69);
fn.call( context || item, item, i, this );
        }, this);

        _yuitest_coverline("build/arraylist/arraylist.js", 72);
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
        _yuitest_coverfunc("build/arraylist/arraylist.js", "some", 89);
_yuitest_coverline("build/arraylist/arraylist.js", 90);
return YArray.some( this._items, function ( item, i ) {
            _yuitest_coverfunc("build/arraylist/arraylist.js", "(anonymous 3)", 90);
_yuitest_coverline("build/arraylist/arraylist.js", 91);
item = this.item( i );

            _yuitest_coverline("build/arraylist/arraylist.js", 93);
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
        _yuitest_coverfunc("build/arraylist/arraylist.js", "indexOf", 104);
_yuitest_coverline("build/arraylist/arraylist.js", 105);
return YArray.indexOf( this._items, needle );
    },

    /**
     * How many items are in this list?
     *
     * @method size
     * @return { Integer } Number of items in the list
     */
    size: function () {
        _yuitest_coverfunc("build/arraylist/arraylist.js", "size", 114);
_yuitest_coverline("build/arraylist/arraylist.js", 115);
return this._items.length;
    },

    /**
     * Is this instance managing any items?
     *
     * @method isEmpty
     * @return { Boolean } true if 1 or more items are being managed
     */
    isEmpty: function () {
        _yuitest_coverfunc("build/arraylist/arraylist.js", "isEmpty", 124);
_yuitest_coverline("build/arraylist/arraylist.js", 125);
return !this.size();
    },

    /**
     * Provides an array-like representation for JSON.stringify.
     *
     * @method toJSON
     * @return { Array } an array representation of the ArrayList
     */
    toJSON: function () {
        _yuitest_coverfunc("build/arraylist/arraylist.js", "toJSON", 134);
_yuitest_coverline("build/arraylist/arraylist.js", 135);
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
_yuitest_coverline("build/arraylist/arraylist.js", 150);
ArrayListProto._item = ArrayListProto.item;

// Mixed onto existing proto to preserve constructor NOT being an own property.
// This has bitten me when composing classes by enumerating, copying prototypes.
_yuitest_coverline("build/arraylist/arraylist.js", 154);
Y.mix(ArrayList.prototype, ArrayListProto);

_yuitest_coverline("build/arraylist/arraylist.js", 156);
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

        _yuitest_coverfunc("build/arraylist/arraylist.js", "addMethod", 186);
_yuitest_coverline("build/arraylist/arraylist.js", 188);
names = YArray( names );

        _yuitest_coverline("build/arraylist/arraylist.js", 190);
YArray_each( names, function ( name ) {
            _yuitest_coverfunc("build/arraylist/arraylist.js", "(anonymous 4)", 190);
_yuitest_coverline("build/arraylist/arraylist.js", 191);
dest[ name ] = function () {
                _yuitest_coverfunc("build/arraylist/arraylist.js", "]", 191);
_yuitest_coverline("build/arraylist/arraylist.js", 192);
var args = YArray( arguments, 0, true ),
                    ret  = [];

                _yuitest_coverline("build/arraylist/arraylist.js", 195);
YArray_each( this._items, function ( item, i ) {
                    _yuitest_coverfunc("build/arraylist/arraylist.js", "(anonymous 5)", 195);
_yuitest_coverline("build/arraylist/arraylist.js", 196);
item = this._item( i );

                    _yuitest_coverline("build/arraylist/arraylist.js", 198);
var result = item[ name ].apply( item, args );

                    _yuitest_coverline("build/arraylist/arraylist.js", 200);
if ( result !== undefined && result !== item ) {
                        _yuitest_coverline("build/arraylist/arraylist.js", 201);
ret[i] = result;
                    }
                }, this);

                _yuitest_coverline("build/arraylist/arraylist.js", 205);
return ret.length ? ret : this;
            };
        } );
    }
} );

_yuitest_coverline("build/arraylist/arraylist.js", 211);
Y.ArrayList = ArrayList;


}, '3.7.3', {"requires": ["yui-base"]});
