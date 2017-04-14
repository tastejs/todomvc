/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('clickable-rail', function (Y, NAME) {

/**
 * Adds support for mouse interaction with the Slider rail triggering thumb
 * movement.
 *
 * @module slider
 * @submodule clickable-rail
 */

/**
 * Slider extension that allows clicking on the Slider's rail element,
 * triggering the thumb to align with the location of the click.
 *
 * @class ClickableRail
 */
function ClickableRail() {
    this._initClickableRail();
}

Y.ClickableRail = Y.mix(ClickableRail, {

    // Prototype methods added to host class
    prototype: {

        /**
         * Initializes the internal state and sets up events.
         *
         * @method _initClickableRail
         * @protected
         */
        _initClickableRail: function () {
            this._evtGuid = this._evtGuid || (Y.guid() + '|');

            /**
             * Broadcasts when the rail has received a mousedown event and
             * triggers the thumb positioning.  Use
             * <code>e.preventDefault()</code> or
             * <code>set(&quot;clickableRail&quot;, false)</code> to prevent
             * the thumb positioning.
             *
             * @event railMouseDown
             * @preventable _defRailMouseDownFn
             */
            this.publish('railMouseDown', {
                defaultFn: this._defRailMouseDownFn
            });

            this.after('render', this._bindClickableRail);
            this.on('destroy', this._unbindClickableRail);
        },

        /** 
         * Attaches DOM event subscribers to support rail interaction.
         *
         * @method _bindClickableRail
         * @protected
         */
        _bindClickableRail: function () {
            this._dd.addHandle(this.rail);

            this.rail.on(this._evtGuid + Y.DD.Drag.START_EVENT,
                Y.bind(this._onRailMouseDown, this));
        },

        /**
         * Detaches DOM event subscribers for cleanup/destruction cycle.
         *
         * @method _unbindClickableRail
         * @protected
         */
        _unbindClickableRail: function () {
            if (this.get('rendered')) {
                var contentBox = this.get('contentBox'),
                    rail = contentBox.one('.' + this.getClassName('rail'));

                rail.detach(this.evtGuid + '*');
            }
        },

        /**
         * Dispatches the railMouseDown event.
         *
         * @method _onRailMouseDown
         * @param e {DOMEvent} the mousedown event object
         * @protected
         */
        _onRailMouseDown: function (e) {
            if (this.get('clickableRail') && !this.get('disabled')) {
                this.fire('railMouseDown', { ev: e });
                this.thumb.focus();
            }
        },

        /**
         * Default behavior for the railMouseDown event.  Centers the thumb at
         * the click location and passes control to the DDM to behave as though
         * the thumb itself were clicked in preparation for a drag operation.
         *
         * @method _defRailMouseDownFn
         * @param e {Event} the EventFacade for the railMouseDown custom event
         * @protected
         */
        _defRailMouseDownFn: function (e) {
            e = e.ev;

            // Logic that determines which thumb should be used is abstracted
            // to someday support multi-thumb sliders
            var dd     = this._resolveThumb(e),
                i      = this._key.xyIndex,
                length = parseFloat(this.get('length'), 10),
                thumb,
                thumbSize,
                xy;
                
            if (dd) {
                thumb = dd.get('dragNode');
                thumbSize = parseFloat(thumb.getStyle(this._key.dim), 10);

                // Step 1. Allow for aligning to thumb center or edge, etc
                xy = this._getThumbDestination(e, thumb);

                // Step 2. Remove page offsets to give just top/left style val
                xy = xy[ i ] - this.rail.getXY()[i];

                // Step 3. Constrain within the rail in case of attempt to
                // center the thumb when clicking on the end of the rail
                xy = Math.min(
                        Math.max(xy, 0),
                        (length - thumbSize));

                this._uiMoveThumb(xy, { source: 'rail' });

                // Set e.target for DD's IE9 patch which calls
                // e.target._node.setCapture() to allow imgs to be dragged.
                // Without this, setCapture is called from the rail and rail
                // clicks on other Sliders may have their thumb movements
                // overridden by a different Slider (the thumb on the wrong
                // Slider moves).
                e.target = this.thumb.one('img') || this.thumb;

                // Delegate to DD's natural behavior
                dd._handleMouseDownEvent(e);

                // TODO: this won't trigger a slideEnd if the rail is clicked
                // check if dd._move(e); dd._dragThreshMet = true; dd.start();
                // will do the trick.  Is that even a good idea?
            }
        },

        /**
         * Resolves which thumb to actuate if any.  Override this if you want to
         * support multiple thumbs.  By default, returns the Drag instance for
         * the thumb stored by the Slider.
         *
         * @method _resolveThumb
         * @param e {DOMEvent} the mousedown event object
         * @return {DD.Drag} the Drag instance that should be moved
         * @protected
         */
        _resolveThumb: function (e) {
            /* Temporary workaround
            var primaryOnly = this._dd.get('primaryButtonOnly'),
                validClick  = !primaryOnly || e.button <= 1;

            return (validClick) ? this._dd : null;
             */
            return this._dd;
        },

        /**
         * Calculates the top left position the thumb should be moved to to
         * align the click XY with the center of the specified node.
         *
         * @method _getThumbDestination
         * @param e {DOMEvent} The mousedown event object
         * @param node {Node} The node to position
         * @return {Array} the [top, left] pixel position of the destination
         * @protected
         */
        _getThumbDestination: function (e, node) {
            var offsetWidth  = node.get('offsetWidth'),
                offsetHeight = node.get('offsetHeight');

            // center
            return [
                (e.pageX - Math.round((offsetWidth  / 2))),
                (e.pageY - Math.round((offsetHeight / 2)))
            ];
        }

    },

    // Static properties added onto host class
    ATTRS: {
        /**
         * Enable or disable clickable rail support.
         *
         * @attribute clickableRail
         * @type {Boolean}
         * @default true
         */
        clickableRail: {
            value: true,
            validator: Y.Lang.isBoolean
        }
    }

}, true);


}, '3.7.3', {"requires": ["slider-base"]});
