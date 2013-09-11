compile:
	npm install
	./node_modules/coffee-script/bin/coffee -b -o ./lib -c ./src

run: compile
	node server.js

deploy-setup: compile
	git init
	heroku git:remote -a todomvc-derby
	sed -i 's/lib//' .gitignore
	git add -A
	git commit -m "Deployment update"

deploy:
	git push heroku master
