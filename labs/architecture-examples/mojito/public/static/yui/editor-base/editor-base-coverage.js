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
_yuitest_coverage["build/editor-base/editor-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-base/editor-base.js",
    code: []
};
_yuitest_coverage["build/editor-base/editor-base.js"].code=["YUI.add('editor-base', function (Y, NAME) {","","","    /**","     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.","     *","     *      var editor = new Y.EditorBase({","     *          content: 'Foo'","     *      });","     *      editor.render('#demo');","     *","     * @class EditorBase","     * @extends Base","     * @module editor","     * @main editor","     * @submodule editor-base","     * @constructor","     */","","    var EditorBase = function() {","        EditorBase.superclass.constructor.apply(this, arguments);","    }, LAST_CHILD = ':last-child', BODY = 'body';","","    Y.extend(EditorBase, Y.Base, {","        /**","        * Internal reference to the Y.Frame instance","        * @property frame","        */","        frame: null,","        initializer: function() {","            var frame = new Y.Frame({","                designMode: true,","                title: EditorBase.STRINGS.title,","                use: EditorBase.USE,","                dir: this.get('dir'),","                extracss: this.get('extracss'),","                linkedcss: this.get('linkedcss'),","                defaultblock: this.get('defaultblock'),","                host: this","            }).plug(Y.Plugin.ExecCommand);","","","            frame.after('ready', Y.bind(this._afterFrameReady, this));","            frame.addTarget(this);","","            this.frame = frame;","","            this.publish('nodeChange', {","                emitFacade: true,","                bubbles: true,","                defaultFn: this._defNodeChangeFn","            });","","            //this.plug(Y.Plugin.EditorPara);","        },","        destructor: function() {","            this.frame.destroy();","","            this.detachAll();","        },","        /**","        * Copy certain styles from one node instance to another (used for new paragraph creation mainly)","        * @method copyStyles","        * @param {Node} from The Node instance to copy the styles from","        * @param {Node} to The Node instance to copy the styles to","        */","        copyStyles: function(from, to) {","            if (from.test('a')) {","                //Don't carry the A styles","                return;","            }","            var styles = ['color', 'fontSize', 'fontFamily', 'backgroundColor', 'fontStyle' ],","                newStyles = {};","","            Y.each(styles, function(v) {","                newStyles[v] = from.getStyle(v);","            });","            if (from.ancestor('b,strong')) {","                newStyles.fontWeight = 'bold';","            }","            if (from.ancestor('u')) {","                if (!newStyles.textDecoration) {","                    newStyles.textDecoration = 'underline';","                }","            }","            to.setStyles(newStyles);","        },","        /**","        * Holder for the selection bookmark in IE.","        * @property _lastBookmark","        * @private","        */","        _lastBookmark: null,","        /**","        * Resolves the e.changedNode in the nodeChange event if it comes from the document. If","        * the event came from the document, it will get the last child of the last child of the document","        * and return that instead.","        * @method _resolveChangedNode","        * @param {Node} n The node to resolve","        * @private","        */","        _resolveChangedNode: function(n) {","            var inst = this.getInstance(), lc, lc2, found, sel;","            if (n && n.test(BODY)) {","                sel = new inst.EditorSelection();","                if (sel && sel.anchorNode) {","                    n = sel.anchorNode;","                }","            }","            if (inst && n && n.test('html')) {","                lc = inst.one(BODY).one(LAST_CHILD);","                while (!found) {","                    if (lc) {","                        lc2 = lc.one(LAST_CHILD);","                        if (lc2) {","                            lc = lc2;","                        } else {","                            found = true;","                        }","                    } else {","                        found = true;","                    }","                }","                if (lc) {","                    if (lc.test('br')) {","                        if (lc.previous()) {","                            lc = lc.previous();","                        } else {","                            lc = lc.get('parentNode');","                        }","                    }","                    if (lc) {","                        n = lc;","                    }","                }","            }","            if (!n) {","                //Fallback to make sure a node is attached to the event","                n = inst.one(BODY);","            }","            return n;","        },","        /**","        * The default handler for the nodeChange event.","        * @method _defNodeChangeFn","        * @param {Event} e The event","        * @private","        */","        _defNodeChangeFn: function(e) {","            var startTime = (new Date()).getTime(),","                inst = this.getInstance(), sel,","                changed, endTime,","                cmds = {}, family, fsize, classes = [],","                fColor = '', bColor = '', bq,","                normal = false;","","            if (Y.UA.ie) {","                try {","                    sel = inst.config.doc.selection.createRange();","                    if (sel.getBookmark) {","                        this._lastBookmark = sel.getBookmark();","                    }","                } catch (ie) {}","            }","","            e.changedNode = this._resolveChangedNode(e.changedNode);","","","            /*","            * @TODO","            * This whole method needs to be fixed and made more dynamic.","            * Maybe static functions for the e.changeType and an object bag","            * to walk through and filter to pass off the event to before firing..","            */","","            switch (e.changedType) {","                case 'tab':","                    if (!e.changedNode.test('li, li *') && !e.changedEvent.shiftKey) {","                        e.changedEvent.frameEvent.preventDefault();","                        if (Y.UA.webkit) {","                            this.execCommand('inserttext', '\\t');","                        } else if (Y.UA.gecko) {","                            this.frame.exec._command('inserthtml', EditorBase.TABKEY);","                        } else if (Y.UA.ie) {","                            this.execCommand('inserthtml', EditorBase.TABKEY);","                        }","                    }","                    break;","                case 'backspace-up':","                    // Fixes #2531090 - Joins text node strings so they become one for bidi","                    if (Y.UA.webkit && e.changedNode) {","                        e.changedNode.set('innerHTML', e.changedNode.get('innerHTML'));","                    }","                    break;","            }","            if (Y.UA.webkit && e.commands && (e.commands.indent || e.commands.outdent)) {","                /*","                * When executing execCommand 'indent or 'outdent' Webkit applies","                * a class to the BLOCKQUOTE that adds left/right margin to it","                * This strips that style so it is just a normal BLOCKQUOTE","                */","                bq = inst.all('.webkit-indent-blockquote, blockquote');","                if (bq.size()) {","                    bq.setStyle('margin', '');","                }","            }","","            changed = this.getDomPath(e.changedNode, false);","","            if (e.commands) {","                cmds = e.commands;","            }","","","            Y.each(changed, function(el) {","                var tag = el.tagName.toLowerCase(),","                    cmd = EditorBase.TAG2CMD[tag], s,","                    n, family2, cls, bColor2;","","                if (cmd) {","                    cmds[cmd] = 1;","                }","","                //Bold and Italic styles","                s = el.currentStyle || el.style;","","                if ((''+s.fontWeight) === 'normal') {","                    normal = true;","                }","                if ((''+s.fontWeight) === 'bold') { //Cast this to a string","                    cmds.bold = 1;","                }","                if (Y.UA.ie) {","                    if (s.fontWeight > 400) {","                        cmds.bold = 1;","                    }","                }","                if (s.fontStyle === 'italic') {","                    cmds.italic = 1;","                }","","                if (s.textDecoration.indexOf('underline') > -1) {","                    cmds.underline = 1;","                }","                if (s.textDecoration.indexOf('line-through') > -1) {","                    cmds.strikethrough = 1;","                }","","                n = inst.one(el);","                if (n.getStyle('fontFamily')) {","                    family2 = n.getStyle('fontFamily').split(',')[0].toLowerCase();","                    if (family2) {","                        family = family2;","                    }","                    if (family) {","                        family = family.replace(/'/g, '').replace(/\"/g, '');","                    }","                }","","                fsize = EditorBase.NORMALIZE_FONTSIZE(n);","","","                cls = el.className.split(' ');","                Y.each(cls, function(v) {","                    if (v !== '' && (v.substr(0, 4) !== 'yui_')) {","                        classes.push(v);","                    }","                });","","                fColor = EditorBase.FILTER_RGB(n.getStyle('color'));","                bColor2 = EditorBase.FILTER_RGB(s.backgroundColor);","                if (bColor2 !== 'transparent') {","                    if (bColor2 !== '') {","                        bColor = bColor2;","                    }","                }","","            });","","            if (normal) {","                delete cmds.bold;","                delete cmds.italic;","            }","","            e.dompath = inst.all(changed);","            e.classNames = classes;","            e.commands = cmds;","","            //TODO Dont' like this, not dynamic enough..","            if (!e.fontFamily) {","                e.fontFamily = family;","            }","            if (!e.fontSize) {","                e.fontSize = fsize;","            }","            if (!e.fontColor) {","                e.fontColor = fColor;","            }","            if (!e.backgroundColor) {","                e.backgroundColor = bColor;","            }","","            endTime = (new Date()).getTime();","        },","        /**","        * Walk the dom tree from this node up to body, returning a reversed array of parents.","        * @method getDomPath","        * @param {Node} node The Node to start from","        */","        getDomPath: function(node, nodeList) {","            var domPath = [], domNode,","                inst = this.frame.getInstance();","","            domNode = inst.Node.getDOMNode(node);","            //return inst.all(domNode);","","            while (domNode !== null) {","","                if ((domNode === inst.config.doc.documentElement) || (domNode === inst.config.doc) || !domNode.tagName) {","                    domNode = null;","                    break;","                }","","                if (!inst.DOM.inDoc(domNode)) {","                    domNode = null;","                    break;","                }","","                //Check to see if we get el.nodeName and nodeType","                if (domNode.nodeName && domNode.nodeType && (domNode.nodeType === 1)) {","                    domPath.push(domNode);","                }","","                if (domNode === inst.config.doc.body) {","                    domNode = null;","                    break;","                }","","                domNode = domNode.parentNode;","            }","","            /*{{{ Using Node","            while (node !== null) {","                if (node.test('html') || node.test('doc') || !node.get('tagName')) {","                    node = null;","                    break;","                }","                if (!node.inDoc()) {","                    node = null;","                    break;","                }","                //Check to see if we get el.nodeName and nodeType","                if (node.get('nodeName') && node.get('nodeType') && (node.get('nodeType') == 1)) {","                    domPath.push(inst.Node.getDOMNode(node));","                }","","                if (node.test('body')) {","                    node = null;","                    break;","                }","","                node = node.get('parentNode');","            }","            }}}*/","","            if (domPath.length === 0) {","                domPath[0] = inst.config.doc.body;","            }","","            if (nodeList) {","                return inst.all(domPath.reverse());","            } else {","                return domPath.reverse();","            }","","        },","        /**","        * After frame ready, bind mousedown & keyup listeners","        * @method _afterFrameReady","        * @private","        */","        _afterFrameReady: function() {","            var inst = this.frame.getInstance();","","            this.frame.on('dom:mouseup', Y.bind(this._onFrameMouseUp, this));","            this.frame.on('dom:mousedown', Y.bind(this._onFrameMouseDown, this));","            this.frame.on('dom:keydown', Y.bind(this._onFrameKeyDown, this));","","            if (Y.UA.ie) {","                this.frame.on('dom:activate', Y.bind(this._onFrameActivate, this));","                this.frame.on('dom:beforedeactivate', Y.bind(this._beforeFrameDeactivate, this));","            }","            this.frame.on('dom:keyup', Y.bind(this._onFrameKeyUp, this));","            this.frame.on('dom:keypress', Y.bind(this._onFrameKeyPress, this));","            this.frame.on('dom:paste', Y.bind(this._onPaste, this));","","            inst.EditorSelection.filter();","            this.fire('ready');","        },","        /**","        * Caches the current cursor position in IE.","        * @method _beforeFrameDeactivate","        * @private","        */","        _beforeFrameDeactivate: function(e) {","            if (e.frameTarget.test('html')) { //Means it came from a scrollbar","                return;","            }","            var inst = this.getInstance(),","                sel = inst.config.doc.selection.createRange();","","            if (sel.compareEndPoints && !sel.compareEndPoints('StartToEnd', sel)) {","                sel.pasteHTML('<var id=\"yui-ie-cursor\">');","            }","        },","        /**","        * Moves the cached selection bookmark back so IE can place the cursor in the right place.","        * @method _onFrameActivate","        * @private","        */","        _onFrameActivate: function(e) {","            if (e.frameTarget.test('html')) { //Means it came from a scrollbar","                return;","            }","            var inst = this.getInstance(),","                sel = new inst.EditorSelection(),","                range = sel.createRange(),","                cur = inst.all('#yui-ie-cursor');","","            if (cur.size()) {","                cur.each(function(n) {","                    n.set('id', '');","                    if (range.moveToElementText) {","                        try {","                            range.moveToElementText(n._node);","                            var moved = range.move('character', -1);","                            if (moved === -1) { //Only move up if we actually moved back.","                                range.move('character', 1);","                            }","                            range.select();","                            range.text = '';","                        } catch (e) {}","                    }","                    n.remove();","                });","            }","        },","        /**","        * Fires nodeChange event","        * @method _onPaste","        * @private","        */","        _onPaste: function(e) {","            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'paste', changedEvent: e.frameEvent });","        },","        /**","        * Fires nodeChange event","        * @method _onFrameMouseUp","        * @private","        */","        _onFrameMouseUp: function(e) {","            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mouseup', changedEvent: e.frameEvent  });","        },","        /**","        * Fires nodeChange event","        * @method _onFrameMouseDown","        * @private","        */","        _onFrameMouseDown: function(e) {","            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mousedown', changedEvent: e.frameEvent  });","        },","        /**","        * Caches a copy of the selection for key events. Only creating the selection on keydown","        * @property _currentSelection","        * @private","        */","        _currentSelection: null,","        /**","        * Holds the timer for selection clearing","        * @property _currentSelectionTimer","        * @private","        */","        _currentSelectionTimer: null,","        /**","        * Flag to determine if we can clear the selection or not.","        * @property _currentSelectionClear","        * @private","        */","        _currentSelectionClear: null,","        /**","        * Fires nodeChange event","        * @method _onFrameKeyDown","        * @private","        */","        _onFrameKeyDown: function(e) {","            var inst, sel;","            if (!this._currentSelection) {","                if (this._currentSelectionTimer) {","                    this._currentSelectionTimer.cancel();","                }","                this._currentSelectionTimer = Y.later(850, this, function() {","                    this._currentSelectionClear = true;","                });","","                inst = this.frame.getInstance();","                sel = new inst.EditorSelection(e);","","                this._currentSelection = sel;","            } else {","                sel = this._currentSelection;","            }","","            inst = this.frame.getInstance();","            sel = new inst.EditorSelection();","","            this._currentSelection = sel;","","            if (sel && sel.anchorNode) {","                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keydown', changedEvent: e.frameEvent });","                if (EditorBase.NC_KEYS[e.keyCode]) {","                    this.fire('nodeChange', {","                        changedNode: sel.anchorNode,","                        changedType: EditorBase.NC_KEYS[e.keyCode],","                        changedEvent: e.frameEvent","                    });","                    this.fire('nodeChange', {","                        changedNode: sel.anchorNode,","                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-down',","                        changedEvent: e.frameEvent","                    });","                }","            }","        },","        /**","        * Fires nodeChange event","        * @method _onFrameKeyPress","        * @private","        */","        _onFrameKeyPress: function(e) {","            var sel = this._currentSelection;","","            if (sel && sel.anchorNode) {","                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keypress', changedEvent: e.frameEvent });","                if (EditorBase.NC_KEYS[e.keyCode]) {","                    this.fire('nodeChange', {","                        changedNode: sel.anchorNode,","                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-press',","                        changedEvent: e.frameEvent","                    });","                }","            }","        },","        /**","        * Fires nodeChange event for keyup on specific keys","        * @method _onFrameKeyUp","        * @private","        */","        _onFrameKeyUp: function(e) {","            var inst = this.frame.getInstance(),","                sel = new inst.EditorSelection(e);","","            if (sel && sel.anchorNode) {","                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keyup', selection: sel, changedEvent: e.frameEvent  });","                if (EditorBase.NC_KEYS[e.keyCode]) {","                    this.fire('nodeChange', {","                        changedNode: sel.anchorNode,","                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-up',","                        selection: sel,","                        changedEvent: e.frameEvent","                    });","                }","            }","            if (this._currentSelectionClear) {","                this._currentSelectionClear = this._currentSelection = null;","            }","        },","        /**","        * Pass through to the frame.execCommand method","        * @method execCommand","        * @param {String} cmd The command to pass: inserthtml, insertimage, bold","        * @param {String} val The optional value of the command: Helvetica","        * @return {Node/NodeList} The Node or Nodelist affected by the command. Only returns on override commands, not browser defined commands.","        */","        execCommand: function(cmd, val) {","            var ret = this.frame.execCommand(cmd, val),","                inst = this.frame.getInstance(),","                sel = new inst.EditorSelection(), cmds = {},","                e = { changedNode: sel.anchorNode, changedType: 'execcommand', nodes: ret };","","            switch (cmd) {","                case 'forecolor':","                    e.fontColor = val;","                    break;","                case 'backcolor':","                    e.backgroundColor = val;","                    break;","                case 'fontsize':","                    e.fontSize = val;","                    break;","                case 'fontname':","                    e.fontFamily = val;","                    break;","            }","","            cmds[cmd] = 1;","            e.commands = cmds;","","            this.fire('nodeChange', e);","","            return ret;","        },","        /**","        * Get the YUI instance of the frame","        * @method getInstance","        * @return {YUI} The YUI instance bound to the frame.","        */","        getInstance: function() {","            return this.frame.getInstance();","        },","        /**","        * Renders the Y.Frame to the passed node.","        * @method render","        * @param {Selector/HTMLElement/Node} node The node to append the Editor to","        * @return {EditorBase}","        * @chainable","        */","        render: function(node) {","            this.frame.set('content', this.get('content'));","            this.frame.render(node);","            return this;","        },","        /**","        * Focus the contentWindow of the iframe","        * @method focus","        * @param {Function} fn Callback function to execute after focus happens","        * @return {EditorBase}","        * @chainable","        */","        focus: function(fn) {","            this.frame.focus(fn);","            return this;","        },","        /**","        * Handles the showing of the Editor instance. Currently only handles the iframe","        * @method show","        * @return {EditorBase}","        * @chainable","        */","        show: function() {","            this.frame.show();","            return this;","        },","        /**","        * Handles the hiding of the Editor instance. Currently only handles the iframe","        * @method hide","        * @return {EditorBase}","        * @chainable","        */","        hide: function() {","            this.frame.hide();","            return this;","        },","        /**","        * (Un)Filters the content of the Editor, cleaning YUI related code. //TODO better filtering","        * @method getContent","        * @return {String} The filtered content of the Editor","        */","        getContent: function() {","            var html = '', inst = this.getInstance();","            if (inst && inst.EditorSelection) {","                html = inst.EditorSelection.unfilter();","            }","            //Removing the _yuid from the objects in IE","            html = html.replace(/ _yuid=\"([^>]*)\"/g, '');","            return html;","        }","    }, {","        /**","        * @static","        * @method NORMALIZE_FONTSIZE","        * @description Pulls the fontSize from a node, then checks for string values (x-large, x-small)","        * and converts them to pixel sizes. If the parsed size is different from the original, it calls","        * node.setStyle to update the node with a pixel size for normalization.","        */","        NORMALIZE_FONTSIZE: function(n) {","            var size = n.getStyle('fontSize'), oSize = size;","","            switch (size) {","                case '-webkit-xxx-large':","                    size = '48px';","                    break;","                case 'xx-large':","                    size = '32px';","                    break;","                case 'x-large':","                    size = '24px';","                    break;","                case 'large':","                    size = '18px';","                    break;","                case 'medium':","                    size = '16px';","                    break;","                case 'small':","                    size = '13px';","                    break;","                case 'x-small':","                    size = '10px';","                    break;","            }","            if (oSize !== size) {","                n.setStyle('fontSize', size);","            }","            return size;","        },","        /**","        * @static","        * @property TABKEY","        * @description The HTML markup to use for the tabkey","        */","        TABKEY: '<span class=\"tab\">&nbsp;&nbsp;&nbsp;&nbsp;</span>',","        /**","        * @static","        * @method FILTER_RGB","        * @param String css The CSS string containing rgb(#,#,#);","        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00","        * @return String","        */","        FILTER_RGB: function(css) {","            if (css.toLowerCase().indexOf('rgb') !== -1) {","                var exp = new RegExp(\"(.*?)rgb\\\\s*?\\\\(\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?,\\\\s*?([0-9]+).*?\\\\)(.*?)\", \"gi\"),","                    rgb = css.replace(exp, \"$1,$2,$3,$4,$5\").split(','),","                    r, g, b;","","                if (rgb.length === 5) {","                    r = parseInt(rgb[1], 10).toString(16);","                    g = parseInt(rgb[2], 10).toString(16);","                    b = parseInt(rgb[3], 10).toString(16);","","                    r = r.length === 1 ? '0' + r : r;","                    g = g.length === 1 ? '0' + g : g;","                    b = b.length === 1 ? '0' + b : b;","","                    css = \"#\" + r + g + b;","                }","            }","            return css;","        },","        /**","        * @static","        * @property TAG2CMD","        * @description A hash table of tags to their execcomand's","        */","        TAG2CMD: {","            'b': 'bold',","            'strong': 'bold',","            'i': 'italic',","            'em': 'italic',","            'u': 'underline',","            'sup': 'superscript',","            'sub': 'subscript',","            'img': 'insertimage',","            'a' : 'createlink',","            'ul' : 'insertunorderedlist',","            'ol' : 'insertorderedlist'","        },","        /**","        * Hash table of keys to fire a nodeChange event for.","        * @static","        * @property NC_KEYS","        * @type Object","        */","        NC_KEYS: {","            8: 'backspace',","            9: 'tab',","            13: 'enter',","            32: 'space',","            33: 'pageup',","            34: 'pagedown',","            35: 'end',","            36: 'home',","            37: 'left',","            38: 'up',","            39: 'right',","            40: 'down',","            46: 'delete'","        },","        /**","        * The default modules to use inside the Frame","        * @static","        * @property USE","        * @type Array","        */","        USE: ['substitute', 'node', 'selector-css3', 'editor-selection', 'stylesheet'],","        /**","        * The Class Name: editorBase","        * @static","        * @property NAME","        */","        NAME: 'editorBase',","        /**","        * Editor Strings.  By default contains only the `title` property for the","        * Title of frame document (default \"Rich Text Editor\").","        *","        * @static","        * @property STRINGS","        */","        STRINGS: {","            title: 'Rich Text Editor'","        },","        ATTRS: {","            /**","            * The content to load into the Editor Frame","            * @attribute content","            */","            content: {","                value: '<br class=\"yui-cursor\">',","                setter: function(str) {","                    if (str.substr(0, 1) === \"\\n\") {","                        str = str.substr(1);","                    }","                    if (str === '') {","                        str = '<br class=\"yui-cursor\">';","                    }","                    if (str === ' ') {","                        if (Y.UA.gecko) {","                            str = '<br class=\"yui-cursor\">';","                        }","                    }","                    return this.frame.set('content', str);","                },","                getter: function() {","                    return this.frame.get('content');","                }","            },","            /**","            * The value of the dir attribute on the HTML element of the frame. Default: ltr","            * @attribute dir","            */","            dir: {","                writeOnce: true,","                value: 'ltr'","            },","            /**","            * @attribute linkedcss","            * @description An array of url's to external linked style sheets","            * @type String","            */","            linkedcss: {","                value: '',","                setter: function(css) {","                    if (this.frame) {","                        this.frame.set('linkedcss', css);","                    }","                    return css;","                }","            },","            /**","            * @attribute extracss","            * @description A string of CSS to add to the Head of the Editor","            * @type String","            */","            extracss: {","                value: false,","                setter: function(css) {","                    if (this.frame) {","                        this.frame.set('extracss', css);","                    }","                    return css;","                }","            },","            /**","            * @attribute defaultblock","            * @description The default tag to use for block level items, defaults to: p","            * @type String","            */","            defaultblock: {","                value: 'p'","            }","        }","    });","","    Y.EditorBase = EditorBase;","","    /**","    * @event nodeChange","    * @description Fired from several mouse/key/paste event points.","    * @param {Event.Facade} event An Event Facade object with the following specific properties added:","    * <dl>","    *   <dt>changedEvent</dt><dd>The event that caused the nodeChange</dd>","    *   <dt>changedNode</dt><dd>The node that was interacted with</dd>","    *   <dt>changedType</dt><dd>The type of change: mousedown, mouseup, right, left, backspace, tab, enter, etc..</dd>","    *   <dt>commands</dt><dd>The list of execCommands that belong to this change and the dompath that's associated with the changedNode</dd>","    *   <dt>classNames</dt><dd>An array of classNames that are applied to the changedNode and all of it's parents</dd>","    *   <dt>dompath</dt><dd>A sorted array of node instances that make up the DOM path from the changedNode to body.</dd>","    *   <dt>backgroundColor</dt><dd>The cascaded backgroundColor of the changedNode</dd>","    *   <dt>fontColor</dt><dd>The cascaded fontColor of the changedNode</dd>","    *   <dt>fontFamily</dt><dd>The cascaded fontFamily of the changedNode</dd>","    *   <dt>fontSize</dt><dd>The cascaded fontSize of the changedNode</dd>","    * </dl>","    * @type {Event.Custom}","    */","","    /**","    * @event ready","    * @description Fired after the frame is ready.","    * @param {Event.Facade} event An Event Facade object.","    * @type {Event.Custom}","    */","","","","","","}, '3.7.3', {\"requires\": [\"base\", \"frame\", \"node\", \"exec-command\", \"editor-selection\"]});"];
_yuitest_coverage["build/editor-base/editor-base.js"].lines = {"1":0,"20":0,"21":0,"24":0,"31":0,"43":0,"44":0,"46":0,"48":0,"57":0,"59":0,"68":0,"70":0,"72":0,"75":0,"76":0,"78":0,"79":0,"81":0,"82":0,"83":0,"86":0,"103":0,"104":0,"105":0,"106":0,"107":0,"110":0,"111":0,"112":0,"113":0,"114":0,"115":0,"116":0,"118":0,"121":0,"124":0,"125":0,"126":0,"127":0,"129":0,"132":0,"133":0,"137":0,"139":0,"141":0,"150":0,"157":0,"158":0,"159":0,"160":0,"161":0,"166":0,"176":0,"178":0,"179":0,"180":0,"181":0,"182":0,"183":0,"184":0,"185":0,"188":0,"191":0,"192":0,"194":0,"196":0,"202":0,"203":0,"204":0,"208":0,"210":0,"211":0,"215":0,"216":0,"220":0,"221":0,"225":0,"227":0,"228":0,"230":0,"231":0,"233":0,"234":0,"235":0,"238":0,"239":0,"242":0,"243":0,"245":0,"246":0,"249":0,"250":0,"251":0,"252":0,"253":0,"255":0,"256":0,"260":0,"263":0,"264":0,"265":0,"266":0,"270":0,"271":0,"272":0,"273":0,"274":0,"280":0,"281":0,"282":0,"285":0,"286":0,"287":0,"290":0,"291":0,"293":0,"294":0,"296":0,"297":0,"299":0,"300":0,"303":0,"311":0,"314":0,"317":0,"319":0,"320":0,"321":0,"324":0,"325":0,"326":0,"330":0,"331":0,"334":0,"335":0,"336":0,"339":0,"366":0,"367":0,"370":0,"371":0,"373":0,"383":0,"385":0,"386":0,"387":0,"389":0,"390":0,"391":0,"393":0,"394":0,"395":0,"397":0,"398":0,"406":0,"407":0,"409":0,"412":0,"413":0,"422":0,"423":0,"425":0,"430":0,"431":0,"432":0,"433":0,"434":0,"435":0,"436":0,"437":0,"438":0,"440":0,"441":0,"444":0,"454":0,"462":0,"470":0,"496":0,"497":0,"498":0,"499":0,"501":0,"502":0,"505":0,"506":0,"508":0,"510":0,"513":0,"514":0,"516":0,"518":0,"519":0,"520":0,"521":0,"526":0,"540":0,"542":0,"543":0,"544":0,"545":0,"559":0,"562":0,"563":0,"564":0,"565":0,"573":0,"574":0,"585":0,"590":0,"592":0,"593":0,"595":0,"596":0,"598":0,"599":0,"601":0,"602":0,"605":0,"606":0,"608":0,"610":0,"618":0,"628":0,"629":0,"630":0,"640":0,"641":0,"650":0,"651":0,"660":0,"661":0,"669":0,"670":0,"671":0,"674":0,"675":0,"686":0,"688":0,"690":0,"691":0,"693":0,"694":0,"696":0,"697":0,"699":0,"700":0,"702":0,"703":0,"705":0,"706":0,"708":0,"709":0,"711":0,"712":0,"714":0,"730":0,"731":0,"735":0,"736":0,"737":0,"738":0,"740":0,"741":0,"742":0,"744":0,"747":0,"819":0,"820":0,"822":0,"823":0,"825":0,"826":0,"827":0,"830":0,"833":0,"852":0,"853":0,"855":0,"866":0,"867":0,"869":0,"883":0};
_yuitest_coverage["build/editor-base/editor-base.js"].functions = {"EditorBase:20":0,"initializer:30":0,"destructor:56":0,"(anonymous 2):75":0,"copyStyles:67":0,"_resolveChangedNode:102":0,"(anonymous 4):264":0,"(anonymous 3):215":0,"_defNodeChangeFn:149":0,"getDomPath:310":0,"_afterFrameReady:382":0,"_beforeFrameDeactivate:405":0,"(anonymous 5):431":0,"_onFrameActivate:421":0,"_onPaste:453":0,"_onFrameMouseUp:461":0,"_onFrameMouseDown:469":0,"(anonymous 6):501":0,"_onFrameKeyDown:495":0,"_onFrameKeyPress:539":0,"_onFrameKeyUp:558":0,"execCommand:584":0,"getInstance:617":0,"render:627":0,"focus:639":0,"show:649":0,"hide:659":0,"getContent:668":0,"NORMALIZE_FONTSIZE:685":0,"FILTER_RGB:729":0,"setter:818":0,"getter:832":0,"setter:851":0,"setter:865":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-base/editor-base.js"].coveredLines = 283;
_yuitest_coverage["build/editor-base/editor-base.js"].coveredFunctions = 35;
_yuitest_coverline("build/editor-base/editor-base.js", 1);
YUI.add('editor-base', function (Y, NAME) {


    /**
     * Base class for Editor. Handles the business logic of Editor, no GUI involved only utility methods and events.
     *
     *      var editor = new Y.EditorBase({
     *          content: 'Foo'
     *      });
     *      editor.render('#demo');
     *
     * @class EditorBase
     * @extends Base
     * @module editor
     * @main editor
     * @submodule editor-base
     * @constructor
     */

    _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-base/editor-base.js", 20);
var EditorBase = function() {
        _yuitest_coverfunc("build/editor-base/editor-base.js", "EditorBase", 20);
_yuitest_coverline("build/editor-base/editor-base.js", 21);
EditorBase.superclass.constructor.apply(this, arguments);
    }, LAST_CHILD = ':last-child', BODY = 'body';

    _yuitest_coverline("build/editor-base/editor-base.js", 24);
Y.extend(EditorBase, Y.Base, {
        /**
        * Internal reference to the Y.Frame instance
        * @property frame
        */
        frame: null,
        initializer: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "initializer", 30);
_yuitest_coverline("build/editor-base/editor-base.js", 31);
var frame = new Y.Frame({
                designMode: true,
                title: EditorBase.STRINGS.title,
                use: EditorBase.USE,
                dir: this.get('dir'),
                extracss: this.get('extracss'),
                linkedcss: this.get('linkedcss'),
                defaultblock: this.get('defaultblock'),
                host: this
            }).plug(Y.Plugin.ExecCommand);


            _yuitest_coverline("build/editor-base/editor-base.js", 43);
frame.after('ready', Y.bind(this._afterFrameReady, this));
            _yuitest_coverline("build/editor-base/editor-base.js", 44);
frame.addTarget(this);

            _yuitest_coverline("build/editor-base/editor-base.js", 46);
this.frame = frame;

            _yuitest_coverline("build/editor-base/editor-base.js", 48);
this.publish('nodeChange', {
                emitFacade: true,
                bubbles: true,
                defaultFn: this._defNodeChangeFn
            });

            //this.plug(Y.Plugin.EditorPara);
        },
        destructor: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "destructor", 56);
_yuitest_coverline("build/editor-base/editor-base.js", 57);
this.frame.destroy();

            _yuitest_coverline("build/editor-base/editor-base.js", 59);
this.detachAll();
        },
        /**
        * Copy certain styles from one node instance to another (used for new paragraph creation mainly)
        * @method copyStyles
        * @param {Node} from The Node instance to copy the styles from
        * @param {Node} to The Node instance to copy the styles to
        */
        copyStyles: function(from, to) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "copyStyles", 67);
_yuitest_coverline("build/editor-base/editor-base.js", 68);
if (from.test('a')) {
                //Don't carry the A styles
                _yuitest_coverline("build/editor-base/editor-base.js", 70);
return;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 72);
var styles = ['color', 'fontSize', 'fontFamily', 'backgroundColor', 'fontStyle' ],
                newStyles = {};

            _yuitest_coverline("build/editor-base/editor-base.js", 75);
Y.each(styles, function(v) {
                _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 2)", 75);
_yuitest_coverline("build/editor-base/editor-base.js", 76);
newStyles[v] = from.getStyle(v);
            });
            _yuitest_coverline("build/editor-base/editor-base.js", 78);
if (from.ancestor('b,strong')) {
                _yuitest_coverline("build/editor-base/editor-base.js", 79);
newStyles.fontWeight = 'bold';
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 81);
if (from.ancestor('u')) {
                _yuitest_coverline("build/editor-base/editor-base.js", 82);
if (!newStyles.textDecoration) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 83);
newStyles.textDecoration = 'underline';
                }
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 86);
to.setStyles(newStyles);
        },
        /**
        * Holder for the selection bookmark in IE.
        * @property _lastBookmark
        * @private
        */
        _lastBookmark: null,
        /**
        * Resolves the e.changedNode in the nodeChange event if it comes from the document. If
        * the event came from the document, it will get the last child of the last child of the document
        * and return that instead.
        * @method _resolveChangedNode
        * @param {Node} n The node to resolve
        * @private
        */
        _resolveChangedNode: function(n) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_resolveChangedNode", 102);
_yuitest_coverline("build/editor-base/editor-base.js", 103);
var inst = this.getInstance(), lc, lc2, found, sel;
            _yuitest_coverline("build/editor-base/editor-base.js", 104);
if (n && n.test(BODY)) {
                _yuitest_coverline("build/editor-base/editor-base.js", 105);
sel = new inst.EditorSelection();
                _yuitest_coverline("build/editor-base/editor-base.js", 106);
if (sel && sel.anchorNode) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 107);
n = sel.anchorNode;
                }
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 110);
if (inst && n && n.test('html')) {
                _yuitest_coverline("build/editor-base/editor-base.js", 111);
lc = inst.one(BODY).one(LAST_CHILD);
                _yuitest_coverline("build/editor-base/editor-base.js", 112);
while (!found) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 113);
if (lc) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 114);
lc2 = lc.one(LAST_CHILD);
                        _yuitest_coverline("build/editor-base/editor-base.js", 115);
if (lc2) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 116);
lc = lc2;
                        } else {
                            _yuitest_coverline("build/editor-base/editor-base.js", 118);
found = true;
                        }
                    } else {
                        _yuitest_coverline("build/editor-base/editor-base.js", 121);
found = true;
                    }
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 124);
if (lc) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 125);
if (lc.test('br')) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 126);
if (lc.previous()) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 127);
lc = lc.previous();
                        } else {
                            _yuitest_coverline("build/editor-base/editor-base.js", 129);
lc = lc.get('parentNode');
                        }
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 132);
if (lc) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 133);
n = lc;
                    }
                }
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 137);
if (!n) {
                //Fallback to make sure a node is attached to the event
                _yuitest_coverline("build/editor-base/editor-base.js", 139);
n = inst.one(BODY);
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 141);
return n;
        },
        /**
        * The default handler for the nodeChange event.
        * @method _defNodeChangeFn
        * @param {Event} e The event
        * @private
        */
        _defNodeChangeFn: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_defNodeChangeFn", 149);
_yuitest_coverline("build/editor-base/editor-base.js", 150);
var startTime = (new Date()).getTime(),
                inst = this.getInstance(), sel,
                changed, endTime,
                cmds = {}, family, fsize, classes = [],
                fColor = '', bColor = '', bq,
                normal = false;

            _yuitest_coverline("build/editor-base/editor-base.js", 157);
if (Y.UA.ie) {
                _yuitest_coverline("build/editor-base/editor-base.js", 158);
try {
                    _yuitest_coverline("build/editor-base/editor-base.js", 159);
sel = inst.config.doc.selection.createRange();
                    _yuitest_coverline("build/editor-base/editor-base.js", 160);
if (sel.getBookmark) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 161);
this._lastBookmark = sel.getBookmark();
                    }
                } catch (ie) {}
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 166);
e.changedNode = this._resolveChangedNode(e.changedNode);


            /*
            * @TODO
            * This whole method needs to be fixed and made more dynamic.
            * Maybe static functions for the e.changeType and an object bag
            * to walk through and filter to pass off the event to before firing..
            */

            _yuitest_coverline("build/editor-base/editor-base.js", 176);
switch (e.changedType) {
                case 'tab':
                    _yuitest_coverline("build/editor-base/editor-base.js", 178);
if (!e.changedNode.test('li, li *') && !e.changedEvent.shiftKey) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 179);
e.changedEvent.frameEvent.preventDefault();
                        _yuitest_coverline("build/editor-base/editor-base.js", 180);
if (Y.UA.webkit) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 181);
this.execCommand('inserttext', '\t');
                        } else {_yuitest_coverline("build/editor-base/editor-base.js", 182);
if (Y.UA.gecko) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 183);
this.frame.exec._command('inserthtml', EditorBase.TABKEY);
                        } else {_yuitest_coverline("build/editor-base/editor-base.js", 184);
if (Y.UA.ie) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 185);
this.execCommand('inserthtml', EditorBase.TABKEY);
                        }}}
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 188);
break;
                case 'backspace-up':
                    // Fixes #2531090 - Joins text node strings so they become one for bidi
                    _yuitest_coverline("build/editor-base/editor-base.js", 191);
if (Y.UA.webkit && e.changedNode) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 192);
e.changedNode.set('innerHTML', e.changedNode.get('innerHTML'));
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 194);
break;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 196);
if (Y.UA.webkit && e.commands && (e.commands.indent || e.commands.outdent)) {
                /*
                * When executing execCommand 'indent or 'outdent' Webkit applies
                * a class to the BLOCKQUOTE that adds left/right margin to it
                * This strips that style so it is just a normal BLOCKQUOTE
                */
                _yuitest_coverline("build/editor-base/editor-base.js", 202);
bq = inst.all('.webkit-indent-blockquote, blockquote');
                _yuitest_coverline("build/editor-base/editor-base.js", 203);
if (bq.size()) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 204);
bq.setStyle('margin', '');
                }
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 208);
changed = this.getDomPath(e.changedNode, false);

            _yuitest_coverline("build/editor-base/editor-base.js", 210);
if (e.commands) {
                _yuitest_coverline("build/editor-base/editor-base.js", 211);
cmds = e.commands;
            }


            _yuitest_coverline("build/editor-base/editor-base.js", 215);
Y.each(changed, function(el) {
                _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 3)", 215);
_yuitest_coverline("build/editor-base/editor-base.js", 216);
var tag = el.tagName.toLowerCase(),
                    cmd = EditorBase.TAG2CMD[tag], s,
                    n, family2, cls, bColor2;

                _yuitest_coverline("build/editor-base/editor-base.js", 220);
if (cmd) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 221);
cmds[cmd] = 1;
                }

                //Bold and Italic styles
                _yuitest_coverline("build/editor-base/editor-base.js", 225);
s = el.currentStyle || el.style;

                _yuitest_coverline("build/editor-base/editor-base.js", 227);
if ((''+s.fontWeight) === 'normal') {
                    _yuitest_coverline("build/editor-base/editor-base.js", 228);
normal = true;
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 230);
if ((''+s.fontWeight) === 'bold') { //Cast this to a string
                    _yuitest_coverline("build/editor-base/editor-base.js", 231);
cmds.bold = 1;
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 233);
if (Y.UA.ie) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 234);
if (s.fontWeight > 400) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 235);
cmds.bold = 1;
                    }
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 238);
if (s.fontStyle === 'italic') {
                    _yuitest_coverline("build/editor-base/editor-base.js", 239);
cmds.italic = 1;
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 242);
if (s.textDecoration.indexOf('underline') > -1) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 243);
cmds.underline = 1;
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 245);
if (s.textDecoration.indexOf('line-through') > -1) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 246);
cmds.strikethrough = 1;
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 249);
n = inst.one(el);
                _yuitest_coverline("build/editor-base/editor-base.js", 250);
if (n.getStyle('fontFamily')) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 251);
family2 = n.getStyle('fontFamily').split(',')[0].toLowerCase();
                    _yuitest_coverline("build/editor-base/editor-base.js", 252);
if (family2) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 253);
family = family2;
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 255);
if (family) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 256);
family = family.replace(/'/g, '').replace(/"/g, '');
                    }
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 260);
fsize = EditorBase.NORMALIZE_FONTSIZE(n);


                _yuitest_coverline("build/editor-base/editor-base.js", 263);
cls = el.className.split(' ');
                _yuitest_coverline("build/editor-base/editor-base.js", 264);
Y.each(cls, function(v) {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 4)", 264);
_yuitest_coverline("build/editor-base/editor-base.js", 265);
if (v !== '' && (v.substr(0, 4) !== 'yui_')) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 266);
classes.push(v);
                    }
                });

                _yuitest_coverline("build/editor-base/editor-base.js", 270);
fColor = EditorBase.FILTER_RGB(n.getStyle('color'));
                _yuitest_coverline("build/editor-base/editor-base.js", 271);
bColor2 = EditorBase.FILTER_RGB(s.backgroundColor);
                _yuitest_coverline("build/editor-base/editor-base.js", 272);
if (bColor2 !== 'transparent') {
                    _yuitest_coverline("build/editor-base/editor-base.js", 273);
if (bColor2 !== '') {
                        _yuitest_coverline("build/editor-base/editor-base.js", 274);
bColor = bColor2;
                    }
                }

            });

            _yuitest_coverline("build/editor-base/editor-base.js", 280);
if (normal) {
                _yuitest_coverline("build/editor-base/editor-base.js", 281);
delete cmds.bold;
                _yuitest_coverline("build/editor-base/editor-base.js", 282);
delete cmds.italic;
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 285);
e.dompath = inst.all(changed);
            _yuitest_coverline("build/editor-base/editor-base.js", 286);
e.classNames = classes;
            _yuitest_coverline("build/editor-base/editor-base.js", 287);
e.commands = cmds;

            //TODO Dont' like this, not dynamic enough..
            _yuitest_coverline("build/editor-base/editor-base.js", 290);
if (!e.fontFamily) {
                _yuitest_coverline("build/editor-base/editor-base.js", 291);
e.fontFamily = family;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 293);
if (!e.fontSize) {
                _yuitest_coverline("build/editor-base/editor-base.js", 294);
e.fontSize = fsize;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 296);
if (!e.fontColor) {
                _yuitest_coverline("build/editor-base/editor-base.js", 297);
e.fontColor = fColor;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 299);
if (!e.backgroundColor) {
                _yuitest_coverline("build/editor-base/editor-base.js", 300);
e.backgroundColor = bColor;
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 303);
endTime = (new Date()).getTime();
        },
        /**
        * Walk the dom tree from this node up to body, returning a reversed array of parents.
        * @method getDomPath
        * @param {Node} node The Node to start from
        */
        getDomPath: function(node, nodeList) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "getDomPath", 310);
_yuitest_coverline("build/editor-base/editor-base.js", 311);
var domPath = [], domNode,
                inst = this.frame.getInstance();

            _yuitest_coverline("build/editor-base/editor-base.js", 314);
domNode = inst.Node.getDOMNode(node);
            //return inst.all(domNode);

            _yuitest_coverline("build/editor-base/editor-base.js", 317);
while (domNode !== null) {

                _yuitest_coverline("build/editor-base/editor-base.js", 319);
if ((domNode === inst.config.doc.documentElement) || (domNode === inst.config.doc) || !domNode.tagName) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 320);
domNode = null;
                    _yuitest_coverline("build/editor-base/editor-base.js", 321);
break;
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 324);
if (!inst.DOM.inDoc(domNode)) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 325);
domNode = null;
                    _yuitest_coverline("build/editor-base/editor-base.js", 326);
break;
                }

                //Check to see if we get el.nodeName and nodeType
                _yuitest_coverline("build/editor-base/editor-base.js", 330);
if (domNode.nodeName && domNode.nodeType && (domNode.nodeType === 1)) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 331);
domPath.push(domNode);
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 334);
if (domNode === inst.config.doc.body) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 335);
domNode = null;
                    _yuitest_coverline("build/editor-base/editor-base.js", 336);
break;
                }

                _yuitest_coverline("build/editor-base/editor-base.js", 339);
domNode = domNode.parentNode;
            }

            /*{{{ Using Node
            while (node !== null) {
                if (node.test('html') || node.test('doc') || !node.get('tagName')) {
                    node = null;
                    break;
                }
                if (!node.inDoc()) {
                    node = null;
                    break;
                }
                //Check to see if we get el.nodeName and nodeType
                if (node.get('nodeName') && node.get('nodeType') && (node.get('nodeType') == 1)) {
                    domPath.push(inst.Node.getDOMNode(node));
                }

                if (node.test('body')) {
                    node = null;
                    break;
                }

                node = node.get('parentNode');
            }
            }}}*/

            _yuitest_coverline("build/editor-base/editor-base.js", 366);
if (domPath.length === 0) {
                _yuitest_coverline("build/editor-base/editor-base.js", 367);
domPath[0] = inst.config.doc.body;
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 370);
if (nodeList) {
                _yuitest_coverline("build/editor-base/editor-base.js", 371);
return inst.all(domPath.reverse());
            } else {
                _yuitest_coverline("build/editor-base/editor-base.js", 373);
return domPath.reverse();
            }

        },
        /**
        * After frame ready, bind mousedown & keyup listeners
        * @method _afterFrameReady
        * @private
        */
        _afterFrameReady: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_afterFrameReady", 382);
_yuitest_coverline("build/editor-base/editor-base.js", 383);
var inst = this.frame.getInstance();

            _yuitest_coverline("build/editor-base/editor-base.js", 385);
this.frame.on('dom:mouseup', Y.bind(this._onFrameMouseUp, this));
            _yuitest_coverline("build/editor-base/editor-base.js", 386);
this.frame.on('dom:mousedown', Y.bind(this._onFrameMouseDown, this));
            _yuitest_coverline("build/editor-base/editor-base.js", 387);
this.frame.on('dom:keydown', Y.bind(this._onFrameKeyDown, this));

            _yuitest_coverline("build/editor-base/editor-base.js", 389);
if (Y.UA.ie) {
                _yuitest_coverline("build/editor-base/editor-base.js", 390);
this.frame.on('dom:activate', Y.bind(this._onFrameActivate, this));
                _yuitest_coverline("build/editor-base/editor-base.js", 391);
this.frame.on('dom:beforedeactivate', Y.bind(this._beforeFrameDeactivate, this));
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 393);
this.frame.on('dom:keyup', Y.bind(this._onFrameKeyUp, this));
            _yuitest_coverline("build/editor-base/editor-base.js", 394);
this.frame.on('dom:keypress', Y.bind(this._onFrameKeyPress, this));
            _yuitest_coverline("build/editor-base/editor-base.js", 395);
this.frame.on('dom:paste', Y.bind(this._onPaste, this));

            _yuitest_coverline("build/editor-base/editor-base.js", 397);
inst.EditorSelection.filter();
            _yuitest_coverline("build/editor-base/editor-base.js", 398);
this.fire('ready');
        },
        /**
        * Caches the current cursor position in IE.
        * @method _beforeFrameDeactivate
        * @private
        */
        _beforeFrameDeactivate: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_beforeFrameDeactivate", 405);
_yuitest_coverline("build/editor-base/editor-base.js", 406);
if (e.frameTarget.test('html')) { //Means it came from a scrollbar
                _yuitest_coverline("build/editor-base/editor-base.js", 407);
return;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 409);
var inst = this.getInstance(),
                sel = inst.config.doc.selection.createRange();

            _yuitest_coverline("build/editor-base/editor-base.js", 412);
if (sel.compareEndPoints && !sel.compareEndPoints('StartToEnd', sel)) {
                _yuitest_coverline("build/editor-base/editor-base.js", 413);
sel.pasteHTML('<var id="yui-ie-cursor">');
            }
        },
        /**
        * Moves the cached selection bookmark back so IE can place the cursor in the right place.
        * @method _onFrameActivate
        * @private
        */
        _onFrameActivate: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameActivate", 421);
_yuitest_coverline("build/editor-base/editor-base.js", 422);
if (e.frameTarget.test('html')) { //Means it came from a scrollbar
                _yuitest_coverline("build/editor-base/editor-base.js", 423);
return;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 425);
var inst = this.getInstance(),
                sel = new inst.EditorSelection(),
                range = sel.createRange(),
                cur = inst.all('#yui-ie-cursor');

            _yuitest_coverline("build/editor-base/editor-base.js", 430);
if (cur.size()) {
                _yuitest_coverline("build/editor-base/editor-base.js", 431);
cur.each(function(n) {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 5)", 431);
_yuitest_coverline("build/editor-base/editor-base.js", 432);
n.set('id', '');
                    _yuitest_coverline("build/editor-base/editor-base.js", 433);
if (range.moveToElementText) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 434);
try {
                            _yuitest_coverline("build/editor-base/editor-base.js", 435);
range.moveToElementText(n._node);
                            _yuitest_coverline("build/editor-base/editor-base.js", 436);
var moved = range.move('character', -1);
                            _yuitest_coverline("build/editor-base/editor-base.js", 437);
if (moved === -1) { //Only move up if we actually moved back.
                                _yuitest_coverline("build/editor-base/editor-base.js", 438);
range.move('character', 1);
                            }
                            _yuitest_coverline("build/editor-base/editor-base.js", 440);
range.select();
                            _yuitest_coverline("build/editor-base/editor-base.js", 441);
range.text = '';
                        } catch (e) {}
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 444);
n.remove();
                });
            }
        },
        /**
        * Fires nodeChange event
        * @method _onPaste
        * @private
        */
        _onPaste: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onPaste", 453);
_yuitest_coverline("build/editor-base/editor-base.js", 454);
this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'paste', changedEvent: e.frameEvent });
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseUp
        * @private
        */
        _onFrameMouseUp: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameMouseUp", 461);
_yuitest_coverline("build/editor-base/editor-base.js", 462);
this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mouseup', changedEvent: e.frameEvent  });
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseDown
        * @private
        */
        _onFrameMouseDown: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameMouseDown", 469);
_yuitest_coverline("build/editor-base/editor-base.js", 470);
this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mousedown', changedEvent: e.frameEvent  });
        },
        /**
        * Caches a copy of the selection for key events. Only creating the selection on keydown
        * @property _currentSelection
        * @private
        */
        _currentSelection: null,
        /**
        * Holds the timer for selection clearing
        * @property _currentSelectionTimer
        * @private
        */
        _currentSelectionTimer: null,
        /**
        * Flag to determine if we can clear the selection or not.
        * @property _currentSelectionClear
        * @private
        */
        _currentSelectionClear: null,
        /**
        * Fires nodeChange event
        * @method _onFrameKeyDown
        * @private
        */
        _onFrameKeyDown: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameKeyDown", 495);
_yuitest_coverline("build/editor-base/editor-base.js", 496);
var inst, sel;
            _yuitest_coverline("build/editor-base/editor-base.js", 497);
if (!this._currentSelection) {
                _yuitest_coverline("build/editor-base/editor-base.js", 498);
if (this._currentSelectionTimer) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 499);
this._currentSelectionTimer.cancel();
                }
                _yuitest_coverline("build/editor-base/editor-base.js", 501);
this._currentSelectionTimer = Y.later(850, this, function() {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "(anonymous 6)", 501);
_yuitest_coverline("build/editor-base/editor-base.js", 502);
this._currentSelectionClear = true;
                });

                _yuitest_coverline("build/editor-base/editor-base.js", 505);
inst = this.frame.getInstance();
                _yuitest_coverline("build/editor-base/editor-base.js", 506);
sel = new inst.EditorSelection(e);

                _yuitest_coverline("build/editor-base/editor-base.js", 508);
this._currentSelection = sel;
            } else {
                _yuitest_coverline("build/editor-base/editor-base.js", 510);
sel = this._currentSelection;
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 513);
inst = this.frame.getInstance();
            _yuitest_coverline("build/editor-base/editor-base.js", 514);
sel = new inst.EditorSelection();

            _yuitest_coverline("build/editor-base/editor-base.js", 516);
this._currentSelection = sel;

            _yuitest_coverline("build/editor-base/editor-base.js", 518);
if (sel && sel.anchorNode) {
                _yuitest_coverline("build/editor-base/editor-base.js", 519);
this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keydown', changedEvent: e.frameEvent });
                _yuitest_coverline("build/editor-base/editor-base.js", 520);
if (EditorBase.NC_KEYS[e.keyCode]) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 521);
this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode],
                        changedEvent: e.frameEvent
                    });
                    _yuitest_coverline("build/editor-base/editor-base.js", 526);
this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-down',
                        changedEvent: e.frameEvent
                    });
                }
            }
        },
        /**
        * Fires nodeChange event
        * @method _onFrameKeyPress
        * @private
        */
        _onFrameKeyPress: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameKeyPress", 539);
_yuitest_coverline("build/editor-base/editor-base.js", 540);
var sel = this._currentSelection;

            _yuitest_coverline("build/editor-base/editor-base.js", 542);
if (sel && sel.anchorNode) {
                _yuitest_coverline("build/editor-base/editor-base.js", 543);
this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keypress', changedEvent: e.frameEvent });
                _yuitest_coverline("build/editor-base/editor-base.js", 544);
if (EditorBase.NC_KEYS[e.keyCode]) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 545);
this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-press',
                        changedEvent: e.frameEvent
                    });
                }
            }
        },
        /**
        * Fires nodeChange event for keyup on specific keys
        * @method _onFrameKeyUp
        * @private
        */
        _onFrameKeyUp: function(e) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "_onFrameKeyUp", 558);
_yuitest_coverline("build/editor-base/editor-base.js", 559);
var inst = this.frame.getInstance(),
                sel = new inst.EditorSelection(e);

            _yuitest_coverline("build/editor-base/editor-base.js", 562);
if (sel && sel.anchorNode) {
                _yuitest_coverline("build/editor-base/editor-base.js", 563);
this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keyup', selection: sel, changedEvent: e.frameEvent  });
                _yuitest_coverline("build/editor-base/editor-base.js", 564);
if (EditorBase.NC_KEYS[e.keyCode]) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 565);
this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-up',
                        selection: sel,
                        changedEvent: e.frameEvent
                    });
                }
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 573);
if (this._currentSelectionClear) {
                _yuitest_coverline("build/editor-base/editor-base.js", 574);
this._currentSelectionClear = this._currentSelection = null;
            }
        },
        /**
        * Pass through to the frame.execCommand method
        * @method execCommand
        * @param {String} cmd The command to pass: inserthtml, insertimage, bold
        * @param {String} val The optional value of the command: Helvetica
        * @return {Node/NodeList} The Node or Nodelist affected by the command. Only returns on override commands, not browser defined commands.
        */
        execCommand: function(cmd, val) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "execCommand", 584);
_yuitest_coverline("build/editor-base/editor-base.js", 585);
var ret = this.frame.execCommand(cmd, val),
                inst = this.frame.getInstance(),
                sel = new inst.EditorSelection(), cmds = {},
                e = { changedNode: sel.anchorNode, changedType: 'execcommand', nodes: ret };

            _yuitest_coverline("build/editor-base/editor-base.js", 590);
switch (cmd) {
                case 'forecolor':
                    _yuitest_coverline("build/editor-base/editor-base.js", 592);
e.fontColor = val;
                    _yuitest_coverline("build/editor-base/editor-base.js", 593);
break;
                case 'backcolor':
                    _yuitest_coverline("build/editor-base/editor-base.js", 595);
e.backgroundColor = val;
                    _yuitest_coverline("build/editor-base/editor-base.js", 596);
break;
                case 'fontsize':
                    _yuitest_coverline("build/editor-base/editor-base.js", 598);
e.fontSize = val;
                    _yuitest_coverline("build/editor-base/editor-base.js", 599);
break;
                case 'fontname':
                    _yuitest_coverline("build/editor-base/editor-base.js", 601);
e.fontFamily = val;
                    _yuitest_coverline("build/editor-base/editor-base.js", 602);
break;
            }

            _yuitest_coverline("build/editor-base/editor-base.js", 605);
cmds[cmd] = 1;
            _yuitest_coverline("build/editor-base/editor-base.js", 606);
e.commands = cmds;

            _yuitest_coverline("build/editor-base/editor-base.js", 608);
this.fire('nodeChange', e);

            _yuitest_coverline("build/editor-base/editor-base.js", 610);
return ret;
        },
        /**
        * Get the YUI instance of the frame
        * @method getInstance
        * @return {YUI} The YUI instance bound to the frame.
        */
        getInstance: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "getInstance", 617);
_yuitest_coverline("build/editor-base/editor-base.js", 618);
return this.frame.getInstance();
        },
        /**
        * Renders the Y.Frame to the passed node.
        * @method render
        * @param {Selector/HTMLElement/Node} node The node to append the Editor to
        * @return {EditorBase}
        * @chainable
        */
        render: function(node) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "render", 627);
_yuitest_coverline("build/editor-base/editor-base.js", 628);
this.frame.set('content', this.get('content'));
            _yuitest_coverline("build/editor-base/editor-base.js", 629);
this.frame.render(node);
            _yuitest_coverline("build/editor-base/editor-base.js", 630);
return this;
        },
        /**
        * Focus the contentWindow of the iframe
        * @method focus
        * @param {Function} fn Callback function to execute after focus happens
        * @return {EditorBase}
        * @chainable
        */
        focus: function(fn) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "focus", 639);
_yuitest_coverline("build/editor-base/editor-base.js", 640);
this.frame.focus(fn);
            _yuitest_coverline("build/editor-base/editor-base.js", 641);
return this;
        },
        /**
        * Handles the showing of the Editor instance. Currently only handles the iframe
        * @method show
        * @return {EditorBase}
        * @chainable
        */
        show: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "show", 649);
_yuitest_coverline("build/editor-base/editor-base.js", 650);
this.frame.show();
            _yuitest_coverline("build/editor-base/editor-base.js", 651);
return this;
        },
        /**
        * Handles the hiding of the Editor instance. Currently only handles the iframe
        * @method hide
        * @return {EditorBase}
        * @chainable
        */
        hide: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "hide", 659);
_yuitest_coverline("build/editor-base/editor-base.js", 660);
this.frame.hide();
            _yuitest_coverline("build/editor-base/editor-base.js", 661);
return this;
        },
        /**
        * (Un)Filters the content of the Editor, cleaning YUI related code. //TODO better filtering
        * @method getContent
        * @return {String} The filtered content of the Editor
        */
        getContent: function() {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "getContent", 668);
_yuitest_coverline("build/editor-base/editor-base.js", 669);
var html = '', inst = this.getInstance();
            _yuitest_coverline("build/editor-base/editor-base.js", 670);
if (inst && inst.EditorSelection) {
                _yuitest_coverline("build/editor-base/editor-base.js", 671);
html = inst.EditorSelection.unfilter();
            }
            //Removing the _yuid from the objects in IE
            _yuitest_coverline("build/editor-base/editor-base.js", 674);
html = html.replace(/ _yuid="([^>]*)"/g, '');
            _yuitest_coverline("build/editor-base/editor-base.js", 675);
return html;
        }
    }, {
        /**
        * @static
        * @method NORMALIZE_FONTSIZE
        * @description Pulls the fontSize from a node, then checks for string values (x-large, x-small)
        * and converts them to pixel sizes. If the parsed size is different from the original, it calls
        * node.setStyle to update the node with a pixel size for normalization.
        */
        NORMALIZE_FONTSIZE: function(n) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "NORMALIZE_FONTSIZE", 685);
_yuitest_coverline("build/editor-base/editor-base.js", 686);
var size = n.getStyle('fontSize'), oSize = size;

            _yuitest_coverline("build/editor-base/editor-base.js", 688);
switch (size) {
                case '-webkit-xxx-large':
                    _yuitest_coverline("build/editor-base/editor-base.js", 690);
size = '48px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 691);
break;
                case 'xx-large':
                    _yuitest_coverline("build/editor-base/editor-base.js", 693);
size = '32px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 694);
break;
                case 'x-large':
                    _yuitest_coverline("build/editor-base/editor-base.js", 696);
size = '24px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 697);
break;
                case 'large':
                    _yuitest_coverline("build/editor-base/editor-base.js", 699);
size = '18px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 700);
break;
                case 'medium':
                    _yuitest_coverline("build/editor-base/editor-base.js", 702);
size = '16px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 703);
break;
                case 'small':
                    _yuitest_coverline("build/editor-base/editor-base.js", 705);
size = '13px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 706);
break;
                case 'x-small':
                    _yuitest_coverline("build/editor-base/editor-base.js", 708);
size = '10px';
                    _yuitest_coverline("build/editor-base/editor-base.js", 709);
break;
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 711);
if (oSize !== size) {
                _yuitest_coverline("build/editor-base/editor-base.js", 712);
n.setStyle('fontSize', size);
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 714);
return size;
        },
        /**
        * @static
        * @property TABKEY
        * @description The HTML markup to use for the tabkey
        */
        TABKEY: '<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
        /**
        * @static
        * @method FILTER_RGB
        * @param String css The CSS string containing rgb(#,#,#);
        * @description Converts an RGB color string to a hex color, example: rgb(0, 255, 0) converts to #00ff00
        * @return String
        */
        FILTER_RGB: function(css) {
            _yuitest_coverfunc("build/editor-base/editor-base.js", "FILTER_RGB", 729);
_yuitest_coverline("build/editor-base/editor-base.js", 730);
if (css.toLowerCase().indexOf('rgb') !== -1) {
                _yuitest_coverline("build/editor-base/editor-base.js", 731);
var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;

                _yuitest_coverline("build/editor-base/editor-base.js", 735);
if (rgb.length === 5) {
                    _yuitest_coverline("build/editor-base/editor-base.js", 736);
r = parseInt(rgb[1], 10).toString(16);
                    _yuitest_coverline("build/editor-base/editor-base.js", 737);
g = parseInt(rgb[2], 10).toString(16);
                    _yuitest_coverline("build/editor-base/editor-base.js", 738);
b = parseInt(rgb[3], 10).toString(16);

                    _yuitest_coverline("build/editor-base/editor-base.js", 740);
r = r.length === 1 ? '0' + r : r;
                    _yuitest_coverline("build/editor-base/editor-base.js", 741);
g = g.length === 1 ? '0' + g : g;
                    _yuitest_coverline("build/editor-base/editor-base.js", 742);
b = b.length === 1 ? '0' + b : b;

                    _yuitest_coverline("build/editor-base/editor-base.js", 744);
css = "#" + r + g + b;
                }
            }
            _yuitest_coverline("build/editor-base/editor-base.js", 747);
return css;
        },
        /**
        * @static
        * @property TAG2CMD
        * @description A hash table of tags to their execcomand's
        */
        TAG2CMD: {
            'b': 'bold',
            'strong': 'bold',
            'i': 'italic',
            'em': 'italic',
            'u': 'underline',
            'sup': 'superscript',
            'sub': 'subscript',
            'img': 'insertimage',
            'a' : 'createlink',
            'ul' : 'insertunorderedlist',
            'ol' : 'insertorderedlist'
        },
        /**
        * Hash table of keys to fire a nodeChange event for.
        * @static
        * @property NC_KEYS
        * @type Object
        */
        NC_KEYS: {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            46: 'delete'
        },
        /**
        * The default modules to use inside the Frame
        * @static
        * @property USE
        * @type Array
        */
        USE: ['substitute', 'node', 'selector-css3', 'editor-selection', 'stylesheet'],
        /**
        * The Class Name: editorBase
        * @static
        * @property NAME
        */
        NAME: 'editorBase',
        /**
        * Editor Strings.  By default contains only the `title` property for the
        * Title of frame document (default "Rich Text Editor").
        *
        * @static
        * @property STRINGS
        */
        STRINGS: {
            title: 'Rich Text Editor'
        },
        ATTRS: {
            /**
            * The content to load into the Editor Frame
            * @attribute content
            */
            content: {
                value: '<br class="yui-cursor">',
                setter: function(str) {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "setter", 818);
_yuitest_coverline("build/editor-base/editor-base.js", 819);
if (str.substr(0, 1) === "\n") {
                        _yuitest_coverline("build/editor-base/editor-base.js", 820);
str = str.substr(1);
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 822);
if (str === '') {
                        _yuitest_coverline("build/editor-base/editor-base.js", 823);
str = '<br class="yui-cursor">';
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 825);
if (str === ' ') {
                        _yuitest_coverline("build/editor-base/editor-base.js", 826);
if (Y.UA.gecko) {
                            _yuitest_coverline("build/editor-base/editor-base.js", 827);
str = '<br class="yui-cursor">';
                        }
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 830);
return this.frame.set('content', str);
                },
                getter: function() {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "getter", 832);
_yuitest_coverline("build/editor-base/editor-base.js", 833);
return this.frame.get('content');
                }
            },
            /**
            * The value of the dir attribute on the HTML element of the frame. Default: ltr
            * @attribute dir
            */
            dir: {
                writeOnce: true,
                value: 'ltr'
            },
            /**
            * @attribute linkedcss
            * @description An array of url's to external linked style sheets
            * @type String
            */
            linkedcss: {
                value: '',
                setter: function(css) {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "setter", 851);
_yuitest_coverline("build/editor-base/editor-base.js", 852);
if (this.frame) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 853);
this.frame.set('linkedcss', css);
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 855);
return css;
                }
            },
            /**
            * @attribute extracss
            * @description A string of CSS to add to the Head of the Editor
            * @type String
            */
            extracss: {
                value: false,
                setter: function(css) {
                    _yuitest_coverfunc("build/editor-base/editor-base.js", "setter", 865);
_yuitest_coverline("build/editor-base/editor-base.js", 866);
if (this.frame) {
                        _yuitest_coverline("build/editor-base/editor-base.js", 867);
this.frame.set('extracss', css);
                    }
                    _yuitest_coverline("build/editor-base/editor-base.js", 869);
return css;
                }
            },
            /**
            * @attribute defaultblock
            * @description The default tag to use for block level items, defaults to: p
            * @type String
            */
            defaultblock: {
                value: 'p'
            }
        }
    });

    _yuitest_coverline("build/editor-base/editor-base.js", 883);
Y.EditorBase = EditorBase;

    /**
    * @event nodeChange
    * @description Fired from several mouse/key/paste event points.
    * @param {Event.Facade} event An Event Facade object with the following specific properties added:
    * <dl>
    *   <dt>changedEvent</dt><dd>The event that caused the nodeChange</dd>
    *   <dt>changedNode</dt><dd>The node that was interacted with</dd>
    *   <dt>changedType</dt><dd>The type of change: mousedown, mouseup, right, left, backspace, tab, enter, etc..</dd>
    *   <dt>commands</dt><dd>The list of execCommands that belong to this change and the dompath that's associated with the changedNode</dd>
    *   <dt>classNames</dt><dd>An array of classNames that are applied to the changedNode and all of it's parents</dd>
    *   <dt>dompath</dt><dd>A sorted array of node instances that make up the DOM path from the changedNode to body.</dd>
    *   <dt>backgroundColor</dt><dd>The cascaded backgroundColor of the changedNode</dd>
    *   <dt>fontColor</dt><dd>The cascaded fontColor of the changedNode</dd>
    *   <dt>fontFamily</dt><dd>The cascaded fontFamily of the changedNode</dd>
    *   <dt>fontSize</dt><dd>The cascaded fontSize of the changedNode</dd>
    * </dl>
    * @type {Event.Custom}
    */

    /**
    * @event ready
    * @description Fired after the frame is ready.
    * @param {Event.Facade} event An Event Facade object.
    * @type {Event.Custom}
    */





}, '3.7.3', {"requires": ["base", "frame", "node", "exec-command", "editor-selection"]});
