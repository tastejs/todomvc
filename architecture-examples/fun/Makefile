run: fun
	./fun/bin/fun app.fun --normalize.css=false

fun:
	git clone git://github.com/marcuswestin/fun.git fun
	cd fun && git checkout 3ec19592b6b0ee11ab67770220820c1ec9791a23 && make setup

build:
	./fun/bin/fun compile app.fun --normalize.css=false > index.html

clean:
	rm -rf fun
