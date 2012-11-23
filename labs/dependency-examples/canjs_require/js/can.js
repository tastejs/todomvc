/*
* CanJS - 1.1.2 (2012-11-23)
* http://canjs.us/
* Copyright (c) 2012 Bitovi
* Licensed MIT
*/
// This is a shorthand so you can `require(['can'], function(can) {})` with the CanJS default
// module combination: `can.Construct`, `can.Control`, `can.Model`, `can.EJS` and `can.route`
define(['can/util/library', 'can/control', 'can/model', 'can/view/ejs', 'can/route'], function (can) {
	return can;
});