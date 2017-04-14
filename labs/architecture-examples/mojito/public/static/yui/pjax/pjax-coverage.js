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
_yuitest_coverage["build/pjax/pjax.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/pjax/pjax.js",
    code: []
};
_yuitest_coverage["build/pjax/pjax.js"].code=["YUI.add('pjax', function (Y, NAME) {","","/**","Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,","which makes it easy to progressively enhance standard links on the page so that","they can be loaded normally in old browsers, or via Ajax (with HTML5 history","support) in newer browsers.","","@module pjax","@main","@since 3.5.0","**/","","/**","A stack of middleware which forms the default Pjax route.","","@property defaultRoute","@type Array","@static","@since 3.7.0","**/","var defaultRoute = ['loadContent', '_defaultRoute'],","","/**","Fired when an error occurs while attempting to load a URL via Ajax.","","@event error","@param {Object} content Content extracted from the response, if any.","    @param {Node} content.node A `Y.Node` instance for a document fragment","        containing the extracted HTML content.","    @param {String} [content.title] The title of the HTML page, if any,","        extracted using the `titleSelector` attribute. If `titleSelector` is","        not set or if a title could not be found, this property will be","        `undefined`.","@param {String} responseText Raw Ajax response text.","@param {Number} status HTTP status code for the Ajax response.","@param {String} url The absolute URL that failed to load.","@since 3.5.0","**/","EVT_ERROR = 'error',","","/**","Fired when a URL is successfully loaded via Ajax.","","@event load","@param {Object} content Content extracted from the response, if any.","    @param {Node} content.node A `Y.Node` instance for a document fragment","        containing the extracted HTML content.","    @param {String} [content.title] The title of the HTML page, if any,","        extracted using the `titleSelector` attribute. If `titleSelector` is","        not set or if a title could not be found, this property will be","        `undefined`.","@param {String} responseText Raw Ajax response text.","@param {Number} status HTTP status code for the Ajax response.","@param {String} url The absolute URL that was loaded.","@since 3.5.0","**/","EVT_LOAD = 'load';","","/**","Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,","which makes it easy to progressively enhance standard links on the page so that","they can be loaded normally in old browsers, or via Ajax (with HTML5 history","support) in newer browsers.","","@class Pjax","@extends Router","@uses PjaxBase","@uses PjaxContent","@constructor","@param {Object} [config] Config attributes.","@since 3.5.0","**/","Y.Pjax = Y.Base.create('pjax', Y.Router, [Y.PjaxBase, Y.PjaxContent], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function () {","        this.publish(EVT_ERROR, {defaultFn: this._defCompleteFn});","        this.publish(EVT_LOAD,  {defaultFn: this._defCompleteFn});","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Default Pjax route callback. Fires either the `load` or `error` event based","    on the status of the `Y.io` request made by the `loadContent()` middleware.","","    **Note:** This route callback assumes that it's called after the","    `loadContent()` middleware.","","    @method _defaultRoute","    @param {Object} req Request object.","    @param {Object} res Response Object.","    @param {Function} next Function to pass control to the next route callback.","    @protected","    @since 3.5.0","    @see Y.Pjax.defaultRoute","    **/","    _defaultRoute: function (req, res, next) {","        var ioResponse = res.ioResponse,","            status     = ioResponse.status,","            event      = status >= 200 && status < 300 ? EVT_LOAD : EVT_ERROR;","","        this.fire(event, {","            content     : res.content,","            responseText: ioResponse.responseText,","            status      : status,","            url         : req.ioURL","        });","","        next();","    },","","    // -- Event Handlers -------------------------------------------------------","","    /**","    Default event handler for both the `error` and `load` events. Attempts to","    insert the loaded content into the `container` node and update the page's","    title.","","    @method _defCompleteFn","    @param {EventFacade} e","    @protected","    @since 3.5.0","    **/","    _defCompleteFn: function (e) {","        var container = this.get('container'),","            content   = e.content;","","        if (container && content.node) {","            container.setHTML(content.node);","        }","","        if (content.title && Y.config.doc) {","            Y.config.doc.title = content.title;","        }","    }","}, {","    ATTRS: {","        /**","        Node into which content should be inserted when a page is loaded via","        Pjax. This node's existing contents will be removed to make way for the","        new content.","","        If not set, loaded content will not be automatically inserted into the","        page.","","        @attribute container","        @type Node","        @default null","        @since 3.5.0","        **/","        container: {","            value : null,","            setter: Y.one","        },","","        // Inherited from Router and already documented there.","        routes: {","            value: [","                {path: '*', callbacks: defaultRoute}","            ]","        }","    },","","    // Documented towards the top of this file.","    defaultRoute: defaultRoute","});","","","}, '3.7.3', {\"requires\": [\"pjax-base\", \"pjax-content\"]});"];
_yuitest_coverage["build/pjax/pjax.js"].lines = {"1":0,"22":0,"74":0,"77":0,"78":0,"99":0,"103":0,"110":0,"126":0,"129":0,"130":0,"133":0,"134":0};
_yuitest_coverage["build/pjax/pjax.js"].functions = {"initializer:76":0,"_defaultRoute:98":0,"_defCompleteFn:125":0,"(anonymous 1):1":0};
_yuitest_coverage["build/pjax/pjax.js"].coveredLines = 13;
_yuitest_coverage["build/pjax/pjax.js"].coveredFunctions = 4;
_yuitest_coverline("build/pjax/pjax.js", 1);
YUI.add('pjax', function (Y, NAME) {

/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@module pjax
@main
@since 3.5.0
**/

/**
A stack of middleware which forms the default Pjax route.

@property defaultRoute
@type Array
@static
@since 3.7.0
**/
_yuitest_coverfunc("build/pjax/pjax.js", "(anonymous 1)", 1);
_yuitest_coverline("build/pjax/pjax.js", 22);
var defaultRoute = ['loadContent', '_defaultRoute'],

/**
Fired when an error occurs while attempting to load a URL via Ajax.

@event error
@param {Object} content Content extracted from the response, if any.
    @param {Node} content.node A `Y.Node` instance for a document fragment
        containing the extracted HTML content.
    @param {String} [content.title] The title of the HTML page, if any,
        extracted using the `titleSelector` attribute. If `titleSelector` is
        not set or if a title could not be found, this property will be
        `undefined`.
@param {String} responseText Raw Ajax response text.
@param {Number} status HTTP status code for the Ajax response.
@param {String} url The absolute URL that failed to load.
@since 3.5.0
**/
EVT_ERROR = 'error',

/**
Fired when a URL is successfully loaded via Ajax.

@event load
@param {Object} content Content extracted from the response, if any.
    @param {Node} content.node A `Y.Node` instance for a document fragment
        containing the extracted HTML content.
    @param {String} [content.title] The title of the HTML page, if any,
        extracted using the `titleSelector` attribute. If `titleSelector` is
        not set or if a title could not be found, this property will be
        `undefined`.
@param {String} responseText Raw Ajax response text.
@param {Number} status HTTP status code for the Ajax response.
@param {String} url The absolute URL that was loaded.
@since 3.5.0
**/
EVT_LOAD = 'load';

/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@class Pjax
@extends Router
@uses PjaxBase
@uses PjaxContent
@constructor
@param {Object} [config] Config attributes.
@since 3.5.0
**/
_yuitest_coverline("build/pjax/pjax.js", 74);
Y.Pjax = Y.Base.create('pjax', Y.Router, [Y.PjaxBase, Y.PjaxContent], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        _yuitest_coverfunc("build/pjax/pjax.js", "initializer", 76);
_yuitest_coverline("build/pjax/pjax.js", 77);
this.publish(EVT_ERROR, {defaultFn: this._defCompleteFn});
        _yuitest_coverline("build/pjax/pjax.js", 78);
this.publish(EVT_LOAD,  {defaultFn: this._defCompleteFn});
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Default Pjax route callback. Fires either the `load` or `error` event based
    on the status of the `Y.io` request made by the `loadContent()` middleware.

    **Note:** This route callback assumes that it's called after the
    `loadContent()` middleware.

    @method _defaultRoute
    @param {Object} req Request object.
    @param {Object} res Response Object.
    @param {Function} next Function to pass control to the next route callback.
    @protected
    @since 3.5.0
    @see Y.Pjax.defaultRoute
    **/
    _defaultRoute: function (req, res, next) {
        _yuitest_coverfunc("build/pjax/pjax.js", "_defaultRoute", 98);
_yuitest_coverline("build/pjax/pjax.js", 99);
var ioResponse = res.ioResponse,
            status     = ioResponse.status,
            event      = status >= 200 && status < 300 ? EVT_LOAD : EVT_ERROR;

        _yuitest_coverline("build/pjax/pjax.js", 103);
this.fire(event, {
            content     : res.content,
            responseText: ioResponse.responseText,
            status      : status,
            url         : req.ioURL
        });

        _yuitest_coverline("build/pjax/pjax.js", 110);
next();
    },

    // -- Event Handlers -------------------------------------------------------

    /**
    Default event handler for both the `error` and `load` events. Attempts to
    insert the loaded content into the `container` node and update the page's
    title.

    @method _defCompleteFn
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _defCompleteFn: function (e) {
        _yuitest_coverfunc("build/pjax/pjax.js", "_defCompleteFn", 125);
_yuitest_coverline("build/pjax/pjax.js", 126);
var container = this.get('container'),
            content   = e.content;

        _yuitest_coverline("build/pjax/pjax.js", 129);
if (container && content.node) {
            _yuitest_coverline("build/pjax/pjax.js", 130);
container.setHTML(content.node);
        }

        _yuitest_coverline("build/pjax/pjax.js", 133);
if (content.title && Y.config.doc) {
            _yuitest_coverline("build/pjax/pjax.js", 134);
Y.config.doc.title = content.title;
        }
    }
}, {
    ATTRS: {
        /**
        Node into which content should be inserted when a page is loaded via
        Pjax. This node's existing contents will be removed to make way for the
        new content.

        If not set, loaded content will not be automatically inserted into the
        page.

        @attribute container
        @type Node
        @default null
        @since 3.5.0
        **/
        container: {
            value : null,
            setter: Y.one
        },

        // Inherited from Router and already documented there.
        routes: {
            value: [
                {path: '*', callbacks: defaultRoute}
            ]
        }
    },

    // Documented towards the top of this file.
    defaultRoute: defaultRoute
});


}, '3.7.3', {"requires": ["pjax-base", "pjax-content"]});
