checkText = function( text, url ) {
	if (!text.match(/[^\s]/) ) {
		
		throw "$.View ERROR: There is no template or an empty template at " + url;
	}
};