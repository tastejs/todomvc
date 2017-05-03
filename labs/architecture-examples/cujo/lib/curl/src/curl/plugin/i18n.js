/** MIT License (c) copyright B Cavalier & J Hann */

/**
 * curl i18n plugin
 *
 * Licensed under the MIT License at:
 * 		http://www.opensource.org/licenses/mit-license.php
 *
 */

(function (global) {

define(/*=='i18n',==*/ function () {

	function getLocale () {
		return (global.clientInformation || global.navigator).language;
	}

	return {
		load: function (absId, require, loaded, config) {
			//var locale = config.locale || getLocale();
			require([absId], loaded);
		}
	};

});

}());
