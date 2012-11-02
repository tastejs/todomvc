/*
 * tipJS - Javascript MVC Framework ver.1.21
 * 
 * Copyright 2012.07 SeungHyun PAEK
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * HomePage: http://www.tipjs.com
 * Contact: http://www.tipjs.com/contact
 */

tipJS.define({
	name:"todoMVC",
	noCache:true,
	noCacheVersion:"1.23",
	noCacheParam:"tipJS",
	noCacheAuto:false,
	controllers:[
		"init.js",
		"create.js",
		"toggleAll.js",
		"destroyCompleted.js",
		"toggle.js",
		"edit.js",
		"blurOnEnter.js",
		"update.js",
		"destroy.js"
	],
	models:[
		"bindAction.js",
		"globalTodos.js",
		"utils.js"
	],
	views:[
		"renderer.js"
	],
	onLoad:function(){
		tipJS.log("todoMVC.onLoad()");
		tipJS.action("todoMVC.init");
	}
});

