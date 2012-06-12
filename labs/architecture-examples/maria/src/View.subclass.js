maria.View.subclass = function(namespace, name, options) {
    options = options || {};
    var modelConstructor = options.modelConstructor;
    var modelConstructorName = options.modelConstructorName || name.replace(/(View|)$/, 'Model');
    var controllerConstructor = options.controllerConstructor;
    var controllerConstructorName = options.controllerConstructorName || name.replace(/(View|)$/, 'Controller');
    var modelActions = options.modelActions;
    var properties = options.properties || (option.properties = {});
    if (!Object.prototype.hasOwnProperty.call(properties, 'getDefaultControllerConstructor')) {
        properties.getDefaultControllerConstructor = function() {
            return controllerConstructor || namespace[controllerConstructorName];
        };
    }
    if (modelActions && !Object.prototype.hasOwnProperty.call(properties, 'getModelActions')) {
        properties.getModelActions = function() {
            return modelActions;
        };
    }
    if (!Object.prototype.hasOwnProperty.call(properties, 'initialize')) {
        properties.initialize = function() {
            if (!this.getModel()) {
                var mc = modelConstructor || namespace[modelConstructorName];
                this.setModel(new mc());
            }
        };
    }
    maria.subclass.call(this, namespace, name, options);
};
