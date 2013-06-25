/* 
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  
  // usage
  
  // invoke cb.call(this) in 100ms, unless the job is re-registered,
  // which resets the timer
  // 
  // this.myJob = this.job(this.myJob, cb, 100)
  //
  // returns a job handle which can be used to re-register a job

  var Job = function(inContext) {
    this.context = inContext;
  };
  Job.prototype = {
    go: function(inCallback, inWait) {
      this.callback = inCallback;
      this.handle = setTimeout(function() {
        this.handle = null;
        inCallback.call(this.context);
      }.bind(this), inWait);
    },
    stop: function() {
      if (this.handle) {
        clearTimeout(this.handle);
        this.handle = null;
      }
    },
    complete: function() {
      if (this.handle) {
        this.stop();
        this.callback.call(this.context);
      }
    }
  };
  
  function job(inJob, inCallback, inWait) {
    var job = inJob || new Job(this);
    job.stop();
    job.go(inCallback, inWait);
    return job;
  }

  Polymer.job = job;
  
})();
