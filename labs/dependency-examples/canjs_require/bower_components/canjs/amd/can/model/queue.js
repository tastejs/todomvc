/*!
 * CanJS - 2.0.3
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 26 Nov 2013 18:21:22 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/model", "can/map/backup"], function(can){

	var cleanAttrs = function(changedAttrs, attrs){
			var newAttrs = can.extend(true, {}, attrs),
				attr, current, path;
			if(changedAttrs){
				// go through the attributes returned from the server
				// and remove those that were changed during the current
				// request batch
				for(var i = 0; i < changedAttrs.length; i++){
					current = newAttrs;
					path    = changedAttrs[i].split('.');
					while(path.length > 1){
						current = current && current[path.shift()];
					}
					current && delete current[path.shift()];
				}
			}
			return newAttrs;
		},
		queueRequests = function( success, error, method, callback) {
			this._changedAttrs = this._changedAttrs || [];

			var def          = new can.Deferred,
				self         = this,
				attrs        = this.attr(),
				queue        = this._requestQueue,
				changedAttrs = this._changedAttrs,
				reqFn, index;

			reqFn = (function(self, type, success, error){
				// Function that performs actual request
				return function(){
					// pass already serialized attributes because we want to 
					// save model in state it was when request was queued, not
					// when request is ran
					return self.constructor._makeRequest([self, attrs], type || (self.isNew() ? 'create' : 'update'), success, error, callback)
				}
			})(this, method, function(){
				// resolve deferred with results from the request
				def.resolveWith(self, arguments);
				// remove current deferred from the queue 
				queue.splice(0, 1);
				if(queue.length > 0){
					// replace queued wrapper function with deferred
					// returned from the makeRequest function so we 
					// can access it's `abort` function
					queue[0] = queue[0]();
				} else {
					// clean up changed attrs since there is no more requests in the queue
					changedAttrs.splice(0);
				}
				
			}, function(){
				// reject deferred with results from the request
				def.rejectWith(self, arguments);
				// since we failed remove all pending requests from the queue
				queue.splice(0);
				// clean up changed attrs since there is no more requests in the queue
				changedAttrs.splice(0);
			})

			// Add our fn to the queue
			index = queue.push(reqFn) - 1;

			// If there is only one request in the queue, run
			// it immediately.
			if(queue.length === 1){
				// replace queued wrapper function with deferred
				// returned from the makeRequest function so we 
				// can access it's `abort` function
				queue[0] = queue[0]();
			}

			def.abort = function(){
				var abort;
				// check if this request is running, if it's not
				// just remove it from the queue
				// 
				// also all subsequent requests should be removed too
				abort = queue[index].abort && queue[index].abort();
				// remove aborted request and any requests after it
				queue.splice(index);
				// if there is no more requests in the queue clean up
				// the changed attributes array
				if(queue.length === 0){
					changedAttrs.splice(0);
				}
				return abort;
			}
			// deferred will be resolved with original success and
			// error functions
			def.then(success, error);

			return def;
		},
		_changes  = can.Model.prototype._changes,
		destroyFn = can.Model.prototype.destroy,
		setupFn   = can.Model.prototype.setup;

	can.each(["created", "updated", "destroyed"], function(fn){
		var prototypeFn = can.Model.prototype[fn];

		can.Model.prototype[fn] = function(attrs){
			if(attrs && typeof attrs == 'object'){
				attrs = attrs.attr ? attrs.attr() : attrs;
				// Create backup of last good known state returned
				// from the server. This allows users to restore it
				// if API returns error
				this._backupStore = attrs;
				attrs = cleanAttrs(this._changedAttrs || [], attrs);
			}
			// call the original function with the cleaned up attributes
			prototypeFn.call(this, attrs);
		}
	})

	can.extend(can.Model.prototype, {
		setup: function(){
			setupFn.apply(this, arguments);
			this._requestQueue = new can.List;
		},
		_changes: function(ev, attr, how,newVal, oldVal){
			// record changes if there is a request running
			this._changedAttrs && this._changedAttrs.push(attr);
			_changes.apply(this, arguments);
		},
		hasQueuedRequests : function(){
			return this._requestQueue.attr('length') > 1;
		},
		// call queued save request
		save : function(){
			return queueRequests.apply(this, arguments);
		},
		destroy : function(success, error){
			if(this.isNew()){
				// if it's a new instance, call default destroy method
				return destroyFn.call(this, success, error);
			}
			return queueRequests.call(this, success, error, 'destroy', 'destroyed');
		}
	})

	return can;
});