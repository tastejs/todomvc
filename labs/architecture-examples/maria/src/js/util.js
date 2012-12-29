checkit.isBlank = function(str) {
	return /^\s*$/.test(str);
};

checkit.escapeHTML = function(str) {
	return str.replace('&', '&amp;').replace('<', '&lt;');
};

checkit.isEnterKeyCode = function(keyCode) {
	return keyCode === 13;
};
