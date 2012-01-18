steal.plugins('funcunit/qunit','jquery/controller/history').then(function($){
	
module("jquery/controller/history",{
	setup: function(){
		
	}
})

test("Basic getData",function(){
	
	var data = $.Controller.History.getData("#foo/bar&a=b");
	equals(data.a,"b")
	
	var data = $.Controller.History.getData("#foo/bar&a=b&c=d");
	equals(data.a,"b")
	equals(data.c,"d")
})
test("Nested getData",function(){
	
	var data = $.Controller.History.getData("#foo/bar&a[b]=1&a[c]=2");
	equals(data.a.b,1)
	equals(data.a.c,2)
	
	var data = $.Controller.History.getData("#foo/bar&a[]=1&a[]=2");
	equals(data.a[0],1)
	equals(data.a[1],2)
	
	var data = $.Controller.History.getData("#foo/bar&a[b][]=1&a[b][]=2");
	equals(data.a.b[0],1)
	equals(data.a.b[1],2)
	
	var data = $.Controller.History.getData("#foo/bar&a[0]=1&a[1]=2");
	equals(data.a[0],1)
	equals(data.a[1],2)
})

	
})
