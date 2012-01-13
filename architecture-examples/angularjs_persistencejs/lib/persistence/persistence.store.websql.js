try {
  if(!window) {
    window = {};
    //exports.console = console;
  }
} catch(e) {
  window = {};
  exports.console = console;
}

var persistence = (window && window.persistence) ? window.persistence : {}; 

if(!persistence.store) {
  persistence.store = {};
}

persistence.store.websql = {};


persistence.store.websql.config = function(persistence, dbname, description, size) {
  var conn = null;

  /**
   * Create a transaction
   * 
   * @param callback,
   *            the callback function to be invoked when the transaction
   *            starts, taking the transaction object as argument
   */
  persistence.transaction = function (callback) {
    if(!conn) {
      throw new Error("No ongoing database connection, please connect first.");
    } else {
      conn.transaction(callback);
    }
  };

  ////////// Low-level database interface, abstracting from HTML5 and Gears databases \\\\
  persistence.db = persistence.db || {};

  persistence.db.implementation = "unsupported";
  persistence.db.conn = null;

  // window object does not exist on Qt Declarative UI (http://doc.trolltech.org/4.7-snapshot/declarativeui.html)
  if (window && window.openDatabase) {
    persistence.db.implementation = "html5";
  } else if (window && window.google && google.gears) {
    persistence.db.implementation = "gears";
  } else {
    try {
      if (openDatabaseSync) {
        // TODO: find a browser that implements openDatabaseSync and check out if
        //       it is attached to the window or some other object
        persistence.db.implementation = "html5-sync";
      }
    } catch(e) {
    }
  }

  persistence.db.html5 = {};

  persistence.db.html5.connect = function (dbname, description, size) {
    var that = {};
    var conn = openDatabase(dbname, '1.0', description, size);

    that.transaction = function (fn) {
      return conn.transaction(function (sqlt) {
          return fn(persistence.db.html5.transaction(sqlt));
        });
    };
    return that;
  };

  persistence.db.html5.transaction = function (t) {
    var that = {};
    that.executeSql = function (query, args, successFn, errorFn) {
      if(persistence.debug) {
        console.log(query, args);
      }
      t.executeSql(query, args, function (_, result) {
          if (successFn) {
            var results = [];
            for ( var i = 0; i < result.rows.length; i++) {
              results.push(result.rows.item(i));
            }
            successFn(results);
          }
        }, errorFn);
    };
    return that;
  };

  persistence.db.html5Sync = {};

  persistence.db.html5Sync.connect = function (dbname, description, size) {
    var that = {};
    var conn = openDatabaseSync(dbname, '1.0', description, size);

    that.transaction = function (fn) {
      return conn.transaction(function (sqlt) {
          return fn(persistence.db.html5Sync.transaction(sqlt));
        });
    };
    return that;
  };

  persistence.db.html5Sync.transaction = function (t) {
    var that = {};
    that.executeSql = function (query, args, successFn, errorFn) {
      if (args == null) args = [];

      if(persistence.debug) {
        console.log(query, args);
      }

      var result = t.executeSql(query, args);
      if (result) {
        if (successFn) {
          var results = [];
          for ( var i = 0; i < result.rows.length; i++) {
            results.push(result.rows.item(i));
          }
          successFn(results);
        }
      }
    };
    return that;
  };

  persistence.db.gears = {};

  persistence.db.gears.connect = function (dbname) {
    var that = {};
    var conn = google.gears.factory.create('beta.database');
    conn.open(dbname);

    that.transaction = function (fn) {
      fn(persistence.db.gears.transaction(conn));
    };
    return that;
  };

  persistence.db.gears.transaction = function (conn) {
    var that = {};
    that.executeSql = function (query, args, successFn, errorFn) {
      if(persistence.debug) {
        console.log(query, args);
      }
      var rs = conn.execute(query, args);
      if (successFn) {
        var results = [];
        while (rs.isValidRow()) {
          var result = {};
          for ( var i = 0; i < rs.fieldCount(); i++) {
            result[rs.fieldName(i)] = rs.field(i);
          }
          results.push(result);
          rs.next();
        }
        successFn(results);
      }
    };
    return that;
  };

  persistence.db.connect = function (dbname, description, size) {
    if (persistence.db.implementation == "html5") {
      return persistence.db.html5.connect(dbname, description, size);
    } else if (persistence.db.implementation == "html5-sync") {
      return persistence.db.html5Sync.connect(dbname, description, size);
    } else if (persistence.db.implementation == "gears") {
      return persistence.db.gears.connect(dbname);
    }
  };

  ///////////////////////// SQLite dialect

  persistence.store.websql.sqliteDialect = {
    // columns is an array of arrays, e.g.
    // [["id", "VARCHAR(32)", "PRIMARY KEY"], ["name", "TEXT"]]
    createTable: function(tableName, columns) {
      var tm = persistence.typeMapper;
      var sql = "CREATE TABLE IF NOT EXISTS `" + tableName + "` (";
      var defs = [];
      for(var i = 0; i < columns.length; i++) {
        var column = columns[i];
        defs.push("`" + column[0] + "` " + tm.columnType(column[1]) + (column[2] ? " " + column[2] : ""));
      }
      sql += defs.join(", ");
      sql += ')';
      return sql;
    },

    // columns is array of column names, e.g.
    // ["id"]
    createIndex: function(tableName, columns, options) {
      options = options || {};
      return "CREATE "+(options.unique?"UNIQUE ":"")+"INDEX IF NOT EXISTS `" + tableName + "__" + columns.join("_") + 
             "` ON `" + tableName + "` (" + 
             columns.map(function(col) { return "`" + col + "`"; }).join(", ") + ")";
    }
  };

  // Configure persistence for generic sql persistence, using sqliteDialect
  persistence.store.sql.config(persistence, persistence.store.websql.sqliteDialect);

  // Make the connection
  conn = persistence.db.connect(dbname, description, size);
  if(!conn) {
    throw new Error("No supported database found in this browser.");
  }
};

try {
  exports.persistence = persistence;
} catch(e) {}
