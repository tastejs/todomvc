checkText = function( text, url ) {
	if (!text.match(/[^\s]/) ) {
		steal.dev.log("There is no template or an empty template at " + url)
		throw "$.View ERROR: There is no template or an empty template at " + url;
	}
};