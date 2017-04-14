/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('array-invoke', function (Y, NAME) {

/**
@module collection
@submodule array-invoke
*/

/**
Executes a named method on each item in an array of objects. Items in the array
that do not have a function by that name will be skipped.

@example

    Y.Array.invoke(arrayOfDrags, 'plug', Y.Plugin.DDProxy);

@method invoke
@param {Array} items Array of objects supporting the named method.
@param {String} name the name of the method to execute on each item.
@param {Any} [args*] Any number of additional args are passed as parameters to
  the execution of the named method.
@return {Array} All return values, indexed according to the item index.
@static
@for Array
**/
Y.Array.invoke = function(items, name) {
    var args = Y.Array(arguments, 2, true),
        isFunction = Y.Lang.isFunction,
        ret = [];

    Y.Array.each(Y.Array(items), function(item, i) {
        if (item && isFunction(item[name])) {
            ret[i] = item[name].apply(item, args);
        }
    });

    return ret;
};


}, '3.7.3', {"requires": ["yui-base"]});
