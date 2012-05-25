define(function() {

	return function generateId(item) {
		item.id = guidLike();
		return item;
	};

	// GUID-like generation, not actually a GUID, tho, from:
	// http://stackoverflow.com/questions/7940616/what-makes-this-pseudo-guid-generator-better-than-math-random
	function s4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	function guidLike() {
		return (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4());
	}

});