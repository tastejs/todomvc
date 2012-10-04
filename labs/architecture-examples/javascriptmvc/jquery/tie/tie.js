steal('jquery/controller').then(function($){

/**
 * @class jQuery.Tie
 * @core
 * 
 * The $.fn.tie plugin binds form elements and controllers with 
 * models and vice versa.  The result is that a change in 
 * a model will automatically update the form element or controller
 * AND a change event on the element will update the model.
 * 
 * 
 * 
 * 
 * 
 */
$.Controller("jQuery.Tie",{
	setup : function(el){
		this._super(el,{})
		return $.makeArray(arguments);
	},
	init : function(el, inst, attr, type){
		// if there's a controller
		if(!type){
			//find the first one that implements val
			var controllers = this.element.data("controllers") || {};
			for(var name in controllers){
				var controller = controllers[name];
				if(typeof controller.val == 'function'){
					type = name;
					break;
				}
			}
		}
		
		this.type = type;
		this.attr = attr;
		this.inst = inst;
		this.bind(inst, attr, "attrChanged");
		
		//destroy this controller if the model instance is destroyed
		this.bind(inst, "destroyed", "modelDestroyed");
		
		var value = inst.attr(attr);
		//set the value
		this.lastValue = value;
		if(type){
			
			//destroy this controller if the controller is destroyed
			this.bind(this.element.data("controllers")[type],"destroyed","destroy");
			this.element[type]("val",value);
			
		}else{
			this.element.val(value)
		}
	},
	attrChanged : function(inst, ev, val){
		if (val !== this.lastValue) {
			this.setVal(val);
			this.lastValue = val;
		}
	},
	modelDestroyed : function(){
		this.destroy()
	},
	setVal : function(val){
		if (this.type) {
			this.element[this.type]("val", val)
		}
		else {
			this.element.val(val)
		}
	},
	change : function(el, ev, val){
		if(!this.type && val === undefined){
			val = this.element.val();
		}
		
		this.inst.attr(this.attr, val, null, this.proxy('setBack'))
		
	},
	setBack : function(){
		this.setVal(this.lastValue);
	},
	destroy : function(){
		this.inst = null;
		if(! this._destroyed ){
			// assume it's because of the https://github.com/jupiterjs/jquerymx/pull/20
			// problem and don't throw an error
			this._super();
		}
		
	}
});


});