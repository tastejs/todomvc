(function (define) {
define(function () {
	"use strict";

	var enqueue;

	if (typeof process !== "undefined") {
		// node
		enqueue = process.nextTick;
	} else if (typeof msSetImmediate === "function") {
		// IE 10. From http://github.com/kriskowal/q
		// bind is necessary
		enqueue = msSetImmediate.bind(window);
	} else if (typeof setImmediate === "function") {
		enqueue = setImmediate;
	} else if (typeof MessageChannel !== "undefined") {
		enqueue = initMessageChannel();
	} else {
		// older envs w/only setTimeout
		enqueue = function (task) {
			setTimeout(task, 0);
		};
	}

	return enqueue;

	/**
	 * MessageChannel for browsers that support it
	 * From http://www.nonblocking.io/2011/06/windownexttick.html
	 */
	function initMessageChannel() {
		var channel, head, tail;

		channel = new MessageChannel();
		head = {};
		tail = head;

		channel.port1.onmessage = function () {
			var task;

			head = head.next;
			task = head.task;
			delete head.task;

			task();
		};

		return function (task) {
			tail = tail.next = {task: task};
			channel.port2.postMessage(0);
		};
	}
});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(); }
));
