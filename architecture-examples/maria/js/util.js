/*jshint strict: false */
/*global checkit */

checkit.isBlank = function (str) {
	return (/^\s*$/).test(str);
};

checkit.escapeHTML = function (str) {
	return String(str)
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
};

checkit.isEnterKeyCode = function (keyCode) {
	return keyCode === 13;
};

checkit.isEscapeKeyCode = function (keyCode) {
	return keyCode === 27;
};
