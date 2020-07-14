'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = removeRedundantAttributes;
var redundantAttributes = {
    'form': {
        'method': 'get'
    },

    'input': {
        'type': 'text'
    },

    'button': {
        'type': 'submit'
    },

    'script': {
        'language': 'javascript',
        'type': 'text/javascript',
        // Remove attribute if the function returns false
        'charset': function charset(node) {
            // The charset attribute only really makes sense on “external” SCRIPT elements:
            // http://perfectionkills.com/optimizing-html/#8_script_charset
            return node.attrs && !node.attrs.src;
        }
    },

    'style': {
        'media': 'all',
        'type': 'text/css'
    },

    'link': {
        'media': 'all'
    }
};

/** Removes redundant attributes */
function removeRedundantAttributes(tree) {
    var tags = Object.keys(redundantAttributes);
    var tagMatchRegExp = new RegExp('^(' + tags.join('|') + ')$');
    tree.match({ tag: tagMatchRegExp }, function (node) {
        var tagRedundantAttributes = redundantAttributes[node.tag];
        node.attrs = node.attrs || {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.keys(tagRedundantAttributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var redundantAttributeName = _step.value;

                var tagRedundantAttributeValue = tagRedundantAttributes[redundantAttributeName];
                var isRemove = false;
                if (typeof tagRedundantAttributeValue === 'function') {
                    isRemove = tagRedundantAttributeValue(node);
                } else if (node.attrs[redundantAttributeName] === tagRedundantAttributeValue) {
                    isRemove = true;
                }

                if (isRemove) {
                    delete node.attrs[redundantAttributeName];
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return node;
    });

    return tree;
}