maria.Model.subclass(checkit, 'TodoModel', {
    properties: {
        _content: '',
        _isDone: false,
        getContent: function() {
            return this._content;
        },
        setContent: function(content) {
            content = ('' + content).replace(/^\s+|\s+$/g, '');
            if (this._content !== content) {
                this._content = content;
                this.dispatchEvent({type: 'change'});
            }
        },
        isDone: function() {
            return this._isDone;
        },
        setDone: function(isDone) {
            isDone = !!isDone;
            if (this._isDone !== isDone) {
                this._isDone = isDone;
                this.dispatchEvent({type: 'change'});
            }
        },
        toggleDone: function() {
            this.setDone(!this.isDone());
        },
        toJSON: function() {
            return {
                content: this._content,
                is_done: this._isDone
            };
        }
    }
});

checkit.TodoModel.fromJSON = function(todoJSON) {
    var model = new checkit.TodoModel();
    model._content = todoJSON.content;
    model._isDone = todoJSON.is_done;
    return model;
};
