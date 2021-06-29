'use strict';

var fs = require('fs');
var path = require('path');
var log = require('gulplog');
var yargs = require('yargs');
var Liftoff = require('liftoff');
var interpret = require('interpret');
var v8flags = require('v8flags');
var findRange = require('semver-greatest-satisfied-range');
var ansi = require('./lib/shared/ansi');
var exit = require('./lib/shared/exit');
var tildify = require('./lib/shared/tildify');
var makeTitle = require('./lib/shared/make-title');
var cliOptions = require('./lib/shared/cli-options');
var completion = require('./lib/shared/completion');
var verifyDeps = require('./lib/shared/verify-dependencies');
var cliVersion = require('./package.json').version;
var getBlacklist = require('./lib/shared/get-blacklist');
var toConsole = require('./lib/shared/log/to-console');

var loadConfigFiles = require('./lib/shared/config/load-files');
var mergeConfigToCliFlags = require('./lib/shared/config/cli-flags');
var mergeConfigToEnvFlags = require('./lib/shared/config/env-flags');

// Logging functions
var logVerify = require('./lib/shared/log/verify');
var logBlacklistError = require('./lib/shared/log/blacklist-error');

// Get supported ranges
var ranges = fs.readdirSync(path.join(__dirname, '/lib/versioned/'));

// Set env var for ORIGINAL cwd
// before anything touches it
process.env.INIT_CWD = process.cwd();

var cli = new Liftoff({
  name: 'gulp',
  processTitle: makeTitle('gulp', process.argv.slice(2)),
  completions: completion,
  extensions: interpret.jsVariants,
  v8flags: v8flags,
  configFiles: {
    '.gulp': {
      home: {
        path: '~',
        extensions: interpret.extensions,
      },
      cwd: {
        path: '.',
        extensions: interpret.extensions,
      },
    },
  },
});

var usage =
  '\n' + ansi.bold('Usage:') +
  ' gulp ' + ansi.blue('[options]') + ' tasks';

var parser = yargs.usage(usage, cliOptions);
var opts = parser.argv;

cli.on('require', function(name) {
  // This is needed because interpret needs to stub the .mjs extension
  // Without the .mjs require hook, rechoir blows up
  // However, we don't want to show the mjs-stub loader in the logs
  if (path.basename(name, '.js') !== 'mjs-stub') {
    log.info('Requiring external module', ansi.magenta(name));
  }
});

cli.on('requireFail', function(name, error) {
  log.warn(
    ansi.yellow('Failed to load external module'),
    ansi.magenta(name)
  );
  /* istanbul ignore else */
  if (error) {
    log.warn(ansi.yellow(error.toString()));
  }
});

cli.on('respawn', function(flags, child) {
  var nodeFlags = ansi.magenta(flags.join(', '));
  var pid = ansi.magenta(child.pid);
  log.info('Node flags detected:', nodeFlags);
  log.info('Respawned to PID:', pid);
});

function run() {
  cli.prepare({
    cwd: opts.cwd,
    configPath: opts.gulpfile,
    require: opts.require,
    completion: opts.completion,
  }, function(env) {
    var cfgLoadOrder = ['home', 'cwd'];
    var cfg = loadConfigFiles(env.configFiles['.gulp'], cfgLoadOrder);
    opts = mergeConfigToCliFlags(opts, cfg);
    env = mergeConfigToEnvFlags(env, cfg, opts);
    env.configProps = cfg;

    // Set up event listeners for logging again after configuring.
    toConsole(log, opts);

    cli.execute(env, env.nodeFlags, handleArguments);
  });
}

module.exports = run;

// The actual logic
function handleArguments(env) {

  // This translates the --continue flag in gulp
  // To the settle env variable for undertaker
  // We use the process.env so the user's gulpfile
  // Can know about the flag
  if (opts.continue) {
    process.env.UNDERTAKER_SETTLE = 'true';
  }

  if (opts.help) {
    parser.showHelp(console.log);
    exit(0);
  }

  // Anything that needs to print outside of the logging mechanism should use console.log
  if (opts.version) {
    console.log('CLI version:', cliVersion);
    console.log('Local version:', env.modulePackage.version || 'Unknown');
    exit(0);
  }

  if (opts.verify) {
    var pkgPath = opts.verify !== true ? opts.verify : 'package.json';
    /* istanbul ignore else */
    if (path.resolve(pkgPath) !== path.normalize(pkgPath)) {
      pkgPath = path.join(env.cwd, pkgPath);
    }
    log.info('Verifying plugins in ' + pkgPath);
    return getBlacklist(function(err, blacklist) {
      /* istanbul ignore if */
      if (err) {
        return logBlacklistError(err);
      }

      var blacklisted = verifyDeps(require(pkgPath), blacklist);

      logVerify(blacklisted);
    });
  }

  if (!env.modulePath) {
    /* istanbul ignore next */
    var missingNodeModules =
      fs.existsSync(path.join(env.cwd, 'package.json'))
      && !fs.existsSync(path.join(env.cwd, 'node_modules'));

    /* istanbul ignore next */
    var missingGulpMessage =
      missingNodeModules
        ? 'Local modules not found in'
        : 'Local gulp not found in';
    log.error(
      ansi.red(missingGulpMessage),
      ansi.magenta(tildify(env.cwd))
    );
    var hasYarn = fs.existsSync(path.join(env.cwd, 'yarn.lock'));
    /* istanbul ignore next */
    var installCommand =
      missingNodeModules
        ? hasYarn
          ? 'yarn install'
          : 'npm install'
        : hasYarn
          ? 'yarn add gulp'
        : 'npm install gulp';
    log.error(ansi.red('Try running: ' + installCommand));
    exit(1);
  }

  if (!env.configPath) {
    log.error(ansi.red('No gulpfile found'));
    exit(1);
  }

  // Chdir before requiring gulpfile to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    log.info(
      'Working directory changed to',
      ansi.magenta(tildify(env.cwd))
    );
  }

  // Find the correct CLI version to run
  var range = findRange(env.modulePackage.version, ranges);

  if (!range) {
    log.error(
      ansi.red('Unsupported gulp version', env.modulePackage.version)
    );
    exit(1);
  }

  // Load and execute the CLI version
  var versionedDir = path.join(__dirname, '/lib/versioned/', range, '/');
  require(versionedDir)(opts, env, env.configProps);
}
