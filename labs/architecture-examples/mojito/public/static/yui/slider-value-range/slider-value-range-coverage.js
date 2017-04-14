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
_yuitest_coverage["build/slider-value-range/slider-value-range.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/slider-value-range/slider-value-range.js",
    code: []
};
_yuitest_coverage["build/slider-value-range/slider-value-range.js"].code=["YUI.add('slider-value-range', function (Y, NAME) {","","/**"," * Adds value support for Slider as a range of integers between a configured"," * minimum and maximum value.  For use with <code>Y.Base.build(..)</code> to"," * add the plumbing to <code>Y.SliderBase</code>."," *"," * @module slider"," * @submodule slider-value-range"," */","","// Constants for compression or performance","var MIN       = 'min',","    MAX       = 'max',","    VALUE     = 'value',","//     MINORSTEP = 'minorStep',","//     MAJORSTEP = 'majorStep',","","    round = Math.round;","","/**"," * One class of value algorithm that can be built onto SliderBase.  By default,"," * values range between 0 and 100, but you can configure these on the"," * built Slider class by setting the <code>min</code> and <code>max</code>"," * configurations.  Set the initial value (will cause the thumb to move to the"," * appropriate location on the rail) in configuration as well if appropriate."," *"," * @class SliderValueRange"," */","function SliderValueRange() {","    this._initSliderValueRange();","}","","Y.SliderValueRange = Y.mix( SliderValueRange, {","","    // Prototype properties and methods that will be added onto host class","    prototype: {","","        /**","         * Factor used to translate value -&gt; position -&gt; value.","         *","         * @property _factor","         * @type {Number}","         * @protected","         */","        _factor: 1,","","        /**","         * Stub for construction logic.  Override if extending this class and","         * you need to set something up during the initializer phase.","         *","         * @method _initSliderValueRange","         * @protected","         */","        _initSliderValueRange: function () {},","","        /**","         * Override of stub method in SliderBase that is called at the end of","         * its bindUI stage of render().  Subscribes to internal events to","         * trigger UI and related state updates.","         *","         * @method _bindValueLogic","         * @protected","         */","        _bindValueLogic: function () {","            this.after( {","                minChange  : this._afterMinChange,","                maxChange  : this._afterMaxChange,","                valueChange: this._afterValueChange","            } );","        },","","        /**","         * Move the thumb to appropriate position if necessary.  Also resets","         * the cached offsets and recalculates the conversion factor to","         * translate position to value.","         *","         * @method _syncThumbPosition","         * @protected","         */","        _syncThumbPosition: function () {","            this._calculateFactor();","","            this._setPosition( this.get( VALUE ) );","        },","","        /**","         * Calculates and caches","         * (range between max and min) / (rail length)","         * for fast runtime calculation of position -&gt; value.","         *","         * @method _calculateFactor","         * @protected","         */","        _calculateFactor: function () {","            var length    = this.get( 'length' ),","                thumbSize = this.thumb.getStyle( this._key.dim ),","                min       = this.get( MIN ),","                max       = this.get( MAX );","","            // The default thumb width is based on Sam skin's thumb dimension.","            // This attempts to allow for rendering off-DOM, then attaching","            // without the need to call syncUI().  It is still recommended","            // to call syncUI() in these cases though, just to be sure.","            length = parseFloat( length ) || 150;","            thumbSize = parseFloat( thumbSize ) || 15;","","            this._factor = ( max - min ) / ( length - thumbSize );","","        },","","        /**","         * Dispatch the new position of the thumb into the value setting","         * operations.","         *","         * @method _defThumbMoveFn","         * @param e { EventFacade } The host's thumbMove event","         * @protected","         */","        _defThumbMoveFn: function ( e ) {","            // To prevent set('value', x) from looping back around","            if (e.source !== 'set') {","                this.set(VALUE, this._offsetToValue(e.offset));","            }","        },","","        /**","         * <p>Converts a pixel position into a value.  Calculates current","         * thumb offset from the leading edge of the rail multiplied by the","         * ratio of <code>(max - min) / (constraining dim)</code>.</p>","         *","         * <p>Override this if you want to use a different value mapping","         * algorithm.</p>","         *","         * @method _offsetToValue","         * @param offset { Number } X or Y pixel offset","         * @return { mixed } Value corresponding to the provided pixel offset","         * @protected","         */","        _offsetToValue: function ( offset ) {","","            var value = round( offset * this._factor ) + this.get( MIN );","","            return round( this._nearestValue( value ) );","        },","","        /**","         * Converts a value into a pixel offset for use in positioning","         * the thumb according to the reverse of the","         * <code>_offsetToValue( xy )</code> operation.","         *","         * @method _valueToOffset","         * @param val { Number } The value to map to pixel X or Y position","         * @return { Number } The pixel offset ","         * @protected","         */","        _valueToOffset: function ( value ) {","            var offset = round( ( value - this.get( MIN ) ) / this._factor );","","            return offset;","        },","","        /**","         * Returns the current value.  Override this if you want to introduce","         * output formatting. Otherwise equivalent to slider.get( \"value\" );","         *","         * @method getValue","         * @return {Number}","         */","        getValue: function () {","            return this.get( VALUE );","        },","","        /**","         * Updates the current value.  Override this if you want to introduce","         * input value parsing or preprocessing.  Otherwise equivalent to","         * slider.set( \"value\", v );","         *","         * @method setValue","         * @param val {Number} The new value","         * @return {Slider}","         * @chainable","         */","        setValue: function ( val ) {","            return this.set( VALUE, val );","        },","","        /**","         * Update position according to new min value.  If the new min results","         * in the current value being out of range, the value is set to the","         * closer of min or max.","         *","         * @method _afterMinChange","         * @param e { EventFacade } The <code>min</code> attribute change event.","         * @protected","         */","        _afterMinChange: function ( e ) {","            this._verifyValue();","","            this._syncThumbPosition();","        },","","        /**","         * Update position according to new max value.  If the new max results","         * in the current value being out of range, the value is set to the","         * closer of min or max.","         *","         * @method _afterMaxChange","         * @param e { EventFacade } The <code>max</code> attribute change event.","         * @protected","         */","        _afterMaxChange: function ( e ) {","            this._verifyValue();","","            this._syncThumbPosition();","        },","","        /**","         * Verifies that the current value is within the min - max range.  If","         * not, value is set to either min or max, depending on which is","         * closer.","         *","         * @method _verifyValue","         * @protected","         */","        _verifyValue: function () {","            var value   = this.get( VALUE ),","                nearest = this._nearestValue( value );","","            if ( value !== nearest ) {","                // @TODO Can/should valueChange, minChange, etc be queued","                // events? To make dd.set( 'min', n ); execute after minChange","                // subscribers before on/after valueChange subscribers.","                this.set( VALUE, nearest );","            }","        },","","        /**","         * Propagate change to the thumb position unless the change originated","         * from the thumbMove event.","         *","         * @method _afterValueChange","         * @param e { EventFacade } The <code>valueChange</code> event.","         * @protected","         */","        _afterValueChange: function ( e ) {","            var val = e.newVal;","            this._setPosition( val, { source: 'set' } );","            this.thumb.set('aria-valuenow', val);","            this.thumb.set('aria-valuetext', val);","        },","","        /**","         * Positions the thumb in accordance with the translated value.","         *","         * @method _setPosition","         * @param value {Number} Value to translate to a pixel position","         * @param [options] {Object} Details object to pass to `_uiMoveThumb`","         * @protected","         */","        _setPosition: function ( value, options ) {","            this._uiMoveThumb( this._valueToOffset( value ), options );","        },","","        /**","         * Validates new values assigned to <code>min</code> attribute.  Numbers","         * are acceptable.  Override this to enforce different rules.","         *","         * @method _validateNewMin","         * @param value {Any} Value assigned to <code>min</code> attribute.","         * @return {Boolean} True for numbers.  False otherwise.","         * @protected","         */","        _validateNewMin: function ( value ) {","            return Y.Lang.isNumber( value );","        },","","        /**","         * Validates new values assigned to <code>max</code> attribute.  Numbers","         * are acceptable.  Override this to enforce different rules.","         *","         * @method _validateNewMax","         * @param value { mixed } Value assigned to <code>max</code> attribute.","         * @return { Boolean } True for numbers.  False otherwise.","         * @protected","         */","        _validateNewMax: function ( value ) {","            return Y.Lang.isNumber( value );","        },","","        /**","         * Restricts new values assigned to <code>value</code> attribute to be","         * between the configured <code>min</code> and <code>max</code>.","         * Rounds to nearest integer value.","         *","         * @method _setNewValue","         * @param value { Number } Value assigned to <code>value</code> attribute","         * @return { Number } Normalized and constrained value","         * @protected","         */","        _setNewValue: function ( value ) {","            return round( this._nearestValue( value ) );","        },","","        /**","         * Returns the nearest valid value to the value input.  If the provided","         * value is outside the min - max range, accounting for min > max","         * scenarios, the nearest of either min or max is returned.  Otherwise,","         * the provided value is returned.","         *","         * @method _nearestValue","         * @param value { mixed } Value to test against current min - max range","         * @return { Number } Current min, max, or value if within range","         * @protected","         */","        _nearestValue: function ( value ) {","            var min = this.get( MIN ),","                max = this.get( MAX ),","                tmp;","","            // Account for reverse value range (min > max)","            tmp = ( max > min ) ? max : min;","            min = ( max > min ) ? min : max;","            max = tmp;","","            return ( value < min ) ?","                    min :","                    ( value > max ) ?","                        max :","                        value;","        }","","    },","","    /**","     * Attributes that will be added onto host class.","     *","     * @property ATTRS","     * @type {Object}","     * @static","     * @protected","     */","    ATTRS: {","        /**","         * The value associated with the farthest top, left position of the","         * rail.  Can be greater than the configured <code>max</code> if you","         * want values to increase from right-to-left or bottom-to-top.","         *","         * @attribute min","         * @type { Number }","         * @default 0","         */","        min: {","            value    : 0,","            validator: '_validateNewMin'","        },","","        /**","         * The value associated with the farthest bottom, right position of","         * the rail.  Can be less than the configured <code>min</code> if","         * you want values to increase from right-to-left or bottom-to-top.","         *","         * @attribute max","         * @type { Number }","         * @default 100","         */","        max: {","            value    : 100,","            validator: '_validateNewMax'","        },","        ","        /**","         * amount to increment/decrement the Slider value","         * when the arrow up/down/left/right keys are pressed","         *","         * @attribute minorStep","         * @type {Number}","         * @default 1","         */","        minorStep : {","            value: 1","        },","","        /**","         * amount to increment/decrement the Slider value","         * when the page up/down keys are pressed","         *","         * @attribute majorStep","         * @type {Number}","         * @default 10","         */","        majorStep : {","            value: 10","        },","","        /**","         * The value associated with the thumb's current position on the","         * rail. Defaults to the value inferred from the thumb's current","         * position. Specifying value in the constructor will move the","         * thumb to the position that corresponds to the supplied value.","         *","         * @attribute value","         * @type { Number }","         * @default (inferred from current thumb position)","         */","        value: {","            value : 0,","            setter: '_setNewValue'","        }","    }","}, true );","","","}, '3.7.3', {\"requires\": [\"slider-base\"]});"];
_yuitest_coverage["build/slider-value-range/slider-value-range.js"].lines = {"1":0,"13":0,"30":0,"31":0,"34":0,"66":0,"82":0,"84":0,"96":0,"105":0,"106":0,"108":0,"122":0,"123":0,"142":0,"144":0,"158":0,"160":0,"171":0,"185":0,"198":0,"200":0,"213":0,"215":0,"227":0,"230":0,"234":0,"247":0,"248":0,"249":0,"250":0,"262":0,"275":0,"288":0,"302":0,"317":0,"322":0,"323":0,"324":0,"326":0};
_yuitest_coverage["build/slider-value-range/slider-value-range.js"].functions = {"SliderValueRange:30":0,"_bindValueLogic:65":0,"_syncThumbPosition:81":0,"_calculateFactor:95":0,"_defThumbMoveFn:120":0,"_offsetToValue:140":0,"_valueToOffset:157":0,"getValue:170":0,"setValue:184":0,"_afterMinChange:197":0,"_afterMaxChange:212":0,"_verifyValue:226":0,"_afterValueChange:246":0,"_setPosition:261":0,"_validateNewMin:274":0,"_validateNewMax:287":0,"_setNewValue:301":0,"_nearestValue:316":0,"(anonymous 1):1":0};
_yuitest_coverage["build/slider-value-range/slider-value-range.js"].coveredLines = 40;
_yuitest_coverage["build/slider-value-range/slider-value-range.js"].coveredFunctions = 19;
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 1);
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
_yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "(anonymous 1)", 1);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 13);
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
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 30);
function SliderValueRange() {
    _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "SliderValueRange", 30);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 31);
this._initSliderValueRange();
}

_yuitest_coverline("build/slider-value-range/slider-value-range.js", 34);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_bindValueLogic", 65);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 66);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_syncThumbPosition", 81);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 82);
this._calculateFactor();

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 84);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_calculateFactor", 95);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 96);
var length    = this.get( 'length' ),
                thumbSize = this.thumb.getStyle( this._key.dim ),
                min       = this.get( MIN ),
                max       = this.get( MAX );

            // The default thumb width is based on Sam skin's thumb dimension.
            // This attempts to allow for rendering off-DOM, then attaching
            // without the need to call syncUI().  It is still recommended
            // to call syncUI() in these cases though, just to be sure.
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 105);
length = parseFloat( length ) || 150;
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 106);
thumbSize = parseFloat( thumbSize ) || 15;

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 108);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_defThumbMoveFn", 120);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 122);
if (e.source !== 'set') {
                _yuitest_coverline("build/slider-value-range/slider-value-range.js", 123);
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

            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_offsetToValue", 140);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 142);
var value = round( offset * this._factor ) + this.get( MIN );

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 144);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_valueToOffset", 157);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 158);
var offset = round( ( value - this.get( MIN ) ) / this._factor );

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 160);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "getValue", 170);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 171);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "setValue", 184);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 185);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_afterMinChange", 197);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 198);
this._verifyValue();

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 200);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_afterMaxChange", 212);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 213);
this._verifyValue();

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 215);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_verifyValue", 226);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 227);
var value   = this.get( VALUE ),
                nearest = this._nearestValue( value );

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 230);
if ( value !== nearest ) {
                // @TODO Can/should valueChange, minChange, etc be queued
                // events? To make dd.set( 'min', n ); execute after minChange
                // subscribers before on/after valueChange subscribers.
                _yuitest_coverline("build/slider-value-range/slider-value-range.js", 234);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_afterValueChange", 246);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 247);
var val = e.newVal;
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 248);
this._setPosition( val, { source: 'set' } );
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 249);
this.thumb.set('aria-valuenow', val);
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 250);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_setPosition", 261);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 262);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_validateNewMin", 274);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 275);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_validateNewMax", 287);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 288);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_setNewValue", 301);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 302);
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
            _yuitest_coverfunc("build/slider-value-range/slider-value-range.js", "_nearestValue", 316);
_yuitest_coverline("build/slider-value-range/slider-value-range.js", 317);
var min = this.get( MIN ),
                max = this.get( MAX ),
                tmp;

            // Account for reverse value range (min > max)
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 322);
tmp = ( max > min ) ? max : min;
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 323);
min = ( max > min ) ? min : max;
            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 324);
max = tmp;

            _yuitest_coverline("build/slider-value-range/slider-value-range.js", 326);
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
