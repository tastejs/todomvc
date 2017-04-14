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
_yuitest_coverage["build/editor-lists/editor-lists.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-lists/editor-lists.js",
    code: []
};
_yuitest_coverage["build/editor-lists/editor-lists.js"].code=["YUI.add('editor-lists', function (Y, NAME) {","","","    /**","     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support.","     * Adds overrides for the <a href=\"Plugin.ExecCommand.html#method_COMMANDS.insertorderedlist\">insertorderedlist</a>","     * and <a href=\"Plugin.ExecCommand.html#method_COMMANDS.insertunorderedlist\">insertunorderedlist</a> execCommands.","     * @class Plugin.EditorLists","     * @constructor","     * @extends Base","     * @module editor","     * @submodule editor-lists","     */","","    var EditorLists = function() {","        EditorLists.superclass.constructor.apply(this, arguments);","    }, LI = 'li', OL = 'ol', UL = 'ul', HOST = 'host';","","    Y.extend(EditorLists, Y.Base, {","        /**","        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.","        * @private","        * @method _onNodeChange","        * @param {Event} e The Event facade passed from the host.","        */","        _onNodeChange: function(e) {","            var inst = this.get(HOST).getInstance(), li,","                newList, sTab, par, moved = false, tag, focusEnd = false;","","            if (e.changedType === 'tab') {","                if (e.changedNode.test(LI + ', ' + LI + ' *')) {","                    e.changedEvent.halt();","                    e.preventDefault();","                    li = e.changedNode;","                    sTab = e.changedEvent.shiftKey;","                    par = li.ancestor(OL + ',' + UL);","                    tag = UL;","","                    if (par.get('tagName').toLowerCase() === OL) {","                        tag = OL;","                    }","","                    if (!li.test(LI)) {","                        li = li.ancestor(LI);","                    }","                    if (sTab) {","                        if (li.ancestor(LI)) {","                            li.ancestor(LI).insert(li, 'after');","                            moved = true;","                            focusEnd = true;","                        }","                    } else {","                        //li.setStyle('border', '1px solid red');","                        if (li.previous(LI)) {","                            newList = inst.Node.create('<' + tag + '></' + tag + '>');","                            li.previous(LI).append(newList);","                            newList.append(li);","                            moved = true;","                        }","                    }","                }","                if (moved) {","                    if (!li.test(LI)) {","                        li = li.ancestor(LI);","                    }","                    li.all(EditorLists.REMOVE).remove();","                    if (Y.UA.ie) {","                        li = li.append(EditorLists.NON).one(EditorLists.NON_SEL);","                    }","                    //Selection here..","                    (new inst.EditorSelection()).selectNode(li, true, focusEnd);","                }","            }","        },","        initializer: function() {","            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));","        }","    }, {","        /**","        * The non element placeholder, used for positioning the cursor and filling empty items","        * @property REMOVE","        * @static","        */","        NON: '<span class=\"yui-non\">&nbsp;</span>',","        /**","        * The selector query to get all non elements","        * @property NONSEL","        * @static","        */","        NON_SEL: 'span.yui-non',","        /**","        * The items to removed from a list when a list item is moved, currently removes BR nodes","        * @property REMOVE","        * @static","        */","        REMOVE: 'br',","        /**","        * editorLists","        * @property NAME","        * @static","        */","        NAME: 'editorLists',","        /**","        * lists","        * @property NS","        * @static","        */","        NS: 'lists',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","    Y.namespace('Plugin');","","    Y.Plugin.EditorLists = EditorLists;","","","","}, '3.7.3', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["build/editor-lists/editor-lists.js"].lines = {"1":0,"15":0,"16":0,"19":0,"27":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":0,"37":0,"39":0,"40":0,"43":0,"44":0,"46":0,"47":0,"48":0,"49":0,"50":0,"54":0,"55":0,"56":0,"57":0,"58":0,"62":0,"63":0,"64":0,"66":0,"67":0,"68":0,"71":0,"76":0,"116":0,"118":0};
_yuitest_coverage["build/editor-lists/editor-lists.js"].functions = {"EditorLists:15":0,"_onNodeChange:26":0,"initializer:75":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-lists/editor-lists.js"].coveredLines = 37;
_yuitest_coverage["build/editor-lists/editor-lists.js"].coveredFunctions = 4;
_yuitest_coverline("build/editor-lists/editor-lists.js", 1);
YUI.add('editor-lists', function (Y, NAME) {


    /**
     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support.
     * Adds overrides for the <a href="Plugin.ExecCommand.html#method_COMMANDS.insertorderedlist">insertorderedlist</a>
     * and <a href="Plugin.ExecCommand.html#method_COMMANDS.insertunorderedlist">insertunorderedlist</a> execCommands.
     * @class Plugin.EditorLists
     * @constructor
     * @extends Base
     * @module editor
     * @submodule editor-lists
     */

    _yuitest_coverfunc("build/editor-lists/editor-lists.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-lists/editor-lists.js", 15);
var EditorLists = function() {
        _yuitest_coverfunc("build/editor-lists/editor-lists.js", "EditorLists", 15);
_yuitest_coverline("build/editor-lists/editor-lists.js", 16);
EditorLists.superclass.constructor.apply(this, arguments);
    }, LI = 'li', OL = 'ol', UL = 'ul', HOST = 'host';

    _yuitest_coverline("build/editor-lists/editor-lists.js", 19);
Y.extend(EditorLists, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("build/editor-lists/editor-lists.js", "_onNodeChange", 26);
_yuitest_coverline("build/editor-lists/editor-lists.js", 27);
var inst = this.get(HOST).getInstance(), li,
                newList, sTab, par, moved = false, tag, focusEnd = false;

            _yuitest_coverline("build/editor-lists/editor-lists.js", 30);
if (e.changedType === 'tab') {
                _yuitest_coverline("build/editor-lists/editor-lists.js", 31);
if (e.changedNode.test(LI + ', ' + LI + ' *')) {
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 32);
e.changedEvent.halt();
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 33);
e.preventDefault();
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 34);
li = e.changedNode;
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 35);
sTab = e.changedEvent.shiftKey;
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 36);
par = li.ancestor(OL + ',' + UL);
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 37);
tag = UL;

                    _yuitest_coverline("build/editor-lists/editor-lists.js", 39);
if (par.get('tagName').toLowerCase() === OL) {
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 40);
tag = OL;
                    }

                    _yuitest_coverline("build/editor-lists/editor-lists.js", 43);
if (!li.test(LI)) {
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 44);
li = li.ancestor(LI);
                    }
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 46);
if (sTab) {
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 47);
if (li.ancestor(LI)) {
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 48);
li.ancestor(LI).insert(li, 'after');
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 49);
moved = true;
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 50);
focusEnd = true;
                        }
                    } else {
                        //li.setStyle('border', '1px solid red');
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 54);
if (li.previous(LI)) {
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 55);
newList = inst.Node.create('<' + tag + '></' + tag + '>');
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 56);
li.previous(LI).append(newList);
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 57);
newList.append(li);
                            _yuitest_coverline("build/editor-lists/editor-lists.js", 58);
moved = true;
                        }
                    }
                }
                _yuitest_coverline("build/editor-lists/editor-lists.js", 62);
if (moved) {
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 63);
if (!li.test(LI)) {
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 64);
li = li.ancestor(LI);
                    }
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 66);
li.all(EditorLists.REMOVE).remove();
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 67);
if (Y.UA.ie) {
                        _yuitest_coverline("build/editor-lists/editor-lists.js", 68);
li = li.append(EditorLists.NON).one(EditorLists.NON_SEL);
                    }
                    //Selection here..
                    _yuitest_coverline("build/editor-lists/editor-lists.js", 71);
(new inst.EditorSelection()).selectNode(li, true, focusEnd);
                }
            }
        },
        initializer: function() {
            _yuitest_coverfunc("build/editor-lists/editor-lists.js", "initializer", 75);
_yuitest_coverline("build/editor-lists/editor-lists.js", 76);
this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * The non element placeholder, used for positioning the cursor and filling empty items
        * @property REMOVE
        * @static
        */
        NON: '<span class="yui-non">&nbsp;</span>',
        /**
        * The selector query to get all non elements
        * @property NONSEL
        * @static
        */
        NON_SEL: 'span.yui-non',
        /**
        * The items to removed from a list when a list item is moved, currently removes BR nodes
        * @property REMOVE
        * @static
        */
        REMOVE: 'br',
        /**
        * editorLists
        * @property NAME
        * @static
        */
        NAME: 'editorLists',
        /**
        * lists
        * @property NS
        * @static
        */
        NS: 'lists',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    _yuitest_coverline("build/editor-lists/editor-lists.js", 116);
Y.namespace('Plugin');

    _yuitest_coverline("build/editor-lists/editor-lists.js", 118);
Y.Plugin.EditorLists = EditorLists;



}, '3.7.3', {"requires": ["editor-base"]});
