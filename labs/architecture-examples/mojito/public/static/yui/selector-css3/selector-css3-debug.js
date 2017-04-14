/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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

Y.Selector._reNth = /^(?:([\-]?\d*)(n){1}|(odd|even)$)*([\-+]?\d*)$/;

Y.Selector._getNth = function(node, expr, tag, reverse) {
    Y.Selector._reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        siblings = Y.DOM._children(node.parentNode, tag),
        op;

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings.length - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings.length; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

Y.mix(Y.Selector.pseudos, {
    'root': function(node) {
        return node === node.ownerDocument.documentElement;
    },

    'nth-child': function(node, expr) {
        return Y.Selector._getNth(node, expr);
    },

    'nth-last-child': function(node, expr) {
        return Y.Selector._getNth(node, expr, null, true);
    },

    'nth-of-type': function(node, expr) {
        return Y.Selector._getNth(node, expr, node.tagName);
    },
     
    'nth-last-of-type': function(node, expr) {
        return Y.Selector._getNth(node, expr, node.tagName, true);
    },
     
    'last-child': function(node) {
        var children = Y.DOM._children(node.parentNode);
        return children[children.length - 1] === node;
    },

    'first-of-type': function(node) {
        return Y.DOM._children(node.parentNode, node.tagName)[0] === node;
    },
     
    'last-of-type': function(node) {
        var children = Y.DOM._children(node.parentNode, node.tagName);
        return children[children.length - 1] === node;
    },
     
    'only-child': function(node) {
        var children = Y.DOM._children(node.parentNode);
        return children.length === 1 && children[0] === node;
    },

    'only-of-type': function(node) {
        var children = Y.DOM._children(node.parentNode, node.tagName);
        return children.length === 1 && children[0] === node;
    },

    'empty': function(node) {
        return node.childNodes.length === 0;
    },

    'not': function(node, expr) {
        return !Y.Selector.test(node, expr);
    },

    'contains': function(node, expr) {
        var text = node.innerText || node.textContent || '';
        return text.indexOf(expr) > -1;
    },

    'checked': function(node) {
        return (node.checked === true || node.selected === true);
    },

    enabled: function(node) {
        return (node.disabled !== undefined && !node.disabled);
    },

    disabled: function(node) {
        return (node.disabled);
    }
});

Y.mix(Y.Selector.operators, {
    '^=': '^{val}', // Match starts with value
    '$=': '{val}$', // Match ends with value
    '*=': '{val}' // Match contains value as substring 
});

Y.Selector.combinators['~'] = {
    axis: 'previousSibling'
};


}, '3.7.3', {"requires": ["selector-native", "selector-css2"]});
