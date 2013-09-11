// depot.js v0.1.6

// (c) 2013 Michal Kuklis
// Licensed under The MIT License
// http://opensource.org/licenses/MIT

(function (name, root, factory) {
  if (typeof exports == 'object') {
    module.exports = factory();
  } else if (typeof define == 'function' && define.amd) {
    define(factory);
  } else {
    root[name] = factory();
  }
}("depot", this, function () {

  "use strict";

  // depot api

  var api = {

    save: function (record) {
      var id;

      if (!record[this.idAttribute]) {
        record[this.idAttribute] = guid();
      }

      id = record[this.idAttribute] + '';

      if (this.ids.indexOf(id) < 0) {
        this.ids.push(id);
        this.storageAdaptor.setItem(this.name, this.ids.join(","));
      }

      this.storageAdaptor.setItem(getKey(this.name, id), JSON.stringify(record));

      return record;
    },

    update: function (id, data) {
      if (typeof data == 'undefined') {
        data = id;
        id = data[this.idAttribute];
      }

      var record = this.get(id);

      if (record) {
        record = extend(record, data);
        this.save(record);
      }

      return record;
    },

    updateAll: function (data) {
      var records = this.all();

      records.forEach(function (record) {
        record = extend(record, data);
        this.save(record);
      }, this);

      return records;
    },

    find: function (criteria) {
      var key, match, record;
      var name = this.name;
      var self = this;

      if (!criteria) return this.all();

      return this.ids.reduce(function (memo, id) {
        record = jsonData(self.storageAdaptor.getItem(getKey(name, id)));
        match = findMatch(criteria, record);

        if (match) {
          memo.push(record);
        }

        return memo;
      }, []);
    },

    get: function (id) {
      return jsonData(this.storageAdaptor.getItem(getKey(this.name, id)));
    },

    all: function () {
      var record, self = this, name = this.name;

      return this.ids.reduce(function (memo, id) {
        record = self.storageAdaptor.getItem(getKey(name, id));

        if (record) {
          memo.push(jsonData(record));
        }

        return memo;
      }, []);
    },

    destroy: function (record) {
      var index;
      var id = (record[this.idAttribute]) ? record[this.idAttribute] : record;
      var key = getKey(this.name, id);

      record = jsonData(this.storageAdaptor.getItem(key));
      this.storageAdaptor.removeItem(key);

      index = this.ids.indexOf(id);
      if (index != -1) this.ids.splice(index, 1);
      this.storageAdaptor.setItem(this.name, this.ids.join(","));

      return record;
    },

    destroyAll: function (criteria) {
      var attr, id, match, record, key;

      for (var i = this.ids.length - 1; i >= 0; i--) {
        id = this.ids[i];
        key = getKey(this.name, id);

        if (criteria) {

          record = jsonData(this.storageAdaptor.getItem(key));
          match = findMatch(criteria, record);

          if (match) {
            this.storageAdaptor.removeItem(key);
            this.ids.splice(i, 1);
          }

        }
        else {
          this.storageAdaptor.removeItem(key);
        }
      }

      if (criteria) {
        this.storageAdaptor.setItem(this.name, this.ids.join(","));
      }
      else {
        this.storageAdaptor.removeItem(this.name);
        this.ids = [];
      }
    },

    size: function () {
      return this.ids.length;
    }
  };

  // helpers

  function jsonData(data) {
    return data && JSON.parse(data);
  }

  function getKey(name, id) {
    return name + "-" + id;
  }

  function findMatch(criteria, record) {
    var match, attr;

    if (typeof criteria == 'function') {
      match = criteria(record);
    }
    else {
      match = true;
      for (attr in criteria) {
        match &= (criteria[attr] === record[attr]);
      }
    }

    return match;
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
  }

  function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() +
      '-' +s4() + '-' + s4() + s4() + s4();
  }

  function extend(dest, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }

    return dest;
  }

  function depot(name, options) {
    var store, ids;

    options = extend({
      idAttribute: '_id',
      storageAdaptor: localStorage
    }, options);

    if (!options.storageAdaptor) throw new Error("No storage adaptor was found");

    store = options.storageAdaptor.getItem(name);
    ids = (store && store.split(",")) || [];

    return Object.create(api, {
      name: { value: name },
      store: { value: store },
      ids: { value: ids, writable: true },
      idAttribute: { value: options.idAttribute },
      storageAdaptor: { value: options.storageAdaptor }
    });
  }

  return depot;
}));
