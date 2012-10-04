var b = true;
if(b)
	i = 8
else 
	i = 9;
	
var stuff = {a: 1, b: 2, c: 3}
var a = [], i;
for(var i=0; i<5; i++){
	a.push(i)
}

// (function(){

module("srchr/tabs",{
	setup : function(){
		S.open('//srchr/tabs/tabs.html');
	}
});

test("Clicking twice doesn't break anything", function() {
	S("li:eq(2)").click();
	S("li:eq(2)").click();
	if(b){
		var i = 0;
	}
	S("li:eq(2)").click();
	S("li:eq(2)").click();
});

test("Proper hiding and showing", function() {
	S("li:eq(1)").click();
	S("div:eq(1)").visible(function() {
		equals(S("div:eq(0)").css('display'), 'none', "Old tab contents are hidden");
		ok(!S("li:eq(0)").hasClass('active'), 'Old tab is not set to active');
		equals(S("div:eq(1)").css('display'), 'block', "New tab contents are visible");
		ok(S("li:eq(1)").hasClass('active'), 'New tab is set to active');
	});
});

test("Clicking twice doesn't break anything", function() {
	S("li:eq(2)").click();
	S("li:eq(2)").click();

	S("div:eq(2)").visible(function() {
		equals(S("div:eq(2)").css('display'), 'block', "New tab contents are visible");
		ok(S("li:eq(2)").hasClass('active'), 'New tab is set to active');
	});
});

// })();
(function(){
	var f = function(){};
	//do support code
	(function() {})();
})()
