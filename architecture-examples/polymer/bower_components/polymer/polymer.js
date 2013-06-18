/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
var thisFile = 'polymer.js';
var scopeName = 'Polymer';
var modules = [
  'src/platform.min.js',
  'src/lang.js',
  'src/oop.js',
  'src/register.js',
  'src/base.js',
  'src/trackObservers.js',
  'src/bindProperties.js',
  'src/bindMDV.js',
  'src/attrs.js',
  'src/marshal.js',
  'src/events.js',
  'src/observeProperties.js',
  'src/styling.js',
  'src/shimStyling.js',
  'src/path.js',
  'src/job.js',
  'src/boot.js'
];

// export 

window[scopeName] = {
  entryPointName: thisFile,
  modules: modules
};

// bootstrap

var script = document.querySelector('script[src*="' + thisFile + '"]');
var src = script.attributes.src.value;
var basePath = src.slice(0, src.indexOf(thisFile));

console.log(src);

modules.forEach(function(m) {
  document.write('<script src="' + basePath + m + '"></script>');
});

})();
