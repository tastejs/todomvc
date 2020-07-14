"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const config = require('./config');

const _require = require('@parcel/utils'),
      promisify = _require.promisify;

const resolve = promisify(require('resolve'));

const commandExists = require('command-exists');

const logger = require('@parcel/logger');

const pipeSpawn = require('./pipeSpawn');

const PromiseQueue = require('./PromiseQueue');

const path = require('path');

const fs = require('@parcel/fs');

const WorkerFarm = require('@parcel/workers');

const YARN_LOCK = 'yarn.lock';

function install(_x, _x2) {
  return _install.apply(this, arguments);
}

function _install() {
  _install = (0, _asyncToGenerator2.default)(function* (modules, filepath, options = {}) {
    let _options$installPeers = options.installPeers,
        installPeers = _options$installPeers === void 0 ? true : _options$installPeers,
        _options$saveDev = options.saveDev,
        saveDev = _options$saveDev === void 0 ? true : _options$saveDev,
        packageManager = options.packageManager;

    if (typeof modules === 'string') {
      modules = [modules];
    }

    logger.progress(`Installing ${modules.join(', ')}...`);
    let packageLocation = yield config.resolve(filepath, ['package.json']);
    let cwd = packageLocation ? path.dirname(packageLocation) : process.cwd();

    if (!packageManager) {
      packageManager = yield determinePackageManager(filepath);
    }

    let commandToUse = packageManager === 'npm' ? 'install' : 'add';
    let args = [commandToUse, ...modules];

    if (saveDev) {
      args.push('-D');
    } else if (packageManager === 'npm') {
      args.push('--save');
    } // npm doesn't auto-create a package.json when installing,
    // so create an empty one if needed.


    if (packageManager === 'npm' && !packageLocation) {
      yield fs.writeFile(path.join(cwd, 'package.json'), '{}');
    }

    try {
      yield pipeSpawn(packageManager, args, {
        cwd
      });
    } catch (err) {
      throw new Error(`Failed to install ${modules.join(', ')}.`);
    }

    if (installPeers) {
      yield Promise.all(modules.map(m => installPeerDependencies(filepath, m, options)));
    }
  });
  return _install.apply(this, arguments);
}

function installPeerDependencies(_x3, _x4, _x5) {
  return _installPeerDependencies.apply(this, arguments);
}

function _installPeerDependencies() {
  _installPeerDependencies = (0, _asyncToGenerator2.default)(function* (filepath, name, options) {
    let basedir = path.dirname(filepath);

    const _ref2 = yield resolve(name, {
      basedir
    }),
          _ref3 = (0, _slicedToArray2.default)(_ref2, 1),
          resolved = _ref3[0];

    const pkg = yield config.load(resolved, ['package.json']);
    const peers = pkg.peerDependencies || {};
    const modules = [];

    for (const peer in peers) {
      modules.push(`${peer}@${peers[peer]}`);
    }

    if (modules.length) {
      yield install(modules, filepath, Object.assign({}, options, {
        installPeers: false
      }));
    }
  });
  return _installPeerDependencies.apply(this, arguments);
}

function determinePackageManager(_x6) {
  return _determinePackageManager.apply(this, arguments);
}

function _determinePackageManager() {
  _determinePackageManager = (0, _asyncToGenerator2.default)(function* (filepath) {
    const yarnLockFile = yield config.resolve(filepath, [YARN_LOCK]);
    /**
     * no yarn.lock => use npm
     * yarn.lock => Use yarn, fallback to npm
     */

    if (!yarnLockFile) {
      return 'npm';
    }

    const hasYarn = yield checkForYarnCommand();

    if (hasYarn) {
      return 'yarn';
    }

    return 'npm';
  });
  return _determinePackageManager.apply(this, arguments);
}

let hasYarn = null;

function checkForYarnCommand() {
  return _checkForYarnCommand.apply(this, arguments);
}

function _checkForYarnCommand() {
  _checkForYarnCommand = (0, _asyncToGenerator2.default)(function* () {
    if (hasYarn != null) {
      return hasYarn;
    }

    try {
      hasYarn = yield commandExists('yarn');
    } catch (err) {
      hasYarn = false;
    }

    return hasYarn;
  });
  return _checkForYarnCommand.apply(this, arguments);
}

let queue = new PromiseQueue(install, {
  maxConcurrent: 1,
  retry: false
});

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (...args) {
    // Ensure that this function is always called on the master process so we
    // don't call multiple installs in parallel.
    if (WorkerFarm.isWorker()) {
      yield WorkerFarm.callMaster({
        location: __filename,
        args
      });
      return;
    }

    queue.add(...args);
    return queue.run();
  });

  return function () {
    return _ref.apply(this, arguments);
  };
}();