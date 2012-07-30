steal('jquery/dom/route','jquery/controller', function(){
	/**
	 * 
	 *     ":type route" //
	 * 
	 * @param {Object} el
	 * @param {Object} event
	 * @param {Object} selector
	 * @param {Object} cb
	 */
	jQuery.Controller.processors.route = function(el, event, selector, funcName, controller){
		$.route(selector||"")
		var batchNum;
		var check = function(ev, attr, how){
			if($.route.attr('route') === (selector||"") && 
			 (ev.batchNum === undefined || ev.batchNum !== batchNum ) ){
				
				batchNum = ev.batchNum;
				
				var d = $.route.attrs();
				delete d.route;
				
				controller[funcName](d)
			}
		}
		$.route.bind('change',check);
		return function(){
			$.route.unbind('change',check)
		}
	}
})
