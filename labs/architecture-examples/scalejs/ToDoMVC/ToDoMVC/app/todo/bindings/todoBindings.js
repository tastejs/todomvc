/*global define */
/*jslint sloppy: true*/
define({
    'todo-visible': function () {
        return {
            visible: this.items().length > 0
        };
    }
});
