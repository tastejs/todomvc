maria.ElementView.subclass(checkit, 'TodosInputView', {
    uiActions: {
        'focus    .new-todo': 'onFocusInput'   ,
        'blur     .new-todo': 'onBlurInput'    ,
        'keyup    .new-todo': 'onKeyupInput'   ,
        'keypress .new-todo': 'onKeypressInput'
    },
    properties: {
        getInputValue: function() {
            return this.find('.new-todo').value;
        },
        clearInput: function() {
            this.find('.new-todo').value = '';
        },
        showToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'block';
        },
        hideToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'none';
        }
    }
});
