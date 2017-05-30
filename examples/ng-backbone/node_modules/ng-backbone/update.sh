#!/bin/bash
cur=`pwd`
dir=`mktemp -d`
cd $dir
echo "Downloading dependencies..."
npm i ng-template

echo "Copying dependencies to ./src ..."
cp node_modules/ng-template/src/ngtemplate.ts $cur/src/
cp -r node_modules/ng-template/src/ng-template $cur/src/

echo "Cleaning up..."
rm -rf $dir
cd $cur

echo "Done!"
