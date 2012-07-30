steal('jquery').then(function(){

module("steal")

	var orig = steal.File( steal.root.path );
		src = function(src){
		return orig.join(src)
	},
	bId = function(id){
		return document.getElementById(id);
	};
	
	
	

// testing new steal API
	

test("packages", function(){
	same(packagesStolen,["0","1","2", "uses"],"defined works right")
})

test("steal one js", function(){
	// doesn't this imply the next ...
	steal.rootUrl("../../");
		 
	stop();
	
	steal("./files/steal.js", function(){
		start();
		equals(REQUIRED,"steal", "loaded the file")
	})
})

test("steal one function", function(){
	steal.rootUrl("../../")
		.cur("foo/bar.js");
	
	stop();
	steal(function(){
		start();
		ok(true, "function called")
	})
})
	
	
test("loading plugin from jmvcroot", function(){
	PLUGINLOADED = false;
	DEPENCENCYLOADED = false;
	stop();
	steal.rootUrl("../../").then('steal/test/files/plugin',function(){
		equals(PLUGINLOADED, true)
		equals(DEPENCENCYLOADED, true)
	start();
	})
})
	
// unless the path has nothing on it, it should add a .js to the end and load the literal file
test("not using extension", function(){
	REQUIRED = false;
	stop();
	steal.rootUrl("../../").then('./files/require',function(){
		equals(REQUIRED, true);
	start();
	})
})
	
test("loading file from jmvcroot", function(){
	REQUIRED = false;
	stop();
	steal.rootUrl("../../").then('steal/test/files/require.js',function(){
		equals(REQUIRED, true)
		start();
	})
})

test("loading two files", function(){
	ORDER = [];
	stop();
	steal.rootUrl("../../").then('./files/file1.js',function(){
		same(ORDER,[1,2,"then2","then1"])
		start();
	})
})

test("steal one file with different rootUrl", function(){
	// doesn't this imply the next ...
	steal.rootUrl("../");
	REQUIRED = undefined;
	stop();
	
	// still loading relative to the page
	steal("./files/steal.js", function(){
		start();
		equals(REQUIRED,"steal", "loaded the file")
	})
})

test("loading same file twice", function(){
	ORDER = [];
	stop();
	steal.rootUrl("../../").then('./files/duplicate.js', './files/duplicate.js',function(){
		same(ORDER,[1])
		start();
	})
})

test("loading same file twice with absolute paths", function(){
	ORDER = [];
	stop();
	steal.rootUrl("../../").then('./files/loadDuplicate.js').then('//steal/test/files/duplicate.js',function(){
		same(ORDER,[1])
		start();
	})
})


test("steal one file with different cur", function(){
	// doesn't this imply the next ...
	steal.rootUrl("../../")
		.cur("foo/bar.js");
	REQUIRED = undefined;
	stop();
	
	// still loading relative to the page
	steal("../steal/test/files/steal.js", function(){
		start();
		equals(REQUIRED,"steal", "loaded the file")
	})
});

test("parts", function(){
	
})

test("file domain", function() {
	equals(null, new steal.File("file://C:/Development").domain(), "problems from file")
	equals('something.com', new steal.File('http://something.com/asfdkl;a').domain(), "something.com is the correct http domain.")
	equals('127.0.0.1:3006', new steal.File('https://127.0.0.1:3006/asdf').domain(), "something.com is the correct https domain.")
})

test("file joinFrom", function() {
	var result;
	equals(
	steal.File('a/b.c').joinFrom('/d/e'), "/d/e/a/b.c", "/d/e/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('d/e');
	equals(result, "d/e/a/b.c", "d/e/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('d/e/');
	equals(result, "d/e/a/b.c", "d/e/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('http://abc.com');
	equals(result, "http://abc.com/a/b.c", "http://abc.com/a/b.c is correctly joined.");

	result = new steal.File('/a/b.c').joinFrom('http://abc.com');
	equals(result, "http://abc.com/a/b.c", "http://abc.com/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('http://abc.com/');
	equals(result, "http://abc.com/a/b.c", "http://abc.com/a/b.c is correctly joined.");

	result = new steal.File('/a/b.c').joinFrom('http://abc.com/');
	equals(result, "http://abc.com/a/b.c", "http://abc.com/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('../d/e');
	equals(result, "../d/e/a/b.c", "../d/e/a/b.c is correctly joined.");

	result = new steal.File('a/b.c').joinFrom('');
	equals(result, "a/b.c", "a/b.c is correctly joined.");

	result = new steal.File('/a/b.c').joinFrom('');
	equals(result, "/a/b.c", "/a/b.c is correctly joined.");
	
	
	result = new steal.File('../../up.js').joinFrom('cookbook/')
	equals(result, "../up.js", "up.js is correctly joined.")
})

test("dir", function() {
	equals("/a/b/c", new steal.File("/a/b/c/cookbook.html").dir(), "/a/b/c dir is correct.")
	equals("a/b/c", new steal.File("a/b/c/cookbook.html").dir(), "a/b/c dir is correct.")
	equals("../a/b/c", new steal.File("../a/b/c/cookbook.html").dir(), "../a/b/c dir is correct.")
	equals("http://127.0.0.1:3007", new steal.File("http://127.0.0.1:3007/cookbook.html").dir(), "http://127.0.0.1:3007 dir is correct.")
})

test("File.clean", function() {
	result = new steal.File('http://abc.com#action').clean();
	equals(result, "http://abc.com", "http://abc.com#action is correctly cleaned.");

	result = new steal.File('http://abc.com#action&q=param').clean();
	equals(result, "http://abc.com", "http://abc.com#action&q=param is correctly cleaned.");

	result = new steal.File('http://abc.com/#action&q=param').clean();
	equals(result, "http://abc.com/", "http://abc.com/#action&q=param is correctly cleaned.");

	result = new steal.File('a/b/#action&q=param').clean();
	equals(result, "a/b/", "a/b/#action&q=param is correctly cleaned.");

	result = new steal.File('a/b#action&q=param').clean();
	equals(result, "a/b", "a/b#action&q=param is correctly cleaned.");
})

test("File.protocol", function() {
	result = new steal.File('http://abc.com').protocol();
	equals(result, "http:", "http://abc.com protocol should be http:.");

	result = new steal.File('https://abc.com').protocol();
	equals(result, "https:", "https://abc.com protocol should be https:.");

	result = new steal.File('file://a/b/c').protocol();
	equals(result, "file:", "file://a/b/c protocol should be file:.");

	result = new steal.File('file:///a/b/c').protocol();
	equals(result, "file:", "file:///a/b/c protocol should be file:.");
})

test("File.join", function() {
	result = new steal.File("http://abc.com").join("/a/b/c");
	equals(result, "http://abc.com/a/b/c", "http://abc.com/a/b/c was joined successfuly.");

	result = new steal.File("http://abc.com/").join("/a/b/c");
	equals(result, "http://abc.com/a/b/c", "http://abc.com/a/b/c was joined successfuly.");

	result = new steal.File("http://abc.com/").join("a/b/c");
	equals(result, "http://abc.com/a/b/c", "http://abc.com/a/b/c was joined successfuly.");

	result = new steal.File("http://abc.com").join("a/b/c");
	equals(result, "http://abc.com/a/b/c", "http://abc.com/a/b/c was joined successfuly.");

	result = new steal.File("a/b/c").join("d/e");
	equals(result, "a/b/c/d/e", "a/b/c/d/e was joined successfuly.");

	result = new steal.File("a/b/c/").join("d/e");
	equals(result, "a/b/c/d/e", "a/b/c/d/e was joined successfuly.");

	result = new steal.File("a/b/c/").join("/d/e");
	equals(result, "/d/e", "/d/e was joined successfuly.");

	result = new steal.File("a/b/c").join("/d/e");
	equals(result, "/d/e", "/d/e was joined successfuly.");
});



test("File.relative", function() {
	result = new steal.File("a/b/c").relative();
	ok(result, "a/b/c is relative.")

	result = new steal.File("/a/b/c").relative();
	ok(!result, "/a/b/c is NOT relative.")
})

test("File.isLocalAbsolute", function() {
	result = new steal.File("/a/b/c").isLocalAbsolute();
	ok(result, "/a/b/c is absolute.")

	result = new steal.File("a/b/c").isLocalAbsolute();
	ok(!result, "a/b/c is NOT absolute.")
})

test("File.isDomainAbsolute()", function() {
	var result = new steal.File("http://abc.com/d/e").protocol();
	ok(result, "http://abc.com/d/e domain is absolute.")

	result = new steal.File("http://abc.com/d/e/").protocol();
	ok(result, "http://abc.com/d/e/ domain is absolute.")

	result = new steal.File("https://abc.com/d/e").protocol();
	ok(result, "https://abc.com/d/e domain is absolute.")

	result = new steal.File("https://abc.com/d/e/").protocol();
	ok(result, "https://abc.com/d/e/ domain is absolute.")

	result = new steal.File("file://a/b/c/d/e").protocol();
	ok(result, "file://a/b/c/d/e domain is absolute.")

	result = new steal.File("file://a/b/c/d/e/").protocol();
	ok(result, "file://a/b/c/d/e/ domain is absolute.")

	result = new steal.File("file:///a/b/c/d/e").protocol();
	ok(result, "file:///a/b/c/d/e domain is absolute.");

	result = new steal.File("/a/b/c/d/e").protocol();
	ok(!result, "/a/b/c/d/e domain is absolute.");
})

// this function was moved to steal/rhino/file.js
// test("File.afterDomain", function() {
	// result = new steal.File("http://abc.com/d/e").afterDomain();
	// equals(result, "/d/e", "/d/e is the correct after domain result.");
// })

test("File.toReferenceFromSameDomain()", function() {
	result = new steal.File("http://abc.com/d/e").toReferenceFromSameDomain("http://abc.com/d/e/f/g/h");
	equals(result, "../../../", "../../../ is the correct reference from same domain result.");

	result = new steal.File("http://abc.com/d/e/x/y").toReferenceFromSameDomain("http://abc.com/d/e/f/g/h");
	equals(result, "../../../x/y", "../../../x/y is the correct reference from same domain result.");

	result = new steal.File("a/b/c/x/y").toReferenceFromSameDomain("a/b/c/d/e");
	equals(result, "../../x/y", "../../x/y is the correct reference from same domain result.");

	result = new steal.File("a/b/c/d/e").toReferenceFromSameDomain("a/b/c/d/e");
	equals(result, "", "'' is the correct reference from same domain result.");
})

test("File.normalize", function() {
	steal.File.cur("/a/b/");
	result = new steal.File("./c/d").normalize();
	equals(result, "/a/b/c/d", "/a/b/c/d was normalized successfuly.");

	steal.File.cur("/a/b/c");
	result = new steal.File("//d/e").normalize();
	equals(result, "d/e", "d/e was normalized successfuly.");

	steal.File.cur("/a/b/c");
	result = new steal.File("/d/e").normalize();
	equals(result, "/d/e", "/d/e was normalized successfuly.");

	steal.File.cur("http://abc.com");
	result = new steal.File("./d/e").normalize();
	equals(result, "http://abc.com/d/e", "http://abc.com/d/e was normalized successfuly.");

	steal.File.cur("http://abc.com");
	result = new steal.File("/d/e").normalize();
	equals(result, "http://abc.com/d/e", "http://abc.com/d/e was normalized successfuly.");
});

test("File.ext", function(){
	equals("", steal.File("").ext())
	equals("", steal.File("asdfas.asfa/safda").ext())
	equals("com", steal.File("asdfas.asfa/safda.com").ext())
})

	test("rootSrc", function(){
		steal.rootUrl("../abc/");
		equals( steal.File.cur().path , "../../qunit.html", "cur changed right");
		
	})

	test("request async", function(){
		stop();
		var count = 0;
		steal.request({
			src : src('steal/test/files/something.txt?' + Math.random())  // add random to force IE to behave
		}, function(txt){
			equals(txt,  "Hello World", "world is hello")
			start();
			count++;
		})
		if(!/file/.test(location.protocol))
			equals(count, 0);
	});
	
	test("request async error", function(){
		stop();
		var count = 0;
		steal.request({
			src : src('steal/test/files/a.txt')
		}, function(txt){
			ok(false,  "I should not be here")
			start();
			count++;
		},function(){
			ok(true, "I got an error");
			start();
			count++;
		})
		if(!/file/.test(location.protocol))
			equals(count, 0);
	});
	
	test("request sync", function(){
		stop();
		var count = 0;
		steal.request({
			src : src('steal/test/files/something.txt'),
			async: false
		}, function(txt){
			equals(txt,  "Hello World", "world is hello")
			start();
			count++;
		})
		equals(count, 1);
	});
	
	
	
	test("require JS", function(){
		stop();
		steal.require({
			src : src('steal/test/files/require.js'),
			type: "js"
		}, function(){
			start();
			ok(REQUIRED, "loaded the file")
		})
	});
	
	test("require CSS", function(){
		stop();
		steal.require({
			src : src('steal/test/files/require.css'),
			type: "css"
		}, function(){
			setTimeout(function(){
				start();
				ok( bId('qunit-header').clientHeight > 65, "Client height changed to "+bId('qunit-header').clientHeight );
			},1000)
			
			
		})
	});
	
	test("require weirdType", function(){
		stop();
		
		steal.type("foo js", function(options, success, error){
			var parts = options.text.split(" ")
			options.text = parts[0]+"='"+parts[1]+"'";
			success();
		});
		
		steal.require({
			src : src('steal/test/files/require.foo'),
			type: "foo"
		}, function(){
			start();
			equals(REQUIRED,"FOO", "loaded the file")
			
		})
	});
			
	// this has to be done via a steal request instead of steal.require
	// because require won't add buildType.  Require just gets stuff
	// and that is how it should stay.
	test("buildType set", function(){
		stop();
		
		steal.rootUrl("../");
		
		steal.type("foo js", function(options, success, error){
			var parts = options.text.split(" ")
			options.text = parts[0]+"='"+parts[1]+"'";
			success();
			equals(options.buildType, "js", "build type set right");
			equals(options.type, "foo", "type set right");
		});

		steal('test/files/require.foo',function(){
			start();
		})
	});
	
	test("when", function(){
		//start  1.loaded 2.loaded -> 3.complete
		//in 3   2.loaded -> 4.complete
		//in 4   3.complete -> 5.complete
		//
		
		var count = 0,
			ob1 = {
				loaded : function(){},
				path: "ob1"
			},
			ob2 = {
				loaded : function(){},
				path: "ob2"
			},
			ob3 = {
				complete : function(){
					count++;
					steal.when(ob2,"loaded", ob4,"complete");
				},
				path: "ob3"
			},
			when = steal.when,
			ob4 = {
				complete : function(){
					count++;
					equals(count, 2, "complete called again")
					
					steal.when(ob3,"complete",ob5,"complete");
				},
				path: "ob4"
			},
			ob5 = {
				complete : function(){
					count++;
					equals(count,3, "complete called on another 'finished' complete");
					start();
				},
				path: "ob5"
			}
		
		stop();
		steal.when(ob1,"loaded", ob2,"loaded" ,ob3,"complete");
		ob1.loaded();
		ob2.loaded();
		
	});
	
	test("when Async", function(){
		var count = 0,
			ob1 = {
				loaded : function(){},
				path: "ob1"
			},
			ob2 = {
				loaded : function(){},
				path: "ob2"
			},
			ob3 = {
				complete : function(){
					count++;
					steal.when(ob2,"loaded", ob4,"complete");
				},
				path: "ob3"
			},
			when = steal.when,
			ob4 = {
				complete : function(){
					count++;
					equals(count, 2, "complete called again")
					
					steal.when(ob3,"complete",ob5,"complete");
				},
				path: "ob4"
			},
			ob5 = {
				complete : function(){
					count++;
					equals(count,3, "complete called on another 'finished' complete");
					start();
				},
				path: "ob5"
			};
			
		stop();
		steal.when(ob1,"loaded", ob2,"loaded" ,ob3,"complete");
		
		setTimeout(function(){
			ob1.loaded();
		},10)
		setTimeout(function(){
			ob2.loaded();
		},10)
		
	});
	
	test("when nothing is waiting", 1, function(){
		var ob = {
			complete : function(){
				ok(true, "run right away")
			}
		};
		
		steal.when(ob, "complete");
	});
	
	test("AOP normal", function(){
		var order = [],
			before = function(){
				order.push(1)
			},
			after = function(){
				order.push(2)
			};
		before = steal._before(before , function(){
			order.push(0)
		});
		after = steal._after(after , function(){
			order.push(3)
		})
		before();
		after();
		same(order, [0,1,2,3])
	})
	
	test("AOP adjust", function(){
		var order = [],
			before = function(arg){
				equal(arg,"Changed","modified original");
				order.push(1)
			},
			after = function(){
				order.push(2);
				return "OrigRet"
			};
		before = steal._before(before , function(arg){
			order.push(0);
			equal(arg,"Orig","retrieved original");
			return ["Changed"]
		}, true);
		after = steal._after(after , function(ret){
			order.push(3)
			equal(ret,"OrigRet","retrieved original");
			return "ChangedRet"
		}, true)
		before("Orig");
		var res = after();
		equal(res,"ChangedRet","updated return");
		same(order, [0,1,2,3])
	})
	
	// c should load whenever something its waiting on completes
	test("deadlocked whens", function(){
		expect(1)
		var a = {
				complete: function(){}
			},
			b = {
				complete: function(){}
			},
			c = {
				load: function(){
					ok(true, "didn't deadlock")
				}
			}
		
		steal.when(a, "complete", c, "load")
		steal.when(b, "complete", c, "load")
		b.complete();
	})
	
	test("getScriptOptions", function(){
		var script = document.createElement('script'),
			F = steal.File;
		script.src= "../../steal/steal.js?foo";
		var url = F(script.src).protocol() ?  F( F(script.src).dir() ).dir()+"/"  : "../../";
		
		var options = steal.getScriptOptions(script);
		
		equals(options.rootUrl, url,"root url is right");
		equals(options.startFile,"foo","app right");
		
		script.src = "../steal.js?bar.js";

		options = steal.getScriptOptions(script);
		
		url = F(script.src).protocol() ?   F( F(script.src).dir() ).dir()+"/" : "../../";
		
		equals(options.rootUrl, url,"root url is right");
		equals(options.startFile,"bar.js","app right");
		
	})

test("css", function(){
	document.getElementById("qunit-test-area").innerHTML = ("<div id='makeBlue'>Blue</div><div id='makeGreen'>Green</div>");
	equals(document.getElementById("makeBlue").clientWidth, 100, "relative in loaded");
	equals(document.getElementById("makeGreen").clientWidth, 50, "relative up loaded");
	
	// we'd have to check the imports.
	if(!document.createStyleSheet){
		var els = document.getElementsByTagName('link'),
		count = 0;
		for(var i =0; i< els.length; i++){
			if(els[i].href.indexOf('one.css') > -1){
				count++;
			}
		}
		equals(count, 1, "only one one.css loaded")
	}

})

test("loadtwice", function(){
	same(ORDERNUM,['func'])
});

// this was breaking in safari/chrome
test("ready", function(){
	stop()
	$(document).ready(function(){
		start()
		ok(true,'ready was called')
	})
	
});

})