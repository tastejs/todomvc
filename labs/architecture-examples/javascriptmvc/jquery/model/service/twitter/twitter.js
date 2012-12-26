steal('jquery/model/service').then(function(){
	
	$.Model.service.twitter = $.Model.service({
		url : "http://api.twitter.com/1/",
		select : "*",
		from : "statuses/user_timeline.json",
		where : {screen_name : "javascriptmvc"},
		/**
		 * 
		 * @param {Object} params
		 */
		findAll : function(params, success, error){
			 
			 
			 var url = (params.url || this._service.url)+(params.from || this._service.from),
			 	self = this;
			 
			 var twitterJson = {
				url: url,
				dataType: "jsonp",
				data: params.where || this._service.where,
				error : error
	         }

			 if(this.wrapMany){
			 	twitterJson.success = function (data) {
					if(data.results){
						data = data.results
					}
		    		success(self.wrapMany(data))
			    	
			    }
			 }else{
			 	twitterJson.success = success;
			 }
			 
	         $.ajax(twitterJson);
		}
	});
	
})


