define(['./system', './viewEngine', './composition', './widget', './modalDialog', './events'],
    function(system, viewEngine, composition, widget, modalDialog, Events) {

    var app = {
        title: 'Application',
        showModal: function(obj, activationData, context) {
            return modalDialog.show(obj, activationData, context);
        },
        showMessage: function(message, title, options) {
            return modalDialog.show('./messageBox', {
                message: message,
                title: title || this.title,
                options: options
            });
        },
        start: function() {
            var that = this;
            if (that.title) {
                document.title = that.title;
            }

            return system.defer(function (dfd) {
                $(function() {
                    system.log('Starting Application');
                    dfd.resolve();
                    system.log('Started Application');
                });
            }).promise();
        },
        setRoot: function(root, transition, applicationHost) {
            var hostElement, settings = { activate: true, transition: transition };

            if (!applicationHost || typeof applicationHost == "string") {
                hostElement = document.getElementById(applicationHost || 'applicationHost');
            } else {
                hostElement = applicationHost;
            }

            if (typeof root === 'string') {
                if (viewEngine.isViewUrl(root)) {
                    settings.view = root;
                } else {
                    settings.model = root;
                }
            } else {
                settings.model = root;
            }

            composition.compose(hostElement, settings);
        },
        adaptToDevice: function() {
            document.ontouchmove = function (event) {
                event.preventDefault();
            };
        }
    };

    Events.includeIn(app);

    return app;
});