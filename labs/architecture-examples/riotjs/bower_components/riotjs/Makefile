init:
	bower install

jshint:
	jshint lib/*.js

riot:
	@ cat license.js > riot.js
	@ echo '(function($$) { "use strict";' >> riot.js
	@ cat lib/* >> riot.js
	@ echo '})(typeof top == "object" ? window.$$ || (window.$$ = {}) : exports);' >> riot.js

min: riot
	uglifyjs riot.js --comments --mangle -o riot.min.js

test: min
	node test/node.js

.PHONY: test compare
