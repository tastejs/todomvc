/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/observe', 'can/util/object'], function (can) {
    var flatProps = function (a) {
        var obj = {};
        for (var prop in a) {
            if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
                obj[prop] = a[prop]
            }
        }
        return obj;
    };

    can.extend(can.Observe.prototype, {


        backup: function () {
            this._backupStore = this._attrs();
            return this;
        },


        isDirty: function (checkAssociations) {
            return this._backupStore && !can.Object.same(this._attrs(), this._backupStore, undefined, undefined, undefined, !! checkAssociations);
        },


        restore: function (restoreAssociations) {
            var props = restoreAssociations ? this._backupStore : flatProps(this._backupStore)

            if (this.isDirty(restoreAssociations)) {
                this._attrs(props);
            }

            return this;
        }

    })

    return can.Observe;
});