'use strict';
const packageJson = require('package-json');

const lastestVersion = async (packageName, options) => {
	const {version} = await packageJson(packageName.toLowerCase(), options);
	return version;
};

module.exports = lastestVersion;
// TODO: Remove this for the next major release
module.exports.default = lastestVersion;
