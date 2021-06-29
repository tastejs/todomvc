'use strict';
const os = require('os');
const util = require('util');

const getCode = (error, code) => {
	if (error && error.code) {
		return [error.code, os.constants.errno[error.code]];
	}

	if (Number.isInteger(code)) {
		return [util.getSystemErrorName(-code), code];
	}

	return [];
};

const getErrorPrefix = ({timedOut, timeout, signal, exitCodeName, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (signal) {
		return `was killed with ${signal}`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode} (${exitCodeName})`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	code,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	const [exitCodeName, exitCode] = getCode(error, code);

	const prefix = getErrorPrefix({timedOut, timeout, signal, exitCodeName, exitCode, isCanceled});
	const message = `Command ${prefix}: ${command}`;

	if (error instanceof Error) {
		error.message = `${message}\n${error.message}`;
	} else {
		error = new Error(message);
	}

	error.command = command;
	delete error.code;
	error.exitCode = exitCode;
	error.exitCodeName = exitCodeName;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;
	// `signal` emitted on `spawned.on('exit')` event can be `null`. We normalize
	// it to `undefined`
	error.signal = signal || undefined;

	return error;
};

module.exports = makeError;
