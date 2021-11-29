'use strict';

const path = require('path');

module.exports = function () {
	const isWindows = process.platform === 'win32';
	const yarnPath = isWindows ? path.join('Yarn', 'config', 'global') : path.join('.config', 'yarn', 'global');
	if (__dirname.includes(yarnPath)) {
		return true;
	}
	return false;
};
