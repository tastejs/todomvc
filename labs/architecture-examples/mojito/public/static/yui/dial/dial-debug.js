/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('dial', function (Y, NAME) {

/**
 * Create a circular dial value range input visualized as a draggable handle on a
 * background element.
 *
 * @module dial
 */
    var supportsVML = false;
        //testVMLNode;

    if (Y.UA.ie && Y.UA.ie < 9){
        supportsVML = true;
    }

    var Lang = Y.Lang,
        Widget = Y.Widget,
        Node = Y.Node;

    /**
     * Create a dial to represent an input control capable of representing a
     * series of intermediate states based on the position of the Dial's handle.
     * These states are typically aligned to a value algorithm whereby the angle of the handle's
     * position corresponds to a given value.
     *
     * @class Dial
     * @extends Widget
     * @param config {Object} Configuration object
     * @constructor
     */
    function Dial(config) {
        Dial.superclass.constructor.apply(this, arguments);
    }

    // Y.Dial static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'dial'
     * @readOnly
     * @protected
     * @static
     */
    Dial.NAME = "dial";

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    Dial.ATTRS = {

        /**
         * minimum value allowed
         *
         * @attribute min
         * @type {Number}
         * @default -220
         */
        min : {
            value:-220
        },

        /**
         * maximum value allowed
         *
         * @attribute max
         * @type {Number}
         * @default 220
         */
        max : {
            value:220
        },

        /**
         * diameter of the circular background object.
         * Other objects scale accordingly.
         * Set this only before rendering.
         *
         * @attribute diameter
         * @type {Number} the number of px in diameter
         * @default 100
         * @writeOnce
         */
        diameter : {
            value:100
        },

        /**
         * diameter of the handle object which users drag to change the value.
         * Dial sets the pixel dimension of the handle equal to handleDiameter * diameter.
         * Set this only before rendering.
         *
         * @attribute handleDiameter
         * @type {Number}
         * @default 0.2
         * @writeOnce
         */
        handleDiameter : {
            value:0.2
        },

        /**
         * diameter of the marker object which follows the angle of the handle during value changes.
         * Dial sets the pixel dimension of the marker equal to markerDiameter * diameter.
         * Set this only before rendering.
         *
         * @attribute markerDiameter
         * @type {Number}
         * @default 0.1
         * @writeOnce
         */
        markerDiameter : {
            value:0.1
        },

        /**
         * diameter of the center button object.
         * Dial sets the pixel dimension of the centerButton equal to centerButtonDiameter * diameter.
         * Set this only before rendering.
         *
         * @attribute centerButtonDiameter
         * @type {Number}
         * @default 0.1
         * @writeOnce
         */
        centerButtonDiameter : {
            value:0.5
        },

        /**
         * initial value of the Dial
         *
         * @attribute value
         * @type {Number}
         * @default 0
         */
        value : {
            value:0,
            validator: function(val) {
                return this._validateValue(val);
            }
        },

        /**
         * amount to increment/decrement the dial value
         * when the arrow up/down/left/right keys are pressed
         *
         * @attribute minorStep
         * @type {Number}
         * @default 1
         */
        minorStep : {
            value:1
        },

        /**
         * amount to increment/decrement the dial value
         * when the page up/down keys are pressed
         *
         * @attribute majorStep
         * @type {Number}
         * @default 10
         */
        majorStep : {
            value:10
        },

        /**
         * number of value increments in one 360 degree revolution
         * of the handle around the dial
         *
         * @attribute stepsPerRevolution
         * @type {Number}
         * @default 100
         */
        stepsPerRevolution : {
            value:100
        },

        /**
         * number of decimal places of accuracy in the value
         *
         * @attribute decimalPlaces
         * @type {Number}
         * @default 0
         */
        decimalPlaces : {
            value:0
        },

        /**
         * visible strings for the dial UI. This attribute is
         * defined by the base Widget class but has an empty value. The
         * Dial is simply providing a default value for the attribute.
         * Gets localized strings in the current language
         *
         * @attribute strings
         * @type {Object} the values are HTML strings
         * @default {label: 'My label', resetStr: 'Reset', tooltipHandle: 'Drag to set value'}
         */
        strings: {
            valueFn: function () {
                return Y.Intl.get('dial');
            }
        },

        /**
         * distance from the center of the dial to the
         * center of the marker and handle, when at rest.
         * The value is a percent of the radius of the dial.
         *
         * @attribute handleDistance
         * @type {number}
         * @default 0.75
         */
        handleDistance:{
            value:0.75
        }

    };

    /**
     * returns a properly formed yui class name
     *
     * @method
     * @param {String} string to be appended at the end of class name
     * @return
     * @private
     */
    function makeClassName(str) {
        return Y.ClassNameManager.getClassName(Dial.NAME, str);
    }

	 /** array of static constants used to identify the classname applied to the Dial DOM objects
	 *
     * @property CSS_CLASSES
     * @type {Array}
     * @private
     * @static
     */
    Dial.CSS_CLASSES = {
        label : makeClassName("label"),
        labelString : makeClassName("label-string"),
        valueString : makeClassName("value-string"),
        northMark : makeClassName("north-mark"),
        ring : makeClassName('ring'),
        ringVml : makeClassName('ring-vml'),
        marker : makeClassName("marker"),
        markerVml : makeClassName("marker-vml"),
        markerMaxMin : makeClassName("marker-max-min"),
        centerButton : makeClassName("center-button"),
        centerButtonVml : makeClassName('center-button-vml'),
        resetString : makeClassName("reset-string"),
        handle : makeClassName("handle"),
        handleVml : makeClassName("handle-vml"),
        hidden : makeClassName("hidden"),
        dragging : Y.ClassNameManager.getClassName("dd-dragging")
    };

    /* Static constants used to define the markup templates used to create Dial DOM elements */


    /**
     * template that will contain the Dial's label.
     *
     * @property LABEL_TEMPLATE
     * @type {HTML}
     * @default &lt;div class="[...-label]">&lt;span id="" class="[...-label-string]">{label}&lt;/span>&lt;span class="[...-value-string]">&lt;/span>&lt;/div>
     * @protected
     */

	Dial.LABEL_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.label + '"><span id="" class="' + Dial.CSS_CLASSES.labelString + '">{label}</span><span class="' + Dial.CSS_CLASSES.valueString + '"></span></div>';

	if(supportsVML === false){
		/**
		 * template that will contain the Dial's background ring.
		 *
		 * @property RING_TEMPLATE
		 * @type {HTML}
		 * @default &lt;div class="[...-ring]">&lt;div class="[...-northMark]">&lt;/div>&lt;/div>
		 * @protected
		 */
		Dial.RING_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.ring + '"><div class="' + Dial.CSS_CLASSES.northMark + '"></div></div>';

		/**
		 * template that will contain the Dial's current angle marker.
		 *
		 * @property MARKER_TEMPLATE
		 * @type {HTML}
		 * @default &lt;div class="[...-marker] [...-marker-hidden]">&lt;div class="[...-markerUser]">&lt;/div>&lt;/div>
		 * @protected
		 */
		Dial.MARKER_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.marker + ' ' + Dial.CSS_CLASSES.hidden + '"></div>';

		/**
		 * template that will contain the Dial's center button.
		 *
		 * @property CENTER_BUTTON_TEMPLATE
		 * @type {HTML}
		 * @default &lt;div class="[...-centerButton]">&lt;div class="[...-resetString]">' + Y.Lang.sub('{resetStr}', Dial.ATTRS.strings.value) + '&lt;/div>&lt;/div>
		 * @protected
		 */
		Dial.CENTER_BUTTON_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.centerButton + '"><div class="' + Dial.CSS_CLASSES.resetString + ' ' + Dial.CSS_CLASSES.hidden + '">{resetStr}</div></div>';

		/**
		 * template that will contain the Dial's handle.
		 *
		 * @property HANDLE_TEMPLATE
		 * @type {HTML}
		 * @default &lt;div class="[...-handle]">&lt;div class="[...-handleUser]" aria-labelledby="" aria-valuetext="" aria-valuemax="" aria-valuemin="" aria-valuenow="" role="slider"  tabindex="0">&lt;/div>&lt;/div>';// title="{tooltipHandle}"
		 * @protected
		 */
		Dial.HANDLE_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.handle + '" aria-labelledby="" aria-valuetext="" aria-valuemax="" aria-valuemin="" aria-valuenow="" role="slider"  tabindex="0" title="{tooltipHandle}">';

	}else{ // VML case
		Dial.RING_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.ring +  ' ' + Dial.CSS_CLASSES.ringVml + '">'+
								'<div class="' + Dial.CSS_CLASSES.northMark + '"></div>'+
									'<v:oval strokecolor="#ceccc0" strokeweight="1px"><v:fill type=gradient color="#8B8A7F" color2="#EDEDEB" angle="45"/></v:oval>'+
								'</div>'+
								'';
		Dial.MARKER_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.markerVml + ' ' + Dial.CSS_CLASSES.hidden + '">'+
										'<v:oval stroked="false">'+
											'<v:fill opacity="20%" color="#000"/>'+
										'</v:oval>'+
								'</div>'+
								'';
		Dial.CENTER_BUTTON_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.centerButton + ' ' + Dial.CSS_CLASSES.centerButtonVml + '">'+
											'<v:oval strokecolor="#ceccc0" strokeweight="1px">'+
												'<v:fill type=gradient color="#C7C5B9" color2="#fefcf6" colors="35% #d9d7cb, 65% #fefcf6" angle="45"/>'+
												'<v:shadow on="True" color="#000" opacity="10%" offset="2px, 2px"/>'+
											'</v:oval>'+
											'<div class="' + Dial.CSS_CLASSES.resetString + ' ' + Dial.CSS_CLASSES.hidden + '">{resetStr}</div>'+
									'</div>'+
									'';
		Dial.HANDLE_TEMPLATE = '<div class="' + Dial.CSS_CLASSES.handleVml + '" aria-labelledby="" aria-valuetext="" aria-valuemax="" aria-valuemin="" aria-valuenow="" role="slider"  tabindex="0" title="{tooltipHandle}">'+
										'<v:oval stroked="false">'+
											'<v:fill opacity="20%" color="#6C3A3A"/>'+
										'</v:oval>'+
								'</div>'+
								'';
	}

    /* Dial extends the base Widget class */
    Y.extend(Dial, Widget, {

        /**
         * creates the DOM structure for the Dial.
         *
         * @method renderUI
         * @protected
         */
        renderUI : function() {
            this._renderLabel();
            this._renderRing();
            this._renderMarker();
            this._renderCenterButton();
            this._renderHandle();

            // object handles
            this.contentBox = this.get("contentBox");

            // constants
            this._originalValue = this.get('value');
            this._minValue = this.get('min'); // saves doing a .get many times, but we need to remember to update this if/when we allow changing min or max after instantiation
            this._maxValue = this.get('max');
            this._stepsPerRevolution = this.get('stepsPerRevolution');
            this._minTimesWrapped = (Math.floor(this._minValue / this._stepsPerRevolution - 1));
            this._maxTimesWrapped = (Math.floor(this._maxValue / this._stepsPerRevolution + 1));

            // variables
            this._timesWrapped = 0;
            this._angle = this._getAngleFromValue(this.get('value'));
            this._prevAng = this._angle;

            // init
            this._setTimesWrappedFromValue(this._originalValue);
            this._handleNode.set('aria-valuemin', this._minValue);
            this._handleNode.set('aria-valuemax', this._maxValue);
        },

        /**
         * Sets -webkit-border-radius to 50% of width/height of the ring, handle, marker, and center-button.
         * This is needed for iOS 3.x.
         * The objects render square if the radius is > 50% of the width/height
         * @method _setBorderRadius
         * @private
         */
        _setBorderRadius : function(){
            this._ringNode.setStyles({'WebkitBorderRadius':this._ringNodeRadius + 'px',
                                        'MozBorderRadius':this._ringNodeRadius + 'px',
                                        'borderRadius':this._ringNodeRadius + 'px'
                                     });
            this._handleNode.setStyles({'WebkitBorderRadius':this._handleNodeRadius + 'px',
                                        'MozBorderRadius':this._handleNodeRadius + 'px',
                                        'borderRadius':this._handleNodeRadius + 'px'
                                     });
            this._markerNode.setStyles({'WebkitBorderRadius':this._markerNodeRadius + 'px',
                                        'MozBorderRadius':this._markerNodeRadius + 'px',
                                        'borderRadius':this._markerNodeRadius + 'px'
                                     });
            this._centerButtonNode.setStyles({'WebkitBorderRadius':this._centerButtonNodeRadius + 'px',
                                        'MozBorderRadius':this._centerButtonNodeRadius + 'px',
                                        'borderRadius':this._centerButtonNodeRadius + 'px'
                                     });
        },

        /**
         * Handles the mouseenter on the centerButton
         *
         * @method _handleCenterButtonEnter
         * @protected
         */
        _handleCenterButtonEnter : function(){
            this._resetString.removeClass(Dial.CSS_CLASSES.hidden);
        },

        /**
         * Handles the mouseleave on the centerButton
         *
         * @method _handleCenterButtonLeave
         * @protected
         */
        _handleCenterButtonLeave : function(){
            this._resetString.addClass(Dial.CSS_CLASSES.hidden);
        },

        /**
         * Creates the Y.DD.Drag instance used for the handle movement and
         * binds Dial interaction to the configured value model.
         *
         * @method bindUI
         * @protected
         */
        bindUI : function() {

            this.after("valueChange", this._afterValueChange);

            var boundingBox = this.get("boundingBox"),
                // Looking for a key event which will fire continously across browsers while the key is held down.
                keyEvent = (!Y.UA.opera) ? "down:" : "press:",
                // 38, 40 = arrow up/down, 33, 34 = page up/down,  35 , 36 = end/home
                keyEventSpec = keyEvent + "38,40,33,34,35,36",
                // 37 , 39 = arrow left/right
                keyLeftRightSpec = keyEvent + "37,39",
                // 37 , 39 = arrow left/right + meta (command/apple key) for mac
                keyLeftRightSpecMeta = keyEvent + "37+meta,39+meta",
                Drag = Y.DD.Drag;

            Y.on("key", Y.bind(this._onDirectionKey, this), boundingBox, keyEventSpec);
            Y.on("key", Y.bind(this._onLeftRightKey, this), boundingBox, keyLeftRightSpec);
            boundingBox.on("key", this._onLeftRightKeyMeta, keyLeftRightSpecMeta, this);

            Y.on('mouseenter', Y.bind(this._handleCenterButtonEnter, this), this._centerButtonNode);
            Y.on('mouseleave', Y.bind(this._handleCenterButtonLeave, this), this._centerButtonNode);
            // Needed to replace mousedown/up with gesturemovestart/end to make behavior on touch devices work the same.
            Y.on('gesturemovestart', Y.bind(this._resetDial, this), this._centerButtonNode);  //[#2530441]
            Y.on('gesturemoveend', Y.bind(this._handleCenterButtonMouseup, this), this._centerButtonNode);


            Y.on(Drag.START_EVENT, Y.bind(this._handleHandleMousedown, this), this._handleNode);
            Y.on(Drag.START_EVENT, Y.bind(this._handleMousedown, this), this._ringNode); // [#2530766]

            //TODO: Can this be merged this into the drag:end event listener to avoid another registration?
            Y.on('gesturemoveend', Y.bind(this._handleRingMouseup, this), this._ringNode);

            this._dd1 = new Drag({ //// [#2530206] changed global this._dd1 from just var dd1 = new Y.DD.drag so
                node: this._handleNode,
                on : {
                    'drag:drag' : Y.bind(this._handleDrag, this),
                    'drag:start' : Y.bind(this._handleDragStart, this),
                    'drag:end' : Y.bind(this._handleDragEnd, this) //,
                }
            });
            Y.bind(this._dd1.addHandle(this._ringNode), this); // [#2530206] added the ring as a handle to the dd1 (the dd of the handleNode)
        },

        /**
         * Sets _timesWrapped based on Dial value
         * to net integer revolutions the user dragged the handle around the Dial
         *
         * @method _setTimesWrappedFromValue
         * @param val {Number} current value of the Dial
         * @private
         */
        _setTimesWrappedFromValue : function(val){
            if(val % this._stepsPerRevolution === 0){
                this._timesWrapped = (val / this._stepsPerRevolution);
            }else{
                this._timesWrapped = Math.floor(val / this._stepsPerRevolution);
            }
        },

        /**
         * gets the angle of the line from the center of the Dial to the center of the handle
         *
         * @method _getAngleFromHandleCenter
         * @param handleCenterX {number}
         * @param handleCenterY {number}
         * @return ang {number} the angle
         * @protected
         */
        _getAngleFromHandleCenter : function(handleCenterX, handleCenterY){
            var ang = Math.atan( (this._dialCenterY - handleCenterY)  /  (this._dialCenterX - handleCenterX)  ) * (180 / Math.PI);
            ang = ((this._dialCenterX - handleCenterX) < 0) ? ang + 90 : ang + 90 + 180; // Compensate for neg angles from Math.atan
            return ang;
        },

        /**
         * calculates the XY of the center of the dial relative to the ring node.
         * This is needed for calculating the angle of the handle
         *
         * @method _calculateDialCenter
         * @protected
         */
        _calculateDialCenter : function(){ // #2531111 value, and marker don't track handle when dial position changes on page (resize when inline)
            this._dialCenterX = this._ringNode.get('offsetWidth') / 2;
            this._dialCenterY = this._ringNode.get('offsetHeight') / 2;
        },

        /**
         * Handles the mouseup on the ring
         *
         * @method _handleRingMouseup
         * @protected
         */
        _handleRingMouseup : function(){
            this._handleNode.focus();  // need to re-focus on the handle so keyboard is accessible [#2530206]
        },

        /**
         * Handles the mouseup on the centerButton
         *
         * @method _handleCenterButtonMouseup
         * @protected
         */
        _handleCenterButtonMouseup : function(){
            this._handleNode.focus();  // need to re-focus on the handle so keyboard is accessible [#2530206]
        },

        /**
         * Handles the mousedown on the handle
         *
         * @method _handleHandleMousedown
         * @protected
         */
        _handleHandleMousedown : function(){
            this._handleNode.focus();  // need to re-focus on the handle so keyboard is accessible [#2530206]
            // this is better done here instead of on _handleDragEnd
            // because we should make the keyboard accessible after a click of the handle
        },

        /**
         * handles the user dragging the handle around the Dial, gets the angle,
         * checks for wrapping around top center.
         * Sets the new value of the Dial
         *
         * @method _handleDrag
         * @param e {DOMEvent} the drag event object
         * @protected
         */
        _handleDrag : function(e){
            var handleCenterX,
            handleCenterY,
            ang,
            newValue;

            // The event was emitted from drag:drag of handle.
            // The center of the handle is top left position of the handle node + radius of handle.
            // This is different than a mousedown on the ring.
            handleCenterX = (parseInt(this._handleNode.getStyle('left'),10) + this._handleNodeRadius);
            handleCenterY = (parseInt(this._handleNode.getStyle('top'),10) + this._handleNodeRadius);
            ang = this._getAngleFromHandleCenter(handleCenterX, handleCenterY);

            // check for need to set timesWrapped
            if((this._prevAng > 270) && (ang < 90)){ // If wrapping, clockwise
                if(this._timesWrapped < this._maxTimesWrapped){
                    this._timesWrapped = (this._timesWrapped + 1);
                }
            }else if((this._prevAng < 90) && (ang > 270)){ // if un-wrapping, counter-clockwise
                if(this._timesWrapped > this._minTimesWrapped){
                   this._timesWrapped = (this._timesWrapped - 1);
                }
            }
            newValue = this._getValueFromAngle(ang); // This function needs the current _timesWrapped value. That's why it comes after the _timesWrapped code above

            // If you've gone past max more than one full revolution, we decrement the _timesWrapped value
            // This gives the effect of a ratchet mechanism.
            // It feels like you are never more than one revolution past max
            // The effect is the same for min, only in reverse.
            // We can't reset the _timesWrapped to the max or min here.
            // If we did, the next (continuous) drag would reset the value incorrectly.
            if(newValue > (this._maxValue + this._stepsPerRevolution) ){
                this._timesWrapped --;
            }else if(newValue < (this._minValue - this._stepsPerRevolution) ){
                this._timesWrapped ++;
            }
            this._prevAng = ang; // need to keep the previous angle in order to check for wrapping on the next drag, click, or keypress

            this._handleValuesBeyondMinMax(e, newValue);
        },

        /**
         * handles a mousedown or gesturemovestart event on the ring node
         *
         * @method _handleMousedown
         * @param e {DOMEvent} the event object
         * @private
         */
        _handleMousedown : function(e){ // #2530306

            if (this._ringNode.compareTo(e.target)) {
                var minAng = this._getAngleFromValue(this._minValue),
                maxAng = this._getAngleFromValue(this._maxValue),
                newValue, oppositeMidRangeAngle,
                handleCenterX, handleCenterY,
                ang;



                // The event was emitted from mousedown on the ring node,
                // so the center of the handle should be the XY of mousedown.
                if(Y.UA.ios){  // ios adds the scrollLeft and top onto clientX and Y in a native click
                    handleCenterX = (e.clientX - this._ringNode.getX());
                    handleCenterY = (e.clientY - this._ringNode.getY());
                }else{
                    handleCenterX = (e.clientX + Y.one('document').get('scrollLeft') - this._ringNode.getX());
                    handleCenterY = (e.clientY + Y.one('document').get('scrollTop') - this._ringNode.getY());
                }
                ang = this._getAngleFromHandleCenter(handleCenterX, handleCenterY);

                /* ///////////////////////////////////////////////////////////////////////////////////////////////////////
                * The next sections of logic
                * set this._timesWrapped in the different cases of value range
                * and value range position,
                * then the Dial value is set at the end of this method
                */ ///////////////////////////////////////////////////////////////////////////////////////////////////////


                ////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if(this._maxValue - this._minValue > this._stepsPerRevolution){

                // Case: range min-to-max is greater than stepsPerRevolution (one revolution)

                    // This checks the shortest way around the dial between the prevAng and this ang.
                    if(Math.abs(this._prevAng - ang) > 180){ // this crossed a wrapping

                        // Only change the _timesWrapped if it's between minTimesWrapped and maxTimesWrapped
                        if((this._timesWrapped > this._minTimesWrapped) &&
                           (this._timesWrapped < this._maxTimesWrapped)
                        ){
                            // this checks which direction, clock wise or CCW and incr or decr _timesWrapped
                            this._timesWrapped = ((this._prevAng - ang) > 0) ? (this._timesWrapped + 1) : (this._timesWrapped - 1);
                        }
                    // special case of getting un-stuck from a min value case
                    // where timesWrapped is minTimesWrapped but new ang won't trigger a cross wrap boundry
                    // because prevAng is set to 0 or > 0
                    }else if(
                            (this._timesWrapped === this._minTimesWrapped) &&
                            (ang - this._prevAng < 180)
                    ){
                        this._timesWrapped ++;
                    } //it didn't cross a wrapping boundary

                } /////////////////////////////////////////////////////////////////////////////////////////////////////////
                else if(this._maxValue - this._minValue === this._stepsPerRevolution){
                // Case: range min-to-max === stepsPerRevolution     (one revolution)
                // This means min and max will be at same angle
                // This does not mean they are at "north"

                    if(ang < minAng){ // if mousedown angle is < minAng (and maxAng, because they're the same)
                                      // The only way it can be, is if min and max are not at north
                        this._timesWrapped = 1;
                    }else{
                        this._timesWrapped = 0;
                    }

                } //////////////////////////////////////////////////////////////////////////////////////////////////////////
                else if(minAng > maxAng){
                // Case: range includes the wrap point (north)
                // Because of "else if"...
                // range is < stepsPerRevolution

                    if(
                       (this._prevAng >= minAng) && // if prev angle was greater than angle of min and...
                       (ang <= (minAng + maxAng) / 2) // the angle of this click is less than
                                                      // the angle opposite the mid-range angle, then...
                    ){
                        this._timesWrapped ++;
                    }else if(
                        (this._prevAng <= maxAng) &&
                        // if prev angle is < max angle and...

                        (ang > (minAng + maxAng) / 2)
                        // the angle of this click is greater than,
                        // the angle opposite the mid-range angle and...

                    ){
                        this._timesWrapped --;
                    }

                } ////////////////////////////////////////////////////////////////////////////////////////////////////
                else{
                // "else" Case: min-to-max range doesn't include the wrap point
                // Because of "else if"...
                // range is still < stepsPerRevolution

                    if ((ang < minAng) || (ang > maxAng)){ // angle is out of range
                        oppositeMidRangeAngle = (((minAng + maxAng) / 2) + 180) % 360;
                        // This is the bisection of the min-to-max range + 180.  (opposite the bisection)

                        if(oppositeMidRangeAngle > 180){
                            newValue = ((maxAng < ang) && (ang < oppositeMidRangeAngle)) ? this.get('max') : this.get('min');
                        }else{ //oppositeMidRangeAngle <= 180
                            newValue = ((minAng > ang) && (ang > oppositeMidRangeAngle)) ? this.get('min') : this.get('max');
                        }
                        this._prevAng = this._getAngleFromValue(newValue);
                        this.set('value', newValue);
                        this._setTimesWrappedFromValue(newValue);
                        return;
                    }
                }

                // Now that _timesWrapped is set value .......................................................................
                newValue = this._getValueFromAngle(ang); // This function needs the correct, current _timesWrapped value.
                this._prevAng = ang;

                this._handleValuesBeyondMinMax(e, newValue);
            }
        },

        /**
         * handles the case where the value is less than min or greater than max
         *
         * @method _handleValuesBeyondMinMax
         * @param e {DOMEvent} the event object
         * @param newValue {number} current value of the dial
         * @protected
         */
        _handleValuesBeyondMinMax : function(e, newValue){ // #2530306
            // If _getValueFromAngle() is passed 0, it increments the _timesWrapped value.
            // handle hitting max and min and going beyond, stops at max or min
            if((newValue >= this._minValue) && (newValue <= this._maxValue)) {
                this.set('value', newValue);
                // [#2530206] transfer the mousedown event from the _ringNode to the _handleNode drag, so we can mousedown, then continue dragging
                if(e.currentTarget === this._ringNode){
                    // Delegate to DD's natural behavior
                    this._dd1._handleMouseDownEvent(e);
                }
            } else if(newValue > this._maxValue){
                this.set('value', this._maxValue);
                this._prevAng = this._getAngleFromValue(this._maxValue);  // #2530766 need for mousedown on the ring; causes prob for drag
            } else if(newValue < this._minValue){
                this.set('value', this._minValue);
               this._prevAng = this._getAngleFromValue(this._minValue);
            }
        },

        /**
         * handles the user starting to drag the handle around the Dial
         *
         * @method _handleDragStart
         * @param e {DOMEvent} the drag event object
         * @protected
         */
        _handleDragStart : function(e){
            this._markerNode.removeClass(Dial.CSS_CLASSES.hidden);
        },

        /*
         * When handle is handleDragEnd, this animates the return to the fixed dial
         */

        /**
         * handles the end of a user dragging the handle, animates the handle returning to
         * resting position.
         *
         * @method _handleDragEnd
         * @protected
         */
        _handleDragEnd : function(){
            var node = this._handleNode;
                node.transition({
                    duration: 0.08, // seconds
                    easing: 'ease-in',
                    left: this._setNodeToFixedRadius(this._handleNode, true)[0] + 'px',
                    top: this._setNodeToFixedRadius(this._handleNode, true)[1] + 'px'
                }, Y.bind(function(){
                        var value = this.get('value');
                        //[#2530206] only hide marker if not at max or min
                        // more persistant user visibility of when the dial is at max or min
                        if((value > this._minValue) && (value < this._maxValue)){
                            this._markerNode.addClass(Dial.CSS_CLASSES.hidden);
                        }else{
                            this._setTimesWrappedFromValue(value);  //#2530766 secondary bug when drag past max + cross wrapping boundry
                            this._prevAng = this._getAngleFromValue(value); //#2530766 secondary bug when drag past max + cross wrapping boundry
                        }
                    }, this)
                );
        },

        /**
         * returns the XY of the fixed position, handleDistance, from the center of the Dial (resting position).
         * The XY also represents the angle related to the current value.
         * If typeArray is true, [X,Y] is returned.
         * If typeArray is false, the XY of the obj node passed in is set.
         *
         * @method _setNodeToFixedRadius
         * @param obj {Node}
         * @param typeArray {Boolean} true returns an array [X,Y]
         * @protected
         * @return {Array} an array of [XY] is optionally returned
         */
         _setNodeToFixedRadius : function(obj, typeArray){
            var thisAngle = (this._angle - 90),
            rad = (Math.PI / 180),
            newY = Math.round(Math.sin(thisAngle * rad) * this._handleDistance),
            newX = Math.round(Math.cos(thisAngle * rad) * this._handleDistance),
            dia = obj.get('offsetWidth'); //Ticket #2529852

            newY = newY - (dia * 0.5);
            newX = newX - (dia * 0.5);
            if(typeArray){ // just need the style for css transform left and top to animate the handle drag:end
                return [(this._ringNodeRadius + newX), (this._ringNodeRadius + newY)];
            }else{
                obj.setStyle('left', (this._ringNodeRadius + newX) + 'px');
                obj.setStyle('top', (this._ringNodeRadius + newY) + 'px');
            }
         },

        /**
         * Synchronizes the DOM state with the attribute settings.
         *
         * @method syncUI
         */
        syncUI : function() {
            // Make the marker and the resetString display so their placement and borderRadius can be calculated, then hide them again.
            // We would have used visibility:hidden in the css of this class,
            // but IE8 VML never returns to visible after applying visibility:hidden then removing it.
            this._setSizes();
            this._calculateDialCenter(); // #2531111 initialize center of dial
            this._setBorderRadius();
            this._uiSetValue(this.get("value"));
            this._markerNode.addClass(Dial.CSS_CLASSES.hidden);
            this._resetString.addClass(Dial.CSS_CLASSES.hidden);
        },

        /**
         * sets the sizes of ring, center-button, marker, handle, and VML ovals in pixels.
         * Needed only because some IE versions
         * ignore CSS percent sizes/offsets.
         * so these must be set in pixels.
         * Normally these are set in % of the ring.
         *
         * @method _setSizes
         * @protected
         */
        _setSizes : function(){
            var dia = this.get('diameter'),
            offset, offsetResetX, offsetResetY,
            setSize = function(node, dia, percent){
                var suffix = 'px';
                node.getElementsByTagName('oval').setStyle('width', (dia * percent) + suffix);
                node.getElementsByTagName('oval').setStyle('height', (dia * percent) + suffix);
                node.setStyle('width', (dia * percent) + suffix);
                node.setStyle('height', (dia * percent) + suffix);
            };
            setSize(this._ringNode, dia, 1.0);
            setSize(this._handleNode, dia, this.get('handleDiameter'));
            setSize(this._markerNode, dia, this.get('markerDiameter'));
            setSize(this._centerButtonNode, dia, this.get('centerButtonDiameter'));

            // Set these (used for trig) this way instead of relative to dia,
            // in case they have borders, have images etc.
            this._ringNodeRadius = this._ringNode.get('offsetWidth') * 0.5;
            this._handleNodeRadius = this._handleNode.get('offsetWidth') * 0.5;
            this._markerNodeRadius = this._markerNode.get('offsetWidth') * 0.5;
            this._centerButtonNodeRadius = this._centerButtonNode.get('offsetWidth') * 0.5;
            this._handleDistance = this._ringNodeRadius * this.get('handleDistance');
            // place the centerButton
            offset = (this._ringNodeRadius - this._centerButtonNodeRadius);
            this._centerButtonNode.setStyle('left', offset + 'px');
            this._centerButtonNode.setStyle('top', offset + 'px');
            /*
            Place the resetString
            This seems like it should be able to be done with CSS,
            But since there is also a VML oval in IE that is absolute positioned,
            The resetString ends up behind the VML oval.
            */
            offsetResetX = (this._centerButtonNodeRadius - (this._resetString.get('offsetWidth') * 0.5));
            offsetResetY = (this._centerButtonNodeRadius - (this._resetString.get('offsetHeight') * 0.5));
            this._resetString.setStyles({'left':offsetResetX + 'px', 'top':offsetResetY + 'px'});
        },


        /**
         * renders the DOM object for the Dial's label
         *
         * @method _renderLabel
         * @protected
         */
        _renderLabel : function() {
            var contentBox = this.get("contentBox"),
                label = contentBox.one("." + Dial.CSS_CLASSES.label);
            if (!label) {
                label = Node.create(Y.Lang.sub(Dial.LABEL_TEMPLATE, this.get('strings')));
                contentBox.append(label);
            }
            this._labelNode = label;
            this._valueStringNode = this._labelNode.one("." + Dial.CSS_CLASSES.valueString);
        },

        /**
         * renders the DOM object for the Dial's background ring
         *
         * @method _renderRing
         * @protected
         */
        _renderRing : function() {
            var contentBox = this.get("contentBox"),
                ring = contentBox.one("." + Dial.CSS_CLASSES.ring);
            if (!ring) {
                ring = contentBox.appendChild(Dial.RING_TEMPLATE);
                ring.setStyles({width:this.get('diameter') + 'px', height:this.get('diameter') + 'px'});
            }
            this._ringNode = ring;
        },

        /**
         * renders the DOM object for the Dial's background marker which
         * tracks the angle of the user dragging the handle
         *
         * @method _renderMarker
         * @protected
         */
        _renderMarker : function() {
            var contentBox = this.get("contentBox"),
            marker = contentBox.one("." + Dial.CSS_CLASSES.marker);
            if (!marker) {
                marker = contentBox.one('.' + Dial.CSS_CLASSES.ring).appendChild(Dial.MARKER_TEMPLATE);
            }
            this._markerNode = marker;
        },

        /**
         * renders the DOM object for the Dial's center
         *
         * @method _renderCenterButton
         * @protected
         */
        _renderCenterButton : function() {
            var contentBox = this.get("contentBox"),
                centerButton = contentBox.one("." + Dial.CSS_CLASSES.centerButton);
            if (!centerButton) {
                centerButton = Node.create(Y.Lang.sub(Dial.CENTER_BUTTON_TEMPLATE, this.get('strings')));
                contentBox.one('.' + Dial.CSS_CLASSES.ring).append(centerButton);
            }
            this._centerButtonNode = centerButton;
            this._resetString = this._centerButtonNode.one('.' + Dial.CSS_CLASSES.resetString);
        },

        /**
         * renders the DOM object for the Dial's user draggable handle
         *
         * @method _renderHandle
         * @protected
         */
        _renderHandle : function() {
            var labelId = Dial.CSS_CLASSES.label + Y.guid(), //get this unique id once then use for handle and label for ARIA
                contentBox = this.get("contentBox"),
                handle = contentBox.one("." + Dial.CSS_CLASSES.handle);
            if (!handle) {
                handle = Node.create(Y.Lang.sub(Dial.HANDLE_TEMPLATE, this.get('strings')));
                handle.setAttribute('aria-labelledby', labelId);  // get unique id for specifying a label & handle for ARIA
                this._labelNode.one('.' + Dial.CSS_CLASSES.labelString).setAttribute('id', labelId);  // When handle gets focus, screen reader will include label text when reading the value.
                contentBox.one('.' + Dial.CSS_CLASSES.ring).append(handle);
            }
            this._handleNode = handle;
        },

        /**
         * sets the visible UI label HTML string
         *
         * @method _setLabelString
         * @param str {HTML}
         * @protected
         * @deprecated Use DialObjName.set('strings',{'label':'My new label'});   before DialObjName.render();

         */
        _setLabelString : function(str) {
            this.get("contentBox").one("." + Dial.CSS_CLASSES.labelString).setHTML(str);
        },

        /**
         * sets the visible UI label HTML string
         *
         * @method _setResetString
         * @param str {HTML}
         * @protected
         * @deprecated Use DialObjName.set('strings',{'resetStr':'My new reset string'});   before DialObjName.render();
         */
        _setResetString : function(str) {
             this.get("contentBox").one("." + Dial.CSS_CLASSES.resetString).setHTML(str);
            // this._setXYResetString(); // This used to recenter the string in the button. Done with CSS now. Method has been removed.
            // this._resetString.setHTML(''); //We no longer show/hide the reset string with setHTML but by addClass and removeClass .yui3-dial-reset-string-hidden
        },

        /**
         * sets the tooltip HTML string in the Dial's handle
         *
         * @method _setTooltipString
         * @param str {HTML}
         * @protected
         * @deprecated Use DialObjName.set('strings',{'tooltipHandle':'My new tooltip'});   before DialObjName.render();
         */
        _setTooltipString : function(str) {
            this._handleNode.set('title', str);
        },

        /**
         * sets the Dial's value in response to key events.
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
        },

        /**
         * sets the Dial's value in response to left or right key events
         *
         * @method _onLeftRightKey
         * @param e {Event} the key event
         * @protected
         */
        _onLeftRightKey : function(e) {
            e.preventDefault();
            switch (e.charCode) {
                case 37: // left
                    this._decrMinor();
                    break;
                case 39: // right
                    this._incrMinor();
                    break;
            }
        },

        /**
         * sets the Dial's value in response to left or right key events when a meta (mac command/apple) key is also pressed
         *
         * @method _onLeftRightKeyMeta
         * @param e {Event} the key event
         * @protected
         */
        _onLeftRightKeyMeta : function(e) {
            e.preventDefault();
            switch (e.charCode) {
                case 37: // left + meta
                    this._setToMin();
                    break;
                case 39: // right + meta
                    this._setToMax();
                    break;
            }
        },

        /**
         * increments Dial value by a minor increment
         *
         * @method _incrMinor
         * @protected
         */
        _incrMinor : function(){
                var newVal = (this.get('value') + this.get("minorStep"));
                newVal = Math.min(newVal, this.get("max"));
                // [#2530045] .toFixed returns a string.
                // Dial's value needs a number. -0 makes it a number, but removes trailing zeros.
                // Added toFixed(...) again in _uiSetValue where content of yui3-dial-value-string is set.
                // Removing the toFixed here, loses the feature of "snap-to" when for example, stepsPerRevolution is 10 and decimalPlaces is 0.
                this.set('value', newVal.toFixed(this.get('decimalPlaces')) - 0);
        },

        /**
         * decrements Dial value by a minor increment
         *
         * @method _decrMinor
         * @protected
         */
        _decrMinor : function(){
                var newVal = (this.get('value') - this.get("minorStep"));
                newVal = Math.max(newVal, this.get("min"));
                this.set('value', newVal.toFixed(this.get('decimalPlaces')) - 0);
        },

        /**
         * increments Dial value by a major increment
         *
         * @method _incrMajor
         * @protected
         */
        _incrMajor : function(){
                var newVal = (this.get('value') + this.get("majorStep"));
                newVal = Math.min(newVal, this.get("max"));
                this.set('value', newVal.toFixed(this.get('decimalPlaces')) - 0);
        },

        /**
         * decrements Dial value by a major increment
         *
         * @method _decrMajor
         * @protected
         */
        _decrMajor : function(){
                var newVal = (this.get('value') - this.get("majorStep"));
                newVal = Math.max(newVal, this.get("min"));
                this.set('value', newVal.toFixed(this.get('decimalPlaces')) - 0);
        },

        /**
         * sets Dial value to dial's max attr
         *
         * @method _setToMax
         * @protected
         */
        _setToMax : function(){
                this.set('value', this.get("max"));
        },

        /**
         * sets Dial value to dial's min attr
         *
         * @method _setToMin
         * @protected
         */
        _setToMin : function(){
                this.set('value', this.get("min"));
        },

        /**
         * resets Dial value to the orignal initial value.
         *
         * @method _resetDial
         * @protected
         */
        _resetDial : function(e){
            if(e){
                e.stopPropagation(); //[#2530206] need to add so mousedown doesn't propagate to ring and move the handle
            }
            this.set('value', this._originalValue);
            this._resetString.addClass(Dial.CSS_CLASSES.hidden); //[#2530441]
            this._handleNode.focus();
        },

        /**
         * returns the handle angle associated with the current value of the Dial.
         * Returns a number between 0 and 360.
         *
         * @method _getAngleFromValue
         * @param newVal {Number} the current value of the Dial
         * @return {Number} the angle associated with the current Dial value
         * @protected
         */
        _getAngleFromValue : function(newVal){
            var nonWrappedPartOfValue = newVal % this._stepsPerRevolution,
            angleFromValue = nonWrappedPartOfValue / this._stepsPerRevolution * 360;
            return (angleFromValue < 0) ? (angleFromValue + 360) : angleFromValue;
        },

        /**
         * returns the value of the Dial calculated from the current handle angle
         *
         * @method _getValueFromAngle
         * @param angle {Number} the current angle of the Dial's handle
         * @return {Number} the current Dial value corresponding to the handle position
         * @protected
         */
        _getValueFromAngle : function(angle){
            if(angle < 0){
                angle = (360 + angle);
            }else if(angle === 0){
                angle = 360;
            }
            var value = (angle / 360) * this._stepsPerRevolution;
            value = (value + (this._timesWrapped * this._stepsPerRevolution));
            //return Math.round(value * 100) / 100;
            return value.toFixed(this.get('decimalPlaces')) - 0;
        },

        /**
         * calls the method to update the UI whenever the Dial value changes
         *
         * @method _afterValueChange
         * @param e {Event}
         * @protected
         */
        _afterValueChange : function(e) {
            this._uiSetValue(e.newVal);
        },

        /**
         * Changes a value to have the correct decimal places per the attribute decimalPlaces
         *
         * @method _valueToDecimalPlaces
         * @param val {Number} a raw value to set to the Dial
         * @return {Number} the input val changed to have the correct decimal places
         * @protected
         */
        _valueToDecimalPlaces : function(val) { // [#2530206] cleaned up and better user feedback of when it's max or min.

        },

        /**
         * Updates the UI display value of the Dial to reflect
         * the value passed in.
         * Makes all other needed UI display changes
         *
         * @method _uiSetValue
         * @param val {Number} value of the Dial
         * @protected
         */
        _uiSetValue : function(val) { // [#2530206] cleaned up and better user feedback of when it's max or min.
            this._angle = this._getAngleFromValue(val);
            if(this._handleNode.hasClass(Dial.CSS_CLASSES.dragging) === false){
                this._setTimesWrappedFromValue(val);
                this._setNodeToFixedRadius(this._handleNode, false);
                this._prevAng = this._getAngleFromValue(this.get('value'));
            }
            this._valueStringNode.setHTML(val.toFixed(this.get('decimalPlaces'))); // [#2530045]
            this._handleNode.set('aria-valuenow', val);
            this._handleNode.set('aria-valuetext', val);
            this._setNodeToFixedRadius(this._markerNode, false);
            if((val === this._maxValue) || (val === this._minValue)){
                this._markerNode.addClass(Dial.CSS_CLASSES.markerMaxMin);
                if(supportsVML === true){
                    this._markerNode.getElementsByTagName('fill').set('color', '#AB3232');
                }
                this._markerNode.removeClass(Dial.CSS_CLASSES.hidden);
            }else{ // not max or min
                if(supportsVML === true){
                    this._markerNode.getElementsByTagName('fill').set('color', '#000');
                }
                this._markerNode.removeClass(Dial.CSS_CLASSES.markerMaxMin);
                if(this._handleNode.hasClass(Dial.CSS_CLASSES.dragging) === false){ // if not max || min, and not dragging handle, hide the marker
                    this._markerNode.addClass(Dial.CSS_CLASSES.hidden);
                }
            }
        },

        /**
         * value attribute default validator. Verifies that
         * the value being set lies between the min/max value
         *
         * @method _validateValue
         * @param val {Number} value of the Dial
         * @protected
         */
        _validateValue: function(val) {
            var min = this.get("min"),
                max = this.get("max");
            return (Lang.isNumber(val) && val >= min && val <= max);
        }
    });
    Y.Dial = Dial;


}, '3.7.3', {"requires": ["widget", "dd-drag", "event-mouseenter", "event-move", "event-key", "transition", "intl"], "lang": ["en", "es"], "skinnable": true});
