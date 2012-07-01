maria.Controller.subclass(checkit, 'TodoController', {
    properties: {
        onMouseoverRoot: function() {
            this.getView().showHoverState();
        },
        onMouseoutRoot: function() {
            this.getView().hideHoverState();
        },
        onClickCheck: function() {
            this.getModel().toggleDone();
        },
        onClickDestroy: function() {
            this.getModel().destroy();
        },
        onDblclickDisplay: function() {
            this.getView().showEdit();
        },
        onKeyupInput: function() {
            var view = this.getView();
            if (/\S/.test(view.getInputValue())) {
                view.showToolTip();
            } else {
                view.hideToolTip();
            }
        },
        onKeypressInput: function(evt) {
            if (evt.keyCode === 13) {
                this.onBlurInput();
            }
        },
        onBlurInput: function() {
            var view = this.getView();
            var value = view.getInputValue();
            view.hideToolTip();
            view.showDisplay();
            if (!/^\s*$/.test(value)) {
                this.getModel().setContent(value);
            }
        }
    }
});
