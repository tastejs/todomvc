(function () {
    function View(template) {
        this.template = template;

        this.$todoList = $$('#todo-list');
    }

    View.prototype.render = function (viewCmd, parameter) {
        if (viewCmd === 'showEntries') {
            this.$todoList.innerHTML = this.template.show(parameter);
        }
    };

    window.app.View = View;
}())
