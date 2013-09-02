// Version: v0.13-221-gef11bff
// Last commit: ef11bff (2013-08-26 20:54:06 -0700)


(function() {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod, deps, callback, reified , exports;

    mod = registry[name];

    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    deps = mod.deps;
    callback = mod.callback;
    reified = [];
    exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();
(function() {
/**
  @module ember-data
*/

/**
  All Ember Data methods and functions are defined inside of this namespace.

  @class DS
  @static
*/

if ('undefined' === typeof DS) {
  DS = Ember.Namespace.create({
    VERSION: '0.13'
  });

  if ('undefined' !== typeof window) {
    window.DS = DS;
  }
}
})();



(function() {
var get = Ember.get, set = Ember.set;

DS.NewJSONSerializer = Ember.Object.extend({
  deserialize: function(type, data) {
    var store = get(this, 'store');

    type.eachRelationship(function(key, relationship) {
      var type = relationship.type,
          value = data[key];

      if (value == null) { return; }

      if (relationship.kind === 'belongsTo') {
        this.deserializeRecordId(data, key, type, value);
      } else if (relationship.kind === 'hasMany') {
        this.deserializeRecordIds(data, key, type, value);
      }
    }, this);

    return data;
  },

  deserializeRecordId: function(data, key, type, id) {
    if (typeof id === 'number' || typeof id === 'string') {
      data[key] = get(this, 'store').recordFor(type, id);
    }
  },

  deserializeRecordIds: function(data, key, type, ids) {
    for (var i=0, l=ids.length; i<l; i++) {
      this.deserializeRecordId(ids, i, type, ids[i]);
    }
  }
});

})();



(function() {
/**
  @module ember-data
*/
// Keep ED compatible with previous versions of ember
// TODO: Remove this check for Ember 1.0
if (!Ember.DataAdapter) { return; }

var get = Ember.get, capitalize = Ember.String.capitalize, underscore = Ember.String.underscore, DS = window.DS ;

/**
  Extend `Ember.DataAdapter` with ED specific code.
*/
DS.DebugAdapter = Ember.DataAdapter.extend({
  getFilters: function() {
    return [
      { name: 'isNew', desc: 'New' },
      { name: 'isModified', desc: 'Modified' },
      { name: 'isClean', desc: 'Clean' }
    ];
  },

  detect: function(klass) {
    return klass !== DS.Model && DS.Model.detect(klass);
  },

  columnsForType: function(type) {
    var columns = [{ name: 'id', desc: 'Id' }], count = 0, self = this;
    Ember.A(get(type, 'attributes')).forEach(function(name, meta) {
        if (count++ > self.attributeLimit) { return false; }
        var desc = capitalize(underscore(name).replace('_', ' '));
        columns.push({ name: name, desc: desc });
    });
    return columns;
  },

  getRecords: function(type) {
    return this.get('store').all(type);
  },

  getRecordColumnValues: function(record) {
    var self = this, count = 0,
        columnValues = { id: get(record, 'id') };

    record.eachAttribute(function(key) {
      if (count++ > self.attributeLimit) {
        return false;
      }
      var value = get(record, key);
      columnValues[key] = value;
    });
    return columnValues;
  },

  getRecordKeywords: function(record) {
    var keywords = [], keys = Ember.A(['id']);
    record.eachAttribute(function(key) {
      keys.push(key);
    });
    keys.forEach(function(key) {
      keywords.push(get(record, key));
    });
    return keywords;
  },

  getRecordFilterValues: function(record) {
    return {
      isNew: record.get('isNew'),
      isModified: record.get('isDirty') && !record.get('isNew'),
      isClean: !record.get('isDirty')
    };
  },

  getRecordColor: function(record) {
    var color = 'black';
    if (record.get('isNew')) {
      color = 'green';
    } else if (record.get('isDirty')) {
      color = 'blue';
    }
    return color;
  },

  observeRecord: function(record, recordUpdated) {
    var releaseMethods = Ember.A(), self = this,
        keysToObserve = Ember.A(['id', 'isNew', 'isDirty']);

    record.eachAttribute(function(key) {
      keysToObserve.push(key);
    });

    keysToObserve.forEach(function(key) {
      var handler = function() {
        recordUpdated(self.wrapRecord(record));
      };
      Ember.addObserver(record, key, handler);
      releaseMethods.push(function() {
        Ember.removeObserver(record, key, handler);
      });
    });

    var release = function() {
      releaseMethods.forEach(function(fn) { fn(); } );
    };

    return release;
  }

});


})();



(function() {
/**
  @module ember-data
*/

var set = Ember.set;

/*
  This code registers an injection for Ember.Application.

  If an Ember.js developer defines a subclass of DS.Store on their application,
  this code will automatically instantiate it and make it available on the
  router.

  Additionally, after an application's controllers have been injected, they will
  each have the store made available to them.

  For example, imagine an Ember.js application with the following classes:

  App.Store = DS.Store.extend({
    adapter: 'App.MyCustomAdapter'
  });

  App.PostsController = Ember.ArrayController.extend({
    // ...
  });

  When the application is initialized, `App.Store` will automatically be
  instantiated, and the instance of `App.PostsController` will have its `store`
  property set to that instance.

  Note that this code will only be run if the `ember-application` package is
  loaded. If Ember Data is being used in an environment other than a
  typical application (e.g., node.js where only `ember-runtime` is available),
  this code will be ignored.
*/

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "store",

    initialize: function(container, application) {
      Ember.assert("You included Ember Data but didn't define "+application.toString()+".Store", application.Store);

      application.register('store:main', application.Store);
      application.register('serializer:_default', DS.NewJSONSerializer);

      // Eagerly generate the store so defaultStore is populated.
      // TODO: Do this in a finisher hook
      container.lookup('store:main');
    }
  });

  // Keep ED compatible with previous versions of ember
  // TODO: Remove the if statement for Ember 1.0
  if (DS.DebugAdapter) {
    Application.initializer({
      name: "dataAdapter",

      initialize: function(container, application) {
        application.register('dataAdapter:main', DS.DebugAdapter);
      }
    });
  }

  Application.initializer({
    name: "injectStore",

    initialize: function(container, application) {
      application.inject('controller', 'store', 'store:main');
      application.inject('route', 'store', 'store:main');
      application.inject('dataAdapter', 'store', 'store:main');
    }
  });

});

})();



(function() {
/**
  @module ember-data
*/

/**
  Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>

  © 2011 Colin Snover <http://zetafleet.com>

  Released under MIT license.

  @class Date
  @namespace Ember
  @static
*/
Ember.Date = Ember.Date || {};

var origParse = Date.parse, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];

/**
  @method parse
  @param date
*/
Ember.Date.parse = function (date) {
    var timestamp, struct, minutesOffset = 0;

    // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
    // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
    // implementations could be faster
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
        // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
        for (var i = 0, k; (k = numericKeys[i]); ++i) {
            struct[k] = +struct[k] || 0;
        }

        // allow undefined days and months
        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1;

        if (struct[8] !== 'Z' && struct[9] !== undefined) {
            minutesOffset = struct[10] * 60 + struct[11];

            if (struct[9] === '+') {
                minutesOffset = 0 - minutesOffset;
            }
        }

        timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    }
    else {
        timestamp = origParse ? origParse(date) : NaN;
    }

    return timestamp;
};

if (Ember.EXTEND_PROTOTYPES === true || Ember.EXTEND_PROTOTYPES.Date) {
  Date.parse = Ember.Date.parse;
}

})();



(function() {

})();



(function() {
/**
  @module ember-data
*/

var Evented = Ember.Evented,              // ember-runtime/mixins/evented
    Deferred = Ember.DeferredMixin,       // ember-runtime/mixins/evented
    run = Ember.run,                      // ember-metal/run-loop
    get = Ember.get;                      // ember-metal/accessors

var LoadPromise = Ember.Mixin.create(Evented, Deferred, {
  init: function() {
    this._super.apply(this, arguments);

    this.one('didLoad', this, function() {
      this.resolve(this);
    });

    this.one('becameError', this, function() {
      this.reject(this);
    });

    if (get(this, 'isLoaded')) {
      this.trigger('didLoad');
    }
  }
});

DS.LoadPromise = LoadPromise;

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;

var LoadPromise = DS.LoadPromise; // system/mixins/load_promise

/**
  A record array is an array that contains records of a certain type. The record
  array materializes records as needed when they are retrieved for the first
  time. You should not create record arrays yourself. Instead, an instance of
  DS.RecordArray or its subclasses will be returned by your application's store
  in response to queries.

  @class RecordArray
  @namespace DS
  @extends Ember.ArrayProxy
  @uses Ember.Evented
  @uses DS.LoadPromise
*/

DS.RecordArray = Ember.ArrayProxy.extend(LoadPromise, {
  /**
    The model type contained by this record array.

    @property type
    @type DS.Model
  */
  type: null,

  // The array of client ids backing the record array. When a
  // record is requested from the record array, the record
  // for the client id at the same index is materialized, if
  // necessary, by the store.
  content: null,

  isLoaded: false,
  isUpdating: false,

  // The store that created this record array.
  store: null,

  objectAtContent: function(index) {
    var content = get(this, 'content'),
        reference = content.objectAt(index),
        store = get(this, 'store');

    if (reference instanceof DS.Model) {
      return reference;
    }

    if (reference) {
      return store.recordForReference(reference);
    }
  },

  materializedObjectAt: function(index) {
    var reference = get(this, 'content').objectAt(index);
    if (!reference) { return; }

    if (get(this, 'store').recordIsMaterialized(reference)) {
      return this.objectAt(index);
    }
  },

  update: function() {
    if (get(this, 'isUpdating')) { return; }

    var store = get(this, 'store'),
        type = get(this, 'type');

    store.fetchAll(type, this);
  },

  addReference: function(reference) {
    get(this, 'content').addObject(reference);
  },

  removeReference: function(reference) {
    get(this, 'content').removeObject(reference);
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get;

/**
  @class FilteredRecordArray
  @namespace DS
  @extends DS.RecordArray
*/
DS.FilteredRecordArray = DS.RecordArray.extend({
  filterFunction: null,
  isLoaded: true,

  replace: function() {
    var type = get(this, 'type').toString();
    throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
  },

  updateFilter: Ember.observer(function() {
    var manager = get(this, 'manager');
    manager.updateFilter(this, get(this, 'type'), get(this, 'filterFunction'));
  }, 'filterFunction')
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;

/**
  @class AdapterPopulatedRecordArray
  @namespace DS
  @extends DS.RecordArray
*/
DS.AdapterPopulatedRecordArray = DS.RecordArray.extend({
  query: null,

  replace: function() {
    var type = get(this, 'type').toString();
    throw new Error("The result of a server query (on " + type + ") is immutable.");
  },

  load: function(references) {
    this.setProperties({
      content: Ember.A(references),
      isLoaded: true
    });

    // TODO: does triggering didLoad event should be the last action of the runLoop?
    Ember.run.once(this, 'trigger', 'didLoad');
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;
var map = Ember.EnumerableUtils.map;

/**
  A ManyArray is a RecordArray that represents the contents of a has-many
  relationship.

  The ManyArray is instantiated lazily the first time the relationship is
  requested.

  ### Inverses

  Often, the relationships in Ember Data applications will have
  an inverse. For example, imagine the following models are
  defined:

      App.Post = DS.Model.extend({
        comments: DS.hasMany('App.Comment')
      });

      App.Comment = DS.Model.extend({
        post: DS.belongsTo('App.Post')
      });

  If you created a new instance of `App.Post` and added
  a `App.Comment` record to its `comments` has-many
  relationship, you would expect the comment's `post`
  property to be set to the post that contained
  the has-many.

  We call the record to which a relationship belongs the
  relationship's _owner_.

  @class ManyArray
  @namespace DS
  @extends DS.RecordArray
*/
DS.ManyArray = DS.RecordArray.extend({
  init: function() {
    this._super.apply(this, arguments);
    this._changesToSync = Ember.OrderedSet.create();
  },

  /**
    The record to which this relationship belongs.

    @property {DS.Model}
    @private
  */
  owner: null,

  /**
    `true` if the relationship is polymorphic, `false` otherwise.

    @property {Boolean}
    @private
  */
  isPolymorphic: false,

  // LOADING STATE

  isLoaded: false,

  loadingRecordsCount: function(count) {
    this.loadingRecordsCount = count;
  },

  loadedRecord: function() {
    this.loadingRecordsCount--;
    if (this.loadingRecordsCount === 0) {
      set(this, 'isLoaded', true);
      this.trigger('didLoad');
    }
  },

  fetch: function() {
    var references = get(this, 'content'),
        store = get(this, 'store'),
        owner = get(this, 'owner');

    store.fetchUnloadedReferences(references, owner);
  },

  // Overrides Ember.Array's replace method to implement
  replaceContent: function(index, removed, added) {
    // Map the array of record objects into an array of  client ids.
    added = map(added, function(record) {
      Ember.assert("You can only add records of " + (get(this, 'type') && get(this, 'type').toString()) + " to this relationship.", !get(this, 'type') || (get(this, 'type').detectInstance(record)) );
      return get(record, '_reference');
    }, this);

    this._super(index, removed, added);
  },

  arrangedContentDidChange: function() {
    this.fetch();
  },

  arrayContentWillChange: function(index, removed, added) {
    var owner = get(this, 'owner'),
        name = get(this, 'name');

    if (!owner._suspendedRelationships) {
      // This code is the first half of code that continues inside
      // of arrayContentDidChange. It gets or creates a change from
      // the child object, adds the current owner as the old
      // parent if this is the first time the object was removed
      // from a ManyArray, and sets `newParent` to null.
      //
      // Later, if the object is added to another ManyArray,
      // the `arrayContentDidChange` will set `newParent` on
      // the change.
      for (var i=index; i<index+removed; i++) {
        var reference = get(this, 'content').objectAt(i);

        var change = DS.RelationshipChange.createChange(owner.get('_reference'), reference, get(this, 'store'), {
          parentType: owner.constructor,
          changeType: "remove",
          kind: "hasMany",
          key: name
        });

        this._changesToSync.add(change);
      }
    }

    return this._super.apply(this, arguments);
  },

  arrayContentDidChange: function(index, removed, added) {
    this._super.apply(this, arguments);

    var owner = get(this, 'owner'),
        name = get(this, 'name'),
        store = get(this, 'store');

    if (!owner._suspendedRelationships) {
      // This code is the second half of code that started in
      // `arrayContentWillChange`. It gets or creates a change
      // from the child object, and adds the current owner as
      // the new parent.
      for (var i=index; i<index+added; i++) {
        var reference = get(this, 'content').objectAt(i);

        var change = DS.RelationshipChange.createChange(owner.get('_reference'), reference, store, {
          parentType: owner.constructor,
          changeType: "add",
          kind:"hasMany",
          key: name
        });
        change.hasManyName = name;

        this._changesToSync.add(change);
      }

      // We wait until the array has finished being
      // mutated before syncing the OneToManyChanges created
      // in arrayContentWillChange, so that the array
      // membership test in the sync() logic operates
      // on the final results.
      this._changesToSync.forEach(function(change) {
        change.sync();
      });
      DS.OneToManyChange.ensureSameTransaction(this._changesToSync, store);
      this._changesToSync.clear();
    }
  },

  // Create a child record within the owner
  createRecord: function(hash, transaction) {
    var owner = get(this, 'owner'),
        store = get(owner, 'store'),
        type = get(this, 'type'),
        record;

    Ember.assert("You can not create records of " + (get(this, 'type') && get(this, 'type').toString()) + " on this polymorphic relationship.", !get(this, 'isPolymorphic'));

    transaction = transaction || get(owner, 'transaction');

    record = store.createRecord.call(store, type, hash, transaction);
    this.pushObject(record);

    return record;
  }

});

})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

/**
  @module ember-data
*/

/**
  A transaction allows you to collect multiple records into a unit of work
  that can be committed or rolled back as a group.

  For example, if a record has local modifications that have not yet
  been saved, calling `commit()` on its transaction will cause those
  modifications to be sent to the adapter to be saved. Calling
  `rollback()` on its transaction would cause all of the modifications to
  be discarded and the record to return to the last known state before
  changes were made.

  If a newly created record's transaction is rolled back, it will
  immediately transition to the deleted state.

  If you do not explicitly create a transaction, a record is assigned to
  an implicit transaction called the default transaction. In these cases,
  you can treat your application's instance of `DS.Store` as a transaction
  and call the `commit()` and `rollback()` methods on the store itself.

  Once a record has been successfully committed or rolled back, it will
  be moved back to the implicit transaction. Because it will now be in
  a clean state, it can be moved to a new transaction if you wish.

  ### Creating a Transaction

  To create a new transaction, call the `transaction()` method of your
  application's `DS.Store` instance:

      var transaction = App.store.transaction();

  This will return a new instance of `DS.Transaction` with no records
  yet assigned to it.

  ### Adding Existing Records

  Add records to a transaction using the `add()` method:

      record = App.store.find(App.Person, 1);
      transaction.add(record);

  Note that only records whose `isDirty` flag is `false` may be added
  to a transaction. Once modifications to a record have been made
  (its `isDirty` flag is `true`), it is not longer able to be added to
  a transaction.

  ### Creating New Records

  Because newly created records are dirty from the time they are created,
  and because dirty records can not be added to a transaction, you must
  use the `createRecord()` method to assign new records to a transaction.

  For example, instead of this:

    var transaction = store.transaction();
    var person = App.Person.createRecord({ name: "Steve" });

    // won't work because person is dirty
    transaction.add(person);

  Call `createRecord()` on the transaction directly:

    var transaction = store.transaction();
    transaction.createRecord(App.Person, { name: "Steve" });

  ### Asynchronous Commits

  Typically, all of the records in a transaction will be committed
  together. However, new records that have a dependency on other new
  records need to wait for their parent record to be saved and assigned an
  ID. In that case, the child record will continue to live in the
  transaction until its parent is saved, at which time the transaction will
  attempt to commit again.

  For this reason, you should not re-use transactions once you have committed
  them. Always make a new transaction and move the desired records to it before
  calling commit.

  @class Transaction
  @namespace DS
  @extends Ember.Object
*/
DS.Transaction = Ember.Object.extend({
  /**
    Creates the bucket data structure used to segregate records by
    type.

    @method init
    @private
  */
  init: function() {
    set(this, 'records', Ember.OrderedSet.create());
  },

  /**
    Creates a new record of the given type and assigns it to the transaction
    on which the method was called.

    This is useful as only clean records can be added to a transaction and
    new records created using other methods immediately become dirty.

    @method createRecord
    @param {DS.Model} type the model type to create
    @param {Object} hash the data hash to assign the new record
  */
  createRecord: function(type, hash) {
    var store = get(this, 'store');

    return store.createRecord(type, hash, this);
  },

  isEqualOrDefault: function(other) {
    if (this === other || other === get(this, 'store.defaultTransaction')) {
      return true;
    }
  },

  isDefault: Ember.computed(function() {
    return this === get(this, 'store.defaultTransaction');
  }).volatile(),

  /**
    Adds an existing record to this transaction. Only records without
    modificiations (i.e., records whose `isDirty` property is `false`)
    can be added to a transaction.

    @method add
    @param {DS.Model} record the record to add to the transaction
  */
  add: function(record) {
    Ember.assert("You must pass a record into transaction.add()", record instanceof DS.Model);

    var store = get(this, 'store');
    var adapter = get(store, '_adapter');
    var serializer = get(adapter, 'serializer');
    serializer.eachEmbeddedRecord(record, function(embeddedRecord, embeddedType) {
      if (embeddedType === 'load') { return; }

      this.add(embeddedRecord);
    }, this);

    this.adoptRecord(record);
  },

  relationships: Ember.computed(function() {
    var relationships = Ember.OrderedSet.create(),
        records = get(this, 'records'),
        store = get(this, 'store');

    forEach(records, function(record) {
      var reference = get(record, '_reference');
      var changes = store.relationshipChangesFor(reference);
      for(var i = 0; i < changes.length; i++) {
        relationships.add(changes[i]);
      }
    });

    return relationships;
  }).volatile(),

  commitDetails: Ember.computed(function() {
    var commitDetails = Ember.MapWithDefault.create({
      defaultValue: function() {
        return {
          created: Ember.OrderedSet.create(),
          updated: Ember.OrderedSet.create(),
          deleted: Ember.OrderedSet.create()
        };
      }
    });

    var records = get(this, 'records'),
        store = get(this, 'store');

    forEach(records, function(record) {
      if(!get(record, 'isDirty')) return;
      record.send('willCommit');
      var adapter = store.adapterForType(record.constructor);
      commitDetails.get(adapter)[get(record, 'dirtyType')].add(record);
    });

    return commitDetails;
  }).volatile(),

  /**
    Commits the transaction, which causes all of the modified records that
    belong to the transaction to be sent to the adapter to be saved.

    Once you call `commit()` on a transaction, you should not re-use it.

    When a record is saved, it will be removed from this transaction and
    moved back to the store's default transaction.

    @method commit
  */
  commit: function() {
    var store = get(this, 'store');

    if (get(this, 'isDefault')) {
      set(store, 'defaultTransaction', store.transaction());
    }

    this.removeCleanRecords();

    var commitDetails = get(this, 'commitDetails'),
        relationships = get(this, 'relationships');

    forEach(commitDetails, function(adapter, commitDetails) {
      Ember.assert("You tried to commit records but you have no adapter", adapter);
      Ember.assert("You tried to commit records but your adapter does not implement `commit`", adapter.commit);

      adapter.commit(store, commitDetails);
    });

    // Once we've committed the transaction, there is no need to
    // keep the OneToManyChanges around. Destroy them so they
    // can be garbage collected.
    relationships.forEach(function(relationship) {
      relationship.destroy();
    });
  },

  /**
    Rolling back a transaction resets the records that belong to
    that transaction.

    Updated records have their properties reset to the last known
    value from the persistence layer. Deleted records are reverted
    to a clean, non-deleted state. Newly created records immediately
    become deleted, and are not sent to the adapter to be persisted.

    After the transaction is rolled back, any records that belong
    to it will return to the store's default transaction, and the
    current transaction should not be used again.

    @method rollback
  */
  rollback: function() {
    // Destroy all relationship changes and compute
    // all references affected
    var references = Ember.OrderedSet.create();
    var relationships = get(this, 'relationships');
    relationships.forEach(function(r) {
      references.add(r.firstRecordReference);
      references.add(r.secondRecordReference);
      r.destroy();
    });

    var records = get(this, 'records');
    forEach(records, function(record) {
      if (!record.get('isDirty')) return;
      record.send('rollback');
    });

    // Now that all records in the transaction are guaranteed to be
    // clean, migrate them all to the store's default transaction.
    this.removeCleanRecords();

    // Remaining associated references are not part of the transaction, but
    // can still have hasMany's which have not been reloaded
    references.forEach(function(r) {
      if (r && r.record) {
        var record = r.record;
        record.suspendRelationshipObservers(function() {
          record.reloadHasManys();
        });
      }
    }, this);
  },

  /**
    Removes a record from this transaction and back to the store's
    default transaction.

    Note: This method is private for now, but should probably be exposed
    in the future once we have stricter error checking (for example, in the
    case of the record being dirty).

    @method remove
    @private
    @param {DS.Model} record
  */
  remove: function(record) {
    var defaultTransaction = get(this, 'store.defaultTransaction');
    defaultTransaction.adoptRecord(record);
  },

  /**
    Removes all of the records in the transaction's clean bucket.

    @method removeCleanRecords
    @private
  */
  removeCleanRecords: function() {
    var records = get(this, 'records');
    forEach(records, function(record) {
      if(!record.get('isDirty')) {
        this.remove(record);
      }
    }, this);
  },

  /**
    This method moves a record into a different transaction without the normal
    checks that ensure that the user is not doing something weird, like moving
    a dirty record into a new transaction.

    It is designed for internal use, such as when we are moving a clean record
    into a new transaction when the transaction is committed.

    This method must not be called unless the record is clean.

    @method adoptRecord
    @private
    @param {DS.Model} record
  */
  adoptRecord: function(record) {
    var oldTransaction = get(record, 'transaction');

    if (oldTransaction) {
      oldTransaction.removeRecord(record);
    }

    get(this, 'records').add(record);
    set(record, 'transaction', this);
  },

  /**
   Removes the record without performing the normal checks
   to ensure that the record is re-added to the store's
   default transaction.

   @method removeRecord
   @private
   @param record
  */
  removeRecord: function(record) {
    get(this, 'records').remove(record);
  }

});

DS.Transaction.reopenClass({
  ensureSameTransaction: function(records){
    var transactions = Ember.A();
    forEach( records, function(record){
      if (record){ transactions.pushObject(get(record, 'transaction')); }
    });

    var transaction = transactions.reduce(function(prev, t) {
      if (!get(t, 'isDefault')) {
        if (prev === null) { return t; }
        Ember.assert("All records in a changed relationship must be in the same transaction. You tried to change the relationship between records when one is in " + t + " and the other is in " + prev, t === prev);
      }

      return prev;
    }, null);

    if (transaction) {
      forEach( records, function(record){
        if (record){ transaction.add(record); }
      });
    } else {
      transaction = transactions.objectAt(0);
    }
    return transaction;
   }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get;

var resolveMapConflict = function(oldValue, newValue) {
  return oldValue;
};

var transformMapKey = function(key, value) {
  return key;
};

var transformMapValue = function(key, value) {
  return value;
};

/**
  The Mappable mixin is designed for classes that would like to
  behave as a map for configuration purposes.

  For example, the DS.Adapter class can behave like a map, with
  more semantic API, via the `map` API:

    DS.Adapter.map('App.Person', { firstName: { key: 'FIRST' } });

  Class configuration via a map-like API has a few common requirements
  that differentiate it from the standard Ember.Map implementation.

  First, values often are provided as strings that should be normalized
  into classes the first time the configuration options are used.

  Second, the values configured on parent classes should also be taken
  into account.

  Finally, setting the value of a key sometimes should merge with the
  previous value, rather than replacing it.

  This mixin provides a instance method, `createInstanceMapFor`, that
  will reify all of the configuration options set on an instance's
  constructor and provide it for the instance to use.

  Classes can implement certain hooks that allow them to customize
  the requirements listed above:

  * `resolveMapConflict` - called when a value is set for an existing
    value
  * `transformMapKey` - allows a key name (for example, a global path
    to a class) to be normalized
  * `transformMapValue` - allows a value (for example, a class that
    should be instantiated) to be normalized

  Classes that implement this mixin should also implement a class
  method built using the `generateMapFunctionFor` method:

    DS.Adapter.reopenClass({
      map: DS.Mappable.generateMapFunctionFor('attributes', function(key, newValue, map) {
        var existingValue = map.get(key);

        for (var prop in newValue) {
          if (!newValue.hasOwnProperty(prop)) { continue; }
          existingValue[prop] = newValue[prop];
        }
      })
    });

  The function passed to `generateMapFunctionFor` is invoked every time a
  new value is added to the map.

  @class _Mappable
  @private
  @namespace DS
**/
DS._Mappable = Ember.Mixin.create({
  createInstanceMapFor: function(mapName) {
    var instanceMeta = getMappableMeta(this);

    instanceMeta.values = instanceMeta.values || {};

    if (instanceMeta.values[mapName]) { return instanceMeta.values[mapName]; }

    var instanceMap = instanceMeta.values[mapName] = new Ember.Map();

    var klass = this.constructor;

    while (klass && klass !== DS.Store) {
      this._copyMap(mapName, klass, instanceMap);
      klass = klass.superclass;
    }

    instanceMeta.values[mapName] = instanceMap;
    return instanceMap;
  },

  _copyMap: function(mapName, klass, instanceMap) {
    var classMeta = getMappableMeta(klass);

    var classMap = classMeta[mapName];
    if (classMap) {
      classMap.forEach(eachMap, this);
    }

    function eachMap(key, value) {
      var transformedKey = (klass.transformMapKey || transformMapKey)(key, value);
      var transformedValue = (klass.transformMapValue || transformMapValue)(key, value);

      var oldValue = instanceMap.get(transformedKey);
      var newValue = transformedValue;

      if (oldValue) {
        newValue = (this.constructor.resolveMapConflict || resolveMapConflict)(oldValue, newValue);
      }

      instanceMap.set(transformedKey, newValue);
    }
  }


});

DS._Mappable.generateMapFunctionFor = function(mapName, transform) {
  return function(key, value) {
    var meta = getMappableMeta(this);

    var map = meta[mapName] || Ember.MapWithDefault.create({
      defaultValue: function() { return {}; }
    });

    transform.call(this, key, value, map);

    meta[mapName] = map;
  };
};

function getMappableMeta(obj) {
  var meta = Ember.meta(obj, true),
      keyName = 'DS.Mappable',
      value = meta[keyName];

  if (!value) { meta[keyName] = {}; }

  if (!meta.hasOwnProperty(keyName)) {
    meta[keyName] = Ember.create(meta[keyName]);
  }

  return meta[keyName];
}

})();



(function() {
/*globals Ember*/
/*jshint eqnull:true*/
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;
var once = Ember.run.once;
var isNone = Ember.isNone;
var forEach = Ember.EnumerableUtils.forEach;
var indexOf = Ember.EnumerableUtils.indexOf;
var map = Ember.EnumerableUtils.map;

// These values are used in the data cache when clientIds are
// needed but the underlying data has not yet been loaded by
// the server.
var UNLOADED = 'unloaded';
var LOADING = 'loading';
var MATERIALIZED = { materialized: true };
var CREATED = { created: true };

// Implementors Note:
//
//   The variables in this file are consistently named according to the following
//   scheme:
//
//   * +id+ means an identifier managed by an external source, provided inside
//     the data provided by that source. These are always coerced to be strings
//     before being used internally.
//   * +clientId+ means a transient numerical identifier generated at runtime by
//     the data store. It is important primarily because newly created objects may
//     not yet have an externally generated id.
//   * +reference+ means a record reference object, which holds metadata about a
//     record, even if it has not yet been fully materialized.
//   * +type+ means a subclass of DS.Model.

// Used by the store to normalize IDs entering the store.  Despite the fact
// that developers may provide IDs as numbers (e.g., `store.find(Person, 1)`),
// it is important that internally we use strings, since IDs may be serialized
// and lose type information.  For example, Ember's router may put a record's
// ID into the URL, and if we later try to deserialize that URL and find the
// corresponding record, we will not know if it is a string or a number.
var coerceId = function(id) {
  return id == null ? null : id+'';
};

/**
  The store contains all of the data for records loaded from the server.
  It is also responsible for creating instances of DS.Model that wrap
  the individual data for a record, so that they can be bound to in your
  Handlebars templates.

  Define your application's store like this:

       MyApp.Store = DS.Store.extend();

  Most Ember.js applications will only have a single `DS.Store` that is
  automatically created by their `Ember.Application`.

  You can retrieve models from the store in several ways. To retrieve a record
  for a specific id, use `DS.Model`'s `find()` method:

       var person = App.Person.find(123);

  If your application has multiple `DS.Store` instances (an unusual case), you can
  specify which store should be used:

      var person = store.find(App.Person, 123);

  In general, you should retrieve models using the methods on `DS.Model`; you should
  rarely need to interact with the store directly.

  By default, the store will talk to your backend using a standard REST mechanism.
  You can customize how the store talks to your backend by specifying a custom adapter:

       MyApp.store = DS.Store.create({
         adapter: 'MyApp.CustomAdapter'
       });

  You can learn more about writing a custom adapter by reading the `DS.Adapter`
  documentation.

  @class Store
  @namespace DS
  @extends Ember.Object
  @uses DS._Mappable
*/
DS.Store = Ember.Object.extend(DS._Mappable, {

  /**
    Many methods can be invoked without specifying which store should be used.
    In those cases, the first store created will be used as the default. If
    an application has multiple stores, it should specify which store to use
    when performing actions, such as finding records by ID.

    The init method registers this store as the default if none is specified.

    @method init
  */
  init: function() {
    if (!get(DS, 'defaultStore') || get(this, 'isDefaultStore')) {
      set(DS, 'defaultStore', this);
    }

    // internal bookkeeping; not observable
    this.typeMaps = {};
    this.recordArrayManager = DS.RecordArrayManager.create({
      store: this
    });
    this.relationshipChanges = {};

    set(this, 'currentTransaction', this.transaction());
    set(this, 'defaultTransaction', this.transaction());
  },

  /**
    Returns a new transaction scoped to this store. This delegates
    responsibility for invoking the adapter's commit mechanism to
    a transaction.

    Transaction are responsible for tracking changes to records
    added to them, and supporting `commit` and `rollback`
    functionality. Committing a transaction invokes the store's
    adapter, while rolling back a transaction reverses all
    changes made to records added to the transaction.

    A store has an implicit (default) transaction, which tracks changes
    made to records not explicitly added to a transaction.

    @method transaction
    @returns DS.Transaction
  */
  transaction: function() {
    return DS.Transaction.create({ store: this });
  },

  /**
    Instructs the store to materialize the data for a given record.

    To materialize a record, the store first retrieves the opaque data that was
    passed to either `load()` or `loadMany()`. Then, the data and the record
    are passed to the adapter's `materialize()` method, which allows the adapter
    to translate arbitrary data structures from the adapter into the normalized
    form the record expects.

    The adapter's `materialize()` method will invoke `materializeAttribute()`,
    `materializeHasMany()` and `materializeBelongsTo()` on the record to
    populate it with normalized values.

    @method materializeData
    @private
    @param {DS.Model} record
  */
  materializeData: function(record) {
    var reference = get(record, '_reference'),
        data = reference.data,
        adapter = this.adapterForType(record.constructor);

    reference.data = MATERIALIZED;

    record.setupData();

    if (data !== CREATED) {
      // Instructs the adapter to extract information from the
      // opaque data and materialize the record's attributes and
      // relationships.
      adapter.materialize(record, data, reference.prematerialized);
    }
  },

  /**
    The adapter to use to communicate to a backend server or other persistence layer.

    This can be specified as an instance, a class, or a property path that specifies
    where the adapter can be located.

    @property adapter
    @type {DS.Adapter|String}
  */
  adapter: Ember.computed(function(){
    if (!Ember.testing) {
      Ember.debug("A custom DS.Adapter was not provided as the 'Adapter' property of your application's Store. The default (DS.RESTAdapter) will be used.");
    }

    return 'DS.RESTAdapter';
  }).property(),


  /**
    Returns a JSON representation of the record using the adapter's
    serialization strategy. This method exists primarily to enable
    a record, which has access to its store (but not the store's
    adapter) to provide a `serialize()` convenience.

    The available options are:

    * `includeId`: `true` if the record's ID should be included in
      the JSON representation

    @method serialize
    @private
    @param {DS.Model} record the record to serialize
    @param {Object} options an options hash
  */
  serialize: function(record, options) {
    return this.adapterForType(record.constructor).serialize(record, options);
  },

  /**
    This property returns the adapter, after resolving a possible
    property path.

    If the supplied `adapter` was a class, or a String property
    path resolved to a class, this property will instantiate the
    class.

    This property is cacheable, so the same instance of a specified
    adapter class should be used for the lifetime of the store.

    @property _adapter
    @private
    @returns DS.Adapter
  */
  _adapter: Ember.computed(function() {
    var adapter = get(this, 'adapter');
    if (typeof adapter === 'string') {
      adapter = get(this, adapter, false) || get(Ember.lookup, adapter);
    }

    if (DS.Adapter.detect(adapter)) {
      adapter = adapter.create();
    }

    return adapter;
  }).property('adapter'),

  /**
    A monotonically increasing number to be used to uniquely identify
    data and records.

    It starts at 1 so other parts of the code can test for truthiness
    when provided a `clientId` instead of having to explicitly test
    for undefined.

    @property clientIdCounter
    @private
  */
  clientIdCounter: 1,

  // .....................
  // . CREATE NEW RECORD .
  // .....................

  /**
    Create a new record in the current store. The properties passed
    to this method are set on the newly created record.

    Note: The third `transaction` property is for internal use only.
    If you want to create a record inside of a given transaction,
    use `transaction.createRecord()` instead of `store.createRecord()`.

    @method createRecord
    @param {subclass of DS.Model} type
    @param {Object} properties a hash of properties to set on the
      newly created record.
    @returns DS.Model
  */
  createRecord: function(type, properties, transaction) {
    properties = properties || {};

    // Create a new instance of the model `type` and put it
    // into the specified `transaction`. If no transaction is
    // specified, the default transaction will be used.
    var record = type._create({
      store: this
    });

    transaction = transaction || get(this, 'defaultTransaction');

    // adoptRecord is an internal API that allows records to move
    // into a transaction without assertions designed for app
    // code. It is used here to ensure that regardless of new
    // restrictions on the use of the public `transaction.add()`
    // API, we will always be able to insert new records into
    // their transaction.
    transaction.adoptRecord(record);

    // `id` is a special property that may not be a `DS.attr`
    var id = properties.id;

    // If the passed properties do not include a primary key,
    // give the adapter an opportunity to generate one. Typically,
    // client-side ID generators will use something like uuid.js
    // to avoid conflicts.

    if (isNone(id)) {
      var adapter = this.adapterForType(type);

      if (adapter && adapter.generateIdForRecord) {
        id = coerceId(adapter.generateIdForRecord(this, record));
        properties.id = id;
      }
    }

    // Coerce ID to a string
    id = coerceId(id);

    // Create a new `clientId` and associate it with the
    // specified (or generated) `id`. Since we don't have
    // any data for the server yet (by definition), store
    // the sentinel value CREATED as the data for this
    // clientId. If we see this value later, we will skip
    // materialization.
    var reference = this.createReference(type, id);
    reference.data = CREATED;

    // Now that we have a reference, attach it to the record we
    // just created.
    set(record, '_reference', reference);
    reference.record = record;

    // Move the record out of its initial `empty` state into
    // the `loaded` state.
    record.loadedData();

    record.setupData();

    // Set the properties specified on the record.
    record.setProperties(properties);

    // Resolve record promise
    Ember.run(record, 'resolve', record);

    return record;
  },

  // .................
  // . DELETE RECORD .
  // .................

  /**
    For symmetry, a record can be deleted via the store.

    @method deleteRecord
    @param {DS.Model} record
  */
  deleteRecord: function(record) {
    record.deleteRecord();
  },

  /**
    For symmetry, a record can be unloaded via the store.

    @method unloadRecord
    @param {DS.Model} record
  */
  unloadRecord: function(record) {
    record.unloadRecord();
  },

  // ................
  // . FIND RECORDS .
  // ................

  /**
    This is the main entry point into finding records. The first parameter to
    this method is always a subclass of `DS.Model`.

    You can use the `find` method on a subclass of `DS.Model` directly if your
    application only has one store. For example, instead of
    `store.find(App.Person, 1)`, you could say `App.Person.find(1)`.

    ---

    To find a record by ID, pass the `id` as the second parameter:

        store.find(App.Person, 1);
        App.Person.find(1);

    If the record with that `id` had not previously been loaded, the store will
    return an empty record immediately and ask the adapter to find the data by
    calling the adapter's `find` method.

    The `find` method will always return the same object for a given type and
    `id`. To check whether the adapter has populated a record, you can check
    its `isLoaded` property.

    ---

    To find all records for a type, call `find` with no additional parameters:

        store.find(App.Person);
        App.Person.find();

    This will return a `RecordArray` representing all known records for the
    given type and kick off a request to the adapter's `findAll` method to load
    any additional records for the type.

    The `RecordArray` returned by `find()` is live. If any more records for the
    type are added at a later time through any mechanism, it will automatically
    update to reflect the change.

    ---

    To find a record by a query, call `find` with a hash as the second
    parameter:

        store.find(App.Person, { page: 1 });
        App.Person.find({ page: 1 });

    This will return a `RecordArray` immediately, but it will always be an
    empty `RecordArray` at first. It will call the adapter's `findQuery`
    method, which will populate the `RecordArray` once the server has returned
    results.

    You can check whether a query results `RecordArray` has loaded by checking
    its `isLoaded` property.

    @method find
    @param {DS.Model} type
    @param {Object|String|Integer|null} id
  */
  find: function(type, id) {
    type = this.modelFor(type);

    if (id === undefined) {
      return this.findAll(type);
    }

    // We are passed a query instead of an id.
    if (Ember.typeOf(id) === 'object') {
      return this.findQuery(type, id);
    }

    return this.findById(type, coerceId(id));
  },

  /**
    This method returns a record for a given type and id combination.

    If the store has never seen this combination of type and id before, it
    creates a new `clientId` with the LOADING sentinel and asks the adapter to
    load the data.

    If the store has seen the combination, this method delegates to
    `getByReference`.

    @method findById
    @private
    @param type
    @param id
  */
  findById: function(type, id) {
    var reference;

    if (this.hasReferenceForId(type, id)) {
      reference = this.referenceForId(type, id);

      if (reference.data !== UNLOADED) {
        return this.recordForReference(reference);
      }
    }

    if (!reference) {
      reference = this.createReference(type, id);
    }

    reference.data = LOADING;

    // create a new instance of the model type in the
    // 'isLoading' state
    var record = this.legacyMaterializeRecord(reference);

    if (reference.data === LOADING) {
      // let the adapter set the data, possibly async
      var adapter = this.adapterForType(type),
          store = this;

      Ember.assert("You tried to find a record but you have no adapter (for " + type + ")", adapter);
      Ember.assert("You tried to find a record but your adapter does not implement `find`", adapter.find);

      var thenable = adapter.find(this, type, id);

      if (thenable && thenable.then) {
        thenable.then(null /* for future use */, function(error) {
          store.recordWasError(record);
        });
      }
    }

    return record;
  },

  reloadRecord: function(record) {
    var type = record.constructor,
        adapter = this.adapterForType(type),
        store = this,
        id = get(record, 'id');

    Ember.assert("You cannot update a record without an ID", id);
    Ember.assert("You tried to update a record but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to update a record but your adapter does not implement `find`", adapter.find);

    var thenable = adapter.find(this, type, id);

    if (thenable && thenable.then) {
      thenable.then(null /* for future use */, function(error) {
        store.recordWasError(record);
      });
    }
  },

  /**
    This method returns a record for a given record reference.

    If no record for the reference has yet been materialized, this method will
    materialize a new `DS.Model` instance. This allows adapters to eagerly load
    large amounts of data into the store, and avoid incurring the cost of
    creating models until they are requested.

    In short, it's a convenient way to get a record for a known
    record reference, materializing it if necessary.

    @method recordForReference
    @private
    @param {Object} reference
    @returns {DS.Model}
  */
  recordForReference: function(reference) {
    var record = reference.record;

    if (!record) {
      // create a new instance of the model type in the
      // 'isLoading' state
      record = this.legacyMaterializeRecord(reference);
    }

    return record;
  },

  /**
    Given an array of `reference`s, determines which of those
    `clientId`s has not yet been loaded.

    In preparation for loading, this method also marks any unloaded
    `clientId`s as loading.

    @method unloadedReferences
    @private
    @param references
  */
  unloadedReferences: function(references) {
    var unloadedReferences = [];

    for (var i=0, l=references.length; i<l; i++) {
      var reference = references[i];

      if (reference instanceof DS.Model) {
        if (get(reference, 'isEmpty')) {
          unloadedReferences.push(reference);
        }

        continue;
      }

      if (reference.data === UNLOADED) {
        unloadedReferences.push(reference);
        reference.data = LOADING;
      }
    }

    return unloadedReferences;
  },

  /**
    This method is the entry point that relationships use to update
    themselves when their underlying data changes.

    First, it determines which of its `reference`s are still unloaded,
    then invokes `findMany` on the adapter.

    @method fetchUnloadedReferences
    @private
    @param references
    @param owner
  */
  fetchUnloadedReferences: function(references, owner) {
    var unloadedReferences = this.unloadedReferences(references);
    this.fetchMany(unloadedReferences, owner);
  },

  /**
    This method takes a list of `reference`s, groups the `reference`s by type,
    converts the `reference`s into IDs, and then invokes the adapter's `findMany`
    method.

    The `reference`s are grouped by type to invoke `findMany` on adapters
    for each unique type in `reference`s.

    It is used both by a brand new relationship (via the `findMany`
    method) or when the data underlying an existing relationship
    changes (via the `fetchUnloadedReferences` method).

    @method fetchMany
    @private
    @param references
    @param owner
  */
  fetchMany: function(references, owner) {
    if (!references.length) { return; }

    // Group By Type
    var referencesByTypeMap = Ember.MapWithDefault.create({
      defaultValue: function() { return Ember.A(); }
    });
    forEach(references, function(reference) {
      referencesByTypeMap.get(reference.type).push(reference);
    });

    forEach(referencesByTypeMap, function(type) {
      var references = referencesByTypeMap.get(type),
          ids = map(references, function(reference) { return reference.id; });

      var adapter = this.adapterForType(type);

      Ember.assert("You tried to load many records but you have no adapter (for " + type + ")", adapter);
      Ember.assert("You tried to load many records but your adapter does not implement `findMany`", adapter.findMany);

      adapter.findMany(this, type, ids, owner);
    }, this);
  },

  hasReferenceForId: function(type, id) {
    id = coerceId(id);

    return !!this.typeMapFor(type).idToReference[id];
  },

  referenceForId: function(type, id) {
    id = coerceId(id);

    // Check to see if we have seen this type/id pair before.
    var reference = this.typeMapFor(type).idToReference[id];

    // If not, create a reference for it but don't populate it
    // with any data yet.
    if (!reference) {
      reference = this.createReference(type, id);
      reference.data = UNLOADED;
    }

    return reference;
  },

  /**
    `findMany` is the entry point that relationships use to generate a
    new `ManyArray` for the list of IDs specified by the server for
    the relationship.

    Its responsibilities are:

    * convert the IDs into clientIds
    * determine which of the clientIds still need to be loaded
    * create a new ManyArray whose content is *all* of the clientIds
    * notify the ManyArray of the number of its elements that are
      already loaded
    * insert the unloaded references into the `loadingRecordArrays`
      bookkeeping structure, which will allow the `ManyArray` to know
      when all of its loading elements are loaded from the server.
    * ask the adapter to load the unloaded elements, by invoking
      findMany with the still-unloaded IDs.

    @method findMany
    @private
    @param type
    @param idsOrReferencesOrOpaque
    @param record
    @param relationship
  */
  findMany: function(type, idsOrReferencesOrOpaque, record, relationship) {
    // 1. Determine which of the client ids need to be loaded
    // 2. Create a new ManyArray whose content is ALL of the clientIds
    // 3. Decrement the ManyArray's counter by the number of loaded clientIds
    // 4. Put the ManyArray into our bookkeeping data structure, keyed on
    //    the needed clientIds
    // 5. Ask the adapter to load the records for the unloaded clientIds (but
    //    convert them back to ids)

    if (!Ember.isArray(idsOrReferencesOrOpaque)) {
      var adapter = this.adapterForType(type);

      if (adapter && adapter.findHasMany) {
        adapter.findHasMany(this, record, relationship, idsOrReferencesOrOpaque);
      } else if (!isNone(idsOrReferencesOrOpaque)) {
        Ember.assert("You tried to load many records but you have no adapter (for " + type + ")", adapter);
        Ember.assert("You tried to load many records but your adapter does not implement `findHasMany`", adapter.findHasMany);
      }

      return this.recordArrayManager.createManyArray(type, Ember.A());
    }

    // Coerce server IDs into Record Reference
    var references = map(idsOrReferencesOrOpaque, function(reference) {
      if (typeof reference !== 'object' && reference !== null && !(reference instanceof DS.Model)) {
        return this.referenceForId(type, reference);
      }

      return reference;
    }, this);

    var unloadedReferences = this.unloadedReferences(references),
        manyArray = this.recordArrayManager.createManyArray(type, Ember.A(references)),
        reference, i, l;

    // Start the decrementing counter on the ManyArray at the number of
    // records we need to load from the adapter
    manyArray.loadingRecordsCount(unloadedReferences.length);

    if (unloadedReferences.length) {
      for (i=0, l=unloadedReferences.length; i<l; i++) {
        reference = unloadedReferences[i];

        // keep track of the record arrays that a given loading record
        // is part of. This way, if the same record is in multiple
        // ManyArrays, all of their loading records counters will be
        // decremented when the adapter provides the data.
        this.recordArrayManager.registerWaitingRecordArray(manyArray, reference);
      }

      this.fetchMany(unloadedReferences, record);
    } else {
      // all requested records are available
      manyArray.set('isLoaded', true);

      Ember.run.once(function() {
        manyArray.trigger('didLoad');
      });
    }

    return manyArray;
  },

  /**
    This method delegates a query to the adapter. This is the one place where
    adapter-level semantics are exposed to the application.

    Exposing queries this way seems preferable to creating an abstract query
    language for all server-side queries, and then require all adapters to
    implement them.

    @method findQuery
    @private
    @param {Class} type
    @param {Object} query an opaque query to be used by the adapter
    @return {DS.AdapterPopulatedRecordArray}
  */
  findQuery: function(type, query) {
    var array = DS.AdapterPopulatedRecordArray.create({
      type: type,
      query: query,
      content: Ember.A(),
      store: this
    });

    var adapter = this.adapterForType(type);

    Ember.assert("You tried to load a query but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to load a query but your adapter does not implement `findQuery`", adapter.findQuery);

    adapter.findQuery(this, type, query, array);

    return array;
  },

  /**
    This method returns an array of all records adapter can find.
    It triggers the adapter's `findAll` method to give it an opportunity to populate
    the array with records of that type.

    @method findAll
    @private
    @param {Class} type
    @return {DS.AdapterPopulatedRecordArray}
  */
  findAll: function(type) {
    return this.fetchAll(type, this.all(type));
  },

  /**
    @method fetchAll
    @private
    @param type
    @param array
  */
  fetchAll: function(type, array) {
    var adapter = this.adapterForType(type),
        sinceToken = this.typeMapFor(type).metadata.since;

    set(array, 'isUpdating', true);

    Ember.assert("You tried to load all records but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to load all records but your adapter does not implement `findAll`", adapter.findAll);

    adapter.findAll(this, type, sinceToken);

    return array;
  },

  /**
    @method metaForType
    @param type
    @param property
    @param data
  */
  metaForType: function(type, property, data) {
    var target = this.typeMapFor(type).metadata;
    set(target, property, data);
  },

  /**
    @method didUpdateAll
    @param type
  */
  didUpdateAll: function(type) {
    var findAllCache = this.typeMapFor(type).findAllCache;
    set(findAllCache, 'isUpdating', false);
  },

  /**
    This method returns a filtered array that contains all of the known records
    for a given type.

    Note that because it's just a filter, it will have any locally
    created records of the type.

    Also note that multiple calls to `all` for a given type will always
    return the same RecordArray.

    @method all
    @param {Class} type
    @return {DS.RecordArray}
  */
  all: function(type) {
    var typeMap = this.typeMapFor(type),
        findAllCache = typeMap.findAllCache;

    if (findAllCache) { return findAllCache; }

    var array = DS.RecordArray.create({
      type: type,
      content: Ember.A(),
      store: this,
      isLoaded: true
    });

    this.recordArrayManager.registerFilteredRecordArray(array, type);

    typeMap.findAllCache = array;
    return array;
  },

  /**
    Takes a type and filter function, and returns a live RecordArray that
    remains up to date as new records are loaded into the store or created
    locally.

    The callback function takes a materialized record, and returns true
    if the record should be included in the filter and false if it should
    not.

    The filter function is called once on all records for the type when
    it is created, and then once on each newly loaded or created record.

    If any of a record's properties change, or if it changes state, the
    filter function will be invoked again to determine whether it should
    still be in the array.

    Note that the existence of a filter on a type will trigger immediate
    materialization of all loaded data for a given type, so you might
    not want to use filters for a type if you are loading many records
    into the store, many of which are not active at any given time.

    In this scenario, you might want to consider filtering the raw
    data before loading it into the store.

    @method filter
    @param {Class} type
    @param {Function} filter
    @return {DS.FilteredRecordArray}
  */
  filter: function(type, query, filter) {
    // allow an optional server query
    if (arguments.length === 3) {
      this.findQuery(type, query);
    } else if (arguments.length === 2) {
      filter = query;
    }

    var array = DS.FilteredRecordArray.create({
      type: type,
      content: Ember.A(),
      store: this,
      manager: this.recordArrayManager,
      filterFunction: filter
    });

    this.recordArrayManager.registerFilteredRecordArray(array, type, filter);

    return array;
  },

  /**
    This method returns if a certain record is already loaded
    in the store. Use this function to know beforehand if a find()
    will result in a request or that it will be a cache hit.

    @method recordIsLoaded
    @param {Class} type
    @param {string} id
    @return {boolean}
  */
  recordIsLoaded: function(type, id) {
    if (!this.hasReferenceForId(type, id)) { return false; }
    return typeof this.referenceForId(type, id).data === 'object';
  },

  // ............
  // . UPDATING .
  // ............

  /**
    If the adapter updates attributes or acknowledges creation
    or deletion, the record will notify the store to update its
    membership in any filters.

    To avoid thrashing, this method is invoked only once per
    run loop per record.

    @method dataWasUpdated
    @private
    @param {Class} type
    @param {Number|String} clientId
    @param {DS.Model} record
  */
  dataWasUpdated: function(type, reference, record) {
    // Because data updates are invoked at the end of the run loop,
    // it is possible that a record might be deleted after its data
    // has been modified and this method was scheduled to be called.
    //
    // If that's the case, the record would have already been removed
    // from all record arrays; calling updateRecordArrays would just
    // add it back. If the record is deleted, just bail. It shouldn't
    // give us any more trouble after this.

    if (get(record, 'isDeleted')) { return; }

    if (typeof reference.data === "object") {
      this.recordArrayManager.referenceDidChange(reference);
    }
  },

  // ..............
  // . PERSISTING .
  // ..............

  /**
    This method delegates saving to the store's implicit
    transaction.

    Calling this method is essentially a request to persist
    any changes to records that were not explicitly added to
    a transaction.

    @method save
  */
  save: function() {
    once(this, 'commitDefaultTransaction');
  },
  commit: Ember.aliasMethod('save'),

  commitDefaultTransaction: function() {
    get(this, 'defaultTransaction').commit();
  },

  scheduleSave: function(record) {
    get(this, 'currentTransaction').add(record);
    once(this, 'flushSavedRecords');
  },

  flushSavedRecords: function() {
    get(this, 'currentTransaction').commit();
    set(this, 'currentTransaction', this.transaction());
  },

  /**
    Adapters should call this method if they would like to acknowledge
    that all changes related to a record (other than relationship
    changes) have persisted.

    Because relationship changes affect multiple records, the adapter
    is responsible for acknowledging the change to the relationship
    directly (using `store.didUpdateRelationship`) when all aspects
    of the relationship change have persisted.

    It can be called for created, deleted or updated records.

    If the adapter supplies new data, that data will become the new
    canonical data for the record. That will result in blowing away
    all local changes and rematerializing the record with the new
    data (the "sledgehammer" approach).

    Alternatively, if the adapter does not supply new data, the record
    will collapse all local changes into its saved data. Subsequent
    rollbacks of the record will roll back to this point.

    If an adapter is acknowledging receipt of a newly created record
    that did not generate an id in the client, it *must* either
    provide data or explicitly invoke `store.didReceiveId` with
    the server-provided id.

    Note that an adapter may not supply new data when acknowledging
    a deleted record.

    @method didSaveRecord
    @param {DS.Model} record the in-flight record
    @param {Object} data optional data (see above)
  */
  didSaveRecord: function(record, data) {
    if (data) {
      this.updateId(record, data);
      this.updateRecordData(record, data);
    } else {
      this.didUpdateAttributes(record);
    }

    record.adapterDidCommit();
  },

  /**
    For convenience, if an adapter is performing a bulk commit, it can also
    acknowledge all of the records at once.

    If the adapter supplies an array of data, they must be in the same order as
    the array of records passed in as the first parameter.

    @method didSaveRecords
    @param {#forEach} list a list of records whose changes the
      adapter is acknowledging. You can pass any object that
      has an ES5-like `forEach` method, including the
      `OrderedSet` objects passed into the adapter at commit
      time.
    @param {Array[Object]} dataList an Array of data. This
      parameter must be an integer-indexed Array-like.
  */
  didSaveRecords: function(list, dataList) {
    var i = 0;
    forEach(list, function(record) {
      this.didSaveRecord(record, dataList && dataList[i++]);
    }, this);
  },

  /**
    This method allows the adapter to specify that a record
    could not be saved because it had backend-supplied validation
    errors.

    The errors object must have keys that correspond to the
    attribute names. Once each of the specified attributes have
    changed, the record will automatically move out of the
    invalid state and be ready to commit again.

    TODO: We should probably automate the process of converting
    server names to attribute names using the existing serializer
    infrastructure.

    @method recordWasInvalid
    @param {DS.Model} record
    @param {Object} errors
  */
  recordWasInvalid: function(record, errors) {
    record.adapterDidInvalidate(errors);
  },

  /**
    This method allows the adapter to specify that a record
    could not be saved because the server returned an unhandled
    error.

    @method recordWasError
    @param {DS.Model} record
  */
  recordWasError: function(record) {
    record.adapterDidError();
  },

  /**
    This is a lower-level API than `didSaveRecord` that allows an
    adapter to acknowledge the persistence of a single attribute.

    This is useful if an adapter needs to make multiple asynchronous
    calls to fully persist a record. The record will keep track of
    which attributes and relationships are still outstanding and
    automatically move into the `saved` state once the adapter has
    acknowledged everything.

    If a value is provided, it clobbers the locally specified value.
    Otherwise, the local value becomes the record's last known
    saved value (which is used when rolling back a record).

    Note that the specified attributeName is the normalized name
    specified in the definition of the `DS.Model`, not a key in
    the server-provided data.

    Also note that the adapter is responsible for performing any
    transformations on the value using the serializer API.

    @method didUpdateAttribute
    @param {DS.Model} record
    @param {String} attributeName
    @param {Object} value
  */
  didUpdateAttribute: function(record, attributeName, value) {
    record.adapterDidUpdateAttribute(attributeName, value);
  },

  /**
    This method allows an adapter to acknowledge persistence
    of all attributes of a record but not relationships or
    other factors.

    It loops through the record's defined attributes and
    notifies the record that they are all acknowledged.

    This method does not take optional values, because
    the adapter is unlikely to have a hash of normalized
    keys and transformed values, and instead of building
    one up, it should just call `didUpdateAttribute` as
    needed.

    This method is intended as a middle-ground between
    `didSaveRecord`, which acknowledges all changes to
    a record, and `didUpdateAttribute`, which allows an
    adapter fine-grained control over updates.

    @method didUpdateAttributes
    @param {DS.Model} record
  */
  didUpdateAttributes: function(record) {
    record.eachAttribute(function(attributeName) {
      this.didUpdateAttribute(record, attributeName);
    }, this);
  },

  /**
    This allows an adapter to acknowledge that it has saved all
    necessary aspects of a relationship change.

    This is separated from acknowledging the record itself
    (via `didSaveRecord`) because a relationship change can
    involve as many as three separate records. Records should
    only move out of the in-flight state once the server has
    acknowledged all of their relationships, and this differs
    based upon the adapter's semantics.

    There are three basic scenarios by which an adapter can
    save a relationship.

    ### Foreign Key

    An adapter can save all relationship changes by updating
    a foreign key on the child record. If it does this, it
    should acknowledge the changes when the child record is
    saved.

        record.eachRelationship(function(name, meta) {
          if (meta.kind === 'belongsTo') {
            store.didUpdateRelationship(record, name);
          }
        });

        store.didSaveRecord(record, data);

    ### Embedded in Parent

    An adapter can save one-to-many relationships by embedding
    IDs (or records) in the parent object. In this case, the
    relationship is not considered acknowledged until both the
    old parent and new parent have acknowledged the change.

    In this case, the adapter should keep track of the old
    parent and new parent, and acknowledge the relationship
    change once both have acknowledged. If one of the two
    sides does not exist (e.g. the new parent does not exist
    because of nulling out the belongs-to relationship),
    the adapter should acknowledge the relationship once
    the other side has acknowledged.

    ### Separate Entity

    An adapter can save relationships as separate entities
    on the server. In this case, they should acknowledge
    the relationship as saved once the server has
    acknowledged the entity.

    @method didUpdateRelationship
    @param {DS.Model} record
    @param {DS.Model} relationshipName
  */
  didUpdateRelationship: function(record, relationshipName) {
    var clientId = get(record, '_reference').clientId;

    var relationship = this.relationshipChangeFor(clientId, relationshipName);
    //TODO(Igor)
    if (relationship) { relationship.adapterDidUpdate(); }
  },

  /**
    This allows an adapter to acknowledge all relationship changes
    for a given record.

    Like `didUpdateAttributes`, this is intended as a middle ground
    between `didSaveRecord` and fine-grained control via the
    `didUpdateRelationship` API.

    @method didUpdateRelationships
    @param record
  */
  didUpdateRelationships: function(record) {
    var changes = this.relationshipChangesFor(get(record, '_reference'));

    for (var name in changes) {
      if (!changes.hasOwnProperty(name)) { continue; }
      changes[name].adapterDidUpdate();
    }
  },

  /**
    When acknowledging the creation of a locally created record,
    adapters must supply an id (if they did not implement
    `generateIdForRecord` to generate an id locally).

    If an adapter does not use `didSaveRecord` and supply a hash
    (for example, if it needs to make multiple HTTP requests to
    create and then update the record), it will need to invoke
    `didReceiveId` with the backend-supplied id.

    When not using `didSaveRecord`, an adapter will need to
    invoke:

    * didReceiveId (unless the id was generated locally)
    * didCreateRecord
    * didUpdateAttribute(s)
    * didUpdateRelationship(s)

    @method didReceiveId
    @param {DS.Model} record
    @param {Number|String} id
  */
  didReceiveId: function(record, id) {
    var typeMap = this.typeMapFor(record.constructor),
        clientId = get(record, 'clientId'),
        oldId = get(record, 'id');

    Ember.assert("An adapter cannot assign a new id to a record that already has an id. " + record + " had id: " + oldId + " and you tried to update it with " + id + ". This likely happened because your server returned data in response to a find or update that had a different id than the one you sent.", oldId === undefined || id === oldId);

    typeMap.idToCid[id] = clientId;
    this.clientIdToId[clientId] = id;
  },

  /**
    This method re-indexes the data by its clientId in the store
    and then notifies the record that it should rematerialize
    itself.

    @method updateRecordData
    @private
    @param {DS.Model} record
    @param {Object} data
  */
  updateRecordData: function(record, data) {
    get(record, '_reference').data = data;
    record.didChangeData();
  },

  /**
    If an adapter invokes `didSaveRecord` with data, this method
    extracts the id from the supplied data (using the adapter's
    `extractId()` method) and indexes the clientId with that id.

    @method updateId
    @private
    @param {DS.Model} record
    @param {Object} data
  */
  updateId: function(record, data) {
    var type = record.constructor,
        typeMap = this.typeMapFor(type),
        reference = get(record, '_reference'),
        oldId = get(record, 'id'),
        id = this.preprocessData(type, data);

    Ember.assert("An adapter cannot assign a new id to a record that already has an id. " + record + " had id: " + oldId + " and you tried to update it with " + id + ". This likely happened because your server returned data in response to a find or update that had a different id than the one you sent.", oldId === null || id === oldId);

    typeMap.idToReference[id] = reference;
    reference.id = id;
  },

  /**
    This method receives opaque data provided by the adapter and
    preprocesses it, returning an ID.

    The actual preprocessing takes place in the adapter. If you would
    like to change the default behavior, you should override the
    appropriate hooks in `DS.Serializer`.

    @method preprocessData
    @private
    @param type
    @param data
    @return {String} id the id represented by the data
  */
  preprocessData: function(type, data) {
    return this.adapterForType(type).extractId(type, data);
  },

  /**
    Returns a map of IDs to client IDs for a given type.

    @method typeMapFor
    @private
    @param type
  */
  typeMapFor: function(type) {
    var typeMaps = get(this, 'typeMaps'),
        guid = Ember.guidFor(type),
        typeMap;

    typeMap = typeMaps[guid];

    if (typeMap) { return typeMap; }

    typeMap = {
      idToReference: {},
      references: [],
      metadata: {}
    };

    typeMaps[guid] = typeMap;

    return typeMap;
  },

  // ................
  // . LOADING DATA .
  // ................

  /**
    Load new data into the store for a given id and type combination.
    If data for that record had been loaded previously, the new information
    overwrites the old.

    If the record you are loading data for has outstanding changes that have not
    yet been saved, an exception will be thrown.

    @method load
    @param {DS.Model} type
    @param data
    @param prematerialized
  */
  load: function(type, data, prematerialized) {
    var id;

    if (typeof data === 'number' || typeof data === 'string') {
      id = data;
      data = prematerialized;
      prematerialized = null;
    }

    if (prematerialized && prematerialized.id) {
      id = prematerialized.id;
    } else if (id === undefined) {
      id = this.preprocessData(type, data);
    }

    id = coerceId(id);

    var reference = this.referenceForId(type, id);

    if (reference.record) {
      once(reference.record, 'loadedData');
    }

    reference.data = data;
    reference.prematerialized = prematerialized;

    this.recordArrayManager.referenceDidChange(reference);

    return reference;
  },

  newLoad: function(type, data) {
    var id = coerceId(data.id),
        reference = this.referenceForId(type, id);

    reference.data = MATERIALIZED;

    if (reference.record) { reference.record.setupData(data); }

    this.recordArrayManager.referenceDidChange(reference);

    return reference;
  },

  modelFor: function(key) {
    if (typeof key !== 'string') {
      return key;
    }

    var factory = this.container.lookupFactory('model:'+key);
    factory.store = this;

    return factory;
  },

  push: function(type, data) {
    var serializer = this.serializerFor(type);
    type = this.modelFor(type);

    data = serializer.deserialize(type, data);

    this.newLoad(type, data);

    var reference = this.referenceForId(type, data.id),
        record = reference.record;

    if (record) {
      return record;
    } else {
      return this.materializeRecord(reference, data);
    }
  },

  recordFor: function(type, id) {
    type = this.modelFor(type);

    var reference = this.referenceForId(type, id);
    if (reference.record) { return reference.record; }

    return this.materializeRecord(reference);
  },

  loadMany: function(type, ids, dataList) {
    if (dataList === undefined) {
      dataList = ids;
      ids = map(dataList, function(data) {
        return this.preprocessData(type, data);
      }, this);
    }

    return map(ids, function(id, i) {
      return this.load(type, id, dataList[i]);
    }, this);
  },

  loadHasMany: function(record, key, ids) {
    //It looks sad to have to do the conversion in the store
    var type = record.get(key + '.type'),
        tuples = map(ids, function(id) {
          return {id: id, type: type};
        });
    record.materializeHasMany(key, tuples);

    // Update any existing many arrays that use the previous IDs,
    // if necessary.
    record.hasManyDidChange(key);

    var relationship = record.cacheFor(key);

    // TODO (tomdale) this assumes that loadHasMany *always* means
    // that the records for the provided IDs are loaded.
    if (relationship) {
      set(relationship, 'isLoaded', true);
      relationship.trigger('didLoad');
    }
  },

  /**
    Creates a new reference for a given type & ID pair. Metadata about the
    record can be stored in the reference without having to create a full-blown
    DS.Model instance.

    @method createReference
    @private
    @param {DS.Model} type
    @param {String|Number} id
    @returns {Reference}
  */
  createReference: function(type, id) {
    var typeMap = this.typeMapFor(type),
        idToReference = typeMap.idToReference;

    Ember.assert('The id ' + id + ' has already been used with another record of type ' + type.toString() + '.', !id || !idToReference[id]);

    var reference = {
      id: id,
      clientId: this.clientIdCounter++,
      type: type
    };

    // if we're creating an item, this process will be done
    // later, once the object has been persisted.
    if (id) {
      idToReference[id] = reference;
    }

    typeMap.references.push(reference);

    return reference;
  },

  // ..........................
  // . RECORD MATERIALIZATION .
  // ..........................

  materializeRecord: function(reference, data) {
    var record = reference.type._create({
      id: reference.id,
      store: this,
      _reference: reference
    });

    reference.record = record;

    get(this, 'defaultTransaction').adoptRecord(record);

    if (data) {
      record.setupData(data);
    }

    return record;
  },

  legacyMaterializeRecord: function(reference) {
    var record = reference.type._create({
      id: reference.id,
      store: this,
      _reference: reference
    });

    reference.record = record;

    get(this, 'defaultTransaction').adoptRecord(record);

    record.loadingData();

    if (typeof reference.data === 'object') {
      record.loadedData();
    }

    return record;
  },

  dematerializeRecord: function(record) {
    var reference = get(record, '_reference'),
        type = reference.type,
        id = reference.id,
        typeMap = this.typeMapFor(type);

    record.updateRecordArrays();

    if (id) { delete typeMap.idToReference[id]; }

    var loc = indexOf(typeMap.references, reference);
    typeMap.references.splice(loc, 1);
  },

  willDestroy: function() {
    if (get(DS, 'defaultStore') === this) {
      set(DS, 'defaultStore', null);
    }
  },

  // ........................
  // . RELATIONSHIP CHANGES .
  // ........................

  addRelationshipChangeFor: function(clientReference, childKey, parentReference, parentKey, change) {
    var clientId = clientReference.clientId,
        parentClientId = parentReference ? parentReference.clientId : parentReference;
    var key = childKey + parentKey;
    var changes = this.relationshipChanges;
    if (!(clientId in changes)) {
      changes[clientId] = {};
    }
    if (!(parentClientId in changes[clientId])) {
      changes[clientId][parentClientId] = {};
    }
    if (!(key in changes[clientId][parentClientId])) {
      changes[clientId][parentClientId][key] = {};
    }
    changes[clientId][parentClientId][key][change.changeType] = change;
  },

  removeRelationshipChangeFor: function(clientReference, childKey, parentReference, parentKey, type) {
    var clientId = clientReference.clientId,
        parentClientId = parentReference ? parentReference.clientId : parentReference;
    var changes = this.relationshipChanges;
    var key = childKey + parentKey;
    if (!(clientId in changes) || !(parentClientId in changes[clientId]) || !(key in changes[clientId][parentClientId])){
      return;
    }
    delete changes[clientId][parentClientId][key][type];
  },

  relationshipChangeFor: function(clientReference, childKey, parentReference, parentKey, type) {
    var clientId = clientReference.clientId,
        parentClientId = parentReference ? parentReference.clientId : parentReference;
    var changes = this.relationshipChanges;
    var key = childKey + parentKey;
    if (!(clientId in changes) || !(parentClientId in changes[clientId])){
      return;
    }
    if(type){
      return changes[clientId][parentClientId][key][type];
    }
    else{
      //TODO(Igor) what if both present
      return changes[clientId][parentClientId][key]["add"] || changes[clientId][parentClientId][key]["remove"];
    }
  },

  relationshipChangePairsFor: function(reference){
    var toReturn = [];

    if( !reference ) { return toReturn; }

    //TODO(Igor) What about the other side
    var changesObject = this.relationshipChanges[reference.clientId];
    for (var objKey in changesObject){
      if(changesObject.hasOwnProperty(objKey)){
        for (var changeKey in changesObject[objKey]){
          if(changesObject[objKey].hasOwnProperty(changeKey)){
            toReturn.push(changesObject[objKey][changeKey]);
          }
        }
      }
    }
    return toReturn;
  },

  relationshipChangesFor: function(reference) {
    var toReturn = [];

    if( !reference ) { return toReturn; }

    var relationshipPairs = this.relationshipChangePairsFor(reference);
    forEach(relationshipPairs, function(pair){
      var addedChange = pair["add"];
      var removedChange = pair["remove"];
      if(addedChange){
        toReturn.push(addedChange);
      }
      if(removedChange){
        toReturn.push(removedChange);
      }
    });
    return toReturn;
  },
  // ......................
  // . PER-TYPE ADAPTERS
  // ......................

  adapterForType: function(type) {
    this._adaptersMap = this.createInstanceMapFor('adapters');

    var adapter = this._adaptersMap.get(type);
    if (adapter) { return adapter; }

    return this.get('_adapter');
  },

  // ..............................
  // . RECORD CHANGE NOTIFICATION .
  // ..............................

  recordAttributeDidChange: function(reference, attributeName, newValue, oldValue) {
    var record = reference.record,
        dirtySet = new Ember.OrderedSet(),
        adapter = this.adapterForType(record.constructor);

    if (adapter.dirtyRecordsForAttributeChange) {
      adapter.dirtyRecordsForAttributeChange(dirtySet, record, attributeName, newValue, oldValue);
    }

    dirtySet.forEach(function(record) {
      record.adapterDidDirty();
    });
  },

  recordBelongsToDidChange: function(dirtySet, child, relationship) {
    var adapter = this.adapterForType(child.constructor);

    if (adapter.dirtyRecordsForBelongsToChange) {
      adapter.dirtyRecordsForBelongsToChange(dirtySet, child, relationship);
    }

    // adapterDidDirty is called by the RelationshipChange that created
    // the dirtySet.
  },

  recordHasManyDidChange: function(dirtySet, parent, relationship) {
    var adapter = this.adapterForType(parent.constructor);

    if (adapter.dirtyRecordsForHasManyChange) {
      adapter.dirtyRecordsForHasManyChange(dirtySet, parent, relationship);
    }

    // adapterDidDirty is called by the RelationshipChange that created
    // the dirtySet.
  },

  /**
    Returns an instance of the serializer for a given type. For
    example, `serializerFor('person')` will return an instance of
    `App.PersonSerializer`.

    If no `App.PersonSerializer` is found, this method will look
    for an `App.ApplicationSerializer` (the default serializer for
    your entire application).

    If no `App.ApplicationSerializer` is found, it will fall back
    to an instance of `DS.JSONSerializer`.

    @method serializerFor
    @param {String} type the record to serialize
  */
  serializerFor: function(type) {
    var container = this.container;

    return container.lookup('serializer:'+type) ||
           container.lookup('serializer:application') ||
           container.lookup('serializer:_default');
  }
});

DS.Store.reopenClass({
  registerAdapter: DS._Mappable.generateMapFunctionFor('adapters', function(type, adapter, map) {
    map.set(type, adapter);
  }),

  transformMapKey: function(key) {
    if (typeof key === 'string') {
      var transformedKey;
      transformedKey = get(Ember.lookup, key);
      Ember.assert("Could not find model at path " + key, transformedKey);
      return transformedKey;
    } else {
      return key;
    }
  },

  transformMapValue: function(key, value) {
    if (Ember.Object.detect(value)) {
      return value.create();
    }

    return value;
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set,
    once = Ember.run.once, arrayMap = Ember.ArrayPolyfills.map;

/*
  WARNING: Much of these docs are inaccurate as of bf8497.

  This file encapsulates the various states that a record can transition
  through during its lifecycle.

  ### State Manager

  A record's state manager explicitly tracks what state a record is in
  at any given time. For instance, if a record is newly created and has
  not yet been sent to the adapter to be saved, it would be in the
  `created.uncommitted` state.  If a record has had local modifications
  made to it that are in the process of being saved, the record would be
  in the `updated.inFlight` state. (These state paths will be explained
  in more detail below.)

  Events are sent by the record or its store to the record's state manager.
  How the state manager reacts to these events is dependent on which state
  it is in. In some states, certain events will be invalid and will cause
  an exception to be raised.

  States are hierarchical. For example, a record can be in the
  `deleted.start` state, then transition into the `deleted.inFlight` state.
  If a child state does not implement an event handler, the state manager
  will attempt to invoke the event on all parent states until the root state is
  reached. The state hierarchy of a record is described in terms of a path
  string. You can determine a record's current state by getting its manager's
  current state path:

      record.get('stateManager.currentPath');
      //=> "created.uncommitted"

  The `DS.Model` states are themselves stateless. What we mean is that,
  though each instance of a record also has a unique instance of a
  `DS.StateManager`, the hierarchical states that each of *those* points
  to is a shared data structure. For performance reasons, instead of each
  record getting its own copy of the hierarchy of states, each state
  manager points to this global, immutable shared instance. How does a
  state know which record it should be acting on?  We pass a reference to
  the current state manager as the first parameter to every method invoked
  on a state.

  The state manager passed as the first parameter is where you should stash
  state about the record if needed; you should never store data on the state
  object itself. If you need access to the record being acted on, you can
  retrieve the state manager's `record` property. For example, if you had
  an event handler `myEvent`:

      myEvent: function(manager) {
        var record = manager.get('record');
        record.doSomething();
      }

  For more information about state managers in general, see the Ember.js
  documentation on `Ember.StateManager`.

  ### Events, Flags, and Transitions

  A state may implement zero or more events, flags, or transitions.

  #### Events

  Events are named functions that are invoked when sent to a record. The
  state manager will first look for a method with the given name on the
  current state. If no method is found, it will search the current state's
  parent, and then its grandparent, and so on until reaching the top of
  the hierarchy. If the root is reached without an event handler being found,
  an exception will be raised. This can be very helpful when debugging new
  features.

  Here's an example implementation of a state with a `myEvent` event handler:

      aState: DS.State.create({
        myEvent: function(manager, param) {
          console.log("Received myEvent with "+param);
        }
      })

  To trigger this event:

      record.send('myEvent', 'foo');
      //=> "Received myEvent with foo"

  Note that an optional parameter can be sent to a record's `send()` method,
  which will be passed as the second parameter to the event handler.

  Events should transition to a different state if appropriate. This can be
  done by calling the state manager's `transitionTo()` method with a path to the
  desired state. The state manager will attempt to resolve the state path
  relative to the current state. If no state is found at that path, it will
  attempt to resolve it relative to the current state's parent, and then its
  parent, and so on until the root is reached. For example, imagine a hierarchy
  like this:

      * created
        * start <-- currentState
        * inFlight
      * updated
        * inFlight

  If we are currently in the `start` state, calling
  `transitionTo('inFlight')` would transition to the `created.inFlight` state,
  while calling `transitionTo('updated.inFlight')` would transition to
  the `updated.inFlight` state.

  Remember that *only events* should ever cause a state transition. You should
  never call `transitionTo()` from outside a state's event handler. If you are
  tempted to do so, create a new event and send that to the state manager.

  #### Flags

  Flags are Boolean values that can be used to introspect a record's current
  state in a more user-friendly way than examining its state path. For example,
  instead of doing this:

      var statePath = record.get('stateManager.currentPath');
      if (statePath === 'created.inFlight') {
        doSomething();
      }

  You can say:

      if (record.get('isNew') && record.get('isSaving')) {
        doSomething();
      }

  If your state does not set a value for a given flag, the value will
  be inherited from its parent (or the first place in the state hierarchy
  where it is defined).

  The current set of flags are defined below. If you want to add a new flag,
  in addition to the area below, you will also need to declare it in the
  `DS.Model` class.

  #### Transitions

  Transitions are like event handlers but are called automatically upon
  entering or exiting a state. To implement a transition, just call a method
  either `enter` or `exit`:

      myState: DS.State.create({
        // Gets called automatically when entering
        // this state.
        enter: function(manager) {
          console.log("Entered myState");
        }
      })

  Note that enter and exit events are called once per transition. If the
  current state changes, but changes to another child state of the parent,
  the transition event on the parent will not be triggered.
*/

var hasDefinedProperties = function(object) {
  // Ignore internal property defined by simulated `Ember.create`.
  var names = Ember.keys(object);
  var i, l, name;
  for (i = 0, l = names.length; i < l; i++ ) {
    name = names[i];
    if (object.hasOwnProperty(name) && object[name]) { return true; }
  }

  return false;
};

var didChangeData = function(record) {
  record.materializeData();
};

var willSetProperty = function(record, context) {
  context.oldValue = get(record, context.name);

  var change = DS.AttributeChange.createChange(context);
  record._changesToSync[context.name] = change;
};

var didSetProperty = function(record, context) {
  var change = record._changesToSync[context.name];
  change.value = get(record, context.name);
  change.sync();
};


// Implementation notes:
//
// Each state has a boolean value for all of the following flags:
//
// * isLoaded: The record has a populated `data` property. When a
//   record is loaded via `store.find`, `isLoaded` is false
//   until the adapter sets it. When a record is created locally,
//   its `isLoaded` property is always true.
// * isDirty: The record has local changes that have not yet been
//   saved by the adapter. This includes records that have been
//   created (but not yet saved) or deleted.
// * isSaving: The record's transaction has been committed, but
//   the adapter has not yet acknowledged that the changes have
//   been persisted to the backend.
// * isDeleted: The record was marked for deletion. When `isDeleted`
//   is true and `isDirty` is true, the record is deleted locally
//   but the deletion was not yet persisted. When `isSaving` is
//   true, the change is in-flight. When both `isDirty` and
//   `isSaving` are false, the change has persisted.
// * isError: The adapter reported that it was unable to save
//   local changes to the backend. This may also result in the
//   record having its `isValid` property become false if the
//   adapter reported that server-side validations failed.
// * isNew: The record was created on the client and the adapter
//   did not yet report that it was successfully saved.
// * isValid: No client-side validations have failed and the
//   adapter did not report any server-side validation failures.

// The dirty state is a abstract state whose functionality is
// shared between the `created` and `updated` states.
//
// The deleted state shares the `isDirty` flag with the
// subclasses of `DirtyState`, but with a very different
// implementation.
//
// Dirty states have three child states:
//
// `uncommitted`: the store has not yet handed off the record
//   to be saved.
// `inFlight`: the store has handed off the record to be saved,
//   but the adapter has not yet acknowledged success.
// `invalid`: the record has invalid information and cannot be
//   send to the adapter yet.
var DirtyState = {
  initialState: 'uncommitted',

  // FLAGS
  isDirty: true,

  // SUBSTATES

  // When a record first becomes dirty, it is `uncommitted`.
  // This means that there are local pending changes, but they
  // have not yet begun to be saved, and are not invalid.
  uncommitted: {

    // EVENTS
    willSetProperty: willSetProperty,
    didSetProperty: didSetProperty,

    becomeDirty: Ember.K,

    willCommit: function(record) {
      record.transitionTo('inFlight');
    },

    becameClean: function(record) {
      record.withTransaction(function(t) {
        t.remove(record);
      });

      record.transitionTo('loaded.materializing');
    },

    becameInvalid: function(record) {
      record.transitionTo('invalid');
    },

    rollback: function(record) {
      record.rollback();
    }
  },

  // Once a record has been handed off to the adapter to be
  // saved, it is in the 'in flight' state. Changes to the
  // record cannot be made during this window.
  inFlight: {
    // FLAGS
    isSaving: true,

    // TRANSITIONS
    enter: function(record) {
      record.becameInFlight();
    },

    // EVENTS

    materializingData: function(record) {
      set(record, 'lastDirtyType', get(this, 'dirtyType'));
      record.transitionTo('materializing');
    },

    didCommit: function(record) {
      var dirtyType = get(this, 'dirtyType');

      record.withTransaction(function(t) {
        t.remove(record);
      });

      record.transitionTo('saved');
      record.send('invokeLifecycleCallbacks', dirtyType);
    },

    didChangeData: didChangeData,

    becameInvalid: function(record, errors) {
      set(record, 'errors', errors);

      record.transitionTo('invalid');
      record.send('invokeLifecycleCallbacks');
    },

    becameError: function(record) {
      record.transitionTo('error');
      record.send('invokeLifecycleCallbacks');
    }
  },

  // A record is in the `invalid` state when its client-side
  // invalidations have failed, or if the adapter has indicated
  // the the record failed server-side invalidations.
  invalid: {
    // FLAGS
    isValid: false,

    exit: function(record) {
       record.withTransaction(function (t) {
         t.remove(record);
       });
     },

    // EVENTS
    deleteRecord: function(record) {
      record.transitionTo('deleted.uncommitted');
      record.clearRelationships();
    },

    willSetProperty: willSetProperty,

    didSetProperty: function(record, context) {
      var errors = get(record, 'errors'),
          key = context.name;

      set(errors, key, null);

      if (!hasDefinedProperties(errors)) {
        record.send('becameValid');
      }

      didSetProperty(record, context);
    },

    becomeDirty: Ember.K,

    rollback: function(record) {
      record.send('becameValid');
      record.send('rollback');
    },

    becameValid: function(record) {
      record.transitionTo('uncommitted');
    },

    invokeLifecycleCallbacks: function(record) {
      record.trigger('becameInvalid', record);
    }
  }
};

// The created and updated states are created outside the state
// chart so we can reopen their substates and add mixins as
// necessary.

function deepClone(object) {
  var clone = {}, value;

  for (var prop in object) {
    value = object[prop];
    if (value && typeof value === 'object') {
      clone[prop] = deepClone(value);
    } else {
      clone[prop] = value;
    }
  }

  return clone;
}

function mixin(original, hash) {
  for (var prop in hash) {
    original[prop] = hash[prop];
  }

  return original;
}

function dirtyState(options) {
  var newState = deepClone(DirtyState);
  return mixin(newState, options);
}

var createdState = dirtyState({
  dirtyType: 'created',

  // FLAGS
  isNew: true
});

var updatedState = dirtyState({
  dirtyType: 'updated'
});

createdState.uncommitted.deleteRecord = function(record) {
  record.clearRelationships();
  record.transitionTo('deleted.saved');
};

createdState.uncommitted.rollback = function(record) {
  DirtyState.uncommitted.rollback.apply(this, arguments);
  record.transitionTo('deleted.saved');
};

updatedState.uncommitted.deleteRecord = function(record) {
  record.transitionTo('deleted.uncommitted');
  record.clearRelationships();
};

var RootState = {
  // FLAGS
  isEmpty: false,
  isLoading: false,
  isLoaded: false,
  isReloading: false,
  isDirty: false,
  isSaving: false,
  isDeleted: false,
  isError: false,
  isNew: false,
  isValid: true,

  // SUBSTATES

  // A record begins its lifecycle in the `empty` state.
  // If its data will come from the adapter, it will
  // transition into the `loading` state. Otherwise, if
  // the record is being created on the client, it will
  // transition into the `created` state.
  empty: {
    isEmpty: true,

    // EVENTS
    loadingData: function(record) {
      record.transitionTo('loading');
    },

    loadedData: function(record) {
      record.transitionTo('loaded.created.uncommitted');
    },

    pushedData: function(record) {
      record.transitionTo('loaded.saved');
    }
  },

  // A record enters this state when the store askes
  // the adapter for its data. It remains in this state
  // until the adapter provides the requested data.
  //
  // Usually, this process is asynchronous, using an
  // XHR to retrieve the data.
  loading: {
    // FLAGS
    isLoading: true,

    // EVENTS
    loadedData: didChangeData,

    materializingData: function(record) {
      record.transitionTo('loaded.materializing.firstTime');
    },

    becameError: function(record) {
      record.transitionTo('error');
      record.send('invokeLifecycleCallbacks');
    }
  },

  // A record enters this state when its data is populated.
  // Most of a record's lifecycle is spent inside substates
  // of the `loaded` state.
  loaded: {
    initialState: 'saved',

    // FLAGS
    isLoaded: true,

    // SUBSTATES

    materializing: {
      // EVENTS
      willSetProperty: Ember.K,
      didSetProperty: Ember.K,

      didChangeData: didChangeData,

      finishedMaterializing: function(record) {
        record.transitionTo('loaded.saved');
      },

      // SUBSTATES
      firstTime: {
        // FLAGS
        isLoaded: false,

        exit: function(record) {
          once(function() {
            record.trigger('didLoad');
          });
        }
      }
    },

    reloading: {
      // FLAGS
      isReloading: true,

      // TRANSITIONS
      enter: function(record) {
        var store = get(record, 'store');
        store.reloadRecord(record);
      },

      exit: function(record) {
        once(record, 'trigger', 'didReload');
      },

      // EVENTS
      loadedData: didChangeData,

      materializingData: function(record) {
        record.transitionTo('loaded.materializing');
      }
    },

    // If there are no local changes to a record, it remains
    // in the `saved` state.
    saved: {
      // EVENTS
      willSetProperty: willSetProperty,
      didSetProperty: didSetProperty,

      didChangeData: didChangeData,
      loadedData: didChangeData,

      reloadRecord: function(record) {
        record.transitionTo('loaded.reloading');
      },

      materializingData: function(record) {
        record.transitionTo('loaded.materializing');
      },

      becomeDirty: function(record) {
        record.transitionTo('updated.uncommitted');
      },

      deleteRecord: function(record) {
        record.transitionTo('deleted.uncommitted');
        record.clearRelationships();
      },

      unloadRecord: function(record) {
        // clear relationships before moving to deleted state
        // otherwise it fails
        record.clearRelationships();
        record.transitionTo('deleted.saved');
      },

      didCommit: function(record) {
        record.withTransaction(function(t) {
          t.remove(record);
        });

        record.send('invokeLifecycleCallbacks', get(record, 'lastDirtyType'));
      },

      invokeLifecycleCallbacks: function(record, dirtyType) {
        if (dirtyType === 'created') {
          record.trigger('didCreate', record);
        } else {
          record.trigger('didUpdate', record);
        }

        record.trigger('didCommit', record);
      }
    },

    // A record is in this state after it has been locally
    // created but before the adapter has indicated that
    // it has been saved.
    created: createdState,

    // A record is in this state if it has already been
    // saved to the server, but there are new local changes
    // that have not yet been saved.
    updated: updatedState
  },

  // A record is in this state if it was deleted from the store.
  deleted: {
    initialState: 'uncommitted',
    dirtyType: 'deleted',

    // FLAGS
    isDeleted: true,
    isLoaded: true,
    isDirty: true,

    // TRANSITIONS
    setup: function(record) {
      var store = get(record, 'store');

      store.recordArrayManager.remove(record);
    },

    // SUBSTATES

    // When a record is deleted, it enters the `start`
    // state. It will exit this state when the record's
    // transaction starts to commit.
    uncommitted: {

      // EVENTS
      willCommit: function(record) {
        record.transitionTo('inFlight');
      },

      rollback: function(record) {
        record.rollback();
      },

      becomeDirty: Ember.K,

      becameClean: function(record) {
        record.withTransaction(function(t) {
          t.remove(record);
        });
        record.transitionTo('loaded.materializing');
      }
    },

    // After a record's transaction is committing, but
    // before the adapter indicates that the deletion
    // has saved to the server, a record is in the
    // `inFlight` substate of `deleted`.
    inFlight: {
      // FLAGS
      isSaving: true,

      // TRANSITIONS
      enter: function(record) {
        record.becameInFlight();
      },

      // EVENTS
      didCommit: function(record) {
        record.withTransaction(function(t) {
          t.remove(record);
        });

        record.transitionTo('saved');

        record.send('invokeLifecycleCallbacks');
      }
    },

    // Once the adapter indicates that the deletion has
    // been saved, the record enters the `saved` substate
    // of `deleted`.
    saved: {
      // FLAGS
      isDirty: false,

      setup: function(record) {
        var store = get(record, 'store');
        store.dematerializeRecord(record);
      },

      invokeLifecycleCallbacks: function(record) {
        record.trigger('didDelete', record);
        record.trigger('didCommit', record);
      }
    }
  },

  // If the adapter indicates that there was an unknown
  // error saving a record, the record enters the `error`
  // state.
  error: {
    isError: true,

    // EVENTS

    invokeLifecycleCallbacks: function(record) {
      record.trigger('becameError', record);
    }
  }
};

var hasOwnProp = {}.hasOwnProperty;

function wireState(object, parent, name) {
  /*jshint proto:true*/
  // TODO: Use Object.create and copy instead
  object = mixin(parent ? Ember.create(parent) : {}, object);
  object.parentState = parent;
  object.stateName = name;

  for (var prop in object) {
    if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') { continue; }
    if (typeof object[prop] === 'object') {
      object[prop] = wireState(object[prop], object, name + "." + prop);
    }
  }

  return object;
}

RootState = wireState(RootState, null, "root");

DS.RootState = RootState;

})();



(function() {
/**
  @module ember-data
*/

var LoadPromise = DS.LoadPromise; // system/mixins/load_promise

var get = Ember.get, set = Ember.set, map = Ember.EnumerableUtils.map, merge = Ember.merge;

var arrayMap = Ember.ArrayPolyfills.map;

var retrieveFromCurrentState = Ember.computed(function(key, value) {
  return get(get(this, 'currentState'), key);
}).property('currentState').readOnly();

/**

  The model class that all Ember Data records descend from.

  @class Model
  @namespace DS
  @extends Ember.Object
  @uses Ember.Evented
  @uses DS.LoadPromise
*/
DS.Model = Ember.Object.extend(Ember.Evented, LoadPromise, {
  isEmpty: retrieveFromCurrentState,
  isLoading: retrieveFromCurrentState,
  isLoaded: retrieveFromCurrentState,
  isReloading: retrieveFromCurrentState,
  isDirty: retrieveFromCurrentState,
  isSaving: retrieveFromCurrentState,
  isDeleted: retrieveFromCurrentState,
  isError: retrieveFromCurrentState,
  isNew: retrieveFromCurrentState,
  isValid: retrieveFromCurrentState,
  dirtyType: retrieveFromCurrentState,

  clientId: null,
  id: null,
  transaction: null,
  currentState: null,
  errors: null,

  /**
    Create a JSON representation of the record, using the serialization
    strategy of the store's adapter.

    @method serialize
    @param {Object} options Available options:

    * `includeId`: `true` if the record's ID should be included in the
      JSON representation.

    @returns {Object} an object whose values are primitive JSON values only
  */
  serialize: function(options) {
    var store = get(this, 'store');
    return store.serialize(this, options);
  },

  /**
    Use {{#crossLink "DS.JSONSerializer"}}DS.JSONSerializer{{/crossLink}} to
    get the JSON representation of a record.

    @method toJSON
    @param {Object} options Available options:

    * `includeId`: `true` if the record's ID should be included in the
      JSON representation.

    @returns {Object} A JSON representation of the object.
  */
  toJSON: function(options) {
    var serializer = DS.JSONSerializer.create();
    return serializer.serialize(this, options);
  },

  /**
    Fired when the record is loaded from the server.

    @event didLoad
  */
  didLoad: Ember.K,

  /**
    Fired when the record is reloaded from the server.

    @event didReload
  */
  didReload: Ember.K,

  /**
    Fired when the record is updated.

    @event didUpdate
  */
  didUpdate: Ember.K,

  /**
    Fired when the record is created.

    @event didCreate
  */
  didCreate: Ember.K,

  /**
    Fired when the record is deleted.

    @event didDelete
  */
  didDelete: Ember.K,

  /**
    Fired when the record becomes invalid.

    @event becameInvalid
  */
  becameInvalid: Ember.K,

  /**
    Fired when the record enters the error state.

    @event becameError
  */
  becameError: Ember.K,

  data: Ember.computed(function() {
    if (!this._data) {
      this.setupData();
    }

    return this._data;
  }).property(),

  materializeData: function() {
    this.send('materializingData');

    get(this, 'store').materializeData(this);

    this.suspendRelationshipObservers(function() {
      this.notifyPropertyChange('data');
    });
  },

  _data: null,

  init: function() {
    set(this, 'currentState', DS.RootState.empty);
    this._super();
    this._setup();
  },

  _setup: function() {
    this._changesToSync = {};
  },

  send: function(name, context) {
    var currentState = get(this, 'currentState');

    if (!currentState[name]) {
      this._unhandledEvent(currentState, name, context);
    }

    return currentState[name](this, context);
  },

  transitionTo: function(name) {
    // POSSIBLE TODO: Remove this code and replace with
    // always having direct references to state objects

    var pivotName = name.split(".", 1),
        currentState = get(this, 'currentState'),
        state = currentState;

    do {
      if (state.exit) { state.exit(this); }
      state = state.parentState;
    } while (!state.hasOwnProperty(pivotName));

    var path = name.split(".");

    var setups = [], enters = [], i, l;

    for (i=0, l=path.length; i<l; i++) {
      state = state[path[i]];

      if (state.enter) { enters.push(state); }
      if (state.setup) { setups.push(state); }
    }

    for (i=0, l=enters.length; i<l; i++) {
      enters[i].enter(this);
    }

    set(this, 'currentState', state);

    for (i=0, l=setups.length; i<l; i++) {
      setups[i].setup(this);
    }
  },

  _unhandledEvent: function(state, name, context) {
    var errorMessage = "Attempted to handle event `" + name + "` ";
    errorMessage    += "on " + String(this) + " while in state ";
    errorMessage    += state.stateName + ". ";

    if (context !== undefined) {
      errorMessage  += "Called with " + Ember.inspect(context) + ".";
    }

    throw new Ember.Error(errorMessage);
  },

  withTransaction: function(fn) {
    var transaction = get(this, 'transaction');
    if (transaction) { fn(transaction); }
  },

  loadingData: function() {
    this.send('loadingData');
  },

  loadedData: function() {
    this.send('loadedData');
  },

  pushedData: function() {
    this.send('pushedData');
  },

  didChangeData: function() {
    this.send('didChangeData');
  },

  deleteRecord: function() {
    this.send('deleteRecord');
  },

  unloadRecord: function() {
    Ember.assert("You can only unload a loaded, non-dirty record.", !get(this, 'isDirty'));

    this.send('unloadRecord');
  },

  clearRelationships: function() {
    this.eachRelationship(function(name, relationship) {
      if (relationship.kind === 'belongsTo') {
        set(this, name, null);
      } else if (relationship.kind === 'hasMany') {
        this.clearHasMany(relationship);
      }
    }, this);
  },

  updateRecordArrays: function() {
    var store = get(this, 'store');
    if (store) {
      store.dataWasUpdated(this.constructor, get(this, '_reference'), this);
    }
  },

  /**
    If the adapter did not return a hash in response to a commit,
    merge the changed attributes and relationships into the existing
    saved data.

    @method adapterDidCommit
  */
  adapterDidCommit: function() {
    var attributes = get(this, 'data');

    get(this.constructor, 'attributes').forEach(function(name, meta) {
      attributes[name] = get(this, name);
    }, this);

    this.send('didCommit');
    this.updateRecordArraysLater();
  },

  adapterDidDirty: function() {
    this.send('becomeDirty');
    this.updateRecordArraysLater();
  },

  dataDidChange: Ember.observer(function() {
    this.reloadHasManys();
    this.send('finishedMaterializing');
  }, 'data'),

  reloadHasManys: function() {
    var relationships = get(this.constructor, 'relationshipsByName');
    this.updateRecordArraysLater();
    relationships.forEach(function(name, relationship) {
      if (relationship.kind === 'hasMany') {
        this.hasManyDidChange(relationship.key);
      }
    }, this);
  },

  hasManyDidChange: function(key) {
    var cachedValue = this.cacheFor(key);

    if (cachedValue) {
      var type = get(this.constructor, 'relationshipsByName').get(key).type;
      var store = get(this, 'store');
      var ids = this._data[key] || [];

      var references = map(ids, function(id) {
        if (typeof id === 'object') {
          if( id.clientId ) {
            // if it was already a reference, return the reference
            return id;
          } else {
            // <id, type> tuple for a polymorphic association.
            return store.referenceForId(id.type, id.id);
          }
        }
        return store.referenceForId(type, id);
      });

      set(cachedValue, 'content', Ember.A(references));
    }
  },

  updateRecordArraysLater: function() {
    Ember.run.once(this, this.updateRecordArrays);
  },

  setupData: function(data) {
    this._data = data || { id: null };

    if (data) { this.pushedData(); }
  },

  materializeId: function(id) {
    set(this, 'id', id);
  },

  materializeAttributes: function(attributes) {
    Ember.assert("Must pass a hash of attributes to materializeAttributes", !!attributes);
    merge(this._data, attributes);
  },

  materializeAttribute: function(name, value) {
    this._data[name] = value;
  },

  materializeHasMany: function(name, tuplesOrReferencesOrOpaque) {
    var tuplesOrReferencesOrOpaqueType = typeof tuplesOrReferencesOrOpaque;

    if (tuplesOrReferencesOrOpaque && tuplesOrReferencesOrOpaqueType !== 'string' && tuplesOrReferencesOrOpaque.length > 1) {
      Ember.assert('materializeHasMany expects tuples, references or opaque token, not ' + tuplesOrReferencesOrOpaque[0], tuplesOrReferencesOrOpaque[0].hasOwnProperty('id') && tuplesOrReferencesOrOpaque[0].type);
    }

    if( tuplesOrReferencesOrOpaqueType === "string" ) {
      this._data[name] = tuplesOrReferencesOrOpaque;
    } else {
      var references = tuplesOrReferencesOrOpaque;

      if (tuplesOrReferencesOrOpaque && Ember.isArray(tuplesOrReferencesOrOpaque)) {
        references = this._convertTuplesToReferences(tuplesOrReferencesOrOpaque);
      }

      this._data[name] = references;
    }
  },

  materializeBelongsTo: function(name, tupleOrReference) {
    if (tupleOrReference) { Ember.assert('materializeBelongsTo expects a tuple or a reference, not a ' + tupleOrReference, !tupleOrReference || (tupleOrReference.hasOwnProperty('id') && tupleOrReference.hasOwnProperty('type'))); }

    this._data[name] = tupleOrReference;
  },

  _convertTuplesToReferences: function(tuplesOrReferences) {
    return map(tuplesOrReferences, function(tupleOrReference) {
      return this._convertTupleToReference(tupleOrReference);
    }, this);
  },

  _convertTupleToReference: function(tupleOrReference) {
    var store = get(this, 'store');
    if(tupleOrReference.clientId) {
      return tupleOrReference;
    } else {
      return store.referenceForId(tupleOrReference.type, tupleOrReference.id);
    }
  },

  rollback: function() {
    this._setup();
    this.send('becameClean');

    this.suspendRelationshipObservers(function() {
      this.notifyPropertyChange('data');
    });
  },

  toStringExtension: function() {
    return get(this, 'id');
  },

  /**
    The goal of this method is to temporarily disable specific observers
    that take action in response to application changes.

    This allows the system to make changes (such as materialization and
    rollback) that should not trigger secondary behavior (such as setting an
    inverse relationship or marking records as dirty).

    The specific implementation will likely change as Ember proper provides
    better infrastructure for suspending groups of observers, and if Array
    observation becomes more unified with regular observers.

    @method suspendRelationshipObservers
    @private
    @param callback
    @param binding
  */
  suspendRelationshipObservers: function(callback, binding) {
    var observers = get(this.constructor, 'relationshipNames').belongsTo;
    var self = this;

    try {
      this._suspendedRelationships = true;
      Ember._suspendObservers(self, observers, null, 'belongsToDidChange', function() {
        Ember._suspendBeforeObservers(self, observers, null, 'belongsToWillChange', function() {
          callback.call(binding || self);
        });
      });
    } finally {
      this._suspendedRelationships = false;
    }
  },

  becameInFlight: function() {
  },

  /**
    @method resolveOn
    @private
    @param successEvent
  */
  resolveOn: function(successEvent) {
    var model = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      function success() {
        this.off('becameError', error);
        this.off('becameInvalid', error);
        resolve(this);
      }
      function error() {
        this.off(successEvent, success);
        reject(this);
      }

      model.one(successEvent, success);
      model.one('becameError', error);
      model.one('becameInvalid', error);
    });
  },

  /**
    Save the record.

    @method save
  */
  save: function() {
    this.get('store').scheduleSave(this);

    return this.resolveOn('didCommit');
  },

  /**
    Reload the record from the adapter.

    This will only work if the record has already finished loading
    and has not yet been modified (`isLoaded` but not `isDirty`,
    or `isSaving`).

    @method reload
  */
  reload: function() {
    this.send('reloadRecord');

    return this.resolveOn('didReload');
  },

  // FOR USE DURING COMMIT PROCESS

  adapterDidUpdateAttribute: function(attributeName, value) {

    // If a value is passed in, update the internal attributes and clear
    // the attribute cache so it picks up the new value. Otherwise,
    // collapse the current value into the internal attributes because
    // the adapter has acknowledged it.
    if (value !== undefined) {
      get(this, 'data')[attributeName] = value;
      this.notifyPropertyChange(attributeName);
    } else {
      value = get(this, attributeName);
      get(this, 'data')[attributeName] = value;
    }

    this.updateRecordArraysLater();
  },

  adapterDidInvalidate: function(errors) {
    this.send('becameInvalid', errors);
  },

  adapterDidError: function() {
    this.send('becameError');
  },

  /**
    Override the default event firing from Ember.Evented to
    also call methods with the given name.

    @method trigger
    @private
    @param name
  */
  trigger: function(name) {
    Ember.tryInvoke(this, name, [].slice.call(arguments, 1));
    this._super.apply(this, arguments);
  }
});

// Helper function to generate store aliases.
// This returns a function that invokes the named alias
// on the default store, but injects the class as the
// first parameter.
var storeAlias = function(methodName) {
  return function() {
    var store = get(DS, 'defaultStore'),
        args = [].slice.call(arguments);

    args.unshift(this);
    Ember.assert("Your application does not have a 'Store' property defined. Attempts to call '" + methodName + "' on model classes will fail. Please provide one as with 'YourAppName.Store = DS.Store.extend()'", !!store);
    return store[methodName].apply(store, args);
  };
};

DS.Model.reopenClass({

  /**
    Alias DS.Model's `create` method to `_create`. This allows us to create DS.Model
    instances from within the store, but if end users accidentally call `create()`
    (instead of `createRecord()`), we can raise an error.

    @method _create
    @private
    @static
  */
  _create: DS.Model.create,

  /**
    Override the class' `create()` method to raise an error. This prevents end users
    from inadvertently calling `create()` instead of `createRecord()`. The store is
    still able to create instances by calling the `_create()` method.

    @method create
    @private
    @static
  */
  create: function() {
    throw new Ember.Error("You should not call `create` on a model. Instead, call `createRecord` with the attributes you would like to set.");
  },

  /**
    See `DS.Store.find()`.

    @method find
    @param {Object|String|Array|null} query A query to find records by.
  */
  find: storeAlias('find'),

  /**
    See `DS.Store.all()`.

    @method all
    @return {DS.RecordArray}
  */
  all: storeAlias('all'),

  /**
    See `DS.Store.findQuery()`.

    @method query
    @param {Object} query an opaque query to be used by the adapter
    @return {DS.AdapterPopulatedRecordArray}
  */
  query: storeAlias('findQuery'),

  /**
    See `DS.Store.filter()`.

    @method filter
    @param {Function} filter
    @return {DS.FilteredRecordArray}
  */
  filter: storeAlias('filter'),

  /**
    See `DS.Store.createRecord()`.

    @method createRecord
    @param {Object} properties a hash of properties to set on the
      newly created record.
    @return DS.Model
  */
  createRecord: storeAlias('createRecord')
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get;

/**
  @class Model
  @namespace DS
*/
DS.Model.reopenClass({
  attributes: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isAttribute) {
        Ember.assert("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + this.toString(), name !== 'id');

        meta.name = name;
        map.set(name, meta);
      }
    });

    return map;
  })
});


DS.Model.reopen({
  eachAttribute: function(callback, binding) {
    get(this.constructor, 'attributes').forEach(function(name, meta) {
      callback.call(binding, name, meta);
    }, binding);
  },

  attributeWillChange: Ember.beforeObserver(function(record, key) {
    var reference = get(record, '_reference'),
        store = get(record, 'store');

    record.send('willSetProperty', { reference: reference, store: store, name: key });
  }),

  attributeDidChange: Ember.observer(function(record, key) {
    record.send('didSetProperty', { name: key });
  })
});

function getAttr(record, options, key) {
  var attributes = get(record, 'data');
  var value = attributes[key];

  if (value === undefined) {
    if (typeof options.defaultValue === "function") {
      value = options.defaultValue();
    } else {
      value = options.defaultValue;
    }
  }

  return value;
}

DS.attr = function(type, options) {
  options = options || {};

  var meta = {
    type: type,
    isAttribute: true,
    options: options
  };

  return Ember.computed(function(key, value, oldValue) {
    if (arguments.length > 1) {
      Ember.assert("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + this.constructor.toString(), key !== 'id');
    } else {
      value = getAttr(this, options, key);
    }

    return value;
  // `data` is never set directly. However, it may be
  // invalidated from the state manager's setData
  // event.
  }).property('data').meta(meta);
};


})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
/**
  @module ember-data
*/

/**
  An AttributeChange object is created whenever a record's
  attribute changes value. It is used to track changes to a
  record between transaction commits.

  @class AttributeChange
  @namespace DS
  @private
  @constructor
*/
var AttributeChange = DS.AttributeChange = function(options) {
  this.reference = options.reference;
  this.store = options.store;
  this.name = options.name;
  this.oldValue = options.oldValue;
};

AttributeChange.createChange = function(options) {
  return new AttributeChange(options);
};

AttributeChange.prototype = {
  sync: function() {
    this.store.recordAttributeDidChange(this.reference, this.name, this.value, this.oldValue);

    // TODO: Use this object in the commit process
    this.destroy();
  },

  /**
    If the AttributeChange is destroyed (either by being rolled back
    or being committed), remove it from the list of pending changes
    on the record.

    @method destroy
  */
  destroy: function() {
    var record = this.reference.record;

    delete record._changesToSync[this.name];
  }
};

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @class RelationshipChange
  @namespace DS
  @private
  @construtor
*/
DS.RelationshipChange = function(options) {
  this.parentReference = options.parentReference;
  this.childReference = options.childReference;
  this.firstRecordReference = options.firstRecordReference;
  this.firstRecordKind = options.firstRecordKind;
  this.firstRecordName = options.firstRecordName;
  this.secondRecordReference = options.secondRecordReference;
  this.secondRecordKind = options.secondRecordKind;
  this.secondRecordName = options.secondRecordName;
  this.changeType = options.changeType;
  this.store = options.store;

  this.committed = {};
};

/**
  @class RelationshipChangeAdd
  @namespace DS
  @private
  @construtor
*/
DS.RelationshipChangeAdd = function(options){
  DS.RelationshipChange.call(this, options);
};

/**
  @class RelationshipChangeRemove
  @namespace DS
  @private
  @construtor
*/
DS.RelationshipChangeRemove = function(options){
  DS.RelationshipChange.call(this, options);
};

DS.RelationshipChange.create = function(options) {
  return new DS.RelationshipChange(options);
};

DS.RelationshipChangeAdd.create = function(options) {
  return new DS.RelationshipChangeAdd(options);
};

DS.RelationshipChangeRemove.create = function(options) {
  return new DS.RelationshipChangeRemove(options);
};

DS.OneToManyChange = {};
DS.OneToNoneChange = {};
DS.ManyToNoneChange = {};
DS.OneToOneChange = {};
DS.ManyToManyChange = {};

DS.RelationshipChange._createChange = function(options){
  if(options.changeType === "add"){
    return DS.RelationshipChangeAdd.create(options);
  }
  if(options.changeType === "remove"){
    return DS.RelationshipChangeRemove.create(options);
  }
};


DS.RelationshipChange.determineRelationshipType = function(recordType, knownSide){
  var knownKey = knownSide.key, key, otherKind;
  var knownKind = knownSide.kind;

  var inverse = recordType.inverseFor(knownKey);

  if (inverse){
    key = inverse.name;
    otherKind = inverse.kind;
  }

  if (!inverse){
    return knownKind === "belongsTo" ? "oneToNone" : "manyToNone";
  }
  else{
    if(otherKind === "belongsTo"){
      return knownKind === "belongsTo" ? "oneToOne" : "manyToOne";
    }
    else{
      return knownKind === "belongsTo" ? "oneToMany" : "manyToMany";
    }
  }

};

DS.RelationshipChange.createChange = function(firstRecordReference, secondRecordReference, store, options){
  // Get the type of the child based on the child's client ID
  var firstRecordType = firstRecordReference.type, changeType;
  changeType = DS.RelationshipChange.determineRelationshipType(firstRecordType, options);
  if (changeType === "oneToMany"){
    return DS.OneToManyChange.createChange(firstRecordReference, secondRecordReference, store, options);
  }
  else if (changeType === "manyToOne"){
    return DS.OneToManyChange.createChange(secondRecordReference, firstRecordReference, store, options);
  }
  else if (changeType === "oneToNone"){
    return DS.OneToNoneChange.createChange(firstRecordReference, secondRecordReference, store, options);
  }
  else if (changeType === "manyToNone"){
    return DS.ManyToNoneChange.createChange(firstRecordReference, secondRecordReference, store, options);
  }
  else if (changeType === "oneToOne"){
    return DS.OneToOneChange.createChange(firstRecordReference, secondRecordReference, store, options);
  }
  else if (changeType === "manyToMany"){
    return DS.ManyToManyChange.createChange(firstRecordReference, secondRecordReference, store, options);
  }
};

DS.OneToNoneChange.createChange = function(childReference, parentReference, store, options) {
  var key = options.key;
  var change = DS.RelationshipChange._createChange({
      parentReference: parentReference,
      childReference: childReference,
      firstRecordReference: childReference,
      store: store,
      changeType: options.changeType,
      firstRecordName: key,
      firstRecordKind: "belongsTo"
  });

  store.addRelationshipChangeFor(childReference, key, parentReference, null, change);

  return change;
};

DS.ManyToNoneChange.createChange = function(childReference, parentReference, store, options) {
  var key = options.key;
  var change = DS.RelationshipChange._createChange({
      parentReference: childReference,
      childReference: parentReference,
      secondRecordReference: childReference,
      store: store,
      changeType: options.changeType,
      secondRecordName: options.key,
      secondRecordKind: "hasMany"
  });

  store.addRelationshipChangeFor(childReference, key, parentReference, null, change);
  return change;
};


DS.ManyToManyChange.createChange = function(childReference, parentReference, store, options) {
  // If the name of the belongsTo side of the relationship is specified,
  // use that
  // If the type of the parent is specified, look it up on the child's type
  // definition.
  var key = options.key;

  var change = DS.RelationshipChange._createChange({
      parentReference: parentReference,
      childReference: childReference,
      firstRecordReference: childReference,
      secondRecordReference: parentReference,
      firstRecordKind: "hasMany",
      secondRecordKind: "hasMany",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childReference, key, parentReference, null, change);


  return change;
};

DS.OneToOneChange.createChange = function(childReference, parentReference, store, options) {
  var key;

  // If the name of the belongsTo side of the relationship is specified,
  // use that
  // If the type of the parent is specified, look it up on the child's type
  // definition.
  if (options.parentType) {
    key = options.parentType.inverseFor(options.key).name;
  } else if (options.key) {
    key = options.key;
  } else {
    Ember.assert("You must pass either a parentType or belongsToName option to OneToManyChange.forChildAndParent", false);
  }

  var change = DS.RelationshipChange._createChange({
      parentReference: parentReference,
      childReference: childReference,
      firstRecordReference: childReference,
      secondRecordReference: parentReference,
      firstRecordKind: "belongsTo",
      secondRecordKind: "belongsTo",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childReference, key, parentReference, null, change);


  return change;
};

DS.OneToOneChange.maintainInvariant = function(options, store, childReference, key){
  if (options.changeType === "add" && store.recordIsMaterialized(childReference)) {
    var child = store.recordForReference(childReference);
    var oldParent = get(child, key);
    if (oldParent){
      var correspondingChange = DS.OneToOneChange.createChange(childReference, oldParent.get('_reference'), store, {
          parentType: options.parentType,
          hasManyName: options.hasManyName,
          changeType: "remove",
          key: options.key
        });
      store.addRelationshipChangeFor(childReference, key, options.parentReference , null, correspondingChange);
     correspondingChange.sync();
    }
  }
};

DS.OneToManyChange.createChange = function(childReference, parentReference, store, options) {
  var key;

  // If the name of the belongsTo side of the relationship is specified,
  // use that
  // If the type of the parent is specified, look it up on the child's type
  // definition.
  if (options.parentType) {
    key = options.parentType.inverseFor(options.key).name;
    DS.OneToManyChange.maintainInvariant( options, store, childReference, key );
  } else if (options.key) {
    key = options.key;
  } else {
    Ember.assert("You must pass either a parentType or belongsToName option to OneToManyChange.forChildAndParent", false);
  }

  var change = DS.RelationshipChange._createChange({
      parentReference: parentReference,
      childReference: childReference,
      firstRecordReference: childReference,
      secondRecordReference: parentReference,
      firstRecordKind: "belongsTo",
      secondRecordKind: "hasMany",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childReference, key, parentReference, change.getSecondRecordName(), change);


  return change;
};


DS.OneToManyChange.maintainInvariant = function(options, store, childReference, key){
  var child = childReference.record;

  if (options.changeType === "add" && child) {
    var oldParent = get(child, key);
    if (oldParent){
      var correspondingChange = DS.OneToManyChange.createChange(childReference, oldParent.get('_reference'), store, {
          parentType: options.parentType,
          hasManyName: options.hasManyName,
          changeType: "remove",
          key: options.key
        });
      store.addRelationshipChangeFor(childReference, key, options.parentReference, correspondingChange.getSecondRecordName(), correspondingChange);
      correspondingChange.sync();
    }
  }
};

DS.OneToManyChange.ensureSameTransaction = function(changes){
  var records = Ember.A();
  forEach(changes, function(change){
    records.addObject(change.getSecondRecord());
    records.addObject(change.getFirstRecord());
  });

  return DS.Transaction.ensureSameTransaction(records);
};

/**
  @class RelationshipChange
  @namespace DS
*/
DS.RelationshipChange.prototype = {

  getSecondRecordName: function() {
    var name = this.secondRecordName, parent;

    if (!name) {
      parent = this.secondRecordReference;
      if (!parent) { return; }

      var childType = this.firstRecordReference.type;
      var inverse = childType.inverseFor(this.firstRecordName);
      this.secondRecordName = inverse.name;
    }

    return this.secondRecordName;
  },

  /**
    Get the name of the relationship on the belongsTo side.

    @method getFirstRecordName
    @return {String}
  */
  getFirstRecordName: function() {
    var name = this.firstRecordName;
    return name;
  },

  /**
    @method destroy
    @private
  */
  destroy: function() {
    var childReference = this.childReference,
        belongsToName = this.getFirstRecordName(),
        hasManyName = this.getSecondRecordName(),
        store = this.store;

    store.removeRelationshipChangeFor(childReference, belongsToName, this.parentReference, hasManyName, this.changeType);
  },

  /**
    @method getByReference
    @private
    @param reference
  */
  getByReference: function(reference) {
    // return null or undefined if the original reference was null or undefined
    if (!reference) { return reference; }

    if (reference.record) {
      return reference.record;
    }
  },

  getSecondRecord: function(){
    return this.getByReference(this.secondRecordReference);
  },

  /**
    @method getFirstRecord
    @private
  */
  getFirstRecord: function() {
    return this.getByReference(this.firstRecordReference);
  },

  /**
    Make sure that all three parts of the relationship change are part of
    the same transaction. If any of the three records is clean and in the
    default transaction, and the rest are in a different transaction, move
    them all into that transaction.

    @method ensureSameTransaction
    @private
  */
  ensureSameTransaction: function() {
    var child = this.getFirstRecord(),
      parentRecord = this.getSecondRecord();

    var transaction = DS.Transaction.ensureSameTransaction([child, parentRecord]);

    this.transaction = transaction;
    return transaction;
  },

  callChangeEvents: function(){
    var child = this.getFirstRecord(),
        parentRecord = this.getSecondRecord();

    var dirtySet = new Ember.OrderedSet();

    // TODO: This implementation causes a race condition in key-value
    // stores. The fix involves buffering changes that happen while
    // a record is loading. A similar fix is required for other parts
    // of ember-data, and should be done as new infrastructure, not
    // a one-off hack. [tomhuda]
    if (parentRecord && get(parentRecord, 'isLoaded')) {
      this.store.recordHasManyDidChange(dirtySet, parentRecord, this);
    }

    if (child) {
      this.store.recordBelongsToDidChange(dirtySet, child, this);
    }

    dirtySet.forEach(function(record) {
      record.adapterDidDirty();
    });
  },

  coalesce: function(){
    var relationshipPairs = this.store.relationshipChangePairsFor(this.firstRecordReference);
    forEach(relationshipPairs, function(pair){
      var addedChange = pair["add"];
      var removedChange = pair["remove"];
      if(addedChange && removedChange) {
        addedChange.destroy();
        removedChange.destroy();
      }
    });
  }
};

DS.RelationshipChangeAdd.prototype = Ember.create(DS.RelationshipChange.create({}));
DS.RelationshipChangeRemove.prototype = Ember.create(DS.RelationshipChange.create({}));

DS.RelationshipChangeAdd.prototype.changeType = "add";
DS.RelationshipChangeAdd.prototype.sync = function() {
  var secondRecordName = this.getSecondRecordName(),
      firstRecordName = this.getFirstRecordName(),
      firstRecord = this.getFirstRecord(),
      secondRecord = this.getSecondRecord();

  //Ember.assert("You specified a hasMany (" + hasManyName + ") on " + (!belongsToName && (newParent || oldParent || this.lastParent).constructor) + " but did not specify an inverse belongsTo on " + child.constructor, belongsToName);
  //Ember.assert("You specified a belongsTo (" + belongsToName + ") on " + child.constructor + " but did not specify an inverse hasMany on " + (!hasManyName && (newParent || oldParent || this.lastParentRecord).constructor), hasManyName);

  this.ensureSameTransaction();

  this.callChangeEvents();

  if (secondRecord && firstRecord) {
    if(this.secondRecordKind === "belongsTo"){
      secondRecord.suspendRelationshipObservers(function(){
        set(secondRecord, secondRecordName, firstRecord);
      });

     }
     else if(this.secondRecordKind === "hasMany"){
      secondRecord.suspendRelationshipObservers(function(){
        get(secondRecord, secondRecordName).addObject(firstRecord);
      });
    }
  }

  if (firstRecord && secondRecord && get(firstRecord, firstRecordName) !== secondRecord) {
    if(this.firstRecordKind === "belongsTo"){
      firstRecord.suspendRelationshipObservers(function(){
        set(firstRecord, firstRecordName, secondRecord);
      });
    }
    else if(this.firstRecordKind === "hasMany"){
      firstRecord.suspendRelationshipObservers(function(){
        get(firstRecord, firstRecordName).addObject(secondRecord);
      });
    }
  }

  this.coalesce();
};

DS.RelationshipChangeRemove.prototype.changeType = "remove";
DS.RelationshipChangeRemove.prototype.sync = function() {
  var secondRecordName = this.getSecondRecordName(),
      firstRecordName = this.getFirstRecordName(),
      firstRecord = this.getFirstRecord(),
      secondRecord = this.getSecondRecord();

  //Ember.assert("You specified a hasMany (" + hasManyName + ") on " + (!belongsToName && (newParent || oldParent || this.lastParent).constructor) + " but did not specify an inverse belongsTo on " + child.constructor, belongsToName);
  //Ember.assert("You specified a belongsTo (" + belongsToName + ") on " + child.constructor + " but did not specify an inverse hasMany on " + (!hasManyName && (newParent || oldParent || this.lastParentRecord).constructor), hasManyName);

  this.ensureSameTransaction(firstRecord, secondRecord, secondRecordName, firstRecordName);

  this.callChangeEvents();

  if (secondRecord && firstRecord) {
    if(this.secondRecordKind === "belongsTo"){
      secondRecord.suspendRelationshipObservers(function(){
        set(secondRecord, secondRecordName, null);
      });
    }
    else if(this.secondRecordKind === "hasMany"){
      secondRecord.suspendRelationshipObservers(function(){
        get(secondRecord, secondRecordName).removeObject(firstRecord);
      });
    }
  }

  if (firstRecord && get(firstRecord, firstRecordName)) {
    if(this.firstRecordKind === "belongsTo"){
      firstRecord.suspendRelationshipObservers(function(){
        set(firstRecord, firstRecordName, null);
      });
     }
     else if(this.firstRecordKind === "hasMany"){
       firstRecord.suspendRelationshipObservers(function(){
        get(firstRecord, firstRecordName).removeObject(secondRecord);
      });
    }
  }

  this.coalesce();
};

})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
var get = Ember.get, set = Ember.set,
    isNone = Ember.isNone;

/**
  @module ember-data
*/

DS.belongsTo = function(type, options) {
  Ember.assert("The first argument DS.belongsTo must be a model type or string, like DS.belongsTo(App.Person)", !!type && (typeof type === 'string' || DS.Model.detect(type)));

  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'belongsTo' };

  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        store = get(this, 'store'), belongsTo;

    if (typeof type === 'string') {
      if (type.indexOf(".") === -1) {
        type = store.modelFor(type);
      } else {
        type = get(Ember.lookup, type);
      }
    }

    if (arguments.length === 2) {
      Ember.assert("You can only add a record of " + type.toString() + " to this relationship", !value || type.detectInstance(value));
      return value === undefined ? null : value;
    }

    belongsTo = data[key];

    if (belongsTo instanceof DS.Model) { return belongsTo; }

    // TODO (tomdale) The value of the belongsTo in the data hash can be
    // one of:
    // 1. null/undefined
    // 2. a record reference
    // 3. a tuple returned by the serializer's polymorphism code
    //
    // We should really normalize #3 to be the same as #2 to reduce the
    // complexity here.

    if (isNone(belongsTo)) {
      return null;
    }

    // The data has been normalized to a record reference, so
    // just ask the store for the record for that reference,
    // materializing it if necessary.
    if (belongsTo.clientId) {
      return store.recordForReference(belongsTo);
    }

    // The data has been normalized into a type/id pair by the
    // serializer's polymorphism code.
    return store.findById(belongsTo.type, belongsTo.id);
  }).property('data').meta(meta);
};

/*
  These observers observe all `belongsTo` relationships on the record. See
  `relationships/ext` to see how these observers get their dependencies.

  @class Model
  @namespace DS
*/
DS.Model.reopen({

  /**
    @method belongsToWillChange
    @private
    @static
    @param record
    @param key
  */
  belongsToWillChange: Ember.beforeObserver(function(record, key) {
    if (get(record, 'isLoaded')) {
      var oldParent = get(record, key);

      var childReference = get(record, '_reference'),
          store = get(record, 'store');
      if (oldParent){
        var change = DS.RelationshipChange.createChange(childReference, get(oldParent, '_reference'), store, { key: key, kind:"belongsTo", changeType: "remove" });
        change.sync();
        this._changesToSync[key] = change;
      }
    }
  }),

  /**
    @method belongsToDidChange
    @private
    @static
    @param record
    @param key
  */
  belongsToDidChange: Ember.immediateObserver(function(record, key) {
    if (get(record, 'isLoaded')) {
      var newParent = get(record, key);
      if(newParent){
        var childReference = get(record, '_reference'),
            store = get(record, 'store');
        var change = DS.RelationshipChange.createChange(childReference, get(newParent, '_reference'), store, { key: key, kind:"belongsTo", changeType: "add" });
        change.sync();
        if(this._changesToSync[key]){
          DS.OneToManyChange.ensureSameTransaction([change, this._changesToSync[key]], store);
        }
      }
    }
    delete this._changesToSync[key];
  })
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set, forEach = Ember.EnumerableUtils.forEach;

var hasRelationship = function(type, options) {
  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'hasMany' };

  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        store = get(this, 'store'),
        ids, relationship;

    if (typeof type === 'string') {
      if (type.indexOf(".") === -1) {
        type = store.modelFor(type);
      } else {
        type = get(Ember.lookup, type);
      }
    }

    //ids can be references or opaque token
    //(e.g. `{url: '/relationship'}`) that will be passed to the adapter
    ids = data[key];

    relationship = store.findMany(type, ids, this, meta);
    set(relationship, 'owner', this);
    set(relationship, 'name', key);
    set(relationship, 'isPolymorphic', options.polymorphic);

    return relationship;
  }).property().meta(meta);
};

DS.hasMany = function(type, options) {
  Ember.assert("The type passed to DS.hasMany must be defined", !!type);
  return hasRelationship(type, options);
};

function clearUnmaterializedHasMany(record, relationship) {
  var data = get(record, 'data');

  var references = data[relationship.key];

  if (!references) { return; }

  var inverse = record.constructor.inverseFor(relationship.key);

  if (inverse) {
    forEach(references, function(reference) {
      var childRecord;

      if (childRecord = reference.record) {
        record.suspendRelationshipObservers(function() {
          set(childRecord, inverse.name, null);
        });
      }
    });
  }
}

DS.Model.reopen({
  clearHasMany: function(relationship) {
    var hasMany = this.cacheFor(relationship.name);

    if (hasMany) {
      hasMany.clear();
    } else {
      clearUnmaterializedHasMany(this, relationship);
    }
  }
});

})();



(function() {
var get = Ember.get, set = Ember.set;

/**
  @module ember-data
*/

/*
  This file defines several extensions to the base `DS.Model` class that
  add support for one-to-many relationships.
*/

/**
  @class Model
  @namespace DS
*/
DS.Model.reopen({

  /**
    This Ember.js hook allows an object to be notified when a property
    is defined.

    In this case, we use it to be notified when an Ember Data user defines a
    belongs-to relationship. In that case, we need to set up observers for
    each one, allowing us to track relationship changes and automatically
    reflect changes in the inverse has-many array.

    This hook passes the class being set up, as well as the key and value
    being defined. So, for example, when the user does this:

      DS.Model.extend({
        parent: DS.belongsTo(App.User)
      });

    This hook would be called with "parent" as the key and the computed
    property returned by `DS.belongsTo` as the value.

    @method didDefineProperty
    @param proto
    @param key
    @param value
  */
  didDefineProperty: function(proto, key, value) {
    // Check if the value being set is a computed property.
    if (value instanceof Ember.Descriptor) {

      // If it is, get the metadata for the relationship. This is
      // populated by the `DS.belongsTo` helper when it is creating
      // the computed property.
      var meta = value.meta();

      if (meta.isRelationship && meta.kind === 'belongsTo') {
        Ember.addObserver(proto, key, null, 'belongsToDidChange');
        Ember.addBeforeObserver(proto, key, null, 'belongsToWillChange');
      }

      if (meta.isAttribute) {
        Ember.addObserver(proto, key, null, 'attributeDidChange');
        Ember.addBeforeObserver(proto, key, null, 'attributeWillChange');
      }

      meta.parentType = proto.constructor;
    }
  }
});

/*
  These DS.Model extensions add class methods that provide relationship
  introspection abilities about relationships.

  A note about the computed properties contained here:

  **These properties are effectively sealed once called for the first time.**
  To avoid repeatedly doing expensive iteration over a model's fields, these
  values are computed once and then cached for the remainder of the runtime of
  your application.

  If your application needs to modify a class after its initial definition
  (for example, using `reopen()` to add additional attributes), make sure you
  do it before using your model with the store, which uses these properties
  extensively.
*/

DS.Model.reopenClass({
  /**
    For a given relationship name, returns the model type of the relationship.

    For example, if you define a model like this:

        App.Post = DS.Model.extend({
          comments: DS.hasMany(App.Comment)
        });

    Calling `App.Post.typeForRelationship('comments')` will return `App.Comment`.

    @method typeForRelationship
    @static
    @param {String} name the name of the relationship
    @return {subclass of DS.Model} the type of the relationship, or undefined
  */
  typeForRelationship: function(name) {
    var relationship = get(this, 'relationshipsByName').get(name);
    return relationship && relationship.type;
  },

  inverseFor: function(name) {
    var inverseType = this.typeForRelationship(name);

    if (!inverseType) { return null; }

    var options = this.metaForProperty(name).options;

    if (options.inverse === null) { return null; }
    
    var inverseName, inverseKind;

    if (options.inverse) {
      inverseName = options.inverse;
      inverseKind = Ember.get(inverseType, 'relationshipsByName').get(inverseName).kind;
    } else {
      var possibleRelationships = findPossibleInverses(this, inverseType);

      if (possibleRelationships.length === 0) { return null; }

      Ember.assert("You defined the '" + name + "' relationship on " + this + ", but multiple possible inverse relationships of type " + this + " were found on " + inverseType + ".", possibleRelationships.length === 1);

      inverseName = possibleRelationships[0].name;
      inverseKind = possibleRelationships[0].kind;
    }

    function findPossibleInverses(type, inverseType, possibleRelationships) {
      possibleRelationships = possibleRelationships || [];

      var relationshipMap = get(inverseType, 'relationships');
      if (!relationshipMap) { return; }

      var relationships = relationshipMap.get(type);
      if (relationships) {
        possibleRelationships.push.apply(possibleRelationships, relationshipMap.get(type));
      }

      if (type.superclass) {
        findPossibleInverses(type.superclass, inverseType, possibleRelationships);
      }

      return possibleRelationships;
    }

    return {
      type: inverseType,
      name: inverseName,
      kind: inverseKind
    };
  },

  /**
    The model's relationships as a map, keyed on the type of the
    relationship. The value of each entry is an array containing a descriptor
    for each relationship with that type, describing the name of the relationship
    as well as the type.

    For example, given the following model definition:

        App.Blog = DS.Model.extend({
          users: DS.hasMany(App.User),
          owner: DS.belongsTo(App.User),
          posts: DS.hasMany(App.Post)
        });

    This computed property would return a map describing these
    relationships, like this:

        var relationships = Ember.get(App.Blog, 'relationships');
        relationships.get(App.User);
        //=> [ { name: 'users', kind: 'hasMany' },
        //     { name: 'owner', kind: 'belongsTo' } ]
        relationships.get(App.Post);
        //=> [ { name: 'posts', kind: 'hasMany' } ]

    @property relationships
    @static
    @type Ember.Map
    @readOnly
  */
  relationships: Ember.computed(function() {
    var map = new Ember.MapWithDefault({
      defaultValue: function() { return []; }
    });

    // Loop through each computed property on the class
    this.eachComputedProperty(function(name, meta) {

      // If the computed property is a relationship, add
      // it to the map.
      if (meta.isRelationship) {
        if (typeof meta.type === 'string') {
          meta.type = Ember.get(Ember.lookup, meta.type);
        }

        var relationshipsForType = map.get(meta.type);

        relationshipsForType.push({ name: name, kind: meta.kind });
      }
    });

    return map;
  }),

  /**
    A hash containing lists of the model's relationships, grouped
    by the relationship kind. For example, given a model with this
    definition:

        App.Blog = DS.Model.extend({
          users: DS.hasMany(App.User),
          owner: DS.belongsTo(App.User),

          posts: DS.hasMany(App.Post)
        });

    This property would contain the following:

       var relationshipNames = Ember.get(App.Blog, 'relationshipNames');
       relationshipNames.hasMany;
       //=> ['users', 'posts']
       relationshipNames.belongsTo;
       //=> ['owner']

    @property relationshipNames
    @static
    @type Object
    @readOnly
  */
  relationshipNames: Ember.computed(function() {
    var names = { hasMany: [], belongsTo: [] };

    this.eachComputedProperty(function(name, meta) {
      if (meta.isRelationship) {
        names[meta.kind].push(name);
      }
    });

    return names;
  }),

  /**
    An array of types directly related to a model. Each type will be
    included once, regardless of the number of relationships it has with
    the model.

    For example, given a model with this definition:

        App.Blog = DS.Model.extend({
          users: DS.hasMany(App.User),
          owner: DS.belongsTo(App.User),
          posts: DS.hasMany(App.Post)
        });

    This property would contain the following:

       var relatedTypes = Ember.get(App.Blog, 'relatedTypes');
       //=> [ App.User, App.Post ]

    @property relatedTypes
    @static
    @type Ember.Array
    @readOnly
  */
  relatedTypes: Ember.computed(function() {
    var type,
        types = Ember.A();

    // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships
    this.eachComputedProperty(function(name, meta) {
      if (meta.isRelationship) {
        type = meta.type;

        if (typeof type === 'string') {
          type = get(this, type, false) || get(Ember.lookup, type);
        }

        Ember.assert("You specified a hasMany (" + meta.type + ") on " + meta.parentType + " but " + meta.type + " was not found.",  type);

        if (!types.contains(type)) {
          Ember.assert("Trying to sideload " + name + " on " + this.toString() + " but the type doesn't exist.", !!type);
          types.push(type);
        }
      }
    });

    return types;
  }),

  /**
    A map whose keys are the relationships of a model and whose values are
    relationship descriptors.

    For example, given a model with this
    definition:

        App.Blog = DS.Model.extend({
          users: DS.hasMany(App.User),
          owner: DS.belongsTo(App.User),

          posts: DS.hasMany(App.Post)
        });

    This property would contain the following:

       var relationshipsByName = Ember.get(App.Blog, 'relationshipsByName');
       relationshipsByName.get('users');
       //=> { key: 'users', kind: 'hasMany', type: App.User }
       relationshipsByName.get('owner');
       //=> { key: 'owner', kind: 'belongsTo', type: App.User }

    @property relationshipsByName
    @static
    @type Ember.Map
    @readOnly
  */
  relationshipsByName: Ember.computed(function() {
    var map = Ember.Map.create(), type;

    this.eachComputedProperty(function(name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        type = meta.type;

        if (typeof type === 'string') {
          if (type.match(/^[^A-Z]/)) {
            type = this.store.modelFor(type);
          } else {
            type = get(this, type, false) || get(Ember.lookup, type);
          }

          meta.type = type;
        }

        map.set(name, meta);
      }
    });

    return map;
  }),

  /**
    A map whose keys are the fields of the model and whose values are strings
    describing the kind of the field. A model's fields are the union of all of its
    attributes and relationships.

    For example:

        App.Blog = DS.Model.extend({
          users: DS.hasMany(App.User),
          owner: DS.belongsTo(App.User),

          posts: DS.hasMany(App.Post),

          title: DS.attr('string')
        });

        var fields = Ember.get(App.Blog, 'fields');
        fields.forEach(function(field, kind) {
          console.log(field, kind);
        });

        // prints:
        // users, hasMany
        // owner, belongsTo
        // posts, hasMany
        // title, attribute

    @property fields
    @static
    @type Ember.Map
    @readOnly
  */
  fields: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachComputedProperty(function(name, meta) {
      if (meta.isRelationship) {
        map.set(name, meta.kind);
      } else if (meta.isAttribute) {
        map.set(name, 'attribute');
      }
    });

    return map;
  }),

  /**
    Given a callback, iterates over each of the relationships in the model,
    invoking the callback with the name of each relationship and its relationship
    descriptor.

    @method eachRelationship
    @static
    @param {Function} callback the callback to invoke
    @param {any} binding the value to which the callback's `this` should be bound
  */
  eachRelationship: function(callback, binding) {
    get(this, 'relationshipsByName').forEach(function(name, relationship) {
      callback.call(binding, name, relationship);
    });
  },

  /**
    Given a callback, iterates over each of the types related to a model,
    invoking the callback with the related type's class. Each type will be
    returned just once, regardless of how many different relationships it has
    with a model.

    @method eachRelatedType
    @static
    @param {Function} callback the callback to invoke
    @param {any} binding the value to which the callback's `this` should be bound
  */
  eachRelatedType: function(callback, binding) {
    get(this, 'relatedTypes').forEach(function(type) {
      callback.call(binding, type);
    });
  }
});

DS.Model.reopen({
  /**
    Given a callback, iterates over each of the relationships in the model,
    invoking the callback with the name of each relationship and its relationship
    descriptor.

    @method eachRelationship
    @param {Function} callback the callback to invoke
    @param {any} binding the value to which the callback's `this` should be bound
  */
  eachRelationship: function(callback, binding) {
    this.constructor.eachRelationship(callback, binding);
  }
});

})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;
var once = Ember.run.once;
var forEach = Ember.EnumerableUtils.forEach;

/**
  @class RecordArrayManager
  @namespace DS
  @private
  @extends Ember.Object
*/
DS.RecordArrayManager = Ember.Object.extend({
  init: function() {
    this.filteredRecordArrays = Ember.MapWithDefault.create({
      defaultValue: function() { return []; }
    });

    this.changedReferences = [];
  },

  referenceDidChange: function(reference) {
    this.changedReferences.push(reference);
    once(this, this.updateRecordArrays);
  },

  recordArraysForReference: function(reference) {
    reference.recordArrays = reference.recordArrays || Ember.OrderedSet.create();
    return reference.recordArrays;
  },

  /**
    This method is invoked whenever data is loaded into the store
    by the adapter or updated by the adapter, or when an attribute
    changes on a record.

    It updates all filters that a record belongs to.

    To avoid thrashing, it only runs once per run loop per record.

    @method updateRecordArrays
    @param {Class} type
    @param {Number|String} clientId
  */
  updateRecordArrays: function() {
    forEach(this.changedReferences, function(reference) {
      var type = reference.type,
          recordArrays = this.filteredRecordArrays.get(type),
          filter;

      forEach(recordArrays, function(array) {
        filter = get(array, 'filterFunction');
        this.updateRecordArray(array, filter, type, reference);
      }, this);

      // loop through all manyArrays containing an unloaded copy of this
      // clientId and notify them that the record was loaded.
      var manyArrays = reference.loadingRecordArrays;

      if (manyArrays) {
        for (var i=0, l=manyArrays.length; i<l; i++) {
          manyArrays[i].loadedRecord();
        }

        reference.loadingRecordArrays = [];
      }
    }, this);

    this.changedReferences = [];
  },

  /**
    Update an individual filter.

    @method updateRecordArray
    @param {DS.FilteredRecordArray} array
    @param {Function} filter
    @param {Class} type
    @param {Number|String} clientId
  */
  updateRecordArray: function(array, filter, type, reference) {
    var shouldBeInArray, record;

    if (!filter) {
      shouldBeInArray = true;
    } else {
      record = this.store.recordForReference(reference);
      shouldBeInArray = filter(record);
    }

    var recordArrays = this.recordArraysForReference(reference);

    if (shouldBeInArray) {
      recordArrays.add(array);
      array.addReference(reference);
    } else if (!shouldBeInArray) {
      recordArrays.remove(array);
      array.removeReference(reference);
    }
  },

  /**
    When a record is deleted, it is removed from all its
    record arrays.

    @method remove
    @param {DS.Model} record
  */
  remove: function(record) {
    var reference = get(record, '_reference');
    var recordArrays = reference.recordArrays || [];

    forEach(recordArrays, function(array) {
      array.removeReference(reference);
    });
  },

  /**
    This method is invoked if the `filterFunction` property is
    changed on a `DS.FilteredRecordArray`.

    It essentially re-runs the filter from scratch. This same
    method is invoked when the filter is created in th first place.

    @method updateFilter
    @param array
    @param type
    @param filter
  */
  updateFilter: function(array, type, filter) {
    var typeMap = this.store.typeMapFor(type),
        references = typeMap.references,
        reference, data, shouldFilter, record;

    for (var i=0, l=references.length; i<l; i++) {
      reference = references[i];
      shouldFilter = false;

      data = reference.data;

      if (typeof data === 'object') {
        if (record = reference.record) {
          if (!get(record, 'isDeleted')) { shouldFilter = true; }
        } else {
          shouldFilter = true;
        }

        if (shouldFilter) {
          this.updateRecordArray(array, filter, type, reference);
        }
      }
    }
  },

  /**
    Create a `DS.ManyArray` for a type and list of record references, and index
    the `ManyArray` under each reference. This allows us to efficiently remove
    records from `ManyArray`s when they are deleted.

    @method createManyArray
    @param {Class} type
    @param {Array} references
    @return {DS.ManyArray}
  */
  createManyArray: function(type, references) {
    var manyArray = DS.ManyArray.create({
      type: type,
      content: references,
      store: this.store
    });

    forEach(references, function(reference) {
      var arrays = this.recordArraysForReference(reference);
      arrays.add(manyArray);
    }, this);

    return manyArray;
  },

  /**
    Register a RecordArray for a given type to be backed by
    a filter function. This will cause the array to update
    automatically when records of that type change attribute
    values or states.

    @method registerFilteredRecordArray
    @param {DS.RecordArray} array
    @param {Class} type
    @param {Function} filter
  */
  registerFilteredRecordArray: function(array, type, filter) {
    var recordArrays = this.filteredRecordArrays.get(type);
    recordArrays.push(array);

    this.updateFilter(array, type, filter);
  },

  // Internally, we maintain a map of all unloaded IDs requested by
  // a ManyArray. As the adapter loads data into the store, the
  // store notifies any interested ManyArrays. When the ManyArray's
  // total number of loading records drops to zero, it becomes
  // `isLoaded` and fires a `didLoad` event.
  registerWaitingRecordArray: function(array, reference) {
    var loadingRecordArrays = reference.loadingRecordArrays || [];
    loadingRecordArrays.push(array);
    reference.loadingRecordArrays = loadingRecordArrays;
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set, map = Ember.ArrayPolyfills.map, isNone = Ember.isNone;

function mustImplement(name) {
  return function() {
    throw new Ember.Error("Your serializer " + this.toString() + " does not implement the required method " + name);
  };
}

/**
  A serializer is responsible for serializing and deserializing a group of
  records.

  `DS.Serializer` is an abstract base class designed to help you build a
  serializer that can read to and write from any serialized form.  While most
  applications will use `DS.JSONSerializer`, which reads and writes JSON, the
  serializer architecture allows your adapter to transmit things like XML,
  strings, or custom binary data.

  Typically, your application's `DS.Adapter` is responsible for both creating a
  serializer as well as calling the appropriate methods when it needs to
  materialize data or serialize a record.

  The serializer API is designed as a series of layered hooks that you can
  override to customize any of the individual steps of serialization and
  deserialization.

  The hooks are organized by the three responsibilities of the serializer:

  1. Determining naming conventions
  2. Serializing records into a serialized form
  3. Deserializing records from a serialized form

  Because Ember Data lazily materializes records, the deserialization
  step, and therefore the hooks you implement, are split into two phases:

  1. Extraction, where the serialized forms for multiple records are
     extracted from a single payload. The IDs of each record are also
     extracted for indexing.
  2. Materialization, where a newly-created record has its attributes
     and relationships initialized based on the serialized form loaded
     by the adapter.

  Additionally, a serializer can convert values from their JavaScript
  versions into their serialized versions via a declarative API.

  ## Naming Conventions

  One of the most common uses of the serializer is to map attribute names
  from the serialized form to your `DS.Model`. For example, in your model,
  you may have an attribute called `firstName`:

  ```javascript
  App.Person = DS.Model.extend({
    firstName: DS.attr('string')
  });
  ```

  However, because the web API your adapter is communicating with is
  legacy, it calls this attribute `FIRST_NAME`.

  You can determine the attribute name used in the serialized form
  by implementing `keyForAttributeName`:

  ```javascript
  keyForAttributeName: function(type, name) {
    return name.underscore.toUpperCase();
  }
  ```

  If your attribute names are not predictable, you can re-map them
  one-by-one using the adapter's `map` API:

  ```javascript
  App.Adapter.map('App.Person', {
    firstName: { key: '*API_USER_FIRST_NAME*' }
  });
  ```

  This API will also work for relationships and primary keys. For
  example:

  ```javascript
  App.Adapter.map('App.Person', {
    primaryKey: '_id'
  });
  ```

  ## Serialization

  During the serialization process, a record or records are converted
  from Ember.js objects into their serialized form.

  These methods are designed in layers, like a delicious 7-layer
  cake (but with fewer layers).

  The main entry point for serialization is the `serialize`
  method, which takes the record and options.

  The `serialize` method is responsible for:

  * turning the record's attributes (`DS.attr`) into
    attributes on the JSON object.
  * optionally adding the record's ID onto the hash
  * adding relationships (`DS.hasMany` and `DS.belongsTo`)
    to the JSON object.

  Depending on the backend, the serializer can choose
  whether to include the `hasMany` or `belongsTo`
  relationships on the JSON hash.

  For very custom serialization, you can implement your
  own `serialize` method. In general, however, you will want
  to override the hooks described below.

  ### Adding the ID

  The default `serialize` will optionally call your serializer's
  `addId` method with the JSON hash it is creating, the
  record's type, and the record's ID. The `serialize` method
  will not call `addId` if the record's ID is undefined.

  Your adapter must specifically request ID inclusion by
  passing `{ includeId: true }` as an option to `serialize`.

  NOTE: You may not want to include the ID when updating an
  existing record, because your server will likely disallow
  changing an ID after it is created, and the PUT request
  itself will include the record's identification.

  By default, `addId` will:

  1. Get the primary key name for the record by calling
     the serializer's `primaryKey` with the record's type.
     Unless you override the `primaryKey` method, this
     will be `'id'`.
  2. Assign the record's ID to the primary key in the
     JSON hash being built.

  If your backend expects a JSON object with the primary
  key at the root, you can just override the `primaryKey`
  method on your serializer subclass.

  Otherwise, you can override the `addId` method for
  more specialized handling.

  ### Adding Attributes

  By default, the serializer's `serialize` method will call
  `addAttributes` with the JSON object it is creating
  and the record to serialize.

  The `addAttributes` method will then call `addAttribute`
  in turn, with the JSON object, the record to serialize,
  the attribute's name and its type.

  Finally, the `addAttribute` method will serialize the
  attribute:

  1. It will call `keyForAttributeName` to determine
     the key to use in the JSON hash.
  2. It will get the value from the record.
  3. It will call `serializeValue` with the attribute's
     value and attribute type to convert it into a
     JSON-compatible value. For example, it will convert a
     Date into a String.

  If your backend expects a JSON object with attributes as
  keys at the root, you can just override the `serializeValue`
  and `keyForAttributeName` methods in your serializer
  subclass and let the base class do the heavy lifting.

  If you need something more specialized, you can probably
  override `addAttribute` and let the default `addAttributes`
  handle the nitty gritty.

  ### Adding Relationships

  By default, `serialize` will call your serializer's
  `addRelationships` method with the JSON object that is
  being built and the record being serialized. The default
  implementation of this method is to loop over all of the
  relationships defined on your record type and:

  * If the relationship is a `DS.hasMany` relationship,
    call `addHasMany` with the JSON object, the record
    and a description of the relationship.
  * If the relationship is a `DS.belongsTo` relationship,
    call `addBelongsTo` with the JSON object, the record
    and a description of the relationship.

  The relationship description has the following keys:

  * `type`: the class of the associated information (the
    first parameter to `DS.hasMany` or `DS.belongsTo`)
  * `kind`: either `hasMany` or `belongsTo`

  The relationship description may get additional
  information in the future if more capabilities or
  relationship types are added. However, it will
  remain backwards-compatible, so the mere existence
  of new features should not break existing adapters.

  @class Serializer
  @namespace DS
  @extends Ember.Object
*/

DS.Serializer = Ember.Object.extend({
  init: function() {
    this.mappings = Ember.Map.create();
    this.aliases = Ember.Map.create();
    this.configurations = Ember.Map.create();
    this.globalConfigurations = {};
  },

  extract: mustImplement('extract'),
  extractMany: mustImplement('extractMany'),
  extractId: mustImplement('extractId'),
  extractAttribute: mustImplement('extractAttribute'),
  extractHasMany: mustImplement('extractHasMany'),
  extractBelongsTo: mustImplement('extractBelongsTo'),

  extractRecordRepresentation: function(loader, type, data, shouldSideload) {
    var prematerialized = {}, reference;

    if (shouldSideload) {
      reference = loader.sideload(type, data);
    } else {
      reference = loader.load(type, data);
    }

    this.eachEmbeddedHasMany(type, function(name, relationship) {
      var embeddedData = this.extractEmbeddedData(data, this.keyFor(relationship));
      if (!isNone(embeddedData)) {
        this.extractEmbeddedHasMany(loader, relationship, embeddedData, reference, prematerialized);
      }
    }, this);

    this.eachEmbeddedBelongsTo(type, function(name, relationship) {
      var embeddedData = this.extractEmbeddedData(data, this.keyFor(relationship));
      if (!isNone(embeddedData)) {
        this.extractEmbeddedBelongsTo(loader, relationship, embeddedData, reference, prematerialized);
      }
    }, this);

    loader.prematerialize(reference, prematerialized);

    return reference;
  },

  extractEmbeddedHasMany: function(loader, relationship, array, parent, prematerialized) {
    var references = map.call(array, function(item) {
      if (!item) { return; }

      var foundType = this.extractEmbeddedType(relationship, item),
          reference = this.extractRecordRepresentation(loader, foundType, item, true);

      // If the embedded record should also be saved back when serializing the parent,
      // make sure we set its parent since it will not have an ID.
      var embeddedType = this.embeddedType(parent.type, relationship.key);
      if (embeddedType === 'always') {
        reference.parent = parent;
      }

      // If the embedded children have an inverse belongs-to, set the
      // inverse to the current record in their prematerialized data.
      var parentType = relationship.parentType,
          inverse = parentType.inverseFor(relationship.key);

      if (inverse) {
        var inverseName = inverse.name;
        reference.prematerialized[inverseName] = parent;
      }

      return reference;
    }, this);

    prematerialized[relationship.key] = references;
  },

  extractEmbeddedBelongsTo: function(loader, relationship, data, parent, prematerialized) {
    var foundType = this.extractEmbeddedType(relationship, data),
        reference = this.extractRecordRepresentation(loader, foundType, data, true);
    prematerialized[relationship.key] = reference;

    // If the embedded record should also be saved back when serializing the parent,
    // make sure we set its parent since it will not have an ID.
    var embeddedType = this.embeddedType(parent.type, relationship.key);
    if (embeddedType === 'always') {
      reference.parent = parent;
    }
  },

  /**
    A hook you can use to customize how the record's type is extracted from
    the serialized data.

    The `extractEmbeddedType` hook is called with:

    * the relationship
    * the serialized representation of the record

    By default, it returns the type of the relationship.

    @method extractEmbeddedType
    @param {Object} relationship an object representing the relationship
    @param {any} data the serialized representation of the record
  */
  extractEmbeddedType: function(relationship, data) {
    return relationship.type;
  },

  /**
    A hook you need to implement in order to extract
    the data associated with an embedded record.

    @method extractEmbeddedData
    @param {any} data the serialized representation of the record
    @param {String} key the key that represents the embedded record
   */
  extractEmbeddedData: mustImplement(),

  //.......................
  //. SERIALIZATION HOOKS
  //.......................

  /**
    The main entry point for serializing a record. While you can consider this
    a hook that can be overridden in your serializer, you will have to manually
    handle serialization. For most cases, there are more granular hooks that you
    can override.

    If overriding this method, these are the responsibilities that you will need
    to implement yourself:

    * If the option hash contains `includeId`, add the record's ID to the serialized form.
      By default, `serialize` calls `addId` if appropriate.
    * If the option hash contains `includeType`, add the record's type to the serialized form.
    * Add the record's attributes to the serialized form. By default, `serialize` calls
      `addAttributes`.
    * Add the record's relationships to the serialized form. By default, `serialize` calls
      `addRelationships`.

    @method serialize
    @param {DS.Model} record the record to serialize
    @param {Object} [options] a hash of options
    @returns {any} the serialized form of the record
  */
  serialize: function(record, options) {
    options = options || {};

    var serialized = this.createSerializedForm(), id;

    if (options.includeId) {
      if (id = get(record, 'id')) {
        this._addId(serialized, record.constructor, id);
      }
    }

    if (options.includeType) {
      this.addType(serialized, record.constructor);
    }

    this.addAttributes(serialized, record);
    this.addRelationships(serialized, record);

    return serialized;
  },

  /**
    Given an attribute type and value, convert the value into the
    serialized form using the transform registered for that type.

    @method serializeValue
    @private
    @param {any} value the value to convert to the serialized form
    @param {String} attributeType the registered type (e.g. `string`
      or `boolean`)
    @returns {any} the serialized form of the value
  */
  serializeValue: function(value, attributeType) {
    var transform = this.transforms ? this.transforms[attributeType] : null;

    Ember.assert("You tried to use an attribute type (" + attributeType + ") that has not been registered", transform);
    return transform.serialize(value);
  },

  /**
    A hook you can use to normalize IDs before adding them to the
    serialized representation.

    Because the store coerces all IDs to strings for consistency,
    this is the opportunity for the serializer to, for example,
    convert numerical IDs back into number form.

    Null or undefined ids will resolve to a null value.

    @method serializeId
    @param {String} id the id from the record
    @returns {any} the serialized representation of the id
  */
  serializeId: function(id) {
    if(Ember.isEmpty(id)) { return null; }
    if(isNaN(+id)) { return id; }
    return +id;
  },

  /**
    A hook you can use to change how attributes are added to the serialized
    representation of a record.

    By default, `addAttributes` simply loops over all of the attributes of the
    passed record, maps the attribute name to the key for the serialized form,
    and invokes any registered transforms on the value. It then invokes the
    more granular `addAttribute` with the key and transformed value.

    Since you can override `keyForAttributeName`, `addAttribute`, and register
    custom transforms, you should rarely need to override this hook.

    @method addAttributes
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
  */
  addAttributes: function(data, record) {
    record.eachAttribute(function(name, attribute) {
      this._addAttribute(data, record, name, attribute.type);
    }, this);
  },

  /**
    A hook you can use to customize how the key/value pair is added to
    the serialized data.

    @method addAttribute
    @param {any} serialized the serialized form being built
    @param {String} key the key to add to the serialized data
    @param {any} value the value to add to the serialized data
  */
  addAttribute: mustImplement('addAttribute'),

  /**
    A hook you can use to customize how the record's id is added to
    the serialized data.

    The `addId` hook is called with:

    * the serialized representation being built
    * the resolved primary key (taking configurations and the
      `primaryKey` hook into consideration)
    * the serialized id (after calling the `serializeId` hook)

    @method addId
    @param {any} data the serialized representation that is being built
    @param {String} key the resolved primary key
    @param {id} id the serialized id
  */
  addId: mustImplement('addId'),

  /**
    A hook you can use to customize how the record's type is added to
    the serialized data.

    The `addType` hook is called with:

    * the serialized representation being built
    * the serialized id (after calling the `serializeId` hook)

    @method addType
    @param {any} data the serialized representation that is being built
    @param {DS.Model subclass} type the type of the record
  */
  addType: Ember.K,

  /**
    Creates an empty hash that will be filled in by the hooks called from the
    `serialize()` method.

    @method createSerializedForm
    @return {Object}
  */
  createSerializedForm: function() {
    return {};
  },

  /**
    A hook you can use to change how relationships are added to the serialized
    representation of a record.

    By default, `addRelationships` loops over all of the relationships of the
    passed record, maps the relationship names to the key for the serialized form,
    and then invokes the public `addBelongsTo` and `addHasMany` hooks.

    Since you can override `keyForBelongsTo`, `keyForHasMany`, `addBelongsTo`,
    `addHasMany`, and register mappings, you should rarely need to override this
    hook.

    @method addRelationships
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
  */
  addRelationships: function(data, record) {
    record.eachRelationship(function(name, relationship) {
      if (relationship.kind === 'belongsTo') {
        this._addBelongsTo(data, record, name, relationship);
      } else if (relationship.kind === 'hasMany') {
        this._addHasMany(data, record, name, relationship);
      }
    }, this);
  },

  /**
    A hook you can use to add a `belongsTo` relationship to the
    serialized representation.

    The specifics of this hook are very adapter-specific, so there
    is no default implementation. You can see `DS.JSONSerializer`
    for an example of an implementation of the `addBelongsTo` hook.

    The `belongsTo` relationship object has the following properties:

    * **type** a subclass of DS.Model that is the type of the
      relationship. This is the first parameter to DS.belongsTo
    * **options** the options passed to the call to DS.belongsTo
    * **kind** always `belongsTo`

    Additional properties may be added in the future.

    @method addBelongsTo
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
    @param {String} key the key for the serialized object
    @param {Object} relationship an object representing the relationship
  */
  addBelongsTo: mustImplement('addBelongsTo'),

  /**
    A hook you can use to add a `hasMany` relationship to the
    serialized representation.

    The specifics of this hook are very adapter-specific, so there
    is no default implementation. You may not need to implement this,
    for example, if your backend only expects relationships on the
    child of a one to many relationship.

    The `hasMany` relationship object has the following properties:

    * **type** a subclass of DS.Model that is the type of the
      relationship. This is the first parameter to DS.hasMany
    * **options** the options passed to the call to DS.hasMany
    * **kind** always `hasMany`

    Additional properties may be added in the future.

    @method addHasMany
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
    @param {String} key the key for the serialized object
    @param {Object} relationship an object representing the relationship
  */
  addHasMany: mustImplement('addHasMany'),

  /*
    NAMING CONVENTIONS

    The most commonly overridden APIs of the serializer are
    the naming convention methods:

    * `keyForAttributeName`: converts a camelized attribute name
      into a key in the adapter-provided data hash. For example,
      if the model's attribute name was `firstName`, and the
      server used underscored names, you would return `first_name`.
    * `primaryKey`: returns the key that should be used to
      extract the id from the adapter-provided data hash. It is
      also used when serializing a record.
  */

  /**
    A hook you can use in your serializer subclass to customize
    how an unmapped attribute name is converted into a key.

    By default, this method returns the `name` parameter.

    For example, if the attribute names in your JSON are underscored,
    you will want to convert them into JavaScript conventional
    camelcase:

    ```javascript
    App.MySerializer = DS.Serializer.extend({
      // ...

      keyForAttributeName: function(type, name) {
        return name.camelize();
      }
    });
    ```

    @method keyForAttributeName
    @param {DS.Model subclass} type the type of the record with
      the attribute name `name`
    @param {String} name the attribute name to convert into a key

    @returns {String} the key
  */
  keyForAttributeName: function(type, name) {
    return name;
  },

  /**
    A hook you can use in your serializer to specify a conventional
    primary key.

    By default, this method will return the string `id`.

    In general, you should not override this hook to specify a special
    primary key for an individual type; use `configure` instead.

    For example, if your primary key is always `__id__`:

    ```javascript
    App.MySerializer = DS.Serializer.extend({
      // ...
      primaryKey: function(type) {
        return '__id__';
      }
    });
    ```

    In another example, if the primary key always includes the
    underscored version of the type before the string `id`:

    ```javascript
    App.MySerializer = DS.Serializer.extend({
      // ...
      primaryKey: function(type) {
        // If the type is `BlogPost`, this will return
        // `blog_post_id`.
        var typeString = type.toString().split(".")[1].underscore();
        return typeString + "_id";
      }
    });
    ```

    @method primaryKey
    @param {DS.Model subclass} type
    @returns {String} the primary key for the type
  */
  primaryKey: function(type) {
    return "id";
  },

  /**
    A hook you can use in your serializer subclass to customize
    how an unmapped `belongsTo` relationship is converted into
    a key.

    By default, this method calls `keyForAttributeName`, so if
    your naming convention is uniform across attributes and
    relationships, you can use the default here and override
    just `keyForAttributeName` as needed.

    For example, if the `belongsTo` names in your JSON always
    begin with `BT_` (e.g. `BT_posts`), you can strip out the
    `BT_` prefix:"

    ```javascript
    App.MySerializer = DS.Serializer.extend({
      // ...
      keyForBelongsTo: function(type, name) {
        return name.match(/^BT_(.*)$/)[1].camelize();
      }
    });
    ```

    @method keyForBelongsTo
    @param {DS.Model subclass} type the type of the record with
      the `belongsTo` relationship.
    @param {String} name the relationship name to convert into a key

    @returns {String} the key
  */
  keyForBelongsTo: function(type, name) {
    return this.keyForAttributeName(type, name);
  },

  /**
    A hook you can use in your serializer subclass to customize
    how an unmapped `hasMany` relationship is converted into
    a key.

    By default, this method calls `keyForAttributeName`, so if
    your naming convention is uniform across attributes and
    relationships, you can use the default here and override
    just `keyForAttributeName` as needed.

    For example, if the `hasMany` names in your JSON always
    begin with the "table name" for the current type (e.g.
    `post_comments`), you can strip out the prefix:"

    ```javascript
    App.MySerializer = DS.Serializer.extend({
      // ...
      keyForHasMany: function(type, name) {
        // if your App.BlogPost has many App.BlogComment, the key from
        // the server would look like: `blog_post_blog_comments`
        //
        // 1. Convert the type into a string and underscore the
        //    second part (App.BlogPost -> blog_post)
        // 2. Extract the part after `blog_post_` (`blog_comments`)
        // 3. Underscore it, to become `blogComments`
        var typeString = type.toString().split(".")[1].underscore();
        return name.match(new RegExp("^" + typeString + "_(.*)$"))[1].camelize();
      }
    });
    ```

    @method keyForHasMany
    @param {DS.Model subclass} type the type of the record with
      the `belongsTo` relationship.
    @param {String} name the relationship name to convert into a key

    @returns {String} the key
  */
  keyForHasMany: function(type, name) {
    return this.keyForAttributeName(type, name);
  },

  //.........................
  //. MATERIALIZATION HOOKS
  //.........................

  materialize: function(record, serialized, prematerialized) {
    var id;
    if (Ember.isNone(get(record, 'id'))) {
      if (prematerialized && prematerialized.hasOwnProperty('id')) {
        id = prematerialized.id;
      } else {
        id = this.extractId(record.constructor, serialized);
      }
      record.materializeId(id);
    }

    this.materializeAttributes(record, serialized, prematerialized);
    this.materializeRelationships(record, serialized, prematerialized);
  },

  deserializeValue: function(value, attributeType) {
    var transform = this.transforms ? this.transforms[attributeType] : null;

    Ember.assert("You tried to use an attribute type (" + attributeType + ") that has not been registered", transform);
    return transform.deserialize(value);
  },

  materializeAttributes: function(record, serialized, prematerialized) {
    record.eachAttribute(function(name, attribute) {
      if (prematerialized && prematerialized.hasOwnProperty(name)) {
        record.materializeAttribute(name, prematerialized[name]);
      } else {
        this.materializeAttribute(record, serialized, name, attribute.type);
      }
    }, this);
  },

  materializeAttribute: function(record, serialized, attributeName, attributeType) {
    var value = this.extractAttribute(record.constructor, serialized, attributeName);
    value = this.deserializeValue(value, attributeType);

    record.materializeAttribute(attributeName, value);
  },

  materializeRelationships: function(record, serialized, prematerialized) {
    record.eachRelationship(function(name, relationship) {
      if (relationship.kind === 'hasMany') {
        if (prematerialized && prematerialized.hasOwnProperty(name)) {
          var tuplesOrReferencesOrOpaque = this._convertPrematerializedHasMany(relationship.type, prematerialized[name]);
          record.materializeHasMany(name, tuplesOrReferencesOrOpaque);
        } else {
          this.materializeHasMany(name, record, serialized, relationship, prematerialized);
        }
      } else if (relationship.kind === 'belongsTo') {
        if (prematerialized && prematerialized.hasOwnProperty(name)) {
          var tupleOrReference = this._convertTuple(relationship.type, prematerialized[name]);
          record.materializeBelongsTo(name, tupleOrReference);
        } else {
          this.materializeBelongsTo(name, record, serialized, relationship, prematerialized);
        }
      }
    }, this);
  },

  materializeHasMany: function(name, record, hash, relationship) {
    var type = record.constructor,
        key = this._keyForHasMany(type, relationship.key),
        idsOrTuples = this.extractHasMany(type, hash, key),
        tuples = idsOrTuples;

    if(idsOrTuples && Ember.isArray(idsOrTuples)) {
      tuples = this._convertTuples(relationship.type, idsOrTuples);
    }

    record.materializeHasMany(name, tuples);
  },

  materializeBelongsTo: function(name, record, hash, relationship) {
    var type = record.constructor,
        key = this._keyForBelongsTo(type, relationship.key),
        idOrTuple,
        tuple = null;

    if(relationship.options && relationship.options.polymorphic) {
      idOrTuple = this.extractBelongsToPolymorphic(type, hash, key);
    } else {
      idOrTuple = this.extractBelongsTo(type, hash, key);
    }

    if(!isNone(idOrTuple)) {
      tuple = this._convertTuple(relationship.type, idOrTuple);
    }

    record.materializeBelongsTo(name, tuple);
  },

  _convertPrematerializedHasMany: function(type, prematerializedHasMany) {
    var tuplesOrReferencesOrOpaque;
    if( typeof prematerializedHasMany === 'string' ) {
      tuplesOrReferencesOrOpaque = prematerializedHasMany;
    } else {
      tuplesOrReferencesOrOpaque = this._convertTuples(type, prematerializedHasMany);
    }
    return tuplesOrReferencesOrOpaque;
  },

  _convertTuples: function(type, idsOrTuples) {
    return map.call(idsOrTuples, function(idOrTuple) {
      return this._convertTuple(type, idOrTuple);
    }, this);
  },

  _convertTuple: function(type, idOrTuple) {
    var foundType;

    if (typeof idOrTuple === 'object') {
      if (DS.Model.detect(idOrTuple.type)) {
        return idOrTuple;
      } else {
        foundType = this.typeFromAlias(idOrTuple.type);
        Ember.assert("Unable to resolve type " + idOrTuple.type + ".  You may need to configure your serializer aliases.", !!foundType);

        return {id: idOrTuple.id, type: foundType};
      }
    }
    return {id: idOrTuple, type: type};
  },

  /**
    This method is called to get the primary key for a given
    type.

    If a primary key configuration exists for this type, this
    method will return the configured value. Otherwise, it will
    call the public `primaryKey` hook.

    @method _primaryKey
    @private
    @param {DS.Model subclass} type
    @returns {String} the primary key for the type
  */
  _primaryKey: function(type) {
    var config = this.configurationForType(type),
        primaryKey = config && config.primaryKey;

    if (primaryKey) {
      return primaryKey;
    } else {
      return this.primaryKey(type);
    }
  },

  /**
    This method looks up the key for the attribute name and transforms the
    attribute's value using registered transforms.

    Specifically:

    1. Look up the key for the attribute name. If available, this will use
       any registered mappings. Otherwise, it will invoke the public
       `keyForAttributeName` hook.
    2. Get the value from the record using the `attributeName`.
    3. Transform the value using registered transforms for the `attributeType`.
    4. Invoke the public `addAttribute` hook with the hash, key, and
       transformed value.

    @method _addAttribute
    @private
    @param {any} data the serialized representation being built
    @param {DS.Model} record the record to serialize
    @param {String} attributeName the name of the attribute on the record
    @param {String} attributeType the type of the attribute (e.g. `string`
      or `boolean`)
  */
  _addAttribute: function(data, record, attributeName, attributeType) {
    var key = this._keyForAttributeName(record.constructor, attributeName);
    var value = get(record, attributeName);

    this.addAttribute(data, key, this.serializeValue(value, attributeType));
  },

  /**
    This method looks up the primary key for the `type` and invokes
    `serializeId` on the `id`.

    It then invokes the public `addId` hook with the primary key and
    the serialized id.

    @method _addId
    @private
    @param {any} data the serialized representation that is being built
    @param {DS.Model subclass} type
    @param {any} id the materialized id from the record
  */
  _addId: function(hash, type, id) {
    var primaryKey = this._primaryKey(type);

    this.addId(hash, primaryKey, this.serializeId(id));
  },

  /**
    This method is called to get a key used in the data from
    an attribute name. It first checks for any mappings before
    calling the public hook `keyForAttributeName`.

    @method _keyForAttributeName
    @private
    @param {DS.Model subclass} type the type of the record with
      the attribute name `name`
    @param {String} name the attribute name to convert into a key

    @returns {String} the key
  */
  _keyForAttributeName: function(type, name) {
    return this._keyFromMappingOrHook('keyForAttributeName', type, name);
  },

  /**
    This method is called to get a key used in the data from
    a belongsTo relationship. It first checks for any mappings before
    calling the public hook `keyForBelongsTo`.

    @method _keyForBelongsTo
    @private
    @param {DS.Model subclass} type the type of the record with
      the `belongsTo` relationship.
    @param {String} name the relationship name to convert into a key

    @returns {String} the key
  */
  _keyForBelongsTo: function(type, name) {
    return this._keyFromMappingOrHook('keyForBelongsTo', type, name);
  },

  keyFor: function(description) {
    var type = description.parentType,
        name = description.key;

    switch (description.kind) {
      case 'belongsTo':
        return this._keyForBelongsTo(type, name);
      case 'hasMany':
        return this._keyForHasMany(type, name);
    }
  },

  /**
    This method is called to get a key used in the data from
    a hasMany relationship. It first checks for any mappings before
    calling the public hook `keyForHasMany`.

    @method _keyForHasMany
    @private
    @param {DS.Model subclass} type the type of the record with
      the `hasMany` relationship.
    @param {String} name the relationship name to convert into a key

    @returns {String} the key
  */
  _keyForHasMany: function(type, name) {
    return this._keyFromMappingOrHook('keyForHasMany', type, name);
  },

  /**
    This method converts the relationship name to a key for serialization,
    and then invokes the public `addBelongsTo` hook.

    @method _addBelongsTo
    @private
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
    @param {String} name the relationship name
    @param {Object} relationship an object representing the relationship
  */
  _addBelongsTo: function(data, record, name, relationship) {
    var key = this._keyForBelongsTo(record.constructor, name);
    this.addBelongsTo(data, record, key, relationship);
  },

  /**
    This method converts the relationship name to a key for serialization,
    and then invokes the public `addHasMany` hook.

    @method _addHasMany
    @private
    @param {any} data the serialized representation that is being built
    @param {DS.Model} record the record to serialize
    @param {String} name the relationship name
    @param {Object} relationship an object representing the relationship
  */
  _addHasMany: function(data, record, name, relationship) {
    var key = this._keyForHasMany(record.constructor, name);
    this.addHasMany(data, record, key, relationship);
  },

  /**
    An internal method that handles checking whether a mapping
    exists for a particular attribute or relationship name before
    calling the public hooks.

    If a mapping is found, and the mapping has a key defined,
    use that instead of invoking the hook.

    @method _keyFromMappingOrHook
    @private
    @param {String} publicMethod the public hook to invoke if
      a mapping is not found (e.g. `keyForAttributeName`)
    @param {DS.Model subclass} type the type of the record with
      the attribute or relationship name.
    @param {String} name the attribute or relationship name to
      convert into a key
  */
  _keyFromMappingOrHook: function(publicMethod, type, name) {
    var key = this.mappingOption(type, name, 'key');

    if (key) {
      return key;
    } else {
      return this[publicMethod](type, name);
    }
  },

  /* TRANSFORMS */

  registerTransform: function(type, transform) {
    this.transforms[type] = transform;
  },

  registerEnumTransform: function(type, objects) {
    var transform = {
      deserialize: function(serialized) {
        return Ember.A(objects).objectAt(serialized);
      },
      serialize: function(deserialized) {
        return Ember.EnumerableUtils.indexOf(objects, deserialized);
      },
      values: objects
    };
    this.registerTransform(type, transform);
  },

  /* MAPPING CONVENIENCE */

  map: function(type, mappings) {
    this.mappings.set(type, mappings);
  },

  configure: function(type, configuration) {
    if (type && !configuration) {
      Ember.merge(this.globalConfigurations, type);
      return;
    }

    var config, alias;

    if (configuration.alias) {
      alias = configuration.alias;
      this.aliases.set(alias, type);
      delete configuration.alias;
    }

    config = Ember.create(this.globalConfigurations);
    Ember.merge(config, configuration);

    this.configurations.set(type, config);
  },

  typeFromAlias: function(alias) {
    this._completeAliases();
    return this.aliases.get(alias);
  },

  mappingForType: function(type) {
    this._reifyMappings();
    return this.mappings.get(type) || {};
  },

  configurationForType: function(type) {
    this._reifyConfigurations();
    return this.configurations.get(type) || this.globalConfigurations;
  },

  _completeAliases: function() {
    this._pluralizeAliases();
    this._reifyAliases();
  },

  _pluralizeAliases: function() {
    if (this._didPluralizeAliases) { return; }

    var aliases = this.aliases,
        sideloadMapping = this.aliases.sideloadMapping,
        plural,
        self = this;

    aliases.forEach(function(key, type) {
      plural = self.pluralize(key);
      Ember.assert("The '" + key + "' alias has already been defined", !aliases.get(plural));
      aliases.set(plural, type);
    });

    // This map is only for backward compatibility with the `sideloadAs` option.
    if (sideloadMapping) {
      sideloadMapping.forEach(function(key, type) {
        Ember.assert("The '" + key + "' alias has already been defined", !aliases.get(key) || (aliases.get(key)===type) );
        aliases.set(key, type);
      });
      delete this.aliases.sideloadMapping;
    }

    this._didPluralizeAliases = true;
  },

  _reifyAliases: function() {
    if (this._didReifyAliases) { return; }

    var aliases = this.aliases,
        reifiedAliases = Ember.Map.create(),
        foundType;

    aliases.forEach(function(key, type) {
      if (typeof type === 'string') {
        foundType = Ember.get(Ember.lookup, type);
        Ember.assert("Could not find model at path " + key, type);

        reifiedAliases.set(key, foundType);
      } else {
        reifiedAliases.set(key, type);
      }
    });

    this.aliases = reifiedAliases;
    this._didReifyAliases = true;
  },

  _reifyMappings: function() {
    if (this._didReifyMappings) { return; }

    var mappings = this.mappings,
        reifiedMappings = Ember.Map.create();

    mappings.forEach(function(key, mapping) {
      if (typeof key === 'string') {
        var type = Ember.get(Ember.lookup, key);
        Ember.assert("Could not find model at path " + key, type);

        reifiedMappings.set(type, mapping);
      } else {
        reifiedMappings.set(key, mapping);
      }
    });

    this.mappings = reifiedMappings;

    this._didReifyMappings = true;
  },

  _reifyConfigurations: function() {
    if (this._didReifyConfigurations) { return; }

    var configurations = this.configurations,
        reifiedConfigurations = Ember.Map.create();

    configurations.forEach(function(key, mapping) {
      if (typeof key === 'string' && key !== 'plurals') {
        var type = Ember.get(Ember.lookup, key);
        Ember.assert("Could not find model at path " + key, type);

        reifiedConfigurations.set(type, mapping);
      } else {
        reifiedConfigurations.set(key, mapping);
      }
    });

    this.configurations = reifiedConfigurations;

    this._didReifyConfigurations = true;
  },

  mappingOption: function(type, name, option) {
    var mapping = this.mappingForType(type)[name];

    return mapping && mapping[option];
  },

  configOption: function(type, option) {
    var config = this.configurationForType(type);

    return config[option];
  },

  // EMBEDDED HELPERS

  embeddedType: function(type, name) {
    return this.mappingOption(type, name, 'embedded');
  },

  eachEmbeddedRecord: function(record, callback, binding) {
    this.eachEmbeddedBelongsToRecord(record, callback, binding);
    this.eachEmbeddedHasManyRecord(record, callback, binding);
  },

  eachEmbeddedBelongsToRecord: function(record, callback, binding) {
    this.eachEmbeddedBelongsTo(record.constructor, function(name, relationship, embeddedType) {
      var embeddedRecord = get(record, name);
      if (embeddedRecord) { callback.call(binding, embeddedRecord, embeddedType); }
    });
  },

  eachEmbeddedHasManyRecord: function(record, callback, binding) {
    this.eachEmbeddedHasMany(record.constructor, function(name, relationship, embeddedType) {
      var array = get(record, name);
      for (var i=0, l=get(array, 'length'); i<l; i++) {
        callback.call(binding, array.objectAt(i), embeddedType);
      }
    });
  },

  eachEmbeddedHasMany: function(type, callback, binding) {
    this.eachEmbeddedRelationship(type, 'hasMany', callback, binding);
  },

  eachEmbeddedBelongsTo: function(type, callback, binding) {
    this.eachEmbeddedRelationship(type, 'belongsTo', callback, binding);
  },

  eachEmbeddedRelationship: function(type, kind, callback, binding) {
    type.eachRelationship(function(name, relationship) {
      var embeddedType = this.embeddedType(type, name);

      if (embeddedType) {
        if (relationship.kind === kind) {
          callback.call(binding, name, relationship, embeddedType);
        }
      }
    }, this);
  },

  // HELPERS

  // define a plurals hash in your subclass to define
  // special-case pluralization
  pluralize: function(name) {
    var plurals = this.configurations.get('plurals');
    return (plurals && plurals[name]) || name + "s";
  },

  // use the same plurals hash to determine
  // special-case singularization
  singularize: function(name) {
    var plurals = this.configurations.get('plurals');
    if (plurals) {
      for (var i in plurals) {
        if (plurals[i] === name) {
          return i;
        }
      }
    }
    if (name.lastIndexOf('s') === name.length - 1) {
      return name.substring(0, name.length - 1);
    } else {
      return name;
    }
  }
});


})();



(function() {
/**
  @module ember-data
*/

var isNone = Ember.isNone, isEmpty = Ember.isEmpty;

/**
  DS.JSONTransforms is a hash of transforms used by DS.Serializer.

  @class JSONTransforms
  @static
  @namespace DS
*/
DS.JSONTransforms = {
  string: {
    deserialize: function(serialized) {
      return isNone(serialized) ? null : String(serialized);
    },

    serialize: function(deserialized) {
      return isNone(deserialized) ? null : String(deserialized);
    }
  },

  number: {
    deserialize: function(serialized) {
      return isEmpty(serialized) ? null : Number(serialized);
    },

    serialize: function(deserialized) {
      return isEmpty(deserialized) ? null : Number(deserialized);
    }
  },

  // Handles the following boolean inputs:
  // "TrUe", "t", "f", "FALSE", 0, (non-zero), or boolean true/false
  'boolean': {
    deserialize: function(serialized) {
      var type = typeof serialized;

      if (type === "boolean") {
        return serialized;
      } else if (type === "string") {
        return serialized.match(/^true$|^t$|^1$/i) !== null;
      } else if (type === "number") {
        return serialized === 1;
      } else {
        return false;
      }
    },

    serialize: function(deserialized) {
      return Boolean(deserialized);
    }
  },

  date: {
    deserialize: function(serialized) {
      var type = typeof serialized;

      if (type === "string") {
        return new Date(Ember.Date.parse(serialized));
      } else if (type === "number") {
        return new Date(serialized);
      } else if (serialized === null || serialized === undefined) {
        // if the value is not present in the data,
        // return undefined, not null.
        return serialized;
      } else {
        return null;
      }
    },

    serialize: function(date) {
      if (date instanceof Date) {
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var pad = function(num) {
          return num < 10 ? "0"+num : ""+num;
        };

        var utcYear = date.getUTCFullYear(),
            utcMonth = date.getUTCMonth(),
            utcDayOfMonth = date.getUTCDate(),
            utcDay = date.getUTCDay(),
            utcHours = date.getUTCHours(),
            utcMinutes = date.getUTCMinutes(),
            utcSeconds = date.getUTCSeconds();


        var dayOfWeek = days[utcDay];
        var dayOfMonth = pad(utcDayOfMonth);
        var month = months[utcMonth];

        return dayOfWeek + ", " + dayOfMonth + " " + month + " " + utcYear + " " +
               pad(utcHours) + ":" + pad(utcMinutes) + ":" + pad(utcSeconds) + " GMT";
      } else {
        return null;
      }
    }
  }
};

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;

/**
  @class JSONSerializer
  @namespace DS
  @extends DS.Serializer
*/
DS.JSONSerializer = DS.Serializer.extend({
  init: function() {
    this._super();

    if (!get(this, 'transforms')) {
      this.set('transforms', DS.JSONTransforms);
    }

    this.sideloadMapping = Ember.Map.create();
    this.metadataMapping = Ember.Map.create();

    this.configure({
      meta: 'meta',
      since: 'since'
    });
  },

  /**
    @method configure
    @param  type
    @param  configuration
  */
  configure: function(type, configuration) {
    var key;

    if (type && !configuration) {
      for(key in type){
        this.metadataMapping.set(get(type, key), key);
      }

      return this._super(type);
    }

    var sideloadAs = configuration.sideloadAs,
        sideloadMapping;

    if (sideloadAs) {
      sideloadMapping = this.aliases.sideloadMapping || Ember.Map.create();
      sideloadMapping.set(sideloadAs, type);
      this.aliases.sideloadMapping = sideloadMapping;
      delete configuration.sideloadAs;
    }

    this._super.apply(this, arguments);
  },

  /**
    @method addId
    @param data
    @param key
    @param id
  */
  addId: function(data, key, id) {
    data[key] = id;
  },

  /**
    A hook you can use to customize how the key/value pair is added to
    the serialized data.

    @method addAttribute
    @param {any} hash the JSON hash being built
    @param {String} key the key to add to the serialized data
    @param {any} value the value to add to the serialized data
  */
  addAttribute: function(hash, key, value) {
    hash[key] = value;
  },

  /**
    @method extractAttribute
    @param type
    @param hash
    @param attributeName
  */
  extractAttribute: function(type, hash, attributeName) {
    var key = this._keyForAttributeName(type, attributeName);
    return hash[key];
  },

  /**
    @method extractId
    @param type
    @param hash
  */
  extractId: function(type, hash) {
    var primaryKey = this._primaryKey(type);

    if (hash.hasOwnProperty(primaryKey)) {
      // Ensure that we coerce IDs to strings so that record
      // IDs remain consistent between application runs; especially
      // if the ID is serialized and later deserialized from the URL,
      // when type information will have been lost.
      return hash[primaryKey]+'';
    } else {
      return null;
    }
  },

  /**
    @method extractEmbeddedData
    @param hash
    @param key
  */
  extractEmbeddedData: function(hash, key) {
    return hash[key];
  },

  /**
    @method extractHasMany
    @param type
    @param hash
    @param key
  */
  extractHasMany: function(type, hash, key) {
    return hash[key];
  },

  /**
    @method extractBelongsTo
    @param type
    @param hash
    @param key
  */
  extractBelongsTo: function(type, hash, key) {
    return hash[key];
  },

  /**
    @method extractBelongsToPolymorphic
    @param type
    @param hash
    @param key
  */
  extractBelongsToPolymorphic: function(type, hash, key) {
    var keyForId = this.keyForPolymorphicId(key),
        keyForType,
        id = hash[keyForId];

    if (id) {
      keyForType = this.keyForPolymorphicType(key);
      return {id: id, type: hash[keyForType]};
    }

    return null;
  },

  /**
    @method addBelongsTo
    @param hash
    @param record
    @param key
    @param relationship
  */
  addBelongsTo: function(hash, record, key, relationship) {
    var type = record.constructor,
        name = relationship.key,
        value = null,
        includeType = (relationship.options && relationship.options.polymorphic),
        embeddedChild,
        child,
        id;

    if (this.embeddedType(type, name)) {
      if (embeddedChild = get(record, name)) {
        value = this.serialize(embeddedChild, { includeId: true, includeType: includeType });
      }

      hash[key] = value;
    } else {
      child = get(record, relationship.key);
      id = get(child, 'id');

      if (relationship.options && relationship.options.polymorphic && !Ember.isNone(id)) {
        this.addBelongsToPolymorphic(hash, key, id, child.constructor);
      } else {
        hash[key] = this.serializeId(id);
      }
    }
  },

  /**
    @method addBelongsToPolymorphic
    @param hash
    @param key
    @param id
    @param type
  */
  addBelongsToPolymorphic: function(hash, key, id, type) {
    var keyForId = this.keyForPolymorphicId(key),
        keyForType = this.keyForPolymorphicType(key);
    hash[keyForId] = id;
    hash[keyForType] = this.rootForType(type);
  },

  /**
    Adds a has-many relationship to the JSON hash being built.

    The default REST semantics are to only add a has-many relationship if it
    is embedded. If the relationship was initially loaded by ID, we assume that
    that was done as a performance optimization, and that changes to the
    has-many should be saved as foreign key changes on the child's belongs-to
    relationship.

    @method addHasMany
    @param {Object} hash the JSON being built
    @param {DS.Model} record the record being serialized
    @param {String} key the JSON key into which the serialized relationship
      should be saved
    @param {Object} relationship metadata about the relationship being serialized
  */

  addHasMany: function(hash, record, key, relationship) {
    var type = record.constructor,
        name = relationship.key,
        serializedHasMany = [],
        includeType = (relationship.options && relationship.options.polymorphic),
        manyArray, embeddedType;

    // If the has-many is not embedded, there is nothing to do.
    embeddedType = this.embeddedType(type, name);
    if (embeddedType !== 'always') { return; }

    // Get the DS.ManyArray for the relationship off the record
    manyArray = get(record, name);

    // Build up the array of serialized records
    manyArray.forEach(function (record) {
      serializedHasMany.push(this.serialize(record, { includeId: true, includeType: includeType }));
    }, this);

    // Set the appropriate property of the serialized JSON to the
    // array of serialized embedded records
    hash[key] = serializedHasMany;
  },

  /**
    @method addType
    @param hash
    @param type
  */
  addType: function(hash, type) {
    var keyForType = this.keyForEmbeddedType();
    hash[keyForType] = this.rootForType(type);
  },

  // EXTRACTION

  /**
    @method extract
    @param loader
    @param json
    @param type
    @param record
  */
  extract: function(loader, json, type, record) {
    var root = this.rootForType(type);

    this.sideload(loader, type, json, root);
    this.extractMeta(loader, type, json);

    if (json[root]) {
      if (record) { loader.updateId(record, json[root]); }
      this.extractRecordRepresentation(loader, type, json[root]);
    } else {
      Ember.Logger.warn("Extract requested, but no data given for " + type + ". This may cause weird problems.");
    }
  },

  /**
    @method extractMany
    @param loader
    @param json
    @param type
    @param records
  */
  extractMany: function(loader, json, type, records) {
    var root = this.rootForType(type);
    root = this.pluralize(root);

    this.sideload(loader, type, json, root);
    this.extractMeta(loader, type, json);

    if (json[root]) {
      var objects = json[root], references = [];
      if (records) { records = records.toArray(); }

      for (var i = 0; i < objects.length; i++) {
        if (records) { loader.updateId(records[i], objects[i]); }
        var reference = this.extractRecordRepresentation(loader, type, objects[i]);
        references.push(reference);
      }

      loader.populateArray(references);
    }
  },

  /**
    @method extractMeta
    @param loader
    @param type
    @param json
  */
  extractMeta: function(loader, type, json) {
    var meta = this.configOption(type, 'meta'),
        data = json, value;

    if(meta && json[meta]){
      data = json[meta];
    }

    this.metadataMapping.forEach(function(property, key){
      value = data[property];
      if(!Ember.isNone(value)){
        loader.metaForType(type, key, value);
      }
    });
  },

  /**
    @method extractEmbeddedType
    @param relationship
    @param data
  */
  extractEmbeddedType: function(relationship, data) {
    var foundType = relationship.type;
    if(relationship.options && relationship.options.polymorphic) {
      var key = this.keyFor(relationship),
          keyForEmbeddedType = this.keyForEmbeddedType(key);

      foundType = this.typeFromAlias(data[keyForEmbeddedType]);
      delete data[keyForEmbeddedType];
    }

    return foundType;
  },

  /**
    Iterates over the `json` payload and attempts to load any data
    included alongside `root`.

    The keys expected for sideloaded data are based upon the types related
    to the root model. Recursion is used to ensure that types related to
    related types can be loaded as well. Any custom keys specified by
    `sideloadAs` mappings will also be respected.

    @method sideload
    @private
    @param {DS.Store subclass} loader
    @param {DS.Model subclass} type
    @param {Object} json
    @param {String} root
  */
  sideload: function(loader, type, json, root) {
    var sideloadedType;

    this.configureSideloadMappingForType(type);

    for (var prop in json) {
      if (!json.hasOwnProperty(prop) ||
          prop === root ||
          !!this.metadataMapping.get(prop)) {
        continue;
      }

      sideloadedType = this.typeFromAlias(prop);
      Ember.assert("Your server returned a hash with the key " + prop + " but you have no mapping for it", !!sideloadedType);

      this.loadValue(loader, sideloadedType, json[prop]);
    }
  },

  /**
    Configures possible sideload mappings for the types related to a
    particular model. This recursive method ensures that sideloading
    works for related models as well.

    @method configureSideloadMappingForType
    @private
    @param {DS.Model subclass} type
    @param {Ember.A} configured an array of types that have already been configured
  */
  configureSideloadMappingForType: function(type, configured) {
    if (!configured) {configured = Ember.A();}
    configured.pushObject(type);

    type.eachRelatedType(function(relatedType) {
      if (!configured.contains(relatedType)) {
        var root = this.defaultSideloadRootForType(relatedType);
        this.aliases.set(root, relatedType);

        this.configureSideloadMappingForType(relatedType, configured);
      }
    }, this);
  },

  /**
    @method loadValue
    @param loader
    @param type
    @param value
  */
  loadValue: function(loader, type, value) {
    if (value instanceof Array) {
      for (var i=0; i < value.length; i++) {
        loader.sideload(type, value[i]);
      }
    } else {
      loader.sideload(type, value);
    }
  },

  /**
    A hook you can use in your serializer subclass to customize
    how a polymorphic association's name is converted into a key for the id.

    @method keyForPolymorphicId
    @param {String} name the association name to convert into a key
    @return {String} the key
  */
  keyForPolymorphicId: function(key){
    return key;
  },

  /**
    A hook you can use in your serializer subclass to customize
    how a polymorphic association's name is converted into a key for the type.

    @method keyForPolymorphicType
    @param {String} name the association name to convert into a key
    @return {String} the key
  */
  keyForPolymorphicType: function(key){
    return this.keyForPolymorphicId(key) + '_type';
  },

  /**
    A hook you can use in your serializer subclass to customize
    the key used to store the type of a record of an embedded polymorphic association.

    By default, this method return 'type'.

    @method keyForEmbeddedType
    @return {String} the key
  */
  keyForEmbeddedType: function() {
    return 'type';
  },

  // HELPERS

  /**
    Determines the singular root name for a particular type.

    This is an underscored, lowercase version of the model name.
    For example, the type `App.UserGroup` will have the root
    `user_group`.

    @method rootForType
    @private
    @param {DS.Model subclass} type
    @return {String} name of the root element
  */
  rootForType: function(type) {
    var typeString = type.toString();

    Ember.assert("Your model must not be anonymous. It was " + type, typeString.charAt(0) !== '(');

    // use the last part of the name as the URL
    var parts = typeString.split(".");
    var name = parts[parts.length - 1];
    return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
  },

  /**
    The default root name for a particular sideloaded type.

    @method defaultSideloadRootForType
    @private
    @param {DS.Model subclass} type
    @return {String} name of the root element
  */
  defaultSideloadRootForType: function(type) {
    return this.pluralize(this.rootForType(type));
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set, merge = Ember.merge;
var forEach = Ember.EnumerableUtils.forEach;

function loaderFor(store) {
  return {
    load: function(type, data, prematerialized) {
      return store.load(type, data, prematerialized);
    },

    loadMany: function(type, array) {
      return store.loadMany(type, array);
    },

    updateId: function(record, data) {
      return store.updateId(record, data);
    },

    populateArray: Ember.K,

    sideload: function(type, data) {
      return store.adapterForType(type).load(store, type, data);
    },

    sideloadMany: function(type, array) {
      return store.loadMany(type, array);
    },

    prematerialize: function(reference, prematerialized) {
      reference.prematerialized = prematerialized;
    },

    metaForType: function(type, property, data) {
      store.metaForType(type, property, data);
    }
  };
}

DS.loaderFor = loaderFor;

/**
  An adapter is an object that receives requests from a store and
  translates them into the appropriate action to take against your
  persistence layer. The persistence layer is usually an HTTP API, but may
  be anything, such as the browser's local storage.

  ### Creating an Adapter

  First, create a new subclass of `DS.Adapter`:

      App.MyAdapter = DS.Adapter.extend({
        // ...your code here
      });

  To tell your store which adapter to use, set its `adapter` property:

      App.store = DS.Store.create({
        adapter: App.MyAdapter.create()
      });

  `DS.Adapter` is an abstract base class that you should override in your
  application to customize it for your backend. The minimum set of methods
  that you should implement is:

    * `find()`
    * `createRecord()`
    * `updateRecord()`
    * `deleteRecord()`

  To improve the network performance of your application, you can optimize
  your adapter by overriding these lower-level methods:

    * `findMany()`
    * `createRecords()`
    * `updateRecords()`
    * `deleteRecords()`
    * `commit()`

  For an example implementation, see `DS.RestAdapter`, the
  included REST adapter.

  @class Adapter
  @namespace DS
  @extends Ember.Object
  @uses DS._Mappable
*/

DS.Adapter = Ember.Object.extend(DS._Mappable, {

  init: function() {
    var serializer = get(this, 'serializer');

    if (Ember.Object.detect(serializer)) {
      serializer = serializer.create();
      set(this, 'serializer', serializer);
    }

    this._attributesMap = this.createInstanceMapFor('attributes');
    this._configurationsMap = this.createInstanceMapFor('configurations');

    this._outstandingOperations = new Ember.MapWithDefault({
      defaultValue: function() { return 0; }
    });

    this._dependencies = new Ember.MapWithDefault({
      defaultValue: function() { return new Ember.OrderedSet(); }
    });

    this.registerSerializerTransforms(this.constructor, serializer, {});
    this.registerSerializerMappings(serializer);
  },

  /**
    Loads a payload for a record into the store.

    This method asks the serializer to break the payload into
    constituent parts, and then loads them into the store. For example,
    if you have a payload that contains embedded records, they will be
    extracted by the serializer and loaded into the store.

    For example:

        adapter.load(store, App.Person, {
          id: 123,
          firstName: "Yehuda",
          lastName: "Katz",
          occupations: [{
            id: 345,
            title: "Tricycle Mechanic"
          }]
        });

    This will load the payload for the `App.Person` with ID `123` and
    the embedded `App.Occupation` with ID `345`.

    @method load
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {any} payload
  */
  load: function(store, type, payload) {
    var loader = loaderFor(store);
    return get(this, 'serializer').extractRecordRepresentation(loader, type, payload);
  },

  /**
    Acknowledges that the adapter has finished creating a record.

    Your adapter should call this method from `createRecord` when
    it has saved a new record to its persistent storage and received
    an acknowledgement.

    If the persistent storage returns a new payload in response to the
    creation, and you want to update the existing record with the
    new information, pass the payload as the fourth parameter.

    For example, the `RESTAdapter` saves newly created records by
    making an Ajax request. When the server returns, the adapter
    calls didCreateRecord. If the server returns a response body,
    it is passed as the payload.

    @method didCreateRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {any} payload
  */
  didCreateRecord: function(store, type, record, payload) {
    store.didSaveRecord(record);

    if (payload) {
      var loader = DS.loaderFor(store);

      loader.load = function(type, data, prematerialized) {
        store.updateId(record, data);
        return store.load(type, data, prematerialized);
      };

      get(this, 'serializer').extract(loader, payload, type);
    }
  },

  /**
    Acknowledges that the adapter has finished creating several records.

    Your adapter should call this method from `createRecords` when it
    has saved multiple created records to its persistent storage
    received an acknowledgement.

    If the persistent storage returns a new payload in response to the
    creation, and you want to update the existing record with the
    new information, pass the payload as the fourth parameter.

    @method didCreateRecords
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {any} payload
  */
  didCreateRecords: function(store, type, records, payload) {
    records.forEach(function(record) {
      store.didSaveRecord(record);
    }, this);

    if (payload) {
      var loader = DS.loaderFor(store);
      get(this, 'serializer').extractMany(loader, payload, type, records);
    }
  },

  /**
    @private

    Acknowledges that the adapter has finished updating or deleting a record.

    Your adapter should call this method from `updateRecord` or `deleteRecord`
    when it has updated or deleted a record to its persistent storage and
    received an acknowledgement.

    If the persistent storage returns a new payload in response to the
    update or delete, and you want to update the existing record with the
    new information, pass the payload as the fourth parameter.

    @method didSaveRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {any} payload
  */
  didSaveRecord: function(store, type, record, payload) {
    store.didSaveRecord(record);

    var serializer = get(this, 'serializer');

    serializer.eachEmbeddedRecord(record, function(embeddedRecord, embeddedType) {
      if (embeddedType === 'load') { return; }

      this.didSaveRecord(store, embeddedRecord.constructor, embeddedRecord);
    }, this);

    if (payload) {
      var loader = DS.loaderFor(store);
      serializer.extract(loader, payload, type);
    }
  },

  /**
    Acknowledges that the adapter has finished updating a record.

    Your adapter should call this method from `updateRecord` when it
    has updated a record to its persistent storage and received an
    acknowledgement.

    If the persistent storage returns a new payload in response to the
    update, pass the payload as the fourth parameter.

    @method didUpdateRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {any} payload
  */
  didUpdateRecord: function() {
    this.didSaveRecord.apply(this, arguments);
  },

  /**
    Acknowledges that the adapter has finished deleting a record.

    Your adapter should call this method from `deleteRecord` when it
    has deleted a record from its persistent storage and received an
    acknowledgement.

    If the persistent storage returns a new payload in response to the
    deletion, pass the payload as the fourth parameter.

    @method didDeleteRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @param {any} payload
  */
  didDeleteRecord: function() {
    this.didSaveRecord.apply(this, arguments);
  },

  /**
    Acknowledges that the adapter has finished updating or deleting
    multiple records.

    Your adapter should call this method from its `updateRecords` or
    `deleteRecords` when it has updated or deleted multiple records
    to its persistent storage and received an acknowledgement.

    If the persistent storage returns a new payload in response to the
    creation, pass the payload as the fourth parameter.

    @method didSaveRecords
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} records
    @param {any} payload
  */
  didSaveRecords: function(store, type, records, payload) {
    records.forEach(function(record) {
      store.didSaveRecord(record);
    }, this);

    if (payload) {
      var loader = DS.loaderFor(store);
      get(this, 'serializer').extractMany(loader, payload, type);
    }
  },

  /**
    Acknowledges that the adapter has finished updating multiple records.

    Your adapter should call this method from its `updateRecords` when
    it has updated multiple records to its persistent storage and
    received an acknowledgement.

    If the persistent storage returns a new payload in response to the
    update, pass the payload as the fourth parameter.

    @method didUpdateRecords
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} records
    @param {any} payload
  */
  didUpdateRecords: function() {
    this.didSaveRecords.apply(this, arguments);
  },

  /**
    Acknowledges that the adapter has finished updating multiple records.

    Your adapter should call this method from its `deleteRecords` when
    it has deleted multiple records to its persistent storage and
    received an acknowledgement.

    If the persistent storage returns a new payload in response to the
    deletion, pass the payload as the fourth parameter.

    @method didDeleteRecords
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} records
    @param {any} payload
  */
  didDeleteRecords: function() {
    this.didSaveRecords.apply(this, arguments);
  },

  /**
    Loads the response to a request for a record by ID.

    Your adapter should call this method from its `find` method
    with the response from the backend.

    You should pass the same ID to this method that was given
    to your find method so that the store knows which record
    to associate the new data with.

    @method didFindRecord
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {any} payload
    @param {String} id
  */
  didFindRecord: function(store, type, payload, id) {
    var loader = DS.loaderFor(store);

    loader.load = function(type, data, prematerialized) {
      prematerialized = prematerialized || {};
      prematerialized.id = id;

      return store.load(type, data, prematerialized);
    };

    get(this, 'serializer').extract(loader, payload, type);
  },

  /**
    Loads the response to a request for all records by type.

    You adapter should call this method from its `findAll`
    method with the response from the backend.

    @method didFindAll
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {any} payload
  */
  didFindAll: function(store, type, payload) {
    var loader = DS.loaderFor(store),
        serializer = get(this, 'serializer');

    store.didUpdateAll(type);

    serializer.extractMany(loader, payload, type);
  },

  /**
    Loads the response to a request for records by query.

    Your adapter should call this method from its `findQuery`
    method with the response from the backend.

    @method didFindQuery
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {any} payload
    @param {DS.AdapterPopulatedRecordArray} recordArray
  */
  didFindQuery: function(store, type, payload, recordArray) {
    var loader = DS.loaderFor(store);

    loader.populateArray = function(data) {
      recordArray.load(data);
    };

    get(this, 'serializer').extractMany(loader, payload, type);
  },

  /**
    Loads the response to a request for many records by ID.

    You adapter should call this method from its `findMany`
    method with the response from the backend.

    @method didFindMany
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {any} payload
  */
  didFindMany: function(store, type, payload) {
    var loader = DS.loaderFor(store);

    get(this, 'serializer').extractMany(loader, payload, type);
  },

  /**
    Notifies the store that a request to the backend returned
    an error.

    Your adapter should call this method to indicate that the
    backend returned an error for a request.

    @method didError
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
  */
  didError: function(store, type, record) {
    store.recordWasError(record);
  },

  /**
    @method dirtyRecordsForAttributeChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} record
    @param {String} attributeName
    @param {any} newValue
    @param {any} oldValue
  */
  dirtyRecordsForAttributeChange: function(dirtySet, record, attributeName, newValue, oldValue) {
    if (newValue !== oldValue) {
      // If this record is embedded, add its parent
      // to the dirty set.
      this.dirtyRecordsForRecordChange(dirtySet, record);
    }
  },

  /**
    @method dirtyRecordsForRecordChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} record
  */
  dirtyRecordsForRecordChange: function(dirtySet, record) {
    dirtySet.add(record);
  },

  /**
    @method dirtyRecordsForBelongsToChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} child
    @param {DS.RelationshipChange} relationship
  */
  dirtyRecordsForBelongsToChange: function(dirtySet, child) {
    this.dirtyRecordsForRecordChange(dirtySet, child);
  },

  /**
    @method dirtyRecordsForHasManyChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} parent
    @param {DS.RelationshipChange} relationship
  */
  dirtyRecordsForHasManyChange: function(dirtySet, parent, relationship) {
    this.dirtyRecordsForRecordChange(dirtySet, parent);
  },

  /**
    @private

    This method recursively climbs the superclass hierarchy and
    registers any class-registered transforms on the adapter's
    serializer.

    Once it registers a transform for a given type, it ignores
    subsequent transforms for the same attribute type.

    @method registerSerializerTransforms
    @param {Class} klass the DS.Adapter subclass to extract the
      transforms from
    @param {DS.Serializer} serializer the serializer to register
      the transforms onto
    @param {Object} seen a hash of attributes already seen
  */
  registerSerializerTransforms: function(klass, serializer, seen) {
    var transforms = klass._registeredTransforms, superclass, prop;
    var enumTransforms = klass._registeredEnumTransforms;

    for (prop in transforms) {
      if (!transforms.hasOwnProperty(prop) || prop in seen) { continue; }
      seen[prop] = true;

      serializer.registerTransform(prop, transforms[prop]);
    }

    for (prop in enumTransforms) {
      if (!enumTransforms.hasOwnProperty(prop) || prop in seen) { continue; }
      seen[prop] = true;

      serializer.registerEnumTransform(prop, enumTransforms[prop]);
    }

    if (superclass = klass.superclass) {
      this.registerSerializerTransforms(superclass, serializer, seen);
    }
  },

  /**
    @private

    This method recursively climbs the superclass hierarchy and
    registers any class-registered mappings on the adapter's
    serializer.

    @method registerSerializerMappings
    @param {Class} klass the DS.Adapter subclass to extract the
      transforms from
    @param {DS.Serializer} serializer the serializer to register the
      mappings onto
  */
  registerSerializerMappings: function(serializer) {
    var mappings = this._attributesMap,
        configurations = this._configurationsMap;

    mappings.forEach(serializer.map, serializer);
    configurations.forEach(serializer.configure, serializer);
  },

  /**
    The `find()` method is invoked when the store is asked for a record that
    has not previously been loaded. In response to `find()` being called, you
    should query your persistence layer for a record with the given ID. Once
    found, you can asynchronously call the store's `load()` method to load
    the record.

    Here is an example `find` implementation:

        find: function(store, type, id) {
          var url = type.url;
          url = url.fmt(id);

          jQuery.getJSON(url, function(data) {
              // data is a hash of key/value pairs. If your server returns a
              // root, simply do something like:
              // store.load(type, id, data.person)
              store.load(type, id, data);
          });
        }

    @method find
  */
  find: Ember.required(Function),

  /**
    Optional

    @method findAll
    @param  store
    @param  type
    @param  since
  */
  findAll: null,

  /**
    Optional

    @method findQuery
    @param  store
    @param  type
    @param  query
    @param  recordArray
  */
  findQuery: null,

  /**
    The class of the serializer to be used by this adapter.

    @property serializer
    @type     DS.Serializer
    @default  DS.JSONSerializer
  */
  serializer: DS.JSONSerializer,

  registerTransform: function(attributeType, transform) {
    get(this, 'serializer').registerTransform(attributeType, transform);
  },

  /**
    A public method that allows you to register an enumerated
    type on your adapter.  This is useful if you want to utilize
    a text representation of an integer value.

    Eg: Say you want to utilize "low","medium","high" text strings
    in your app, but you want to persist those as 0,1,2 in your backend.
    You would first register the transform on your adapter instance:

        adapter.registerEnumTransform('priority', ['low', 'medium', 'high']);

    You would then refer to the 'priority' DS.attr in your model:

        App.Task = DS.Model.extend({
          priority: DS.attr('priority')
        });

    And lastly, you would set/get the text representation on your model instance,
    but the transformed result will be the index number of the type.

        App:   myTask.get('priority') => 'low'
        Server Response / Load:  { myTask: {priority: 0} }

    @method registerEnumTransform
    @param {String} type of the transform
    @param {Array} array of String objects to use for the enumerated values.
      This is an ordered list and the index values will be used for the transform.
  */
  registerEnumTransform: function(attributeType, objects) {
    get(this, 'serializer').registerEnumTransform(attributeType, objects);
  },

  /**
    If the globally unique IDs for your records should be generated on the client,
    implement the `generateIdForRecord()` method. This method will be invoked
    each time you create a new record, and the value returned from it will be
    assigned to the record's `primaryKey`.

    Most traditional REST-like HTTP APIs will not use this method. Instead, the ID
    of the record will be set by the server, and your adapter will update the store
    with the new ID when it calls `didCreateRecord()`. Only implement this method if
    you intend to generate record IDs on the client-side.

    The `generateIdForRecord()` method will be invoked with the requesting store as
    the first parameter and the newly created record as the second parameter:

        generateIdForRecord: function(store, record) {
          var uuid = App.generateUUIDWithStatisticallyLowOddsOfCollision();
          return uuid;
        }

    @method generateIdForRecord
    @param {DS.Store} store
    @param {DS.Model} record
  */
  generateIdForRecord: null,

  /**
    Proxies to the serializer's `materialize` method.

    @method materialize
    @param {DS.Model} record
    @param {Object}   data
    @param {Object}   prematerialized
  */
  materialize: function(record, data, prematerialized) {
    get(this, 'serializer').materialize(record, data, prematerialized);
  },

  /**
    Proxies to the serializer's `serialize` method.

    @method serialize
    @param {DS.Model} record
    @param {Object}   options
  */
  serialize: function(record, options) {
    return get(this, 'serializer').serialize(record, options);
  },

  /**
    Proxies to the serializer's `extractId` method.

    @method extractId
    @param {DS.Model} type  the model class
    @param {Object}   data
  */
  extractId: function(type, data) {
    return get(this, 'serializer').extractId(type, data);
  },

  /**
    @method groupByType
    @private
    @param  enumerable
  */
  groupByType: function(enumerable) {
    var map = Ember.MapWithDefault.create({
      defaultValue: function() { return Ember.OrderedSet.create(); }
    });

    forEach(enumerable, function(item) {
      map.get(item.constructor).add(item);
    });

    return map;
  },

  /**
    The commit method is called when a transaction is being committed.
    The `commitDetails` is a map with each record type and a list of
    committed, updated and deleted records.

    By default, this just calls the adapter's `save` method.
    If you need more advanced handling of commits, e.g., only sending
    certain records to the server, you can overwrite this method.

    @method commit
    @params {DS.Store}  store
    @params {Ember.Map} commitDetails   see `DS.Transaction#commitDetails`.
  */
  commit: function(store, commitDetails) {
    this.save(store, commitDetails);
  },

  /**
    Iterates over each set of records provided in the commit details and
    filters with `DS.Adapter#shouldSave` and then calls `createRecords`,
    `updateRecords`, and `deleteRecords` for each set as approriate.

    @method save
    @params {DS.Store}  store
    @params {Ember.Map} commitDetails   see `DS.Transaction#commitDetails`.
  */
  save: function(store, commitDetails) {
    var adapter = this;

    function filter(records) {
      var filteredSet = Ember.OrderedSet.create();

      records.forEach(function(record) {
        if (adapter.shouldSave(record)) {
          filteredSet.add(record);
        }
      });

      return filteredSet;
    }

    this.groupByType(commitDetails.created).forEach(function(type, set) {
      this.createRecords(store, type, filter(set));
    }, this);

    this.groupByType(commitDetails.updated).forEach(function(type, set) {
      this.updateRecords(store, type, filter(set));
    }, this);

    this.groupByType(commitDetails.deleted).forEach(function(type, set) {
      this.deleteRecords(store, type, filter(set));
    }, this);
  },

  /**
    Called on each record before saving. If false is returned, the record
    will not be saved.

    @method   shouldSave
    @property {DS.Model} record
    @return   {Boolean}  `true` to save, `false` to not. Defaults to true.
  */
  shouldSave: function(record) {
    return true;
  },

  /**
    Implement this method in a subclass to handle the creation of
    new records.

    Serializes the record and send it to the server.

    This implementation should call the adapter's `didCreateRecord`
    method on success or `didError` method on failure.

    @method createRecord
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  createRecord: Ember.required(Function),

  /**
    Creates multiple records at once.

    By default, it loops over the supplied array and calls `createRecord`
    on each. May be overwritten to improve performance and reduce the number
    of server requests.

    @method createRecords
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the records
    @property {Array[DS.Model]} records
  */
  createRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.createRecord(store, type, record);
    }, this);
  },

  /**
    Implement this method in a subclass to handle the updating of
    a record.

    Serializes the record update and send it to the server.

    @method updateRecord
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  updateRecord: Ember.required(Function),

  /**
    Updates multiple records at once.

    By default, it loops over the supplied array and calls `updateRecord`
    on each. May be overwritten to improve performance and reduce the number
    of server requests.

    @method updateRecords
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the records
    @property {Array[DS.Model]} records
  */
  updateRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.updateRecord(store, type, record);
    }, this);
  },

  /**
    Implement this method in a subclass to handle the deletion of
    a record.

    Sends a delete request for the record to the server.

    @method deleteRecord
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  deleteRecord: Ember.required(Function),

  /**
    Delete multiple records at once.

    By default, it loops over the supplied array and calls `deleteRecord`
    on each. May be overwritten to improve performance and reduce the number
    of server requests.

    @method deleteRecords
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the records
    @property {Array[DS.Model]} records
  */
  deleteRecords: function(store, type, records) {
    records.forEach(function(record) {
      this.deleteRecord(store, type, record);
    }, this);
  },

  /**
    Find multiple records at once.

    By default, it loops over the provided ids and calls `find` on each.
    May be overwritten to improve performance and reduce the number of
    server requests.

    @method findMany
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the records
    @property {Array}    ids
  */
  findMany: function(store, type, ids) {
    ids.forEach(function(id) {
      this.find(store, type, id);
    }, this);
  }
});

DS.Adapter.reopenClass({

  /**
    Registers a custom attribute transform for the adapter class

    The `transform` property is an object with a `serialize` and
    `deserialize` property. These are each functions that respectively
    serialize the data to send to the backend or deserialize it for
    use on the client.

    @method registerTransform
    @static
    @property {DS.String} attributeType
    @property {Object}    transform
  */
  registerTransform: function(attributeType, transform) {
    var registeredTransforms = this._registeredTransforms || {};

    registeredTransforms[attributeType] = transform;

    this._registeredTransforms = registeredTransforms;
  },

  /**
    Registers a custom enumerable transform for the adapter class

    @method registerEnumTransform
    @static
    @property {DS.String} attributeType
    @property objects
  */
  registerEnumTransform: function(attributeType, objects) {
    var registeredEnumTransforms = this._registeredEnumTransforms || {};

    registeredEnumTransforms[attributeType] = objects;

    this._registeredEnumTransforms = registeredEnumTransforms;
  },

  /**
    Set adapter attributes for a DS.Model class.

    @method map
    @static
    @property {DS.Model} type   the DS.Model class
    @property {Object}   attributes
  */
  map: DS._Mappable.generateMapFunctionFor('attributes', function(key, newValue, map) {
    var existingValue = map.get(key);

    merge(existingValue, newValue);
  }),

  /**
    Set configuration options for a DS.Model class.

    @method configure
    @static
    @property {DS.Model} type   the DS.Model class
    @property {Object}   configuration
  */
  configure: DS._Mappable.generateMapFunctionFor('configurations', function(key, newValue, map) {
    var existingValue = map.get(key);

    // If a mapping configuration is provided, peel it off and apply it
    // using the DS.Adapter.map API.
    var mappings = newValue && newValue.mappings;
    if (mappings) {
      this.map(key, mappings);
      delete newValue.mappings;
    }

    merge(existingValue, newValue);
  }),

  /**
    Resolved conflicts in configuration settings.

    Calls `Ember.merge` by default.

    @method resolveMapConflict
    @static
    @property oldValue
    @property newValue
  */
  resolveMapConflict: function(oldValue, newValue) {
    merge(newValue, oldValue);

    return newValue;
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;

/**
  @class FixtureSerializer
  @namespace DS
  @extends DS.Serializer
*/
DS.FixtureSerializer = DS.Serializer.extend({

  /**
    @method deserializeValue
    @param  value
    @param  attributeType
  */
  deserializeValue: function(value, attributeType) {
    return value;
  },

  /**
    @method serializeValue
    @param  value
    @param  attributeType
  */
  serializeValue: function(value, attributeType) {
    return value;
  },

  /**
    @method addId
    @param  data
    @param  key
    @param  id
  */
  addId: function(data, key, id) {
    data[key] = id;
  },

  /**
    @method addAttribute
    @param hash
    @param key
    @param value
  */
  addAttribute: function(hash, key, value) {
    hash[key] = value;
  },

  /**
    @method addBelongsTo
    @param hash
    @param record
    @param key
    @param relationship
  */
  addBelongsTo: function(hash, record, key, relationship) {
    var id = get(record, relationship.key+'.id');
    if (!Ember.isNone(id)) { hash[key] = id; }
  },

  /**
    @method addHasMany
    @param hash
    @param record
    @param key
    @param relationship
  */
  addHasMany: function(hash, record, key, relationship) {
    var ids = get(record, relationship.key).map(function(item) {
      return item.get('id');
    });

    hash[relationship.key] = ids;
  },

  /**
    @method extract
    @param loader
    @param fixture
    @param type
    @param record
  */
  extract: function(loader, fixture, type, record) {
    if (record) { loader.updateId(record, fixture); }
    this.extractRecordRepresentation(loader, type, fixture);
  },

  /**
    @method extractMany
    @param loader
    @param fixtures
    @param type
    @param records
  */
  extractMany: function(loader, fixtures, type, records) {
    var objects = fixtures, references = [];
    if (records) { records = records.toArray(); }

    for (var i = 0; i < objects.length; i++) {
      if (records) { loader.updateId(records[i], objects[i]); }
      var reference = this.extractRecordRepresentation(loader, type, objects[i]);
      references.push(reference);
    }

    loader.populateArray(references);
  },

  /**
    @method extractId
    @param type
    @param hash
  */
  extractId: function(type, hash) {
    var primaryKey = this._primaryKey(type);

    if (hash.hasOwnProperty(primaryKey)) {
      // Ensure that we coerce IDs to strings so that record
      // IDs remain consistent between application runs; especially
      // if the ID is serialized and later deserialized from the URL,
      // when type information will have been lost.
      return hash[primaryKey]+'';
    } else {
      return null;
    }
  },

  /**
    @method extractAttribute
    @param type
    @param hash
    @param attributeName
  */
  extractAttribute: function(type, hash, attributeName) {
    var key = this._keyForAttributeName(type, attributeName);
    return hash[key];
  },

  /**
    @method extractHasMany
    @param type
    @param hash
    @param key
  */
  extractHasMany: function(type, hash, key) {
    return hash[key];
  },

  /**
    @method extractBelongsTo
    @param type
    @param hash
    @param key
  */
  extractBelongsTo: function(type, hash, key) {
    var val = hash[key];
    if (val != null) {
      val = val + '';
    }
    return val;
  },

  /**
    @method extractBelongsToPolymorphic
    @method type
    @method hash
    @method key
  */
  extractBelongsToPolymorphic: function(type, hash, key) {
    var keyForId = this.keyForPolymorphicId(key),
        keyForType,
        id = hash[keyForId];

    if (id) {
      keyForType = this.keyForPolymorphicType(key);
      return {id: id, type: hash[keyForType]};
    }

    return null;
  },

  /**
    @method keyForPolymorphicId
    @param key
  */
  keyForPolymorphicId: function(key) {
    return key;
  },

  /**
    @method keyForPolymorphicType
    @param key
  */
  keyForPolymorphicType: function(key) {
    return key + '_type';
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, fmt = Ember.String.fmt,
    indexOf = Ember.EnumerableUtils.indexOf;

/**
  `DS.FixtureAdapter` is an adapter that loads records from memory.
  Its primarily used for development and testing. You can also use
  `DS.FixtureAdapter` while working on the API but are not ready to
  integrate yet. It is a fully functioning adapter. All CRUD methods
  are implemented. You can also implement query logic that a remote
  system would do. Its possible to do develop your entire application
  with `DS.FixtureAdapter`.

  @class FixtureAdapter
  @namespace DS
  @extends DS.Adapter
*/
DS.FixtureAdapter = DS.Adapter.extend({

  simulateRemoteResponse: true,

  latency: 50,

  serializer: DS.FixtureSerializer,

  /**
    Implement this method in order to provide data associated with a type

    @method fixturesForType
    @param  type
  */
  fixturesForType: function(type) {
    if (type.FIXTURES) {
      var fixtures = Ember.A(type.FIXTURES);
      return fixtures.map(function(fixture){
        var fixtureIdType = typeof fixture.id;
        if(fixtureIdType !== "number" && fixtureIdType !== "string"){
          throw new Error(fmt('the id property must be defined as a number or string for fixture %@', [fixture]));
        }
        fixture.id = fixture.id + '';
        return fixture;
      });
    }
    return null;
  },

  /**
    Implement this method in order to query fixtures data

    @method queryFixtures
    @param  fixture
    @param  query
    @param  type
  */
  queryFixtures: function(fixtures, query, type) {
    Ember.assert('Not implemented: You must override the DS.FixtureAdapter::queryFixtures method to support querying the fixture store.');
  },

  /**
    @method updateFixtures
    @param  type
    @param  fixture
  */
  updateFixtures: function(type, fixture) {
    if(!type.FIXTURES) {
      type.FIXTURES = [];
    }

    var fixtures = type.FIXTURES;

    this.deleteLoadedFixture(type, fixture);

    fixtures.push(fixture);
  },

  /**
    Implement this method in order to provide provide json for CRUD methods

    @method mockJSON
    @param  type
    @param  record
  */
  mockJSON: function(type, record) {
    return this.serialize(record, { includeId: true });
  },

  /**
    @method generateIdForRecord
    @param  store
    @param  record
  */
  generateIdForRecord: function(store, record) {
    return Ember.guidFor(record);
  },

  /**
    @method find
    @param  store
    @param  type
    @param  id
  */
  find: function(store, type, id) {
    var fixtures = this.fixturesForType(type),
        fixture;

    Ember.warn("Unable to find fixtures for model type " + type.toString(), fixtures);

    if (fixtures) {
      fixture = Ember.A(fixtures).findProperty('id', id);
    }

    if (fixture) {
      this.simulateRemoteCall(function() {
        this.didFindRecord(store, type, fixture, id);
      }, this);
    }
  },

  /**
    @method findMany
    @param  store
    @param  type
    @param  ids
  */
  findMany: function(store, type, ids) {
    var fixtures = this.fixturesForType(type);

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    if (fixtures) {
      fixtures = fixtures.filter(function(item) {
        return indexOf(ids, item.id) !== -1;
      });
    }

    if (fixtures) {
      this.simulateRemoteCall(function() {
        this.didFindMany(store, type, fixtures);
      }, this);
    }
  },

  /**
    @method findAll
    @param  store
    @param  type
  */
  findAll: function(store, type) {
    var fixtures = this.fixturesForType(type);

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    this.simulateRemoteCall(function() {
      this.didFindAll(store, type, fixtures);
    }, this);
  },

  /**
    @method findQuery
    @param  store
    @param  type
    @param  query
    @param  array
  */
  findQuery: function(store, type, query, array) {
    var fixtures = this.fixturesForType(type);

    Ember.assert("Unable to find fixtures for model type "+type.toString(), !!fixtures);

    fixtures = this.queryFixtures(fixtures, query, type);

    if (fixtures) {
      this.simulateRemoteCall(function() {
        this.didFindQuery(store, type, fixtures, array);
      }, this);
    }
  },

  /**
    @method createRecord
    @param  store
    @param  type
    @param  record
  */
  createRecord: function(store, type, record) {
    var fixture = this.mockJSON(type, record);

    this.updateFixtures(type, fixture);

    this.simulateRemoteCall(function() {
      this.didCreateRecord(store, type, record, fixture);
    }, this);
  },

  /**
    @method updateRecord
    @param  store
    @param  type
    @param  record
  */
  updateRecord: function(store, type, record) {
    var fixture = this.mockJSON(type, record);

    this.updateFixtures(type, fixture);

    this.simulateRemoteCall(function() {
      this.didUpdateRecord(store, type, record, fixture);
    }, this);
  },

  /**
    @method deleteRecord
    @param  store
    @param  type
    @param  record
  */
  deleteRecord: function(store, type, record) {
    var fixture = this.mockJSON(type, record);

    this.deleteLoadedFixture(type, fixture);

    this.simulateRemoteCall(function() {
      this.didDeleteRecord(store, type, record);
    }, this);
  },

  /*
    @method deleteLoadedFixture
    @private
    @param type
    @param record
  */
  deleteLoadedFixture: function(type, record) {
    var existingFixture = this.findExistingFixture(type, record);

    if(existingFixture) {
      var index = indexOf(type.FIXTURES, existingFixture);
      type.FIXTURES.splice(index, 1);
      return true;
    }
  },

  /*
    @method findExistingFixture
    @private
    @param type
    @param record
  */
  findExistingFixture: function(type, record) {
    var fixtures = this.fixturesForType(type);
    var id = this.extractId(type, record);

    return this.findFixtureById(fixtures, id);
  },

  /*
    @method findFixtureById
    @private
    @param type
    @param record
  */
  findFixtureById: function(fixtures, id) {
    return Ember.A(fixtures).find(function(r) {
      if(''+get(r, 'id') === ''+id) {
        return true;
      } else {
        return false;
      }
    });
  },

  /*
    @method simulateRemoteCall
    @private
    @param callback
    @param context
  */
  simulateRemoteCall: function(callback, context) {
    if (get(this, 'simulateRemoteResponse')) {
      // Schedule with setTimeout
      Ember.run.later(context, callback, get(this, 'latency'));
    } else {
      // Asynchronous, but at the of the runloop with zero latency
      Ember.run.once(context, callback);
    }
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get;

/**
  @class RESTSerializer
  @namespace DS
  @extends DS.Serializer
*/
DS.RESTSerializer = DS.JSONSerializer.extend({

  /**
    @method keyForAttributeName
    @param type
    @param name
  */
  keyForAttributeName: function(type, name) {
    return Ember.String.decamelize(name);
  },

  /**
    @method keyForBelongsTo
    @param type
    @param name
  */
  keyForBelongsTo: function(type, name) {
    var key = this.keyForAttributeName(type, name);

    if (this.embeddedType(type, name)) {
      return key;
    }

    return key + "_id";
  },

  /**
    @method keyForHasMany
    @param type
    @param name
  */
  keyForHasMany: function(type, name) {
    var key = this.keyForAttributeName(type, name);

    if (this.embeddedType(type, name)) {
      return key;
    }

    return this.singularize(key) + "_ids";
  },

  /**
    @method keyForPolymorphicId
    @param key
  */
  keyForPolymorphicId: function(key) {
    return key;
  },

  /**
    @method keyForPolymorphicType
    @param key
  */
  keyForPolymorphicType: function(key) {
    return key.replace(/_id$/, '_type');
  },

  /**
    @method extractValidationErrors
    @param type
    @param json
  */
  extractValidationErrors: function(type, json) {
    var errors = {};

    get(type, 'attributes').forEach(function(name) {
      var key = this._keyForAttributeName(type, name);
      if (json['errors'].hasOwnProperty(key)) {
        errors[name] = json['errors'][key];
      }
    }, this);

    return errors;
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;

DS.rejectionHandler = function(reason) {
  Ember.Logger.assert([reason, reason.message, reason.stack]);

  throw reason;
};

/**
  The REST adapter allows your store to communicate with an HTTP server by
  transmitting JSON via XHR. Most Ember.js apps that consume a JSON API
  should use the REST adapter.

  This adapter is designed around the idea that the JSON exchanged with
  the server should be conventional.

  ## JSON Structure

  The REST adapter expects the JSON returned from your server to follow
  these conventions.

  ### Object Root

  The JSON payload should be an object that contains the record inside a
  root property. For example, in response to a `GET` request for
  `/posts/1`, the JSON should look like this:

  ```js
  {
    "post": {
      title: "I'm Running to Reform the W3C's Tag",
      author: "Yehuda Katz"
    }
  }
  ```

  ### Conventional Names

  Attribute names in your JSON payload should be the underscored versions of
  the attributes in your Ember.js models.

  For example, if you have a `Person` model:

  ```js
  App.Person = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    occupation: DS.attr('string')
  });
  ```

  The JSON returned should look like this:

  ```js
  {
    "person": {
      "first_name": "Barack",
      "last_name": "Obama",
      "occupation": "President"
    }
  }
  ```

  ## Customization

  ### Endpoint path customization

  Endpoint paths can be prefixed with a `namespace` by setting the namespace
  property on the adapter:

  ```js
  DS.RESTAdapter.reopen({
    namespace: 'api/1'
  });
  ```
  Requests for `App.Person` would now target `/api/1/people/1`.

  ### Host customization

  An adapter can target other hosts by setting the `url` property.

  ```js
  DS.RESTAdapter.reopen({
    url: 'https://api.example.com'
  });
  ```

  ### Headers customization

  Some APIs require HTTP headers, eg to provide an API key. An array of
  headers can be added to the adapter which are passed with every request:

  ```js
  DS.RESTAdapter.reopen({
    headers: {
      "API_KEY": "secret key",
      "ANOTHER_HEADER": "asdsada"
    }
  });
  ```

  @class RESTAdapter
  @constructor
  @namespace DS
  @extends DS.Adapter
*/
DS.RESTAdapter = DS.Adapter.extend({
  namespace: null,
  bulkCommit: false,
  since: 'since',

  serializer: DS.RESTSerializer,

  /**
    Called on each record before saving. If false is returned, the record
    will not be saved.

    By default, this method returns `true` except when the record is embedded.

    @method   shouldSave
    @property {DS.Model} record
    @return   {Boolean}  `true` to save, `false` to not. Defaults to true.
  */
  shouldSave: function(record) {
    var reference = get(record, '_reference');

    return !reference.parent;
  },

  /**
    @method dirtyRecordsForRecordChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} record
  */
  dirtyRecordsForRecordChange: function(dirtySet, record) {
    this._dirtyTree(dirtySet, record);
  },

  /**
    @method dirtyRecordsForHasManyChange
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} record
    @param {DS.RelationshipChange} relationship
  */
  dirtyRecordsForHasManyChange: function(dirtySet, record, relationship) {
    var embeddedType = get(this, 'serializer').embeddedType(record.constructor, relationship.secondRecordName);

    if (embeddedType === 'always') {
      relationship.childReference.parent = relationship.parentReference;
      this._dirtyTree(dirtySet, record);
    }
  },

  /**
    @method _dirtyTree
    @private
    @param {Ember.OrderedSet} dirtySet
    @param {DS.Model} record
  */
  _dirtyTree: function(dirtySet, record) {
    dirtySet.add(record);

    get(this, 'serializer').eachEmbeddedRecord(record, function(embeddedRecord, embeddedType) {
      if (embeddedType !== 'always') { return; }
      if (dirtySet.has(embeddedRecord)) { return; }
      this._dirtyTree(dirtySet, embeddedRecord);
    }, this);

    var reference = record.get('_reference');

    if (reference.parent) {
      var store = get(record, 'store');
      var parent = store.recordForReference(reference.parent);
      this._dirtyTree(dirtySet, parent);
    }
  },

  /**
    Serializes the record and sends it to the server.

    By default, the record is serialized with the adapter's `serialize`
    method and assigned to a root obtained by the `rootForType` method.

    The url is created with `buildURL` and then called as a 'POST' request
    with the adapter's `ajax` method.

    If successful, the adapter's `didCreateRecord` method is called,
    otherwise `didError`

    @method createRecord
    @property {DS.Store} store
    @property {DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  createRecord: function(store, type, record) {
    var root = this.rootForType(type);
    var adapter = this;
    var data = {};

    data[root] = this.serialize(record, { includeId: true });

    return this.ajax(this.buildURL(root), "POST", {
      data: data
    }).then(function(json){
      adapter.didCreateRecord(store, type, record, json);
    }, function(xhr) {
      adapter.didError(store, type, record, xhr);
      throw xhr;
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method createRecords
    @param  store
    @param  type
    @param  records
  */
  createRecords: function(store, type, records) {
    var adapter = this;

    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = [];
    records.forEach(function(record) {
      data[plural].push(this.serialize(record, { includeId: true }));
    }, this);

    return this.ajax(this.buildURL(root), "POST", {
      data: data
    }).then(function(json) {
      adapter.didCreateRecords(store, type, records, json);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method updateRecord
    @param  store
    @param  type
    @param  record
  */
  updateRecord: function(store, type, record) {
    var id, root, adapter, data;

    id = get(record, 'id');
    root = this.rootForType(type);
    adapter = this;

    data = {};
    data[root] = this.serialize(record);

    return this.ajax(this.buildURL(root, id, record), "PUT",{
      data: data
    }).then(function(json){
      adapter.didUpdateRecord(store, type, record, json);
    }, function(xhr) {
      adapter.didError(store, type, record, xhr);
      throw xhr;
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method updateRecords
    @param  store
    @param  type
    @param  records
  */
  updateRecords: function(store, type, records) {
    var root, plural, adapter, data;

    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    root = this.rootForType(type);
    plural = this.pluralize(root);
    adapter = this;

    data = {};

    data[plural] = [];

    records.forEach(function(record) {
      data[plural].push(this.serialize(record, { includeId: true }));
    }, this);

    return this.ajax(this.buildURL(root, "bulk"), "PUT", {
      data: data
    }).then(function(json) {
      adapter.didUpdateRecords(store, type, records, json);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method deleteRecord
    @param  store
    @param  type
    @param  record
  */
  deleteRecord: function(store, type, record) {
    var id, root, adapter;

    id = get(record, 'id');
    root = this.rootForType(type);
    adapter = this;

    return this.ajax(this.buildURL(root, id, record), "DELETE").then(function(json){
      adapter.didDeleteRecord(store, type, record, json);
    }, function(xhr){
      adapter.didError(store, type, record, xhr);
      throw xhr;
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method deleteRecords
    @param  store
    @param  type
    @param  records
  */
  deleteRecords: function(store, type, records) {
    var root, plural, serializer, adapter, data;

    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    root = this.rootForType(type);
    plural = this.pluralize(root);
    serializer = get(this, 'serializer');
    adapter = this;

    data = {};

    data[plural] = [];
    records.forEach(function(record) {
      data[plural].push(serializer.serializeId( get(record, 'id') ));
    });

    return this.ajax(this.buildURL(root, 'bulk'), "DELETE", {
      data: data
    }).then(function(json){
      adapter.didDeleteRecords(store, type, records, json);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method find
    @param  store
    @param  type
    @param  id
  */
  find: function(store, type, id) {
    var root = this.rootForType(type), adapter = this;

    return this.ajax(this.buildURL(root, id), "GET").
      then(function(json){
        adapter.didFindRecord(store, type, json, id);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method findAll
    @param  store
    @param  type
    @param  since
  */
  findAll: function(store, type, since) {
    var root, adapter;

    root = this.rootForType(type);
    adapter = this;

    return this.ajax(this.buildURL(root), "GET",{
      data: this.sinceQuery(since)
    }).then(function(json) {
      adapter.didFindAll(store, type, json);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method findQuery
    @param  store
    @param  type
    @param  query
    @param  recordArray
  */
  findQuery: function(store, type, query, recordArray) {
    var root = this.rootForType(type),
        adapter = this;

    return this.ajax(this.buildURL(root), "GET", {
      data: query
    }).then(function(json){
      adapter.didFindQuery(store, type, json, recordArray);
    }).then(null, DS.rejectionHandler);
  },

  /**
    @method findMany
    @param  store
    @param  type
    @param  ids
    @param  owner
  */
  findMany: function(store, type, ids, owner) {
    var root = this.rootForType(type),
    adapter = this;

    ids = this.serializeIds(ids);

    return this.ajax(this.buildURL(root), "GET", {
      data: {ids: ids}
    }).then(function(json) {
      adapter.didFindMany(store, type, json);
    }).then(null, DS.rejectionHandler);
  },

  /**
    This method serializes a list of IDs using `serializeId`

    @method serializeIds
    @private
    @param  ids
    @return {Array} an array of serialized IDs
  */
  serializeIds: function(ids) {
    var serializer = get(this, 'serializer');

    return Ember.EnumerableUtils.map(ids, function(id) {
      return serializer.serializeId(id);
    });
  },

  /**
    @method didError
    @private
    @param  store
    @param  type
    @param  record
    @param  xhr
  */
  didError: function(store, type, record, xhr) {
    if (xhr.status === 422) {
      var json = JSON.parse(xhr.responseText),
          serializer = get(this, 'serializer'),
          errors = serializer.extractValidationErrors(type, json);

      store.recordWasInvalid(record, errors);
    } else {
      this._super.apply(this, arguments);
    }
  },

  /**
    @method ajax
    @private
    @param  url
    @param  type
    @param  hash
  */
  ajax: function(url, type, hash) {
    var adapter = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      hash = hash || {};
      hash.url = url;
      hash.type = type;
      hash.dataType = 'json';
      hash.context = adapter;

      if (hash.data && type !== 'GET') {
        hash.contentType = 'application/json; charset=utf-8';
        hash.data = JSON.stringify(hash.data);
      }

      if (adapter.headers !== undefined) {
        var headers = adapter.headers;
        hash.beforeSend = function (xhr) {
          Ember.keys(headers).forEach(function(key) {
            xhr.setRequestHeader(key, headers[key]);
          });
        };
      }

      hash.success = function(json) {
        Ember.run(null, resolve, json);
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        if (jqXHR) {
          jqXHR.then = null;
        }

        Ember.run(null, reject, jqXHR);
      };

      Ember.$.ajax(hash);
    });
  },

  /**
    @property url
    @default ''
  */
  url: "",

  /**
    @method rootForType
    @private
    @param type
  */
  rootForType: function(type) {
    var serializer = get(this, 'serializer');
    return serializer.rootForType(type);
  },

  /**
    @method pluralize
    @private
    @param string
  */
  pluralize: function(string) {
    var serializer = get(this, 'serializer');
    return serializer.pluralize(string);
  },

  /**
    @method buildURL
    @private
    @param root
    @param suffix
    @param record
  */
  buildURL: function(root, suffix, record) {
    var url = [this.url];

    Ember.assert("Namespace URL (" + this.namespace + ") must not start with slash", !this.namespace || this.namespace.toString().charAt(0) !== "/");
    Ember.assert("Root URL (" + root + ") must not start with slash", !root || root.toString().charAt(0) !== "/");
    Ember.assert("URL suffix (" + suffix + ") must not start with slash", !suffix || suffix.toString().charAt(0) !== "/");

    if (!Ember.isNone(this.namespace)) {
      url.push(this.namespace);
    }

    url.push(this.pluralize(root));
    if (suffix !== undefined) {
      url.push(suffix);
    }

    return url.join("/");
  },

  /**
    @method sinceQuery
    @private
    @param since
  */
  sinceQuery: function(since) {
    var query = {};
    query[get(this, 'since')] = since;
    return since ? query : null;
  }
});

})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
DS.Model.reopen({

  /**
   Provides info about the model for debugging purposes
   by grouping the properties into more semantic groups.

   Meant to be used by debugging tools such as the Chrome Ember Extension.

   - Groups all attributes in "Attributes" group.
   - Groups all belongsTo relationships in "Belongs To" group.
   - Groups all hasMany relationships in "Has Many" group.
   - Groups all flags in "Flags" group.
   - Flags relationship CPs as expensive properties.
  */
  _debugInfo: function() {
    var attributes = ['id'],
        relationships = { belongsTo: [], hasMany: [] },
        expensiveProperties = [];

    this.eachAttribute(function(name, meta) {
      attributes.push(name);
    }, this);

    this.eachRelationship(function(name, relationship) {
      relationships[relationship.kind].push(name);
      expensiveProperties.push(name);
    });

    var groups = [
      {
        name: 'Attributes',
        properties: attributes,
        expand: true,
      },
      {
        name: 'Belongs To',
        properties: relationships.belongsTo,
        expand: true
      },
      {
        name: 'Has Many',
        properties: relationships.hasMany,
        expand: true
      },
      {
        name: 'Flags',
        properties: ['isLoaded', 'isDirty', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      }
    ];

    return {
      propertyInfo: {
        // include all other mixins / properties (not just the grouped ones)
        includeOtherProperties: true,
        groups: groups,
        // don't pre-calculate unless cached
        expensiveProperties: expensiveProperties
      }
    };
  }

});

})();



(function() {
/**
  @module ember-data
*/

})();



(function() {
//Copyright (C) 2011 by Living Social, Inc.

//Permission is hereby granted, free of charge, to any person obtaining a copy of
//this software and associated documentation files (the "Software"), to deal in
//the Software without restriction, including without limitation the rights to
//use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//of the Software, and to permit persons to whom the Software is furnished to do
//so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

/**
  Ember Data

  @module ember-data
  @main ember-data
*/

})();


})();
