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
Wrapper over <style> elements to co-operate with ShadyCSS

Example:
<custom-style>
  <style>
  ...
  </style>
</custom-style>
*/
(function() {
  'use strict';

  const CustomStyleInterface = window.ShadyCSS.CustomStyleInterface;

  class CustomStyle extends HTMLElement {
    constructor() {
      super();
      this._style = null;
      CustomStyleInterface.addCustomStyle(this);
    }
    getStyle() {
      if (!this._style) {
        this._style = this.querySelector('style');
      }
      return this._style;
    }
  }

  window.CustomStyle = CustomStyle;
  window.customElements.define('custom-style', CustomStyle);
})();