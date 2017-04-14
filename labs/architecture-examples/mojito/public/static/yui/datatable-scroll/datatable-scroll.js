/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatable-scroll', function (Y, NAME) {

/**
Adds the ability to make the table rows scrollable while preserving the header
placement.

@module datatable-scroll
@for DataTable
@since 3.5.0
**/
var YLang = Y.Lang,
    isString = YLang.isString,
    isNumber = YLang.isNumber,
    isArray  = YLang.isArray,

    Scrollable;

// Returns the numeric value portion of the computed style, defaulting to 0
function styleDim(node, style) {
    return parseInt(node.getComputedStyle(style), 10) | 0;
}

/**
_API docs for this extension are included in the DataTable class._

Adds the ability to make the table rows scrollable while preserving the header
placement.

There are two types of scrolling, horizontal (x) and vertical (y).  Horizontal
scrolling is achieved by wrapping the entire table in a scrollable container.
Vertical scrolling is achieved by splitting the table headers and data into two
separate tables, the latter of which is wrapped in a vertically scrolling
container.  In this case, column widths of header cells and data cells are kept
in sync programmatically.

Since the split table synchronization can be costly at runtime, the split is only done if the data in the table stretches beyond the configured `height` value.

To activate or deactivate scrolling, set the `scrollable` attribute to one of
the following values:

 * `false` - (default) Scrolling is disabled.
 * `true` or 'xy' - If `height` is set, vertical scrolling will be activated, if
            `width` is set, horizontal scrolling will be activated.
 * 'x' - Activate horizontal scrolling only. Requires the `width` attribute is
         also set.
 * 'y' - Activate vertical scrolling only. Requires the `height` attribute is
         also set.

@class DataTable.Scrollable
@for DataTable
@since 3.5.0
**/
Y.DataTable.Scrollable = Scrollable = function () {};

Scrollable.ATTRS = {
    /**
    Activates or deactivates scrolling in the table.  Acceptable values are:

     * `false` - (default) Scrolling is disabled.
     * `true` or 'xy' - If `height` is set, vertical scrolling will be
       activated, if `width` is set, horizontal scrolling will be activated.
     * 'x' - Activate horizontal scrolling only. Requires the `width` attribute
       is also set.
     * 'y' - Activate vertical scrolling only. Requires the `height` attribute
       is also set.

    @attribute scrollable
    @type {String|Boolean}
    @value false
    @since 3.5.0
    **/
    scrollable: {
        value: false,
        setter: '_setScrollable'
    }
};

Y.mix(Scrollable.prototype, {

    /**
    Scrolls a given row or cell into view if the table is scrolling.  Pass the
    `clientId` of a Model from the DataTable's `data` ModelList or its row
    index to scroll to a row or a [row index, column index] array to scroll to
    a cell.  Alternately, to scroll to any element contained within the table's
    scrolling areas, pass its ID, or the Node itself (though you could just as
    well call `node.scrollIntoView()` yourself, but hey, whatever).

    @method scrollTo
    @param {String|Number|Number[]|Node} id A row clientId, row index, cell
            coordinate array, id string, or Node
    @return {DataTable}
    @chainable
    @since 3.5.0
    **/
    scrollTo: function (id) {
        var target;

        if (id && this._tbodyNode && (this._yScrollNode || this._xScrollNode)) {
            if (isArray(id)) {
                target = this.getCell(id);
            } else if (isNumber(id)) { 
                target = this.getRow(id);
            } else if (isString(id)) {
                target = this._tbodyNode.one('#' + id);
            } else if (id instanceof Y.Node &&
                    // TODO: ancestor(yScrollNode, xScrollNode)
                    id.ancestor('.yui3-datatable') === this.get('boundingBox')) {
                target = id;
            }

            target && target.scrollIntoView();
        }

        return this;
    },

    //--------------------------------------------------------------------------
    // Protected properties and methods
    //--------------------------------------------------------------------------

    /**
    Template for the `<table>` that is used to fix the caption in place when
    the table is horizontally scrolling.

    @property _CAPTION_TABLE_TEMPLATE
    @type {HTML}
    @value '<table class="{className}" role="presentation"></table>'
    @protected
    @since 3.5.0
    **/
    _CAPTION_TABLE_TEMPLATE: '<table class="{className}" role="presentation"></table>',

    /**
    Template used to create sizable element liners around header content to
    synchronize fixed header column widths.

    @property _SCROLL_LINER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"></div>'
    @protected
    @since 3.5.0
    **/
    _SCROLL_LINER_TEMPLATE: '<div class="{className}"></div>',

    /**
    Template for the virtual scrollbar needed in "y" and "xy" scrolling setups.

    @property _SCROLLBAR_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"><div></div></div>'
    @protected
    @since 3.5.0
    **/
    _SCROLLBAR_TEMPLATE: '<div class="{className}"><div></div></div>',

    /**
    Template for the `<div>` that is used to contain the table when the table is
    horizontally scrolling.

    @property _X_SCROLLER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"></div>'
    @protected
    @since 3.5.0
    **/
    _X_SCROLLER_TEMPLATE: '<div class="{className}"></div>',

    /**
    Template for the `<table>` used to contain the fixed column headers for
    vertically scrolling tables.

    @property _Y_SCROLL_HEADER_TEMPLATE
    @type {HTML}
    @value '<table cellspacing="0" role="presentation" aria-hidden="true" class="{className}"></table>'
    @protected
    @since 3.5.0
    **/
    _Y_SCROLL_HEADER_TEMPLATE: '<table cellspacing="0" aria-hidden="true" class="{className}"></table>',

    /**
    Template for the `<div>` that is used to contain the rows when the table is
    vertically scrolling.

    @property _Y_SCROLLER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"><div class="{scrollerClassName}"></div></div>'
    @protected
    @since 3.5.0
    **/
    _Y_SCROLLER_TEMPLATE: '<div class="{className}"><div class="{scrollerClassName}"></div></div>',

    /**
    Adds padding to the last cells in the fixed header for vertically scrolling
    tables.  This padding is equal in width to the scrollbar, so can't be
    relegated to a stylesheet.

    @method _addScrollbarPadding
    @protected
    @since 3.5.0
    **/
    _addScrollbarPadding: function () {
        var fixedHeader = this._yScrollHeader,
            headerClass = '.' + this.getClassName('header'),
            scrollbarWidth, rows, header, i, len;

        if (fixedHeader) {
            scrollbarWidth = Y.DOM.getScrollbarWidth() + 'px';
            rows = fixedHeader.all('tr');

            for (i = 0, len = rows.size(); i < len; i += +header.get('rowSpan')) {
                header = rows.item(i).all(headerClass).pop();
                header.setStyle('paddingRight', scrollbarWidth);
            }
        }
    },

    /**
    Reacts to changes in the `scrollable` attribute by updating the `_xScroll`
    and `_yScroll` properties and syncing the scrolling structure accordingly.

    @method _afterScrollableChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollableChange: function (e) {
        var scroller = this._xScrollNode;

        if (this._xScroll && scroller) {
            if (this._yScroll && !this._yScrollNode) {
                scroller.setStyle('paddingRight',
                    Y.DOM.getScrollbarWidth() + 'px');
            } else if (!this._yScroll && this._yScrollNode) {
                scroller.setStyle('paddingRight', '');
            }
        }

        this._syncScrollUI();
    },

    /**
    Reacts to changes in the `caption` attribute by adding, removing, or
    syncing the caption table when the table is set to scroll.

    @method _afterScrollCaptionChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollCaptionChange: function (e) {
        if (this._xScroll || this._yScroll) {
            this._syncScrollUI();
        }
    },

    /**
    Reacts to changes in the `columns` attribute of vertically scrolling tables
    by refreshing the fixed headers, scroll container, and virtual scrollbar
    position.

    @method _afterScrollColumnsChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollColumnsChange: function (e) {
        if (this._xScroll || this._yScroll) {
            if (this._yScroll && this._yScrollHeader) {
                this._syncScrollHeaders();
            }

            this._syncScrollUI();
        }
    },

    /**
    Reacts to changes in vertically scrolling table's `data` ModelList by
    synchronizing the fixed column header widths and virtual scrollbar height.

    @method _afterScrollDataChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollDataChange: function (e) {
        if (this._xScroll || this._yScroll) {
            this._syncScrollUI();
        }
    },

    /**
    Reacts to changes in the `height` attribute of vertically scrolling tables
    by updating the height of the `<div>` wrapping the data table and the
    virtual scrollbar.  If `scrollable` was set to "y" or "xy" but lacking a
    declared `height` until the received change, `_syncScrollUI` is called to
    create the fixed headers etc.

    @method _afterScrollHeightChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollHeightChange: function (e) {
        if (this._yScroll) {
            this._syncScrollUI();
        }
    },

    /* (not an API doc comment on purpose)
    Reacts to the sort event (if the table is also sortable) by updating the
    fixed header classes to match the data table's headers.

    THIS IS A HACK that will be removed immediately after the 3.5.0 release.
    If you're reading this and the current version is greater than 3.5.0, I
    should be publicly scolded.
    */
    _afterScrollSort: function (e) {
        var headers, headerClass;

        if (this._yScroll && this._yScrollHeader) {
            headerClass = '.' + this.getClassName('header');
            headers = this._theadNode.all(headerClass);

            this._yScrollHeader.all(headerClass).each(function (header, i) {
                header.set('className', headers.item(i).get('className'));
            });
        }
    },

    /**
    Reacts to changes in the width of scrolling tables by expanding the width of
    the `<div>` wrapping the data table for horizontally scrolling tables or
    upding the position of the virtual scrollbar for vertically scrolling
    tables.

    @method _afterScrollWidthChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    @since 3.5.0
    **/
    _afterScrollWidthChange: function (e) {
        if (this._xScroll || this._yScroll) {
            this._syncScrollUI();
        }
    },

    /**
    Binds virtual scrollbar interaction to the `_yScrollNode`'s `scrollTop` and
    vice versa.

    @method _bindScrollbar
    @protected
    @since 3.5.0
    **/
    _bindScrollbar: function () {
        var scrollbar = this._scrollbarNode,
            scroller  = this._yScrollNode;

        if (scrollbar && scroller && !this._scrollbarEventHandle) {
            this._scrollbarEventHandle = new Y.Event.Handle([
                scrollbar.on('scroll', this._syncScrollPosition, this),
                scroller.on('scroll', this._syncScrollPosition, this)
            ]);
        }
    },

    /**
    Binds to the window resize event to update the vertical scrolling table
    headers and wrapper `<div>` dimensions.

    @method _bindScrollResize
    @protected
    @since 3.5.0
    **/
    _bindScrollResize: function () {
        if (!this._scrollResizeHandle) {
            // TODO: sync header widths and scrollbar position.  If the height
            // of the headers has changed, update the scrollbar dims as well.
            this._scrollResizeHandle = Y.on('resize',
                this._syncScrollUI, null, this);
        }
    },

    /**
    Attaches internal subscriptions to keep the scrolling structure up to date
    with changes in the table's `data`, `columns`, `caption`, or `height`.  The
    `width` is taken care of already.

    This executes after the table's native `bindUI` method.

    @method _bindScrollUI
    @protected
    @since 3.5.0
    **/
    _bindScrollUI: function () {
        this.after({
            columnsChange: Y.bind('_afterScrollColumnsChange', this),
            heightChange : Y.bind('_afterScrollHeightChange', this),
            widthChange  : Y.bind('_afterScrollWidthChange', this),
            captionChange: Y.bind('_afterScrollCaptionChange', this),
            scrollableChange: Y.bind('_afterScrollableChange', this),
            // FIXME: this is a last minute hack to work around the fact that
            // DT doesn't use a tableView to render table content that can be
            // replaced with a scrolling table view.  This must be removed asap!
            sort         : Y.bind('_afterScrollSort', this)
        });

        this.after(['dataChange', '*:add', '*:remove', '*:reset', '*:change'],
            Y.bind('_afterScrollDataChange', this));
    },

    /**
    Clears the lock and timer used to manage synchronizing the scroll position
    between the vertical scroll container and the virtual scrollbar.

    @method _clearScrollLock
    @protected
    @since 3.5.0
    **/
    _clearScrollLock: function () {
        if (this._scrollLock) {
            this._scrollLock.cancel();
            delete this._scrollLock;
        }
    },

    /**
    Creates a virtual scrollbar from the `_SCROLLBAR_TEMPLATE`, assigning it to
    the `_scrollbarNode` property.

    @method _createScrollbar
    @return {Node} The created Node
    @protected
    @since 3.5.0
    **/
    _createScrollbar: function () {
        var scrollbar = this._scrollbarNode;

        if (!scrollbar) {
            scrollbar = this._scrollbarNode = Y.Node.create(
                Y.Lang.sub(this._SCROLLBAR_TEMPLATE, {
                    className: this.getClassName('scrollbar')
                }));

            // IE 6-10 require the scrolled area to be visible (at least 1px)
            // or they don't respond to clicking on the scrollbar rail or arrows
            scrollbar.setStyle('width', (Y.DOM.getScrollbarWidth() + 1) + 'px');
        }

        return scrollbar;
    },

    /**
    Creates a separate table to contain the caption when the table is
    configured to scroll vertically or horizontally.

    @method _createScrollCaptionTable
    @return {Node} The created Node
    @protected
    @since 3.5.0
    **/
    _createScrollCaptionTable: function () {
        if (!this._captionTable) {
            this._captionTable = Y.Node.create(
                Y.Lang.sub(this._CAPTION_TABLE_TEMPLATE, {
                    className: this.getClassName('caption', 'table')
                }));

            this._captionTable.empty();
        }

        return this._captionTable;
    },

    /**
    Populates the `_xScrollNode` property by creating the `<div>` Node described
    by the `_X_SCROLLER_TEMPLATE`.

    @method _createXScrollNode
    @return {Node} The created Node
    @protected
    @since 3.5.0
    **/
    _createXScrollNode: function () {
        if (!this._xScrollNode) {
            this._xScrollNode = Y.Node.create(
                Y.Lang.sub(this._X_SCROLLER_TEMPLATE, {
                    className: this.getClassName('x','scroller')
                }));
        }

        return this._xScrollNode;
    },

    /**
    Populates the `_yScrollHeader` property by creating the `<table>` Node
    described by the `_Y_SCROLL_HEADER_TEMPLATE`.

    @method _createYScrollHeader
    @return {Node} The created Node
    @protected
    @since 3.5.0
    **/
    _createYScrollHeader: function () {
        var fixedHeader = this._yScrollHeader;

        if (!fixedHeader) {
            fixedHeader = this._yScrollHeader = Y.Node.create(
                Y.Lang.sub(this._Y_SCROLL_HEADER_TEMPLATE, {
                    className: this.getClassName('scroll','columns')
                }));
        }

        return fixedHeader;
    },

    /**
    Populates the `_yScrollNode` property by creating the `<div>` Node described
    by the `_Y_SCROLLER_TEMPLATE`.

    @method _createYScrollNode
    @return {Node} The created Node
    @protected
    @since 3.5.0
    **/
    _createYScrollNode: function () {
        var scrollerClass;

        if (!this._yScrollNode) {
            scrollerClass = this.getClassName('y', 'scroller');

            this._yScrollContainer = Y.Node.create(
                Y.Lang.sub(this._Y_SCROLLER_TEMPLATE, {
                    className: this.getClassName('y','scroller','container'),
                    scrollerClassName: scrollerClass
                }));

            this._yScrollNode = this._yScrollContainer
                .one('.' + scrollerClass);
        }

        return this._yScrollContainer;
    },

    /**
    Removes the nodes used to create horizontal and vertical scrolling and
    rejoins the caption to the main table if needed.

    @method _disableScrolling
    @protected
    @since 3.5.0
    **/
    _disableScrolling: function () {
        this._removeScrollCaptionTable();
        this._disableXScrolling();
        this._disableYScrolling();
        this._unbindScrollResize();

        this._uiSetWidth(this.get('width'));
    },

    /**
    Removes the nodes used to allow horizontal scrolling.

    @method _disableXScrolling
    @protected
    @since 3.5.0
    **/
    _disableXScrolling: function () {
        this._removeXScrollNode();
    },

    /**
    Removes the nodes used to allow vertical scrolling.

    @method _disableYScrolling
    @protected
    @since 3.5.0
    **/
    _disableYScrolling: function () {
        this._removeYScrollHeader();
        this._removeYScrollNode();
        this._removeYScrollContainer();
        this._removeScrollbar();
    },

    /**
    Cleans up external event subscriptions.

    @method destructor
    @protected
    @since 3.5.0
    **/
    destructor: function () {
        this._unbindScrollbar();
        this._unbindScrollResize();
        this._clearScrollLock();
    },

    /**
    Sets up event handlers and AOP advice methods to bind the DataTable's natural
    behaviors with the scrolling APIs and state.

    @method initializer
    @param {Object} config The config object passed to the constructor (ignored)
    @protected
    @since 3.5.0
    **/
    initializer: function () {
        this._setScrollProperties();

        this.after(['scrollableChange', 'heightChange', 'widthChange'],
            this._setScrollProperties);

        this.after('renderView', Y.bind('_syncScrollUI', this));

        Y.Do.after(this._bindScrollUI, this, 'bindUI');
    },

    /**
    Removes the table used to house the caption when the table is scrolling.

    @method _removeScrollCaptionTable
    @protected
    @since 3.5.0
    **/
    _removeScrollCaptionTable: function () {
        if (this._captionTable) {
            if (this._captionNode) {
                this._tableNode.prepend(this._captionNode);
            }

            this._captionTable.remove().destroy(true);

            delete this._captionTable;
        }
    },

    /**
    Removes the `<div>` wrapper used to contain the data table when the table
    is horizontally scrolling.

    @method _removeXScrollNode
    @protected
    @since 3.5.0
    **/
    _removeXScrollNode: function () {
        var scroller = this._xScrollNode;

        if (scroller) {
            scroller.replace(scroller.get('childNodes').toFrag());
            scroller.remove().destroy(true);

            delete this._xScrollNode;
        }
    },

    /**
    Removes the `<div>` wrapper used to contain the data table and fixed header
    when the table is vertically scrolling.

    @method _removeYScrollContainer
    @protected
    @since 3.5.0
    **/
    _removeYScrollContainer: function () {
        var scroller = this._yScrollContainer;

        if (scroller) {
            scroller.replace(scroller.get('childNodes').toFrag());
            scroller.remove().destroy(true);

            delete this._yScrollContainer;
        }
    },

    /**
    Removes the `<table>` used to contain the fixed column headers when the
    table is vertically scrolling.

    @method _removeYScrollHeader
    @protected
    @since 3.5.0
    **/
    _removeYScrollHeader: function () {
        if (this._yScrollHeader) {
            this._yScrollHeader.remove().destroy(true);

            delete this._yScrollHeader;
        }
    },

    /**
    Removes the `<div>` wrapper used to contain the data table when the table
    is vertically scrolling.

    @method _removeYScrollNode
    @protected
    @since 3.5.0
    **/
    _removeYScrollNode: function () {
        var scroller = this._yScrollNode;

        if (scroller) {
            scroller.replace(scroller.get('childNodes').toFrag());
            scroller.remove().destroy(true);

            delete this._yScrollNode;
        }
    },

    /**
    Removes the virtual scrollbar used by scrolling tables.

    @method _removeScrollbar
    @protected
    @since 3.5.0
    **/
    _removeScrollbar: function () {
        if (this._scrollbarNode) {
            this._scrollbarNode.remove().destroy(true);

            delete this._scrollbarNode;
        }
        if (this._scrollbarEventHandle) {
            this._scrollbarEventHandle.detach();

            delete this._scrollbarEventHandle;
        }
    },

    /**
    Accepts (case insensitive) values "x", "y", "xy", `true`, and `false`.
    `true` is translated to "xy" and upper case values are converted to lower
    case.  All other values are invalid.

    @method _setScrollable
    @param {String|Boolea} val Incoming value for the `scrollable` attribute
    @return {String}
    @protected
    @since 3.5.0
    **/
    _setScrollable: function (val) {
        if (val === true) {
            val = 'xy';
        }

        if (isString(val)) {
            val = val.toLowerCase();
        }

        return (val === false || val === 'y' || val === 'x' || val === 'xy') ?
            val :
            Y.Attribute.INVALID_VALUE;
    },

    /**
    Assigns the `_xScroll` and `_yScroll` properties to true if an
    appropriate value is set in the `scrollable` attribute and the `height`
    and/or `width` is set.

    @method _setScrollProperties
    @protected
    @since 3.5.0
    **/
    _setScrollProperties: function () {
        var scrollable = this.get('scrollable') || '',
            width      = this.get('width'),
            height     = this.get('height');

        this._xScroll = width  && scrollable.indexOf('x') > -1;
        this._yScroll = height && scrollable.indexOf('y') > -1;
    },

    /**
    Keeps the virtual scrollbar and the scrolling `<div>` wrapper around the
    data table in vertically scrolling tables in sync.

    @method _syncScrollPosition
    @param {DOMEventFacade} e The scroll event
    @protected
    @since 3.5.0
    **/
    _syncScrollPosition: function (e) {
        var scrollbar = this._scrollbarNode,
            scroller  = this._yScrollNode,
            source    = e.currentTarget,
            other;

        if (scrollbar && scroller) {
            if (this._scrollLock && this._scrollLock.source !== source) {
                return;
            }

            this._clearScrollLock();
            this._scrollLock = Y.later(300, this, this._clearScrollLock);
            this._scrollLock.source = source;

            other = (source === scrollbar) ? scroller : scrollbar;
            other.set('scrollTop', source.get('scrollTop'));
        }
    },

    /**
    Splits the caption from the data `<table>` if the table is configured to
    scroll.  If not, rejoins the caption to the data `<table>` if it needs to
    be.

    @method _syncScrollCaptionUI
    @protected
    @since 3.5.0
    **/
    _syncScrollCaptionUI: function () {
        var caption      = this._captionNode,
            table        = this._tableNode,
            captionTable = this._captionTable,
            id;

        if (caption) {
            id = caption.getAttribute('id');

            if (!captionTable) {
                captionTable = this._createScrollCaptionTable();

                this.get('contentBox').prepend(captionTable);
            }

            if (!caption.get('parentNode').compareTo(captionTable)) {
                captionTable.empty().insert(caption);

                if (!id) {
                    id = Y.stamp(caption);
                    caption.setAttribute('id', id);
                }

                table.setAttribute('aria-describedby', id);
            }
        } else if (captionTable) {
            this._removeScrollCaptionTable();
        }
    },

    /**
    Assigns widths to the fixed header columns to match the columns in the data
    table.

    @method _syncScrollColumnWidths
    @protected
    @since 3.5.0
    **/
    _syncScrollColumnWidths: function () {
        var widths = [];

        if (this._theadNode && this._yScrollHeader) {
            // Capture dims and assign widths in two passes to avoid reflows for
            // each access of clientWidth/getComputedStyle
            this._theadNode.all('.' + this.getClassName('header'))
                .each(function (header) {
                    widths.push(
                        // FIXME: IE returns the col.style.width from
                        // getComputedStyle even if the column has been
                        // compressed below that width, so it must use
                        // clientWidth. FF requires getComputedStyle because it
                        // uses fractional widths that round up to an overall
                        // cell/table width 1px greater than the data table's
                        // cell/table width, resulting in misaligned columns or
                        // fixed header bleed through. I can't think of a
                        // *reasonable* way to capture the correct width without
                        // a sniff.  Math.min(cW - p, getCS(w)) was imperfect
                        // and punished all browsers, anyway.
                        (Y.UA.ie && Y.UA.ie < 8) ?
                            (header.get('clientWidth') -
                             styleDim(header, 'paddingLeft') -
                             styleDim(header, 'paddingRight')) + 'px' :
                            header.getComputedStyle('width'));
            });

            this._yScrollHeader.all('.' + this.getClassName('scroll', 'liner'))
                .each(function (liner, i) {
                    liner.setStyle('width', widths[i]);
                });
        }
    },

    /**
    Creates matching headers in the fixed header table for vertically scrolling
    tables and synchronizes the column widths.

    @method _syncScrollHeaders
    @protected
    @since 3.5.0
    **/
    _syncScrollHeaders: function () {
        var fixedHeader   = this._yScrollHeader,
            linerTemplate = this._SCROLL_LINER_TEMPLATE,
            linerClass    = this.getClassName('scroll', 'liner'),
            headerClass   = this.getClassName('header'),
            headers       = this._theadNode.all('.' + headerClass);

        if (this._theadNode && fixedHeader) {
            fixedHeader.empty().appendChild(
                this._theadNode.cloneNode(true));

            // Prevent duplicate IDs and assign ARIA attributes to hide
            // from screen readers
            fixedHeader.all('[id]').removeAttribute('id');

            fixedHeader.all('.' + headerClass).each(function (header, i) {
                var liner = Y.Node.create(Y.Lang.sub(linerTemplate, {
                            className: linerClass
                        })),
                    refHeader = headers.item(i);

                // Can't assign via skin css because sort (and potentially
                // others) might override the padding values.
                liner.setStyle('padding',
                    refHeader.getComputedStyle('paddingTop') + ' ' +
                    refHeader.getComputedStyle('paddingRight') + ' ' +
                    refHeader.getComputedStyle('paddingBottom') + ' ' +
                    refHeader.getComputedStyle('paddingLeft'));

                liner.appendChild(header.get('childNodes').toFrag());

                header.appendChild(liner);
            }, this);

            this._syncScrollColumnWidths();

            this._addScrollbarPadding();
        }
    },

    /**
    Wraps the table for X and Y scrolling, if necessary, if the `scrollable`
    attribute is set.  Synchronizes dimensions and DOM placement of all
    scrolling related nodes.

    @method _syncScrollUI
    @protected
    @since 3.5.0
    **/
    _syncScrollUI: function () {
        var x = this._xScroll,
            y = this._yScroll,
            xScroller  = this._xScrollNode,
            yScroller  = this._yScrollNode,
            scrollLeft = xScroller && xScroller.get('scrollLeft'),
            scrollTop  = yScroller && yScroller.get('scrollTop');

        this._uiSetScrollable();

        // TODO: Probably should split this up into syncX, syncY, and syncXY
        if (x || y) {
            if ((this.get('width') || '').slice(-1) === '%') {
                this._bindScrollResize();
            } else {
                this._unbindScrollResize();
            }

            this._syncScrollCaptionUI();
        } else {
            this._disableScrolling();
        }

        if (this._yScrollHeader) {
            this._yScrollHeader.setStyle('display', 'none');
        }

        if (x) {
            if (!y) {
                this._disableYScrolling();
            }

            this._syncXScrollUI(y);
        }

        if (y) {
            if (!x) {
                this._disableXScrolling();
            }

            this._syncYScrollUI(x);
        }

        // Restore scroll position
        if (scrollLeft && this._xScrollNode) {
            this._xScrollNode.set('scrollLeft', scrollLeft);
        }
        if (scrollTop && this._yScrollNode) {
            this._yScrollNode.set('scrollTop', scrollTop);
        }
    },

    /**
    Wraps the table in a scrolling `<div>` of the configured width for "x"
    scrolling.

    @method _syncXScrollUI
    @param {Boolean} xy True if the table is configured with scrollable ="xy"
    @protected
    @since 3.5.0
    **/
    _syncXScrollUI: function (xy) {
        var scroller     = this._xScrollNode,
            yScroller    = this._yScrollContainer,
            table        = this._tableNode,
            width        = this.get('width'),
            bbWidth      = this.get('boundingBox').get('offsetWidth'),
            scrollbarWidth = Y.DOM.getScrollbarWidth(),
            borderWidth, tableWidth;

        if (!scroller) {
            scroller = this._createXScrollNode();

            // Not using table.wrap() because IE went all crazy, wrapping the
            // table in the last td in the table itself.
            (yScroller || table).replace(scroller).appendTo(scroller);
        }

        // Can't use offsetHeight - clientHeight because IE6 returns
        // clientHeight of 0 intially.
        borderWidth = styleDim(scroller, 'borderLeftWidth') +
                      styleDim(scroller, 'borderRightWidth');

        scroller.setStyle('width', '');
        this._uiSetDim('width', '');
        if (xy && this._yScrollContainer) {
            this._yScrollContainer.setStyle('width', '');
        }

        // Lock the table's unconstrained width to avoid configured column
        // widths being ignored
        if (Y.UA.ie && Y.UA.ie < 8) {
            // Have to assign a style and trigger a reflow to allow the
            // subsequent clearing of width + reflow to expand the table to
            // natural width in IE 6
            table.setStyle('width', width);
            table.get('offsetWidth');
        }
        table.setStyle('width', '');
        tableWidth = table.get('offsetWidth');
        table.setStyle('width', tableWidth + 'px');

        this._uiSetDim('width', width);

        // Can't use 100% width because the borders add additional width
        // TODO: Cache the border widths, though it won't prevent a reflow
        scroller.setStyle('width', (bbWidth - borderWidth) + 'px');

        // expand the table to fill the assigned width if it doesn't
        // already overflow the configured width
        if ((scroller.get('offsetWidth') - borderWidth) > tableWidth) {
            // Assumes the wrapped table doesn't have borders
            if (xy) {
                table.setStyle('width', (scroller.get('offsetWidth') -
                     borderWidth - scrollbarWidth) + 'px');
            } else {
                table.setStyle('width', '100%');
            }
        }
    },

    /**
    Wraps the table in a scrolling `<div>` of the configured height (accounting
    for the caption if there is one) if "y" scrolling is enabled.  Otherwise,
    unwraps the table if necessary.

    @method _syncYScrollUI
    @param {Boolean} xy True if the table is configured with scrollable = "xy"
    @protected
    @since 3.5.0
    **/
    _syncYScrollUI: function (xy) {
        var yScroller    = this._yScrollContainer,
            yScrollNode  = this._yScrollNode,
            xScroller    = this._xScrollNode,
            fixedHeader  = this._yScrollHeader,
            scrollbar    = this._scrollbarNode,
            table        = this._tableNode,
            thead        = this._theadNode,
            captionTable = this._captionTable,
            boundingBox  = this.get('boundingBox'),
            contentBox   = this.get('contentBox'),
            width        = this.get('width'),
            height       = boundingBox.get('offsetHeight'),
            scrollbarWidth = Y.DOM.getScrollbarWidth(),
            outerScroller;

        if (captionTable && !xy) {
            captionTable.setStyle('width', width || '100%');
        }

        if (!yScroller) {
            yScroller = this._createYScrollNode();

            yScrollNode = this._yScrollNode;

            table.replace(yScroller).appendTo(yScrollNode);
        }

        outerScroller = xy ? xScroller : yScroller;

        if (!xy) {
            table.setStyle('width', '');
        }

        // Set the scroller height
        if (xy) {
            // Account for the horizontal scrollbar in the overall height
            height -= scrollbarWidth;
        }

        yScrollNode.setStyle('height',
            (height - outerScroller.get('offsetTop') -
            // because IE6 is returning clientHeight 0 initially
            styleDim(outerScroller, 'borderTopWidth') -
            styleDim(outerScroller, 'borderBottomWidth')) + 'px');

        // Set the scroller width
        if (xy) {
            // For xy scrolling tables, the table should expand freely within
            // the x scroller
            yScroller.setStyle('width',
                (table.get('offsetWidth') + scrollbarWidth) + 'px');
        } else {
            this._uiSetYScrollWidth(width);
        }

        if (captionTable && !xy) {
            captionTable.setStyle('width', yScroller.get('offsetWidth') + 'px');
        }

        // Allow headerless scrolling
        if (thead && !fixedHeader) {
            fixedHeader = this._createYScrollHeader();

            yScroller.prepend(fixedHeader);

            this._syncScrollHeaders();
        }

        if (fixedHeader) {
            this._syncScrollColumnWidths();

            fixedHeader.setStyle('display', '');
            // This might need to come back if FF has issues
            //fixedHeader.setStyle('width', '100%');
                //(yScroller.get('clientWidth') + scrollbarWidth) + 'px');

            if (!scrollbar) {
                scrollbar = this._createScrollbar();

                this._bindScrollbar();

                contentBox.prepend(scrollbar);
            }

            this._uiSetScrollbarHeight();
            this._uiSetScrollbarPosition(outerScroller);
        }
    },

    /**
    Assigns the appropriate class to the `boundingBox` to identify the DataTable
    as horizontally scrolling, vertically scrolling, or both (adds both classes).

    Classes added are "yui3-datatable-scrollable-x" or "...-y"

    @method _uiSetScrollable
    @protected
    @since 3.5.0
    **/
    _uiSetScrollable: function () {
        this.get('boundingBox')
            .toggleClass(this.getClassName('scrollable','x'), this._xScroll)
            .toggleClass(this.getClassName('scrollable','y'), this._yScroll);
    },

    /**
    Updates the virtual scrollbar's height to avoid overlapping with the fixed
    headers.

    @method _uiSetScrollbarHeight
    @protected
    @since 3.5.0
    **/
    _uiSetScrollbarHeight: function () {
        var scrollbar   = this._scrollbarNode,
            scroller    = this._yScrollNode,
            fixedHeader = this._yScrollHeader;

        if (scrollbar && scroller && fixedHeader) {
            scrollbar.get('firstChild').setStyle('height',
                this._tbodyNode.get('scrollHeight') + 'px');

            scrollbar.setStyle('height', 
                (parseFloat(scroller.getComputedStyle('height')) -
                 parseFloat(fixedHeader.getComputedStyle('height'))) + 'px');
        }
    },

    /**
    Updates the virtual scrollbar's placement to avoid overlapping the fixed
    headers or the data table.

    @method _uiSetScrollbarPosition
    @param {Node} scroller Reference node to position the scrollbar over
    @protected
    @since 3.5.0
    **/
    _uiSetScrollbarPosition: function (scroller) {
        var scrollbar     = this._scrollbarNode,
            fixedHeader   = this._yScrollHeader;

        if (scrollbar && scroller && fixedHeader) {
            scrollbar.setStyles({
                // Using getCS instead of offsetHeight because FF uses
                // fractional values, but reports ints to offsetHeight, so
                // offsetHeight is unreliable.  It is probably fine to use
                // offsetHeight in this case but this was left in place after
                // fixing an off-by-1px issue in FF 10- by fixing the caption
                // font style so FF picked it up.
                top: (parseFloat(fixedHeader.getComputedStyle('height')) +
                      styleDim(scroller, 'borderTopWidth') +
                      scroller.get('offsetTop')) + 'px',

                // Minus 1 because IE 6-10 require the scrolled area to be
                // visible by at least 1px or it won't respond to clicks on the
                // scrollbar rail or endcap arrows.
                left: (scroller.get('offsetWidth') -
                       Y.DOM.getScrollbarWidth() - 1 -
                       styleDim(scroller, 'borderRightWidth')) + 'px'
            });
        }
    },

    /**
    Assigns the width of the `<div>` wrapping the data table in vertically
    scrolling tables.

    If the table can't compress to the specified width, the container is
    expanded accordingly.

    @method _uiSetYScrollWidth
    @param {String} width The CSS width to attempt to set
    @protected
    @since 3.5.0
    **/
    _uiSetYScrollWidth: function (width) {
        var scroller = this._yScrollContainer,
            table    = this._tableNode,
            tableWidth, borderWidth, scrollerWidth, scrollbarWidth;

        if (scroller && table) {
            scrollbarWidth = Y.DOM.getScrollbarWidth();

            if (width) {
                // Assumes no table border
                borderWidth = scroller.get('offsetWidth') -
                              scroller.get('clientWidth') +
                              scrollbarWidth; // added back at the end

                // The table's rendered width might be greater than the
                // configured width
                scroller.setStyle('width', width);

                // Have to subtract the border width from the configured width
                // because the scroller's width will need to be reduced by the
                // border width as well during the width reassignment below.
                scrollerWidth = scroller.get('clientWidth') - borderWidth;

                // Assumes no table borders
                table.setStyle('width', scrollerWidth + 'px');

                tableWidth = table.get('offsetWidth');

                // Expand the scroll node width if the table can't fit.
                // Otherwise, reassign the scroller a pixel width that
                // accounts for the borders.
                scroller.setStyle('width',
                    (tableWidth + scrollbarWidth) + 'px');
            } else {
                // Allow the table to expand naturally
                table.setStyle('width', '');
                scroller.setStyle('width', '');

                scroller.setStyle('width',
                    (table.get('offsetWidth') + scrollbarWidth) + 'px');
            }
        }
    },

    /**
    Detaches the scroll event subscriptions used to maintain scroll position
    parity between the scrollable `<div>` wrapper around the data table and the
    virtual scrollbar for vertically scrolling tables.

    @method _unbindScrollbar
    @protected
    @since 3.5.0
    **/
    _unbindScrollbar: function () {
        if (this._scrollbarEventHandle) {
            this._scrollbarEventHandle.detach();
        }
    },

    /**
    Detaches the resize event subscription used to maintain column parity for
    vertically scrolling tables with percentage widths.

    @method _unbindScrollResize
    @protected
    @since 3.5.0
    **/
    _unbindScrollResize: function () {
        if (this._scrollResizeHandle) {
            this._scrollResizeHandle.detach();
            delete this._scrollResizeHandle;
        }
    }

    /**
    Indicates horizontal table scrolling is enabled.

    @property _xScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    @since 3.5.0
    **/
    //_xScroll: null,

    /**
    Indicates vertical table scrolling is enabled.

    @property _yScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    @since 3.5.0
    **/
    //_yScroll: null,

    /**
    Fixed column header `<table>` Node for vertical scrolling tables.

    @property _yScrollHeader
    @type {Node}
    @default undefined (not initially set)
    @protected
    @since 3.5.0
    **/
    //_yScrollHeader: null,

    /**
    Overflow Node used to contain the data rows in a vertically scrolling table.

    @property _yScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    @since 3.5.0
    **/
    //_yScrollNode: null,

    /**
    Overflow Node used to contain the table headers and data in a horizontally
    scrolling table.

    @property _xScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    @since 3.5.0
    **/
    //_xScrollNode: null
}, true);

Y.Base.mix(Y.DataTable, [Scrollable]);


}, '3.7.3', {"requires": ["datatable-base", "datatable-column-widths", "dom-screen"], "skinnable": true});
