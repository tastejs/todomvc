maria.ElementView.subclass = function(namespace, name, options) {
    options = options || {};
    var template = options.template;
    var templateName = options.templateName || name.replace(/(View|)$/, 'Template');
    var uiActions = options.uiActions;
    var properties = options.properties || (options.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getTemplate')) {
        if (template) {
            properties.getTemplate = function() {
                return template;
            };
        }
        else if (templateName) {
            properties.getTemplate = function() {
                return namespace[templateName];
            };
        }
    }
    if (uiActions) {
        if (!Object.prototype.hasOwnProperty.call(properties, 'getUIActions')) {
            properties.getUIActions = function() {
                return uiActions;
            };
        }
        for (var key in uiActions) {
            if (Object.prototype.hasOwnProperty.call(uiActions, key)) {
                var methodName = uiActions[key];
                if (!Object.prototype.hasOwnProperty.call(properties, methodName)) {
                    (function(methodName) {
                        properties[methodName] = function(evt) {
                            this.getController()[methodName](evt);
                        };
                    }(methodName));
                }
            }
        }
    }
    maria.View.subclass.call(this, namespace, name, options);
};
