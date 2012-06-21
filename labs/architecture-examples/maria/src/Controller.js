maria.Controller = function() {
    this.initialize();
};

maria.Controller.prototype.initialize = function() {};

maria.Controller.prototype.destroy = function() {
    this._model = null;
    if (this._view) {
        this._view.setController(null);
        this._view = null;
    }
};

maria.Controller.prototype.getModel = function() {
    return this._model;
};

maria.Controller.prototype.setModel = function(model) {
    this._model = model;
};

maria.Controller.prototype.getView = function() {
    return this._view;
};

maria.Controller.prototype.setView = function(view) {
    this._view = view;
};
