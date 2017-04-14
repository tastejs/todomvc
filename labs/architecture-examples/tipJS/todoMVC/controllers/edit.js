/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.controller({
	name : "todoMVC.edit",

	invoke : function( label ){
		tipJS.log(this.name);

		$(label).closest('li').addClass('editing').find('.edit').focus();
	}
});
