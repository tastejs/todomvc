/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('editor-selection', function (Y, NAME) {

    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @class EditorSelection
     * @constructor
     * @module editor
     * @submodule selection
     */

    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.
    var textContent = 'textContent',
    INNER_HTML = 'innerHTML',
    FONT_FAMILY = 'fontFamily';

    if (Y.UA.ie) {
        textContent = 'nodeValue';
    }

    Y.EditorSelection = function(domEvent) {
        var sel, par, ieNode, nodes, rng, i,
            comp, moved = 0, n, id;

        if (Y.config.win.getSelection && (!Y.UA.ie || Y.UA.ie < 9)) {
            sel = Y.config.win.getSelection();
        } else if (Y.config.doc.selection) {
            sel = Y.config.doc.selection.createRange();
        }
        this._selection = sel;

        if (!sel) {
            return false;
        }

        if (sel.pasteHTML) {
            this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;
            if (this.isCollapsed) {
                this.anchorNode = this.focusNode = Y.one(sel.parentElement());

                if (domEvent) {
                    ieNode = Y.config.doc.elementFromPoint(domEvent.clientX, domEvent.clientY);
                }
                rng = sel.duplicate();
                if (!ieNode) {
                    par = sel.parentElement();
                    nodes = par.childNodes;

                    for (i = 0; i < nodes.length; i++) {
                        //This causes IE to not allow a selection on a doubleclick
                        //rng.select(nodes[i]);
                        if (rng.inRange(sel)) {
                            if (!ieNode) {
                                ieNode = nodes[i];
                            }
                        }
                    }
                }

                this.ieNode = ieNode;

                if (ieNode) {
                    if (ieNode.nodeType !== 3) {
                        if (ieNode.firstChild) {
                            ieNode = ieNode.firstChild;
                        }
                        if (ieNode && ieNode.tagName && ieNode.tagName.toLowerCase() === 'body') {
                            if (ieNode.firstChild) {
                                ieNode = ieNode.firstChild;
                            }
                        }
                    }
                    this.anchorNode = this.focusNode = Y.EditorSelection.resolve(ieNode);

                    rng.moveToElementText(sel.parentElement());
                    comp = sel.compareEndPoints('StartToStart', rng);
                    if (comp) {
                        //We are not at the beginning of the selection.
                        //Setting the move to something large, may need to increase it later
                        moved = Math.abs(sel.move('character', -9999));
                    }

                    this.anchorOffset = this.focusOffset = moved;

                    this.anchorTextNode = this.focusTextNode = Y.one(ieNode);
                }


            } else {
                //This helps IE deal with a selection and nodeChange events
                if (sel.htmlText && sel.htmlText !== '') {
                    n = Y.Node.create(sel.htmlText);
                    if (n && n.get('id')) {
                        id = n.get('id');
                        this.anchorNode = this.focusNode = Y.one('#' + id);
                    } else if (n) {
                        n = n.get('childNodes');
                        this.anchorNode = this.focusNode = n.item(0);
                    }
                }
            }

            //var self = this;
            //debugger;
        } else {
            this.isCollapsed = sel.isCollapsed;
            this.anchorNode = Y.EditorSelection.resolve(sel.anchorNode);
            this.focusNode = Y.EditorSelection.resolve(sel.focusNode);
            this.anchorOffset = sel.anchorOffset;
            this.focusOffset = sel.focusOffset;

            this.anchorTextNode = Y.one(sel.anchorNode);
            this.focusTextNode = Y.one(sel.focusNode);
        }
        if (Y.Lang.isString(sel.text)) {
            this.text = sel.text;
        } else {
            if (sel.toString) {
                this.text = sel.toString();
            } else {
                this.text = '';
            }
        }
    };

    /**
    * Utility method to remove dead font-family styles from an element.
    * @static
    * @method removeFontFamily
    */
    Y.EditorSelection.removeFontFamily = function(n) {
        n.removeAttribute('face');
        var s = n.getAttribute('style').toLowerCase();
        if (s === '' || (s === 'font-family: ')) {
            n.removeAttribute('style');
        }
        if (s.match(Y.EditorSelection.REG_FONTFAMILY)) {
            s = s.replace(Y.EditorSelection.REG_FONTFAMILY, '');
            n.setAttribute('style', s);
        }
    };

    /**
    * Performs a prefilter on all nodes in the editor. Looks for nodes with a style: fontFamily or font face
    * It then creates a dynamic class assigns it and removed the property. This is so that we don't lose
    * the fontFamily when selecting nodes.
    * @static
    * @method filter
    */
    Y.EditorSelection.filter = function(blocks) {

        var startTime = (new Date()).getTime(),
            endTime,
            nodes = Y.all(Y.EditorSelection.ALL),
            baseNodes = Y.all('strong,em'),
            doc = Y.config.doc, hrs,
            classNames = {}, cssString = '',
            ls, startTime1 = (new Date()).getTime(),
            endTime1;

        nodes.each(function(n) {
            var raw = Y.Node.getDOMNode(n);
            if (raw.style[FONT_FAMILY]) {
                classNames['.' + n._yuid] = raw.style[FONT_FAMILY];
                n.addClass(n._yuid);

                Y.EditorSelection.removeFontFamily(raw);
            }
        });
        endTime1 = (new Date()).getTime();

        Y.all('.hr').addClass('yui-skip').addClass('yui-non');

        if (Y.UA.ie) {
            hrs = doc.getElementsByTagName('hr');
            Y.each(hrs, function(hr) {
                var el = doc.createElement('div'),
                s = el.style;

                el.className = 'hr yui-non yui-skip';

                el.setAttribute('readonly', true);
                el.setAttribute('contenteditable', false); //Keep it from being Edited
                if (hr.parentNode) {
                    hr.parentNode.replaceChild(el, hr);
                }
                //Had to move to inline style. writes for ie's < 8. They don't render el.setAttribute('style');
                s.border = '1px solid #ccc';
                s.lineHeight = '0';
                s.height = '0';
                s.fontSize = '0';
                s.marginTop = '5px';
                s.marginBottom = '5px';
                s.marginLeft = '0px';
                s.marginRight = '0px';
                s.padding = '0';
            });
        }


        Y.each(classNames, function(v, k) {
            cssString += k + ' { font-family: ' + v.replace(/"/gi, '') + '; }';
        });
        Y.StyleSheet(cssString, 'editor');


        //Not sure about this one?
        baseNodes.each(function(n, k) {
            var t = n.get('tagName').toLowerCase(),
                newTag = 'i';
            if (t === 'strong') {
                newTag = 'b';
            }
            Y.EditorSelection.prototype._swap(baseNodes.item(k), newTag);
        });

        //Filter out all the empty UL/OL's
        ls = Y.all('ol,ul');
        ls.each(function(v) {
            var lis = v.all('li');
            if (!lis.size()) {
                v.remove();
            }
        });

        if (blocks) {
            Y.EditorSelection.filterBlocks();
        }
        endTime = (new Date()).getTime();
    };

    /**
    * Method attempts to replace all "orphined" text nodes in the main body by wrapping them with a <p>. Called from filter.
    * @static
    * @method filterBlocks
    */
    Y.EditorSelection.filterBlocks = function() {
        var startTime = (new Date()).getTime(), endTime,
            childs = Y.config.doc.body.childNodes, i, node, wrapped = false, doit = true,
            sel, single, br, c, s, html;

        if (childs) {
            for (i = 0; i < childs.length; i++) {
                node = Y.one(childs[i]);
                if (!node.test(Y.EditorSelection.BLOCKS)) {
                    doit = true;
                    if (childs[i].nodeType === 3) {
                        c = childs[i][textContent].match(Y.EditorSelection.REG_CHAR);
                        s = childs[i][textContent].match(Y.EditorSelection.REG_NON);
                        if (c === null && s) {
                            doit = false;

                        }
                    }
                    if (doit) {
                        if (!wrapped) {
                            wrapped = [];
                        }
                        wrapped.push(childs[i]);
                    }
                } else {
                    wrapped = Y.EditorSelection._wrapBlock(wrapped);
                }
            }
            wrapped = Y.EditorSelection._wrapBlock(wrapped);
        }

        single = Y.all(Y.EditorSelection.DEFAULT_BLOCK_TAG);
        if (single.size() === 1) {
            br = single.item(0).all('br');
            if (br.size() === 1) {
                if (!br.item(0).test('.yui-cursor')) {
                    br.item(0).remove();
                }
                html = single.item(0).get('innerHTML');
                if (html === '' || html === ' ') {
                    single.set('innerHTML', Y.EditorSelection.CURSOR);
                    sel = new Y.EditorSelection();
                    sel.focusCursor(true, true);
                }
                if (br.item(0).test('.yui-cursor') && Y.UA.ie) {
                    br.item(0).remove();
                }
            }
        } else {
            single.each(function(p) {
                var html = p.get('innerHTML');
                if (html === '') {
                    p.remove();
                }
            });
        }

        endTime = (new Date()).getTime();
    };

    /**
    * Regular Expression used to find dead font-family styles
    * @static
    * @property REG_FONTFAMILY
    */
    Y.EditorSelection.REG_FONTFAMILY = /font-family:\s*;/;

    /**
    * Regular Expression to determine if a string has a character in it
    * @static
    * @property REG_CHAR
    */
    Y.EditorSelection.REG_CHAR = /[a-zA-Z-0-9_!@#\$%\^&*\(\)-=_+\[\]\\{}|;':",.\/<>\?]/gi;

    /**
    * Regular Expression to determine if a string has a non-character in it
    * @static
    * @property REG_NON
    */
    Y.EditorSelection.REG_NON = /[\s|\n|\t]/gi;

    /**
    * Regular Expression to remove all HTML from a string
    * @static
    * @property REG_NOHTML
    */
    Y.EditorSelection.REG_NOHTML = /<\S[^><]*>/g;


    /**
    * Wraps an array of elements in a Block level tag
    * @static
    * @private
    * @method _wrapBlock
    */
    Y.EditorSelection._wrapBlock = function(wrapped) {
        if (wrapped) {
            var newChild = Y.Node.create('<' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '></' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '>'),
                firstChild = Y.one(wrapped[0]), i;

            for (i = 1; i < wrapped.length; i++) {
                newChild.append(wrapped[i]);
            }
            firstChild.replace(newChild);
            newChild.prepend(firstChild);
        }
        return false;
    };

    /**
    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.
    * @static
    * @method unfilter
    * @return {String} The filtered HTML
    */
    Y.EditorSelection.unfilter = function() {
        var nodes = Y.all('body [class]'),
            html = '', nons, ids,
            body = Y.one('body');


        nodes.each(function(n) {
            if (n.hasClass(n._yuid)) {
                //One of ours
                n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));
                n.removeClass(n._yuid);
                if (n.getAttribute('class') === '') {
                    n.removeAttribute('class');
                }
            }
        });

        nons = Y.all('.yui-non');
        nons.each(function(n) {
            if (!n.hasClass('yui-skip') && n.get('innerHTML') === '') {
                n.remove();
            } else {
                n.removeClass('yui-non').removeClass('yui-skip');
            }
        });

        ids = Y.all('body [id]');
        ids.each(function(n) {
            if (n.get('id').indexOf('yui_3_') === 0) {
                n.removeAttribute('id');
                n.removeAttribute('_yuid');
            }
        });

        if (body) {
            html = body.get('innerHTML');
        }

        Y.all('.hr').addClass('yui-skip').addClass('yui-non');

        /*
        nodes.each(function(n) {
            n.addClass(n._yuid);
            n.setStyle(FONT_FAMILY, '');
            if (n.getAttribute('style') === '') {
                n.removeAttribute('style');
            }
        });
        */

        return html;
    };
    /**
    * Resolve a node from the selection object and return a Node instance
    * @static
    * @method resolve
    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.
    * @return {Node} The Resolved node
    */
    Y.EditorSelection.resolve = function(n) {
        if (n && n.nodeType === 3) {
            //Adding a try/catch here because in rare occasions IE will
            //Throw a error accessing the parentNode of a stranded text node.
            //In the case of Ctrl+Z (Undo)
            try {
                n = n.parentNode;
            } catch (re) {
                n = 'body';
            }
        }
        return Y.one(n);
    };

    /**
    * Returns the innerHTML of a node with all HTML tags removed.
    * @static
    * @method getText
    * @param {Node} node The Node instance to remove the HTML from
    * @return {String} The string of text
    */
    Y.EditorSelection.getText = function(node) {
        var txt = node.get('innerHTML').replace(Y.EditorSelection.REG_NOHTML, '');
        //Clean out the cursor subs to see if the Node is empty
        txt = txt.replace('<span><br></span>', '').replace('<br>', '');
        return txt;
    };

    //Y.EditorSelection.DEFAULT_BLOCK_TAG = 'div';
    Y.EditorSelection.DEFAULT_BLOCK_TAG = 'p';

    /**
    * The selector to use when looking for Nodes to cache the value of: [style],font[face]
    * @static
    * @property ALL
    */
    Y.EditorSelection.ALL = '[style],font[face]';

    /**
    * The selector to use when looking for block level items.
    * @static
    * @property BLOCKS
    */
    Y.EditorSelection.BLOCKS = 'p,div,ul,ol,table,style';
    /**
    * The temporary fontname applied to a selection to retrieve their values: yui-tmp
    * @static
    * @property TMP
    */
    Y.EditorSelection.TMP = 'yui-tmp';
    /**
    * The default tag to use when creating elements: span
    * @static
    * @property DEFAULT_TAG
    */
    Y.EditorSelection.DEFAULT_TAG = 'span';

    /**
    * The id of the outer cursor wrapper
    * @static
    * @property DEFAULT_TAG
    */
    Y.EditorSelection.CURID = 'yui-cursor';

    /**
    * The id used to wrap the inner space of the cursor position
    * @static
    * @property CUR_WRAPID
    */
    Y.EditorSelection.CUR_WRAPID = 'yui-cursor-wrapper';

    /**
    * The default HTML used to focus the cursor..
    * @static
    * @property CURSOR
    */
    Y.EditorSelection.CURSOR = '<span><br class="yui-cursor"></span>';

    Y.EditorSelection.hasCursor = function() {
        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);
        return cur.size();
    };

    /**
    * Called from Editor keydown to remove the "extra" space before the cursor.
    * @static
    * @method cleanCursor
    */
    Y.EditorSelection.cleanCursor = function() {
        var cur, sel = 'br.yui-cursor';
        cur = Y.all(sel);
        if (cur.size()) {
            cur.each(function(b) {
                var c = b.get('parentNode.parentNode.childNodes'), html;
                if (c.size()) {
                    b.remove();
                } else {
                    html = Y.EditorSelection.getText(c.item(0));
                    if (html !== '') {
                        b.remove();
                    }
                }
            });
        }
        /*
        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);
        if (cur.size()) {
            cur.each(function(c) {
                var html = c.get('innerHTML');
                if (html == '&nbsp;' || html == '<br>') {
                    if (c.previous() || c.next()) {
                        c.remove();
                    }
                }
            });
        }
        */
    };

    Y.EditorSelection.prototype = {
        /**
        * Range text value
        * @property text
        * @type String
        */
        text: null,
        /**
        * Flag to show if the range is collapsed or not
        * @property isCollapsed
        * @type Boolean
        */
        isCollapsed: null,
        /**
        * A Node instance of the parentNode of the anchorNode of the range
        * @property anchorNode
        * @type Node
        */
        anchorNode: null,
        /**
        * The offset from the range object
        * @property anchorOffset
        * @type Number
        */
        anchorOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property anchorTextNode
        * @type Node
        */
        anchorTextNode: null,
        /**
        * A Node instance of the parentNode of the focusNode of the range
        * @property focusNode
        * @type Node
        */
        focusNode: null,
        /**
        * The offset from the range object
        * @property focusOffset
        * @type Number
        */
        focusOffset: null,
        /**
        * A Node instance of the actual textNode of the range.
        * @property focusTextNode
        * @type Node
        */
        focusTextNode: null,
        /**
        * The actual Selection/Range object
        * @property _selection
        * @private
        */
        _selection: null,
        /**
        * Wrap an element, with another element
        * @private
        * @method _wrap
        * @param {HTMLElement} n The node to wrap
        * @param {String} tag The tag to use when creating the new element.
        * @return {HTMLElement} The wrapped node
        */
        _wrap: function(n, tag) {
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set(INNER_HTML, n.get(INNER_HTML));
            n.set(INNER_HTML, '');
            n.append(tmp);
            return Y.Node.getDOMNode(tmp);
        },
        /**
        * Swap an element, with another element
        * @private
        * @method _swap
        * @param {HTMLElement} n The node to swap
        * @param {String} tag The tag to use when creating the new element.
        * @return {HTMLElement} The new node
        */
        _swap: function(n, tag) {
            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            tmp.set(INNER_HTML, n.get(INNER_HTML));
            n.replace(tmp, n);
            return Y.Node.getDOMNode(tmp);
        },
        /**
        * Get all the nodes in the current selection. This method will actually perform a filter first.
        * Then it calls doc.execCommand('fontname', null, 'yui-tmp') to touch all nodes in the selection.
        * The it compiles a list of all nodes affected by the execCommand and builds a NodeList to return.
        * @method getSelected
        * @return {NodeList} A NodeList of all items in the selection.
        */
        getSelected: function() {
            Y.EditorSelection.filter();
            Y.config.doc.execCommand('fontname', null, Y.EditorSelection.TMP);
            var nodes = Y.all(Y.EditorSelection.ALL),
                items = [];

            nodes.each(function(n, k) {
                if (n.getStyle(FONT_FAMILY) === Y.EditorSelection.TMP) {
                    n.setStyle(FONT_FAMILY, '');
                    Y.EditorSelection.removeFontFamily(n);
                    if (!n.test('body')) {
                        items.push(Y.Node.getDOMNode(nodes.item(k)));
                    }
                }
            });
            return Y.all(items);
        },
        /**
        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.
        * @method insertContent
        * @param {String} html The HTML to insert.
        * @return {Node} The inserted Node.
        */
        insertContent: function(html) {
            return this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset, true);
        },
        /**
        * Insert HTML at the current cursor position, this method gives you control over the text node to insert into and the offset where to put it.
        * @method insertAtCursor
        * @param {String} html The HTML to insert.
        * @param {Node} node The text node to break when inserting.
        * @param {Number} offset The left offset of the text node to break and insert the new content.
        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false
        * @return {Node} The inserted Node.
        */
        insertAtCursor: function(html, node, offset, collapse) {
            var cur = Y.Node.create('<' + Y.EditorSelection.DEFAULT_TAG + ' class="yui-non"></' + Y.EditorSelection.DEFAULT_TAG + '>'),
                inHTML, txt, txt2, newNode, range = this.createRange(), b;

            if (node && node.test('body')) {
                b = Y.Node.create('<span></span>');
                node.append(b);
                node = b;
            }


            if (range.pasteHTML) {
                if (offset === 0 && node && !node.previous() && node.get('nodeType') === 3) {
                    /*
                    * For some strange reason, range.pasteHTML fails if the node is a textNode and
                    * the offset is 0. (The cursor is at the beginning of the line)
                    * It will always insert the new content at position 1 instead of
                    * position 0. Here we test for that case and do it the hard way.
                    */
                    node.insert(html, 'before');
                    if (range.moveToElementText) {
                        range.moveToElementText(Y.Node.getDOMNode(node.previous()));
                    }
                    //Move the cursor after the new node
                    range.collapse(false);
                    range.select();
                    return node.previous();
                } else {
                    newNode = Y.Node.create(html);
                    try {
                        range.pasteHTML('<span id="rte-insert"></span>');
                    } catch (e) {}
                    inHTML = Y.one('#rte-insert');
                    if (inHTML) {
                        inHTML.set('id', '');
                        inHTML.replace(newNode);
                        if (range.moveToElementText) {
                            range.moveToElementText(Y.Node.getDOMNode(newNode));
                        }
                        range.collapse(false);
                        range.select();
                        return newNode;
                    } else {
                        Y.on('available', function() {
                            inHTML.set('id', '');
                            inHTML.replace(newNode);
                            if (range.moveToElementText) {
                                range.moveToElementText(Y.Node.getDOMNode(newNode));
                            }
                            range.collapse(false);
                            range.select();
                        }, '#rte-insert');
                    }
                }
            } else {
                //TODO using Y.Node.create here throws warnings & strips first white space character
                //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));
                //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));
                if (offset > 0) {
                    inHTML = node.get(textContent);

                    txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));
                    txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));

                    node.replace(txt, node);
                    newNode = Y.Node.create(html);
                    if (newNode.get('nodeType') === 11) {
                        b = Y.Node.create('<span></span>');
                        b.append(newNode);
                        newNode = b;
                    }
                    txt.insert(newNode, 'after');
                    //if (txt2 && txt2.get('length')) {
                    if (txt2) {
                        newNode.insert(cur, 'after');
                        cur.insert(txt2, 'after');
                        this.selectNode(cur, collapse);
                    }
                } else {
                    if (node.get('nodeType') === 3) {
                        node = node.get('parentNode');
                    }
                    newNode = Y.Node.create(html);
                    html = node.get('innerHTML').replace(/\n/gi, '');
                    if (html === '' || html === '<br>') {
                        node.append(newNode);
                    } else {
                        if (newNode.get('parentNode')) {
                            node.insert(newNode, 'before');
                        } else {
                            Y.one('body').prepend(newNode);
                        }
                    }
                    if (node.get('firstChild').test('br')) {
                        node.get('firstChild').remove();
                    }
                }
            }
            return newNode;
        },
        /**
        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.
        * @method wrapContent
        * @param {String} tag The tag to wrap all selected items with.
        * @return {NodeList} A NodeList of all items in the selection.
        */
        wrapContent: function(tag) {
            tag = (tag) ? tag : Y.EditorSelection.DEFAULT_TAG;

            if (!this.isCollapsed) {
                var items = this.getSelected(),
                    changed = [], range, last, first, range2;

                items.each(function(n, k) {
                    var t = n.get('tagName').toLowerCase();
                    if (t === 'font') {
                        changed.push(this._swap(items.item(k), tag));
                    } else {
                        changed.push(this._wrap(items.item(k), tag));
                    }
                }, this);

                range = this.createRange();
                first = changed[0];
                last = changed[changed.length - 1];
                if (this._selection.removeAllRanges) {
                    range.setStart(changed[0], 0);
                    range.setEnd(last, last.childNodes.length);
                    this._selection.removeAllRanges();
                    this._selection.addRange(range);
                } else {
                    if (range.moveToElementText) {
                        range.moveToElementText(Y.Node.getDOMNode(first));
                        range2 = this.createRange();
                        range2.moveToElementText(Y.Node.getDOMNode(last));
                        range.setEndPoint('EndToEnd', range2);
                    }
                    range.select();
                }

                changed = Y.all(changed);
                return changed;


            } else {
                return Y.all([]);
            }
        },
        /**
        * Find and replace a string inside a text node and replace it with HTML focusing the node after
        * to allow you to continue to type.
        * @method replace
        * @param {String} se The string to search for.
        * @param {String} re The string of HTML to replace it with.
        * @return {Node} The node inserted.
        */
        replace: function(se,re) {
            var range = this.createRange(), node, txt, index, newNode;

            if (range.getBookmark) {
                index = range.getBookmark();
                txt = this.anchorNode.get('innerHTML').replace(se, re);
                this.anchorNode.set('innerHTML', txt);
                range.moveToBookmark(index);
                newNode = Y.one(range.parentElement());
            } else {
                node = this.anchorTextNode;
                txt = node.get(textContent);
                index = txt.indexOf(se);

                txt = txt.replace(se, '');
                node.set(textContent, txt);
                newNode = this.insertAtCursor(re, node, index, true);
            }
            return newNode;
        },
        /**
        * Destroy the range.
        * @method remove
        * @chainable
        * @return {EditorSelection}
        */
        remove: function() {
            if (this._selection && this._selection.removeAllRanges) {
                this._selection.removeAllRanges();
            }
            return this;
        },
        /**
        * Wrapper for the different range creation methods.
        * @method createRange
        * @return {RangeObject}
        */
        createRange: function() {
            if (Y.config.doc.selection) {
                return Y.config.doc.selection.createRange();
            } else {
                return Y.config.doc.createRange();
            }
        },
        /**
        * Select a Node (hilighting it).
        * @method selectNode
        * @param {Node} node The node to select
        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false
        * @chainable
        * @return {EditorSelection}
        */
        selectNode: function(node, collapse, end) {
            if (!node) {
                return;
            }
            end = end || 0;
            node = Y.Node.getDOMNode(node);
            var range = this.createRange();
            if (range.selectNode) {
                range.selectNode(node);
                this._selection.removeAllRanges();
                this._selection.addRange(range);
                if (collapse) {
                    try {
                        this._selection.collapse(node, end);
                    } catch (err) {
                        this._selection.collapse(node, 0);
                    }
                }
            } else {
                if (node.nodeType === 3) {
                    node = node.parentNode;
                }
                try {
                    range.moveToElementText(node);
                } catch(e) {}
                if (collapse) {
                    range.collapse(((end) ? false : true));
                }
                range.select();
            }
            return this;
        },
        /**
        * Put a placeholder in the DOM at the current cursor position.
        * @method setCursor
        * @return {Node}
        */
        setCursor: function() {
            this.removeCursor(false);
            return this.insertContent(Y.EditorSelection.CURSOR);
        },
        /**
        * Get the placeholder in the DOM at the current cursor position.
        * @method getCursor
        * @return {Node}
        */
        getCursor: function() {
            return Y.all('#' + Y.EditorSelection.CURID);
        },
        /**
        * Remove the cursor placeholder from the DOM.
        * @method removeCursor
        * @param {Boolean} keep Setting this to true will keep the node, but remove the unique parts that make it the cursor.
        * @return {Node}
        */
        removeCursor: function(keep) {
            var cur = this.getCursor();
            if (cur) {
                if (keep) {
                    cur.removeAttribute('id');
                    cur.set('innerHTML', '<br class="yui-cursor">');
                } else {
                    cur.remove();
                }
            }
            return cur;
        },
        /**
        * Gets a stored cursor and focuses it for editing, must be called sometime after setCursor
        * @method focusCursor
        * @return {Node}
        */
        focusCursor: function(collapse, end) {
            if (collapse !== false) {
                collapse = true;
            }
            if (end !== false) {
                end = true;
            }
            var cur = this.removeCursor(true);
            if (cur) {
                cur.each(function(c) {
                    this.selectNode(c, collapse, end);
                }, this);
            }
        },
        /**
        * Generic toString for logging.
        * @method toString
        * @return {String}
        */
        toString: function() {
            return 'EditorSelection Object';
        }
    };

    //TODO Remove this alias in 3.6.0
    Y.Selection = Y.EditorSelection;



}, '3.7.3', {"requires": ["node"]});
