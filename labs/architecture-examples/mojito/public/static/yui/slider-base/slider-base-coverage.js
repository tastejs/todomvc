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
_yuitest_coverage["build/slider-base/slider-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/slider-base/slider-base.js",
    code: []
};
_yuitest_coverage["build/slider-base/slider-base.js"].code=["YUI.add('slider-base', function (Y, NAME) {","","/**"," * Create a sliding value range input visualized as a draggable thumb on a"," * background element."," * "," * @module slider"," * @submodule slider-base"," */","","var INVALID_VALUE = Y.Attribute.INVALID_VALUE;","","/**"," * Create a slider to represent an input control capable of representing a"," * series of intermediate states based on the position of the slider's thumb."," * These states are typically aligned to a value algorithm whereby the thumb"," * position corresponds to a given value. Sliders may be oriented vertically or"," * horizontally, based on the <code>axis</code> configuration."," *"," * @class SliderBase"," * @extends Widget"," * @param config {Object} Configuration object"," * @constructor"," */","function SliderBase() {","    SliderBase.superclass.constructor.apply( this, arguments );","}","","Y.SliderBase = Y.extend( SliderBase, Y.Widget, {","","    // Y.Slider prototype","","    /**","     * Construction logic executed during Slider instantiation.","     *","     * @method initializer","     * @protected","     */","    initializer : function () {","        /**","         * The configured axis, stored for fast lookup since it's a writeOnce","         * attribute.  This is for use by extension classes.  For","         * implementation code, use <code>get( &quot;axis&quot; )</code> for","         * authoritative source.  Never write to this property.","         *","         * @property axis","         * @type {String}","         * @protected","         */","        this.axis = this.get( 'axis' );","","        /**","         * Cached fast access map for DOM properties and attributes that","         * pertain to accessing dimensional or positioning information","         * according to the Slider's axis (e.g. &quot;height&quot; vs.","         * &quot;width&quot;).  Extension classes should add to this collection","         * for axis related strings if necessary.","         *","         * @property _key","         * @type {Object}","         * @protected","         */","        this._key = {","            dim    : ( this.axis === 'y' ) ? 'height' : 'width',","            minEdge: ( this.axis === 'y' ) ? 'top'    : 'left',","            maxEdge: ( this.axis === 'y' ) ? 'bottom' : 'right',","            xyIndex: ( this.axis === 'y' ) ? 1 : 0","        };","","        /**","         * Signals that the thumb has moved.  Payload includes the thumb's","         * pixel offset from the top/left edge of the rail, and if triggered by","         * dragging the thumb, the <code>drag:drag</code> event.","         *","         * @event thumbMove","         * @param event {Event} The event object for the thumbMove with the","         *                      following extra properties:","         *  <dl>","         *      <dt>offset</dt>","         *          <dd>Pixel offset from top/left of the slider to the new","         *          thumb position</dd>","         *      <dt>ddEvent (deprecated)</dt>","         *          <dd><code>drag:drag</code> event from the thumb</dd>","         *      <dt>originEvent</dt>","         *          <dd><code>drag:drag</code> event from the thumb</dd>","         *  </dl>","         */","        this.publish( 'thumbMove', {","            defaultFn: this._defThumbMoveFn,","            queuable : true","        } );","    },","","    /**","     * Create the DOM structure for the Slider.","     *","     * @method renderUI","     * @protected","     */","    renderUI : function () {","        var contentBox = this.get( 'contentBox' );","","        /**","         * The Node instance of the Slider's rail element.  Do not write to","         * this property.","         *","         * @property rail","         * @type {Node}","         */","        this.rail = this.renderRail();","","        this._uiSetRailLength( this.get( 'length' ) );","","        /**","         * The Node instance of the Slider's thumb element.  Do not write to","         * this property.","         *","         * @property thumb","         * @type {Node}","         */","        this.thumb = this.renderThumb();","","        this.rail.appendChild( this.thumb );","        // @TODO: insert( contentBox, 'replace' ) or setHTML?","        contentBox.appendChild( this.rail );","","        // <span class=\"yui3-slider-x\">","        contentBox.addClass( this.getClassName( this.axis ) );","    },","","    /**","     * Creates the Slider rail DOM subtree for insertion into the Slider's","     * <code>contentBox</code>.  Override this method if you want to provide","     * the rail element (presumably from existing markup).","     *","     * @method renderRail","     * @return {Node} the rail node subtree","     */","    renderRail: function () {","        var minCapClass = this.getClassName( 'rail', 'cap', this._key.minEdge ),","            maxCapClass = this.getClassName( 'rail', 'cap', this._key.maxEdge );","","        return Y.Node.create(","            Y.Lang.sub( this.RAIL_TEMPLATE, {","                railClass      : this.getClassName( 'rail' ),","                railMinCapClass: minCapClass,","                railMaxCapClass: maxCapClass","            } ) );","    },","","    /**","     * Sets the rail length according to the <code>length</code> attribute.","     *","     * @method _uiSetRailLength","     * @param length {String} the length to apply to the rail style","     * @protected","     */","    _uiSetRailLength: function ( length ) {","        this.rail.setStyle( this._key.dim, length );","    },","","    /**","     * Creates the Slider thumb DOM subtree for insertion into the Slider's","     * rail.  Override this method if you want to provide the thumb element","     * (presumably from existing markup).","     *","     * @method renderThumb","     * @return {Node} the thumb node subtree","     */","    renderThumb: function () {","        this._initThumbUrl();","","        var imageUrl = this.get( 'thumbUrl' );","","        return Y.Node.create(","            Y.Lang.sub( this.THUMB_TEMPLATE, {","                thumbClass      : this.getClassName( 'thumb' ),","                thumbShadowClass: this.getClassName( 'thumb', 'shadow' ),","                thumbImageClass : this.getClassName( 'thumb', 'image' ),","                thumbShadowUrl  : imageUrl,","                thumbImageUrl   : imageUrl,","                thumbAriaLabelId: this.getClassName( 'label', Y.guid()) // get unique id for specifying a label for ARIA","            } ) );","    },","    ","    /**","     * Gives focus to the thumb enabling keyboard access after clicking thumb","     *","     * @method _onThumbClick","     * @protected","     */","    _onThumbClick : function(e){","        this.thumb.focus();","    },","    ","    ","    /**","     * Creates the Y.DD.Drag instance used to handle the thumb movement and","     * binds Slider interaction to the configured value model.","     *","     * @method bindUI","     * @protected","     */","    bindUI : function () {","    ","        // Begin keyboard listeners ///////////////////////////////","        var boundingBox = this.get(\"boundingBox\"), //Y.one('body'),","        // Looking for a key event which will fire continously across browsers while the key is held down.","        keyEvent = (!Y.UA.opera) ? \"down:\" : \"press:\",            ","        // 38, 40 = arrow up/down, 33, 34 = page up/down,  35 , 36 = end/home","        keyEventSpec = keyEvent + \"38,40,33,34,35,36\",","        // 37 , 39 = arrow left/right","        keyLeftRightSpec = keyEvent + \"37,39\",","        // 37 , 39 = arrow left/right + meta (command/apple key) for mac","        keyLeftRightSpecMeta = keyEvent + \"37+meta,39+meta\";","","        boundingBox.on(\"key\", this._onDirectionKey, keyEventSpec, this);","        boundingBox.on(\"key\", this._onLeftRightKey, keyLeftRightSpec, this);","        boundingBox.on(\"key\", this._onLeftRightKeyMeta, keyLeftRightSpecMeta, this);","        // End keyboard listeners //////////////////////////////////","","        this.thumb.on('click', this._onThumbClick, this);","","        this._bindThumbDD();","","        this._bindValueLogic();","","        this.after( 'disabledChange', this._afterDisabledChange );","        this.after( 'lengthChange',   this._afterLengthChange );","        ","    },","                      ","    /**","     * increments Slider value by a minor increment","     *","     * @method _incrMinor","     * @protected","     */","    _incrMinor : function(){","        this.set('value', (this.get('value') + this.get('minorStep')));","    },","    ","    /**","     * decrements Slider value by a minor increment","     *","     * @method _decrMinor","     * @protected","     */","    _decrMinor : function(){","        this.set('value', (this.get('value') - this.get('minorStep')));","    },","        ","    /**","     * increments Slider value by a major increment","     *","     * @method _incrMajor","     * @protected","     */","    _incrMajor : function(){","        this.set('value', (this.get('value') + this.get('majorStep')));","    },","    ","    /**","     * decrements Slider value by a major increment","     *","     * @method _decrMajor","     * @protected","     */","    _decrMajor : function(){","        this.set('value', (this.get('value') - this.get('majorStep')));","    },","","    /**","     * sets the Slider value to the min value. ","     *","     * @method _setToMin","     * @protected","     */","    _setToMin : function(e){","        this.set('value', this.get('min'));","    },","","    /**","     * sets the Slider value to the max value. ","     *","     * @method _setToMax","     * @protected","     */","    _setToMax : function(e){","        this.set('value', this.get('max'));","    },","","    /**","     * sets the Slider's value in response to key events.","     * Left and right keys are in a separate method ","     * in case an implementation wants to increment values","     * but needs left and right arrow keys for other purposes.","     *","     * @method _onDirectionKey","     * @param e {Event} the key event","     * @protected","     */","    _onDirectionKey : function(e) {","        e.preventDefault();","        if(this.get('disabled') === false){","            switch (e.charCode) {","                case 38: // up","                    this._incrMinor();","                    break;","                case 40: // down","                    this._decrMinor();","                    break;","                case 36: // home","                    this._setToMin();","                    break;","                case 35: // end","                    this._setToMax();","                    break;","                case 33: // page up","                    this._incrMajor();","                    break;","                case 34: // page down","                    this._decrMajor();","                    break;","            }","        }","    },","","    /**","     * sets the Slider's value in response to left or right key events","     *","     * @method _onLeftRightKey","     * @param e {Event} the key event","     * @protected","     */","    _onLeftRightKey : function(e) {","        e.preventDefault();","        if(this.get('disabled') === false){","            switch (e.charCode) {","                case 37: // left","                    this._decrMinor();","                    break;","                case 39: // right","                    this._incrMinor();","                    break;","            }","        }","    },","","    /**","     * sets the Slider's value in response to left or right key events when a meta (mac command/apple) key is also pressed","     *","     * @method _onLeftRightKeyMeta","     * @param e {Event} the key event","     * @protected","     */","    _onLeftRightKeyMeta : function(e) {","        e.preventDefault();","        if(this.get('disabled') === false){","            switch (e.charCode) {","                case 37: // left + meta","                    this._setToMin();","                    break;","                case 39: // right + meta","                    this._setToMax();","                    break;","            }","        }","    },","","","","","","    /**","     * Makes the thumb draggable and constrains it to the rail.","     *","     * @method _bindThumbDD","     * @protected","     */","    _bindThumbDD: function () {","        var config = { constrain: this.rail };","        ","        // { constrain: rail, stickX: true }","        config[ 'stick' + this.axis.toUpperCase() ] = true;","","        /** ","         * The DD.Drag instance linked to the thumb node.","         *","         * @property _dd","         * @type {DD.Drag}","         * @protected","         */","        this._dd = new Y.DD.Drag( {","            node   : this.thumb,","            bubble : false,","            on     : {","                'drag:start': Y.bind( this._onDragStart, this )","            },","            after  : {","                'drag:drag': Y.bind( this._afterDrag,    this ),","                'drag:end' : Y.bind( this._afterDragEnd, this )","            }","        } );","","        // Constrain the thumb to the rail","        this._dd.plug( Y.Plugin.DDConstrained, config );","    },","","    /**","     * Stub implementation.  Override this (presumably in a class extension) to","     * initialize any value logic that depends on the presence of the Drag","     * instance.","     *","     * @method _bindValueLogic","     * @protected","     */","    _bindValueLogic: function () {},","","    /**","     * Moves the thumb to pixel offset position along the rail.","     *","     * @method _uiMoveThumb","     * @param offset {Number} the pixel offset to set as left or top style","     * @param [options] {Object} Details to send with the `thumbMove` event","     * @protected","     */","    _uiMoveThumb: function ( offset, options ) {","        if ( this.thumb ) {","            this.thumb.setStyle( this._key.minEdge, offset + 'px' );","","","            options || (options = {});","            options.offset = offset;","","            this.fire( 'thumbMove', options );","        }","    },","","    /**","     * Dispatches the <code>slideStart</code> event.","     *","     * @method _onDragStart","     * @param e {Event} the <code>drag:start</code> event from the thumb","     * @protected","     */","    _onDragStart: function ( e ) {","        /**","         * Signals the beginning of a thumb drag operation.  Payload includes","         * the thumb's drag:start event.","         *","         * @event slideStart","         * @param event {Event} The event object for the slideStart with the","         *                      following extra properties:","         *  <dl>","         *      <dt>ddEvent (deprecated)</dt>","         *          <dd><code>drag:start</code> event from the thumb</dd>","         *      <dt>originEvent</dt>","         *          <dd><code>drag:start</code> event from the thumb</dd>","         *  </dl>","         */","        this.fire('slideStart', {","           ddEvent: e, // for backward compatibility","           originEvent: e","        });","    },","","    /**","     * Dispatches the <code>thumbMove</code> event.","     *","     * @method _afterDrag","     * @param e {Event} the <code>drag:drag</code> event from the thumb","     * @protected","     */","    _afterDrag: function ( e ) {","        var thumbXY = e.info.xy[ this._key.xyIndex ],","            railXY  = e.target.con._regionCache[ this._key.minEdge ];","","        this.fire( 'thumbMove', {","            offset : (thumbXY - railXY),","            ddEvent: e, // for backward compatibility","            originEvent: e","        } );","    },","","    /**","     * Dispatches the <code>slideEnd</code> event.","     *","     * @method _onDragEnd","     * @param e {Event} the <code>drag:end</code> event from the thumb","     * @protected","     */","    _afterDragEnd: function ( e ) {","        /**","         * Signals the end of a thumb drag operation.  Payload includes","         * the thumb's drag:end event.","         *","         * @event slideEnd","         * @param event {Event} The event object for the slideEnd with the","         *                      following extra properties:","         *  <dl>","         *      <dt>ddEvent (deprecated)</dt>","         *          <dd><code>drag:end</code> event from the thumb</dd>","         *      <dt>originEvent</dt>","         *          <dd><code>drag:end</code> event from the thumb</dd>","         *  </dl>","         */","        this.fire('slideEnd', {","            ddEvent: e,","            originEvent: e","        });","    },","","    /**","     * Locks or unlocks the thumb.","     *","     * @method _afterDisabledChange","     * @param e {Event} The disabledChange event object","     * @protected","     */","    _afterDisabledChange: function ( e ) {","        this._dd.set( 'lock', e.newVal );","    },","","    /**","     * Handles changes to the <code>length</code> attribute.  By default, it","     * triggers an update to the UI.","     *","     * @method _afterLengthChange","     * @param e {Event} The lengthChange event object","     * @protected","     */","    _afterLengthChange: function ( e ) {","        if ( this.get( 'rendered' ) ) {","            this._uiSetRailLength( e.newVal );","","            this.syncUI();","        }","    },","","    /**","     * Synchronizes the DOM state with the attribute settings.","     *","     * @method syncUI","     */","    syncUI : function () {","        this._dd.con.resetCache();","","        this._syncThumbPosition();","","        // Forces a reflow of the bounding box to address IE8 inline-block","        // container not expanding correctly. bug 2527905","        //this.get('boundingBox').toggleClass('');","        this.thumb.set('aria-valuemin', this.get('min'));","        this.thumb.set('aria-valuemax', this.get('max'));","","        this._dd.set('lock', this.get('disabled'));","    },","","    /**","     * Stub implementation.  Override this (presumably in a class extension) to","     * ensure the thumb is in the correct position according to the value","     * alogorithm.","     * instance.","     *","     * @method _syncThumbPosition","     * @protected","     */","    _syncThumbPosition: function () {},","","    /**","     * Validates the axis is &quot;x&quot; or &quot;y&quot; (case insensitive).","     * Converts to lower case for storage.","     *","     * @method _setAxis","     * @param v {String} proposed value for the axis attribute","     * @return {String} lowercased first character of the input string","     * @protected","     */","    _setAxis : function (v) {","        v = ( v + '' ).toLowerCase();","","        return ( v === 'x' || v === 'y' ) ? v : INVALID_VALUE;","    },","","    /** ","     * <p>Ensures the stored length value is a string with a quantity and unit.","     * Unit will be defaulted to &quot;px&quot; if not included.  Rejects","     * values less than or equal to 0 and those that don't at least start with","     * a number.</p>","     *","     * <p>Currently only pixel lengths are supported.</p>","     *","     * @method _setLength","     * @param v {String} proposed value for the length attribute","     * @return {String} the sanitized value","     * @protected","     */","    _setLength: function ( v ) {","        v = ( v + '' ).toLowerCase();","","        var length = parseFloat( v, 10 ),","            units  = v.replace( /[\\d\\.\\-]/g, '' ) || this.DEF_UNIT;","","        return length > 0 ? ( length + units ) : INVALID_VALUE;","    },","","    /**","     * <p>Defaults the thumbURL attribute according to the current skin, or","     * &quot;sam&quot; if none can be determined.  Horizontal Sliders will have","     * their <code>thumbUrl</code> attribute set to</p>","     * <p><code>&quot;/<em>configured</em>/<em>yu</em>i/<em>builddi</em>r/slider-base/assets/skins/sam/thumb-x.png&quot;</code></p>","     * <p>And vertical thumbs will get</p>","     * <p><code>&quot;/<em>configured</em>/<em>yui</em>/<em>builddir</em>/slider-base/assets/skins/sam/thumb-y.png&quot;</code></p>","     *","     * @method _initThumbUrl","     * @protected","     */","    _initThumbUrl: function () {","        if (!this.get('thumbUrl')) {","            var skin = this.getSkinName() || 'sam',","                base = Y.config.base;","","            // Unfortunate hack to avoid requesting image resources from the","            // combo service.  The combo service does not serve images.","            if (base.indexOf('http://yui.yahooapis.com/combo') === 0) {","                base = 'http://yui.yahooapis.com/' + Y.version + '/build/';","            }","","            // <img src=\"/path/to/build/slider-base/assets/skins/sam/thumb-x.png\">","            this.set('thumbUrl', base + 'slider-base/assets/skins/' +","                                 skin + '/thumb-' + this.axis + '.png');","","        }","    },","","    /**","     * Bounding box template that will contain the Slider's DOM subtree.  &lt;span&gt;s are used to support inline-block styling.","     *","     * @property BOUNDING_TEMPLATE","     * @type {String}","     * @default &lt;span>&lt;/span>","     */","    BOUNDING_TEMPLATE : '<span></span>',","","    /**","     * Content box template that will contain the Slider's rail and thumb.","     *","     * @property CONTENT_TEMPLATE","     * @type {String}","     * @default &lt;span>&lt;/span>","     */","    CONTENT_TEMPLATE  : '<span></span>',","","    /**","     * Rail template that will contain the end caps and the thumb.","     * {placeholder}s are used for template substitution at render time.","     *","     * @property RAIL_TEMPLATE","     * @type {String}","     * @default &lt;span class=\"{railClass}\">&lt;span class=\"{railMinCapClass}\">&lt;/span>&lt;span class=\"{railMaxCapClass}\">&lt;/span>&lt;/span>","     */","    RAIL_TEMPLATE     : '<span class=\"{railClass}\">' +","                            '<span class=\"{railMinCapClass}\"></span>' +","                            '<span class=\"{railMaxCapClass}\"></span>' +","                        '</span>',","","    /**","     * Thumb template that will contain the thumb image and shadow. &lt;img>","     * tags are used instead of background images to avoid a flicker bug in IE.","     * {placeholder}s are used for template substitution at render time.","     *","     * @property THUMB_TEMPLATE","     * @type {String}","     * @default &lt;span class=\"{thumbClass}\" tabindex=\"-1\">&lt;img src=\"{thumbShadowUrl}\" alt=\"Slider thumb shadow\" class=\"{thumbShadowClass}\">&lt;img src=\"{thumbImageUrl}\" alt=\"Slider thumb\" class=\"{thumbImageClass}\">&lt;/span>","     */","    THUMB_TEMPLATE    : '<span class=\"{thumbClass}\" aria-labelledby=\"{thumbAriaLabelId}\" aria-valuetext=\"\" aria-valuemax=\"\" aria-valuemin=\"\" aria-valuenow=\"\" role=\"slider\" tabindex=\"0\">' +   // keyboard access jeff     tabindex=\"-1\"","                            '<img src=\"{thumbShadowUrl}\" ' +","                                'alt=\"Slider thumb shadow\" ' +","                                'class=\"{thumbShadowClass}\">' +","                            '<img src=\"{thumbImageUrl}\" ' +","                                'alt=\"Slider thumb\" ' +","                                'class=\"{thumbImageClass}\">' +","                        '</span>'","","}, {","","    // Y.SliderBase static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'sliderBase'","     * @readOnly","     * @protected","     * @static","     */","    NAME : 'sliderBase',","","    /**","     * Static property used to define the default attribute configuration of","     * the Widget.","     *","     * @property ATTRS","     * @type {Object}","     * @protected","     * @static","     */","    ATTRS : {","","        /**","         * Axis upon which the Slider's thumb moves.  &quot;x&quot; for","         * horizontal, &quot;y&quot; for vertical.","         *","         * @attribute axis","         * @type {String}","         * @default &quot;x&quot;","         * @writeOnce","         */","        axis : {","            value     : 'x',","            writeOnce : true,","            setter    : '_setAxis',","            lazyAdd   : false","        },","","        /**","         * The length of the rail (exclusive of the end caps if positioned by","         * CSS).  This corresponds to the movable range of the thumb.","         *","         * @attribute length","         * @type {String | Number} e.g. \"200px\" or 200","         * @default 150px","         */","        length: {","            value: '150px',","            setter: '_setLength'","        },","","        /**","         * Path to the thumb image.  This will be used as both the thumb and","         * shadow as a sprite.  Defaults at render() to thumb-x.png or","         * thumb-y.png in the skin directory of the current skin.","         *","         * @attribute thumbUrl","         * @type {String}","         * @default thumb-x.png or thumb-y.png in the sam skin directory of the","         *          current build path for Slider","         */","        thumbUrl: {","            value: null,","            validator: Y.Lang.isString","        }","    }","});","","","}, '3.7.3', {\"requires\": [\"widget\", \"dd-constrain\", \"event-key\"], \"skinnable\": true});"];
_yuitest_coverage["build/slider-base/slider-base.js"].lines = {"1":0,"11":0,"25":0,"26":0,"29":0,"50":0,"63":0,"88":0,"101":0,"110":0,"112":0,"121":0,"123":0,"125":0,"128":0,"140":0,"143":0,"159":0,"171":0,"173":0,"175":0,"193":0,"207":0,"217":0,"218":0,"219":0,"222":0,"224":0,"226":0,"228":0,"229":0,"240":0,"250":0,"260":0,"270":0,"280":0,"290":0,"304":0,"305":0,"306":0,"308":0,"309":0,"311":0,"312":0,"314":0,"315":0,"317":0,"318":0,"320":0,"321":0,"323":0,"324":0,"337":0,"338":0,"339":0,"341":0,"342":0,"344":0,"345":0,"358":0,"359":0,"360":0,"362":0,"363":0,"365":0,"366":0,"382":0,"385":0,"394":0,"407":0,"429":0,"430":0,"433":0,"434":0,"436":0,"462":0,"476":0,"479":0,"508":0,"522":0,"534":0,"535":0,"537":0,"547":0,"549":0,"554":0,"555":0,"557":0,"581":0,"583":0,"600":0,"602":0,"605":0,"620":0,"621":0,"626":0,"627":0,"631":0};
_yuitest_coverage["build/slider-base/slider-base.js"].functions = {"SliderBase:25":0,"initializer:39":0,"renderUI:100":0,"renderRail:139":0,"_uiSetRailLength:158":0,"renderThumb:170":0,"_onThumbClick:192":0,"bindUI:204":0,"_incrMinor:239":0,"_decrMinor:249":0,"_incrMajor:259":0,"_decrMajor:269":0,"_setToMin:279":0,"_setToMax:289":0,"_onDirectionKey:303":0,"_onLeftRightKey:336":0,"_onLeftRightKeyMeta:357":0,"_bindThumbDD:381":0,"_uiMoveThumb:428":0,"_onDragStart:447":0,"_afterDrag:475":0,"_afterDragEnd:493":0,"_afterDisabledChange:521":0,"_afterLengthChange:533":0,"syncUI:546":0,"_setAxis:580":0,"_setLength:599":0,"_initThumbUrl:619":0,"(anonymous 1):1":0};
_yuitest_coverage["build/slider-base/slider-base.js"].coveredLines = 98;
_yuitest_coverage["build/slider-base/slider-base.js"].coveredFunctions = 29;
_yuitest_coverline("build/slider-base/slider-base.js", 1);
YUI.add('slider-base', function (Y, NAME) {

/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module slider
 * @submodule slider-base
 */

_yuitest_coverfunc("build/slider-base/slider-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/slider-base/slider-base.js", 11);
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
_yuitest_coverline("build/slider-base/slider-base.js", 25);
function SliderBase() {
    _yuitest_coverfunc("build/slider-base/slider-base.js", "SliderBase", 25);
_yuitest_coverline("build/slider-base/slider-base.js", 26);
SliderBase.superclass.constructor.apply( this, arguments );
}

_yuitest_coverline("build/slider-base/slider-base.js", 29);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "initializer", 39);
_yuitest_coverline("build/slider-base/slider-base.js", 50);
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
        _yuitest_coverline("build/slider-base/slider-base.js", 63);
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
        _yuitest_coverline("build/slider-base/slider-base.js", 88);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "renderUI", 100);
_yuitest_coverline("build/slider-base/slider-base.js", 101);
var contentBox = this.get( 'contentBox' );

        /**
         * The Node instance of the Slider's rail element.  Do not write to
         * this property.
         *
         * @property rail
         * @type {Node}
         */
        _yuitest_coverline("build/slider-base/slider-base.js", 110);
this.rail = this.renderRail();

        _yuitest_coverline("build/slider-base/slider-base.js", 112);
this._uiSetRailLength( this.get( 'length' ) );

        /**
         * The Node instance of the Slider's thumb element.  Do not write to
         * this property.
         *
         * @property thumb
         * @type {Node}
         */
        _yuitest_coverline("build/slider-base/slider-base.js", 121);
this.thumb = this.renderThumb();

        _yuitest_coverline("build/slider-base/slider-base.js", 123);
this.rail.appendChild( this.thumb );
        // @TODO: insert( contentBox, 'replace' ) or setHTML?
        _yuitest_coverline("build/slider-base/slider-base.js", 125);
contentBox.appendChild( this.rail );

        // <span class="yui3-slider-x">
        _yuitest_coverline("build/slider-base/slider-base.js", 128);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "renderRail", 139);
_yuitest_coverline("build/slider-base/slider-base.js", 140);
var minCapClass = this.getClassName( 'rail', 'cap', this._key.minEdge ),
            maxCapClass = this.getClassName( 'rail', 'cap', this._key.maxEdge );

        _yuitest_coverline("build/slider-base/slider-base.js", 143);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_uiSetRailLength", 158);
_yuitest_coverline("build/slider-base/slider-base.js", 159);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "renderThumb", 170);
_yuitest_coverline("build/slider-base/slider-base.js", 171);
this._initThumbUrl();

        _yuitest_coverline("build/slider-base/slider-base.js", 173);
var imageUrl = this.get( 'thumbUrl' );

        _yuitest_coverline("build/slider-base/slider-base.js", 175);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_onThumbClick", 192);
_yuitest_coverline("build/slider-base/slider-base.js", 193);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "bindUI", 204);
_yuitest_coverline("build/slider-base/slider-base.js", 207);
var boundingBox = this.get("boundingBox"), //Y.one('body'),
        // Looking for a key event which will fire continously across browsers while the key is held down.
        keyEvent = (!Y.UA.opera) ? "down:" : "press:",            
        // 38, 40 = arrow up/down, 33, 34 = page up/down,  35 , 36 = end/home
        keyEventSpec = keyEvent + "38,40,33,34,35,36",
        // 37 , 39 = arrow left/right
        keyLeftRightSpec = keyEvent + "37,39",
        // 37 , 39 = arrow left/right + meta (command/apple key) for mac
        keyLeftRightSpecMeta = keyEvent + "37+meta,39+meta";

        _yuitest_coverline("build/slider-base/slider-base.js", 217);
boundingBox.on("key", this._onDirectionKey, keyEventSpec, this);
        _yuitest_coverline("build/slider-base/slider-base.js", 218);
boundingBox.on("key", this._onLeftRightKey, keyLeftRightSpec, this);
        _yuitest_coverline("build/slider-base/slider-base.js", 219);
boundingBox.on("key", this._onLeftRightKeyMeta, keyLeftRightSpecMeta, this);
        // End keyboard listeners //////////////////////////////////

        _yuitest_coverline("build/slider-base/slider-base.js", 222);
this.thumb.on('click', this._onThumbClick, this);

        _yuitest_coverline("build/slider-base/slider-base.js", 224);
this._bindThumbDD();

        _yuitest_coverline("build/slider-base/slider-base.js", 226);
this._bindValueLogic();

        _yuitest_coverline("build/slider-base/slider-base.js", 228);
this.after( 'disabledChange', this._afterDisabledChange );
        _yuitest_coverline("build/slider-base/slider-base.js", 229);
this.after( 'lengthChange',   this._afterLengthChange );
        
    },
                      
    /**
     * increments Slider value by a minor increment
     *
     * @method _incrMinor
     * @protected
     */
    _incrMinor : function(){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_incrMinor", 239);
_yuitest_coverline("build/slider-base/slider-base.js", 240);
this.set('value', (this.get('value') + this.get('minorStep')));
    },
    
    /**
     * decrements Slider value by a minor increment
     *
     * @method _decrMinor
     * @protected
     */
    _decrMinor : function(){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_decrMinor", 249);
_yuitest_coverline("build/slider-base/slider-base.js", 250);
this.set('value', (this.get('value') - this.get('minorStep')));
    },
        
    /**
     * increments Slider value by a major increment
     *
     * @method _incrMajor
     * @protected
     */
    _incrMajor : function(){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_incrMajor", 259);
_yuitest_coverline("build/slider-base/slider-base.js", 260);
this.set('value', (this.get('value') + this.get('majorStep')));
    },
    
    /**
     * decrements Slider value by a major increment
     *
     * @method _decrMajor
     * @protected
     */
    _decrMajor : function(){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_decrMajor", 269);
_yuitest_coverline("build/slider-base/slider-base.js", 270);
this.set('value', (this.get('value') - this.get('majorStep')));
    },

    /**
     * sets the Slider value to the min value. 
     *
     * @method _setToMin
     * @protected
     */
    _setToMin : function(e){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_setToMin", 279);
_yuitest_coverline("build/slider-base/slider-base.js", 280);
this.set('value', this.get('min'));
    },

    /**
     * sets the Slider value to the max value. 
     *
     * @method _setToMax
     * @protected
     */
    _setToMax : function(e){
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_setToMax", 289);
_yuitest_coverline("build/slider-base/slider-base.js", 290);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_onDirectionKey", 303);
_yuitest_coverline("build/slider-base/slider-base.js", 304);
e.preventDefault();
        _yuitest_coverline("build/slider-base/slider-base.js", 305);
if(this.get('disabled') === false){
            _yuitest_coverline("build/slider-base/slider-base.js", 306);
switch (e.charCode) {
                case 38: // up
                    _yuitest_coverline("build/slider-base/slider-base.js", 308);
this._incrMinor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 309);
break;
                case 40: // down
                    _yuitest_coverline("build/slider-base/slider-base.js", 311);
this._decrMinor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 312);
break;
                case 36: // home
                    _yuitest_coverline("build/slider-base/slider-base.js", 314);
this._setToMin();
                    _yuitest_coverline("build/slider-base/slider-base.js", 315);
break;
                case 35: // end
                    _yuitest_coverline("build/slider-base/slider-base.js", 317);
this._setToMax();
                    _yuitest_coverline("build/slider-base/slider-base.js", 318);
break;
                case 33: // page up
                    _yuitest_coverline("build/slider-base/slider-base.js", 320);
this._incrMajor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 321);
break;
                case 34: // page down
                    _yuitest_coverline("build/slider-base/slider-base.js", 323);
this._decrMajor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 324);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_onLeftRightKey", 336);
_yuitest_coverline("build/slider-base/slider-base.js", 337);
e.preventDefault();
        _yuitest_coverline("build/slider-base/slider-base.js", 338);
if(this.get('disabled') === false){
            _yuitest_coverline("build/slider-base/slider-base.js", 339);
switch (e.charCode) {
                case 37: // left
                    _yuitest_coverline("build/slider-base/slider-base.js", 341);
this._decrMinor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 342);
break;
                case 39: // right
                    _yuitest_coverline("build/slider-base/slider-base.js", 344);
this._incrMinor();
                    _yuitest_coverline("build/slider-base/slider-base.js", 345);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_onLeftRightKeyMeta", 357);
_yuitest_coverline("build/slider-base/slider-base.js", 358);
e.preventDefault();
        _yuitest_coverline("build/slider-base/slider-base.js", 359);
if(this.get('disabled') === false){
            _yuitest_coverline("build/slider-base/slider-base.js", 360);
switch (e.charCode) {
                case 37: // left + meta
                    _yuitest_coverline("build/slider-base/slider-base.js", 362);
this._setToMin();
                    _yuitest_coverline("build/slider-base/slider-base.js", 363);
break;
                case 39: // right + meta
                    _yuitest_coverline("build/slider-base/slider-base.js", 365);
this._setToMax();
                    _yuitest_coverline("build/slider-base/slider-base.js", 366);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_bindThumbDD", 381);
_yuitest_coverline("build/slider-base/slider-base.js", 382);
var config = { constrain: this.rail };
        
        // { constrain: rail, stickX: true }
        _yuitest_coverline("build/slider-base/slider-base.js", 385);
config[ 'stick' + this.axis.toUpperCase() ] = true;

        /** 
         * The DD.Drag instance linked to the thumb node.
         *
         * @property _dd
         * @type {DD.Drag}
         * @protected
         */
        _yuitest_coverline("build/slider-base/slider-base.js", 394);
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
        _yuitest_coverline("build/slider-base/slider-base.js", 407);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_uiMoveThumb", 428);
_yuitest_coverline("build/slider-base/slider-base.js", 429);
if ( this.thumb ) {
            _yuitest_coverline("build/slider-base/slider-base.js", 430);
this.thumb.setStyle( this._key.minEdge, offset + 'px' );


            _yuitest_coverline("build/slider-base/slider-base.js", 433);
options || (options = {});
            _yuitest_coverline("build/slider-base/slider-base.js", 434);
options.offset = offset;

            _yuitest_coverline("build/slider-base/slider-base.js", 436);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_onDragStart", 447);
_yuitest_coverline("build/slider-base/slider-base.js", 462);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_afterDrag", 475);
_yuitest_coverline("build/slider-base/slider-base.js", 476);
var thumbXY = e.info.xy[ this._key.xyIndex ],
            railXY  = e.target.con._regionCache[ this._key.minEdge ];

        _yuitest_coverline("build/slider-base/slider-base.js", 479);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_afterDragEnd", 493);
_yuitest_coverline("build/slider-base/slider-base.js", 508);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_afterDisabledChange", 521);
_yuitest_coverline("build/slider-base/slider-base.js", 522);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_afterLengthChange", 533);
_yuitest_coverline("build/slider-base/slider-base.js", 534);
if ( this.get( 'rendered' ) ) {
            _yuitest_coverline("build/slider-base/slider-base.js", 535);
this._uiSetRailLength( e.newVal );

            _yuitest_coverline("build/slider-base/slider-base.js", 537);
this.syncUI();
        }
    },

    /**
     * Synchronizes the DOM state with the attribute settings.
     *
     * @method syncUI
     */
    syncUI : function () {
        _yuitest_coverfunc("build/slider-base/slider-base.js", "syncUI", 546);
_yuitest_coverline("build/slider-base/slider-base.js", 547);
this._dd.con.resetCache();

        _yuitest_coverline("build/slider-base/slider-base.js", 549);
this._syncThumbPosition();

        // Forces a reflow of the bounding box to address IE8 inline-block
        // container not expanding correctly. bug 2527905
        //this.get('boundingBox').toggleClass('');
        _yuitest_coverline("build/slider-base/slider-base.js", 554);
this.thumb.set('aria-valuemin', this.get('min'));
        _yuitest_coverline("build/slider-base/slider-base.js", 555);
this.thumb.set('aria-valuemax', this.get('max'));

        _yuitest_coverline("build/slider-base/slider-base.js", 557);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_setAxis", 580);
_yuitest_coverline("build/slider-base/slider-base.js", 581);
v = ( v + '' ).toLowerCase();

        _yuitest_coverline("build/slider-base/slider-base.js", 583);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_setLength", 599);
_yuitest_coverline("build/slider-base/slider-base.js", 600);
v = ( v + '' ).toLowerCase();

        _yuitest_coverline("build/slider-base/slider-base.js", 602);
var length = parseFloat( v, 10 ),
            units  = v.replace( /[\d\.\-]/g, '' ) || this.DEF_UNIT;

        _yuitest_coverline("build/slider-base/slider-base.js", 605);
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
        _yuitest_coverfunc("build/slider-base/slider-base.js", "_initThumbUrl", 619);
_yuitest_coverline("build/slider-base/slider-base.js", 620);
if (!this.get('thumbUrl')) {
            _yuitest_coverline("build/slider-base/slider-base.js", 621);
var skin = this.getSkinName() || 'sam',
                base = Y.config.base;

            // Unfortunate hack to avoid requesting image resources from the
            // combo service.  The combo service does not serve images.
            _yuitest_coverline("build/slider-base/slider-base.js", 626);
if (base.indexOf('http://yui.yahooapis.com/combo') === 0) {
                _yuitest_coverline("build/slider-base/slider-base.js", 627);
base = 'http://yui.yahooapis.com/' + Y.version + '/build/';
            }

            // <img src="/path/to/build/slider-base/assets/skins/sam/thumb-x.png">
            _yuitest_coverline("build/slider-base/slider-base.js", 631);
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
