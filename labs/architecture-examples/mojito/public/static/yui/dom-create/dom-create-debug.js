/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dom-create', function(Y) {

var re_tag = /<([a-z]+)/i,

    Y_DOM = Y.DOM,

    addFeature = Y.Features.add,
    testFeature = Y.Features.test,

    creators = {},

    createFromDIV = function(html, tag) {
        var div = Y.config.doc.createElement('div'),
            ret = true;

        div.innerHTML = html;
        if (!div.firstChild || div.firstChild.tagName !== tag.toUpperCase()) {
            ret = false;
        }

        return ret;
    },

    re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

    TABLE_OPEN = '<table>',
    TABLE_CLOSE = '</table>';

Y.mix(Y.DOM, {
    _fragClones: {},

    _create: function(html, doc, tag) {
        tag = tag || 'div';

        var frag = Y_DOM._fragClones[tag];
        if (frag) {
            frag = frag.cloneNode(false);
        } else {
            frag = Y_DOM._fragClones[tag] = doc.createElement(tag);
        }
        frag.innerHTML = html;
        return frag;
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
        if (typeof html === 'string') {
            html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML

        }

        doc = doc || Y.config.doc;
        var m = re_tag.exec(html),
            create = Y_DOM._create,
            custom = creators,
            ret = null,
            creator,
            tag, nodes;

        if (html != undefined) { // not undefined or null
            if (m && m[1]) {
                creator = custom[m[1].toLowerCase()];
                if (typeof creator === 'function') {
                    create = creator; 
                } else {
                    tag = creator;
                }
            }

            nodes = create(html, doc, tag).childNodes;

            if (nodes.length === 1) { // return single node, breaking parentNode ref from "fragment"
                ret = nodes[0].parentNode.removeChild(nodes[0]);
            } else if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)
                if (nodes.length === 2) {
                    ret = nodes[0].nextSibling;
                } else {
                    nodes[0].parentNode.removeChild(nodes[0]); 
                     ret = Y_DOM._nl2frag(nodes, doc);
                }
            } else { // return multiple nodes as a fragment
                 ret = Y_DOM._nl2frag(nodes, doc);
            }
        }

        return ret;
    },

    _nl2frag: function(nodes, doc) {
        var ret = null,
            i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            doc = doc || nodes[0].ownerDocument; 
            ret = doc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = Y.Array(nodes, 0, true);
            }

            for (i = 0, len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]); 
            }
        } // else inline with log for minification
        else { Y.log('unable to convert ' + nodes + ' to fragment', 'warn', 'dom'); }
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
        var nodeParent = node.parentNode,
            i = 0,
            item,
            ret = content,
            newNode;
            

        if (content != undefined) { // not null or undefined (maybe 0)
            if (content.nodeType) { // DOM node, just add it
                newNode = content;
            } else if (typeof content == 'string' || typeof content == 'number') {
                ret = newNode = Y_DOM.create(content);
            } else if (content[0] && content[0].nodeType) { // array or collection 
                newNode = Y.config.doc.createDocumentFragment();
                while ((item = content[i++])) {
                    newNode.appendChild(item); // append to fragment for insertion
                }
            }
        }

        if (where) {
            if (where.nodeType) { // insert regardless of relationship to node
                where.parentNode.insertBefore(newNode, where);
            } else {
                switch (where) {
                    case 'replace':
                        while (node.firstChild) {
                            node.removeChild(node.firstChild);
                        }
                        if (newNode) { // allow empty content to clear node
                            node.appendChild(newNode);
                        }
                        break;
                    case 'before':
                        nodeParent.insertBefore(newNode, node);
                        break;
                    case 'after':
                        if (node.nextSibling) { // IE errors if refNode is null
                            nodeParent.insertBefore(newNode, node.nextSibling);
                        } else {
                            nodeParent.appendChild(newNode);
                        }
                        break;
                    default:
                        node.appendChild(newNode);
                }
            }
        } else if (newNode) {
            node.appendChild(newNode);
        }

        return ret;
    }
});

addFeature('innerhtml', 'table', {
    test: function() {
        var node = Y.config.doc.createElement('table');
        try {
            node.innerHTML = '<tbody></tbody>';
        } catch(e) {
            return false;
        }
        return (node.firstChild && node.firstChild.nodeName === 'TBODY');
    }
});

addFeature('innerhtml-div', 'tr', {
    test: function() {
        return createFromDIV('<tr></tr>', 'tr');
    }
});

addFeature('innerhtml-div', 'script', {
    test: function() {
        return createFromDIV('<script></script>', 'script');
    }
});

if (!testFeature('innerhtml', 'table')) {
    // TODO: thead/tfoot with nested tbody
        // IE adds TBODY when creating TABLE elements (which may share this impl)
    creators.tbody = function(html, doc) {
        var frag = Y_DOM.create(TABLE_OPEN + html + TABLE_CLOSE, doc),
            tb = frag.children.tags('tbody')[0];

        if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
            tb.parentNode.removeChild(tb); // strip extraneous tbody
        }
        return frag;
    };
}

if (!testFeature('innerhtml-div', 'script')) {
    creators.script = function(html, doc) {
        var frag = doc.createElement('div');

        frag.innerHTML = '-' + html;
        frag.removeChild(frag.firstChild);
        return frag;
    }

    creators.link = creators.style = creators.script;
}

if (!testFeature('innerhtml-div', 'tr')) {
    Y.mix(creators, {
        option: function(html, doc) {
            return Y_DOM.create('<select><option class="yui3-big-dummy" selected></option>' + html + '</select>', doc);
        },

        tr: function(html, doc) {
            return Y_DOM.create('<tbody>' + html + '</tbody>', doc);
        },

        td: function(html, doc) {
            return Y_DOM.create('<tr>' + html + '</tr>', doc);
        }, 

        col: function(html, doc) {
            return Y_DOM.create('<colgroup>' + html + '</colgroup>', doc);
        }, 

        tbody: 'table'
    });

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

Y_DOM.creators = creators;


}, '3.7.3' ,{requires:['dom-core']});
