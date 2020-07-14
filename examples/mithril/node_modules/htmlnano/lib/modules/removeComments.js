'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = removeComments;

var _helpers = require('../helpers');

/** Removes HTML comments */
function removeComments(tree, options, removeType) {
    if (removeType !== 'all' && removeType !== 'safe') {
        removeType = 'safe';
    }

    tree.walk(function (node) {
        if (node.contents && node.contents.length) {
            node.contents = node.contents.filter(function (content) {
                return !isCommentToRemove(content, removeType);
            });
        } else if (isCommentToRemove(node, removeType)) {
            node = '';
        }

        return node;
    });

    return tree;
}

function isCommentToRemove(text, removeType) {
    if (typeof text !== 'string') {
        return false;
    }

    if (!(0, _helpers.isComment)(text)) {
        // Not HTML comment
        return false;
    }

    var isNoindex = text === '<!--noindex-->' || text === '<!--/noindex-->';
    if (removeType === 'safe' && isNoindex) {
        // Don't remove noindex comments.
        // See: https://yandex.com/support/webmaster/controlling-robot/html.xml
        return false;
    }

    // https://en.wikipedia.org/wiki/Conditional_comment
    if (removeType === 'safe' && (0, _helpers.isConditionalComment)(text)) {
        return false;
    }

    return true;
}