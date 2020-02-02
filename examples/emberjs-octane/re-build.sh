#!/bin/bash

( cd todomvc && yarn build:prod ) \
&& rm -rf assets index.html \
&& ln -s todomvc/dist/assets assets \
&& ln -s todomvc/dist/index.html index.html
