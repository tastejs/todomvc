/*global define, LAZO */
/*jshint unused:false */
define(['l!lazoView', 'underscore'], function (View, _) {

    'use strict';

    return View.extend({

        afterRender: function () {
            var self = this;
            // get a reference to the footer controller
            var footer = this.ctl.children['f-cmp'][0];

            // in the case of /layout footer is not re-rendered when the query params change,
            // because the component is part of the route's layout, which does not re-render
            // when navigating between routes that share the same layout, so we need to
            // re-render to ensure that the active filter gets selected; in other cases it might
            // be a better idea to only update the affected part of the DOM, but in this case
            // the view is small and the majority of it will need to be redrawn anyway we might
            // as well do it with only taking a single hit to the DOM
            this.onNavListener = LAZO.app.on('navigate:application:complete', function (msg) {
                if (self.ctl.ctx.location.pathname.indexOf('/layout') !== -1) {
                    // parameters are only set on the layout and the layout body upon navigation
                    // reset footer parameters
                    footer.ctx.params = msg.parameters;
                    // update view properties
                    footer.currentView.setViewProps();
                    // re-render footer view
                    footer.currentView.render();
                }
            });
        },

        onRemove: function () {
            // clean up listener
            LAZO.app.off('navigate:application:complete', this.onNavListener);
        }

    });

});