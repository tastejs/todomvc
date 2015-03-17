(function (html) {
    'use strict';
    /* CUSTOM EVENT */
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;
    
    // press enter event, derived from key press event
    html.pressEnter = function (callback, model) {
        html.keypress(function (e) {
            if (e.keyCode === ENTER_KEY) {
                callback.call(e.srcElement || e.target, e, model);
            }
        });
        // return html for fluent API
        return html;
    };
    
    // press escape event, derived from key down event
    html.pressEscape = function (callback, model) {
        html.keydown(function (e) {
            if (e.keyCode === ESCAPE_KEY) {
                callback.call(e.srcElement || e.target, e, model);
            }
        });
        // return html for fluent API
        return html;
    };
    /* END OF CUSTOM EVENT */
})(window.html);