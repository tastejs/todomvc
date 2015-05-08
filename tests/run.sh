#!/bin/bash

args="$@"

run_tests ()
{
	npm i && \
	eval "npm test -- $args"
}

if [ "$TRAVIS_PULL_REQUEST" == "true" ] && [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]
then
	run_tests
elif [ "$TRAVIS_PULL_REQUEST" == "true" ] && [ "$TRAVIS_SECURE_ENV_VARS" == "false" ]
then
	exit 0
else
	run_tests
fi
