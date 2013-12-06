/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["jquery", "can/util/library", "can/control"], function($, can) {
//used to determine if a control instance is one of controllers
//controllers can be strings or classes
var i, 
	isAControllerOf = function( instance, controllers ) {
		var name = instance.constructor.pluginName || instance.constructor._shortName;
		for ( i = 0; i < controllers.length; i++ ) {
			if ( typeof controllers[i] == 'string' ? name == controllers[i] : instance instanceof controllers[i] ) {
				return true;
			}
		}
		return false;
	},
	makeArray = can.makeArray,
	old = can.Control.setup;

/*
 * static
 */
can.Control.setup = function() {
	// if you didn't provide a name, or are control, don't do anything
	if ( this !== can.Control ) {

		/**
		 * @property {String} can.Control.plugin.static.pluginName pluginName
		 * @parent can.Control.plugin
		 *
		 * @description
		 *
		 * Allows you to define the name of the jQuery plugin.
		 *
		 * @body
		 *
		 * Setting the static `pluginName` property allows you to override the default name
		 * with your own.
		 *
		 *		var Filler = can.Control({
		 *		  pluginName: 'fillWith'
		 *		},{});
		 * 
		 *		$("#foo").fillWith();
		 *
		 * If you don't provide a `pluginName`, the control falls back to the
		 * [can.Construct.fullName fullName] attribute:
		 *
		 *		can.Control('Ui.Layout.FillWith', {}, {});
		 *		$("#foo").ui_layout_fill_with();
		 *
		 */
		var pluginName = this.pluginName || this._fullName;
			
		// create jQuery plugin
		if(pluginName !== 'can_control'){
			this.plugin(pluginName);
		}
			
		old.apply(this, arguments);
	}
};

/*
 * prototype
 */
$.fn.extend({

	/**
	 * @function jQuery.fn.controls jQuery.fn.controls
	 * @parent can.Control.plugin
	 * @description Get the Controls associated with elements.
	 * @signature `jQuery.fn.controls([type])`
	 * @param {String|can.Control} [control] The type of Controls to find.
	 * @return {can.Control} The controls associated with the given elements.
	 *
	 * @body 
	 * When the widget is initialized, the plugin control creates an array 
	 * of control instance(s) with the DOM element it was initialized on using 
	 * [can.data] method.
	 *
	 * The `controls` method allows you to get the control instance(s) for any element
	 * either by their type or pluginName.
	 *
	 *      var MyBox = can.Control({
	 *          pluginName : 'myBox'
	 *      }, {});
	 *
	 *      var MyClock = can.Control({
	 *          pluginName : 'myClock'
	 *      }, {});
	 *
	 *
	 *		//- Inits the widgets
	 *		$('.widgets:eq(0)').myBox();
	 *		$('.widgets:eq(1)').myClock();
	 *
	 *		$('.widgets').controls() //-> [ MyBox, MyClock ]
	 *	    $('.widgets').controls('myBox') // -> [MyBox]
	 *	    $('.widgets').controls(MyClock) // -> MyClock
	 *
	 */
	controls: function() {
		var controllerNames = makeArray(arguments),
			instances = [],
			controls, c, cname;
		//check if arguments
		this.each(function() {

			controls = can.$(this).data("controls");
			if(!controls){
				return;
			}
			for(var i=0; i<controls.length; i++){
				c = controls[i];
				if (!controllerNames.length || isAControllerOf(c, controllerNames) ) {
					instances.push(c);
				}
			}
		});
		return instances;
	},
	
	/**
	 * @function jQuery.fn.control jQuery.fn.control
	 * @parent can.Control.plugin
	 * @description Get the Control associated with elements.
	 * @signature `jQuery.fn.control([type])`
	 * @param {String|can.Control} [control] The type of Control to find.
	 * @return {can.Control} The first control found.
	 *
	 * @body
	 * This is the same as [jQuery.fn.controls $().controls] except that
	 * it only returns the first Control found.
	 *
	 *		//- Init MyBox widget
	 *		$('.widgets').my_box();
	 *
	 *		<div class="widgets my_box" />
	 *
	 *		$('.widgets').controls() //-> MyBox
	 */
	control: function( control ) {
		return this.controls.apply(this, arguments)[0];
	}
});

can.Control.plugin = function(pluginname){
	var control = this;

	if (!$.fn[pluginname]) {
		$.fn[pluginname] = function(options){
		
			var args = makeArray(arguments),   //if the arg is a method on this control
			isMethod = typeof options == "string" && $.isFunction(control.prototype[options]), meth = args[0],
			returns;
			this.each(function(){
				//check if created
				var plugin = can.$(this).control(control);
				
				if (plugin) {
					if (isMethod) {
						// call a method on the control with the remaining args
						returns = plugin[meth].apply(plugin, args.slice(1));
					}
					else {
						// call the plugin's update method
						plugin.update.apply(plugin, args);
					}
				}
				else {
					//create a new control instance
					control.newInstance.apply(control, [this].concat(args));
				}
			});
			return returns !== undefined ? returns : this;
		};
	}
}

/**
 * @function can.Control.plugin.prototype.update update
 * @parent can.Control.plugin
 * 
 * @description Reconfigure a control.
 * @signature `update(newOptions)`
 * @param {Object} newOptions Options to merge into the current options.
 * 
 * @body
 * Update extends [can.Control.prototype.options options] 
 * with the `options` argument and rebinds all events.  It 
 * re-configures the control.
 * 
 * For example, the following control wraps a recipe form. When the form
 * is submitted, it creates the recipe on the server.  When the recipe
 * is `created`, it resets the form with a new instance.
 * 
 *		var Creator = can.Control({
 *		  "{recipe} created" : function(){
 *		    this.update({recipe : new Recipe()});
 *		    this.element[0].reset();
 *		    this.element.find("[type=submit]").val("Create Recipe")
 *		  },
 *		  "submit" : function(el, ev){
 *		    ev.preventDefault();
 *		    var recipe = this.options.recipe;
 *			recipe.attrs( this.element.formParams() );
 *			this.element.find("[type=submit]").val("Saving...")
 *			recipe.save();
 *		  }
 *		});
 *
 *		$('#createRecipes').creator({ recipe : new Recipe() })
 * 
 * *Update* is called if a control's plugin helper is called with the plugin options on an element
 * that already has a control instance of the same type. If you want to implement your
 * own update method make sure to call the old one either using the [can.Construct.super super] plugin or
 * by calling `can.Control.prototype.update.apply(this, arguments);`.
 * For example, you can change the content of the control element every time the options change:
 * 
 *		var Plugin = can.Control({
 *		    pluginName: 'myPlugin'
 *		  }, {
 *		    init : function(el, options) {
 *			  this.updateCount = 0;
 *			  this.update({
 *			    text : 'Initialized'
 *			  });
 *			},
 *			update : function(options) {
 *			  // Call the can.Control update first.
 *			  // Use this._super when using can/construct/super
 *			  can.Control.prototype.update.call(this, options);
 *			  this.element.html(this.options.text + ' ' +
 *			    (++this.updateCount) + ' times');
 *			}
 *		});
 *
 *		$('#control').myPlugin();
 *		$('#control').html();
 *		// Initialized. Updated 1 times
 *
 *		$('#control').myPlugin({ text : 'Calling update. Updated' });
 *		$('#control').html();
 *		// Calling update. Updated 2 times
 *
 * @demo can/control/plugin/demo-update.html
 * 
 * @param {Object} options A list of options to merge with 
 * [can.Control.prototype.options this.options].  Often this method
 * is called by the [can.Control.plugin jQuery helper function].
 */
can.Control.prototype.update = function( options ) {
		can.extend(this.options, options);
		this.on();
};

return can;
});