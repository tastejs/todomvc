#!/bin/bash

java -jar build/duel-compiler-0.8.1.jar \
	-in 'src/views/' \
	-client-out 'js/' \
	-server-out 'build/java/' \
	-client-prefix 'todos.views' \
	-server-prefix 'com.example.todos.views'
