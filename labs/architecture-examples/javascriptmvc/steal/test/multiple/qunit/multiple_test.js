module("multi")

test("multi", function() {
	stop();
	setTimeout(function(){
		start();
		ok(APP1, "app1 was loaded");
		ok(APP2, "app2 was loaded");
	}, 2000)
})
