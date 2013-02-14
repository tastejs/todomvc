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
_yuitest_coverage["build/substitute/substitute.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/substitute/substitute.js",
    code: []
};
_yuitest_coverage["build/substitute/substitute.js"].code=["YUI.add('substitute', function (Y, NAME) {","","/**"," * String variable substitution and string formatting."," * If included, the substitute method is added to the YUI instance."," *"," * @module substitute"," */","","    var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',","		savedRegExp =  /(~-(\\d+)-~)/g, lBraceRegExp = /\\{LBRACE\\}/g, rBraceRegExp = /\\{RBRACE\\}/g,","","    /**","     * The following methods are added to the YUI instance","     * @class YUI~substitute","     */","","    /**","    Does {placeholder} substitution on a string.  The object passed as the","    second parameter provides values to replace the {placeholder}s.","    {placeholder} token names must match property names of the object.  For","    example","","    `var greeting = Y.substitute(\"Hello, {who}!\", { who: \"World\" });`","","    {placeholder} tokens that are undefined on the object map will be left in","    tact (leaving unsightly \"{placeholder}\"s in the output string).  If your","    replacement strings *should* include curly braces, use `{LBRACE}` and","    `{RBRACE}` in your object map string value.","","    If a function is passed as a third argument, it will be called for each","    {placeholder} found.  The {placeholder} name is passed as the first value","    and the value from the object map is passed as the second.  If the","    {placeholder} contains a space, the first token will be used to identify","    the object map property and the remainder will be passed as a third","    argument to the function.  See below for an example.","    ","    If the value in the object map for a given {placeholder} is an object and","    the `dump` module is loaded, the replacement value will be the string","    result of calling `Y.dump(...)` with the object as input.  Include a","    numeric second token in the {placeholder} to configure the depth of the call","    to `Y.dump(...)`, e.g. \"{someObject 2}\".  See the","    <a href=\"../classes/YUI.html#method_dump\">`dump`</a> method for details.","","    @method substitute","    @param {string} s The string that will be modified.","    @param {object} o An object containing the replacement values.","    @param {function} f An optional function that can be used to","                        process each match.  It receives the key,","                        value, and any extra metadata included with","                        the key inside of the braces.","    @param {boolean} recurse if true, the replacement will be recursive,","                        letting you have replacement tokens in replacement text.","                        The default is false.","    @return {string} the substituted string.","","    @example","","        function getAttrVal(key, value, name) {","            // Return a string describing the named attribute and its value if","            // the first token is @. Otherwise, return the value from the","            // replacement object.","            if (key === \"@\") {","                value += name + \" Value: \" + myObject.get(name);","            }","            return value;","        }","","        // Assuming myObject.set('foo', 'flowers'),","        // => \"Attr: foo Value: flowers\"","        var attrVal = Y.substitute(\"{@ foo}\", { \"@\": \"Attr: \" }, getAttrVal);","    **/","","    substitute = function(s, o, f, recurse) {","        var i, j, k, key, v, meta, saved = [], token, dump,","            lidx = s.length;","","        for (;;) {","            i = s.lastIndexOf(LBRACE, lidx);","            if (i < 0) {","                break;","            }","            j = s.indexOf(RBRACE, i);","            if (i + 1 >= j) {","                break;","            }","","            //Extract key and meta info","            token = s.substring(i + 1, j);","            key = token;","            meta = null;","            k = key.indexOf(SPACE);","            if (k > -1) {","                meta = key.substring(k + 1);","                key = key.substring(0, k);","            }","","            // lookup the value","            v = o[key];","","            // if a substitution function was provided, execute it","            if (f) {","                v = f(key, v, meta);","            }","","            if (L.isObject(v)) {","                if (!Y.dump) {","                    v = v.toString();","                } else {","                    if (L.isArray(v)) {","                        v = Y.dump(v, parseInt(meta, 10));","                    } else {","                        meta = meta || '';","","                        // look for the keyword 'dump', if found force obj dump","                        dump = meta.indexOf(DUMP);","                        if (dump > -1) {","                            meta = meta.substring(4);","                        }","","                        // use the toString if it is not the Object toString","                        // and the 'dump' meta info was not found","                        if (v.toString === Object.prototype.toString ||","                            dump > -1) {","                            v = Y.dump(v, parseInt(meta, 10));","                        } else {","                            v = v.toString();","                        }","                    }","                }","			} else if (L.isUndefined(v)) {","                // This {block} has no replace string. Save it for later.","                v = '~-' + saved.length + '-~';","					saved.push(token);","","                // break;","            }","","            s = s.substring(0, i) + v + s.substring(j + 1);","","			if (!recurse) {","				lidx = i - 1;","			} ","		}","		// restore saved {block}s and escaped braces","","		return s","			.replace(savedRegExp, function (str, p1, p2) {","				return LBRACE + saved[parseInt(p2,10)] + RBRACE;","			})","			.replace(lBraceRegExp, LBRACE)","			.replace(rBraceRegExp, RBRACE)","		;","	};","","    Y.substitute = substitute;","    L.substitute = substitute;","","","","}, '3.7.3', {\"requires\": [\"yui-base\"], \"optional\": [\"dump\"]});"];
_yuitest_coverage["build/substitute/substitute.js"].lines = {"1":0,"10":0,"75":0,"78":0,"79":0,"80":0,"81":0,"83":0,"84":0,"85":0,"89":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"99":0,"102":0,"103":0,"106":0,"107":0,"108":0,"110":0,"111":0,"113":0,"116":0,"117":0,"118":0,"123":0,"125":0,"127":0,"131":0,"133":0,"134":0,"139":0,"141":0,"142":0,"147":0,"149":0,"156":0,"157":0};
_yuitest_coverage["build/substitute/substitute.js"].functions = {"(anonymous 2):148":0,"substitute:74":0,"(anonymous 1):1":0};
_yuitest_coverage["build/substitute/substitute.js"].coveredLines = 42;
_yuitest_coverage["build/substitute/substitute.js"].coveredFunctions = 3;
_yuitest_coverline("build/substitute/substitute.js", 1);
YUI.add('substitute', function (Y, NAME) {

/**
 * String variable substitution and string formatting.
 * If included, the substitute method is added to the YUI instance.
 *
 * @module substitute
 */

    _yuitest_coverfunc("build/substitute/substitute.js", "(anonymous 1)", 1);
_yuitest_coverline("build/substitute/substitute.js", 10);
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
        _yuitest_coverfunc("build/substitute/substitute.js", "substitute", 74);
_yuitest_coverline("build/substitute/substitute.js", 75);
var i, j, k, key, v, meta, saved = [], token, dump,
            lidx = s.length;

        _yuitest_coverline("build/substitute/substitute.js", 78);
for (;;) {
            _yuitest_coverline("build/substitute/substitute.js", 79);
i = s.lastIndexOf(LBRACE, lidx);
            _yuitest_coverline("build/substitute/substitute.js", 80);
if (i < 0) {
                _yuitest_coverline("build/substitute/substitute.js", 81);
break;
            }
            _yuitest_coverline("build/substitute/substitute.js", 83);
j = s.indexOf(RBRACE, i);
            _yuitest_coverline("build/substitute/substitute.js", 84);
if (i + 1 >= j) {
                _yuitest_coverline("build/substitute/substitute.js", 85);
break;
            }

            //Extract key and meta info
            _yuitest_coverline("build/substitute/substitute.js", 89);
token = s.substring(i + 1, j);
            _yuitest_coverline("build/substitute/substitute.js", 90);
key = token;
            _yuitest_coverline("build/substitute/substitute.js", 91);
meta = null;
            _yuitest_coverline("build/substitute/substitute.js", 92);
k = key.indexOf(SPACE);
            _yuitest_coverline("build/substitute/substitute.js", 93);
if (k > -1) {
                _yuitest_coverline("build/substitute/substitute.js", 94);
meta = key.substring(k + 1);
                _yuitest_coverline("build/substitute/substitute.js", 95);
key = key.substring(0, k);
            }

            // lookup the value
            _yuitest_coverline("build/substitute/substitute.js", 99);
v = o[key];

            // if a substitution function was provided, execute it
            _yuitest_coverline("build/substitute/substitute.js", 102);
if (f) {
                _yuitest_coverline("build/substitute/substitute.js", 103);
v = f(key, v, meta);
            }

            _yuitest_coverline("build/substitute/substitute.js", 106);
if (L.isObject(v)) {
                _yuitest_coverline("build/substitute/substitute.js", 107);
if (!Y.dump) {
                    _yuitest_coverline("build/substitute/substitute.js", 108);
v = v.toString();
                } else {
                    _yuitest_coverline("build/substitute/substitute.js", 110);
if (L.isArray(v)) {
                        _yuitest_coverline("build/substitute/substitute.js", 111);
v = Y.dump(v, parseInt(meta, 10));
                    } else {
                        _yuitest_coverline("build/substitute/substitute.js", 113);
meta = meta || '';

                        // look for the keyword 'dump', if found force obj dump
                        _yuitest_coverline("build/substitute/substitute.js", 116);
dump = meta.indexOf(DUMP);
                        _yuitest_coverline("build/substitute/substitute.js", 117);
if (dump > -1) {
                            _yuitest_coverline("build/substitute/substitute.js", 118);
meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString
                        // and the 'dump' meta info was not found
                        _yuitest_coverline("build/substitute/substitute.js", 123);
if (v.toString === Object.prototype.toString ||
                            dump > -1) {
                            _yuitest_coverline("build/substitute/substitute.js", 125);
v = Y.dump(v, parseInt(meta, 10));
                        } else {
                            _yuitest_coverline("build/substitute/substitute.js", 127);
v = v.toString();
                        }
                    }
                }
			} else {_yuitest_coverline("build/substitute/substitute.js", 131);
if (L.isUndefined(v)) {
                // This {block} has no replace string. Save it for later.
                _yuitest_coverline("build/substitute/substitute.js", 133);
v = '~-' + saved.length + '-~';
					_yuitest_coverline("build/substitute/substitute.js", 134);
saved.push(token);

                // break;
            }}

            _yuitest_coverline("build/substitute/substitute.js", 139);
s = s.substring(0, i) + v + s.substring(j + 1);

			_yuitest_coverline("build/substitute/substitute.js", 141);
if (!recurse) {
				_yuitest_coverline("build/substitute/substitute.js", 142);
lidx = i - 1;
			} 
		}
		// restore saved {block}s and escaped braces

		_yuitest_coverline("build/substitute/substitute.js", 147);
return s
			.replace(savedRegExp, function (str, p1, p2) {
				_yuitest_coverfunc("build/substitute/substitute.js", "(anonymous 2)", 148);
_yuitest_coverline("build/substitute/substitute.js", 149);
return LBRACE + saved[parseInt(p2,10)] + RBRACE;
			})
			.replace(lBraceRegExp, LBRACE)
			.replace(rBraceRegExp, RBRACE)
		;
	};

    _yuitest_coverline("build/substitute/substitute.js", 156);
Y.substitute = substitute;
    _yuitest_coverline("build/substitute/substitute.js", 157);
L.substitute = substitute;



}, '3.7.3', {"requires": ["yui-base"], "optional": ["dump"]});
