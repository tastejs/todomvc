#!/bin/bash

PATHS=""
EXAMPLES_DIR="examples/"

for arg in "$@"
do
case $arg in
	--framework=*)
		PATHS+=" "$EXAMPLES_DIR$(echo $arg | awk '{split($0,a,"="); print a[2]}')
		;;
esac
done

npm i && \
eval "npm run lint -- $PATHS tests/"
