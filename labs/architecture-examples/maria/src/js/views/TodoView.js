maria.ElementView.subclass(checkit, 'TodoView', {
    uiActions: {
        'mouseover .todo'        : 'onMouseoverRoot'  ,
        'mouseout  .todo'        : 'onMouseoutRoot'   ,
        'click     .check'       : 'onClickCheck'     ,
        'click     .todo-destroy': 'onClickDestroy'   ,
        'dblclick  .todo-content': 'onDblclickDisplay',
        'keyup     .todo-input'  : 'onKeyupInput'     ,
        'keypress  .todo-input'  : 'onKeypressInput'  ,
        'blur      .todo-input'  : 'onBlurInput'
    },
    properties: {
        buildData: function() {
            var model = this.getModel();
            var content = model.getContent();
            this.find('.todo-content').innerHTML =
                content.replace('&', '&amp;').replace('<', '&lt;');
            this.find('.check').checked = model.isDone();
            aristocrat[model.isDone() ? 'addClass' : 'removeClass'](this.find('.todo'), 'done');
        },
        update: function() {
            this.buildData();
        },
        showEdit: function() {
            var input = this.find('.todo-input');
            input.value = this.getModel().getContent();
            aristocrat.addClass(this.find('.todo'), 'editing');
            input.focus();
        },
        showDisplay: function() {
            aristocrat.removeClass(this.find('.todo'), 'editing');
        },
        getInputValue: function() {
            return this.find('.todo-input').value;
        },
        showHoverState: function() {
            aristocrat.addClass(this.find('.todo'), 'todo-hover');
        },
        hideHoverState: function() {
            aristocrat.removeClass(this.find('.todo'), 'todo-hover');
        },
        showToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'block';
        },
        hideToolTip: function() {
            this.find('.ui-tooltip-top').style.display = 'none';
        }
    }
});
