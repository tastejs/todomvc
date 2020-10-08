/*global window, RSVP, FileReader */
/*jslint indent: 2, maxerr: 3, unparam: true */
(function(window, RSVP, FileReader) {
	"use strict";

	window.loopEventListener = function(target, type, useCapture, callback,
		allowDefault) {
		//////////////////////////
		// Infinite event listener (promise is never resolved)
		// eventListener is removed when promise is cancelled/rejected
		//////////////////////////
		var handle_event_callback,
			callback_promise;

		function cancelResolver() {
			if ((callback_promise !== undefined) &&
				(typeof callback_promise.cancel === "function")) {
				callback_promise.cancel();
			}
		}

		function canceller() {
			if (handle_event_callback !== undefined) {
				target.removeEventListener(type, handle_event_callback, useCapture);
			}
			cancelResolver();
		}

		function itsANonResolvableTrap(resolve, reject) {

			handle_event_callback = function(evt) {
				evt.stopPropagation();
				if (allowDefault !== true) {
					evt.preventDefault();
				}
				cancelResolver();
				callback_promise = new RSVP.Queue()
					.push(function() {
						return callback(evt);
					})
					.push(undefined, function(error) {
						if (!(error instanceof RSVP.CancellationError)) {
							canceller();
							reject(error);
						}
					});
			};

			target.addEventListener(type, handle_event_callback, useCapture);
		}
		return new RSVP.Promise(itsANonResolvableTrap, canceller);
	};

	window.promiseEventListener = function(target, type, useCapture) {
		//////////////////////////
		// Resolve the promise as soon as the event is triggered
		// eventListener is removed when promise is cancelled/resolved/rejected
		//////////////////////////
		var handle_event_callback;

		function canceller() {
			target.removeEventListener(type, handle_event_callback, useCapture);
		}

		function resolver(resolve) {
			handle_event_callback = function(evt) {
				canceller();
				evt.stopPropagation();
				evt.preventDefault();
				resolve(evt);
				return false;
			};

			target.addEventListener(type, handle_event_callback, useCapture);
		}
		return new RSVP.Promise(resolver, canceller);
	};

	window.promiseReadAsText = function(file) {
		return new RSVP.Promise(function(resolve, reject) {
			var reader = new FileReader();
			reader.onload = function(evt) {
				resolve(evt.target.result);
			};
			reader.onerror = function(evt) {
				reject(evt);
			};
			reader.readAsText(file);
		});
	};
}(window, RSVP, FileReader));
