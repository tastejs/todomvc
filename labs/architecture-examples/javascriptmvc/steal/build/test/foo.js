load('steal/rhino/env.js'); //reload every time
// open the url
Envjs("steal/build/test/foo.html", {
	scriptTypes: {
		"text/javascript": true,
		"text/envjs": true,
		"": true
	}
});
setTimeout(function(){
				print('yes');
				setTimeout(arguments.callee,1000)
			},1000);
Envjs.wait();
