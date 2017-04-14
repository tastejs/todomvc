/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('pjax-base', function (Y, NAME) {

/**
`Y.Router` extension that provides the core plumbing for enhanced navigation
implemented using the pjax technique (HTML5 pushState + Ajax).

@module pjax
@submodule pjax-base
@since 3.5.0
**/

var win = Y.config.win,

    // The CSS class name used to filter link clicks from only the links which
    // the pjax enhanced navigation should be used.
    CLASS_PJAX = Y.ClassNameManager.getClassName('pjax'),

    /**
    Fired when navigating to a URL via Pjax.

    When the `navigate()` method is called or a pjax link is clicked, this event
    will be fired if the browser supports HTML5 history _and_ the router has a
    route handler for the specified URL.

    This is a useful event to listen to for adding a visual loading indicator
    while the route handlers are busy handling the URL change.

    @event navigate
    @param {String} url The URL that the router will dispatch to its route
      handlers in order to fulfill the enhanced navigation "request".
    @param {Boolean} [force=false] Whether the enhanced navigation should occur
      even in browsers without HTML5 history.
    @param {String} [hash] The hash-fragment (including "#") of the `url`. This
      will be present when the `url` differs from the current URL only by its
      hash and `navigateOnHash` has been set to `true`.
    @param {Event} [originEvent] The event that caused the navigation. Usually
      this would be a click event from a "pjax" anchor element.
    @param {Boolean} [replace] Whether or not the current history entry will be
      replaced, or a new entry will be created. Will default to `true` if the
      specified `url` is the same as the current URL.
    @since 3.5.0
    **/
    EVT_NAVIGATE = 'navigate';

/**
`Y.Router` extension that provides the core plumbing for enhanced navigation
implemented using the pjax technique (HTML5 `pushState` + Ajax).

This makes it easy to enhance the navigation between the URLs of an application
in HTML5 history capable browsers by delegating to the router to fulfill the
"request" and seamlessly falling-back to using standard full-page reloads in
older, less-capable browsers.

The `PjaxBase` class isn't useful on its own, but can be mixed into a
`Router`-based class to add Pjax functionality to that Router. For a pre-made
standalone Pjax router, see the `Pjax` class.

    var MyRouter = Y.Base.create('myRouter', Y.Router, [Y.PjaxBase], {
        // ...
    });

@class PjaxBase
@extensionfor Router
@since 3.5.0
**/
function PjaxBase() {}

PjaxBase.prototype = {
    // -- Protected Properties -------------------------------------------------

    /**
    Holds the delegated pjax-link click handler.

    @property _pjaxEvents
    @type EventHandle
    @protected
    @since 3.5.0
    **/

    /**
    Regex used to break up a URL string around the URL's path.

    Subpattern captures:

      1. Origin, everything before the URL's path-part.
      2. The URL's path-part.
      3. Suffix, everything after the URL's path-part.

    @property _regexURL
    @type RegExp
    @protected
    @since 3.5.0
    **/
    _regexURL: /^((?:[^\/#?:]+:\/\/|\/\/)[^\/]*)?([^?#]*)(\?[^#]*)?(#.*)?$/,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function () {
        this.publish(EVT_NAVIGATE, {defaultFn: this._defNavigateFn});

        // Pjax is all about progressively enhancing the navigation between
        // "pages", so by default we only want to handle and route link clicks
        // in HTML5 `pushState`-compatible browsers.
        if (this.get('html5')) {
            this._pjaxBindUI();
        }
    },

    destructor: function () {
        this._pjaxEvents && this._pjaxEvents.detach();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Navigates to the specified URL if there is a route handler that matches. In
    browsers capable of using HTML5 history, the navigation will be enhanced by
    firing the `navigate` event and having the router handle the "request".
    Non-HTML5 browsers will navigate to the new URL via manipulation of
    `window.location`.

    When there is a route handler for the specified URL and it is being
    navigated to, this method will return `true`, otherwise it will return
    `false`.

    **Note:** The specified URL _must_ be of the same origin as the current URL,
    otherwise an error will be logged and navigation will not occur. This is
    intended as both a security constraint and a purposely imposed limitation as
    it does not make sense to tell the router to navigate to a URL on a
    different scheme, host, or port.

    @method navigate
    @param {String} url The URL to navigate to. This must be of the same origin
      as the current URL.
    @param {Object} [options] Additional options to configure the navigation.
      These are mixed into the `navigate` event facade.
        @param {Boolean} [options.replace] Whether or not the current history
          entry will be replaced, or a new entry will be created. Will default
          to `true` if the specified `url` is the same as the current URL.
        @param {Boolean} [options.force=false] Whether the enhanced navigation
          should occur even in browsers without HTML5 history.
    @return {Boolean} `true` if the URL was navigated to, `false` otherwise.
    @since 3.5.0
    **/
    navigate: function (url, options) {
        // The `_navigate()` method expects fully-resolved URLs.
        url = this._resolveURL(url);

        if (this._navigate(url, options)) {
            return true;
        }

        if (!this._hasSameOrigin(url)) {
            Y.error('Security error: The new URL must be of the same origin as the current URL.');
        }

        return false;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Utility method to test whether a specified link/anchor node's `href` is of
    the same origin as the page's current location.

    This normalize browser inconsistencies with how the `port` is reported for
    anchor elements (IE reports a value for the default port, e.g. "80").

    @method _isLinkSameOrigin
    @param {Node} link The anchor element to test whether its `href` is of the
        same origin as the page's current location.
    @return {Boolean} Whether or not the link's `href` is of the same origin as
        the page's current location.
    @protected
    @since 3.6.0
    **/
    _isLinkSameOrigin: function (link) {
        var location = Y.getLocation(),
            protocol = location.protocol,
            hostname = location.hostname,
            port     = parseInt(location.port, 10) || null,
            linkPort;

        // Link must have the same `protocol` and `hostname` as the page's
        // currrent location.
        if (link.get('protocol') !== protocol ||
                link.get('hostname') !== hostname) {

            return false;
        }

        linkPort = parseInt(link.get('port'), 10) || null;

        // Normalize ports. In most cases browsers use an empty string when the
        // port is the default port, but IE does weird things with anchor
        // elements, so to be sure, this will re-assign the default ports before
        // they are compared.
        if (protocol === 'http:') {
            port     || (port     = 80);
            linkPort || (linkPort = 80);
        } else if (protocol === 'https:') {
            port     || (port     = 443);
            linkPort || (linkPort = 443);
        }

        // Finally, to be from the same origin, the link's `port` must match the
        // page's current `port`.
        return linkPort === port;
    },

    /**
    Underlying implementation for `navigate()`.

    @method _navigate
    @param {String} url The fully-resolved URL that the router should dispatch
      to its route handlers to fulfill the enhanced navigation "request", or use
      to update `window.location` in non-HTML5 history capable browsers.
    @param {Object} [options] Additional options to configure the navigation.
      These are mixed into the `navigate` event facade.
        @param {Boolean} [options.replace] Whether or not the current history
          entry will be replaced, or a new entry will be created. Will default
          to `true` if the specified `url` is the same as the current URL.
        @param {Boolean} [options.force=false] Whether the enhanced navigation
          should occur even in browsers without HTML5 history.
    @return {Boolean} `true` if the URL was navigated to, `false` otherwise.
    @protected
    @since 3.5.0
    **/
    _navigate: function (url, options) {
        url = this._upgradeURL(url);

        // Navigation can only be enhanced if there is a route-handler.
        if (!this.hasRoute(url)) {
            return false;
        }

        // Make a copy of `options` before modifying it.
        options = Y.merge(options, {url: url});

        var currentURL = this._getURL(),
            hash, hashlessURL;

        // Captures the `url`'s hash and returns a URL without that hash.
        hashlessURL = url.replace(/(#.*)$/, function (u, h, i) {
            hash = h;
            return u.substring(i);
        });

        if (hash && hashlessURL === currentURL.replace(/#.*$/, '')) {
            // When the specified `url` and current URL only differ by the hash,
            // the browser should handle this in-page navigation normally.
            if (!this.get('navigateOnHash')) {
                return false;
            }

            options.hash = hash;
        }

        // When navigating to the same URL as the current URL, behave like a
        // browser and replace the history entry instead of creating a new one.
        'replace' in options || (options.replace = url === currentURL);

        // The `navigate` event will only fire and therefore enhance the
        // navigation to the new URL in HTML5 history enabled browsers or when
        // forced. Otherwise it will fallback to assigning or replacing the URL
        // on `window.location`.
        if (this.get('html5') || options.force) {
            this.fire(EVT_NAVIGATE, options);
        } else {
            if (options.replace) {
                win && win.location.replace(url);
            } else {
                win && (win.location = url);
            }
        }

        return true;
    },

    /**
    Binds the delegation of link-click events that match the `linkSelector` to
    the `_onLinkClick()` handler.

    By default this method will only be called if the browser is capable of
    using HTML5 history.

    @method _pjaxBindUI
    @protected
    @since 3.5.0
    **/
    _pjaxBindUI: function () {
        // Only bind link if we haven't already.
        if (!this._pjaxEvents) {
            this._pjaxEvents = Y.one('body').delegate('click',
                this._onLinkClick, this.get('linkSelector'), this);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Default handler for the `navigate` event.

    Adds a new history entry or replaces the current entry for the specified URL
    and will scroll the page to the top if configured to do so.

    @method _defNavigateFn
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _defNavigateFn: function (e) {
        this[e.replace ? 'replace' : 'save'](e.url);

        if (win && this.get('scrollToTop')) {
            // Scroll to the top of the page. The timeout ensures that the
            // scroll happens after navigation begins, so that the current
            // scroll position will be restored if the user clicks the back
            // button.
            setTimeout(function () {
                win.scroll(0, 0);
            }, 1);
        }
    },

    /**
    Handler for delegated link-click events which match the `linkSelector`.

    This will attempt to enhance the navigation to the link element's `href` by
    passing the URL to the `_navigate()` method. When the navigation is being
    enhanced, the default action is prevented.

    If the user clicks a link with the middle/right mouse buttons, or is holding
    down the Ctrl or Command keys, this method's behavior is not applied and
    allows the native behavior to occur. Similarly, if the router is not capable
    or handling the URL because no route-handlers match, the link click will
    behave natively.

    @method _onLinkClick
    @param {EventFacade} e
    @protected
    @since 3.5.0
    **/
    _onLinkClick: function (e) {
        var link, url;

        // Allow the native behavior on middle/right-click, or when Ctrl or
        // Command are pressed.
        if (e.button !== 1 || e.ctrlKey || e.metaKey) { return; }

        link = e.currentTarget;

        // Only allow anchor elements because we need access to its `protocol`,
        // `host`, and `href` attributes.
        if (link.get('tagName').toUpperCase() !== 'A') {
            return;
        }

        // Same origin check to prevent trying to navigate to URLs from other
        // sites or things like mailto links.
        if (!this._isLinkSameOrigin(link)) {
            return;
        }

        // All browsers fully resolve an anchor's `href` property.
        url = link.get('href');

        // Try and navigate to the URL via the router, and prevent the default
        // link-click action if we do.
        url && this._navigate(url, {originEvent: e}) && e.preventDefault();
    }
};

PjaxBase.ATTRS = {
    /**
    CSS selector string used to filter link click events so that only the links
    which match it will have the enhanced navigation behavior of Pjax applied.

    When a link is clicked and that link matches this selector, Pjax will
    attempt to dispatch to any route handlers matching the link's `href` URL. If
    HTML5 history is not supported or if no route handlers match, the link click
    will be handled by the browser just like any old link.

    @attribute linkSelector
    @type String|Function
    @default "a.yui3-pjax"
    @initOnly
    @since 3.5.0
    **/
    linkSelector: {
        value    : 'a.' + CLASS_PJAX,
        writeOnce: 'initOnly'
    },

    /**
    Whether navigating to a hash-fragment identifier on the current page should
    be enhanced and cause the `navigate` event to fire.

    By default Pjax allows the browser to perform its default action when a user
    is navigating within a page by clicking in-page links
    (e.g. `<a href="#top">Top of page</a>`) and does not attempt to interfere or
    enhance in-page navigation.

    @attribute navigateOnHash
    @type Boolean
    @default false
    @since 3.5.0
    **/
    navigateOnHash: {
        value: false
    },

    /**
    Whether the page should be scrolled to the top after navigating to a URL.

    When the user clicks the browser's back button, the previous scroll position
    will be maintained.

    @attribute scrollToTop
    @type Boolean
    @default true
    @since 3.5.0
    **/
    scrollToTop: {
        value: true
    }
};

Y.PjaxBase = PjaxBase;


}, '3.7.3', {"requires": ["classnamemanager", "node-event-delegate", "router"]});
