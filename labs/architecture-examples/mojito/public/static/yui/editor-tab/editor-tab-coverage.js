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
_yuitest_coverage["build/editor-tab/editor-tab.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-tab/editor-tab.js",
    code: []
};
_yuitest_coverage["build/editor-tab/editor-tab.js"].code=["YUI.add('editor-tab', function (Y, NAME) {","","","    /**","     * Handles tab and shift-tab indent/outdent support.","     * @class Plugin.EditorTab","     * @constructor","     * @extends Base","     * @module editor","     * @submodule editor-tab","     */","","    var EditorTab = function() {","        EditorTab.superclass.constructor.apply(this, arguments);","    }, HOST = 'host';","","    Y.extend(EditorTab, Y.Base, {","        /**","        * Listener for host's nodeChange event and captures the tabkey interaction.","        * @private","        * @method _onNodeChange","        * @param {Event} e The Event facade passed from the host.","        */","        _onNodeChange: function(e) {","            var action = 'indent';","","            if (e.changedType === 'tab') {","                if (!e.changedNode.test('li, li *')) {","                    e.changedEvent.halt();","                    e.preventDefault();","                    if (e.changedEvent.shiftKey) {","                        action = 'outdent';","                    }","","                    this.get(HOST).execCommand(action, '');","                }","            }","        },","        initializer: function() {","            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));","        }","    }, {","        /**","        * editorTab","        * @property NAME","        * @static","        */","        NAME: 'editorTab',","        /**","        * tab","        * @property NS","        * @static","        */","        NS: 'tab',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","","    Y.namespace('Plugin');","","    Y.Plugin.EditorTab = EditorTab;","","","}, '3.7.3', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["build/editor-tab/editor-tab.js"].lines = {"1":0,"13":0,"14":0,"17":0,"25":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"35":0,"40":0,"63":0,"65":0};
_yuitest_coverage["build/editor-tab/editor-tab.js"].functions = {"EditorTab:13":0,"_onNodeChange:24":0,"initializer:39":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-tab/editor-tab.js"].coveredLines = 15;
_yuitest_coverage["build/editor-tab/editor-tab.js"].coveredFunctions = 4;
_yuitest_coverline("build/editor-tab/editor-tab.js", 1);
YUI.add('editor-tab', function (Y, NAME) {


    /**
     * Handles tab and shift-tab indent/outdent support.
     * @class Plugin.EditorTab
     * @constructor
     * @extends Base
     * @module editor
     * @submodule editor-tab
     */

    _yuitest_coverfunc("build/editor-tab/editor-tab.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-tab/editor-tab.js", 13);
var EditorTab = function() {
        _yuitest_coverfunc("build/editor-tab/editor-tab.js", "EditorTab", 13);
_yuitest_coverline("build/editor-tab/editor-tab.js", 14);
EditorTab.superclass.constructor.apply(this, arguments);
    }, HOST = 'host';

    _yuitest_coverline("build/editor-tab/editor-tab.js", 17);
Y.extend(EditorTab, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("build/editor-tab/editor-tab.js", "_onNodeChange", 24);
_yuitest_coverline("build/editor-tab/editor-tab.js", 25);
var action = 'indent';

            _yuitest_coverline("build/editor-tab/editor-tab.js", 27);
if (e.changedType === 'tab') {
                _yuitest_coverline("build/editor-tab/editor-tab.js", 28);
if (!e.changedNode.test('li, li *')) {
                    _yuitest_coverline("build/editor-tab/editor-tab.js", 29);
e.changedEvent.halt();
                    _yuitest_coverline("build/editor-tab/editor-tab.js", 30);
e.preventDefault();
                    _yuitest_coverline("build/editor-tab/editor-tab.js", 31);
if (e.changedEvent.shiftKey) {
                        _yuitest_coverline("build/editor-tab/editor-tab.js", 32);
action = 'outdent';
                    }

                    _yuitest_coverline("build/editor-tab/editor-tab.js", 35);
this.get(HOST).execCommand(action, '');
                }
            }
        },
        initializer: function() {
            _yuitest_coverfunc("build/editor-tab/editor-tab.js", "initializer", 39);
_yuitest_coverline("build/editor-tab/editor-tab.js", 40);
this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * editorTab
        * @property NAME
        * @static
        */
        NAME: 'editorTab',
        /**
        * tab
        * @property NS
        * @static
        */
        NS: 'tab',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    _yuitest_coverline("build/editor-tab/editor-tab.js", 63);
Y.namespace('Plugin');

    _yuitest_coverline("build/editor-tab/editor-tab.js", 65);
Y.Plugin.EditorTab = EditorTab;


}, '3.7.3', {"requires": ["editor-base"]});
