/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/model-sync-rest/model-sync-rest.js",
    code: []
};
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"].code=["YUI.add('model-sync-rest', function (Y, NAME) {","","/**","An extension which provides a RESTful XHR sync implementation that can be mixed","into a Model or ModelList subclass.","","@module app","@submodule model-sync-rest","@since 3.6.0","**/","","var Lang = Y.Lang;","","/**","An extension which provides a RESTful XHR sync implementation that can be mixed","into a Model or ModelList subclass.","","This makes it trivial for your Model or ModelList subclasses communicate and","transmit their data via RESTful XHRs. In most cases you'll only need to provide","a value for `root` when sub-classing `Y.Model`.","","    Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","        root: '/users'","    });","","    Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {","        // By convention `Y.User`'s `root` will be used for the lists' URL.","        model: Y.User","    });","","    var users = new Y.Users();","","    // GET users list from: \"/users\"","    users.load(function () {","        var firstUser = users.item(0);","","        firstUser.get('id'); // => \"1\"","","        // PUT updated user data at: \"/users/1\"","        firstUser.set('name', 'Eric').save();","    });","","@class ModelSync.REST","@extensionfor Model","@extensionfor ModelList","@since 3.6.0","**/","function RESTSync() {}","","/**","A request authenticity token to validate HTTP requests made by this extension","with the server when the request results in changing persistent state. This","allows you to protect your server from Cross-Site Request Forgery attacks.","","A CSRF token provided by the server can be embedded in the HTML document and","assigned to `YUI.Env.CSRF_TOKEN` like this:","","    <script>","        YUI.Env.CSRF_TOKEN = {{session.authenticityToken}};","    </script>","","The above should come after YUI seed file so that `YUI.Env` will be defined.","","**Note:** This can be overridden on a per-request basis. See `sync()` method.","","When a value for the CSRF token is provided, either statically or via `options`","passed to the `save()` and `destroy()` methods, the applicable HTTP requests","will have a `X-CSRF-Token` header added with the token value.","","@property CSRF_TOKEN","@type String","@default YUI.Env.CSRF_TOKEN","@static","@since 3.6.0","**/","RESTSync.CSRF_TOKEN = YUI.Env.CSRF_TOKEN;","","/**","Static flag to use the HTTP POST method instead of PUT or DELETE.","","If the server-side HTTP framework isn't RESTful, setting this flag to `true`","will cause all PUT and DELETE requests to instead use the POST HTTP method, and","add a `X-HTTP-Method-Override` HTTP header with the value of the method type","which was overridden.","","@property EMULATE_HTTP","@type Boolean","@default false","@static","@since 3.6.0","**/","RESTSync.EMULATE_HTTP = false;","","/**","Default headers used with all XHRs.","","By default the `Accept` and `Content-Type` headers are set to","\"application/json\", this signals to the HTTP server to process the request","bodies as JSON and send JSON responses. If you're sending and receiving content","other than JSON, you can override these headers and the `parse()` and","`serialize()` methods.","","**Note:** These headers will be merged with any request-specific headers, and","the request-specific headers will take precedence.","","@property HTTP_HEADERS","@type Object","@default","    {","        \"Accept\"      : \"application/json\",","        \"Content-Type\": \"application/json\"","    }","@static","@since 3.6.0","**/","RESTSync.HTTP_HEADERS = {","    'Accept'      : 'application/json',","    'Content-Type': 'application/json'","};","","/**","Static mapping of RESTful HTTP methods corresponding to CRUD actions.","","@property HTTP_METHODS","@type Object","@default","    {","        \"create\": \"POST\",","        \"read\"  : \"GET\",","        \"update\": \"PUT\",","        \"delete\": \"DELETE\"","    }","@static","@since 3.6.0","**/","RESTSync.HTTP_METHODS = {","    'create': 'POST',","    'read'  : 'GET',","    'update': 'PUT',","    'delete': 'DELETE'","};","","/**","The number of milliseconds before the XHRs will timeout/abort. This defaults to","30 seconds.","","**Note:** This can be overridden on a per-request basis. See `sync()` method.","","@property HTTP_TIMEOUT","@type Number","@default 30000","@static","@since 3.6.0","**/","RESTSync.HTTP_TIMEOUT = 30000;","","/**","Properties that shouldn't be turned into ad-hoc attributes when passed to a","Model or ModelList constructor.","","@property _NON_ATTRS_CFG","@type Array","@default [\"root\", \"url\"]","@static","@protected","@since 3.6.0","**/","RESTSync._NON_ATTRS_CFG = ['root', 'url'];","","RESTSync.prototype = {","","    // -- Public Properties ----------------------------------------------------","","    /**","    A string which represents the root or collection part of the URL which","    relates to a Model or ModelList. Usually this value should be same for all","    instances of a specific Model/ModelList subclass.","","    When sub-classing `Y.Model`, usually you'll only need to override this","    property, which lets the URLs for the XHRs be generated by convention. If","    the `root` string ends with a trailing-slash, XHR URLs will also end with a","    \"/\", and if the `root` does not end with a slash, neither will the XHR URLs.","","    @example","        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","            root: '/users'","        });","","        var currentUser, newUser;","","        // GET the user data from: \"/users/123\"","        currentUser = new Y.User({id: '123'}).load();","","        // POST the new user data to: \"/users\"","        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();","","    When sub-classing `Y.ModelList`, usually you'll want to ignore configuring","    the `root` and simply rely on the build-in convention of the list's","    generated URLs defaulting to the `root` specified by the list's `model`.","","    @property root","    @type String","    @default \"\"","    @since 3.6.0","    **/","    root: '',","","    /**","    A string which specifies the URL to use when making XHRs, if not value is","    provided, the URLs used to make XHRs will be generated by convention.","","    While a `url` can be provided for each Model/ModelList instance, usually","    you'll want to either rely on the default convention or provide a tokenized","    string on the prototype which can be used for all instances.","","    When sub-classing `Y.Model`, you will probably be able to rely on the","    default convention of generating URLs in conjunction with the `root`","    property and whether the model is new or not (i.e. has an `id`). If the","    `root` property ends with a trailing-slash, the generated URL for the","    specific model will also end with a trailing-slash.","","    @example","        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","            root: '/users/'","        });","","        var currentUser, newUser;","","        // GET the user data from: \"/users/123/\"","        currentUser = new Y.User({id: '123'}).load();","","        // POST the new user data to: \"/users/\"","        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();","","    If a `url` is specified, it will be processed by `Y.Lang.sub()`, which is","    useful when the URLs for a Model/ModelList subclass match a specific pattern","    and can use simple replacement tokens; e.g.:","","    @example","        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","            root: '/users',","            url : '/users/{username}'","        });","","    **Note:** String subsitituion of the `url` only use string an number values","    provided by this object's attribute and/or the `options` passed to the","    `getURL()` method. Do not expect something fancy to happen with Object,","    Array, or Boolean values, they will simply be ignored.","","    If your URLs have plural roots or collection URLs, while the specific item","    resources are under a singular name, e.g. \"/users\" (plural) and \"/user/123\"","    (singular), you'll probably want to configure the `root` and `url`","    properties like this:","","    @example","        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {","            root: '/users',","            url : '/user/{id}'","        });","","        var currentUser, newUser;","","        // GET the user data from: \"/user/123\"","        currentUser = new Y.User({id: '123'}).load();","","        // POST the new user data to: \"/users\"","        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();","","    When sub-classing `Y.ModelList`, usually you'll be able to rely on the","    associated `model` to supply its `root` to be used as the model list's URL.","    If this needs to be customized, you can provide a simple string for the","    `url` property.","","    @example","        Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {","            // Leverages `Y.User`'s `root`, which is \"/users\".","            model: Y.User","        });","","        // Or specified explicitly...","","        Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {","            model: Y.User,","            url  : '/users'","        });","","    @property url","    @type String","    @default \"\"","    @since 3.6.0","    **/","    url: '',","","    // -- Lifecycle Methods ----------------------------------------------------","","    initializer: function (config) {","        config || (config = {});","","        // Overrides `root` at the instance level.","        if ('root' in config) {","            this.root = config.root || '';","        }","","        // Overrides `url` at the instance level.","        if ('url' in config) {","            this.url = config.url || '';","        }","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns the URL for this model or model list for the given `action` and","    `options`, if specified.","","    This method correctly handles the variations of `root` and `url` values and","    is called by the `sync()` method to get the URLs used to make the XHRs.","","    You can override this method if you need to provide a specific","    implementation for how the URLs of your Model and ModelList subclasses need","    to be generated.","","    @method getURL","    @param {String} [action] Optional `sync()` action for which to generate the","        URL.","    @param {Object} [options] Optional options which may be used to help","        generate the URL.","    @return {String} this model's or model list's URL for the the given","        `action` and `options`.","    @since 3.6.0","    **/","    getURL: function (action, options) {","        var root = this.root,","            url  = this.url;","","        // If this is a model list, use its `url` and substitute placeholders,","        // but default to the `root` of its `model`. By convention a model's","        // `root` is the location to a collection resource.","        if (this._isYUIModelList) {","            if (!url) {","                return this.model.prototype.root;","            }","","            return this._substituteURL(url, Y.merge(this.getAttrs(), options));","        }","","        // Assume `this` is a model.","","        // When a model is new, i.e. has no `id`, the `root` should be used. By","        // convention a model's `root` is the location to a collection resource.","        // The model's `url` will be used as a fallback if `root` isn't defined.","        if (root && (action === 'create' || this.isNew())) {","            return root;","        }","","        // When a model's `url` is not provided, we'll generate a URL to use by","        // convention. This will combine the model's `id` with its configured","        // `root` and add a trailing-slash if the root ends with \"/\".","        if (!url) {","            return this._joinURL(this.getAsURL('id') || '');","        }","","        // Substitute placeholders in the `url` with URL-encoded values from the","        // model's attribute values or the specified `options`.","        return this._substituteURL(url, Y.merge(this.getAttrs(), options));","    },","","    /**","    Called to parse the response object returned from `Y.io()`. This method","    receives the full response object and is expected to \"prep\" a response which","    is suitable to pass to the `parse()` method.","","    By default the response body is returned (`responseText`), because it","    usually represents the entire entity of this model on the server.","","    If you need to parse data out of the response's headers you should do so by","    overriding this method. If you'd like the entire response object from the","    XHR to be passed to your `parse()` method, you can simply assign this","    property to `false`.","","    @method parseIOResponse","    @param {Object} response Response object from `Y.io()`.","    @return {Any} The modified response to pass along to the `parse()` method.","    @since 3.7.0","    **/","    parseIOResponse: function (response) {","        return response.responseText;","    },","","    /**","    Serializes `this` model to be used as the HTTP request entity body.","","    By default this model will be serialized to a JSON string via its `toJSON()`","    method.","","    You can override this method when the HTTP server expects a different","    representation of this model's data that is different from the default JSON","    serialization. If you're sending and receive content other than JSON, be","    sure change the `Accept` and `Content-Type` `HTTP_HEADERS` as well.","","    **Note:** A model's `toJSON()` method can also be overridden. If you only","    need to modify which attributes are serialized to JSON, that's a better","    place to start.","","    @method serialize","    @param {String} [action] Optional `sync()` action for which to generate the","        the serialized representation of this model.","    @return {String} serialized HTTP request entity body.","    @since 3.6.0","    **/","    serialize: function (action) {","        return Y.JSON.stringify(this);","    },","","    /**","    Communicates with a RESTful HTTP server by sending and receiving data via","    XHRs. This method is called internally by load(), save(), and destroy().","","    The URL used for each XHR will be retrieved by calling the `getURL()` method","    and passing it the specified `action` and `options`.","","    This method relies heavily on standard RESTful HTTP conventions","","    @method sync","    @param {String} action Sync action to perform. May be one of the following:","","      * `create`: Store a newly-created model for the first time.","      * `delete`: Delete an existing model.","      * `read`  : Load an existing model.","      * `update`: Update an existing model.","","    @param {Object} [options] Sync options:","      @param {String} [options.csrfToken] The authenticity token used by the","        server to verify the validity of this request and protected against CSRF","        attacks. This overrides the default value provided by the static","        `CSRF_TOKEN` property.","      @param {Object} [options.headers] The HTTP headers to mix with the default","        headers specified by the static `HTTP_HEADERS` property.","      @param {Number} [options.timeout] The number of milliseconds before the","        request will timeout and be aborted. This overrides the default provided","        by the static `HTTP_TIMEOUT` property.","    @param {Function} [callback] Called when the sync operation finishes.","      @param {Error|null} callback.err If an error occurred, this parameter will","        contain the error. If the sync operation succeeded, _err_ will be","        falsy.","      @param {Any} [callback.response] The server's response.","    **/","    sync: function (action, options, callback) {","        options || (options = {});","","        var url       = this.getURL(action, options),","            method    = RESTSync.HTTP_METHODS[action],","            headers   = Y.merge(RESTSync.HTTP_HEADERS, options.headers),","            timeout   = options.timeout || RESTSync.HTTP_TIMEOUT,","            csrfToken = options.csrfToken || RESTSync.CSRF_TOKEN,","            entity;","","        // Prepare the content if we are sending data to the server.","        if (method === 'POST' || method === 'PUT') {","            entity = this.serialize(action);","        } else {","            // Remove header, no content is being sent.","            delete headers['Content-Type'];","        }","","        // Setup HTTP emulation for older servers if we need it.","        if (RESTSync.EMULATE_HTTP &&","                (method === 'PUT' || method === 'DELETE')) {","","            // Pass along original method type in the headers.","            headers['X-HTTP-Method-Override'] = method;","","            // Fall-back to using POST method type.","            method = 'POST';","        }","","        // Add CSRF token to HTTP request headers if one is specified and the","        // request will cause side effects on the server.","        if (csrfToken &&","                (method === 'POST' || method === 'PUT' || method === 'DELETE')) {","","            headers['X-CSRF-Token'] = csrfToken;","        }","","        this._sendSyncIORequest({","            action  : action,","            callback: callback,","            entity  : entity,","            headers : headers,","            method  : method,","            timeout : timeout,","            url     : url","        });","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Joins the `root` URL to the specified `url`, normalizing leading/trailing","    \"/\" characters.","","    @example","        model.root = '/foo'","        model._joinURL('bar');  // => '/foo/bar'","        model._joinURL('/bar'); // => '/foo/bar'","","        model.root = '/foo/'","        model._joinURL('bar');  // => '/foo/bar/'","        model._joinURL('/bar'); // => '/foo/bar/'","","    @method _joinURL","    @param {String} url URL to append to the `root` URL.","    @return {String} Joined URL.","    @protected","    @since 3.6.0","    **/","    _joinURL: function (url) {","        var root = this.root;","","        if (!(root || url)) {","            return '';","        }","","        if (url.charAt(0) === '/') {","            url = url.substring(1);","        }","","        // Combines the `root` with the `url` and adds a trailing-slash if the","        // `root` has a trailing-slash.","        return root && root.charAt(root.length - 1) === '/' ?","                root + url + '/' :","                root + '/' + url;","    },","","","    /**","    Calls both public, overrideable methods: `parseIOResponse()`, then `parse()`","    and returns the result.","","    This will call into `parseIOResponse()`, if it's defined as a method,","    passing it the full response object from the XHR and using its return value","    to pass along to the `parse()`. This enables developers to easily parse data","    out of the response headers which should be used by the `parse()` method.","","    @method _parse","    @param {Object} response Response object from `Y.io()`.","    @return {Object|Object[]} Attribute hash or Array of model attribute hashes.","    @protected","    @since 3.7.0","    **/","    _parse: function (response) {","        // When `parseIOResponse` is defined as a method, it will be invoked and","        // the result will become the new response object that the `parse()`","        // will be invoked with.","        if (typeof this.parseIOResponse === 'function') {","            response = this.parseIOResponse(response);","        }","","        return this.parse(response);","    },","","    /**","    Performs the XHR and returns the resulting `Y.io()` request object.","","    This method is called by `sync()`.","","    @method _sendSyncIORequest","    @param {Object} config An object with the following properties:","      @param {String} config.action The `sync()` action being performed.","      @param {Function} [config.callback] Called when the sync operation","        finishes.","      @param {String} [config.entity] The HTTP request entity body.","      @param {Object} config.headers The HTTP request headers.","      @param {String} config.method The HTTP request method.","      @param {Number} [config.timeout] Time until the HTTP request is aborted.","      @param {String} config.url The URL of the HTTP resource.","    @return {Object} The resulting `Y.io()` request object.","    @protected","    @since 3.6.0","    **/","    _sendSyncIORequest: function (config) {","        return Y.io(config.url, {","            'arguments': {","                action  : config.action,","                callback: config.callback,","                url     : config.url","            },","","            context: this,","            data   : config.entity,","            headers: config.headers,","            method : config.method,","            timeout: config.timeout,","","            on: {","                start  : this._onSyncIOStart,","                failure: this._onSyncIOFailure,","                success: this._onSyncIOSuccess,","                end    : this._onSyncIOEnd","            }","        });","    },","","    /**","    Utility which takes a tokenized `url` string and substitutes its","    placeholders using a specified `data` object.","","    This method will property URL-encode any values before substituting them.","    Also, only expect it to work with String and Number values.","","    @example","        var url = this._substituteURL('/users/{name}', {id: 'Eric F'});","        // => \"/users/Eric%20F\"","","    @method _substituteURL","    @param {String} url Tokenized URL string to substitute placeholder values.","    @param {Object} data Set of data to fill in the `url`'s placeholders.","    @return {String} Substituted URL.","    @protected","    @since 3.6.0","    **/","    _substituteURL: function (url, data) {","        if (!url) {","            return '';","        }","","        var values = {};","","        // Creates a hash of the string and number values only to be used to","        // replace any placeholders in a tokenized `url`.","        Y.Object.each(data, function (v, k) {","            if (Lang.isString(v) || Lang.isNumber(v)) {","                // URL-encode any string or number values.","                values[k] = encodeURIComponent(v);","            }","        });","","        return Lang.sub(url, values);","    },","","    // -- Event Handlers -------------------------------------------------------","","    /**","    Called when the `Y.io` request has finished, after \"success\" or \"failure\"","    has been determined.","","    This is a no-op by default, but provides a hook for overriding.","","    @method _onSyncIOEnd","    @param {String} txId The `Y.io` transaction id.","    @param {Object} details Extra details carried through from `sync()`:","      @param {String} details.action The sync action performed.","      @param {Function} [details.callback] The function to call after syncing.","      @param {String} details.url The URL of the requested resource.","    @protected","    @since 3.6.0","    **/","    _onSyncIOEnd: function (txId, details) {},","","    /**","    Called when the `Y.io` request has finished unsuccessfully.","","    By default this calls the `details.callback` function passing it the HTTP","    status code and message as an error object along with the response body.","","    @method _onSyncIOFailure","    @param {String} txId The `Y.io` transaction id.","    @param {Object} res The `Y.io` response object.","    @param {Object} details Extra details carried through from `sync()`:","      @param {String} details.action The sync action performed.","      @param {Function} [details.callback] The function to call after syncing.","      @param {String} details.url The URL of the requested resource.","    @protected","    @since 3.6.0","    **/","    _onSyncIOFailure: function (txId, res, details) {","        var callback = details.callback;","","        if (callback) {","            callback({","                code: res.status,","                msg : res.statusText","            }, res);","        }","    },","","    /**","    Called when the `Y.io` request has finished successfully.","","    By default this calls the `details.callback` function passing it the","    response body.","","    @method _onSyncIOSuccess","    @param {String} txId The `Y.io` transaction id.","    @param {Object} res The `Y.io` response object.","    @param {Object} details Extra details carried through from `sync()`:","      @param {String} details.action The sync action performed.","      @param {Function} [details.callback] The function to call after syncing.","      @param {String} details.url The URL of the requested resource.","    @protected","    @since 3.6.0","    **/","    _onSyncIOSuccess: function (txId, res, details) {","        var callback = details.callback;","","        if (callback) {","            callback(null, res);","        }","    },","","    /**","    Called when the `Y.io` request is made.","","    This is a no-op by default, but provides a hook for overriding.","","    @method _onSyncIOStart","    @param {String} txId The `Y.io` transaction id.","    @param {Object} details Extra details carried through from `sync()`:","      @param {String} detials.action The sync action performed.","      @param {Function} [details.callback] The function to call after syncing.","      @param {String} details.url The URL of the requested resource.","    @protected","    @since 3.6.0","    **/","    _onSyncIOStart: function (txId, details) {}","};","","// -- Namespace ----------------------------------------------------------------","","Y.namespace('ModelSync').REST = RESTSync;","","","}, '3.7.3', {\"requires\": [\"model\", \"io-base\", \"json-stringify\"]});"];
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"].lines = {"1":0,"12":0,"48":0,"76":0,"92":0,"116":0,"136":0,"155":0,"168":0,"170":0,"297":0,"300":0,"301":0,"305":0,"306":0,"333":0,"339":0,"340":0,"341":0,"344":0,"352":0,"353":0,"359":0,"360":0,"365":0,"387":0,"412":0,"449":0,"451":0,"459":0,"460":0,"463":0,"467":0,"471":0,"474":0,"479":0,"482":0,"485":0,"518":0,"520":0,"521":0,"524":0,"525":0,"530":0,"555":0,"556":0,"559":0,"582":0,"623":0,"624":0,"627":0,"631":0,"632":0,"634":0,"638":0,"677":0,"679":0,"680":0,"704":0,"706":0,"707":0,"730":0};
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"].functions = {"RESTSync:48":0,"initializer:296":0,"getURL:332":0,"parseIOResponse:386":0,"serialize:411":0,"sync:448":0,"_joinURL:517":0,"_parse:551":0,"_sendSyncIORequest:581":0,"(anonymous 2):631":0,"_substituteURL:622":0,"_onSyncIOFailure:676":0,"_onSyncIOSuccess:703":0,"(anonymous 1):1":0};
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"].coveredLines = 62;
_yuitest_coverage["build/model-sync-rest/model-sync-rest.js"].coveredFunctions = 14;
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 1);
YUI.add('model-sync-rest', function (Y, NAME) {

/**
An extension which provides a RESTful XHR sync implementation that can be mixed
into a Model or ModelList subclass.

@module app
@submodule model-sync-rest
@since 3.6.0
**/

_yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "(anonymous 1)", 1);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 12);
var Lang = Y.Lang;

/**
An extension which provides a RESTful XHR sync implementation that can be mixed
into a Model or ModelList subclass.

This makes it trivial for your Model or ModelList subclasses communicate and
transmit their data via RESTful XHRs. In most cases you'll only need to provide
a value for `root` when sub-classing `Y.Model`.

    Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
        root: '/users'
    });

    Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {
        // By convention `Y.User`'s `root` will be used for the lists' URL.
        model: Y.User
    });

    var users = new Y.Users();

    // GET users list from: "/users"
    users.load(function () {
        var firstUser = users.item(0);

        firstUser.get('id'); // => "1"

        // PUT updated user data at: "/users/1"
        firstUser.set('name', 'Eric').save();
    });

@class ModelSync.REST
@extensionfor Model
@extensionfor ModelList
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 48);
function RESTSync() {}

/**
A request authenticity token to validate HTTP requests made by this extension
with the server when the request results in changing persistent state. This
allows you to protect your server from Cross-Site Request Forgery attacks.

A CSRF token provided by the server can be embedded in the HTML document and
assigned to `YUI.Env.CSRF_TOKEN` like this:

    <script>
        YUI.Env.CSRF_TOKEN = {{session.authenticityToken}};
    </script>

The above should come after YUI seed file so that `YUI.Env` will be defined.

**Note:** This can be overridden on a per-request basis. See `sync()` method.

When a value for the CSRF token is provided, either statically or via `options`
passed to the `save()` and `destroy()` methods, the applicable HTTP requests
will have a `X-CSRF-Token` header added with the token value.

@property CSRF_TOKEN
@type String
@default YUI.Env.CSRF_TOKEN
@static
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 76);
RESTSync.CSRF_TOKEN = YUI.Env.CSRF_TOKEN;

/**
Static flag to use the HTTP POST method instead of PUT or DELETE.

If the server-side HTTP framework isn't RESTful, setting this flag to `true`
will cause all PUT and DELETE requests to instead use the POST HTTP method, and
add a `X-HTTP-Method-Override` HTTP header with the value of the method type
which was overridden.

@property EMULATE_HTTP
@type Boolean
@default false
@static
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 92);
RESTSync.EMULATE_HTTP = false;

/**
Default headers used with all XHRs.

By default the `Accept` and `Content-Type` headers are set to
"application/json", this signals to the HTTP server to process the request
bodies as JSON and send JSON responses. If you're sending and receiving content
other than JSON, you can override these headers and the `parse()` and
`serialize()` methods.

**Note:** These headers will be merged with any request-specific headers, and
the request-specific headers will take precedence.

@property HTTP_HEADERS
@type Object
@default
    {
        "Accept"      : "application/json",
        "Content-Type": "application/json"
    }
@static
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 116);
RESTSync.HTTP_HEADERS = {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json'
};

/**
Static mapping of RESTful HTTP methods corresponding to CRUD actions.

@property HTTP_METHODS
@type Object
@default
    {
        "create": "POST",
        "read"  : "GET",
        "update": "PUT",
        "delete": "DELETE"
    }
@static
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 136);
RESTSync.HTTP_METHODS = {
    'create': 'POST',
    'read'  : 'GET',
    'update': 'PUT',
    'delete': 'DELETE'
};

/**
The number of milliseconds before the XHRs will timeout/abort. This defaults to
30 seconds.

**Note:** This can be overridden on a per-request basis. See `sync()` method.

@property HTTP_TIMEOUT
@type Number
@default 30000
@static
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 155);
RESTSync.HTTP_TIMEOUT = 30000;

/**
Properties that shouldn't be turned into ad-hoc attributes when passed to a
Model or ModelList constructor.

@property _NON_ATTRS_CFG
@type Array
@default ["root", "url"]
@static
@protected
@since 3.6.0
**/
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 168);
RESTSync._NON_ATTRS_CFG = ['root', 'url'];

_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 170);
RESTSync.prototype = {

    // -- Public Properties ----------------------------------------------------

    /**
    A string which represents the root or collection part of the URL which
    relates to a Model or ModelList. Usually this value should be same for all
    instances of a specific Model/ModelList subclass.

    When sub-classing `Y.Model`, usually you'll only need to override this
    property, which lets the URLs for the XHRs be generated by convention. If
    the `root` string ends with a trailing-slash, XHR URLs will also end with a
    "/", and if the `root` does not end with a slash, neither will the XHR URLs.

    @example
        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
            root: '/users'
        });

        var currentUser, newUser;

        // GET the user data from: "/users/123"
        currentUser = new Y.User({id: '123'}).load();

        // POST the new user data to: "/users"
        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();

    When sub-classing `Y.ModelList`, usually you'll want to ignore configuring
    the `root` and simply rely on the build-in convention of the list's
    generated URLs defaulting to the `root` specified by the list's `model`.

    @property root
    @type String
    @default ""
    @since 3.6.0
    **/
    root: '',

    /**
    A string which specifies the URL to use when making XHRs, if not value is
    provided, the URLs used to make XHRs will be generated by convention.

    While a `url` can be provided for each Model/ModelList instance, usually
    you'll want to either rely on the default convention or provide a tokenized
    string on the prototype which can be used for all instances.

    When sub-classing `Y.Model`, you will probably be able to rely on the
    default convention of generating URLs in conjunction with the `root`
    property and whether the model is new or not (i.e. has an `id`). If the
    `root` property ends with a trailing-slash, the generated URL for the
    specific model will also end with a trailing-slash.

    @example
        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
            root: '/users/'
        });

        var currentUser, newUser;

        // GET the user data from: "/users/123/"
        currentUser = new Y.User({id: '123'}).load();

        // POST the new user data to: "/users/"
        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();

    If a `url` is specified, it will be processed by `Y.Lang.sub()`, which is
    useful when the URLs for a Model/ModelList subclass match a specific pattern
    and can use simple replacement tokens; e.g.:

    @example
        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
            root: '/users',
            url : '/users/{username}'
        });

    **Note:** String subsitituion of the `url` only use string an number values
    provided by this object's attribute and/or the `options` passed to the
    `getURL()` method. Do not expect something fancy to happen with Object,
    Array, or Boolean values, they will simply be ignored.

    If your URLs have plural roots or collection URLs, while the specific item
    resources are under a singular name, e.g. "/users" (plural) and "/user/123"
    (singular), you'll probably want to configure the `root` and `url`
    properties like this:

    @example
        Y.User = Y.Base.create('user', Y.Model, [Y.ModelSync.REST], {
            root: '/users',
            url : '/user/{id}'
        });

        var currentUser, newUser;

        // GET the user data from: "/user/123"
        currentUser = new Y.User({id: '123'}).load();

        // POST the new user data to: "/users"
        newUser = new Y.User({name: 'Eric Ferraiuolo'}).save();

    When sub-classing `Y.ModelList`, usually you'll be able to rely on the
    associated `model` to supply its `root` to be used as the model list's URL.
    If this needs to be customized, you can provide a simple string for the
    `url` property.

    @example
        Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {
            // Leverages `Y.User`'s `root`, which is "/users".
            model: Y.User
        });

        // Or specified explicitly...

        Y.Users = Y.Base.create('users', Y.ModelList, [Y.ModelSync.REST], {
            model: Y.User,
            url  : '/users'
        });

    @property url
    @type String
    @default ""
    @since 3.6.0
    **/
    url: '',

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function (config) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "initializer", 296);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 297);
config || (config = {});

        // Overrides `root` at the instance level.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 300);
if ('root' in config) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 301);
this.root = config.root || '';
        }

        // Overrides `url` at the instance level.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 305);
if ('url' in config) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 306);
this.url = config.url || '';
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns the URL for this model or model list for the given `action` and
    `options`, if specified.

    This method correctly handles the variations of `root` and `url` values and
    is called by the `sync()` method to get the URLs used to make the XHRs.

    You can override this method if you need to provide a specific
    implementation for how the URLs of your Model and ModelList subclasses need
    to be generated.

    @method getURL
    @param {String} [action] Optional `sync()` action for which to generate the
        URL.
    @param {Object} [options] Optional options which may be used to help
        generate the URL.
    @return {String} this model's or model list's URL for the the given
        `action` and `options`.
    @since 3.6.0
    **/
    getURL: function (action, options) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "getURL", 332);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 333);
var root = this.root,
            url  = this.url;

        // If this is a model list, use its `url` and substitute placeholders,
        // but default to the `root` of its `model`. By convention a model's
        // `root` is the location to a collection resource.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 339);
if (this._isYUIModelList) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 340);
if (!url) {
                _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 341);
return this.model.prototype.root;
            }

            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 344);
return this._substituteURL(url, Y.merge(this.getAttrs(), options));
        }

        // Assume `this` is a model.

        // When a model is new, i.e. has no `id`, the `root` should be used. By
        // convention a model's `root` is the location to a collection resource.
        // The model's `url` will be used as a fallback if `root` isn't defined.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 352);
if (root && (action === 'create' || this.isNew())) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 353);
return root;
        }

        // When a model's `url` is not provided, we'll generate a URL to use by
        // convention. This will combine the model's `id` with its configured
        // `root` and add a trailing-slash if the root ends with "/".
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 359);
if (!url) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 360);
return this._joinURL(this.getAsURL('id') || '');
        }

        // Substitute placeholders in the `url` with URL-encoded values from the
        // model's attribute values or the specified `options`.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 365);
return this._substituteURL(url, Y.merge(this.getAttrs(), options));
    },

    /**
    Called to parse the response object returned from `Y.io()`. This method
    receives the full response object and is expected to "prep" a response which
    is suitable to pass to the `parse()` method.

    By default the response body is returned (`responseText`), because it
    usually represents the entire entity of this model on the server.

    If you need to parse data out of the response's headers you should do so by
    overriding this method. If you'd like the entire response object from the
    XHR to be passed to your `parse()` method, you can simply assign this
    property to `false`.

    @method parseIOResponse
    @param {Object} response Response object from `Y.io()`.
    @return {Any} The modified response to pass along to the `parse()` method.
    @since 3.7.0
    **/
    parseIOResponse: function (response) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "parseIOResponse", 386);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 387);
return response.responseText;
    },

    /**
    Serializes `this` model to be used as the HTTP request entity body.

    By default this model will be serialized to a JSON string via its `toJSON()`
    method.

    You can override this method when the HTTP server expects a different
    representation of this model's data that is different from the default JSON
    serialization. If you're sending and receive content other than JSON, be
    sure change the `Accept` and `Content-Type` `HTTP_HEADERS` as well.

    **Note:** A model's `toJSON()` method can also be overridden. If you only
    need to modify which attributes are serialized to JSON, that's a better
    place to start.

    @method serialize
    @param {String} [action] Optional `sync()` action for which to generate the
        the serialized representation of this model.
    @return {String} serialized HTTP request entity body.
    @since 3.6.0
    **/
    serialize: function (action) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "serialize", 411);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 412);
return Y.JSON.stringify(this);
    },

    /**
    Communicates with a RESTful HTTP server by sending and receiving data via
    XHRs. This method is called internally by load(), save(), and destroy().

    The URL used for each XHR will be retrieved by calling the `getURL()` method
    and passing it the specified `action` and `options`.

    This method relies heavily on standard RESTful HTTP conventions

    @method sync
    @param {String} action Sync action to perform. May be one of the following:

      * `create`: Store a newly-created model for the first time.
      * `delete`: Delete an existing model.
      * `read`  : Load an existing model.
      * `update`: Update an existing model.

    @param {Object} [options] Sync options:
      @param {String} [options.csrfToken] The authenticity token used by the
        server to verify the validity of this request and protected against CSRF
        attacks. This overrides the default value provided by the static
        `CSRF_TOKEN` property.
      @param {Object} [options.headers] The HTTP headers to mix with the default
        headers specified by the static `HTTP_HEADERS` property.
      @param {Number} [options.timeout] The number of milliseconds before the
        request will timeout and be aborted. This overrides the default provided
        by the static `HTTP_TIMEOUT` property.
    @param {Function} [callback] Called when the sync operation finishes.
      @param {Error|null} callback.err If an error occurred, this parameter will
        contain the error. If the sync operation succeeded, _err_ will be
        falsy.
      @param {Any} [callback.response] The server's response.
    **/
    sync: function (action, options, callback) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "sync", 448);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 449);
options || (options = {});

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 451);
var url       = this.getURL(action, options),
            method    = RESTSync.HTTP_METHODS[action],
            headers   = Y.merge(RESTSync.HTTP_HEADERS, options.headers),
            timeout   = options.timeout || RESTSync.HTTP_TIMEOUT,
            csrfToken = options.csrfToken || RESTSync.CSRF_TOKEN,
            entity;

        // Prepare the content if we are sending data to the server.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 459);
if (method === 'POST' || method === 'PUT') {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 460);
entity = this.serialize(action);
        } else {
            // Remove header, no content is being sent.
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 463);
delete headers['Content-Type'];
        }

        // Setup HTTP emulation for older servers if we need it.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 467);
if (RESTSync.EMULATE_HTTP &&
                (method === 'PUT' || method === 'DELETE')) {

            // Pass along original method type in the headers.
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 471);
headers['X-HTTP-Method-Override'] = method;

            // Fall-back to using POST method type.
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 474);
method = 'POST';
        }

        // Add CSRF token to HTTP request headers if one is specified and the
        // request will cause side effects on the server.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 479);
if (csrfToken &&
                (method === 'POST' || method === 'PUT' || method === 'DELETE')) {

            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 482);
headers['X-CSRF-Token'] = csrfToken;
        }

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 485);
this._sendSyncIORequest({
            action  : action,
            callback: callback,
            entity  : entity,
            headers : headers,
            method  : method,
            timeout : timeout,
            url     : url
        });
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Joins the `root` URL to the specified `url`, normalizing leading/trailing
    "/" characters.

    @example
        model.root = '/foo'
        model._joinURL('bar');  // => '/foo/bar'
        model._joinURL('/bar'); // => '/foo/bar'

        model.root = '/foo/'
        model._joinURL('bar');  // => '/foo/bar/'
        model._joinURL('/bar'); // => '/foo/bar/'

    @method _joinURL
    @param {String} url URL to append to the `root` URL.
    @return {String} Joined URL.
    @protected
    @since 3.6.0
    **/
    _joinURL: function (url) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_joinURL", 517);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 518);
var root = this.root;

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 520);
if (!(root || url)) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 521);
return '';
        }

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 524);
if (url.charAt(0) === '/') {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 525);
url = url.substring(1);
        }

        // Combines the `root` with the `url` and adds a trailing-slash if the
        // `root` has a trailing-slash.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 530);
return root && root.charAt(root.length - 1) === '/' ?
                root + url + '/' :
                root + '/' + url;
    },


    /**
    Calls both public, overrideable methods: `parseIOResponse()`, then `parse()`
    and returns the result.

    This will call into `parseIOResponse()`, if it's defined as a method,
    passing it the full response object from the XHR and using its return value
    to pass along to the `parse()`. This enables developers to easily parse data
    out of the response headers which should be used by the `parse()` method.

    @method _parse
    @param {Object} response Response object from `Y.io()`.
    @return {Object|Object[]} Attribute hash or Array of model attribute hashes.
    @protected
    @since 3.7.0
    **/
    _parse: function (response) {
        // When `parseIOResponse` is defined as a method, it will be invoked and
        // the result will become the new response object that the `parse()`
        // will be invoked with.
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_parse", 551);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 555);
if (typeof this.parseIOResponse === 'function') {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 556);
response = this.parseIOResponse(response);
        }

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 559);
return this.parse(response);
    },

    /**
    Performs the XHR and returns the resulting `Y.io()` request object.

    This method is called by `sync()`.

    @method _sendSyncIORequest
    @param {Object} config An object with the following properties:
      @param {String} config.action The `sync()` action being performed.
      @param {Function} [config.callback] Called when the sync operation
        finishes.
      @param {String} [config.entity] The HTTP request entity body.
      @param {Object} config.headers The HTTP request headers.
      @param {String} config.method The HTTP request method.
      @param {Number} [config.timeout] Time until the HTTP request is aborted.
      @param {String} config.url The URL of the HTTP resource.
    @return {Object} The resulting `Y.io()` request object.
    @protected
    @since 3.6.0
    **/
    _sendSyncIORequest: function (config) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_sendSyncIORequest", 581);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 582);
return Y.io(config.url, {
            'arguments': {
                action  : config.action,
                callback: config.callback,
                url     : config.url
            },

            context: this,
            data   : config.entity,
            headers: config.headers,
            method : config.method,
            timeout: config.timeout,

            on: {
                start  : this._onSyncIOStart,
                failure: this._onSyncIOFailure,
                success: this._onSyncIOSuccess,
                end    : this._onSyncIOEnd
            }
        });
    },

    /**
    Utility which takes a tokenized `url` string and substitutes its
    placeholders using a specified `data` object.

    This method will property URL-encode any values before substituting them.
    Also, only expect it to work with String and Number values.

    @example
        var url = this._substituteURL('/users/{name}', {id: 'Eric F'});
        // => "/users/Eric%20F"

    @method _substituteURL
    @param {String} url Tokenized URL string to substitute placeholder values.
    @param {Object} data Set of data to fill in the `url`'s placeholders.
    @return {String} Substituted URL.
    @protected
    @since 3.6.0
    **/
    _substituteURL: function (url, data) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_substituteURL", 622);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 623);
if (!url) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 624);
return '';
        }

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 627);
var values = {};

        // Creates a hash of the string and number values only to be used to
        // replace any placeholders in a tokenized `url`.
        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 631);
Y.Object.each(data, function (v, k) {
            _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "(anonymous 2)", 631);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 632);
if (Lang.isString(v) || Lang.isNumber(v)) {
                // URL-encode any string or number values.
                _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 634);
values[k] = encodeURIComponent(v);
            }
        });

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 638);
return Lang.sub(url, values);
    },

    // -- Event Handlers -------------------------------------------------------

    /**
    Called when the `Y.io` request has finished, after "success" or "failure"
    has been determined.

    This is a no-op by default, but provides a hook for overriding.

    @method _onSyncIOEnd
    @param {String} txId The `Y.io` transaction id.
    @param {Object} details Extra details carried through from `sync()`:
      @param {String} details.action The sync action performed.
      @param {Function} [details.callback] The function to call after syncing.
      @param {String} details.url The URL of the requested resource.
    @protected
    @since 3.6.0
    **/
    _onSyncIOEnd: function (txId, details) {},

    /**
    Called when the `Y.io` request has finished unsuccessfully.

    By default this calls the `details.callback` function passing it the HTTP
    status code and message as an error object along with the response body.

    @method _onSyncIOFailure
    @param {String} txId The `Y.io` transaction id.
    @param {Object} res The `Y.io` response object.
    @param {Object} details Extra details carried through from `sync()`:
      @param {String} details.action The sync action performed.
      @param {Function} [details.callback] The function to call after syncing.
      @param {String} details.url The URL of the requested resource.
    @protected
    @since 3.6.0
    **/
    _onSyncIOFailure: function (txId, res, details) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_onSyncIOFailure", 676);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 677);
var callback = details.callback;

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 679);
if (callback) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 680);
callback({
                code: res.status,
                msg : res.statusText
            }, res);
        }
    },

    /**
    Called when the `Y.io` request has finished successfully.

    By default this calls the `details.callback` function passing it the
    response body.

    @method _onSyncIOSuccess
    @param {String} txId The `Y.io` transaction id.
    @param {Object} res The `Y.io` response object.
    @param {Object} details Extra details carried through from `sync()`:
      @param {String} details.action The sync action performed.
      @param {Function} [details.callback] The function to call after syncing.
      @param {String} details.url The URL of the requested resource.
    @protected
    @since 3.6.0
    **/
    _onSyncIOSuccess: function (txId, res, details) {
        _yuitest_coverfunc("build/model-sync-rest/model-sync-rest.js", "_onSyncIOSuccess", 703);
_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 704);
var callback = details.callback;

        _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 706);
if (callback) {
            _yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 707);
callback(null, res);
        }
    },

    /**
    Called when the `Y.io` request is made.

    This is a no-op by default, but provides a hook for overriding.

    @method _onSyncIOStart
    @param {String} txId The `Y.io` transaction id.
    @param {Object} details Extra details carried through from `sync()`:
      @param {String} detials.action The sync action performed.
      @param {Function} [details.callback] The function to call after syncing.
      @param {String} details.url The URL of the requested resource.
    @protected
    @since 3.6.0
    **/
    _onSyncIOStart: function (txId, details) {}
};

// -- Namespace ----------------------------------------------------------------

_yuitest_coverline("build/model-sync-rest/model-sync-rest.js", 730);
Y.namespace('ModelSync').REST = RESTSync;


}, '3.7.3', {"requires": ["model", "io-base", "json-stringify"]});
