module todoapp {
    'use strict';

    /**
     * The app is used for Application Lifecycle Management. Since this framework 
     * is intended for mobile use, we integrate with the device and provide an easy 
     * way of responding to the native ALM events.
     */
    class TodoApp extends plat.App {
        /**
         * Event fired when the app is suspended.
         * 
         * @param ev The ILifecycleEvent object.
         */
        suspend(ev: plat.events.ILifecycleEvent) { }

        /**
         * Event fired when the app resumes from the suspended state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        resume(ev: plat.events.ILifecycleEvent) { }

        /**
         * Event fired when an internal error occures.
         * 
         * @param ev The IErrorEvent object.
         */
        error(ev: plat.events.IErrorEvent<any>) { }

        /**
         * Event fired when the app is ready.
         * 
         * @param ev The ILifecycleEvent object.
         */
        ready(ev: plat.events.ILifecycleEvent) { }

        /**
         * Event fired when the app regains connectivity and is now in an online state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        online(ev: plat.events.ILifecycleEvent) { }

        /**
         * Event fired when the app loses connectivity and is now in an offline state.
         * 
         * @param ev The ILifecycleEvent object.
         */
        offline(ev: plat.events.ILifecycleEvent) { }
    }

    /**
     * An app is registered the same as any other component, and can specify injectable 
     * dependencies as well.
     */
    plat.register.app('todoapp', TodoApp);
}
