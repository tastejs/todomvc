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

export let nativeShadow = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);
// chrome 49 has semi-working css vars, check if box-shadow works
// safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
export let nativeCssVariables = (!navigator.userAgent.match('AppleWebKit/601') &&
window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'));

/**
 * @param {ShadyCSSOptions | ShadyCSSInterface | undefined} settings
 */
function parseSettings(settings) {
  if (settings) {
    nativeCssVariables = nativeCssVariables && !settings['nativeCss'] && !settings['shimcssproperties'];
  nativeShadow = nativeShadow && !settings['nativeShadow'] && !settings['shimshadow'];
  }
}

if (window.ShadyCSS) {
  parseSettings(window.ShadyCSS);
} else if (window['WebComponents']) {
  parseSettings(window['WebComponents']['flags']);
}
