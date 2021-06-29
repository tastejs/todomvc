'use strict';

var ogWrite = process.stdout.write;

var muteStdout = { mute: mute, unmute: noop };

function noop() {}

function mute() {
  muteStdout.unmute = unmute;
  process.stdout.write = noop;
}

function unmute() {
  process.stdout.write = ogWrite;
  muteStdout.unmute = noop;
}

module.exports = muteStdout;
