DS.LSSerializer = DS.JSONSerializer.extend({

  addBelongsTo: function(data, record, key, association) {
    data[key] = record.get(key + '.id');
  },

  addHasMany: function(data, record, key, association) {
    data[key] = record.get(key).map(function(record) {
      return record.get('id');
    });
  },

  // extract expects a root key, we don't want to save all these keys to
  // localStorage so we generate the root keys here
  extract: function(loader, json, type, record) {
    this._super(loader, this.rootJSON(json, type), type, record);
  },

  extractMany: function(loader, json, type, records) {
    this._super(loader, this.rootJSON(json, type, 'pluralize'), type, records);
  },

  rootJSON: function(json, type, pluralize) {
    var root = this.rootForType(type);
    if (pluralize == 'pluralize') { root = this.pluralize(root); }
    var rootedJSON = {};
    rootedJSON[root] = json;
    return rootedJSON;
  }

});

DS.LSAdapter = DS.Adapter.extend(Ember.Evented, {

  init: function() {
    this._loadData();
  },

  generateIdForRecord: function() {
    return Math.random().toString(32).slice(2).substr(0,5);
  },

  serializer: DS.LSSerializer.create(),

  find: function(store, type, id) {
    var namespace = this._namespaceForType(type);
    this._async(function(){
      var copy = Ember.copy(namespace.records[id]);
      this.didFindRecord(store, type, copy, id);
    });
  },

  findMany: function(store, type, ids) {
    var namespace = this._namespaceForType(type);
    this._async(function(){
      var results = [];
      for (var i = 0; i < ids.length; i++) {
        results.push(Ember.copy(namespace.records[ids[i]]));
      }
      this.didFindMany(store, type, results);
    });
  },

  // Supports queries that look like this:
  //
  //   {
  //     <property to query>: <value or regex (for strings) to match>,
  //     ...
  //   }
  //
  // Every property added to the query is an "AND" query, not "OR"
  //
  // Example:
  //
  //  match records with "complete: true" and the name "foo" or "bar"
  //
  //    { complete: true, name: /foo|bar/ }
  findQuery: function(store, type, query, recordArray) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      var results = this.query(namespace.records, query);
      this.didFindQuery(store, type, results, recordArray);
    });
  },

  query: function(records, query) {
    var results = [];
    var id, record, property, test, push;
    for (id in records) {
      record = records[id];
      for (property in query) {
        test = query[property];
        push = false;
        if (Object.prototype.toString.call(test) == '[object RegExp]') {
          push = test.test(record[property]);
        } else {
          push = record[property] === test;
        }
      }
      if (push) {
        results.push(record);
      }
    }
    return results;
  },

  findAll: function(store, type) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      var results = [];
      for (var id in namespace.records) {
        results.push(Ember.copy(namespace.records[id]));
      }
      this.didFindAll(store, type, results);
    });
  },

  createRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    records.forEach(function(record) {
      this._addRecordToNamespace(namespace, record);
    }, this);
    this._async(function() {
      this._didSaveRecords(store, type, records);
    });
  },

  updateRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      records.forEach(function(record) {
        var id = record.get('id');
        namespace.records[id] = record.serialize({includeId:true});
      }, this);
      this._didSaveRecords(store, type, records);
    });
  },

  deleteRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      records.forEach(function(record) {
        var id = record.get('id');
        delete namespace.records[id];
      });
      this._didSaveRecords(store, type, records);
    });

  },

  dirtyRecordsForHasManyChange: function(dirtySet, parent, relationship) {
    dirtySet.add(parent);
  },

  dirtyRecordsForBelongsToChange: function(dirtySet, child, relationship) {
    dirtySet.add(child);
  },

  // private

  _getNamespace: function() {
    return this.namespace || 'DS.LSAdapter';
  },

  _loadData: function() {
    var storage = localStorage.getItem(this._getNamespace());
    this._data = storage ? JSON.parse(storage) : {};
  },

  _didSaveRecords: function(store, type, records) {
    var success = this._saveData();
    if (success) {
      store.didSaveRecords(records);
    } else {
      records.forEach(function(record) {
        store.recordWasError(record);
      });
      this.trigger('QUOTA_EXCEEDED_ERR', records);
    }
  },

  _saveData: function() {
    try {
      localStorage.setItem(this._getNamespace(), JSON.stringify(this._data));
      return true;
    } catch(error) {
      if (error.name == 'QUOTA_EXCEEDED_ERR') {
        return false;
      } else {
        throw new Error(error);
      }
    }
  },

  _namespaceForType: function(type) {
    var namespace = type.url || type.toString();
    return this._data[namespace] || (
      this._data[namespace] = {records: {}}
    );
  },

  _addRecordToNamespace: function(namespace, record) {
    var data = record.serialize({includeId: true});
    namespace.records[data.id] = data;
  },

  _async: function(callback) {
    var _this = this;
    setTimeout(function(){
      Ember.run(_this, callback);
    }, 1);
  }

});

