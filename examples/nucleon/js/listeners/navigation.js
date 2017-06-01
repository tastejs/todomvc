/**
 * This file handles treatments for in app events related to navigation.
 */
(function (app) {

    'use strict';

    /**
     * Wait for navigation to change, and update the appearance of the filter buttons.
     */
    app.channel.subscribe('navigation::change', function () {
        // Get current url
        var url = window.location.href;
        // Compare it to each filter btn href to enable or disable its selection
        var filterBtns = app.find('.filters a');
        for (var i = 0, len = filterBtns.length, btn; i < len; i++) {
            btn = filterBtns[i].up();
            btn.href === url ? btn.addClass('selected') : btn.removeClass('selected');
        }
    });

}(this.app));
