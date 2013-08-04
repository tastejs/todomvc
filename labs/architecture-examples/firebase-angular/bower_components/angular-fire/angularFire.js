// AngularFire is an officially supported AngularJS binding for Firebase.
// The bindings let you associate a Firebase URL with a model (or set of
// models), and they will be transparently kept in sync across all clients
// currently using your app. The 2-way data binding offered by AngularJS works
// as normal, except that the changes are also sent to all other clients
// instead of just a server.
//
//      AngularFire 0.2
//      http://angularfire.com
//      License: MIT

"use strict";

// Define the `firebase` module under which all AngularFire services will live.
angular.module("firebase", []).value("Firebase", Firebase);

// Define the `angularFire` service for implicit syncing. `angularFire` binds a
// model to $scope and keeps the data synchronized with a Firebase location
// both ways.
angular.module("firebase").factory("angularFire", ["$q", "$parse", "$timeout",
  function($q, $parse, $timeout) {
    // The factory returns a new instance of the `AngularFire` object, defined
    // below, everytime it is called. The factory takes 4 arguments:
    //
    //   * `ref`:    A Firebase URL or reference. A reference with limits
    //   or queries applied may be provided.
    //   * `$scope`: The scope with which the bound model is associated.
    //   * `name`:   The name of the model.
    //   * `type`:   The type of data that will be stored it the model
    //   (or is present on the Firebase URL provided). Pass in
    //   `{}` for Object, `[]` for Array (default), `""` for
    //   String and `true` for Boolean.
    return function(ref, scope, name, type) {
      var af = new AngularFire($q, $parse, $timeout, ref);
      return af.associate(scope, name, type);
    };
  }
]);

// The `AngularFire` object that implements implicit synchronization.
function AngularFire($q, $parse, $timeout, ref) {
  this._q = $q;
  this._parse = $parse;
  this._timeout = $timeout;

  this._initial = true;
  this._remoteValue = false;

  // `ref` can either be a string (URL to a Firebase location), or a
  // `Firebase` object.
  if (typeof ref == "string") {
    this._fRef = new Firebase(ref);
  } else {
    this._fRef = ref;
  }
}
AngularFire.prototype = {
  // This function is called by the factory to create a new 2-way binding
  // between a particular model in a `$scope` and a particular Firebase
  // location.
  associate: function($scope, name, type) {
    var self = this;
    if (type == undefined) {
      type = [];
    }
    var deferred = this._q.defer();
    var promise = deferred.promise;
    // We're currently listening for value changes to implement synchronization.
    // This needs to be optimized, see
    // [Ticket #25](https://github.com/firebase/angularFire/issues/25).
    this._fRef.on("value", function(snap) {
      var resolve = false;
      if (deferred) {
        resolve = deferred;
        deferred = false;
      }
      self._remoteValue = type;
      if (snap && snap.val() != undefined) {
        var val = snap.val();
        // If the remote type doesn't match what was provided, log a message
        // and exit.
        if (typeof val != typeof type) {
          self._log("Error: type mismatch");
          return;
        }
        // Also distinguish between objects and arrays.
        var check = Object.prototype.toString;
        if (check.call(type) != check.call(val)) {
          self._log("Error: type mismatch");
          return;
        }
        self._remoteValue = angular.copy(val);
        // If the new remote value is the same as the local value, ignore.
        if (angular.equals(val, self._parse(name)($scope))) {
          return;
        }
      }
      // Update the local model to reflect remote changes.
      self._timeout(function() {
        self._resolve($scope, name, resolve, self._remoteValue)
      });
    });
    return promise;
  },

  // Disassociation added via
  // [pull request #34](https://github.com/firebase/angularFire/pull/34).
  // This function is provided to the promise returned by `angularFire`
  // when it is fulfilled. Invoking it will stop the two-way synchronization.
  disassociate: function() {
    var self = this;
    if (self._unregister) {
      self._unregister();
    }
    this._fRef.off("value");
  },

  // If `deferred` is a valid promise, it will be resolved with `val`, and
  // the model will be watched for future (local) changes. `$scope[name]`
  // will also be updated to the provided value.
  _resolve: function($scope, name, deferred, val) {
    var self = this;
    this._parse(name).assign($scope, angular.copy(val));
    this._remoteValue = angular.copy(val);
    if (deferred) {
      deferred.resolve(function() {
        self.disassociate();
      });
      this._watch($scope, name);
    }
  },

  // Watch for local changes.
  _watch: function($scope, name) {
    var self = this;
    self._unregister = $scope.$watch(name, function() {
      // When the local value is set for the first time, via the .on('value')
      // callback, we ignore it.
      if (self._initial) {
        self._initial = false;
        return;
      }
      // If the new local value matches the current remote value, we don't
      // trigger a remote update.
      var val = JSON.parse(angular.toJson(self._parse(name)($scope)));
      if (angular.equals(val, self._remoteValue)) {
        return;
      }
      self._fRef.ref().set(val);
    }, true);
    // Also watch for scope destruction and unregister.
    $scope.$on("$destroy", function() {
      self.disassociate();
    });
  },

  // Helper function to log messages.
  _log: function(msg) {
    if (console && console.log) {
      console.log(msg);
    }
  }
};

// Define the `angularFireCollection` service for explicit syncing.
// `angularFireCollection` provides a collection object that you can modify.
// [Original code](https://github.com/petebacondarwin/angular-firebase/blob/master/ng-firebase-collection.js)
// by @petebacondarwin.
angular.module("firebase").factory("angularFireCollection", ["$timeout",
  function($timeout) {
    return function(collectionUrlOrRef, initialCb) {
      // An internal representation of a model present in the collection.
      function angularFireItem(ref, index) {
        this.$ref = ref.ref();
        this.$id = ref.name();
        this.$index = index;
          angular.extend(this, {priority: ref.getPriority()}, ref.val());
      }

      var indexes = {};
      var collection = [];

      // The provided ref can either be a string (URL to a Firebase location)
      // or an object of type `Firebase`. Firebase objects with limits or
      // queries applies may also be provided.
      var collectionRef;
      if (typeof collectionUrlOrRef == "string") {
        collectionRef = new Firebase(collectionUrlOrRef);
      } else {
        collectionRef = collectionUrlOrRef;
      }

      function getIndex(prevId) {
        return prevId ? indexes[prevId] + 1 : 0;
      }

      // Add an item to the local collection.
      function addChild(index, item) {
        indexes[item.$id] = index;
        collection.splice(index, 0, item);
      }

      // Remove an item from the local collection.
      function removeChild(id) {
        var index = indexes[id];
        collection.splice(index, 1);
        indexes[id] = undefined;
      }

      // Update an existing child in the local collection.
      function updateChild (index, item) {
        collection[index] = item;
      }

      // Move an existing child to a new location in the collection (usually
      // triggered by a priority change).
      function moveChild (from, to, item) {
        collection.splice(from, 1);
        collection.splice(to, 0, item);
        updateIndexes(from, to);
      }

      // Update the index table.
      function updateIndexes(from, to) {
        var length = collection.length;
        to = to || length;
        if (to > length) {
          to = length;
        }
        for (var index = from; index < to; index++) {
          var item = collection[index];
          item.$index = indexes[item.$id] = index;
        }
      }

      // Trigger the initial callback, if one was provided.
      if (initialCb && typeof initialCb == "function") {
        collectionRef.once("value", initialCb);
      }

      // Attach handlers for remote child added, removed, changed and moved
      // events.

      collectionRef.on("child_added", function(data, prevId) {
        $timeout(function() {
          var index = getIndex(prevId);
          addChild(index, new angularFireItem(data, index));
          updateIndexes(index);
        });
      });

      collectionRef.on("child_removed", function(data) {
        $timeout(function() {
          var id = data.name();
          var pos = indexes[id];
          removeChild(id);
          updateIndexes(pos);
        });
      });

      collectionRef.on("child_changed", function(data, prevId) {
        $timeout(function() {
          var index = indexes[data.name()];
          var newIndex = getIndex(prevId);
          var item = new angularFireItem(data, index);

          updateChild(index, item);
          if (newIndex !== index) {
            moveChild(index, newIndex, item);
          }
        });
      });

      collectionRef.on("child_moved", function(ref, prevId) {
        $timeout(function() {
          var oldIndex = indexes[ref.name()];
          var newIndex = getIndex(prevId);
          var item = collection[oldIndex];
          moveChild(oldIndex, newIndex, item);
        });
      });

      // `angularFireCollection` exposes three methods on the collection
      // returned.

      // Add an object to the remote collection. Adding an object is the
      // equivalent of calling `push()` on a Firebase reference.
      collection.add = function(item, cb) {
        var ref;
        if (!cb) {
          ref = collectionRef.ref().push(item);
        } else {
          ref = collectionRef.ref().push(item, cb);
        }
        return ref;
      };

      // Remove an object from the remote collection.
      collection.remove = function(itemOrId, cb) {
        var item = angular.isString(itemOrId) ?
          collection[indexes[itemOrId]] : itemOrId;
        if (!cb) {
          item.$ref.remove();
        } else {
          item.$ref.remove(cb);
        }
      };

      // Update an object in the remote collection.
      collection.update = function(itemOrId, cb) {
        var item = angular.isString(itemOrId) ?
          collection[indexes[itemOrId]] : itemOrId;
        var copy = {};
        // Update all properties, unless they're ones created by Angular.
        angular.forEach(item, function(value, key) {
          if (key.indexOf("$") !== 0) {
            copy[key] = value;
          }
        });
        if (!cb) {
          item.$ref.set(copy);
        } else {
          item.$ref.set(copy, cb);
        }
      };

      return collection;
    }
  }
]);

// Defines the `angularFireAuth` service that provides authentication support
// for AngularFire.
angular.module("firebase").factory("angularFireAuth", [
  "$rootScope", "$parse", "$timeout", "$location", "$route",
  function($rootScope, $parse, $timeout, $location, $route) {

    // Helper function to extract claims from a JWT. Does *not* verify the
    // validity of the token.
    function deconstructJWT(token) {
      var segments = token.split(".");
      if (!segments instanceof Array || segments.length !== 3) {
        throw new Error("Invalid JWT");
      }
      var claims = segments[1];
      return JSON.parse(decodeURIComponent(escape(window.atob(claims))));
    }

    // Updates the provided model.
    function updateExpression(scope, name, val, cb) {
      if (name) {
        $timeout(function() {
          $parse(name).assign(scope, val);
          cb();
        });
      }
    }

    // A function to check whether the current path requires authentication,
    // and if so, whether a redirect to a login page is needed.
    function authRequiredRedirect(route, path, self) {
      if (route.authRequired && !self._authenticated){
        if (route.pathTo === undefined) {
          self._redirectTo = $location.path();
        } else {
          self._redirectTo = route.pathTo === path ? "/" : route.pathTo;
        }
        $location.replace();
        $location.path(path);
      }
    }

    return {
      // Initializes the authentication service. Takes a Firebase URL and
      // an options object, that may contain the following properties:
      //
      // * `scope`: The scope to which user authentication status will be
      // bound to. Defaults to `$rootScope` if not provided.
      // * `name`: Name of the model to which user auth state is bound.
      // * `callback`: A function that will be called when there is a change
      // in authentication state.
      // * `path`: The path to which the user will be redirected if the
      // `authRequired` property was set to true in the `$routeProvider`, and
      // the user isn't logged in.
      // * `simple`: AngularFireAuth requires inclusion of the
      // `firebase-simple-login.js` file by default. If this value is set to
      // false, this requirement is waived, but only custom login functionality
      // will be enabled.
      initialize: function(url, options) {
        var self = this;

        options = options || {};
        this._scope = $rootScope;
        if (options.scope) {
          this._scope = options.scope;
        }
        if (options.name) {
          this._name = options.name;
        }
        this._cb = function(){};
        if (options.callback && typeof options.callback === "function") {
          this._cb = options.callback;
        }

        this._redirectTo = null;
        this._authenticated = false;
        if (options.path) {
          // Check if the current page requires authentication.
          if ($route.current) {
            authRequiredRedirect($route.current, options.path, self);
          }
          // Set up a handler for all future route changes, so we can check
          // if authentication is required.
          $rootScope.$on("$routeChangeStart", function(e, next) {
            authRequiredRedirect(next, options.path, self);
          });
        }

        // Initialize user authentication state to `null`.
        this._ref = new Firebase(url);
        if (options.simple && options.simple === false) {
          updateExpression(this._scope, this._name, null);
          return;
        }

        // Initialize Simple Login.
        if (!window.FirebaseSimpleLogin) {
          var err = new Error("FirebaseSimpleLogin undefined, " +
            "did you include firebase-simple-login.js?");
          $rootScope.$broadcast("angularFireAuth:error", err);
          return;
        }
        var client = new FirebaseSimpleLogin(this._ref, function(err, user) {
          self._cb(err, user);
          if (err) {
            $rootScope.$broadcast("angularFireAuth:error", err);
          } else if (user) {
            self._loggedIn(user)
          } else {
            self._loggedOut();
          }
        });
        this._authClient = client;
      },

      // The login method takes a provider (for Simple Login) or a token
      // (for Custom Login) and authenticates the Firebase URL with which
      // the service was initialized.
      login: function(tokenOrProvider, options) {
        switch (tokenOrProvider) {
        case "github":
        case "persona":
        case "twitter":
        case "facebook":
        case "password":
          if (!this._authClient) {
            var err = new Error("Simple Login not initialized");
            $rootScope.$broadcast("angularFireAuth:error", err);
          } else {
            this._authClient.login(tokenOrProvider, options);
          }
          break;
        // A token was provided, so initialize custom login.
        default:
          var claims, self = this;
          try {
            // Extract claims and update user auth state to include them.
            claims = deconstructJWT(tokenOrProvider);
            this._ref.auth(tokenOrProvider, function(err) {
              if (err) {
                $rootScope.$broadcast("angularFireAuth:error", err);
              } else {
                self._loggedIn(claims);
              }
            });
          } catch(e) {
            $rootScope.$broadcast("angularFireAuth:error", e)
          }
        }
      },

      // Unauthenticate the Firebase reference.
      logout: function() {
        if (this._authClient) {
          this._authClient.logout();
        } else {
          this._ref.unauth();
          this._loggedOut();
        }
      },

      // Common function to trigger a login event on the root scope.
      _loggedIn: function(user) {
        var self = this;
        this._authenticated = true;
        updateExpression(this._scope, this._name, user, function() {
          $rootScope.$broadcast("angularFireAuth:login", user);
          if (self._redirectTo) {
            $location.replace();
            $location.path(self._redirectTo);
            self._redirectTo = null;
          }
        });
      },

      // Common function to trigger a logout event on the root scope.
      _loggedOut: function() {
        this._authenticated = false;
        updateExpression(this._scope, this._name, null, function() {
          $rootScope.$broadcast("angularFireAuth:logout");
        });
      }
    }
  }
]);
