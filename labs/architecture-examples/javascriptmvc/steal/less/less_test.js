steal('funcunit/qunit','steal/less').then('./less.less')
.then(function(){
	module("steal/less",{
		setup : function(){
			
		}
	})
	test("element has color", function(){
		document.getElementById('qunit-test-area').innerHTML = 
			"<div id='myElement'>FOO</div>";
			
		equals(document.getElementById("myElement").clientWidth,100, "Background COlor is red")
	})
})
