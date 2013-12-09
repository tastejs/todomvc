init:
	bower install

jshint:
	jshint lib/*.js

min: jshint
	uglifyjs license.js lib/observable.js lib/render.js lib/route.js --comments --mangle -o riot.js

test: min
	node test/node.js

.PHONY: test compare
