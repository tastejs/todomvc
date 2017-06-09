#!/bin/bash
set -o pipefail
set -e

get_changes ()
{
	git remote add current https://github.com/tastejs/todomvc.git && \
	git fetch --quiet current && \
	git diff HEAD origin/master --name-only |  awk 'BEGIN {FS = "/"}; {print $1 "/" $2 "/" $3}' | grep -v \/\/ | grep examples | awk -F '[/]' '{print "--framework=" $2}'|uniq
}

if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
	npm run gulp
	git submodule add -b gh-pages https://${GH_OAUTH_TOKEN}@github.com/${GH_OWNER}/${GH_PROJECT_NAME} site > /dev/null 2>&1
	cd site
	git rm -r .
	cp -R ../dist/. .
	git add -f .
	git config user.email 'travis@rdrei.net'
	git config user.name 'TasteBot'
	git commit --allow-empty -am 'update the build files for gh-pages [ci skip]'
	# Any command that using GH_OAUTH_TOKEN must pipe the output to /dev/null to not expose your oauth token
	git push https://${GH_OAUTH_TOKEN}@github.com/${GH_OWNER}/${GH_PROJECT_NAME} HEAD:gh-pages > /dev/null 2>&1
else
	changes=$(get_changes)

	if [ "${#changes}" = 0 ]
	then
		changes="--framework=backbone"
	fi

	npm run test-server && \
	cd tooling && \
	echo $changes | xargs ./run.sh && \
	cd ../tests && \
	sleep 2 && \
	echo $changes | xargs ./run.sh

	exit $?
fi
