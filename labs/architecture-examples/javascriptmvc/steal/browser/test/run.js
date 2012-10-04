load('steal/rhino/rhino.js')

steal('steal/test/test.js', function(s) {
//	STEALPRINT = false;
	s.test.module("steal/browser")
	
	var browserTest = function(type){
			s.test.test(type, function(){
				load('steal/rhino/rhino.js')
				var path = "steal/browser/"+type;
				if(type == "selenium"){
					path = "funcunit/selenium"
				}
				steal(path, function(){
					var browser = new steal.browser[type]({
						print: true
					});
					browser
						.bind('myevent', function(data){
							s.test.equals(data.foo, 'bar', 'bind works')
							var result = this.evaluate(function(){
								return MyCo.foo;
							});
							s.test.equals(result, "bla", "execute works!");
						})
						.bind('triggered', function(data){
							s.test.ok(true, 'injectJS works');
						})
						.bind('done', function(){
							this.close();
						})
						.open('steal/browser/test/mypage.html')
					s.test.expect(3);
					s.test.clear();
				})
			})
		}, 
		// browsers = ["selenium", "phantomjs", "envjs"];
		browsers = ["phantomjs"]
		
	for(var i=0; i<browsers.length; i++){
		browserTest(browsers[i])
	}
	
})