maria.ElementView.subclass(checkit, 'TodosToolbarView', {
    modelConstructor: checkit.TodosModel,
    uiActions: {
        'click .allCheckbox'   : 'onClickAllCheckbox'  ,
        'click .markallDone'   : 'onClickMarkAllDone'  ,
        'click .markallUndone' : 'onClickMarkAllUndone',
        'click .deleteComplete': 'onClickDeleteDone'
    },
    properties: {
        update: function() {
            var model = this.getModel();
            var checkbox = this.find('.allCheckbox');
            checkbox.checked = model.isAllDone();
            checkbox.disabled = model.isEmpty();
        }
    }
});
