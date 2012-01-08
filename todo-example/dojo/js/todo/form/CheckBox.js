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
