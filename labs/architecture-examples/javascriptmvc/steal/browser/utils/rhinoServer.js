/**
 * Creates a simple server at port 5555 for receiving and sending events to/from a client
 * @param {Function} dataReceivedCb a function that is called when data is received
 */
steal.browser.server = function(dataReceivedCb){
	this.dataReceivedCb = dataReceivedCb;
	this.stopServer = false;
	var self = this;
	spawn(function(){
		self.executeLoop();
	})
}
steal.extend(steal.browser.server.prototype, {
	executeLoop: function(){
		this.serverSocket = new java.net.ServerSocket(5555);
		while (!this.stopServer) {
			var killed = false;
			try {
				var sock = this.serverSocket.accept();
			}catch(e){}
			if (!this.stopServer) {
				var copy = sock;
				sock = null;
				this.processRequest(copy);
			}
		}
		this.serverSocket.close();
	},
	/**
	 * Sends HTTP headers to the client. Then sends the given content to the given output stream.
	 * @param {String} content
	 * @param {Object} sock
	 */
	sendResponse: function(content, sock){
		var res = (content.length? "cb({'fn': function(){"+content+"}});": "cb()"),
			outstream = new java.io.DataOutputStream(sock.getOutputStream()),
			headers = "HTTP/1.1 200 OK\r\n"+
				"Server: Java HTTPServer\r\n"+
				"Content-Type: text/html\r\n"+
				"Content-Length: " + res.length + "\r\n"+
				"Connection: close\r\n\r\n";
//		print('RESPONSE: '+res)
		outstream.writeBytes(headers + res);
		outstream.close();
	},
	/**
	 * Kills the server.
	 */
	close: function(){
		this.serverSocket.close();
		this.stopServer = true;
	},
	/**
	 * Saves some JS to be sent to the client.  Only one script can be sent at a time, so this method 
	 * waits for any previous scripts to be sent before saving.
	 * @param {String} data the string to be sent to the client as the response
	 */
	sendJS: function(script){
		this.attr("script", script)
	},
	/**
	 * Takes a socket that was received, processes the response, sending the correct data to the 
	 * provided callback.  Also sends any data to the client.
	 * @param {Object} sock
	 */
	processRequest: function(sock){
		var self = this;
		spawn(function(){
			if (self.stopServer) {
				return;
			}
			
			var bufr = new java.io.BufferedReader(new java.io.InputStreamReader(sock.getInputStream())),
				getData = self.getRequestData(bufr);
			// spawn a new thread for this, because it might take forever
			spawn(function(){
				self.dataReceivedCb(getData);
			})
			var sending = self.attr("script") || "";
			self.sendResponse(sending, sock);
			bufr.close();
		})
	},
	// after this attribute is set, it cannot be reset until something reads it
	attr: function(name, value){
		if(typeof value === "undefined"){
			return this._attr(name);
		}
		var done = false;
		// save new script to be sent
		while (!done) {
			try {
				this._attr(name, value)
				done = true;
			} 
			catch (e) {
				// didn't set, try again
				done = false;
				java.lang.Thread.currentThread().sleep(300);
			}
		}
	},
	_attr: sync(function(name, value){
		var val = this[name];
		if (typeof value === "undefined") {
			delete this[name];
//			print('GET: ' + name + ", " + val)
			return val;
		}
		else {
			// it hasn't been read yet, 
//			print('SET: ' + name + ", " + this[name])
			if(typeof this[name] !== "undefined"){
				throw "not ready yet"
			}
			this[name] = value;
		}
	}),
	getRequestData: function(bufr){
		var done = false, 
			paramsMatch,
			params;
		
		while (!done) {
			try {
				var x = bufr.readLine();
				if (x.length() == 0) {
					done = true;
				}
				else {
					paramsMatch = x.match(/^GET.*\?(.*)&_=/);
					if(paramsMatch && paramsMatch.length > 1){
						params = paramsMatch[1];
					}
				}
			} 
			catch (e) {
				done = true;
			}
		}
		return params;
	}
});