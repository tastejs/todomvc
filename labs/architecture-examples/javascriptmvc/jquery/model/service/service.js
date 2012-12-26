steal('jquery/model').then(function(){
	var convert = function(method, func){
		
		return typeof method == 'function' ? function(){
			var old = this._service,
				ret;
			this._service = func;
			ret = method.apply(this, arguments);
			this._service = old;
			return ret;
		} : method
	}
	/**
	 * Creates a service
	 * @param {Object} defaults
	 * @param {Object} methods
	 */
	$.Model.service = function(properties){
		
		var func = function(newProps){
			return $.Model.service( $.extend({}, properties, newProps) );
		};
		
		for(var name in properties){
			func[name] = convert(properties[name], func)
		}
		
		return func;
	}
});
