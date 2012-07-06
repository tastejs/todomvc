Distribution Files
==================

These are the "compiled" versions of curl.js.

Use curl/curl.js if you are only loading AMD-formatted javascript modules.

Use curl-with-js-and-domReady/curl.js if you wish to use non-AMD javascript
files and don't have an alternative domReady implementation handy.

Use curl-for-jQuery1.7 for a version of curl that has instructions for
jQuery 1.7 to register as an AMD module and has the js! and link! plugins
built in.  This is an adequate configuration for many simple jQuery projects
(and some sophisticated ones, too).

curl-for-dojo1.6 has the domReady! plugin built in as well as some
compatibility shims for dojo 1.6 (which isn't officially AMD-ready).

You can build your own custom version of curl.js by using the `make.sh` script
in the /bin/ folder.  You must run it from the /bin/ folder.  Syntax:

	./make.sh destination/curl.js ../src/curl.js [files to concat into curl.js]

The following files can be concatenated into curl.js using make.sh:

* ../src/curl/plugin/js.js (the js! plugin)
* ../src/curl/plugin/text.js (the text! plugin)
* ../src/curl/plugin/i18n.js (the i18n! plugin)
* ../src/curl/plugin/css.js (the css! plugin)
* ../src/curl/plugin/link.js (the link! plugin)
* ../src/curl/plugin/domReady.js (the domReady plugin)
* ../src/curl/domReady.js (the domReady module)
* ../src/curl/shim/dojo16.js (the dojo 1.6 compatibility shim / module)
* ../src/curl/shim/underscore.js (the underscore compatibility shim / module)
* ../src/curl/loader/cjsm11.js (the CommonJS Modules/1.1 compatibility shim / module)
* Any named AMD module (does not support anonymous modules, yet!)
* Any non-AMD javascript file

For example, to make a version of curl with the js! and text! plugins built-in:

	./make.sh destination/curl.js ../src/curl.js ../src/curl/plugin/js.js ../src/curl/plugin/text.js

Note: you will need a fairly recent version of `curl` (the unix utility, not
curl.js!) to run `make.sh`.  Version 7.18 or later is fine.
