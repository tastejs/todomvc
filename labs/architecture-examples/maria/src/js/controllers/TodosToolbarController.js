maria.Controller.subclass(checkit, 'TodosToolbarController', {
    properties: {
        onClickAllCheckbox: function() {
            var model = this.getModel();
            if (model.isAllDone()) {
                model.markAllUndone();
            } else {
                model.markAllDone();
            }
        },
        onClickMarkAllDone: function() {
            this.getModel().markAllDone();
        },
        onClickMarkAllUndone: function() {
            this.getModel().markAllUndone();
        },
        onClickDeleteDone: function() {
            this.getModel().deleteDone();
        }
    }
});
