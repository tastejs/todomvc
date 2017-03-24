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
import templateMap from './template-map'
import {StyleNode} from './css-parse' // eslint-disable-line no-unused-vars

/**
 * @const {Promise<void>}
 */
const promise = Promise.resolve();

/**
 * @param {string} elementName
 */
export function invalidate(elementName){
  let template = templateMap[elementName];
  if (template) {
    invalidateTemplate(template);
  }
}

/**
 * @param {HTMLTemplateElement} template
 */
export function invalidateTemplate(template) {
  template['_applyShimInvalid'] = true;
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
export function isValid(elementName) {
  let template = templateMap[elementName];
  if (template) {
    return templateIsValid(template);
  }
  return true;
}

/**
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
export function templateIsValid(template) {
  return !template['_applyShimInvalid'];
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
export function isValidating(elementName) {
  let template = templateMap[elementName];
  if (template) {
    return templateIsValidating(template);
  }
  return false;
}

/**
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
export function templateIsValidating(template) {
  return template._validating;
}

/**
 * the template is marked as `validating` for one microtask so that all instances
 * found in the tree crawl of `applyStyle` will update themselves,
 * but the template will only be updated once.
 * @param {string} elementName
*/
export function startValidating(elementName) {
  let template = templateMap[elementName];
  startValidatingTemplate(template);
}

/**
 * @param {HTMLTemplateElement} template
 */
export function startValidatingTemplate(template) {
  if (!template._validating) {
    template._validating = true;
    promise.then(function() {
      template['_applyShimInvalid'] = false;
      template._validating = false;
    });
  }
}

/**
 * @return {boolean}
 */
export function elementsAreInvalid() {
  for (let elementName in templateMap) {
    let template = templateMap[elementName];
    if (!templateIsValid(template)) {
      return true;
    }
  }
  return false;
}