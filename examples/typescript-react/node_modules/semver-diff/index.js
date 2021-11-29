'use strict';
const semver = require('semver');

module.exports = (versionA, versionB) => {
	versionA = semver.parse(versionA);
	versionB = semver.parse(versionB);

	if (semver.compareBuild(versionA, versionB) >= 0) {
		return;
	}

	return semver.diff(versionA, versionB) || 'build';
};
