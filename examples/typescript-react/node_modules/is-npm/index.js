'use strict';

const packageJson = process.env.npm_package_json;
const userAgent = process.env.npm_config_user_agent;
const isYarn = Boolean(userAgent && userAgent.startsWith('yarn'));
const isNpm = Boolean(userAgent && userAgent.startsWith('npm'));
const isNpm7 = Boolean(packageJson && packageJson.endsWith('package.json'));

module.exports.isNpmOrYarn = isNpm || isNpm7 || isYarn;
module.exports.isNpm = isNpm || isNpm7;
module.exports.isYarn = isYarn;
