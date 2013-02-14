/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('slider-base', function (Y, NAME) {

/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module slider
 * @submodule slider-base
 */

var INVALID_VALUE = Y.Attribute.INVALID_VALUE;

/**
 * Create a slider to represent an input control capable of representing a
 * series of intermediate states based on the position of the slider's thumb.
 * These states are typically aligned to a value algorithm whereby the thumb
 * position corresponds to a given value. Sliders may be oriented vertically or
 * horizontally, based on the <code>axis</code> configuration.
 *
 * @class SliderBase
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
function SliderBase() {
    SliderBase.superclass.constructor.apply( this, arguments );
}

Y.SliderBase = Y.extend( SliderBase, Y.Widget, {

    // Y.Slider prototype

    /**
     * Construction logic executed during Slider instantiation.
     *
     * @method initializer
     * @protected
     */
    initializer : function () {
        /**
         * The configured axis, stored for fast lookup since it's a writeOnce
         * attribute.  This is for use by extension classes.  For
         * implementation code, use <code>get( &quot;axis&quot; )</code> for
         * authoritative source.  Never write to this property.
         *
         * @property axis
         * @type {String}
         * @protected
         */
        this.axis = this.get( 'axis' );

        /**
         * Cached fast access map for DOM properties and attributes that
         * pertain to accessing dimensional or positioning information
         * according to the Slider's axis (e.g. &quot;height&quot; vs.
         * &quot;width&quot;).  Extension classes should add to this collection
         * for axis related strings if necessary.
         *
         * @property _key
         * @type {Object}
         * @protected
         */
        this._key = {
            dim    : ( this.axis === 'y' ) ? 'height' : 'width',
            minEdge: ( this.axis === 'y' ) ? 'top'    : 'left',
            maxEdge: ( this.axis === 'y' ) ? 'bottom' : 'right',
            xyIndex: ( this.axis === 'y' ) ? 1 : 0
        };

        /**
         * Signals that the thumb has moved.  Payload includes the thumb's
         * pixel offset from the top/left edge of the rail, and if triggered by
         * dragging the thumb, the <code>drag:drag</code> event.
         *
         * @event thumbMove
         * @param event {Event} The event object for the thumbMove with the
         *                      following extra properties:
         *  <dl>
         *      <dt>offset</dt>
         *          <dd>Pixel offset from top/left of the slider to the new
         *          thumb position</dd>
         *      <dt>ddEvent (deprecated)</dt>
         *          <dd><code>drag:drag</code> event from the thumb</dd>
         *      <dt>originEvent</dt>
         *          <dd><code>drag:drag</code> event from the thumb</dd>
         *  </dl>
         */
        this.publish( 'thumbMove', {
            defaultFn: this._defThumbMoveFn,
            queuable : true
        } );
    },

    /**
     * Create the DOM structure for the Slider.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        var contentBox = this.get( 'contentBox' );

        /**
         * The Node instance of the Slider's rail element.  Do not write to
         * this property.
         *
         * @property rail
         * @type {Node}
         */
        this.rail = this.renderRail();

        this._uiSetRailLength( this.get( 'length' ) );

        /**
         * The Node instance of the Slider's thumb element.  Do not write to
         * this property.
         *
         * @property thumb
         * @type {Node}
         */
        this.thumb = this.renderThumb();

        this.rail.appendChild( this.thumb );
        // @TODO: insert( contentBox, 'replace' ) or setHTML?
        contentBox.appendChild( this.rail );

        // <span class="yui3-slider-x">
        contentBox.addClass( this.getClassName( this.axis ) );
    },

    /**
     * Creates the Slider rail DOM subtree for insertion into the Slider's
     * <code>contentBox</code>.  Override this method if you want to provide
     * the rail element (presumably from existing markup).
     *
     * @method renderRail
     * @return {Node} the rail node subtree
     */
    renderRail: function () {
        var minCapClass = this.getClassName( 'rail', 'cap', this._key.minEdge ),
            maxCapClass = this.getClassName( 'rail', 'cap', this._key.maxEdge );

        return Y.Node.create(
            Y.Lang.sub( this.RAIL_TEMPLATE, {
                railClass      : this.getClassName( 'rail' ),
                railMinCapClass: minCapClass,
                railMaxCapClass: maxCapClass
            } ) );
    },

    /**
     * Sets the rail length according to the <code>length</code> attribute.
     *
     * @method _uiSetRailLength
     * @param length {String} the length to apply to the rail style
     * @protected
     */
    _uiSetRailLength: function ( length ) {
        this.rail.setStyle( this._key.dim, length );
    },

    /**
     * Creates the Slider thumb DOM subtree for insertion into the Slider's
     * rail.  Override this method if you want to provide the thumb element
     * (presumably from existing markup).
     *
     * @method renderThumb
     * @return {Node} the thumb node subtree
     */
    renderThumb: function () {
        this._initThumbUrl();

        var imageUrl = this.get( 'thumbUrl' );

        return Y.Node.create(
            Y.Lang.sub( this.THUMB_TEMPLATE, {
                thumbClass      : this.getClassName( 'thumb' ),
                thumbShadowClass: this.getClassName( 'thumb', 'shadow' ),
                thumbImageClass : this.getClassName( 'thumb', 'image' ),
                thumbShadowUrl  : imageUrl,
                thumbImageUrl   : imageUrl,
                thumbAriaLabelId: this.getClassName( 'label', Y.guid()) // get unique id for specifying a label for ARIA
            } ) );
    },
    
    /**
     * Gives focus to the thumb enabling keyboard access after clicking thumb
     *
     * @method _onThumbClick
     * @protected
     */
    _onThumbClick : function(e){
        this.thumb.focus();
    },
    
    
    /**
     * Creates the Y.DD.Drag instance used to handle the thumb movement and
     * binds Slider interaction to the configured value model.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
    
        // Begin keyboard listeners ///////////////////////////////
        var boundingBox = this.get("boundingBox"), //Y.one('body'),
        // Looking for a key event which will fire continously across browsers while the key is held down.
        keyEvent = (!Y.UA.opera) ? "down:" : "press:",            
        // 38, 40 = arrow up/down, 33, 34 = page up/down,  35 , 36 = end/home
        keyEventSpec = keyEvent + "38,40,33,34,35,36",
        // 37 , 39 = arrow left/right
        keyLeftRightSpec = keyEvent + "37,39",
        // 37 , 39 = arrow left/right + meta (command/apple key) for mac
        keyLeftRightSpecMeta = keyEvent + "37+meta,39+meta";

        boundingBox.on("key", this._onDirectionKey, keyEventSpec, this);
        boundingBox.on("key", this._onLeftRightKey, keyLeftRightSpec, this);
        boundingBox.on("key", this._onLeftRightKeyMeta, keyLeftRightSpecMeta, this);
        // End keyboard listeners //////////////////////////////////

        this.thumb.on('click', this._onThumbClick, this);

        this._bindThumbDD();

        this._bindValueLogic();

        this.after( 'disabledChange', this._afterDisabledChange );
        this.after( 'lengthChange',   this._afterLengthChange );
        
    },
                      
    /**
     * increments Slider value by a minor increment
     *
     * @method _incrMinor
     * @protected
     */
    _incrMinor : function(){
        this.set('value', (this.get('value') + this.get('minorStep')));
    },
    
    /**
     * decrements Slider value by a minor increment
     *
     * @method _decrMinor
     * @protected
     */
    _decrMinor : function(){
        this.set('value', (this.get('value') - this.get('minorStep')));
    },
        
    /**
     * increments Slider value by a major increment
     *
     * @method _incrMajor
     * @protected
     */
    _incrMajor : function(){
        this.set('value', (this.get('value') + this.get('majorStep')));
    },
    
    /**
     * decrements Slider value by a major increment
     *
     * @method _decrMajor
     * @protected
     */
    _decrMajor : function(){
        this.set('value', (this.get('value') - this.get('majorStep')));
    },

    /**
     * sets the Slider value to the min value. 
     *
     * @method _setToMin
     * @protected
     */
    _setToMin : function(e){
        this.set('value', this.get('min'));
    },

    /**
     * sets the Slider value to the max value. 
     *
     * @method _setToMax
     * @protected
     */
    _setToMax : function(e){
        this.set('value', this.get('max'));
    },

    /**
     * sets the Slider's value in response to key events.
     * Left and right keys are in a separate method 
     * in case an implementation wants to increment values
     * but needs left and right arrow keys for other purposes.
     *
     * @method _onDirectionKey
     * @param e {Event} the key event
     * @protected
     */
    _onDirectionKey : function(e) {
        e.preventDefault();
        if(this.get('disabled') === false){
            switch (e.charCode) {
                case 38: // up
                    this._incrMinor();
                    break;
                case 40: // down
                    this._decrMinor();
                    break;
                case 36: // home
                    this._setToMin();
                    break;
                case 35: // end
                    this._setToMax();
                    break;
                case 33: // page up
                    this._incrMajor();
                    break;
                case 34: // page down
                    this._decrMajor();
                    break;
            }
        }
    },

    /**
     * sets the Slider's value in response to left or right key events
     *
     * @method _onLeftRightKey
     * @param e {Event} the key event
     * @protected
     */
    _onLeftRightKey : function(e) {
        e.preventDefault();
        if(this.get('disabled') === false){
            switch (e.charCode) {
                case 37: // left
                    this._decrMinor();
                    break;
                case 39: // right
                    this._incrMinor();
                    break;
            }
        }
    },

    /**
     * sets the Slider's value in response to left or right key events when a meta (mac command/apple) key is also pressed
     *
     * @method _onLeftRightKeyMeta
     * @param e {Event} the key event
     * @protected
     */
    _onLeftRightKeyMeta : function(e) {
        e.preventDefault();
        if(this.get('disabled') === false){
            switch (e.charCode) {
                case 37: // left + meta
                    this._setToMin();
                    break;
                case 39: // right + meta
                    this._setToMax();
                    break;
            }
        }
    },





    /**
     * Makes the thumb draggable and constrains it to the rail.
     *
     * @method _bindThumbDD
     * @protected
     */
    _bindThumbDD: function () {
        var config = { constrain: this.rail };
        
        // { constrain: rail, stickX: true }
        config[ 'stick' + this.axis.toUpperCase() ] = true;

        /** 
         * The DD.Drag instance linked to the thumb node.
         *
         * @property _dd
         * @type {DD.Drag}
         * @protected
         */
        this._dd = new Y.DD.Drag( {
            node   : this.thumb,
            bubble : false,
            on     : {
                'drag:start': Y.bind( this._onDragStart, this )
            },
            after  : {
                'drag:drag': Y.bind( this._afterDrag,    this ),
                'drag:end' : Y.bind( this._afterDragEnd, this )
            }
        } );

        // Constrain the thumb to the rail
        this._dd.plug( Y.Plugin.DDConstrained, config );
    },

    /**
     * Stub implementation.  Override this (presumably in a class extension) to
     * initialize any value logic that depends on the presence of the Drag
     * instance.
     *
     * @method _bindValueLogic
     * @protected
     */
    _bindValueLogic: function () {},

    /**
     * Moves the thumb to pixel offset position along the rail.
     *
     * @method _uiMoveThumb
     * @param offset {Number} the pixel offset to set as left or top style
     * @param [options] {Object} Details to send with the `thumbMove` event
     * @protected
     */
    _uiMoveThumb: function ( offset, options ) {
        if ( this.thumb ) {
            this.thumb.setStyle( this._key.minEdge, offset + 'px' );


            options || (options = {});
            options.offset = offset;

            this.fire( 'thumbMove', options );
        }
    },

    /**
     * Dispatches the <code>slideStart</code> event.
     *
     * @method _onDragStart
     * @param e {Event} the <code>drag:start</code> event from the thumb
     * @protected
     */
    _onDragStart: function ( e ) {
        /**
         * Signals the beginning of a thumb drag operation.  Payload includes
         * the thumb's drag:start event.
         *
         * @event slideStart
         * @param event {Event} The event object for the slideStart with the
         *                      following extra properties:
         *  <dl>
         *      <dt>ddEvent (deprecated)</dt>
         *          <dd><code>drag:start</code> event from the thumb</dd>
         *      <dt>originEvent</dt>
         *          <dd><code>drag:start</code> event from the thumb</dd>
         *  </dl>
         */
        this.fire('slideStart', {
           ddEvent: e, // for backward compatibility
           originEvent: e
        });
    },

    /**
     * Dispatches the <code>thumbMove</code> event.
     *
     * @method _afterDrag
     * @param e {Event} the <code>drag:drag</code> event from the thumb
     * @protected
     */
    _afterDrag: function ( e ) {
        var thumbXY = e.info.xy[ this._key.xyIndex ],
            railXY  = e.target.con._regionCache[ this._key.minEdge ];

        this.fire( 'thumbMove', {
            offset : (thumbXY - railXY),
            ddEvent: e, // for backward compatibility
            originEvent: e
        } );
    },

    /**
     * Dispatches the <code>slideEnd</code> event.
     *
     * @method _onDragEnd
     * @param e {Event} the <code>drag:end</code> event from the thumb
     * @protected
     */
    _afterDragEnd: function ( e ) {
        /**
         * Signals the end of a thumb drag operation.  Payload includes
         * the thumb's drag:end event.
         *
         * @event slideEnd
         * @param event {Event} The event object for the slideEnd with the
         *                      following extra properties:
         *  <dl>
         *      <dt>ddEvent (deprecated)</dt>
         *          <dd><code>drag:end</code> event from the thumb</dd>
         *      <dt>originEvent</dt>
         *          <dd><code>drag:end</code> event from the thumb</dd>
         *  </dl>
         */
        this.fire('slideEnd', {
            ddEvent: e,
            originEvent: e
        });
    },

    /**
     * Locks or unlocks the thumb.
     *
     * @method _afterDisabledChange
     * @param e {Event} The disabledChange event object
     * @protected
     */
    _afterDisabledChange: function ( e ) {
        this._dd.set( 'lock', e.newVal );
    },

    /**
     * Handles changes to the <code>length</code> attribute.  By default, it
     * triggers an update to the UI.
     *
     * @method _afterLengthChange
     * @param e {Event} The lengthChange event object
     * @protected
     */
    _afterLengthChange: function ( e ) {
        if ( this.get( 'rendered' ) ) {
            this._uiSetRailLength( e.newVal );

            this.syncUI();
        }
    },

    /**
     * Synchronizes the DOM state with the attribute settings.
     *
     * @method syncUI
     */
    syncUI : function () {
        this._dd.con.resetCache();

        this._syncThumbPosition();

        // Forces a reflow of the bounding box to address IE8 inline-block
        // container not expanding correctly. bug 2527905
        //this.get('boundingBox').toggleClass('');
        this.thumb.set('aria-valuemin', this.get('min'));
        this.thumb.set('aria-valuemax', this.get('max'));

        this._dd.set('lock', this.get('disabled'));
    },

    /**
     * Stub implementation.  Override this (presumably in a class extension) to
     * ensure the thumb is in the correct position according to the value
     * alogorithm.
     * instance.
     *
     * @method _syncThumbPosition
     * @protected
     */
    _syncThumbPosition: function () {},

    /**
     * Validates the axis is &quot;x&quot; or &quot;y&quot; (case insensitive).
     * Converts to lower case for storage.
     *
     * @method _setAxis
     * @param v {String} proposed value for the axis attribute
     * @return {String} lowercased first character of the input string
     * @protected
     */
    _setAxis : function (v) {
        v = ( v + '' ).toLowerCase();

        return ( v === 'x' || v === 'y' ) ? v : INVALID_VALUE;
    },

    /** 
     * <p>Ensures the stored length value is a string with a quantity and unit.
     * Unit will be defaulted to &quot;px&quot; if not included.  Rejects
     * values less than or equal to 0 and those that don't at least start with
     * a number.</p>
     *
     * <p>Currently only pixel lengths are supported.</p>
     *
     * @method _setLength
     * @param v {String} proposed value for the length attribute
     * @return {String} the sanitized value
     * @protected
     */
    _setLength: function ( v ) {
        v = ( v + '' ).toLowerCase();

        var length = parseFloat( v, 10 ),
            units  = v.replace( /[\d\.\-]/g, '' ) || this.DEF_UNIT;

        return length > 0 ? ( length + units ) : INVALID_VALUE;
    },

    /**
     * <p>Defaults the thumbURL attribute according to the current skin, or
     * &quot;sam&quot; if none can be determined.  Horizontal Sliders will have
     * their <code>thumbUrl</code> attribute set to</p>
     * <p><code>&quot;/<em>configured</em>/<em>yu</em>i/<em>builddi</em>r/slider-base/assets/skins/sam/thumb-x.png&quot;</code></p>
     * <p>And vertical thumbs will get</p>
     * <p><code>&quot;/<em>configured</em>/<em>yui</em>/<em>builddir</em>/slider-base/assets/skins/sam/thumb-y.png&quot;</code></p>
     *
     * @method _initThumbUrl
     * @protected
     */
    _initThumbUrl: function () {
        if (!this.get('thumbUrl')) {
            var skin = this.getSkinName() || 'sam',
                base = Y.config.base;

            // Unfortunate hack to avoid requesting image resources from the
            // combo service.  The combo service does not serve images.
            if (base.indexOf('http://yui.yahooapis.com/combo') === 0) {
                base = 'http://yui.yahooapis.com/' + Y.version + '/build/';
            }

            // <img src="/path/to/build/slider-base/assets/skins/sam/thumb-x.png">
            this.set('thumbUrl', base + 'slider-base/assets/skins/' +
                                 skin + '/thumb-' + this.axis + '.png');

        }
    },

    /**
     * Bounding box template that will contain the Slider's DOM subtree.  &lt;span&gt;s are used to support inline-block styling.
     *
     * @property BOUNDING_TEMPLATE
     * @type {String}
     * @default &lt;span>&lt;/span>
     */
    BOUNDING_TEMPLATE : '<span></span>',

    /**
     * Content box template that will contain the Slider's rail and thumb.
     *
     * @property CONTENT_TEMPLATE
     * @type {String}
     * @default &lt;span>&lt;/span>
     */
    CONTENT_TEMPLATE  : '<span></span>',

    /**
     * Rail template that will contain the end caps and the thumb.
     * {placeholder}s are used for template substitution at render time.
     *
     * @property RAIL_TEMPLATE
     * @type {String}
     * @default &lt;span class="{railClass}">&lt;span class="{railMinCapClass}">&lt;/span>&lt;span class="{railMaxCapClass}">&lt;/span>&lt;/span>
     */
    RAIL_TEMPLATE     : '<span class="{railClass}">' +
                            '<span class="{railMinCapClass}"></span>' +
                            '<span class="{railMaxCapClass}"></span>' +
                        '</span>',

    /**
     * Thumb template that will contain the thumb image and shadow. &lt;img>
     * tags are used instead of background images to avoid a flicker bug in IE.
     * {placeholder}s are used for template substitution at render time.
     *
     * @property THUMB_TEMPLATE
     * @type {String}
     * @default &lt;span class="{thumbClass}" tabindex="-1">&lt;img src="{thumbShadowUrl}" alt="Slider thumb shadow" class="{thumbShadowClass}">&lt;img src="{thumbImageUrl}" alt="Slider thumb" class="{thumbImageClass}">&lt;/span>
     */
    THUMB_TEMPLATE    : '<span class="{thumbClass}" aria-labelledby="{thumbAriaLabelId}" aria-valuetext="" aria-valuemax="" aria-valuemin="" aria-valuenow="" role="slider" tabindex="0">' +   // keyboard access jeff     tabindex="-1"
                            '<img src="{thumbShadowUrl}" ' +
                                'alt="Slider thumb shadow" ' +
                                'class="{thumbShadowClass}">' +
                            '<img src="{thumbImageUrl}" ' +
                                'alt="Slider thumb" ' +
                                'class="{thumbImageClass}">' +
                        '</span>'

}, {

    // Y.SliderBase static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'sliderBase'
     * @readOnly
     * @protected
     * @static
     */
    NAME : 'sliderBase',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS : {

        /**
         * Axis upon which the Slider's thumb moves.  &quot;x&quot; for
         * horizontal, &quot;y&quot; for vertical.
         *
         * @attribute axis
         * @type {String}
         * @default &quot;x&quot;
         * @writeOnce
         */
        axis : {
            value     : 'x',
            writeOnce : true,
            setter    : '_setAxis',
            lazyAdd   : false
        },

        /**
         * The length of the rail (exclusive of the end caps if positioned by
         * CSS).  This corresponds to the movable range of the thumb.
         *
         * @attribute length
         * @type {String | Number} e.g. "200px" or 200
         * @default 150px
         */
        length: {
            value: '150px',
            setter: '_setLength'
        },

        /**
         * Path to the thumb image.  This will be used as both the thumb and
         * shadow as a sprite.  Defaults at render() to thumb-x.png or
         * thumb-y.png in the skin directory of the current skin.
         *
         * @attribute thumbUrl
         * @type {String}
         * @default thumb-x.png or thumb-y.png in the sam skin directory of the
         *          current build path for Slider
         */
        thumbUrl: {
            value: null,
            validator: Y.Lang.isString
        }
    }
});


}, '3.7.3', {"requires": ["widget", "dd-constrain", "event-key"], "skinnable": true});
