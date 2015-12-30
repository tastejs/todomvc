/*!!
 * Hasher <http://github.com/millermedeiros/hasher>
 * @author Miller Medeiros
 * @version 1.2.0 (2013/11/11 03:18 PM)
 * Released under the MIT License
 */

;(function () {
	var factory = function(signals){

		/*jshint white:false*/
		/*global signals:false, window:false*/

		/**
		 * Hasher
		 * @namespace History Manager for rich-media applications.
		 * @name hasher
		 */
		var hasher = (function(window){

			//--------------------------------------------------------------------------------------
			// Private Vars
			//--------------------------------------------------------------------------------------

			var

			// frequency that it will check hash value on IE 6-7 since it doesn't
			// support the hashchange event
				POOL_INTERVAL = 25,

			// local storage for brevity and better compression --------------------------------

				document = window.document,
				history = window.history,
				Signal = signals.Signal,

			// local vars ----------------------------------------------------------------------

				hasher,
				_hash,
				_checkInterval,
				_isActive,
				_frame, //iframe used for legacy IE (6-7)
				_checkHistory,
				_hashValRegexp = /#(.*)$/,
				_baseUrlRegexp = /(\?.*)|(\#.*)/,
				_hashRegexp = /^\#/,

			// sniffing/feature detection -------------------------------------------------------

			//hack based on this: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
				_isIE = (!+"\v1"),
			// hashchange is supported by FF3.6+, IE8+, Chrome 5+, Safari 5+ but
			// feature detection fails on IE compatibility mode, so we need to
			// check documentMode
				_isHashChangeSupported = ('onhashchange' in window) && document.documentMode !== 7,
			//check if is IE6-7 since hash change is only supported on IE8+ and
			//changing hash value on IE6-7 doesn't generate history record.
				_isLegacyIE = _isIE && !_isHashChangeSupported,
				_isLocal = (location.protocol === 'file:');


			//--------------------------------------------------------------------------------------
			// Private Methods
			//--------------------------------------------------------------------------------------

			function _escapeRegExp(str){
				return String(str || '').replace(/\W/g, "\\$&");
			}

			function _trimHash(hash){
				if (!hash) return '';
				var regexp = new RegExp('^' + _escapeRegExp(hasher.prependHash) + '|' + _escapeRegExp(hasher.appendHash) + '$', 'g');
				return hash.replace(regexp, '');
			}

			function _getWindowHash(){
				//parsed full URL instead of getting window.location.hash because Firefox decode hash value (and all the other browsers don't)
				//also because of IE8 bug with hash query in local file [issue #6]
				var result = _hashValRegexp.exec( hasher.getURL() );
				var path = (result && result[1]) || '';
				try {
					return hasher.raw? path : decodeURIComponent(path);
				} catch (e) {
					// in case user did not set `hasher.raw` and decodeURIComponent
					// throws an error (see #57)
					return path;
				}
			}

			function _getFrameHash(){
				return (_frame)? _frame.contentWindow.frameHash : null;
			}

			function _createFrame(){
				_frame = document.createElement('iframe');
				_frame.src = 'about:blank';
				_frame.style.display = 'none';
				document.body.appendChild(_frame);
			}

			function _updateFrame(){
				if(_frame && _hash !== _getFrameHash()){
					var frameDoc = _frame.contentWindow.document;
					frameDoc.open();
					//update iframe content to force new history record.
					//based on Really Simple History, SWFAddress and YUI.history.
					frameDoc.write('<html><head><title>' + document.title + '</title><script type="text/javascript">var frameHash="' + _hash + '";</script></head><body>&nbsp;</body></html>');
					frameDoc.close();
				}
			}

			function _registerChange(newHash, isReplace){
				if(_hash !== newHash){
					var oldHash = _hash;
					_hash = newHash; //should come before event dispatch to make sure user can get proper value inside event handler
					if(_isLegacyIE){
						if(!isReplace){
							_updateFrame();
						} else {
							_frame.contentWindow.frameHash = newHash;
						}
					}
					// ##### BEGIN: MODIFIED BY SAP
					return function () {
						hasher.changed.dispatch(_trimHash(newHash), _trimHash(oldHash));
					};
					// ##### END: MODIFIED BY SAP
				}
			}

			if (_isLegacyIE) {
				/**
				 * @private
				 */
				_checkHistory = function(){
					var windowHash = _getWindowHash(),
						frameHash = _getFrameHash(),
					// ##### BEGIN: MODIFIED BY SAP
						dispatchFunction;
					// ##### END: MODIFIED BY SAP

					if(frameHash !== _hash && frameHash !== windowHash){
						//detect changes made pressing browser history buttons.
						//Workaround since history.back() and history.forward() doesn't
						//update hash value on IE6/7 but updates content of the iframe.
						//needs to trim hash since value stored already have
						//prependHash + appendHash for fast check.
						hasher.setHash(_trimHash(frameHash));
					} else if (windowHash !== _hash){
						//detect if hash changed (manually or using setHash)
						// ##### BEGIN: MODIFIED BY SAP
						dispatchFunction = _registerChange(windowHash);
						dispatchFunction && dispatchFunction();
						// ##### END: MODIFIED BY SAP
					}
				};
			} else {
				/**
				 * @private
				 */
				_checkHistory = function(){
					var windowHash = _getWindowHash(),
						dispatchFunction;
					if(windowHash !== _hash){
						// ##### BEGIN: MODIFIED BY SAP
						dispatchFunction = _registerChange(windowHash);
						dispatchFunction && dispatchFunction();
						// ##### END: MODIFIED BY SAP
					}
				};
			}

			function _addListener(elm, eType, fn){
				if(elm.addEventListener){
					elm.addEventListener(eType, fn, false);
				} else if (elm.attachEvent){
					elm.attachEvent('on' + eType, fn);
				}
			}

			function _removeListener(elm, eType, fn){
				if(elm.removeEventListener){
					elm.removeEventListener(eType, fn, false);
				} else if (elm.detachEvent){
					elm.detachEvent('on' + eType, fn);
				}
			}

			function _makePath(paths){
				paths = Array.prototype.slice.call(arguments);

				var path = paths.join(hasher.separator);
				path = path? hasher.prependHash + path.replace(_hashRegexp, '') + hasher.appendHash : path;
				return path;
			}

			function _encodePath(path){
				//used encodeURI instead of encodeURIComponent to preserve '?', '/',
				//'#'. Fixes Safari bug [issue #8]
				path = encodeURI(path);
				if(_isIE && _isLocal){
					//fix IE8 local file bug [issue #6]
					path = path.replace(/\?/, '%3F');
				}
				return path;
			}

			//--------------------------------------------------------------------------------------
			// Public (API)
			//--------------------------------------------------------------------------------------

			hasher = /** @lends hasher */ {

				/**
				 * hasher Version Number
				 * @type string
				 * @constant
				 */
				VERSION : '1.2.0',

				/**
				 * Boolean deciding if hasher encodes/decodes the hash or not.
				 * <ul>
				 * <li>default value: false;</li>
				 * </ul>
				 * @type boolean
				 */
				raw : false,

				/**
				 * String that should always be added to the end of Hash value.
				 * <ul>
				 * <li>default value: '';</li>
				 * <li>will be automatically removed from `hasher.getHash()`</li>
				 * <li>avoid conflicts with elements that contain ID equal to hash value;</li>
				 * </ul>
				 * @type string
				 */
				appendHash : '',

				/**
				 * String that should always be added to the beginning of Hash value.
				 * <ul>
				 * <li>default value: '/';</li>
				 * <li>will be automatically removed from `hasher.getHash()`</li>
				 * <li>avoid conflicts with elements that contain ID equal to hash value;</li>
				 * </ul>
				 * @type string
				 */
				prependHash : '/',

				/**
				 * String used to split hash paths; used by `hasher.getHashAsArray()` to split paths.
				 * <ul>
				 * <li>default value: '/';</li>
				 * </ul>
				 * @type string
				 */
				separator : '/',

				/**
				 * Signal dispatched when hash value changes.
				 * - pass current hash as 1st parameter to listeners and previous hash value as 2nd parameter.
				 * @type signals.Signal
				 */
				changed : new Signal(),

				/**
				 * Signal dispatched when hasher is stopped.
				 * -  pass current hash as first parameter to listeners
				 * @type signals.Signal
				 */
				stopped : new Signal(),

				/**
				 * Signal dispatched when hasher is initialized.
				 * - pass current hash as first parameter to listeners.
				 * @type signals.Signal
				 */
				initialized : new Signal(),

				/**
				 * Start listening/dispatching changes in the hash/history.
				 * <ul>
				 *   <li>hasher won't dispatch CHANGE events by manually typing a new value or pressing the back/forward buttons before calling this method.</li>
				 * </ul>
				 */
				init : function(){
					if(_isActive) return;

					_hash = _getWindowHash();

					//thought about branching/overloading hasher.init() to avoid checking multiple times but
					//don't think worth doing it since it probably won't be called multiple times.
					if(_isHashChangeSupported){
						_addListener(window, 'hashchange', _checkHistory);
					}else {
						if(_isLegacyIE){
							if(! _frame){
								_createFrame();
							}
							_updateFrame();
						}
						_checkInterval = setInterval(_checkHistory, POOL_INTERVAL);
					}

					_isActive = true;
					hasher.initialized.dispatch(_trimHash(_hash));
				},

				/**
				 * Stop listening/dispatching changes in the hash/history.
				 * <ul>
				 *   <li>hasher won't dispatch CHANGE events by manually typing a new value or pressing the back/forward buttons after calling this method, unless you call hasher.init() again.</li>
				 *   <li>hasher will still dispatch changes made programatically by calling hasher.setHash();</li>
				 * </ul>
				 */
				stop : function(){
					if(! _isActive) return;

					if(_isHashChangeSupported){
						_removeListener(window, 'hashchange', _checkHistory);
					}else{
						clearInterval(_checkInterval);
						_checkInterval = null;
					}

					_isActive = false;
					hasher.stopped.dispatch(_trimHash(_hash));
				},

				/**
				 * @return {boolean}    If hasher is listening to changes on the browser history and/or hash value.
				 */
				isActive : function(){
					return _isActive;
				},

				/**
				 * @return {string} Full URL.
				 */
				getURL : function(){
					return window.location.href;
				},

				/**
				 * @return {string} Retrieve URL without query string and hash.
				 */
				getBaseURL : function(){
					return hasher.getURL().replace(_baseUrlRegexp, ''); //removes everything after '?' and/or '#'
				},

				/**
				 * Set Hash value, generating a new history record.
				 * @param {...string} path    Hash value without '#'. Hasher will join
				 * path segments using `hasher.separator` and prepend/append hash value
				 * with `hasher.appendHash` and `hasher.prependHash`
				 * @example hasher.setHash('lorem', 'ipsum', 'dolor') -> '#/lorem/ipsum/dolor'
				 */
				setHash : function(path){
					// ##### BEGIN: MODIFIED BY SAP
					var dispatchFunction;
					// ##### END: MODIFIED BY SAP

					path = _makePath.apply(null, arguments);
					if(path !== _hash){
						// we should store raw value
						// ##### BEGIN: MODIFIED BY SAP
						dispatchFunction = _registerChange(path);
						if (!hasher.raw) {
							path = _encodePath(path);
						}
						window.location.hash = '#' + path;
						dispatchFunction && dispatchFunction();
						// ##### END: MODIFIED BY SAP
					}
				},

				/**
				 * Set Hash value without keeping previous hash on the history record.
				 * Similar to calling `window.location.replace("#/hash")` but will also work on IE6-7.
				 * @param {...string} path    Hash value without '#'. Hasher will join
				 * path segments using `hasher.separator` and prepend/append hash value
				 * with `hasher.appendHash` and `hasher.prependHash`
				 * @example hasher.replaceHash('lorem', 'ipsum', 'dolor') -> '#/lorem/ipsum/dolor'
				 */
				replaceHash : function(path){
					// ##### BEGIN: MODIFIED BY SAP
					var dispatchFunction;
					// ##### END: MODIFIED BY SAP
					path = _makePath.apply(null, arguments);
					if(path !== _hash){
						// we should store raw value
						// ##### BEGIN: MODIFIED BY SAP
						dispatchFunction = _registerChange(path);
						if (!hasher.raw) {
							path = _encodePath(path);
						}
						window.location.replace('#' + path);
						dispatchFunction && dispatchFunction();
						// ##### END: MODIFIED BY SAP
					}
				},

				/**
				 * @return {string} Hash value without '#', `hasher.appendHash` and `hasher.prependHash`.
				 */
				getHash : function(){
					//didn't used actual value of the `window.location.hash` to avoid breaking the application in case `window.location.hash` isn't available and also because value should always be synched.
					return _trimHash(_hash);
				},

				/**
				 * @return {Array.<string>} Hash value split into an Array.
				 */
				getHashAsArray : function(){
					return hasher.getHash().split(hasher.separator);
				},

				/**
				 * Removes all event listeners, stops hasher and destroy hasher object.
				 * - IMPORTANT: hasher won't work after calling this method, hasher Object will be deleted.
				 */
				dispose : function(){
					hasher.stop();
					hasher.initialized.dispose();
					hasher.stopped.dispose();
					hasher.changed.dispose();
					_frame = hasher = window.hasher = null;
				},

				/**
				 * @return {string} A string representation of the object.
				 */
				toString : function(){
					return '[hasher version="'+ hasher.VERSION +'" hash="'+ hasher.getHash() +'"]';
				}

			};

			hasher.initialized.memorize = true; //see #33

			return hasher;

		}(window));


		return hasher;
	};

	if (typeof define === 'function' && define.amd) {
		define(['signals'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('signals'));
	} else {
		/*jshint sub:true */
		window['hasher'] = factory(window['signals']);
	}

}());
