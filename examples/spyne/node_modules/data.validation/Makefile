bin        = $(shell npm bin)
lsc        = $(bin)/lsc
browserify = $(bin)/browserify
jsdoc      = $(bin)/jsdoc
uglify     = $(bin)/uglifyjs
VERSION    = $(shell node -e 'console.log(require("./package.json").version)')

dist:
	mkdir -p dist

dist/data.validation.umd.js: dist
	$(browserify) lib/index.js --standalone folktale.data.validation > $@

dist/data.validation.umd.min.js: dist/data.validation.umd.js
	$(uglify) --mangle - < $^ > $@

# ----------------------------------------------------------------------
bundle: dist/data.validation.umd.js

minify: dist/data.validation.umd.min.js

documentation:
	$(jsdoc) --configure jsdoc.conf.json
	ABSPATH=$(shell cd "$(dirname "$0")"; pwd) $(MAKE) clean-docs

clean-docs:
	perl -pi -e "s?$$ABSPATH/??g" ./docs/*.html

clean:
	rm -rf dist build

test:
	$(lsc) test/tap.ls

package: documentation bundle minify
	mkdir -p dist/data.validation-$(VERSION)
	cp -r docs dist/data.validation-$(VERSION)
	cp -r lib dist/data.validation-$(VERSION)
	cp dist/*.js dist/data.validation-$(VERSION)
	cp package.json dist/data.validation-$(VERSION)
	cp README.md dist/data.validation-$(VERSION)
	cp LICENCE dist/data.validation-$(VERSION)
	cd dist && tar -czf data.validation-$(VERSION).tar.gz data.validation-$(VERSION)

publish: clean
	npm install
	npm publish

bump:
	node tools/bump-version.js $$VERSION_BUMP

bump-feature:
	VERSION_BUMP=FEATURE $(MAKE) bump

bump-major:
	VERSION_BUMP=MAJOR $(MAKE) bump


.PHONY: test
