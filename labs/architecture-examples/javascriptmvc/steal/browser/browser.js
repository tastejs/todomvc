(function(){
	/**
	 * @class steal.browser
	 * @parent StealJS
	 * 
	 * `steal.browser` is an interface for browser drivers.  There is currently support for 
	 * envjs, phantomjs, and selenium.  Each driver implements an API that allows steal to:
	 * 
	 *   - [steal.browser.prototype.open open] - open a page
	 *   - [steal.browser.prototype.bind bind] - listen to events
	 *   - [steal.browser.prototype.trigger trigger] - send events
	 *   -
	 * 
	 * that includes open, bind, trigger, 
	 * evaluate, and injectJS.  There is also a small client component that is loaded by steal.js.
	 * 
	 * The initial bootstrap of steal.browser works like this:
	 * 1. steal.browser is used to open a page.  The page's URL is appended with 
	 * ?mode=commandline&browser=phantomjs (or whatever driver is being used).
	 * 2. On the client, steal.js does a check for these URL params.  If they're 
	 * found, steal loads steal/browser/phantomjs/client.js.  Client.js is a small file that implements
	 * methods used for evaluating code and triggering events.
	 * 3. Client.js loads jquery.js, runs $.holdReady(true) (to prevent the app from initializing), and 
	 * runs steal.client.trigger('clientloaded') (to notify the server that the browser's client.js has 
	 * loaded.
	 * 4. Now, the server can perform any startup logic it needs, like using injectJS to load files or 
	 * evaluating code.  Whenever its done, it runs this.evaluate(function(){ $.holdReady(false); }).
	 * 5. Document ready is fired on the client, and the application starts up.  Its important to note 
	 * that any app using steal.browser can't trigger browser events until after document.ready.  This is 
	 * required because the server needs to have a chance to load its own code and prevent race conditions.
	 * 
	 * @param {Object} options
	 */
	steal.browser = function(options, type){
		this.type = type;
		if (type) {
			options = options || {};
			// this uses dashes in place of slashes because safari decodeURIComponent doesn't work with slashes
			// its transformed back in steal.js
			this.clientPath = "steal/browser/"+this.type;
			for(var option in steal.browser[type].defaults){
				if(typeof options[option] === "undefined"){
					options[option] = steal.browser[type].defaults[option]
				}
			}
			this.options = options;
			print('starting steal.browser.' + this.type)
			this._events = {};
		}
	};
	
	// generic steal.browser API
	// each driver defines their own methods for these
	steal.extend(
	/**
	 * @prototype
	 */
	steal.browser.prototype, {
		/**
		 * Opens a page
		 * 
		 *     new steal.browser.phantom()
		 *         .open()
		 * 
		 * @param {String} url the url of the page.
		 */
		open: function(url){},
		/**
		 * Listen to 'steal' events.
		 * @param {Object} eventName
		 * @param {Object} fn
		 */
		bind: function(eventName, fn){
			this._events[eventName] = fn;
			return this;
		},
		/**
		 * Send a 'steal' event.
		 * @param {Object} eventName
		 * @param {Object} data
		 */
		trigger: function(eventName, data){
			var handler = this._events[eventName];
			handler && handler.call(this, data);
		},
		/**
		 * shut down server or just kill the browser instance
		 */
		close: function(){},
		/**
		 * Calls a function with the supplied arguments.
		 * 
		 *     
		 * 
		 * 
		 * @param {Function} fn A javascript function. It 
		 * @param {Array} args 
		 */
		evaluate : function(fn, args){},
		/**
		 * Loads a JavaScript file in a browser.
		 * @param {String} file
		 */
		injectJS: function(file){},
		// adds steal[browser]=phantomjs&steal[startFiles]=steal/browser/phantomjs/client.js
		// if there are already params, appends them, otherwise, adds params
		_appendParamsToUrl: function(url){
			// should be & separated, but but in phantomjs prevents that url from being read, so we use a comma
			var params = "steal[browser]=" + this.type + "&steal[startFiles]=" + this.clientPath+"/client.js", 
				searchMatch = url.match(/(\?[^\#]*)[\#]?/),
				hashMatch = url.match(/(\#.*)/),
				hrefMatch = url.match(/([^\#|\?]*)[\#|\?]?/);
			url = (hrefMatch? hrefMatch[1]: url)+
				(searchMatch? searchMatch[1]+"&"+params: "?"+params)+
				(hashMatch? hashMatch[1]: "");
			return url;
		},
		_getPageUrl: function(page){
			if(!/https?:|file:/.test(page)){ // if theres no protocol, turn it into a filesystem url
				var cwd = (new java.io.File (".")).getCanonicalPath();
				page = "file:///"+cwd+"/"+page;
				page = page.replace(/\\/g, "/")
			}
			
			//convert spaces to %20.
			var newPage = /https?:/.test(page) ? page: page.replace(/ /g,"%20");
			newPage = this._appendParamsToUrl(newPage);
			return newPage;
		}
	})
})()