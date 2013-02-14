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
_yuitest_coverage["build/selector-css3/selector-css3.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/selector-css3/selector-css3.js",
    code: []
};
_yuitest_coverage["build/selector-css3/selector-css3.js"].code=["YUI.add('selector-css3', function (Y, NAME) {","","/**"," * The selector css3 module provides support for css3 selectors."," * @module dom"," * @submodule selector-css3"," * @for Selector"," */","","/*","    an+b = get every _a_th node starting at the _b_th","    0n+b = no repeat (\"0\" and \"n\" may both be omitted (together) , e.g. \"0n+1\" or \"1\", not \"0+1\"), return only the _b_th element","    1n+b =  get every element starting from b (\"1\" may may be omitted, e.g. \"1n+0\" or \"n+0\" or \"n\")","    an+0 = get every _a_th element, \"0\" may be omitted ","*/","","Y.Selector._reNth = /^(?:([\\-]?\\d*)(n){1}|(odd|even)$)*([\\-+]?\\d*)$/;","","Y.Selector._getNth = function(node, expr, tag, reverse) {","    Y.Selector._reNth.test(expr);","    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)","        n = RegExp.$2, // \"n\"","        oddeven = RegExp.$3, // \"odd\" or \"even\"","        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_","        result = [],","        siblings = Y.DOM._children(node.parentNode, tag),","        op;","","    if (oddeven) {","        a = 2; // always every other","        op = '+';","        n = 'n';","        b = (oddeven === 'odd') ? 1 : 0;","    } else if ( isNaN(a) ) {","        a = (n) ? 1 : 0; // start from the first or no repeat","    }","","    if (a === 0) { // just the first","        if (reverse) {","            b = siblings.length - b + 1; ","        }","","        if (siblings[b - 1] === node) {","            return true;","        } else {","            return false;","        }","","    } else if (a < 0) {","        reverse = !!reverse;","        a = Math.abs(a);","    }","","    if (!reverse) {","        for (var i = b - 1, len = siblings.length; i < len; i += a) {","            if ( i >= 0 && siblings[i] === node ) {","                return true;","            }","        }","    } else {","        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {","            if ( i < len && siblings[i] === node ) {","                return true;","            }","        }","    }","    return false;","};","","Y.mix(Y.Selector.pseudos, {","    'root': function(node) {","        return node === node.ownerDocument.documentElement;","    },","","    'nth-child': function(node, expr) {","        return Y.Selector._getNth(node, expr);","    },","","    'nth-last-child': function(node, expr) {","        return Y.Selector._getNth(node, expr, null, true);","    },","","    'nth-of-type': function(node, expr) {","        return Y.Selector._getNth(node, expr, node.tagName);","    },","     ","    'nth-last-of-type': function(node, expr) {","        return Y.Selector._getNth(node, expr, node.tagName, true);","    },","     ","    'last-child': function(node) {","        var children = Y.DOM._children(node.parentNode);","        return children[children.length - 1] === node;","    },","","    'first-of-type': function(node) {","        return Y.DOM._children(node.parentNode, node.tagName)[0] === node;","    },","     ","    'last-of-type': function(node) {","        var children = Y.DOM._children(node.parentNode, node.tagName);","        return children[children.length - 1] === node;","    },","     ","    'only-child': function(node) {","        var children = Y.DOM._children(node.parentNode);","        return children.length === 1 && children[0] === node;","    },","","    'only-of-type': function(node) {","        var children = Y.DOM._children(node.parentNode, node.tagName);","        return children.length === 1 && children[0] === node;","    },","","    'empty': function(node) {","        return node.childNodes.length === 0;","    },","","    'not': function(node, expr) {","        return !Y.Selector.test(node, expr);","    },","","    'contains': function(node, expr) {","        var text = node.innerText || node.textContent || '';","        return text.indexOf(expr) > -1;","    },","","    'checked': function(node) {","        return (node.checked === true || node.selected === true);","    },","","    enabled: function(node) {","        return (node.disabled !== undefined && !node.disabled);","    },","","    disabled: function(node) {","        return (node.disabled);","    }","});","","Y.mix(Y.Selector.operators, {","    '^=': '^{val}', // Match starts with value","    '$=': '{val}$', // Match ends with value","    '*=': '{val}' // Match contains value as substring ","});","","Y.Selector.combinators['~'] = {","    axis: 'previousSibling'","};","","","}, '3.7.3', {\"requires\": [\"selector-native\", \"selector-css2\"]});"];
_yuitest_coverage["build/selector-css3/selector-css3.js"].lines = {"1":0,"17":0,"19":0,"20":0,"21":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"38":0,"39":0,"40":0,"43":0,"44":0,"46":0,"49":0,"50":0,"51":0,"54":0,"55":0,"56":0,"57":0,"61":0,"62":0,"63":0,"67":0,"70":0,"72":0,"76":0,"80":0,"84":0,"88":0,"92":0,"93":0,"97":0,"101":0,"102":0,"106":0,"107":0,"111":0,"112":0,"116":0,"120":0,"124":0,"125":0,"129":0,"133":0,"137":0,"141":0,"147":0};
_yuitest_coverage["build/selector-css3/selector-css3.js"].functions = {"_getNth:19":0,"\'root\':71":0,"\'nth-child\':75":0,"\'nth-last-child\':79":0,"\'nth-of-type\':83":0,"\'nth-last-of-type\':87":0,"\'last-child\':91":0,"\'first-of-type\':96":0,"\'last-of-type\':100":0,"\'only-child\':105":0,"\'only-of-type\':110":0,"\'empty\':115":0,"\'not\':119":0,"\'contains\':123":0,"\'checked\':128":0,"enabled:132":0,"disabled:136":0,"(anonymous 1):1":0};
_yuitest_coverage["build/selector-css3/selector-css3.js"].coveredLines = 53;
_yuitest_coverage["build/selector-css3/selector-css3.js"].coveredFunctions = 18;
_yuitest_coverline("build/selector-css3/selector-css3.js", 1);
YUI.add('selector-css3', function (Y, NAME) {

/**
 * The selector css3 module provides support for css3 selectors.
 * @module dom
 * @submodule selector-css3
 * @for Selector
 */

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/

_yuitest_coverfunc("build/selector-css3/selector-css3.js", "(anonymous 1)", 1);
_yuitest_coverline("build/selector-css3/selector-css3.js", 17);
Y.Selector._reNth = /^(?:([\-]?\d*)(n){1}|(odd|even)$)*([\-+]?\d*)$/;

_yuitest_coverline("build/selector-css3/selector-css3.js", 19);
Y.Selector._getNth = function(node, expr, tag, reverse) {
    _yuitest_coverfunc("build/selector-css3/selector-css3.js", "_getNth", 19);
_yuitest_coverline("build/selector-css3/selector-css3.js", 20);
Y.Selector._reNth.test(expr);
    _yuitest_coverline("build/selector-css3/selector-css3.js", 21);
var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        siblings = Y.DOM._children(node.parentNode, tag),
        op;

    _yuitest_coverline("build/selector-css3/selector-css3.js", 29);
if (oddeven) {
        _yuitest_coverline("build/selector-css3/selector-css3.js", 30);
a = 2; // always every other
        _yuitest_coverline("build/selector-css3/selector-css3.js", 31);
op = '+';
        _yuitest_coverline("build/selector-css3/selector-css3.js", 32);
n = 'n';
        _yuitest_coverline("build/selector-css3/selector-css3.js", 33);
b = (oddeven === 'odd') ? 1 : 0;
    } else {_yuitest_coverline("build/selector-css3/selector-css3.js", 34);
if ( isNaN(a) ) {
        _yuitest_coverline("build/selector-css3/selector-css3.js", 35);
a = (n) ? 1 : 0; // start from the first or no repeat
    }}

    _yuitest_coverline("build/selector-css3/selector-css3.js", 38);
if (a === 0) { // just the first
        _yuitest_coverline("build/selector-css3/selector-css3.js", 39);
if (reverse) {
            _yuitest_coverline("build/selector-css3/selector-css3.js", 40);
b = siblings.length - b + 1; 
        }

        _yuitest_coverline("build/selector-css3/selector-css3.js", 43);
if (siblings[b - 1] === node) {
            _yuitest_coverline("build/selector-css3/selector-css3.js", 44);
return true;
        } else {
            _yuitest_coverline("build/selector-css3/selector-css3.js", 46);
return false;
        }

    } else {_yuitest_coverline("build/selector-css3/selector-css3.js", 49);
if (a < 0) {
        _yuitest_coverline("build/selector-css3/selector-css3.js", 50);
reverse = !!reverse;
        _yuitest_coverline("build/selector-css3/selector-css3.js", 51);
a = Math.abs(a);
    }}

    _yuitest_coverline("build/selector-css3/selector-css3.js", 54);
if (!reverse) {
        _yuitest_coverline("build/selector-css3/selector-css3.js", 55);
for (var i = b - 1, len = siblings.length; i < len; i += a) {
            _yuitest_coverline("build/selector-css3/selector-css3.js", 56);
if ( i >= 0 && siblings[i] === node ) {
                _yuitest_coverline("build/selector-css3/selector-css3.js", 57);
return true;
            }
        }
    } else {
        _yuitest_coverline("build/selector-css3/selector-css3.js", 61);
for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            _yuitest_coverline("build/selector-css3/selector-css3.js", 62);
if ( i < len && siblings[i] === node ) {
                _yuitest_coverline("build/selector-css3/selector-css3.js", 63);
return true;
            }
        }
    }
    _yuitest_coverline("build/selector-css3/selector-css3.js", 67);
return false;
};

_yuitest_coverline("build/selector-css3/selector-css3.js", 70);
Y.mix(Y.Selector.pseudos, {
    'root': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'root\'", 71);
_yuitest_coverline("build/selector-css3/selector-css3.js", 72);
return node === node.ownerDocument.documentElement;
    },

    'nth-child': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'nth-child\'", 75);
_yuitest_coverline("build/selector-css3/selector-css3.js", 76);
return Y.Selector._getNth(node, expr);
    },

    'nth-last-child': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'nth-last-child\'", 79);
_yuitest_coverline("build/selector-css3/selector-css3.js", 80);
return Y.Selector._getNth(node, expr, null, true);
    },

    'nth-of-type': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'nth-of-type\'", 83);
_yuitest_coverline("build/selector-css3/selector-css3.js", 84);
return Y.Selector._getNth(node, expr, node.tagName);
    },
     
    'nth-last-of-type': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'nth-last-of-type\'", 87);
_yuitest_coverline("build/selector-css3/selector-css3.js", 88);
return Y.Selector._getNth(node, expr, node.tagName, true);
    },
     
    'last-child': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'last-child\'", 91);
_yuitest_coverline("build/selector-css3/selector-css3.js", 92);
var children = Y.DOM._children(node.parentNode);
        _yuitest_coverline("build/selector-css3/selector-css3.js", 93);
return children[children.length - 1] === node;
    },

    'first-of-type': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'first-of-type\'", 96);
_yuitest_coverline("build/selector-css3/selector-css3.js", 97);
return Y.DOM._children(node.parentNode, node.tagName)[0] === node;
    },
     
    'last-of-type': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'last-of-type\'", 100);
_yuitest_coverline("build/selector-css3/selector-css3.js", 101);
var children = Y.DOM._children(node.parentNode, node.tagName);
        _yuitest_coverline("build/selector-css3/selector-css3.js", 102);
return children[children.length - 1] === node;
    },
     
    'only-child': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'only-child\'", 105);
_yuitest_coverline("build/selector-css3/selector-css3.js", 106);
var children = Y.DOM._children(node.parentNode);
        _yuitest_coverline("build/selector-css3/selector-css3.js", 107);
return children.length === 1 && children[0] === node;
    },

    'only-of-type': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'only-of-type\'", 110);
_yuitest_coverline("build/selector-css3/selector-css3.js", 111);
var children = Y.DOM._children(node.parentNode, node.tagName);
        _yuitest_coverline("build/selector-css3/selector-css3.js", 112);
return children.length === 1 && children[0] === node;
    },

    'empty': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'empty\'", 115);
_yuitest_coverline("build/selector-css3/selector-css3.js", 116);
return node.childNodes.length === 0;
    },

    'not': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'not\'", 119);
_yuitest_coverline("build/selector-css3/selector-css3.js", 120);
return !Y.Selector.test(node, expr);
    },

    'contains': function(node, expr) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'contains\'", 123);
_yuitest_coverline("build/selector-css3/selector-css3.js", 124);
var text = node.innerText || node.textContent || '';
        _yuitest_coverline("build/selector-css3/selector-css3.js", 125);
return text.indexOf(expr) > -1;
    },

    'checked': function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "\'checked\'", 128);
_yuitest_coverline("build/selector-css3/selector-css3.js", 129);
return (node.checked === true || node.selected === true);
    },

    enabled: function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "enabled", 132);
_yuitest_coverline("build/selector-css3/selector-css3.js", 133);
return (node.disabled !== undefined && !node.disabled);
    },

    disabled: function(node) {
        _yuitest_coverfunc("build/selector-css3/selector-css3.js", "disabled", 136);
_yuitest_coverline("build/selector-css3/selector-css3.js", 137);
return (node.disabled);
    }
});

_yuitest_coverline("build/selector-css3/selector-css3.js", 141);
Y.mix(Y.Selector.operators, {
    '^=': '^{val}', // Match starts with value
    '$=': '{val}$', // Match ends with value
    '*=': '{val}' // Match contains value as substring 
});

_yuitest_coverline("build/selector-css3/selector-css3.js", 147);
Y.Selector.combinators['~'] = {
    axis: 'previousSibling'
};


}, '3.7.3', {"requires": ["selector-native", "selector-css2"]});
