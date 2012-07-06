#!/bin/sh
# run a file through google closure compiler

# TODO: start using a js_externs parameter:
#	paths and other config params
#	full promise api (for communicating with plugins)
#	-d js_externs=promise.then=function(cb,eb){};promise.resolve=function(val){};promise.reject=function(ex){};

curl \
	--data-urlencode "js_code@$1" \
	-d compilation_level=$2 \
	-d output_info=compiled_code \
	-d output_format=text \
	http://closure-compiler.appspot.com/compile
