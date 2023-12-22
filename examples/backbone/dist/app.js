/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
    "use strict";

    // kick things off by creating the `App`
    window.appView = new app.AppView();

    /**
     * Speedometer specific:
     * Adding a dom node after todo app is done initializing.
     * Speedometer waits for this dom note to be present in the dom.
     */
    const dummyNodeToNotifyAppIsReady = document.createElement("div");
    dummyNodeToNotifyAppIsReady.id = "appIsReady";
    document.body.appendChild(dummyNodeToNotifyAppIsReady);
});
