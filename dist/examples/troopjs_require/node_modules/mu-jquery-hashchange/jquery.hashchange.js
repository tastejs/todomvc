/**
 * @license MIT http://mu-lib.mit-license.org/
 */
define([ "jquery" ], function ($) {
	"use strict";

	/**
	 * Normalized hashchange event. Extends {@link jQuery} with:
	 *
	 * - {@link $#event-hashchange} event
	 *
	 *
	 * <div class="notice">
	 * Heavily influenced by <a href="https://github.com/millermedeiros/Hasher">Hasher</a>
	 * which is available under <a href="ttp://www.opensource.org/licenses/mit-license.php">MIT license</a>.
	 * </div>
	 *
	 * @class mu-lib.jquery.hashchange
	 * @static
	 * @alias plugin.jquery
	 */

	var INTERVAL = "interval";
	var HASHCHANGE = "hashchange";
	var ONHASHCHANGE = "on" + HASHCHANGE;
	var RE_HASH = /#(.*)$/;
	var RE_LOCAL = /\?/;

	// hack based on this: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	var _isIE = '\v' == 'v';

	function getHash(window) {
		// parsed full URL instead of getting location.hash because Firefox
		// decode hash value (and all the other browsers don't)
		// also because of IE8 bug with hash query in local file
		var result = RE_HASH.exec(window.location.href);

		return result && result[1]
			? decodeURIComponent(result[1])
			: "";
	}

	function Frame(document) {
		var me = this;
		var element;

		me.element = element = document.createElement("iframe");
		element.src = "about:blank";
		element.style.display = "none";
	}

	Frame.prototype = {
		"getElement" : function () {
			return this.element;
		},

		"getHash" : function () {
			return this.element.contentWindow.frameHash;
		},

		"update" : function (hash) {
			/*jshint evil:true*/
			var me = this;
			var document = me.element.contentWindow.document;

			// Quick return if hash has not changed
			if (me.getHash() === hash) {
				return;
			}

			// update iframe content to force new history record.
			// based on Really Simple History, SWFAddress and YUI.history.
			document.open();
			document.write("<html><head><title>' + document.title + '</title><script type='text/javascript'>var frameHash='" + hash + "';</script></head><body>&nbsp;</body></html>");
			document.close();
		}
	};

	/**
	 * @class $
	 */

	/**
	 * A special jQuery event fired ever when the URL hash has changed.
	 * @event hashchange
	 */
	$.event.special[HASHCHANGE] = {
		"setup" : function onHashChangeSetup() {
			var window = this;

			// Quick return if we support onHashChange natively
			// FF3.6+, IE8+, Chrome 5+, Safari 5+
			if (ONHASHCHANGE in window) {
				return false;
			}

			// Make sure we're always a window
			if (!$.isWindow(window)) {
				throw new Error("Unable to bind 'hashchange' to a non-window object");
			}

			var $window = $(window);
			var hash = getHash(window);
			var location = window.location;

			$window.data(INTERVAL, window.setInterval(_isIE
				? (function () {
					var document = window.document;
					var _isLocal = location.protocol === "file:";

					var frame = new Frame(document);
					document.body.appendChild(frame.getElement());
					frame.update(hash);

					return function () {
						var oldHash = hash;
						var newHash;
						var windowHash = getHash(window);
						var frameHash = frame.getHash();

						// Detect changes made pressing browser history buttons.
						// Workaround since history.back() and history.forward() doesn't
						// update hash value on IE6/7 but updates content of the iframe.
						if (frameHash !== hash && frameHash !== windowHash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(frameHash);

							if (hash !== newHash) {
								hash = newHash;
								frame.update(hash);
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}

							// Sync location.hash with frameHash
							location.hash = "#" + encodeURI(_isLocal
								? frameHash.replace(RE_LOCAL, "%3F")
								: frameHash);
						}
						// detect if hash changed (manually or using setHash)
						else if (windowHash !== hash) {
							// Fix IE8 while offline
							newHash = decodeURIComponent(windowHash);

							if (hash !== newHash) {
								hash = newHash;
								$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
							}
						}
					};
				})()
				: function () {
					var oldHash = hash;
					var newHash;
					var windowHash = getHash(window);

					if (windowHash !== hash) {
						// Fix IE8 while offline
						newHash = decodeURIComponent(windowHash);

						if (hash !== newHash) {
							hash = newHash;
							$window.trigger(HASHCHANGE, [ newHash, oldHash ]);
						}
					}
				}, 25));
		},

		"teardown" : function onHashChangeTeardown() {
			var window = this;

			// Quick return if we support onHashChange natively
			if (ONHASHCHANGE in window) {
				return false;
			}

			window.clearInterval($.data(window, INTERVAL));
		}
	};
});
