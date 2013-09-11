/**
 * setImmediate polyfill / shim
 *
 * (c) copyright 2011-2013 Brian Cavalier and John Hann
 *
 * poly is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Based on NobleJS's setImmediate. (https://github.com/NobleJS/setImmediate)
 *
 * Licensed under the MIT License at:
 *      http://www.opensource.org/licenses/mit-license.php
 *
 */
(function (global) {
define(['./lib/_base'], function (base) {

	var testCache,
		tasks;

	testCache = {};
	tasks = (function () {
		var nextHandle,
			tasksByHandle,
			currentlyRunningATask;

		nextHandle = 1; // Spec says greater than zero
		tasksByHandle = {};
		currentlyRunningATask = false;

		function Task (handler, args) {
			this.handler = handler;
			this.args = Array.prototype.slice.call(args);
		}

		Task.prototype.run = function () {
			// See steps in section 5 of the spec.
			if (base.isFunction(this.handler)) {
				// Choice of `thisArg` is not in the setImmediate spec; `undefined` is in the setTimeout spec though:
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html
				this.handler.apply(undefined, this.args);
			}
			else {
				var scriptSource = '' + this.handler;
				eval(scriptSource);
			}
		};

		return {
			addFromSetImmediateArguments: function (args) {
				var handler,
					argsToHandle,
					task,
					thisHandle;

				handler = args[0];
				argsToHandle = Array.prototype.slice.call(args, 1);
				task = new Task(handler, argsToHandle);

				thisHandle = nextHandle++;
				tasksByHandle[thisHandle] = task;
				return thisHandle;
			},
			runIfPresent: function (handle) {
				// From the spec: "Wait until any invocations of this algorithm started before this one have completed."
				// So if we're currently running a task, we'll need to delay this invocation.
				if (!currentlyRunningATask) {
					var task = tasksByHandle[handle];
					if (task) {
						currentlyRunningATask = true;
						try {
							task.run();
						} finally {
							delete tasksByHandle[handle];
							currentlyRunningATask = false;
						}
					}
				} else {
					// Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
					// "too much recursion" error.
					global.setTimeout(function () {
						tasks.runIfPresent(handle);
					}, 0);
				}
			},
			remove: function (handle) {
				delete tasksByHandle[handle];
			}
		};
	}());

	function has (name) {
		if (base.isFunction(testCache[name])) {
			testCache[name] = testCache[name](global);
		}
		return testCache[name];
	}

	function add (name, test, now) {
		testCache[name] = now ? test(global, d, el) : test;
	}

	function aliasMicrosoftImplementation (attachTo) {
		attachTo.setImmediate = global.msSetImmediate;
		attachTo.clearImmediate = global.msClearImmediate;
	}

	function installPostMessageImplementation (attachTo) {
		// Installs an event handler on `global` for the `message` event: see
		// * https://developer.mozilla.org/en/DOM/window.postMessage
		// * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

		var MESSAGE_PREFIX = 'cujojs/poly.setImmediate' + Math.random();

		function isStringAndStartsWith (string, putativeStart) {
			return typeof string === 'string' && string.substring(0, putativeStart.length) === putativeStart;
		}

		function onGlobalMessage (event) {
			// This will catch all incoming messages (even from other windows!), so we need to try reasonably hard to
			// avoid letting anyone else trick us into firing off. We test the origin is still this window, and that a
			// (randomly generated) unpredictable identifying prefix is present.
			if (event.source === global && isStringAndStartsWith(event.data, MESSAGE_PREFIX)) {
				var handle = event.data.substring(MESSAGE_PREFIX.length);
				tasks.runIfPresent(handle);
			}
		}
		global.addEventListener('message', onGlobalMessage, false);

		attachTo.setImmediate = function () {
			var handle = tasks.addFromSetImmediateArguments(arguments);

			// Make `global` post a message to itself with the handle and identifying prefix, thus asynchronously
			// invoking our onGlobalMessage listener above.
			global.postMessage(MESSAGE_PREFIX + handle, '*');
			return handle;
		};
	}

	function installReadyStateChangeImplementation(attachTo) {
		attachTo.setImmediate = function () {
			var handle = tasks.addFromSetImmediateArguments(arguments);

			// Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
			// into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
			var scriptEl = global.document.createElement('script');
			scriptEl.onreadystatechange = function () {
				tasks.runIfPresent(handle);

				scriptEl.onreadystatechange = null;
				scriptEl.parentNode.removeChild(scriptEl);
				scriptEl = null;
			};
			global.document.documentElement.appendChild(scriptEl);
			return handle;
		};
	}

	function installSetTimeoutImplementation(attachTo) {
		attachTo.setImmediate = function () {
			var handle = tasks.addFromSetImmediateArguments(arguments);

			global.setTimeout(function () {
				tasks.runIfPresent(handle);
			}, 0);
			return handle;
		};
	}

	add('setimmediate', function (g) {
		return base.isFunction(g.setImmediate);
	});

	add('ms-setimmediate', function (g) {
		return base.isFunction(g.msSetImmediate);
	});

	add('post-message', function (g) {
		// Note: this is only for the async postMessage, not the buggy sync
		// version in IE8
		var postMessageIsAsynchronous,
			oldOnMessage;

		postMessageIsAsynchronous = true;
		oldOnMessage = g.onmessage;

		if (!g.postMessage) {
			return false;
		}

		g.onmessage = function () {
			postMessageIsAsynchronous = false;
		};
		g.postMessage('', '*');
		g.onmessage = oldOnMessage;
		return postMessageIsAsynchronous;
	});

	add('script-onreadystatechange', function (g) {
		return 'document' in g && 'onreadystatechange' in g.document.createElement('script');
	});

	if (!has('setimmediate')) {
		if (has('ms-setimmediate')) {
			aliasMicrosoftImplementation(global);
		}
		else {
			if (has('post-message')) {
				installPostMessageImplementation(global);
			}
			else if (has('script-onreadystatechange')) {
				installReadyStateChangeImplementation(global);
			}
			else {
				 installSetTimeoutImplementation(global);
			}
			global.clearImmediate = tasks.remove;
		}
	}
});
}(this.global || this));
