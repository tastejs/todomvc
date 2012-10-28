/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.controller({
	name : "todoMVC.blurOnEnter",

	invoke : function( evt ){
		tipJS.log(this.name);

		if ( evt.keyCode === this.loadModel("globalTodos", true).ENTER_KEY ) {
			evt.target.blur();
		}
	}
});
