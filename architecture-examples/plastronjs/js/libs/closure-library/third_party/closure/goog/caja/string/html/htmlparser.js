// Copyright 2006-2008, The Google Caja project.
// Modifications Copyright 2009 The Closure Library Authors. All Rights Reserved.
// All Rights Reserved

/**
 * @license Portions of this code are from the google-caja project, received by
 * Google under the Apache license (http://code.google.com/p/google-caja/).
 * All other code is Copyright 2009 Google, Inc. All Rights Reserved.

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

 */

/**
 * @fileoverview A Html SAX parser.
 *
 * Examples of usage of the {@code goog.string.html.HtmlParser}:
 * <pre>
 *   var handler = new MyCustomHtmlVisitorHandlerThatExtendsHtmlSaxHandler();
 *   var parser = new goog.string.html.HtmlParser();
 *   parser.parse(handler, '<html><a href="google.com">link found!</a></html>');
 * </pre>
 *
 * TODO(user, msamuel): validate sanitizer regex against the HTML5 grammar at
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html
 *
 * @supported IE6, IE7, IE8, FF1.5, FF2, FF3, Chrome 3.0, Safari and Opera 10.
 */

goog.provide('goog.string.html.HtmlParser');
goog.provide('goog.string.html.HtmlParser.EFlags');
goog.provide('goog.string.html.HtmlParser.Elements');
goog.provide('goog.string.html.HtmlParser.Entities');
goog.provide('goog.string.html.HtmlSaxHandler');


/**
 * An Html parser: {@code parse} takes a string and calls methods on
 * {@code goog.string.html.HtmlSaxHandler} while it is visiting it.
 *
 * @constructor
 */
goog.string.html.HtmlParser = function() {
};


/**
 * HTML entities that are encoded/decoded.
 * TODO(user): use {@code goog.string.htmlEncode} instead.
 * @enum {string}
 */
goog.string.html.HtmlParser.Entities = {
  lt: '<',
  gt: '>',
  amp: '&',
  nbsp: '\240',
  quot: '"',
  apos: '\''
};


/**
 * The html eflags, used internally on the parser.
 * @enum {number}
 */
goog.string.html.HtmlParser.EFlags = {
  OPTIONAL_ENDTAG: 1,
  EMPTY: 2,
  CDATA: 4,
  RCDATA: 8,
  UNSAFE: 16,
  FOLDABLE: 32
};


/**
 * A map of element to a bitmap of flags it has, used internally on the parser.
 * @type {Object}
 */
goog.string.html.HtmlParser.Elements = {
  'a': 0,
  'abbr': 0,
  'acronym': 0,
  'address': 0,
  'applet': goog.string.html.HtmlParser.EFlags.UNSAFE,
  'area': goog.string.html.HtmlParser.EFlags.EMPTY,
  'b': 0,
  'base': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'basefont': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'bdo': 0,
  'big': 0,
  'blockquote': 0,
  'body': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG |
      goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.FOLDABLE,
  'br': goog.string.html.HtmlParser.EFlags.EMPTY,
  'button': 0,
  'caption': 0,
  'center': 0,
  'cite': 0,
  'code': 0,
  'col': goog.string.html.HtmlParser.EFlags.EMPTY,
  'colgroup': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'dd': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'del': 0,
  'dfn': 0,
  'dir': 0,
  'div': 0,
  'dl': 0,
  'dt': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'em': 0,
  'fieldset': 0,
  'font': 0,
  'form': 0,
  'frame': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'frameset': goog.string.html.HtmlParser.EFlags.UNSAFE,
  'h1': 0,
  'h2': 0,
  'h3': 0,
  'h4': 0,
  'h5': 0,
  'h6': 0,
  'head': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG |
      goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.FOLDABLE,
  'hr': goog.string.html.HtmlParser.EFlags.EMPTY,
  'html': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG |
      goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.FOLDABLE,
  'i': 0,
  'iframe': goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.CDATA,
  'img': goog.string.html.HtmlParser.EFlags.EMPTY,
  'input': goog.string.html.HtmlParser.EFlags.EMPTY,
  'ins': 0,
  'isindex': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'kbd': 0,
  'label': 0,
  'legend': 0,
  'li': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'link': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'map': 0,
  'menu': 0,
  'meta': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'noframes': goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.CDATA,
  'noscript': goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.CDATA,
  'object': goog.string.html.HtmlParser.EFlags.UNSAFE,
  'ol': 0,
  'optgroup': 0,
  'option': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'p': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'param': goog.string.html.HtmlParser.EFlags.EMPTY |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'pre': 0,
  'q': 0,
  's': 0,
  'samp': 0,
  'script': goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.CDATA,
  'select': 0,
  'small': 0,
  'span': 0,
  'strike': 0,
  'strong': 0,
  'style': goog.string.html.HtmlParser.EFlags.UNSAFE |
      goog.string.html.HtmlParser.EFlags.CDATA,
  'sub': 0,
  'sup': 0,
  'table': 0,
  'tbody': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'td': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'textarea': goog.string.html.HtmlParser.EFlags.RCDATA,
  'tfoot': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'th': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'thead': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'title': goog.string.html.HtmlParser.EFlags.RCDATA |
      goog.string.html.HtmlParser.EFlags.UNSAFE,
  'tr': goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG,
  'tt': 0,
  'u': 0,
  'ul': 0,
  'var': 0
};


/**
 * Regular expression that matches &s.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.AMP_RE_ = /&/g;


/**
 * Regular expression that matches loose &s.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.LOOSE_AMP_RE_ =
    /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;


/**
 * Regular expression that matches <.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.LT_RE_ = /</g;


/**
 * Regular expression that matches >.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.GT_RE_ = />/g;


/**
 * Regular expression that matches ".
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.QUOTE_RE_ = /\"/g;


/**
 * Regular expression that matches =.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.EQUALS_RE_ = /=/g;


/**
 * Regular expression that matches null characters.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.NULL_RE_ = /\0/g;


/**
 * Regular expression that matches entities.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.ENTITY_RE_ = /&(#\d+|#x[0-9A-Fa-f]+|\w+);/g;


/**
 * Regular expression that matches decimal numbers.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.DECIMAL_ESCAPE_RE_ = /^#(\d+)$/;


/**
 * Regular expression that matches hexadecimal numbers.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.HEX_ESCAPE_RE_ = /^#x([0-9A-Fa-f]+)$/;


/**
 * Regular expression that matches the next token to be processed.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ = new RegExp(
    // Don't capture space.
    '^\\s*(?:' +
    // Capture an attribute name in group 1, and value in group 3.
    // We capture the fact that there was an attribute in group 2, since
    // interpreters are inconsistent in whether a group that matches nothing
    // is null, undefined, or the empty string.
    ('(?:' +
       '([a-z][a-z-]*)' +                   // attribute name
       ('(' +                               // optionally followed
          '\\s*=\\s*' +
          ('(' +
             // A double quoted string.
             '\"[^\"]*\"' +
             // A single quoted string.
             '|\'[^\']*\'' +
             // The positive lookahead is used to make sure that in
             // <foo bar= baz=boo>, the value for bar is blank, not "baz=boo".
             '|(?=[a-z][a-z-]*\\s*=)' +
             // An unquoted value that is not an attribute name.
             // We know it is not an attribute name because the previous
             // zero-width match would've eliminated that possibility.
             '|[^>\"\'\\s]*' +
             ')'
             ) +
          ')'
          ) + '?' +
       ')'
       ) +
    // End of tag captured in group 3.
    '|(/?>)' +
    // Don't capture cruft
    '|[^a-z\\s>]+)',
    'i');


/**
 * Regular expression that matches the next token to be processed when we are
 * outside a tag.
 * @type {RegExp}
 * @private
 */
goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_ = new RegExp(
    '^(?:' +
    // Entity captured in group 1.
    '&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);' +
    // Comment, doctypes, and processing instructions not captured.
    '|<[!]--[\\s\\S]*?-->|<!\\w[^>]*>|<\\?[^>*]*>' +
    // '/' captured in group 2 for close tags, and name captured in group 3.
    '|<(/)?([a-z][a-z0-9]*)' +
    // Text captured in group 4.
    '|([^<&>]+)' +
    // Cruft captured in group 5.
    '|([<&>]))',
    'i');


/**
 * Given a SAX-like {@code goog.string.html.HtmlSaxHandler} parses a
 * {@code htmlText} and lets the {@code handler} know the structure while
 * visiting the nodes.
 *
 * @param {goog.string.html.HtmlSaxHandler} handler The HtmlSaxHandler that will
 *     receive the events.
 * @param {string} htmlText The html text.
 */
goog.string.html.HtmlParser.prototype.parse = function(handler, htmlText) {
  var htmlLower = null;
  var inTag = false;  // True iff we're currently processing a tag.
  var attribs = [];  // Accumulates attribute names and values.
  var tagName;  // The name of the tag currently being processed.
  var eflags;  // The element flags for the current tag.
  var openTag;  // True if the current tag is an open tag.

  // Lets the handler know that we are starting to parse the document.
  handler.startDoc();

  // Consumes tokens from the htmlText and stops once all tokens are processed.
  while (htmlText) {
    var regex = inTag ?
        goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ :
        goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_;
    // Gets the next token
    var m = htmlText.match(regex);
    // And removes it from the string
    htmlText = htmlText.substring(m[0].length);

    // TODO(goto): cleanup this code breaking it into separate methods.
    if (inTag) {
      if (m[1]) { // Attribute.
        // SetAttribute with uppercase names doesn't work on IE6.
        var attribName = goog.string.html.toLowerCase(m[1]);
        var decodedValue;
        if (m[2]) {
          var encodedValue = m[3];
          switch (encodedValue.charCodeAt(0)) {  // Strip quotes.
            case 34: case 39:
              encodedValue = encodedValue.substring(
                  1, encodedValue.length - 1);
              break;
          }
          decodedValue = this.unescapeEntities_(this.stripNULs_(encodedValue));
        } else {
          // Use name as value for valueless attribs, so
          //   <input type=checkbox checked>
          // gets attributes ['type', 'checkbox', 'checked', 'checked']
          decodedValue = attribName;
        }
        attribs.push(attribName, decodedValue);
      } else if (m[4]) {
        if (eflags !== void 0) {  // False if not in whitelist.
          if (openTag) {
            if (handler.startTag) {
              handler.startTag(/** @type {string} */ (tagName), attribs);
            }
          } else {
            if (handler.endTag) {
              handler.endTag(/** @type {string} */ (tagName));
            }
          }
        }

        if (openTag && (eflags &
            (goog.string.html.HtmlParser.EFlags.CDATA |
             goog.string.html.HtmlParser.EFlags.RCDATA))) {
          if (htmlLower === null) {
            htmlLower = goog.string.html.toLowerCase (htmlText);
          } else {
           htmlLower = htmlLower.substring(
                htmlLower.length - htmlText.length);
          }
          var dataEnd = htmlLower.indexOf('</' + tagName);
          if (dataEnd < 0) {
            dataEnd = htmlText.length;
          }
          if (eflags & goog.string.html.HtmlParser.EFlags.CDATA) {
            if (handler.cdata) {
              handler.cdata(htmlText.substring(0, dataEnd));
            }
          } else if (handler.rcdata) {
            handler.rcdata(
                this.normalizeRCData_(htmlText.substring(0, dataEnd)));
          }
          htmlText = htmlText.substring(dataEnd);
        }

        tagName = eflags = openTag = void 0;
        attribs.length = 0;
        inTag = false;
      }
    } else {
      if (m[1]) {  // Entity.
        handler.pcdata(m[0]);
      } else if (m[3]) {  // Tag.
        openTag = !m[2];
        inTag = true;
        tagName = goog.string.html.toLowerCase (m[3]);
        eflags = goog.string.html.HtmlParser.Elements.hasOwnProperty(tagName) ?
            goog.string.html.HtmlParser.Elements[tagName] : void 0;
      } else if (m[4]) {  // Text.
        handler.pcdata(m[4]);
      } else if (m[5]) {  // Cruft.
        switch (m[5]) {
          case '<': handler.pcdata('&lt;'); break;
          case '>': handler.pcdata('&gt;'); break;
          default: handler.pcdata('&amp;'); break;
        }
      }
    }
  }

  // Lets the handler know that we are done parsing the document.
  handler.endDoc();
};


/**
 * Decodes an HTML entity.
 *
 * @param {string} name The content between the '&' and the ';'.
 * @return {string} A single unicode code-point as a string.
 * @private
 */
goog.string.html.HtmlParser.prototype.lookupEntity_ = function(name) {
  // TODO(goto): use {goog.string.htmlDecode} instead ?
  // TODO(goto): &pi; is different from &Pi;
  name = goog.string.html.toLowerCase(name);
  if (goog.string.html.HtmlParser.Entities.hasOwnProperty(name)) {
    return goog.string.html.HtmlParser.Entities[name];
  }
  var m = name.match(goog.string.html.HtmlParser.DECIMAL_ESCAPE_RE_);
  if (m) {
    return String.fromCharCode(parseInt(m[1], 10));
  } else if (
      !!(m = name.match(goog.string.html.HtmlParser.HEX_ESCAPE_RE_))) {
    return String.fromCharCode(parseInt(m[1], 16));
  }
  return '';
};


/**
 * Removes null characters on the string.
 * @param {string} s The string to have the null characters removed.
 * @return {string} A string without null characters.
 * @private
 */
goog.string.html.HtmlParser.prototype.stripNULs_ = function(s) {
  return s.replace(goog.string.html.HtmlParser.NULL_RE_, '');
};


/**
 * The plain text of a chunk of HTML CDATA which possibly containing.
 *
 * TODO(goto): use {@code goog.string.unescapeEntities} instead ?
 * @param {string} s A chunk of HTML CDATA.  It must not start or end inside
 *   an HTML entity.
 * @return {string} The unescaped entities.
 * @private
 */
goog.string.html.HtmlParser.prototype.unescapeEntities_ = function(s) {
  return s.replace(
      goog.string.html.HtmlParser.ENTITY_RE_,
      goog.bind(this.lookupEntity_, this));
};


/**
 * Escape entities in RCDATA that can be escaped without changing the meaning.
 * @param {string} rcdata The RCDATA string we want to normalize.
 * @return {string} A normalized version of RCDATA.
 * @private
 */
goog.string.html.HtmlParser.prototype.normalizeRCData_ = function(rcdata) {
  return rcdata.
      replace(goog.string.html.HtmlParser.LOOSE_AMP_RE_, '&amp;$1').
      replace(goog.string.html.HtmlParser.LT_RE_, '&lt;').
      replace(goog.string.html.HtmlParser.GT_RE_, '&gt;');
};


/**
 * TODO(goto): why isn't this in the string package ? does this solves any
 * real problem ? move it to the goog.string package if it does.
 *
 * @param {string} str The string to lower case.
 * @return {string} The str in lower case format.
 */
goog.string.html.toLowerCase = function(str) {
  // The below may not be true on browsers in the Turkish locale.
  if ('script' === 'SCRIPT'.toLowerCase()) {
    return str.toLowerCase();
  } else {
    return str.replace(/[A-Z]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    });
  }
};


/**
 * An interface to the {@code goog.string.html.HtmlParser} visitor, that gets
 * called while the HTML is being parsed.
 *
 * @constructor
 */
goog.string.html.HtmlSaxHandler = function() {
};


/**
 * Handler called when the parser found a new tag.
 * @param {string} name The name of the tag that is starting.
 * @param {Array.<string>} attributes The attributes of the tag.
 */
goog.string.html.HtmlSaxHandler.prototype.startTag = goog.abstractMethod;


/**
 * Handler called when the parser found a closing tag.
 * @param {string} name The name of the tag that is ending.
 */
goog.string.html.HtmlSaxHandler.prototype.endTag = goog.abstractMethod;


/**
 * Handler called when PCDATA is found.
 * @param {string} text The PCDATA text found.
 */
goog.string.html.HtmlSaxHandler.prototype.pcdata = goog.abstractMethod;


/**
 * Handler called when RCDATA is found.
 * @param {string} text The RCDATA text found.
 */
goog.string.html.HtmlSaxHandler.prototype.rcdata = goog.abstractMethod;


/**
 * Handler called when CDATA is found.
 * @param {string} text The CDATA text found.
 */
goog.string.html.HtmlSaxHandler.prototype.cdata = goog.abstractMethod;


/**
 * Handler called when the parser is starting to parse the document.
 */
goog.string.html.HtmlSaxHandler.prototype.startDoc = goog.abstractMethod;


/**
 * Handler called when the parsing is done.
 */
goog.string.html.HtmlSaxHandler.prototype.endDoc = goog.abstractMethod;
