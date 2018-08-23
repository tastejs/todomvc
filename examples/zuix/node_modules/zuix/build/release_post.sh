#!/usr/bin/env bash
set -e # Exit with nonzero exit code if anything fails

PACKAGE_NAME="zUIx"
CURRENT_VERSION=`grep '"version":' package.json | cut -d\" -f4`

# Check argument
if [ -z "$1" ]
  then
    echo "Usage: `basename "$0"` <newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease"
    exit -1
fi

# Build
gulp
if [ $? -ne 0 ]; then
    echo "Error building ${PACKAGE_NAME}"
    exit -1
fi


# Increment version number
npm version --no-git-tag-version $1
if [ $? -ne 0 ]; then
    echo "Error processing 'npm version $1'"
    exit -1
fi
NEW_VERSION=`grep '"version":' package.json | cut -d\" -f4`

echo "Current version is v${CURRENT_VERSION}"
echo "New version will be v${NEW_VERSION}"

# Check if a git tag already exists for the new version
VERSION_TAG_EXISTS="false"
if git tag --list | egrep -q "^v${NEW_VERSION}"; then VERSION_TAG_EXISTS="true"; fi

function update_version {
	search='(\"version\":[[:space:]]*\").+(\")'
	replace="\1$2\2"
	sed -i.bak -E "s/${search}/${replace}/g" "$1"
	rm $1.bak
}

# Check if everything is consistent before proceeding with version increment related tasks
if [ "${CURRENT_VERSION}" = "${NEW_VERSION}" ] || [ "${VERSION_TAG_EXISTS}" = "true" ]; then
    echo "Version increment check error (tag=${VERSION_TAG_EXISTS})."
    # revert to current version
    update_version "package.json" ${CURRENT_VERSION}
    exit -1
fi

# Update version number in the README.md file
node ./node_modules/replace/bin/replace.js "${PACKAGE_NAME} v\\d+\\.\\d+\\.\\d+\\-\\d+" "${PACKAGE_NAME} v${NEW_VERSION}" ./README.md

# Version number increment in the Download page
node ./node_modules/replace/bin/replace.js "${PACKAGE_NAME} v\\d+\\.\\d+\\.\\d+\\-\\d+" "${PACKAGE_NAME} v${NEW_VERSION}" ./docs/index.html
node ./node_modules/replace/bin/replace.js "${PACKAGE_NAME} v\\d+\\.\\d+\\.\\d+\\-\\d+" "${PACKAGE_NAME} v${NEW_VERSION}" ./zuix-website/source/app/content/start.html

# Update version number for dist package
update_version "dist/package.json" ${NEW_VERSION}
#update_version "bower.json"

# Add version number in header comment of generated zuix*.js files
JS_VERSION="/* ${PACKAGE_NAME} v${NEW_VERSION} `date +'%y.%m.%d %H:%M:%S'` */"
sed -i "1i${JS_VERSION}\n" dist/js/zuix.js
sed -i "1i${JS_VERSION}\n" dist/js/zuix.min.js
sed -i "1i${JS_VERSION}\n" dist/js/zuix-bundler.js
sed -i "1i${JS_VERSION}\n" dist/js/zuix-bundler.min.js

# Copy latest zUIx dist files to the website
cp -rfv dist/js docs/
cp -rfv dist/js zuix-website/source/

# Commit the new release and add new git tag
git add .
git commit -a -m "${PACKAGE_NAME} v${NEW_VERSION}"
git tag v${NEW_VERSION}

echo ""
echo "Release increment succeed, you can now"
echo "proceed with pushing to master branch, CI will"
echo "do the rest by running the deploy script:"
echo ""
echo "    git push origin master --tags"
echo ""
