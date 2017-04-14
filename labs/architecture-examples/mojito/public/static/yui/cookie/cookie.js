/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('cookie', function (Y, NAME) {

/**
 * Utilities for cookie management
 * @module cookie
 */

    //shortcuts
    var L       = Y.Lang,
        O       = Y.Object,
        NULL    = null,
        
        //shortcuts to functions
        isString    = L.isString,
        isObject    = L.isObject,
        isUndefined = L.isUndefined,
        isFunction  = L.isFunction,
        encode      = encodeURIComponent,
        decode      = decodeURIComponent,
        
        //shortcut to document
        doc         = Y.config.doc;
        
    /*
     * Throws an error message.
     */
    function error(message){
        throw new TypeError(message);
    }        
    
    /*
     * Checks the validity of a cookie name.
     */
    function validateCookieName(name){
        if (!isString(name) || name === ""){
            error("Cookie name must be a non-empty string.");
        }               
    }
    
    /*
     * Checks the validity of a subcookie name.
     */    
    function validateSubcookieName(subName){
        if (!isString(subName) || subName === ""){
            error("Subcookie name must be a non-empty string.");
        }    
    }
    
    /**
     * Cookie utility.
     * @class Cookie
     * @static
     */
    Y.Cookie = {
                    
        //-------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------
        
        /**
         * Creates a cookie string that can be assigned into document.cookie.
         * @param {String} name The name of the cookie.
         * @param {String} value The value of the cookie.
         * @param {Boolean} encodeValue True to encode the value, false to leave as-is.
         * @param {Object} options (Optional) Options for the cookie.
         * @return {String} The formatted cookie string.
         * @method _createCookieString
         * @private
         * @static
         */
        _createCookieString : function (name /*:String*/, value /*:Variant*/, encodeValue /*:Boolean*/, options /*:Object*/) /*:String*/ {
        
            options = options || {};
            
            var text /*:String*/ = encode(name) + "=" + (encodeValue ? encode(value) : value),
                expires = options.expires,
                path    = options.path,
                domain  = options.domain;
            
        
            if (isObject(options)){
                //expiration date
                if (expires instanceof Date){
                    text += "; expires=" + expires.toUTCString();
                }
            
                //path
                if (isString(path) && path !== ""){
                    text += "; path=" + path;
                }
        
                //domain
                if (isString(domain) && domain !== ""){
                    text += "; domain=" + domain;
                }
                
                //secure
                if (options.secure === true){
                    text += "; secure";
                }
            }
            
            return text;
        },
        
        /**
         * Formats a cookie value for an object containing multiple values.
         * @param {Object} hash An object of key-value pairs to create a string for.
         * @return {String} A string suitable for use as a cookie value.
         * @method _createCookieHashString
         * @private
         * @static
         */
        _createCookieHashString : function (hash /*:Object*/) /*:String*/ {
            if (!isObject(hash)){
                error("Cookie._createCookieHashString(): Argument must be an object.");
            }
            
            var text /*:Array*/ = [];

            O.each(hash, function(value, key){
                if (!isFunction(value) && !isUndefined(value)){
                    text.push(encode(key) + "=" + encode(String(value)));
                }            
            });
            
            return text.join("&");
        },
        
        /**
         * Parses a cookie hash string into an object.
         * @param {String} text The cookie hash string to parse (format: n1=v1&n2=v2).
         * @return {Object} An object containing entries for each cookie value.
         * @method _parseCookieHash
         * @private
         * @static
         */
        _parseCookieHash : function (text) {
        
            var hashParts   = text.split("&"),
                hashPart    = NULL,
                hash        = {};
            
            if (text.length){
                for (var i=0, len=hashParts.length; i < len; i++){
                    hashPart = hashParts[i].split("=");
                    hash[decode(hashPart[0])] = decode(hashPart[1]);
                }
            }
            
            return hash;          
        },
        
        /**
         * Parses a cookie string into an object representing all accessible cookies.
         * @param {String} text The cookie string to parse.
         * @param {Boolean} shouldDecode (Optional) Indicates if the cookie values should be decoded or not. Default is true.
         * @return {Object} An object containing entries for each accessible cookie.
         * @method _parseCookieString
         * @private
         * @static
         */
        _parseCookieString : function (text /*:String*/, shouldDecode /*:Boolean*/) /*:Object*/ {
        
            var cookies /*:Object*/ = {};        
            
            if (isString(text) && text.length > 0) {
            
                var decodeValue = (shouldDecode === false ? function(s){return s;} : decode),  
                    cookieParts = text.split(/;\s/g),
                    cookieName  = NULL,
                    cookieValue = NULL,
                    cookieNameValue = NULL;
                
                for (var i=0, len=cookieParts.length; i < len; i++){
                
                    //check for normally-formatted cookie (name-value)
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    if (cookieNameValue instanceof Array){
                        try {
                            cookieName = decode(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length+1));
                        } catch (ex){
                            //intentionally ignore the cookie - the encoding is wrong
                        }
                    } else {
                        //means the cookie does not have an "=", so treat it as a boolean flag
                        cookieName = decode(cookieParts[i]);
                        cookieValue = "";
                    }
                    cookies[cookieName] = cookieValue;
                }

            }
            
            return cookies;
        },    
        
        /**
         * Sets the document object that the cookie utility uses for setting
         * cookies. This method is necessary to ensure that the cookie utility
         * unit tests can pass even when run on a domain instead of locally.
         * This method should not be used otherwise; you should use 
         * <code>Y.config.doc</code> to change the document that the cookie
         * utility uses for everyday purposes.
         * @param {Object} newDoc The object to use as the document.
         * @return {void}
         * @method _setDoc
         * @private
         */         
        _setDoc: function(newDoc){
            doc = newDoc;
        },
        
        //-------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------
    
        /**
         * Determines if the cookie with the given name exists. This is useful for
         * Boolean cookies (those that do not follow the name=value convention).
         * @param {String} name The name of the cookie to check.
         * @return {Boolean} True if the cookie exists, false if not.
         * @method exists
         * @static
         */
        exists: function(name) {
    
            validateCookieName(name);   //throws error
    
            var cookies = this._parseCookieString(doc.cookie, true);
            
            return cookies.hasOwnProperty(name);
        },    
        
        /**
         * Returns the cookie value for the given name.
         * @param {String} name The name of the cookie to retrieve.
         * @param {Function|Object} options (Optional) An object containing one or more
         *      cookie options: raw (true/false) and converter (a function).
         *      The converter function is run on the value before returning it. The
         *      function is not used if the cookie doesn't exist. The function can be
         *      passed instead of the options object for backwards compatibility. When
         *      raw is set to true, the cookie value is not URI decoded.
         * @return {Variant} If no converter is specified, returns a string or null if
         *      the cookie doesn't exist. If the converter is specified, returns the value
         *      returned from the converter or null if the cookie doesn't exist.
         * @method get
         * @static
         */
        get : function (name, options) {
            
            validateCookieName(name);   //throws error                        
            
            var cookies,
                cookie,
                converter;
                
            //if options is a function, then it's the converter
            if (isFunction(options)) {
                converter = options;
                options = {};
            } else if (isObject(options)) {
                converter = options.converter;
            } else {
                options = {};
            }
            
            cookies = this._parseCookieString(doc.cookie, !options.raw);
            cookie = cookies[name];
            
            //should return null, not undefined if the cookie doesn't exist
            if (isUndefined(cookie)) {
                return NULL;
            }
            
            if (!isFunction(converter)){
                return cookie;
            } else {
                return converter(cookie);
            }
        },
        
        /**
         * Returns the value of a subcookie.
         * @param {String} name The name of the cookie to retrieve.
         * @param {String} subName The name of the subcookie to retrieve.
         * @param {Function} converter (Optional) A function to run on the value before returning
         *      it. The function is not used if the cookie doesn't exist.
         * @return {Variant} If the cookie doesn't exist, null is returned. If the subcookie
         *      doesn't exist, null if also returned. If no converter is specified and the
         *      subcookie exists, a string is returned. If a converter is specified and the
         *      subcookie exists, the value returned from the converter is returned.
         * @method getSub
         * @static
         */
        getSub : function (name /*:String*/, subName /*:String*/, converter /*:Function*/) /*:Variant*/ {
          
            var hash /*:Variant*/ = this.getSubs(name);  
    
            if (hash !== NULL) {
                
                validateSubcookieName(subName);   //throws error
                
                if (isUndefined(hash[subName])){
                    return NULL;
                }            
            
                if (!isFunction(converter)){
                    return hash[subName];
                } else {
                    return converter(hash[subName]);
                }
            } else {
                return NULL;
            }
        
        },
        
        /**
         * Returns an object containing name-value pairs stored in the cookie with the given name.
         * @param {String} name The name of the cookie to retrieve.
         * @return {Object} An object of name-value pairs if the cookie with the given name
         *      exists, null if it does not.
         * @method getSubs
         * @static
         */
        getSubs : function (name) {
            
            validateCookieName(name);   //throws error
            
            var cookies = this._parseCookieString(doc.cookie, false);
            if (isString(cookies[name])){
                return this._parseCookieHash(cookies[name]);
            }
            return NULL;
        },
        
        /**
         * Removes a cookie from the machine by setting its expiration date to
         * sometime in the past.
         * @param {String} name The name of the cookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), 
         *      and secure (true/false). The expires option will be overwritten
         *      by the method.
         * @return {String} The created cookie string.
         * @method remove
         * @static
         */
        remove : function (name, options) {
            
            validateCookieName(name);   //throws error
            
            //set options
            options = Y.merge(options || {}, {
                expires: new Date(0)
            });
            
            //set cookie
            return this.set(name, "", options);
        },
    
        /**
         * Removes a sub cookie with a given name.
         * @param {String} name The name of the cookie in which the subcookie exists.
         * @param {String} subName The name of the subcookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      removeIfEmpty (true/false), and secure (true/false). This must be the same
         *      settings as the original subcookie.
         * @return {String} The created cookie string.
         * @method removeSub
         * @static
         */
        removeSub : function(name, subName, options) {
        
            validateCookieName(name);   //throws error
            
            validateSubcookieName(subName);   //throws error
            
            options = options || {};
            
            //get all subcookies for this cookie
            var subs = this.getSubs(name);
            
            //delete the indicated subcookie
            if (isObject(subs) && subs.hasOwnProperty(subName)){
                delete subs[subName];
                
                if (!options.removeIfEmpty) {
                    //reset the cookie
    
                    return this.setSubs(name, subs, options);
                } else {
                    //reset the cookie if there are subcookies left, else remove
                    for (var key in subs){
                        if (subs.hasOwnProperty(key) && !isFunction(subs[key]) && !isUndefined(subs[key])){
                            return this.setSubs(name, subs, options);
                        }
                    }
                    
                    return this.remove(name, options);
                }                
            } else {
                return "";
            }
            
        },
    
        /**
         * Sets a cookie with a given name and value.
         * @param {String} name The name of the cookie to set.
         * @param {Variant} value The value to set for the cookie.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      secure (true/false), and raw (true/false). Setting raw to true indicates
         *      that the cookie should not be URI encoded before being set.
         * @return {String} The created cookie string.
         * @method set
         * @static
         */
        set : function (name, value, options) {
        
            validateCookieName(name);   //throws error
            
            if (isUndefined(value)){
                error("Cookie.set(): Value cannot be undefined.");
            }
            
            options = options || {};
        
            var text = this._createCookieString(name, value, !options.raw, options);
            doc.cookie = text;
            return text;
        },
            
        /**
         * Sets a sub cookie with a given name to a particular value.
         * @param {String} name The name of the cookie to set.
         * @param {String} subName The name of the subcookie to set.
         * @param {Variant} value The value to set.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      and secure (true/false).
         * @return {String} The created cookie string.
         * @method setSub
         * @static
         */
        setSub : function (name, subName, value, options) {

            validateCookieName(name);   //throws error
    
            validateSubcookieName(subName);   //throws error
            
            if (isUndefined(value)){
                error("Cookie.setSub(): Subcookie value cannot be undefined.");
            }
    
            var hash = this.getSubs(name);
            
            if (!isObject(hash)){
                hash = {};
            }
            
            hash[subName] = value;        
            
            return this.setSubs(name, hash, options);
            
        },
        
        /**
         * Sets a cookie with a given name to contain a hash of name-value pairs.
         * @param {String} name The name of the cookie to set.
         * @param {Object} value An object containing name-value pairs.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a Date object),
         *      and secure (true/false).
         * @return {String} The created cookie string.
         * @method setSubs
         * @static
         */
        setSubs : function (name, value, options) {
            
            validateCookieName(name);   //throws error
            
            if (!isObject(value)){
                error("Cookie.setSubs(): Cookie value must be an object.");
            }
        
            var text /*:String*/ = this._createCookieString(name, this._createCookieHashString(value), false, options);
            doc.cookie = text;
            return text;        
        }     
    
    };


}, '3.7.3', {"requires": ["yui-base"]});
