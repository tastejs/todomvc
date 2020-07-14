'use strict';
const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const cliSpinners = require('cli-spinners');
const logSymbols = require('log-symbols');
const stripAnsi = require('strip-ansi');
const wcwidth = require('wcwidth');

const TEXT = Symbol('text');

class Ora {
	constructor(options) {
		if (typeof options === 'string') {
			options = {
				text: options
			};
		}

		this.options = Object.assign({
			text: '',
			color: 'cyan',
			stream: process.stderr
		}, options);

		const sp = this.options.spinner;
		this.spinner = typeof sp === 'object' ? sp : (process.platform === 'win32' ? cliSpinners.line : (cliSpinners[sp] || cliSpinners.dots)); // eslint-disable-line no-nested-ternary

		if (this.spinner.frames === undefined) {
			throw new Error('Spinner must define `frames`');
		}

		this.color = this.options.color;
		this.hideCursor = this.options.hideCursor !== false;
		this.interval = this.options.interval || this.spinner.interval || 100;
		this.stream = this.options.stream;
		this.id = null;
		this.frameIndex = 0;
		this.enabled = typeof this.options.enabled === 'boolean' ? this.options.enabled : ((this.stream && this.stream.isTTY) && !process.env.CI);

		// Set *after* `this.stream`
		this.text = this.options.text;
		this.linesToClear = 0;
	}

	get text() {
		return this[TEXT];
	}

	get isSpinning() {
		return this.id !== null;
	}

	set text(value) {
		this[TEXT] = value;
		const columns = this.stream.columns || 80;
		this.lineCount = stripAnsi('--' + value).split('\n').reduce((count, line) => {
			return count + Math.max(1, Math.ceil(wcwidth(line) / columns));
		}, 0);
	}

	frame() {
		const frames = this.spinner.frames;
		let frame = frames[this.frameIndex];

		if (this.color) {
			frame = chalk[this.color](frame);
		}

		this.frameIndex = ++this.frameIndex % frames.length;

		return frame + ' ' + this.text;
	}

	clear() {
		if (!this.enabled) {
			return this;
		}

		for (let i = 0; i < this.linesToClear; i++) {
			if (i > 0) {
				this.stream.moveCursor(0, -1);
			}
			this.stream.clearLine();
			this.stream.cursorTo(0);
		}
		this.linesToClear = 0;

		return this;
	}

	render() {
		this.clear();
		this.stream.write(this.frame());
		this.linesToClear = this.lineCount;

		return this;
	}

	start(text) {
		if (text) {
			this.text = text;
		}

		if (!this.enabled || this.isSpinning) {
			return this;
		}

		if (this.hideCursor) {
			cliCursor.hide(this.stream);
		}
		this.render();
		this.id = setInterval(this.render.bind(this), this.interval);

		return this;
	}

	stop() {
		if (!this.enabled) {
			return this;
		}

		clearInterval(this.id);
		this.id = null;
		this.frameIndex = 0;
		this.clear();
		if (this.hideCursor) {
			cliCursor.show(this.stream);
		}

		return this;
	}

	succeed(text) {
		return this.stopAndPersist({symbol: logSymbols.success, text});
	}

	fail(text) {
		return this.stopAndPersist({symbol: logSymbols.error, text});
	}

	warn(text) {
		return this.stopAndPersist({symbol: logSymbols.warning, text});
	}

	info(text) {
		return this.stopAndPersist({symbol: logSymbols.info, text});
	}

	stopAndPersist(options) {
		if (!this.enabled) {
			return this;
		}

		// TODO: Remove in the next major version
		if (typeof options === 'string') {
			throw new TypeError('This argument now accepts an options object, not a string');
		}

		options = options || {};

		this.stop();
		this.stream.write(`${options.symbol || ' '} ${options.text || this.text}\n`);

		return this;
	}
}

module.exports = function (opts) {
	return new Ora(opts);
};

module.exports.promise = (action, options) => {
	if (typeof action.then !== 'function') {
		throw new TypeError('Parameter `action` must be a Promise');
	}

	const spinner = new Ora(options);
	spinner.start();

	action.then(
		() => {
			spinner.succeed();
		},
		() => {
			spinner.fail();
		}
	);

	return spinner;
};
