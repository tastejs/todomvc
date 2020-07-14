var SINGLE_TAGS = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

var ATTRIBUTE_QUOTES_REQUIRED = /[\t\n\f\r " '`=<>]/

/** Render PostHTML Tree to HTML
 *
 * @param  {Array|Object} tree PostHTML Tree @param  {Object} options Options
 *
 * @return {String} HTML
 */
function render (tree, options) {
  /** Options
   *
   * @type {Object}
   *
   * @prop {Array<String|RegExp>} singleTags  Custom single tags (selfClosing)
   * @prop {String} closingSingleTag Closing format for single tag @prop
   * @prop {Boolean} quoteAllAttributes If all attributes should be quoted.
   * Otherwise attributes will be unquoted when allowed.
   *
   * Formats:
   *
   * ``` tag: `<br></br>` ```, slash: `<br />` ```, ```default: `<br>` ```
   */
  options = options || {}

  var singleTags = options.singleTags ? SINGLE_TAGS.concat(options.singleTags) : SINGLE_TAGS
  var singleRegExp = singleTags.filter(function (tag) {
    return tag instanceof RegExp
  })

  var closingSingleTag = options.closingSingleTag
  var quoteAllAttributes = options.quoteAllAttributes
  if (typeof quoteAllAttributes === 'undefined') {
    quoteAllAttributes = true
  }

  return html(tree)

  /** @private */
  function isSingleTag (tag) {
    if (singleRegExp.length !== 0) {
      for (var i = 0; i < singleRegExp.length; i++) {
        return singleRegExp[i].test(tag)
      }
    }

    if (singleTags.indexOf(tag) === -1) {
      return false
    }

    return true
  }

  /** @private */
  function attrs (obj) {
    var attr = ''

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        if (quoteAllAttributes || obj[key].match(ATTRIBUTE_QUOTES_REQUIRED)) {
          attr += ' ' + key + '="' + obj[key].replace(/"/g, '&quot;') + '"'
        } else if (obj[key] === '') {
          attr += ' ' + key
        } else {
          attr += ' ' + key + '=' + obj[key]
        }
      } else if (obj[key] === true) {
        attr += ' ' + key
      } else if (typeof obj[key] === 'number') {
        attr += ' ' + key + '="' + obj[key] + '"'
      }
    }

    return attr
  }

  /** @private */
  function traverse (tree, cb) {
    if (tree !== undefined) {
      for (var i = 0, length = tree.length; i < length; i++) {
        traverse(cb(tree[i]), cb)
      }
    }
  }

  /**
   * HTML Stringifier
   *
   * @param  {Array|Object} tree PostHTML Tree
   *
   * @return {String} result HTML
   */
  function html (tree) {
    var result = ''

    if (!Array.isArray(tree)) {
      tree = [tree]
    }

    traverse(tree, function (node) {
      // undefined, null, '', [], NaN
      if (node === undefined ||
          node === null ||
          node === false ||
          node.length === 0 ||
          Number.isNaN(node)) {
        return
      }

      // treat as new root tree if node is an array
      if (Array.isArray(node)) {
        result += html(node)

        return
      }

      if (typeof node === 'string' || typeof node === 'number') {
        result += node

        return
      }

      // skip node
      if (node.tag === false) {
        result += html(node.content)

        return
      }

      var tag = node.tag || 'div'

      result += '<' + tag

      if (node.attrs) {
        result += attrs(node.attrs)
      }

      if (isSingleTag(tag)) {
        switch (closingSingleTag) {
          case 'tag':
            result += '></' + tag + '>'

            break
          case 'slash':
            result += ' />'

            break
          default:
            result += '>'
        }

        result += html(node.content)
      } else {
        result += '>' + html(node.content) + '</' + tag + '>'
      }
    })

    return result
  }
}

/**
 * @module posthtml-render
 *
 * @version 1.1.5
 * @license MIT
 */
module.exports = render
