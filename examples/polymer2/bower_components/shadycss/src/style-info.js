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

/** @const {string} */
const infoKey = '__styleInfo';

export default class StyleInfo {
  /**
   * @param {Element} node
   * @return {StyleInfo}
   */
  static get(node) {
    if (node) {
      return node[infoKey];
    } else {
      return null;
    }
  }
  /**
   * @param {!Element} node
   * @param {StyleInfo} styleInfo
   * @return {StyleInfo}
   */
  static set(node, styleInfo) {
    node[infoKey] = styleInfo;
    return styleInfo;
  }
  /**
   * @param {StyleNode} ast
   * @param {Node=} placeholder
   * @param {Array<string>=} ownStylePropertyNames
   * @param {string=} elementName
   * @param {string=} typeExtension
   * @param {string=} cssBuild
   */
  constructor(ast, placeholder, ownStylePropertyNames, elementName, typeExtension, cssBuild) {
    /** @type {StyleNode} */
    this.styleRules = ast || null;
    /** @type {Node} */
    this.placeholder = placeholder || null;
    /** @type {!Array<string>} */
    this.ownStylePropertyNames = ownStylePropertyNames || [];
    /** @type {Array<Object>} */
    this.overrideStyleProperties = null;
    /** @type {string} */
    this.elementName = elementName || '';
    /** @type {string} */
    this.cssBuild = cssBuild || '';
    /** @type {string} */
    this.typeExtension = typeExtension || '';
    /** @type {Object<string, string>} */
    this.styleProperties = null;
    /** @type {?string} */
    this.scopeSelector = null;
    /** @type {HTMLStyleElement} */
    this.customStyle = null;
  }
  _getStyleRules() {
    return this.styleRules;
  }
}

StyleInfo.prototype['_getStyleRules'] = StyleInfo.prototype._getStyleRules;