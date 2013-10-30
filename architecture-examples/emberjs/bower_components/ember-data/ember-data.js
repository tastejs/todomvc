// Version: v1.0.0-beta.1
// Last commit: cafab9d (2013-09-01 00:42:39 -0700)


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
Ember.String.pluralize = function(word) {
  return Ember.Inflector.inflector.pluralize(word);
};

Ember.String.singularize = function(word) {
  return Ember.Inflector.inflector.singularize(word);
};

})();



(function() {
var BLANK_REGEX = /^\s*$/;

function loadUncountable(rules, uncountable) {
  for (var i = 0, length = uncountable.length; i < length; i++) {
    rules.uncountable[uncountable[i]] = true;
  }
}

function loadIrregular(rules, irregularPairs) {
  var pair;

  for (var i = 0, length = irregularPairs.length; i < length; i++) {
    pair = irregularPairs[i];

    rules.irregular[pair[0]] = pair[1];
    rules.irregularInverse[pair[1]] = pair[0];
  }
}

function Inflector(ruleSet) {
  ruleSet = ruleSet || {};
  ruleSet.uncountable = ruleSet.uncountable || {};
  ruleSet.irregularPairs= ruleSet.irregularPairs|| {};

  var rules = this.rules = {
    plurals:  ruleSet.plurals || [],
    singular: ruleSet.singular || [],
    irregular: {},
    irregularInverse: {},
    uncountable: {}
  };

  loadUncountable(rules, ruleSet.uncountable);
  loadIrregular(rules, ruleSet.irregularPairs);
}

Inflector.prototype = {
  pluralize: function(word) {
    return this.inflect(word, this.rules.plurals);
  },

  singularize: function(word) {
    return this.inflect(word, this.rules.singular);
  },

  inflect: function(word, typeRules) {
    var inflection, substitution, result, lowercase, isBlank,
    isUncountable, isIrregular, isIrregularInverse, rule;

    isBlank = BLANK_REGEX.test(word);

    if (isBlank) {
      return word;
    }

    lowercase = word.toLowerCase();

    isUncountable = this.rules.uncountable[lowercase];

    if (isUncountable) {
      return word;
    }

    isIrregular = this.rules.irregular[lowercase];

    if (isIrregular) {
      return isIrregular;
    }

    isIrregularInverse = this.rules.irregularInverse[lowercase];

    if (isIrregularInverse) {
      return isIrregularInverse;
    }

    for (var i = typeRules.length, min = 0; i > min; i--) {
       inflection = typeRules[i-1];
       rule = inflection[0];

      if (rule.test(word)) {
        break;
      }
    }

    inflection = inflection || [];

    rule = inflection[0];
    substitution = inflection[1];

    result = word.replace(rule, substitution);

    return result;
  }
};

Ember.Inflector = Inflector;

})();



(function() {
Ember.Inflector.defaultRules = {
  plurals: [
    [/$/, 's'],
    [/s$/i, 's'],
    [/^(ax|test)is$/i, '$1es'],
    [/(octop|vir)us$/i, '$1i'],
    [/(octop|vir)i$/i, '$1i'],
    [/(alias|status)$/i, '$1es'],
    [/(bu)s$/i, '$1ses'],
    [/(buffal|tomat)o$/i, '$1oes'],
    [/([ti])um$/i, '$1a'],
    [/([ti])a$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
    [/(hive)$/i, '$1s'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/(x|ch|ss|sh)$/i, '$1es'],
    [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'],
    [/^(m|l)ouse$/i, '$1ice'],
    [/^(m|l)ice$/i, '$1ice'],
    [/^(ox)$/i, '$1en'],
    [/^(oxen)$/i, '$1'],
    [/(quiz)$/i, '$1zes']
  ],

  singular: [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(n)ews$/i, '$1ews'],
    [/([ti])a$/i, '$1um'],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'],
    [/(^analy)(sis|ses)$/i, '$1sis'],
    [/([^f])ves$/i, '$1fe'],
    [/(hive)s$/i, '$1'],
    [/(tive)s$/i, '$1'],
    [/([lr])ves$/i, '$1f'],
    [/([^aeiouy]|qu)ies$/i, '$1y'],
    [/(s)eries$/i, '$1eries'],
    [/(m)ovies$/i, '$1ovie'],
    [/(x|ch|ss|sh)es$/i, '$1'],
    [/^(m|l)ice$/i, '$1ouse'],
    [/(bus)(es)?$/i, '$1'],
    [/(o)es$/i, '$1'],
    [/(shoe)s$/i, '$1'],
    [/(cris|test)(is|es)$/i, '$1is'],
    [/^(a)x[ie]s$/i, '$1xis'],
    [/(octop|vir)(us|i)$/i, '$1us'],
    [/(alias|status)(es)?$/i, '$1'],
    [/^(ox)en/i, '$1'],
    [/(vert|ind)ices$/i, '$1ex'],
    [/(matr)ices$/i, '$1ix'],
    [/(quiz)zes$/i, '$1'],
    [/(database)s$/i, '$1']
  ],

  irregularPairs: [
    ['person', 'people'],
    ['man', 'men'],
    ['child', 'children'],
    ['sex', 'sexes'],
    ['move', 'moves'],
    ['cow', 'kine'],
    ['zombie', 'zombies']
  ],

  uncountable: [
    'equipment',
    'information',
    'rice',
    'money',
    'species',
    'series',
    'fish',
    'sheep',
    'jeans',
    'police'
  ]
};

})();



(function() {
if (Ember.EXTEND_PROTOTYPES) {
  /**
    See {{#crossLink "Ember.String/pluralize"}}{{/crossLink}}

    @method pluralize
    @for String
  */
  String.prototype.pluralize = function() {
    return Ember.String.pluralize(this);
  };

  /**
    See {{#crossLink "Ember.String/singularize"}}{{/crossLink}}

    @method singularize
    @for String
  */
  String.prototype.singularize = function() {
    return Ember.String.singularize(this);
  };
}

})();



(function() {
Ember.Inflector.inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

})();



(function() {

})();


})();
// Version: v1.0.0-beta.1
// Last commit: cafab9d (2013-09-01 00:42:39 -0700)


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
    VERSION: '1.0.0-beta.1'
  });

  if ('undefined' !== typeof window) {
    window.DS = DS;
  }
}
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
var get = Ember.get, set = Ember.set, isNone = Ember.isNone;

var transforms = DS.JSONTransforms;

// Simple dispatcher to support overriding the aliased
// method in subclasses.
function aliasMethod(methodName) {
  return function() {
    return this[methodName].apply(this, arguments);
  };
}

DS.JSONSerializer = Ember.Object.extend({
  primaryKey: 'id',

  deserialize: function(type, data) {
    var store = get(this, 'store');

    type.eachTransformedAttribute(function(key, type) {
      data[key] = transforms[type].deserialize(data[key]);
    });

    type.eachRelationship(function(key, relationship) {
      // A link (usually a URL) was already provided in
      // normalized form
      if (data.links && data.links[key]) {
        return;
      }

      var type = relationship.type,
          value = data[key];

      if (value == null) { return; }

      if (relationship.kind === 'belongsTo') {
        this.deserializeRecordId(data, key, relationship, value);
      } else if (relationship.kind === 'hasMany') {
        this.deserializeRecordIds(data, key, relationship, value);
      }
    }, this);

    return data;
  },

  deserializeRecordId: function(data, key, relationship, id) {
    if (isNone(id) || id instanceof DS.Model) {
      return;
    }

    var type;

    if (typeof id === 'number' || typeof id === 'string') {
      type = this.typeFor(relationship, key, data);
      data[key] = get(this, 'store').recordForId(type, id);
    } else if (typeof id === 'object') {
      // polymorphic
      data[key] = get(this, 'store').recordForId(id.type, id.id);
    }
  },

  deserializeRecordIds: function(data, key, relationship, ids) {
    for (var i=0, l=ids.length; i<l; i++) {
      this.deserializeRecordId(ids, i, relationship, ids[i]);
    }
  },

  // SERIALIZE

  serialize: function(record, options) {
    var store = get(this, 'store');

    var json = {};

    if (options && options.includeId) {
      var id = get(record, 'id');

      if (id) {
        json[get(this, 'primaryKey')] = get(record, 'id');
      }
    }

    var attrs = get(this, 'attrs');

    record.eachAttribute(function(key, attribute) {
      var value = get(record, key), type = attribute.type;

      if (type) {
        value = transforms[type].serialize(value);
      }

      // if provided, use the mapping provided by `attrs` in
      // the serializer
      key = attrs && attrs[key] || key;

      json[key] = value;
    }, this);

    record.eachRelationship(function(key, relationship) {
      if (relationship.kind === 'belongsTo') {
        this.serializeBelongsTo(record, json, relationship);
      } else if (relationship.kind === 'hasMany') {
        this.serializeHasMany(record, json, relationship);
      }
    }, this);

    return json;
  },

  serializeBelongsTo: function(record, json, relationship) {
    var key = relationship.key;

    var belongsTo = get(record, key);

    if (isNone(belongsTo)) { return; }

    json[key] = get(belongsTo, 'id');

    if (relationship.options.polymorphic) {
      json[key + "_type"] = belongsTo.constructor.typeKey;
    }
  },

  serializeHasMany: Ember.K,

  // EXTRACT

  extract: function(store, type, payload, id, requestType) {
    var specificExtract = "extract" + requestType.charAt(0).toUpperCase() + requestType.substr(1);
    return this[specificExtract](store, type, payload, id, requestType);
  },

  extractFindAll: aliasMethod('extractArray'),
  extractFindQuery: aliasMethod('extractArray'),
  extractFindMany: aliasMethod('extractArray'),
  extractFindHasMany: aliasMethod('extractArray'),

  extractCreateRecord: aliasMethod('extractSave'),
  extractUpdateRecord: aliasMethod('extractSave'),
  extractDeleteRecord: aliasMethod('extractSave'),

  extractFind: aliasMethod('extractSingle'),
  extractSave: aliasMethod('extractSingle'),

  extractSingle: function(store, type, payload) {
    return payload;
  },

  extractArray: function(store, type, payload) {
    return payload;
  },
  // HELPERS

  typeFor: function(relationship, key, data) {
    if (relationship.options.polymorphic) {
      return data[key + "_type"];
    } else {
      return relationship.type;
    }
  },

  eachEmbeddedRecord: function() {
    // this is used by transaction.add
  }
});

})();



(function() {
/**
  @module ember-data
*/
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
      application.register('store:main', application.Store || DS.Store);
      application.register('serializer:_default', DS.JSONSerializer);
      application.register('serializer:_rest', DS.RESTSerializer);
      application.register('adapter:_rest', DS.RESTAdapter);

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
    name: "dataAdapter",

    initialize: function(container, application) {
      application.register('dataAdapter:main', DS.DebugAdapter);
    }
  });

  Application.initializer({
    name: "injectStore",

    initialize: function(container, application) {
      application.inject('controller', 'store', 'store:main');
      application.inject('route', 'store', 'store:main');
      application.inject('serializer', 'store', 'store:main');
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

var get = Ember.get, set = Ember.set;

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
*/

DS.RecordArray = Ember.ArrayProxy.extend(Ember.Evented, {
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
    var content = get(this, 'content');

    return content.objectAt(index);
  },

  update: function() {
    if (get(this, 'isUpdating')) { return; }

    var store = get(this, 'store'),
        type = get(this, 'type');

    store.fetchAll(type, this);
  },

  addRecord: function(record) {
    get(this, 'content').addObject(record);
  },

  removeRecord: function(record) {
    get(this, 'content').removeObject(record);
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

  load: function(data) {
    var store = get(this, 'store'),
        type = get(this, 'type'),
        records = store.pushMany(type, data);

    this.setProperties({
      content: Ember.A(records),
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
    var records = get(this, 'content'),
        store = get(this, 'store'),
        owner = get(this, 'owner');

    var unloadedRecords = records.filterProperty('isEmpty', true);
    store.fetchMany(unloadedRecords, owner);
  },

  // Overrides Ember.Array's replace method to implement
  replaceContent: function(index, removed, added) {
    // Map the array of record objects into an array of  client ids.
    added = map(added, function(record) {
      Ember.assert("You cannot add '" + record.constructor.typeKey + "' records to this relationship (only '" + this.type.typeKey + "' allowed)", !this.type || record instanceof this.type);
      return record;
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
        var record = get(this, 'content').objectAt(i);

        var change = DS.RelationshipChange.createChange(owner, record, get(this, 'store'), {
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
        var record = get(this, 'content').objectAt(i);

        var change = DS.RelationshipChange.createChange(owner, record, store, {
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

      this._changesToSync.clear();
    }
  },

  // Create a child record within the owner
  createRecord: function(hash) {
    var owner = get(this, 'owner'),
        store = get(owner, 'store'),
        type = get(this, 'type'),
        record;

    Ember.assert("You cannot add '" + type.typeKey + "' records to this polymorphic relationship.", !get(this, 'isPolymorphic'));

    record = store.createRecord.call(store, type, hash);
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
var OrderedSet = Ember.OrderedSet;
var resolve = Ember.RSVP.resolve;

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
    @method init
    @private
  */
  init: function() {
    // internal bookkeeping; not observable
    this.typeMaps = {};
    this.recordArrayManager = DS.RecordArrayManager.create({
      store: this
    });
    this._relationshipChanges = {};
    this._pendingSave = [];
  },

  /**
    The adapter to use to communicate to a backend server or other persistence layer.

    This can be specified as an instance, class, or string.

    If you want to specify `App.CustomAdapter` as a string, do:

    ```js
    adapter: 'custom'
    ```

    @property adapter
    @default DS.RESTAdapter
    @type {DS.Adapter|String}
  */
  adapter: '_rest',

  /**
    Returns a JSON representation of the record using a custom
    type-specific serializer, if one exists.

    The available options are:

    * `includeId`: `true` if the record's ID should be included in
      the JSON representation

    @method serialize
    @private
    @param {DS.Model} record the record to serialize
    @param {Object} options an options hash
  */
  serialize: function(record, options) {
    return this.serializerFor(record.constructor.typeKey).serialize(record, options);
  },

  /**
    This property returns the adapter, after resolving a possible
    string key.

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
      adapter = this.container.lookup('adapter:' + adapter) || this.container.lookup('adapter:application') || this.container.lookup('adapter:_rest');
    }

    if (DS.Adapter.detect(adapter)) {
      adapter = adapter.create({ container: this.container });
    }

    return adapter;
  }).property('adapter'),

  // .....................
  // . CREATE NEW RECORD .
  // .....................

  /**
    Create a new record in the current store. The properties passed
    to this method are set on the newly created record.

    To create a new instance of `App.Post`:

    ```js
    store.createRecord('post', {
      title: "Rails is omakase"
    });
    ```

    @method createRecord
    @param {String} type
    @param {Object} properties a hash of properties to set on the
      newly created record.
    @returns DS.Model
  */
  createRecord: function(type, properties) {
    type = this.modelFor(type);

    properties = properties || {};

    // If the passed properties do not include a primary key,
    // give the adapter an opportunity to generate one. Typically,
    // client-side ID generators will use something like uuid.js
    // to avoid conflicts.

    if (isNone(properties.id)) {
      properties.id = this._generateId(type);
    }

    // Coerce ID to a string
    properties.id = coerceId(properties.id);

    var record = this.buildRecord(type, properties.id);

    // Move the record out of its initial `empty` state into
    // the `loaded` state.
    record.loadedData();

    // Set the properties specified on the record.
    record.setProperties(properties);

    return record;
  },

  /**
    If possible, this method asks the adapter to generate an ID for
    a newly created record.

    @method generateId
    @param {String} type
    @returns String if the adapter can generate one, an ID
  */
  _generateId: function(type) {
    var adapter = this.adapterForType(type);

    if (adapter && adapter.generateIdForRecord) {
      return adapter.generateIdForRecord(this);
    }

    return null;
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
    this method is the model's name as a string.

    ---

    To find a record by ID, pass the `id` as the second parameter:

        store.find('person', 1);

    The `find` method will always return a **promise** that will be resolved
    with the record. If the record was already in the store, the promise will
    be resolved immediately. Otherwise, the store will ask the adapter's `find`
    method to find the necessary data.

    The `find` method will always resolve its promise with the same object for
    a given type and `id`.

    ---

    To find all records for a type, call `find` with no additional parameters:

        store.find('person');

    This will ask the adapter's `findAll` method to find the records for the
    given type, and return a promise that will be resolved once the server
    returns the values.

    ---

    To find a record by a query, call `find` with a hash as the second
    parameter:

        store.find(App.Person, { page: 1 });

    This will ask the adapter's `findQuery` method to find the records for
    the query, and return a promise that will be resolved once the server
    responds.

    @method find
    @param {DS.Model} type
    @param {Object|String|Integer|null} id
  */
  find: function(type, id) {
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

    @method findById
    @private
    @param type
    @param id
  */
  findById: function(type, id) {
    type = this.modelFor(type);

    var record = this.getById(type, id);
    if (get(record, 'isEmpty')) {
      return promiseObject(this.fetchRecord(record));
    } else {
      return promiseObject(resolve(record));
    }
  },

  /**
    This method makes a series of requests to the adapter's `find` method
    and returns a promise that resolves once they are all loaded.

    @method findByIds
    @param {String} type
    @param {Array} ids
    @returns Promise
  */
  findByIds: function(type, ids) {
    var store = this;

    return promiseArray(Ember.RSVP.all(map(ids, function(id) {
      return store.findById(type, id);
    })).then(function(array) {
      return Ember.A(array);
    }));
  },

  /**
    This method is called by `findById` if it discovers that a particular
    type/id pair hasn't been loaded yet to kick off a request to the
    adapter.

    @method fetchRecord
    @private
    @param {DS.Model} record
    @returns Promise
  */
  fetchRecord: function(record) {
    var type = record.constructor,
        id = get(record, 'id'),
        resolver = Ember.RSVP.defer();

    record.loadingData();

    var adapter = this.adapterForType(type);

    Ember.assert("You tried to find a record but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to find a record but your adapter (for " + type + ") does not implement 'find'", adapter.find);

    _find(adapter, this, type, id, resolver);

    return resolver.promise;
  },

  /**
    Get a record by a given type and ID without triggering a fetch.

    This method will synchronously return the record if it's available.
    Otherwise, it will return undefined.

    ```js
    var post = store.getById('post', 1);
    ```

    @method getById
    @param type
    @param id
  */
  getById: function(type, id) {
    type = this.modelFor(type);

    if (this.hasRecordForId(type, id)) {
      return this.recordForId(type, id);
    } else {
      return this.buildRecord(type, id);
    }
  },

  /**
    This method is called by the record's `reload` method. The record's `reload`
    passes in a resolver for the promise it returns.

    This method calls the adapter's `find` method, which returns a promise. When
    **that** promise resolves, `reloadRecord` will resolve the promise returned
    by the record's `reload`.

    @method reloadRecord
    @private
    @param {DS.Model} record
    @param {Resolver} resolver
  */
  reloadRecord: function(record, resolver) {
    var type = record.constructor,
        adapter = this.adapterForType(type),
        store = this,
        id = get(record, 'id');

    Ember.assert("You cannot reload a record without an ID", id);
    Ember.assert("You tried to reload a record but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to reload a record but your adapter does not implement `find`", adapter.find);

    return _find(adapter, this, type, id, resolver);
  },

  /**
    This method takes a list of records, groups the records by type,
    converts the records into IDs, and then invokes the adapter's `findMany`
    method.

    The records are grouped by type to invoke `findMany` on adapters
    for each unique type in records.

    It is used both by a brand new relationship (via the `findMany`
    method) or when the data underlying an existing relationship
    changes.

    @method fetchMany
    @private
    @param records
    @param owner
  */
  fetchMany: function(records, owner, resolver) {
    if (!records.length) { return; }

    // Group By Type
    var recordsByTypeMap = Ember.MapWithDefault.create({
      defaultValue: function() { return Ember.A(); }
    });

    forEach(records, function(record) {
      recordsByTypeMap.get(record.constructor).push(record);
    });

    forEach(recordsByTypeMap, function(type, records) {
      var ids = records.mapProperty('id'),
          adapter = this.adapterForType(type);

      Ember.assert("You tried to load many records but you have no adapter (for " + type + ")", adapter);
      Ember.assert("You tried to load many records but your adapter does not implement `findMany`", adapter.findMany);

      _findMany(adapter, this, type, ids, owner, resolver);
    }, this);
  },

  /**
    Returns true if a record for a given type and ID is already loaded.

    @param {String} type
    @param {String|Integer} id
    @returns Boolean
  */
  hasRecordForId: function(type, id) {
    id = coerceId(id);

    return !!this.typeMapFor(type).idToRecord[id];
  },

  /**
    Returns id record for a given type and ID. If one isn't already loaded,
    it builds a new record and leaves it in the `empty` state.

    @param {String} type
    @param {String|Integer} id
    @returns DS.Model
  */
  recordForId: function(type, id) {
    type = this.modelFor(type);

    id = coerceId(id);

    var record = this.typeMapFor(type).idToRecord[id];

    if (!record) {
      record = this.buildRecord(type, id);
    }

    return record;
  },

  /**
    @method findMany
    @private
    @param {DS.Model} owner
    @param {Array<DS.Model>} records
    @param {String} type
    @param {Resolver} resolver
    @return DS.ManyArray
  */
  findMany: function(owner, records, type, resolver) {
    type = this.modelFor(type);

    records = Ember.A(records);

    var unloadedRecords = records.filterProperty('isEmpty', true),
        manyArray = this.recordArrayManager.createManyArray(type, records);

    unloadedRecords.forEach(function(record) {
      record.loadingData();
    });

    manyArray.loadingRecordsCount = unloadedRecords.length;

    if (unloadedRecords.length) {
      unloadedRecords.forEach(function(record) {
        this.recordArrayManager.registerWaitingRecordArray(record, manyArray);
      }, this);

      this.fetchMany(unloadedRecords, owner, resolver);
    } else {
      manyArray.set('isLoaded', true);
      Ember.run.once(manyArray, 'trigger', 'didLoad');
    }

    return manyArray;
  },

  /**
    If a relationship was originally populated by the adapter as a link
    (as opposed to a list of IDs), this method is called when the
    relationship is fetched.

    The link (which is usually a URL) is passed through unchanged, so the
    adapter can make whatever request it wants.

    The usual use-case is for the server to register a URL as a link, and
    then use that URL in the future to make a request for the relationship.

    @private
    @param {DS.Model} owner
    @param {any} link
    @param {String} type
    @param {Resolver} resolver
    @return DS.ManyArray
  */
  findHasMany: function(owner, link, relationship, resolver) {
    var adapter = this.adapterForType(owner.constructor);

    Ember.assert("You tried to load a hasMany relationship but you have no adapter (for " + owner.constructor + ")", adapter);
    Ember.assert("You tried to load a hasMany relationship from a specified `link` in the original payload but your adapter does not implement `findHasMany`", adapter.findHasMany);

    var records = this.recordArrayManager.createManyArray(relationship.type, Ember.A([]));
    _findHasMany(adapter, this, owner, link, relationship, resolver);
    return records;
  },

  /**
    This method delegates a query to the adapter. This is the one place where
    adapter-level semantics are exposed to the application.

    Exposing queries this way seems preferable to creating an abstract query
    language for all server-side queries, and then require all adapters to
    implement them.

    This method returns a promise, which is resolved with a `RecordArray`
    once the server returns.

    @method findQuery
    @private
    @param {String} type
    @param {any} query an opaque query to be used by the adapter
    @return Promise
  */
  findQuery: function(type, query) {
    type = this.modelFor(type);

    var array = DS.AdapterPopulatedRecordArray.create({
      type: type,
      query: query,
      content: Ember.A(),
      store: this
    });

    var adapter = this.adapterForType(type),
        resolver = Ember.RSVP.defer();

    Ember.assert("You tried to load a query but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to load a query but your adapter does not implement `findQuery`", adapter.findQuery);

    _findQuery(adapter, this, type, query, array, resolver);

    return promiseArray(resolver.promise);
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
    type = this.modelFor(type);

    return this.fetchAll(type, this.all(type));
  },

  /**
    @method fetchAll
    @private
    @param type
    @param array
    @returns Promise
  */
  fetchAll: function(type, array) {
    var adapter = this.adapterForType(type),
        sinceToken = this.typeMapFor(type).metadata.since,
        resolver = Ember.RSVP.defer();

    set(array, 'isUpdating', true);

    Ember.assert("You tried to load all records but you have no adapter (for " + type + ")", adapter);
    Ember.assert("You tried to load all records but your adapter does not implement `findAll`", adapter.findAll);

    _findAll(adapter, this, type, sinceToken, resolver);

    return promiseArray(resolver.promise);
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
    var promise;

    // allow an optional server query
    if (arguments.length === 3) {
      promise = this.findQuery(type, query);
    } else if (arguments.length === 2) {
      filter = query;
    }

    type = this.modelFor(type);

    var array = DS.FilteredRecordArray.create({
      type: type,
      content: Ember.A(),
      store: this,
      manager: this.recordArrayManager,
      filterFunction: filter
    });

    this.recordArrayManager.registerFilteredRecordArray(array, type, filter);

    if (promise) {
      return promise.then(function() { return array; });
    } else {
      return array;
    }
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
    if (!this.hasRecordForId(type, id)) { return false; }
    return !get(this.recordForId(type, id), 'isEmpty');
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
  dataWasUpdated: function(type, record) {
    // Because data updates are invoked at the end of the run loop,
    // it is possible that a record might be deleted after its data
    // has been modified and this method was scheduled to be called.
    //
    // If that's the case, the record would have already been removed
    // from all record arrays; calling updateRecordArrays would just
    // add it back. If the record is deleted, just bail. It shouldn't
    // give us any more trouble after this.

    if (get(record, 'isDeleted')) { return; }

    if (get(record, 'isLoaded')) {
      this.recordArrayManager.recordDidChange(record);
    }
  },

  // ..............
  // . PERSISTING .
  // ..............

  /**
    This method is called by `record.save`, and gets passed a
    resolver for the promise that `record.save` returns.

    It schedules saving to happen at the end of the run loop.

    @method scheduleSave
    @private
    @param {DS.Model} record
    @param {Resolver} resolver
  */
  scheduleSave: function(record, resolver) {
    record.adapterWillCommit();
    this._pendingSave.push([record, resolver]);
    once(this, 'flushPendingSave');
  },

  /**
    This method is called at the end of the run loop, and
    flushes any records passed into `scheduleSave`

    @method flushPendingSave
    @private
  */
  flushPendingSave: function() {
    var pending = this._pendingSave.slice();
    this._pendingSave = [];

    forEach(pending, function(tuple) {
      var record = tuple[0], resolver = tuple[1],
          adapter = this.adapterForType(record.constructor),
          operation;

      if (get(record, 'isNew')) {
        operation = 'createRecord';
      } else if (get(record, 'isDeleted')) {
        operation = 'deleteRecord';
      } else {
        operation = 'updateRecord';
      }

      _commit(adapter, this, operation, record, resolver);
    }, this);
  },

  /**
    This method is called once the promise returned by an
    adapter's `createRecord`, `updateRecord` or `deleteRecord`
    is resolved.

    If the data provides a server-generated ID, it will
    update the record and the store's indexes.

    @method didSaveRecord
    @private
    @param {DS.Model} record the in-flight record
    @param {Object} data optional data (see above)
  */
  didSaveRecord: function(record, data) {
    if (data) {
      this.updateId(record, data);
    }

    record.adapterDidCommit(data);
  },

  /**
    This method is called once the promise returned by an
    adapter's `createRecord`, `updateRecord` or `deleteRecord`
    is rejected with a `DS.InvalidError`.

    @method recordWasInvalid
    @private
    @param {DS.Model} record
    @param {Object} errors
  */
  recordWasInvalid: function(record, errors) {
    record.adapterDidInvalidate(errors);
  },

  /**
    This method is called once the promise returned by an
    adapter's `createRecord`, `updateRecord` or `deleteRecord`
    is rejected (with anything other than a `DS.InvalidError`).

    @method recordWasError
    @private
    @param {DS.Model} record
  */
  recordWasError: function(record) {
    record.adapterDidError();
  },

  /**
    When an adapter's `createRecord`, `updateRecord` or `deleteRecord`
    resolves with data, this method extracts the ID from the supplied
    data.

    @method updateId
    @private
    @param {DS.Model} record
    @param {Object} data
  */
  updateId: function(record, data) {
    var oldId = get(record, 'id'),
        id = coerceId(data.id);

    Ember.assert("An adapter cannot assign a new id to a record that already has an id. " + record + " had id: " + oldId + " and you tried to update it with " + id + ". This likely happened because your server returned data in response to a find or update that had a different id than the one you sent.", oldId === null || id === oldId);

    this.typeMapFor(record.constructor).idToRecord[id] = record;

    set(record, 'id', id);
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
      idToRecord: {},
      records: [],
      metadata: {}
    };

    typeMaps[guid] = typeMap;

    return typeMap;
  },

  // ................
  // . LOADING DATA .
  // ................

  /**
    This internal method is used by `push`.

    @method _load
    @private
    @param {DS.Model} type
    @param data
    @param prematerialized
  */
  _load: function(type, data) {
    var id = coerceId(data.id),
        record = this.recordForId(type, id);

    record.setupData(data);
    this.recordArrayManager.recordDidChange(record);

    return record;
  },

  /**
    Returns a model class for a particular key. Used by
    methods that take a type key (like `find`, `createRecord`,
    etc.)

    @param {String} key
    @returns {subclass of DS.Model}
  */
  modelFor: function(key) {
    if (typeof key !== 'string') {
      return key;
    }

    var factory = this.container.lookupFactory('model:'+key);

    Ember.assert("No model was found for '" + key + "'", factory);

    factory.store = this;
    factory.typeKey = key;

    return factory;
  },

  /**
    Push some data for a given type into the store.

    This method expects normalized data:

    * The ID is a key named `id` (an ID is mandatory)
    * The names of attributes are the ones you used in
      your model's `DS.attr`s.
    * Your relationships must be:
      * represented as IDs or Arrays of IDs
      * represented as model instances
      * represented as URLs, under the `links` key

    For this model:

    ```js
    App.Person = DS.Model.extend({
      firstName: DS.attr(),
      lastName: DS.attr(),

      children: DS.hasMany('person')
    });
    ```

    To represent the children as IDs:

    ```js
    {
      id: 1,
      firstName: "Tom",
      lastName: "Dale",
      children: [1, 2, 3]
    }
    ```

    To represent the children relationship as a URL:

    ```js
    {
      id: 1,
      firstName: "Tom",
      lastName: "Dale",
      links: {
        children: "/people/1/children"
      }
    }
    ```

    If you're streaming data or implementing an adapter,
    make sure that you have converted the incoming data
    into this form.

    This method can be used both to push in brand new
    records, as well as to update existing records.

    @method push
    @param {String} type
    @param {Object} data
    @returns DS.Model the record that was created or
      updated.
  */
  push: function(type, data) {
    var serializer = this.serializerFor(type);
    type = this.modelFor(type);

    data = serializer.deserialize(type, data);

    this._load(type, data);

    return this.recordForId(type, data.id);
  },

  /**
    If you have an Array of normalized data to push,
    you can call `pushMany` with the Array, and it will
    call `push` repeatedly for you.

    @method pushMany
    @param {String} type
    @param {Array} datas
    @return {Array<DS.Model>}
  */
  pushMany: function(type, datas) {
    return map(datas, function(data) {
      return this.push(type, data);
    }, this);
  },

  /**
    Build a brand new record for a given type, ID, and
    initial data.

    @method buildRecord
    @private
    @param {subclass of DS.Model} type
    @param {String} id
    @param {Object} data
    @returns DS.Model
  */
  buildRecord: function(type, id, data) {
    var typeMap = this.typeMapFor(type),
        idToRecord = typeMap.idToRecord;

    Ember.assert('The id ' + id + ' has already been used with another record of type ' + type.toString() + '.', !id || !idToRecord[id]);

    var record = type._create({
      id: id,
      store: this,
    });

    if (data) {
      record.setupData(data);
    }

    // if we're creating an item, this process will be done
    // later, once the object has been persisted.
    if (id) {
      idToRecord[id] = record;
    }

    typeMap.records.push(record);

    return record;
  },

  // ...............
  // . DESTRUCTION .
  // ...............

  /**
    When a record is destroyed, this un-indexes it and
    removes it from any record arrays so it can be GCed.

    @method dematerializeRecord
    @private
    @param {DS.Model} record
  */
  dematerializeRecord: function(record) {
    var type = record.constructor,
        typeMap = this.typeMapFor(type),
        id = get(record, 'id');

    record.updateRecordArrays();

    if (id) {
      delete typeMap.idToRecord[id];
    }

    var loc = indexOf(typeMap.records, record);
    typeMap.records.splice(loc, 1);
  },

  // ........................
  // . RELATIONSHIP CHANGES .
  // ........................

  addRelationshipChangeFor: function(childRecord, childKey, parentRecord, parentKey, change) {
    var clientId = childRecord.clientId,
        parentClientId = parentRecord ? parentRecord : parentRecord;
    var key = childKey + parentKey;
    var changes = this._relationshipChanges;
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

  removeRelationshipChangeFor: function(clientRecord, childKey, parentRecord, parentKey, type) {
    var clientId = clientRecord.clientId,
        parentClientId = parentRecord ? parentRecord.clientId : parentRecord;
    var changes = this._relationshipChanges;
    var key = childKey + parentKey;
    if (!(clientId in changes) || !(parentClientId in changes[clientId]) || !(key in changes[clientId][parentClientId])){
      return;
    }
    delete changes[clientId][parentClientId][key][type];
  },

  relationshipChangePairsFor: function(record){
    var toReturn = [];

    if( !record ) { return toReturn; }

    //TODO(Igor) What about the other side
    var changesObject = this._relationshipChanges[record.clientId];
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

  // ......................
  // . PER-TYPE ADAPTERS
  // ......................

  /**
    Returns the adapter for a given type.

    @method adapterForType
    @private
    @param {subclass of DS.Model} type
    @returns DS.Adapter
  */
  adapterForType: function(type) {
    var container = this.container, adapter;

    if (container) {
      adapter = container.lookup('adapter:' + type.typeKey) || container.lookup('adapter:application');
    }

    return adapter || get(this, '_adapter');
  },

  // ..............................
  // . RECORD CHANGE NOTIFICATION .
  // ..............................

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
    @private
    @param {String} type the record to serialize
  */
  serializerFor: function(type) {
    var container = this.container;

    // TODO: Make tests pass without this

    if (!container) {
      return DS.JSONSerializer.create({ store: this });
    }

    return container.lookup('serializer:'+type) ||
           container.lookup('serializer:application') ||
           container.lookup('serializer:_default');
  }
});

// Delegation to the adapter and promise management

DS.PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
DS.PromiseObject = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

function promiseObject(promise) {
  return DS.PromiseObject.create({ promise: promise });
}

function promiseArray(promise) {
  return DS.PromiseArray.create({ promise: promise });
}

function isThenable(object) {
  return object && typeof object.then === 'function';
}

function serializerFor(adapter, type) {
  var serializer = adapter.serializer,
      defaultSerializer = adapter.defaultSerializer,
      container = adapter.container;

  if (container && serializer === undefined) {
    serializer = container.lookup('serializer:'+type.typeKey) ||
                 container.lookup('serializer:application') ||
                 container.lookup('serializer:' + defaultSerializer || 'serializer:_default');
  }

  if (serializer === null || serializer === undefined) {
    serializer = {
      extract: function(store, type, payload) { return payload; }
    };
  }

  return serializer;
}

function _find(adapter, store, type, id, resolver) {
  var promise = adapter.find(store, type, id),
      serializer = serializerFor(adapter, type);

  return resolve(promise).then(function(payload) {
    Ember.assert("You made a request for a " + type.typeKey + " with id " + id + ", but the adapter's response did not have any data", payload);
    payload = serializer.extract(store, type, payload, id, 'find');

    return store.push(type, payload);
  }).then(resolver.resolve, resolver.reject);
}

function _findMany(adapter, store, type, ids, owner, resolver) {
  var promise = adapter.findMany(store, type, ids, owner),
      serializer = serializerFor(adapter, type);

  return resolve(promise).then(function(payload) {
    payload = serializer.extract(store, type, payload, null, 'findMany');

    store.pushMany(type, payload);
  }).then(resolver.resolve, resolver.reject);
}

function _findHasMany(adapter, store, record, link, relationship, resolver) {
  var promise = adapter.findHasMany(store, record, link, relationship),
      serializer = serializerFor(adapter, relationship.type);

  return resolve(promise).then(function(payload) {
    payload = serializer.extract(store, relationship.type, payload, null, 'findHasMany');

    var records = store.pushMany(relationship.type, payload);
    record.updateHasMany(relationship.key, records);
  }).then(resolver.resolve, resolver.reject);
}

function _findAll(adapter, store, type, sinceToken, resolver) {
  var promise = adapter.findAll(store, type, sinceToken),
      serializer = serializerFor(adapter, type);

  return resolve(promise).then(function(payload) {
    payload = serializer.extract(store, type, payload, null, 'findAll');

    store.pushMany(type, payload);
    store.didUpdateAll(type);
    return store.all(type);
  }).then(resolver.resolve, resolver.reject);
}

function _findQuery(adapter, store, type, query, recordArray, resolver) {
  var promise = adapter.findQuery(store, type, query, recordArray),
      serializer = serializerFor(adapter, type);

  return resolve(promise).then(function(payload) {
    payload = serializer.extract(store, type, payload, null, 'findAll');

    recordArray.load(payload);
    return recordArray;
  }).then(resolver.resolve, resolver.reject);
}

function _commit(adapter, store, operation, record, resolver) {
  var type = record.constructor,
      promise = adapter[operation](store, type, record),
      serializer = serializerFor(adapter, type);

  Ember.assert("Your adapter's '" + operation + "' method must return a promise, but it returned " + promise, isThenable(promise));

  return promise.then(function(payload) {
    payload = serializer.extract(store, type, payload, get(record, 'id'), operation);
    store.didSaveRecord(record, payload);
    return record;
  }, function(reason) {
    if (reason instanceof DS.InvalidError) {
      store.recordWasInvalid(record, reason.errors);
    } else {
      store.recordWasError(record, reason);
    }

    throw reason;
  }).then(resolver.resolve, resolver.reject);
}

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

var didSetProperty = function(record, context) {
  if (context.value !== context.oldValue) {
    record.send('becomeDirty');
    record.updateRecordArraysLater();
  }
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
// * isSaving: The record has been committed, but
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
    didSetProperty: didSetProperty,

    pushedData: Ember.K,

    becomeDirty: Ember.K,

    willCommit: function(record) {
      record.transitionTo('inFlight');
    },

    reloadRecord: function(record, resolver) {
      get(record, 'store').reloadRecord(record, resolver);
    },

    becameClean: function(record) {
      record.transitionTo('loaded.saved');
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

    // EVENTS
    didSetProperty: didSetProperty,
    becomeDirty: Ember.K,
    pushedData: Ember.K,

    // TODO: More robust semantics around save-while-in-flight
    willCommit: Ember.K,

    didCommit: function(record) {
      var dirtyType = get(this, 'dirtyType');

      record.transitionTo('saved');
      record.send('invokeLifecycleCallbacks', dirtyType);
    },

    becameInvalid: function(record, errors) {
      set(record, 'errors', errors);

      record.transitionTo('invalid');
      record.send('invokeLifecycleCallbacks');
    },

    becameError: function(record) {
      record.transitionTo('uncommitted');
      record.triggerLater('becameError', record);
    }
  },

  // A record is in the `invalid` state when its client-side
  // invalidations have failed, or if the adapter has indicated
  // the the record failed server-side invalidations.
  invalid: {
    // FLAGS
    isValid: false,

    // EVENTS
    deleteRecord: function(record) {
      record.transitionTo('deleted.uncommitted');
      record.clearRelationships();
    },

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
      record.triggerLater('becameInvalid', record);
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
  isDirty: false,
  isSaving: false,
  isDeleted: false,
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

      record.suspendRelationshipObservers(function() {
        record.notifyPropertyChange('data');
      });
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
    pushedData: function(record) {
      record.transitionTo('loaded.saved');
      record.triggerLater('didLoad');
      set(record, 'isError', false);
    },

    becameError: function(record) {
      record.triggerLater('becameError', record);
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

    // If there are no local changes to a record, it remains
    // in the `saved` state.
    saved: {
      setup: function(record) {
        var attrs = record._attributes,
            isDirty = false;

        for (var prop in attrs) {
          if (attrs.hasOwnProperty(prop)) {
            isDirty = true;
            break;
          }
        }

        if (isDirty) {
          record.adapterDidDirty();
        }
      },

      // EVENTS
      didSetProperty: didSetProperty,

      pushedData: Ember.K,

      becomeDirty: function(record) {
        record.transitionTo('updated.uncommitted');
      },

      willCommit: function(record) {
        record.transitionTo('updated.inFlight');
      },

      reloadRecord: function(record, resolver) {
        get(record, 'store').reloadRecord(record, resolver);
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
        record.send('invokeLifecycleCallbacks', get(record, 'lastDirtyType'));
      },

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
    // state. It will exit this state when the record
    // starts to commit.
    uncommitted: {

      // EVENTS

      willCommit: function(record) {
        record.transitionTo('inFlight');
      },

      rollback: function(record) {
        record.rollback();
      },

      becomeDirty: Ember.K,
      deleteRecord: Ember.K,

      becameClean: function(record) {
        record.transitionTo('loaded.saved');
      }
    },

    // After a record starts committing, but
    // before the adapter indicates that the deletion
    // has saved to the server, a record is in the
    // `inFlight` substate of `deleted`.
    inFlight: {
      // FLAGS
      isSaving: true,

      // EVENTS

      // TODO: More robust semantics around save-while-in-flight
      willCommit: Ember.K,
      didCommit: function(record) {
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
        record.triggerLater('didDelete', record);
        record.triggerLater('didCommit', record);
      }
    }
  },

  invokeLifecycleCallbacks: function(record, dirtyType) {
    if (dirtyType === 'created') {
      record.triggerLater('didCreate', record);
    } else {
      record.triggerLater('didUpdate', record);
    }

    record.triggerLater('didCommit', record);
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

var get = Ember.get, set = Ember.set, map = Ember.EnumerableUtils.map,
    merge = Ember.merge, once = Ember.run.once;

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
*/
DS.Model = Ember.Object.extend(Ember.Evented, {
  isEmpty: retrieveFromCurrentState,
  isLoading: retrieveFromCurrentState,
  isLoaded: retrieveFromCurrentState,
  isDirty: retrieveFromCurrentState,
  isSaving: retrieveFromCurrentState,
  isDeleted: retrieveFromCurrentState,
  isNew: retrieveFromCurrentState,
  isValid: retrieveFromCurrentState,
  dirtyType: retrieveFromCurrentState,

  isError: false,
  isReloading: false,

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
    this._data = this._data || {};
    return this._data;
  }).property(),

  _data: null,

  init: function() {
    set(this, 'currentState', DS.RootState.empty);
    this._super();
    this._setup();
  },

  _setup: function() {
    this._changesToSync = {};
    this._deferredTriggers = [];
    this._data = {};
    this._attributes = {};
    this._inFlightAttributes = {};
    this._relationships = {};
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
        var hasMany = this._relationships[relationship.name];
        if (hasMany) { hasMany.clear(); }
      }
    }, this);
  },

  updateRecordArrays: function() {
    var store = get(this, 'store');
    if (store) {
      store.dataWasUpdated(this.constructor, this);
    }
  },

  adapterWillCommit: function() {
    this.send('willCommit');
  },

  /**
    If the adapter did not return a hash in response to a commit,
    merge the changed attributes and relationships into the existing
    saved data.

    @method adapterDidCommit
  */
  adapterDidCommit: function(data) {
    set(this, 'isError', false);

    if (data) {
      this._data = data;
    } else {
      Ember.mixin(this._data, this._inFlightAttributes);
    }

    this._inFlightAttributes = {};

    this.send('didCommit');
    this.updateRecordArraysLater();

    if (!data) { return; }

    this.suspendRelationshipObservers(function() {
      this.notifyPropertyChange('data');
    });
  },

  adapterDidDirty: function() {
    this.send('becomeDirty');
    this.updateRecordArraysLater();
  },

  dataDidChange: Ember.observer(function() {
    this.reloadHasManys();
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
    var hasMany = this._relationships[key];

    if (hasMany) {
      var type = get(this.constructor, 'relationshipsByName').get(key).type;
      var store = get(this, 'store');
      var records = this._data[key] || [];

      set(hasMany, 'content', Ember.A(records));
      set(hasMany, 'isLoaded', true);
      hasMany.trigger('didLoad');
    }
  },

  updateRecordArraysLater: function() {
    Ember.run.once(this, this.updateRecordArrays);
  },

  setupData: function(data) {
    this._data = data;

    if (data) { this.pushedData(); }

    this.suspendRelationshipObservers(function() {
      this.notifyPropertyChange('data');
    });
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

  updateHasMany: function(name, records) {
    this._data[name] = records;
    this.hasManyDidChange(name);
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

  /**
    Save the record.

    @method save
  */
  save: function() {
    var resolver = Ember.RSVP.defer(), record = this;

    this.get('store').scheduleSave(this, resolver);
    this._inFlightAttributes = this._attributes;
    this._attributes = {};

    return DS.PromiseObject.create({ promise: resolver.promise });
  },

  /**
    Reload the record from the adapter.

    This will only work if the record has already finished loading
    and has not yet been modified (`isLoaded` but not `isDirty`,
    or `isSaving`).

    @method reload
  */
  reload: function() {
    set(this, 'isReloading', true);

    var resolver = Ember.RSVP.defer(), record = this;

    resolver.promise = resolver.promise.then(function() {
      record.set('isReloading', false);
      record.set('isError', false);
      return record;
    }, function(reason) {
      record.set('isError', true);
      throw reason;
    });

    this.send('reloadRecord', resolver);

    return DS.PromiseObject.create({ promise: resolver.promise });
  },

  // FOR USE DURING COMMIT PROCESS

  adapterDidUpdateAttribute: function(attributeName, value) {

    // If a value is passed in, update the internal attributes and clear
    // the attribute cache so it picks up the new value. Otherwise,
    // collapse the current value into the internal attributes because
    // the adapter has acknowledged it.
    if (value !== undefined) {
      this._data[attributeName] = value;
      this.notifyPropertyChange(attributeName);
    } else {
      this._data[attributeName] = this._inFlightAttributes[attributeName];
    }

    this.updateRecordArraysLater();
  },

  adapterDidInvalidate: function(errors) {
    this.send('becameInvalid', errors);
  },

  adapterDidError: function() {
    this.send('becameError');
    set(this, 'isError', true);
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
  },

  triggerLater: function() {
    this._deferredTriggers.push(arguments);
    once(this, '_triggerDeferredTriggers');
  },

  _triggerDeferredTriggers: function() {
    for (var i=0, l=this._deferredTriggers.length; i<l; i++) {
      this.trigger.apply(this, this._deferredTriggers[i]);
    }

    this._deferredTriggers = [];
  }
});

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
    throw new Ember.Error("You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.");
  }
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
  }),

  transformedAttributes: Ember.computed(function() {
    var map = Ember.Map.create();

    this.eachAttribute(function(key, meta) {
      if (meta.type) {
        map.set(key, meta.type);
      }
    });

    return map;
  }),

  eachAttribute: function(callback, binding) {
    get(this, 'attributes').forEach(function(name, meta) {
      callback.call(binding, name, meta);
    }, binding);
  },

  eachTransformedAttribute: function(callback, binding) {
    get(this, 'transformedAttributes').forEach(function(name, type) {
      callback.call(binding, name, type);
    });
  }
});


DS.Model.reopen({
  eachAttribute: function(callback, binding) {
    this.constructor.eachAttribute(callback, binding);
  }
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
      this.send('didSetProperty', { name: key, oldValue: this._attributes[key] || this._inFlightAttributes[key] || this._data[key], value: value });
      this._attributes[key] = value;
    } else if (this._attributes[key]) {
      return this._attributes[key];
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
  this.record = options.record;
  this.store = options.store;
  this.name = options.name;
  this.value = options.value;
  this.oldValue = options.oldValue;
};

AttributeChange.createChange = function(options) {
  return new AttributeChange(options);
};

AttributeChange.prototype = {
  sync: function() {
    if (this.value !== this.oldValue) {
      this.record.send('becomeDirty');
      this.record.updateRecordArraysLater();
    }

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
    delete this.record._changesToSync[this.name];
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
  this.parentRecord = options.parentRecord;
  this.childRecord = options.childRecord;
  this.firstRecord = options.firstRecord;
  this.firstRecordKind = options.firstRecordKind;
  this.firstRecordName = options.firstRecordName;
  this.secondRecord = options.secondRecord;
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

DS.RelationshipChange.createChange = function(firstRecord, secondRecord, store, options){
  // Get the type of the child based on the child's client ID
  var firstRecordType = firstRecord.constructor, changeType;
  changeType = DS.RelationshipChange.determineRelationshipType(firstRecordType, options);
  if (changeType === "oneToMany"){
    return DS.OneToManyChange.createChange(firstRecord, secondRecord, store, options);
  }
  else if (changeType === "manyToOne"){
    return DS.OneToManyChange.createChange(secondRecord, firstRecord, store, options);
  }
  else if (changeType === "oneToNone"){
    return DS.OneToNoneChange.createChange(firstRecord, secondRecord, store, options);
  }
  else if (changeType === "manyToNone"){
    return DS.ManyToNoneChange.createChange(firstRecord, secondRecord, store, options);
  }
  else if (changeType === "oneToOne"){
    return DS.OneToOneChange.createChange(firstRecord, secondRecord, store, options);
  }
  else if (changeType === "manyToMany"){
    return DS.ManyToManyChange.createChange(firstRecord, secondRecord, store, options);
  }
};

DS.OneToNoneChange.createChange = function(childRecord, parentRecord, store, options) {
  var key = options.key;
  var change = DS.RelationshipChange._createChange({
      parentRecord: parentRecord,
      childRecord: childRecord,
      firstRecord: childRecord,
      store: store,
      changeType: options.changeType,
      firstRecordName: key,
      firstRecordKind: "belongsTo"
  });

  store.addRelationshipChangeFor(childRecord, key, parentRecord, null, change);

  return change;
};

DS.ManyToNoneChange.createChange = function(childRecord, parentRecord, store, options) {
  var key = options.key;
  var change = DS.RelationshipChange._createChange({
      parentRecord: childRecord,
      childRecord: parentRecord,
      secondRecord: childRecord,
      store: store,
      changeType: options.changeType,
      secondRecordName: options.key,
      secondRecordKind: "hasMany"
  });

  store.addRelationshipChangeFor(childRecord, key, parentRecord, null, change);
  return change;
};


DS.ManyToManyChange.createChange = function(childRecord, parentRecord, store, options) {
  // If the name of the belongsTo side of the relationship is specified,
  // use that
  // If the type of the parent is specified, look it up on the child's type
  // definition.
  var key = options.key;

  var change = DS.RelationshipChange._createChange({
      parentRecord: parentRecord,
      childRecord: childRecord,
      firstRecord: childRecord,
      secondRecord: parentRecord,
      firstRecordKind: "hasMany",
      secondRecordKind: "hasMany",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childRecord, key, parentRecord, null, change);


  return change;
};

DS.OneToOneChange.createChange = function(childRecord, parentRecord, store, options) {
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
      parentRecord: parentRecord,
      childRecord: childRecord,
      firstRecord: childRecord,
      secondRecord: parentRecord,
      firstRecordKind: "belongsTo",
      secondRecordKind: "belongsTo",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childRecord, key, parentRecord, null, change);


  return change;
};

DS.OneToOneChange.maintainInvariant = function(options, store, childRecord, key){
  if (options.changeType === "add" && store.recordIsMaterialized(childRecord)) {
    var oldParent = get(childRecord, key);
    if (oldParent){
      var correspondingChange = DS.OneToOneChange.createChange(childRecord, oldParent, store, {
          parentType: options.parentType,
          hasManyName: options.hasManyName,
          changeType: "remove",
          key: options.key
        });
      store.addRelationshipChangeFor(childRecord, key, options.parentRecord , null, correspondingChange);
     correspondingChange.sync();
    }
  }
};

DS.OneToManyChange.createChange = function(childRecord, parentRecord, store, options) {
  var key;

  // If the name of the belongsTo side of the relationship is specified,
  // use that
  // If the type of the parent is specified, look it up on the child's type
  // definition.
  if (options.parentType) {
    key = options.parentType.inverseFor(options.key).name;
    DS.OneToManyChange.maintainInvariant( options, store, childRecord, key );
  } else if (options.key) {
    key = options.key;
  } else {
    Ember.assert("You must pass either a parentType or belongsToName option to OneToManyChange.forChildAndParent", false);
  }

  var change = DS.RelationshipChange._createChange({
      parentRecord: parentRecord,
      childRecord: childRecord,
      firstRecord: childRecord,
      secondRecord: parentRecord,
      firstRecordKind: "belongsTo",
      secondRecordKind: "hasMany",
      store: store,
      changeType: options.changeType,
      firstRecordName:  key
  });

  store.addRelationshipChangeFor(childRecord, key, parentRecord, change.getSecondRecordName(), change);


  return change;
};


DS.OneToManyChange.maintainInvariant = function(options, store, childRecord, key){
  if (options.changeType === "add" && childRecord) {
    var oldParent = get(childRecord, key);
    if (oldParent){
      var correspondingChange = DS.OneToManyChange.createChange(childRecord, oldParent, store, {
          parentType: options.parentType,
          hasManyName: options.hasManyName,
          changeType: "remove",
          key: options.key
        });
      store.addRelationshipChangeFor(childRecord, key, options.parentRecord, correspondingChange.getSecondRecordName(), correspondingChange);
      correspondingChange.sync();
    }
  }
};

/**
  @class RelationshipChange
  @namespace DS
*/
DS.RelationshipChange.prototype = {

  getSecondRecordName: function() {
    var name = this.secondRecordName, parent;

    if (!name) {
      parent = this.secondRecord;
      if (!parent) { return; }

      var childType = this.firstRecord.constructor;
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
    var childRecord = this.childRecord,
        belongsToName = this.getFirstRecordName(),
        hasManyName = this.getSecondRecordName(),
        store = this.store;

    store.removeRelationshipChangeFor(childRecord, belongsToName, this.parentRecord, hasManyName, this.changeType);
  },

  getSecondRecord: function(){
    return this.secondRecord;
  },

  /**
    @method getFirstRecord
    @private
  */
  getFirstRecord: function() {
    return this.firstRecord;
  },

  coalesce: function(){
    var relationshipPairs = this.store.relationshipChangePairsFor(this.firstRecord);
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

// the object is a value, and not a promise
function isValue(object) {
  return typeof object === 'object' && (!object.then || typeof object.then !== 'function');
}

DS.RelationshipChangeAdd.prototype.changeType = "add";
DS.RelationshipChangeAdd.prototype.sync = function() {
  var secondRecordName = this.getSecondRecordName(),
      firstRecordName = this.getFirstRecordName(),
      firstRecord = this.getFirstRecord(),
      secondRecord = this.getSecondRecord();

  //Ember.assert("You specified a hasMany (" + hasManyName + ") on " + (!belongsToName && (newParent || oldParent || this.lastParent).constructor) + " but did not specify an inverse belongsTo on " + child.constructor, belongsToName);
  //Ember.assert("You specified a belongsTo (" + belongsToName + ") on " + child.constructor + " but did not specify an inverse hasMany on " + (!hasManyName && (newParent || oldParent || this.lastParentRecord).constructor), hasManyName);

  if (secondRecord instanceof DS.Model && firstRecord instanceof DS.Model) {
    if(this.secondRecordKind === "belongsTo"){
      secondRecord.suspendRelationshipObservers(function(){
        set(secondRecord, secondRecordName, firstRecord);
      });

     }
     else if(this.secondRecordKind === "hasMany"){
      secondRecord.suspendRelationshipObservers(function(){
        var relationship = get(secondRecord, secondRecordName);
        if (isValue(relationship)) { relationship.addObject(firstRecord); }
      });
    }
  }

  if (firstRecord instanceof DS.Model && secondRecord instanceof DS.Model && get(firstRecord, firstRecordName) !== secondRecord) {
    if(this.firstRecordKind === "belongsTo"){
      firstRecord.suspendRelationshipObservers(function(){
        set(firstRecord, firstRecordName, secondRecord);
      });
    }
    else if(this.firstRecordKind === "hasMany"){
      firstRecord.suspendRelationshipObservers(function(){
        var relationship = get(firstRecord, firstRecordName);
        if (isValue(relationship)) { relationship.addObject(secondRecord); }
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

  if (secondRecord instanceof DS.Model && firstRecord instanceof DS.Model) {
    if(this.secondRecordKind === "belongsTo"){
      secondRecord.suspendRelationshipObservers(function(){
        set(secondRecord, secondRecordName, null);
      });
    }
    else if(this.secondRecordKind === "hasMany"){
      secondRecord.suspendRelationshipObservers(function(){
        var relationship = get(secondRecord, secondRecordName);
        if (isValue(relationship)) { relationship.removeObject(firstRecord); }
      });
    }
  }

  if (firstRecord instanceof DS.Model && get(firstRecord, firstRecordName)) {
    if(this.firstRecordKind === "belongsTo"){
      firstRecord.suspendRelationshipObservers(function(){
        set(firstRecord, firstRecordName, null);
      });
     }
     else if(this.firstRecordKind === "hasMany"){
       firstRecord.suspendRelationshipObservers(function(){
         var relationship = get(firstRecord, firstRecordName);
         if (isValue(relationship)) { relationship.removeObject(secondRecord); }
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

function asyncBelongsTo(type, options, meta) {
  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        store = get(this, 'store');

    if (arguments.length === 2) {
      Ember.assert("You can only add a '" + type + "' record to this relationship", !value || store.modelFor(type).detectInstance(value));
      return value === undefined ? null : value;
    }

    return store.fetchRecord(data[key]);
  }).property('data').meta(meta);
}

DS.belongsTo = function(type, options) {
  Ember.assert("The first argument DS.belongsTo must be a model type or string, like DS.belongsTo(App.Person)", !!type && (typeof type === 'string' || DS.Model.detect(type)));

  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'belongsTo' };

  if (options.async) {
    return asyncBelongsTo(type, options, meta);
  }

  return Ember.computed(function(key, value) {
    var data = get(this, 'data'),
        store = get(this, 'store'), belongsTo, typeClass;

    if (typeof type === 'string') {
      if (type.indexOf(".") === -1) {
        typeClass = store.modelFor(type);
      } else {
        typeClass = get(Ember.lookup, type);
      }
    } else {
      typeClass = type;
    }

    if (arguments.length === 2) {
      Ember.assert("You can only add a '" + type + "' record to this relationship", !value || typeClass.detectInstance(value));
      return value === undefined ? null : value;
    }

    belongsTo = data[key];

    if (isNone(belongsTo)) { return null; }

    if (get(belongsTo, 'isEmpty')) {
      store.fetchRecord(belongsTo);
    }

    return belongsTo;
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
      var oldParent = get(record, key),
          store = get(record, 'store');

      if (oldParent){
        var change = DS.RelationshipChange.createChange(record, oldParent, store, { key: key, kind: "belongsTo", changeType: "remove" });
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
        var store = get(record, 'store'),
            change = DS.RelationshipChange.createChange(record, newParent, store, { key: key, kind: "belongsTo", changeType: "add" });

        change.sync();
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

var get = Ember.get, set = Ember.set, setProperties = Ember.setProperties;
var forEach = Ember.EnumerableUtils.forEach;

function asyncHasMany(type, options, meta) {
  return Ember.computed(function(key, value) {
    var resolver = Ember.RSVP.defer();

    var relationship = buildRelationship(this, key, options, function(store, data) {
      var link = data.links && data.links[key];

      if (link) {
        return store.findHasMany(this, link, meta, resolver);
      } else {
        return store.findMany(this, data[key], meta.type, resolver);
      }
    });

    var promise = resolver.promise.then(function() {
      return relationship;
    });

    return DS.PromiseArray.create({ promise: promise });
  }).property('data').meta(meta);
}

function buildRelationship(record, key, options, callback) {
  var rels = record._relationships;

  if (rels[key]) { return rels[key]; }

  var data = get(record, 'data'),
      store = get(record, 'store');

  var relationship = rels[key] = callback.call(record, store, data);

  return setProperties(relationship, {
    owner: record, name: key, isPolymorphic: options.polymorphic
  });
}

function hasRelationship(type, options) {
  options = options || {};

  var meta = { type: type, isRelationship: true, options: options, kind: 'hasMany' };

  if (options.async) {
    return asyncHasMany(type, options, meta);
  }

  return Ember.computed(function(key, value) {
    return buildRelationship(this, key, options, function(store, data) {
      var records = data[key];
      Ember.assert("You looked up the '" + key + "' relationship on '" + this + "' but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.attr({ async: true })`)", Ember.A(records).everyProperty('isEmpty', false));
      return store.findMany(this, data[key], meta.type);
    });
  }).property('data').meta(meta);
}

DS.hasMany = function(type, options) {
  Ember.assert("The type passed to DS.hasMany must be defined", !!type);
  return hasRelationship(type, options);
};

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
          meta.type = this.store.modelFor(type);
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

    this.changedRecords = [];
  },

  recordDidChange: function(record) {
    this.changedRecords.push(record);
    once(this, this.updateRecordArrays);
  },

  recordArraysForRecord: function(record) {
    record._recordArrays = record._recordArrays || Ember.OrderedSet.create();
    return record._recordArrays;
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
    forEach(this.changedRecords, function(record) {
      var type = record.constructor,
          recordArrays = this.filteredRecordArrays.get(type),
          filter;

      forEach(recordArrays, function(array) {
        filter = get(array, 'filterFunction');
        this.updateRecordArray(array, filter, type, record);
      }, this);

      // loop through all manyArrays containing an unloaded copy of this
      // clientId and notify them that the record was loaded.
      var manyArrays = record._loadingRecordArrays;

      if (manyArrays) {
        for (var i=0, l=manyArrays.length; i<l; i++) {
          manyArrays[i].loadedRecord();
        }

        record._loadingRecordArrays = [];
      }
    }, this);

    this.changedRecords = [];
  },

  /**
    Update an individual filter.

    @method updateRecordArray
    @param {DS.FilteredRecordArray} array
    @param {Function} filter
    @param {Class} type
    @param {Number|String} clientId
  */
  updateRecordArray: function(array, filter, type, record) {
    var shouldBeInArray;

    if (!filter) {
      shouldBeInArray = true;
    } else {
      shouldBeInArray = filter(record);
    }

    var recordArrays = this.recordArraysForRecord(record);

    if (shouldBeInArray) {
      recordArrays.add(array);
      array.addRecord(record);
    } else if (!shouldBeInArray) {
      recordArrays.remove(array);
      array.removeRecord(record);
    }
  },

  /**
    When a record is deleted, it is removed from all its
    record arrays.

    @method remove
    @param {DS.Model} record
  */
  remove: function(record) {
    var recordArrays = record._recordArrays;

    if (!recordArrays) { return; }

    forEach(recordArrays, function(array) {
      array.removeRecord(record);
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
        records = typeMap.records, record;

    for (var i=0, l=records.length; i<l; i++) {
      record = records[i];

      if (!get(record, 'isDeleted') && !get(record, 'isEmpty')) {
        this.updateRecordArray(array, filter, type, record);
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
  createManyArray: function(type, records) {
    var manyArray = DS.ManyArray.create({
      type: type,
      content: records,
      store: this.store
    });

    forEach(records, function(record) {
      var arrays = this.recordArraysForRecord(record);
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
  registerWaitingRecordArray: function(record, array) {
    var loadingRecordArrays = record._loadingRecordArrays || [];
    loadingRecordArrays.push(array);
    record._loadingRecordArrays = loadingRecordArrays;
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set, merge = Ember.merge;
var forEach = Ember.EnumerableUtils.forEach;
var resolve = Ember.RSVP.resolve;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

DS.InvalidError = function(errors) {
  var tmp = Error.prototype.constructor.call(this, "The backend rejected the commit because it was invalid: " + Ember.inspect(errors));
  this.errors = errors;

  for (var i=0, l=errorProps.length; i<l; i++) {
    this[errorProps[i]] = tmp[errorProps[i]];
  }
};
DS.InvalidError.prototype = Ember.create(Error.prototype);

function isThenable(object) {
  return object && typeof object.then === 'function';
}

// Simple dispatcher to support overriding the aliased
// method in subclasses.
function aliasMethod(methodName) {
  return function() {
    return this[methodName].apply(this, arguments);
  };
}

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
    Proxies to the serializer's `serialize` method.

    @method serialize
    @param {DS.Model} record
    @param {Object}   options
  */
  serialize: function(record, options) {
    return get(record, 'store').serializerFor(record.constructor.typeKey).serialize(record, options);
  },

  /**
    Implement this method in a subclass to handle the creation of
    new records.

    Serializes the record and send it to the server.

    This implementation should call the adapter's `didCreateRecord`
    method on success or `didError` method on failure.

    @method createRecord
    @property {DS.Store} store
    @property {subclass of DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  createRecord: Ember.required(Function),

  /**
    Implement this method in a subclass to handle the updating of
    a record.

    Serializes the record update and send it to the server.

    @method updateRecord
    @property {DS.Store} store
    @property {subclass of DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  updateRecord: Ember.required(Function),

  /**
    Implement this method in a subclass to handle the deletion of
    a record.

    Sends a delete request for the record to the server.

    @method deleteRecord
    @property {DS.Store} store
    @property {subclass of DS.Model} type   the DS.Model class of the record
    @property {DS.Model} record
  */
  deleteRecord: Ember.required(Function),

  /**
    Find multiple records at once.

    By default, it loops over the provided ids and calls `find` on each.
    May be overwritten to improve performance and reduce the number of
    server requests.

    @method findMany
    @property {DS.Store} store
    @property {subclass of DS.Model} type   the DS.Model class of the records
    @property {Array}    ids
  */
  findMany: function(store, type, ids) {
    var promises = ids.map(function(id) {
      return this.find(store, type, id);
    }, this);

    return Ember.RSVP.all(promises);
  }
});

})();



(function() {
/**
  @module ember-data
*/

var get = Ember.get, fmt = Ember.String.fmt,
    indexOf = Ember.EnumerableUtils.indexOf;

var counter = 0;

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
  // by default, fixtures are already in normalized form
  serializer: null,

  simulateRemoteResponse: true,

  latency: 50,

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
  mockJSON: function(store, type, record) {
    return store.serializerFor(type).serialize(record, { includeId: true });
  },

  /**
    @method generateIdForRecord
    @param  store
    @param  record
  */
  generateIdForRecord: function(store) {
    return counter++;
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
      return this.simulateRemoteCall(function() {
        return fixture;
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
      return this.simulateRemoteCall(function() {
        return fixtures;
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

    return this.simulateRemoteCall(function() {
      return fixtures;
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
      return this.simulateRemoteCall(function() {
        return fixtures;
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
    var fixture = this.mockJSON(store, type, record);

    this.updateFixtures(type, fixture);

    return this.simulateRemoteCall(function() {
      return fixture;
    }, this);
  },

  /**
    @method updateRecord
    @param  store
    @param  type
    @param  record
  */
  updateRecord: function(store, type, record) {
    var fixture = this.mockJSON(store, type, record);

    this.updateFixtures(type, fixture);

    return this.simulateRemoteCall(function() {
      return fixture;
    }, this);
  },

  /**
    @method deleteRecord
    @param  store
    @param  type
    @param  record
  */
  deleteRecord: function(store, type, record) {
    var fixture = this.mockJSON(store, type, record);

    this.deleteLoadedFixture(type, fixture);

    return this.simulateRemoteCall(function() {
      // no payload in a deletion
      return null;
    });
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
    var id = get(record, 'id');

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
    var adapter = this;

    return new Ember.RSVP.Promise(function(resolve) {
      if (get(adapter, 'simulateRemoteResponse')) {
        // Schedule with setTimeout
        Ember.run.later(function() {
          resolve(callback.call(context));
        }, get(adapter, 'latency'));
      } else {
        // Asynchronous, but at the of the runloop with zero latency
        Ember.run.once(function() {
          resolve(callback.call(context));
        });
      }
    });
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

function coerceId(id) {
  return id == null ? null : id+'';
}

DS.RESTSerializer = DS.JSONSerializer.extend({
  /**
    Normalizes a part of the JSON payload returned by
    the server. You should override this method, munge the hash
    and call super if you have generic normalization to do.

    It takes the type of the record that is being normalized
    (as a DS.Model class), the property where the hash was
    originally found, and the hash to normalize.

    For example, if you have a payload that looks like this:

    ```js
    {
      "post": {
        "id": 1,
        "title": "Rails is omakase",
        "comments": [ 1, 2 ]
      },
      "comments": [{
        "id": 1,
        "body": "FIRST"
      }, {
        "id": 2,
        "body": "Rails is unagi"
      }]
    }
    ```

    The `normalize` method will be called three times:

    * With `App.Post`, `"posts"` and `{ id: 1, title: "Rails is omakase", ... }`
    * With `App.Comment`, `"comments"` and `{ id: 1, body: "FIRST" }`
    * With `App.Comment`, `"comments"` and `{ id: 2, body: "Rails is unagi" }`

    You can use this method, for example, to normalize underscored keys to camelized
    or other general-purpose normalizations.

    If you want to do normalizations specific to some part of the payload, you
    can specify those under `normalizeHash`.

    For example, if the `IDs` under `"comments"` are provided as `_id` instead of
    `id`, you can specify how to normalize just the comments:

    ```js
    App.PostSerializer = DS.RESTSerializer.extend({
      normalizeHash: {
        comments: function(hash) {
          hash.id = hash._id;
          delete hash._id;
          return hash;
        }
      }
    });
    ```

    The key under `normalizeHash` is just the original key that was in the original
    payload.

    @method normalize
    @param {subclass of DS.Model} type
    @param {String} prop
    @param {Object} hash
    @returns Object
  */
  normalize: function(type, prop, hash) {
    this.normalizeId(hash);
    this.normalizeAttributes(hash);

    if (this.normalizeHash && this.normalizeHash[prop]) {
      return this.normalizeHash[prop](hash);
    }

    return hash;
  },

  /**
    @method normalizeId
    @private
  */
  normalizeId: function(hash) {
    var primaryKey = get(this, 'primaryKey');

    if (primaryKey === 'id') { return; }

    hash.id = hash[primaryKey];
    delete hash[primaryKey];
  },

  /**
    @method normalizeAttributes
    @private
  */
  normalizeAttributes: function(hash) {
    var attrs = get(this, 'attrs');

    if (!attrs) { return; }

    for (var key in attrs) {
      var payloadKey = attrs[key];

      hash[key] = hash[payloadKey];
      delete hash[payloadKey];
    }
  },

  /**
    Called when the server has returned a payload representing
    a single record, such as in response to a `find` or `save`.

    It is your opportunity to clean up the server's response into the normalized
    form expected by Ember Data.

    If you want, you can just restructure the top-level of your payload, and
    do more fine-grained normalization in the `normalize` method.

    For example, if you have a payload like this in response to a request for
    post 1:

    ```js
    {
      "id": 1,
      "title": "Rails is omakase",

      "_embedded": {
        "comment": [{
          "_id": 1,
          "comment_title": "FIRST"
        }, {
          "_id": 2,
          "comment_title": "Rails is unagi"
        }]
      }
    }
    ```

    You could implement a serializer that looks like this to get your payload
    into shape:

    ```js
    App.PostSerializer = DS.RESTSerializer.extend({
      // First, restructure the top-level so it's organized by type
      extractSingle: function(store, type, payload, id, requestType) {
        var comments = payload._embedded.comment;
        delete payload._embedded;

        payload = { comments: comments, post: payload };
        return this._super(store, type, payload, id, requestType);
      },

      normalizeHash: {
        // Next, normalize individual comments, which (after `extract`)
        // are now located under `comments`
        comments: function(hash) {
          hash.id = hash._id;
          hash.title = hash.comment_title;
          delete hash._id;
          delete hash.comment_title;
          return hash;
        }
      }
    })
    ```

    When you call super from your own implementation of `extractSingle`, the
    built-in implementation will find the primary record in your normalized
    payload and push the remaining records into the store.

    The primary record is the single hash found under `post` or the first
    element of the `posts` array.

    The primary record has special meaning when the record is being created
    for the first time or updated (`createRecord` or `updateRecord`). In
    particular, it will update the properties of the record that was saved.

    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {Object} payload
    @param {String} id
    @param {'find'|'createRecord'|'updateRecord'|'deleteRecord'} requestType
    @returns Object the primary response to the original request
  */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var primaryTypeName = primaryType.typeKey,
        primaryRecord;

    for (var prop in payload) {
      // legacy support for singular names
      if (prop === primaryTypeName) {
        primaryRecord = this.normalize(primaryType, prop, payload[prop]);
        continue;
      }

      var typeName = this.singularize(prop),
          type = store.modelFor(typeName);

      /*jshint loopfunc:true*/
      payload[prop].forEach(function(hash) {
        hash = this.normalize(type, prop, hash);

        var isFirstCreatedRecord = typeName === primaryTypeName && !recordId && !primaryRecord,
            isUpdatedRecord = typeName === primaryTypeName && coerceId(hash.id) === recordId;

        // find the primary record.
        //
        // It's either:
        // * the record with the same ID as the original request
        // * in the case of a newly created record that didn't have an ID, the first
        //   record in the Array
        if (isFirstCreatedRecord || isUpdatedRecord) {
          primaryRecord = hash;
        } else {
          store.push(typeName, hash);
        }
      }, this);
    }

    return primaryRecord;
  },

  /**
    Called when the server has returned a payload representing
    multiple records, such as in response to a `findAll` or `findQuery`.

    It is your opportunity to clean up the server's response into the normalized
    form expected by Ember Data.

    If you want, you can just restructure the top-level of your payload, and
    do more fine-grained normalization in the `normalize` method.

    For example, if you have a payload like this in response to a request for
    all posts:

    ```js
    {
      "_embedded": {
        "post": [{
          "id": 1,
          "title": "Rails is omakase"
        }, {
          "id": 2,
          "title": "The Parley Letter"
        }],
        "comment": [{
          "_id": 1,
          "comment_title": "Rails is unagi"
          "post_id": 1
        }, {
          "_id": 2,
          "comment_title": "Don't tread on me",
          "post_id": 2
        }]
      }
    }
    ```

    You could implement a serializer that looks like this to get your payload
    into shape:

    ```js
    App.PostSerializer = DS.RESTSerializer.extend({
      // First, restructure the top-level so it's organized by type
      // and the comments are listed under a post's `comments` key.
      extractArray: function(store, type, payload, id, requestType) {
        var posts = payload._embedded.post;
        var comments = [];
        var postCache = {};

        posts.forEach(function(post) {
          post.comments = [];
          postCache[post.id] = post;
        });

        payload._embedded.comment.forEach(function(comment) {
          comments.push(comment);
          postCache[comment.post_id].comments.push(comment);
          delete comment.post_id;
        }

        payload = { comments: comments, posts: payload };

        return this._super(store, type, payload, id, requestType);
      },

      normalizeHash: {
        // Next, normalize individual comments, which (after `extract`)
        // are now located under `comments`
        comments: function(hash) {
          hash.id = hash._id;
          hash.title = hash.comment_title;
          delete hash._id;
          delete hash.comment_title;
          return hash;
        }
      }
    })
    ```

    When you call super from your own implementation of `extractArray`, the
    built-in implementation will find the primary array in your normalized
    payload and push the remaining records into the store.

    The primary array is the array found under `posts`.

    The primary record has special meaning when responding to `findQuery`
    or `findHasMany`. In particular, the primary array will become the
    list of records in the record array that kicked off the request.

    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {Object} payload
    @param {'findAll'|'findMany'|'findHasMany'|'findQuery'} requestType
    @returns {Array<Object>} The primary array that was returned in response
      to the original query.
  */
  extractArray: function(store, primaryType, payload) {
    var primaryTypeName = primaryType.typeKey,
        primaryArray;

    for (var prop in payload) {
      var typeName = this.singularize(prop),
          type = store.modelFor(typeName),
          isPrimary = typeName === primaryTypeName;

      /*jshint loopfunc:true*/
      var normalizedArray = payload[prop].map(function(hash) {
        return this.normalize(type, prop, hash);
      }, this);

      if (isPrimary) {
        primaryArray = normalizedArray;
      } else {
        store.pushMany(typeName, normalizedArray);
      }
    }

    return primaryArray;
  },

  /**
    @private
    @method pluralize
    @param {String} key
  */
  pluralize: function(key) {
    return Ember.String.pluralize(key);
  },

  /**
    @private
    @method singularize
    @param {String} key
  */
  singularize: function(key) {
    return Ember.String.singularize(key);
  },

  // SERIALIZE

  /**
    Called when a record is saved in order to convert the
    record into JSON.

    By default, it creates a JSON object with a key for
    each attribute and belongsTo relationship.

    For example, consider this model:

    ```js
    App.Comment = DS.Model.extend({
      title: DS.attr(),
      body: DS.attr(),

      author: DS.belongsTo('user')
    });
    ```

    The default serialization would create a JSON object like:

    ```js
    {
      "title": "Rails is unagi",
      "body": "Rails? Omakase? O_O",
      "author": 12
    }
    ```

    By default, attributes are passed through as-is, unless
    you specified an attribute type (`DS.attr('date')`). If
    you specify a transform, the JavaScript value will be
    serialized when inserted into the JSON hash.

    By default, belongs-to relationships are converted into
    IDs when inserted into the JSON hash.

    ## IDs

    `serialize` takes an options hash with a single option:
    `includeId`. If this option is `true`, `serialize` will,
    by default include the ID in the JSON object it builds.

    The adapter passes in `includeId: true` when serializing
    a record for `createRecord`, but not for `updateRecord`.

    ## Customization

    Your server may expect a different JSON format than the
    built-in serialization format.

    In that case, you can implement `serialize` yourself and
    return a JSON hash of your choosing.

    ```js
    App.PostSerializer = DS.RESTSerializer.extend({
      serialize: function(post, options) {
        var json = {
          POST_TTL: post.get('title'),
          POST_BDY: post.get('body'),
          POST_CMS: post.get('comments').mapProperty('id')
        }

        if (options.includeId) {
          json.POST_ID_ = post.get('id');
        }

        return json;
      }
    });
    ```

    ## Customizing an App-Wide Serializer

    If you want to define a serializer for your entire
    application, you'll probably want to use `eachAttribute`
    and `eachRelationship` on the record.

    ```js
    App.ApplicationSerializer = DS.RESTSerializer.extend({
      serialize: function(record, options) {
        var json = {};

        record.eachAttribute(function(name) {
          json[serverAttributeName(name)] = record.get(name);
        })

        record.eachRelationship(function(name, relationship) {
          if (relationship.kind === 'hasMany') {
            json[serverHasManyName(name)] = record.get(name).mapBy('id');
          }
        });

        if (options.includeId) {
          json.ID_ = record.get('id');
        }

        return json;
      }
    });

    function serverAttributeName(attribute) {
      return attribute.underscore().toUpperCase();
    }

    function serverHasManyName(name) {
      return serverAttributeName(name.singularize()) + "_IDS";
    }
    ```

    This serializer will generate JSON that looks like this:

    ```js
    {
      "TITLE": "Rails is omakase",
      "BODY": "Yep. Omakase.",
      "COMMENT_IDS": [ 1, 2, 3 ]
    }
    ```

    ## Tweaking the Default JSON

    If you just want to do some small tweaks on the default JSON,
    you can call super first and make the tweaks on the returned
    JSON.

    ```js
    App.PostSerializer = DS.RESTSerializer.extend({
      serialize: function(record, options) {
        var json = this._super(record, options);

        json.subject = json.title;
        delete json.title;

        return json;
      }
    });
    ```
  */
  serialize: function(record, options) {
    return this._super.apply(this, arguments);
  }
});

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
  defaultSerializer: '_rest',

  /**
    Called by the store in order to fetch the JSON for a given
    type and ID.

    It makes an Ajax request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.

    @method find
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {String} id
    @returns Promise
  */
  find: function(store, type, id) {
    return this.ajax(this.buildURL(type, id), 'GET');
  },

  /**
    Called by the store in order to fetch a JSON array for all
    of the records for a given type.

    It makes an Ajax request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.

    @method findAll
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @returns Promise
  */
  findAll: function(store, type) {
    return this.ajax(this.buildURL(type), 'GET');
  },

  /**
    Called by the store in order to fetch a JSON array for
    the records that match a particular query.

    The query is a simple JavaScript object that will be passed directly
    to the server as parameters.

    It makes an Ajax request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.

    @method findQuery
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {Object} query
    @returns Promise
  */
  findQuery: function(store, type, query) {
    return this.ajax(this.buildURL(type), 'GET', query);
  },

  /**
    Called by the store in order to fetch a JSON array for
    the unloaded records in a has-many relationship that were originally
    specified as IDs.

    For example, if the original payload looks like:

    ```js
    {
      "id": 1,
      "title": "Rails is omakase",
      "comments": [ 1, 2, 3 ]
    }
    ```

    The IDs will be passed as a URL-encoded Array of IDs, in this form:

    ```
    ids[]=1&ids[]=2&ids[]=3
    ```

    Many servers, such as Rails and PHP, will automatically convert this
    into an Array for you on the server-side. If you want to encode the
    IDs, differently, just override this (one-line) method.

    It makes an Ajax request to a URL computed by `buildURL`, and returns a
    promise for the resulting payload.

    @method findMany
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {Array<String>} ids
    @returns Promise
  */
  findMany: function(store, type, ids) {
    return this.ajax(this.buildURL(type), 'GET', { ids: ids });
  },

  /**
    Called by the store in order to fetch a JSON array for
    the unloaded records in a has-many relationship that were originally
    specified as a URL (inside of `links`).

    For example, if your original payload looks like this:

    ```js
    {
      "post": {
        "id": 1,
        "title": "Rails is omakase",
        "links": { "comments": "/posts/1/comments" }
      }
    }
    ```

    This method will be called with the parent record and `/posts/1/comments`.

    It will make an Ajax request to the originally specified URL.

    @method findHasMany
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @param {DS.Store} store
    @param {DS.Model} record
    @param {String} url
    @returns Promise
  */
  findHasMany: function(store, record, url) {
    return this.ajax(url, 'GET');
  },

  /**
    Called by the store when a newly created record is
    `save`d.

    It serializes the record, and `POST`s it to a URL generated by `buildURL`.

    See `serialize` for information on how to customize the serialized form
    of a record.

    @method createRecord
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @see RESTAdapter/serialize
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @returns Promise
  */
  createRecord: function(store, type, record) {
    var data = {};
    data[type.typeKey] = this.serializerFor(type.typeKey).serialize(record, { includeId: true });

    return this.ajax(this.buildURL(type), "POST", { data: data });
  },

  /**
    Called by the store when an existing record is `save`d.

    It serializes the record, and `POST`s it to a URL generated by `buildURL`.

    See `serialize` for information on how to customize the serialized form
    of a record.

    @method updateRecord
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @see RESTAdapter/serialize
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @returns Promise
  */
  updateRecord: function(store, type, record) {
    var data = {};
    data[type.typeKey] = this.serializerFor(type.typeKey).serialize(record);

    var id = get(record, 'id');

    return this.ajax(this.buildURL(type, id), "PUT", { data: data });
  },

  /**
    Called by the store when an deleted record is `save`d.

    It serializes the record, and `POST`s it to a URL generated by `buildURL`.

    @method deleteRecord
    @see RESTAdapter/buildURL
    @see RESTAdapter/ajax
    @see RESTAdapter/serialize
    @param {DS.Store} store
    @param {subclass of DS.Model} type
    @param {DS.Model} record
    @returns Promise
  */
  deleteRecord: function(store, type, record) {
    var id = get(record, 'id');

    return this.ajax(this.buildURL(type, id), "DELETE");
  },

  /**
    Builds a URL for a given type and optional ID.

    By default, it pluralizes the type's name (for example,
    'post' becomes 'posts' and 'person' becomes 'people').

    If an ID is specified, it adds the ID to the plural form
    of the type, separated by a `/`.

    @method buildURL
    @param {subclass of DS.Model} type
    @param {String} id
    @returns String
  */
  buildURL: function(type, id) {
    var url = "/" + Ember.String.pluralize(type.typeKey);
    if (id) { url += "/" + id; }

    return url;
  },

  serializerFor: function(type) {
    // This logic has to be kept in sync with DS.Store#serializerFor
    return this.container.lookup('serializer:' + type) ||
           this.container.lookup('serializer:application') ||
           this.container.lookup('serializer:_rest');
  },


  /**
    Takes a URL, an HTTP method and a hash of data, and makes an
    HTTP request.

    When the server responds with a payload, Ember Data will call into `extractSingle`
    or `extractArray` (depending on whether the original query was for one record or
    many records).

    By default, it has the following behavior:

    * It sets the response `dataType` to `"json"`
    * If the HTTP method is not `"GET"`, it sets the `Content-Type` to be
      `application/json; charset=utf-8`
    * If the HTTP method is not `"GET"`, it stringifies the data passed in. The
      data is the serialized record in the case of a save.
    * Registers success and failure handlers.

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

