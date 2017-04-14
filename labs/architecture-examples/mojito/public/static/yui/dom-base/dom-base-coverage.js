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
_yuitest_coverage["build/dom-base/dom-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/dom-base/dom-base.js",
    code: []
};
_yuitest_coverage["build/dom-base/dom-base.js"].code=["YUI.add('dom-base', function (Y, NAME) {","","/**","* @for DOM","* @module dom","*/","var documentElement = Y.config.doc.documentElement,","    Y_DOM = Y.DOM,","    TAG_NAME = 'tagName',","    OWNER_DOCUMENT = 'ownerDocument',","    EMPTY_STRING = '',","    addFeature = Y.Features.add,","    testFeature = Y.Features.test;","","Y.mix(Y_DOM, {","    /**","     * Returns the text content of the HTMLElement. ","     * @method getText         ","     * @param {HTMLElement} element The html element. ","     * @return {String} The text content of the element (includes text of any descending elements).","     */","    getText: (documentElement.textContent !== undefined) ?","        function(element) {","            var ret = '';","            if (element) {","                ret = element.textContent;","            }","            return ret || '';","        } : function(element) {","            var ret = '';","            if (element) {","                ret = element.innerText || element.nodeValue; // might be a textNode","            }","            return ret || '';","        },","","    /**","     * Sets the text content of the HTMLElement. ","     * @method setText         ","     * @param {HTMLElement} element The html element. ","     * @param {String} content The content to add. ","     */","    setText: (documentElement.textContent !== undefined) ?","        function(element, content) {","            if (element) {","                element.textContent = content;","            }","        } : function(element, content) {","            if ('innerText' in element) {","                element.innerText = content;","            } else if ('nodeValue' in element) {","                element.nodeValue = content;","            }","    },","","    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8","        'for': 'htmlFor',","        'class': 'className'","    } : { // w3c","        'htmlFor': 'for',","        'className': 'class'","    },","","    /**","     * Provides a normalized attribute interface. ","     * @method setAttribute","     * @param {HTMLElement} el The target element for the attribute.","     * @param {String} attr The attribute to set.","     * @param {String} val The value of the attribute.","     */","    setAttribute: function(el, attr, val, ieAttr) {","        if (el && attr && el.setAttribute) {","            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;","            el.setAttribute(attr, val, ieAttr);","        }","    },","","","    /**","     * Provides a normalized attribute interface. ","     * @method getAttribute","     * @param {HTMLElement} el The target element for the attribute.","     * @param {String} attr The attribute to get.","     * @return {String} The current value of the attribute. ","     */","    getAttribute: function(el, attr, ieAttr) {","        ieAttr = (ieAttr !== undefined) ? ieAttr : 2;","        var ret = '';","        if (el && attr && el.getAttribute) {","            attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;","            ret = el.getAttribute(attr, ieAttr);","","            if (ret === null) {","                ret = ''; // per DOM spec","            }","        }","        return ret;","    },","","    VALUE_SETTERS: {},","","    VALUE_GETTERS: {},","","    getValue: function(node) {","        var ret = '', // TODO: return null?","            getter;","","        if (node && node[TAG_NAME]) {","            getter = Y_DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];","","            if (getter) {","                ret = getter(node);","            } else {","                ret = node.value;","            }","        }","","        // workaround for IE8 JSON stringify bug","        // which converts empty string values to null","        if (ret === EMPTY_STRING) {","            ret = EMPTY_STRING; // for real","        }","","        return (typeof ret === 'string') ? ret : '';","    },","","    setValue: function(node, val) {","        var setter;","","        if (node && node[TAG_NAME]) {","            setter = Y_DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];","","            if (setter) {","                setter(node, val);","            } else {","                node.value = val;","            }","        }","    },","","    creators: {}","});","","addFeature('value-set', 'select', {","    test: function() {","        var node = Y.config.doc.createElement('select');","        node.innerHTML = '<option>1</option><option>2</option>';","        node.value = '2';","        return (node.value && node.value === '2');","    }","});","","if (!testFeature('value-set', 'select')) {","    Y_DOM.VALUE_SETTERS.select = function(node, val) {","        for (var i = 0, options = node.getElementsByTagName('option'), option;","                option = options[i++];) {","            if (Y_DOM.getValue(option) === val) {","                option.selected = true;","                //Y_DOM.setAttribute(option, 'selected', 'selected');","                break;","            }","        }","    };","}","","Y.mix(Y_DOM.VALUE_GETTERS, {","    button: function(node) {","        return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';","    }","});","","Y.mix(Y_DOM.VALUE_SETTERS, {","    // IE: node.value changes the button text, which should be handled via innerHTML","    button: function(node, val) {","        var attr = node.attributes.value;","        if (!attr) {","            attr = node[OWNER_DOCUMENT].createAttribute('value');","            node.setAttributeNode(attr);","        }","","        attr.value = val;","    }","});","","","Y.mix(Y_DOM.VALUE_GETTERS, {","    option: function(node) {","        var attrs = node.attributes;","        return (attrs.value && attrs.value.specified) ? node.value : node.text;","    },","","    select: function(node) {","        var val = node.value,","            options = node.options;","","        if (options && options.length) {","            // TODO: implement multipe select","            if (node.multiple) {","            } else if (node.selectedIndex > -1) {","                val = Y_DOM.getValue(options[node.selectedIndex]);","            }","        }","","        return val;","    }","});","var addClass, hasClass, removeClass;","","Y.mix(Y.DOM, {","    /**","     * Determines whether a DOM element has the given className.","     * @method hasClass","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to search for","     * @return {Boolean} Whether or not the element has the given class. ","     */","    hasClass: function(node, className) {","        var re = Y.DOM._getRegExp('(?:^|\\\\s+)' + className + '(?:\\\\s+|$)');","        return re.test(node.className);","    },","","    /**","     * Adds a class name to a given DOM element.","     * @method addClass         ","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to add to the class attribute","     */","    addClass: function(node, className) {","        if (!Y.DOM.hasClass(node, className)) { // skip if already present ","            node.className = Y.Lang.trim([node.className, className].join(' '));","        }","    },","","    /**","     * Removes a class name from a given element.","     * @method removeClass         ","     * @for DOM","     * @param {HTMLElement} element The DOM element. ","     * @param {String} className the class name to remove from the class attribute","     */","    removeClass: function(node, className) {","        if (className && hasClass(node, className)) {","            node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\\\s+)' +","                            className + '(?:\\\\s+|$)'), ' '));","","            if ( hasClass(node, className) ) { // in case of multiple adjacent","                removeClass(node, className);","            }","        }                 ","    },","","    /**","     * Replace a class with another class for a given element.","     * If no oldClassName is present, the newClassName is simply added.","     * @method replaceClass  ","     * @for DOM","     * @param {HTMLElement} element The DOM element ","     * @param {String} oldClassName the class name to be replaced","     * @param {String} newClassName the class name that will be replacing the old class name","     */","    replaceClass: function(node, oldC, newC) {","        removeClass(node, oldC); // remove first in case oldC === newC","        addClass(node, newC);","    },","","    /**","     * If the className exists on the node it is removed, if it doesn't exist it is added.","     * @method toggleClass  ","     * @for DOM","     * @param {HTMLElement} element The DOM element","     * @param {String} className the class name to be toggled","     * @param {Boolean} addClass optional boolean to indicate whether class","     * should be added or removed regardless of current state","     */","    toggleClass: function(node, className, force) {","        var add = (force !== undefined) ? force :","                !(hasClass(node, className));","","        if (add) {","            addClass(node, className);","        } else {","            removeClass(node, className);","        }","    }","});","","hasClass = Y.DOM.hasClass;","removeClass = Y.DOM.removeClass;","addClass = Y.DOM.addClass;","","var re_tag = /<([a-z]+)/i,","","    Y_DOM = Y.DOM,","","    addFeature = Y.Features.add,","    testFeature = Y.Features.test,","","    creators = {},","","    createFromDIV = function(html, tag) {","        var div = Y.config.doc.createElement('div'),","            ret = true;","","        div.innerHTML = html;","        if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {","            ret = false;","        }","","        return ret;","    },","","    re_tbody = /(?:\\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\\s*<tbody/,","","    TABLE_OPEN = '<table>',","    TABLE_CLOSE = '</table>';","","Y.mix(Y.DOM, {","    _fragClones: {},","","    _create: function(html, doc, tag) {","        tag = tag || 'div';","","        var frag = Y_DOM._fragClones[tag];","        if (frag) {","            frag = frag.cloneNode(false);","        } else {","            frag = Y_DOM._fragClones[tag] = doc.createElement(tag);","        }","        frag.innerHTML = html;","        return frag;","    },","","    _children: function(node, tag) {","            var i = 0,","            children = node.children,","            childNodes,","            hasComments,","            child;","","        if (children && children.tags) { // use tags filter when possible","            if (tag) {","                children = node.children.tags(tag);","            } else { // IE leaks comments into children","                hasComments = children.tags('!').length;","            }","        }","        ","        if (!children || (!children.tags && tag) || hasComments) {","            childNodes = children || node.childNodes;","            children = [];","            while ((child = childNodes[i++])) {","                if (child.nodeType === 1) {","                    if (!tag || tag === child.tagName) {","                        children.push(child);","                    }","                }","            }","        }","","        return children || [];","    },","","    /**","     * Creates a new dom node using the provided markup string. ","     * @method create","     * @param {String} html The markup used to create the element","     * @param {HTMLDocument} doc An optional document context ","     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement ","     * when creating one node, and a documentFragment when creating","     * multiple nodes.","     */","    create: function(html, doc) {","        if (typeof html === 'string') {","            html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML","","        }","","        doc = doc || Y.config.doc;","        var m = re_tag.exec(html),","            create = Y_DOM._create,","            custom = creators,","            ret = null,","            creator,","            tag, nodes;","","        if (html != undefined) { // not undefined or null","            if (m && m[1]) {","                creator = custom[m[1].toLowerCase()];","                if (typeof creator === 'function') {","                    create = creator; ","                } else {","                    tag = creator;","                }","            }","","            nodes = create(html, doc, tag).childNodes;","","            if (nodes.length === 1) { // return single node, breaking parentNode ref from \"fragment\"","                ret = nodes[0].parentNode.removeChild(nodes[0]);","            } else if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)","                if (nodes.length === 2) {","                    ret = nodes[0].nextSibling;","                } else {","                    nodes[0].parentNode.removeChild(nodes[0]); ","                    ret = Y_DOM._nl2frag(nodes, doc);","                }","            } else { // return multiple nodes as a fragment","                 ret = Y_DOM._nl2frag(nodes, doc);","            }","","        }","","        return ret;","    },","","    _nl2frag: function(nodes, doc) {","        var ret = null,","            i, len;","","        if (nodes && (nodes.push || nodes.item) && nodes[0]) {","            doc = doc || nodes[0].ownerDocument; ","            ret = doc.createDocumentFragment();","","            if (nodes.item) { // convert live list to static array","                nodes = Y.Array(nodes, 0, true);","            }","","            for (i = 0, len = nodes.length; i < len; i++) {","                ret.appendChild(nodes[i]); ","            }","        } // else inline with log for minification","        return ret;","    },","","    /**","     * Inserts content in a node at the given location ","     * @method addHTML","     * @param {HTMLElement} node The node to insert into","     * @param {HTMLElement | Array | HTMLCollection} content The content to be inserted ","     * @param {HTMLElement} where Where to insert the content","     * If no \"where\" is given, content is appended to the node","     * Possible values for \"where\"","     * <dl>","     * <dt>HTMLElement</dt>","     * <dd>The element to insert before</dd>","     * <dt>\"replace\"</dt>","     * <dd>Replaces the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts before the existing HTML</dd>","     * <dt>\"before\"</dt>","     * <dd>Inserts content before the node</dd>","     * <dt>\"after\"</dt>","     * <dd>Inserts content after the node</dd>","     * </dl>","     */","    addHTML: function(node, content, where) {","        var nodeParent = node.parentNode,","            i = 0,","            item,","            ret = content,","            newNode;","            ","","        if (content != undefined) { // not null or undefined (maybe 0)","            if (content.nodeType) { // DOM node, just add it","                newNode = content;","            } else if (typeof content == 'string' || typeof content == 'number') {","                ret = newNode = Y_DOM.create(content);","            } else if (content[0] && content[0].nodeType) { // array or collection ","                newNode = Y.config.doc.createDocumentFragment();","                while ((item = content[i++])) {","                    newNode.appendChild(item); // append to fragment for insertion","                }","            }","        }","","        if (where) {","            if (newNode && where.parentNode) { // insert regardless of relationship to node","                where.parentNode.insertBefore(newNode, where);","            } else {","                switch (where) {","                    case 'replace':","                        while (node.firstChild) {","                            node.removeChild(node.firstChild);","                        }","                        if (newNode) { // allow empty content to clear node","                            node.appendChild(newNode);","                        }","                        break;","                    case 'before':","                        if (newNode) {","                            nodeParent.insertBefore(newNode, node);","                        }","                        break;","                    case 'after':","                        if (newNode) {","                            if (node.nextSibling) { // IE errors if refNode is null","                                nodeParent.insertBefore(newNode, node.nextSibling);","                            } else {","                                nodeParent.appendChild(newNode);","                            }","                        }","                        break;","                    default:","                        if (newNode) {","                            node.appendChild(newNode);","                        }","                }","            }","        } else if (newNode) {","            node.appendChild(newNode);","        }","","        return ret;","    },","","    wrap: function(node, html) {","        var parent = (html && html.nodeType) ? html : Y.DOM.create(html),","            nodes = parent.getElementsByTagName('*');","","        if (nodes.length) {","            parent = nodes[nodes.length - 1];","        }","","        if (node.parentNode) { ","            node.parentNode.replaceChild(parent, node);","        }","        parent.appendChild(node);","    },","","    unwrap: function(node) {","        var parent = node.parentNode,","            lastChild = parent.lastChild,","            next = node,","            grandparent;","","        if (parent) {","            grandparent = parent.parentNode;","            if (grandparent) {","                node = parent.firstChild;","                while (node !== lastChild) {","                    next = node.nextSibling;","                    grandparent.insertBefore(node, parent);","                    node = next;","                }","                grandparent.replaceChild(lastChild, parent);","            } else {","                parent.removeChild(node);","            }","        }","    }","});","","addFeature('innerhtml', 'table', {","    test: function() {","        var node = Y.config.doc.createElement('table');","        try {","            node.innerHTML = '<tbody></tbody>';","        } catch(e) {","            return false;","        }","        return (node.firstChild && node.firstChild.nodeName === 'TBODY');","    }","});","","addFeature('innerhtml-div', 'tr', {","    test: function() {","        return createFromDIV('<tr></tr>', 'tr');","    }","});","","addFeature('innerhtml-div', 'script', {","    test: function() {","        return createFromDIV('<script></script>', 'script');","    }","});","","if (!testFeature('innerhtml', 'table')) {","    // TODO: thead/tfoot with nested tbody","        // IE adds TBODY when creating TABLE elements (which may share this impl)","    creators.tbody = function(html, doc) {","        var frag = Y_DOM.create(TABLE_OPEN + html + TABLE_CLOSE, doc),","            tb = Y.DOM._children(frag, 'tbody')[0];","","        if (frag.children.length > 1 && tb && !re_tbody.test(html)) {","            tb.parentNode.removeChild(tb); // strip extraneous tbody","        }","        return frag;","    };","}","","if (!testFeature('innerhtml-div', 'script')) {","    creators.script = function(html, doc) {","        var frag = doc.createElement('div');","","        frag.innerHTML = '-' + html;","        frag.removeChild(frag.firstChild);","        return frag;","    };","","    creators.link = creators.style = creators.script;","}","","if (!testFeature('innerhtml-div', 'tr')) {","    Y.mix(creators, {","        option: function(html, doc) {","            return Y_DOM.create('<select><option class=\"yui3-big-dummy\" selected></option>' + html + '</select>', doc);","        },","","        tr: function(html, doc) {","            return Y_DOM.create('<tbody>' + html + '</tbody>', doc);","        },","","        td: function(html, doc) {","            return Y_DOM.create('<tr>' + html + '</tr>', doc);","        }, ","","        col: function(html, doc) {","            return Y_DOM.create('<colgroup>' + html + '</colgroup>', doc);","        }, ","","        tbody: 'table'","    });","","    Y.mix(creators, {","        legend: 'fieldset',","        th: creators.td,","        thead: creators.tbody,","        tfoot: creators.tbody,","        caption: creators.tbody,","        colgroup: creators.tbody,","        optgroup: creators.option","    });","}","","Y_DOM.creators = creators;","Y.mix(Y.DOM, {","    /**","     * Sets the width of the element to the given size, regardless","     * of box model, border, padding, etc.","     * @method setWidth","     * @param {HTMLElement} element The DOM element. ","     * @param {String|Number} size The pixel height to size to","     */","","    setWidth: function(node, size) {","        Y.DOM._setSize(node, 'width', size);","    },","","    /**","     * Sets the height of the element to the given size, regardless","     * of box model, border, padding, etc.","     * @method setHeight","     * @param {HTMLElement} element The DOM element. ","     * @param {String|Number} size The pixel height to size to","     */","","    setHeight: function(node, size) {","        Y.DOM._setSize(node, 'height', size);","    },","","    _setSize: function(node, prop, val) {","        val = (val > 0) ? val : 0;","        var size = 0;","","        node.style[prop] = val + 'px';","        size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;","","        if (size > val) {","            val = val - (size - val);","","            if (val < 0) {","                val = 0;","            }","","            node.style[prop] = val + 'px';","        }","    }","});","","","}, '3.7.3', {\"requires\": [\"dom-core\"]});"];
_yuitest_coverage["build/dom-base/dom-base.js"].lines = {"1":0,"7":0,"15":0,"24":0,"25":0,"26":0,"28":0,"30":0,"31":0,"32":0,"34":0,"45":0,"46":0,"49":0,"50":0,"51":0,"52":0,"72":0,"73":0,"74":0,"87":0,"88":0,"89":0,"90":0,"91":0,"93":0,"94":0,"97":0,"105":0,"108":0,"109":0,"111":0,"112":0,"114":0,"120":0,"121":0,"124":0,"128":0,"130":0,"131":0,"133":0,"134":0,"136":0,"144":0,"146":0,"147":0,"148":0,"149":0,"153":0,"154":0,"155":0,"157":0,"158":0,"160":0,"166":0,"168":0,"172":0,"175":0,"176":0,"177":0,"178":0,"181":0,"186":0,"188":0,"189":0,"193":0,"196":0,"198":0,"199":0,"200":0,"204":0,"207":0,"209":0,"219":0,"220":0,"231":0,"232":0,"244":0,"245":0,"248":0,"249":0,"264":0,"265":0,"278":0,"281":0,"282":0,"284":0,"289":0,"290":0,"291":0,"293":0,"303":0,"306":0,"307":0,"308":0,"311":0,"319":0,"323":0,"325":0,"326":0,"327":0,"329":0,"331":0,"332":0,"336":0,"342":0,"343":0,"344":0,"346":0,"350":0,"351":0,"352":0,"353":0,"354":0,"355":0,"356":0,"362":0,"375":0,"376":0,"380":0,"381":0,"388":0,"389":0,"390":0,"391":0,"392":0,"394":0,"398":0,"400":0,"401":0,"402":0,"403":0,"404":0,"406":0,"407":0,"410":0,"415":0,"419":0,"422":0,"423":0,"424":0,"426":0,"427":0,"430":0,"431":0,"434":0,"459":0,"466":0,"467":0,"468":0,"469":0,"470":0,"471":0,"472":0,"473":0,"474":0,"479":0,"480":0,"481":0,"483":0,"485":0,"486":0,"488":0,"489":0,"491":0,"493":0,"494":0,"496":0,"498":0,"499":0,"500":0,"502":0,"505":0,"507":0,"508":0,"512":0,"513":0,"516":0,"520":0,"523":0,"524":0,"527":0,"528":0,"530":0,"534":0,"539":0,"540":0,"541":0,"542":0,"543":0,"544":0,"545":0,"546":0,"548":0,"550":0,"556":0,"558":0,"559":0,"560":0,"562":0,"564":0,"568":0,"570":0,"574":0,"576":0,"580":0,"583":0,"584":0,"587":0,"588":0,"590":0,"594":0,"595":0,"596":0,"598":0,"599":0,"600":0,"603":0,"606":0,"607":0,"609":0,"613":0,"617":0,"621":0,"627":0,"638":0,"639":0,"649":0,"661":0,"665":0,"666":0,"668":0,"669":0,"671":0,"672":0,"674":0,"675":0,"678":0};
_yuitest_coverage["build/dom-base/dom-base.js"].functions = {"(anonymous 2):23":0,"}:29":0,"(anonymous 3):44":0,"}:48":0,"setAttribute:71":0,"getAttribute:86":0,"getValue:104":0,"setValue:127":0,"test:145":0,"select:154":0,"button:167":0,"button:174":0,"option:187":0,"select:192":0,"hasClass:218":0,"addClass:230":0,"removeClass:243":0,"replaceClass:263":0,"toggleClass:277":0,"createFromDIV:302":0,"_create:322":0,"_children:335":0,"create:374":0,"_nl2frag:418":0,"addHTML:458":0,"wrap:519":0,"unwrap:533":0,"test:557":0,"test:569":0,"test:575":0,"tbody:583":0,"script:595":0,"option:608":0,"tr:612":0,"td:616":0,"col:620":0,"setWidth:648":0,"setHeight:660":0,"_setSize:664":0,"(anonymous 1):1":0};
_yuitest_coverage["build/dom-base/dom-base.js"].coveredLines = 238;
_yuitest_coverage["build/dom-base/dom-base.js"].coveredFunctions = 40;
_yuitest_coverline("build/dom-base/dom-base.js", 1);
YUI.add('dom-base', function (Y, NAME) {

/**
* @for DOM
* @module dom
*/
_yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/dom-base/dom-base.js", 7);
var documentElement = Y.config.doc.documentElement,
    Y_DOM = Y.DOM,
    TAG_NAME = 'tagName',
    OWNER_DOCUMENT = 'ownerDocument',
    EMPTY_STRING = '',
    addFeature = Y.Features.add,
    testFeature = Y.Features.test;

_yuitest_coverline("build/dom-base/dom-base.js", 15);
Y.mix(Y_DOM, {
    /**
     * Returns the text content of the HTMLElement. 
     * @method getText         
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText: (documentElement.textContent !== undefined) ?
        function(element) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 2)", 23);
_yuitest_coverline("build/dom-base/dom-base.js", 24);
var ret = '';
            _yuitest_coverline("build/dom-base/dom-base.js", 25);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 26);
ret = element.textContent;
            }
            _yuitest_coverline("build/dom-base/dom-base.js", 28);
return ret || '';
        } : function(element) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "}", 29);
_yuitest_coverline("build/dom-base/dom-base.js", 30);
var ret = '';
            _yuitest_coverline("build/dom-base/dom-base.js", 31);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 32);
ret = element.innerText || element.nodeValue; // might be a textNode
            }
            _yuitest_coverline("build/dom-base/dom-base.js", 34);
return ret || '';
        },

    /**
     * Sets the text content of the HTMLElement. 
     * @method setText         
     * @param {HTMLElement} element The html element. 
     * @param {String} content The content to add. 
     */
    setText: (documentElement.textContent !== undefined) ?
        function(element, content) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "(anonymous 3)", 44);
_yuitest_coverline("build/dom-base/dom-base.js", 45);
if (element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 46);
element.textContent = content;
            }
        } : function(element, content) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "}", 48);
_yuitest_coverline("build/dom-base/dom-base.js", 49);
if ('innerText' in element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 50);
element.innerText = content;
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 51);
if ('nodeValue' in element) {
                _yuitest_coverline("build/dom-base/dom-base.js", 52);
element.nodeValue = content;
            }}
    },

    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8
        'for': 'htmlFor',
        'class': 'className'
    } : { // w3c
        'htmlFor': 'for',
        'className': 'class'
    },

    /**
     * Provides a normalized attribute interface. 
     * @method setAttribute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to set.
     * @param {String} val The value of the attribute.
     */
    setAttribute: function(el, attr, val, ieAttr) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setAttribute", 71);
_yuitest_coverline("build/dom-base/dom-base.js", 72);
if (el && attr && el.setAttribute) {
            _yuitest_coverline("build/dom-base/dom-base.js", 73);
attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            _yuitest_coverline("build/dom-base/dom-base.js", 74);
el.setAttribute(attr, val, ieAttr);
        }
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttribute
     * @param {HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr, ieAttr) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "getAttribute", 86);
_yuitest_coverline("build/dom-base/dom-base.js", 87);
ieAttr = (ieAttr !== undefined) ? ieAttr : 2;
        _yuitest_coverline("build/dom-base/dom-base.js", 88);
var ret = '';
        _yuitest_coverline("build/dom-base/dom-base.js", 89);
if (el && attr && el.getAttribute) {
            _yuitest_coverline("build/dom-base/dom-base.js", 90);
attr = Y_DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            _yuitest_coverline("build/dom-base/dom-base.js", 91);
ret = el.getAttribute(attr, ieAttr);

            _yuitest_coverline("build/dom-base/dom-base.js", 93);
if (ret === null) {
                _yuitest_coverline("build/dom-base/dom-base.js", 94);
ret = ''; // per DOM spec
            }
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 97);
return ret;
    },

    VALUE_SETTERS: {},

    VALUE_GETTERS: {},

    getValue: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "getValue", 104);
_yuitest_coverline("build/dom-base/dom-base.js", 105);
var ret = '', // TODO: return null?
            getter;

        _yuitest_coverline("build/dom-base/dom-base.js", 108);
if (node && node[TAG_NAME]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 109);
getter = Y_DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];

            _yuitest_coverline("build/dom-base/dom-base.js", 111);
if (getter) {
                _yuitest_coverline("build/dom-base/dom-base.js", 112);
ret = getter(node);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 114);
ret = node.value;
            }
        }

        // workaround for IE8 JSON stringify bug
        // which converts empty string values to null
        _yuitest_coverline("build/dom-base/dom-base.js", 120);
if (ret === EMPTY_STRING) {
            _yuitest_coverline("build/dom-base/dom-base.js", 121);
ret = EMPTY_STRING; // for real
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 124);
return (typeof ret === 'string') ? ret : '';
    },

    setValue: function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setValue", 127);
_yuitest_coverline("build/dom-base/dom-base.js", 128);
var setter;

        _yuitest_coverline("build/dom-base/dom-base.js", 130);
if (node && node[TAG_NAME]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 131);
setter = Y_DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];

            _yuitest_coverline("build/dom-base/dom-base.js", 133);
if (setter) {
                _yuitest_coverline("build/dom-base/dom-base.js", 134);
setter(node, val);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 136);
node.value = val;
            }
        }
    },

    creators: {}
});

_yuitest_coverline("build/dom-base/dom-base.js", 144);
addFeature('value-set', 'select', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 145);
_yuitest_coverline("build/dom-base/dom-base.js", 146);
var node = Y.config.doc.createElement('select');
        _yuitest_coverline("build/dom-base/dom-base.js", 147);
node.innerHTML = '<option>1</option><option>2</option>';
        _yuitest_coverline("build/dom-base/dom-base.js", 148);
node.value = '2';
        _yuitest_coverline("build/dom-base/dom-base.js", 149);
return (node.value && node.value === '2');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 153);
if (!testFeature('value-set', 'select')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 154);
Y_DOM.VALUE_SETTERS.select = function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "select", 154);
_yuitest_coverline("build/dom-base/dom-base.js", 155);
for (var i = 0, options = node.getElementsByTagName('option'), option;
                option = options[i++];) {
            _yuitest_coverline("build/dom-base/dom-base.js", 157);
if (Y_DOM.getValue(option) === val) {
                _yuitest_coverline("build/dom-base/dom-base.js", 158);
option.selected = true;
                //Y_DOM.setAttribute(option, 'selected', 'selected');
                _yuitest_coverline("build/dom-base/dom-base.js", 160);
break;
            }
        }
    };
}

_yuitest_coverline("build/dom-base/dom-base.js", 166);
Y.mix(Y_DOM.VALUE_GETTERS, {
    button: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "button", 167);
_yuitest_coverline("build/dom-base/dom-base.js", 168);
return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 172);
Y.mix(Y_DOM.VALUE_SETTERS, {
    // IE: node.value changes the button text, which should be handled via innerHTML
    button: function(node, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "button", 174);
_yuitest_coverline("build/dom-base/dom-base.js", 175);
var attr = node.attributes.value;
        _yuitest_coverline("build/dom-base/dom-base.js", 176);
if (!attr) {
            _yuitest_coverline("build/dom-base/dom-base.js", 177);
attr = node[OWNER_DOCUMENT].createAttribute('value');
            _yuitest_coverline("build/dom-base/dom-base.js", 178);
node.setAttributeNode(attr);
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 181);
attr.value = val;
    }
});


_yuitest_coverline("build/dom-base/dom-base.js", 186);
Y.mix(Y_DOM.VALUE_GETTERS, {
    option: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "option", 187);
_yuitest_coverline("build/dom-base/dom-base.js", 188);
var attrs = node.attributes;
        _yuitest_coverline("build/dom-base/dom-base.js", 189);
return (attrs.value && attrs.value.specified) ? node.value : node.text;
    },

    select: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "select", 192);
_yuitest_coverline("build/dom-base/dom-base.js", 193);
var val = node.value,
            options = node.options;

        _yuitest_coverline("build/dom-base/dom-base.js", 196);
if (options && options.length) {
            // TODO: implement multipe select
            _yuitest_coverline("build/dom-base/dom-base.js", 198);
if (node.multiple) {
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 199);
if (node.selectedIndex > -1) {
                _yuitest_coverline("build/dom-base/dom-base.js", 200);
val = Y_DOM.getValue(options[node.selectedIndex]);
            }}
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 204);
return val;
    }
});
_yuitest_coverline("build/dom-base/dom-base.js", 207);
var addClass, hasClass, removeClass;

_yuitest_coverline("build/dom-base/dom-base.js", 209);
Y.mix(Y.DOM, {
    /**
     * Determines whether a DOM element has the given className.
     * @method hasClass
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasClass: function(node, className) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "hasClass", 218);
_yuitest_coverline("build/dom-base/dom-base.js", 219);
var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        _yuitest_coverline("build/dom-base/dom-base.js", 220);
return re.test(node.className);
    },

    /**
     * Adds a class name to a given DOM element.
     * @method addClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addClass: function(node, className) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "addClass", 230);
_yuitest_coverline("build/dom-base/dom-base.js", 231);
if (!Y.DOM.hasClass(node, className)) { // skip if already present 
            _yuitest_coverline("build/dom-base/dom-base.js", 232);
node.className = Y.Lang.trim([node.className, className].join(' '));
        }
    },

    /**
     * Removes a class name from a given element.
     * @method removeClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeClass: function(node, className) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "removeClass", 243);
_yuitest_coverline("build/dom-base/dom-base.js", 244);
if (className && hasClass(node, className)) {
            _yuitest_coverline("build/dom-base/dom-base.js", 245);
node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' '));

            _yuitest_coverline("build/dom-base/dom-base.js", 248);
if ( hasClass(node, className) ) { // in case of multiple adjacent
                _yuitest_coverline("build/dom-base/dom-base.js", 249);
removeClass(node, className);
            }
        }                 
    },

    /**
     * Replace a class with another class for a given element.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element 
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     */
    replaceClass: function(node, oldC, newC) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "replaceClass", 263);
_yuitest_coverline("build/dom-base/dom-base.js", 264);
removeClass(node, oldC); // remove first in case oldC === newC
        _yuitest_coverline("build/dom-base/dom-base.js", 265);
addClass(node, newC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element
     * @param {String} className the class name to be toggled
     * @param {Boolean} addClass optional boolean to indicate whether class
     * should be added or removed regardless of current state
     */
    toggleClass: function(node, className, force) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "toggleClass", 277);
_yuitest_coverline("build/dom-base/dom-base.js", 278);
var add = (force !== undefined) ? force :
                !(hasClass(node, className));

        _yuitest_coverline("build/dom-base/dom-base.js", 281);
if (add) {
            _yuitest_coverline("build/dom-base/dom-base.js", 282);
addClass(node, className);
        } else {
            _yuitest_coverline("build/dom-base/dom-base.js", 284);
removeClass(node, className);
        }
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 289);
hasClass = Y.DOM.hasClass;
_yuitest_coverline("build/dom-base/dom-base.js", 290);
removeClass = Y.DOM.removeClass;
_yuitest_coverline("build/dom-base/dom-base.js", 291);
addClass = Y.DOM.addClass;

_yuitest_coverline("build/dom-base/dom-base.js", 293);
var re_tag = /<([a-z]+)/i,

    Y_DOM = Y.DOM,

    addFeature = Y.Features.add,
    testFeature = Y.Features.test,

    creators = {},

    createFromDIV = function(html, tag) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "createFromDIV", 302);
_yuitest_coverline("build/dom-base/dom-base.js", 303);
var div = Y.config.doc.createElement('div'),
            ret = true;

        _yuitest_coverline("build/dom-base/dom-base.js", 306);
div.innerHTML = html;
        _yuitest_coverline("build/dom-base/dom-base.js", 307);
if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {
            _yuitest_coverline("build/dom-base/dom-base.js", 308);
ret = false;
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 311);
return ret;
    },

    re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

    TABLE_OPEN = '<table>',
    TABLE_CLOSE = '</table>';

_yuitest_coverline("build/dom-base/dom-base.js", 319);
Y.mix(Y.DOM, {
    _fragClones: {},

    _create: function(html, doc, tag) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_create", 322);
_yuitest_coverline("build/dom-base/dom-base.js", 323);
tag = tag || 'div';

        _yuitest_coverline("build/dom-base/dom-base.js", 325);
var frag = Y_DOM._fragClones[tag];
        _yuitest_coverline("build/dom-base/dom-base.js", 326);
if (frag) {
            _yuitest_coverline("build/dom-base/dom-base.js", 327);
frag = frag.cloneNode(false);
        } else {
            _yuitest_coverline("build/dom-base/dom-base.js", 329);
frag = Y_DOM._fragClones[tag] = doc.createElement(tag);
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 331);
frag.innerHTML = html;
        _yuitest_coverline("build/dom-base/dom-base.js", 332);
return frag;
    },

    _children: function(node, tag) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "_children", 335);
_yuitest_coverline("build/dom-base/dom-base.js", 336);
var i = 0,
            children = node.children,
            childNodes,
            hasComments,
            child;

        _yuitest_coverline("build/dom-base/dom-base.js", 342);
if (children && children.tags) { // use tags filter when possible
            _yuitest_coverline("build/dom-base/dom-base.js", 343);
if (tag) {
                _yuitest_coverline("build/dom-base/dom-base.js", 344);
children = node.children.tags(tag);
            } else { // IE leaks comments into children
                _yuitest_coverline("build/dom-base/dom-base.js", 346);
hasComments = children.tags('!').length;
            }
        }
        
        _yuitest_coverline("build/dom-base/dom-base.js", 350);
if (!children || (!children.tags && tag) || hasComments) {
            _yuitest_coverline("build/dom-base/dom-base.js", 351);
childNodes = children || node.childNodes;
            _yuitest_coverline("build/dom-base/dom-base.js", 352);
children = [];
            _yuitest_coverline("build/dom-base/dom-base.js", 353);
while ((child = childNodes[i++])) {
                _yuitest_coverline("build/dom-base/dom-base.js", 354);
if (child.nodeType === 1) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 355);
if (!tag || tag === child.tagName) {
                        _yuitest_coverline("build/dom-base/dom-base.js", 356);
children.push(child);
                    }
                }
            }
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 362);
return children || [];
    },

    /**
     * Creates a new dom node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement 
     * when creating one node, and a documentFragment when creating
     * multiple nodes.
     */
    create: function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "create", 374);
_yuitest_coverline("build/dom-base/dom-base.js", 375);
if (typeof html === 'string') {
            _yuitest_coverline("build/dom-base/dom-base.js", 376);
html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML

        }

        _yuitest_coverline("build/dom-base/dom-base.js", 380);
doc = doc || Y.config.doc;
        _yuitest_coverline("build/dom-base/dom-base.js", 381);
var m = re_tag.exec(html),
            create = Y_DOM._create,
            custom = creators,
            ret = null,
            creator,
            tag, nodes;

        _yuitest_coverline("build/dom-base/dom-base.js", 388);
if (html != undefined) { // not undefined or null
            _yuitest_coverline("build/dom-base/dom-base.js", 389);
if (m && m[1]) {
                _yuitest_coverline("build/dom-base/dom-base.js", 390);
creator = custom[m[1].toLowerCase()];
                _yuitest_coverline("build/dom-base/dom-base.js", 391);
if (typeof creator === 'function') {
                    _yuitest_coverline("build/dom-base/dom-base.js", 392);
create = creator; 
                } else {
                    _yuitest_coverline("build/dom-base/dom-base.js", 394);
tag = creator;
                }
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 398);
nodes = create(html, doc, tag).childNodes;

            _yuitest_coverline("build/dom-base/dom-base.js", 400);
if (nodes.length === 1) { // return single node, breaking parentNode ref from "fragment"
                _yuitest_coverline("build/dom-base/dom-base.js", 401);
ret = nodes[0].parentNode.removeChild(nodes[0]);
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 402);
if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)
                _yuitest_coverline("build/dom-base/dom-base.js", 403);
if (nodes.length === 2) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 404);
ret = nodes[0].nextSibling;
                } else {
                    _yuitest_coverline("build/dom-base/dom-base.js", 406);
nodes[0].parentNode.removeChild(nodes[0]); 
                    _yuitest_coverline("build/dom-base/dom-base.js", 407);
ret = Y_DOM._nl2frag(nodes, doc);
                }
            } else { // return multiple nodes as a fragment
                 _yuitest_coverline("build/dom-base/dom-base.js", 410);
ret = Y_DOM._nl2frag(nodes, doc);
            }}

        }

        _yuitest_coverline("build/dom-base/dom-base.js", 415);
return ret;
    },

    _nl2frag: function(nodes, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_nl2frag", 418);
_yuitest_coverline("build/dom-base/dom-base.js", 419);
var ret = null,
            i, len;

        _yuitest_coverline("build/dom-base/dom-base.js", 422);
if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            _yuitest_coverline("build/dom-base/dom-base.js", 423);
doc = doc || nodes[0].ownerDocument; 
            _yuitest_coverline("build/dom-base/dom-base.js", 424);
ret = doc.createDocumentFragment();

            _yuitest_coverline("build/dom-base/dom-base.js", 426);
if (nodes.item) { // convert live list to static array
                _yuitest_coverline("build/dom-base/dom-base.js", 427);
nodes = Y.Array(nodes, 0, true);
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 430);
for (i = 0, len = nodes.length; i < len; i++) {
                _yuitest_coverline("build/dom-base/dom-base.js", 431);
ret.appendChild(nodes[i]); 
            }
        } // else inline with log for minification
        _yuitest_coverline("build/dom-base/dom-base.js", 434);
return ret;
    },

    /**
     * Inserts content in a node at the given location 
     * @method addHTML
     * @param {HTMLElement} node The node to insert into
     * @param {HTMLElement | Array | HTMLCollection} content The content to be inserted 
     * @param {HTMLElement} where Where to insert the content
     * If no "where" is given, content is appended to the node
     * Possible values for "where"
     * <dl>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     */
    addHTML: function(node, content, where) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "addHTML", 458);
_yuitest_coverline("build/dom-base/dom-base.js", 459);
var nodeParent = node.parentNode,
            i = 0,
            item,
            ret = content,
            newNode;
            

        _yuitest_coverline("build/dom-base/dom-base.js", 466);
if (content != undefined) { // not null or undefined (maybe 0)
            _yuitest_coverline("build/dom-base/dom-base.js", 467);
if (content.nodeType) { // DOM node, just add it
                _yuitest_coverline("build/dom-base/dom-base.js", 468);
newNode = content;
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 469);
if (typeof content == 'string' || typeof content == 'number') {
                _yuitest_coverline("build/dom-base/dom-base.js", 470);
ret = newNode = Y_DOM.create(content);
            } else {_yuitest_coverline("build/dom-base/dom-base.js", 471);
if (content[0] && content[0].nodeType) { // array or collection 
                _yuitest_coverline("build/dom-base/dom-base.js", 472);
newNode = Y.config.doc.createDocumentFragment();
                _yuitest_coverline("build/dom-base/dom-base.js", 473);
while ((item = content[i++])) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 474);
newNode.appendChild(item); // append to fragment for insertion
                }
            }}}
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 479);
if (where) {
            _yuitest_coverline("build/dom-base/dom-base.js", 480);
if (newNode && where.parentNode) { // insert regardless of relationship to node
                _yuitest_coverline("build/dom-base/dom-base.js", 481);
where.parentNode.insertBefore(newNode, where);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 483);
switch (where) {
                    case 'replace':
                        _yuitest_coverline("build/dom-base/dom-base.js", 485);
while (node.firstChild) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 486);
node.removeChild(node.firstChild);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 488);
if (newNode) { // allow empty content to clear node
                            _yuitest_coverline("build/dom-base/dom-base.js", 489);
node.appendChild(newNode);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 491);
break;
                    case 'before':
                        _yuitest_coverline("build/dom-base/dom-base.js", 493);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 494);
nodeParent.insertBefore(newNode, node);
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 496);
break;
                    case 'after':
                        _yuitest_coverline("build/dom-base/dom-base.js", 498);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 499);
if (node.nextSibling) { // IE errors if refNode is null
                                _yuitest_coverline("build/dom-base/dom-base.js", 500);
nodeParent.insertBefore(newNode, node.nextSibling);
                            } else {
                                _yuitest_coverline("build/dom-base/dom-base.js", 502);
nodeParent.appendChild(newNode);
                            }
                        }
                        _yuitest_coverline("build/dom-base/dom-base.js", 505);
break;
                    default:
                        _yuitest_coverline("build/dom-base/dom-base.js", 507);
if (newNode) {
                            _yuitest_coverline("build/dom-base/dom-base.js", 508);
node.appendChild(newNode);
                        }
                }
            }
        } else {_yuitest_coverline("build/dom-base/dom-base.js", 512);
if (newNode) {
            _yuitest_coverline("build/dom-base/dom-base.js", 513);
node.appendChild(newNode);
        }}

        _yuitest_coverline("build/dom-base/dom-base.js", 516);
return ret;
    },

    wrap: function(node, html) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "wrap", 519);
_yuitest_coverline("build/dom-base/dom-base.js", 520);
var parent = (html && html.nodeType) ? html : Y.DOM.create(html),
            nodes = parent.getElementsByTagName('*');

        _yuitest_coverline("build/dom-base/dom-base.js", 523);
if (nodes.length) {
            _yuitest_coverline("build/dom-base/dom-base.js", 524);
parent = nodes[nodes.length - 1];
        }

        _yuitest_coverline("build/dom-base/dom-base.js", 527);
if (node.parentNode) { 
            _yuitest_coverline("build/dom-base/dom-base.js", 528);
node.parentNode.replaceChild(parent, node);
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 530);
parent.appendChild(node);
    },

    unwrap: function(node) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "unwrap", 533);
_yuitest_coverline("build/dom-base/dom-base.js", 534);
var parent = node.parentNode,
            lastChild = parent.lastChild,
            next = node,
            grandparent;

        _yuitest_coverline("build/dom-base/dom-base.js", 539);
if (parent) {
            _yuitest_coverline("build/dom-base/dom-base.js", 540);
grandparent = parent.parentNode;
            _yuitest_coverline("build/dom-base/dom-base.js", 541);
if (grandparent) {
                _yuitest_coverline("build/dom-base/dom-base.js", 542);
node = parent.firstChild;
                _yuitest_coverline("build/dom-base/dom-base.js", 543);
while (node !== lastChild) {
                    _yuitest_coverline("build/dom-base/dom-base.js", 544);
next = node.nextSibling;
                    _yuitest_coverline("build/dom-base/dom-base.js", 545);
grandparent.insertBefore(node, parent);
                    _yuitest_coverline("build/dom-base/dom-base.js", 546);
node = next;
                }
                _yuitest_coverline("build/dom-base/dom-base.js", 548);
grandparent.replaceChild(lastChild, parent);
            } else {
                _yuitest_coverline("build/dom-base/dom-base.js", 550);
parent.removeChild(node);
            }
        }
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 556);
addFeature('innerhtml', 'table', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 557);
_yuitest_coverline("build/dom-base/dom-base.js", 558);
var node = Y.config.doc.createElement('table');
        _yuitest_coverline("build/dom-base/dom-base.js", 559);
try {
            _yuitest_coverline("build/dom-base/dom-base.js", 560);
node.innerHTML = '<tbody></tbody>';
        } catch(e) {
            _yuitest_coverline("build/dom-base/dom-base.js", 562);
return false;
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 564);
return (node.firstChild && node.firstChild.nodeName === 'TBODY');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 568);
addFeature('innerhtml-div', 'tr', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 569);
_yuitest_coverline("build/dom-base/dom-base.js", 570);
return createFromDIV('<tr></tr>', 'tr');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 574);
addFeature('innerhtml-div', 'script', {
    test: function() {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "test", 575);
_yuitest_coverline("build/dom-base/dom-base.js", 576);
return createFromDIV('<script></script>', 'script');
    }
});

_yuitest_coverline("build/dom-base/dom-base.js", 580);
if (!testFeature('innerhtml', 'table')) {
    // TODO: thead/tfoot with nested tbody
        // IE adds TBODY when creating TABLE elements (which may share this impl)
    _yuitest_coverline("build/dom-base/dom-base.js", 583);
creators.tbody = function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "tbody", 583);
_yuitest_coverline("build/dom-base/dom-base.js", 584);
var frag = Y_DOM.create(TABLE_OPEN + html + TABLE_CLOSE, doc),
            tb = Y.DOM._children(frag, 'tbody')[0];

        _yuitest_coverline("build/dom-base/dom-base.js", 587);
if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
            _yuitest_coverline("build/dom-base/dom-base.js", 588);
tb.parentNode.removeChild(tb); // strip extraneous tbody
        }
        _yuitest_coverline("build/dom-base/dom-base.js", 590);
return frag;
    };
}

_yuitest_coverline("build/dom-base/dom-base.js", 594);
if (!testFeature('innerhtml-div', 'script')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 595);
creators.script = function(html, doc) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "script", 595);
_yuitest_coverline("build/dom-base/dom-base.js", 596);
var frag = doc.createElement('div');

        _yuitest_coverline("build/dom-base/dom-base.js", 598);
frag.innerHTML = '-' + html;
        _yuitest_coverline("build/dom-base/dom-base.js", 599);
frag.removeChild(frag.firstChild);
        _yuitest_coverline("build/dom-base/dom-base.js", 600);
return frag;
    };

    _yuitest_coverline("build/dom-base/dom-base.js", 603);
creators.link = creators.style = creators.script;
}

_yuitest_coverline("build/dom-base/dom-base.js", 606);
if (!testFeature('innerhtml-div', 'tr')) {
    _yuitest_coverline("build/dom-base/dom-base.js", 607);
Y.mix(creators, {
        option: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "option", 608);
_yuitest_coverline("build/dom-base/dom-base.js", 609);
return Y_DOM.create('<select><option class="yui3-big-dummy" selected></option>' + html + '</select>', doc);
        },

        tr: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "tr", 612);
_yuitest_coverline("build/dom-base/dom-base.js", 613);
return Y_DOM.create('<tbody>' + html + '</tbody>', doc);
        },

        td: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "td", 616);
_yuitest_coverline("build/dom-base/dom-base.js", 617);
return Y_DOM.create('<tr>' + html + '</tr>', doc);
        }, 

        col: function(html, doc) {
            _yuitest_coverfunc("build/dom-base/dom-base.js", "col", 620);
_yuitest_coverline("build/dom-base/dom-base.js", 621);
return Y_DOM.create('<colgroup>' + html + '</colgroup>', doc);
        }, 

        tbody: 'table'
    });

    _yuitest_coverline("build/dom-base/dom-base.js", 627);
Y.mix(creators, {
        legend: 'fieldset',
        th: creators.td,
        thead: creators.tbody,
        tfoot: creators.tbody,
        caption: creators.tbody,
        colgroup: creators.tbody,
        optgroup: creators.option
    });
}

_yuitest_coverline("build/dom-base/dom-base.js", 638);
Y_DOM.creators = creators;
_yuitest_coverline("build/dom-base/dom-base.js", 639);
Y.mix(Y.DOM, {
    /**
     * Sets the width of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setWidth
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Number} size The pixel height to size to
     */

    setWidth: function(node, size) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setWidth", 648);
_yuitest_coverline("build/dom-base/dom-base.js", 649);
Y.DOM._setSize(node, 'width', size);
    },

    /**
     * Sets the height of the element to the given size, regardless
     * of box model, border, padding, etc.
     * @method setHeight
     * @param {HTMLElement} element The DOM element. 
     * @param {String|Number} size The pixel height to size to
     */

    setHeight: function(node, size) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "setHeight", 660);
_yuitest_coverline("build/dom-base/dom-base.js", 661);
Y.DOM._setSize(node, 'height', size);
    },

    _setSize: function(node, prop, val) {
        _yuitest_coverfunc("build/dom-base/dom-base.js", "_setSize", 664);
_yuitest_coverline("build/dom-base/dom-base.js", 665);
val = (val > 0) ? val : 0;
        _yuitest_coverline("build/dom-base/dom-base.js", 666);
var size = 0;

        _yuitest_coverline("build/dom-base/dom-base.js", 668);
node.style[prop] = val + 'px';
        _yuitest_coverline("build/dom-base/dom-base.js", 669);
size = (prop === 'height') ? node.offsetHeight : node.offsetWidth;

        _yuitest_coverline("build/dom-base/dom-base.js", 671);
if (size > val) {
            _yuitest_coverline("build/dom-base/dom-base.js", 672);
val = val - (size - val);

            _yuitest_coverline("build/dom-base/dom-base.js", 674);
if (val < 0) {
                _yuitest_coverline("build/dom-base/dom-base.js", 675);
val = 0;
            }

            _yuitest_coverline("build/dom-base/dom-base.js", 678);
node.style[prop] = val + 'px';
        }
    }
});


}, '3.7.3', {"requires": ["dom-core"]});
