/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can'], function (can) {

    // fragment.js
    // ---------
    // _DOM Fragment support._
    var fragmentRE = /^\s*<(\w+)[^>]*>/,
        fragment = function (html, name) {
            if (name === undefined) {
                name = fragmentRE.test(html) && RegExp.$1;
            }

            if (html && can.isFunction(html.replace)) {
                // Fix "XHTML"-style tags in all browsers
                html = html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>");
            }

            var container = document.createElement('div'),
                temp = document.createElement('div')

                // IE's parser will strip any `<tr><td>` tags when `innerHTML`
                // is called on a `tbody`. To get around this, we construct a 
                // valid table with a `tbody` that has the `innerHTML` we want. 
                // Then the container is the `firstChild` of the `tbody`.
                // [source](http://www.ericvasilik.com/2006/07/code-karma.html).
                if (name === "tbody" || name === "tfoot" || name === "thead") {
                    temp.innerHTML = "<table>" + html + "</table>";
                    container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
                } else if (name === "tr") {
                    temp.innerHTML = "<table><tbody>" + html + "</tbody></table>";
                    container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild;
                } else if (name === "td" || name === "th") {
                    temp.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";
                    container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild.firstChild;
                } else if (name === 'option') {
                    temp.innerHTML = "<select>" + html + "</select>";
                    container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
                } else {
                    container.innerHTML = '' + html;
                }

                // IE8 barfs if you pass slice a `childNodes` object, so make a copy.
                var tmp = {},
                children = container.childNodes;
            tmp.length = children.length;
            for (var i = 0; i < children.length; i++) {
                tmp[i] = children[i];
            }
            return [].slice.call(tmp);
        }

        can.buildFragment = function (html, nodes) {
            var parts = fragment(html),
                frag = document.createDocumentFragment();

            can.each(parts, function (part) {
                frag.appendChild(part);
            })
            return frag;
        };

    return can;
});