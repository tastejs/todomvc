<img src="media/logo.svg" width="400">
<br>

[![Build Status](https://travis-ci.org/sindresorhus/execa.svg?branch=master)](https://travis-ci.org/sindresorhus/execa) [![Coverage Status](https://coveralls.io/repos/github/sindresorhus/execa/badge.svg?branch=master)](https://coveralls.io/github/sindresorhus/execa?branch=master)

> Process execution for humans


---

One of the maintainers [@ehmicky](https://github.com/ehmicky) is looking for a remote full-time position as a Node.js back-end lead. Feel free to [contact him](https://www.mickael-hebert.com)!

---


## Why

This package improves [`child_process`](https://nodejs.org/api/child_process.html) methods with:

- Promise interface.
- [Strips the final newline](#stripfinalnewline) from the output so you don't have to do `stdout.trim()`.
- Supports [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix)) binaries cross-platform.
- [Improved Windows support.](https://github.com/IndigoUnited/node-cross-spawn#why)
- Higher max buffer. 100 MB instead of 200 KB.
- [Executes locally installed binaries by name.](#preferlocal)
- [Cleans up spawned processes when the parent process dies.](#cleanup)
- [Get interleaved output](#all) from `stdout` and `stderr` similar to what is printed on the terminal. [*(Async only)*](#execasyncfile-arguments-options)
- [Can specify file and arguments as a single string without a shell](#execacommandcommand-options)
- More descriptive errors.


## Install

```
$ npm install execa
```


## Usage

```js
const execa = require('execa');

(async () => {
	const {stdout} = await execa('echo', ['unicorns']);
	console.log(stdout);
	//=> 'unicorns'
})();
```

Additional examples:

```js
const execa = require('execa');

(async () => {
	// Pipe the child process stdout to the current stdout
	execa('echo', ['unicorns']).stdout.pipe(process.stdout);


	// Catching an error
	try {
		await execa('wrong', ['command']);
	} catch (error) {
		console.log(error);
		/*
		{
			message: 'Command failed with exit code 2 (ENOENT): wrong command spawn wrong ENOENT',
			errno: -2,
			syscall: 'spawn wrong',
			path: 'wrong',
			spawnargs: ['command'],
			command: 'wrong command',
			exitCode: 2,
			exitCodeName: 'ENOENT',
			stdout: '',
			stderr: '',
			all: '',
			failed: true,
			timedOut: false,
			isCanceled: false,
			killed: false
		}
		*/
	}

	// Cancelling a spawned process
	const subprocess = execa('node');
	setTimeout(() => {
		subprocess.cancel();
	}, 1000);
	try {
		await subprocess;
	} catch (error) {
		console.log(subprocess.killed); // true
		console.log(error.isCanceled); // true
	}
})();

// Catching an error with a sync method
try {
	execa.sync('wrong', ['command']);
} catch (error) {
	console.log(error);
	/*
	{
		message: 'Command failed with exit code 2 (ENOENT): wrong command spawnSync wrong ENOENT',
		errno: -2,
		syscall: 'spawnSync wrong',
		path: 'wrong',
		spawnargs: ['command'],
		command: 'wrong command',
		exitCode: 2,
		exitCodeName: 'ENOENT',
		stdout: '',
		stderr: '',
		failed: true,
		timedOut: false,
		isCanceled: false,
		killed: false
	}
	*/
}

// Kill a process with SIGTERM, and after 2 seconds, kill it with SIGKILL
const subprocess = execa('node');
setTimeout(() => {
	subprocess.kill('SIGTERM', {
		forceKillAfterTimeout: 2000
	});
}, 1000);
```

## API

### execa(file, arguments, [options])

Execute a file. Think of this as a mix of [`child_process.execFile()`](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback) and [`child_process.spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

No escaping/quoting is needed.

Unless the [`shell`](#shell) option is used, no shell interpreter (Bash, `cmd.exe`, etc.) is used, so shell features such as variables substitution (`echo $PATH`) are not allowed.

Returns a [`child_process` instance](https://nodejs.org/api/child_process.html#child_process_class_childprocess) which:
  - is also a `Promise` resolving or rejecting with a [`childProcessResult`](#childProcessResult).
  - exposes the following additional methods and properties.

#### kill([signal], [options])

Same as the original [`child_process#kill()`](https://nodejs.org/api/child_process.html#child_process_subprocess_kill_signal) except: if `signal` is `SIGTERM` (the default value) and the child process is not terminated after 5 seconds, force it by sending `SIGKILL`.

##### options.forceKillAfterTimeout

Type: `number | false`<br>
Default: `5000`

Milliseconds to wait for the child process to terminate before sending `SIGKILL`.

Can be disabled with `false`.

#### cancel()

Similar to [`childProcess.kill()`](https://nodejs.org/api/child_process.html#child_process_subprocess_kill_signal). This is preferred when cancelling the child process execution as the error is more descriptive and [`childProcessResult.isCanceled`](#iscanceled) is set to `true`.

#### all

Type: `ReadableStream | undefined`

Stream combining/interleaving [`stdout`](https://nodejs.org/api/child_process.html#child_process_subprocess_stdout) and [`stderr`](https://nodejs.org/api/child_process.html#child_process_subprocess_stderr).

This is `undefined` when both [`stdout`](#stdout-1) and [`stderr`](#stderr-1) options are set to [`'pipe'`, `'ipc'`, `Stream` or `integer`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

### execa.sync(file, [arguments], [options])

Execute a file synchronously.

Returns or throws a [`childProcessResult`](#childProcessResult).

### execa.command(command, [options])

Same as [`execa()`](#execafile-arguments-options) except both file and arguments are specified in a single `command` string. For example, `execa('echo', ['unicorns'])` is the same as `execa.command('echo unicorns')`.

If the file or an argument contains spaces, they must be escaped with backslashes. This matters especially if `command` is not a constant but a variable, for example with `__dirname` or `process.cwd()`. Except for spaces, no escaping/quoting is needed.

The [`shell` option](#shell) must be used if the `command` uses shell-specific features, as opposed to being a simple `file` followed by its `arguments`.

### execa.commandSync(command, [options])

Same as [`execa.command()`](#execacommand-command-options) but synchronous.

Returns or throws a [`childProcessResult`](#childProcessResult).

### execa.node(scriptPath, [arguments], [options])

Execute a Node.js script as a child process.

Same as `execa('node', [scriptPath, ...arguments], options)` except (like [`child_process#fork()`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)):
  - the current Node version and options are used. This can be overridden using the [`nodePath`](#nodepath-for-node-only) and [`nodeOptions`](#nodeoptions-for-node-only) options.
  - the [`shell`](#shell) option cannot be used
  - an extra channel [`ipc`](https://nodejs.org/api/child_process.html#child_process_options_stdio) is passed to [`stdio`](#stdio)

### childProcessResult

Type: `object`

Result of a child process execution. On success this is a plain object. On failure this is also an `Error` instance.

#### command

Type: `string`

The file and arguments that were run.

#### exitCode

Type: `number`

The numeric exit code of the process that was run.

#### exitCodeName

Type: `string`

The textual exit code of the process that was run.

#### stdout

Type: `string | Buffer`

The output of the process on stdout.

#### stderr

Type: `string | Buffer`

The output of the process on stderr.

#### all

Type: `string | Buffer`

The output of the process on both stdout and stderr. `undefined` if `execa.sync()` was used.

#### failed

Type: `boolean`

Whether the process failed to run.

#### timedOut

Type: `boolean`

Whether the process timed out.

#### isCanceled

Type: `boolean`

Whether the process was canceled.

#### killed

Type: `boolean`

Whether the process was killed.

#### signal

Type: `string | undefined`

The signal that was used to terminate the process.

### options

Type: `object`

#### cleanup

Type: `boolean`<br>
Default: `true`

Kill the spawned process when the parent process exits unless either:
	- the spawned process is [`detached`](https://nodejs.org/api/child_process.html#child_process_options_detached)
	- the parent process is terminated abruptly, for example, with `SIGKILL` as opposed to `SIGTERM` or a normal exit

#### preferLocal

Type: `boolean`<br>
Default: `false`

Prefer locally installed binaries when looking for a binary to execute.<br>
If you `$ npm install foo`, you can then `execa('foo')`.

#### localDir

Type: `string`<br>
Default: `process.cwd()`

Preferred path to find locally installed binaries in (use with `preferLocal`).

#### buffer

Type: `boolean`<br>
Default: `true`

Buffer the output from the spawned process. When buffering is disabled you must consume the output of the `stdout` and `stderr` streams because the promise will not be resolved/rejected until they have completed.

If the spawned process fails, [`error.stdout`](#stdout), [`error.stderr`](#stderr), and [`error.all`](#all) will contain the buffered data.

#### input

Type: `string | Buffer | stream.Readable`

Write some input to the `stdin` of your binary.<br>
Streams are not allowed when using the synchronous methods.

#### stdin

Type: `string | number | Stream | undefined`<br>
Default: `pipe`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### stdout

Type: `string | number | Stream | undefined`<br>
Default: `pipe`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### stderr

Type: `string | number | Stream | undefined`<br>
Default: `pipe`

Same options as [`stdio`](https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio).

#### reject

Type: `boolean`<br>
Default: `true`

Setting this to `false` resolves the promise with the error instead of rejecting it.

#### stripFinalNewline

Type: `boolean`<br>
Default: `true`

Strip the final [newline character](https://en.wikipedia.org/wiki/Newline) from the output.

#### extendEnv

Type: `boolean`<br>
Default: `true`

Set to `false` if you don't want to extend the environment variables when providing the `env` property.

---

Execa also accepts the below options which are the same as the options for [`child_process#spawn()`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)/[`child_process#exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)

#### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory of the child process.

#### env

Type: `object`<br>
Default: `process.env`

Environment key-value pairs. Extends automatically from `process.env`. Set [`extendEnv`](#extendenv) to `false` if you don't want this.

#### argv0

Type: `string`

Explicitly set the value of `argv[0]` sent to the child process. This will be set to `file` if not specified.

#### stdio

Type: `string | string[]`<br>
Default: `pipe`

Child's [stdio](https://nodejs.org/api/child_process.html#child_process_options_stdio) configuration.

#### detached

Type: `boolean`

Prepare child to run independently of its parent process. Specific behavior [depends on the platform](https://nodejs.org/api/child_process.html#child_process_options_detached).

#### uid

Type: `number`

Sets the user identity of the process.

#### gid

Type: `number`

Sets the group identity of the process.

#### shell

Type: `boolean | string`<br>
Default: `false`

If `true`, runs `file` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows. A different shell can be specified as a string. The shell should understand the `-c` switch on UNIX or `/d /s /c` on Windows.

We recommend against using this option since it is:
- not cross-platform, encouraging shell-specific syntax.
- slower, because of the additional shell interpretation.
- unsafe, potentially allowing command injection.

#### encoding

Type: `string | null`<br>
Default: `utf8`

Specify the character encoding used to decode the `stdout` and `stderr` output. If set to `null`, then `stdout` and `stderr` will be a `Buffer` instead of a string.

#### timeout

Type: `number`<br>
Default: `0`

If timeout is greater than `0`, the parent will send the signal identified by the `killSignal` property (the default is `SIGTERM`) if the child runs longer than timeout milliseconds.

#### maxBuffer

Type: `number`<br>
Default: `100_000_000` (100 MB)

Largest amount of data in bytes allowed on `stdout` or `stderr`.

#### killSignal

Type: `string | number`<br>
Default: `SIGTERM`

Signal value to be used when the spawned process will be killed.

#### windowsVerbatimArguments

Type: `boolean`<br>
Default: `false`

If `true`, no quoting or escaping of arguments is done on Windows. Ignored on other platforms. This is set to `true` automatically when the `shell` option is `true`.

#### nodePath *(for `.node()` only)*

Type: `string`<br>
Default: [`process.execPath`](https://nodejs.org/api/process.html#process_process_execpath)

Node.js executable used to create the child process.

#### nodeOptions *(for `.node()` only)*

Type: `string[]`<br>
Default: [`process.execArgv`](https://nodejs.org/api/process.html#process_process_execargv)

List of [CLI options](https://nodejs.org/api/cli.html#cli_options) passed to the Node.js executable.

## Tips

### Save and pipe output from a child process

Let's say you want to show the output of a child process in real-time while also saving it to a variable.

```js
const execa = require('execa');

const subprocess = execa('echo', ['foo']);
subprocess.stdout.pipe(process.stdout);

(async () => {
	const {stdout} = await subprocess;
	console.log('child output:', stdout);
})();
```

### Redirect output to a file

```js
const execa = require('execa');

const subprocess = execa('echo', ['foo'])
subprocess.stdout.pipe(fs.createWriteStream('stdout.txt'))
```

### Redirect input from a file

```js
const execa = require('execa');

const subprocess = execa('cat')
fs.createReadStream('stdin.txt').pipe(subprocess.stdin)
```

### Execute the current package's binary

```js
const {getBinPathSync} = require('get-bin-path');

const binPath = getBinPathSync();
const subprocess = execa(binPath);
```

`execa` can be combined with [`get-bin-path`](https://github.com/ehmicky/get-bin-path) to test the current package's binary. As opposed to hard-coding the path to the binary, this validates that the `package.json` `bin` field is correctly set up.

## Related

- [gulp-execa](https://github.com/ehmicky/gulp-execa) - Gulp plugin for `execa`


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [@ehmicky](https://github.com/ehmicky)


---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-execa?utm_source=npm-execa&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
