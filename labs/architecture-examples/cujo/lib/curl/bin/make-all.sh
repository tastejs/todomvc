#!/bin/sh
# make simple, compiled curl.js
./make.sh ../dist/curl/curl.js ../src/curl.js

# make other versions of curl
./make.sh ../dist/curl-with-js-and-domReady/curl.js ../src/curl.js ../src/curl/domReady.js ../src/curl/plugin/js.js ../src/curl/plugin/domReady.js
./make.sh ../dist/curl-for-dojo1.6/curl.js ../src/curl.js ../src/curl/domReady.js ../src/curl/shim/dojo16.js ../src/curl/plugin/domReady.js
./make.sh ../dist/curl-kitchen-sink/curl.js ../src/curl.js ../src/curl/domReady.js ../src/curl/shim/dojo16.js ../src/curl/plugin/js.js ../src/curl/plugin/text.js ../src/curl/plugin/async.js ../src/curl/plugin/css.js ../src/curl/plugin/link.js ../src/curl/plugin/domReady.js ../src/curl/loader/cjsm11.js ../src/curl/shim/ssjs.js
./make.sh ../dist/curl-for-jQuery/curl.js ../src/curl.js  ../src/curl/domReady.js ../src/curl/plugin/js.js ../src/curl/plugin/link.js ../src/curl/plugin/domReady.js

#make minimally-compressed ssjs
./make.sh --NONE ../dist/curl-for-ssjs/curl.js ../src/curl.js ../src/curl/loader/cjsm11.js ../src/curl/shim/ssjs.js
