'use strict';
const {spawn} = require('child_process');
const path = require('path');
const {format} = require('util');
const importLazy = require('import-lazy')(require);

const configstore = importLazy('configstore');
const chalk = importLazy('chalk');
const semver = importLazy('semver');
const semverDiff = importLazy('semver-diff');
const latestVersion = importLazy('latest-version');
const isNpm = importLazy('is-npm');
const isInstalledGlobally = importLazy('is-installed-globally');
const isYarnGlobal = importLazy('is-yarn-global');
const hasYarn = importLazy('has-yarn');
const boxen = importLazy('boxen');
const xdgBasedir = importLazy('xdg-basedir');
const isCi = importLazy('is-ci');
const pupa = importLazy('pupa');

const ONE_DAY = 1000 * 60 * 60 * 24;

class UpdateNotifier {
	constructor(options = {}) {
		this.options = options;
		options.pkg = options.pkg || {};
		options.distTag = options.distTag || 'latest';

		// Reduce pkg to the essential keys. with fallback to deprecated options
		// TODO: Remove deprecated options at some point far into the future
		options.pkg = {
			name: options.pkg.name || options.packageName,
			version: options.pkg.version || options.packageVersion
		};

		if (!options.pkg.name || !options.pkg.version) {
			throw new Error('pkg.name and pkg.version required');
		}

		this.packageName = options.pkg.name;
		this.packageVersion = options.pkg.version;
		this.updateCheckInterval = typeof options.updateCheckInterval === 'number' ? options.updateCheckInterval : ONE_DAY;
		this.disabled = 'NO_UPDATE_NOTIFIER' in process.env ||
			process.env.NODE_ENV === 'test' ||
			process.argv.includes('--no-update-notifier') ||
			isCi();
		this.shouldNotifyInNpmScript = options.shouldNotifyInNpmScript;

		if (!this.disabled) {
			try {
				const ConfigStore = configstore();
				this.config = new ConfigStore(`update-notifier-${this.packageName}`, {
					optOut: false,
					// Init with the current time so the first check is only
					// after the set interval, so not to bother users right away
					lastUpdateCheck: Date.now()
				});
			} catch {
				// Expecting error code EACCES or EPERM
				const message =
					chalk().yellow(format(' %s update check failed ', options.pkg.name)) +
					format('\n Try running with %s or get access ', chalk().cyan('sudo')) +
					'\n to the local update config store via \n' +
					chalk().cyan(format(' sudo chown -R $USER:$(id -gn $USER) %s ', xdgBasedir().config));

				process.on('exit', () => {
					console.error(boxen()(message, {align: 'center'}));
				});
			}
		}
	}

	check() {
		if (
			!this.config ||
			this.config.get('optOut') ||
			this.disabled
		) {
			return;
		}

		this.update = this.config.get('update');

		if (this.update) {
			// Use the real latest version instead of the cached one
			this.update.current = this.packageVersion;

			// Clear cached information
			this.config.delete('update');
		}

		// Only check for updates on a set interval
		if (Date.now() - this.config.get('lastUpdateCheck') < this.updateCheckInterval) {
			return;
		}

		// Spawn a detached process, passing the options as an environment property
		spawn(process.execPath, [path.join(__dirname, 'check.js'), JSON.stringify(this.options)], {
			detached: true,
			stdio: 'ignore'
		}).unref();
	}

	async fetchInfo() {
		const {distTag} = this.options;
		const latest = await latestVersion()(this.packageName, {version: distTag});

		return {
			latest,
			current: this.packageVersion,
			type: semverDiff()(this.packageVersion, latest) || distTag,
			name: this.packageName
		};
	}

	notify(options) {
		const suppressForNpm = !this.shouldNotifyInNpmScript && isNpm().isNpmOrYarn;
		if (!process.stdout.isTTY || suppressForNpm || !this.update || !semver().gt(this.update.latest, this.update.current)) {
			return this;
		}

		options = {
			isGlobal: isInstalledGlobally(),
			isYarnGlobal: isYarnGlobal()(),
			...options
		};

		let installCommand;
		if (options.isYarnGlobal) {
			installCommand = `yarn global add ${this.packageName}`;
		} else if (options.isGlobal) {
			installCommand = `npm i -g ${this.packageName}`;
		} else if (hasYarn()()) {
			installCommand = `yarn add ${this.packageName}`;
		} else {
			installCommand = `npm i ${this.packageName}`;
		}

		const defaultTemplate = 'Update available ' +
			chalk().dim('{currentVersion}') +
			chalk().reset(' → ') +
			chalk().green('{latestVersion}') +
			' \nRun ' + chalk().cyan('{updateCommand}') + ' to update';

		const template = options.message || defaultTemplate;

		options.boxenOptions = options.boxenOptions || {
			padding: 1,
			margin: 1,
			align: 'center',
			borderColor: 'yellow',
			borderStyle: 'round'
		};

		const message = boxen()(
			pupa()(template, {
				packageName: this.packageName,
				currentVersion: this.update.current,
				latestVersion: this.update.latest,
				updateCommand: installCommand
			}),
			options.boxenOptions
		);

		if (options.defer === false) {
			console.error(message);
		} else {
			process.on('exit', () => {
				console.error(message);
			});

			process.on('SIGINT', () => {
				console.error('');
				process.exit();
			});
		}

		return this;
	}
}

module.exports = options => {
	const updateNotifier = new UpdateNotifier(options);
	updateNotifier.check();
	return updateNotifier;
};

module.exports.UpdateNotifier = UpdateNotifier;
