steal.plugins('jquery/model/service').then(function(){
	
	$.Model.service.yql = $.Model.service({
		select : "*",
		from : "flickr.photos.search",
		convert : function (query, params) {
			$.each( params, function (key) {
					var name = new RegExp( "#\{" + key + "\}","g" );
					var value = $.trim(this);
					//if (!value.match(/^[0-9]+$/)) {
					//   value = '"' + value + '"';
					//}
					query = query.replace(name, value);
				}
			);
			return query;
		},
		/**
		 * 
		 * @param {Object} params
		 */
		findAll : function(params, success, error){
			 params = $.extend({}, this._service, params);
			 var query = ["SELECT",params.select,"FROM",params.from];
			 
			 
			 if(params.where){
			 	query.push("WHERE",typeof params.where == "string" || this._service.convert(params.where[0],params.where[1]))
			 }
			 var self = this;
			 
			 
			 var yqlJson = {
				url: "http://query.yahooapis.com/v1/public/yql",
				dataType: "jsonp",
				data: {
				     q: query.join(" "),
				     format: "json",
				     env: 'store://datatables.org/alltableswithkeys',
				     callback: "?"
				 }
	         }
	         if (error) {
	             yqlJson.error = error;
	         }
			 if(this.wrapMany){
			 	yqlJson.success = function (data) {
					var results = data.query.results
					if(results){
						for(var name in results){
							success(self.wrapMany(data.query.results[name]));
							break;
						}
					}else{
						success([]);
					}
			    }
			 }else{
			 	yqlJson.success = success;
			 }
	
	         $.ajax(yqlJson);
		}
	});
	
})