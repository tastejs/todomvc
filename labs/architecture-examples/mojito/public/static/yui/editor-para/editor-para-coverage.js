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
_yuitest_coverage["build/editor-para/editor-para.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/editor-para/editor-para.js",
    code: []
};
_yuitest_coverage["build/editor-para/editor-para.js"].code=["YUI.add('editor-para', function (Y, NAME) {","","","    /**","     * Plugin for Editor to paragraph auto wrapping and correction.","     * @class Plugin.EditorPara","     * @extends Plugin.EditorParaBase","     * @constructor","     * @module editor","     * @submodule editor-para","     */","","","    var EditorPara = function() {","        EditorPara.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',","    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';","","","    Y.extend(EditorPara, Y.Plugin.EditorParaBase, {","        /**","        * nodeChange handler to handle fixing an empty document.","        * @private","        * @method _onNodeChange","        */","        _onNodeChange: function(e) {","            var host = this.get(HOST), inst = host.getInstance(),","                html, txt, par , d, sel, btag = inst.EditorSelection.DEFAULT_BLOCK_TAG,","                inHTML, txt2, childs, aNode, node2, top, n, sib, para2, prev,","                ps, br, item, p, imgs, t, LAST_CHILD = ':last-child', para, b, dir,","                lc, lc2, found = false, start;","","            switch (e.changedType) {","                case 'enter-up':","                    para = ((this._lastPara) ? this._lastPara : e.changedNode);","                    b = para.one('br.yui-cursor');","","                    if (this._lastPara) {","                        delete this._lastPara;","                    }","","                    if (b) {","                        if (b.previous() || b.next()) {","                            if (b.ancestor(P)) {","                                b.remove();","                            }","                        }","                    }","                    if (!para.test(btag)) {","                        para2 = para.ancestor(btag);","                        if (para2) {","                            para = para2;","                            para2 = null;","                        }","                    }","                    if (para.test(btag)) {","                        prev = para.previous();","                        if (prev) {","                            lc = prev.one(LAST_CHILD);","                            while (!found) {","                                if (lc) {","                                    lc2 = lc.one(LAST_CHILD);","                                    if (lc2) {","                                        lc = lc2;","                                    } else {","                                        found = true;","                                    }","                                } else {","                                    found = true;","                                }","                            }","                            if (lc) {","                                host.copyStyles(lc, para);","                            }","                        }","                    }","                    break;","                case 'enter':","                    if (Y.UA.webkit) {","                        //Webkit doesn't support shift+enter as a BR, this fixes that.","                        if (e.changedEvent.shiftKey) {","                            host.execCommand('insertbr');","                            e.changedEvent.preventDefault();","                        }","                    }","                    if (e.changedNode.test('li') && !Y.UA.ie) {","                        html = inst.EditorSelection.getText(e.changedNode);","                        if (html === '') {","                            par = e.changedNode.ancestor('ol,ul');","                            dir = par.getAttribute('dir');","                            if (dir !== '') {","                                dir = ' dir = \"' + dir + '\"';","                            }","                            par = e.changedNode.ancestor(inst.EditorSelection.BLOCKS);","                            d = inst.Node.create('<p' + dir + '>' + inst.EditorSelection.CURSOR + '</p>');","                            par.insert(d, 'after');","                            e.changedNode.remove();","                            e.changedEvent.halt();","","                            sel = new inst.EditorSelection();","                            sel.selectNode(d, true, false);","                        }","                    }","                    //TODO Move this to a GECKO MODULE - Can't for the moment, requires no change to metadata (YMAIL)","                    if (Y.UA.gecko && host.get('defaultblock') !== 'p') {","                        par = e.changedNode;","","                        if (!par.test(LI) && !par.ancestor(LI)) {","                            if (!par.test(btag)) {","                                par = par.ancestor(btag);","                            }","                            d = inst.Node.create('<' + btag + '></' + btag + '>');","                            par.insert(d, 'after');","                            sel = new inst.EditorSelection();","                            if (sel.anchorOffset) {","                                inHTML = sel.anchorNode.get('textContent');","","                                txt = inst.one(inst.config.doc.createTextNode(inHTML.substr(0, sel.anchorOffset)));","                                txt2 = inst.one(inst.config.doc.createTextNode(inHTML.substr(sel.anchorOffset)));","","                                aNode = sel.anchorNode;","                                aNode.setContent(''); //I","                                node2 = aNode.cloneNode(); //I","                                node2.append(txt2); //text","                                top = false;","                                sib = aNode; //I","                                while (!top) {","                                    sib = sib.get(PARENT_NODE); //B","                                    if (sib && !sib.test(btag)) {","                                        n = sib.cloneNode();","                                        n.set('innerHTML', '');","                                        n.append(node2);","","                                        //Get children..","                                        childs = sib.get('childNodes');","                                        start = false;","                                        /*jshint loopfunc: true */","                                        childs.each(function(c) {","                                            if (start) {","                                                n.append(c);","                                            }","                                            if (c === aNode) {","                                                start = true;","                                            }","                                        });","","                                        aNode = sib; //Top sibling","                                        node2 = n;","                                    } else {","                                        top = true;","                                    }","                                }","                                txt2 = node2;","                                sel.anchorNode.append(txt);","","                                if (txt2) {","                                    d.append(txt2);","                                }","                            }","                            if (d.get(FC)) {","                                d = d.get(FC);","                            }","                            d.prepend(inst.EditorSelection.CURSOR);","                            sel.focusCursor(true, true);","                            html = inst.EditorSelection.getText(d);","                            if (html !== '') {","                                inst.EditorSelection.cleanCursor();","                            }","                            e.changedEvent.preventDefault();","                        }","                    }","                    break;","                case 'keyup':","                    if (Y.UA.gecko) {","                        if (inst.config.doc && inst.config.doc.body && inst.config.doc.body.innerHTML.length < 20) {","                            if (!inst.one(FIRST_P)) {","                                this._fixFirstPara();","                            }","                        }","                    }","                    break;","                case 'backspace-up':","                case 'backspace-down':","                case 'delete-up':","                    if (!Y.UA.ie) {","                        ps = inst.all(FIRST_P);","                        item = inst.one(BODY);","                        if (ps.item(0)) {","                            item = ps.item(0);","                        }","                        br = item.one('br');","                        if (br) {","                            br.removeAttribute('id');","                            br.removeAttribute('class');","                        }","","                        txt = inst.EditorSelection.getText(item);","                        txt = txt.replace(/ /g, '').replace(/\\n/g, '');","                        imgs = item.all('img');","","                        if (txt.length === 0 && !imgs.size()) {","                            //God this is horrible..","                            if (!item.test(P)) {","                                this._fixFirstPara();","                            }","                            p = null;","                            if (e.changedNode && e.changedNode.test(P)) {","                                p = e.changedNode;","                            }","                            if (!p && host._lastPara && host._lastPara.inDoc()) {","                                p = host._lastPara;","                            }","                            if (p && !p.test(P)) {","                                p = p.ancestor(P);","                            }","                            if (p) {","                                if (!p.previous() && p.get(PARENT_NODE) && p.get(PARENT_NODE).test(BODY)) {","                                    e.changedEvent.frameEvent.halt();","                                    e.preventDefault();","                                }","                            }","                        }","                        if (Y.UA.webkit) {","                            if (e.changedNode) {","                                //All backspace calls in Webkit need a preventDefault to","                                //stop history navigation #2531299","                                e.preventDefault();","                                item = e.changedNode;","                                if (item.test('li') && (!item.previous() && !item.next())) {","                                    html = item.get('innerHTML').replace(BR, '');","                                    if (html === '') {","                                        if (item.get(PARENT_NODE)) {","                                            item.get(PARENT_NODE).replace(inst.Node.create(BR));","                                            e.changedEvent.frameEvent.halt();","                                            inst.EditorSelection.filterBlocks();","                                        }","                                    }","                                }","                            }","                        }","                    }","                    if (Y.UA.gecko) {","                        /*","                        * This forced FF to redraw the content on backspace.","                        * On some occasions FF will leave a cursor residue after content has been deleted.","                        * Dropping in the empty textnode and then removing it causes FF to redraw and","                        * remove the \"ghost cursors\"","                        */","                        d = e.changedNode;","                        t = inst.config.doc.createTextNode(' ');","                        d.appendChild(t);","                        d.removeChild(t);","                    }","                    break;","            }","            if (Y.UA.gecko) {","                if (e.changedNode && !e.changedNode.test(btag)) {","                    p = e.changedNode.ancestor(btag);","                    if (p) {","                        this._lastPara = p;","                    }","                }","            }","","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorBR) {","                Y.error('Can not plug EditorPara and EditorBR at the same time.');","                return;","            }","","            host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));","        }","    }, {","        /**","        * editorPara","        * @static","        * @property NAME","        */","        NAME: 'editorPara',","        /**","        * editorPara","        * @static","        * @property NS","        */","        NS: 'editorPara',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","    Y.namespace('Plugin');","","    Y.Plugin.EditorPara = EditorPara;","","","","}, '3.7.3', {\"requires\": [\"editor-para-base\"]});"];
_yuitest_coverage["build/editor-para/editor-para.js"].lines = {"1":0,"14":0,"15":0,"20":0,"27":0,"33":0,"35":0,"36":0,"38":0,"39":0,"42":0,"43":0,"44":0,"45":0,"49":0,"50":0,"51":0,"52":0,"53":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"64":0,"66":0,"69":0,"72":0,"73":0,"77":0,"79":0,"81":0,"82":0,"83":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"94":0,"95":0,"96":0,"97":0,"98":0,"100":0,"101":0,"105":0,"106":0,"108":0,"109":0,"110":0,"112":0,"113":0,"114":0,"115":0,"116":0,"118":0,"119":0,"121":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"131":0,"132":0,"135":0,"136":0,"138":0,"139":0,"140":0,"142":0,"143":0,"147":0,"148":0,"150":0,"153":0,"154":0,"156":0,"157":0,"160":0,"161":0,"163":0,"164":0,"165":0,"166":0,"167":0,"169":0,"172":0,"174":0,"175":0,"176":0,"177":0,"181":0,"185":0,"186":0,"187":0,"188":0,"189":0,"191":0,"192":0,"193":0,"194":0,"197":0,"198":0,"199":0,"201":0,"203":0,"204":0,"206":0,"207":0,"208":0,"210":0,"211":0,"213":0,"214":0,"216":0,"217":0,"218":0,"219":0,"223":0,"224":0,"227":0,"228":0,"229":0,"230":0,"231":0,"232":0,"233":0,"234":0,"235":0,"242":0,"249":0,"250":0,"251":0,"252":0,"254":0,"256":0,"257":0,"258":0,"259":0,"260":0,"267":0,"268":0,"269":0,"270":0,"273":0,"295":0,"297":0};
_yuitest_coverage["build/editor-para/editor-para.js"].functions = {"EditorPara:14":0,"(anonymous 2):138":0,"_onNodeChange:26":0,"initializer:266":0,"(anonymous 1):1":0};
_yuitest_coverage["build/editor-para/editor-para.js"].coveredLines = 158;
_yuitest_coverage["build/editor-para/editor-para.js"].coveredFunctions = 5;
_yuitest_coverline("build/editor-para/editor-para.js", 1);
YUI.add('editor-para', function (Y, NAME) {


    /**
     * Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorPara
     * @extends Plugin.EditorParaBase
     * @constructor
     * @module editor
     * @submodule editor-para
     */


    _yuitest_coverfunc("build/editor-para/editor-para.js", "(anonymous 1)", 1);
_yuitest_coverline("build/editor-para/editor-para.js", 14);
var EditorPara = function() {
        _yuitest_coverfunc("build/editor-para/editor-para.js", "EditorPara", 14);
_yuitest_coverline("build/editor-para/editor-para.js", 15);
EditorPara.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',
    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';


    _yuitest_coverline("build/editor-para/editor-para.js", 20);
Y.extend(EditorPara, Y.Plugin.EditorParaBase, {
        /**
        * nodeChange handler to handle fixing an empty document.
        * @private
        * @method _onNodeChange
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("build/editor-para/editor-para.js", "_onNodeChange", 26);
_yuitest_coverline("build/editor-para/editor-para.js", 27);
var host = this.get(HOST), inst = host.getInstance(),
                html, txt, par , d, sel, btag = inst.EditorSelection.DEFAULT_BLOCK_TAG,
                inHTML, txt2, childs, aNode, node2, top, n, sib, para2, prev,
                ps, br, item, p, imgs, t, LAST_CHILD = ':last-child', para, b, dir,
                lc, lc2, found = false, start;

            _yuitest_coverline("build/editor-para/editor-para.js", 33);
switch (e.changedType) {
                case 'enter-up':
                    _yuitest_coverline("build/editor-para/editor-para.js", 35);
para = ((this._lastPara) ? this._lastPara : e.changedNode);
                    _yuitest_coverline("build/editor-para/editor-para.js", 36);
b = para.one('br.yui-cursor');

                    _yuitest_coverline("build/editor-para/editor-para.js", 38);
if (this._lastPara) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 39);
delete this._lastPara;
                    }

                    _yuitest_coverline("build/editor-para/editor-para.js", 42);
if (b) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 43);
if (b.previous() || b.next()) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 44);
if (b.ancestor(P)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 45);
b.remove();
                            }
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 49);
if (!para.test(btag)) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 50);
para2 = para.ancestor(btag);
                        _yuitest_coverline("build/editor-para/editor-para.js", 51);
if (para2) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 52);
para = para2;
                            _yuitest_coverline("build/editor-para/editor-para.js", 53);
para2 = null;
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 56);
if (para.test(btag)) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 57);
prev = para.previous();
                        _yuitest_coverline("build/editor-para/editor-para.js", 58);
if (prev) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 59);
lc = prev.one(LAST_CHILD);
                            _yuitest_coverline("build/editor-para/editor-para.js", 60);
while (!found) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 61);
if (lc) {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 62);
lc2 = lc.one(LAST_CHILD);
                                    _yuitest_coverline("build/editor-para/editor-para.js", 63);
if (lc2) {
                                        _yuitest_coverline("build/editor-para/editor-para.js", 64);
lc = lc2;
                                    } else {
                                        _yuitest_coverline("build/editor-para/editor-para.js", 66);
found = true;
                                    }
                                } else {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 69);
found = true;
                                }
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 72);
if (lc) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 73);
host.copyStyles(lc, para);
                            }
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 77);
break;
                case 'enter':
                    _yuitest_coverline("build/editor-para/editor-para.js", 79);
if (Y.UA.webkit) {
                        //Webkit doesn't support shift+enter as a BR, this fixes that.
                        _yuitest_coverline("build/editor-para/editor-para.js", 81);
if (e.changedEvent.shiftKey) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 82);
host.execCommand('insertbr');
                            _yuitest_coverline("build/editor-para/editor-para.js", 83);
e.changedEvent.preventDefault();
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 86);
if (e.changedNode.test('li') && !Y.UA.ie) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 87);
html = inst.EditorSelection.getText(e.changedNode);
                        _yuitest_coverline("build/editor-para/editor-para.js", 88);
if (html === '') {
                            _yuitest_coverline("build/editor-para/editor-para.js", 89);
par = e.changedNode.ancestor('ol,ul');
                            _yuitest_coverline("build/editor-para/editor-para.js", 90);
dir = par.getAttribute('dir');
                            _yuitest_coverline("build/editor-para/editor-para.js", 91);
if (dir !== '') {
                                _yuitest_coverline("build/editor-para/editor-para.js", 92);
dir = ' dir = "' + dir + '"';
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 94);
par = e.changedNode.ancestor(inst.EditorSelection.BLOCKS);
                            _yuitest_coverline("build/editor-para/editor-para.js", 95);
d = inst.Node.create('<p' + dir + '>' + inst.EditorSelection.CURSOR + '</p>');
                            _yuitest_coverline("build/editor-para/editor-para.js", 96);
par.insert(d, 'after');
                            _yuitest_coverline("build/editor-para/editor-para.js", 97);
e.changedNode.remove();
                            _yuitest_coverline("build/editor-para/editor-para.js", 98);
e.changedEvent.halt();

                            _yuitest_coverline("build/editor-para/editor-para.js", 100);
sel = new inst.EditorSelection();
                            _yuitest_coverline("build/editor-para/editor-para.js", 101);
sel.selectNode(d, true, false);
                        }
                    }
                    //TODO Move this to a GECKO MODULE - Can't for the moment, requires no change to metadata (YMAIL)
                    _yuitest_coverline("build/editor-para/editor-para.js", 105);
if (Y.UA.gecko && host.get('defaultblock') !== 'p') {
                        _yuitest_coverline("build/editor-para/editor-para.js", 106);
par = e.changedNode;

                        _yuitest_coverline("build/editor-para/editor-para.js", 108);
if (!par.test(LI) && !par.ancestor(LI)) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 109);
if (!par.test(btag)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 110);
par = par.ancestor(btag);
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 112);
d = inst.Node.create('<' + btag + '></' + btag + '>');
                            _yuitest_coverline("build/editor-para/editor-para.js", 113);
par.insert(d, 'after');
                            _yuitest_coverline("build/editor-para/editor-para.js", 114);
sel = new inst.EditorSelection();
                            _yuitest_coverline("build/editor-para/editor-para.js", 115);
if (sel.anchorOffset) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 116);
inHTML = sel.anchorNode.get('textContent');

                                _yuitest_coverline("build/editor-para/editor-para.js", 118);
txt = inst.one(inst.config.doc.createTextNode(inHTML.substr(0, sel.anchorOffset)));
                                _yuitest_coverline("build/editor-para/editor-para.js", 119);
txt2 = inst.one(inst.config.doc.createTextNode(inHTML.substr(sel.anchorOffset)));

                                _yuitest_coverline("build/editor-para/editor-para.js", 121);
aNode = sel.anchorNode;
                                _yuitest_coverline("build/editor-para/editor-para.js", 122);
aNode.setContent(''); //I
                                _yuitest_coverline("build/editor-para/editor-para.js", 123);
node2 = aNode.cloneNode(); //I
                                _yuitest_coverline("build/editor-para/editor-para.js", 124);
node2.append(txt2); //text
                                _yuitest_coverline("build/editor-para/editor-para.js", 125);
top = false;
                                _yuitest_coverline("build/editor-para/editor-para.js", 126);
sib = aNode; //I
                                _yuitest_coverline("build/editor-para/editor-para.js", 127);
while (!top) {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 128);
sib = sib.get(PARENT_NODE); //B
                                    _yuitest_coverline("build/editor-para/editor-para.js", 129);
if (sib && !sib.test(btag)) {
                                        _yuitest_coverline("build/editor-para/editor-para.js", 130);
n = sib.cloneNode();
                                        _yuitest_coverline("build/editor-para/editor-para.js", 131);
n.set('innerHTML', '');
                                        _yuitest_coverline("build/editor-para/editor-para.js", 132);
n.append(node2);

                                        //Get children..
                                        _yuitest_coverline("build/editor-para/editor-para.js", 135);
childs = sib.get('childNodes');
                                        _yuitest_coverline("build/editor-para/editor-para.js", 136);
start = false;
                                        /*jshint loopfunc: true */
                                        _yuitest_coverline("build/editor-para/editor-para.js", 138);
childs.each(function(c) {
                                            _yuitest_coverfunc("build/editor-para/editor-para.js", "(anonymous 2)", 138);
_yuitest_coverline("build/editor-para/editor-para.js", 139);
if (start) {
                                                _yuitest_coverline("build/editor-para/editor-para.js", 140);
n.append(c);
                                            }
                                            _yuitest_coverline("build/editor-para/editor-para.js", 142);
if (c === aNode) {
                                                _yuitest_coverline("build/editor-para/editor-para.js", 143);
start = true;
                                            }
                                        });

                                        _yuitest_coverline("build/editor-para/editor-para.js", 147);
aNode = sib; //Top sibling
                                        _yuitest_coverline("build/editor-para/editor-para.js", 148);
node2 = n;
                                    } else {
                                        _yuitest_coverline("build/editor-para/editor-para.js", 150);
top = true;
                                    }
                                }
                                _yuitest_coverline("build/editor-para/editor-para.js", 153);
txt2 = node2;
                                _yuitest_coverline("build/editor-para/editor-para.js", 154);
sel.anchorNode.append(txt);

                                _yuitest_coverline("build/editor-para/editor-para.js", 156);
if (txt2) {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 157);
d.append(txt2);
                                }
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 160);
if (d.get(FC)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 161);
d = d.get(FC);
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 163);
d.prepend(inst.EditorSelection.CURSOR);
                            _yuitest_coverline("build/editor-para/editor-para.js", 164);
sel.focusCursor(true, true);
                            _yuitest_coverline("build/editor-para/editor-para.js", 165);
html = inst.EditorSelection.getText(d);
                            _yuitest_coverline("build/editor-para/editor-para.js", 166);
if (html !== '') {
                                _yuitest_coverline("build/editor-para/editor-para.js", 167);
inst.EditorSelection.cleanCursor();
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 169);
e.changedEvent.preventDefault();
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 172);
break;
                case 'keyup':
                    _yuitest_coverline("build/editor-para/editor-para.js", 174);
if (Y.UA.gecko) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 175);
if (inst.config.doc && inst.config.doc.body && inst.config.doc.body.innerHTML.length < 20) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 176);
if (!inst.one(FIRST_P)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 177);
this._fixFirstPara();
                            }
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 181);
break;
                case 'backspace-up':
                case 'backspace-down':
                case 'delete-up':
                    _yuitest_coverline("build/editor-para/editor-para.js", 185);
if (!Y.UA.ie) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 186);
ps = inst.all(FIRST_P);
                        _yuitest_coverline("build/editor-para/editor-para.js", 187);
item = inst.one(BODY);
                        _yuitest_coverline("build/editor-para/editor-para.js", 188);
if (ps.item(0)) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 189);
item = ps.item(0);
                        }
                        _yuitest_coverline("build/editor-para/editor-para.js", 191);
br = item.one('br');
                        _yuitest_coverline("build/editor-para/editor-para.js", 192);
if (br) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 193);
br.removeAttribute('id');
                            _yuitest_coverline("build/editor-para/editor-para.js", 194);
br.removeAttribute('class');
                        }

                        _yuitest_coverline("build/editor-para/editor-para.js", 197);
txt = inst.EditorSelection.getText(item);
                        _yuitest_coverline("build/editor-para/editor-para.js", 198);
txt = txt.replace(/ /g, '').replace(/\n/g, '');
                        _yuitest_coverline("build/editor-para/editor-para.js", 199);
imgs = item.all('img');

                        _yuitest_coverline("build/editor-para/editor-para.js", 201);
if (txt.length === 0 && !imgs.size()) {
                            //God this is horrible..
                            _yuitest_coverline("build/editor-para/editor-para.js", 203);
if (!item.test(P)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 204);
this._fixFirstPara();
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 206);
p = null;
                            _yuitest_coverline("build/editor-para/editor-para.js", 207);
if (e.changedNode && e.changedNode.test(P)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 208);
p = e.changedNode;
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 210);
if (!p && host._lastPara && host._lastPara.inDoc()) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 211);
p = host._lastPara;
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 213);
if (p && !p.test(P)) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 214);
p = p.ancestor(P);
                            }
                            _yuitest_coverline("build/editor-para/editor-para.js", 216);
if (p) {
                                _yuitest_coverline("build/editor-para/editor-para.js", 217);
if (!p.previous() && p.get(PARENT_NODE) && p.get(PARENT_NODE).test(BODY)) {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 218);
e.changedEvent.frameEvent.halt();
                                    _yuitest_coverline("build/editor-para/editor-para.js", 219);
e.preventDefault();
                                }
                            }
                        }
                        _yuitest_coverline("build/editor-para/editor-para.js", 223);
if (Y.UA.webkit) {
                            _yuitest_coverline("build/editor-para/editor-para.js", 224);
if (e.changedNode) {
                                //All backspace calls in Webkit need a preventDefault to
                                //stop history navigation #2531299
                                _yuitest_coverline("build/editor-para/editor-para.js", 227);
e.preventDefault();
                                _yuitest_coverline("build/editor-para/editor-para.js", 228);
item = e.changedNode;
                                _yuitest_coverline("build/editor-para/editor-para.js", 229);
if (item.test('li') && (!item.previous() && !item.next())) {
                                    _yuitest_coverline("build/editor-para/editor-para.js", 230);
html = item.get('innerHTML').replace(BR, '');
                                    _yuitest_coverline("build/editor-para/editor-para.js", 231);
if (html === '') {
                                        _yuitest_coverline("build/editor-para/editor-para.js", 232);
if (item.get(PARENT_NODE)) {
                                            _yuitest_coverline("build/editor-para/editor-para.js", 233);
item.get(PARENT_NODE).replace(inst.Node.create(BR));
                                            _yuitest_coverline("build/editor-para/editor-para.js", 234);
e.changedEvent.frameEvent.halt();
                                            _yuitest_coverline("build/editor-para/editor-para.js", 235);
inst.EditorSelection.filterBlocks();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 242);
if (Y.UA.gecko) {
                        /*
                        * This forced FF to redraw the content on backspace.
                        * On some occasions FF will leave a cursor residue after content has been deleted.
                        * Dropping in the empty textnode and then removing it causes FF to redraw and
                        * remove the "ghost cursors"
                        */
                        _yuitest_coverline("build/editor-para/editor-para.js", 249);
d = e.changedNode;
                        _yuitest_coverline("build/editor-para/editor-para.js", 250);
t = inst.config.doc.createTextNode(' ');
                        _yuitest_coverline("build/editor-para/editor-para.js", 251);
d.appendChild(t);
                        _yuitest_coverline("build/editor-para/editor-para.js", 252);
d.removeChild(t);
                    }
                    _yuitest_coverline("build/editor-para/editor-para.js", 254);
break;
            }
            _yuitest_coverline("build/editor-para/editor-para.js", 256);
if (Y.UA.gecko) {
                _yuitest_coverline("build/editor-para/editor-para.js", 257);
if (e.changedNode && !e.changedNode.test(btag)) {
                    _yuitest_coverline("build/editor-para/editor-para.js", 258);
p = e.changedNode.ancestor(btag);
                    _yuitest_coverline("build/editor-para/editor-para.js", 259);
if (p) {
                        _yuitest_coverline("build/editor-para/editor-para.js", 260);
this._lastPara = p;
                    }
                }
            }

        },
        initializer: function() {
            _yuitest_coverfunc("build/editor-para/editor-para.js", "initializer", 266);
_yuitest_coverline("build/editor-para/editor-para.js", 267);
var host = this.get(HOST);
            _yuitest_coverline("build/editor-para/editor-para.js", 268);
if (host.editorBR) {
                _yuitest_coverline("build/editor-para/editor-para.js", 269);
Y.error('Can not plug EditorPara and EditorBR at the same time.');
                _yuitest_coverline("build/editor-para/editor-para.js", 270);
return;
            }

            _yuitest_coverline("build/editor-para/editor-para.js", 273);
host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorPara',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorPara',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    _yuitest_coverline("build/editor-para/editor-para.js", 295);
Y.namespace('Plugin');

    _yuitest_coverline("build/editor-para/editor-para.js", 297);
Y.Plugin.EditorPara = EditorPara;



}, '3.7.3', {"requires": ["editor-para-base"]});
