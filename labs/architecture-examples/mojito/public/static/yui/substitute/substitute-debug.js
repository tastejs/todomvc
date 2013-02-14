/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('substitute', function (Y, NAME) {

/**
 * String variable substitution and string formatting.
 * If included, the substitute method is added to the YUI instance.
 *
 * @module substitute
 */

    var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',
		savedRegExp =  /(~-(\d+)-~)/g, lBraceRegExp = /\{LBRACE\}/g, rBraceRegExp = /\{RBRACE\}/g,

    /**
     * The following methods are added to the YUI instance
     * @class YUI~substitute
     */

    /**
    Does {placeholder} substitution on a string.  The object passed as the
    second parameter provides values to replace the {placeholder}s.
    {placeholder} token names must match property names of the object.  For
    example

    `var greeting = Y.substitute("Hello, {who}!", { who: "World" });`

    {placeholder} tokens that are undefined on the object map will be left in
    tact (leaving unsightly "{placeholder}"s in the output string).  If your
    replacement strings *should* include curly braces, use `{LBRACE}` and
    `{RBRACE}` in your object map string value.

    If a function is passed as a third argument, it will be called for each
    {placeholder} found.  The {placeholder} name is passed as the first value
    and the value from the object map is passed as the second.  If the
    {placeholder} contains a space, the first token will be used to identify
    the object map property and the remainder will be passed as a third
    argument to the function.  See below for an example.
    
    If the value in the object map for a given {placeholder} is an object and
    the `dump` module is loaded, the replacement value will be the string
    result of calling `Y.dump(...)` with the object as input.  Include a
    numeric second token in the {placeholder} to configure the depth of the call
    to `Y.dump(...)`, e.g. "{someObject 2}".  See the
    <a href="../classes/YUI.html#method_dump">`dump`</a> method for details.

    @method substitute
    @param {string} s The string that will be modified.
    @param {object} o An object containing the replacement values.
    @param {function} f An optional function that can be used to
                        process each match.  It receives the key,
                        value, and any extra metadata included with
                        the key inside of the braces.
    @param {boolean} recurse if true, the replacement will be recursive,
                        letting you have replacement tokens in replacement text.
                        The default is false.
    @return {string} the substituted string.

    @example

        function getAttrVal(key, value, name) {
            // Return a string describing the named attribute and its value if
            // the first token is @. Otherwise, return the value from the
            // replacement object.
            if (key === "@") {
                value += name + " Value: " + myObject.get(name);
            }
            return value;
        }

        // Assuming myObject.set('foo', 'flowers'),
        // => "Attr: foo Value: flowers"
        var attrVal = Y.substitute("{@ foo}", { "@": "Attr: " }, getAttrVal);
    **/

    substitute = function(s, o, f, recurse) {
        var i, j, k, key, v, meta, saved = [], token, dump,
            lidx = s.length;

        for (;;) {
            i = s.lastIndexOf(LBRACE, lidx);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }

            //Extract key and meta info
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];

            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }

            if (L.isObject(v)) {
                if (!Y.dump) {
                    v = v.toString();
                } else {
                    if (L.isArray(v)) {
                        v = Y.dump(v, parseInt(meta, 10));
                    } else {
                        meta = meta || '';

                        // look for the keyword 'dump', if found force obj dump
                        dump = meta.indexOf(DUMP);
                        if (dump > -1) {
                            meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString
                        // and the 'dump' meta info was not found
                        if (v.toString === Object.prototype.toString ||
                            dump > -1) {
                            v = Y.dump(v, parseInt(meta, 10));
                        } else {
                            v = v.toString();
                        }
                    }
                }
			} else if (L.isUndefined(v)) {
                // This {block} has no replace string. Save it for later.
                v = '~-' + saved.length + '-~';
					saved.push(token);

                // break;
            }

            s = s.substring(0, i) + v + s.substring(j + 1);

			if (!recurse) {
				lidx = i - 1;
			} 
		}
		// restore saved {block}s and escaped braces

		return s
			.replace(savedRegExp, function (str, p1, p2) {
				return LBRACE + saved[parseInt(p2,10)] + RBRACE;
			})
			.replace(lBraceRegExp, LBRACE)
			.replace(rBraceRegExp, RBRACE)
		;
	};

    Y.substitute = substitute;
    L.substitute = substitute;



}, '3.7.3', {"requires": ["yui-base"], "optional": ["dump"]});
