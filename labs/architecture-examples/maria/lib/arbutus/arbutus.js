/*
Arbutus version 1
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/arbutus/blob/master/LICENSE
*/var arbutus = arbutus || {};
(function() {

    var trimLeft = /^\s+/,
        trimRight = /\s+$/;
    function trim(str) {
        return str.replace(trimLeft, '').replace(trimRight, '');
    }

    function getFirstChild(element) {
        return element.firstChild;
    }
    function getFirstGrandChild(element) {
        return element.firstChild.firstChild;
    }
    function getSecondGrandChild(element) {
        return element.firstChild.firstChild.nextSibling;
    }
    function getFirstGreatGrandChild(element) {
        return element.firstChild.firstChild.firstChild;
    }
    function getFirstGreatGreatGrandChild(element) {
        return element.firstChild.firstChild.firstChild.firstChild;
    }

    function Parser(before, after, getFirstResult) {
        if (before) {
            this.before = before;
        }
        if (after) {
            this.after = after;
        }
        if (getFirstResult) {
            this.getFirstResult = getFirstResult;
        }
    };
    Parser.prototype = {
        before: '',
        after: '',
        parse: function(html, doc) {
            var parser = doc.createElement('div');
            var fragment = doc.createDocumentFragment();
            parser.innerHTML = this.before + html + this.after;
            // console.log(parser.innerHTML);
            var node = this.getFirstResult(parser);
            var nextNode;
            while (node) {
                nextNode = node.nextSibling;
                fragment.appendChild(node);
                node = nextNode;
            }
            return fragment;
        },
        getFirstResult: getFirstChild
    };

    var parsers = {
        'td': new Parser('<table><tbody><tr>', '</tr></tbody></table>', getFirstGreatGreatGrandChild),
        'tr': new Parser('<table><tbody>', '</tbody></table>', getFirstGreatGrandChild),
        'tbody': new Parser('<table>', '</table>', getFirstGrandChild),
        'col': new Parser('<table><colgroup>', '</colgroup></table>', getFirstGreatGrandChild),
        // Without the option in the next line, the parsed option will always be selected.
        'option': new Parser('<select><option>a</option>', '</select>', getSecondGrandChild)
    };
    parsers.th = parsers.td;
    parsers.thead = parsers.tbody;
    parsers.tfoot = parsers.tbody;
    parsers.caption = parsers.tbody;
    parsers.colgroup = parsers.tbody;

    var tagRegExp = /^<([a-z]+)/i; // first group must be tag name

/**

@property arbutus.parseHTML

@parameter html {string} The string of HTML to be parsed.

@parameter doc {Document} Optional document object to create the new DOM nodes.

@return {DocumentFragment}

@description

The html string will be trimmed.

Returns a document fragment that has the children defined by the html string.

var fragment = arbutus.parseHTML('<p>alpha beta</p>');
document.body.appendChild(fragment);

Note that a call to this function is relatively expensive and you probably
don't want to have a loop of thousands with calls to this function.

*/
    arbutus.parseHTML = function(html, doc) {
        // IE will trim when setting innerHTML so unify for all browsers
        html = trim(html);
        var matches = html.match(tagRegExp),
            parser = (matches && parsers[matches[1].toLowerCase()]) ||
                     Parser.prototype;
        return parser.parse(html, doc || document);
    };

}());
