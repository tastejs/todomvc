// tests loading multiple apps
steal('jquery')
	.then(function(){
		APP1 = true;
		setTimeout(function(){
			steal('//steal/test/multiple/app2')
		}, 1000)
	})