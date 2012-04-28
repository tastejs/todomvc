run: node_modules/fun
	node_modules/.bin/fun app.fun

node_modules/fun:
	mkdir -p node_modules
	git clone git://github.com/marcuswestin/fun.git node_modules/fun
	cd node_modules/fun && make setup

clean:
	rm -rf node_modules/
