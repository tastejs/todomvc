'use strict';
const path = require('path');
const fs = require('fs');

const hasYarn = (cwd = process.cwd()) => fs.existsSync(path.resolve(cwd, 'yarn.lock'));

module.exports = hasYarn;
// TODO: Remove this for the next major release
module.exports.default = hasYarn;
