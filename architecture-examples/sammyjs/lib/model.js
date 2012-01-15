Model = {
    name: 'model',
    init: function() {
        this._id = 0;
        this._data = [];
        this._deserialize();
        return this;
    },
    create: function(attributes, save) {
        attributes.id = this._newId();
        var item = this._data[ (this._data.push(attributes)) - 1 ];
        if (save !== false) {
            this.save();
        }
        return this._clone(item);
    },
    first: function() {
        return this._clone(this._data[0]);
    },
    last: function() {
        return this._clone(_data[ this._data.length-1 ]);
    },
    get: function(id) {
        return this._clone(this._get(id));
    },
    getAll: function() {
        return this._clone(this._data);
    },
    filter: function(attribute, value) {
        return this._clone(this._filter(attribute, value));
    },
    multiFilter: function(filters) {
        return this._clone(this._multiFilter(filter));
    },
    update: function(id, attributes, save) {
        var item = this._get(id) || false;
        if (item) {
            this._mixin(item, attributes);
            if (save !== false) {
                this.save();
            }
        }
        return item;
    },
    destroy: function(id, save) {
        this._data.splice(this._indexOf(id), 1);
        if (save !== false) {
            this.save();
        }
        return true;
    },
    destroyAll: function(save) {
        this._data = [];
        if (save !== false) {
            this.save();
        }
        return true;
    },
    save: function() {
        this._serialize();
        return true;
    },
    _first: function() {
        return this._data[0];
    },
    _last: function() {
        return _data[ this._data.length-1 ];
    },
    _get: function(id) {
        return this._filter('id', id)[0];
    },
    _filter: function(attribute, value) {
        var items = [], key, item, undefValue = (typeof value == "undefined");
        for (key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                item = this._data[key];
                if (undefValue || item[attribute] == value) {
                    items.push(item);
                }
            }
        }
        return items;
    },
    _multiFilter: function(filters) {
        var items = [], key, attribute, item;
        for (key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                item = this._data[key];
                for (attribute in filters) {
                    if (filters.hasOwnProperty(attribute)) {
                        if (filters[attribute] == item[attribute]) {
                            items.push(item);
                        }
                    }
                }
            }
        }
        return items;
    },
    _indexOf: function(id) {
        return this._data.indexOf(this._get(id));
    },
    _serialize: function() {
        var data = {
            prevId: this._id,
            data: this._data
        };
        localStorage[this.name] = JSON.stringify(data);
    },
    _deserialize: function() {
        var data = localStorage[this.name];
        if (data) {
            data = JSON.parse(data);
            this._id = data.prevId;
            this._data = data.data;
        }
    },
    _newId: function() {
        return this._id++;
    },
    _mixin: function(to, from) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        }
    },
    _clone: function(obj) {
        var type   = Object.prototype.toString.call(obj),
            cloned = obj;

        if (type == '[object Object]') {
            cloned = {};
            for (var key in obj) {
                obj.hasOwnProperty(key) && (cloned[key] = this._clone(obj[key]));
            }
        } else if (type == '[object Array]') {
            cloned = [];
            for (var index = 0, length = obj.length; index < length; index++) {
                cloned[index] = this._clone(obj[index]);
            }
        }

        return cloned;
    }
};

// http://javascript.crockford.com/prototypal.html
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}