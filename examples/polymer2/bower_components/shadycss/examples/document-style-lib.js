/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Example library for adding document-level styles to ShadyCSS

After DOMContentLoaded, synchronously add all document document level styles.
Then, start a MutationObserver for dynamically added styles.

Caveat: ShadyCSS will add a `scope` attribute to styles it controls, so do not add those styles.
*/
(function() {
  'use strict';

  const CustomStyleInterface = window.ShadyCSS.CustomStyleInterface;

  function shouldAddDocumentStyle(n) {
    return n.nodeType === Node.ELEMENT_NODE && n.localName === 'style' && !n.hasAttribute('scope');
  }

  function handler(mxns) {
    for (let i = 0; i < mxns.length; i++) {
      let mxn = mxns[i];
      for (let j = 0; j < mxn.addedNodes.length; j++) {
        let n = mxn.addedNodes[j];
        if (shouldAddDocumentStyle(n)) {
          CustomStyleInterface.addCustomStyle(n);
        }
      }
    }
  }

  const observer = new MutationObserver(handler);

  document.addEventListener('DOMContentLoaded', () => {
    const candidates = document.querySelectorAll('custom-style');
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (shouldAddDocumentStyle(candidate)) {
        CustomStyleInterface.addCustomStyle(candidate);
      }
    }
    observer.observe(document, {childList: true, subtree: true});
  });

  window.documentStyleFlush = () => {handler(observer.takeRecords())};
})();