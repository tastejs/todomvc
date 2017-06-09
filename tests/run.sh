#!/bin/bash

args="$@"

npm i && \
# skip memory test for now
#eval "node memory.js $args" && \
eval "npm test -- $args"
