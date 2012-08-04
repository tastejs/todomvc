/**
 * There's an incompatibility between the Dojo CheckBox and the Dojo MVC
 * module. To use them together, I've manually tied the "checked" attribute
 * value to push updates to the "value" attribute, which the Dojo MVC module
 * expects.
 */
define(["dojo/_base/declare", "dijit/form/CheckBox"], function (declare, CheckBox) {
    return declare("todo.form.CheckBox", [CheckBox], {
        _setCheckedAttr: function (checked) {
            this.inherited(arguments);
            this._watchCallbacks("value", !checked, checked);
        },

        _getValueAttr: function () {
            return this.get("checked");
        }
    });
});
