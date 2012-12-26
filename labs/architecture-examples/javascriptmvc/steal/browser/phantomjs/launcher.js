(function(){
	var url = phantom.args[0],
		page = new WebPage(),
		verbose = phantom.args[1];
	if (verbose && verbose == "-verbose") {
		page.onConsoleMessage = function(msg){
			console.log(msg);
		};
	}
	page.onResourceRequested = function (req) {
//		console.log('Request ' + JSON.stringify(req, undefined, 4));
	};
	// TODO move this to console.log, make it crazier
	page.onAlert = function(msg){
		if(msg=="phantomexit"){
			phantom.exit()
		}
	};
	page.open(url)
})()