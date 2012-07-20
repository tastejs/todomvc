module("functional tests");

test("JSONP before steal", function(){
	S.open("//steal/test/jsonptest/breaking.html")
	S("#out").text("works", 500)
});