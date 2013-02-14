/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-contextmenu', function (Y, NAME) {

/**
 * Provides extended keyboard support for the "contextmenu" event such that:
 * <ul>
 * <li>The browser's default context menu is suppressed regardless of how the event is triggered.</li>
 * <li>On Windows the "contextmenu" event is fired consistently regardless of whether the user pressed the Menu key or Shift + F10.</li>
 * <li>When the "contextmenu" event is fired via the keyboard, the pageX, pageY, clientX and clientY properties reference the center of the event target. This makes it easy for "contextmenu" event listeners to position an overlay in response to the event by not having to worry about special handling of the x and y coordinates based on the device that fired the event.</li>
 * <li>For Webkit and Gecko on the Mac it enables the use of the Shift + Control + Option + M keyboard shortcut to fire the "contextmenu" event, which (by default) is only available when VoiceOver (the screen reader on the Mac) is enabled.</li>
 * <li>For Opera on the Mac it ensures the "contextmenu" event is fired when the user presses Shift + Command + M (Opera's context menu keyboard shortcut).</li>
 * </ul>
 * @module event-contextmenu
 * @requires event
 */

var Event = Y.Event,
    DOM = Y.DOM,
    UA = Y.UA,
    OS = Y.UA.os,

    ie = UA.ie,
    gecko = UA.gecko,
    webkit = UA.webkit,
    opera = UA.opera,

    isWin = (OS === "windows"),
    isMac = (OS === "macintosh"),

    eventData = {},

    conf = {

        on: function (node, subscription, notifier, filter) {

            var handles = [];

            handles.push(Event._attach(["contextmenu", function (e) {

                // Any developer listening for the "contextmenu" event is likely
                // going to call preventDefault() to prevent the display of 
                // the browser's context menu. So, you know, save them a step.
                e.preventDefault();

                var id = Y.stamp(node),
                    data = eventData[id];

                if (data) {
                    e.clientX = data.clientX;
                    e.clientY = data.clientY;
                    e.pageX = data.pageX;
                    e.pageY = data.pageY;
                    delete eventData[id];
                }

                notifier.fire(e);

            }, node]));


            handles.push(node[filter ? "delegate" : "on"]("keydown", function (e) {

                var target = this.getDOMNode(),
                    shiftKey = e.shiftKey,
                    keyCode = e.keyCode,
                    shiftF10 = (shiftKey && keyCode == 121),
                    menuKey = (isWin && keyCode == 93),
                    ctrlKey = e.ctrlKey,
                    mKey = (keyCode === 77),
                    macWebkitAndGeckoShortcut = (isMac && (webkit || gecko) && ctrlKey && shiftKey && e.altKey && mKey),

                    // Note: The context menu keyboard shortcut for Opera on the Mac is Shift + Cmd (metaKey) + M,
                    // but e.metaKey is false for Opera, and Opera sets e.ctrlKey to true instead.
                    macOperaShortcut = (isMac && opera && ctrlKey && shiftKey && mKey),

                    clientX = 0,
                    clientY = 0,
                    scrollX,
                    scrollY,
                    pageX,
                    pageY,
                    xy,
                    x,
                    y;


                if ((isWin && (shiftF10 || menuKey)) ||
                        (macWebkitAndGeckoShortcut || macOperaShortcut)) {

                    // Need to call preventDefault() here b/c:
                    // 1) To prevent IE's menubar from gaining focus when the
                    // user presses Shift + F10
                    // 2) In Firefox and Opera for Win, Shift + F10 will display a
                    // context menu, but won't fire the "contextmenu" event. So, need
                    // to call preventDefault() to prevent the display of the
                    // browser's context menu
                    // 3) For Opera on the Mac the context menu keyboard shortcut
                    // (Shift + Cmd + M) will display a context menu, but like Firefox
                    // and Opera on windows, Opera doesn't fire a "contextmenu" event,
                    // so preventDefault() is just used to supress Opera's
                    // default context menu.
                    if (((ie || (isWin && (gecko || opera))) && shiftF10) || macOperaShortcut) {
                        e.preventDefault();
                    }

                    xy = DOM.getXY(target);
                    x = xy[0];
                    y = xy[1];
                    scrollX = DOM.docScrollX();
                    scrollY = DOM.docScrollY();

                    // Protect against instances where xy and might not be returned,
                    // for example if the target is the document.
                    if (!Y.Lang.isUndefined(x)) {
                        clientX = (x + (target.offsetWidth/2)) - scrollX;
                        clientY = (y + (target.offsetHeight/2)) - scrollY;
                    }

                    pageX = clientX + scrollX;
                    pageY = clientY + scrollY;

                    // When the "contextmenu" event is fired from the keyboard
                    // clientX, clientY, pageX or pageY aren't set to useful
                    // values. So, we follow Safari's model here of setting
                    // the x & x coords to the center of the event target.

                    if (menuKey || (isWin && webkit && shiftF10)) {
                        eventData[Y.stamp(node)] = { 
                            clientX: clientX,
                            clientY: clientY,
                            pageX: pageX,
                            pageY: pageY
                        };
                    }

                    // Don't need to call notifier.fire(e) when the Menu key
                    // is pressed as it fires the "contextmenu" event by default.
                    //
                    // In IE the call to preventDefault() for Shift + F10
                    // prevents the "contextmenu" event from firing, so we need
                    // to call notifier.fire(e)
                    //
                    // Need to also call notifier.fire(e) for Gecko and Opera since
                    // neither Shift + F10 or Shift + Cmd + M fire the "contextmenu" event.
                    //
                    // Lastly, also need to call notifier.fire(e) for all Mac browsers
                    // since neither Shift + Ctrl + Option + M (Webkit and Gecko) or
                    // Shift + Command + M (Opera) fire the "contextmenu" event.

                    if (((ie || (isWin && (gecko || opera))) && shiftF10) || isMac) {

                        e.clientX = clientX;
                        e.clientY = clientY;
                        e.pageX = pageX;
                        e.pageY = pageY;

                        notifier.fire(e);
                    }

                }

            }, filter));

            subscription._handles = handles;

        },

        detach: function (node, subscription, notifier) {

            Y.each(subscription._handles, function (handle) {
                handle.detach();
            });

        }

    };


conf.delegate = conf.on;
conf.detachDelegate = conf.detach;


Event.define("contextmenu", conf, true);


}, '3.7.3', {"requires": ["event-synthetic", "dom-screen"]});
