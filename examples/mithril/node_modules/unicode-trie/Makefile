test:
	@./node_modules/.bin/mocha
	
coverage:
	@./node_modules/.bin/mocha --require coverage.js --reporter html-cov > coverage.html

build:
	coffee --bare -c *.coffee
	
clean:
	rm -rf index.js builder.js

.PHONY: test coverage
