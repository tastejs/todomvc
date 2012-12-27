steal('steal/browser', 'steal/browser/utils/rhinoServer.js', function(){
	var page,
		expectedId = 1;
	steal.browser.phantomjs = function(options){
		this.kill();
		steal.browser.call(this, options, 'phantomjs');
		this._startServer();
	}
	steal.extend(steal.browser.phantomjs, {
		defaults:  {
			
		}
	});
	steal.browser.phantomjs.prototype = new steal.browser();
	steal.extend(steal.browser.phantomjs.prototype, {
		_startServer: function(){
			this.server = new steal.browser.server(function(){
				self._processData.apply(self, arguments);
			})
			// used as a cache to make sure we only run events once
			this._evts = {}
			var self = this;
			self.evaluateResult = null;
			this.bind("evaluated", function(data){
				self.evaluateResult = data;
				self.attr("evaluateInProgress", false);
			})
		},
		open: function(page){
			page = this._getPageUrl(page);
			var verbose = this.options.print;
			this.launcher = spawn(function(){
				var cmd = "phantomjs steal/browser/phantomjs/launcher.js "+'"'+page+'"'+(verbose?  " -verbose": "");
				if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
					runCommand("cmd", "/C", cmd)
				}
				else {
					var command = cmd + " > selenium.log 2> selenium.log &";
					runCommand("sh", "-c", cmd);
				}
			})
			// block until we're done
			this.browserOpen = true;
			while(this.browserOpen) {
				java.lang.Thread.currentThread().sleep(1000);
			}
			return this;
		},
		// kill phantom and kill simple server
		close: function(){
			this.kill();
			this.server.close();
			this.browserOpen = false;
		},
		kill: function(){
			if (java.lang.System.getProperty("os.name").indexOf("Windows") != -1) {
				runCommand("cmd", "/C", 'taskkill /f /fi "Imagename eq phantomjs.exe" > NUL')
			} else { // mac
				runCommand("sh", "-c", "ps aux | awk '/phantomjs\\/launcher/ {print$2}' | xargs kill -9 &> /dev/null")
			}
		},
		_processData: function(data){
			var a = decodeURIComponent(data);
			// print("_processData0: "+a)
			var d = unescape(a);
			// print("_processData: "+d)
			eval("var res = "+d)
			// parse data into res
			for (var i = 0; i < res.length; i++) {
				evt = res[i];
				// server receives duplicate requests for an unknown reason
				// to work around this we check event ids to make sure we're not seeing a duplicate
				if(this._evts[evt.id]) continue;
				this._evts[evt.id] = true
				var self = this;
				(function(e){
					// spawn to avoid deadlock, but also enforce event ordering
					spawn(function(){
						var id = parseInt(e.id);
						while(id !== expectedId){
							java.lang.Thread.currentThread().sleep(100);
						}
						expectedId++;
						self.trigger(e.type, e.data);
					})
				})(evt)
			}
		},
		attr: function(name, value){
			var self = this;
			this.attrSynched = sync(function(){
				if(typeof value === "undefined")
					return self[name];
				else self[name] = value;
			});
			return this.attrSynched();
		},
		sendJS: function(script){
			// wait until previous finishes
			while(this.attr("evaluateInProgress")) {
				java.lang.Thread.currentThread().sleep(300);
			}
			this.server.sendJS(script);
		},
		// for now, only one arg, and it has to be a string
		evaluate: function(fn, arg){
			var evalText = fn.toString().replace(/\n|\r\n/g,""),
				scriptText = "return steal.client.evaluate('"+evalText+"', '"+arg+"');";
				
			this.sendJS(scriptText);
			this.attr("evaluateInProgress", true);
			// wait until the "evaluated" event has been triggered, return the result
			while(this.attr("evaluateInProgress")) {
				java.lang.Thread.currentThread().sleep(300);
			}
			return this.evaluateResult;
		},
		injectJS: function(file){
			var scriptText = readFile(file).replace(/\n|\r\n/g,"");
			this.sendJS(scriptText);
			this.attr("evaluateInProgress", true);
		}
	})
})