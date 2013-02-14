/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dump', function (Y, NAME) {

/**
 * Returns a simple string representation of the object or array.
 * Other types of objects will be returned unprocessed.  Arrays
 * are expected to be indexed.  Use object notation for
 * associative arrays.
 *
 * If included, the dump method is added to the YUI instance.
 *
 * @module dump
 */

    var L = Y.Lang,
        OBJ = '{...}',
        FUN = 'f(){...}',
        COMMA = ', ',
        ARROW = ' => ',

    /**
     * Returns a simple string representation of the object or array.
     * Other types of objects will be returned unprocessed.  Arrays
     * are expected to be indexed.
     *
     * @method dump
     * @param {Object} o The object to dump.
     * @param {Number} d How deep to recurse child objects, default 3.
     * @return {String} the dump result.
     * @for YUI
     */
    dump = function(o, d) {
        var i, len, s = [], type = L.type(o);

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump
        // an element will cause an unhandled exception in FF 2.x
        if (!L.isObject(o)) {
            return o + '';
        } else if (type == 'date') {
            return o;
        } else if (o.nodeType && o.tagName) {
            return o.tagName + '#' + o.id;
        } else if (o.document && o.navigator) {
            return 'window';
        } else if (o.location && o.body) {
            return 'document';
        } else if (type == 'function') {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (L.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (type == 'array') {
            s.push('[');
            for (i = 0, len = o.length; i < len; i = i + 1) {
                if (L.isObject(o[i])) {
                    s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push(']');
        // regexp /foo/
        } else if (type == 'regexp') {
            s.push(o.toString());
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push('{');
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    try {
                        s.push(i + ARROW);
                        if (L.isObject(o[i])) {
                            s.push((d > 0) ? L.dump(o[i], d - 1) : OBJ);
                        } else {
                            s.push(o[i]);
                        }
                        s.push(COMMA);
                    } catch (e) {
                        s.push('Error: ' + e.message);
                    }
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push('}');
        }

        return s.join('');
    };

    Y.dump = dump;
    L.dump = dump;



}, '3.7.3', {"requires": ["yui-base"]});
