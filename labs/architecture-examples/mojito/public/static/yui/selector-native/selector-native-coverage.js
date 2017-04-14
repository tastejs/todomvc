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
_yuitest_coverage["build/selector-native/selector-native.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/selector-native/selector-native.js",
    code: []
};
_yuitest_coverage["build/selector-native/selector-native.js"].code=["YUI.add('selector-native', function (Y, NAME) {","","(function(Y) {","/**"," * The selector-native module provides support for native querySelector"," * @module dom"," * @submodule selector-native"," * @for Selector"," */","","/**"," * Provides support for using CSS selectors to query the DOM "," * @class Selector "," * @static"," * @for Selector"," */","","Y.namespace('Selector'); // allow native module to standalone","","var COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',","    OWNER_DOCUMENT = 'ownerDocument';","","var Selector = {","    _types: {","        esc: {","            token: '\\uE000',","            re: /\\\\[:\\[\\]\\(\\)#\\.\\'\\>+~\"]/gi","        },","","        attr: {","            token: '\\uE001',","            re: /(\\[[^\\]]*\\])/g","        },","","        pseudo: {","            token: '\\uE002',","            re: /(\\([^\\)]*\\))/g","        }","    },","","    useNative: true,","","    _escapeId: function(id) {","        if (id) {","            id = id.replace(/([:\\[\\]\\(\\)#\\.'<>+~\"])/g,'\\\\$1');","        }","        return id;","    },","","    _compare: ('sourceIndex' in Y.config.doc.documentElement) ?","        function(nodeA, nodeB) {","            var a = nodeA.sourceIndex,","                b = nodeB.sourceIndex;","","            if (a === b) {","                return 0;","            } else if (a > b) {","                return 1;","            }","","            return -1;","","        } : (Y.config.doc.documentElement[COMPARE_DOCUMENT_POSITION] ?","        function(nodeA, nodeB) {","            if (nodeA[COMPARE_DOCUMENT_POSITION](nodeB) & 4) {","                return -1;","            } else {","                return 1;","            }","        } :","        function(nodeA, nodeB) {","            var rangeA, rangeB, compare;","            if (nodeA && nodeB) {","                rangeA = nodeA[OWNER_DOCUMENT].createRange();","                rangeA.setStart(nodeA, 0);","                rangeB = nodeB[OWNER_DOCUMENT].createRange();","                rangeB.setStart(nodeB, 0);","                compare = rangeA.compareBoundaryPoints(1, rangeB); // 1 === Range.START_TO_END","            }","","            return compare;","        ","    }),","","    _sort: function(nodes) {","        if (nodes) {","            nodes = Y.Array(nodes, 0, true);","            if (nodes.sort) {","                nodes.sort(Selector._compare);","            }","        }","","        return nodes;","    },","","    _deDupe: function(nodes) {","        var ret = [],","            i, node;","","        for (i = 0; (node = nodes[i++]);) {","            if (!node._found) {","                ret[ret.length] = node;","                node._found = true;","            }","        }","","        for (i = 0; (node = ret[i++]);) {","            node._found = null;","            node.removeAttribute('_found');","        }","","        return ret;","    },","","    /**","     * Retrieves a set of nodes based on a given CSS selector. ","     * @method query","     *","     * @param {string} selector The CSS Selector to test the node against.","     * @param {HTMLElement} root optional An HTMLElement to start the query from. Defaults to Y.config.doc","     * @param {Boolean} firstOnly optional Whether or not to return only the first match.","     * @return {Array} An array of nodes that match the given selector.","     * @static","     */","    query: function(selector, root, firstOnly, skipNative) {","        root = root || Y.config.doc;","        var ret = [],","            useNative = (Y.Selector.useNative && Y.config.doc.querySelector && !skipNative),","            queries = [[selector, root]],","            query,","            result,","            i,","            fn = (useNative) ? Y.Selector._nativeQuery : Y.Selector._bruteQuery;","","        if (selector && fn) {","            // split group into seperate queries","            if (!skipNative && // already done if skipping","                    (!useNative || root.tagName)) { // split native when element scoping is needed","                queries = Selector._splitQueries(selector, root);","            }","","            for (i = 0; (query = queries[i++]);) {","                result = fn(query[0], query[1], firstOnly);","                if (!firstOnly) { // coerce DOM Collection to Array","                    result = Y.Array(result, 0, true);","                }","                if (result) {","                    ret = ret.concat(result);","                }","            }","","            if (queries.length > 1) { // remove dupes and sort by doc order ","                ret = Selector._sort(Selector._deDupe(ret));","            }","        }","","        return (firstOnly) ? (ret[0] || null) : ret;","","    },","","    _replaceSelector: function(selector) {","        var esc = Y.Selector._parse('esc', selector), // pull escaped colon, brackets, etc. ","            attrs,","            pseudos;","","        // first replace escaped chars, which could be present in attrs or pseudos","        selector = Y.Selector._replace('esc', selector);","","        // then replace pseudos before attrs to avoid replacing :not([foo])","        pseudos = Y.Selector._parse('pseudo', selector);","        selector = Selector._replace('pseudo', selector);","","        attrs = Y.Selector._parse('attr', selector);","        selector = Y.Selector._replace('attr', selector);","","        return {","            esc: esc,","            attrs: attrs,","            pseudos: pseudos,","            selector: selector","        };","    },","","    _restoreSelector: function(replaced) {","        var selector = replaced.selector;","        selector = Y.Selector._restore('attr', selector, replaced.attrs);","        selector = Y.Selector._restore('pseudo', selector, replaced.pseudos);","        selector = Y.Selector._restore('esc', selector, replaced.esc);","        return selector;","    },","","    _replaceCommas: function(selector) {","        var replaced = Y.Selector._replaceSelector(selector),","            selector = replaced.selector;","","        if (selector) {","            selector = selector.replace(/,/g, '\\uE007');","            replaced.selector = selector;","            selector = Y.Selector._restoreSelector(replaced);","        }","        return selector;","    },","","    // allows element scoped queries to begin with combinator","    // e.g. query('> p', document.body) === query('body > p')","    _splitQueries: function(selector, node) {","        if (selector.indexOf(',') > -1) {","            selector = Y.Selector._replaceCommas(selector);","        }","","        var groups = selector.split('\\uE007'), // split on replaced comma token","            queries = [],","            prefix = '',","            id,","            i,","            len;","","        if (node) {","            // enforce for element scoping","            if (node.nodeType === 1) { // Elements only","                id = Y.Selector._escapeId(Y.DOM.getId(node));","","                if (!id) {","                    id = Y.guid();","                    Y.DOM.setId(node, id);","                }","            ","                prefix = '[id=\"' + id + '\"] ';","            }","","            for (i = 0, len = groups.length; i < len; ++i) {","                selector =  prefix + groups[i];","                queries.push([selector, node]);","            }","        }","","        return queries;","    },","","    _nativeQuery: function(selector, root, one) {","        if (Y.UA.webkit && selector.indexOf(':checked') > -1 &&","                (Y.Selector.pseudos && Y.Selector.pseudos.checked)) { // webkit (chrome, safari) fails to pick up \"selected\"  with \"checked\"","            return Y.Selector.query(selector, root, one, true); // redo with skipNative true to try brute query","        }","        try {","            return root['querySelector' + (one ? '' : 'All')](selector);","        } catch(e) { // fallback to brute if available","            return Y.Selector.query(selector, root, one, true); // redo with skipNative true","        }","    },","","    filter: function(nodes, selector) {","        var ret = [],","            i, node;","","        if (nodes && selector) {","            for (i = 0; (node = nodes[i++]);) {","                if (Y.Selector.test(node, selector)) {","                    ret[ret.length] = node;","                }","            }","        } else {","        }","","        return ret;","    },","","    test: function(node, selector, root) {","        var ret = false,","            useFrag = false,","            groups,","            parent,","            item,","            items,","            frag,","            id,","            i, j, group;","","        if (node && node.tagName) { // only test HTMLElements","","            if (typeof selector == 'function') { // test with function","                ret = selector.call(node, node);","            } else { // test with query","                // we need a root if off-doc","                groups = selector.split(',');","                if (!root && !Y.DOM.inDoc(node)) {","                    parent = node.parentNode;","                    if (parent) { ","                        root = parent;","                    } else { // only use frag when no parent to query","                        frag = node[OWNER_DOCUMENT].createDocumentFragment();","                        frag.appendChild(node);","                        root = frag;","                        useFrag = true;","                    }","                }","                root = root || node[OWNER_DOCUMENT];","","                id = Y.Selector._escapeId(Y.DOM.getId(node));","                if (!id) {","                    id = Y.guid();","                    Y.DOM.setId(node, id);","                }","","                for (i = 0; (group = groups[i++]);) { // TODO: off-dom test","                    group += '[id=\"' + id + '\"]';","                    items = Y.Selector.query(group, root);","","                    for (j = 0; item = items[j++];) {","                        if (item === node) {","                            ret = true;","                            break;","                        }","                    }","                    if (ret) {","                        break;","                    }","                }","","                if (useFrag) { // cleanup","                    frag.removeChild(node);","                }","            };","        }","","        return ret;","    },","","    /**","     * A convenience function to emulate Y.Node's aNode.ancestor(selector).","     * @param {HTMLElement} element An HTMLElement to start the query from.","     * @param {String} selector The CSS selector to test the node against.","     * @return {HTMLElement} The ancestor node matching the selector, or null.","     * @param {Boolean} testSelf optional Whether or not to include the element in the scan ","     * @static","     * @method ancestor","     */","    ancestor: function (element, selector, testSelf) {","        return Y.DOM.ancestor(element, function(n) {","            return Y.Selector.test(n, selector);","        }, testSelf);","    },","","    _parse: function(name, selector) {","        return selector.match(Y.Selector._types[name].re);","    },","","    _replace: function(name, selector) {","        var o = Y.Selector._types[name];","        return selector.replace(o.re, o.token);","    },","","    _restore: function(name, selector, items) {","        if (items) {","            var token = Y.Selector._types[name].token,","                i, len;","            for (i = 0, len = items.length; i < len; ++i) {","                selector = selector.replace(token, items[i]);","            }","        }","        return selector;","    }","};","","Y.mix(Y.Selector, Selector, true);","","})(Y);","","","}, '3.7.3', {\"requires\": [\"dom-base\"]});"];
_yuitest_coverage["build/selector-native/selector-native.js"].lines = {"1":0,"3":0,"18":0,"20":0,"23":0,"44":0,"45":0,"47":0,"52":0,"55":0,"56":0,"57":0,"58":0,"61":0,"65":0,"66":0,"68":0,"72":0,"73":0,"74":0,"75":0,"76":0,"77":0,"78":0,"81":0,"86":0,"87":0,"88":0,"89":0,"93":0,"97":0,"100":0,"101":0,"102":0,"103":0,"107":0,"108":0,"109":0,"112":0,"126":0,"127":0,"135":0,"137":0,"139":0,"142":0,"143":0,"144":0,"145":0,"147":0,"148":0,"152":0,"153":0,"157":0,"162":0,"167":0,"170":0,"171":0,"173":0,"174":0,"176":0,"185":0,"186":0,"187":0,"188":0,"189":0,"193":0,"196":0,"197":0,"198":0,"199":0,"201":0,"207":0,"208":0,"211":0,"218":0,"220":0,"221":0,"223":0,"224":0,"225":0,"228":0,"231":0,"232":0,"233":0,"237":0,"241":0,"243":0,"245":0,"246":0,"248":0,"253":0,"256":0,"257":0,"258":0,"259":0,"265":0,"269":0,"279":0,"281":0,"282":0,"285":0,"286":0,"287":0,"288":0,"289":0,"291":0,"292":0,"293":0,"294":0,"297":0,"299":0,"300":0,"301":0,"302":0,"305":0,"306":0,"307":0,"309":0,"310":0,"311":0,"312":0,"315":0,"316":0,"320":0,"321":0,"323":0,"326":0,"339":0,"340":0,"345":0,"349":0,"350":0,"354":0,"355":0,"357":0,"358":0,"361":0,"365":0};
_yuitest_coverage["build/selector-native/selector-native.js"].functions = {"_escapeId:43":0,"(anonymous 3):51":0,"(anonymous 4):64":0,"}:71":0,"_sort:85":0,"_deDupe:96":0,"query:125":0,"_replaceSelector:161":0,"_restoreSelector:184":0,"_replaceCommas:192":0,"_splitQueries:206":0,"_nativeQuery:240":0,"filter:252":0,"test:268":0,"(anonymous 5):339":0,"ancestor:338":0,"_parse:344":0,"_replace:348":0,"_restore:353":0,"(anonymous 2):3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/selector-native/selector-native.js"].coveredLines = 138;
_yuitest_coverage["build/selector-native/selector-native.js"].coveredFunctions = 21;
_yuitest_coverline("build/selector-native/selector-native.js", 1);
YUI.add('selector-native', function (Y, NAME) {

_yuitest_coverfunc("build/selector-native/selector-native.js", "(anonymous 1)", 1);
_yuitest_coverline("build/selector-native/selector-native.js", 3);
(function(Y) {
/**
 * The selector-native module provides support for native querySelector
 * @module dom
 * @submodule selector-native
 * @for Selector
 */

/**
 * Provides support for using CSS selectors to query the DOM 
 * @class Selector 
 * @static
 * @for Selector
 */

_yuitest_coverfunc("build/selector-native/selector-native.js", "(anonymous 2)", 3);
_yuitest_coverline("build/selector-native/selector-native.js", 18);
Y.namespace('Selector'); // allow native module to standalone

_yuitest_coverline("build/selector-native/selector-native.js", 20);
var COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    OWNER_DOCUMENT = 'ownerDocument';

_yuitest_coverline("build/selector-native/selector-native.js", 23);
var Selector = {
    _types: {
        esc: {
            token: '\uE000',
            re: /\\[:\[\]\(\)#\.\'\>+~"]/gi
        },

        attr: {
            token: '\uE001',
            re: /(\[[^\]]*\])/g
        },

        pseudo: {
            token: '\uE002',
            re: /(\([^\)]*\))/g
        }
    },

    useNative: true,

    _escapeId: function(id) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_escapeId", 43);
_yuitest_coverline("build/selector-native/selector-native.js", 44);
if (id) {
            _yuitest_coverline("build/selector-native/selector-native.js", 45);
id = id.replace(/([:\[\]\(\)#\.'<>+~"])/g,'\\$1');
        }
        _yuitest_coverline("build/selector-native/selector-native.js", 47);
return id;
    },

    _compare: ('sourceIndex' in Y.config.doc.documentElement) ?
        function(nodeA, nodeB) {
            _yuitest_coverfunc("build/selector-native/selector-native.js", "(anonymous 3)", 51);
_yuitest_coverline("build/selector-native/selector-native.js", 52);
var a = nodeA.sourceIndex,
                b = nodeB.sourceIndex;

            _yuitest_coverline("build/selector-native/selector-native.js", 55);
if (a === b) {
                _yuitest_coverline("build/selector-native/selector-native.js", 56);
return 0;
            } else {_yuitest_coverline("build/selector-native/selector-native.js", 57);
if (a > b) {
                _yuitest_coverline("build/selector-native/selector-native.js", 58);
return 1;
            }}

            _yuitest_coverline("build/selector-native/selector-native.js", 61);
return -1;

        } : (Y.config.doc.documentElement[COMPARE_DOCUMENT_POSITION] ?
        function(nodeA, nodeB) {
            _yuitest_coverfunc("build/selector-native/selector-native.js", "(anonymous 4)", 64);
_yuitest_coverline("build/selector-native/selector-native.js", 65);
if (nodeA[COMPARE_DOCUMENT_POSITION](nodeB) & 4) {
                _yuitest_coverline("build/selector-native/selector-native.js", 66);
return -1;
            } else {
                _yuitest_coverline("build/selector-native/selector-native.js", 68);
return 1;
            }
        } :
        function(nodeA, nodeB) {
            _yuitest_coverfunc("build/selector-native/selector-native.js", "}", 71);
_yuitest_coverline("build/selector-native/selector-native.js", 72);
var rangeA, rangeB, compare;
            _yuitest_coverline("build/selector-native/selector-native.js", 73);
if (nodeA && nodeB) {
                _yuitest_coverline("build/selector-native/selector-native.js", 74);
rangeA = nodeA[OWNER_DOCUMENT].createRange();
                _yuitest_coverline("build/selector-native/selector-native.js", 75);
rangeA.setStart(nodeA, 0);
                _yuitest_coverline("build/selector-native/selector-native.js", 76);
rangeB = nodeB[OWNER_DOCUMENT].createRange();
                _yuitest_coverline("build/selector-native/selector-native.js", 77);
rangeB.setStart(nodeB, 0);
                _yuitest_coverline("build/selector-native/selector-native.js", 78);
compare = rangeA.compareBoundaryPoints(1, rangeB); // 1 === Range.START_TO_END
            }

            _yuitest_coverline("build/selector-native/selector-native.js", 81);
return compare;
        
    }),

    _sort: function(nodes) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_sort", 85);
_yuitest_coverline("build/selector-native/selector-native.js", 86);
if (nodes) {
            _yuitest_coverline("build/selector-native/selector-native.js", 87);
nodes = Y.Array(nodes, 0, true);
            _yuitest_coverline("build/selector-native/selector-native.js", 88);
if (nodes.sort) {
                _yuitest_coverline("build/selector-native/selector-native.js", 89);
nodes.sort(Selector._compare);
            }
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 93);
return nodes;
    },

    _deDupe: function(nodes) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_deDupe", 96);
_yuitest_coverline("build/selector-native/selector-native.js", 97);
var ret = [],
            i, node;

        _yuitest_coverline("build/selector-native/selector-native.js", 100);
for (i = 0; (node = nodes[i++]);) {
            _yuitest_coverline("build/selector-native/selector-native.js", 101);
if (!node._found) {
                _yuitest_coverline("build/selector-native/selector-native.js", 102);
ret[ret.length] = node;
                _yuitest_coverline("build/selector-native/selector-native.js", 103);
node._found = true;
            }
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 107);
for (i = 0; (node = ret[i++]);) {
            _yuitest_coverline("build/selector-native/selector-native.js", 108);
node._found = null;
            _yuitest_coverline("build/selector-native/selector-native.js", 109);
node.removeAttribute('_found');
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 112);
return ret;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement} root optional An HTMLElement to start the query from. Defaults to Y.config.doc
     * @param {Boolean} firstOnly optional Whether or not to return only the first match.
     * @return {Array} An array of nodes that match the given selector.
     * @static
     */
    query: function(selector, root, firstOnly, skipNative) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "query", 125);
_yuitest_coverline("build/selector-native/selector-native.js", 126);
root = root || Y.config.doc;
        _yuitest_coverline("build/selector-native/selector-native.js", 127);
var ret = [],
            useNative = (Y.Selector.useNative && Y.config.doc.querySelector && !skipNative),
            queries = [[selector, root]],
            query,
            result,
            i,
            fn = (useNative) ? Y.Selector._nativeQuery : Y.Selector._bruteQuery;

        _yuitest_coverline("build/selector-native/selector-native.js", 135);
if (selector && fn) {
            // split group into seperate queries
            _yuitest_coverline("build/selector-native/selector-native.js", 137);
if (!skipNative && // already done if skipping
                    (!useNative || root.tagName)) { // split native when element scoping is needed
                _yuitest_coverline("build/selector-native/selector-native.js", 139);
queries = Selector._splitQueries(selector, root);
            }

            _yuitest_coverline("build/selector-native/selector-native.js", 142);
for (i = 0; (query = queries[i++]);) {
                _yuitest_coverline("build/selector-native/selector-native.js", 143);
result = fn(query[0], query[1], firstOnly);
                _yuitest_coverline("build/selector-native/selector-native.js", 144);
if (!firstOnly) { // coerce DOM Collection to Array
                    _yuitest_coverline("build/selector-native/selector-native.js", 145);
result = Y.Array(result, 0, true);
                }
                _yuitest_coverline("build/selector-native/selector-native.js", 147);
if (result) {
                    _yuitest_coverline("build/selector-native/selector-native.js", 148);
ret = ret.concat(result);
                }
            }

            _yuitest_coverline("build/selector-native/selector-native.js", 152);
if (queries.length > 1) { // remove dupes and sort by doc order 
                _yuitest_coverline("build/selector-native/selector-native.js", 153);
ret = Selector._sort(Selector._deDupe(ret));
            }
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 157);
return (firstOnly) ? (ret[0] || null) : ret;

    },

    _replaceSelector: function(selector) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_replaceSelector", 161);
_yuitest_coverline("build/selector-native/selector-native.js", 162);
var esc = Y.Selector._parse('esc', selector), // pull escaped colon, brackets, etc. 
            attrs,
            pseudos;

        // first replace escaped chars, which could be present in attrs or pseudos
        _yuitest_coverline("build/selector-native/selector-native.js", 167);
selector = Y.Selector._replace('esc', selector);

        // then replace pseudos before attrs to avoid replacing :not([foo])
        _yuitest_coverline("build/selector-native/selector-native.js", 170);
pseudos = Y.Selector._parse('pseudo', selector);
        _yuitest_coverline("build/selector-native/selector-native.js", 171);
selector = Selector._replace('pseudo', selector);

        _yuitest_coverline("build/selector-native/selector-native.js", 173);
attrs = Y.Selector._parse('attr', selector);
        _yuitest_coverline("build/selector-native/selector-native.js", 174);
selector = Y.Selector._replace('attr', selector);

        _yuitest_coverline("build/selector-native/selector-native.js", 176);
return {
            esc: esc,
            attrs: attrs,
            pseudos: pseudos,
            selector: selector
        };
    },

    _restoreSelector: function(replaced) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_restoreSelector", 184);
_yuitest_coverline("build/selector-native/selector-native.js", 185);
var selector = replaced.selector;
        _yuitest_coverline("build/selector-native/selector-native.js", 186);
selector = Y.Selector._restore('attr', selector, replaced.attrs);
        _yuitest_coverline("build/selector-native/selector-native.js", 187);
selector = Y.Selector._restore('pseudo', selector, replaced.pseudos);
        _yuitest_coverline("build/selector-native/selector-native.js", 188);
selector = Y.Selector._restore('esc', selector, replaced.esc);
        _yuitest_coverline("build/selector-native/selector-native.js", 189);
return selector;
    },

    _replaceCommas: function(selector) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_replaceCommas", 192);
_yuitest_coverline("build/selector-native/selector-native.js", 193);
var replaced = Y.Selector._replaceSelector(selector),
            selector = replaced.selector;

        _yuitest_coverline("build/selector-native/selector-native.js", 196);
if (selector) {
            _yuitest_coverline("build/selector-native/selector-native.js", 197);
selector = selector.replace(/,/g, '\uE007');
            _yuitest_coverline("build/selector-native/selector-native.js", 198);
replaced.selector = selector;
            _yuitest_coverline("build/selector-native/selector-native.js", 199);
selector = Y.Selector._restoreSelector(replaced);
        }
        _yuitest_coverline("build/selector-native/selector-native.js", 201);
return selector;
    },

    // allows element scoped queries to begin with combinator
    // e.g. query('> p', document.body) === query('body > p')
    _splitQueries: function(selector, node) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_splitQueries", 206);
_yuitest_coverline("build/selector-native/selector-native.js", 207);
if (selector.indexOf(',') > -1) {
            _yuitest_coverline("build/selector-native/selector-native.js", 208);
selector = Y.Selector._replaceCommas(selector);
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 211);
var groups = selector.split('\uE007'), // split on replaced comma token
            queries = [],
            prefix = '',
            id,
            i,
            len;

        _yuitest_coverline("build/selector-native/selector-native.js", 218);
if (node) {
            // enforce for element scoping
            _yuitest_coverline("build/selector-native/selector-native.js", 220);
if (node.nodeType === 1) { // Elements only
                _yuitest_coverline("build/selector-native/selector-native.js", 221);
id = Y.Selector._escapeId(Y.DOM.getId(node));

                _yuitest_coverline("build/selector-native/selector-native.js", 223);
if (!id) {
                    _yuitest_coverline("build/selector-native/selector-native.js", 224);
id = Y.guid();
                    _yuitest_coverline("build/selector-native/selector-native.js", 225);
Y.DOM.setId(node, id);
                }
            
                _yuitest_coverline("build/selector-native/selector-native.js", 228);
prefix = '[id="' + id + '"] ';
            }

            _yuitest_coverline("build/selector-native/selector-native.js", 231);
for (i = 0, len = groups.length; i < len; ++i) {
                _yuitest_coverline("build/selector-native/selector-native.js", 232);
selector =  prefix + groups[i];
                _yuitest_coverline("build/selector-native/selector-native.js", 233);
queries.push([selector, node]);
            }
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 237);
return queries;
    },

    _nativeQuery: function(selector, root, one) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_nativeQuery", 240);
_yuitest_coverline("build/selector-native/selector-native.js", 241);
if (Y.UA.webkit && selector.indexOf(':checked') > -1 &&
                (Y.Selector.pseudos && Y.Selector.pseudos.checked)) { // webkit (chrome, safari) fails to pick up "selected"  with "checked"
            _yuitest_coverline("build/selector-native/selector-native.js", 243);
return Y.Selector.query(selector, root, one, true); // redo with skipNative true to try brute query
        }
        _yuitest_coverline("build/selector-native/selector-native.js", 245);
try {
            _yuitest_coverline("build/selector-native/selector-native.js", 246);
return root['querySelector' + (one ? '' : 'All')](selector);
        } catch(e) { // fallback to brute if available
            _yuitest_coverline("build/selector-native/selector-native.js", 248);
return Y.Selector.query(selector, root, one, true); // redo with skipNative true
        }
    },

    filter: function(nodes, selector) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "filter", 252);
_yuitest_coverline("build/selector-native/selector-native.js", 253);
var ret = [],
            i, node;

        _yuitest_coverline("build/selector-native/selector-native.js", 256);
if (nodes && selector) {
            _yuitest_coverline("build/selector-native/selector-native.js", 257);
for (i = 0; (node = nodes[i++]);) {
                _yuitest_coverline("build/selector-native/selector-native.js", 258);
if (Y.Selector.test(node, selector)) {
                    _yuitest_coverline("build/selector-native/selector-native.js", 259);
ret[ret.length] = node;
                }
            }
        } else {
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 265);
return ret;
    },

    test: function(node, selector, root) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "test", 268);
_yuitest_coverline("build/selector-native/selector-native.js", 269);
var ret = false,
            useFrag = false,
            groups,
            parent,
            item,
            items,
            frag,
            id,
            i, j, group;

        _yuitest_coverline("build/selector-native/selector-native.js", 279);
if (node && node.tagName) { // only test HTMLElements

            _yuitest_coverline("build/selector-native/selector-native.js", 281);
if (typeof selector == 'function') { // test with function
                _yuitest_coverline("build/selector-native/selector-native.js", 282);
ret = selector.call(node, node);
            } else { // test with query
                // we need a root if off-doc
                _yuitest_coverline("build/selector-native/selector-native.js", 285);
groups = selector.split(',');
                _yuitest_coverline("build/selector-native/selector-native.js", 286);
if (!root && !Y.DOM.inDoc(node)) {
                    _yuitest_coverline("build/selector-native/selector-native.js", 287);
parent = node.parentNode;
                    _yuitest_coverline("build/selector-native/selector-native.js", 288);
if (parent) { 
                        _yuitest_coverline("build/selector-native/selector-native.js", 289);
root = parent;
                    } else { // only use frag when no parent to query
                        _yuitest_coverline("build/selector-native/selector-native.js", 291);
frag = node[OWNER_DOCUMENT].createDocumentFragment();
                        _yuitest_coverline("build/selector-native/selector-native.js", 292);
frag.appendChild(node);
                        _yuitest_coverline("build/selector-native/selector-native.js", 293);
root = frag;
                        _yuitest_coverline("build/selector-native/selector-native.js", 294);
useFrag = true;
                    }
                }
                _yuitest_coverline("build/selector-native/selector-native.js", 297);
root = root || node[OWNER_DOCUMENT];

                _yuitest_coverline("build/selector-native/selector-native.js", 299);
id = Y.Selector._escapeId(Y.DOM.getId(node));
                _yuitest_coverline("build/selector-native/selector-native.js", 300);
if (!id) {
                    _yuitest_coverline("build/selector-native/selector-native.js", 301);
id = Y.guid();
                    _yuitest_coverline("build/selector-native/selector-native.js", 302);
Y.DOM.setId(node, id);
                }

                _yuitest_coverline("build/selector-native/selector-native.js", 305);
for (i = 0; (group = groups[i++]);) { // TODO: off-dom test
                    _yuitest_coverline("build/selector-native/selector-native.js", 306);
group += '[id="' + id + '"]';
                    _yuitest_coverline("build/selector-native/selector-native.js", 307);
items = Y.Selector.query(group, root);

                    _yuitest_coverline("build/selector-native/selector-native.js", 309);
for (j = 0; item = items[j++];) {
                        _yuitest_coverline("build/selector-native/selector-native.js", 310);
if (item === node) {
                            _yuitest_coverline("build/selector-native/selector-native.js", 311);
ret = true;
                            _yuitest_coverline("build/selector-native/selector-native.js", 312);
break;
                        }
                    }
                    _yuitest_coverline("build/selector-native/selector-native.js", 315);
if (ret) {
                        _yuitest_coverline("build/selector-native/selector-native.js", 316);
break;
                    }
                }

                _yuitest_coverline("build/selector-native/selector-native.js", 320);
if (useFrag) { // cleanup
                    _yuitest_coverline("build/selector-native/selector-native.js", 321);
frag.removeChild(node);
                }
            }_yuitest_coverline("build/selector-native/selector-native.js", 323);
;
        }

        _yuitest_coverline("build/selector-native/selector-native.js", 326);
return ret;
    },

    /**
     * A convenience function to emulate Y.Node's aNode.ancestor(selector).
     * @param {HTMLElement} element An HTMLElement to start the query from.
     * @param {String} selector The CSS selector to test the node against.
     * @return {HTMLElement} The ancestor node matching the selector, or null.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @static
     * @method ancestor
     */
    ancestor: function (element, selector, testSelf) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "ancestor", 338);
_yuitest_coverline("build/selector-native/selector-native.js", 339);
return Y.DOM.ancestor(element, function(n) {
            _yuitest_coverfunc("build/selector-native/selector-native.js", "(anonymous 5)", 339);
_yuitest_coverline("build/selector-native/selector-native.js", 340);
return Y.Selector.test(n, selector);
        }, testSelf);
    },

    _parse: function(name, selector) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_parse", 344);
_yuitest_coverline("build/selector-native/selector-native.js", 345);
return selector.match(Y.Selector._types[name].re);
    },

    _replace: function(name, selector) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_replace", 348);
_yuitest_coverline("build/selector-native/selector-native.js", 349);
var o = Y.Selector._types[name];
        _yuitest_coverline("build/selector-native/selector-native.js", 350);
return selector.replace(o.re, o.token);
    },

    _restore: function(name, selector, items) {
        _yuitest_coverfunc("build/selector-native/selector-native.js", "_restore", 353);
_yuitest_coverline("build/selector-native/selector-native.js", 354);
if (items) {
            _yuitest_coverline("build/selector-native/selector-native.js", 355);
var token = Y.Selector._types[name].token,
                i, len;
            _yuitest_coverline("build/selector-native/selector-native.js", 357);
for (i = 0, len = items.length; i < len; ++i) {
                _yuitest_coverline("build/selector-native/selector-native.js", 358);
selector = selector.replace(token, items[i]);
            }
        }
        _yuitest_coverline("build/selector-native/selector-native.js", 361);
return selector;
    }
};

_yuitest_coverline("build/selector-native/selector-native.js", 365);
Y.mix(Y.Selector, Selector, true);

})(Y);


}, '3.7.3', {"requires": ["dom-base"]});
