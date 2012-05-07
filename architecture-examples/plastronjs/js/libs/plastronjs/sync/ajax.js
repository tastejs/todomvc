//     (c) 2012 Rhys Brett-Bowen, Catch.com
//     goog.mvc may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/rhysbrettbowen/goog.mvc

goog.provide('mvc.AjaxSync');

goog.require('goog.Uri.QueryData');
goog.require('goog.net.XhrManager');
goog.require('mvc.Sync');



/**
 * @constructor
 * @implements {mvc.Sync}
 * @param {Object|string|Function} url used to construct URLs.
 */
mvc.AjaxSync = function(url) {

  var baseFunction = function(model) {return '';};

  this.baseUrls_ = {
    create: baseFunction,
    read: baseFunction,
    update: baseFunction,
    del: baseFunction
  };

  if (goog.isString(url) || goog.isFunction(url)) {
    url = {
      create: url,
      read: url,
      update: url,
      del: url
    };
  }
  goog.object.extend(this.baseUrls_, goog.object.map(url, this.urlifyString));
  this.xhr_ = new goog.net.XhrManager();
  this.sendCount_ = 0;
};


/**
 * takes a string defining a url where :attribute will return that models
 * attribute. e.g.
 *
 * var obj = new mvc.Model({attrs:{'id': 'fred'}});
 * var urlGen = urlifyString("/object=:id/blah");
 * urlGen(obj); // returns "/object=fred/blah"
 *
 *
 * @param {string} val to be changed to a function.
 * @return {function(mvc.Model):string} function that gives URL.
 */
mvc.AjaxSync.prototype.urlifyString = function(val) {
  if (goog.isString(val)) {
    return function(model) {
      return val.replace(/:(\w+)/g,
          function(id) {
            return model.get(id.substring(1));
          });
    };
  }
  return /** @type {function(mvc.Model):string} */(val);
};


/**
 * @inheritDoc
 */
mvc.AjaxSync.prototype.create = function(model, opt_callback) {

  this.xhr_.send('' + (this.sendCount_++), this.baseUrls_.create(model),
      'POST', goog.Uri.QueryData.createFromMap(model.toJson()).toString(),
      undefined, undefined,
      goog.bind(this.onCreateComplete_, this, model,
          (opt_callback || goog.nullFunction)));
};


/**
 * @inheritDoc
 */
mvc.AjaxSync.prototype.read = function(model, opt_callback) {
  this.xhr_.send('' + (this.sendCount_++), this.baseUrls_.read(model),
      'GET', undefined, undefined, undefined,
      goog.bind(this.onReadComplete_, this, model,
          (opt_callback || goog.nullFunction)));
};


/**
 * @inheritDoc
 */
mvc.AjaxSync.prototype.update = function(model, opt_callback) {
  this.xhr_.send('' + (this.sendCount_++), this.baseUrls_.update(model),
      'PUT', goog.Uri.QueryData.createFromMap(model.toJson()).toString(),
      {'Content-Type' : 'application/x-www-form-urlencoded'}, undefined,
      goog.bind(this.onUpdateComplete_, this, model,
          (opt_callback || goog.nullFunction)));
};


/**
 * @inheritDoc
 */
mvc.AjaxSync.prototype.del = function(model, opt_callback) {
  this.xhr_.send('' + (this.sendCount_++), this.baseUrls_.del(model),
      'DELETE', undefined, undefined, undefined,
      goog.bind(this.onDelComplete_, this, model,
          (opt_callback || goog.nullFunction)));
};


/**
 * override this to do processing on returned data
 *
 * @private
 * @param {mvc.Model} model being processed.
 * @param {Function} callback to be called when done.
 * @param {goog.events.Event} e the completed xhr event.
 */
mvc.AjaxSync.prototype.onCreateComplete_ = function(model, callback, e) {
  var xhr = e.target;
  model.set('id', xhr.getResponseJson()['result']['id']);
};


/**
 * override this to do processing on returned data
 *
 * @private
 * @param {mvc.Model} model being processed.
 * @param {Function} callback to be called when done.
 * @param {goog.events.Event} e the completed xhr event.
 */
mvc.AjaxSync.prototype.onReadComplete_ = function(model, callback, e) {
  var xhr = e.target;
  var json = xhr.getResponseJson()['result'];
  model.set(json);
};


/**
 * override this to do processing on returned data
 *
 * @private
 * @param {mvc.Model} model being processed.
 * @param {Function} callback to be called when done.
 * @param {Event} e the completed xhr event.
 */
mvc.AjaxSync.prototype.onUpdateComplete_ = function(model, callback, e) {
};


/**
 * override this to do processing on returned data
 *
 * @private
 * @param {mvc.Model} model being processed.
 * @param {Function} callback to be called when done.
 * @param {Event} e the completed xhr event.
 */
mvc.AjaxSync.prototype.onDelComplete_ = function(model, callback, e) {
};
