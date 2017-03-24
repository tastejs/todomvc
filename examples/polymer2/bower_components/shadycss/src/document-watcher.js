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

import {nativeShadow} from './style-settings'
import StyleTransformer from './style-transformer'
import {getIsExtends} from './style-util'

export let flush = function() {};

if (!nativeShadow) {
  let elementNeedsScoping = (element) => {
    return (element.classList &&
      !element.classList.contains(StyleTransformer.SCOPE_NAME) ||
      // note: necessary for IE11
      (element instanceof window['SVGElement'] && (!element.hasAttribute('class') ||
      element.getAttribute('class').indexOf(StyleTransformer.SCOPE_NAME) < 0)));
  }

/**
 * @param {Array<MutationRecord|null>|null} mxns
 */
  let handler = (mxns) => {
    for (let x=0; x < mxns.length; x++) {
      let mxn = mxns[x];
      if (mxn.target === document.documentElement ||
        mxn.target === document.head) {
        continue;
      }
      for (let i=0; i < mxn.addedNodes.length; i++) {
        let n = mxn.addedNodes[i];
        if (elementNeedsScoping(n)) {
          let root = n.getRootNode();
          if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // may no longer be in a shadowroot
            let host = /** @type {ShadowRoot} */(root).host;
            if (host) {
              let {is: scope} = getIsExtends(host);
              StyleTransformer.dom(n, scope);
            }
          }
        }
      }
      for (let i=0; i < mxn.removedNodes.length; i++) {
        let n = /** @type {HTMLElement} */(mxn.removedNodes[i]);
        if (n.nodeType === Node.ELEMENT_NODE) {
          let classes = undefined;
          if (n.classList) {
            classes = Array.from(n.classList);
          } else if (n.hasAttribute('class')) {
            classes = n.getAttribute('class').split(/\s+/);
          }
          if (classes !== undefined) {
            // NOTE: relies on the scoping class always being adjacent to the
            // SCOPE_NAME class.
            let classIdx = classes.indexOf(StyleTransformer.SCOPE_NAME);
            if (classIdx >= 0) {
              let scope = classes[classIdx + 1];
              if (scope) {
                StyleTransformer.dom(n, scope, true);
              }
            }
          }
        }
      }
    }
  };

  let observer = new MutationObserver(handler);
  let start = (node) => {
    observer.observe(node, {childList: true, subtree: true});
  }
  let nativeCustomElements = (window.customElements &&
    !window['customElements']['flush']);
  // need to start immediately with native custom elements
  // TODO(dfreedm): with polyfilled HTMLImports and native custom elements
  // excessive mutations may be observed; this can be optimized via cooperation
  // with the HTMLImports polyfill.
  if (nativeCustomElements) {
    start(document);
  } else {
    let delayedStart = () => {
      start(document.body);
    }
    // use polyfill timing if it's available
    if (window['HTMLImports']) {
      window['HTMLImports']['whenReady'](delayedStart);
    // otherwise push beyond native imports being ready
    // which requires RAF + readystate interactive.
    } else {
      requestAnimationFrame(function() {
        if (document.readyState === 'loading') {
          let listener = function() {
            delayedStart();
            document.removeEventListener('readystatechange', listener);
          }
          document.addEventListener('readystatechange', listener);
        } else {
          delayedStart();
        }
      });
    }
  }

  flush = function() {
    handler(observer.takeRecords());
  }
}
