'use strict';

exports.htmlEscape = string => string
	.replace(/&/g, '&amp;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;');

exports.htmlUnescape = htmlString => htmlString
	.replace(/&gt;/g, '>')
	.replace(/&lt;/g, '<')
	.replace(/&#0?39;/g, '\'')
	.replace(/&quot;/g, '"')
	.replace(/&amp;/g, '&');

exports.htmlEscapeTag = (strings, ...values) => {
	let output = strings[0];
	for (let i = 0; i < values.length; i++) {
		output = output + exports.htmlEscape(String(values[i])) + strings[i + 1];
	}

	return output;
};

exports.htmlUnescapeTag = (strings, ...values) => {
	let output = strings[0];
	for (let i = 0; i < values.length; i++) {
		output = output + exports.htmlUnescape(String(values[i])) + strings[i + 1];
	}

	return output;
};
