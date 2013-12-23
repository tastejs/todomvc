// AngularFire is an officially supported AngularJS binding for Firebase.
// The bindings let you associate a Firebase URL with a model (or set of
// models), and they will be transparently kept in sync across all clients
// currently using your app. The 2-way data binding offered by AngularJS works
// as normal, except that the changes are also sent to all other clients
// instead of just a server.
//
//      AngularFire 0.5.0
//      http://angularfire.com
//      License: MIT

"use strict";

var AngularFire, AngularFireAuth;

// Define the `firebase` module under which all AngularFire services will live.
angular.module("firebase", []).value("Firebase", Firebase);

// Define the `$firebase` service that provides synchronization methods.
angular.module("firebase").factory("$firebase", ["$q", "$parse", "$timeout",
  function($q, $parse, $timeout) {
    // The factory returns an object containing the value of the data at
    // the Firebase location provided, as well as several methods. It
    // takes a single argument:
    //
    //   * `ref`: A Firebase reference. Queries or limits may be applied.
    return function(ref) {
      var af = new AngularFire($q, $parse, $timeout, ref);
      return af.construct();
    };
  }
]);

// Define the `orderByPriority` filter that sorts objects returned by
// $firebase in the order of priority. Priority is defined by Firebase,
// for more info see: https://www.firebase.com/docs/ordered-data.html
angular.module("firebase").filter("orderByPriority", function() {
  return function(input) {
    if (!input.$getIndex || typeof input.$getIndex != "function") {
      // If input is an object, map it to an array for the time being.
      var type = Object.prototype.toString.call(input);
      if (typeof input == "object" && type == "[object Object]") {
        var ret = [];
        for (var prop in input) {
          if (input.hasOwnProperty(prop)) {
            ret.push(input[prop]);
          }
        }
        return ret;
      }
      return input;
    }

    var sorted = [];
    var index = input.$getIndex();
    if (index.length <= 0) {
      return input;
    }

    for (var i = 0; i < index.length; i++) {
      var val = input[index[i]];
      if (val) {
        val.$id = index[i];
        sorted.push(val);
      }
    }

    return sorted;
  };
});

// The `AngularFire` object that implements synchronization.
AngularFire = function($q, $parse, $timeout, ref) {
  this._q = $q;
  this._bound = false;
  this._loaded = false;
  this._parse = $parse;
  this._timeout = $timeout;

  this._index = [];
  this._onChange = [];
  this._onLoaded = [];

  if (typeof ref == "string") {
    throw new Error("Please provide a Firebase reference instead " +
      "of a URL, eg: new Firebase(url)");
  }
  this._fRef = ref;
};

AngularFire.prototype = {
  // This function is called by the factory to create a new explicit sync
  // point between a particular model and a Firebase location.
  construct: function() {
    var self = this;
    var object = {};

    // Establish a 3-way data binding (implicit sync) with the specified
    // Firebase location and a model on $scope. To be used from a controller
    // to automatically synchronize *all* local changes. It take two arguments:
    //
    //    * `$scope`: The scope with which the bound model is associated.
    //    * `name`  : The name of the model.
    //
    // This function also returns a promise, which when resolve will be
    // provided an `unbind` method, a function which you can call to stop
    // watching the local model for changes.
    object.$bind = function(scope, name) {
      return self._bind(scope, name);
    };

    // Add an object to the remote data. Adding an object is the
    // equivalent of calling `push()` on a Firebase reference. It takes
    // up to two arguments:
    //
    //    * `item`: The object or primitive to add.
    //    * `cb`  : An optional callback function to be invoked when the
    //              item is added to the Firebase server. It will be called
    //              with an Error object if one occurred, null otherwise.
    //
    // This function returns a Firebase reference to the newly added object
    // or primitive. The key name can be extracted using `ref.name()`.
    object.$add = function(item, cb) {
      var ref;
      if (typeof item == "object") {
        ref = self._fRef.ref().push(self._parseObject(item), cb);
      } else {
        ref = self._fRef.ref().push(item, cb);
      }
      return ref;
    };

    // Save the current state of the object (or a child) to the remote.
    // Takes a single optional argument:
    //
    //    * `key`: Specify a child key to save the data for. If no key is
    //             specified, the entire object's current state will be saved.
    object.$save = function(key) {
      if (key) {
        self._fRef.ref().child(key).set(self._parseObject(self._object[key]));
      } else {
        self._fRef.ref().set(self._parseObject(self._object));
      }
    };

    // Set the current state of the object to the specified value. Calling
    // this is the equivalent of calling `set()` on a Firebase reference.
    object.$set = function(newValue) {
      self._fRef.ref().set(newValue);
    };

    // Remove this object from the remote data. Calling this is the equivalent
    // of calling `remove()` on a Firebase reference. This function takes a
    // single optional argument:
    //
    //    * `key`: Specify a child key to remove. If no key is specified, the
    //             entire object will be removed from the remote data store.
    object.$remove = function(key) {
      if (key) {
        self._fRef.ref().child(key).remove();
      } else {
        self._fRef.ref().remove();
      }
    };

    // Get an AngularFire wrapper for a named child.
    object.$child = function(key) {
      var af = new AngularFire(
        self._q, self._parse, self._timeout, self._fRef.ref().child(key)
      );
      return af.construct();
    };

    // Attach an event handler for when the object is changed. You can attach
    // handlers for the following events:
    //
    //  - "change": The provided function will be called whenever the local
    //              object is modified because the remote data was updated.
    //  - "loaded": This function will be called *once*, when the initial
    //              data has been loaded. 'object' will be an empty object ({})
    //              until this function is called.
    object.$on = function(type, callback) {
      switch (type) {
      case "change":
        self._onChange.push(callback);
        break;
      case "loaded":
        self._onLoaded.push(callback);
        break;
      default:
        throw new Error("Invalid event type " + type + " specified");
      }
    };

    // Return the current index, which is a list of key names in an array,
    // ordered by their Firebase priority.
    object.$getIndex = function() {
      return angular.copy(self._index);
    };

    self._object = object;
    self._getInitialValue();

    return self._object;
  },

  // This function is responsible for fetching the initial data for the
  // given reference. If the data returned from the server is an object or
  // array, we'll attach appropriate child event handlers. If the value is
  // a primitive, we'll continue to watch for value changes.
  _getInitialValue: function() {
    var self = this;
    var gotInitialValue = function(snapshot) {
      var value = snapshot.val();
      if (value === null) {
        // NULLs are handled specially. If there's a 3-way data binding
        // on a local primitive, then update that, otherwise switch to object
        // binding using child events.
        if (self._bound) {
          var local = self._parseObject(self._parse(self._name)(self._scope));
          switch (typeof local) {
          // Primitive defaults.
          case "string":
          case "undefined":
            value = "";
            break;
          case "number":
            value = 0;
            break;
          case "boolean":
            value = false;
            break;
          }
        }
      }

      switch (typeof value) {
      // For primitive values, simply update the object returned.
      case "string":
      case "number":
      case "boolean":
        self._updatePrimitive(value);
        break;
      // For arrays and objects, switch to child methods.
      case "object":
        self._getChildValues();
        self._fRef.off("value", gotInitialValue);
        break;
      default:
        throw new Error("Unexpected type from remote data " + typeof value);
      }

      // Call handlers for the "loaded" event.
      self._loaded = true;
      self._broadcastEvent("loaded", value);
    };

    self._fRef.on("value", gotInitialValue);
  },

  // This function attaches child events for object and array types.
  _getChildValues: function() {
    var self = this;
    // Store the priority of the current property as "$priority". Changing
    // the value of this property will also update the priority of the
    // object (see _parseObject).
    function _processSnapshot(snapshot, prevChild) {
      var key = snapshot.name();
      var val = snapshot.val();

      // If the item already exists in the index, remove it first.
      var curIdx = self._index.indexOf(key);
      if (curIdx !== -1) {
        self._index.splice(curIdx, 1);
      }

      // Update index. This is used by $getIndex and orderByPriority.
      if (prevChild) {
        var prevIdx = self._index.indexOf(prevChild);
        self._index.splice(prevIdx + 1, 0, key);
      } else {
        self._index.unshift(key);
      }

      // Update local model with priority field, if needed.
      if (snapshot.getPriority() !== null) {
        val.$priority = snapshot.getPriority();
      }
      self._updateModel(key, val);
    }

    self._fRef.on("child_added", _processSnapshot);
    self._fRef.on("child_moved", _processSnapshot);
    self._fRef.on("child_changed", _processSnapshot);
    self._fRef.on("child_removed", function(snapshot) {
      // Remove from index.
      var key = snapshot.name();
      var idx = self._index.indexOf(key);
      self._index.splice(idx, 1);

      // Remove from local model.
      self._updateModel(key, null);
    });
  },

  // Called whenever there is a remote change. Applies them to the local
  // model for both explicit and implicit sync modes.
  _updateModel: function(key, value) {
    var self = this;
    self._timeout(function() {
      if (value == null) {
        delete self._object[key];
      } else {
        self._object[key] = value;
      }

      // Call change handlers.
      self._broadcastEvent("change");

      // If there is an implicit binding, also update the local model.
      if (!self._bound) {
        return;
      }

      var current = self._object;
      var local = self._parse(self._name)(self._scope);
      // If remote value matches local value, don't do anything, otherwise
      // apply the change.
      if (!angular.equals(current, local)) {
        self._parse(self._name).assign(self._scope, angular.copy(current));
      }
    });
  },

  // Called whenever there is a remote change for a primitive value.
  _updatePrimitive: function(value) {
    var self = this;
    self._timeout(function() {
      // Primitive values are represented as a special object {$value: value}.
      // Only update if the remote value is different from the local value.
      if (!self._object.$value || !angular.equals(self._object.$value, value)) {
        self._object.$value = value;
      }

      // Call change handlers.
      self._broadcastEvent("change");

      // If there's an implicit binding, simply update the local scope model.
      if (self._bound) {
        var local = self._parseObject(self._parse(self._name)(self._scope));
        if (!angular.equals(local, value)) {
          self._parse(self._name).assign(self._scope, value);
        }
      }
    });
  },

  // If event handlers for a specified event were attached, call them.
  _broadcastEvent: function(evt, param) {
    var cbs;
    switch (evt) {
    case "change":
      cbs = this._onChange;
      break;
    case "loaded":
      cbs = this._onLoaded;
      break;
    default:
      cbs = [];
      break;
    }
    if (cbs.length > 0) {
      for (var i = 0; i < cbs.length; i++) {
        if (typeof cbs[i] == "function") {
          cbs[i](param);
        }
      }
    }
  },

  // This function creates a 3-way binding between the provided scope model
  // and Firebase. All changes made to the local model are saved to Firebase
  // and changes to the remote data automatically appear on the local model.
  _bind: function(scope, name) {
    var self = this;
    var deferred = self._q.defer();

    // _updateModel or _updatePrimitive will take care of updating the local
    // model if _bound is set to true.
    self._name = name;
    self._bound = true;
    self._scope = scope;

    // If the local model is an object, call an update to set local values.
    var local = self._parse(name)(scope);
    if (local !== undefined && typeof local == "object") {
      self._fRef.update(self._parseObject(local));
    }

    // We're responsible for setting up scope.$watch to reflect local changes
    // on the Firebase data.
    var unbind = scope.$watch(name, function() {
      // If the new local value matches the current remote value, we don't
      // trigger a remote update.
      var local = self._parseObject(self._parse(name)(scope));
      if (self._object.$value && angular.equals(local, self._object.$value)) {
        return;
      } else if (angular.equals(local, self._object)) {
        return;
      }

      // If the local model is undefined or the remote data hasn't been
      // loaded yet, don't update.
      if (local === undefined || !self._loaded) {
        return;
      }

      // Use update if limits are in effect, set if not.
      if (self._fRef.set) {
        self._fRef.set(local);
      } else {
        self._fRef.ref().update(local);
      }
    }, true);

    // When the scope is destroyed, unbind automatically.
    scope.$on("$destroy", function() {
      unbind();
    });

    // Once we receive the initial value, resolve the promise.
    self._fRef.once("value", function() {
      deferred.resolve(unbind);
    });

    return deferred.promise;
  },


  // Parse a local model, removing all properties beginning with "$" and
  // converting $priority to ".priority".
  _parseObject: function(obj) {
    function _findReplacePriority(item) {
      for (var prop in item) {
        if (item.hasOwnProperty(prop)) {
          if (prop == "$priority") {
            item[".priority"] = item.$priority;
            delete item.$priority;
          } else if (typeof item[prop] == "object") {
            _findReplacePriority(item[prop]);
          }
        }
      }
      return item;
    }

    // We use toJson/fromJson to remove $$hashKey and others. Can be replaced
    // by angular.copy, but only for later versions of AngularJS.
    var newObj = _findReplacePriority(angular.copy(obj));
    return angular.fromJson(angular.toJson(newObj));
  }
};


// Defines the `$firebaseAuth` service that provides authentication support
// for AngularFire.
angular.module("firebase").factory("$firebaseAuth", [
  "$q", "$timeout", "$injector", "$rootScope", "$location",
  function($q, $t, $i, $rs, $l) {
    // The factory returns an object containing the authentication state
    // of the current user. This service takes 2 arguments:
    //
    //   * `ref`    : A Firebase reference.
    //   * `options`: An object that may contain the following options:
    //
    //      * `path`    : The path to which the user will be redirected if the
    //                    authRequired property was set to true in the
    //                    $routeProvider, and the user isn't logged in.
    //      * `simple`  : $firebaseAuth requires inclusion of the
    //                    firebase-simple-login.js file by default. If this
    //                    value is set to false, this requirement is waived,
    //                    but only custom login functionality will be enabled.
    //      * `callback`: A function that will be called when there is a change
    //                    in authentication state.
    //
    // The returned object has the following properties:
    //
    //  * `user`: Set to "null" if the user is currently logged out. This value
    //    will be changed to an object when the user successfully logs in. This
    //    object will contain details of the logged in user. The exact
    //    properties will vary based on the method used to login, but will at
    //    a minimum contain the `id` and `provider` properties.
    //
    // The returned object will also have the following methods available:
    // $login(), $logout() and $createUser().
    return function(ref, options) {
      var auth = new AngularFireAuth($q, $t, $i, $rs, $l, ref, options);
      return auth.construct();
    };
  }
]);

AngularFireAuth = function($q, $t, $i, $rs, $l, ref, options) {
  this._q = $q;
  this._timeout = $t;
  this._injector = $i;
  this._location = $l;
  this._rootScope = $rs;

  // Check if '$route' is present, use if available.
  this._route = null;
  if (this._injector.has("$route")) {
    this._route = this._injector.get("$route");
  }

  // Setup options and callback.
  this._cb = function(){};
  this._options = options || {};
  if (this._options.callback && typeof this._options.callback === "function") {
    this._cb = options.callback;
  }
  this._deferred = null;
  this._redirectTo = null;
  this._authenticated = false;

  if (typeof ref == "string") {
    throw new Error("Please provide a Firebase reference instead " +
      "of a URL, eg: new Firebase(url)");
  }
  this._fRef = ref;
};

AngularFireAuth.prototype = {
  construct: function() {
    var self = this;
    var object = {
      user: null,
      $login: self.login.bind(self),
      $logout: self.logout.bind(self),
      $createUser: self.createUser.bind(self)
    };

    if (self._options.path && self._route !== null) {
      // Check if the current page requires authentication.
      if (self._route.current) {
        self._authRequiredRedirect(self._route.current, self._options.path);
      }
      // Set up a handler for all future route changes, so we can check
      // if authentication is required.
      self._rootScope.$on("$routeChangeStart", function(e, next) {
        self._authRequiredRedirect(next, self._options.path);
      });
    }

    // If Simple Login is disabled, simply return.
    self._object = object;
    if (self._options.simple === false) {
      return;
    }

    // Initialize Simple Login.
    if (!window.FirebaseSimpleLogin) {
      var err = new Error("FirebaseSimpleLogin undefined, " +
        "did you include firebase-simple-login.js?");
      self._rootScope.$broadcast("$firebaseAuth:error", err);
      return;
    }

    var client = new FirebaseSimpleLogin(self._fRef, function(err, user) {
      self._cb(err, user);
      if (err) {
        if (self._deferred) {
          self._deferred.reject(err);
          self._deferred = null;
        }
        self._rootScope.$broadcast("$firebaseAuth:error", err);
      } else if (user) {
        if (self._deferred) {
          self._deferred.resolve(user);
          self._deferred = null;
        }
        self._loggedIn(user);
      } else {
        self._loggedOut();
      }
    });

    self._authClient = client;
    return self._object;
  },

  // The login method takes a provider (for Simple Login) or a token
  // (for Custom Login) and authenticates the Firebase URL with which
  // the service was initialized. This method returns a promise, which will
  // be resolved when the login succeeds (and rejected when an error occurs).
  login: function(tokenOrProvider, options) {
    var self = this;
    var deferred = self._q.defer();

    switch (tokenOrProvider) {
    case "github":
    case "persona":
    case "twitter":
    case "facebook":
    case "password":
    case "anonymous":
      if (!self._authClient) {
        var err = new Error("Simple Login not initialized");
        deferred.reject(err);
        self._rootScope.$broadcast("$firebaseAuth:error", err);
      } else {
        self._deferred = deferred;
        self._authClient.login(tokenOrProvider, options);
      }
      break;
    // A token was provided, so initialize custom login.
    default:
      try {
        // Extract claims and update user auth state to include them.
        var claims = self._deconstructJWT(tokenOrProvider);
        self._fRef.auth(tokenOrProvider, function(err) {
          if (err) {
            deferred.reject(err);
            self._rootScope.$broadcast("$firebaseAuth:error", err);
          } else {
            self._deferred = deferred;
            self._loggedIn(claims);
          }
        });
      } catch(e) {
        deferred.reject(e);
        self._rootScope.$broadcast("$firebaseAuth:error", e);
      }
    }

    return deferred.promise;
  },

  // Unauthenticate the Firebase reference.
  logout: function() {
    if (this._authClient) {
      this._authClient.logout();
    } else {
      this._fRef.unauth();
      this._loggedOut();
    }
  },

  // Creates a user for Firebase Simple Login.
  // Function 'cb' receives an error as the first argument and a
  // Simple Login user object as the second argument. Pass noLogin=true
  // if you don't want the newly created user to also be logged in.
  createUser: function(email, password, cb, noLogin) {
    var self = this;
    self._authClient.createUser(email, password, function(err, user) {
      try {
        if (err) {
          self._rootScope.$broadcast("$firebaseAuth:error", err);
        } else {
          if (!noLogin) {
            self.login("password", {email: email, password: password});
          }
        }
      } catch(e) {
        self._rootScope.$broadcast("$firebaseAuth:error", e);
      }
      if (cb) {
        self._timeout(function(){
          cb(err, user);
        });
      }
    });
  },

  // Changes the password for a Firebase Simple Login user.
  // Take an email, old password and new password as three mandatory arguments.
  // An optional callback may be specified to be notified when the password
  // has been changed successfully.
  changePassword: function(email, old, np, cb) {
    var self = this;
    self._authClient.changePassword(email, old, np, function(err, user) {
      if (err) {
        self._rootScope.$broadcast("$firebaseAuth:error", err);
      }
      if (cb) {
        self._timeout(function() {
          cb(err, user);
        });
      }
    });
  },

  // Common function to trigger a login event on the root scope.
  _loggedIn: function(user) {
    var self = this;
    self._timeout(function() {
      self._object.user = user;
      self._authenticated = true;
      self._rootScope.$broadcast("$firebaseAuth:login", user);
      if (self._redirectTo) {
        self._location.replace();
        self._location.path(self._redirectTo);
        self._redirectTo = null;
      }
    });
  },

  // Common function to trigger a logout event on the root scope.
  _loggedOut: function() {
    var self = this;
    self._timeout(function() {
      self._object.user = null;
      self._authenticated = false;
      self._rootScope.$broadcast("$firebaseAuth:logout");
    });
  },

  // A function to check whether the current path requires authentication,
  // and if so, whether a redirect to a login page is needed.
  _authRequiredRedirect: function(route, path) {
    if (route.authRequired && !this._authenticated){
      if (route.pathTo === undefined) {
        this._redirectTo = this._location.path();
      } else {
        this._redirectTo = route.pathTo === path ? "/" : route.pathTo;
      }
      this._location.replace();
      this._location.path(path);
    }
  },

  // Helper function to decode Base64 (polyfill for window.btoa on IE).
  // From: https://github.com/mshang/base64-js/blob/master/base64.js
  _decodeBase64: function(str) {
    var char_set =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = ""; // final output
    var buf = ""; // binary buffer
    var bits = 8;
    for (var i = 0; i < str.length; ++i) {
      if (str[i] == "=") {
        break;
      }
      var c_num = char_set.indexOf(str.charAt(i));
      if (c_num == -1) {
        throw new Error("Not base64.");
      }
      var c_bin = c_num.toString(2);
      while (c_bin.length < 6) {
        c_bin = "0" + c_bin;
      }
      buf += c_bin;

      while (buf.length >= bits) {
        var octet = buf.slice(0, bits);
        buf = buf.slice(bits);
        output += String.fromCharCode(parseInt(octet, 2));
      }
    }
    return output;
  },

  // Helper function to extract claims from a JWT. Does *not* verify the
  // validity of the token.
  _deconstructJWT: function(token) {
    var segments = token.split(".");
    if (!segments instanceof Array || segments.length !== 3) {
      throw new Error("Invalid JWT");
    }
    var decoded = "";
    var claims = segments[1];
    if (window.atob) {
      decoded = window.atob(claims);
    } else {
      decoded = this._decodeBase64(claims);
    }
    return JSON.parse(decodeURIComponent(escape(decoded)));
  }
};
