/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('frame', function (Y, NAME) {

    /*jshint maxlen: 500 */
    /**
     * Creates a wrapper around an iframe. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @class Frame
     * @for Frame
     * @extends Base
     * @constructor
     * @module editor
     * @submodule frame
     */

    var Frame = function() {
        Frame.superclass.constructor.apply(this, arguments);
    };


    Y.extend(Frame, Y.Base, {
        /**
        * @private
        * @property _ready
        * @description Internal reference set when the content is ready.
        * @type Boolean
        */
        _ready: null,
        /**
        * @private
        * @property _rendered
        * @description Internal reference set when render is called.
        * @type Boolean
        */
        _rendered: null,
        /**
        * @private
        * @property _iframe
        * @description Internal Node reference to the iFrame or the window
        * @type Node
        */
        _iframe: null,
        /**
        * @private
        * @property _instance
        * @description Internal reference to the YUI instance bound to the iFrame or window
        * @type YUI
        */
        _instance: null,
        /**
        * @private
        * @method _create
        * @description Create the iframe or Window and get references to the Document & Window
        * @return {Object} Hash table containing references to the new Document & Window
        */
        _create: function(cb) {
            var res, html = '', timer,
                //if the src attr is different than the default, don't create the document
                create = (this.get('src') === Frame.ATTRS.src.value),
                extra_css = ((this.get('extracss')) ? '<style id="extra_css">' + this.get('extracss') + '</style>' : '');
            
            this._iframe = Y.one(Y.config.doc.createElement('iframe'));
            this._iframe.setAttrs(Frame.IFRAME_ATTRS);

            this._iframe.setStyle('visibility', 'hidden');
            this._iframe.set('src', this.get('src'));
            this.get('container').append(this._iframe);
            this._iframe.set('height', '99%');

            if (create) {
                html = Y.Lang.sub(Frame.PAGE_HTML, {
                    DIR: this.get('dir'),
                    LANG: this.get('lang'),
                    TITLE: this.get('title'),
                    META: Frame.META,
                    LINKED_CSS: this.get('linkedcss'),
                    CONTENT: this.get('content'),
                    BASE_HREF: this.get('basehref'),
                    DEFAULT_CSS: Frame.DEFAULT_CSS,
                    EXTRA_CSS: extra_css
                });
                if (Y.config.doc.compatMode !== 'BackCompat') {

                    //html = Frame.DOC_TYPE + "\n" + html;
                    html = Frame.getDocType() + "\n" + html;
                } else {
                }

            }

            res = this._resolveWinDoc();

            if (html) {
                res.doc.open();
                res.doc.write(html);
                res.doc.close();
            }

            if (!res.doc.documentElement) {
                timer = Y.later(1, this, function() {
                    if (res.doc && res.doc.documentElement) {
                        cb(res);
                        timer.cancel();
                    }
                }, null, true);
            } else {
                cb(res);
            }

        },
        /**
        * @private
        * @method _resolveWinDoc
        * @description Resolves the document and window from an iframe or window instance
        * @param {Object} c The YUI Config to add the window and document to
        * @return {Object} Object hash of window and document references, if a YUI config was passed, it is returned.
        */
        _resolveWinDoc: function(c) {
            var config = (c) ? c : {};
            config.win = Y.Node.getDOMNode(this._iframe.get('contentWindow'));
            config.doc = Y.Node.getDOMNode(this._iframe.get('contentWindow.document'));
            if (!config.doc) {
                config.doc = Y.config.doc;
            }
            if (!config.win) {
                config.win = Y.config.win;
            }
            return config;
        },
        /**
        * @private
        * @method _onDomEvent
        * @description Generic handler for all DOM events fired by the iframe or window. This handler
        * takes the current EventFacade and augments it to fire on the Frame host. It adds two new properties
        * to the EventFacade called frameX and frameY which adds the scroll and xy position of the iframe
        * to the original pageX and pageY of the event so external nodes can be positioned over the frame.
        * @param {Event.Facade} e
        */
        _onDomEvent: function(e) {
            var xy, node;

            if (!Y.Node.getDOMNode(this._iframe)) {
                //The iframe is null for some reason, bail on sending events.
                return;
            }

            e.frameX = e.frameY = 0;

            if (e.pageX > 0 || e.pageY > 0) {
                if (e.type.substring(0, 3) !== 'key') {
                    node = this._instance.one('win');
                    xy = this._iframe.getXY();
                    e.frameX = xy[0] + e.pageX - node.get('scrollLeft');
                    e.frameY = xy[1] + e.pageY - node.get('scrollTop');
                }
            }

            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;
            e.frameEvent = e;

            this.fire('dom:' + e.type, e);
        },
        initializer: function() {
            this.publish('ready', {
                emitFacade: true,
                defaultFn: this._defReadyFn
            });
        },
        destructor: function() {
            var inst = this.getInstance();

            inst.one('doc').detachAll();
            inst = null;
            this._iframe.remove();
        },
        /**
        * @private
        * @method _DOMPaste
        * @description Simple pass thru handler for the paste event so we can do content cleanup
        * @param {Event.Facade} e
        */
        _DOMPaste: function(e) {
            var inst = this.getInstance(),
                data = '', win = inst.config.win;

            if (e._event.originalTarget) {
                data = e._event.originalTarget;
            }
            if (e._event.clipboardData) {
                data = e._event.clipboardData.getData('Text');
            }

            if (win.clipboardData) {
                data = win.clipboardData.getData('Text');
                if (data === '') { // Could be empty, or failed
                    // Verify failure
                    if (!win.clipboardData.setData('Text', data)) {
                        data = null;
                    }
                }
            }


            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;
            e.frameEvent = e;

            if (data) {
                e.clipboardData = {
                    data: data,
                    getData: function() {
                        return data;
                    }
                };
            } else {
                e.clipboardData = null;
            }

            this.fire('dom:paste', e);
        },
        /**
        * @private
        * @method _defReadyFn
        * @description Binds DOM events, sets the iframe to visible and fires the ready event
        */
        _defReadyFn: function() {
            var inst = this.getInstance();

            Y.each(Frame.DOM_EVENTS, function(v, k) {
                var fn = Y.bind(this._onDomEvent, this),
                    kfn = ((Y.UA.ie && Frame.THROTTLE_TIME > 0) ? Y.throttle(fn, Frame.THROTTLE_TIME) : fn);

                if (!inst.Node.DOM_EVENTS[k]) {
                    inst.Node.DOM_EVENTS[k] = 1;
                }
                if (v === 1) {
                    if (k !== 'focus' && k !== 'blur' && k !== 'paste') {
                        if (k.substring(0, 3) === 'key') {
                            //Throttle key events in IE
                            inst.on(k, kfn, inst.config.doc);
                        } else {
                            inst.on(k, fn, inst.config.doc);
                        }
                    }
                }
            }, this);

            inst.Node.DOM_EVENTS.paste = 1;

            inst.on('paste', Y.bind(this._DOMPaste, this), inst.one('body'));

            //Adding focus/blur to the window object
            inst.on('focus', Y.bind(this._onDomEvent, this), inst.config.win);
            inst.on('blur', Y.bind(this._onDomEvent, this), inst.config.win);

            inst.__use = inst.use;
            inst.use = Y.bind(this.use, this);
            this._iframe.setStyles({
                visibility: 'inherit'
            });
            inst.one('body').setStyle('display', 'block');
        },
        /**
        * It appears that having a BR tag anywhere in the source "below" a table with a percentage width (in IE 7 & 8)
        * if there is any TEXTINPUT's outside the iframe, the cursor will rapidly flickr and the CPU would occasionally
        * spike. This method finds all <BR>'s below the sourceIndex of the first table. Does some checks to see if they
        * can be modified and replaces then with a <WBR> so the layout will remain in tact, but the flickering will
        * no longer happen.
        * @method _fixIECursors
        * @private
        */
        _fixIECursors: function() {
            var inst = this.getInstance(),
                tables = inst.all('table'),
                brs = inst.all('br'), si;

            if (tables.size() && brs.size()) {
                //First Table
                si = tables.item(0).get('sourceIndex');
                brs.each(function(n) {
                    var p = n.get('parentNode'),
                        c = p.get('children'), b = p.all('>br');

                    if (p.test('div')) {
                        if (c.size() > 2) {
                            n.replace(inst.Node.create('<wbr>'));
                        } else {
                            if (n.get('sourceIndex') > si) {
                                if (b.size()) {
                                    n.replace(inst.Node.create('<wbr>'));
                                }
                            } else {
                                if (b.size() > 1) {
                                    n.replace(inst.Node.create('<wbr>'));
                                }
                            }
                        }
                    }

                });
            }
        },
        /**
        * @private
        * @method _onContentReady
        * @description Called once the content is available in the frame/window and calls the final use call
        * on the internal instance so that the modules are loaded properly.
        */
        _onContentReady: function(e) {
            if (!this._ready) {
                this._ready = true;
                var inst = this.getInstance(),
                    args = Y.clone(this.get('use'));

                this.fire('contentready');

                if (e) {
                    inst.config.doc = Y.Node.getDOMNode(e.target);
                }
                //TODO Circle around and deal with CSS loading...
                args.push(Y.bind(function() {
                    if (inst.EditorSelection) {
                        inst.EditorSelection.DEFAULT_BLOCK_TAG = this.get('defaultblock');
                    }
                    //Moved to here so that the iframe is ready before allowing editing..
                    if (this.get('designMode')) {
                        if(Y.UA.ie) {
                            inst.config.doc.body.contentEditable = 'true';
                            this._ieSetBodyHeight();
                            inst.on('keyup', Y.bind(this._ieSetBodyHeight, this), inst.config.doc);
                        } else {
                            inst.config.doc.designMode = 'on';
                        }
                    }
                    this.fire('ready');
                }, this));
                inst.use.apply(inst, args);

                inst.one('doc').get('documentElement').addClass('yui-js-enabled');
            }
        },
        _ieHeightCounter: null,
        /**
        * Internal method to set the height of the body to the height of the document in IE.
        * With contenteditable being set, the document becomes unresponsive to clicks, this
        * method expands the body to be the height of the document so that doesn't happen.
        * @private
        * @method _ieSetBodyHeight
        */
        _ieSetBodyHeight: function(e) {
            if (!this._ieHeightCounter) {
                this._ieHeightCounter = 0;
            }
            this._ieHeightCounter++;
            var run = false, inst, h, bh;
            if (!e) {
                run = true;
            }
            if (e) {
                switch (e.keyCode) {
                    case 8:
                    case 13:
                        run = true;
                        break;
                }
                if (e.ctrlKey || e.shiftKey) {
                    run = true;
                }
            }
            if (run) {
                try {
                    inst = this.getInstance();
                    h = this._iframe.get('offsetHeight');
                    bh = inst.config.doc.body.scrollHeight;
                    if (h > bh) {
                        h = (h - 15) + 'px';
                        inst.config.doc.body.style.height = h;
                    } else {
                        inst.config.doc.body.style.height = 'auto';
                    }
                } catch (e) {
                    if (this._ieHeightCounter < 100) {
                        Y.later(200, this, this._ieSetBodyHeight);
                    } else {
                    }
                }
            }
        },
        /**
        * @private
        * @method _resolveBaseHref
        * @description Resolves the basehref of the page the frame is created on. Only applies to dynamic content.
        * @param {String} href The new value to use, if empty it will be resolved from the current url.
        * @return {String}
        */
        _resolveBaseHref: function(href) {
            if (!href || href === '') {
                href = Y.config.doc.location.href;
                if (href.indexOf('?') !== -1) { //Remove the query string
                    href = href.substring(0, href.indexOf('?'));
                }
                href = href.substring(0, href.lastIndexOf('/')) + '/';
            }
            return href;
        },
        /**
        * @private
        * @method _getHTML
        * @description Get the content from the iframe
        * @param {String} html The raw HTML from the body of the iframe.
        * @return {String}
        */
        _getHTML: function(html) {
            if (this._ready) {
                var inst = this.getInstance();
                html = inst.one('body').get('innerHTML');
            }
            return html;
        },
        /**
        * @private
        * @method _setHTML
        * @description Set the content of the iframe
        * @param {String} html The raw HTML to set the body of the iframe to.
        * @return {String}
        */
        _setHTML: function(html) {
            if (this._ready) {
                var inst = this.getInstance();
                inst.one('body').set('innerHTML', html);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.on('contentready', Y.bind(function(html) {
                    var inst = this.getInstance();
                    inst.one('body').set('innerHTML', html);
                }, this, html));
            }
            return html;
        },
        /**
        * @private
        * @method _setLinkedCSS
        * @description Set's the linked CSS on the instance..
        */
        _getLinkedCSS: function(urls) {
            if (!Y.Lang.isArray(urls)) {
                urls = [urls];
            }
            var str = '';
            if (!this._ready) {
                Y.each(urls, function(v) {
                    if (v !== '') {
                        str += '<link rel="stylesheet" href="' + v + '" type="text/css">';
                    }
                });
            } else {
                str = urls;
            }
            return str;
        },
        /**
        * @private
        * @method _setLinkedCSS
        * @description Set's the linked CSS on the instance..
        */
        _setLinkedCSS: function(css) {
            if (this._ready) {
                var inst = this.getInstance();
                inst.Get.css(css);
            }
            return css;
        },
        /**
        * @private
        * @method _setExtraCSS
        * @description Set's the extra CSS on the instance..
        */
        _setExtraCSS: function(css) {
            if (this._ready) {
                var inst = this.getInstance(),
                    node = inst.one('#extra_css');

                node.remove();
                inst.one('head').append('<style id="extra_css">' + css + '</style>');
            }
            return css;
        },
        /**
        * @private
        * @method _instanceLoaded
        * @description Called from the first YUI instance that sets up the internal instance.
        * This loads the content into the window/frame and attaches the contentready event.
        * @param {YUI} inst The internal YUI instance bound to the frame/window
        */
        _instanceLoaded: function(inst) {
            this._instance = inst;
            this._onContentReady();

            var doc = this._instance.config.doc;

            if (this.get('designMode')) {
                if (!Y.UA.ie) {
                    try {
                        //Force other browsers into non CSS styling
                        doc.execCommand('styleWithCSS', false, false);
                        doc.execCommand('insertbronreturn', false, false);
                    } catch (err) {}
                }
            }
        },
        //BEGIN PUBLIC METHODS
        /**
        * @method use
        * @description This is a scoped version of the normal YUI.use method & is bound to this frame/window.
        * At setup, the inst.use method is mapped to this method.
        */
        use: function() {
            var inst = this.getInstance(),
                args = Y.Array(arguments),
                cb = false;

            if (Y.Lang.isFunction(args[args.length - 1])) {
                cb = args.pop();
            }
            if (cb) {
                args.push(function() {
                    cb.apply(inst, arguments);

                });
            }
            inst.__use.apply(inst, args);
        },
        /**
        * @method delegate
        * @description A delegate method passed to the instance's delegate method
        * @param {String} type The type of event to listen for
        * @param {Function} fn The method to attach
        * @param {String} cont The container to act as a delegate, if no "sel" passed, the body is assumed as the container.
        * @param {String} sel The selector to match in the event (optional)
        * @return {EventHandle} The Event handle returned from Y.delegate
        */
        delegate: function(type, fn, cont, sel) {
            var inst = this.getInstance();
            if (!inst) {
                return false;
            }
            if (!sel) {
                sel = cont;
                cont = 'body';
            }
            return inst.delegate(type, fn, cont, sel);
        },
        /**
        * @method getInstance
        * @description Get a reference to the internal YUI instance.
        * @return {YUI} The internal YUI instance
        */
        getInstance: function() {
            return this._instance;
        },
        /**
        * @method render
        * @description Render the iframe into the container config option or open the window.
        * @param {String/HTMLElement/Node} node The node to render to
        * @return {Frame}
        * @chainable
        */
        render: function(node) {
            if (this._rendered) {
                return this;
            }
            this._rendered = true;
            if (node) {
                this.set('container', node);
            }

            this._create(Y.bind(function(res) {

                var inst, timer,
                    cb = Y.bind(function(i) {
                        this._instanceLoaded(i);
                    }, this),
                    args = Y.clone(this.get('use')),
                    config = {
                        debug: false,
                        win: res.win,
                        doc: res.doc
                    },
                    fn = Y.bind(function() {
                        config = this._resolveWinDoc(config);
                        inst = YUI(config);
                        inst.host = this.get('host'); //Cross reference to Editor

                        try {
                            inst.use('node-base', cb);
                            if (timer) {
                                clearInterval(timer);
                            }
                        } catch (e) {
                            timer = setInterval(function() {
                                fn();
                            }, 350);
                        }
                    }, this);

                args.push(fn);

                Y.use.apply(Y, args);

            }, this));

            return this;
        },
        /**
        * @private
        * @method _handleFocus
        * @description Does some tricks on focus to set the proper cursor position.
        */
        _handleFocus: function() {
            var inst = this.getInstance(),
                sel = new inst.EditorSelection(),
                n, c, b, par;

            if (sel.anchorNode) {
                n = sel.anchorNode;

                if (n.test('p') && n.get('innerHTML') === '') {
                    n = n.get('parentNode');
                }
                c = n.get('childNodes');

                if (c.size()) {
                    if (c.item(0).test('br')) {
                        sel.selectNode(n, true, false);
                    } else if (c.item(0).test('p')) {
                        n = c.item(0).one('br.yui-cursor');
                        if (n) {
                            n = n.get('parentNode');
                        }
                        if (!n) {
                            n = c.item(0).get('firstChild');
                        }
                        if (!n) {
                            n = c.item(0);
                        }
                        if (n) {
                            sel.selectNode(n, true, false);
                        }
                    } else {
                        b = inst.one('br.yui-cursor');
                        if (b) {
                            par = b.get('parentNode');
                            if (par) {
                                sel.selectNode(par, true, false);
                            }
                        }
                    }
                }
            }
        },
        /**
        * @method focus
        * @description Set the focus to the iframe
        * @param {Function} fn Callback function to execute after focus happens
        * @return {Frame}
        * @chainable
        */
        focus: function(fn) {
            if (Y.UA.ie && Y.UA.ie < 9) {
                try {
                    Y.one('win').focus();
                    if (this.getInstance()) {
                        if (this.getInstance().one('win')) {
                            this.getInstance().one('win').focus();
                        }
                    }
                } catch (ierr) {
                }
                if (fn === true) {
                    this._handleFocus();
                }
                if (Y.Lang.isFunction(fn)) {
                    fn();
                }
            } else {
                try {
                    Y.one('win').focus();
                    Y.later(100, this, function() {
                        if (this.getInstance()) {
                            if (this.getInstance().one('win')) {
                                this.getInstance().one('win').focus();
                            }
                        }
                        if (fn === true) {
                            this._handleFocus();
                        }
                        if (Y.Lang.isFunction(fn)) {
                            fn();
                        }
                    });
                } catch (ferr) {
                }
            }
            return this;
        },
        /**
        * @method show
        * @description Show the iframe instance
        * @return {Frame}
        * @chainable
        */
        show: function() {
            this._iframe.setStyles({
                position: 'static',
                left: ''
            });
            if (Y.UA.gecko) {
                try {
                    if (this.getInstance()) {
                        this.getInstance().config.doc.designMode = 'on';
                    }
                } catch (e) { }
                this.focus();
            }
            return this;
        },
        /**
        * @method hide
        * @description Hide the iframe instance
        * @return {Frame}
        * @chainable
        */
        hide: function() {
            this._iframe.setStyles({
                position: 'absolute',
                left: '-999999px'
            });
            return this;
        }
    }, {
        /**
        * @static
        * @property THROTTLE_TIME
        * @description The throttle time for key events in IE
        * @type Number
        * @default 100
        */
        THROTTLE_TIME: 100,
        /**
        * @static
        * @property DOM_EVENTS
        * @description The DomEvents that the frame automatically attaches and bubbles
        * @type Object
        */
        DOM_EVENTS: {
            dblclick: 1,
            click: 1,
            paste: 1,
            mouseup: 1,
            mousedown: 1,
            keyup: 1,
            keydown: 1,
            keypress: 1,
            activate: 1,
            deactivate: 1,
            beforedeactivate: 1,
            focusin: 1,
            focusout: 1
        },

        /**
        * @static
        * @property DEFAULT_CSS
        * @description The default css used when creating the document.
        * @type String
        */
        DEFAULT_CSS: 'body { background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; } a, a:visited, a:hover { color: blue !important; text-decoration: underline !important; cursor: text !important; } img { cursor: pointer !important; border: none; }',
        /**
        * The template string used to create the iframe, deprecated to use DOM instead of innerHTML
        * @static
        * @property HTML
        * @type String
        * @deprecated
        */
        //HTML: '<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="99%"></iframe>',
        /**
        * Attributes to auto add to the dynamic iframe under the hood
        * @static
        * @property IFRAME_ATTRS
        * @type Object
        */
        IFRAME_ATTRS: {
            border: '0',
            frameBorder: '0',
            marginWidth: '0',
            marginHeight: '0',
            leftMargin: '0',
            topMargin: '0',
            allowTransparency: 'true',
            width: "100%",
            height: "99%"
        },
        /**
        * @static
        * @property PAGE_HTML
        * @description The template used to create the page when created dynamically.
        * @type String
        */
        PAGE_HTML: '<html dir="{DIR}" lang="{LANG}"><head><title>{TITLE}</title>{META}<base href="{BASE_HREF}"/>{LINKED_CSS}<style id="editor_css">{DEFAULT_CSS}</style>{EXTRA_CSS}</head><body>{CONTENT}</body></html>',

        /**
        * @static
        * @method getDocType
        * @description Parses document.doctype and generates a DocType to match the parent page, if supported.
        * For IE8, it grabs document.all[0].nodeValue and uses that. For IE < 8, it falls back to Frame.DOC_TYPE.
        * @return {String} The normalized DocType to apply to the iframe
        */
        getDocType: function() {
            var dt = Y.config.doc.doctype,
                str = Frame.DOC_TYPE;

            if (dt) {
                str = '<!DOCTYPE ' + dt.name + ((dt.publicId) ? ' ' + dt.publicId : '') + ((dt.systemId) ? ' ' + dt.systemId : '') + '>';
            } else {
                if (Y.config.doc.all) {
                    dt = Y.config.doc.all[0];
                    if (dt.nodeType) {
                        if (dt.nodeType === 8) {
                            if (dt.nodeValue) {
                                if (dt.nodeValue.toLowerCase().indexOf('doctype') !== -1) {
                                    str = '<!' + dt.nodeValue + '>';
                                }
                            }
                        }
                    }
                }
            }
            return str;
        },
        /**
        * @static
        * @property DOC_TYPE
        * @description The DOCTYPE to prepend to the new document when created. Should match the one on the page being served.
        * @type String
        */
        DOC_TYPE: '<!DOCTYPE HTML PUBLIC "-/'+'/W3C/'+'/DTD HTML 4.01/'+'/EN" "http:/'+'/www.w3.org/TR/html4/strict.dtd">',
        /**
        * @static
        * @property META
        * @description The meta-tag for Content-Type to add to the dynamic document
        * @type String
        */
        META: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=7">',
        //META: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>',
        /**
        * @static
        * @property NAME
        * @description The name of the class (frame)
        * @type String
        */
        NAME: 'frame',
        ATTRS: {
            /**
            * @attribute title
            * @description The title to give the blank page.
            * @type String
            */
            title: {
                value: 'Blank Page'
            },
            /**
            * @attribute dir
            * @description The default text direction for this new frame. Default: ltr
            * @type String
            */
            dir: {
                value: 'ltr'
            },
            /**
            * @attribute lang
            * @description The default language. Default: en-US
            * @type String
            */
            lang: {
                value: 'en-US'
            },
            /**
            * @attribute src
            * @description The src of the iframe/window. Defaults to javascript:;
            * @type String
            */
            src: {
                //Hackish, IE needs the false in the Javascript URL
                value: 'javascript' + ((Y.UA.ie) ? ':false' : ':') + ';'
            },
            /**
            * @attribute designMode
            * @description Should designMode be turned on after creation.
            * @writeonce
            * @type Boolean
            */
            designMode: {
                writeOnce: true,
                value: false
            },
            /**
            * @attribute content
            * @description The string to inject into the body of the new frame/window.
            * @type String
            */
            content: {
                value: '<br>',
                setter: '_setHTML',
                getter: '_getHTML'
            },
            /**
            * @attribute basehref
            * @description The base href to use in the iframe.
            * @type String
            */
            basehref: {
                value: false,
                getter: '_resolveBaseHref'
            },
            /**
            * @attribute use
            * @description Array of modules to include in the scoped YUI instance at render time. Default: ['none', 'selector-css2']
            * @writeonce
            * @type Array
            */
            use: {
                writeOnce: true,
                value: ['node', 'node-style', 'selector-css3']
            },
            /**
            * @attribute container
            * @description The container to append the iFrame to on render.
            * @type String/HTMLElement/Node
            */
            container: {
                value: 'body',
                setter: function(n) {
                    return Y.one(n);
                }
            },
            /**
            * @attribute node
            * @description The Node instance of the iframe.
            * @type Node
            */
            node: {
                readOnly: true,
                value: null,
                getter: function() {
                    return this._iframe;
                }
            },
            /**
            * @attribute id
            * @description Set the id of the new Node. (optional)
            * @type String
            * @writeonce
            */
            id: {
                writeOnce: true,
                getter: function(id) {
                    if (!id) {
                        id = 'iframe-' + Y.guid();
                    }
                    return id;
                }
            },
            /**
            * @attribute linkedcss
            * @description An array of url's to external linked style sheets
            * @type String
            */
            linkedcss: {
                value: '',
                getter: '_getLinkedCSS',
                setter: '_setLinkedCSS'
            },
            /**
            * @attribute extracss
            * @description A string of CSS to add to the Head of the Editor
            * @type String
            */
            extracss: {
                value: '',
                setter: '_setExtraCSS'
            },
            /**
            * @attribute host
            * @description A reference to the Editor instance
            * @type Object
            */
            host: {
                value: false
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


    Y.Frame = Frame;



}, '3.7.3', {"requires": ["base", "node", "selector-css3", "yui-throttle"]});
