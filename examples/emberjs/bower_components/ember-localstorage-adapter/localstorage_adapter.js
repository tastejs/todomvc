/*global Ember*/
/*global DS*/
(function () {
  'use strict';

  DS.LSSerializer = DS.JSONSerializer.extend({

    serializeHasMany: function(record, json, relationship) {
      var key = relationship.key;
      var payloadKey = this.keyForRelationship ? this.keyForRelationship(key, "hasMany") : key;
      var relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

      if (relationshipType === 'manyToNone' ||
          relationshipType === 'manyToMany' ||
          relationshipType === 'manyToOne') {
        json[payloadKey] = record.get(key).mapBy('id');
        // TODO support for polymorphic manyToNone and manyToMany relationships
      }
    },

    /**
     * Extracts whatever was returned from the adapter.
     *
     * If the adapter returns relationships in an embedded way, such as follows:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *
     *   "_embedded": {
     *     "comment": [{
     *       "id": 1,
     *       "comment_title": "FIRST"
     *     }, {
     *       "id": 2,
     *       "comment_title": "Rails is unagi"
     *     }]
     *   }
     * }
     *
     * this method will create separated JSON for each resource and then push
     * them individually to the Store.
     *
     * In the end, only the main resource will remain, containing the ids of its
     * relationships. Given the relations are already in the Store, we will
     * return a JSON with the main resource alone. The Store will sort out the
     * associations by itself.
     *
     * @method extractSingle
     * @private
     * @param {DS.Store} store the returned store
     * @param {DS.Model} type the type/model
     * @param {Object} payload returned JSON
     */
    extractSingle: function(store, type, payload) {
      if (payload && payload._embedded) {
        for (var relation in payload._embedded) {
          var relType = type.typeForRelationship(relation);
          var typeName = relType.typeKey,
              embeddedPayload = payload._embedded[relation];

          if (embeddedPayload) {
            if (Ember.isArray(embeddedPayload)) {
              store.pushMany(typeName, embeddedPayload);
            } else {
              store.push(typeName, embeddedPayload);
            }
          }
        }

        delete payload._embedded;
      }

      return this.normalize(type, payload);
    },

    /**
     * This is exactly the same as extractSingle, but used in an array.
     *
     * @method extractSingle
     * @private
     * @param {DS.Store} store the returned store
     * @param {DS.Model} type the type/model
     * @param {Array} payload returned JSONs
     */
    extractArray: function(store, type, payload) {
      return payload.map(function(json) {
        return this.extractSingle(store, type, json);
      }, this);
    }

  });

  DS.LSAdapter = DS.Adapter.extend(Ember.Evented, {
    /**
      This is the main entry point into finding records. The first parameter to
      this method is the model's name as a string.

      @method find
      @param {DS.Model} type
      @param {Object|String|Integer|null} id
      */
    find: function(store, type, id, opts) {
      var allowRecursive = true;
      var namespace = this._namespaceForType(type);
      var record = Ember.A(namespace.records[id]);

      /**
       * In the case where there are relationships, this method is called again
       * for each relation. Given the relations have references to the main
       * object, we use allowRecursive to avoid going further into infinite
       * recursiveness.
       *
       * Concept from ember-indexdb-adapter
       */
      if (opts && typeof opts.allowRecursive !== 'undefined') {
        allowRecursive = opts.allowRecursive;
      }

      if (!record || !record.hasOwnProperty('id')) {
        return Ember.RSVP.reject(new Error("Couldn't find record of"
                                           + " type '" + type.typeKey
                                           + "' for the id '" + id + "'."));
      }

      if (allowRecursive) {
        return this.loadRelationships(type, record);
      } else {
        return Ember.RSVP.resolve(record);
      }
    },

    findMany: function (store, type, ids, opts) {
      var namespace = this._namespaceForType(type);
      var adapter = this,
          allowRecursive = true,
          results = [], record;

      /**
       * In the case where there are relationships, this method is called again
       * for each relation. Given the relations have references to the main
       * object, we use allowRecursive to avoid going further into infinite
       * recursiveness.
       *
       * Concept from ember-indexdb-adapter
       */
      if (opts && typeof opts.allowRecursive !== 'undefined') {
        allowRecursive = opts.allowRecursive;
      }

      for (var i = 0; i < ids.length; i++) {
        record = namespace.records[ids[i]];
        if (!record || !record.hasOwnProperty('id')) {
          return Ember.RSVP.reject(new Error("Couldn't find record of type '" + type.typeKey
                                             + "' for the id '" + ids[i] + "'."));
        }
        results.push(Ember.copy(record));
      }

      if (results.get('length') && allowRecursive) {
        return this.loadRelationshipsForMany(type, results);
      } else {
        return Ember.RSVP.resolve(results);
      }
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
    findQuery: function (store, type, query, recordArray) {
      var namespace = this._namespaceForType(type);
      var results = this.query(namespace.records, query);

      if (results.get('length')) {
        return this.loadRelationshipsForMany(type, results);
      } else {
        return Ember.RSVP.reject();
      }
    },

    query: function (records, query) {
      var results = [], record;

      function recordMatchesQuery(record) {
        return Ember.keys(query).every(function(property) {
          var test = query[property];
          if (Object.prototype.toString.call(test) === '[object RegExp]') {
            return test.test(record[property]);
          } else {
            return record[property] === test;
          }
        });
      }

      for (var id in records) {
        record = records[id];
        if (recordMatchesQuery(record)) {
          results.push(Ember.copy(record));
        }
      }
      return results;
    },

    findAll: function (store, type) {
      var namespace = this._namespaceForType(type),
          results = [];

      for (var id in namespace.records) {
        results.push(Ember.copy(namespace.records[id]));
      }
      return Ember.RSVP.resolve(results);
    },

    createRecord: function (store, type, record) {
      var namespaceRecords = this._namespaceForType(type);
      var recordHash = record.serialize({includeId: true});

      namespaceRecords.records[recordHash.id] = recordHash;

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    updateRecord: function (store, type, record) {
      var namespaceRecords = this._namespaceForType(type);
      var id = record.get('id');

      namespaceRecords.records[id] = record.serialize({ includeId: true });

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    deleteRecord: function (store, type, record) {
      var namespaceRecords = this._namespaceForType(type);
      var id = record.get('id');

      delete namespaceRecords.records[id];

      this.persistData(type, namespaceRecords);
      return Ember.RSVP.resolve();
    },

    generateIdForRecord: function () {
      return Math.random().toString(32).slice(2).substr(0, 5);
    },

    // private

    adapterNamespace: function () {
      return this.get('namespace') || 'DS.LSAdapter';
    },

    loadData: function () {
      var storage = localStorage.getItem(this.adapterNamespace());
      return storage ? JSON.parse(storage) : {};
    },

    persistData: function(type, data) {
      var modelNamespace = this.modelNamespace(type);
      var localStorageData = this.loadData();

      localStorageData[modelNamespace] = data;

      localStorage.setItem(this.adapterNamespace(), JSON.stringify(localStorageData));
    },

    _namespaceForType: function (type) {
      var namespace = this.modelNamespace(type);
      var storage   = this.loadData();

      return storage[namespace] || {records: {}};
    },

    modelNamespace: function(type) {
      return type.url || type.typeKey;
    },


    /**
     * This takes a record, then analyzes the model relationships and replaces
     * ids with the actual values.
     *
     * Stolen from ember-indexdb-adapter
     *
     * Consider the following JSON is entered:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *   "comments": [1, 2]
     * }
     *
     * This will return:
     *
     * ```js
     * {
     *   "id": 1,
     *   "title": "Rails Rambo",
     *   "comments": [1, 2]
     *
     *   "_embedded": {
     *     "comment": [{
     *       "_id": 1,
     *       "comment_title": "FIRST"
     *     }, {
     *       "_id": 2,
     *       "comment_title": "Rails is unagi"
     *     }]
     *   }
     * }
     *
     * This way, whenever a resource returned, its relationships will be also
     * returned.
     *
     * @method loadRelationships
     * @private
     * @param {DS.Model} type
     * @param {Object} record
     */
    loadRelationships: function(type, record) {
      var adapter = this,
          resultJSON = {},
          typeKey = type.typeKey,
          relationshipNames, relationships,
          relationshipPromises = [];

      /**
       * Create a chain of promises, so the relationships are
       * loaded sequentially.  Think of the variable
       * `recordPromise` as of the accumulator in a left fold.
       */
      var recordPromise = Ember.RSVP.resolve(record);

      relationshipNames = Ember.get(type, 'relationshipNames');
      relationships = relationshipNames.belongsTo
        .concat(relationshipNames.hasMany);

      relationships.forEach(function(relationName) {
        var relationModel = type.typeForRelationship(relationName);
        var relationEmbeddedId = record[relationName];
        var relationProp  = adapter.relationshipProperties(type, relationName);
        var relationType  = relationProp.kind;
        var foreignAdapter = type.store.adapterFor(relationModel);

        var opts = {allowRecursive: false};

        /**
         * embeddedIds are ids of relations that are included in the main
         * payload, such as:
         *
         * {
         *    cart: {
         *      id: "s85fb",
         *      customer: "rld9u"
         *    }
         * }
         *
         * In this case, cart belongsTo customer and its id is present in the
         * main payload. We find each of these records and add them to _embedded.
         */
        if (relationEmbeddedId && foreignAdapter === adapter)
        {
          recordPromise = recordPromise.then(function(recordPayload) {
            var promise;
            if (relationType === 'belongsTo' || relationType === 'hasOne') {
              promise = adapter.find(null, relationModel, relationEmbeddedId, opts);
            } else if (relationType == 'hasMany') {
              promise = adapter.findMany(null, relationModel, relationEmbeddedId, opts);
            }

            return promise.then(function(relationRecord) {
              return adapter.addEmbeddedPayload(recordPayload, relationName, relationRecord);
            });
          });
        }
      });

      return recordPromise;
    },


    /**
     * Given the following payload,
     *
     *   {
     *      cart: {
     *        id: "1",
     *        customer: "2"
     *      }
     *   }
     *
     * With `relationshipName` being `customer` and `relationshipRecord`
     *
     *   {id: "2", name: "Rambo"}
     *
     * This method returns the following payload:
     *
     *   {
     *      cart: {
     *        id: "1",
     *        customer: "2"
     *      },
     *      _embedded: {
     *        customer: {
     *          id: "2",
     *          name: "Rambo"
     *        }
     *      }
     *   }
     *
     * which is then treated by the serializer later.
     *
     * @method addEmbeddedPayload
     * @private
     * @param {Object} payload
     * @param {String} relationshipName
     * @param {Object} relationshipRecord
     */
    addEmbeddedPayload: function(payload, relationshipName, relationshipRecord) {
      var objectHasId = (relationshipRecord && relationshipRecord.id);
      var arrayHasIds = (relationshipRecord.length && relationshipRecord.everyBy("id"));
      var isValidRelationship = (objectHasId || arrayHasIds);

      if (isValidRelationship) {
        if (!payload['_embedded']) {
          payload['_embedded'] = {};
        }

        payload['_embedded'][relationshipName] = relationshipRecord;
        if (relationshipRecord.length) {
          payload[relationshipName] = relationshipRecord.mapBy('id');
        } else {
          payload[relationshipName] = relationshipRecord.id;
        }
      }

      if (this.isArray(payload[relationshipName])) {
        payload[relationshipName] = payload[relationshipName].filter(function(id) {
          return id;
        });
      }

      return payload;
    },


    isArray: function(value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    },

    /**
     * Same as `loadRelationships`, but for an array of records.
     *
     * @method loadRelationshipsForMany
     * @private
     * @param {DS.Model} type
     * @param {Object} recordsArray
     */
    loadRelationshipsForMany: function(type, recordsArray) {
      var adapter = this,
          promise = Ember.RSVP.resolve([]);

      /**
       * Create a chain of promises, so the records are loaded sequentially.
       * Think of the variable promise as of the accumulator in a left fold.
       */
      recordsArray.forEach(function(record) {
        promise = promise.then(function(records) {
          return adapter.loadRelationships(type, record)
            .then(function(loadedRecord) {
              records.push(loadedRecord);
              return records;
            });
        });
      });

      return promise;
    },


    /**
     *
     * @method relationshipProperties
     * @private
     * @param {DS.Model} type
     * @param {String} relationName
     */
    relationshipProperties: function(type, relationName) {
      var relationships = Ember.get(type, 'relationshipsByName');
      if (relationName) {
        return relationships.get(relationName);
      } else {
        return relationships;
      }
    }
  });
}());
