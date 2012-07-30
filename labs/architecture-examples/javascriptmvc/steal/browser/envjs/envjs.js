steal('steal/browser', function(){
	steal.browser.envjs = function(options){
		steal.browser.call(this, options, 'envjs')
		var self = this;
		Envjs.trigger = function(){
			self.trigger.apply(self, arguments);
		}
	}
	steal.extend(steal.browser.envjs, {
		defaults:  {
			scriptTypes: {
				"text/javascript": true,
				"text/envjs": true,
				"": true
			},
			logLevel: 2,
			dontPrintUserAgent: true
		} 
	});
	
	steal.browser.envjs.prototype = new steal.browser();
	steal.extend(steal.browser.envjs.prototype, {
		open: function(page){
			page = this._getPageUrl(page);
			this.curSteal = steal;
			Envjs(page, this.options);
			return this;
		},
		close: function(){
			// restore steal
			steal = this.curSteal;
		},
		evaluate: function(fn, arg){
			return fn(arg);
		},
		injectJS: function(file){
			load(file);
		}
	})
}, 'steal/rhino/env.js')