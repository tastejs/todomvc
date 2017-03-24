/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

import {StyleNode} from './css-parse' // eslint-disable-line no-unused-vars
import * as StyleUtil from './style-util'
import {nativeShadow} from './style-settings'

/* Transforms ShadowDOM styling into ShadyDOM styling

* scoping:

  * elements in scope get scoping selector class="x-foo-scope"
  * selectors re-written as follows:

    div button -> div.x-foo-scope button.x-foo-scope

* :host -> scopeName

* :host(...) -> scopeName...

* ::slotted(...) -> scopeName > ...

* ...:dir(ltr|rtl) -> [dir="ltr|rtl"] ..., ...[dir="ltr|rtl"]

* :host(:dir[rtl]) -> scopeName:dir(rtl) -> [dir="rtl"] scopeName, scopeName[dir="rtl"]

*/
const SCOPE_NAME = 'style-scope';

class StyleTransformer {
  get SCOPE_NAME() {
    return SCOPE_NAME;
  }
  // Given a node and scope name, add a scoping class to each node
  // in the tree. This facilitates transforming css into scoped rules.
  dom(node, scope, shouldRemoveScope) {
    // one time optimization to skip scoping...
    if (node['__styleScoped']) {
      node['__styleScoped'] = null;
    } else {
      this._transformDom(node, scope || '', shouldRemoveScope);
    }
  }

  _transformDom(node, selector, shouldRemoveScope) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.element(node, selector, shouldRemoveScope);
    }
    let c$ = (node.localName === 'template') ?
      (node.content || node._content).childNodes :
      node.children || node.childNodes;
    if (c$) {
      for (let i=0; i<c$.length; i++) {
        this._transformDom(c$[i], selector, shouldRemoveScope);
      }
    }
  }

  element(element, scope, shouldRemoveScope) {
    // note: if using classes, we add both the general 'style-scope' class
    // as well as the specific scope. This enables easy filtering of all
    // `style-scope` elements
    if (scope) {
      // note: svg on IE does not have classList so fallback to class
      if (element.classList) {
        if (shouldRemoveScope) {
          element.classList.remove(SCOPE_NAME);
          element.classList.remove(scope);
        } else {
          element.classList.add(SCOPE_NAME);
          element.classList.add(scope);
        }
      } else if (element.getAttribute) {
        let c = element.getAttribute(CLASS);
        if (shouldRemoveScope) {
          if (c) {
            let newValue = c.replace(SCOPE_NAME, '').replace(scope, '');
            StyleUtil.setElementClassRaw(element, newValue);
          }
        } else {
          let newValue = (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope;
          StyleUtil.setElementClassRaw(element, newValue);
        }
      }
    }
  }

  elementStyles(element, styleRules, callback) {
    let cssBuildType = element['__cssBuild'];
    // no need to shim selectors if settings.useNativeShadow, also
    // a shady css build will already have transformed selectors
    // NOTE: This method may be called as part of static or property shimming.
    // When there is a targeted build it will not be called for static shimming,
    // but when the property shim is used it is called and should opt out of
    // static shimming work when a proper build exists.
    let cssText = '';
    if (nativeShadow || cssBuildType === 'shady') {
      cssText = StyleUtil.toCssText(styleRules, callback);
    } else {
      let {is, typeExtension} = StyleUtil.getIsExtends(element);
      cssText = this.css(styleRules, is, typeExtension, callback) + '\n\n';
    }
    return cssText.trim();
  }

  // Given a string of cssText and a scoping string (scope), returns
  // a string of scoped css where each selector is transformed to include
  // a class created from the scope. ShadowDOM selectors are also transformed
  // (e.g. :host) to use the scoping selector.
  css(rules, scope, ext, callback) {
    let hostScope = this._calcHostScope(scope, ext);
    scope = this._calcElementScope(scope);
    let self = this;
    return StyleUtil.toCssText(rules, function(/** StyleNode */rule) {
      if (!rule.isScoped) {
        self.rule(rule, scope, hostScope);
        rule.isScoped = true;
      }
      if (callback) {
        callback(rule, scope, hostScope);
      }
    });
  }

  _calcElementScope(scope) {
    if (scope) {
      return CSS_CLASS_PREFIX + scope;
    } else {
      return '';
    }
  }

  _calcHostScope(scope, ext) {
    return ext ? `[is=${scope}]` : scope;
  }

  rule(rule, scope, hostScope) {
    this._transformRule(rule, this._transformComplexSelector,
      scope, hostScope);
  }

  /**
   * transforms a css rule to a scoped rule.
   *
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRule(rule, transformer, scope, hostScope) {
    // NOTE: save transformedSelector for subsequent matching of elements
    // against selectors (e.g. when calculating style properties)
    rule['selector'] = rule.transformedSelector =
      this._transformRuleCss(rule, transformer, scope, hostScope);
  }

  /**
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRuleCss(rule, transformer, scope, hostScope) {
    let p$ = rule['selector'].split(COMPLEX_SELECTOR_SEP);
    // we want to skip transformation of rules that appear in keyframes,
    // because they are keyframe selectors, not element selectors.
    if (!StyleUtil.isKeyframesSelector(rule)) {
      for (let i=0, l=p$.length, p; (i<l) && (p=p$[i]); i++) {
        p$[i] = transformer.call(this, p, scope, hostScope);
      }
    }
    return p$.join(COMPLEX_SELECTOR_SEP);
  }

/**
 * @param {string} selector
 * @param {string} scope
 * @param {string=} hostScope
 */
  _transformComplexSelector(selector, scope, hostScope) {
    let stop = false;
    selector = selector.trim();
    // Remove spaces inside of selectors like `:nth-of-type` because it confuses SIMPLE_SELECTOR_SEP
    selector = selector.replace(NTH, (m, type, inner) => `:${type}(${inner.replace(/\s/g, '')})`);
    selector = selector.replace(SLOTTED_START, `${HOST} $1`);
    selector = selector.replace(SIMPLE_SELECTOR_SEP, (m, c, s) => {
      if (!stop) {
        let info = this._transformCompoundSelector(s, c, scope, hostScope);
        stop = stop || info.stop;
        c = info.combinator;
        s = info.value;
      }
      return c + s;
    });
    return selector;
  }

  _transformCompoundSelector(selector, combinator, scope, hostScope) {
    // replace :host with host scoping class
    let slottedIndex = selector.indexOf(SLOTTED);
    if (selector.indexOf(HOST) >= 0) {
      selector = this._transformHostSelector(selector, hostScope);
    // replace other selectors with scoping class
    } else if (slottedIndex !== 0) {
      selector = scope ? this._transformSimpleSelector(selector, scope) :
        selector;
    }
    // mark ::slotted() scope jump to replace with descendant selector + arg
    // also ignore left-side combinator
    let slotted = false;
    if (slottedIndex >= 0) {
      combinator = '';
      slotted = true;
    }
    // process scope jumping selectors up to the scope jump and then stop
    let stop;
    if (slotted) {
      stop = true;
      if (slotted) {
        // .zonk ::slotted(.foo) -> .zonk.scope > .foo
        selector = selector.replace(SLOTTED_PAREN, (m, paren) => ` > ${paren}`);
      }
    }
    selector = selector.replace(DIR_PAREN, (m, before, dir) =>
      `[dir="${dir}"] ${before}, ${before}[dir="${dir}"]`);
    return {value: selector, combinator, stop};
  }

  _transformSimpleSelector(selector, scope) {
    let p$ = selector.split(PSEUDO_PREFIX);
    p$[0] += scope;
    return p$.join(PSEUDO_PREFIX);
  }

  // :host(...) -> scopeName...
  _transformHostSelector(selector, hostScope) {
    let m = selector.match(HOST_PAREN);
    let paren = m && m[2].trim() || '';
    if (paren) {
      if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
        // paren starts with a type selector
        let typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
        // if the type selector is our hostScope then avoid pre-pending it
        if (typeSelector === hostScope) {
          return paren;
        // otherwise, this selector should not match in this scope so
        // output a bogus selector.
        } else {
          return SELECTOR_NO_MATCH;
        }
      } else {
        // make sure to do a replace here to catch selectors like:
        // `:host(.foo)::before`
        return selector.replace(HOST_PAREN, function(m, host, paren) {
          return hostScope + paren;
        });
      }
    // if no paren, do a straight :host replacement.
    // TODO(sorvell): this should not strictly be necessary but
    // it's needed to maintain support for `:host[foo]` type selectors
    // which have been improperly used under Shady DOM. This should be
    // deprecated.
    } else {
      return selector.replace(HOST, hostScope);
    }
  }

  /**
   * @param {StyleNode} rule
   */
  documentRule(rule) {
    // reset selector in case this is redone.
    rule['selector'] = rule['parsedSelector'];
    this.normalizeRootSelector(rule);
    this._transformRule(rule, this._transformDocumentSelector);
  }

  /**
   * @param {StyleNode} rule
   */
  normalizeRootSelector(rule) {
    if (rule['selector'] === ROOT) {
      rule['selector'] = 'html';
    }
  }

/**
 * @param {string} selector
 */
  _transformDocumentSelector(selector) {
    return selector.match(SLOTTED) ?
      this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) :
      this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
  }
}

let NTH = /:(nth[-\w]+)\(([^)]+)\)/;
let SCOPE_DOC_SELECTOR = `:not(.${SCOPE_NAME})`;
let COMPLEX_SELECTOR_SEP = ',';
let SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g;
let SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
let HOST = ':host';
let ROOT = ':root';
let SLOTTED = '::slotted';
let SLOTTED_START = new RegExp(`^(${SLOTTED})`);
// NOTE: this supports 1 nested () pair for things like
// :host(:not([selected]), more general support requires
// parsing which seems like overkill
let HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
// similar to HOST_PAREN
let SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
let DIR_PAREN = /(.*):dir\((?:(ltr|rtl))\)/;
let CSS_CLASS_PREFIX = '.';
let PSEUDO_PREFIX = ':';
let CLASS = 'class';
let SELECTOR_NO_MATCH = 'should_not_match';

export default new StyleTransformer()