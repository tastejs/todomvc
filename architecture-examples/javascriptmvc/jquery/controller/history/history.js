steal.plugins('jquery/controller/subscribe',
	'jquery/event/hashchange',
	'jquery/lang/deparam').then(function($){

/**
 * @page jquery.controller.history History Events
 * @parent jQuery.Controller
 * @plugin jquery/controller/history
 * The jquery/controller/history plugin adds 
 * browser hash (#) based history support.
 * 
 * It allows you to listen to hashchange events with OpenAjax.hub.  
 * 
 * Typically you subscribe to a history event in your controllers:
 * 
 *     $.Controller("MyHistory",{
 *       "history.pagename subscribe" : function(called, data){
 *         //called when hash = #pagename
 *       }
 *     })
 * 
 * ## Event Names
 * 
 * When a history event happens, an OpenAjax message is produced that 
 * starts with "history.".  The remainder of the message name depends on the 
 * value of the "hash".  
 * 
 * The following shows hash values and 
 * the corresponding published message and data.
 * 
 *     "#foo=bar" -> "history.index" {foo: bar}
 *     "#foo/bar" -> "history.foo.bar" {}
 *     "#foo&bar=baz" -> "history.foo" {bar: baz}
 * 
 * Essentially, if the hash starts with something like #foo/bar, this gets
 * added to the message name as "foo.bar".  Once "&" is found, it adds the remainder
 * as name-value pairs to the message data.
 * 
 * ## Controller Helper Functions
 * 
 * The methods on the left are added to Controller.prototype and make it easier to 
 * make changes to history.
 * 
 */

var keyBreaker = /([^\[\]]+)|(\[\])/g;

$.Controller.History = {
	/**
	 * @hide
	 * returns the pathname part
	 * 
	 *     // if the url is "#foo/bar&foo=bar"
	 *     $.Controller.History.pathname() ->  'foo/bar'
	 * 
	 */
	pathname : function(path) {
		var parts =  path.match(/#([^&]*)/);
		return parts ? parts[1] : null
	},
	/**
	 * @hide
	 * returns the search part, but without the first &
	 * 
	 *     // if the url is "#foo/bar&foo=bar"
	 *     $.Controller.History.search() ->  'foo=bar'
	 */
	search : function(path) {
		var parts =  path.match(/#[^&]*&(.*)/);
		return parts ? parts[1] : null
	},
	/**
	 * @hide
	 * Returns the data
	 * @param {Object} path
	 */
	getData: function(path) {
		var search = $.Controller.History.search(path),
			digitTest = /^\d+$/;
		if(! search || ! search.match(/([^?#]*)(#.*)?$/) ) {
			return {};
		} 
	   
		// Support the legacy format that used MVC.Object.to_query_string that used %20 for
		// spaces and not the '+' sign;
		search = search.replace(/\+/g,"%20")
	    return $.String.deparam(search);
	}
};





jQuery(function($) {
	$(window).bind('hashchange',function() {
		var data = $.Controller.History.getData(location.href),
			folders = $.Controller.History.pathname(location.href) || 'index',
			hasSlash = (folders.indexOf('/') != -1);
		
		if( !hasSlash && folders != 'index' ) {
			folders += '/index';
		}
		
		OpenAjax.hub.publish("history."+folders.replace("/","."), data);
	});
	
	setTimeout(function(){
		$(window).trigger('hashchange')
	},1) //immediately after ready
})
/**
 * @add jQuery.Controller.prototype
 */
   
$.extend($.Controller.prototype, {
   /**
	* @parent jquery.controller.history
	* Redirects to another page.
	* @plugin 'dom/history'
	* @param {Object} options an object that will turned into a url like #controller/action&param1=value1
	*/
   redirectTo: function(options){
		var point = this._get_history_point(options);
		location.hash = point;
   },
   /**
	* @parent jquery.controller.history
	* Redirects to another page by replacing current URL with the given one.  This
	* call will not create a new entry in the history.
	* @plugin 'dom/history'
	* @param {Object} options an object that will turned into a url like #controller/action&param1=value1
	*/
   replaceWith: function(options){
		var point = this._get_history_point(options);
		location.replace(location.href.split('#')[0] + point);
   },
   /**
	* @parent jquery.controller.history
	* Adds history point to browser history.
	* @plugin 'dom/history'
	* @param {Object} options an object that will turned into a url like #controller/action&param1=value1
	* @param {Object} data extra data saved in history	-- NO LONGER SUPPORTED
	*/
   historyAdd : function(options, data) {
	   var point = this._get_history_point(options);
	  location.hash = point;
   },
   /**
	* @hide
	* @parent jquery.controller.history
	* Creates a history point from given options. Resultant history point is like #controller/action&param1=value1
	* @plugin 'dom/history'
	* @param {Object} options an object that will turned into history point
	*/
   _get_history_point: function(options) {
	   var controller_name = options.controller || this.Class.underscoreName;
	   var action_name = options.action || 'index';
	  
	   /* Convert the options to parameters (removing controller and action if needed) */
	   if(options.controller)
		   delete options.controller;
	   if(options.action)
		   delete options.action;
	   
	   var paramString = (options) ? $.param(options) : '';
	   if(paramString.length)
		   paramString = '&' + paramString;
	   
	   return '#' + controller_name + '/' + action_name + paramString;
   },

   /**
	* @parent jquery.controller.history
	* Provides current window.location parameters as object properties.
	* @plugin 'dom/history'
	*/
   pathData :function() {
	   return $.Controller.History.getData(location.href);
   }
});
		
	


   
});