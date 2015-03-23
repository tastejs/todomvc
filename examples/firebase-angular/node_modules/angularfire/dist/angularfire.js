/*!
 * AngularFire is the officially supported AngularJS binding for Firebase. Firebase
 * is a full backend so you don't need servers to build your Angular app. AngularFire
 * provides you with the $firebase service which allows you to easily keep your $scope
 * variables in sync with your Firebase backend.
 *
 * AngularFire 1.0.0
 * https://github.com/firebase/angularfire/
 * Date: 03/04/2015
 * License: MIT
 */
(function(exports) {
  "use strict";

// Define the `firebase` module under which all AngularFire
// services will live.
  angular.module("firebase", [])
    //todo use $window
    .value("Firebase", exports.Firebase)

    // used in conjunction with firebaseUtils.debounce function, this is the
    // amount of time we will wait for additional records before triggering
    // Angular's digest scope to dirty check and re-render DOM elements. A
    // larger number here significantly improves performance when working with
    // big data sets that are frequently changing in the DOM, but delays the
    // speed at which each record is rendered in real-time. A number less than
    // 100ms will usually be optimal.
    .value('firebaseBatchDelay', 50 /* milliseconds */);

})(window);
(function() {
  'use strict';
  /**
   * Creates and maintains a synchronized list of data. This is a pseudo-read-only array. One should
   * not call splice(), push(), pop(), et al directly on this array, but should instead use the
   * $remove and $add methods.
   *
   * It is acceptable to .sort() this array, but it is important to use this in conjunction with
   * $watch(), so that it will be re-sorted any time the server data changes. Examples of this are
   * included in the $watch documentation.
   *
   * Internally, the $firebase object depends on this class to provide several $$ (i.e. protected)
   * methods, which it invokes to notify the array whenever a change has been made at the server:
   *    $$added - called whenever a child_added event occurs
   *    $$updated - called whenever a child_changed event occurs
   *    $$moved - called whenever a child_moved event occurs
   *    $$removed - called whenever a child_removed event occurs
   *    $$error - called when listeners are canceled due to a security error
   *    $$process - called immediately after $$added/$$updated/$$moved/$$removed
   *                (assuming that these methods do not abort by returning false or null)
   *                to splice/manipulate the array and invoke $$notify
   *
   * Additionally, these methods may be of interest to devs extending this class:
   *    $$notify - triggers notifications to any $watch listeners, called by $$process
   *    $$getKey - determines how to look up a record's key (returns $id by default)
   *
   * Instead of directly modifying this class, one should generally use the $extend
   * method to add or change how methods behave. $extend modifies the prototype of
   * the array class by returning a clone of $firebaseArray.
   *
   * <pre><code>
   * var ExtendedArray = $firebaseArray.$extend({
   *    // add a new method to the prototype
   *    foo: function() { return 'bar'; },
   *
   *    // change how records are created
   *    $$added: function(snap, prevChild) {
   *       return new Widget(snap, prevChild);
   *    },
   *
   *    // change how records are updated
   *    $$updated: function(snap) {
   *      return this.$getRecord(snap.key()).update(snap);
   *    }
   * });
   *
   * var list = new ExtendedArray(ref);
   * </code></pre>
   */
  angular.module('firebase').factory('$firebaseArray', ["$log", "$firebaseUtils",
    function($log, $firebaseUtils) {
      /**
       * This constructor should probably never be called manually. It is used internally by
       * <code>$firebase.$asArray()</code>.
       *
       * @param {Firebase} ref
       * @returns {Array}
       * @constructor
       */
      function FirebaseArray(ref) {
        if( !(this instanceof FirebaseArray) ) {
          return new FirebaseArray(ref);
        }
        var self = this;
        this._observers = [];
        this.$list = [];
        this._ref = ref;
        this._sync = new ArraySyncManager(this);

        $firebaseUtils.assertValidRef(ref, 'Must pass a valid Firebase reference ' +
        'to $firebaseArray (not a string or URL)');

        // indexCache is a weak hashmap (a lazy list) of keys to array indices,
        // items are not guaranteed to stay up to date in this list (since the data
        // array can be manually edited without calling the $ methods) and it should
        // always be used with skepticism regarding whether it is accurate
        // (see $indexFor() below for proper usage)
        this._indexCache = {};

        // Array.isArray will not work on objects which extend the Array class.
        // So instead of extending the Array class, we just return an actual array.
        // However, it's still possible to extend FirebaseArray and have the public methods
        // appear on the array object. We do this by iterating the prototype and binding
        // any method that is not prefixed with an underscore onto the final array.
        $firebaseUtils.getPublicMethods(self, function(fn, key) {
          self.$list[key] = fn.bind(self);
        });

        this._sync.init(this.$list);

        return this.$list;
      }

      FirebaseArray.prototype = {
        /**
         * Create a new record with a unique ID and add it to the end of the array.
         * This should be used instead of Array.prototype.push, since those changes will not be
         * synchronized with the server.
         *
         * Any value, including a primitive, can be added in this way. Note that when the record
         * is created, the primitive value would be stored in $value (records are always objects
         * by default).
         *
         * Returns a future which is resolved when the data has successfully saved to the server.
         * The resolve callback will be passed a Firebase ref representing the new data element.
         *
         * @param data
         * @returns a promise resolved after data is added
         */
        $add: function(data) {
          this._assertNotDestroyed('$add');
          var def = $firebaseUtils.defer();
          var ref = this.$ref().ref().push();
          ref.set($firebaseUtils.toJSON(data), $firebaseUtils.makeNodeResolver(def));
          return def.promise.then(function() {
            return ref;
          });
        },

        /**
         * Pass either an item in the array or the index of an item and it will be saved back
         * to Firebase. While the array is read-only and its structure should not be changed,
         * it is okay to modify properties on the objects it contains and then save those back
         * individually.
         *
         * Returns a future which is resolved when the data has successfully saved to the server.
         * The resolve callback will be passed a Firebase ref representing the saved element.
         * If passed an invalid index or an object which is not a record in this array,
         * the promise will be rejected.
         *
         * @param {int|object} indexOrItem
         * @returns a promise resolved after data is saved
         */
        $save: function(indexOrItem) {
          this._assertNotDestroyed('$save');
          var self = this;
          var item = self._resolveItem(indexOrItem);
          var key = self.$keyAt(item);
          if( key !== null ) {
            var ref = self.$ref().ref().child(key);
            var data = $firebaseUtils.toJSON(item);
            return $firebaseUtils.doSet(ref, data).then(function() {
              self.$$notify('child_changed', key);
              return ref;
            });
          }
          else {
            return $firebaseUtils.reject('Invalid record; could determine key for '+indexOrItem);
          }
        },

        /**
         * Pass either an existing item in this array or the index of that item and it will
         * be removed both locally and in Firebase. This should be used in place of
         * Array.prototype.splice for removing items out of the array, as calling splice
         * will not update the value on the server.
         *
         * Returns a future which is resolved when the data has successfully removed from the
         * server. The resolve callback will be passed a Firebase ref representing the deleted
         * element. If passed an invalid index or an object which is not a record in this array,
         * the promise will be rejected.
         *
         * @param {int|object} indexOrItem
         * @returns a promise which resolves after data is removed
         */
        $remove: function(indexOrItem) {
          this._assertNotDestroyed('$remove');
          var key = this.$keyAt(indexOrItem);
          if( key !== null ) {
            var ref = this.$ref().ref().child(key);
            return $firebaseUtils.doRemove(ref).then(function() {
              return ref;
            });
          }
          else {
            return $firebaseUtils.reject('Invalid record; could not determine key for '+indexOrItem);
          }
        },

        /**
         * Given an item in this array or the index of an item in the array, this returns the
         * Firebase key (record.$id) for that record. If passed an invalid key or an item which
         * does not exist in this array, it will return null.
         *
         * @param {int|object} indexOrItem
         * @returns {null|string}
         */
        $keyAt: function(indexOrItem) {
          var item = this._resolveItem(indexOrItem);
          return this.$$getKey(item);
        },

        /**
         * The inverse of $keyAt, this method takes a Firebase key (record.$id) and returns the
         * index in the array where that record is stored. If the record is not in the array,
         * this method returns -1.
         *
         * @param {String} key
         * @returns {int} -1 if not found
         */
        $indexFor: function(key) {
          var self = this;
          var cache = self._indexCache;
          // evaluate whether our key is cached and, if so, whether it is up to date
          if( !cache.hasOwnProperty(key) || self.$keyAt(cache[key]) !== key ) {
            // update the hashmap
            var pos = self.$list.findIndex(function(rec) { return self.$$getKey(rec) === key; });
            if( pos !== -1 ) {
              cache[key] = pos;
            }
          }
          return cache.hasOwnProperty(key)? cache[key] : -1;
        },

        /**
         * The loaded method is invoked after the initial batch of data arrives from the server.
         * When this resolves, all data which existed prior to calling $asArray() is now cached
         * locally in the array.
         *
         * As a shortcut is also possible to pass resolve/reject methods directly into this
         * method just as they would be passed to .then()
         *
         * @param {Function} [resolve]
         * @param {Function} [reject]
         * @returns a promise
         */
        $loaded: function(resolve, reject) {
          var promise = this._sync.ready();
          if( arguments.length ) {
            // allow this method to be called just like .then
            // by passing any arguments on to .then
            promise = promise.then.call(promise, resolve, reject);
          }
          return promise;
        },

        /**
         * @returns {Firebase} the original Firebase ref used to create this object.
         */
        $ref: function() { return this._ref; },

        /**
         * Listeners passed into this method are notified whenever a new change (add, updated,
         * move, remove) is received from the server. Each invocation is sent an object
         * containing <code>{ type: 'added|updated|moved|removed', key: 'key_of_item_affected'}</code>
         *
         * Additionally, added and moved events receive a prevChild parameter, containing the
         * key of the item before this one in the array.
         *
         * This method returns a function which can be invoked to stop observing events.
         *
         * @param {Function} cb
         * @param {Object} [context]
         * @returns {Function} used to stop observing
         */
        $watch: function(cb, context) {
          var list = this._observers;
          list.push([cb, context]);
          // an off function for cancelling the listener
          return function() {
            var i = list.findIndex(function(parts) {
              return parts[0] === cb && parts[1] === context;
            });
            if( i > -1 ) {
              list.splice(i, 1);
            }
          };
        },

        /**
         * Informs $firebase to stop sending events and clears memory being used
         * by this array (delete's its local content).
         */
        $destroy: function(err) {
          if( !this._isDestroyed ) {
            this._isDestroyed = true;
            this._sync.destroy(err);
            this.$list.length = 0;
            $log.debug('destroy called for FirebaseArray: '+this.$ref().ref().toString());
          }
        },

        /**
         * Returns the record for a given Firebase key (record.$id). If the record is not found
         * then returns null.
         *
         * @param {string} key
         * @returns {Object|null} a record in this array
         */
        $getRecord: function(key) {
          var i = this.$indexFor(key);
          return i > -1? this.$list[i] : null;
        },

        /**
         * Called to inform the array when a new item has been added at the server.
         * This method should return the record (an object) that will be passed into $$process
         * along with the add event. Alternately, the record will be skipped if this method returns
         * a falsey value.
         *
         * @param {object} snap a Firebase snapshot
         * @param {string} prevChild
         * @return {object} the record to be inserted into the array
         * @protected
         */
        $$added: function(snap/*, prevChild*/) {
          // check to make sure record does not exist
          var i = this.$indexFor($firebaseUtils.getKey(snap));
          if( i === -1 ) {
            // parse data and create record
            var rec = snap.val();
            if( !angular.isObject(rec) ) {
              rec = { $value: rec };
            }
            rec.$id = $firebaseUtils.getKey(snap);
            rec.$priority = snap.getPriority();
            $firebaseUtils.applyDefaults(rec, this.$$defaults);

            return rec;
          }
          return false;
        },

        /**
         * Called whenever an item is removed at the server.
         * This method does not physically remove the objects, but instead
         * returns a boolean indicating whether it should be removed (and
         * taking any other desired actions before the remove completes).
         *
         * @param {object} snap a Firebase snapshot
         * @return {boolean} true if item should be removed
         * @protected
         */
        $$removed: function(snap) {
          return this.$indexFor($firebaseUtils.getKey(snap)) > -1;
        },

        /**
         * Called whenever an item is changed at the server.
         * This method should apply the changes, including changes to data
         * and to $priority, and then return true if any changes were made.
         *
         * If this method returns false, then $$process will not be invoked,
         * which means that $$notify will not take place and no $watch events
         * will be triggered.
         *
         * @param {object} snap a Firebase snapshot
         * @return {boolean} true if any data changed
         * @protected
         */
        $$updated: function(snap) {
          var changed = false;
          var rec = this.$getRecord($firebaseUtils.getKey(snap));
          if( angular.isObject(rec) ) {
            // apply changes to the record
            changed = $firebaseUtils.updateRec(rec, snap);
            $firebaseUtils.applyDefaults(rec, this.$$defaults);
          }
          return changed;
        },

        /**
         * Called whenever an item changes order (moves) on the server.
         * This method should set $priority to the updated value and return true if
         * the record should actually be moved. It should not actually apply the move
         * operation.
         *
         * If this method returns false, then the record will not be moved in the array
         * and no $watch listeners will be notified. (When true, $$process is invoked
         * which invokes $$notify)
         *
         * @param {object} snap a Firebase snapshot
         * @param {string} prevChild
         * @protected
         */
        $$moved: function(snap/*, prevChild*/) {
          var rec = this.$getRecord($firebaseUtils.getKey(snap));
          if( angular.isObject(rec) ) {
            rec.$priority = snap.getPriority();
            return true;
          }
          return false;
        },

        /**
         * Called whenever a security error or other problem causes the listeners to become
         * invalid. This is generally an unrecoverable error.
         *
         * @param {Object} err which will have a `code` property and possibly a `message`
         * @protected
         */
        $$error: function(err) {
          $log.error(err);
          this.$destroy(err);
        },

        /**
         * Returns ID for a given record
         * @param {object} rec
         * @returns {string||null}
         * @protected
         */
        $$getKey: function(rec) {
          return angular.isObject(rec)? rec.$id : null;
        },

        /**
         * Handles placement of recs in the array, sending notifications,
         * and other internals. Called by the synchronization process
         * after $$added, $$updated, $$moved, and $$removed return a truthy value.
         *
         * @param {string} event one of child_added, child_removed, child_moved, or child_changed
         * @param {object} rec
         * @param {string} [prevChild]
         * @protected
         */
        $$process: function(event, rec, prevChild) {
          var key = this.$$getKey(rec);
          var changed = false;
          var curPos;
          switch(event) {
            case 'child_added':
              curPos = this.$indexFor(key);
              break;
            case 'child_moved':
              curPos = this.$indexFor(key);
              this._spliceOut(key);
              break;
            case 'child_removed':
              // remove record from the array
              changed = this._spliceOut(key) !== null;
              break;
            case 'child_changed':
              changed = true;
              break;
            default:
              throw new Error('Invalid event type: ' + event);
          }
          if( angular.isDefined(curPos) ) {
            // add it to the array
            changed = this._addAfter(rec, prevChild) !== curPos;
          }
          if( changed ) {
            // send notifications to anybody monitoring $watch
            this.$$notify(event, key, prevChild);
          }
          return changed;
        },

        /**
         * Used to trigger notifications for listeners registered using $watch. This method is
         * typically invoked internally by the $$process method.
         *
         * @param {string} event
         * @param {string} key
         * @param {string} [prevChild]
         * @protected
         */
        $$notify: function(event, key, prevChild) {
          var eventData = {event: event, key: key};
          if( angular.isDefined(prevChild) ) {
            eventData.prevChild = prevChild;
          }
          angular.forEach(this._observers, function(parts) {
            parts[0].call(parts[1], eventData);
          });
        },

        /**
         * Used to insert a new record into the array at a specific position. If prevChild is
         * null, is inserted first, if prevChild is not found, it is inserted last, otherwise,
         * it goes immediately after prevChild.
         *
         * @param {object} rec
         * @param {string|null} prevChild
         * @private
         */
        _addAfter: function(rec, prevChild) {
          var i;
          if( prevChild === null ) {
            i = 0;
          }
          else {
            i = this.$indexFor(prevChild)+1;
            if( i === 0 ) { i = this.$list.length; }
          }
          this.$list.splice(i, 0, rec);
          this._indexCache[this.$$getKey(rec)] = i;
          return i;
        },

        /**
         * Removes a record from the array by calling splice. If the item is found
         * this method returns it. Otherwise, this method returns null.
         *
         * @param {string} key
         * @returns {object|null}
         * @private
         */
        _spliceOut: function(key) {
          var i = this.$indexFor(key);
          if( i > -1 ) {
            delete this._indexCache[key];
            return this.$list.splice(i, 1)[0];
          }
          return null;
        },

        /**
         * Resolves a variable which may contain an integer or an item that exists in this array.
         * Returns the item or null if it does not exist.
         *
         * @param indexOrItem
         * @returns {*}
         * @private
         */
        _resolveItem: function(indexOrItem) {
          var list = this.$list;
          if( angular.isNumber(indexOrItem) && indexOrItem >= 0 && list.length >= indexOrItem ) {
            return list[indexOrItem];
          }
          else if( angular.isObject(indexOrItem) ) {
            // it must be an item in this array; it's not sufficient for it just to have
            // a $id or even a $id that is in the array, it must be an actual record
            // the fastest way to determine this is to use $getRecord (to avoid iterating all recs)
            // and compare the two
            var key = this.$$getKey(indexOrItem);
            var rec = this.$getRecord(key);
            return rec === indexOrItem? rec : null;
          }
          return null;
        },

        /**
         * Throws an error if $destroy has been called. Should be used for any function
         * which tries to write data back to $firebase.
         * @param {string} method
         * @private
         */
        _assertNotDestroyed: function(method) {
          if( this._isDestroyed ) {
            throw new Error('Cannot call ' + method + ' method on a destroyed $firebaseArray object');
          }
        }
      };

      /**
       * This method allows FirebaseArray to be inherited by child classes. Methods passed into this
       * function will be added onto the array's prototype. They can override existing methods as
       * well.
       *
       * In addition to passing additional methods, it is also possible to pass in a class function.
       * The prototype on that class function will be preserved, and it will inherit from
       * FirebaseArray. It's also possible to do both, passing a class to inherit and additional
       * methods to add onto the prototype.
       *
       *  <pre><code>
       * var ExtendedArray = $firebaseArray.$extend({
       *    // add a method onto the prototype that sums all items in the array
       *    getSum: function() {
       *       var ct = 0;
       *       angular.forEach(this.$list, function(rec) { ct += rec.x; });
        *      return ct;
       *    }
       * });
       *
       * // use our new factory in place of $firebaseArray
       * var list = new ExtendedArray(ref);
       * </code></pre>
       *
       * @param {Function} [ChildClass] a child class which should inherit FirebaseArray
       * @param {Object} [methods] a list of functions to add onto the prototype
       * @returns {Function} a child class suitable for use with $firebase (this will be ChildClass if provided)
       * @static
       */
      FirebaseArray.$extend = function(ChildClass, methods) {
        if( arguments.length === 1 && angular.isObject(ChildClass) ) {
          methods = ChildClass;
          ChildClass = function() { return FirebaseArray.apply(this, arguments); };
        }
        return $firebaseUtils.inherit(ChildClass, FirebaseArray, methods);
      };

      function ArraySyncManager(firebaseArray) {
        function destroy(err) {
          if( !sync.isDestroyed ) {
            sync.isDestroyed = true;
            var ref = firebaseArray.$ref();
            ref.off('child_added', created);
            ref.off('child_moved', moved);
            ref.off('child_changed', updated);
            ref.off('child_removed', removed);
            firebaseArray = null;
            initComplete(err||'destroyed');
          }
        }

        function init($list) {
          var ref = firebaseArray.$ref();

          // listen for changes at the Firebase instance
          ref.on('child_added', created, error);
          ref.on('child_moved', moved, error);
          ref.on('child_changed', updated, error);
          ref.on('child_removed', removed, error);

          // determine when initial load is completed
          ref.once('value', function(snap) {
            if (angular.isArray(snap.val())) {
              $log.warn('Storing data using array indices in Firebase can result in unexpected behavior. See https://www.firebase.com/docs/web/guide/understanding-data.html#section-arrays-in-firebase for more information.');
            }

            initComplete(null, $list);
          }, initComplete);
        }

        // call initComplete(), do not call this directly
        function _initComplete(err, result) {
          if( !isResolved ) {
            isResolved = true;
            if( err ) { def.reject(err); }
            else { def.resolve(result); }
          }
        }

        var def     = $firebaseUtils.defer();
        var batch   = $firebaseUtils.batch();
        var created = batch(function(snap, prevChild) {
          var rec = firebaseArray.$$added(snap, prevChild);
          if( rec ) {
            firebaseArray.$$process('child_added', rec, prevChild);
          }
        });
        var updated = batch(function(snap) {
          var rec = firebaseArray.$getRecord($firebaseUtils.getKey(snap));
          if( rec ) {
            var changed = firebaseArray.$$updated(snap);
            if( changed ) {
              firebaseArray.$$process('child_changed', rec);
            }
          }
        });
        var moved   = batch(function(snap, prevChild) {
          var rec = firebaseArray.$getRecord($firebaseUtils.getKey(snap));
          if( rec ) {
            var confirmed = firebaseArray.$$moved(snap, prevChild);
            if( confirmed ) {
              firebaseArray.$$process('child_moved', rec, prevChild);
            }
          }
        });
        var removed = batch(function(snap) {
          var rec = firebaseArray.$getRecord($firebaseUtils.getKey(snap));
          if( rec ) {
            var confirmed = firebaseArray.$$removed(snap);
            if( confirmed ) {
              firebaseArray.$$process('child_removed', rec);
            }
          }
        });

        var isResolved = false;
        var error   = batch(function(err) {
          _initComplete(err);
          firebaseArray.$$error(err);
        });
        var initComplete = batch(_initComplete);

        var sync = {
          destroy: destroy,
          isDestroyed: false,
          init: init,
          ready: function() { return def.promise; }
        };

        return sync;
      }

      return FirebaseArray;
    }
  ]);

  /** @deprecated */
  angular.module('firebase').factory('$FirebaseArray', ['$log', '$firebaseArray',
    function($log, $firebaseArray) {
      return function() {
        $log.warn('$FirebaseArray has been renamed. Use $firebaseArray instead.');
        return $firebaseArray.apply(null, arguments);
      };
    }
  ]);
})();

(function() {
  'use strict';
  var FirebaseAuth;

  // Define a service which provides user authentication and management.
  angular.module('firebase').factory('$firebaseAuth', [
    '$q', '$firebaseUtils', '$log', function($q, $firebaseUtils, $log) {
      /**
       * This factory returns an object allowing you to manage the client's authentication state.
       *
       * @param {Firebase} ref A Firebase reference to authenticate.
       * @return {object} An object containing methods for authenticating clients, retrieving
       * authentication state, and managing users.
       */
      return function(ref) {
        var auth = new FirebaseAuth($q, $firebaseUtils, $log, ref);
        return auth.construct();
      };
    }
  ]);

  FirebaseAuth = function($q, $firebaseUtils, $log, ref) {
    this._q = $q;
    this._utils = $firebaseUtils;
    this._log = $log;

    if (typeof ref === 'string') {
      throw new Error('Please provide a Firebase reference instead of a URL when creating a `$firebaseAuth` object.');
    }
    this._ref = ref;
  };

  FirebaseAuth.prototype = {
    construct: function() {
      this._object = {
        // Authentication methods
        $authWithCustomToken: this.authWithCustomToken.bind(this),
        $authAnonymously: this.authAnonymously.bind(this),
        $authWithPassword: this.authWithPassword.bind(this),
        $authWithOAuthPopup: this.authWithOAuthPopup.bind(this),
        $authWithOAuthRedirect: this.authWithOAuthRedirect.bind(this),
        $authWithOAuthToken: this.authWithOAuthToken.bind(this),
        $unauth: this.unauth.bind(this),

        // Authentication state methods
        $onAuth: this.onAuth.bind(this),
        $getAuth: this.getAuth.bind(this),
        $requireAuth: this.requireAuth.bind(this),
        $waitForAuth: this.waitForAuth.bind(this),

        // User management methods
        $createUser: this.createUser.bind(this),
        $changePassword: this.changePassword.bind(this),
        $changeEmail: this.changeEmail.bind(this),
        $removeUser: this.removeUser.bind(this),
        $resetPassword: this.resetPassword.bind(this)
      };

      return this._object;
    },


    /********************/
    /*  Authentication  */
    /********************/

    /**
     * Authenticates the Firebase reference with a custom authentication token.
     *
     * @param {string} authToken An authentication token or a Firebase Secret. A Firebase Secret
     * should only be used for authenticating a server process and provides full read / write
     * access to the entire Firebase.
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authWithCustomToken: function(authToken, options) {
      var deferred = this._q.defer();

      try {
        this._ref.authWithCustomToken(authToken, this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Authenticates the Firebase reference anonymously.
     *
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authAnonymously: function(options) {
      var deferred = this._q.defer();

      try {
        this._ref.authAnonymously(this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Authenticates the Firebase reference with an email/password user.
     *
     * @param {Object} credentials An object containing email and password attributes corresponding
     * to the user account.
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authWithPassword: function(credentials, options) {
      var deferred = this._q.defer();

      try {
        this._ref.authWithPassword(credentials, this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Authenticates the Firebase reference with the OAuth popup flow.
     *
     * @param {string} provider The unique string identifying the OAuth provider to authenticate
     * with, e.g. google.
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authWithOAuthPopup: function(provider, options) {
      var deferred = this._q.defer();

      try {
        this._ref.authWithOAuthPopup(provider, this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Authenticates the Firebase reference with the OAuth redirect flow.
     *
     * @param {string} provider The unique string identifying the OAuth provider to authenticate
     * with, e.g. google.
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authWithOAuthRedirect: function(provider, options) {
      var deferred = this._q.defer();

      try {
        this._ref.authWithOAuthRedirect(provider, this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Authenticates the Firebase reference with an OAuth token.
     *
     * @param {string} provider The unique string identifying the OAuth provider to authenticate
     * with, e.g. google.
     * @param {string|Object} credentials Either a string, such as an OAuth 2.0 access token, or an
     * Object of key / value pairs, such as a set of OAuth 1.0a credentials.
     * @param {Object} [options] An object containing optional client arguments, such as configuring
     * session persistence.
     * @return {Promise<Object>} A promise fulfilled with an object containing authentication data.
     */
    authWithOAuthToken: function(provider, credentials, options) {
      var deferred = this._q.defer();

      try {
        this._ref.authWithOAuthToken(provider, credentials, this._utils.makeNodeResolver(deferred), options);
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Unauthenticates the Firebase reference.
     */
    unauth: function() {
      if (this.getAuth() !== null) {
        this._ref.unauth();
      }
    },


    /**************************/
    /*  Authentication State  */
    /**************************/
    /**
     * Asynchronously fires the provided callback with the current authentication data every time
     * the authentication data changes. It also fires as soon as the authentication data is
     * retrieved from the server.
     *
     * @param {function} callback A callback that fires when the client's authenticate state
     * changes. If authenticated, the callback will be passed an object containing authentication
     * data according to the provider used to authenticate. Otherwise, it will be passed null.
     * @param {string} [context] If provided, this object will be used as this when calling your
     * callback.
     * @return {function} A function which can be used to deregister the provided callback.
     */
    onAuth: function(callback, context) {
      var self = this;

      var fn = this._utils.debounce(callback, context, 0);
      this._ref.onAuth(fn);

      // Return a method to detach the `onAuth()` callback.
      return function() {
        self._ref.offAuth(fn);
      };
    },

    /**
     * Synchronously retrieves the current authentication data.
     *
     * @return {Object} The client's authentication data.
     */
    getAuth: function() {
      return this._ref.getAuth();
    },

    /**
     * Helper onAuth() callback method for the two router-related methods.
     *
     * @param {boolean} rejectIfAuthDataIsNull Determines if the returned promise should be
     * resolved or rejected upon an unauthenticated client.
     * @return {Promise<Object>} A promise fulfilled with the client's authentication state or
     * rejected if the client is unauthenticated and rejectIfAuthDataIsNull is true.
     */
    _routerMethodOnAuthPromise: function(rejectIfAuthDataIsNull) {
      var ref = this._ref;

      return this._utils.promise(function(resolve,reject){
        function callback(authData) {
          // Turn off this onAuth() callback since we just needed to get the authentication data once.
          ref.offAuth(callback);

          if (authData !== null) {
            resolve(authData);
            return;
          }
          else if (rejectIfAuthDataIsNull) {
            reject("AUTH_REQUIRED");
            return;
          }
          else {
            resolve(null);
            return;
          }
        }

        ref.onAuth(callback);
      });
    },

    /**
     * Utility method which can be used in a route's resolve() method to require that a route has
     * a logged in client.
     *
     * @returns {Promise<Object>} A promise fulfilled with the client's current authentication
     * state or rejected if the client is not authenticated.
     */
    requireAuth: function() {
      return this._routerMethodOnAuthPromise(true);
    },

    /**
     * Utility method which can be used in a route's resolve() method to grab the current
     * authentication data.
     *
     * @returns {Promise<Object|null>} A promise fulfilled with the client's current authentication
     * state, which will be null if the client is not authenticated.
     */
    waitForAuth: function() {
      return this._routerMethodOnAuthPromise(false);
    },


    /*********************/
    /*  User Management  */
    /*********************/
    /**
     * Creates a new email/password user. Note that this function only creates the user, if you
     * wish to log in as the newly created user, call $authWithPassword() after the promise for
     * this method has been resolved.
     *
     * @param {Object} credentials An object containing the email and password of the user to create.
     * @return {Promise<Object>} A promise fulfilled with the user object, which contains the
     * uid of the created user.
     */
    createUser: function(credentials) {
      var deferred = this._q.defer();

      // Throw an error if they are trying to pass in separate string arguments
      if (typeof credentials === "string") {
        throw new Error("$createUser() expects an object containing 'email' and 'password', but got a string.");
      }

      try {
        this._ref.createUser(credentials, this._utils.makeNodeResolver(deferred));
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Changes the password for an email/password user.
     *
     * @param {Object} credentials An object containing the email, old password, and new password of
     * the user whose password is to change.
     * @return {Promise<>} An empty promise fulfilled once the password change is complete.
     */
    changePassword: function(credentials) {
      var deferred = this._q.defer();

      // Throw an error if they are trying to pass in separate string arguments
      if (typeof credentials === "string") {
        throw new Error("$changePassword() expects an object containing 'email', 'oldPassword', and 'newPassword', but got a string.");
      }

      try {
        this._ref.changePassword(credentials, this._utils.makeNodeResolver(deferred));
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Changes the email for an email/password user.
     *
     * @param {Object} credentials An object containing the old email, new email, and password of
     * the user whose email is to change.
     * @return {Promise<>} An empty promise fulfilled once the email change is complete.
     */
    changeEmail: function(credentials) {
      if (typeof this._ref.changeEmail !== 'function') {
        throw new Error("$changeEmail() expects an object containing 'oldEmail', 'newEmail', and 'password', but got a string.");
      }

      var deferred = this._q.defer();

      try {
        this._ref.changeEmail(credentials, this._utils.makeNodeResolver(deferred));
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },

    /**
     * Removes an email/password user.
     *
     * @param {Object} credentials An object containing the email and password of the user to remove.
     * @return {Promise<>} An empty promise fulfilled once the user is removed.
     */
    removeUser: function(credentials) {
      var deferred = this._q.defer();

      // Throw an error if they are trying to pass in separate string arguments
      if (typeof credentials === "string") {
        throw new Error("$removeUser() expects an object containing 'email' and 'password', but got a string.");
      }

      try {
        this._ref.removeUser(credentials, this._utils.makeNodeResolver(deferred));
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    },


    /**
     * Sends a password reset email to an email/password user.
     *
     * @param {Object} credentials An object containing the email of the user to send a reset
     * password email to.
     * @return {Promise<>} An empty promise fulfilled once the reset password email is sent.
     */
    resetPassword: function(credentials) {
      var deferred = this._q.defer();

      // Throw an error if they are trying to pass in a string argument
      if (typeof credentials === "string") {
        throw new Error("$resetPassword() expects an object containing 'email', but got a string.");
      }

      try {
        this._ref.resetPassword(credentials, this._utils.makeNodeResolver(deferred));
      } catch (error) {
        deferred.reject(error);
      }

      return deferred.promise;
    }
  };
})();

(function() {
  'use strict';
  /**
   * Creates and maintains a synchronized object, with 2-way bindings between Angular and Firebase.
   *
   * Implementations of this class are contracted to provide the following internal methods,
   * which are used by the synchronization process and 3-way bindings:
   *    $$updated - called whenever a change occurs (a value event from Firebase)
   *    $$error - called when listeners are canceled due to a security error
   *    $$notify - called to update $watch listeners and trigger updates to 3-way bindings
   *    $ref - called to obtain the underlying Firebase reference
   *
   * Instead of directly modifying this class, one should generally use the $extend
   * method to add or change how methods behave:
   *
   * <pre><code>
   * var ExtendedObject = $firebaseObject.$extend({
   *    // add a new method to the prototype
   *    foo: function() { return 'bar'; },
   * });
   *
   * var obj = new ExtendedObject(ref);
   * </code></pre>
   */
  angular.module('firebase').factory('$firebaseObject', [
    '$parse', '$firebaseUtils', '$log',
    function($parse, $firebaseUtils, $log) {
      /**
       * Creates a synchronized object with 2-way bindings between Angular and Firebase.
       *
       * @param {Firebase} ref
       * @returns {FirebaseObject}
       * @constructor
       */
      function FirebaseObject(ref) {
        if( !(this instanceof FirebaseObject) ) {
          return new FirebaseObject(ref);
        }
        // These are private config props and functions used internally
        // they are collected here to reduce clutter in console.log and forEach
        this.$$conf = {
          // synchronizes data to Firebase
          sync: new ObjectSyncManager(this, ref),
          // stores the Firebase ref
          ref: ref,
          // synchronizes $scope variables with this object
          binding: new ThreeWayBinding(this),
          // stores observers registered with $watch
          listeners: []
        };

        // this bit of magic makes $$conf non-enumerable and non-configurable
        // and non-writable (its properties are still writable but the ref cannot be replaced)
        // we redundantly assign it above so the IDE can relax
        Object.defineProperty(this, '$$conf', {
          value: this.$$conf
        });

        this.$id = $firebaseUtils.getKey(ref.ref());
        this.$priority = null;

        $firebaseUtils.applyDefaults(this, this.$$defaults);

        // start synchronizing data with Firebase
        this.$$conf.sync.init();
      }

      FirebaseObject.prototype = {
        /**
         * Saves all data on the FirebaseObject back to Firebase.
         * @returns a promise which will resolve after the save is completed.
         */
        $save: function () {
          var self = this;
          var ref = self.$ref();
          var data = $firebaseUtils.toJSON(self);
          return $firebaseUtils.doSet(ref, data).then(function() {
            self.$$notify();
            return self.$ref();
          });
        },

        /**
         * Removes all keys from the FirebaseObject and also removes
         * the remote data from the server.
         *
         * @returns a promise which will resolve after the op completes
         */
        $remove: function() {
          var self = this;
          $firebaseUtils.trimKeys(self, {});
          self.$value = null;
          return $firebaseUtils.doRemove(self.$ref()).then(function() {
            self.$$notify();
            return self.$ref();
          });
        },

        /**
         * The loaded method is invoked after the initial batch of data arrives from the server.
         * When this resolves, all data which existed prior to calling $asObject() is now cached
         * locally in the object.
         *
         * As a shortcut is also possible to pass resolve/reject methods directly into this
         * method just as they would be passed to .then()
         *
         * @param {Function} resolve
         * @param {Function} reject
         * @returns a promise which resolves after initial data is downloaded from Firebase
         */
        $loaded: function(resolve, reject) {
          var promise = this.$$conf.sync.ready();
          if (arguments.length) {
            // allow this method to be called just like .then
            // by passing any arguments on to .then
            promise = promise.then.call(promise, resolve, reject);
          }
          return promise;
        },

        /**
         * @returns {Firebase} the original Firebase instance used to create this object.
         */
        $ref: function () {
          return this.$$conf.ref;
        },

        /**
         * Creates a 3-way data sync between this object, the Firebase server, and a
         * scope variable. This means that any changes made to the scope variable are
         * pushed to Firebase, and vice versa.
         *
         * If scope emits a $destroy event, the binding is automatically severed. Otherwise,
         * it is possible to unbind the scope variable by using the `unbind` function
         * passed into the resolve method.
         *
         * Can only be bound to one scope variable at a time. If a second is attempted,
         * the promise will be rejected with an error.
         *
         * @param {object} scope
         * @param {string} varName
         * @returns a promise which resolves to an unbind method after data is set in scope
         */
        $bindTo: function (scope, varName) {
          var self = this;
          return self.$loaded().then(function () {
            return self.$$conf.binding.bindTo(scope, varName);
          });
        },

        /**
         * Listeners passed into this method are notified whenever a new change is received
         * from the server. Each invocation is sent an object containing
         * <code>{ type: 'updated', key: 'my_firebase_id' }</code>
         *
         * This method returns an unbind function that can be used to detach the listener.
         *
         * @param {Function} cb
         * @param {Object} [context]
         * @returns {Function} invoke to stop observing events
         */
        $watch: function (cb, context) {
          var list = this.$$conf.listeners;
          list.push([cb, context]);
          // an off function for cancelling the listener
          return function () {
            var i = list.findIndex(function (parts) {
              return parts[0] === cb && parts[1] === context;
            });
            if (i > -1) {
              list.splice(i, 1);
            }
          };
        },

        /**
         * Informs $firebase to stop sending events and clears memory being used
         * by this object (delete's its local content).
         */
        $destroy: function(err) {
          var self = this;
          if (!self.$isDestroyed) {
            self.$isDestroyed = true;
            self.$$conf.sync.destroy(err);
            self.$$conf.binding.destroy();
            $firebaseUtils.each(self, function (v, k) {
              delete self[k];
            });
          }
        },

        /**
         * Called by $firebase whenever an item is changed at the server.
         * This method must exist on any objectFactory passed into $firebase.
         *
         * It should return true if any changes were made, otherwise `$$notify` will
         * not be invoked.
         *
         * @param {object} snap a Firebase snapshot
         * @return {boolean} true if any changes were made.
         */
        $$updated: function (snap) {
          // applies new data to this object
          var changed = $firebaseUtils.updateRec(this, snap);
          // applies any defaults set using $$defaults
          $firebaseUtils.applyDefaults(this, this.$$defaults);
          // returning true here causes $$notify to be triggered
          return changed;
        },

        /**
         * Called whenever a security error or other problem causes the listeners to become
         * invalid. This is generally an unrecoverable error.
         * @param {Object} err which will have a `code` property and possibly a `message`
         */
        $$error: function (err) {
          // prints an error to the console (via Angular's logger)
          $log.error(err);
          // frees memory and cancels any remaining listeners
          this.$destroy(err);
        },

        /**
         * Called internally by $bindTo when data is changed in $scope.
         * Should apply updates to this record but should not call
         * notify().
         */
        $$scopeUpdated: function(newData) {
          // we use a one-directional loop to avoid feedback with 3-way bindings
          // since set() is applied locally anyway, this is still performant
          var def = $firebaseUtils.defer();
          this.$ref().set($firebaseUtils.toJSON(newData), $firebaseUtils.makeNodeResolver(def));
          return def.promise;
        },

        /**
         * Updates any bound scope variables and
         * notifies listeners registered with $watch
         */
        $$notify: function() {
          var self = this, list = this.$$conf.listeners.slice();
          // be sure to do this after setting up data and init state
          angular.forEach(list, function (parts) {
            parts[0].call(parts[1], {event: 'value', key: self.$id});
          });
        },

        /**
         * Overrides how Angular.forEach iterates records on this object so that only
         * fields stored in Firebase are part of the iteration. To include meta fields like
         * $id and $priority in the iteration, utilize for(key in obj) instead.
         */
        forEach: function(iterator, context) {
          return $firebaseUtils.each(this, iterator, context);
        }
      };

      /**
       * This method allows FirebaseObject to be copied into a new factory. Methods passed into this
       * function will be added onto the object's prototype. They can override existing methods as
       * well.
       *
       * In addition to passing additional methods, it is also possible to pass in a class function.
       * The prototype on that class function will be preserved, and it will inherit from
       * FirebaseObject. It's also possible to do both, passing a class to inherit and additional
       * methods to add onto the prototype.
       *
       * Once a factory is obtained by this method, it can be passed into $firebase as the
       * `objectFactory` parameter:
       *
       * <pre><code>
       * var MyFactory = $firebaseObject.$extend({
       *    // add a method onto the prototype that prints a greeting
       *    getGreeting: function() {
       *       return 'Hello ' + this.first_name + ' ' + this.last_name + '!';
       *    }
       * });
       *
       * // use our new factory in place of $firebaseObject
       * var obj = $firebase(ref, {objectFactory: MyFactory}).$asObject();
       * </code></pre>
       *
       * @param {Function} [ChildClass] a child class which should inherit FirebaseObject
       * @param {Object} [methods] a list of functions to add onto the prototype
       * @returns {Function} a new factory suitable for use with $firebase
       */
      FirebaseObject.$extend = function(ChildClass, methods) {
        if( arguments.length === 1 && angular.isObject(ChildClass) ) {
          methods = ChildClass;
          ChildClass = function() { FirebaseObject.apply(this, arguments); };
        }
        return $firebaseUtils.inherit(ChildClass, FirebaseObject, methods);
      };

      /**
       * Creates a three-way data binding on a scope variable.
       *
       * @param {FirebaseObject} rec
       * @returns {*}
       * @constructor
       */
      function ThreeWayBinding(rec) {
        this.subs = [];
        this.scope = null;
        this.key = null;
        this.rec = rec;
      }

      ThreeWayBinding.prototype = {
        assertNotBound: function(varName) {
          if( this.scope ) {
            var msg = 'Cannot bind to ' + varName + ' because this instance is already bound to ' +
              this.key + '; one binding per instance ' +
              '(call unbind method or create another FirebaseObject instance)';
            $log.error(msg);
            return $firebaseUtils.reject(msg);
          }
        },

        bindTo: function(scope, varName) {
          function _bind(self) {
            var sending = false;
            var parsed = $parse(varName);
            var rec = self.rec;
            self.scope = scope;
            self.varName = varName;

            function equals(scopeValue) {
              return angular.equals(scopeValue, rec) &&
                scopeValue.$priority === rec.$priority &&
                scopeValue.$value === rec.$value;
            }

            function setScope(rec) {
              parsed.assign(scope, $firebaseUtils.scopeData(rec));
            }

            var send = $firebaseUtils.debounce(function(val) {
              var scopeData = $firebaseUtils.scopeData(val);
              rec.$$scopeUpdated(scopeData)
                ['finally'](function() {
                  sending = false;
                  if(!scopeData.hasOwnProperty('$value')){
                    delete rec.$value;
                    delete parsed(scope).$value;
                  }
                }
              );
            }, 50, 500);

            var scopeUpdated = function(newVal) {
              newVal = newVal[0];
              if( !equals(newVal) ) {
                sending = true;
                send(newVal);
              }
            };

            var recUpdated = function() {
              if( !sending && !equals(parsed(scope)) ) {
                setScope(rec);
              }
            };

            // $watch will not check any vars prefixed with $, so we
            // manually check $priority and $value using this method
            function watchExp(){
              var obj = parsed(scope);
              return [obj, obj.$priority, obj.$value];
            }

            setScope(rec);
            self.subs.push(scope.$on('$destroy', self.unbind.bind(self)));

            // monitor scope for any changes
            self.subs.push(scope.$watch(watchExp, scopeUpdated, true));

            // monitor the object for changes
            self.subs.push(rec.$watch(recUpdated));

            return self.unbind.bind(self);
          }

          return this.assertNotBound(varName) || _bind(this);
        },

        unbind: function() {
          if( this.scope ) {
            angular.forEach(this.subs, function(unbind) {
              unbind();
            });
            this.subs = [];
            this.scope = null;
            this.key = null;
          }
        },

        destroy: function() {
          this.unbind();
          this.rec = null;
        }
      };

      function ObjectSyncManager(firebaseObject, ref) {
        function destroy(err) {
          if( !sync.isDestroyed ) {
            sync.isDestroyed = true;
            ref.off('value', applyUpdate);
            firebaseObject = null;
            initComplete(err||'destroyed');
          }
        }

        function init() {
          ref.on('value', applyUpdate, error);
          ref.once('value', function(snap) {
            if (angular.isArray(snap.val())) {
              $log.warn('Storing data using array indices in Firebase can result in unexpected behavior. See https://www.firebase.com/docs/web/guide/understanding-data.html#section-arrays-in-firebase for more information. Also note that you probably wanted $firebaseArray and not $firebaseObject.');
            }

            initComplete(null);
          }, initComplete);
        }

        // call initComplete(); do not call this directly
        function _initComplete(err) {
          if( !isResolved ) {
            isResolved = true;
            if( err ) { def.reject(err); }
            else { def.resolve(firebaseObject); }
          }
        }

        var isResolved = false;
        var def = $firebaseUtils.defer();
        var batch = $firebaseUtils.batch();
        var applyUpdate = batch(function(snap) {
          var changed = firebaseObject.$$updated(snap);
          if( changed ) {
            // notifies $watch listeners and
            // updates $scope if bound to a variable
            firebaseObject.$$notify();
          }
        });
        var error = batch(firebaseObject.$$error, firebaseObject);
        var initComplete = batch(_initComplete);

        var sync = {
          isDestroyed: false,
          destroy: destroy,
          init: init,
          ready: function() { return def.promise; }
        };
        return sync;
      }

      return FirebaseObject;
    }
  ]);

  /** @deprecated */
  angular.module('firebase').factory('$FirebaseObject', ['$log', '$firebaseObject',
    function($log, $firebaseObject) {
      return function() {
        $log.warn('$FirebaseObject has been renamed. Use $firebaseObject instead.');
        return $firebaseObject.apply(null, arguments);
      };
    }
  ]);
})();

(function() {
  'use strict';

  angular.module("firebase")

    /** @deprecated */
    .factory("$firebase", function() {
      return function() {
        throw new Error('$firebase has been removed. You may instantiate $firebaseArray and $firebaseObject ' +
        'directly now. For simple write operations, just use the Firebase ref directly. ' +
        'See the AngularFire 1.0.0 changelog for details: https://www.firebase.com/docs/web/libraries/angular/changelog.html');
      };
    });

})();

'use strict';

// Shim Array.indexOf for IE compatibility.
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    if (this === undefined || this === null) {
      throw new TypeError("'this' is null or not defined");
    }
    // Hack to convert object.length to a UInt32
    // jshint -W016
    var length = this.length >>> 0;
    fromIndex = +fromIndex || 0;
    // jshint +W016

    if (Math.abs(fromIndex) === Infinity) {
      fromIndex = 0;
    }

    if (fromIndex < 0) {
      fromIndex += length;
      if (fromIndex < 0) {
        fromIndex = 0;
      }
    }

    for (;fromIndex < length; fromIndex++) {
      if (this[fromIndex] === searchElement) {
        return fromIndex;
      }
    }

    return -1;
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis
            ? this
            : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
      }
      return -1;
    }
  });
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (typeof Object.create != 'function') {
  (function () {
    var F = function () {};
    Object.create = function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (o === null) {
        throw new Error('Cannot set a null [[Prototype]]');
      }
      if (typeof o != 'object') {
        throw new TypeError('Argument must be an object');
      }
      F.prototype = o;
      return new F();
    };
  })();
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// http://ejohn.org/blog/objectgetprototypeof/
if ( typeof Object.getPrototypeOf !== "function" ) {
  if ( typeof "test".__proto__ === "object" ) {
    Object.getPrototypeOf = function(object){
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf = function(object){
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }
}

(function() {
  'use strict';

  angular.module('firebase')
    .factory('$firebaseConfig', ["$firebaseArray", "$firebaseObject", "$injector",
      function($firebaseArray, $firebaseObject, $injector) {
        return function(configOpts) {
          // make a copy we can modify
          var opts = angular.extend({}, configOpts);
          // look up factories if passed as string names
          if( typeof opts.objectFactory === 'string' ) {
            opts.objectFactory = $injector.get(opts.objectFactory);
          }
          if( typeof opts.arrayFactory === 'string' ) {
            opts.arrayFactory = $injector.get(opts.arrayFactory);
          }
          // extend defaults and return
          return angular.extend({
            arrayFactory: $firebaseArray,
            objectFactory: $firebaseObject
          }, opts);
        };
      }
    ])

    .factory('$firebaseUtils', ["$q", "$timeout", "firebaseBatchDelay",
      function($q, $timeout, firebaseBatchDelay) {

        // ES6 style promises polyfill for angular 1.2.x
        // Copied from angular 1.3.x implementation: https://github.com/angular/angular.js/blob/v1.3.5/src/ng/q.js#L539
        function Q(resolver) {
          if (!angular.isFunction(resolver)) {
            throw new Error('missing resolver function');
          }

          var deferred = $q.defer();

          function resolveFn(value) {
            deferred.resolve(value);
          }

          function rejectFn(reason) {
            deferred.reject(reason);
          }

          resolver(resolveFn, rejectFn);

          return deferred.promise;
        }

        var utils = {
          /**
           * Returns a function which, each time it is invoked, will pause for `wait`
           * milliseconds before invoking the original `fn` instance. If another
           * request is received in that time, it resets `wait` up until `maxWait` is
           * reached.
           *
           * Unlike a debounce function, once wait is received, all items that have been
           * queued will be invoked (not just once per execution). It is acceptable to use 0,
           * which means to batch all synchronously queued items.
           *
           * The batch function actually returns a wrap function that should be called on each
           * method that is to be batched.
           *
           * <pre><code>
           *   var total = 0;
           *   var batchWrapper = batch(10, 100);
           *   var fn1 = batchWrapper(function(x) { return total += x; });
           *   var fn2 = batchWrapper(function() { console.log(total); });
           *   fn1(10);
           *   fn2();
           *   fn1(10);
           *   fn2();
           *   console.log(total); // 0 (nothing invoked yet)
           *   // after 10ms will log "10" and then "20"
           * </code></pre>
           *
           * @param {int} wait number of milliseconds to pause before sending out after each invocation
           * @param {int} maxWait max milliseconds to wait before sending out, defaults to wait * 10 or 100
           * @returns {Function}
           */
          batch: function(wait, maxWait) {
            wait = typeof('wait') === 'number'? wait : firebaseBatchDelay;
            if( !maxWait ) { maxWait = wait*10 || 100; }
            var queue = [];
            var start;
            var cancelTimer;
            var runScheduledForNextTick;

            // returns `fn` wrapped in a function that queues up each call event to be
            // invoked later inside fo runNow()
            function createBatchFn(fn, context) {
               if( typeof(fn) !== 'function' ) {
                 throw new Error('Must provide a function to be batched. Got '+fn);
               }
               return function() {
                 var args = Array.prototype.slice.call(arguments, 0);
                 queue.push([fn, context, args]);
                 resetTimer();
               };
            }

            // clears the current wait timer and creates a new one
            // however, if maxWait is exceeded, calls runNow() on the next tick.
            function resetTimer() {
              if( cancelTimer ) {
                cancelTimer();
                cancelTimer = null;
              }
              if( start && Date.now() - start > maxWait ) {
                if(!runScheduledForNextTick){
                  runScheduledForNextTick = true;
                  utils.compile(runNow);
                }
              }
              else {
                if( !start ) { start = Date.now(); }
                cancelTimer = utils.wait(runNow, wait);
              }
            }

            // Clears the queue and invokes all of the functions awaiting notification
            function runNow() {
              cancelTimer = null;
              start = null;
              runScheduledForNextTick = false;
              var copyList = queue.slice(0);
              queue = [];
              angular.forEach(copyList, function(parts) {
                parts[0].apply(parts[1], parts[2]);
              });
            }

            return createBatchFn;
          },

          /**
           * A rudimentary debounce method
           * @param {function} fn the function to debounce
           * @param {object} [ctx] the `this` context to set in fn
           * @param {int} wait number of milliseconds to pause before sending out after each invocation
           * @param {int} [maxWait] max milliseconds to wait before sending out, defaults to wait * 10 or 100
           */
          debounce: function(fn, ctx, wait, maxWait) {
            var start, cancelTimer, args, runScheduledForNextTick;
            if( typeof(ctx) === 'number' ) {
              maxWait = wait;
              wait = ctx;
              ctx = null;
            }

            if( typeof wait !== 'number' ) {
              throw new Error('Must provide a valid integer for wait. Try 0 for a default');
            }
            if( typeof(fn) !== 'function' ) {
              throw new Error('Must provide a valid function to debounce');
            }
            if( !maxWait ) { maxWait = wait*10 || 100; }

            // clears the current wait timer and creates a new one
            // however, if maxWait is exceeded, calls runNow() on the next tick.
            function resetTimer() {
              if( cancelTimer ) {
                cancelTimer();
                cancelTimer = null;
              }
              if( start && Date.now() - start > maxWait ) {
                if(!runScheduledForNextTick){
                  runScheduledForNextTick = true;
                  utils.compile(runNow);
                }
              }
              else {
                if( !start ) { start = Date.now(); }
                cancelTimer = utils.wait(runNow, wait);
              }
            }

            // Clears the queue and invokes the debounced function with the most recent arguments
            function runNow() {
              cancelTimer = null;
              start = null;
              runScheduledForNextTick = false;
              fn.apply(ctx, args);
            }

            function debounced() {
              args = Array.prototype.slice.call(arguments, 0);
              resetTimer();
            }
            debounced.running = function() {
              return start > 0;
            };

            return debounced;
          },

          assertValidRef: function(ref, msg) {
            if( !angular.isObject(ref) ||
              typeof(ref.ref) !== 'function' ||
              typeof(ref.ref().transaction) !== 'function' ) {
              throw new Error(msg || 'Invalid Firebase reference');
            }
          },

          // http://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
          inherit: function(ChildClass, ParentClass, methods) {
            var childMethods = ChildClass.prototype;
            ChildClass.prototype = Object.create(ParentClass.prototype);
            ChildClass.prototype.constructor = ChildClass; // restoring proper constructor for child class
            angular.forEach(Object.keys(childMethods), function(k) {
              ChildClass.prototype[k] = childMethods[k];
            });
            if( angular.isObject(methods) ) {
              angular.extend(ChildClass.prototype, methods);
            }
            return ChildClass;
          },

          getPrototypeMethods: function(inst, iterator, context) {
            var methods = {};
            var objProto = Object.getPrototypeOf({});
            var proto = angular.isFunction(inst) && angular.isObject(inst.prototype)?
              inst.prototype : Object.getPrototypeOf(inst);
            while(proto && proto !== objProto) {
              for (var key in proto) {
                // we only invoke each key once; if a super is overridden it's skipped here
                if (proto.hasOwnProperty(key) && !methods.hasOwnProperty(key)) {
                  methods[key] = true;
                  iterator.call(context, proto[key], key, proto);
                }
              }
              proto = Object.getPrototypeOf(proto);
            }
          },

          getPublicMethods: function(inst, iterator, context) {
            utils.getPrototypeMethods(inst, function(m, k) {
              if( typeof(m) === 'function' && k.charAt(0) !== '_' ) {
                iterator.call(context, m, k);
              }
            });
          },

          defer: $q.defer,

          reject: $q.reject,

          resolve: $q.when,

          //TODO: Remove false branch and use only angular implementation when we drop angular 1.2.x support.
          promise: angular.isFunction($q) ? $q : Q,

          makeNodeResolver:function(deferred){
            return function(err,result){
              if(err === null){
                if(arguments.length > 2){
                  result = Array.prototype.slice.call(arguments,1);
                }
                deferred.resolve(result);
              }
              else {
                deferred.reject(err);
              }
            };
          },

          wait: function(fn, wait) {
            var to = $timeout(fn, wait||0);
            return function() {
              if( to ) {
                $timeout.cancel(to);
                to = null;
              }
            };
          },

          compile: function(fn) {
            return $timeout(fn||function() {});
          },

          deepCopy: function(obj) {
            if( !angular.isObject(obj) ) { return obj; }
            var newCopy = angular.isArray(obj) ? obj.slice() : angular.extend({}, obj);
            for (var key in newCopy) {
              if (newCopy.hasOwnProperty(key)) {
                if (angular.isObject(newCopy[key])) {
                  newCopy[key] = utils.deepCopy(newCopy[key]);
                }
              }
            }
            return newCopy;
          },

          trimKeys: function(dest, source) {
            utils.each(dest, function(v,k) {
              if( !source.hasOwnProperty(k) ) {
                delete dest[k];
              }
            });
          },

          scopeData: function(dataOrRec) {
            var data = {
              $id: dataOrRec.$id,
              $priority: dataOrRec.$priority
            };
            var hasPublicProp = false;
            utils.each(dataOrRec, function(v,k) {
              hasPublicProp = true;
              data[k] = utils.deepCopy(v);
            });
            if(!hasPublicProp && dataOrRec.hasOwnProperty('$value')){
              data.$value = dataOrRec.$value;
            }
            return data;
          },

          updateRec: function(rec, snap) {
            var data = snap.val();
            var oldData = angular.extend({}, rec);

            // deal with primitives
            if( !angular.isObject(data) ) {
              rec.$value = data;
              data = {};
            }
            else {
              delete rec.$value;
            }

            // apply changes: remove old keys, insert new data, set priority
            utils.trimKeys(rec, data);
            angular.extend(rec, data);
            rec.$priority = snap.getPriority();

            return !angular.equals(oldData, rec) ||
              oldData.$value !== rec.$value ||
              oldData.$priority !== rec.$priority;
          },

          applyDefaults: function(rec, defaults) {
            if( angular.isObject(defaults) ) {
              angular.forEach(defaults, function(v,k) {
                if( !rec.hasOwnProperty(k) ) {
                  rec[k] = v;
                }
              });
            }
            return rec;
          },

          dataKeys: function(obj) {
            var out = [];
            utils.each(obj, function(v,k) {
              out.push(k);
            });
            return out;
          },

          each: function(obj, iterator, context) {
            if(angular.isObject(obj)) {
              for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                  var c = k.charAt(0);
                  if( c !== '_' && c !== '$' && c !== '.' ) {
                    iterator.call(context, obj[k], k, obj);
                  }
                }
              }
            }
            else if(angular.isArray(obj)) {
              for(var i = 0, len = obj.length; i < len; i++) {
                iterator.call(context, obj[i], i, obj);
              }
            }
            return obj;
          },

          /**
           * A utility for retrieving a Firebase reference or DataSnapshot's
           * key name. This is backwards-compatible with `name()` from Firebase
           * 1.x.x and `key()` from Firebase 2.0.0+. Once support for Firebase
           * 1.x.x is dropped in AngularFire, this helper can be removed.
           */
          getKey: function(refOrSnapshot) {
            return (typeof refOrSnapshot.key === 'function') ? refOrSnapshot.key() : refOrSnapshot.name();
          },

          /**
           * A utility for converting records to JSON objects
           * which we can save into Firebase. It asserts valid
           * keys and strips off any items prefixed with $.
           *
           * If the rec passed into this method has a toJSON()
           * method, that will be used in place of the custom
           * functionality here.
           *
           * @param rec
           * @returns {*}
           */
          toJSON: function(rec) {
            var dat;
            if( !angular.isObject(rec) ) {
              rec = {$value: rec};
            }
            if (angular.isFunction(rec.toJSON)) {
              dat = rec.toJSON();
            }
            else {
              dat = {};
              utils.each(rec, function (v, k) {
                dat[k] = stripDollarPrefixedKeys(v);
              });
            }
            if( angular.isDefined(rec.$value) && Object.keys(dat).length === 0 && rec.$value !== null ) {
              dat['.value'] = rec.$value;
            }
            if( angular.isDefined(rec.$priority) && Object.keys(dat).length > 0 && rec.$priority !== null ) {
              dat['.priority'] = rec.$priority;
            }
            angular.forEach(dat, function(v,k) {
              if (k.match(/[.$\[\]#\/]/) && k !== '.value' && k !== '.priority' ) {
                throw new Error('Invalid key ' + k + ' (cannot contain .$[]#)');
              }
              else if( angular.isUndefined(v) ) {
                throw new Error('Key '+k+' was undefined. Cannot pass undefined in JSON. Use null instead.');
              }
            });
            return dat;
          },

          doSet: function(ref, data) {
            var def = utils.defer();
            if( angular.isFunction(ref.set) || !angular.isObject(data) ) {
              // this is not a query, just do a flat set
              ref.set(data, utils.makeNodeResolver(def));
            }
            else {
              var dataCopy = angular.extend({}, data);
              // this is a query, so we will replace all the elements
              // of this query with the value provided, but not blow away
              // the entire Firebase path
              ref.once('value', function(snap) {
                snap.forEach(function(ss) {
                  if( !dataCopy.hasOwnProperty(utils.getKey(ss)) ) {
                    dataCopy[utils.getKey(ss)] = null;
                  }
                });
                ref.ref().update(dataCopy, utils.makeNodeResolver(def));
              }, function(err) {
                def.reject(err);
              });
            }
            return def.promise;
          },

          doRemove: function(ref) {
            var def = utils.defer();
            if( angular.isFunction(ref.remove) ) {
              // ref is not a query, just do a flat remove
              ref.remove(utils.makeNodeResolver(def));
            }
            else {
              // ref is a query so let's only remove the
              // items in the query and not the entire path
              ref.once('value', function(snap) {
                var promises = [];
                snap.forEach(function(ss) {
                  var d = utils.defer();
                  promises.push(d.promise);
                  ss.ref().remove(utils.makeNodeResolver(def));
                });
                utils.allPromises(promises)
                  .then(function() {
                    def.resolve(ref);
                  },
                  function(err){
                    def.reject(err);
                  }
                );
              }, function(err) {
                def.reject(err);
              });
            }
            return def.promise;
          },

          /**
           * AngularFire version number.
           */
          VERSION: '1.0.0',

          batchDelay: firebaseBatchDelay,
          allPromises: $q.all.bind($q)
        };

        return utils;
      }
    ]);

    function stripDollarPrefixedKeys(data) {
      if( !angular.isObject(data) ) { return data; }
      var out = angular.isArray(data)? [] : {};
      angular.forEach(data, function(v,k) {
        if(typeof k !== 'string' || k.charAt(0) !== '$') {
          out[k] = stripDollarPrefixedKeys(v);
        }
      });
      return out;
    }
})();
