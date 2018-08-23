#!/usr/bin/env bash
set -e # Exit with nonzero exit code if anything fails

function doCompile {
  gulp
}

function publishPackages {
    # publish zuix dev package
    npm publish
    # publish zuix-dist package
    cd dist
    npm publish
    cd ..
}

doCompile

echo "-----"
echo "TRAVIS_PULL_REQUEST = $TRAVIS_PULL_REQUEST"
echo "TRAVIS_BRANCH = $TRAVIS_BRANCH"
echo "TRAVIS_TAG = $TRAVIS_TAG"
echo "TRAVIS_BUILD_NUMBER = $TRAVIS_BUILD_NUMBER"
echo "-----"

# Verify conditions for deploy
if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "$TRAVIS_TAG" ]; then
    # npm publish disabled - TODO: to be fixed / tested
    #publishPackages
    echo "-----"
    echo "Automatic NPM publishing is disabled, do not forget to"
    echo "manually run 'npm publish' both from './' and './dist' folders"
    echo "-----"
fi
