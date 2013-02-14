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
_yuitest_coverage["build/editor-br/editor-br.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-br/editor-br.js",
    code: []
};
_yuitest_coverage["build/editor-br/editor-br.js"].code=["YUI.add('editor-br', function (Y, NAME) {","","","","    /**","     * Plugin for Editor to normalize BR's.","     * @class Plugin.EditorBR","     * @extends Base","     * @constructor","     * @module editor","     * @submodule editor-br","     */","","","    var EditorBR = function() {","        EditorBR.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', LI = 'li';","","","    Y.extend(EditorBR, Y.Base, {","        /**","        * Frame keyDown handler that normalizes BR's when pressing ENTER.","        * @private","        * @method _onKeyDown","        */","        _onKeyDown: function(e) {","            if (e.stopped) {","                e.halt();","                return;","            }","            if (e.keyCode === 13) {","                var host = this.get(HOST), inst = host.getInstance(),","                    sel = new inst.EditorSelection();","","                if (sel) {","                    if (Y.UA.ie) {","                        if (!sel.anchorNode || (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI))) {","                            host.execCommand('inserthtml', inst.EditorSelection.CURSOR);","                            e.halt();","                        }","                    }","                    if (Y.UA.webkit) {","                        if (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI)) {","                            host.frame._execCommand('insertlinebreak', null);","                            e.halt();","                        }","                    }","                }","            }","        },","        /**","        * Adds listeners for keydown in IE and Webkit. Also fires insertbeonreturn for supporting browsers.","        * @private","        * @method _afterEditorReady","        */","        _afterEditorReady: function() {","            var inst = this.get(HOST).getInstance();","            try {","                inst.config.doc.execCommand('insertbronreturn', null, true);","            } catch (bre) {}","","            if (Y.UA.ie || Y.UA.webkit) {","                inst.on('keydown', Y.bind(this._onKeyDown, this), inst.config.doc);","            }","        },","        /**","        * Adds a nodeChange listener only for FF, in the event of a backspace or delete, it creates an empy textNode","        * inserts it into the DOM after the e.changedNode, then removes it. Causing FF to redraw the content.","        * @private","        * @method _onNodeChange","        * @param {Event} e The nodeChange event.","        */","        _onNodeChange: function(e) {","            switch (e.changedType) {","                case 'backspace-up':","                case 'backspace-down':","                case 'delete-up':","                    /*","                    * This forced FF to redraw the content on backspace.","                    * On some occasions FF will leave a cursor residue after content has been deleted.","                    * Dropping in the empty textnode and then removing it causes FF to redraw and","                    * remove the \"ghost cursors\"","                    */","                    var inst = this.get(HOST).getInstance(),","                        d = e.changedNode,","                        t = inst.config.doc.createTextNode(' ');","                    d.appendChild(t);","                    d.removeChild(t);","                    break;","            }","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorPara) {","                Y.error('Can not plug EditorBR and EditorPara at the same time.');","                return;","            }","            host.after('ready', Y.bind(this._afterEditorReady, this));","            if (Y.UA.gecko) {","                host.on('nodeChange', Y.bind(this._onNodeChange, this));","            }","        }","    }, {","        /**","        * editorBR","        * @static","        * @property NAME","        */","        NAME: 'editorBR',","        /**","        * editorBR","        * @static","        * @property NS","        */","        NS: 'editorBR',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","    Y.namespace('Plugin');","","    Y.Plugin.EditorBR = EditorBR;","","","","}, '3.7.3', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["build/editor-br/editor-br.js"].lines = {"1":0,"15":0,"16":0,"20":0,"27":0,"28":0,"29":0,"31":0,"32":0,"35":0,"36":0,"37":0,"38":0,"39":0,"42":0,"43":0,"44":0,"45":0,"57":0,"58":0,"59":0,"62":0,"63":0,"74":0,"84":0,"87":0,"88":0,"89":0,"93":0,"94":0,"95":0,"96":0,"98":0,"99":0,"100":0,"123":0,"125":0};
_yuitest_coverage["build/editor-br/editor-br.js"].functions = {"EditorBR:15":0,"_onKeyDown:26":0,"_afterEditorReady:56":0,"_onNodeChange:73":0,"initializer:92":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-br/editor-br.js"].coveredLines = 37;
_yuitest_coverage["build/editor-br/editor-br.js"].coveredFunctions = 6;
_yuitest_coverline("build/editor-br/editor-br.js", 1);
YUI.add('editor-br', function (Y, NAME) {



    /**
     * Plugin for Editor to normalize BR's.
     * @class Plugin.EditorBR
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-br
     */


    _yuitest_coverfunc("build/editor-br/editor-br.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-br/editor-br.js", 15);
var EditorBR = function() {
        _yuitest_coverfunc("build/editor-br/editor-br.js", "EditorBR", 15);
_yuitest_coverline("build/editor-br/editor-br.js", 16);
EditorBR.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', LI = 'li';


    _yuitest_coverline("build/editor-br/editor-br.js", 20);
Y.extend(EditorBR, Y.Base, {
        /**
        * Frame keyDown handler that normalizes BR's when pressing ENTER.
        * @private
        * @method _onKeyDown
        */
        _onKeyDown: function(e) {
            _yuitest_coverfunc("build/editor-br/editor-br.js", "_onKeyDown", 26);
_yuitest_coverline("build/editor-br/editor-br.js", 27);
if (e.stopped) {
                _yuitest_coverline("build/editor-br/editor-br.js", 28);
e.halt();
                _yuitest_coverline("build/editor-br/editor-br.js", 29);
return;
            }
            _yuitest_coverline("build/editor-br/editor-br.js", 31);
if (e.keyCode === 13) {
                _yuitest_coverline("build/editor-br/editor-br.js", 32);
var host = this.get(HOST), inst = host.getInstance(),
                    sel = new inst.EditorSelection();

                _yuitest_coverline("build/editor-br/editor-br.js", 35);
if (sel) {
                    _yuitest_coverline("build/editor-br/editor-br.js", 36);
if (Y.UA.ie) {
                        _yuitest_coverline("build/editor-br/editor-br.js", 37);
if (!sel.anchorNode || (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI))) {
                            _yuitest_coverline("build/editor-br/editor-br.js", 38);
host.execCommand('inserthtml', inst.EditorSelection.CURSOR);
                            _yuitest_coverline("build/editor-br/editor-br.js", 39);
e.halt();
                        }
                    }
                    _yuitest_coverline("build/editor-br/editor-br.js", 42);
if (Y.UA.webkit) {
                        _yuitest_coverline("build/editor-br/editor-br.js", 43);
if (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI)) {
                            _yuitest_coverline("build/editor-br/editor-br.js", 44);
host.frame._execCommand('insertlinebreak', null);
                            _yuitest_coverline("build/editor-br/editor-br.js", 45);
e.halt();
                        }
                    }
                }
            }
        },
        /**
        * Adds listeners for keydown in IE and Webkit. Also fires insertbeonreturn for supporting browsers.
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            _yuitest_coverfunc("build/editor-br/editor-br.js", "_afterEditorReady", 56);
_yuitest_coverline("build/editor-br/editor-br.js", 57);
var inst = this.get(HOST).getInstance();
            _yuitest_coverline("build/editor-br/editor-br.js", 58);
try {
                _yuitest_coverline("build/editor-br/editor-br.js", 59);
inst.config.doc.execCommand('insertbronreturn', null, true);
            } catch (bre) {}

            _yuitest_coverline("build/editor-br/editor-br.js", 62);
if (Y.UA.ie || Y.UA.webkit) {
                _yuitest_coverline("build/editor-br/editor-br.js", 63);
inst.on('keydown', Y.bind(this._onKeyDown, this), inst.config.doc);
            }
        },
        /**
        * Adds a nodeChange listener only for FF, in the event of a backspace or delete, it creates an empy textNode
        * inserts it into the DOM after the e.changedNode, then removes it. Causing FF to redraw the content.
        * @private
        * @method _onNodeChange
        * @param {Event} e The nodeChange event.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("build/editor-br/editor-br.js", "_onNodeChange", 73);
_yuitest_coverline("build/editor-br/editor-br.js", 74);
switch (e.changedType) {
                case 'backspace-up':
                case 'backspace-down':
                case 'delete-up':
                    /*
                    * This forced FF to redraw the content on backspace.
                    * On some occasions FF will leave a cursor residue after content has been deleted.
                    * Dropping in the empty textnode and then removing it causes FF to redraw and
                    * remove the "ghost cursors"
                    */
                    _yuitest_coverline("build/editor-br/editor-br.js", 84);
var inst = this.get(HOST).getInstance(),
                        d = e.changedNode,
                        t = inst.config.doc.createTextNode(' ');
                    _yuitest_coverline("build/editor-br/editor-br.js", 87);
d.appendChild(t);
                    _yuitest_coverline("build/editor-br/editor-br.js", 88);
d.removeChild(t);
                    _yuitest_coverline("build/editor-br/editor-br.js", 89);
break;
            }
        },
        initializer: function() {
            _yuitest_coverfunc("build/editor-br/editor-br.js", "initializer", 92);
_yuitest_coverline("build/editor-br/editor-br.js", 93);
var host = this.get(HOST);
            _yuitest_coverline("build/editor-br/editor-br.js", 94);
if (host.editorPara) {
                _yuitest_coverline("build/editor-br/editor-br.js", 95);
Y.error('Can not plug EditorBR and EditorPara at the same time.');
                _yuitest_coverline("build/editor-br/editor-br.js", 96);
return;
            }
            _yuitest_coverline("build/editor-br/editor-br.js", 98);
host.after('ready', Y.bind(this._afterEditorReady, this));
            _yuitest_coverline("build/editor-br/editor-br.js", 99);
if (Y.UA.gecko) {
                _yuitest_coverline("build/editor-br/editor-br.js", 100);
host.on('nodeChange', Y.bind(this._onNodeChange, this));
            }
        }
    }, {
        /**
        * editorBR
        * @static
        * @property NAME
        */
        NAME: 'editorBR',
        /**
        * editorBR
        * @static
        * @property NS
        */
        NS: 'editorBR',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    _yuitest_coverline("build/editor-br/editor-br.js", 123);
Y.namespace('Plugin');

    _yuitest_coverline("build/editor-br/editor-br.js", 125);
Y.Plugin.EditorBR = EditorBR;



}, '3.7.3', {"requires": ["editor-base"]});
