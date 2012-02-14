steal.plugins('funcunit/qunit','jquery/lang/deparam').then(function(){
	
module('jquery/lang/deparam')

test("Basic deparam",function(){
	
	var data = $.String.deparam("a=b");
	equals(data.a,"b")
	
	var data = $.String.deparam("a=b&c=d");
	equals(data.a,"b")
	equals(data.c,"d")
})
test("Nested deparam",function(){
	
	var data = $.String.deparam("a[b]=1&a[c]=2");
	equals(data.a.b,1)
	equals(data.a.c,2)
	
	var data = $.String.deparam("a[]=1&a[]=2");
	equals(data.a[0],1)
	equals(data.a[1],2)
	
	var data = $.String.deparam("a[b][]=1&a[b][]=2");
	equals(data.a.b[0],1)
	equals(data.a.b[1],2)
	
	var data = $.String.deparam("a[0]=1&a[1]=2");
	equals(data.a[0],1)
	equals(data.a[1],2)
})
	
})
