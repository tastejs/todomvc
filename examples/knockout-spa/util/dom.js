define(['jquery', 'sugar'], function () {

	function getOriginFromLocation(location) {
		//IE Fix
		var port = location.port;
		if (((location.protocol == 'http:') && (port == '80')) ||
			((location.protocol == 'https:') && (port == '443'))) {
			port = '';
		}
		return (location.protocol ? (location.protocol + '//') : '') + (location.hostname || '') +
			(port ? (':' + port) : '');
	}

	if (!window.location.origin) {
		window.location.origin = getOriginFromLocation(window.location);
	}

	var Dom = {
		getOriginFromLocation: getOriginFromLocation,
		isTouchDevice: 'ontouchstart' in document.documentElement,
		keyCodes: {
			enter: 13,
			esc: 27,
			left: 37,
			right: 39,
			s: 83
		}
	};

	return Dom;

});
