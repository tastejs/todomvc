'use strict';

var Parser = require('htmlparser2/lib/Parser');

/**
 * @see https://github.com/fb55/htmlparser2/wiki/Parser-options
 */
var defaultOptions = {lowerCaseTags: false, lowerCaseAttributeNames: false};

var defaultDirectives = [{name: '!doctype', start: '<', end: '>'}];

/**
 * Parse html to PostHTMLTree
 * @param  {String} html
 * @param  {Object} [options=defaultOptions]
 * @return {PostHTMLTree}
 */
function postHTMLParser(html, options) {
    var bufArray = [],
        results = [];

    bufArray.last = function() {
        return this[this.length - 1];
    };

    function isDirective(directive, tag) {
        if (directive.name instanceof RegExp) {
            var regex = RegExp(directive.name.source, 'i');

            return regex.test(tag);
        }

        if (tag !== directive.name) {
            return false;
        }

        return true;
    }

    function parserDirective(name, data) {
        var directives = [].concat(defaultDirectives, options.directives || []);
        var last = bufArray.last();

        for (var i = 0; i < directives.length; i++) {
            var directive = directives[i];
            var directiveText = directive.start + data + directive.end;

            name = name.toLowerCase();
            if (isDirective(directive, name)) {
                if (!last) {
                    results.push(directiveText);
                    return;
                }

                last.content || (last.content = []);
                last.content.push(directiveText);
            }
        }
    }

    function normalizeArributes(attrs) {
        var result = {};
        Object.keys(attrs).forEach(function(key) {
            var obj = {};
                obj[key] = attrs[key].replace(/&quot;/g, '"');
            Object.assign(result, obj);
        });

        return result;
    }

    var parser = new Parser({
        onprocessinginstruction: parserDirective,
        oncomment: function(data) {
            var comment = '<!--' + data + '-->',
                last = bufArray.last();

            if (!last) {
                results.push(comment);
                return;
            }

            last.content || (last.content = []);
            last.content.push(comment);
        },
        onopentag: function(tag, attrs) {
            var buf = { tag: tag };

            if (Object.keys(attrs).length) {
                buf.attrs = normalizeArributes(attrs);
            }

            bufArray.push(buf);
        },
        onclosetag: function() {
            var buf = bufArray.pop();

            if (!bufArray.length) {
                results.push(buf);
                return;
            }

            var last = bufArray.last();
            if (!Array.isArray(last.content)) {
                last.content = [];
            }

            last.content.push(buf);
        },
        ontext: function(text) {
            var last = bufArray.last();
            if (!last) {
                results.push(text);
                return;
            }

            last.content || (last.content = []);
            last.content.push(text);
        }
    }, options || defaultOptions);

    parser.write(html);
    parser.end();

    return results;
}

function parserWrapper() {
    var option;

    function parser(html) {
        var opt = Object.assign(defaultOptions, option);
        return postHTMLParser(html, opt);
    }

    if (
      arguments.length === 1 &&
      Boolean(arguments[0]) &&
      arguments[0].constructor.name === 'Object'
    ) {
        option = arguments[0];
        return parser;
    }

    option = arguments[1];
    return parser(arguments[0]);
}

module.exports = parserWrapper;
module.exports.defaultOptions = defaultOptions;
module.exports.defaultDirectives = defaultDirectives;
