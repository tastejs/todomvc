/*
 * tipJS - OpenSource Javascript MVC Framework ver.1.20
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */
// configuring tipJS
tipJS.config({
	noCache:true,
	noCacheVersion:"1.0",
	noCacheAuto:false,
	noCacheParam:"tipJS",
	charSet:"utf-8",
	developmentHostList:[
		'localhost'
		,'127.0.0.1'
		,'tipjs.com'
		,'github.com'
	],
	commonLib:[
		"/todomvc/assets/base.js",
		"/todomvc/assets/jquery.min.js"
	],
	commonModel:[
	],
	commonView:[
	],
	applicationPath:{ // absolute path
		todoMVC : '/todomvc/labs/architecture-examples/tipJS/todoMVC'
	}
});

