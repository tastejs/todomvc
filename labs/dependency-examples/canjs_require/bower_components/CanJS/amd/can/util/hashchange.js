/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(function () {
    // This is a workaround for libraries that don't natively listen to the window hashchange event
    !
    function () {
        var routeReadyCalled = false,
            addEvent = function (el, ev, fn) {
                if (el.addEventListener) {
                    el.addEventListener(ev, fn, false);
                } else if (el.attachEvent) {
                    el.attachEvent('on' + ev, fn);
                } else {
                    el['on' + ev] = fn;
                }
            },
            onHashchange = function () {
                can.trigger(window, 'hashchange');
            };

        addEvent(window, 'hashchange', onHashchange);
    }();
});