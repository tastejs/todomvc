/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('slider-value-range', function (Y, NAME) {

/**
 * Adds value support for Slider as a range of integers between a configured
 * minimum and maximum value.  For use with <code>Y.Base.build(..)</code> to
 * add the plumbing to <code>Y.SliderBase</code>.
 *
 * @module slider
 * @submodule slider-value-range
 */

// Constants for compression or performance
var MIN       = 'min',
    MAX       = 'max',
    VALUE     = 'value',
//     MINORSTEP = 'minorStep',
//     MAJORSTEP = 'majorStep',

    round = Math.round;

/**
 * One class of value algorithm that can be built onto SliderBase.  By default,
 * values range between 0 and 100, but you can configure these on the
 * built Slider class by setting the <code>min</code> and <code>max</code>
 * configurations.  Set the initial value (will cause the thumb to move to the
 * appropriate location on the rail) in configuration as well if appropriate.
 *
 * @class SliderValueRange
 */
function SliderValueRange() {
    this._initSliderValueRange();
}

Y.SliderValueRange = Y.mix( SliderValueRange, {

    // Prototype properties and methods that will be added onto host class
    prototype: {

        /**
         * Factor used to translate value -&gt; position -&gt; value.
         *
         * @property _factor
         * @type {Number}
         * @protected
         */
        _factor: 1,

        /**
         * Stub for construction logic.  Override if extending this class and
         * you need to set something up during the initializer phase.
         *
         * @method _initSliderValueRange
         * @protected
         */
        _initSliderValueRange: function () {},

        /**
         * Override of stub method in SliderBase that is called at the end of
         * its bindUI stage of render().  Subscribes to internal events to
         * trigger UI and related state updates.
         *
         * @method _bindValueLogic
         * @protected
         */
        _bindValueLogic: function () {
            this.after( {
                minChange  : this._afterMinChange,
                maxChange  : this._afterMaxChange,
                valueChange: this._afterValueChange
            } );
        },

        /**
         * Move the thumb to appropriate position if necessary.  Also resets
         * the cached offsets and recalculates the conversion factor to
         * translate position to value.
         *
         * @method _syncThumbPosition
         * @protected
         */
        _syncThumbPosition: function () {
            this._calculateFactor();

            this._setPosition( this.get( VALUE ) );
        },

        /**
         * Calculates and caches
         * (range between max and min) / (rail length)
         * for fast runtime calculation of position -&gt; value.
         *
         * @method _calculateFactor
         * @protected
         */
        _calculateFactor: function () {
            var length    = this.get( 'length' ),
                thumbSize = this.thumb.getStyle( this._key.dim ),
                min       = this.get( MIN ),
                max       = this.get( MAX );

            // The default thumb width is based on Sam skin's thumb dimension.
            // This attempts to allow for rendering off-DOM, then attaching
            // without the need to call syncUI().  It is still recommended
            // to call syncUI() in these cases though, just to be sure.
            length = parseFloat( length ) || 150;
            thumbSize = parseFloat( thumbSize ) || 15;

            this._factor = ( max - min ) / ( length - thumbSize );

        },

        /**
         * Dispatch the new position of the thumb into the value setting
         * operations.
         *
         * @method _defThumbMoveFn
         * @param e { EventFacade } The host's thumbMove event
         * @protected
         */
        _defThumbMoveFn: function ( e ) {
            // To prevent set('value', x) from looping back around
            if (e.source !== 'set') {
                this.set(VALUE, this._offsetToValue(e.offset));
            }
        },

        /**
         * <p>Converts a pixel position into a value.  Calculates current
         * thumb offset from the leading edge of the rail multiplied by the
         * ratio of <code>(max - min) / (constraining dim)</code>.</p>
         *
         * <p>Override this if you want to use a different value mapping
         * algorithm.</p>
         *
         * @method _offsetToValue
         * @param offset { Number } X or Y pixel offset
         * @return { mixed } Value corresponding to the provided pixel offset
         * @protected
         */
        _offsetToValue: function ( offset ) {

            var value = round( offset * this._factor ) + this.get( MIN );

            return round( this._nearestValue( value ) );
        },

        /**
         * Converts a value into a pixel offset for use in positioning
         * the thumb according to the reverse of the
         * <code>_offsetToValue( xy )</code> operation.
         *
         * @method _valueToOffset
         * @param val { Number } The value to map to pixel X or Y position
         * @return { Number } The pixel offset 
         * @protected
         */
        _valueToOffset: function ( value ) {
            var offset = round( ( value - this.get( MIN ) ) / this._factor );

            return offset;
        },

        /**
         * Returns the current value.  Override this if you want to introduce
         * output formatting. Otherwise equivalent to slider.get( "value" );
         *
         * @method getValue
         * @return {Number}
         */
        getValue: function () {
            return this.get( VALUE );
        },

        /**
         * Updates the current value.  Override this if you want to introduce
         * input value parsing or preprocessing.  Otherwise equivalent to
         * slider.set( "value", v );
         *
         * @method setValue
         * @param val {Number} The new value
         * @return {Slider}
         * @chainable
         */
        setValue: function ( val ) {
            return this.set( VALUE, val );
        },

        /**
         * Update position according to new min value.  If the new min results
         * in the current value being out of range, the value is set to the
         * closer of min or max.
         *
         * @method _afterMinChange
         * @param e { EventFacade } The <code>min</code> attribute change event.
         * @protected
         */
        _afterMinChange: function ( e ) {
            this._verifyValue();

            this._syncThumbPosition();
        },

        /**
         * Update position according to new max value.  If the new max results
         * in the current value being out of range, the value is set to the
         * closer of min or max.
         *
         * @method _afterMaxChange
         * @param e { EventFacade } The <code>max</code> attribute change event.
         * @protected
         */
        _afterMaxChange: function ( e ) {
            this._verifyValue();

            this._syncThumbPosition();
        },

        /**
         * Verifies that the current value is within the min - max range.  If
         * not, value is set to either min or max, depending on which is
         * closer.
         *
         * @method _verifyValue
         * @protected
         */
        _verifyValue: function () {
            var value   = this.get( VALUE ),
                nearest = this._nearestValue( value );

            if ( value !== nearest ) {
                // @TODO Can/should valueChange, minChange, etc be queued
                // events? To make dd.set( 'min', n ); execute after minChange
                // subscribers before on/after valueChange subscribers.
                this.set( VALUE, nearest );
            }
        },

        /**
         * Propagate change to the thumb position unless the change originated
         * from the thumbMove event.
         *
         * @method _afterValueChange
         * @param e { EventFacade } The <code>valueChange</code> event.
         * @protected
         */
        _afterValueChange: function ( e ) {
            var val = e.newVal;
            this._setPosition( val, { source: 'set' } );
            this.thumb.set('aria-valuenow', val);
            this.thumb.set('aria-valuetext', val);
        },

        /**
         * Positions the thumb in accordance with the translated value.
         *
         * @method _setPosition
         * @param value {Number} Value to translate to a pixel position
         * @param [options] {Object} Details object to pass to `_uiMoveThumb`
         * @protected
         */
        _setPosition: function ( value, options ) {
            this._uiMoveThumb( this._valueToOffset( value ), options );
        },

        /**
         * Validates new values assigned to <code>min</code> attribute.  Numbers
         * are acceptable.  Override this to enforce different rules.
         *
         * @method _validateNewMin
         * @param value {Any} Value assigned to <code>min</code> attribute.
         * @return {Boolean} True for numbers.  False otherwise.
         * @protected
         */
        _validateNewMin: function ( value ) {
            return Y.Lang.isNumber( value );
        },

        /**
         * Validates new values assigned to <code>max</code> attribute.  Numbers
         * are acceptable.  Override this to enforce different rules.
         *
         * @method _validateNewMax
         * @param value { mixed } Value assigned to <code>max</code> attribute.
         * @return { Boolean } True for numbers.  False otherwise.
         * @protected
         */
        _validateNewMax: function ( value ) {
            return Y.Lang.isNumber( value );
        },

        /**
         * Restricts new values assigned to <code>value</code> attribute to be
         * between the configured <code>min</code> and <code>max</code>.
         * Rounds to nearest integer value.
         *
         * @method _setNewValue
         * @param value { Number } Value assigned to <code>value</code> attribute
         * @return { Number } Normalized and constrained value
         * @protected
         */
        _setNewValue: function ( value ) {
            return round( this._nearestValue( value ) );
        },

        /**
         * Returns the nearest valid value to the value input.  If the provided
         * value is outside the min - max range, accounting for min > max
         * scenarios, the nearest of either min or max is returned.  Otherwise,
         * the provided value is returned.
         *
         * @method _nearestValue
         * @param value { mixed } Value to test against current min - max range
         * @return { Number } Current min, max, or value if within range
         * @protected
         */
        _nearestValue: function ( value ) {
            var min = this.get( MIN ),
                max = this.get( MAX ),
                tmp;

            // Account for reverse value range (min > max)
            tmp = ( max > min ) ? max : min;
            min = ( max > min ) ? min : max;
            max = tmp;

            return ( value < min ) ?
                    min :
                    ( value > max ) ?
                        max :
                        value;
        }

    },

    /**
     * Attributes that will be added onto host class.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     * @protected
     */
    ATTRS: {
        /**
         * The value associated with the farthest top, left position of the
         * rail.  Can be greater than the configured <code>max</code> if you
         * want values to increase from right-to-left or bottom-to-top.
         *
         * @attribute min
         * @type { Number }
         * @default 0
         */
        min: {
            value    : 0,
            validator: '_validateNewMin'
        },

        /**
         * The value associated with the farthest bottom, right position of
         * the rail.  Can be less than the configured <code>min</code> if
         * you want values to increase from right-to-left or bottom-to-top.
         *
         * @attribute max
         * @type { Number }
         * @default 100
         */
        max: {
            value    : 100,
            validator: '_validateNewMax'
        },
        
        /**
         * amount to increment/decrement the Slider value
         * when the arrow up/down/left/right keys are pressed
         *
         * @attribute minorStep
         * @type {Number}
         * @default 1
         */
        minorStep : {
            value: 1
        },

        /**
         * amount to increment/decrement the Slider value
         * when the page up/down keys are pressed
         *
         * @attribute majorStep
         * @type {Number}
         * @default 10
         */
        majorStep : {
            value: 10
        },

        /**
         * The value associated with the thumb's current position on the
         * rail. Defaults to the value inferred from the thumb's current
         * position. Specifying value in the constructor will move the
         * thumb to the position that corresponds to the supplied value.
         *
         * @attribute value
         * @type { Number }
         * @default (inferred from current thumb position)
         */
        value: {
            value : 0,
            setter: '_setNewValue'
        }
    }
}, true );


}, '3.7.3', {"requires": ["slider-base"]});
