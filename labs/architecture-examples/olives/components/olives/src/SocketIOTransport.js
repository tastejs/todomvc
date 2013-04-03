/**
 * Olives http://flams.github.com/olives
 * The MIT License (MIT)
 * Copyright (c) 2012-2013 Olivier Scherrer <pode.fr@gmail.com> - Olivier Wietrich <olivier.wietrich@gmail.com>
 */

define(["Observable", "Tools"],
/**
 * @class
 * SocketIOTransport allows for client-server eventing.
 * It's based on socket.io.
 */
function SocketIOTransport(Observable, Tools) {

	/**
	 * Defines the SocketIOTransport
	 * @private
	 * @param {Object} $io socket.io's object
	 * @returns
	 */
	return function SocketIOTransportConstructor($socket) {

		/**
		 * @private
		 * The socket.io's socket
		 */
		var _socket = null;

		/**
		 * Set the socket created by SocketIO
		 * @param {Object} socket the socket.io socket
		 * @returns true if it seems to be a socket.io socket
		 */
		this.setSocket = function setSocket(socket) {
			if (socket && typeof socket.emit == "function") {
				_socket = socket;
				return true;
			} else {
				return false;
			}
		};

		/**
		 * Get the socket, for debugging purpose
		 * @private
		 * @returns {Object} the socket
		 */
		this.getSocket = function getSocket() {
			return _socket;
		},

		/**
		 * Subscribe to a socket event
		 * @param {String} event the name of the event
		 * @param {Function} func the function to execute when the event fires
		 */
		this.on = function on(event, func) {
			return _socket.on(event, func);
		},

		/**
		 * Subscribe to a socket event but disconnect as soon as it fires.
		 * @param {String} event the name of the event
		 * @param {Function} func the function to execute when the event fires
		 */
		this.once = function once(event, func) {
			return _socket.once(event, func);
		};

		/**
		 * Publish an event on the socket
		 * @param {String} event the event to publish
		 * @param data
		 * @param {Function} callback is the function to be called for ack
		 */
		this.emit = function emit(event, data, callback) {
			return _socket.emit(event, data, callback);
		};

		/**
		 * Stop listening to events on a channel
		 * @param {String} event the event to publish
		 * @param data
		 * @param {Function} callback is the function to be called for ack
		 */
		this.removeListener = function removeListener(event, data, callback) {
			return _socket.removeListener(event, data, callback);
		};

		/**
		 * Make a request on the node server
		 * @param {String} channel watch the server's documentation to see available channels
		 * @param data the request data, it could be anything
		 * @param {Function} func the callback that will get the response.
		 * @param {Object} scope the scope in which to execute the callback
		 */
		this.request = function request(channel, data, func, scope) {
			if (typeof channel == "string"
					&& typeof data != "undefined") {

				var reqData = {
						eventId: Date.now() + Math.floor(Math.random()*1e6),
						data: data
					},
					boundCallback = function () {
						func && func.apply(scope || null, arguments);
					};

				this.once(reqData.eventId, boundCallback);

				this.emit(channel, reqData);

				return true;
			} else {
				return false;
			}
		};

		/**
		 * Listen to an url and get notified on new data
		 * @param {String} channel watch the server's documentation to see available channels
		 * @param data the request data, it could be anything
		 * @param {Function} func the callback that will get the data
		 * @param {Object} scope the scope in which to execute the callback
		 * @returns
		 */
		this.listen = function listen(channel, data, func, scope) {
			if (typeof channel == "string"
					&& typeof data != "undefined"
					&& typeof func == "function") {

				var reqData = {
						eventId: Date.now() + Math.floor(Math.random()*1e6),
						data: data,
						keepAlive: true
					},
					boundCallback = function () {
						func && func.apply(scope || null, arguments);
					},
					that = this;

				this.on(reqData.eventId, boundCallback);

				this.emit(channel, reqData);

				return function stop() {
					that.emit("disconnect-" + reqData.eventId);
					that.removeListener(reqData.eventId, boundCallback);
				};
			} else {
				return false;
			}
		};

		/**
		 * Sets the socket.io
		 */
		this.setSocket($socket);
	};
});
