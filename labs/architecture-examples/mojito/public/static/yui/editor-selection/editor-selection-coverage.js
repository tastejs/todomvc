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
_yuitest_coverage["build/editor-selection/editor-selection.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-selection/editor-selection.js",
    code: []
};
_yuitest_coverage["build/editor-selection/editor-selection.js"].code=["YUI.add('editor-selection', function (Y, NAME) {","","    /**","     * Wraps some common Selection/Range functionality into a simple object","     * @class EditorSelection","     * @constructor","     * @module editor","     * @submodule selection","     */","","    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.","    var textContent = 'textContent',","    INNER_HTML = 'innerHTML',","    FONT_FAMILY = 'fontFamily';","","    if (Y.UA.ie) {","        textContent = 'nodeValue';","    }","","    Y.EditorSelection = function(domEvent) {","        var sel, par, ieNode, nodes, rng, i,","            comp, moved = 0, n, id;","","        if (Y.config.win.getSelection && (!Y.UA.ie || Y.UA.ie < 9)) {","            sel = Y.config.win.getSelection();","        } else if (Y.config.doc.selection) {","            sel = Y.config.doc.selection.createRange();","        }","        this._selection = sel;","","        if (!sel) {","            return false;","        }","","        if (sel.pasteHTML) {","            this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;","            if (this.isCollapsed) {","                this.anchorNode = this.focusNode = Y.one(sel.parentElement());","","                if (domEvent) {","                    ieNode = Y.config.doc.elementFromPoint(domEvent.clientX, domEvent.clientY);","                }","                rng = sel.duplicate();","                if (!ieNode) {","                    par = sel.parentElement();","                    nodes = par.childNodes;","","                    for (i = 0; i < nodes.length; i++) {","                        //This causes IE to not allow a selection on a doubleclick","                        //rng.select(nodes[i]);","                        if (rng.inRange(sel)) {","                            if (!ieNode) {","                                ieNode = nodes[i];","                            }","                        }","                    }","                }","","                this.ieNode = ieNode;","","                if (ieNode) {","                    if (ieNode.nodeType !== 3) {","                        if (ieNode.firstChild) {","                            ieNode = ieNode.firstChild;","                        }","                        if (ieNode && ieNode.tagName && ieNode.tagName.toLowerCase() === 'body') {","                            if (ieNode.firstChild) {","                                ieNode = ieNode.firstChild;","                            }","                        }","                    }","                    this.anchorNode = this.focusNode = Y.EditorSelection.resolve(ieNode);","","                    rng.moveToElementText(sel.parentElement());","                    comp = sel.compareEndPoints('StartToStart', rng);","                    if (comp) {","                        //We are not at the beginning of the selection.","                        //Setting the move to something large, may need to increase it later","                        moved = Math.abs(sel.move('character', -9999));","                    }","","                    this.anchorOffset = this.focusOffset = moved;","","                    this.anchorTextNode = this.focusTextNode = Y.one(ieNode);","                }","","","            } else {","                //This helps IE deal with a selection and nodeChange events","                if (sel.htmlText && sel.htmlText !== '') {","                    n = Y.Node.create(sel.htmlText);","                    if (n && n.get('id')) {","                        id = n.get('id');","                        this.anchorNode = this.focusNode = Y.one('#' + id);","                    } else if (n) {","                        n = n.get('childNodes');","                        this.anchorNode = this.focusNode = n.item(0);","                    }","                }","            }","","            //var self = this;","            //debugger;","        } else {","            this.isCollapsed = sel.isCollapsed;","            this.anchorNode = Y.EditorSelection.resolve(sel.anchorNode);","            this.focusNode = Y.EditorSelection.resolve(sel.focusNode);","            this.anchorOffset = sel.anchorOffset;","            this.focusOffset = sel.focusOffset;","","            this.anchorTextNode = Y.one(sel.anchorNode);","            this.focusTextNode = Y.one(sel.focusNode);","        }","        if (Y.Lang.isString(sel.text)) {","            this.text = sel.text;","        } else {","            if (sel.toString) {","                this.text = sel.toString();","            } else {","                this.text = '';","            }","        }","    };","","    /**","    * Utility method to remove dead font-family styles from an element.","    * @static","    * @method removeFontFamily","    */","    Y.EditorSelection.removeFontFamily = function(n) {","        n.removeAttribute('face');","        var s = n.getAttribute('style').toLowerCase();","        if (s === '' || (s === 'font-family: ')) {","            n.removeAttribute('style');","        }","        if (s.match(Y.EditorSelection.REG_FONTFAMILY)) {","            s = s.replace(Y.EditorSelection.REG_FONTFAMILY, '');","            n.setAttribute('style', s);","        }","    };","","    /**","    * Performs a prefilter on all nodes in the editor. Looks for nodes with a style: fontFamily or font face","    * It then creates a dynamic class assigns it and removed the property. This is so that we don't lose","    * the fontFamily when selecting nodes.","    * @static","    * @method filter","    */","    Y.EditorSelection.filter = function(blocks) {","","        var startTime = (new Date()).getTime(),","            endTime,","            nodes = Y.all(Y.EditorSelection.ALL),","            baseNodes = Y.all('strong,em'),","            doc = Y.config.doc, hrs,","            classNames = {}, cssString = '',","            ls, startTime1 = (new Date()).getTime(),","            endTime1;","","        nodes.each(function(n) {","            var raw = Y.Node.getDOMNode(n);","            if (raw.style[FONT_FAMILY]) {","                classNames['.' + n._yuid] = raw.style[FONT_FAMILY];","                n.addClass(n._yuid);","","                Y.EditorSelection.removeFontFamily(raw);","            }","        });","        endTime1 = (new Date()).getTime();","","        Y.all('.hr').addClass('yui-skip').addClass('yui-non');","","        if (Y.UA.ie) {","            hrs = doc.getElementsByTagName('hr');","            Y.each(hrs, function(hr) {","                var el = doc.createElement('div'),","                s = el.style;","","                el.className = 'hr yui-non yui-skip';","","                el.setAttribute('readonly', true);","                el.setAttribute('contenteditable', false); //Keep it from being Edited","                if (hr.parentNode) {","                    hr.parentNode.replaceChild(el, hr);","                }","                //Had to move to inline style. writes for ie's < 8. They don't render el.setAttribute('style');","                s.border = '1px solid #ccc';","                s.lineHeight = '0';","                s.height = '0';","                s.fontSize = '0';","                s.marginTop = '5px';","                s.marginBottom = '5px';","                s.marginLeft = '0px';","                s.marginRight = '0px';","                s.padding = '0';","            });","        }","","","        Y.each(classNames, function(v, k) {","            cssString += k + ' { font-family: ' + v.replace(/\"/gi, '') + '; }';","        });","        Y.StyleSheet(cssString, 'editor');","","","        //Not sure about this one?","        baseNodes.each(function(n, k) {","            var t = n.get('tagName').toLowerCase(),","                newTag = 'i';","            if (t === 'strong') {","                newTag = 'b';","            }","            Y.EditorSelection.prototype._swap(baseNodes.item(k), newTag);","        });","","        //Filter out all the empty UL/OL's","        ls = Y.all('ol,ul');","        ls.each(function(v) {","            var lis = v.all('li');","            if (!lis.size()) {","                v.remove();","            }","        });","","        if (blocks) {","            Y.EditorSelection.filterBlocks();","        }","        endTime = (new Date()).getTime();","    };","","    /**","    * Method attempts to replace all \"orphined\" text nodes in the main body by wrapping them with a <p>. Called from filter.","    * @static","    * @method filterBlocks","    */","    Y.EditorSelection.filterBlocks = function() {","        var startTime = (new Date()).getTime(), endTime,","            childs = Y.config.doc.body.childNodes, i, node, wrapped = false, doit = true,","            sel, single, br, c, s, html;","","        if (childs) {","            for (i = 0; i < childs.length; i++) {","                node = Y.one(childs[i]);","                if (!node.test(Y.EditorSelection.BLOCKS)) {","                    doit = true;","                    if (childs[i].nodeType === 3) {","                        c = childs[i][textContent].match(Y.EditorSelection.REG_CHAR);","                        s = childs[i][textContent].match(Y.EditorSelection.REG_NON);","                        if (c === null && s) {","                            doit = false;","","                        }","                    }","                    if (doit) {","                        if (!wrapped) {","                            wrapped = [];","                        }","                        wrapped.push(childs[i]);","                    }","                } else {","                    wrapped = Y.EditorSelection._wrapBlock(wrapped);","                }","            }","            wrapped = Y.EditorSelection._wrapBlock(wrapped);","        }","","        single = Y.all(Y.EditorSelection.DEFAULT_BLOCK_TAG);","        if (single.size() === 1) {","            br = single.item(0).all('br');","            if (br.size() === 1) {","                if (!br.item(0).test('.yui-cursor')) {","                    br.item(0).remove();","                }","                html = single.item(0).get('innerHTML');","                if (html === '' || html === ' ') {","                    single.set('innerHTML', Y.EditorSelection.CURSOR);","                    sel = new Y.EditorSelection();","                    sel.focusCursor(true, true);","                }","                if (br.item(0).test('.yui-cursor') && Y.UA.ie) {","                    br.item(0).remove();","                }","            }","        } else {","            single.each(function(p) {","                var html = p.get('innerHTML');","                if (html === '') {","                    p.remove();","                }","            });","        }","","        endTime = (new Date()).getTime();","    };","","    /**","    * Regular Expression used to find dead font-family styles","    * @static","    * @property REG_FONTFAMILY","    */","    Y.EditorSelection.REG_FONTFAMILY = /font-family:\\s*;/;","","    /**","    * Regular Expression to determine if a string has a character in it","    * @static","    * @property REG_CHAR","    */","    Y.EditorSelection.REG_CHAR = /[a-zA-Z-0-9_!@#\\$%\\^&*\\(\\)-=_+\\[\\]\\\\{}|;':\",.\\/<>\\?]/gi;","","    /**","    * Regular Expression to determine if a string has a non-character in it","    * @static","    * @property REG_NON","    */","    Y.EditorSelection.REG_NON = /[\\s|\\n|\\t]/gi;","","    /**","    * Regular Expression to remove all HTML from a string","    * @static","    * @property REG_NOHTML","    */","    Y.EditorSelection.REG_NOHTML = /<\\S[^><]*>/g;","","","    /**","    * Wraps an array of elements in a Block level tag","    * @static","    * @private","    * @method _wrapBlock","    */","    Y.EditorSelection._wrapBlock = function(wrapped) {","        if (wrapped) {","            var newChild = Y.Node.create('<' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '></' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '>'),","                firstChild = Y.one(wrapped[0]), i;","","            for (i = 1; i < wrapped.length; i++) {","                newChild.append(wrapped[i]);","            }","            firstChild.replace(newChild);","            newChild.prepend(firstChild);","        }","        return false;","    };","","    /**","    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.","    * @static","    * @method unfilter","    * @return {String} The filtered HTML","    */","    Y.EditorSelection.unfilter = function() {","        var nodes = Y.all('body [class]'),","            html = '', nons, ids,","            body = Y.one('body');","","","        nodes.each(function(n) {","            if (n.hasClass(n._yuid)) {","                //One of ours","                n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));","                n.removeClass(n._yuid);","                if (n.getAttribute('class') === '') {","                    n.removeAttribute('class');","                }","            }","        });","","        nons = Y.all('.yui-non');","        nons.each(function(n) {","            if (!n.hasClass('yui-skip') && n.get('innerHTML') === '') {","                n.remove();","            } else {","                n.removeClass('yui-non').removeClass('yui-skip');","            }","        });","","        ids = Y.all('body [id]');","        ids.each(function(n) {","            if (n.get('id').indexOf('yui_3_') === 0) {","                n.removeAttribute('id');","                n.removeAttribute('_yuid');","            }","        });","","        if (body) {","            html = body.get('innerHTML');","        }","","        Y.all('.hr').addClass('yui-skip').addClass('yui-non');","","        /*","        nodes.each(function(n) {","            n.addClass(n._yuid);","            n.setStyle(FONT_FAMILY, '');","            if (n.getAttribute('style') === '') {","                n.removeAttribute('style');","            }","        });","        */","","        return html;","    };","    /**","    * Resolve a node from the selection object and return a Node instance","    * @static","    * @method resolve","    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.","    * @return {Node} The Resolved node","    */","    Y.EditorSelection.resolve = function(n) {","        if (n && n.nodeType === 3) {","            //Adding a try/catch here because in rare occasions IE will","            //Throw a error accessing the parentNode of a stranded text node.","            //In the case of Ctrl+Z (Undo)","            try {","                n = n.parentNode;","            } catch (re) {","                n = 'body';","            }","        }","        return Y.one(n);","    };","","    /**","    * Returns the innerHTML of a node with all HTML tags removed.","    * @static","    * @method getText","    * @param {Node} node The Node instance to remove the HTML from","    * @return {String} The string of text","    */","    Y.EditorSelection.getText = function(node) {","        var txt = node.get('innerHTML').replace(Y.EditorSelection.REG_NOHTML, '');","        //Clean out the cursor subs to see if the Node is empty","        txt = txt.replace('<span><br></span>', '').replace('<br>', '');","        return txt;","    };","","    //Y.EditorSelection.DEFAULT_BLOCK_TAG = 'div';","    Y.EditorSelection.DEFAULT_BLOCK_TAG = 'p';","","    /**","    * The selector to use when looking for Nodes to cache the value of: [style],font[face]","    * @static","    * @property ALL","    */","    Y.EditorSelection.ALL = '[style],font[face]';","","    /**","    * The selector to use when looking for block level items.","    * @static","    * @property BLOCKS","    */","    Y.EditorSelection.BLOCKS = 'p,div,ul,ol,table,style';","    /**","    * The temporary fontname applied to a selection to retrieve their values: yui-tmp","    * @static","    * @property TMP","    */","    Y.EditorSelection.TMP = 'yui-tmp';","    /**","    * The default tag to use when creating elements: span","    * @static","    * @property DEFAULT_TAG","    */","    Y.EditorSelection.DEFAULT_TAG = 'span';","","    /**","    * The id of the outer cursor wrapper","    * @static","    * @property DEFAULT_TAG","    */","    Y.EditorSelection.CURID = 'yui-cursor';","","    /**","    * The id used to wrap the inner space of the cursor position","    * @static","    * @property CUR_WRAPID","    */","    Y.EditorSelection.CUR_WRAPID = 'yui-cursor-wrapper';","","    /**","    * The default HTML used to focus the cursor..","    * @static","    * @property CURSOR","    */","    Y.EditorSelection.CURSOR = '<span><br class=\"yui-cursor\"></span>';","","    Y.EditorSelection.hasCursor = function() {","        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);","        return cur.size();","    };","","    /**","    * Called from Editor keydown to remove the \"extra\" space before the cursor.","    * @static","    * @method cleanCursor","    */","    Y.EditorSelection.cleanCursor = function() {","        var cur, sel = 'br.yui-cursor';","        cur = Y.all(sel);","        if (cur.size()) {","            cur.each(function(b) {","                var c = b.get('parentNode.parentNode.childNodes'), html;","                if (c.size()) {","                    b.remove();","                } else {","                    html = Y.EditorSelection.getText(c.item(0));","                    if (html !== '') {","                        b.remove();","                    }","                }","            });","        }","        /*","        var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);","        if (cur.size()) {","            cur.each(function(c) {","                var html = c.get('innerHTML');","                if (html == '&nbsp;' || html == '<br>') {","                    if (c.previous() || c.next()) {","                        c.remove();","                    }","                }","            });","        }","        */","    };","","    Y.EditorSelection.prototype = {","        /**","        * Range text value","        * @property text","        * @type String","        */","        text: null,","        /**","        * Flag to show if the range is collapsed or not","        * @property isCollapsed","        * @type Boolean","        */","        isCollapsed: null,","        /**","        * A Node instance of the parentNode of the anchorNode of the range","        * @property anchorNode","        * @type Node","        */","        anchorNode: null,","        /**","        * The offset from the range object","        * @property anchorOffset","        * @type Number","        */","        anchorOffset: null,","        /**","        * A Node instance of the actual textNode of the range.","        * @property anchorTextNode","        * @type Node","        */","        anchorTextNode: null,","        /**","        * A Node instance of the parentNode of the focusNode of the range","        * @property focusNode","        * @type Node","        */","        focusNode: null,","        /**","        * The offset from the range object","        * @property focusOffset","        * @type Number","        */","        focusOffset: null,","        /**","        * A Node instance of the actual textNode of the range.","        * @property focusTextNode","        * @type Node","        */","        focusTextNode: null,","        /**","        * The actual Selection/Range object","        * @property _selection","        * @private","        */","        _selection: null,","        /**","        * Wrap an element, with another element","        * @private","        * @method _wrap","        * @param {HTMLElement} n The node to wrap","        * @param {String} tag The tag to use when creating the new element.","        * @return {HTMLElement} The wrapped node","        */","        _wrap: function(n, tag) {","            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');","            tmp.set(INNER_HTML, n.get(INNER_HTML));","            n.set(INNER_HTML, '');","            n.append(tmp);","            return Y.Node.getDOMNode(tmp);","        },","        /**","        * Swap an element, with another element","        * @private","        * @method _swap","        * @param {HTMLElement} n The node to swap","        * @param {String} tag The tag to use when creating the new element.","        * @return {HTMLElement} The new node","        */","        _swap: function(n, tag) {","            var tmp = Y.Node.create('<' + tag + '></' + tag + '>');","            tmp.set(INNER_HTML, n.get(INNER_HTML));","            n.replace(tmp, n);","            return Y.Node.getDOMNode(tmp);","        },","        /**","        * Get all the nodes in the current selection. This method will actually perform a filter first.","        * Then it calls doc.execCommand('fontname', null, 'yui-tmp') to touch all nodes in the selection.","        * The it compiles a list of all nodes affected by the execCommand and builds a NodeList to return.","        * @method getSelected","        * @return {NodeList} A NodeList of all items in the selection.","        */","        getSelected: function() {","            Y.EditorSelection.filter();","            Y.config.doc.execCommand('fontname', null, Y.EditorSelection.TMP);","            var nodes = Y.all(Y.EditorSelection.ALL),","                items = [];","","            nodes.each(function(n, k) {","                if (n.getStyle(FONT_FAMILY) === Y.EditorSelection.TMP) {","                    n.setStyle(FONT_FAMILY, '');","                    Y.EditorSelection.removeFontFamily(n);","                    if (!n.test('body')) {","                        items.push(Y.Node.getDOMNode(nodes.item(k)));","                    }","                }","            });","            return Y.all(items);","        },","        /**","        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.","        * @method insertContent","        * @param {String} html The HTML to insert.","        * @return {Node} The inserted Node.","        */","        insertContent: function(html) {","            return this.insertAtCursor(html, this.anchorTextNode, this.anchorOffset, true);","        },","        /**","        * Insert HTML at the current cursor position, this method gives you control over the text node to insert into and the offset where to put it.","        * @method insertAtCursor","        * @param {String} html The HTML to insert.","        * @param {Node} node The text node to break when inserting.","        * @param {Number} offset The left offset of the text node to break and insert the new content.","        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false","        * @return {Node} The inserted Node.","        */","        insertAtCursor: function(html, node, offset, collapse) {","            var cur = Y.Node.create('<' + Y.EditorSelection.DEFAULT_TAG + ' class=\"yui-non\"></' + Y.EditorSelection.DEFAULT_TAG + '>'),","                inHTML, txt, txt2, newNode, range = this.createRange(), b;","","            if (node && node.test('body')) {","                b = Y.Node.create('<span></span>');","                node.append(b);","                node = b;","            }","","","            if (range.pasteHTML) {","                if (offset === 0 && node && !node.previous() && node.get('nodeType') === 3) {","                    /*","                    * For some strange reason, range.pasteHTML fails if the node is a textNode and","                    * the offset is 0. (The cursor is at the beginning of the line)","                    * It will always insert the new content at position 1 instead of","                    * position 0. Here we test for that case and do it the hard way.","                    */","                    node.insert(html, 'before');","                    if (range.moveToElementText) {","                        range.moveToElementText(Y.Node.getDOMNode(node.previous()));","                    }","                    //Move the cursor after the new node","                    range.collapse(false);","                    range.select();","                    return node.previous();","                } else {","                    newNode = Y.Node.create(html);","                    try {","                        range.pasteHTML('<span id=\"rte-insert\"></span>');","                    } catch (e) {}","                    inHTML = Y.one('#rte-insert');","                    if (inHTML) {","                        inHTML.set('id', '');","                        inHTML.replace(newNode);","                        if (range.moveToElementText) {","                            range.moveToElementText(Y.Node.getDOMNode(newNode));","                        }","                        range.collapse(false);","                        range.select();","                        return newNode;","                    } else {","                        Y.on('available', function() {","                            inHTML.set('id', '');","                            inHTML.replace(newNode);","                            if (range.moveToElementText) {","                                range.moveToElementText(Y.Node.getDOMNode(newNode));","                            }","                            range.collapse(false);","                            range.select();","                        }, '#rte-insert');","                    }","                }","            } else {","                //TODO using Y.Node.create here throws warnings & strips first white space character","                //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));","                //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));","                if (offset > 0) {","                    inHTML = node.get(textContent);","","                    txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));","                    txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));","","                    node.replace(txt, node);","                    newNode = Y.Node.create(html);","                    if (newNode.get('nodeType') === 11) {","                        b = Y.Node.create('<span></span>');","                        b.append(newNode);","                        newNode = b;","                    }","                    txt.insert(newNode, 'after');","                    //if (txt2 && txt2.get('length')) {","                    if (txt2) {","                        newNode.insert(cur, 'after');","                        cur.insert(txt2, 'after');","                        this.selectNode(cur, collapse);","                    }","                } else {","                    if (node.get('nodeType') === 3) {","                        node = node.get('parentNode');","                    }","                    newNode = Y.Node.create(html);","                    html = node.get('innerHTML').replace(/\\n/gi, '');","                    if (html === '' || html === '<br>') {","                        node.append(newNode);","                    } else {","                        if (newNode.get('parentNode')) {","                            node.insert(newNode, 'before');","                        } else {","                            Y.one('body').prepend(newNode);","                        }","                    }","                    if (node.get('firstChild').test('br')) {","                        node.get('firstChild').remove();","                    }","                }","            }","            return newNode;","        },","        /**","        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.","        * @method wrapContent","        * @param {String} tag The tag to wrap all selected items with.","        * @return {NodeList} A NodeList of all items in the selection.","        */","        wrapContent: function(tag) {","            tag = (tag) ? tag : Y.EditorSelection.DEFAULT_TAG;","","            if (!this.isCollapsed) {","                var items = this.getSelected(),","                    changed = [], range, last, first, range2;","","                items.each(function(n, k) {","                    var t = n.get('tagName').toLowerCase();","                    if (t === 'font') {","                        changed.push(this._swap(items.item(k), tag));","                    } else {","                        changed.push(this._wrap(items.item(k), tag));","                    }","                }, this);","","                range = this.createRange();","                first = changed[0];","                last = changed[changed.length - 1];","                if (this._selection.removeAllRanges) {","                    range.setStart(changed[0], 0);","                    range.setEnd(last, last.childNodes.length);","                    this._selection.removeAllRanges();","                    this._selection.addRange(range);","                } else {","                    if (range.moveToElementText) {","                        range.moveToElementText(Y.Node.getDOMNode(first));","                        range2 = this.createRange();","                        range2.moveToElementText(Y.Node.getDOMNode(last));","                        range.setEndPoint('EndToEnd', range2);","                    }","                    range.select();","                }","","                changed = Y.all(changed);","                return changed;","","","            } else {","                return Y.all([]);","            }","        },","        /**","        * Find and replace a string inside a text node and replace it with HTML focusing the node after","        * to allow you to continue to type.","        * @method replace","        * @param {String} se The string to search for.","        * @param {String} re The string of HTML to replace it with.","        * @return {Node} The node inserted.","        */","        replace: function(se,re) {","            var range = this.createRange(), node, txt, index, newNode;","","            if (range.getBookmark) {","                index = range.getBookmark();","                txt = this.anchorNode.get('innerHTML').replace(se, re);","                this.anchorNode.set('innerHTML', txt);","                range.moveToBookmark(index);","                newNode = Y.one(range.parentElement());","            } else {","                node = this.anchorTextNode;","                txt = node.get(textContent);","                index = txt.indexOf(se);","","                txt = txt.replace(se, '');","                node.set(textContent, txt);","                newNode = this.insertAtCursor(re, node, index, true);","            }","            return newNode;","        },","        /**","        * Destroy the range.","        * @method remove","        * @chainable","        * @return {EditorSelection}","        */","        remove: function() {","            if (this._selection && this._selection.removeAllRanges) {","                this._selection.removeAllRanges();","            }","            return this;","        },","        /**","        * Wrapper for the different range creation methods.","        * @method createRange","        * @return {RangeObject}","        */","        createRange: function() {","            if (Y.config.doc.selection) {","                return Y.config.doc.selection.createRange();","            } else {","                return Y.config.doc.createRange();","            }","        },","        /**","        * Select a Node (hilighting it).","        * @method selectNode","        * @param {Node} node The node to select","        * @param {Boolean} collapse Should the range be collapsed after insertion. default: false","        * @chainable","        * @return {EditorSelection}","        */","        selectNode: function(node, collapse, end) {","            if (!node) {","                return;","            }","            end = end || 0;","            node = Y.Node.getDOMNode(node);","            var range = this.createRange();","            if (range.selectNode) {","                range.selectNode(node);","                this._selection.removeAllRanges();","                this._selection.addRange(range);","                if (collapse) {","                    try {","                        this._selection.collapse(node, end);","                    } catch (err) {","                        this._selection.collapse(node, 0);","                    }","                }","            } else {","                if (node.nodeType === 3) {","                    node = node.parentNode;","                }","                try {","                    range.moveToElementText(node);","                } catch(e) {}","                if (collapse) {","                    range.collapse(((end) ? false : true));","                }","                range.select();","            }","            return this;","        },","        /**","        * Put a placeholder in the DOM at the current cursor position.","        * @method setCursor","        * @return {Node}","        */","        setCursor: function() {","            this.removeCursor(false);","            return this.insertContent(Y.EditorSelection.CURSOR);","        },","        /**","        * Get the placeholder in the DOM at the current cursor position.","        * @method getCursor","        * @return {Node}","        */","        getCursor: function() {","            return Y.all('#' + Y.EditorSelection.CURID);","        },","        /**","        * Remove the cursor placeholder from the DOM.","        * @method removeCursor","        * @param {Boolean} keep Setting this to true will keep the node, but remove the unique parts that make it the cursor.","        * @return {Node}","        */","        removeCursor: function(keep) {","            var cur = this.getCursor();","            if (cur) {","                if (keep) {","                    cur.removeAttribute('id');","                    cur.set('innerHTML', '<br class=\"yui-cursor\">');","                } else {","                    cur.remove();","                }","            }","            return cur;","        },","        /**","        * Gets a stored cursor and focuses it for editing, must be called sometime after setCursor","        * @method focusCursor","        * @return {Node}","        */","        focusCursor: function(collapse, end) {","            if (collapse !== false) {","                collapse = true;","            }","            if (end !== false) {","                end = true;","            }","            var cur = this.removeCursor(true);","            if (cur) {","                cur.each(function(c) {","                    this.selectNode(c, collapse, end);","                }, this);","            }","        },","        /**","        * Generic toString for logging.","        * @method toString","        * @return {String}","        */","        toString: function() {","            return 'EditorSelection Object';","        }","    };","","    //TODO Remove this alias in 3.6.0","    Y.Selection = Y.EditorSelection;","","","","}, '3.7.3', {\"requires\": [\"node\"]});"];
_yuitest_coverage["build/editor-selection/editor-selection.js"].lines = {"1":0,"12":0,"16":0,"17":0,"20":0,"21":0,"24":0,"25":0,"26":0,"27":0,"29":0,"31":0,"32":0,"35":0,"36":0,"37":0,"38":0,"40":0,"41":0,"43":0,"44":0,"45":0,"46":0,"48":0,"51":0,"52":0,"53":0,"59":0,"61":0,"62":0,"63":0,"64":0,"66":0,"67":0,"68":0,"72":0,"74":0,"75":0,"76":0,"79":0,"82":0,"84":0,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":0,"105":0,"106":0,"107":0,"108":0,"109":0,"111":0,"112":0,"114":0,"115":0,"117":0,"118":0,"120":0,"130":0,"131":0,"132":0,"133":0,"134":0,"136":0,"137":0,"138":0,"149":0,"151":0,"160":0,"161":0,"162":0,"163":0,"164":0,"166":0,"169":0,"171":0,"173":0,"174":0,"175":0,"176":0,"179":0,"181":0,"182":0,"183":0,"184":0,"187":0,"188":0,"189":0,"190":0,"191":0,"192":0,"193":0,"194":0,"195":0,"200":0,"201":0,"203":0,"207":0,"208":0,"210":0,"211":0,"213":0,"217":0,"218":0,"219":0,"220":0,"221":0,"225":0,"226":0,"228":0,"236":0,"237":0,"241":0,"242":0,"243":0,"244":0,"245":0,"246":0,"247":0,"248":0,"249":0,"250":0,"254":0,"255":0,"256":0,"258":0,"261":0,"264":0,"267":0,"268":0,"269":0,"270":0,"271":0,"272":0,"274":0,"275":0,"276":0,"277":0,"278":0,"280":0,"281":0,"285":0,"286":0,"287":0,"288":0,"293":0,"301":0,"308":0,"315":0,"322":0,"331":0,"332":0,"333":0,"336":0,"337":0,"339":0,"340":0,"342":0,"351":0,"352":0,"357":0,"358":0,"360":0,"361":0,"362":0,"363":0,"368":0,"369":0,"370":0,"371":0,"373":0,"377":0,"378":0,"379":0,"380":0,"381":0,"385":0,"386":0,"389":0,"401":0,"410":0,"411":0,"415":0,"416":0,"418":0,"421":0,"431":0,"432":0,"434":0,"435":0,"439":0,"446":0,"453":0,"459":0,"465":0,"472":0,"479":0,"486":0,"488":0,"489":0,"490":0,"498":0,"499":0,"500":0,"501":0,"502":0,"503":0,"504":0,"505":0,"507":0,"508":0,"509":0,"529":0,"593":0,"594":0,"595":0,"596":0,"597":0,"608":0,"609":0,"610":0,"611":0,"621":0,"622":0,"623":0,"626":0,"627":0,"628":0,"629":0,"630":0,"631":0,"635":0,"644":0,"656":0,"659":0,"660":0,"661":0,"662":0,"666":0,"667":0,"674":0,"675":0,"676":0,"679":0,"680":0,"681":0,"683":0,"684":0,"685":0,"687":0,"688":0,"689":0,"690":0,"691":0,"692":0,"694":0,"695":0,"696":0,"698":0,"699":0,"700":0,"701":0,"702":0,"704":0,"705":0,"713":0,"714":0,"716":0,"717":0,"719":0,"720":0,"721":0,"722":0,"723":0,"724":0,"726":0,"728":0,"729":0,"730":0,"731":0,"734":0,"735":0,"737":0,"738":0,"739":0,"740":0,"742":0,"743":0,"745":0,"748":0,"749":0,"753":0,"762":0,"764":0,"765":0,"768":0,"769":0,"770":0,"771":0,"773":0,"777":0,"778":0,"779":0,"780":0,"781":0,"782":0,"783":0,"784":0,"786":0,"787":0,"788":0,"789":0,"790":0,"792":0,"795":0,"796":0,"800":0,"812":0,"814":0,"815":0,"816":0,"817":0,"818":0,"819":0,"821":0,"822":0,"823":0,"825":0,"826":0,"827":0,"829":0,"838":0,"839":0,"841":0,"849":0,"850":0,"852":0,"864":0,"865":0,"867":0,"868":0,"869":0,"870":0,"871":0,"872":0,"873":0,"874":0,"875":0,"876":0,"878":0,"882":0,"883":0,"885":0,"886":0,"888":0,"889":0,"891":0,"893":0,"901":0,"902":0,"910":0,"919":0,"920":0,"921":0,"922":0,"923":0,"925":0,"928":0,"936":0,"937":0,"939":0,"940":0,"942":0,"943":0,"944":0,"945":0,"955":0,"960":0};
_yuitest_coverage["build/editor-selection/editor-selection.js"].functions = {"EditorSelection:20":0,"removeFontFamily:130":0,"(anonymous 2):160":0,"(anonymous 3):175":0,"(anonymous 4):200":0,"(anonymous 5):207":0,"(anonymous 6):218":0,"filter:149":0,"(anonymous 7):285":0,"filterBlocks:236":0,"_wrapBlock:331":0,"(anonymous 8):357":0,"(anonymous 9):369":0,"(anonymous 10):378":0,"unfilter:351":0,"resolve:410":0,"getText:431":0,"hasCursor:488":0,"(anonymous 11):502":0,"cleanCursor:498":0,"_wrap:592":0,"_swap:607":0,"(anonymous 12):626":0,"getSelected:620":0,"insertContent:643":0,"(anonymous 13):698":0,"insertAtCursor:655":0,"(anonymous 14):768":0,"wrapContent:761":0,"replace:811":0,"remove:837":0,"createRange:848":0,"selectNode:863":0,"setCursor:900":0,"getCursor:909":0,"removeCursor:918":0,"(anonymous 15):944":0,"focusCursor:935":0,"toString:954":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-selection/editor-selection.js"].coveredLines = 382;
_yuitest_coverage["build/editor-selection/editor-selection.js"].coveredFunctions = 40;
_yuitest_coverline("build/editor-selection/editor-selection.js", 1);
YUI.add('editor-selection', function (Y, NAME) {

    /**
     * Wraps some common Selection/Range functionality into a simple object
     * @class EditorSelection
     * @constructor
     * @module editor
     * @submodule selection
     */

    //TODO This shouldn't be there, Y.Node doesn't normalize getting textnode content.
    _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-selection/editor-selection.js", 12);
var textContent = 'textContent',
    INNER_HTML = 'innerHTML',
    FONT_FAMILY = 'fontFamily';

    _yuitest_coverline("build/editor-selection/editor-selection.js", 16);
if (Y.UA.ie) {
        _yuitest_coverline("build/editor-selection/editor-selection.js", 17);
textContent = 'nodeValue';
    }

    _yuitest_coverline("build/editor-selection/editor-selection.js", 20);
Y.EditorSelection = function(domEvent) {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "EditorSelection", 20);
_yuitest_coverline("build/editor-selection/editor-selection.js", 21);
var sel, par, ieNode, nodes, rng, i,
            comp, moved = 0, n, id;

        _yuitest_coverline("build/editor-selection/editor-selection.js", 24);
if (Y.config.win.getSelection && (!Y.UA.ie || Y.UA.ie < 9)) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 25);
sel = Y.config.win.getSelection();
        } else {_yuitest_coverline("build/editor-selection/editor-selection.js", 26);
if (Y.config.doc.selection) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 27);
sel = Y.config.doc.selection.createRange();
        }}
        _yuitest_coverline("build/editor-selection/editor-selection.js", 29);
this._selection = sel;

        _yuitest_coverline("build/editor-selection/editor-selection.js", 31);
if (!sel) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 32);
return false;
        }

        _yuitest_coverline("build/editor-selection/editor-selection.js", 35);
if (sel.pasteHTML) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 36);
this.isCollapsed = (sel.compareEndPoints('StartToEnd', sel)) ? false : true;
            _yuitest_coverline("build/editor-selection/editor-selection.js", 37);
if (this.isCollapsed) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 38);
this.anchorNode = this.focusNode = Y.one(sel.parentElement());

                _yuitest_coverline("build/editor-selection/editor-selection.js", 40);
if (domEvent) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 41);
ieNode = Y.config.doc.elementFromPoint(domEvent.clientX, domEvent.clientY);
                }
                _yuitest_coverline("build/editor-selection/editor-selection.js", 43);
rng = sel.duplicate();
                _yuitest_coverline("build/editor-selection/editor-selection.js", 44);
if (!ieNode) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 45);
par = sel.parentElement();
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 46);
nodes = par.childNodes;

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 48);
for (i = 0; i < nodes.length; i++) {
                        //This causes IE to not allow a selection on a doubleclick
                        //rng.select(nodes[i]);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 51);
if (rng.inRange(sel)) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 52);
if (!ieNode) {
                                _yuitest_coverline("build/editor-selection/editor-selection.js", 53);
ieNode = nodes[i];
                            }
                        }
                    }
                }

                _yuitest_coverline("build/editor-selection/editor-selection.js", 59);
this.ieNode = ieNode;

                _yuitest_coverline("build/editor-selection/editor-selection.js", 61);
if (ieNode) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 62);
if (ieNode.nodeType !== 3) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 63);
if (ieNode.firstChild) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 64);
ieNode = ieNode.firstChild;
                        }
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 66);
if (ieNode && ieNode.tagName && ieNode.tagName.toLowerCase() === 'body') {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 67);
if (ieNode.firstChild) {
                                _yuitest_coverline("build/editor-selection/editor-selection.js", 68);
ieNode = ieNode.firstChild;
                            }
                        }
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 72);
this.anchorNode = this.focusNode = Y.EditorSelection.resolve(ieNode);

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 74);
rng.moveToElementText(sel.parentElement());
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 75);
comp = sel.compareEndPoints('StartToStart', rng);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 76);
if (comp) {
                        //We are not at the beginning of the selection.
                        //Setting the move to something large, may need to increase it later
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 79);
moved = Math.abs(sel.move('character', -9999));
                    }

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 82);
this.anchorOffset = this.focusOffset = moved;

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 84);
this.anchorTextNode = this.focusTextNode = Y.one(ieNode);
                }


            } else {
                //This helps IE deal with a selection and nodeChange events
                _yuitest_coverline("build/editor-selection/editor-selection.js", 90);
if (sel.htmlText && sel.htmlText !== '') {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 91);
n = Y.Node.create(sel.htmlText);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 92);
if (n && n.get('id')) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 93);
id = n.get('id');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 94);
this.anchorNode = this.focusNode = Y.one('#' + id);
                    } else {_yuitest_coverline("build/editor-selection/editor-selection.js", 95);
if (n) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 96);
n = n.get('childNodes');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 97);
this.anchorNode = this.focusNode = n.item(0);
                    }}
                }
            }

            //var self = this;
            //debugger;
        } else {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 105);
this.isCollapsed = sel.isCollapsed;
            _yuitest_coverline("build/editor-selection/editor-selection.js", 106);
this.anchorNode = Y.EditorSelection.resolve(sel.anchorNode);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 107);
this.focusNode = Y.EditorSelection.resolve(sel.focusNode);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 108);
this.anchorOffset = sel.anchorOffset;
            _yuitest_coverline("build/editor-selection/editor-selection.js", 109);
this.focusOffset = sel.focusOffset;

            _yuitest_coverline("build/editor-selection/editor-selection.js", 111);
this.anchorTextNode = Y.one(sel.anchorNode);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 112);
this.focusTextNode = Y.one(sel.focusNode);
        }
        _yuitest_coverline("build/editor-selection/editor-selection.js", 114);
if (Y.Lang.isString(sel.text)) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 115);
this.text = sel.text;
        } else {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 117);
if (sel.toString) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 118);
this.text = sel.toString();
            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 120);
this.text = '';
            }
        }
    };

    /**
    * Utility method to remove dead font-family styles from an element.
    * @static
    * @method removeFontFamily
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 130);
Y.EditorSelection.removeFontFamily = function(n) {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "removeFontFamily", 130);
_yuitest_coverline("build/editor-selection/editor-selection.js", 131);
n.removeAttribute('face');
        _yuitest_coverline("build/editor-selection/editor-selection.js", 132);
var s = n.getAttribute('style').toLowerCase();
        _yuitest_coverline("build/editor-selection/editor-selection.js", 133);
if (s === '' || (s === 'font-family: ')) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 134);
n.removeAttribute('style');
        }
        _yuitest_coverline("build/editor-selection/editor-selection.js", 136);
if (s.match(Y.EditorSelection.REG_FONTFAMILY)) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 137);
s = s.replace(Y.EditorSelection.REG_FONTFAMILY, '');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 138);
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
    _yuitest_coverline("build/editor-selection/editor-selection.js", 149);
Y.EditorSelection.filter = function(blocks) {

        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "filter", 149);
_yuitest_coverline("build/editor-selection/editor-selection.js", 151);
var startTime = (new Date()).getTime(),
            endTime,
            nodes = Y.all(Y.EditorSelection.ALL),
            baseNodes = Y.all('strong,em'),
            doc = Y.config.doc, hrs,
            classNames = {}, cssString = '',
            ls, startTime1 = (new Date()).getTime(),
            endTime1;

        _yuitest_coverline("build/editor-selection/editor-selection.js", 160);
nodes.each(function(n) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 2)", 160);
_yuitest_coverline("build/editor-selection/editor-selection.js", 161);
var raw = Y.Node.getDOMNode(n);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 162);
if (raw.style[FONT_FAMILY]) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 163);
classNames['.' + n._yuid] = raw.style[FONT_FAMILY];
                _yuitest_coverline("build/editor-selection/editor-selection.js", 164);
n.addClass(n._yuid);

                _yuitest_coverline("build/editor-selection/editor-selection.js", 166);
Y.EditorSelection.removeFontFamily(raw);
            }
        });
        _yuitest_coverline("build/editor-selection/editor-selection.js", 169);
endTime1 = (new Date()).getTime();

        _yuitest_coverline("build/editor-selection/editor-selection.js", 171);
Y.all('.hr').addClass('yui-skip').addClass('yui-non');

        _yuitest_coverline("build/editor-selection/editor-selection.js", 173);
if (Y.UA.ie) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 174);
hrs = doc.getElementsByTagName('hr');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 175);
Y.each(hrs, function(hr) {
                _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 3)", 175);
_yuitest_coverline("build/editor-selection/editor-selection.js", 176);
var el = doc.createElement('div'),
                s = el.style;

                _yuitest_coverline("build/editor-selection/editor-selection.js", 179);
el.className = 'hr yui-non yui-skip';

                _yuitest_coverline("build/editor-selection/editor-selection.js", 181);
el.setAttribute('readonly', true);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 182);
el.setAttribute('contenteditable', false); //Keep it from being Edited
                _yuitest_coverline("build/editor-selection/editor-selection.js", 183);
if (hr.parentNode) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 184);
hr.parentNode.replaceChild(el, hr);
                }
                //Had to move to inline style. writes for ie's < 8. They don't render el.setAttribute('style');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 187);
s.border = '1px solid #ccc';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 188);
s.lineHeight = '0';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 189);
s.height = '0';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 190);
s.fontSize = '0';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 191);
s.marginTop = '5px';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 192);
s.marginBottom = '5px';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 193);
s.marginLeft = '0px';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 194);
s.marginRight = '0px';
                _yuitest_coverline("build/editor-selection/editor-selection.js", 195);
s.padding = '0';
            });
        }


        _yuitest_coverline("build/editor-selection/editor-selection.js", 200);
Y.each(classNames, function(v, k) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 4)", 200);
_yuitest_coverline("build/editor-selection/editor-selection.js", 201);
cssString += k + ' { font-family: ' + v.replace(/"/gi, '') + '; }';
        });
        _yuitest_coverline("build/editor-selection/editor-selection.js", 203);
Y.StyleSheet(cssString, 'editor');


        //Not sure about this one?
        _yuitest_coverline("build/editor-selection/editor-selection.js", 207);
baseNodes.each(function(n, k) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 5)", 207);
_yuitest_coverline("build/editor-selection/editor-selection.js", 208);
var t = n.get('tagName').toLowerCase(),
                newTag = 'i';
            _yuitest_coverline("build/editor-selection/editor-selection.js", 210);
if (t === 'strong') {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 211);
newTag = 'b';
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 213);
Y.EditorSelection.prototype._swap(baseNodes.item(k), newTag);
        });

        //Filter out all the empty UL/OL's
        _yuitest_coverline("build/editor-selection/editor-selection.js", 217);
ls = Y.all('ol,ul');
        _yuitest_coverline("build/editor-selection/editor-selection.js", 218);
ls.each(function(v) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 6)", 218);
_yuitest_coverline("build/editor-selection/editor-selection.js", 219);
var lis = v.all('li');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 220);
if (!lis.size()) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 221);
v.remove();
            }
        });

        _yuitest_coverline("build/editor-selection/editor-selection.js", 225);
if (blocks) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 226);
Y.EditorSelection.filterBlocks();
        }
        _yuitest_coverline("build/editor-selection/editor-selection.js", 228);
endTime = (new Date()).getTime();
    };

    /**
    * Method attempts to replace all "orphined" text nodes in the main body by wrapping them with a <p>. Called from filter.
    * @static
    * @method filterBlocks
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 236);
Y.EditorSelection.filterBlocks = function() {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "filterBlocks", 236);
_yuitest_coverline("build/editor-selection/editor-selection.js", 237);
var startTime = (new Date()).getTime(), endTime,
            childs = Y.config.doc.body.childNodes, i, node, wrapped = false, doit = true,
            sel, single, br, c, s, html;

        _yuitest_coverline("build/editor-selection/editor-selection.js", 241);
if (childs) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 242);
for (i = 0; i < childs.length; i++) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 243);
node = Y.one(childs[i]);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 244);
if (!node.test(Y.EditorSelection.BLOCKS)) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 245);
doit = true;
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 246);
if (childs[i].nodeType === 3) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 247);
c = childs[i][textContent].match(Y.EditorSelection.REG_CHAR);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 248);
s = childs[i][textContent].match(Y.EditorSelection.REG_NON);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 249);
if (c === null && s) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 250);
doit = false;

                        }
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 254);
if (doit) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 255);
if (!wrapped) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 256);
wrapped = [];
                        }
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 258);
wrapped.push(childs[i]);
                    }
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 261);
wrapped = Y.EditorSelection._wrapBlock(wrapped);
                }
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 264);
wrapped = Y.EditorSelection._wrapBlock(wrapped);
        }

        _yuitest_coverline("build/editor-selection/editor-selection.js", 267);
single = Y.all(Y.EditorSelection.DEFAULT_BLOCK_TAG);
        _yuitest_coverline("build/editor-selection/editor-selection.js", 268);
if (single.size() === 1) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 269);
br = single.item(0).all('br');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 270);
if (br.size() === 1) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 271);
if (!br.item(0).test('.yui-cursor')) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 272);
br.item(0).remove();
                }
                _yuitest_coverline("build/editor-selection/editor-selection.js", 274);
html = single.item(0).get('innerHTML');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 275);
if (html === '' || html === ' ') {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 276);
single.set('innerHTML', Y.EditorSelection.CURSOR);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 277);
sel = new Y.EditorSelection();
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 278);
sel.focusCursor(true, true);
                }
                _yuitest_coverline("build/editor-selection/editor-selection.js", 280);
if (br.item(0).test('.yui-cursor') && Y.UA.ie) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 281);
br.item(0).remove();
                }
            }
        } else {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 285);
single.each(function(p) {
                _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 7)", 285);
_yuitest_coverline("build/editor-selection/editor-selection.js", 286);
var html = p.get('innerHTML');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 287);
if (html === '') {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 288);
p.remove();
                }
            });
        }

        _yuitest_coverline("build/editor-selection/editor-selection.js", 293);
endTime = (new Date()).getTime();
    };

    /**
    * Regular Expression used to find dead font-family styles
    * @static
    * @property REG_FONTFAMILY
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 301);
Y.EditorSelection.REG_FONTFAMILY = /font-family:\s*;/;

    /**
    * Regular Expression to determine if a string has a character in it
    * @static
    * @property REG_CHAR
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 308);
Y.EditorSelection.REG_CHAR = /[a-zA-Z-0-9_!@#\$%\^&*\(\)-=_+\[\]\\{}|;':",.\/<>\?]/gi;

    /**
    * Regular Expression to determine if a string has a non-character in it
    * @static
    * @property REG_NON
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 315);
Y.EditorSelection.REG_NON = /[\s|\n|\t]/gi;

    /**
    * Regular Expression to remove all HTML from a string
    * @static
    * @property REG_NOHTML
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 322);
Y.EditorSelection.REG_NOHTML = /<\S[^><]*>/g;


    /**
    * Wraps an array of elements in a Block level tag
    * @static
    * @private
    * @method _wrapBlock
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 331);
Y.EditorSelection._wrapBlock = function(wrapped) {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "_wrapBlock", 331);
_yuitest_coverline("build/editor-selection/editor-selection.js", 332);
if (wrapped) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 333);
var newChild = Y.Node.create('<' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '></' + Y.EditorSelection.DEFAULT_BLOCK_TAG + '>'),
                firstChild = Y.one(wrapped[0]), i;

            _yuitest_coverline("build/editor-selection/editor-selection.js", 336);
for (i = 1; i < wrapped.length; i++) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 337);
newChild.append(wrapped[i]);
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 339);
firstChild.replace(newChild);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 340);
newChild.prepend(firstChild);
        }
        _yuitest_coverline("build/editor-selection/editor-selection.js", 342);
return false;
    };

    /**
    * Undoes what filter does enough to return the HTML from the Editor, then re-applies the filter.
    * @static
    * @method unfilter
    * @return {String} The filtered HTML
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 351);
Y.EditorSelection.unfilter = function() {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "unfilter", 351);
_yuitest_coverline("build/editor-selection/editor-selection.js", 352);
var nodes = Y.all('body [class]'),
            html = '', nons, ids,
            body = Y.one('body');


        _yuitest_coverline("build/editor-selection/editor-selection.js", 357);
nodes.each(function(n) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 8)", 357);
_yuitest_coverline("build/editor-selection/editor-selection.js", 358);
if (n.hasClass(n._yuid)) {
                //One of ours
                _yuitest_coverline("build/editor-selection/editor-selection.js", 360);
n.setStyle(FONT_FAMILY, n.getStyle(FONT_FAMILY));
                _yuitest_coverline("build/editor-selection/editor-selection.js", 361);
n.removeClass(n._yuid);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 362);
if (n.getAttribute('class') === '') {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 363);
n.removeAttribute('class');
                }
            }
        });

        _yuitest_coverline("build/editor-selection/editor-selection.js", 368);
nons = Y.all('.yui-non');
        _yuitest_coverline("build/editor-selection/editor-selection.js", 369);
nons.each(function(n) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 9)", 369);
_yuitest_coverline("build/editor-selection/editor-selection.js", 370);
if (!n.hasClass('yui-skip') && n.get('innerHTML') === '') {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 371);
n.remove();
            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 373);
n.removeClass('yui-non').removeClass('yui-skip');
            }
        });

        _yuitest_coverline("build/editor-selection/editor-selection.js", 377);
ids = Y.all('body [id]');
        _yuitest_coverline("build/editor-selection/editor-selection.js", 378);
ids.each(function(n) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 10)", 378);
_yuitest_coverline("build/editor-selection/editor-selection.js", 379);
if (n.get('id').indexOf('yui_3_') === 0) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 380);
n.removeAttribute('id');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 381);
n.removeAttribute('_yuid');
            }
        });

        _yuitest_coverline("build/editor-selection/editor-selection.js", 385);
if (body) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 386);
html = body.get('innerHTML');
        }

        _yuitest_coverline("build/editor-selection/editor-selection.js", 389);
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

        _yuitest_coverline("build/editor-selection/editor-selection.js", 401);
return html;
    };
    /**
    * Resolve a node from the selection object and return a Node instance
    * @static
    * @method resolve
    * @param {HTMLElement} n The HTMLElement to resolve. Might be a TextNode, gives parentNode.
    * @return {Node} The Resolved node
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 410);
Y.EditorSelection.resolve = function(n) {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "resolve", 410);
_yuitest_coverline("build/editor-selection/editor-selection.js", 411);
if (n && n.nodeType === 3) {
            //Adding a try/catch here because in rare occasions IE will
            //Throw a error accessing the parentNode of a stranded text node.
            //In the case of Ctrl+Z (Undo)
            _yuitest_coverline("build/editor-selection/editor-selection.js", 415);
try {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 416);
n = n.parentNode;
            } catch (re) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 418);
n = 'body';
            }
        }
        _yuitest_coverline("build/editor-selection/editor-selection.js", 421);
return Y.one(n);
    };

    /**
    * Returns the innerHTML of a node with all HTML tags removed.
    * @static
    * @method getText
    * @param {Node} node The Node instance to remove the HTML from
    * @return {String} The string of text
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 431);
Y.EditorSelection.getText = function(node) {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "getText", 431);
_yuitest_coverline("build/editor-selection/editor-selection.js", 432);
var txt = node.get('innerHTML').replace(Y.EditorSelection.REG_NOHTML, '');
        //Clean out the cursor subs to see if the Node is empty
        _yuitest_coverline("build/editor-selection/editor-selection.js", 434);
txt = txt.replace('<span><br></span>', '').replace('<br>', '');
        _yuitest_coverline("build/editor-selection/editor-selection.js", 435);
return txt;
    };

    //Y.EditorSelection.DEFAULT_BLOCK_TAG = 'div';
    _yuitest_coverline("build/editor-selection/editor-selection.js", 439);
Y.EditorSelection.DEFAULT_BLOCK_TAG = 'p';

    /**
    * The selector to use when looking for Nodes to cache the value of: [style],font[face]
    * @static
    * @property ALL
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 446);
Y.EditorSelection.ALL = '[style],font[face]';

    /**
    * The selector to use when looking for block level items.
    * @static
    * @property BLOCKS
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 453);
Y.EditorSelection.BLOCKS = 'p,div,ul,ol,table,style';
    /**
    * The temporary fontname applied to a selection to retrieve their values: yui-tmp
    * @static
    * @property TMP
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 459);
Y.EditorSelection.TMP = 'yui-tmp';
    /**
    * The default tag to use when creating elements: span
    * @static
    * @property DEFAULT_TAG
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 465);
Y.EditorSelection.DEFAULT_TAG = 'span';

    /**
    * The id of the outer cursor wrapper
    * @static
    * @property DEFAULT_TAG
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 472);
Y.EditorSelection.CURID = 'yui-cursor';

    /**
    * The id used to wrap the inner space of the cursor position
    * @static
    * @property CUR_WRAPID
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 479);
Y.EditorSelection.CUR_WRAPID = 'yui-cursor-wrapper';

    /**
    * The default HTML used to focus the cursor..
    * @static
    * @property CURSOR
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 486);
Y.EditorSelection.CURSOR = '<span><br class="yui-cursor"></span>';

    _yuitest_coverline("build/editor-selection/editor-selection.js", 488);
Y.EditorSelection.hasCursor = function() {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "hasCursor", 488);
_yuitest_coverline("build/editor-selection/editor-selection.js", 489);
var cur = Y.all('#' + Y.EditorSelection.CUR_WRAPID);
        _yuitest_coverline("build/editor-selection/editor-selection.js", 490);
return cur.size();
    };

    /**
    * Called from Editor keydown to remove the "extra" space before the cursor.
    * @static
    * @method cleanCursor
    */
    _yuitest_coverline("build/editor-selection/editor-selection.js", 498);
Y.EditorSelection.cleanCursor = function() {
        _yuitest_coverfunc("build/editor-selection/editor-selection.js", "cleanCursor", 498);
_yuitest_coverline("build/editor-selection/editor-selection.js", 499);
var cur, sel = 'br.yui-cursor';
        _yuitest_coverline("build/editor-selection/editor-selection.js", 500);
cur = Y.all(sel);
        _yuitest_coverline("build/editor-selection/editor-selection.js", 501);
if (cur.size()) {
            _yuitest_coverline("build/editor-selection/editor-selection.js", 502);
cur.each(function(b) {
                _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 11)", 502);
_yuitest_coverline("build/editor-selection/editor-selection.js", 503);
var c = b.get('parentNode.parentNode.childNodes'), html;
                _yuitest_coverline("build/editor-selection/editor-selection.js", 504);
if (c.size()) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 505);
b.remove();
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 507);
html = Y.EditorSelection.getText(c.item(0));
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 508);
if (html !== '') {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 509);
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

    _yuitest_coverline("build/editor-selection/editor-selection.js", 529);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "_wrap", 592);
_yuitest_coverline("build/editor-selection/editor-selection.js", 593);
var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 594);
tmp.set(INNER_HTML, n.get(INNER_HTML));
            _yuitest_coverline("build/editor-selection/editor-selection.js", 595);
n.set(INNER_HTML, '');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 596);
n.append(tmp);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 597);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "_swap", 607);
_yuitest_coverline("build/editor-selection/editor-selection.js", 608);
var tmp = Y.Node.create('<' + tag + '></' + tag + '>');
            _yuitest_coverline("build/editor-selection/editor-selection.js", 609);
tmp.set(INNER_HTML, n.get(INNER_HTML));
            _yuitest_coverline("build/editor-selection/editor-selection.js", 610);
n.replace(tmp, n);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 611);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "getSelected", 620);
_yuitest_coverline("build/editor-selection/editor-selection.js", 621);
Y.EditorSelection.filter();
            _yuitest_coverline("build/editor-selection/editor-selection.js", 622);
Y.config.doc.execCommand('fontname', null, Y.EditorSelection.TMP);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 623);
var nodes = Y.all(Y.EditorSelection.ALL),
                items = [];

            _yuitest_coverline("build/editor-selection/editor-selection.js", 626);
nodes.each(function(n, k) {
                _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 12)", 626);
_yuitest_coverline("build/editor-selection/editor-selection.js", 627);
if (n.getStyle(FONT_FAMILY) === Y.EditorSelection.TMP) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 628);
n.setStyle(FONT_FAMILY, '');
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 629);
Y.EditorSelection.removeFontFamily(n);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 630);
if (!n.test('body')) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 631);
items.push(Y.Node.getDOMNode(nodes.item(k)));
                    }
                }
            });
            _yuitest_coverline("build/editor-selection/editor-selection.js", 635);
return Y.all(items);
        },
        /**
        * Insert HTML at the current cursor position and return a Node instance of the newly inserted element.
        * @method insertContent
        * @param {String} html The HTML to insert.
        * @return {Node} The inserted Node.
        */
        insertContent: function(html) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "insertContent", 643);
_yuitest_coverline("build/editor-selection/editor-selection.js", 644);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "insertAtCursor", 655);
_yuitest_coverline("build/editor-selection/editor-selection.js", 656);
var cur = Y.Node.create('<' + Y.EditorSelection.DEFAULT_TAG + ' class="yui-non"></' + Y.EditorSelection.DEFAULT_TAG + '>'),
                inHTML, txt, txt2, newNode, range = this.createRange(), b;

            _yuitest_coverline("build/editor-selection/editor-selection.js", 659);
if (node && node.test('body')) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 660);
b = Y.Node.create('<span></span>');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 661);
node.append(b);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 662);
node = b;
            }


            _yuitest_coverline("build/editor-selection/editor-selection.js", 666);
if (range.pasteHTML) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 667);
if (offset === 0 && node && !node.previous() && node.get('nodeType') === 3) {
                    /*
                    * For some strange reason, range.pasteHTML fails if the node is a textNode and
                    * the offset is 0. (The cursor is at the beginning of the line)
                    * It will always insert the new content at position 1 instead of
                    * position 0. Here we test for that case and do it the hard way.
                    */
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 674);
node.insert(html, 'before');
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 675);
if (range.moveToElementText) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 676);
range.moveToElementText(Y.Node.getDOMNode(node.previous()));
                    }
                    //Move the cursor after the new node
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 679);
range.collapse(false);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 680);
range.select();
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 681);
return node.previous();
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 683);
newNode = Y.Node.create(html);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 684);
try {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 685);
range.pasteHTML('<span id="rte-insert"></span>');
                    } catch (e) {}
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 687);
inHTML = Y.one('#rte-insert');
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 688);
if (inHTML) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 689);
inHTML.set('id', '');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 690);
inHTML.replace(newNode);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 691);
if (range.moveToElementText) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 692);
range.moveToElementText(Y.Node.getDOMNode(newNode));
                        }
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 694);
range.collapse(false);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 695);
range.select();
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 696);
return newNode;
                    } else {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 698);
Y.on('available', function() {
                            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 13)", 698);
_yuitest_coverline("build/editor-selection/editor-selection.js", 699);
inHTML.set('id', '');
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 700);
inHTML.replace(newNode);
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 701);
if (range.moveToElementText) {
                                _yuitest_coverline("build/editor-selection/editor-selection.js", 702);
range.moveToElementText(Y.Node.getDOMNode(newNode));
                            }
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 704);
range.collapse(false);
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 705);
range.select();
                        }, '#rte-insert');
                    }
                }
            } else {
                //TODO using Y.Node.create here throws warnings & strips first white space character
                //txt = Y.one(Y.Node.create(inHTML.substr(0, offset)));
                //txt2 = Y.one(Y.Node.create(inHTML.substr(offset)));
                _yuitest_coverline("build/editor-selection/editor-selection.js", 713);
if (offset > 0) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 714);
inHTML = node.get(textContent);

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 716);
txt = Y.one(Y.config.doc.createTextNode(inHTML.substr(0, offset)));
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 717);
txt2 = Y.one(Y.config.doc.createTextNode(inHTML.substr(offset)));

                    _yuitest_coverline("build/editor-selection/editor-selection.js", 719);
node.replace(txt, node);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 720);
newNode = Y.Node.create(html);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 721);
if (newNode.get('nodeType') === 11) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 722);
b = Y.Node.create('<span></span>');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 723);
b.append(newNode);
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 724);
newNode = b;
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 726);
txt.insert(newNode, 'after');
                    //if (txt2 && txt2.get('length')) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 728);
if (txt2) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 729);
newNode.insert(cur, 'after');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 730);
cur.insert(txt2, 'after');
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 731);
this.selectNode(cur, collapse);
                    }
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 734);
if (node.get('nodeType') === 3) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 735);
node = node.get('parentNode');
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 737);
newNode = Y.Node.create(html);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 738);
html = node.get('innerHTML').replace(/\n/gi, '');
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 739);
if (html === '' || html === '<br>') {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 740);
node.append(newNode);
                    } else {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 742);
if (newNode.get('parentNode')) {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 743);
node.insert(newNode, 'before');
                        } else {
                            _yuitest_coverline("build/editor-selection/editor-selection.js", 745);
Y.one('body').prepend(newNode);
                        }
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 748);
if (node.get('firstChild').test('br')) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 749);
node.get('firstChild').remove();
                    }
                }
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 753);
return newNode;
        },
        /**
        * Get all elements inside a selection and wrap them with a new element and return a NodeList of all elements touched.
        * @method wrapContent
        * @param {String} tag The tag to wrap all selected items with.
        * @return {NodeList} A NodeList of all items in the selection.
        */
        wrapContent: function(tag) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "wrapContent", 761);
_yuitest_coverline("build/editor-selection/editor-selection.js", 762);
tag = (tag) ? tag : Y.EditorSelection.DEFAULT_TAG;

            _yuitest_coverline("build/editor-selection/editor-selection.js", 764);
if (!this.isCollapsed) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 765);
var items = this.getSelected(),
                    changed = [], range, last, first, range2;

                _yuitest_coverline("build/editor-selection/editor-selection.js", 768);
items.each(function(n, k) {
                    _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 14)", 768);
_yuitest_coverline("build/editor-selection/editor-selection.js", 769);
var t = n.get('tagName').toLowerCase();
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 770);
if (t === 'font') {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 771);
changed.push(this._swap(items.item(k), tag));
                    } else {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 773);
changed.push(this._wrap(items.item(k), tag));
                    }
                }, this);

                _yuitest_coverline("build/editor-selection/editor-selection.js", 777);
range = this.createRange();
                _yuitest_coverline("build/editor-selection/editor-selection.js", 778);
first = changed[0];
                _yuitest_coverline("build/editor-selection/editor-selection.js", 779);
last = changed[changed.length - 1];
                _yuitest_coverline("build/editor-selection/editor-selection.js", 780);
if (this._selection.removeAllRanges) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 781);
range.setStart(changed[0], 0);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 782);
range.setEnd(last, last.childNodes.length);
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 783);
this._selection.removeAllRanges();
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 784);
this._selection.addRange(range);
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 786);
if (range.moveToElementText) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 787);
range.moveToElementText(Y.Node.getDOMNode(first));
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 788);
range2 = this.createRange();
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 789);
range2.moveToElementText(Y.Node.getDOMNode(last));
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 790);
range.setEndPoint('EndToEnd', range2);
                    }
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 792);
range.select();
                }

                _yuitest_coverline("build/editor-selection/editor-selection.js", 795);
changed = Y.all(changed);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 796);
return changed;


            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 800);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "replace", 811);
_yuitest_coverline("build/editor-selection/editor-selection.js", 812);
var range = this.createRange(), node, txt, index, newNode;

            _yuitest_coverline("build/editor-selection/editor-selection.js", 814);
if (range.getBookmark) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 815);
index = range.getBookmark();
                _yuitest_coverline("build/editor-selection/editor-selection.js", 816);
txt = this.anchorNode.get('innerHTML').replace(se, re);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 817);
this.anchorNode.set('innerHTML', txt);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 818);
range.moveToBookmark(index);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 819);
newNode = Y.one(range.parentElement());
            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 821);
node = this.anchorTextNode;
                _yuitest_coverline("build/editor-selection/editor-selection.js", 822);
txt = node.get(textContent);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 823);
index = txt.indexOf(se);

                _yuitest_coverline("build/editor-selection/editor-selection.js", 825);
txt = txt.replace(se, '');
                _yuitest_coverline("build/editor-selection/editor-selection.js", 826);
node.set(textContent, txt);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 827);
newNode = this.insertAtCursor(re, node, index, true);
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 829);
return newNode;
        },
        /**
        * Destroy the range.
        * @method remove
        * @chainable
        * @return {EditorSelection}
        */
        remove: function() {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "remove", 837);
_yuitest_coverline("build/editor-selection/editor-selection.js", 838);
if (this._selection && this._selection.removeAllRanges) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 839);
this._selection.removeAllRanges();
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 841);
return this;
        },
        /**
        * Wrapper for the different range creation methods.
        * @method createRange
        * @return {RangeObject}
        */
        createRange: function() {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "createRange", 848);
_yuitest_coverline("build/editor-selection/editor-selection.js", 849);
if (Y.config.doc.selection) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 850);
return Y.config.doc.selection.createRange();
            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 852);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "selectNode", 863);
_yuitest_coverline("build/editor-selection/editor-selection.js", 864);
if (!node) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 865);
return;
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 867);
end = end || 0;
            _yuitest_coverline("build/editor-selection/editor-selection.js", 868);
node = Y.Node.getDOMNode(node);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 869);
var range = this.createRange();
            _yuitest_coverline("build/editor-selection/editor-selection.js", 870);
if (range.selectNode) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 871);
range.selectNode(node);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 872);
this._selection.removeAllRanges();
                _yuitest_coverline("build/editor-selection/editor-selection.js", 873);
this._selection.addRange(range);
                _yuitest_coverline("build/editor-selection/editor-selection.js", 874);
if (collapse) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 875);
try {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 876);
this._selection.collapse(node, end);
                    } catch (err) {
                        _yuitest_coverline("build/editor-selection/editor-selection.js", 878);
this._selection.collapse(node, 0);
                    }
                }
            } else {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 882);
if (node.nodeType === 3) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 883);
node = node.parentNode;
                }
                _yuitest_coverline("build/editor-selection/editor-selection.js", 885);
try {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 886);
range.moveToElementText(node);
                } catch(e) {}
                _yuitest_coverline("build/editor-selection/editor-selection.js", 888);
if (collapse) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 889);
range.collapse(((end) ? false : true));
                }
                _yuitest_coverline("build/editor-selection/editor-selection.js", 891);
range.select();
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 893);
return this;
        },
        /**
        * Put a placeholder in the DOM at the current cursor position.
        * @method setCursor
        * @return {Node}
        */
        setCursor: function() {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "setCursor", 900);
_yuitest_coverline("build/editor-selection/editor-selection.js", 901);
this.removeCursor(false);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 902);
return this.insertContent(Y.EditorSelection.CURSOR);
        },
        /**
        * Get the placeholder in the DOM at the current cursor position.
        * @method getCursor
        * @return {Node}
        */
        getCursor: function() {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "getCursor", 909);
_yuitest_coverline("build/editor-selection/editor-selection.js", 910);
return Y.all('#' + Y.EditorSelection.CURID);
        },
        /**
        * Remove the cursor placeholder from the DOM.
        * @method removeCursor
        * @param {Boolean} keep Setting this to true will keep the node, but remove the unique parts that make it the cursor.
        * @return {Node}
        */
        removeCursor: function(keep) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "removeCursor", 918);
_yuitest_coverline("build/editor-selection/editor-selection.js", 919);
var cur = this.getCursor();
            _yuitest_coverline("build/editor-selection/editor-selection.js", 920);
if (cur) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 921);
if (keep) {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 922);
cur.removeAttribute('id');
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 923);
cur.set('innerHTML', '<br class="yui-cursor">');
                } else {
                    _yuitest_coverline("build/editor-selection/editor-selection.js", 925);
cur.remove();
                }
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 928);
return cur;
        },
        /**
        * Gets a stored cursor and focuses it for editing, must be called sometime after setCursor
        * @method focusCursor
        * @return {Node}
        */
        focusCursor: function(collapse, end) {
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "focusCursor", 935);
_yuitest_coverline("build/editor-selection/editor-selection.js", 936);
if (collapse !== false) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 937);
collapse = true;
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 939);
if (end !== false) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 940);
end = true;
            }
            _yuitest_coverline("build/editor-selection/editor-selection.js", 942);
var cur = this.removeCursor(true);
            _yuitest_coverline("build/editor-selection/editor-selection.js", 943);
if (cur) {
                _yuitest_coverline("build/editor-selection/editor-selection.js", 944);
cur.each(function(c) {
                    _yuitest_coverfunc("build/editor-selection/editor-selection.js", "(anonymous 15)", 944);
_yuitest_coverline("build/editor-selection/editor-selection.js", 945);
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
            _yuitest_coverfunc("build/editor-selection/editor-selection.js", "toString", 954);
_yuitest_coverline("build/editor-selection/editor-selection.js", 955);
return 'EditorSelection Object';
        }
    };

    //TODO Remove this alias in 3.6.0
    _yuitest_coverline("build/editor-selection/editor-selection.js", 960);
Y.Selection = Y.EditorSelection;



}, '3.7.3', {"requires": ["node"]});
