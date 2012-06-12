maria.SetView = function() {
    maria.ElementView.apply(this, arguments);
};

maria.SetView.prototype = new maria.ElementView();
maria.SetView.prototype.constructor = maria.SetView;

maria.SetView.prototype.setModel = function(model) {
    if (this.getModel() !== model) {
        maria.ElementView.prototype.setModel.call(this, model);

        var childViews = this.childNodes.slice(0);
        for (var i = 0, ilen = childViews.length; i < ilen; i++) {
            this.removeChild(childViews[i]);
        }

        var childModels = this.getModel().toArray();
        for (var i = 0, ilen = childModels.length; i < ilen; i++) {
            this.appendChild(this.createChildView(childModels[i]));
        }
    }
};

maria.SetView.prototype.createChildView = function(model) {
    return new maria.ElementView(model);
};

maria.SetView.prototype.update = function(evt) {
    // Check if there is an event as this method is also called
    // at the end of building the view.
    if (evt) {
        if (evt.addedTargets && evt.addedTargets.length) {
            this.handleAdd(evt);
        }
        if (evt.deletedTargets && evt.deletedTargets.length) {
            this.handleDelete(evt);
        }
    }
};

maria.SetView.prototype.handleAdd = function(evt) {
    var childModels = evt.addedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        this.appendChild(this.createChildView(childModels[i]));
    }
};

maria.SetView.prototype.handleDelete = function(evt) {
    var childModels = evt.deletedTargets;
    for (var i = 0, ilen = childModels.length; i < ilen; i++) {
        var childModel = childModels[i];
        var childViews = this.childNodes;
        for (var j = 0, jlen = childViews.length; j < jlen; j++) {
            var childView = childViews[j];
            if (childView.getModel() === childModel) {
                this.removeChild(childView);
                break;
            }
        }
    }
};
