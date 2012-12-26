steal(function(){
	steal.client = {}
	steal.client.dataQueue = []
	var id=0;
	steal.client.trigger = function(type, data){
		// console.log('TYPE: '+type+", data: "+data)
		steal.client.dataQueue.push({
			// workaround
			id: ++id,
			type: type,
			data: data
		})
		if(type == "done"){
			steal.client.phantomexit = true;
		}
	}
	window.cb = function(resp){
          setTimeout(steal.client.sendData, 400);
          if(resp){
               var res = resp.fn();
               steal.client.trigger('evaluated', res);
          }
          if (steal.client.phantomexit) {
               // kills phantom process
               setTimeout(function(){
                    alert('phantomexit')
               }, 500)
          }
     };
    
     steal.client.sendData = function(){
          var q = steal.client.dataQueue;
          steal.client.dataQueue = [];
          var params = encodeURIComponent(JSON.stringify(q));
         
          steal.require({
               src : "http://localhost:5555?"+params+"&_="+Math.random(),
               type: "js"
          },function(){});
         
     }
	steal.client.evaluate = function(script, arg){
		eval("var fn = "+script);
		var res = fn(arg);
		return res;
	};
	setTimeout(steal.client.sendData, 1000);
})
