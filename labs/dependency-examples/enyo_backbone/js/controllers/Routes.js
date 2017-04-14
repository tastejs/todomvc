enyo.kind({
    kind: 'enyo.Router',
    name: 'ToDo.Routes',
    // These are the routes to listen for, and the function to call when they occur.  A seperate context can be provided but is unnecessary here.
    routes: [{
            path: '/active',
            handler: 'changeCollection'
        }, {
            path: '/completed',
            handler: 'changeCollection'
        }, {
            path: '/',
            default: true,
            handler: 'changeCollection'
        },
    ],
    // Set a property on our global controller
    changeCollection: function () {
        ToDo.notepadcontroller.setRoute(this.current);
    }
})