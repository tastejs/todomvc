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
_yuitest_coverage["build/exec-command/exec-command.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/exec-command/exec-command.js",
    code: []
};
_yuitest_coverage["build/exec-command/exec-command.js"].code=["YUI.add('exec-command', function (Y, NAME) {","","","    /**","     * Plugin for the frame module to handle execCommands for Editor","     * @class Plugin.ExecCommand","     * @extends Base","     * @constructor","     * @module editor","     * @submodule exec-command","     */","        var ExecCommand = function() {","            ExecCommand.superclass.constructor.apply(this, arguments);","        },","        /**","        * This method is meant to normalize IE's in ability to exec the proper command on elements with CSS styling.","        * @method fixIETags","        * @protected","        * @param {String} cmd The command to execute","        * @param {String} tag The tag to create","        * @param {String} rule The rule that we are looking for.","        */","        fixIETags = function(cmd, tag, rule) {","            var inst = this.getInstance(),","                doc = inst.config.doc,","                sel = doc.selection.createRange(),","                o = doc.queryCommandValue(cmd),","                html, reg, m, p, d, s, c;","","            if (o) {","                html = sel.htmlText;","                reg = new RegExp(rule, 'g');","                m = html.match(reg);","","                if (m) {","                    html = html.replace(rule + ';', '').replace(rule, '');","","                    sel.pasteHTML('<var id=\"yui-ie-bs\">');","","                    p = doc.getElementById('yui-ie-bs');","                    d = doc.createElement('div');","                    s = doc.createElement(tag);","","                    d.innerHTML = html;","                    if (p.parentNode !== inst.config.doc.body) {","                        p = p.parentNode;","                    }","","                    c = d.childNodes;","","                    p.parentNode.replaceChild(s, p);","","                    Y.each(c, function(f) {","                        s.appendChild(f);","                    });","                    sel.collapse();","                    if (sel.moveToElementText) {","                        sel.moveToElementText(s);","                    }","                    sel.select();","                }","            }","            this._command(cmd);","        };","","        Y.extend(ExecCommand, Y.Base, {","            /**","            * An internal reference to the keyCode of the last key that was pressed.","            * @private","            * @property _lastKey","            */","            _lastKey: null,","            /**","            * An internal reference to the instance of the frame plugged into.","            * @private","            * @property _inst","            */","            _inst: null,","            /**","            * Execute a command on the frame's document.","            * @method command","            * @param {String} action The action to perform (bold, italic, fontname)","            * @param {String} value The optional value (helvetica)","            * @return {Node/NodeList} Should return the Node/Nodelist affected","            */","            command: function(action, value) {","                var fn = ExecCommand.COMMANDS[action];","","                if (fn) {","                    return fn.call(this, action, value);","                } else {","                    return this._command(action, value);","                }","            },","            /**","            * The private version of execCommand that doesn't filter for overrides.","            * @private","            * @method _command","            * @param {String} action The action to perform (bold, italic, fontname)","            * @param {String} value The optional value (helvetica)","            */","            _command: function(action, value) {","                var inst = this.getInstance();","                try {","                    try {","                        inst.config.doc.execCommand('styleWithCSS', null, 1);","                    } catch (e1) {","                        try {","                            inst.config.doc.execCommand('useCSS', null, 0);","                        } catch (e2) {","                        }","                    }","                    inst.config.doc.execCommand(action, null, value);","                } catch (e) {","                }","            },","            /**","            * Get's the instance of YUI bound to the parent frame","            * @method getInstance","            * @return {YUI} The YUI instance bound to the parent frame","            */","            getInstance: function() {","                if (!this._inst) {","                    this._inst = this.get('host').getInstance();","                }","                return this._inst;","            },","            initializer: function() {","                Y.mix(this.get('host'), {","                    execCommand: function(action, value) {","                        return this.exec.command(action, value);","                    },","                    _execCommand: function(action, value) {","                        return this.exec._command(action, value);","                    }","                });","","                this.get('host').on('dom:keypress', Y.bind(function(e) {","                    this._lastKey = e.keyCode;","                }, this));","            },","            _wrapContent: function(str, override) {","                var useP = (this.getInstance().host.editorPara && !override ? true : false);","","                if (useP) {","                    str = '<p>' + str + '</p>';","                } else {","                    str = str + '<br>';","                }","                return str;","            }","        }, {","            /**","            * execCommand","            * @property NAME","            * @static","            */","            NAME: 'execCommand',","            /**","            * exec","            * @property NS","            * @static","            */","            NS: 'exec',","            ATTRS: {","                host: {","                    value: false","                }","            },","            /**","            * Static object literal of execCommand overrides","            * @property COMMANDS","            * @static","            */","            COMMANDS: {","                /**","                * Wraps the content with a new element of type (tag)","                * @method COMMANDS.wrap","                * @static","                * @param {String} cmd The command executed: wrap","                * @param {String} tag The tag to wrap the selection with","                * @return {NodeList} NodeList of the items touched by this command.","                */","                wrap: function(cmd, tag) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).wrapContent(tag);","                },","                /**","                * Inserts the provided HTML at the cursor, should be a single element.","                * @method COMMANDS.inserthtml","                * @static","                * @param {String} cmd The command executed: inserthtml","                * @param {String} html The html to insert","                * @return {Node} Node instance of the item touched by this command.","                */","                inserthtml: function(cmd, html) {","                    var inst = this.getInstance();","                    if (inst.EditorSelection.hasCursor() || Y.UA.ie) {","                        return (new inst.EditorSelection()).insertContent(html);","                    } else {","                        this._command('inserthtml', html);","                    }","                },","                /**","                * Inserts the provided HTML at the cursor, and focuses the cursor afterwards.","                * @method COMMANDS.insertandfocus","                * @static","                * @param {String} cmd The command executed: insertandfocus","                * @param {String} html The html to insert","                * @return {Node} Node instance of the item touched by this command.","                */","                insertandfocus: function(cmd, html) {","                    var inst = this.getInstance(), out, sel;","                    if (inst.EditorSelection.hasCursor()) {","                        html += inst.EditorSelection.CURSOR;","                        out = this.command('inserthtml', html);","                        sel = new inst.EditorSelection();","                        sel.focusCursor(true, true);","                    } else {","                        this.command('inserthtml', html);","                    }","                    return out;","                },","                /**","                * Inserts a BR at the current cursor position","                * @method COMMANDS.insertbr","                * @static","                * @param {String} cmd The command executed: insertbr","                */","                insertbr: function() {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(),","                        html = '<var>|</var>', last = null,","                        q = (Y.UA.webkit) ? 'span.Apple-style-span,var' : 'var',","                        insert = function(n) {","                            var c = inst.Node.create('<br>');","                            n.insert(c, 'before');","                            return c;","                        };","","                    if (sel._selection.pasteHTML) {","                        sel._selection.pasteHTML(html);","                    } else {","                        this._command('inserthtml', html);","                    }","","","                    inst.all(q).each(function(n) {","                        var g = true, s;","                        if (Y.UA.webkit) {","                            g = false;","                            if (n.get('innerHTML') === '|') {","                                g = true;","                            }","                        }","                        if (g) {","                            last = insert(n);","                            if ((!last.previous() || !last.previous().test('br')) && Y.UA.gecko) {","                                s = last.cloneNode();","                                last.insert(s, 'after');","                                last = s;","                            }","                            n.remove();","                        }","                    });","                    if (Y.UA.webkit && last) {","                        insert(last);","                        sel.selectNode(last);","                    }","                },","                /**","                * Inserts an image at the cursor position","                * @method COMMANDS.insertimage","                * @static","                * @param {String} cmd The command executed: insertimage","                * @param {String} img The url of the image to be inserted","                * @return {Node} Node instance of the item touched by this command.","                */","                insertimage: function(cmd, img) {","                    return this.command('inserthtml', '<img src=\"' + img + '\">');","                },","                /**","                * Add a class to all of the elements in the selection","                * @method COMMANDS.addclass","                * @static","                * @param {String} cmd The command executed: addclass","                * @param {String} cls The className to add","                * @return {NodeList} NodeList of the items touched by this command.","                */","                addclass: function(cmd, cls) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).getSelected().addClass(cls);","                },","                /**","                * Remove a class from all of the elements in the selection","                * @method COMMANDS.removeclass","                * @static","                * @param {String} cmd The command executed: removeclass","                * @param {String} cls The className to remove","                * @return {NodeList} NodeList of the items touched by this command.","                */","                removeclass: function(cmd, cls) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).getSelected().removeClass(cls);","                },","                /**","                * Adds a forecolor to the current selection, or creates a new element and applies it","                * @method COMMANDS.forecolor","                * @static","                * @param {String} cmd The command executed: forecolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                forecolor: function(cmd, val) {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(), n;","","                    if (!Y.UA.ie) {","                        this._command('useCSS', false);","                    }","                    if (inst.EditorSelection.hasCursor()) {","                        if (sel.isCollapsed) {","                            if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {","                                sel.anchorNode.setStyle('color', val);","                                n = sel.anchorNode;","                            } else {","                                n = this.command('inserthtml', '<span style=\"color: ' + val + '\">' + inst.EditorSelection.CURSOR + '</span>');","                                sel.focusCursor(true, true);","                            }","                            return n;","                        } else {","                            return this._command(cmd, val);","                        }","                    } else {","                        this._command(cmd, val);","                    }","                },","                /**","                * Adds a background color to the current selection, or creates a new element and applies it","                * @method COMMANDS.backcolor","                * @static","                * @param {String} cmd The command executed: backcolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                backcolor: function(cmd, val) {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(), n;","","                    if (Y.UA.gecko || Y.UA.opera) {","                        cmd = 'hilitecolor';","                    }","                    if (!Y.UA.ie) {","                        this._command('useCSS', false);","                    }","                    if (inst.EditorSelection.hasCursor()) {","                        if (sel.isCollapsed) {","                            if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {","                                sel.anchorNode.setStyle('backgroundColor', val);","                                n = sel.anchorNode;","                            } else {","                                n = this.command('inserthtml',","                                    '<span style=\"background-color: ' + val + '\">' + inst.EditorSelection.CURSOR + '</span>');","                                sel.focusCursor(true, true);","                            }","                            return n;","                        } else {","                            return this._command(cmd, val);","                        }","                    } else {","                        this._command(cmd, val);","                    }","                },","                /**","                * Sugar method, calles backcolor","                * @method COMMANDS.hilitecolor","                * @static","                * @param {String} cmd The command executed: backcolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                hilitecolor: function() {","                    return ExecCommand.COMMANDS.backcolor.apply(this, arguments);","                },","                /**","                * Adds a font name to the current selection, or creates a new element and applies it","                * @method COMMANDS.fontname2","                * @deprecated","                * @static","                * @param {String} cmd The command executed: fontname","                * @param {String} val The font name to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                fontname2: function(cmd, val) {","                    this._command('fontname', val);","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection();","","                    if (sel.isCollapsed && (this._lastKey !== 32)) {","                        if (sel.anchorNode.test('font')) {","                            sel.anchorNode.set('face', val);","                        }","                    }","                },","                /**","                * Adds a fontsize to the current selection, or creates a new element and applies it","                * @method COMMANDS.fontsize2","                * @deprecated","                * @static","                * @param {String} cmd The command executed: fontsize","                * @param {String} val The font size to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                fontsize2: function(cmd, val) {","                    this._command('fontsize', val);","","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(), p;","","                    if (sel.isCollapsed && sel.anchorNode && (this._lastKey !== 32)) {","                        if (Y.UA.webkit) {","                            if (sel.anchorNode.getStyle('lineHeight')) {","                                sel.anchorNode.setStyle('lineHeight', '');","                            }","                        }","                        if (sel.anchorNode.test('font')) {","                            sel.anchorNode.set('size', val);","                        } else if (Y.UA.gecko) {","                            p = sel.anchorNode.ancestor(inst.EditorSelection.DEFAULT_BLOCK_TAG);","                            if (p) {","                                p.setStyle('fontSize', '');","                            }","                        }","                    }","                },","                /**","                * Overload for COMMANDS.list","                * @method COMMANDS.insertorderedlist","                * @static","                * @param {String} cmd The command executed: list, ul","                */","                insertunorderedlist: function() {","                    this.command('list', 'ul');","                },","                /**","                * Overload for COMMANDS.list","                * @method COMMANDS.insertunorderedlist","                * @static","                * @param {String} cmd The command executed: list, ol","                */","                insertorderedlist: function() {","                    this.command('list', 'ol');","                },","                /**","                * Noramlizes lists creation/destruction for IE. All others pass through to native calls","                * @method COMMANDS.list","                * @static","                * @param {String} cmd The command executed: list (not used)","                * @param {String} tag The tag to deal with","                */","                list: function(cmd, tag) {","                    var inst = this.getInstance(), html, self = this,","                        /*","                        The yui3- class name below is not a skinnable class,","                        it's a utility class used internally by editor and","                        stripped when completed, calling getClassName on this","                        is a waste of resources.","                        */","                        DIR = 'dir', cls = 'yui3-touched',","                        dir, range, div, elm, n, str, s, par, list, lis,","                        useP = (inst.host.editorPara ? true : false), tmp,","                        sdir, hasPParent, fc,","                        sel = new inst.EditorSelection();","","                    cmd = 'insert' + ((tag === 'ul') ? 'un' : '') + 'orderedlist';","","                    if (Y.UA.ie && !sel.isCollapsed) {","                        range = sel._selection;","                        html = range.htmlText;","                        div = inst.Node.create(html) || inst.one('body');","","                        if (div.test('li') || div.one('li')) {","                            this._command(cmd, null);","                            return;","                        }","                        if (div.test(tag)) {","                            elm = range.item ? range.item(0) : range.parentElement();","                            n = inst.one(elm);","                            lis = n.all('li');","","                            str = '<div>';","                            lis.each(function(l) {","                                str = self._wrapContent(l.get('innerHTML'));","                            });","                            str += '</div>';","                            s = inst.Node.create(str);","                            if (n.get('parentNode').test('div')) {","                                n = n.get('parentNode');","                            }","                            if (n && n.hasAttribute(DIR)) {","                                if (useP) {","                                    s.all('p').setAttribute(DIR, n.getAttribute(DIR));","                                } else {","                                    s.setAttribute(DIR, n.getAttribute(DIR));","                                }","                            }","                            if (useP) {","                                n.replace(s.get('innerHTML'));","                            } else {","                                n.replace(s);","                            }","                            if (range.moveToElementText) {","                                range.moveToElementText(s._node);","                            }","                            range.select();","                        } else {","                            par = Y.one(range.parentElement());","                            if (!par.test(inst.EditorSelection.BLOCKS)) {","                                par = par.ancestor(inst.EditorSelection.BLOCKS);","                            }","                            if (par) {","                                if (par.hasAttribute(DIR)) {","                                    dir = par.getAttribute(DIR);","                                }","                            }","                            if (html.indexOf('<br>') > -1) {","                                html = html.split(/<br>/i);","                            } else {","                                tmp = inst.Node.create(html),","                                ps = tmp ? tmp.all('p') : null;","","                                if (ps && ps.size()) {","                                    html = [];","                                    ps.each(function(n) {","                                        html.push(n.get('innerHTML'));","                                    });","                                } else {","                                    html = [html];","                                }","                            }","                            list = '<' + tag + ' id=\"ie-list\">';","                            Y.each(html, function(v) {","                                var a = inst.Node.create(v);","                                if (a && a.test('p')) {","                                    if (a.hasAttribute(DIR)) {","                                        dir = a.getAttribute(DIR);","                                    }","                                    v = a.get('innerHTML');","                                }","                                list += '<li>' + v + '</li>';","                            });","                            list += '</' + tag + '>';","                            range.pasteHTML(list);","                            elm = inst.config.doc.getElementById('ie-list');","                            elm.id = '';","                            if (dir) {","                                elm.setAttribute(DIR, dir);","                            }","                            if (range.moveToElementText) {","                                range.moveToElementText(elm);","                            }","                            range.select();","                        }","                    } else if (Y.UA.ie) {","                        par = inst.one(sel._selection.parentElement());","                        if (par.test('p')) {","                            if (par && par.hasAttribute(DIR)) {","                                dir = par.getAttribute(DIR);","                            }","                            html = Y.EditorSelection.getText(par);","                            if (html === '') {","                                sdir = '';","                                if (dir) {","                                    sdir = ' dir=\"' + dir + '\"';","                                }","                                list = inst.Node.create(Y.Lang.sub('<{tag}{dir}><li></li></{tag}>', { tag: tag, dir: sdir }));","                                par.replace(list);","                                sel.selectNode(list.one('li'));","                            } else {","                                this._command(cmd, null);","                            }","                        } else {","                            this._command(cmd, null);","                        }","                    } else {","                        inst.all(tag).addClass(cls);","                        if (sel.anchorNode.test(inst.EditorSelection.BLOCKS)) {","                            par = sel.anchorNode;","                        } else {","                            par = sel.anchorNode.ancestor(inst.EditorSelection.BLOCKS);","                        }","                        if (!par) { //No parent, find the first block under the anchorNode","                            par = sel.anchorNode.one(inst.EditorSelection.BLOCKS);","                        }","","                        if (par && par.hasAttribute(DIR)) {","                            dir = par.getAttribute(DIR);","                        }","                        if (par && par.test(tag)) {","                            hasPParent = par.ancestor('p');","                            html = inst.Node.create('<div/>');","                            elm = par.all('li');","                            elm.each(function(h) {","                                html.append(self._wrapContent(h.get('innerHTML'), hasPParent));","                            });","                            if (dir) {","                                if (useP) {","                                    html.all('p').setAttribute(DIR, dir);","                                } else {","                                    html.setAttribute(DIR, dir);","                                }","                            }","                            if (useP) {","                                html = inst.Node.create(html.get('innerHTML'));","                            }","                            fc = html.get('firstChild');","                            par.replace(html);","                            sel.selectNode(fc);","                        } else {","                            this._command(cmd, null);","                        }","                        list = inst.all(tag);","                        if (dir) {","                            if (list.size()) {","                                //Changed to a List","                                list.each(function(n) {","                                    if (!n.hasClass(cls)) {","                                        n.setAttribute(DIR, dir);","                                    }","                                });","                            }","                        }","","                        list.removeClass(cls);","                    }","                },","                /**","                * Noramlizes alignment for Webkit Browsers","                * @method COMMANDS.justify","                * @static","                * @param {String} cmd The command executed: justify (not used)","                * @param {String} val The actual command from the justify{center,all,left,right} stubs","                */","                justify: function(cmd, val) {","                    if (Y.UA.webkit) {","                        var inst = this.getInstance(),","                            sel = new inst.EditorSelection(),","                            aNode = sel.anchorNode, html,","                            bgColor = aNode.getStyle('backgroundColor');","","                            this._command(val);","                            sel = new inst.EditorSelection();","                            if (sel.anchorNode.test('div')) {","                                html = '<span>' + sel.anchorNode.get('innerHTML') + '</span>';","                                sel.anchorNode.set('innerHTML', html);","                                sel.anchorNode.one('span').setStyle('backgroundColor', bgColor);","                                sel.selectNode(sel.anchorNode.one('span'));","                            }","                    } else {","                        this._command(val);","                    }","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifycenter","                * @static","                */","                justifycenter: function() {","                    this.command('justify', 'justifycenter');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyleft","                * @static","                */","                justifyleft: function() {","                    this.command('justify', 'justifyleft');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyright","                * @static","                */","                justifyright: function() {","                    this.command('justify', 'justifyright');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyfull","                * @static","                */","                justifyfull: function() {","                    this.command('justify', 'justifyfull');","                }","            }","        });","","        if (Y.UA.ie) {","            ExecCommand.COMMANDS.bold = function() {","                fixIETags.call(this, 'bold', 'b', 'FONT-WEIGHT: bold');","            };","            ExecCommand.COMMANDS.italic = function() {","                fixIETags.call(this, 'italic', 'i', 'FONT-STYLE: italic');","            };","            ExecCommand.COMMANDS.underline = function() {","                fixIETags.call(this, 'underline', 'u', 'TEXT-DECORATION: underline');","            };","        }","","        Y.namespace('Plugin');","        Y.Plugin.ExecCommand = ExecCommand;","","","","}, '3.7.3', {\"requires\": [\"frame\"]});"];
_yuitest_coverage["build/exec-command/exec-command.js"].lines = {"1":0,"12":0,"13":0,"24":0,"30":0,"31":0,"32":0,"33":0,"35":0,"36":0,"38":0,"40":0,"41":0,"42":0,"44":0,"45":0,"46":0,"49":0,"51":0,"53":0,"54":0,"56":0,"57":0,"58":0,"60":0,"63":0,"66":0,"87":0,"89":0,"90":0,"92":0,"103":0,"104":0,"105":0,"106":0,"108":0,"109":0,"113":0,"123":0,"124":0,"126":0,"129":0,"131":0,"134":0,"138":0,"139":0,"143":0,"145":0,"146":0,"148":0,"150":0,"185":0,"186":0,"197":0,"198":0,"199":0,"201":0,"213":0,"214":0,"215":0,"216":0,"217":0,"218":0,"220":0,"222":0,"231":0,"236":0,"237":0,"238":0,"241":0,"242":0,"244":0,"248":0,"249":0,"250":0,"251":0,"252":0,"253":0,"256":0,"257":0,"258":0,"259":0,"260":0,"261":0,"263":0,"266":0,"267":0,"268":0,"280":0,"291":0,"292":0,"303":0,"304":0,"315":0,"318":0,"319":0,"321":0,"322":0,"323":0,"324":0,"325":0,"327":0,"328":0,"330":0,"332":0,"335":0,"347":0,"350":0,"351":0,"353":0,"354":0,"356":0,"357":0,"358":0,"359":0,"360":0,"362":0,"364":0,"366":0,"368":0,"371":0,"383":0,"395":0,"396":0,"399":0,"400":0,"401":0,"415":0,"417":0,"420":0,"421":0,"422":0,"423":0,"426":0,"427":0,"428":0,"429":0,"430":0,"431":0,"443":0,"452":0,"462":0,"475":0,"477":0,"478":0,"479":0,"480":0,"482":0,"483":0,"484":0,"486":0,"487":0,"488":0,"489":0,"491":0,"492":0,"493":0,"495":0,"496":0,"497":0,"498":0,"500":0,"501":0,"502":0,"504":0,"507":0,"508":0,"510":0,"512":0,"513":0,"515":0,"517":0,"518":0,"519":0,"521":0,"522":0,"523":0,"526":0,"527":0,"529":0,"532":0,"533":0,"534":0,"535":0,"538":0,"541":0,"542":0,"543":0,"544":0,"545":0,"546":0,"548":0,"550":0,"552":0,"553":0,"554":0,"555":0,"556":0,"557":0,"559":0,"560":0,"562":0,"564":0,"565":0,"566":0,"567":0,"568":0,"570":0,"571":0,"572":0,"573":0,"574":0,"576":0,"577":0,"578":0,"580":0,"583":0,"586":0,"587":0,"588":0,"590":0,"592":0,"593":0,"596":0,"597":0,"599":0,"600":0,"601":0,"602":0,"603":0,"604":0,"606":0,"607":0,"608":0,"610":0,"613":0,"614":0,"616":0,"617":0,"618":0,"620":0,"622":0,"623":0,"624":0,"626":0,"627":0,"628":0,"634":0,"645":0,"646":0,"651":0,"652":0,"653":0,"654":0,"655":0,"656":0,"657":0,"660":0,"669":0,"677":0,"685":0,"693":0,"698":0,"699":0,"700":0,"702":0,"703":0,"705":0,"706":0,"710":0,"711":0};
_yuitest_coverage["build/exec-command/exec-command.js"].functions = {"ExecCommand:12":0,"(anonymous 2):53":0,"fixIETags:23":0,"command:86":0,"_command:102":0,"getInstance:122":0,"execCommand:130":0,"_execCommand:133":0,"(anonymous 3):138":0,"initializer:128":0,"_wrapContent:142":0,"wrap:184":0,"inserthtml:196":0,"insertandfocus:212":0,"insert:235":0,"(anonymous 4):248":0,"insertbr:230":0,"insertimage:279":0,"addclass:290":0,"removeclass:302":0,"forecolor:314":0,"backcolor:346":0,"hilitecolor:382":0,"fontname2:394":0,"fontsize2:414":0,"insertunorderedlist:442":0,"insertorderedlist:451":0,"(anonymous 5):492":0,"(anonymous 6):534":0,"(anonymous 7):542":0,"(anonymous 8):603":0,"(anonymous 9):626":0,"list:461":0,"justify:644":0,"justifycenter:668":0,"justifyleft:676":0,"justifyright:684":0,"justifyfull:692":0,"bold:699":0,"italic:702":0,"underline:705":0,"(anonymous 1):1":0};
_yuitest_coverage["build/exec-command/exec-command.js"].coveredLines = 271;
_yuitest_coverage["build/exec-command/exec-command.js"].coveredFunctions = 42;
_yuitest_coverline("build/exec-command/exec-command.js", 1);
YUI.add('exec-command', function (Y, NAME) {


    /**
     * Plugin for the frame module to handle execCommands for Editor
     * @class Plugin.ExecCommand
     * @extends Base
     * @constructor
     * @module editor
     * @submodule exec-command
     */
        _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 1)", 1);
_yuitest_coverline("build/exec-command/exec-command.js", 12);
var ExecCommand = function() {
            _yuitest_coverfunc("build/exec-command/exec-command.js", "ExecCommand", 12);
_yuitest_coverline("build/exec-command/exec-command.js", 13);
ExecCommand.superclass.constructor.apply(this, arguments);
        },
        /**
        * This method is meant to normalize IE's in ability to exec the proper command on elements with CSS styling.
        * @method fixIETags
        * @protected
        * @param {String} cmd The command to execute
        * @param {String} tag The tag to create
        * @param {String} rule The rule that we are looking for.
        */
        fixIETags = function(cmd, tag, rule) {
            _yuitest_coverfunc("build/exec-command/exec-command.js", "fixIETags", 23);
_yuitest_coverline("build/exec-command/exec-command.js", 24);
var inst = this.getInstance(),
                doc = inst.config.doc,
                sel = doc.selection.createRange(),
                o = doc.queryCommandValue(cmd),
                html, reg, m, p, d, s, c;

            _yuitest_coverline("build/exec-command/exec-command.js", 30);
if (o) {
                _yuitest_coverline("build/exec-command/exec-command.js", 31);
html = sel.htmlText;
                _yuitest_coverline("build/exec-command/exec-command.js", 32);
reg = new RegExp(rule, 'g');
                _yuitest_coverline("build/exec-command/exec-command.js", 33);
m = html.match(reg);

                _yuitest_coverline("build/exec-command/exec-command.js", 35);
if (m) {
                    _yuitest_coverline("build/exec-command/exec-command.js", 36);
html = html.replace(rule + ';', '').replace(rule, '');

                    _yuitest_coverline("build/exec-command/exec-command.js", 38);
sel.pasteHTML('<var id="yui-ie-bs">');

                    _yuitest_coverline("build/exec-command/exec-command.js", 40);
p = doc.getElementById('yui-ie-bs');
                    _yuitest_coverline("build/exec-command/exec-command.js", 41);
d = doc.createElement('div');
                    _yuitest_coverline("build/exec-command/exec-command.js", 42);
s = doc.createElement(tag);

                    _yuitest_coverline("build/exec-command/exec-command.js", 44);
d.innerHTML = html;
                    _yuitest_coverline("build/exec-command/exec-command.js", 45);
if (p.parentNode !== inst.config.doc.body) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 46);
p = p.parentNode;
                    }

                    _yuitest_coverline("build/exec-command/exec-command.js", 49);
c = d.childNodes;

                    _yuitest_coverline("build/exec-command/exec-command.js", 51);
p.parentNode.replaceChild(s, p);

                    _yuitest_coverline("build/exec-command/exec-command.js", 53);
Y.each(c, function(f) {
                        _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 2)", 53);
_yuitest_coverline("build/exec-command/exec-command.js", 54);
s.appendChild(f);
                    });
                    _yuitest_coverline("build/exec-command/exec-command.js", 56);
sel.collapse();
                    _yuitest_coverline("build/exec-command/exec-command.js", 57);
if (sel.moveToElementText) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 58);
sel.moveToElementText(s);
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 60);
sel.select();
                }
            }
            _yuitest_coverline("build/exec-command/exec-command.js", 63);
this._command(cmd);
        };

        _yuitest_coverline("build/exec-command/exec-command.js", 66);
Y.extend(ExecCommand, Y.Base, {
            /**
            * An internal reference to the keyCode of the last key that was pressed.
            * @private
            * @property _lastKey
            */
            _lastKey: null,
            /**
            * An internal reference to the instance of the frame plugged into.
            * @private
            * @property _inst
            */
            _inst: null,
            /**
            * Execute a command on the frame's document.
            * @method command
            * @param {String} action The action to perform (bold, italic, fontname)
            * @param {String} value The optional value (helvetica)
            * @return {Node/NodeList} Should return the Node/Nodelist affected
            */
            command: function(action, value) {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "command", 86);
_yuitest_coverline("build/exec-command/exec-command.js", 87);
var fn = ExecCommand.COMMANDS[action];

                _yuitest_coverline("build/exec-command/exec-command.js", 89);
if (fn) {
                    _yuitest_coverline("build/exec-command/exec-command.js", 90);
return fn.call(this, action, value);
                } else {
                    _yuitest_coverline("build/exec-command/exec-command.js", 92);
return this._command(action, value);
                }
            },
            /**
            * The private version of execCommand that doesn't filter for overrides.
            * @private
            * @method _command
            * @param {String} action The action to perform (bold, italic, fontname)
            * @param {String} value The optional value (helvetica)
            */
            _command: function(action, value) {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "_command", 102);
_yuitest_coverline("build/exec-command/exec-command.js", 103);
var inst = this.getInstance();
                _yuitest_coverline("build/exec-command/exec-command.js", 104);
try {
                    _yuitest_coverline("build/exec-command/exec-command.js", 105);
try {
                        _yuitest_coverline("build/exec-command/exec-command.js", 106);
inst.config.doc.execCommand('styleWithCSS', null, 1);
                    } catch (e1) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 108);
try {
                            _yuitest_coverline("build/exec-command/exec-command.js", 109);
inst.config.doc.execCommand('useCSS', null, 0);
                        } catch (e2) {
                        }
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 113);
inst.config.doc.execCommand(action, null, value);
                } catch (e) {
                }
            },
            /**
            * Get's the instance of YUI bound to the parent frame
            * @method getInstance
            * @return {YUI} The YUI instance bound to the parent frame
            */
            getInstance: function() {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "getInstance", 122);
_yuitest_coverline("build/exec-command/exec-command.js", 123);
if (!this._inst) {
                    _yuitest_coverline("build/exec-command/exec-command.js", 124);
this._inst = this.get('host').getInstance();
                }
                _yuitest_coverline("build/exec-command/exec-command.js", 126);
return this._inst;
            },
            initializer: function() {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "initializer", 128);
_yuitest_coverline("build/exec-command/exec-command.js", 129);
Y.mix(this.get('host'), {
                    execCommand: function(action, value) {
                        _yuitest_coverfunc("build/exec-command/exec-command.js", "execCommand", 130);
_yuitest_coverline("build/exec-command/exec-command.js", 131);
return this.exec.command(action, value);
                    },
                    _execCommand: function(action, value) {
                        _yuitest_coverfunc("build/exec-command/exec-command.js", "_execCommand", 133);
_yuitest_coverline("build/exec-command/exec-command.js", 134);
return this.exec._command(action, value);
                    }
                });

                _yuitest_coverline("build/exec-command/exec-command.js", 138);
this.get('host').on('dom:keypress', Y.bind(function(e) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 3)", 138);
_yuitest_coverline("build/exec-command/exec-command.js", 139);
this._lastKey = e.keyCode;
                }, this));
            },
            _wrapContent: function(str, override) {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "_wrapContent", 142);
_yuitest_coverline("build/exec-command/exec-command.js", 143);
var useP = (this.getInstance().host.editorPara && !override ? true : false);

                _yuitest_coverline("build/exec-command/exec-command.js", 145);
if (useP) {
                    _yuitest_coverline("build/exec-command/exec-command.js", 146);
str = '<p>' + str + '</p>';
                } else {
                    _yuitest_coverline("build/exec-command/exec-command.js", 148);
str = str + '<br>';
                }
                _yuitest_coverline("build/exec-command/exec-command.js", 150);
return str;
            }
        }, {
            /**
            * execCommand
            * @property NAME
            * @static
            */
            NAME: 'execCommand',
            /**
            * exec
            * @property NS
            * @static
            */
            NS: 'exec',
            ATTRS: {
                host: {
                    value: false
                }
            },
            /**
            * Static object literal of execCommand overrides
            * @property COMMANDS
            * @static
            */
            COMMANDS: {
                /**
                * Wraps the content with a new element of type (tag)
                * @method COMMANDS.wrap
                * @static
                * @param {String} cmd The command executed: wrap
                * @param {String} tag The tag to wrap the selection with
                * @return {NodeList} NodeList of the items touched by this command.
                */
                wrap: function(cmd, tag) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "wrap", 184);
_yuitest_coverline("build/exec-command/exec-command.js", 185);
var inst = this.getInstance();
                    _yuitest_coverline("build/exec-command/exec-command.js", 186);
return (new inst.EditorSelection()).wrapContent(tag);
                },
                /**
                * Inserts the provided HTML at the cursor, should be a single element.
                * @method COMMANDS.inserthtml
                * @static
                * @param {String} cmd The command executed: inserthtml
                * @param {String} html The html to insert
                * @return {Node} Node instance of the item touched by this command.
                */
                inserthtml: function(cmd, html) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "inserthtml", 196);
_yuitest_coverline("build/exec-command/exec-command.js", 197);
var inst = this.getInstance();
                    _yuitest_coverline("build/exec-command/exec-command.js", 198);
if (inst.EditorSelection.hasCursor() || Y.UA.ie) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 199);
return (new inst.EditorSelection()).insertContent(html);
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 201);
this._command('inserthtml', html);
                    }
                },
                /**
                * Inserts the provided HTML at the cursor, and focuses the cursor afterwards.
                * @method COMMANDS.insertandfocus
                * @static
                * @param {String} cmd The command executed: insertandfocus
                * @param {String} html The html to insert
                * @return {Node} Node instance of the item touched by this command.
                */
                insertandfocus: function(cmd, html) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "insertandfocus", 212);
_yuitest_coverline("build/exec-command/exec-command.js", 213);
var inst = this.getInstance(), out, sel;
                    _yuitest_coverline("build/exec-command/exec-command.js", 214);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 215);
html += inst.EditorSelection.CURSOR;
                        _yuitest_coverline("build/exec-command/exec-command.js", 216);
out = this.command('inserthtml', html);
                        _yuitest_coverline("build/exec-command/exec-command.js", 217);
sel = new inst.EditorSelection();
                        _yuitest_coverline("build/exec-command/exec-command.js", 218);
sel.focusCursor(true, true);
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 220);
this.command('inserthtml', html);
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 222);
return out;
                },
                /**
                * Inserts a BR at the current cursor position
                * @method COMMANDS.insertbr
                * @static
                * @param {String} cmd The command executed: insertbr
                */
                insertbr: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "insertbr", 230);
_yuitest_coverline("build/exec-command/exec-command.js", 231);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(),
                        html = '<var>|</var>', last = null,
                        q = (Y.UA.webkit) ? 'span.Apple-style-span,var' : 'var',
                        insert = function(n) {
                            _yuitest_coverfunc("build/exec-command/exec-command.js", "insert", 235);
_yuitest_coverline("build/exec-command/exec-command.js", 236);
var c = inst.Node.create('<br>');
                            _yuitest_coverline("build/exec-command/exec-command.js", 237);
n.insert(c, 'before');
                            _yuitest_coverline("build/exec-command/exec-command.js", 238);
return c;
                        };

                    _yuitest_coverline("build/exec-command/exec-command.js", 241);
if (sel._selection.pasteHTML) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 242);
sel._selection.pasteHTML(html);
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 244);
this._command('inserthtml', html);
                    }


                    _yuitest_coverline("build/exec-command/exec-command.js", 248);
inst.all(q).each(function(n) {
                        _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 4)", 248);
_yuitest_coverline("build/exec-command/exec-command.js", 249);
var g = true, s;
                        _yuitest_coverline("build/exec-command/exec-command.js", 250);
if (Y.UA.webkit) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 251);
g = false;
                            _yuitest_coverline("build/exec-command/exec-command.js", 252);
if (n.get('innerHTML') === '|') {
                                _yuitest_coverline("build/exec-command/exec-command.js", 253);
g = true;
                            }
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 256);
if (g) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 257);
last = insert(n);
                            _yuitest_coverline("build/exec-command/exec-command.js", 258);
if ((!last.previous() || !last.previous().test('br')) && Y.UA.gecko) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 259);
s = last.cloneNode();
                                _yuitest_coverline("build/exec-command/exec-command.js", 260);
last.insert(s, 'after');
                                _yuitest_coverline("build/exec-command/exec-command.js", 261);
last = s;
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 263);
n.remove();
                        }
                    });
                    _yuitest_coverline("build/exec-command/exec-command.js", 266);
if (Y.UA.webkit && last) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 267);
insert(last);
                        _yuitest_coverline("build/exec-command/exec-command.js", 268);
sel.selectNode(last);
                    }
                },
                /**
                * Inserts an image at the cursor position
                * @method COMMANDS.insertimage
                * @static
                * @param {String} cmd The command executed: insertimage
                * @param {String} img The url of the image to be inserted
                * @return {Node} Node instance of the item touched by this command.
                */
                insertimage: function(cmd, img) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "insertimage", 279);
_yuitest_coverline("build/exec-command/exec-command.js", 280);
return this.command('inserthtml', '<img src="' + img + '">');
                },
                /**
                * Add a class to all of the elements in the selection
                * @method COMMANDS.addclass
                * @static
                * @param {String} cmd The command executed: addclass
                * @param {String} cls The className to add
                * @return {NodeList} NodeList of the items touched by this command.
                */
                addclass: function(cmd, cls) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "addclass", 290);
_yuitest_coverline("build/exec-command/exec-command.js", 291);
var inst = this.getInstance();
                    _yuitest_coverline("build/exec-command/exec-command.js", 292);
return (new inst.EditorSelection()).getSelected().addClass(cls);
                },
                /**
                * Remove a class from all of the elements in the selection
                * @method COMMANDS.removeclass
                * @static
                * @param {String} cmd The command executed: removeclass
                * @param {String} cls The className to remove
                * @return {NodeList} NodeList of the items touched by this command.
                */
                removeclass: function(cmd, cls) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "removeclass", 302);
_yuitest_coverline("build/exec-command/exec-command.js", 303);
var inst = this.getInstance();
                    _yuitest_coverline("build/exec-command/exec-command.js", 304);
return (new inst.EditorSelection()).getSelected().removeClass(cls);
                },
                /**
                * Adds a forecolor to the current selection, or creates a new element and applies it
                * @method COMMANDS.forecolor
                * @static
                * @param {String} cmd The command executed: forecolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                forecolor: function(cmd, val) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "forecolor", 314);
_yuitest_coverline("build/exec-command/exec-command.js", 315);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(), n;

                    _yuitest_coverline("build/exec-command/exec-command.js", 318);
if (!Y.UA.ie) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 319);
this._command('useCSS', false);
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 321);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 322);
if (sel.isCollapsed) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 323);
if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 324);
sel.anchorNode.setStyle('color', val);
                                _yuitest_coverline("build/exec-command/exec-command.js", 325);
n = sel.anchorNode;
                            } else {
                                _yuitest_coverline("build/exec-command/exec-command.js", 327);
n = this.command('inserthtml', '<span style="color: ' + val + '">' + inst.EditorSelection.CURSOR + '</span>');
                                _yuitest_coverline("build/exec-command/exec-command.js", 328);
sel.focusCursor(true, true);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 330);
return n;
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 332);
return this._command(cmd, val);
                        }
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 335);
this._command(cmd, val);
                    }
                },
                /**
                * Adds a background color to the current selection, or creates a new element and applies it
                * @method COMMANDS.backcolor
                * @static
                * @param {String} cmd The command executed: backcolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                backcolor: function(cmd, val) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "backcolor", 346);
_yuitest_coverline("build/exec-command/exec-command.js", 347);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(), n;

                    _yuitest_coverline("build/exec-command/exec-command.js", 350);
if (Y.UA.gecko || Y.UA.opera) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 351);
cmd = 'hilitecolor';
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 353);
if (!Y.UA.ie) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 354);
this._command('useCSS', false);
                    }
                    _yuitest_coverline("build/exec-command/exec-command.js", 356);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 357);
if (sel.isCollapsed) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 358);
if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 359);
sel.anchorNode.setStyle('backgroundColor', val);
                                _yuitest_coverline("build/exec-command/exec-command.js", 360);
n = sel.anchorNode;
                            } else {
                                _yuitest_coverline("build/exec-command/exec-command.js", 362);
n = this.command('inserthtml',
                                    '<span style="background-color: ' + val + '">' + inst.EditorSelection.CURSOR + '</span>');
                                _yuitest_coverline("build/exec-command/exec-command.js", 364);
sel.focusCursor(true, true);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 366);
return n;
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 368);
return this._command(cmd, val);
                        }
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 371);
this._command(cmd, val);
                    }
                },
                /**
                * Sugar method, calles backcolor
                * @method COMMANDS.hilitecolor
                * @static
                * @param {String} cmd The command executed: backcolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                hilitecolor: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "hilitecolor", 382);
_yuitest_coverline("build/exec-command/exec-command.js", 383);
return ExecCommand.COMMANDS.backcolor.apply(this, arguments);
                },
                /**
                * Adds a font name to the current selection, or creates a new element and applies it
                * @method COMMANDS.fontname2
                * @deprecated
                * @static
                * @param {String} cmd The command executed: fontname
                * @param {String} val The font name to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                fontname2: function(cmd, val) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "fontname2", 394);
_yuitest_coverline("build/exec-command/exec-command.js", 395);
this._command('fontname', val);
                    _yuitest_coverline("build/exec-command/exec-command.js", 396);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection();

                    _yuitest_coverline("build/exec-command/exec-command.js", 399);
if (sel.isCollapsed && (this._lastKey !== 32)) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 400);
if (sel.anchorNode.test('font')) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 401);
sel.anchorNode.set('face', val);
                        }
                    }
                },
                /**
                * Adds a fontsize to the current selection, or creates a new element and applies it
                * @method COMMANDS.fontsize2
                * @deprecated
                * @static
                * @param {String} cmd The command executed: fontsize
                * @param {String} val The font size to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                fontsize2: function(cmd, val) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "fontsize2", 414);
_yuitest_coverline("build/exec-command/exec-command.js", 415);
this._command('fontsize', val);

                    _yuitest_coverline("build/exec-command/exec-command.js", 417);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(), p;

                    _yuitest_coverline("build/exec-command/exec-command.js", 420);
if (sel.isCollapsed && sel.anchorNode && (this._lastKey !== 32)) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 421);
if (Y.UA.webkit) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 422);
if (sel.anchorNode.getStyle('lineHeight')) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 423);
sel.anchorNode.setStyle('lineHeight', '');
                            }
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 426);
if (sel.anchorNode.test('font')) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 427);
sel.anchorNode.set('size', val);
                        } else {_yuitest_coverline("build/exec-command/exec-command.js", 428);
if (Y.UA.gecko) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 429);
p = sel.anchorNode.ancestor(inst.EditorSelection.DEFAULT_BLOCK_TAG);
                            _yuitest_coverline("build/exec-command/exec-command.js", 430);
if (p) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 431);
p.setStyle('fontSize', '');
                            }
                        }}
                    }
                },
                /**
                * Overload for COMMANDS.list
                * @method COMMANDS.insertorderedlist
                * @static
                * @param {String} cmd The command executed: list, ul
                */
                insertunorderedlist: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "insertunorderedlist", 442);
_yuitest_coverline("build/exec-command/exec-command.js", 443);
this.command('list', 'ul');
                },
                /**
                * Overload for COMMANDS.list
                * @method COMMANDS.insertunorderedlist
                * @static
                * @param {String} cmd The command executed: list, ol
                */
                insertorderedlist: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "insertorderedlist", 451);
_yuitest_coverline("build/exec-command/exec-command.js", 452);
this.command('list', 'ol');
                },
                /**
                * Noramlizes lists creation/destruction for IE. All others pass through to native calls
                * @method COMMANDS.list
                * @static
                * @param {String} cmd The command executed: list (not used)
                * @param {String} tag The tag to deal with
                */
                list: function(cmd, tag) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "list", 461);
_yuitest_coverline("build/exec-command/exec-command.js", 462);
var inst = this.getInstance(), html, self = this,
                        /*
                        The yui3- class name below is not a skinnable class,
                        it's a utility class used internally by editor and
                        stripped when completed, calling getClassName on this
                        is a waste of resources.
                        */
                        DIR = 'dir', cls = 'yui3-touched',
                        dir, range, div, elm, n, str, s, par, list, lis,
                        useP = (inst.host.editorPara ? true : false), tmp,
                        sdir, hasPParent, fc,
                        sel = new inst.EditorSelection();

                    _yuitest_coverline("build/exec-command/exec-command.js", 475);
cmd = 'insert' + ((tag === 'ul') ? 'un' : '') + 'orderedlist';

                    _yuitest_coverline("build/exec-command/exec-command.js", 477);
if (Y.UA.ie && !sel.isCollapsed) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 478);
range = sel._selection;
                        _yuitest_coverline("build/exec-command/exec-command.js", 479);
html = range.htmlText;
                        _yuitest_coverline("build/exec-command/exec-command.js", 480);
div = inst.Node.create(html) || inst.one('body');

                        _yuitest_coverline("build/exec-command/exec-command.js", 482);
if (div.test('li') || div.one('li')) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 483);
this._command(cmd, null);
                            _yuitest_coverline("build/exec-command/exec-command.js", 484);
return;
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 486);
if (div.test(tag)) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 487);
elm = range.item ? range.item(0) : range.parentElement();
                            _yuitest_coverline("build/exec-command/exec-command.js", 488);
n = inst.one(elm);
                            _yuitest_coverline("build/exec-command/exec-command.js", 489);
lis = n.all('li');

                            _yuitest_coverline("build/exec-command/exec-command.js", 491);
str = '<div>';
                            _yuitest_coverline("build/exec-command/exec-command.js", 492);
lis.each(function(l) {
                                _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 5)", 492);
_yuitest_coverline("build/exec-command/exec-command.js", 493);
str = self._wrapContent(l.get('innerHTML'));
                            });
                            _yuitest_coverline("build/exec-command/exec-command.js", 495);
str += '</div>';
                            _yuitest_coverline("build/exec-command/exec-command.js", 496);
s = inst.Node.create(str);
                            _yuitest_coverline("build/exec-command/exec-command.js", 497);
if (n.get('parentNode').test('div')) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 498);
n = n.get('parentNode');
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 500);
if (n && n.hasAttribute(DIR)) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 501);
if (useP) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 502);
s.all('p').setAttribute(DIR, n.getAttribute(DIR));
                                } else {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 504);
s.setAttribute(DIR, n.getAttribute(DIR));
                                }
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 507);
if (useP) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 508);
n.replace(s.get('innerHTML'));
                            } else {
                                _yuitest_coverline("build/exec-command/exec-command.js", 510);
n.replace(s);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 512);
if (range.moveToElementText) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 513);
range.moveToElementText(s._node);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 515);
range.select();
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 517);
par = Y.one(range.parentElement());
                            _yuitest_coverline("build/exec-command/exec-command.js", 518);
if (!par.test(inst.EditorSelection.BLOCKS)) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 519);
par = par.ancestor(inst.EditorSelection.BLOCKS);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 521);
if (par) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 522);
if (par.hasAttribute(DIR)) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 523);
dir = par.getAttribute(DIR);
                                }
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 526);
if (html.indexOf('<br>') > -1) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 527);
html = html.split(/<br>/i);
                            } else {
                                _yuitest_coverline("build/exec-command/exec-command.js", 529);
tmp = inst.Node.create(html),
                                ps = tmp ? tmp.all('p') : null;

                                _yuitest_coverline("build/exec-command/exec-command.js", 532);
if (ps && ps.size()) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 533);
html = [];
                                    _yuitest_coverline("build/exec-command/exec-command.js", 534);
ps.each(function(n) {
                                        _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 6)", 534);
_yuitest_coverline("build/exec-command/exec-command.js", 535);
html.push(n.get('innerHTML'));
                                    });
                                } else {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 538);
html = [html];
                                }
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 541);
list = '<' + tag + ' id="ie-list">';
                            _yuitest_coverline("build/exec-command/exec-command.js", 542);
Y.each(html, function(v) {
                                _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 7)", 542);
_yuitest_coverline("build/exec-command/exec-command.js", 543);
var a = inst.Node.create(v);
                                _yuitest_coverline("build/exec-command/exec-command.js", 544);
if (a && a.test('p')) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 545);
if (a.hasAttribute(DIR)) {
                                        _yuitest_coverline("build/exec-command/exec-command.js", 546);
dir = a.getAttribute(DIR);
                                    }
                                    _yuitest_coverline("build/exec-command/exec-command.js", 548);
v = a.get('innerHTML');
                                }
                                _yuitest_coverline("build/exec-command/exec-command.js", 550);
list += '<li>' + v + '</li>';
                            });
                            _yuitest_coverline("build/exec-command/exec-command.js", 552);
list += '</' + tag + '>';
                            _yuitest_coverline("build/exec-command/exec-command.js", 553);
range.pasteHTML(list);
                            _yuitest_coverline("build/exec-command/exec-command.js", 554);
elm = inst.config.doc.getElementById('ie-list');
                            _yuitest_coverline("build/exec-command/exec-command.js", 555);
elm.id = '';
                            _yuitest_coverline("build/exec-command/exec-command.js", 556);
if (dir) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 557);
elm.setAttribute(DIR, dir);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 559);
if (range.moveToElementText) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 560);
range.moveToElementText(elm);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 562);
range.select();
                        }
                    } else {_yuitest_coverline("build/exec-command/exec-command.js", 564);
if (Y.UA.ie) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 565);
par = inst.one(sel._selection.parentElement());
                        _yuitest_coverline("build/exec-command/exec-command.js", 566);
if (par.test('p')) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 567);
if (par && par.hasAttribute(DIR)) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 568);
dir = par.getAttribute(DIR);
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 570);
html = Y.EditorSelection.getText(par);
                            _yuitest_coverline("build/exec-command/exec-command.js", 571);
if (html === '') {
                                _yuitest_coverline("build/exec-command/exec-command.js", 572);
sdir = '';
                                _yuitest_coverline("build/exec-command/exec-command.js", 573);
if (dir) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 574);
sdir = ' dir="' + dir + '"';
                                }
                                _yuitest_coverline("build/exec-command/exec-command.js", 576);
list = inst.Node.create(Y.Lang.sub('<{tag}{dir}><li></li></{tag}>', { tag: tag, dir: sdir }));
                                _yuitest_coverline("build/exec-command/exec-command.js", 577);
par.replace(list);
                                _yuitest_coverline("build/exec-command/exec-command.js", 578);
sel.selectNode(list.one('li'));
                            } else {
                                _yuitest_coverline("build/exec-command/exec-command.js", 580);
this._command(cmd, null);
                            }
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 583);
this._command(cmd, null);
                        }
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 586);
inst.all(tag).addClass(cls);
                        _yuitest_coverline("build/exec-command/exec-command.js", 587);
if (sel.anchorNode.test(inst.EditorSelection.BLOCKS)) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 588);
par = sel.anchorNode;
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 590);
par = sel.anchorNode.ancestor(inst.EditorSelection.BLOCKS);
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 592);
if (!par) { //No parent, find the first block under the anchorNode
                            _yuitest_coverline("build/exec-command/exec-command.js", 593);
par = sel.anchorNode.one(inst.EditorSelection.BLOCKS);
                        }

                        _yuitest_coverline("build/exec-command/exec-command.js", 596);
if (par && par.hasAttribute(DIR)) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 597);
dir = par.getAttribute(DIR);
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 599);
if (par && par.test(tag)) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 600);
hasPParent = par.ancestor('p');
                            _yuitest_coverline("build/exec-command/exec-command.js", 601);
html = inst.Node.create('<div/>');
                            _yuitest_coverline("build/exec-command/exec-command.js", 602);
elm = par.all('li');
                            _yuitest_coverline("build/exec-command/exec-command.js", 603);
elm.each(function(h) {
                                _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 8)", 603);
_yuitest_coverline("build/exec-command/exec-command.js", 604);
html.append(self._wrapContent(h.get('innerHTML'), hasPParent));
                            });
                            _yuitest_coverline("build/exec-command/exec-command.js", 606);
if (dir) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 607);
if (useP) {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 608);
html.all('p').setAttribute(DIR, dir);
                                } else {
                                    _yuitest_coverline("build/exec-command/exec-command.js", 610);
html.setAttribute(DIR, dir);
                                }
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 613);
if (useP) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 614);
html = inst.Node.create(html.get('innerHTML'));
                            }
                            _yuitest_coverline("build/exec-command/exec-command.js", 616);
fc = html.get('firstChild');
                            _yuitest_coverline("build/exec-command/exec-command.js", 617);
par.replace(html);
                            _yuitest_coverline("build/exec-command/exec-command.js", 618);
sel.selectNode(fc);
                        } else {
                            _yuitest_coverline("build/exec-command/exec-command.js", 620);
this._command(cmd, null);
                        }
                        _yuitest_coverline("build/exec-command/exec-command.js", 622);
list = inst.all(tag);
                        _yuitest_coverline("build/exec-command/exec-command.js", 623);
if (dir) {
                            _yuitest_coverline("build/exec-command/exec-command.js", 624);
if (list.size()) {
                                //Changed to a List
                                _yuitest_coverline("build/exec-command/exec-command.js", 626);
list.each(function(n) {
                                    _yuitest_coverfunc("build/exec-command/exec-command.js", "(anonymous 9)", 626);
_yuitest_coverline("build/exec-command/exec-command.js", 627);
if (!n.hasClass(cls)) {
                                        _yuitest_coverline("build/exec-command/exec-command.js", 628);
n.setAttribute(DIR, dir);
                                    }
                                });
                            }
                        }

                        _yuitest_coverline("build/exec-command/exec-command.js", 634);
list.removeClass(cls);
                    }}
                },
                /**
                * Noramlizes alignment for Webkit Browsers
                * @method COMMANDS.justify
                * @static
                * @param {String} cmd The command executed: justify (not used)
                * @param {String} val The actual command from the justify{center,all,left,right} stubs
                */
                justify: function(cmd, val) {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "justify", 644);
_yuitest_coverline("build/exec-command/exec-command.js", 645);
if (Y.UA.webkit) {
                        _yuitest_coverline("build/exec-command/exec-command.js", 646);
var inst = this.getInstance(),
                            sel = new inst.EditorSelection(),
                            aNode = sel.anchorNode, html,
                            bgColor = aNode.getStyle('backgroundColor');

                            _yuitest_coverline("build/exec-command/exec-command.js", 651);
this._command(val);
                            _yuitest_coverline("build/exec-command/exec-command.js", 652);
sel = new inst.EditorSelection();
                            _yuitest_coverline("build/exec-command/exec-command.js", 653);
if (sel.anchorNode.test('div')) {
                                _yuitest_coverline("build/exec-command/exec-command.js", 654);
html = '<span>' + sel.anchorNode.get('innerHTML') + '</span>';
                                _yuitest_coverline("build/exec-command/exec-command.js", 655);
sel.anchorNode.set('innerHTML', html);
                                _yuitest_coverline("build/exec-command/exec-command.js", 656);
sel.anchorNode.one('span').setStyle('backgroundColor', bgColor);
                                _yuitest_coverline("build/exec-command/exec-command.js", 657);
sel.selectNode(sel.anchorNode.one('span'));
                            }
                    } else {
                        _yuitest_coverline("build/exec-command/exec-command.js", 660);
this._command(val);
                    }
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifycenter
                * @static
                */
                justifycenter: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "justifycenter", 668);
_yuitest_coverline("build/exec-command/exec-command.js", 669);
this.command('justify', 'justifycenter');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyleft
                * @static
                */
                justifyleft: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "justifyleft", 676);
_yuitest_coverline("build/exec-command/exec-command.js", 677);
this.command('justify', 'justifyleft');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyright
                * @static
                */
                justifyright: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "justifyright", 684);
_yuitest_coverline("build/exec-command/exec-command.js", 685);
this.command('justify', 'justifyright');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyfull
                * @static
                */
                justifyfull: function() {
                    _yuitest_coverfunc("build/exec-command/exec-command.js", "justifyfull", 692);
_yuitest_coverline("build/exec-command/exec-command.js", 693);
this.command('justify', 'justifyfull');
                }
            }
        });

        _yuitest_coverline("build/exec-command/exec-command.js", 698);
if (Y.UA.ie) {
            _yuitest_coverline("build/exec-command/exec-command.js", 699);
ExecCommand.COMMANDS.bold = function() {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "bold", 699);
_yuitest_coverline("build/exec-command/exec-command.js", 700);
fixIETags.call(this, 'bold', 'b', 'FONT-WEIGHT: bold');
            };
            _yuitest_coverline("build/exec-command/exec-command.js", 702);
ExecCommand.COMMANDS.italic = function() {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "italic", 702);
_yuitest_coverline("build/exec-command/exec-command.js", 703);
fixIETags.call(this, 'italic', 'i', 'FONT-STYLE: italic');
            };
            _yuitest_coverline("build/exec-command/exec-command.js", 705);
ExecCommand.COMMANDS.underline = function() {
                _yuitest_coverfunc("build/exec-command/exec-command.js", "underline", 705);
_yuitest_coverline("build/exec-command/exec-command.js", 706);
fixIETags.call(this, 'underline', 'u', 'TEXT-DECORATION: underline');
            };
        }

        _yuitest_coverline("build/exec-command/exec-command.js", 710);
Y.namespace('Plugin');
        _yuitest_coverline("build/exec-command/exec-command.js", 711);
Y.Plugin.ExecCommand = ExecCommand;



}, '3.7.3', {"requires": ["frame"]});
