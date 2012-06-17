maria.addEventListener(window, 'load', function() {
    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);

    if ((typeof localStorage === 'object') && (typeof JSON === 'object')) {
        var store = localStorage.getItem('todos-maria');
        var model = store ? checkit.TodosModel.fromJSON(JSON.parse(store)) :
                            new checkit.TodosModel();
        evento.addEventListener(model, 'change', function() {
            localStorage.setItem('todos-maria', JSON.stringify(model.toJSON()));
        });
    }

    var app = new checkit.TodosAppView(model);
    document.body.appendChild(app.getRootEl());
});
