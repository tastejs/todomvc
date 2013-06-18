/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// FOUC prevention tactic
var style = document.createElement('style');
style.textContent = 'body {opacity: 0;}';
var head = document.querySelector('head');
head.insertBefore(style, head.firstChild);

window.addEventListener('WebComponentsReady', function() {
  document.body.style.webkitTransition = 'opacity 0.3s';
  document.body.style.opacity = 1;
});

})();
