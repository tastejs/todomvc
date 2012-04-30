run: lib/fun
	lib/fun/bin/fun app.fun --normalize.css=false

lib/fun:
	mkdir -p lib
	git clone git://github.com/marcuswestin/fun.git lib/fun
	cd lib/fun && make setup

index.html: app.fun lib/fun
	lib/fun/bin/fun compile app.fun --normalize.css=false > index.html

clean:
	rm -rf lib

