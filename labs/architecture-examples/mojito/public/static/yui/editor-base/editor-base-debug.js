/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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

    var EditorBase = function() {
        EditorBase.superclass.constructor.apply(this, arguments);
    }, LAST_CHILD = ':last-child', BODY = 'body';

    Y.extend(EditorBase, Y.Base, {
        /**
        * Internal reference to the Y.Frame instance
        * @property frame
        */
        frame: null,
        initializer: function() {
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


            frame.after('ready', Y.bind(this._afterFrameReady, this));
            frame.addTarget(this);

            this.frame = frame;

            this.publish('nodeChange', {
                emitFacade: true,
                bubbles: true,
                defaultFn: this._defNodeChangeFn
            });

            //this.plug(Y.Plugin.EditorPara);
        },
        destructor: function() {
            this.frame.destroy();

            this.detachAll();
        },
        /**
        * Copy certain styles from one node instance to another (used for new paragraph creation mainly)
        * @method copyStyles
        * @param {Node} from The Node instance to copy the styles from
        * @param {Node} to The Node instance to copy the styles to
        */
        copyStyles: function(from, to) {
            if (from.test('a')) {
                //Don't carry the A styles
                return;
            }
            var styles = ['color', 'fontSize', 'fontFamily', 'backgroundColor', 'fontStyle' ],
                newStyles = {};

            Y.each(styles, function(v) {
                newStyles[v] = from.getStyle(v);
            });
            if (from.ancestor('b,strong')) {
                newStyles.fontWeight = 'bold';
            }
            if (from.ancestor('u')) {
                if (!newStyles.textDecoration) {
                    newStyles.textDecoration = 'underline';
                }
            }
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
            var inst = this.getInstance(), lc, lc2, found, sel;
            if (n && n.test(BODY)) {
                sel = new inst.EditorSelection();
                if (sel && sel.anchorNode) {
                    n = sel.anchorNode;
                }
            }
            if (inst && n && n.test('html')) {
                lc = inst.one(BODY).one(LAST_CHILD);
                while (!found) {
                    if (lc) {
                        lc2 = lc.one(LAST_CHILD);
                        if (lc2) {
                            lc = lc2;
                        } else {
                            found = true;
                        }
                    } else {
                        found = true;
                    }
                }
                if (lc) {
                    if (lc.test('br')) {
                        if (lc.previous()) {
                            lc = lc.previous();
                        } else {
                            lc = lc.get('parentNode');
                        }
                    }
                    if (lc) {
                        n = lc;
                    }
                }
            }
            if (!n) {
                //Fallback to make sure a node is attached to the event
                n = inst.one(BODY);
            }
            return n;
        },
        /**
        * The default handler for the nodeChange event.
        * @method _defNodeChangeFn
        * @param {Event} e The event
        * @private
        */
        _defNodeChangeFn: function(e) {
            var startTime = (new Date()).getTime(),
                inst = this.getInstance(), sel,
                changed, endTime,
                cmds = {}, family, fsize, classes = [],
                fColor = '', bColor = '', bq,
                normal = false;

            if (Y.UA.ie) {
                try {
                    sel = inst.config.doc.selection.createRange();
                    if (sel.getBookmark) {
                        this._lastBookmark = sel.getBookmark();
                    }
                } catch (ie) {}
            }

            e.changedNode = this._resolveChangedNode(e.changedNode);


            /*
            * @TODO
            * This whole method needs to be fixed and made more dynamic.
            * Maybe static functions for the e.changeType and an object bag
            * to walk through and filter to pass off the event to before firing..
            */

            switch (e.changedType) {
                case 'tab':
                    if (!e.changedNode.test('li, li *') && !e.changedEvent.shiftKey) {
                        e.changedEvent.frameEvent.preventDefault();
                        Y.log('Overriding TAB key to insert HTML: HALTING', 'info', 'editor');
                        if (Y.UA.webkit) {
                            this.execCommand('inserttext', '\t');
                        } else if (Y.UA.gecko) {
                            this.frame.exec._command('inserthtml', EditorBase.TABKEY);
                        } else if (Y.UA.ie) {
                            this.execCommand('inserthtml', EditorBase.TABKEY);
                        }
                    }
                    break;
                case 'backspace-up':
                    // Fixes #2531090 - Joins text node strings so they become one for bidi
                    if (Y.UA.webkit && e.changedNode) {
                        e.changedNode.set('innerHTML', e.changedNode.get('innerHTML'));
                    }
                    break;
            }
            if (Y.UA.webkit && e.commands && (e.commands.indent || e.commands.outdent)) {
                /*
                * When executing execCommand 'indent or 'outdent' Webkit applies
                * a class to the BLOCKQUOTE that adds left/right margin to it
                * This strips that style so it is just a normal BLOCKQUOTE
                */
                bq = inst.all('.webkit-indent-blockquote, blockquote');
                if (bq.size()) {
                    bq.setStyle('margin', '');
                }
            }

            changed = this.getDomPath(e.changedNode, false);

            if (e.commands) {
                cmds = e.commands;
            }


            Y.each(changed, function(el) {
                var tag = el.tagName.toLowerCase(),
                    cmd = EditorBase.TAG2CMD[tag], s,
                    n, family2, cls, bColor2;

                if (cmd) {
                    cmds[cmd] = 1;
                }

                //Bold and Italic styles
                s = el.currentStyle || el.style;

                if ((''+s.fontWeight) === 'normal') {
                    normal = true;
                }
                if ((''+s.fontWeight) === 'bold') { //Cast this to a string
                    cmds.bold = 1;
                }
                if (Y.UA.ie) {
                    if (s.fontWeight > 400) {
                        cmds.bold = 1;
                    }
                }
                if (s.fontStyle === 'italic') {
                    cmds.italic = 1;
                }

                if (s.textDecoration.indexOf('underline') > -1) {
                    cmds.underline = 1;
                }
                if (s.textDecoration.indexOf('line-through') > -1) {
                    cmds.strikethrough = 1;
                }

                n = inst.one(el);
                if (n.getStyle('fontFamily')) {
                    family2 = n.getStyle('fontFamily').split(',')[0].toLowerCase();
                    if (family2) {
                        family = family2;
                    }
                    if (family) {
                        family = family.replace(/'/g, '').replace(/"/g, '');
                    }
                }

                fsize = EditorBase.NORMALIZE_FONTSIZE(n);


                cls = el.className.split(' ');
                Y.each(cls, function(v) {
                    if (v !== '' && (v.substr(0, 4) !== 'yui_')) {
                        classes.push(v);
                    }
                });

                fColor = EditorBase.FILTER_RGB(n.getStyle('color'));
                bColor2 = EditorBase.FILTER_RGB(s.backgroundColor);
                if (bColor2 !== 'transparent') {
                    if (bColor2 !== '') {
                        bColor = bColor2;
                    }
                }

            });

            if (normal) {
                delete cmds.bold;
                delete cmds.italic;
            }

            e.dompath = inst.all(changed);
            e.classNames = classes;
            e.commands = cmds;

            //TODO Dont' like this, not dynamic enough..
            if (!e.fontFamily) {
                e.fontFamily = family;
            }
            if (!e.fontSize) {
                e.fontSize = fsize;
            }
            if (!e.fontColor) {
                e.fontColor = fColor;
            }
            if (!e.backgroundColor) {
                e.backgroundColor = bColor;
            }

            endTime = (new Date()).getTime();
            Y.log('_defNodeChangeTimer 2: ' + (endTime - startTime) + 'ms', 'info', 'selection');
        },
        /**
        * Walk the dom tree from this node up to body, returning a reversed array of parents.
        * @method getDomPath
        * @param {Node} node The Node to start from
        */
        getDomPath: function(node, nodeList) {
            var domPath = [], domNode,
                inst = this.frame.getInstance();

            domNode = inst.Node.getDOMNode(node);
            //return inst.all(domNode);

            while (domNode !== null) {

                if ((domNode === inst.config.doc.documentElement) || (domNode === inst.config.doc) || !domNode.tagName) {
                    domNode = null;
                    break;
                }

                if (!inst.DOM.inDoc(domNode)) {
                    domNode = null;
                    break;
                }

                //Check to see if we get el.nodeName and nodeType
                if (domNode.nodeName && domNode.nodeType && (domNode.nodeType === 1)) {
                    domPath.push(domNode);
                }

                if (domNode === inst.config.doc.body) {
                    domNode = null;
                    break;
                }

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

            if (domPath.length === 0) {
                domPath[0] = inst.config.doc.body;
            }

            if (nodeList) {
                return inst.all(domPath.reverse());
            } else {
                return domPath.reverse();
            }

        },
        /**
        * After frame ready, bind mousedown & keyup listeners
        * @method _afterFrameReady
        * @private
        */
        _afterFrameReady: function() {
            var inst = this.frame.getInstance();

            this.frame.on('dom:mouseup', Y.bind(this._onFrameMouseUp, this));
            this.frame.on('dom:mousedown', Y.bind(this._onFrameMouseDown, this));
            this.frame.on('dom:keydown', Y.bind(this._onFrameKeyDown, this));

            if (Y.UA.ie) {
                this.frame.on('dom:activate', Y.bind(this._onFrameActivate, this));
                this.frame.on('dom:beforedeactivate', Y.bind(this._beforeFrameDeactivate, this));
            }
            this.frame.on('dom:keyup', Y.bind(this._onFrameKeyUp, this));
            this.frame.on('dom:keypress', Y.bind(this._onFrameKeyPress, this));
            this.frame.on('dom:paste', Y.bind(this._onPaste, this));

            inst.EditorSelection.filter();
            this.fire('ready');
        },
        /**
        * Caches the current cursor position in IE.
        * @method _beforeFrameDeactivate
        * @private
        */
        _beforeFrameDeactivate: function(e) {
            if (e.frameTarget.test('html')) { //Means it came from a scrollbar
                return;
            }
            var inst = this.getInstance(),
                sel = inst.config.doc.selection.createRange();

            if (sel.compareEndPoints && !sel.compareEndPoints('StartToEnd', sel)) {
                sel.pasteHTML('<var id="yui-ie-cursor">');
            }
        },
        /**
        * Moves the cached selection bookmark back so IE can place the cursor in the right place.
        * @method _onFrameActivate
        * @private
        */
        _onFrameActivate: function(e) {
            if (e.frameTarget.test('html')) { //Means it came from a scrollbar
                return;
            }
            var inst = this.getInstance(),
                sel = new inst.EditorSelection(),
                range = sel.createRange(),
                cur = inst.all('#yui-ie-cursor');

            if (cur.size()) {
                cur.each(function(n) {
                    n.set('id', '');
                    if (range.moveToElementText) {
                        try {
                            range.moveToElementText(n._node);
                            var moved = range.move('character', -1);
                            if (moved === -1) { //Only move up if we actually moved back.
                                range.move('character', 1);
                            }
                            range.select();
                            range.text = '';
                        } catch (e) {}
                    }
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
            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'paste', changedEvent: e.frameEvent });
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseUp
        * @private
        */
        _onFrameMouseUp: function(e) {
            this.fire('nodeChange', { changedNode: e.frameTarget, changedType: 'mouseup', changedEvent: e.frameEvent  });
        },
        /**
        * Fires nodeChange event
        * @method _onFrameMouseDown
        * @private
        */
        _onFrameMouseDown: function(e) {
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
            var inst, sel;
            if (!this._currentSelection) {
                if (this._currentSelectionTimer) {
                    this._currentSelectionTimer.cancel();
                }
                this._currentSelectionTimer = Y.later(850, this, function() {
                    this._currentSelectionClear = true;
                });

                inst = this.frame.getInstance();
                sel = new inst.EditorSelection(e);

                this._currentSelection = sel;
            } else {
                sel = this._currentSelection;
            }

            inst = this.frame.getInstance();
            sel = new inst.EditorSelection();

            this._currentSelection = sel;

            if (sel && sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keydown', changedEvent: e.frameEvent });
                if (EditorBase.NC_KEYS[e.keyCode]) {
                    this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode],
                        changedEvent: e.frameEvent
                    });
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
            var sel = this._currentSelection;

            if (sel && sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keypress', changedEvent: e.frameEvent });
                if (EditorBase.NC_KEYS[e.keyCode]) {
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
            var inst = this.frame.getInstance(),
                sel = new inst.EditorSelection(e);

            if (sel && sel.anchorNode) {
                this.fire('nodeChange', { changedNode: sel.anchorNode, changedType: 'keyup', selection: sel, changedEvent: e.frameEvent  });
                if (EditorBase.NC_KEYS[e.keyCode]) {
                    this.fire('nodeChange', {
                        changedNode: sel.anchorNode,
                        changedType: EditorBase.NC_KEYS[e.keyCode] + '-up',
                        selection: sel,
                        changedEvent: e.frameEvent
                    });
                }
            }
            if (this._currentSelectionClear) {
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
            var ret = this.frame.execCommand(cmd, val),
                inst = this.frame.getInstance(),
                sel = new inst.EditorSelection(), cmds = {},
                e = { changedNode: sel.anchorNode, changedType: 'execcommand', nodes: ret };

            switch (cmd) {
                case 'forecolor':
                    e.fontColor = val;
                    break;
                case 'backcolor':
                    e.backgroundColor = val;
                    break;
                case 'fontsize':
                    e.fontSize = val;
                    break;
                case 'fontname':
                    e.fontFamily = val;
                    break;
            }

            cmds[cmd] = 1;
            e.commands = cmds;

            this.fire('nodeChange', e);

            return ret;
        },
        /**
        * Get the YUI instance of the frame
        * @method getInstance
        * @return {YUI} The YUI instance bound to the frame.
        */
        getInstance: function() {
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
            this.frame.set('content', this.get('content'));
            this.frame.render(node);
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
            this.frame.focus(fn);
            return this;
        },
        /**
        * Handles the showing of the Editor instance. Currently only handles the iframe
        * @method show
        * @return {EditorBase}
        * @chainable
        */
        show: function() {
            this.frame.show();
            return this;
        },
        /**
        * Handles the hiding of the Editor instance. Currently only handles the iframe
        * @method hide
        * @return {EditorBase}
        * @chainable
        */
        hide: function() {
            this.frame.hide();
            return this;
        },
        /**
        * (Un)Filters the content of the Editor, cleaning YUI related code. //TODO better filtering
        * @method getContent
        * @return {String} The filtered content of the Editor
        */
        getContent: function() {
            var html = '', inst = this.getInstance();
            if (inst && inst.EditorSelection) {
                html = inst.EditorSelection.unfilter();
            }
            //Removing the _yuid from the objects in IE
            html = html.replace(/ _yuid="([^>]*)"/g, '');
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
            var size = n.getStyle('fontSize'), oSize = size;

            switch (size) {
                case '-webkit-xxx-large':
                    size = '48px';
                    break;
                case 'xx-large':
                    size = '32px';
                    break;
                case 'x-large':
                    size = '24px';
                    break;
                case 'large':
                    size = '18px';
                    break;
                case 'medium':
                    size = '16px';
                    break;
                case 'small':
                    size = '13px';
                    break;
                case 'x-small':
                    size = '10px';
                    break;
            }
            if (oSize !== size) {
                n.setStyle('fontSize', size);
            }
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
            if (css.toLowerCase().indexOf('rgb') !== -1) {
                var exp = new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)", "gi"),
                    rgb = css.replace(exp, "$1,$2,$3,$4,$5").split(','),
                    r, g, b;

                if (rgb.length === 5) {
                    r = parseInt(rgb[1], 10).toString(16);
                    g = parseInt(rgb[2], 10).toString(16);
                    b = parseInt(rgb[3], 10).toString(16);

                    r = r.length === 1 ? '0' + r : r;
                    g = g.length === 1 ? '0' + g : g;
                    b = b.length === 1 ? '0' + b : b;

                    css = "#" + r + g + b;
                }
            }
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
                    if (str.substr(0, 1) === "\n") {
                        Y.log('Stripping first carriage return from content before injecting', 'warn', 'editor');
                        str = str.substr(1);
                    }
                    if (str === '') {
                        str = '<br class="yui-cursor">';
                    }
                    if (str === ' ') {
                        if (Y.UA.gecko) {
                            str = '<br class="yui-cursor">';
                        }
                    }
                    return this.frame.set('content', str);
                },
                getter: function() {
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
                    if (this.frame) {
                        this.frame.set('linkedcss', css);
                    }
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
                    if (this.frame) {
                        this.frame.set('extracss', css);
                    }
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
