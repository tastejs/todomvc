#!/bin/bash

args="$@"

npm i && \
eval "node memory.js $args" && \
eval "npm test -- $args"
