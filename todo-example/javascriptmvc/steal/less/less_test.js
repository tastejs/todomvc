steal.plugins('funcunit/qunit','steal/less').then(
function(){
	steal.less('less')
},
function(){
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
