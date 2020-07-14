#!/usr/bin/env node

var cp = require('child_process'),
	fs = require('fs'),
	path = require('path');

// Parse args
var force = false,
	debug = false;
var
	arch = process.arch,
	platform = process.platform,
	nodeV = /[0-9]+\.[0-9]+/.exec(process.versions.node)[0],
	nodeVM = /[0-9]+/.exec(process.versions.node)[0];
var args = process.argv.slice(2).filter(function(arg) {
	if (arg === '-f') {
		force = true;
		return false;
	}
	else if (arg.substring(0, 13) === '--target_arch') {
		arch = arg.substring(14);
	}
	else if (arg === '--debug') {
		debug = true;
	}
	return true;
});
if (!{
		ia32: true,
		x64: true,
		arm: true,
		arm64: true,
		ppc64: true,
		ppc: true,
		s390x: true
	}.hasOwnProperty(arch)) {
	console.error('Unsupported (?) architecture: `' + arch + '`');
	process.exit(1);
}

// Test for pre-built library
var modPath = platform + '-' + arch + '-node-' + nodeV;
if (!force) {
	try {
		try{
			fs.statSync(path.join(__dirname, 'bin', modPath, 'deasync.node'));
		}
		catch(ex){
			modPath = platform + '-' + arch + '-node-' + nodeVM;
			fs.statSync(path.join(__dirname, 'bin', modPath, 'deasync.node'));
		}
		console.log('`' + modPath + '` exists; testing');
		cp.execFile(process.execPath, ['quick-test.js'], function(err, stdout, stderr) {
			if (err || stderr) {
				console.log('Problem with the binary; manual build incoming');
				console.log('stdout=' + stdout);
				console.log('err=' + err);
				build();
			}
			else {
				console.log('Binary is fine; exiting');
			}
		});
	}
	catch (ex) {
		// Stat failed
		build();
	}
}
else {
	build();
}

// Build it
function build() {
	cp.spawn(
			process.platform === 'win32' ? 'node-gyp.cmd' : 'node-gyp', ['rebuild'].concat(args), {
				stdio: 'inherit'
			})
		.on('exit', function(err) {
			if (err) {
				if (err === 127) {
					console.error(
						'node-gyp not found! Please upgrade your install of npm! You need at least 1.1.5 (I think) ' +
						'and preferably 1.1.30.'
					);
				}
				else {
					console.error('Build failed');
				}
				return process.exit(err);
			}
			afterBuild();
		});
}

// Move it to expected location
function afterBuild() {
	var targetPath = path.join(__dirname, 'build', debug ? 'Debug' : 'Release', 'deasync.node');
	var installPath = path.join(__dirname, 'bin', modPath, 'deasync.node');

	try {
		fs.mkdirSync(path.join(__dirname, 'bin'));
	}
	catch (ex) {}
	try {
		fs.mkdirSync(path.join(__dirname, 'bin', modPath));
	}
	catch (ex) {}

	try {
		fs.statSync(targetPath);
	}
	catch (ex) {
		console.error('Build succeeded but target not found');
		process.exit(1);
	}
	fs.renameSync(targetPath, installPath);
	console.log('Installed in `' + installPath + '`');
}
