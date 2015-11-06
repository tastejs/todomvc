#!/bin/bash

args="$@"

npm i && \
eval "npm test -- $args"
