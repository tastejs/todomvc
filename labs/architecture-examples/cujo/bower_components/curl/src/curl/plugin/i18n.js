/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * curl i18n plugin
 *
 * Fetch the user's locale-specific i18n bundle (e.g. strings/en-us.js"),
 * any less-specific versions (e.g. "strings/en.js"), and a default i18n bundle
 * (e.g. "strings.js").  All of these files are optional, but at least one
 * is required or an error is propagated.
 *
 * If no locale-specific versions are found, use a default i18n bundle, if any.
 *
 * If multiple locale-specific versions are found, merge them such that
 * the more specific versions override properties in the less specific.
 *
 * Browsers follow the language specifiers in the Language-Tags feature of
 * RFC 5646: http://tools.ietf.org/html/rfc5646
 *
 * Example locales: "en", "en-US", "en-GB", "fr-FR", "kr", "cn", "cn-"
 *
 * These are lower-cased before being transformed into module ids.  This
 * plugin uses a simple algorithm to formulate file names from locales.
 * It's probably easier to show an example than to describe it.  Take a
 * look at the examples section for more information.  The algorithm may
 * also be overridden via the localToModuleId configuration option.
 *
 * Nomenclature (to clarify usages of "bundle" herein):
 *
 * i18n bundle: A collection of javascript variables in the form of a JSON or
 *   javascript object and exported via an AMD define (or CommonJS exports
 *   if you are using the cjsm11 shim).  These are typically strings, but
 *   can be just about anything language-specific or location-specific.
 *
 * AMD bundle: A concatenated set of AMD modules (or AMD-wrapped CommonJS
 *   modules) that can be loaded more efficiently than individual modules.
 *
 * Configuration options:
 *
 * locale {Boolean|String|Function} (default === false)
 *   If an explicit false value is provided, the plugin will not attempt
 *   to determine the browser's locale and will only use the default bundle.
 *   This is a great option for early development and when you want don't
 *   want this plugin to attempt to fetch (possibly unsupported) locales
 *   automatically in production.
 *   If an explicit true value is provided, the plugin will use the
 *   browser's clientInformation.language property (or fallback equivalent)
 *   to determine the locale and seek locale-specific i18n bundles.
 *   If this is a string, it is assumed to be an RFC 5646-compatible language
 *   specifier(s).  The plugin will seek the i18n bundles for this locale.
 *   This is an excellent option to test specific locales.
 *   This option could also specify a function that returns language specifiers.
 *   A module id is passed as the only parameter to this function.
 *
 * localeToModuleId {Function} a function that translates a locale string to a
 *   module id where an AMD-formatted string bundle may be found.  The default
 *   format is a module whose name is the locale located under the default
 *   (non-locale-specific) bundle.  For example, if the default bundle is
 *   "myview/strings.js", the en-us version will be "myview/strings/en-us.js".
 *   Parameters: moduleId {String}, locale {String}, returns {String}
 *
 * During a build, locale-specific i18n bundles are not merged into a single
 * bundle. For instance, if you specify that the bundles for "en" and "en-us"
 * should be built into your AMD bundle, two separate bundles will be included.
 * These will be merged at run-time.  This method optimizes the size of the
 * AMD bundle.  In the future, we may add an option to pre-merge the i18n
 * bundles, which could provide a small performance benefit under some
 * circumstances.
 *
 * @examples
 *
 * `var strings = require("i18n!myapp/myview/strings");`
 *
 * If the current user's locale is "en-US", this plugin will simultaneously
 * seek the following modules:
 *   * "myapp/myview/strings.js"
 *   * "myapp/myview/strings/en.js"
 *   * "myapp/myview/strings/en-us.js"
 *
 * If none are found, an error is propagated.  If neither "en" or "en-us"
 * is found, "strings" is used.  If only "en" or "en-us" is found, it is used.
 * If both are found, "en-us" is used to override "en" and the merged result
 * is used.
 *
 * TODO: how to specify multiple locales be baked into AMD bundle (build time)?
 *
 */

(function (window) {

define(/*=='curl/plugin/i18n',==*/ function () {

	var appendLocaleRx;

	// finds the end and an optional .js extension since some devs may have
	// added it, which is legal since plugins sometimes require an extension.
	appendLocaleRx = /(\.js)?$/;

	return {

		load: function (absId, require, loaded, config) {
			var eb, toFile, locale, bundles, fetched, id, ids, specifiers, i;

			eb = loaded.error;

			if (!absId) {
				eb(new Error('blank i18n bundle id.'));
			}

			// resolve config options
			toFile = config['localeToModuleId'] || localeToModuleId;
			locale = !('locale' in config) || config['locale']; // default: true
			if (locale === true) locale = getLocale;
			if (typeof locale == 'function') locale = locale(absId);

			// keep track of what bundles we've found
			ids = [absId];
			bundles = [];
			fetched = 0;

			if (locale !== false) {
				// get variations / specificities

				// determine all the variations / specificities we might find
				ids = ids.concat(locale.toLowerCase().split('-'));
				specifiers = [];

				// correct. start loop at 1! default bundle was already fetched
				for (i = 1; i < ids.length; i++) {
					// add next part to specifiers
					specifiers[i - 1] = ids[i];
					// create bundle id
					id = toFile(absId, specifiers.join('-'));
					// fetch and save found bundles, while silently skipping
					// missing ones
					fetch(require, id, i, got, countdown);
				}
			}

			// get the default bundle, if any. this goes after we get
			// variations to ensure that ids.length is set correctly.
			fetch(require, absId, 0, got, countdown);

			function got (bundle, i) {
				bundles[i] = bundle;
				countdown();
			}

			function countdown () {
				var base;
				if (++fetched == ids.length) {
					if (bundles.length == 0) {
						eb(new Error('No i18n bundles found: "' + absId + '", locale "' + locale + '"'));
					}
					else {
						base = bundles[0] || {};
						for (i = 1; i < bundles.length; i++) {
							base = mixin(base, bundles[i]);
						}
						loaded(base);
					}
				}
			}

		},

		'cramPlugin': '../cram/i18n'

	};

	function fetch (require, id, i, cb, eb) {
		require([id], function (bundle) { cb(bundle, i); }, eb);
	}

	function mixin (base, props) {
		if (props) {
			for (var p in props) {
				base[p] = props[p];
			}
		}
		return base;
	}

	function getLocale () {
		var ci;
		if (!window) return false;
		ci = window['clientInformation'] || window.navigator;
		return ci.language || ci['userLanguage'];
	}

	function localeToModuleId (absId, locale) {
		return absId.replace(appendLocaleRx, locale ? '/' + locale  : '');
	}

});

}(typeof window != 'undefined' && window));
