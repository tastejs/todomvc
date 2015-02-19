(function (rivets) {
    'use strict';

    var ESCAPE_KEY = 27;

    rivets.binders['todo-escape'] = {
        'function': true,
        'unbind': function (el) {
            if (this.handler) {
                return rivets._.Util.unbindEvent(el, 'keydown', this.handler);
            }
        },
        'routine': function (el, value) {
            if (this.handler) {
                rivets._.Util.unbindEvent(el, 'keydown', this.handler);
            }
            return rivets._.Util.bindEvent(el, 'keydown', this.handler = this.eventHandler(function (event) {
                if (event.keyCode === ESCAPE_KEY) {
                    return value.apply(this, arguments);
                }
            }));
        }
    };

    // one-way binder: when todo-focus == true change, focus on element.
    rivets.binders['todo-focus'] = {
        routine: function (el, value) {
            if (value) {
                el.focus();
            }
        }
    };

    // one-way binder: set if all todos are checked
    rivets.binders['todos-all-checked'] = {
        routine: function(el, value){
            var allChecked = value.length > 0; // if we have no todos, consider unchecked
            value.forEach(function(item){
                if (!item.completed){
                    allChecked=false;
                }
            });
            $(el).prop('checked', allChecked);
        }
    };

})(rivets);
