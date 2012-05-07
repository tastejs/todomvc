// Copyright 2005-2009, The Dojo Foundation
// Modifications Copyright 2008 The Closure Library Authors.
// All Rights Reserved.

/**
 * @license Portions of this code are from the Dojo Toolkit, received by
 * The Closure Library Authors under the BSD license. All other code is
 * Copyright 2005-2009 The Closure Library Authors. All Rights Reserved.

The "New" BSD License:

Copyright (c) 2005-2009, The Dojo Foundation
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
  * Neither the name of the Dojo Foundation nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @fileoverview This code was ported from the Dojo Toolkit
   http://dojotoolkit.org and modified slightly for Closure.
 *
 *  goog.dom.query is a relatively full-featured CSS3 query function. It is
 *  designed to take any valid CSS3 selector and return the nodes matching
 *  the selector. To do this quickly, it processes queries in several
 *  steps, applying caching where profitable.
 *    The steps (roughly in reverse order of the way they appear in the code):
 *    1.) check to see if we already have a "query dispatcher"
 *      - if so, use that with the given parameterization. Skip to step 4.
 *    2.) attempt to determine which branch to dispatch the query to:
 *      - JS (optimized DOM iteration)
 *      - native (FF3.1, Safari 3.2+, Chrome, some IE 8 doctypes). If native,
 *        skip to step 4, using a stub dispatcher for QSA queries.
 *    3.) tokenize and convert to executable "query dispatcher"
 *        assembled as a chain of "yes/no" test functions pertaining to
 *        a section of a simple query statement (".blah:nth-child(odd)"
 *        but not "div div", which is 2 simple statements).
 *    4.) the resulting query dispatcher is called in the passed scope
 *        (by default the top-level document)
 *      - for DOM queries, this results in a recursive, top-down
 *        evaluation of nodes based on each simple query section
 *      - querySelectorAll is used instead of DOM where possible. If a query
 *        fails in this mode, it is re-run against the DOM evaluator and all
 *        future queries using the same selector evaluate against the DOM branch
 *        too.
 *    5.) matched nodes are pruned to ensure they are unique
 */

goog.provide('goog.dom.query');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.functions');
goog.require('goog.string');
goog.require('goog.userAgent');

  /**
   * Returns nodes which match the given CSS3 selector, searching the
   * entire document by default but optionally taking a node to scope
   * the search by.
   *
   * dojo.query() is the swiss army knife of DOM node manipulation in
   * Dojo. Much like Prototype's "$$" (bling-bling) function or JQuery's
   * "$" function, dojo.query provides robust, high-performance
   * CSS-based node selector support with the option of scoping searches
   * to a particular sub-tree of a document.
   *
   * Supported Selectors:
   * --------------------
   *
   * dojo.query() supports a rich set of CSS3 selectors, including:
   *
   *   * class selectors (e.g., `.foo`)
   *   * node type selectors like `span`
   *   * ` ` descendant selectors
   *   * `>` child element selectors
   *   * `#foo` style ID selectors
   *   * `*` universal selector
   *   * `~`, the immediately preceeded-by sibling selector
   *   * `+`, the preceeded-by sibling selector
   *   * attribute queries:
   *   |  * `[foo]` attribute presence selector
   *   |  * `[foo='bar']` attribute value exact match
   *   |  * `[foo~='bar']` attribute value list item match
   *   |  * `[foo^='bar']` attribute start match
   *   |  * `[foo$='bar']` attribute end match
   *   |  * `[foo*='bar']` attribute substring match
   *   * `:first-child`, `:last-child` positional selectors
   *   * `:empty` content emtpy selector
   *   * `:empty` content emtpy selector
   *   * `:nth-child(n)`, `:nth-child(2n+1)` style positional calculations
   *   * `:nth-child(even)`, `:nth-child(odd)` positional selectors
   *   * `:not(...)` negation pseudo selectors
   *
   * Any legal combination of these selectors will work with
   * `dojo.query()`, including compound selectors ("," delimited).
   * Very complex and useful searches can be constructed with this
   * palette of selectors.
   *
   * Unsupported Selectors:
   * ----------------------
   *
   * While dojo.query handles many CSS3 selectors, some fall outside of
   * what's resaonable for a programmatic node querying engine to
   * handle. Currently unsupported selectors include:
   *
   *   * namespace-differentiated selectors of any form
   *   * all `::` pseduo-element selectors
   *   * certain pseudo-selectors which don't get a lot of day-to-day use:
   *   |  * `:root`, `:lang()`, `:target`, `:focus`
   *   * all visual and state selectors:
   *   |  * `:root`, `:active`, `:hover`, `:visisted`, `:link`,
   *       `:enabled`, `:disabled`, `:checked`
   *   * `:*-of-type` pseudo selectors
   *
   * dojo.query and XML Documents:
   * -----------------------------
   *
   * `dojo.query` currently only supports searching XML documents
   * whose tags and attributes are 100% lower-case. This is a known
   * limitation and will [be addressed soon]
   * (http://trac.dojotoolkit.org/ticket/3866)
   *
   * Non-selector Queries:
   * ---------------------
   *
   * If something other than a String is passed for the query,
   * `dojo.query` will return a new array constructed from
   * that parameter alone and all further processing will stop. This
   * means that if you have a reference to a node or array or nodes, you
   * can quickly construct a new array of nodes from the original by
   * calling `dojo.query(node)` or `dojo.query(array)`.
   *
   * example:
   *   search the entire document for elements with the class "foo":
   * |  dojo.query(".foo");
   *   these elements will match:
   * |  <span class="foo"></span>
   * |  <span class="foo bar"></span>
   * |  <p class="thud foo"></p>
   * example:
   *   search the entire document for elements with the classes "foo" *and*
   *   "bar":
   * |  dojo.query(".foo.bar");
   *   these elements will match:
   * |  <span class="foo bar"></span>
   *   while these will not:
   * |  <span class="foo"></span>
   * |  <p class="thud foo"></p>
   * example:
   *   find `<span>` elements which are descendants of paragraphs and
   *   which have a "highlighted" class:
   * |  dojo.query("p span.highlighted");
   *   the innermost span in this fragment matches:
   * |  <p class="foo">
   * |    <span>...
   * |      <span class="highlighted foo bar">...</span>
   * |    </span>
   * |  </p>
   * example:
   *   find all odd table rows inside of the table
   *   `#tabular_data`, using the `>` (direct child) selector to avoid
   *   affecting any nested tables:
   * |  dojo.query("#tabular_data > tbody > tr:nth-child(odd)");
   *
   * @param {string|Array} query The CSS3 expression to match against.
   *     For details on the syntax of CSS3 selectors, see
   *     http://www.w3.org/TR/css3-selectors/#selectors.
   * @param {(string|Node)=} opt_root A Node (or node id) to scope the search
   *     from (optional).
   * @return { {length: number} } The elements that matched the query.
   */
goog.dom.query = (function() {
  ////////////////////////////////////////////////////////////////////////
  // Global utilities
  ////////////////////////////////////////////////////////////////////////

  var cssCaseBug = (goog.userAgent.WEBKIT &&
                     ((goog.dom.getDocument().compatMode) == 'BackCompat')
                   );

  // On browsers that support the "children" collection we can avoid a lot of
  // iteration on chaff (non-element) nodes.
  var childNodesName = !!goog.dom.getDocument().firstChild['children'] ?
                          'children' :
                          'childNodes';

  var specials = '>~+';

  // Global thunk to determine whether we should treat the current query as
  // case sensitive or not. This switch is flipped by the query evaluator based
  // on the document passed as the context to search.
  var caseSensitive = false;


  ////////////////////////////////////////////////////////////////////////
  // Tokenizer
  ////////////////////////////////////////////////////////////////////////

  var getQueryParts = function(query) {
    //  summary:
    //    state machine for query tokenization
    //  description:
    //    instead of using a brittle and slow regex-based CSS parser,
    //    dojo.query implements an AST-style query representation. This
    //    representation is only generated once per query. For example,
    //    the same query run multiple times or under different root nodes
    //    does not re-parse the selector expression but instead uses the
    //    cached data structure. The state machine implemented here
    //    terminates on the last " " (space) charachter and returns an
    //    ordered array of query component structures (or "parts"). Each
    //    part represents an operator or a simple CSS filtering
    //    expression. The structure for parts is documented in the code
    //    below.


    // NOTE:
    //    this code is designed to run fast and compress well. Sacrifices
    //    to readibility and maintainability have been made.
    if (specials.indexOf(query.slice(-1)) >= 0) {
      // If we end with a ">", "+", or "~", that means we're implicitly
      // searching all children, so make it explicit.
      query += ' * '
    } else {
      // if you have not provided a terminator, one will be provided for
      // you...
      query += ' ';
    }

    var ts = function(/*Integer*/ s, /*Integer*/ e) {
      // trim and slice.

      // take an index to start a string slice from and an end position
      // and return a trimmed copy of that sub-string
      return goog.string.trim(query.slice(s, e));
    };

    // The overall data graph of the full query, as represented by queryPart
    // objects.
    var queryParts = [];


    // state keeping vars
    var inBrackets = -1,
        inParens = -1,
        inMatchFor = -1,
        inPseudo = -1,
        inClass = -1,
        inId = -1,
        inTag = -1,
        lc = '',
        cc = '',
        pStart;

    // iteration vars
    var x = 0, // index in the query
        ql = query.length,
        currentPart = null, // data structure representing the entire clause
        cp = null; // the current pseudo or attr matcher

    // several temporary variables are assigned to this structure durring a
    // potential sub-expression match:
    //    attr:
    //      a string representing the current full attribute match in a
    //      bracket expression
    //    type:
    //      if there's an operator in a bracket expression, this is
    //      used to keep track of it
    //    value:
    //      the internals of parenthetical expression for a pseudo. for
    //      :nth-child(2n+1), value might be '2n+1'

    var endTag = function() {
      // called when the tokenizer hits the end of a particular tag name.
      // Re-sets state variables for tag matching and sets up the matcher
      // to handle the next type of token (tag or operator).
      if (inTag >= 0) {
        var tv = (inTag == x) ? null : ts(inTag, x);
        if (specials.indexOf(tv) < 0) {
          currentPart.tag = tv;
        } else {
          currentPart.oper = tv;
        }
        inTag = -1;
      }
    };

    var endId = function() {
      // Called when the tokenizer might be at the end of an ID portion of a
      // match.
      if (inId >= 0) {
        currentPart.id = ts(inId, x).replace(/\\/g, '');
        inId = -1;
      }
    };

    var endClass = function() {
      // Called when the tokenizer might be at the end of a class name
      // match. CSS allows for multiple classes, so we augment the
      // current item with another class in its list.
      if (inClass >= 0) {
        currentPart.classes.push(ts(inClass + 1, x).replace(/\\/g, ''));
        inClass = -1;
      }
    };

    var endAll = function() {
      // at the end of a simple fragment, so wall off the matches
      endId(); endTag(); endClass();
    };

    var endPart = function() {
      endAll();
      if (inPseudo >= 0) {
        currentPart.pseudos.push({ name: ts(inPseudo + 1, x) });
      }
      // Hint to the selector engine to tell it whether or not it
      // needs to do any iteration. Many simple selectors don't, and
      // we can avoid significant construction-time work by advising
      // the system to skip them.
      currentPart.loops = currentPart.pseudos.length ||
                          currentPart.attrs.length ||
                          currentPart.classes.length;

      // save the full expression as a string
      currentPart.oquery = currentPart.query = ts(pStart, x);


      // otag/tag are hints to suggest to the system whether or not
      // it's an operator or a tag. We save a copy of otag since the
      // tag name is cast to upper-case in regular HTML matches. The
      // system has a global switch to figure out if the current
      // expression needs to be case sensitive or not and it will use
      // otag or tag accordingly
      currentPart.otag = currentPart.tag = (currentPart.oper) ?
                                                     null :
                                                     (currentPart.tag || '*');

      if (currentPart.tag) {
        // if we're in a case-insensitive HTML doc, we likely want
        // the toUpperCase when matching on element.tagName. If we
        // do it here, we can skip the string op per node
        // comparison
        currentPart.tag = currentPart.tag.toUpperCase();
      }

      // add the part to the list
      if (queryParts.length && (queryParts[queryParts.length - 1].oper)) {
        // operators are always infix, so we remove them from the
        // list and attach them to the next match. The evaluator is
        // responsible for sorting out how to handle them.
        currentPart.infixOper = queryParts.pop();
        currentPart.query = currentPart.infixOper.query + ' ' +
            currentPart.query;
      }
      queryParts.push(currentPart);

      currentPart = null;
    }

    // iterate over the query, charachter by charachter, building up a
    // list of query part objects
    for (; lc = cc, cc = query.charAt(x), x < ql; x++) {
      //    cc: the current character in the match
      //    lc: the last charachter (if any)

      // someone is trying to escape something, so don't try to match any
      // fragments. We assume we're inside a literal.
      if (lc == '\\') {
        continue;
      }
      if (!currentPart) { // a part was just ended or none has yet been created
        // NOTE: I hate all this alloc, but it's shorter than writing tons of
        // if's
        pStart = x;
        //  rules describe full CSS sub-expressions, like:
        //    #someId
        //    .className:first-child
        //  but not:
        //    thinger > div.howdy[type=thinger]
        //  the indidual components of the previous query would be
        //  split into 3 parts that would be represented a structure
        //  like:
        //    [
        //      {
        //        query: 'thinger',
        //        tag: 'thinger',
        //      },
        //      {
        //        query: 'div.howdy[type=thinger]',
        //        classes: ['howdy'],
        //        infixOper: {
        //          query: '>',
        //          oper: '>',
        //        }
        //      },
        //    ]
        currentPart = {
          query: null, // the full text of the part's rule
          pseudos: [], // CSS supports multiple pseud-class matches in a single
              // rule
          attrs: [],  // CSS supports multi-attribute match, so we need an array
          classes: [], // class matches may be additive,
              // e.g.: .thinger.blah.howdy
          tag: null,  // only one tag...
          oper: null, // ...or operator per component. Note that these wind up
              // being exclusive.
          id: null,   // the id component of a rule
          getTag: function() {
            return (caseSensitive) ? this.otag : this.tag;
          }
        };

        // if we don't have a part, we assume we're going to start at
        // the beginning of a match, which should be a tag name. This
        // might fault a little later on, but we detect that and this
        // iteration will still be fine.
        inTag = x;
      }

      if (inBrackets >= 0) {
        // look for a the close first
        if (cc == ']') { // if we're in a [...] clause and we end, do assignment
          if (!cp.attr) {
            // no attribute match was previously begun, so we
            // assume this is an attribute existance match in the
            // form of [someAttributeName]
            cp.attr = ts(inBrackets + 1, x);
          } else {
            // we had an attribute already, so we know that we're
            // matching some sort of value, as in [attrName=howdy]
            cp.matchFor = ts((inMatchFor || inBrackets + 1), x);
          }
          var cmf = cp.matchFor;
          if (cmf) {
            // try to strip quotes from the matchFor value. We want
            // [attrName=howdy] to match the same
            //  as [attrName = 'howdy' ]
            if ((cmf.charAt(0) == '"') || (cmf.charAt(0) == "'")) {
              cp.matchFor = cmf.slice(1, -1);
            }
          }
          // end the attribute by adding it to the list of attributes.
          currentPart.attrs.push(cp);
          cp = null; // necessary?
          inBrackets = inMatchFor = -1;
        } else if (cc == '=') {
          // if the last char was an operator prefix, make sure we
          // record it along with the '=' operator.
          var addToCc = ('|~^$*'.indexOf(lc) >= 0) ? lc : '';
          cp.type = addToCc + cc;
          cp.attr = ts(inBrackets + 1, x - addToCc.length);
          inMatchFor = x + 1;
        }
        // now look for other clause parts
      } else if (inParens >= 0) {
        // if we're in a parenthetical expression, we need to figure
        // out if it's attached to a pseduo-selector rule like
        // :nth-child(1)
        if (cc == ')') {
          if (inPseudo >= 0) {
            cp.value = ts(inParens + 1, x);
          }
          inPseudo = inParens = -1;
        }
      } else if (cc == '#') {
        // start of an ID match
        endAll();
        inId = x + 1;
      } else if (cc == '.') {
        // start of a class match
        endAll();
        inClass = x;
      } else if (cc == ':') {
        // start of a pseudo-selector match
        endAll();
        inPseudo = x;
      } else if (cc == '[') {
        // start of an attribute match.
        endAll();
        inBrackets = x;
        // provide a new structure for the attribute match to fill-in
        cp = {
          /*=====
          attr: null, type: null, matchFor: null
          =====*/
        };
      } else if (cc == '(') {
        // we really only care if we've entered a parenthetical
        // expression if we're already inside a pseudo-selector match
        if (inPseudo >= 0) {
          // provide a new structure for the pseudo match to fill-in
          cp = {
            name: ts(inPseudo + 1, x),
            value: null
          }
          currentPart.pseudos.push(cp);
        }
        inParens = x;
      } else if (
        (cc == ' ') &&
        // if it's a space char and the last char is too, consume the
        // current one without doing more work
        (lc != cc)
      ) {
        endPart();
      }
    }
    return queryParts;
  };


  ////////////////////////////////////////////////////////////////////////
  // DOM query infrastructure
  ////////////////////////////////////////////////////////////////////////

  var agree = function(first, second) {
    // the basic building block of the yes/no chaining system. agree(f1,
    // f2) generates a new function which returns the boolean results of
    // both of the passed functions to a single logical-anded result. If
    // either are not possed, the other is used exclusively.
    if (!first) {
      return second;
    }
    if (!second) {
      return first;
    }

    return function() {
      return first.apply(window, arguments) && second.apply(window, arguments);
    }
  };

  /**
   * @param {Array=} opt_arr
   */
  function getArr(i, opt_arr) {
    // helps us avoid array alloc when we don't need it
    var r = opt_arr || [];
    if (i) {
      r.push(i);
    }
    return r;
  };

  var isElement = function(n) {
    return (1 == n.nodeType);
  };

  // FIXME: need to coalesce getAttr with defaultGetter
  var blank = '';
  var getAttr = function(elem, attr) {
    if (!elem) {
      return blank;
    }
    if (attr == 'class') {
      return elem.className || blank;
    }
    if (attr == 'for') {
      return elem.htmlFor || blank;
    }
    if (attr == 'style') {
      return elem.style.cssText || blank;
    }
    return (caseSensitive ? elem.getAttribute(attr) :
        elem.getAttribute(attr, 2)) || blank;
  };

  var attrs = {
    '*=': function(attr, value) {
      return function(elem) {
        // E[foo*="bar"]
        //    an E element whose "foo" attribute value contains
        //    the substring "bar"
        return (getAttr(elem, attr).indexOf(value) >= 0);
      }
    },
    '^=': function(attr, value) {
      // E[foo^="bar"]
      //    an E element whose "foo" attribute value begins exactly
      //    with the string "bar"
      return function(elem) {
        return (getAttr(elem, attr).indexOf(value) == 0);
      }
    },
    '$=': function(attr, value) {
      // E[foo$="bar"]
      //    an E element whose "foo" attribute value ends exactly
      //    with the string "bar"
      var tval = ' ' + value;
      return function(elem) {
        var ea = ' ' + getAttr(elem, attr);
        return (ea.lastIndexOf(value) == (ea.length - value.length));
      }
    },
    '~=': function(attr, value) {
      // E[foo~="bar"]
      //    an E element whose "foo" attribute value is a list of
      //    space-separated values, one of which is exactly equal
      //    to "bar"

      var tval = ' ' + value + ' ';
      return function(elem) {
        var ea = ' ' + getAttr(elem, attr) + ' ';
        return (ea.indexOf(tval) >= 0);
      }
    },
    '|=': function(attr, value) {
      // E[hreflang|="en"]
      //    an E element whose "hreflang" attribute has a
      //    hyphen-separated list of values beginning (from the
      //    left) with "en"
      value = ' ' + value;
      return function(elem) {
        var ea = ' ' + getAttr(elem, attr);
        return (
          (ea == value) ||
          (ea.indexOf(value + '-') == 0)
        );
      }
    },
    '=': function(attr, value) {
      return function(elem) {
        return (getAttr(elem, attr) == value);
      }
    }
  };

  // avoid testing for node type if we can. Defining this in the negative
  // here to avoid negation in the fast path.
  var noNextElementSibling = (
    typeof goog.dom.getDocument().firstChild.nextElementSibling == 'undefined'
  );
  var nSibling = !noNextElementSibling ? 'nextElementSibling' : 'nextSibling';
  var pSibling = !noNextElementSibling ?
                    'previousElementSibling' :
                    'previousSibling';
  var simpleNodeTest = (noNextElementSibling ? isElement : goog.functions.TRUE);

  var _lookLeft = function(node) {
    while (node = node[pSibling]) {
      if (simpleNodeTest(node)) {
        return false;
      }
    }
    return true;
  };

  var _lookRight = function(node) {
    while (node = node[nSibling]) {
      if (simpleNodeTest(node)) {
        return false;
      }
    }
    return true;
  };

  var getNodeIndex = function(node) {
    var root = node.parentNode;
    var i = 0,
        tret = root[childNodesName],
        ci = (node['_i'] || -1),
        cl = (root['_l'] || -1);

    if (!tret) {
      return -1;
    }
    var l = tret.length;

    // we calcuate the parent length as a cheap way to invalidate the
    // cache. It's not 100% accurate, but it's much more honest than what
    // other libraries do
    if (cl == l && ci >= 0 && cl >= 0) {
      // if it's legit, tag and release
      return ci;
    }

    // else re-key things
    root['_l'] = l;
    ci = -1;
    var te = root['firstElementChild'] || root['firstChild'];
    for (; te; te = te[nSibling]) {
      if (simpleNodeTest(te)) {
        te['_i'] = ++i;
        if (node === te) {
          // NOTE:
          //  shortcuting the return at this step in indexing works
          //  very well for benchmarking but we avoid it here since
          //  it leads to potential O(n^2) behavior in sequential
          //  getNodexIndex operations on a previously un-indexed
          //  parent. We may revisit this at a later time, but for
          //  now we just want to get the right answer more often
          //  than not.
          ci = i;
        }
      }
    }
    return ci;
  };

  var isEven = function(elem) {
    return !((getNodeIndex(elem)) % 2);
  };

  var isOdd = function(elem) {
    return (getNodeIndex(elem)) % 2;
  };

  var pseudos = {
    'checked': function(name, condition) {
      return function(elem) {
        return elem.checked || elem.attributes['checked'];
      }
    },
    'first-child': function() {
      return _lookLeft;
    },
    'last-child': function() {
      return _lookRight;
    },
    'only-child': function(name, condition) {
      return function(node) {
        if (!_lookLeft(node)) {
          return false;
        }
        if (!_lookRight(node)) {
          return false;
        }
        return true;
      };
    },
    'empty': function(name, condition) {
      return function(elem) {
        // DomQuery and jQuery get this wrong, oddly enough.
        // The CSS 3 selectors spec is pretty explicit about it, too.
        var cn = elem.childNodes;
        var cnl = elem.childNodes.length;
        // if(!cnl) { return true; }
        for (var x = cnl - 1; x >= 0; x--) {
          var nt = cn[x].nodeType;
          if ((nt === 1) || (nt == 3)) {
            return false;
          }
        }
        return true;
      }
    },
    'contains': function(name, condition) {
      var cz = condition.charAt(0);
      if (cz == '"' || cz == "'") { // Remove quotes.
        condition = condition.slice(1, -1);
      }
      return function(elem) {
        return (elem.innerHTML.indexOf(condition) >= 0);
      }
    },
    'not': function(name, condition) {
      var p = getQueryParts(condition)[0];
      var ignores = { el: 1 };
      if (p.tag != '*') {
        ignores.tag = 1;
      }
      if (!p.classes.length) {
        ignores.classes = 1;
      }
      var ntf = getSimpleFilterFunc(p, ignores);
      return function(elem) {
        return !ntf(elem);
      }
    },
    'nth-child': function(name, condition) {
      function pi(n) {
        return parseInt(n, 10);
      }
      // avoid re-defining function objects if we can
      if (condition == 'odd') {
        return isOdd;
      } else if (condition == 'even') {
        return isEven;
      }
      // FIXME: can we shorten this?
      if (condition.indexOf('n') != -1) {
        var tparts = condition.split('n', 2);
        var pred = tparts[0] ? ((tparts[0] == '-') ? -1 : pi(tparts[0])) : 1;
        var idx = tparts[1] ? pi(tparts[1]) : 0;
        var lb = 0, ub = -1;
        if (pred > 0) {
          if (idx < 0) {
            idx = (idx % pred) && (pred + (idx % pred));
          } else if (idx > 0) {
            if (idx >= pred) {
              lb = idx - idx % pred;
            }
            idx = idx % pred;
          }
        } else if (pred < 0) {
          pred *= -1;
          // idx has to be greater than 0 when pred is negative;
          // shall we throw an error here?
          if (idx > 0) {
            ub = idx;
            idx = idx % pred;
          }
        }
        if (pred > 0) {
          return function(elem) {
            var i = getNodeIndex(elem);
            return (i >= lb) && (ub < 0 || i <= ub) && ((i % pred) == idx);
          }
        } else {
          condition = idx;
        }
      }
      var ncount = pi(condition);
      return function(elem) {
        return (getNodeIndex(elem) == ncount);
      }
    }
  };

  var defaultGetter = (goog.userAgent.IE) ? function(cond) {
    var clc = cond.toLowerCase();
    if (clc == 'class') {
      cond = 'className';
    }
    return function(elem) {
      return caseSensitive ? elem.getAttribute(cond) : elem[cond] || elem[clc];
    }
  } : function(cond) {
    return function(elem) {
      return elem && elem.getAttribute && elem.hasAttribute(cond);
    }
  };

  var getSimpleFilterFunc = function(query, ignores) {
    // Generates a node tester function based on the passed query part. The
    // query part is one of the structures generatd by the query parser when it
    // creates the query AST. The 'ignores' object specifies which (if any)
    // tests to skip, allowing the system to avoid duplicating work where it
    // may have already been taken into account by other factors such as how
    // the nodes to test were fetched in the first place.
    if (!query) {
      return goog.functions.TRUE;
    }
    ignores = ignores || {};

    var ff = null;

    if (!ignores.el) {
      ff = agree(ff, isElement);
    }

    if (!ignores.tag) {
      if (query.tag != '*') {
        ff = agree(ff, function(elem) {
          return (elem && (elem.tagName == query.getTag()));
        });
      }
    }

    if (!ignores.classes) {
      goog.array.forEach(query.classes, function(cname, idx, arr) {
        // Get the class name.
        var re = new RegExp('(?:^|\\s)' + cname + '(?:\\s|$)');
        ff = agree(ff, function(elem) {
          return re.test(elem.className);
        });
        ff.count = idx;
      });
    }

    if (!ignores.pseudos) {
      goog.array.forEach(query.pseudos, function(pseudo) {
        var pn = pseudo.name;
        if (pseudos[pn]) {
          ff = agree(ff, pseudos[pn](pn, pseudo.value));
        }
      });
    }

    if (!ignores.attrs) {
      goog.array.forEach(query.attrs, function(attr) {
        var matcher;
        var a = attr.attr;
        // type, attr, matchFor
        if (attr.type && attrs[attr.type]) {
          matcher = attrs[attr.type](a, attr.matchFor);
        } else if (a.length) {
          matcher = defaultGetter(a);
        }
        if (matcher) {
          ff = agree(ff, matcher);
        }
      });
    }

    if (!ignores.id) {
      if (query.id) {
        ff = agree(ff, function(elem) {
          return (!!elem && (elem.id == query.id));
        });
      }
    }

    if (!ff) {
      if (!('default' in ignores)) {
        ff = goog.functions.TRUE;
      }
    }
    return ff;
  };

  var nextSiblingIterator = function(filterFunc) {
    return function(node, ret, bag) {
      while (node = node[nSibling]) {
        if (noNextElementSibling && (!isElement(node))) {
          continue;
        }
        if (
          (!bag || _isUnique(node, bag)) &&
          filterFunc(node)
        ) {
          ret.push(node);
        }
        break;
      }
      return ret;
    };
  };

  var nextSiblingsIterator = function(filterFunc) {
    return function(root, ret, bag) {
      var te = root[nSibling];
      while (te) {
        if (simpleNodeTest(te)) {
          if (bag && !_isUnique(te, bag)) {
            break;
          }
          if (filterFunc(te)) {
            ret.push(te);
          }
        }
        te = te[nSibling];
      }
      return ret;
    };
  };

  // Get an array of child *elements*, skipping text and comment nodes
  var _childElements = function(filterFunc) {
    filterFunc = filterFunc || goog.functions.TRUE;
    return function(root, ret, bag) {
      var te, x = 0, tret = root[childNodesName];
      while (te = tret[x++]) {
        if (
          simpleNodeTest(te) &&
          (!bag || _isUnique(te, bag)) &&
          (filterFunc(te, x))
        ) {
          ret.push(te);
        }
      }
      return ret;
    };
  };

  // test to see if node is below root
  var _isDescendant = function(node, root) {
    var pn = node.parentNode;
    while (pn) {
      if (pn == root) {
        break;
      }
      pn = pn.parentNode;
    }
    return !!pn;
  };

  var _getElementsFuncCache = {};

  var getElementsFunc = function(query) {
    var retFunc = _getElementsFuncCache[query.query];
    // If we've got a cached dispatcher, just use that.
    if (retFunc) {
      return retFunc;
    }
    // Else, generate a new one.

    // NOTE:
    //    This function returns a function that searches for nodes and
    //    filters them. The search may be specialized by infix operators
    //    (">", "~", or "+") else it will default to searching all
    //    descendants (the " " selector). Once a group of children is
    //    founde, a test function is applied to weed out the ones we
    //    don't want. Many common cases can be fast-pathed. We spend a
    //    lot of cycles to create a dispatcher that doesn't do more work
    //    than necessary at any point since, unlike this function, the
    //    dispatchers will be called every time. The logic of generating
    //    efficient dispatchers looks like this in pseudo code:
    //
    //    # if it's a purely descendant query (no ">", "+", or "~" modifiers)
    //    if infixOperator == " ":
    //      if only(id):
    //        return def(root):
    //          return d.byId(id, root);
    //
    //      elif id:
    //        return def(root):
    //          return filter(d.byId(id, root));
    //
    //      elif cssClass && getElementsByClassName:
    //        return def(root):
    //          return filter(root.getElementsByClassName(cssClass));
    //
    //      elif only(tag):
    //        return def(root):
    //          return root.getElementsByTagName(tagName);
    //
    //      else:
    //        # search by tag name, then filter
    //        return def(root):
    //          return filter(root.getElementsByTagName(tagName||"*"));
    //
    //    elif infixOperator == ">":
    //      # search direct children
    //      return def(root):
    //        return filter(root.children);
    //
    //    elif infixOperator == "+":
    //      # search next sibling
    //      return def(root):
    //        return filter(root.nextElementSibling);
    //
    //    elif infixOperator == "~":
    //      # search rightward siblings
    //      return def(root):
    //        return filter(nextSiblings(root));

    var io = query.infixOper;
    var oper = (io ? io.oper : '');
    // The default filter func which tests for all conditions in the query
    // part. This is potentially inefficient, so some optimized paths may
    // re-define it to test fewer things.
    var filterFunc = getSimpleFilterFunc(query, { el: 1 });
    var qt = query.tag;
    var wildcardTag = ('*' == qt);
    var ecs = goog.dom.getDocument()['getElementsByClassName'];

    if (!oper) {
      // If there's no infix operator, then it's a descendant query. ID
      // and "elements by class name" variants can be accelerated so we
      // call them out explicitly:
      if (query.id) {
        // Testing shows that the overhead of goog.functions.TRUE() is
        // acceptable and can save us some bytes vs. re-defining the function
        // everywhere.
        filterFunc = (!query.loops && wildcardTag) ?
          goog.functions.TRUE :
          getSimpleFilterFunc(query, { el: 1, id: 1 });

        retFunc = function(root, arr) {
          var te = goog.dom.getDomHelper(root).getElement(query.id);
          if (!te || !filterFunc(te)) {
            return;
          }
          if (9 == root.nodeType) { // If root's a doc, we just return directly.
            return getArr(te, arr);
          } else { // otherwise check ancestry
            if (_isDescendant(te, root)) {
              return getArr(te, arr);
            }
          }
        }
      } else if (
        ecs &&
        // isAlien check. Workaround for Prototype.js being totally evil/dumb.
        /\{\s*\[native code\]\s*\}/.test(String(ecs)) &&
        query.classes.length &&
        // WebKit bug where quirks-mode docs select by class w/o case
        // sensitivity.
        !cssCaseBug
      ) {
        // it's a class-based query and we've got a fast way to run it.

        // ignore class and ID filters since we will have handled both
        filterFunc = getSimpleFilterFunc(query, { el: 1, classes: 1, id: 1 });
        var classesString = query.classes.join(' ');
        retFunc = function(root, arr) {
          var ret = getArr(0, arr), te, x = 0;
          var tret = root.getElementsByClassName(classesString);
          while ((te = tret[x++])) {
            if (filterFunc(te, root)) {
              ret.push(te);
            }
          }
          return ret;
        };

      } else if (!wildcardTag && !query.loops) {
        // it's tag only. Fast-path it.
        retFunc = function(root, arr) {
          var ret = getArr(0, arr), te, x = 0;
          var tret = root.getElementsByTagName(query.getTag());
          while ((te = tret[x++])) {
            ret.push(te);
          }
          return ret;
        };
      } else {
        // the common case:
        //    a descendant selector without a fast path. By now it's got
        //    to have a tag selector, even if it's just "*" so we query
        //    by that and filter
        filterFunc = getSimpleFilterFunc(query, { el: 1, tag: 1, id: 1 });
        retFunc = function(root, arr) {
          var ret = getArr(0, arr), te, x = 0;
          // we use getTag() to avoid case sensitivity issues
          var tret = root.getElementsByTagName(query.getTag());
          while (te = tret[x++]) {
            if (filterFunc(te, root)) {
              ret.push(te);
            }
          }
          return ret;
        };
      }
    } else {
      // the query is scoped in some way. Instead of querying by tag we
      // use some other collection to find candidate nodes
      var skipFilters = { el: 1 };
      if (wildcardTag) {
        skipFilters.tag = 1;
      }
      filterFunc = getSimpleFilterFunc(query, skipFilters);
      if ('+' == oper) {
        retFunc = nextSiblingIterator(filterFunc);
      } else if ('~' == oper) {
        retFunc = nextSiblingsIterator(filterFunc);
      } else if ('>' == oper) {
        retFunc = _childElements(filterFunc);
      }
    }
    // cache it and return
    return _getElementsFuncCache[query.query] = retFunc;
  };

  var filterDown = function(root, queryParts) {
    // NOTE:
    //    this is the guts of the DOM query system. It takes a list of
    //    parsed query parts and a root and finds children which match
    //    the selector represented by the parts
    var candidates = getArr(root), qp, x, te, qpl = queryParts.length, bag, ret;

    for (var i = 0; i < qpl; i++) {
      ret = [];
      qp = queryParts[i];
      x = candidates.length - 1;
      if (x > 0) {
        // if we have more than one root at this level, provide a new
        // hash to use for checking group membership but tell the
        // system not to post-filter us since we will already have been
        // gauranteed to be unique
        bag = {};
        ret.nozip = true;
      }
      var gef = getElementsFunc(qp);
      for (var j = 0; te = candidates[j]; j++) {
        // for every root, get the elements that match the descendant
        // selector, adding them to the 'ret' array and filtering them
        // via membership in this level's bag. If there are more query
        // parts, then this level's return will be used as the next
        // level's candidates
        gef(te, ret, bag);
      }
      if (!ret.length) { break; }
      candidates = ret;
    }
    return ret;
  };

  ////////////////////////////////////////////////////////////////////////
  // the query runner
  ////////////////////////////////////////////////////////////////////////

  // these are the primary caches for full-query results. The query
  // dispatcher functions are generated then stored here for hash lookup in
  // the future
  var _queryFuncCacheDOM = {},
    _queryFuncCacheQSA = {};

  // this is the second level of spliting, from full-length queries (e.g.,
  // 'div.foo .bar') into simple query expressions (e.g., ['div.foo',
  // '.bar'])
  var getStepQueryFunc = function(query) {
    var qparts = getQueryParts(goog.string.trim(query));

    // if it's trivial, avoid iteration and zipping costs
    if (qparts.length == 1) {
      // We optimize this case here to prevent dispatch further down the
      // chain, potentially slowing things down. We could more elegantly
      // handle this in filterDown(), but it's slower for simple things
      // that need to be fast (e.g., '#someId').
      var tef = getElementsFunc(qparts[0]);
      return function(root) {
        var r = tef(root, []);
        if (r) { r.nozip = true; }
        return r;
      }
    }

    // otherwise, break it up and return a runner that iterates over the parts
    // recursively
    return function(root) {
      return filterDown(root, qparts);
    }
  };

  // NOTES:
  //  * we can't trust QSA for anything but document-rooted queries, so
  //    caching is split into DOM query evaluators and QSA query evaluators
  //  * caching query results is dirty and leak-prone (or, at a minimum,
  //    prone to unbounded growth). Other toolkits may go this route, but
  //    they totally destroy their own ability to manage their memory
  //    footprint. If we implement it, it should only ever be with a fixed
  //    total element reference # limit and an LRU-style algorithm since JS
  //    has no weakref support. Caching compiled query evaluators is also
  //    potentially problematic, but even on large documents the size of the
  //    query evaluators is often < 100 function objects per evaluator (and
  //    LRU can be applied if it's ever shown to be an issue).
  //  * since IE's QSA support is currently only for HTML documents and even
  //    then only in IE 8's 'standards mode', we have to detect our dispatch
  //    route at query time and keep 2 separate caches. Ugg.

  var qsa = 'querySelectorAll';

  // some versions of Safari provided QSA, but it was buggy and crash-prone.
  // We need te detect the right 'internal' webkit version to make this work.
  var qsaAvail = (
    !!goog.dom.getDocument()[qsa] &&
    // see #5832
    (!goog.userAgent.WEBKIT || goog.userAgent.isVersion('526'))
  );

  /** @param {boolean=} opt_forceDOM */
  var getQueryFunc = function(query, opt_forceDOM) {

    if (qsaAvail) {
      // if we've got a cached variant and we think we can do it, run it!
      var qsaCached = _queryFuncCacheQSA[query];
      if (qsaCached && !opt_forceDOM) {
        return qsaCached;
      }
    }

    // else if we've got a DOM cached variant, assume that we already know
    // all we need to and use it
    var domCached = _queryFuncCacheDOM[query];
    if (domCached) {
      return domCached;
    }

    // TODO:
    //    today we're caching DOM and QSA branches separately so we
    //    recalc useQSA every time. If we had a way to tag root+query
    //    efficiently, we'd be in good shape to do a global cache.

    var qcz = query.charAt(0);
    var nospace = (-1 == query.indexOf(' '));

    // byId searches are wicked fast compared to QSA, even when filtering
    // is required
    if ((query.indexOf('#') >= 0) && (nospace)) {
      opt_forceDOM = true;
    }

    var useQSA = (
      qsaAvail && (!opt_forceDOM) &&
      // as per CSS 3, we can't currently start w/ combinator:
      //    http://www.w3.org/TR/css3-selectors/#w3cselgrammar
      (specials.indexOf(qcz) == -1) &&
      // IE's QSA impl sucks on pseudos
      (!goog.userAgent.IE || (query.indexOf(':') == -1)) &&

      (!(cssCaseBug && (query.indexOf('.') >= 0))) &&

      // FIXME:
      //    need to tighten up browser rules on ':contains' and '|=' to
      //    figure out which aren't good
      (query.indexOf(':contains') == -1) &&
      (query.indexOf('|=') == -1)
    );

    // TODO:
    //    if we've got a descendant query (e.g., '> .thinger' instead of
    //    just '.thinger') in a QSA-able doc, but are passed a child as a
    //    root, it should be possible to give the item a synthetic ID and
    //    trivially rewrite the query to the form '#synid > .thinger' to
    //    use the QSA branch


    if (useQSA) {
      var tq = (specials.indexOf(query.charAt(query.length - 1)) >= 0) ?
            (query + ' *') : query;
      return _queryFuncCacheQSA[query] = function(root) {
        try {
          // the QSA system contains an egregious spec bug which
          // limits us, effectively, to only running QSA queries over
          // entire documents.  See:
          //    http://ejohn.org/blog/thoughts-on-queryselectorall/
          //  despite this, we can also handle QSA runs on simple
          //  selectors, but we don't want detection to be expensive
          //  so we're just checking for the presence of a space char
          //  right now. Not elegant, but it's cheaper than running
          //  the query parser when we might not need to
          if (!((9 == root.nodeType) || nospace)) {
            throw '';
          }
          var r = root[qsa](tq);
          // IE QSA queries may incorrectly include comment nodes, so we throw
          // the zipping function into 'remove' comments mode instead of the
          // normal 'skip it' which every other QSA-clued browser enjoys
          // skip expensive duplication checks and just wrap in an array.
          if (goog.userAgent.IE) {
            r.commentStrip = true;
          } else {
            r.nozip = true;
          }
          return r;
        } catch (e) {
          // else run the DOM branch on this query, ensuring that we
          // default that way in the future
          return getQueryFunc(query, true)(root);
        }
      }
    } else {
      // DOM branch
      var parts = query.split(/\s*,\s*/);
      return _queryFuncCacheDOM[query] = ((parts.length < 2) ?
        // if not a compound query (e.g., '.foo, .bar'), cache and return a
        // dispatcher
        getStepQueryFunc(query) :
        // if it *is* a complex query, break it up into its
        // constituent parts and return a dispatcher that will
        // merge the parts when run
        function(root) {
          var pindex = 0, // avoid array alloc for every invocation
            ret = [],
            tp;
          while (tp = parts[pindex++]) {
            ret = ret.concat(getStepQueryFunc(tp)(root));
          }
          return ret;
        }
      );
    }
  };

  var _zipIdx = 0;

  // NOTE:
  //    this function is Moo inspired, but our own impl to deal correctly
  //    with XML in IE
  var _nodeUID = goog.userAgent.IE ? function(node) {
    if (caseSensitive) {
      // XML docs don't have uniqueID on their nodes
      return node.getAttribute('_uid') ||
          node.setAttribute('_uid', ++_zipIdx) || _zipIdx;

    } else {
      return node.uniqueID;
    }
  } :
  function(node) {
    return (node['_uid'] || (node['_uid'] = ++_zipIdx));
  };

  // determine if a node in is unique in a 'bag'. In this case we don't want
  // to flatten a list of unique items, but rather just tell if the item in
  // question is already in the bag. Normally we'd just use hash lookup to do
  // this for us but IE's DOM is busted so we can't really count on that. On
  // the upside, it gives us a built in unique ID function.
  var _isUnique = function(node, bag) {
    if (!bag) {
      return 1;
    }
    var id = _nodeUID(node);
    if (!bag[id]) {
      return bag[id] = 1;
    }
    return 0;
  };

  // attempt to efficiently determine if an item in a list is a dupe,
  // returning a list of 'uniques', hopefully in doucment order
  var _zipIdxName = '_zipIdx';
  var _zip = function(arr) {
    if (arr && arr.nozip) {
      return arr;
    }
    var ret = [];
    if (!arr || !arr.length) {
      return ret;
    }
    if (arr[0]) {
      ret.push(arr[0]);
    }
    if (arr.length < 2) {
      return ret;
    }

    _zipIdx++;

    // we have to fork here for IE and XML docs because we can't set
    // expandos on their nodes (apparently). *sigh*
    if (goog.userAgent.IE && caseSensitive) {
      var szidx = _zipIdx + '';
      arr[0].setAttribute(_zipIdxName, szidx);
      for (var x = 1, te; te = arr[x]; x++) {
        if (arr[x].getAttribute(_zipIdxName) != szidx) {
          ret.push(te);
        }
        te.setAttribute(_zipIdxName, szidx);
      }
    } else if (goog.userAgent.IE && arr.commentStrip) {
      try {
        for (var x = 1, te; te = arr[x]; x++) {
          if (isElement(te)) {
            ret.push(te);
          }
        }
      } catch (e) { /* squelch */ }
    } else {
      if (arr[0]) {
        arr[0][_zipIdxName] = _zipIdx;
      }
      for (var x = 1, te; te = arr[x]; x++) {
        if (arr[x][_zipIdxName] != _zipIdx) {
          ret.push(te);
        }
        te[_zipIdxName] = _zipIdx;
      }
    }
    return ret;
  };

  /**
   * The main executor. Type specification from above.
   * @param {string|Array} query The query.
   * @param {(string|Node)=} root The root.
   * @return {!Array} The elements that matched the query.
   */
  var query = function(query, root) {
    // NOTE: elementsById is not currently supported
    // NOTE: ignores xpath-ish queries for now

    //Set list constructor to desired value. This can change
    //between calls, so always re-assign here.

    if (!query) {
      return [];
    }

    if (query.constructor == Array) {
      return /** @type {!Array} */ (query);
    }

    if (!goog.isString(query)) {
      return [query];
    }

    if (goog.isString(root)) {
      root = goog.dom.getElement(root);
      if (!root) {
        return [];
      }
    }

    root = root || goog.dom.getDocument();
    var od = root.ownerDocument || root.documentElement;

    // throw the big case sensitivity switch

    // NOTE:
    //    Opera in XHTML mode doesn't detect case-sensitivity correctly
    //    and it's not clear that there's any way to test for it
    caseSensitive =
        root.contentType && root.contentType == 'application/xml' ||
        goog.userAgent.OPERA &&
          (root.doctype || od.toString() == '[object XMLDocument]') ||
        !!od &&
        (goog.userAgent.IE ? od.xml : (root.xmlVersion || od.xmlVersion));

    // NOTE:
    //    adding 'true' as the 2nd argument to getQueryFunc is useful for
    //    testing the DOM branch without worrying about the
    //    behavior/performance of the QSA branch.
    var r = getQueryFunc(query)(root);

    // FIXME(slightlyoff):
    //    need to investigate this branch WRT dojo:#8074 and dojo:#8075
    if (r && r.nozip) {
      return r;
    }
    return _zip(r);
  }

  // FIXME: need to add infrastructure for post-filtering pseudos, ala :last
  query.pseudos = pseudos;

  return query;
})();

// TODO(user): Please don't export here since it clobbers dead code elimination.
goog.exportSymbol('goog.dom.query', goog.dom.query);
goog.exportSymbol('goog.dom.query.pseudos', goog.dom.query.pseudos);
