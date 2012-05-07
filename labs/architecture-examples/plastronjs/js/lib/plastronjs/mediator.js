//     (c) 2012 Rhys Brett-Bowen, Catch.com
//     goog.mvc may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/rhysbrettbowen/goog.mvc

goog.provide('mvc.Mediator');

goog.require('goog.array');
goog.require('goog.object');



/**
 * @constructor
 */
mvc.Mediator = function() {
  /** @private */
  this.available_ = {};
  /** @private */
  this.listeners_ = {};
};


/**
 * lets components know that a message can be fired by an object.
 *
 * @param {Object} obj to register.
 * @param {Array.<string>} messages that the object can broadcast.
 */
mvc.Mediator.prototype.register = function(obj, messages) {

  // each message we save the object reference in an array so we know it
  // can provide that message
  goog.array.forEach(messages, function(message) {
    this.available_[message] = this.available_[message] || [];
    goog.array.insert(this.available_[message], obj);

    // if we registered any listeners for a message that can now start we
    // fire it with the object
    if (this.available_[message].length == 1 && this.listeners_[message]) {
      goog.array.forEach(this.listeners_[message], function(listener) {
        if (listener.init)
          listener.init(obj);
      });
    }
  }, this);
};


/**
 * removes the object from the register for that message
 *
 * @param {Object} obj to unregister.
 * @param {Array.<string>=} opt_messages an array of message to unregister the
 * object from being able to broadcast, or undefined to unregister from all.
 */
mvc.Mediator.prototype.unregister = function(obj, opt_messages) {

  // remove the object from all available
  goog.object.forEach(this.available_, function(val, key) {

    // if it's not in the messages to remove then skip
    if (opt_messages && !goog.array.contains(opt_messages, key)) {
      return;
    }

    // remove and if the last to be removed from a message call dispose
    // methods for listening objects
    if (goog.array.remove(val, obj) && !val.length) {
      if (this.listeners_[key]) {
        goog.array.forEach(this.listeners_[key], function(listener) {
          if (listener.dispose)
            listener.dispose(obj);
        });
      }
      delete this.available_[key];
    }
  }, this);
};


/**
 * the message to listen for and the handler. Can either be a function to run
 * or an object of the type: {init:Function, fn:Function, dispose:Function}
 * which will run init when the message becomes available and dispose when
 * a message is no longer supported. Returns a uid that can be used with
 * off to remove the listener
 *
 * @param {string|Array.<string>} message (s) to listen to.
 * @param {Function|Object} fn to run on message or object of functions to run
 * that can include init, fn and dispose.
 * @param {Object=} opt_handler to use as 'this' for the function.
 * @return {?number} the id to pass to off method.
 */
mvc.Mediator.prototype.on = function(message, fn, opt_handler) {
  if (goog.isArrayLike(message)) {
    goog.array.forEach(/** @type {Array} */(message), function(mess) {
      this.on(mess, fn, opt_handler);
    }, this);
    return null;
  }
  this.listeners_[message] = this.listeners_[message] || [];
  if (!this.listeners_[message].length) {
    if (fn.init && this.available_[message]) {
      fn.init(this.available_[message][0]);
    }
  }
  if (goog.isFunction(fn)) {
    fn = {fn: fn};
  }
  fn.fn = goog.bind(fn.fn, opt_handler || this);
  goog.array.insert(this.listeners_[message],
      fn);
  return goog.getUid(fn);
};


/**
 * this will only run the function the first time the message is given
 *
 * @param {string} message to listen to.
 * @param {Function} handler the function to run on a message.
 * @return {number} the id to pass to off method.
 */
mvc.Mediator.prototype.once = function(message, handler) {
  var uid;
  var fn = goog.bind(function() {
    handler.apply(this, Array.prototype.slice.call(arguments, 0));
    this.off(uid);
  },this);
  uid = this.on(message, fn);
  return /** @type {number} */(uid);
};


/**
 * remove the listener by it's id
 *
 * @param {number} uid of the listener to turn off.
 */
mvc.Mediator.prototype.off = function(uid) {
  goog.object.forEach(this.listeners_, function(listener) {
    goog.array.removeIf(listener, function(el) {
      return goog.getUid(el) == uid;
    });
  });
};


/**
 * check to see if anyone is listening for a message
 *
 * @param {string} message the message to test.
 * @return {boolean} whether the message has at least one listener.
 */
mvc.Mediator.prototype.isListened = function(message) {
  return !!this.listeners_[message];
};


/**
 * broadcast the message to the listeners
 *
 * @param {string} message to broadcast.
 * @param {*=} opt_args arguments to pass to listener functions.
 */
mvc.Mediator.prototype.broadcast = function(message, opt_args) {
  if (!this.listeners_[message])
    return;
  goog.array.forEach(this.listeners_[message], function(listener) {
    if (goog.isFunction(listener)) {
      listener(opt_args);
    } else if (listener.fn) {
      listener.fn(opt_args);
    }
  });
};


/**
 * reset the mediator to it's original state
 */
mvc.Mediator.prototype.reset = function() {
  this.available_ = {};
  goog.object.forEach(this.listeners_, function(listener) {
    goog.array.forEach(listener, function(l) {
      if (l.dispose)
        l.dispose();
    });
  });
  this.listeners_ = {};
};
