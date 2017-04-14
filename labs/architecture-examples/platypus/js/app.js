/* global plat, __extends */
/* jshint unused:false */
/* jshint ignore:start */
/* jshint -W004 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* jshint ignore:end */
var todoapp;
(function (todoapp) {
    'use strict';

    /**
    * The app is used for Application Lifecycle Management. Since this framework
    * is intended for mobile use, we integrate with the device and provide an easy
    * way of responding to the native ALM events.
    */
    var TodoApp = (function (_super) {
        __extends(TodoApp, _super);
        function TodoApp() {
            _super.apply(this, arguments);
        }
        
        /**
        * Event fired when the app is suspended.
        *
        * @param ev The ILifecycleEvent object.
        */
        TodoApp.prototype.suspend = function (ev) {
        };

        /**
        * Event fired when the app resumes from the suspended state.
        *
        * @param ev The ILifecycleEvent object.
        */
        TodoApp.prototype.resume = function (ev) {
        };

        /**
        * Event fired when an internal error occures.
        *
        * @param ev The IErrorEvent object.
        */
        TodoApp.prototype.error = function (ev) {
        };

        /**
        * Event fired when the app is ready.
        *
        * @param ev The ILifecycleEvent object.
        */
        TodoApp.prototype.ready = function (ev) {
        };

        /**
        * Event fired when the app regains connectivity and is now in an online state.
        *
        * @param ev The ILifecycleEvent object.
        */
        TodoApp.prototype.online = function (ev) {
        };

        /**
        * Event fired when the app loses connectivity and is now in an offline state.
        *
        * @param ev The ILifecycleEvent object.
        */
        TodoApp.prototype.offline = function (ev) {
        };
        return TodoApp;
    })(plat.App);

    /**
    * An app is registered the same as any other component, and can specify injectable
    * dependencies as well.
    */
    plat.register.app('todoapp', TodoApp);
})(todoapp || (todoapp = {}));
//# sourceMappingURL=app.js.map
