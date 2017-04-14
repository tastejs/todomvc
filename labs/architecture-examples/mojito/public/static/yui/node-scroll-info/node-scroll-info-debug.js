/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('node-scroll-info', function (Y, NAME) {

/**
Provides the ScrollInfo Node plugin, which exposes convenient events and methods
related to scrolling.

@module node-scroll-info
@since 3.7.0
**/

/**
Provides convenient events and methods related to scrolling. This could be used,
for example, to implement infinite scrolling, or to lazy-load content based on
the current scroll position.

### Example

    var body = Y.one('body');

    body.plug(Y.Plugin.ScrollInfo);

    body.scrollInfo.on('scrollToBottom', function (e) {
        // Load more content when the user scrolls to the bottom of the page.
    });

@class Plugin.ScrollInfo
@extends Plugin.Base
@since 3.7.0
**/

/**
Fired when the user scrolls within the host node.

This event (like all scroll events exposed by ScrollInfo) is throttled and fired
only after the number of milliseconds specified by the `scrollDelay` attribute
have passed in order to prevent thrashing.

This event passes along the event facade for the standard DOM `scroll` event and
mixes in the following additional properties.

@event scroll
@param {Boolean} atBottom Whether the current scroll position is at the bottom
    of the scrollable region.
@param {Boolean} atLeft Whether the current scroll position is at the extreme
    left of the scrollable region.
@param {Boolean} atRight Whether the current scroll position is at the extreme
    right of the scrollable region.
@param {Boolean} atTop Whether the current scroll position is at the top of the
    scrollable region.
@param {Boolean} isScrollDown `true` if the user scrolled down.
@param {Boolean} isScrollLeft `true` if the user scrolled left.
@param {Boolean} isScrollRight `true` if the user scrolled right.
@param {Boolean} isScrollUp `true` if the user scrolled up.
@param {Number} scrollBottom Y value of the bottom-most onscreen pixel of the
    scrollable region.
@param {Number} scrollHeight Total height in pixels of the scrollable region,
    including offscreen pixels.
@param {Number} scrollLeft X value of the left-most onscreen pixel of the
    scrollable region.
@param {Number} scrollRight X value of the right-most onscreen pixel of the
    scrollable region.
@param {Number} scrollTop Y value of the top-most onscreen pixel of the
    scrollable region.
@param {Number} scrollWidth Total width in pixels of the scrollable region,
    including offscreen pixels.
@see scrollDelay
@see scrollMargin
**/
var EVT_SCROLL = 'scroll',

    /**
    Fired when the user scrolls down within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollDown
    @see scroll
    **/
    EVT_SCROLL_DOWN = 'scrollDown',

    /**
    Fired when the user scrolls left within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollLeft
    @see scroll
    **/
    EVT_SCROLL_LEFT = 'scrollLeft',

    /**
    Fired when the user scrolls right within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollRight
    @see scroll
    **/
    EVT_SCROLL_RIGHT = 'scrollRight',

    /**
    Fired when the user scrolls up within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollUp
    @see scroll
    **/
    EVT_SCROLL_UP = 'scrollUp',

    /**
    Fired when the user scrolls to the bottom of the scrollable region within
    the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollToBottom
    @see scroll
    **/
    EVT_SCROLL_TO_BOTTOM = 'scrollToBottom',

    /**
    Fired when the user scrolls to the extreme left of the scrollable region
    within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollToLeft
    @see scroll
    **/
    EVT_SCROLL_TO_LEFT = 'scrollToLeft',

    /**
    Fired when the user scrolls to the extreme right of the scrollable region
    within the host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollToRight
    @see scroll
    **/
    EVT_SCROLL_TO_RIGHT = 'scrollToRight',

    /**
    Fired when the user scrolls to the top of the scrollable region within the
    host node.

    This event provides the same event facade as the `scroll` event. See that
    event for details.

    @event scrollToTop
    @see scroll
    **/
    EVT_SCROLL_TO_TOP = 'scrollToTop';

Y.Plugin.ScrollInfo = Y.Base.create('scrollInfoPlugin', Y.Plugin.Base, [], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        // Cache for quicker lookups in the critical path.
        this._host         = config.host;
        this._hostIsBody   = this._host.get('nodeName').toLowerCase() === 'body';
        this._scrollDelay  = this.get('scrollDelay');
        this._scrollMargin = this.get('scrollMargin');
        this._scrollNode   = this._getScrollNode();

        this.refreshDimensions();

        this._lastScroll = this.getScrollInfo();

        this._bind();
    },

    destructor: function () {
        (new Y.EventHandle(this._events)).detach();
        delete this._events;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns a NodeList containing all offscreen nodes inside the host node that
    match the given CSS selector. An offscreen node is any node that is entirely
    outside the visible (onscreen) region of the host node based on the current
    scroll location.

    @method getOffscreenNodes
    @param {String} [selector] CSS selector. If omitted, all offscreen nodes
        will be returned.
    @param {Number} [margin] Additional margin in pixels beyond the actual
        onscreen region that should be considered "onscreen" for the purposes of
        this query. Defaults to the value of the `scrollMargin` attribute.
    @return {NodeList} Offscreen nodes matching _selector_.
    @see scrollMargin
    **/
    getOffscreenNodes: function (selector, margin) {
        if (typeof margin === 'undefined') {
            margin = this._scrollMargin;
        }

        var lastScroll = this._lastScroll,
            nodes      = this._host.all(selector || '*'),

            scrollBottom = lastScroll.scrollBottom + margin,
            scrollLeft   = lastScroll.scrollLeft - margin,
            scrollRight  = lastScroll.scrollRight + margin,
            scrollTop    = lastScroll.scrollTop - margin,

            self = this;

        return nodes.filter(function (el) {
            var xy     = Y.DOM.getXY(el),
                elLeft = xy[0] - self._left,
                elTop  = xy[1] - self._top,
                elBottom, elRight;

            // Check whether the element's top left point is within the
            // viewport. This is the least expensive check.
            if (elLeft >= scrollLeft && elLeft < scrollRight &&
                    elTop >= scrollTop && elTop < scrollBottom) {

                return false;
            }

            // Check whether the element's bottom right point is within the
            // viewport. This check is more expensive since we have to get the
            // element's height and width.
            elBottom = elTop + el.offsetHeight;
            elRight  = elLeft + el.offsetWidth;

            if (elRight < scrollRight && elRight >= scrollLeft &&
                    elBottom < scrollBottom && elBottom >= scrollTop) {

                return false;
            }

            // If we get here, the element isn't within the viewport.
            return true;
        });
    },

    /**
    Returns a NodeList containing all onscreen nodes inside the host node that
    match the given CSS selector. An onscreen node is any node that is fully or
    partially within the visible (onscreen) region of the host node based on the
    current scroll location.

    @method getOnscreenNodes
    @param {String} [selector] CSS selector. If omitted, all onscreen nodes will
        be returned.
    @param {Number} [margin] Additional margin in pixels beyond the actual
        onscreen region that should be considered "onscreen" for the purposes of
        this query. Defaults to the value of the `scrollMargin` attribute.
    @return {NodeList} Onscreen nodes matching _selector_.
    @see scrollMargin
    **/
    getOnscreenNodes: function (selector, margin) {
        if (typeof margin === 'undefined') {
            margin = this._scrollMargin;
        }

        var lastScroll = this._lastScroll,
            nodes      = this._host.all(selector || '*'),

            scrollBottom = lastScroll.scrollBottom + margin,
            scrollLeft   = lastScroll.scrollLeft - margin,
            scrollRight  = lastScroll.scrollRight + margin,
            scrollTop    = lastScroll.scrollTop - margin,

            self = this;

        return nodes.filter(function (el) {
            var xy     = Y.DOM.getXY(el),
                elLeft = xy[0] - self._left,
                elTop  = xy[1] - self._top,
                elBottom, elRight;

            // Check whether the element's top left point is within the
            // viewport. This is the least expensive check.
            if (elLeft >= scrollLeft && elLeft < scrollRight &&
                    elTop >= scrollTop && elTop < scrollBottom) {

                return true;
            }

            // Check whether the element's bottom right point is within the
            // viewport. This check is more expensive since we have to get the
            // element's height and width.
            elBottom = elTop + el.offsetHeight;
            elRight  = elLeft + el.offsetWidth;

            if (elRight < scrollRight && elRight >= scrollLeft &&
                    elBottom < scrollBottom && elBottom >= scrollTop) {

                return true;
            }

            // If we get here, the element isn't within the viewport.
            return false;
        });
    },

    /**
    Returns an object hash containing information about the current scroll
    position of the host node. This is the same information that's mixed into
    the event facade of the `scroll` event and other scroll-related events.

    @method getScrollInfo
    @return {Object} Object hash containing information about the current scroll
        position. See the `scroll` event for details on what properties this
        object contains.
    @see scroll
    **/
    getScrollInfo: function () {
        var domNode    = this._scrollNode,
            lastScroll = this._lastScroll,
            margin     = this._scrollMargin,

            scrollLeft   = domNode.scrollLeft,
            scrollHeight = domNode.scrollHeight,
            scrollTop    = domNode.scrollTop,
            scrollWidth  = domNode.scrollWidth,

            scrollBottom = scrollTop + this._height,
            scrollRight  = scrollLeft + this._width;

        return {
            atBottom: scrollBottom > (scrollHeight - margin),
            atLeft  : scrollLeft < margin,
            atRight : scrollRight > (scrollWidth - margin),
            atTop   : scrollTop < margin,

            isScrollDown : lastScroll && scrollTop > lastScroll.scrollTop,
            isScrollLeft : lastScroll && scrollLeft < lastScroll.scrollLeft,
            isScrollRight: lastScroll && scrollLeft > lastScroll.scrollLeft,
            isScrollUp   : lastScroll && scrollTop < lastScroll.scrollTop,

            scrollBottom: scrollBottom,
            scrollHeight: scrollHeight,
            scrollLeft  : scrollLeft,
            scrollRight : scrollRight,
            scrollTop   : scrollTop,
            scrollWidth : scrollWidth
        };
    },

    /**
    Refreshes cached position, height, and width dimensions for the host node.
    If the host node is the body, then the viewport height and width will be
    used.

    This info is cached to improve performance during scroll events, since it's
    expensive to touch the DOM for these values. Dimensions are automatically
    refreshed whenever the browser is resized, but if you change the dimensions
    or position of the host node in JS, you may need to call
    `refreshDimensions()` manually to cache the new dimensions.

    @method refreshDimensions
    **/
    refreshDimensions: function () {
        // WebKit only returns reliable scroll info on the body, and only
        // returns reliable height/width info on the documentElement, so we
        // have to special-case it (see the other special case in
        // _getScrollNode()).
        //
        // On iOS devices, documentElement.clientHeight/Width aren't reliable,
        // but window.innerHeight/Width are. And no, dom-screen's viewport size
        // methods don't account for this, which is why we do it here.

        var hostIsBody = this._hostIsBody,
            iosHack    = hostIsBody && Y.UA.ios,
            win        = Y.config.win,
            el;

        if (hostIsBody && Y.UA.webkit) {
            el = Y.config.doc.documentElement;
        } else {
            el = this._scrollNode;
        }

        this._height = iosHack ? win.innerHeight : el.clientHeight;
        this._left   = el.offsetLeft;
        this._top    = el.offsetTop;
        this._width  = iosHack ? win.innerWidth : el.clientWidth;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Binds event handlers.

    @method _bind
    @protected
    **/
    _bind: function () {
        var winNode = Y.one('win');

        this._events = [
            this.after({
                scrollDelayChange : this._afterScrollDelayChange,
                scrollMarginChange: this._afterScrollMarginChange
            }),

            winNode.on('windowresize', this._afterResize, this),

            // If we're attached to the body, listen for the scroll event on the
            // window, since <body> doesn't have a scroll event.
            (this._hostIsBody ? winNode : this._host).after(
                'scroll', this._afterScroll, this)
        ];
    },

    /**
    Returns the DOM node that should be used to lookup scroll coordinates. In
    some browsers, the `<body>` element doesn't return scroll coordinates, and
    the documentElement must be used instead; this method takes care of
    determining which node should be used.

    @method _getScrollNode
    @return {HTMLElement} DOM node.
    @protected
    **/
    _getScrollNode: function () {
        // WebKit returns scroll coordinates on the body element, but other
        // browsers don't, so we have to use the documentElement.
        return this._hostIsBody && !Y.UA.webkit ? Y.config.doc.documentElement :
                Y.Node.getDOMNode(this._host);
    },

    /**
    Mixes detailed scroll information into the given DOM `scroll` event facade
    and fires appropriate local events.

    @method _triggerScroll
    @param {EventFacade} e Event facade from the DOM `scroll` event.
    @protected
    **/
    _triggerScroll: function (e) {
        var info       = this.getScrollInfo(),
            facade     = Y.merge(e, info),
            lastScroll = this._lastScroll;

        this._lastScroll = info;

        this.fire(EVT_SCROLL, facade);

        if (info.isScrollLeft) {
            this.fire(EVT_SCROLL_LEFT, facade);
        } else if (info.isScrollRight) {
            this.fire(EVT_SCROLL_RIGHT, facade);
        }

        if (info.isScrollUp) {
            this.fire(EVT_SCROLL_UP, facade);
        } else if (info.isScrollDown) {
            this.fire(EVT_SCROLL_DOWN, facade);
        }

        if (info.atBottom && (!lastScroll.atBottom ||
                info.scrollHeight > lastScroll.scrollHeight)) {

            this.fire(EVT_SCROLL_TO_BOTTOM, facade);
        }

        if (info.atLeft && !lastScroll.atLeft) {
            this.fire(EVT_SCROLL_TO_LEFT, facade);
        }

        if (info.atRight && (!lastScroll.atRight ||
                info.scrollWidth > lastScroll.scrollWidth)) {

            this.fire(EVT_SCROLL_TO_RIGHT, facade);
        }

        if (info.atTop && !lastScroll.atTop) {
            this.fire(EVT_SCROLL_TO_TOP, facade);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles browser resize events.

    @method _afterResize
    @param {EventFacade} e
    @protected
    **/
    _afterResize: function (e) {
        this.refreshDimensions();
    },

    /**
    Handles DOM `scroll` events.

    @method _afterScroll
    @param {EventFacade} e
    @protected
    **/
    _afterScroll: function (e) {
        var self = this;

        clearTimeout(this._scrollTimeout);

        this._scrollTimeout = setTimeout(function () {
            self._triggerScroll(e);
        }, this._scrollDelay);
    },

    /**
    Caches the `scrollDelay` value after that attribute changes to allow
    quicker lookups in critical path code.

    @method _afterScrollDelayChange
    @param {EventFacade} e
    @protected
    **/
    _afterScrollDelayChange: function (e) {
        this._scrollDelay = e.newVal;
    },

    /**
    Caches the `scrollMargin` value after that attribute changes to allow
    quicker lookups in critical path code.

    @method _afterScrollMarginChange
    @param {EventFacade} e
    @protected
    **/
    _afterScrollMarginChange: function (e) {
        this._scrollMargin = e.newVal;
    }
}, {
    NS: 'scrollInfo',

    ATTRS: {
        /**
        Number of milliseconds to wait after a native `scroll` event before
        firing local scroll events. If another native scroll event occurs during
        this time, previous events will be ignored. This ensures that we don't
        fire thousands of events when the user is scrolling quickly.

        @attribute scrollDelay
        @type Number
        @default 50
        **/
        scrollDelay: {
            value: 50
        },

        /**
        Additional margin in pixels beyond the onscreen region of the host node
        that should be considered "onscreen".

        For example, if set to 50, then a `scrollToBottom` event would be fired
        when the user scrolls to within 50 pixels of the bottom of the
        scrollable region, even if they don't actually scroll completely to the
        very bottom pixel.

        This margin also applies to the `getOffscreenNodes()` and
        `getOnscreenNodes()` methods by default.

        @attribute scrollMargin
        @type Number
        @default 50
        **/
        scrollMargin: {
            value: 50
        }
    }
});


}, '3.7.3', {"requires": ["base-build", "dom-screen", "event-resize", "node-pluginhost", "plugin"]});
