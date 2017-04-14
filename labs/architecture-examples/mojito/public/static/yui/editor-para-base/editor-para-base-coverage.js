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
_yuitest_coverage["build/editor-para-base/editor-para-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-para-base/editor-para-base.js",
    code: []
};
_yuitest_coverage["build/editor-para-base/editor-para-base.js"].code=["YUI.add('editor-para-base', function (Y, NAME) {","","","    /**","     * Base Plugin for Editor to paragraph auto wrapping and correction.","     * @class Plugin.EditorParaBase","     * @extends Base","     * @constructor","     * @module editor","     * @submodule editor-para-base","     */","","","    var EditorParaBase = function() {","        EditorParaBase.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', BODY = 'body',","    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>';","","","    Y.extend(EditorParaBase, Y.Base, {","        /**","        * Utility method to create an empty paragraph when the document is empty.","        * @private","        * @method _fixFirstPara","        */","        _fixFirstPara: function() {","            var host = this.get(HOST), inst = host.getInstance(), sel, n,","                body = inst.config.doc.body,","                html = body.innerHTML,","                col = ((html.length) ? true : false);","","            if (html === BR) {","                html = '';","                col = false;","            }","","            body.innerHTML = '<' + P + '>' + html + inst.EditorSelection.CURSOR + '</' + P + '>';","","            n = inst.one(FIRST_P);","            sel = new inst.EditorSelection();","","            sel.selectNode(n, true, col);","        },","        /**","        * Performs a block element filter when the Editor is first ready","        * @private","        * @method _afterEditorReady","        */","        _afterEditorReady: function() {","            var host = this.get(HOST), inst = host.getInstance(), btag;","            if (inst) {","                inst.EditorSelection.filterBlocks();","                btag = inst.EditorSelection.DEFAULT_BLOCK_TAG;","                FIRST_P = BODY + ' > ' + btag;","                P = btag;","            }","        },","        /**","        * Performs a block element filter when the Editor after an content change","        * @private","        * @method _afterContentChange","        */","        _afterContentChange: function() {","            var host = this.get(HOST), inst = host.getInstance();","            if (inst && inst.EditorSelection) {","                inst.EditorSelection.filterBlocks();","            }","        },","        /**","        * Performs block/paste filtering after paste.","        * @private","        * @method _afterPaste","        */","        _afterPaste: function() {","            var host = this.get(HOST), inst = host.getInstance();","","            Y.later(50, host, function() {","                inst.EditorSelection.filterBlocks();","            });","","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorBR) {","                Y.error('Can not plug EditorPara and EditorBR at the same time.');","                return;","            }","","            host.after('ready', Y.bind(this._afterEditorReady, this));","            host.after('contentChange', Y.bind(this._afterContentChange, this));","            if (Y.Env.webkit) {","                host.after('dom:paste', Y.bind(this._afterPaste, this));","            }","        }","    }, {","        /**","        * editorPara","        * @static","        * @property NAME","        */","        NAME: 'editorParaBase',","        /**","        * editorPara","        * @static","        * @property NS","        */","        NS: 'editorParaBase',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","    Y.namespace('Plugin');","","    Y.Plugin.EditorParaBase = EditorParaBase;","","","","","}, '3.7.3', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["build/editor-para-base/editor-para-base.js"].lines = {"1":0,"14":0,"15":0,"20":0,"27":0,"32":0,"33":0,"34":0,"37":0,"39":0,"40":0,"42":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"64":0,"65":0,"66":0,"75":0,"77":0,"78":0,"83":0,"84":0,"85":0,"86":0,"89":0,"90":0,"91":0,"92":0,"115":0,"117":0};
_yuitest_coverage["build/editor-para-base/editor-para-base.js"].functions = {"EditorParaBase:14":0,"_fixFirstPara:26":0,"_afterEditorReady:49":0,"_afterContentChange:63":0,"(anonymous 2):77":0,"_afterPaste:74":0,"initializer:82":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-para-base/editor-para-base.js"].coveredLines = 34;
_yuitest_coverage["build/editor-para-base/editor-para-base.js"].coveredFunctions = 8;
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 1);
YUI.add('editor-para-base', function (Y, NAME) {


    /**
     * Base Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorParaBase
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-para-base
     */


    _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 14);
var EditorParaBase = function() {
        _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "EditorParaBase", 14);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 15);
EditorParaBase.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body',
    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>';


    _yuitest_coverline("build/editor-para-base/editor-para-base.js", 20);
Y.extend(EditorParaBase, Y.Base, {
        /**
        * Utility method to create an empty paragraph when the document is empty.
        * @private
        * @method _fixFirstPara
        */
        _fixFirstPara: function() {
            _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "_fixFirstPara", 26);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 27);
var host = this.get(HOST), inst = host.getInstance(), sel, n,
                body = inst.config.doc.body,
                html = body.innerHTML,
                col = ((html.length) ? true : false);

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 32);
if (html === BR) {
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 33);
html = '';
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 34);
col = false;
            }

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 37);
body.innerHTML = '<' + P + '>' + html + inst.EditorSelection.CURSOR + '</' + P + '>';

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 39);
n = inst.one(FIRST_P);
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 40);
sel = new inst.EditorSelection();

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 42);
sel.selectNode(n, true, col);
        },
        /**
        * Performs a block element filter when the Editor is first ready
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "_afterEditorReady", 49);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 50);
var host = this.get(HOST), inst = host.getInstance(), btag;
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 51);
if (inst) {
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 52);
inst.EditorSelection.filterBlocks();
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 53);
btag = inst.EditorSelection.DEFAULT_BLOCK_TAG;
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 54);
FIRST_P = BODY + ' > ' + btag;
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 55);
P = btag;
            }
        },
        /**
        * Performs a block element filter when the Editor after an content change
        * @private
        * @method _afterContentChange
        */
        _afterContentChange: function() {
            _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "_afterContentChange", 63);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 64);
var host = this.get(HOST), inst = host.getInstance();
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 65);
if (inst && inst.EditorSelection) {
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 66);
inst.EditorSelection.filterBlocks();
            }
        },
        /**
        * Performs block/paste filtering after paste.
        * @private
        * @method _afterPaste
        */
        _afterPaste: function() {
            _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "_afterPaste", 74);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 75);
var host = this.get(HOST), inst = host.getInstance();

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 77);
Y.later(50, host, function() {
                _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "(anonymous 2)", 77);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 78);
inst.EditorSelection.filterBlocks();
            });

        },
        initializer: function() {
            _yuitest_coverfunc("build/editor-para-base/editor-para-base.js", "initializer", 82);
_yuitest_coverline("build/editor-para-base/editor-para-base.js", 83);
var host = this.get(HOST);
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 84);
if (host.editorBR) {
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 85);
Y.error('Can not plug EditorPara and EditorBR at the same time.');
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 86);
return;
            }

            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 89);
host.after('ready', Y.bind(this._afterEditorReady, this));
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 90);
host.after('contentChange', Y.bind(this._afterContentChange, this));
            _yuitest_coverline("build/editor-para-base/editor-para-base.js", 91);
if (Y.Env.webkit) {
                _yuitest_coverline("build/editor-para-base/editor-para-base.js", 92);
host.after('dom:paste', Y.bind(this._afterPaste, this));
            }
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorParaBase',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorParaBase',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    _yuitest_coverline("build/editor-para-base/editor-para-base.js", 115);
Y.namespace('Plugin');

    _yuitest_coverline("build/editor-para-base/editor-para-base.js", 117);
Y.Plugin.EditorParaBase = EditorParaBase;




}, '3.7.3', {"requires": ["editor-base"]});
