/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl style! plugin
 */

define([], function () {

	var nonRelUrlRe, findUrlRx, undef, doc, head;

	if (typeof window != 'undefined') {
		doc = window.document;
		head = doc.head || doc.getElementsByTagName('head')[0];
	}

	// tests for absolute urls and root-relative urls
	nonRelUrlRe = /^\/|^[^:]*:\/\//;
	// Note: this will fail if there are parentheses in the url
	findUrlRx = /url\s*\(['"]?([^'"\)]*)['"]?\)/g;

	function translateUrls (cssText, baseUrl) {
		return cssText.replace(findUrlRx, function (all, url) {
			return 'url("' + translateUrl(url, baseUrl) + '")';
		});
	}

	function translateUrl (url, parentPath) {
		// if this is a relative url
		if (!nonRelUrlRe.test(url)) {
			// append path onto it
			url = parentPath + url;
		}
		return url;
	}

	/***** style element functions *****/

	var currentStyle, callbacks = [];

	function createStyle (cssText, callback, errback) {

		try {
			clearTimeout(createStyle.debouncer);
			if (createStyle.accum) {
				createStyle.accum.push(cssText);
			}
			else {
				createStyle.accum = [cssText];
				currentStyle = doc.createStyleSheet ? doc.createStyleSheet() :
					head.appendChild(doc.createElement('style'));
			}

			callbacks.push({
				callback: callback,
				errback: errback,
				sheet: currentStyle
			});

			createStyle.debouncer = setTimeout(function () {
				var style, allCssText;

				try {
					style = currentStyle;
					currentStyle = undef;

					allCssText = createStyle.accum.join('\n');
					createStyle.accum = undef;

					// for safari which chokes on @charset "UTF-8";
					// TODO: see if Safari 5.x and up still complain
					allCssText = allCssText.replace(/.+charset[^;]+;/g, '');

					// IE 6-8 won't accept the W3C method for inserting css text
					'cssText' in style ? style.cssText = allCssText :
						style.appendChild(doc.createTextNode(allCssText));

					waitForDocumentComplete(notify);
				}
				catch (ex) {
					// just notify most recent errback. no need to spam
					errback(ex);
				}

			}, 0);

		}
		catch (ex) {
			errback(ex);
		}

	}

	function notify () {
		var list = callbacks;
		callbacks = [];
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].callback(list[i].sheet);
		}
	}

	/**
	 * Keep checking for the document readyState to be "complete" since
	 * Chrome doesn't apply the styles to the document until that time.
	 * If we return before readyState == 'complete', Chrome may not have
	 * applied the styles, yet.
	 * Chrome only.
	 * @private
	 * @param cb
	 */
	function waitForDocumentComplete (cb) {
		// this isn't exactly the same as domReady (when dom can be
		// manipulated). it's later (when styles are applied).
		// chrome needs this (and opera?)
		function complete () {
			if (isDocumentComplete()) {
				cb();
			}
			else {
				setTimeout(complete, 10);
			}
		}
		complete();
	}

	/**
	 * Returns true if the documents' readyState == 'complete' or the
	 * document doesn't implement readyState.
	 * Chrome only.
	 * @private
	 * @return {Boolean}
	 */
	function isDocumentComplete () {
		return !doc.readyState || doc.readyState == 'complete';
	}

	createStyle.load = function (absId, req, loaded, config) {
		// get css text
		req([absId], function (cssText) {
			// TODO: translate urls?
			createStyle(cssText, loaded, loaded.error);
		});
	};

	createStyle.translateUrls = translateUrls;

	return createStyle;
});
