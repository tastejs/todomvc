(function (scope) {

	// we need to register appropriately to know when
	// the document is officially ready to ensure
	// client code is only going to execute at the
	// appropriate time

	var doc = scope.document;
	var queue = [];
	var ready = ("complete" === doc.readyState);
	var run;
	var init;
	var remove;
	var add;
	var flush;

	enyo.ready = function (fn, context) {
		if (ready) run(fn, context);
		else queue.push([fn, context]);
	};

	run = function (fn, context) {
		fn.call(context || enyo.global);
	};

	init = function (event) {
		// if we're interactive it should be safe to move
		// forward because the content has been parsed
		if ((ready = ("interactive" === doc.readyState))) {
			if (!~["DOMContentLoaded", "readystatechange"].indexOf(event.type)) {
				remove(event.type, init);
				flush();
			}
		}
		// for an IE8 fallback and assurance
		if ((ready = ("complete" === doc.readyState))) {
			remove(event.type, init);
			flush();
		}
	};

	add = function (event, fn) {
		var name = doc.addEventListener? "addEventListener": "attachEvent";
		var on = name === "attachEvent"? "on": "";
		doc[name](on + event, fn, false);
	};

	remove = function (event, fn) {
		var name = doc.addEventListener? "removeEventListener": "detachEvent";
		var on = name === "detachEvent"? "on": "";
		doc[name](on + event, fn, false);
	};

	flush = function () {
		if (ready && queue.length) {
			while (queue.length) {
				run.apply(scope, queue.shift());
			}
		}
	};

	// ok, lets hook this nonsense up
	add("DOMContentLoaded", init);
	add("readystatechange", init);

})(window);
