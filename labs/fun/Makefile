run:
	fun app.fun --normalize.css=false

install:
	npm install fun@0.3.0

index.html: app.fun
	fun compile app.fun --normalize.css=false > index.html

.PHONY: run, install
