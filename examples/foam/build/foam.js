
/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if ( navigator && navigator.userAgent.indexOf('Firefox') != -1 ) {
  console.log('Loading Firefox Support.');

  Object.defineProperties(MouseEvent.prototype, {
    offsetX: {
      get: function() {
        return this.clientX - this.target.getBoundingClientRect().left;
      }
    },
    offsetY: {
      get: function() {
        return this.clientY - this.target.getBoundingClientRect().top;
      }
    }
  });
}

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if ( ! Number.name ) {
  console.log('Polyfilling Function.prototype.name');

  Object.defineProperty(Function.prototype, 'name', {
    get: function() {
      var text = this.toString();
      return text.substring(text.indexOf('function') + 9, text.indexOf('(')).trim();
    },
    configurable: true,
    enumerable: true
  });
}

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (navigator && navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
  console.log('Loading Safari Support.');

  (function(){
    // prepare base perf object
    if (typeof window.performance === 'undefined') {
        window.performance = {};
    }

    if (!window.performance.now){

      var nowOffset = Date.now();

      if (performance.timing && performance.timing.navigationStart){
        nowOffset = performance.timing.navigationStart
      }

      window.performance.now = function now(){
        return Date.now() - nowOffset;
      }
    }
  })();

  // Number.isFinite polyfill
  // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isfinite
  if (typeof Number.isFinite !== 'function') {
    Number.isFinite = function isFinite(value) {
      // 1. If Type(number) is not Number, return false.
      if (typeof value !== 'number') {
        return false;
      }
      // 2. If number is NaN, +∞, or −∞, return false.
      if (value !== value || value === Infinity || value === -Infinity) {
        return false;
      }
      // 3. Otherwise, return true.
      return true;
    };
  }

  if ( typeof Number.isNaN !== 'function' ) {
    Number.isNaN = function(value) {
      return typeof value === "number" && value !== value;
    };
  }
}


/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var LANGUAGE = "en";

if ( navigator && navigator.language ) LANGUAGE = navigator.language;

(function() {
  var m = /[?&]hl=([^&]*)/.exec(window.location.search);
  if ( m ) { 
    LANGUAGE = m[1];
  }

  var a = LANGUAGE.split('-');
  LANGUAGE = [];
  var ls = [];
  for ( var i = a.length-1 ; i >= 0 ; i-- ) {
    LANGUAGE.push(a.slice(0, i+1).join('-'));
  }
  if ( LANGUAGE[LANGUAGE.length-1] !== 'en' )
    LANGUAGE.push('en');
})();

/*
console.log('Navigator.language: ', navigator.language);
console.log('Location: ', window.location.search);
console.log('LANGUAGE: ', LANGUAGE);
*/

function lm(m) {
  for ( var i = 0 ; i < LANGUAGE.length ; i++ )
    if ( m.hasOwnProperty(LANGUAGE[i]) )
      return m[LANGUAGE[i]];

  console.log('No language match for: ', m);
}

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DEBUG  = DEBUG  || false;
var GLOBAL = GLOBAL || this;

Object.defineProperty_ = Object.defineProperty;
Object.defineProperty = function() {
  this.defineProperty_.apply(this, arguments);
};

function MODEL(model) {
  var proto;

  function defineProperty(proto, key, map) {
    if ( ! map.value || proto === Object.prototype || proto === Array.prototype )
      Object.defineProperty_.apply(this, arguments);
    else
      proto[key] = map.value;
  }

  if ( model.name ) {
    if ( ! GLOBAL[model.name] ) {
      if ( model.extendsModel ) {
        GLOBAL[model.name] = { __proto__: GLOBAL[model.extendsModel] };
      } else {
        GLOBAL[model.name] = {};
      }
    }
    proto = GLOBAL[model.name];
  } else {
    proto = model.extendsProto ? GLOBAL[model.extendsProto].prototype :
                                 GLOBAL[model.extendsObject] ;
  }

  if ( model.properties ) for ( var i = 0 ; i < model.properties.length ; i++ ) {
    var p = model.properties[i];
    defineProperty(
      proto,
      p.name,
      { get: p.getter, enumerable: false });
  }

  for ( key in model.constants )
    defineProperty(
      proto,
      key,
      { value: model.constants[key], writable: true, enumerable: false });

  if ( Array.isArray(model.methods) ) {
    for ( var i = 0 ; i < model.methods.length ; i++ ) {
      var m = model.methods[i];
      defineProperty(
        proto,
        m.name,
        { value: m, writable: true, enumerable: false });
    }
  } else {
    for ( var key in model.methods )
      defineProperty(
        proto,
        key,
        { value: model.methods[key], writable: true, enumerable: false });
  }
}

var MODEL0 = MODEL;

MODEL({
  extendsObject: 'GLOBAL',

  methods: [
    function memoize(f) {
      var cache = {};
      var g = function() {
        var key = argsToArray(arguments).toString();
        if ( ! cache.hasOwnProperty(key) ) cache[key] = f.apply(this, arguments);
        return cache[key];
      };
      g.name = f.name;
      return g;
    },

    function memoize1(f) {
      /** Faster version of memoize() when only dealing with one argument. **/
      var cache = {};
      var g = function(arg) {
        var key = arg ? arg.toString() : '';
        if ( ! cache.hasOwnProperty(key) ) cache[key] = f.call(this, arg);
        return cache[key];
      };
      g.name = f.name;
      return g;
    },

    function constantFn(v) {
      /* Create a function which always returns the supplied constant value. */
      return function() { return v; };
    },

    function latchFn(f) {
      var tripped = false;
      var val;
      /* Create a function which always returns the supplied constant value. */
      return function() {
        if ( ! tripped ) {
          tripped = true;
          val = f();
          f = undefined;
        }
        return val;
      };
    },

    function argsToArray(args) {
      var array = new Array(args.length);
      for ( var i = 0; i < args.length; i++ ) array[i] = args[i];
      return array;
    },

    function StringComparator(s1, s2) {
      if ( s1 == s2 ) return 0;
      return s1 < s2 ? -1 : 1;
    },

    function equals(a, b) {
      if ( a === b ) return true;
      if ( ! a || ! b ) return false;
      if ( a.equals ) return a.equals(b);
      return a == b;
    },

    function toCompare(c) {
      if ( Array.isArray(c) ) return CompoundComparator.apply(null, c);

      return c.compare ? c.compare.bind(c) : c;
    },

    function CompoundComparator() {
      var args = argsToArray(arguments);
      var cs = [];

      // Convert objects with .compare() methods to compare functions.
      for ( var i = 0 ; i < args.length ; i++ )
        cs[i] = toCompare(args[i]);

      var f = function(o1, o2) {
        for ( var i = 0 ; i < cs.length ; i++ ) {
          var r = cs[i](o1, o2);
          if ( r != 0 ) return r;
        }
        return 0;
      };

      f.toSQL = function() { return args.map(function(s) { return s.toSQL(); }).join(','); };
      f.toMQL = function() { return args.map(function(s) { return s.toMQL(); }).join(' '); };
      f.toBQL = function() { return args.map(function(s) { return s.toBQL(); }).join(' '); };
      f.toString = f.toSQL;

      return f;
    },

    function randomAct() {
      /**
       * Take an array where even values are weights and odd values are functions,
       * and execute one of the functions with propability equal to it's relative
       * weight.
       */
      // TODO: move this method somewhere better
      var totalWeight = 0.0;
      for ( var i = 0 ; i < arguments.length ; i += 2 ) totalWeight += arguments[i];

      var r = Math.random();

      for ( var i = 0, weight = 0 ; i < arguments.length ; i += 2 ) {
        weight += arguments[i];
        if ( r <= weight / totalWeight ) {
          arguments[i+1]();
          return;
        }
      }
    },

    // Workaround for crbug.com/258552
    function Object_forEach(obj, fn) {
      for ( var key in obj ) if ( obj.hasOwnProperty(key) ) fn(obj[key], key);
    },

    function predicatedSink(predicate, sink) {
      if ( predicate === TRUE || ! sink ) return sink;

      return {
        __proto__: sink,
        $UID: sink.$UID,
        put: function(obj, s, fc) {
          if ( sink.put && ( ! obj || predicate.f(obj) ) ) sink.put(obj, s, fc);
        },
        remove: function(obj, s, fc) {
          if ( sink.remove && ( ! obj || predicate.f(obj) ) ) sink.remove(obj, s, fc);
        },
        reset: function() {
          sink.reset();
        },
        toString: function() {
          return 'PredicatedSink(' +
            sink.$UID + ', ' + predicate + ', ' + sink + ')';
        }
      };
    },

    function limitedSink(count, sink) {
      var i = 0;
      return {
        __proto__: sink,
        $UID: sink.$UID,
        put: function(obj, s, fc) {
          if ( i++ >= count && fc ) {
            fc.stop();
          } else {
            sink.put(obj, s, fc);
          }
        }/*,
           eof: function() {
           sink.eof && sink.eof();
           }*/
      };
    },

    function skipSink(skip, sink) {
      var i = 0;
      return {
        __proto__: sink,
        $UID: sink.$UID,
        put: function(obj, s, fc) {
          if ( i++ >= skip ) sink.put(obj, s, fc);
        }
      };
    },

    function orderedSink(comparator, sink) {
      comparator = toCompare(comparator);
      return {
        __proto__: sink,
        $UID: sink.$UID,
        i: 0,
        arr: [],
        put: function(obj, s, fc) {
          this.arr.push(obj);
        },
        eof: function() {
          this.arr.sort(comparator);
          this.arr.select(sink);
        }
      };
    },

    function defineLazyProperty(target, name, definitionFn) {
      Object.defineProperty(target, name, {
        get: function() {
          var definition = definitionFn.call(this);
          Object.defineProperty(this, name, definition);
          return definition.get ?
            definition.get.call(this) :
            definition.value;
        },
        configurable: true
      });
    },

    // Function for returning multi-line strings from commented functions.
    // Ex. var str = multiline(function() { /* multi-line string here */ });
    function multiline(f) {
      var s = f.toString();
      var start = s.indexOf('/*');
      var end   = s.lastIndexOf('*/');
      return s.substring(start+2, end);
    },

    // Computes the XY coordinates of the given node
    // relative to the containing elements.
    // TODO: findViewportXY works better... but do we need to find parent?
    function findPageXY(node) {
      var x = 0;
      var y = 0;
      var parent;

      while ( node ) {
        parent = node;
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
      }

      return [x, y, parent];
    },

    // Computes the XY coordinates of the given node
    // relative to the viewport.
    function findViewportXY(node) {
      var rect = node.getBoundingClientRect();
      return [rect.left, rect.top];
    },

    function nop() { /** NOP function. **/ },

    function stringtoutf8(str) {
      var res = [];
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);

        var count = 0;
        if ( code < 0x80 ) {
          res.push(code);
          continue;
        }

        // while(code > (0x40 >> count)) {
        //     res.push(code & 0x3f);
        //     count++;
        //     code = code >> 7;
        // }
        // var header = 0x80 >> count;
        // res.push(code | header)
      }
      return res;
    },

    function createGUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
  ]
});

var labelize = memoize1(function(str) {
  return capitalize(str.replace(/[a-z][A-Z]/g, function (a) { return a.charAt(0) + ' ' + a.charAt(1); }));
});

var constantize = memoize1(function(str) {
  // switchFromCamelCaseToConstantFormat to SWITCH_FROM_CAMEL_CASE_TO_CONSTANT_FORMAT
  // TODO: add property to specify constantization. For now catch special case to avoid conflict with context this.X and this.Y.
  if ( str === 'x' ) return 'X_';
  if ( str === 'y' ) return 'Y_';
  return str.replace(/[a-z_][^0-9a-z_]/g, function(a) {
    return a.substring(0,1) + '_' + a.substring(1,2);
  }).toUpperCase();
});

var capitalize = memoize1(function(str) {
  // switchFromProperyName to //SwitchFromPropertyName
  return str[0].toUpperCase() + str.substring(1);
});


MODEL({
  extendsProto: 'Object',

  properties: [
    {
      name: '$UID',
      getter: (function() {
        var id = 1;
        return function() {
          if ( Object.hasOwnProperty.call(this, '$UID__') ) return this.$UID__;
          this.$UID__ = id;
          id++;
          return this.$UID__;
        };
      })()
    }
  ],

  methods: [
    function become(other) {
      var local = Object.getOwnPropertyNames(this);
      for ( var i = 0; i < local.length; i++ ) {
        delete this[local[i]];
      }

      var remote = Object.getOwnPropertyNames(other);
      for ( i = 0; i < remote.length; i++ ) {
        Object.defineProperty(
          this,
          remote[i],
          Object.getOwnPropertyDescriptor(other, remote[i]));
      }
      this.__proto__ = other.__proto__;
    }
  ]
});


MODEL({
  extendsProto: 'Array',

  constants: {
    oldForEach_: Array.prototype.forEach
  },

  methods: [
    function clone() { return this.slice(); },

    function deepClone() {
      var a = this.clone();
      for ( var i = 0 ; i < a.length ; i++ ) {
        var o = a[i];
        if ( o && o.deepClone ) a[i] = o.deepClone();
      }
      return a;
    },

    function forEach(f, opt_this) {
      /* Replace Array.forEach with a faster version. */
      if ( ! this || ! f || opt_this ) return this.oldForEach_.call(this, f, opt_this);

      var l = this.length;
      for ( var i = 0 ; i < l ; i++ ) f(this[i], i, this);
    },

    function diff(other) {
      var added = other.slice(0);
      var removed = [];
      for ( var i = 0 ; i < this.length ; i++ ) {
        for ( var j = 0 ; j < added.length ; j++ ) {
          if ( this[i].compareTo(added[j]) == 0 ) {
            added.splice(j, 1);
            j--;
            break;
          }
        }
        if ( j == added.length ) removed.push(this[i]);
      }
      return { added: added, removed: removed };
    },

    function binaryInsert(item) {
      /* binaryInsert into a sorted array, removing duplicates */
      var start = 0;
      var end = this.length-1;

      while ( end >= start ) {
        var m = start + Math.floor((end-start) / 2);
        var c = item.compareTo(this[m]);
        if ( c == 0 ) return this; // already there, nothing to do
        if ( c < 0 ) { end = m-1; } else { start = m+1; }
      }

      this.splice(start, 0, item);

      return this;
    },

    function union(other) {
      return this.concat(
        other.filter(function(o) { return this.indexOf(o) == -1; }.bind(this)));
    },

    function intersection(other) {
      return this.filter(function(o) { return other.indexOf(o) != -1; });
    },

    function intern() {
      for ( var i = 0 ; i < this.length ; i++ )
        if ( this[i].intern ) this[i] = this[i].intern();

      return this;
    },

    function compareTo(other) {
      if ( this.length !== other.length ) return -1;

      for ( var i = 0 ; i < this.length ; i++ ) {
        var result = this[i].compareTo(other[i]);
        if ( result !== 0 ) return result;
      }
      return 0;
    },

    function fReduce(comparator, arr) {
      compare = toCompare(comparator);
      var result = [];

      var i = 0;
      var j = 0;
      var k = 0;
      while ( i < this.length && j < arr.length ) {
        var a = compare(this[i], arr[j]);
        if ( a < 0 ) {
          result[k++] = this[i++];
          continue;
        }
        if ( a == 0) {
          result[k++] = this[i++];
          result[k++] = arr[j++];
          continue;
        }
        result[k++] = arr[j++];
      }

      if ( i != this.length ) result = result.concat(this.slice(i));
      if ( j != arr.length ) result = result.concat(arr.slice(j));

      return result;
    },

    function pushAll(arr) {
      /**
       * Push an array of values onto an array.
       * @param arr array of values
       * @return new length of this array
       */
      // TODO: not needed, port and replace with pipe()
      this.push.apply(this, arr);
      return this.length;
    },

    function mapFind(map) {
      /**
       * Search for a single element in an array.
       * @param predicate used to determine element to find
       */
      for ( var i = 0 ;  i < this.length ; i++ ) {
        var result = map(this[i], i);
        if ( result ) return result;
      }
    },

    function mapProp(prop) {
      // Called like myArray.mapProp('name'), that's equivalent to:
      // myArray.map(function(x) { return x.name; });
      return this.map(function(x) { return x[prop]; });
    },

    function mapCall() {
      var args = Array.prototype.slice.call(arguments, 0);
      var func = args.shift();
      return this.map(function(x) { return x[func] && x[func].apply(x[func], args); });
    }
  ],

  properties: [
    {
      name: 'memento',
      getter: function() {
        throw "Array's can not be memorized properly as a memento.";
      }
    }
  ]
});


MODEL({
  extendsProto: 'String',

  methods: [
    function indexOfIC(a) {
      return ( a.length > this.length ) ? -1 : this.toUpperCase().indexOf(a.toUpperCase());
    },

    function equals(other) { return this.compareTo(other) === 0; },

    function equalsIC(other) { return other && this.toUpperCase() === other.toUpperCase(); },

    // deprecated, use global instead
    function capitalize() { return this.charAt(0).toUpperCase() + this.slice(1); },

    // deprecated, use global instead
    function labelize() {
      return this.replace(/[a-z][A-Z]/g, function (a) { return a.charAt(0) + ' ' + a.charAt(1); }).capitalize();
    },

    function compareTo(o) { return ( o == this ) ? 0 : this < o ? -1 : 1; },

    // Polyfil
    String.prototype.startsWith || function startsWith(a) {
      // This implementation is very slow for some reason
      return 0 == this.lastIndexOf(a, 0);
    },

    function startsWithIC(a) {
      if ( a.length > this.length ) return false;
      var l = a.length;
      for ( var i = 0 ; i < l; i++ ) {
        if ( this[i].toUpperCase() !== a[i].toUpperCase() ) return false;
      }
      return true;
    },

    function put(obj) { return this + obj.toJSON(); },

    (function() {
      var map = {};

      return function intern() {
        /** Convert a string to an internal canonical copy. **/
        return map[this] || (map[this] = this.toString());
      };
    })(),

    function hashCode() {
      var hash = 0;
      if ( this.length == 0 ) return hash;

      for (i = 0; i < this.length; i++) {
        var code = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + code;
        hash &= hash;
      }

      return hash;
    }
  ]
});


MODEL({
  extendsProto: 'Function',

  methods: [
    /**
     * Replace Function.bind with a version
     * which is ~10X faster for the common case
     * where you're only binding 'this'.
     **/
    (function() {
      var oldBind    = Function.prototype.bind;
      var simpleBind = function(f, self) {
        return function() { return f.apply(self, arguments); };
        /*
        var ret = function() { return f.apply(self, arguments); };
        ret.toString = function bind() {
          return f.toString();
        };
        return ret;
        */
      };

      return function bind(arg) {
        return arguments.length == 1 ?
          simpleBind(this, arg) :
          oldBind.apply(this, argsToArray(arguments));
      };
    })(),

    function equals(o) { return this === o; },

    function compareTo(o) {
      return this === o ? 0 : ( this.name.compareTo(o.name) || 1 );
    },

    function o(f2) {
      var f1 = this;
      return function() {
        return f1.call(this, f2.apply(this, argsToArray(arguments)));
      };
    }
  ]
});


MODEL({
  extendsObject: 'Math',

  methods: [
    function sign(n) { return n > 0 ? 1 : -1; }
  ]
});


MODEL({
  extendsProto: 'Date',

  methods: [
    function toRelativeDateString(){
      var seconds = Math.floor((Date.now() - this.getTime())/1000);

      if ( seconds < 60 ) return 'moments ago';

      var minutes = Math.floor((seconds)/60);

      if ( minutes == 1 ) return '1 minute ago';

      if ( minutes < 60 ) return minutes + ' minutes ago';

      var hours = Math.floor(minutes/60);
      if ( hours == 1 ) return '1 hour ago';

      if ( hours < 24 ) return hours + ' hours ago';

      var days = Math.floor(hours / 24);
      if ( days == 1 ) return '1 day ago';

      if ( days < 7 ) return days + ' days ago';

      if ( days < 365 ) {
        var year = 1900+this.getYear();
        var noyear = this.toDateString().replace(' ' + year, '');
        return noyear.substring(4);
      }

      return this.toDateString().substring(4);
    },

    function equals(o) {
      if ( ! o ) return false;
      if ( ! o.getTime ) return false;
      return this.getTime() === o.getTime();
    },

    function compareTo(o){
      if ( o === this ) return 0;
      if ( ! o ) return 1;
      var d = this.getTime() - o.getTime();
      return d == 0 ? 0 : d > 0 ? 1 : -1;
    },

    function toMQL() {
      return this.getFullYear() + '/' + (this.getMonth() + 1) + '/' + this.getDate();
    },

    function toBQL() {
      var str = this.toISOString(); // eg. 2014-12-04T16:37:33.420Z
      return str.substring(0, str.indexOf('.')); // eg. 2014-12-04T16:37:33
    }
  ]
});


MODEL({
  extendsProto: 'Number',

  methods: [
    function compareTo(o) { return ( o == this ) ? 0 : this < o ? -1 : 1; },
  ]
});


MODEL({
  extendsProto: 'Boolean',

  methods: [
    function compareTo(o) { return (this.valueOf() ? 1 : 0) - (o ? 1 : 0); }
  ]
});


MODEL({
  extendsProto: 'RegExp',

  methods: [
    function quote(str) {
      return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }
  ]
});


console.log.json = function() {
   var args = [];
   for ( var i = 0 ; i < arguments.length ; i++ ) {
     var arg = arguments[i];
     args.push(arg && arg.toJSON ? arg.toJSON() : arg);
   }
   console.log.apply(console, args);
};

console.log.str = function() {
   var args = [];
   for ( var i = 0 ; i < arguments.length ; i++ ) {
     var arg = arguments[i];
     args.push(arg && arg.toString ? arg.toString() : arg);
   }
   console.log.apply(console, args);
};

// Promote 'console.log' into a Sink
console.log.put          = console.log.bind(console);
console.log.remove       = console.log.bind(console, 'remove: ');
console.log.error        = console.log.bind(console, 'error: ');
console.log.json.put     = console.log.json.bind(console);
console.log.json.reduceI = console.log.json.bind(console, 'reduceI: ');
console.log.json.remove  = console.log.json.bind(console, 'remove: ');
console.log.json.error   = console.log.json.bind(console, 'error: ');
console.log.str.put      = console.log.str.bind(console);
console.log.str.remove   = console.log.str.bind(console, 'remove: ');
console.log.str.error    = console.log.str.bind(console, 'error: ');

document.put = function(obj) {
  if ( obj.write ) {
    obj.write(this);
  } else {
    this.write(obj.toString());
  }
};


// Promote webkit apis; fallback on Node.js alternatives
// TODO(kgr): this should be somewhere web specific

window.requestFileSystem     = window.requestFileSystem ||
  window.webkitRequestFileSystem;
window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.setImmediate;
if ( window.Blob ) {
  Blob.prototype.slice = Blob.prototype.slice || Blob.prototype.webkitSlice;
}

if ( window.XMLHttpRequest ) {
  /**
   * Add an afunc send to XMLHttpRequest
   */
  XMLHttpRequest.prototype.asend = function(ret, opt_data) {
    var xhr = this;
    xhr.onerror = function() {
      console.log('XHR Error: ', arguments);
    };
    xhr.onloadend = function() {
      ret(xhr.response, xhr);
    };
    xhr.send(opt_data);
  };
}

String.fromCharCode = (function() {
  var oldLookup = String.fromCharCode;
  var lookupTable = [];
  return function(a) {
    if ( arguments.length == 1 ) return lookupTable[a] || (lookupTable[a] = oldLookup(a));
    var result = '';
    for ( var i = 0 ; i < arguments.length ; i++ )
      result += lookupTable[arguments[i]] || (lookupTable[arguments[i]] = oldLookup(arguments[i]));
    return result;
  };
})();

var MementoProto = {};
Object.defineProperty(MementoProto, 'equals', {
  enumerable: false,
  configurable: true,
  value: function(o) {
    var keys = Object.keys(this);
    var otherKeys = Object.keys(o);
    if ( keys.length != otherKeys.length ) {
      return false;
    }
    for ( var i = 0 ; i < keys.length ; i++ ) {
      if ( ! equals(this[keys[i]], o[keys[i]]) )
        return false;
    }
    return true;
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// WeakMap Polyfill, doesn't implement the full interface, just the parts
// that FOAM uses.
// TODO: Use defineProperty to make hidden property
if ( ! window.WeakMap ) {
  function WeakMap() {
    var id = '__WEAK_MAP__' + this.$UID;

    function del(key) { delete key[id]; }
    function get(key) { return key[id]; }
    function set(key, value) { key[id] = value; }
    function has(key) { return !!key[id]; }

    return {
      __proto__: this,
      "delete": del,
      get: get,
      set: set,
      has: has
    };
  }
}

/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// TODO: time-travelling debugger, ala:
//    "Debugging Standard ML Without Reverse Engineering"

MODEL({
  extendsProto: 'Function',

  methods: [
    function abind(self) {
      /** Adapt a synchronous method into a psedo-afunc. **/
      return function(ret) { this.apply(self, arguments); ret(); }.bind(this);
    },

    function ao(f2) {
      /** Async Compose (like Function.prototype.O, but for async functions **/
      var f1 = this;
      return function(ret) {
        var args = argsToArray(arguments);
        args[0] = f1.bind(this, ret);
        f2.apply(this, args);
      }
    },

    function aseq(f2) { return f2.ao(this); }
  ]
});


MODEL({
  // TODO(kgr): put in a package rather than global, maybe foam.async

  extendsObject: 'GLOBAL',

  methods: [
    /** NOP afunc. **/
    function anop(ret) { ret && ret(undefined); },

    /** afunc log. **/
    function alog() {
      var args = arguments;
      return function (ret) {
        console.log.apply(console, args);
        ret && ret.apply(this, [].slice.call(arguments, 1));
      };
    },

    /** console.profile an afunc. **/
    function aprofile(afunc) {
      return function(ret) {
        var a = argsToArray(arguments);
        console.profile('aprofile');
        var ret2 = function () {
          console.profileEnd();
          ret && ret(arguments);
        };
        aapply_(afunc, ret2, a);
      };
    },

    /** Create an afunc which always returns the supplied constant value. **/
    function aconstant(v) { return function(ret) { ret && ret(v); }; },

    /** Execute the supplied afunc N times. **/
    function arepeat(n, afunc) {
      if ( ! n ) return anop;
      return function(ret) {
        var a = argsToArray(arguments);
        a.splice(1, 0, 0, n); // insert (0, n) after 'ret' argument
        var next = atramp(function() {
          if ( a[1] == n-1 ) { a[0] = ret; afunc.apply(this, a); return; };
          afunc.apply(this, a);
          a[1]++;
        });

        a[0] = next;
        next.apply(this, a);
      };
    },

    /** Execute the supplied afunc on each element of an array. */
    function aforEach(arr, afunc) {
      // TODO: implement
    },

    /** Execute the supplied afunc until cond() returns false. */
    function awhile(cond, afunc) {
      return function(ret) {
        var a = argsToArray(arguments);

        var g = function() {
          if ( ! cond() ) { ret.apply(undefined, arguments); return; }
          afunc.apply(this, a);
        };

        a[0] = g;
        g.apply(this, a);
      };
    },

    /** Execute the supplied afunc if cond. */
    function aif(cond, afunc, aelse) {
      return function(ret) {
        if ( typeof cond === 'function' ? cond() : cond ) {
          afunc.apply(this, arguments);
        } else {
          if ( aelse ) aelse.apply(this, arguments);
          else ret();
        }
      };
    },

    /** Execute afunc if the acond returns true */
    function aaif(acond, afunc, aelse) {
      return function(ret) {
        var args = argsToArray(arguments);
        args[0] = function(c) {
          args[0] = ret;
          if ( c ) afunc.apply(null, args);
          else if ( aelse ) aelse.apply(null, args);
          else ret();
        };
        acond.apply(null, args);
      }
    },

    /** Time an afunc. **/
    (function() {
      // Add a unique suffix to timer names in case multiple instances
      // of the same timing are active at once.
      var id = 1;
      var activeOps = {};
      return function atime(str, afunc, opt_endCallback, opt_startCallback) {
        var name = str;
        return aseq(
          function(ret) {
            if ( activeOps[str] ) {
              name += '-' + id++;
              activeOps[str]++;
            } else {
              activeOps[str] = 1;
            }
            var start = performance.now();
            if ( opt_startCallback ) opt_startCallback(name);
            if ( ! opt_endCallback ) console.time(name);
            ret.apply(null, [].slice.call(arguments, 1));
          },
          afunc,
          function(ret) {
            activeOps[str]--;
            if ( opt_endCallback ) {
              var end = performance.now();
              opt_endCallback(name, end - start);
            } else {
              console.timeEnd(name);
            }
            ret && ret.apply(null, [].slice.call(arguments, 1));
          }
        );
      };
    })(),

    /** Time an afunc and record its time as a metric. **/
    function ametric() {
      return this.atime.apply(this, arguments);
    },

    /** Sleep for the specified delay. **/
    function asleep(ms) {
      return function(ret) {
        window.setTimeout(ret, ms);
      };
    },

    function ayield() {
      return function(ret) {
        window.setTimeout(ret, 0);
      };
    },

    /** Create a future value. **/
    function afuture() {
      var set     = false;
      var values  = undefined;
      var waiters = [];

      return {
        set: function() {
          if ( set ) {
            console.log('ERROR: redundant set on future');
            return;
          }
          values = arguments;
          set = true;
          for (var i = 0 ; i < waiters.length; i++) {
            waiters[i].apply(null, values);
          }
          waiters = undefined;
          return this;
        },

        get: function(ret) {
          if ( set ) { ret.apply(null, values); return; }
          waiters.push(ret);
        }
      };
    },

    function aapply_(f, ret, args) {
      args.unshift(ret);
      f.apply(this, args);
    },

    /**
     * A request queue that reduces each request against the pending requests.
     * Also limits the queue to a maximum size and operates in a LIFO manner.
     * TODO: This could probably be split into decorators and integrated with asynchronized.
     */
    function arequestqueue(f, opt_lock, opt_max) {
      var lock = opt_lock || {};
      if ( ! lock.q ) { lock.q = []; lock.active = null; }

      var onExit = function() {
        var next = lock.active = lock.q.pop();

        if ( next ) {
          setTimeout(function() { f(onExit, next); }, 0);
        }
      };

      var reduceDown = function(o, q) {
        for ( var i = q.length -1 ; i >= 0 ; i-- ) {
          var result = o.reduce(q[i]);
          if ( result ) {
            q.splice(i, 1);
            reduceDown(result, q);
            break;
          }
        }
        q.push(o);
      }

      return function(o) {
        if ( lock.active ) {
          // If the next request reduces into the active one, then forget about it.
          var first = o.reduce(lock.active);
          if ( first && first.equals(lock.active) ) return;
        }

        reduceDown(o, lock.q, lock.q.length - 1);
        if ( lock.q.length > opt_max ) lock.q.length = opt_max;

        if ( ! lock.active ) onExit();
      };
    },

    /**
     * A Binary Semaphore which only allows the delegate function to be
     * executed by a single thread of execution at once.
     * Like Java's synchronized blocks.
     * @param opt_lock an empty map {} to be used as a lock
     *                 sharable across multiple asynchronized instances
     **/
    function asynchronized(f, opt_lock) {
      var lock = opt_lock || {};
      if ( ! lock.q ) { lock.q = []; lock.active = false; }

      // Decorate 'ret' to check for blocked continuations.
      function onExit(ret) {
        return function() {
          var next = lock.q.shift();

          if ( next ) {
            setTimeout(next, 0);
          } else {
            lock.active = false;
          }

          ret();
        };
      }

      return function(ret) {
        // Semaphore is in use, so just queue f for execution when the current
        // continuation exits.
        if ( lock.active ) {
          lock.q.push(function() { f(onExit(ret)); });
          return;
        }

        lock.active = true;

        f(onExit(ret));
      };
    },

    /**
     * Execute an optional timeout function and abort the continuation
     * of the delegate function, if it doesn't finish in the specified
     * time.
     **/
    // Could be generalized into an afirst() combinator which allows
    // for the execution of multiple streams but only the first to finish
    // gets to continue.
    function atimeout(delay, f, opt_timeoutF) {
      return function(ret) {
        var timedOut  = false;
        var completed = false;
        setTimeout(function() {
          if ( completed ) return;
          timedOut = true;
          console.log('timeout');
          opt_timeoutF && opt_timeoutF();
        }, delay);

        f(aseq(
          function(ret) {
            if ( ! timedOut ) completed = true;
            if ( completed ) ret();
          }, ret));
      };
    },

    /**
     * Memoize an async function.
     **/
    function amemo(f, opt_ttl) {
      var memoized = false;
      var values;
      var waiters;
      var age = 0;
      var pending = false

      return function(ret) {
        if ( memoized ) {
          ret.apply(null, values);
          if ( opt_ttl != undefined && ! pending && Date.now() > age + opt_ttl ) {
            pending = true;
            f(function() {
              values = arguments;
              age = Date.now();
              pending = false;
            })
          }
          return;
        }

        var first = ! waiters;

        if ( first ) waiters = [];

        waiters.push(ret);

        if ( first ) {
          f(function() {
            values = arguments;
            age = Date.now();
            for (var i = 0 ; i < waiters.length; i++) {
              waiters[i] && waiters[i].apply(null, values);
            }
            if ( opt_ttl == undefined ) f = undefined;
            memoized = true;
            waiters = undefined;
          });
        }
      };
    },

    /**
     * Decorates an afunc to merge all calls to one active execution of the
     * delegate.
     * Similar to asynchronized, but doesn't queue up a number of calls
     * to the delegate.
     */
    function amerged(f) {
      var waiters;

      return function(ret) {
        var first = ! waiters;

        if ( first ) {
          waiters = [];
          var args = argsToArray(arguments);
        }

        waiters.push(ret);

        if ( first ) {
          args[0] = function() {
            var calls = waiters;
            waiters = undefined;
            for (var i = 0 ; i < calls.length; i++) {
              calls[i] && calls[i].apply(null, arguments);
            }
          }

          f.apply(null, args);
        }
      };
    },

    /**
     * Decorates an afunc to merge calls.
     * NB: This does not return an afunc itself!
     *
     * Immediately fires on the first call. If more calls come in while the first is
     * active, they are merged into one subsequent call with the latest arguments.
     * Once the first call is complete, the afunc will fire again if any further
     * calls have come in. If there are no more, then it will rest.
     *
     * The key difference from amerged is that it makes one call to the afunc but
     * calls its own ret once for *each* call it has received. This calls only once.
     */
    function mergeAsync(f) {
      var active = false;
      var args;

      return function() {
        if ( active ) {
          args = argsToArray(arguments);
          return;
        }

        active = true;

        // Otherwise, call f with the arguments I've been given, plus the ret
        // handler.
        var ret = function() {
          // If args is set, we have received further calls.
          if ( args ) {
            args.unshift(ret);
            f.apply(null, args);
            args = undefined;
          } else {
            active = false;
          }
        };

        var a = argsToArray(arguments);
        a.unshift(ret);
        f.apply(null, a);
      };
    },

    /** Compose a variable number of async functions. **/
    function ao(/* ... afuncs */) {
      var ret = arguments[arguments.length-1];

      for ( var i = 0 ; i < arguments.length-1 ; i++ ) {
        ret = arguments[i].ao(ret);
      }

      return ret;
    },

    /** Compose a variable number of async functions. **/
    function aseq(/* ... afuncs */) {
      var f = arguments[arguments.length-1];

      for ( var i = arguments.length-2 ; i >= 0 ; i-- ) {
        f = arguments[i].aseq(f);
      }

      return f;
    },

    /**
     * Create a function which executes several afunc's in parallel and passes
     * their joined return values to an optional afunc.
     *
     * Usage: apar(f1,f2,f3)(opt_afunc, opt_args)
     * @param opt_afunc called with joined results after all afuncs finish
     * @param opt_args passed to all afuncs
     **/
    function apar(/* ... afuncs */) {
      var aargs = [];
      var count = 0;
      var fs = arguments;

      return function(ret /* opt_args */) {
        if ( fs.length == 0 ) {
          ret && ret();
          return;
        }
        var opt_args = Array.prototype.splice.call(arguments, 1);
        var ajoin = function (i) {
          aargs[i] = Array.prototype.splice.call(arguments, 1);
          if ( ++count == fs.length ) {
            var a = [];
            for ( var j = 0 ; j < fs.length ; j++ )
              for ( var k = 0 ; k < aargs[j].length ; k++ )
                a.push(aargs[j][k]);
            ret && ret.apply(null, a);
          }
        };

        for ( var i = 0 ; i < fs.length ; i++ )
          fs[i].apply(null, [ajoin.bind(null, i)].concat(opt_args));
      };
    },

    /** Convert the supplied afunc into a trampolined-afunc. **/
    (function() {
      var active = false;
      var jobs = [];

      return function atramp(afunc) {
        return function() {
          jobs.push([afunc, arguments]);
          if ( ! active ) {
            console.assert( jobs.length <= 1, 'atramp with multiple jobs');
            active = true;
            var job;
            // Take responsibility for bouncing
            while ( (job = jobs.pop()) != null ) {
              job[0].apply(this, job[1]);
            }
            active = false;
          }
        };
      };
    })(),

    /** Execute the supplied afunc concurrently n times. **/
    function arepeatpar(n, afunc) {
      return function(ret /* opt_args */) {
        if ( n === 0 ) {
          ret && ret();
          return;
        }
        var aargs = [];
        var count = 0;

        var opt_args = Array.prototype.splice.call(arguments, 1);
        var ajoin = function (i) {
          // aargs[i] = Array.prototype.splice.call(arguments, 1);
          if ( ++count == n ) {
            var a = [];
            /*
              for ( var j = 0 ; j < n ; j++ )
              for ( var k = 0 ; k < aargs[j].length ; k++ )
              a.push(aargs[j][k]);
            */
            ret && ret.apply(null, a);
          }
        };

        for ( var i = 0 ; i < n ; i++ ) {
          afunc.apply(null, [ajoin.bind(null, i)].concat([i, n]).concat(opt_args));
        }
      };
    },

    function axhr(url, opt_op, opt_params) {
      var op = opt_op || "GET";
      var params = opt_params || [];

      return function(ret) {
        var xhr = new XMLHttpRequest();
        xhr.open(op, url);
        xhr.asend(function(json) { ret(JSON.parse(json)); }, params && params.join('&'));
      };
    },

    function futurefn(future) {
      return function() {
        var args = arguments;
        future.get(function(f) {
          f.apply(undefined, args);
        });
      };
    },

    function adelay(afunc, delay) {
      var queue = [];
      var timeout;

      function pump() {
        if ( timeout ) return;
        if ( ! queue.length ) return;

        var top = queue.shift();
        var f = top[0];
        var args = top[1];
        var ret = args[0];
        args[0] = function() {
          ret.apply(null, arguments);
          pump();
        };

        timeout = setTimeout(function() {
          timeout = 0;
          f.apply(null, args);
        }, delay)
      }

      return function() {
        var args = arguments;

        queue.push([
          afunc,
          args
        ]);

        pump();
      };
    },

    function adebugger(fn) {
      return function(ret) {
        debugger
        fn.apply(null, arguments);
      };
    }
  ]
});


// TODO(kgr): Move somewhere better.
var __JSONP_CALLBACKS__ = {};
var wrapJsonpCallback = (function() {
  var nextID = 0;

  return function(ret, opt_nonce) {
    var id = 'c' + (nextID++);
    if ( opt_nonce ) id += Math.floor(Math.random() * 0xffffff).toString(16);

    var cb = __JSONP_CALLBACKS__[id] = function(data) {
      delete __JSONP_CALLBACKS__[id];

      // console.log('JSONP Callback', id, data);

      ret && ret.call(this, data);
    };
    cb.id = id;

    return cb;
  };
})();

// Note: this doesn't work for packaged-apps
var ajsonp = function(url, params) {
  return function(ret) {
    var cb = wrapJsonpCallback(ret);

    var script = document.createElement('script');
    script.src = url + '?callback=__JSONP_CALLBACKS__.' + cb.id + (params ? '&' + params.join('&') : '');
    script.onload = function() {
      document.body.removeChild(this);
    };
    script.onerror = function() {
      cb(null);
      document.body.removeChild(this);
    };
    document.body.appendChild(script);
  };
};

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
  var ErrorReportingPS = {
  create: function(delegate, opt_pos) {
  console.log('ERPS:',delegate.head);
  return {
  __proto__: this,
  pos: opt_pos || 0,
  delegate: delegate
  };
  },
  get head() {
  console.log('head:',this.pos, this.delegate.head);
  return this.delegate.head;
  },
  get tail() {
  return this.tail_ || (this.tail_ = this.create(this.delegate.tail, this.pos+1));
  },
  get value() {
  return this.delegate.value;
  },
  setValue: function(value) {
  console.log('setValue:',value);
  //    return ErrorReportingPS.create(this.delegate.setValue(value));
  this.delegate = this.delegate.setValue(value);
  return this;
  }
  };
*/

/** String PStream **/
var StringPS = {
  create: function(str) {
    var o = Object.create(this);
    o.pos = 0;
    o.str_ = [str];
    o.tail_ = [];
    return o;
  },
  set str(str) { this.str_[0] = str; },
  get head() { return this.pos >= this.str_[0].length ? null : this.str_[0].charAt(this.pos); },
  // TODO(kgr): next line is slow because it can't bet JITed, fix.
  get value() { return this.hasOwnProperty('value_') ? this.value_ : this.str_[0].charAt(this.pos-1); },
  get tail() {
    if ( ! this.tail_[0] ) {
      var tail = Object.create(this.__proto__);
      tail.str_ = this.str_;
      tail.pos = this.pos+1;
      tail.tail_ = [];
      this.tail_[0] = tail;
    }
    return this.tail_[0];
  },
  setValue: function(value) {
    var ret = Object.create(this.__proto__);

    ret.str_ = this.str_;
    ret.pos = this.pos;
    ret.tail_ = this.tail_;
    ret.value_ = value;

    return ret;
  },
  toString: function() {
    return this.str_[0].substring(this.pos);
  }
};

function prep(arg) {
  if ( typeof arg === 'string' ) return literal(arg);

  return arg;
}

function prepArgs(args) {
  for ( var i = 0 ; i < args.length ; i++ ) {
    args[i] = prep(args[i]);
  }

  return args;
}

function range(c1, c2) {
  var f = function(ps) {
    if ( ! ps.head ) return undefined;
    if ( ps.head < c1 || ps.head > c2 ) return undefined;
    return ps.tail.setValue(ps.head);
  };

  f.toString = function() { return 'range(' + c1 + ', ' + c2 + ')'; };

  return f;
}

function literal(str, opt_value) {
  var f = function(ps) {
    for ( var i = 0 ; i < str.length ; i++, ps = ps.tail ) {
      if ( str.charAt(i) !== ps.head ) return undefined;
    }

    return ps.setValue(opt_value || str);
  };

  f.toString = function() { return '"' + str + '"'; };

  return f;
}

/**
 * Case-insensitive String literal.
 * Doesn't work for Unicode characters.
 **/
function literal_ic(str, opt_value) {
  str = str.toLowerCase();

  var f = function(ps) {
    for ( var i = 0 ; i < str.length ; i++, ps = ps.tail ) {
      if ( ! ps.head || str.charAt(i) !== ps.head.toLowerCase() ) return undefined;
    }

    return ps.setValue(opt_value || str);
  };

  f.toString = function() { return '"' + str + '"'; };

  return f;
}

function anyChar(ps) {
  return ps.head ? ps.tail/*.setValue(ps.head)*/ : undefined;
}

function notChar(c) {
  return function(ps) {
    return ps.head && ps.head !== c ? ps.tail.setValue(ps.head) : undefined;
  };
}

function notChars(s) {
  return function(ps) {
    return ps.head && s.indexOf(ps.head) == -1 ? ps.tail.setValue(ps.head) : undefined;
  };
}

function not(p, opt_else) {
  p = prep(p);
  opt_else = prep(opt_else);
  var f = function(ps) {
    return this.parse(p,ps) ? undefined :
      opt_else ? this.parse(opt_else, ps) : ps;
  };

  f.toString = function() { return 'not(' + p + ')'; };

  return f;
}

function optional(p) {
  p = prep(p);
  var f = function(ps) { return this.parse(p,ps) || ps.setValue(undefined); };

  f.toString = function() { return 'optional(' + p + ')'; };

  return f;
}

function copyInput(p) {
  p = prep(p);
  var f = function(ps) {
    var res = this.parse(p, ps);

    return res ? res.setValue(ps.str_.toString().substring(ps.pos, res.pos)) : res;
  };

  f.toString = function() { return 'copyInput(' + p + ')'; };

  return f;
}

/** Parses if the delegate parser parses, but doesn't advance the pstream. **/
function lookahead(p) {
  p = prep(p);
  var f = function(ps) { return this.parse(p,ps) && ps; };

  f.toString = function() { return 'lookahead(' + p + ')'; };

  return f;
}

function repeat(p, opt_delim, opt_min, opt_max) {
  p = prep(p);
  opt_delim = prep(opt_delim);

  var f = function(ps) {
    var ret = [];

    for ( var i = 0 ; ! opt_max || i < opt_max ; i++ ) {
      var res;

      if ( opt_delim && ret.length != 0 ) {
        if ( ! ( res = this.parse(opt_delim, ps) ) ) break;
        ps = res;
      }

      if ( ! ( res = this.parse(p,ps) ) ) break;

      ret.push(res.value);
      ps = res;
    }

    if ( opt_min && ret.length < opt_min ) return undefined;

    return ps.setValue(ret);
  };

  f.toString = function() { return 'repeat(' + p + ', ' + opt_delim + ', ' + opt_min + ', ' + opt_max + ')'; };

  return f;
}

function plus(p) { return repeat(p, undefined, 1); }

function noskip(p) {
  return function(ps) {
    this.skip_ = false;
    ps = this.parse(p, ps);
    this.skip_ = true;
    return ps;
  };
}

/** A simple repeat which doesn't build an array of parsed values. **/
function repeat0(p) {
  p = prep(p);

  return function(ps) {
    var res;
    while ( res = this.parse(p, ps) ) ps = res;
    return ps.setValue('');
  };
}

function seq(/* vargs */) {
  var args = prepArgs(arguments);

  var f = function(ps) {
    var ret = [];

    for ( var i = 0 ; i < args.length ; i++ ) {
      if ( ! ( ps = this.parse(args[i], ps) ) ) return undefined;
      ret.push(ps.value);
    }

    return ps.setValue(ret);
  };

  f.toString = function() { return 'seq(' + argsToArray(args).join(',') + ')'; };

  return f;
}

/**
 * A Sequence which only returns one of its arguments.
 * Ex. seq1(1, '"', sym('string'), '"'),
 **/
function seq1(n /*, vargs */) {
  var args = prepArgs(argsToArray(arguments).slice(1));

  var f = function(ps) {
    var ret;

    for ( var i = 0 ; i < args.length ; i++ ) {
      if ( ! ( ps = this.parse(args[i], ps) ) ) return undefined;
      if ( i == n ) ret = ps.value;
    }

    return ps.setValue(ret);
  };

  f.toString = function() { return 'seq1(' + n + ', ' + argsToArray(args).join(',') + ')'; };

  return f;
}

var parserVersion_ = 1;
function invalidateParsers() {
  parserVersion_++;
}

function simpleAlt(/* vargs */) {
//function alt(/* vargs */) {
  var args = prepArgs(arguments);

  if ( args.length == 1 ) return args[0];

  var f = function(ps) {
    for ( var i = 0 ; i < args.length ; i++ ) {
      var res = this.parse(args[i], ps);

      if ( res ) return res;
    }

    return undefined;
  };

  f.toString = function() { return 'alt(' + argsToArray(args).join(' | ') + ')'; };

  return f;
}

var TrapPStream = {
  create: function(ps) {
    return {
      __proto__: this,
      head: ps.head,
      value: ps.value,
      goodChar: false
    };
  },
  getValue: function() { return this.value; },
  setValue: function(v) { this.value = v; return this; },
  get tail() {
    this.goodChar = true;
    return {
      value: this.value,
      getValue: function() { return this.value; },
      setValue: function(v) { this.value = v; }
    };
  }
};

function alt(/* vargs */) {
  var SIMPLE_ALT = simpleAlt.apply(null, arguments);
  var args = prepArgs(arguments);
  var map  = {};
  var parserVersion = parserVersion_;

  function nullParser() { return undefined; }

  function testParser(p, ps) {
    var trapPS = TrapPStream.create(ps);
    this.parse(p, trapPS);

    // console.log('*** TestParser:',p,c,goodChar);
    return trapPS.goodChar;
  }

  function getParserForChar(ps) {
    var c = ps.head;
    var p = map[c];

    if ( ! p ) {
      var alts = [];

      for ( var i = 0 ; i < args.length ; i++ ) {
        var parser = args[i];

        if ( testParser.call(this, parser, ps) ) alts.push(parser);
      }

      p = alts.length == 0 ? nullParser :
        alts.length == 1 ? alts[0] :
        simpleAlt.apply(null, alts);

      map[c] = p;
    }

    return p;
  }

  return function(ps) {
    if ( parserVersion !== parserVersion_ ) {
      map = {};
      parserVersion = parserVersion_;
    }
    var r1 = this.parse(getParserForChar.call(this, ps), ps);
    // If alt and simpleAlt don't return same value then uncomment this
    // section to find out where the problem is occuring.
    /*
    var r2 = this.parse(SIMPLE_ALT, ps);
    if ( ! r1 !== ! r2 ) debugger;
    if ( r1 && ( r1.pos !== r2.pos ) ) debugger;
    */
    return r1;
  };
}

/** Takes a parser which returns an array, and converts its result to a String. **/
function str(p) {
  p = prep(p);
  var f = function(ps) {
    var ps = this.parse(p, ps);
    return ps ? ps.setValue(ps.value.join('')) : undefined ;
  };

  f.toString = function() { return 'str(' + p + ')'; };

  return f;
}

/** Ex. attr: pick([0, 2], seq(sym('label'), '=', sym('value'))) **/
function pick(as, p) {
  p = prep(p);
  var f = function(ps) {
    var ps = this.parse(p, ps);
    if ( ! ps ) return undefined;
    var ret = [];
    for ( var i = 0 ; i < as.length ; i++ ) ret.push(ps.value[as[i]]);
    return ps.setValue(ret);
  };

  f.toString = function() { return 'pick(' + as + ', ' + p + ')'; };

  return f;
}

function parsedebug(p) {
  return function(ps) {
    debugger;
    var old = DEBUG_PARSE;
    DEBUG_PARSE = true;
    var ret = this.parse(p, ps);
    DEBUG_PARSE = old;
    return ret;
  };
}


// alt = simpleAlt;

function sym(name) {
  var f = function(ps) {
    var p = this[name];

    if ( ! p ) console.log('PARSE ERROR: Unknown Symbol <' + name + '>');

    return this.parse(p, ps);
  };

  f.toString = function() { return '<' + name + '>'; };

  return f;
}


// This isn't any faster because V8 does the same thing already.
// function sym(name) { var p; return function(ps) { return (p || ( p = this[name])).call(this, ps); }; }


// function sym(name) { return function(ps) { var ret = this[name](ps); console.log('<' + name + '> -> ', !! ret); return ret; }; }

var DEBUG_PARSE = false;

var grammar = {

  parseString: function(str) {
    var ps = this.stringPS;
    ps.str = str;
    var res = this.parse(this.START, ps);

    return res && res.value;
  },

  parse: function(parser, pstream) {
    //    if ( DEBUG_PARSE ) console.log('parser: ', parser, 'stream: ',pstream);
    if ( DEBUG_PARSE && pstream.str_ ) {
            console.log(new Array(pstream.pos).join('.'), pstream.head);
      console.log(pstream.pos + '> ' + pstream.str_[0].substring(0, pstream.pos) + '(' + pstream.head + ')');
    }
    var ret = parser.call(this, pstream);
    if ( DEBUG_PARSE ) {
      console.log(parser + ' ==> ' + (!!ret) + '  ' + (ret && ret.value));
    }
    return ret;
  },

  /** Export a symbol for use in another grammar or stand-alone. **/
  'export': function(str) {
    return this[str].bind(this);
  },

  addAction: function(sym, action) {
    var p = this[sym];
    this[sym] = function(ps) {
      var val = ps.value;
      var ps2 = this.parse(p, ps);

      return ps2 && ps2.setValue(action.call(this, ps2.value, val));
    };

    this[sym].toString = function() { return '<<' + sym + '>>'; };
  },

  addActions: function(map) {
    for ( var key in map ) this.addAction(key, map[key]);

    return this;
  }
};


// TODO(kgr): move this somewhere better
function defineTTLProperty(obj, name, ttl, f) {
  obj.__defineGetter__(name, function() {
    var accessed;
    var value = undefined;
    this.__defineGetter__(name, function() {
      function scheduleTimer() {
        setTimeout(function() {
          if ( accessed ) {
            scheduleTimer();
          } else {
            value = undefined;
          }
          accessed = false;
        }, ttl);
      }
      if ( ! value ) {
        accessed = false;
        value = f();
        scheduleTimer();
      } else {
        accessed = true;
      }

      return value;
    });

    return this[name];
  });
}

defineTTLProperty(grammar, 'stringPS', 30000, function() { return StringPS.create(''); });


var SkipGrammar = {
  create: function(gramr, skipp) {
    return {
      __proto__: gramr,

      skip_: true,

      parse: function(parser, pstream) {
        if (this.skip_) pstream = this.skip.call(grammar, pstream) || pstream;
        return this.__proto__.parse.call(this, parser, pstream);
      },

      skip: skipp
    };
  }
};

// TODO: move this out of Core

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// todo: add enabled/disabled support
// todo: bind
// todo: generateTopic()
// todo: cleanup empty topics after subscriptions removed

/** Publish and Subscribe Event Notification Service. **/
// ??? Whould 'Observable' be a better name?
// TODO(kgr): Model or just make part of FObject?

var __ROOT__ = {};

MODEL({
  name: 'EventService',

  extendsModel: '__ROOT__',

  constants: {
    /** If listener thows this exception, it will be removed. **/
    UNSUBSCRIBE_EXCEPTION: 'unsubscribe',

    /** Used as topic suffix to specify broadcast to all sub-topics. **/
    WILDCARD: '*'
  },

  methods: {
    /** Create a "one-time" listener which unsubscribes itself after its first invocation. **/
    oneTime: function(listener) {
      return function() {
        listener.apply(this, argsToArray(arguments));

        throw EventService.UNSUBSCRIBE_EXCEPTION;
      };
    },

    /** Log all listener invocations to console. **/
    consoleLog: function(listener) {
      return function() {
        var args = argsToArray(arguments);
        console.log(args);

        listener.apply(this, args);
      };
    },

    /**
     * Merge all notifications occuring in the specified time window into a single notification.
     * Only the last notification is delivered.
     *
     * @param opt_delay time in milliseconds of time-window, defaults to 16ms, which is
     *        the smallest delay that humans aren't able to perceive.
     **/
    merged: function(listener, opt_delay, opt_X) {
      var setTimeoutX = ( opt_X && opt_X.setTimeout ) || setTimeout;
      var delay = opt_delay || 16;

      return function() {
        var triggered    = false;
        var unsubscribed = false;
        var lastArgs     = null;

        var f = function() {
          lastArgs = arguments;

          if ( unsubscribed ) throw EventService.UNSUBSCRIBE_EXCEPTION;

          if ( ! triggered ) {
            triggered = true;
            try {
              setTimeoutX(
                function() {
                  triggered = false;
                  var args = argsToArray(lastArgs);
                  lastArgs = null;
                  try {
                    listener.apply(this, args);
                  } catch (x) {
                    if ( x === EventService.UNSUBSCRIBE_EXCEPTION ) unsubscribed = true;
                  }
                }, delay);
            } catch(e) {
              // TODO: Clean this up when we move EventService into the context.
              throw EventService.UNSUBSCRIBE_EXCEPTION;
            }
          }
        };

        if ( DEBUG ) f.toString = function() {
          return 'MERGED(' + delay + ', ' + listener.$UID + ', ' + listener + ')';
        };

        return f;
      }();
    },

    /**
     * Merge all notifications occuring until the next animation frame.
     * Only the last notification is delivered.
     **/
    // TODO: execute immediately from within a requestAnimationFrame
    framed: function(listener, opt_X) {
      opt_X = opt_X || this.X;
      var requestAnimationFrameX = ( opt_X && opt_X.requestAnimationFrame ) || requestAnimationFrame;

      return function() {
        var triggered    = false;
        var unsubscribed = false;
        var lastArgs     = null;

        var f = function() {
          lastArgs = arguments;

          if ( unsubscribed ) throw EventService.UNSUBSCRIBE_EXCEPTION;

          if ( ! triggered ) {
            triggered = true;
            requestAnimationFrameX(
              function() {
                triggered = false;
                var args = argsToArray(lastArgs);
                lastArgs = null;
                try {
                  listener.apply(this, args);
                } catch (x) {
                  if ( x === EventService.UNSUBSCRIBE_EXCEPTION ) unsubscribed = true;
                }
              });
          }
        };

        if ( DEBUG ) f.toString = function() {
          return 'ANIMATE(' + listener.$UID + ', ' + listener + ')';
        };

        return f;
      }();
    },

    /** Decroate a listener so that the event is delivered asynchronously. **/
    async: function(listener, opt_X) {
      return this.delay(0, listener, opt_X);
    },

    delay: function(delay, listener, opt_X) {
      opt_X = opt_X || this.X;
      return function() {
        var args = argsToArray(arguments);

        // Is there a better way of doing this?
        (opt_X && opt_X.setTimeout ? opt_X.setTimeout : setTimeout)( function() { listener.apply(this, args); }, delay );
      };
    },

    hasListeners: function (opt_topic) {
      if ( ! opt_topic ) return !! this.subs_;

      console.log('TODO: haslisteners');
      // TODO:
      return true;
    },

    /**
     * Publish a notification to the specified topic.
     *
     * @return number of subscriptions notified
     **/
    publish: function (topic) {
      return this.subs_ ?
        this.pub_(
          this.subs_,
          0,
          topic,
          this.appendArguments([this, topic], arguments, 1)) :
        0;
    },

    /** Publish asynchronously. **/
    publishAsync: function (topic) {
      var args = argsToArray(arguments);
      var me   = this;

      setTimeout( function() { me.publish.apply(me, args); }, 0);
    },

    /**
     * Publishes a message to this object and all of its children.
     * Objects/Protos which have children should override the
     * standard definition, which is the same as just calling publish().
     **/
    deepPublish: function(topic) {
      return this.publish.apply(this, arguments);
    },

    /**
     * Publish a message supplied by a factory function.
     *
     * This is useful if the message is expensive to generate and you
     * don't want to waste the effort if there are no listeners.
     *
     * arg fn: function which returns array
     **/
    lazyPublish: function (topic, fn) {
      if ( this.hasListeners(topic) ) return this.publish.apply(this, fn());

      return 0;
    },

    /** Subscribe to notifications for the specified topic. **/
    subscribe: function (topic, listener) {
      if ( ! this.subs_ ) this.subs_ = {};
      //console.log("Sub: ",this, listener);

      this.sub_(this.subs_, 0, topic, listener);
    },

    /** Unsubscribe a listener from the specified topic. **/
    unsubscribe: function (topic, listener) {
      if ( ! this.subs_ ) return;

      this.unsub_(this.subs_, 0, topic, listener);
    },

    /** Unsubscribe all listeners from this service. **/
    unsubscribeAll: function () {
      this.sub_ = {};
    },


    ///////////////////////////////////////////////////////
    //                                            Internal
    /////////////////////////////////////////////////////

    pub_: function(map, topicIndex, topic, msg) {
      var count = 0;

      // There are no subscribers, so nothing to do
      if ( map == null ) return 0;

      if ( topicIndex < topic.length ) {
        var t = topic[topicIndex];

        // wildcard publish, so notify all sub-topics, instead of just one
        if ( t == this.WILDCARD )
          return this.notifyListeners_(topic, map, msg);

        if ( t ) count += this.pub_(map[t], topicIndex+1, topic, msg);
      }

      count += this.notifyListeners_(topic, map[null], msg);

      return count;
    },

    sub_: function(map, topicIndex, topic, listener) {
      if ( topicIndex == topic.length ) {
        if ( ! map[null] ) map[null] = [];
        map[null].push(listener);
      } else {
        var key = topic[topicIndex];

        if ( ! map[key] ) map[key] = {};

        this.sub_(map[key], topicIndex+1, topic, listener);
      }
    },

    unsub_: function(map, topicIndex, topic, listener) {
      if ( topicIndex == topic.length ) {
        if ( ! map[null] ) return true;

        if ( ! map[null].deleteI(listener) ) {
          console.warn('phantom unsubscribe, size: ', map[null].length);
        } else {
          //        console.log('remove', topic);
        }

        if ( ! map[null].length ) delete map[null];
      } else {
        var key = topic[topicIndex];

        if ( ! map[key] ) return false;

        if ( this.unsub_(map[key], topicIndex+1, topic, listener) )
          delete map[key];
      }
      return Object.keys(map).length == 0;
    },

    /** @return true if the message was delivered without error. **/
    notifyListener_: function(topic, listener, msg) {
      try {
        listener.apply(null, msg);
      } catch ( err ) {
        if ( err !== this.UNSUBSCRIBE_EXCEPTION ) {
          console.error('Error delivering event (removing listener): ', topic.join('.'), err);
        } else {
          // console.warn('Unsubscribing listener: ', topic.join('.'));
        }

        return false;
      }

      return true;
    },

    /** @return number of listeners notified **/
    notifyListeners_: function(topic, listeners, msg) {
      if ( listeners == null ) return 0;

      if ( Array.isArray(listeners) ) {
        for ( var i = 0 ; i < listeners.length ; i++ ) {
          var listener = listeners[i];

          if ( ! this.notifyListener_(topic, listener, msg) ) {
            listeners.splice(i,1);
            i--;
          }
        }

        return listeners.length;
      }

      var count = 0;
      for ( var key in listeners ) {
        count += this.notifyListeners_(topic, listeners[key], msg);
      }
      return count;
    },

    // convenience method to turn 'arguments' into a real array
    appendArguments: function (a, args, start) {
      for ( var i = start ; i < args.length ; i++ ) a.push(args[i]);

      return a;
    }
  }
});


/** Extend EventService with support for dealing with property-change notification. **/
MODEL({
  name: 'PropertyChangeSupport',

  extendsModel: 'EventService',

  constants: {
    /** Root for property topics. **/
    PROPERTY_TOPIC: 'property'
  },

  methods: {
    /** Create a topic for the specified property name. **/
    propertyTopic: memoize1(function (property) {
      return [ this.PROPERTY_TOPIC, property ];
    }),

    /** Indicate that a specific property has changed. **/
    propertyChange: function (property, oldValue, newValue) {
      // don't bother firing event if there are no listeners
      if ( ! this.subs_ ) return;

      // don't fire event if value didn't change
      if ( property != null && (
        oldValue === newValue ||
          (/*NaN check*/(oldValue !== oldValue) && (newValue !== newValue)) )
         ) return;

      this.publish(this.propertyTopic(property), oldValue, newValue);
    },

    propertyChange_: function (propertyTopic, oldValue, newValue) {
      // don't bother firing event if there are no listeners
      if ( ! this.subs_ ) return;

      // don't fire event if value didn't change
      if ( oldValue === newValue || (/*NaN check*/(oldValue !== oldValue) && (newValue !== newValue)) ) return;

      this.publish(propertyTopic, oldValue, newValue);
    },

    /** Indicates that one or more unspecified properties have changed. **/
    globalChange: function () {
      this.publish(this.propertyTopic(this.WILDCARD), null, null);
    },

    addListener: function(listener) {
      console.assert(listener, 'Listener cannot be null.');
      // this.addPropertyListener([ this.PROPERTY_TOPIC ], listener);
      this.addPropertyListener(null, listener);
    },

    removeListener: function(listener) {
      this.removePropertyListener(null, listener);
    },

    /** @arg property the name of the property to listen to or 'null' to listen to all properties. **/
    addPropertyListener: function(property, listener) {
      this.subscribe(this.propertyTopic(property), listener);
    },

    removePropertyListener: function(property, listener) {
      this.unsubscribe(this.propertyTopic(property), listener);
    },

    /** Create a Value for the specified property. **/
    propertyValue: function(prop) {
      if ( ! prop ) throw 'Property Name required for propertyValue().';
      var props = this.props_ || ( this.props_ = {} );
      return Object.hasOwnProperty.call(props, prop) ?
        props[prop] :
        ( props[prop] = PropertyValue.create(this, prop) );
    }
  }
});

var FunctionStack = {
  create: function() {
    var stack = [false];
    return {
      stack: stack,
      push: function(f) { stack.unshift(f); },
      pop: function() { stack.shift(); },
    };
  }
};


var PropertyValue = {
  create: function(obj, prop) {
    var o = Object.create(this);
    o.$UID = obj.$UID + '.' + prop;
    o.obj  = obj;
    o.prop = prop;
    return o;
  },

  get: function() { return this.obj[this.prop]; },

  set: function(val) { this.obj[this.prop] = val; },

  // asDAO: function() {
  //   console.warn('ProperytValue.asDAO() deprecated.  Use property$Proxy instead.');
  //   if ( ! this.proxy ) {
  //     this.proxy = this.X.lookup('foam.dao.ProxyDAO').create({delegate: this.get()});
  //     this.addListener(function() { proxy.delegate = this.get(); }.bind(this));
  //   }
  //   return this.proxy;
  // },

  get value() { return this.get(); },

  set value(val) { this.set(val); },

  addListener: function(listener) { this.obj.addPropertyListener(this.prop, listener); },

  removeListener: function(listener) { this.obj.removePropertyListener(this.prop, listener); },

  toString: function () { return 'PropertyValue(' + this.prop + ')'; }
};


/** Static support methods for working with Events. **/
var Events = {

  /** Collection of all 'following' listeners. **/
  listeners_: new WeakMap(),

  recordListener: function(src, dst, listener, opt_dontCallListener) {
    var srcMap = this.listeners_.get(src);
    if ( ! srcMap ) {
      srcMap = new WeakMap();
      this.listeners_.set(src, srcMap);
    }
    console.assert( ! srcMap.get(dst), 'recordListener: duplicate follow');
    srcMap.set(dst, listener);
    src.addListener(listener);
    if ( ! opt_dontCallListener ) listener();
  },


  identity: function (x) { return x; },

  /** Have the dstValue listen to changes in the srcValue and update its value to be the same. **/
  follow: function (srcValue, dstValue) {
    if ( ! srcValue || ! dstValue ) return;

    this.recordListener(srcValue, dstValue, function () {
      var sv = srcValue.get();
      var dv = dstValue.get();

      if ( ! equals(sv, dv) ) dstValue.set(sv);
    });
  },


  /** Have the dstValue stop listening for changes to the srcValue. **/
  unfollow: function (src, dst) {
    if ( ! src || ! dst ) return;
    var srcMap = this.listeners_.get(src);
    if ( ! srcMap ) return;
    var listener = srcMap.get(dst);
    if ( listener ) {
      srcMap.delete(dst);
      src.removeListener(listener);
    }
  },


  /**
   * Maps values from one model to another.
   * @param f maps values from srcValue to dstValue
   */
  map: function (srcValue, dstValue, f) {
    if ( ! srcValue || ! dstValue ) return;

    this.recordListener(srcValue, dstValue, function () {
      var s = f(srcValue.get());
      var d = dstValue.get();

      if ( ! equals(s, d) ) dstValue.set(s);
    });
  },


  /**
   * Link the values of two models by having them follow each other.
   * Initial value is copied from srcValue to dstValue.
   **/
  link: function (srcValue, dstValue) {
    this.follow(srcValue, dstValue);
    this.follow(dstValue, srcValue);
  },


  /**
   * Relate the values of two models.
   * @param f maps value1 to model2
   * @param fprime maps model2 to value1
   * @param removeFeedback disables feedback
   */
  relate: function (srcValue, dstValue, f, fprime, removeFeedback) {
    if ( ! srcValue || ! dstValue ) return;

    var feedback = false;

    var l = function(sv, dv, f) { return function () {
      if ( removeFeedback && feedback ) return;
      var s = f(sv.get());
      var d = dv.get();

      if ( ! equals(s, d) ) {
        feedback = true;
        dv.set(s);
        feedback = false;
      }
    }};

    var l1 = l(srcValue, dstValue, f);
    var l2 = l(dstValue, srcValue, fprime);

    this.recordListener(srcValue, dstValue, l1, true);
    this.recordListener(dstValue, srcValue, l2, true);

    l1();
  },

  /** Unlink the values of two models by having them no longer follow each other. **/
  unlink: function (value1, value2) {
    this.unfollow(value1, value2);
    this.unfollow(value2, value1);
  },


  //////////////////////////////////////////////////
  //                                   FRP Support
  //////////////////////////////////////////////////

  /**
   * Trap the dependencies of 'fn' and re-invoke whenever
   * their values change.  The return value of 'fn' is
   * passed to 'opt_fn'.
   * @param opt_fn also invoked when dependencies change,
   *        but its own dependencies are not tracked.
   * @returns a cleanup object. call ret.destroy(); to
   *        destroy the dynamic function and listeners.
   */
  dynamic: function(fn, opt_fn, opt_X) {
    var fn2 = opt_fn ? function() { opt_fn(fn()); } : fn;
    var listener = EventService.framed(fn2, opt_X);
    var propertyValues = [];
    fn(); // Call once before capture to pre-latch lazy values
    Events.onGet.push(function(obj, name, value) {
      // Uncomment next line to debug.
      // obj.propertyValue(name).addListener(function() { console.log('name: ', name, ' listener: ', listener); });
      obj.propertyValue(name).addListener(listener);
      propertyValues.push(obj.propertyValue(name));
    });
    var ret = fn();
    Events.onGet.pop();
    opt_fn && opt_fn(ret);
    return {
      destroy: function() { // TODO(jacksonic): just return the function?
        propertyValues.forEach(function(p) {
          p.removeListener(listener);
        });
      }
    };
  },

  onSet: FunctionStack.create(),
  onGet: FunctionStack.create(),

  // ???: would be nice to have a removeValue method
  // or maybe add an 'owner' property, combine with Janitor
}

// TODO: Janitor
/*
  subscribe(subject, topic, listener);
  addCleanupTask(fn)

  cleanup();

*/


MODEL({
  name: 'Movement',

  methods: {

    distance: function(x, y) { return Math.sqrt(x*x + y*y); },

    /** Combinator to create the composite of two functions. **/
    o: function(f1, f2) { return function(x) { return f1(f2(x)); }; },

    /** Combinator to create the average of two functions. **/
    avg: function(f1, f2) { return function(x) { return (f1(x) + f2(x))/2; }; },

    /** Constant speed. **/
    linear: function(x) { return x; },

    /** Move to target value and then return back to original value. **/
    back: function(x) { return x < 0.5 ? 2*x : 2-2*x; },

    /** Start slow and accelerate until half-way, then start slowing down. **/
    accelerate: function(x) { return (Math.sin(x * Math.PI - Math.PI/2)+1)/2; },

    /** Start slow and ease-in to full speed. **/
    easeIn: function(a) {
      var v = 1/(1-a/2);
      return function(x) {
        var x1 = Math.min(x, a);
        var x2 = Math.max(x-a, 0);
        return (a ? 0.5*x1*(x1/a)*v : 0) + x2*v;
      };
    },

    /** Combinator to reverse behaviour of supplied function. **/
    reverse: function(f) { return function(x) { return 1-f(1-x); }; },

    /** Reverse of easeIn. **/
    easeOut: function(b) { return Movement.reverse(Movement.easeIn(b)); },

    /**
     * Cause an oscilation at the end of the movement.
     * @param b percentage of time to to spend bouncing [0, 1]
     * @param a amplitude of maximum bounce
     * @param opt_c number of cycles in bounce (default: 3)
     */
    oscillate:  function(b, a, opt_c) {
      var c = opt_c || 3;
      return function(x) {
        if ( x < (1-b) ) return x/(1-b);
        var t = (x-1+b)/b;
        return 1+(1-t)*2*a*Math.sin(2*c*Math.PI * t);
      };
    },

    /**
     * Cause an bounce at the end of the movement.
     * @param b percentage of time to to spend bouncing [0, 1]
     * @param a amplitude of maximum bounce
     */
    bounce:  function(b,a,opt_c) {
      var c = opt_c || 3;
      return function(x) {
        if ( x < (1-b) ) return x/(1-b);
        var t = (x-1+b)/b;
        return 1-(1-t)*2*a*Math.abs(Math.sin(2*c*Math.PI * t));
      };
    },
    bounce2: function(a) {
      var v = 1 / (1-a);
      return function(x) {
        if ( x < (1-a) ) return v*x;
        var p = (x-1+a)/a;
        return 1-(x-1+a)*v/2;
      };
    },

    /** Move backwards a% before continuing to end. **/
    stepBack: function(a) {
      return function(x) {
        return ( x < a ) ? -x : -2*a+(1+2*a)*x;
      };
    },

    /** Combination of easeIn and easeOut. **/
    ease: function(a, b) {
      return Movement.o(Movement.easeIn(a), Movement.easeOut(b));
    },

    seq: function(f1, f2) {
      return ( f1 && f2 ) ? function() { f1.apply(this, argsToArray(arguments)); f2(); } :
      f1 ? f1
        : f2 ;
    },

    liveAnimations_: 0,

    /** @return a latch function which can be called to stop the animation. **/
    animate: function(duration, fn, opt_interp, opt_onEnd, opt_X) {
      var requestAnimationFrameX = ( opt_X && opt_X.requestAnimationFrame ) || requestAnimationFrame;

      // console.assert( opt_X && opt_X.requestAnimationFrame, 'opt_X or opt_X.requestAnimationFrame not available');

      if ( duration == 0 ) return Movement.seq(fn, opt_onEnd);
      var interp = opt_interp || Movement.linear;

      return function() {
        var ranges    = [];
        var stopped = false;

        function stop() {
          var onEnd = opt_onEnd;
          if ( ! stopped ) {
            Movement.liveAnimations_--;
            stopped = true;
            onEnd && onEnd();
            onEnd = null;

            if ( Movement.liveAnimations_ === 0 ) {
              var tasks = Movement.idleTasks_;
              if ( tasks && tasks.length > 0 ) {
                Movement.idleTasks_ = [];
                setTimeout(function() {
                  // Since this is called asynchronously, there might be a new
                  // animation. If so, queue up the tasks again.
                  var i;
                  if (Movement.liveAnimations_ > 0) {
                    for ( i = 0 ; i < tasks.length ; i++ )
                      Movement.idleTasks_.push(tasks[i]);
                  } else {
                    for ( i = 0 ; i < tasks.length ; i++ ) tasks[i]();
                  }
                }, 20);
              }
            }
          }
        }

        if ( fn ) {
          Events.onSet.push(function(obj, name, value2) {
            ranges.push([obj, name, obj[name], value2]);
          });
          fn.apply(this, argsToArray(arguments));
          Events.onSet.pop();
        }

        var startTime = Date.now();

        function go() {
          if ( stopped ) return;
          var now = Date.now();
          var p   = interp((Math.min(now, startTime + duration)-startTime)/duration);
          var last = now >= startTime + duration;

          for ( var i = 0 ; i < ranges.length ; i++ ) {
            var r = ranges[i];
            var obj = r[0], name = r[1], value1 = r[2], value2 = r[3];

            obj[name] = last ? value2 : value1 + (value2-value1) * p;
          }

          if ( last ) stop(); else requestAnimationFrameX(go);
        }

        if ( ranges.length > 0 ) {
          Movement.liveAnimations_++;
          requestAnimationFrameX(go);
        } else {
          var setTimeoutX = ( opt_X && opt_X.setTimeout ) || setTimeout;
          setTimeoutX(stop, duration);
        }

        return stop;
      };
    },

    whenIdle: function(fn) {
      // Decorate a function to defer execution until no animations are running
      return function() {
        if ( Movement.liveAnimations_ > 0 ) {
          if ( ! Movement.idleTasks_ ) Movement.idleTasks_ = [];
          var args = arguments;
          Movement.idleTasks_.push(function() { fn.apply(fn, args); });
        } else {
          fn.apply(fn, arguments);
        }
      };
    },

    // requires unsubscribe to work first (which it does now)
    /*
      animate2: function(timer, duration, fn) {
      return function() {
      var startTime = timer.time;
      Events.onSet.push(function(obj, name, value2) {
      var value1 = obj[name];

      Events.dynamic(function() {
      var now = timer.time;

      obj[name] = value1 + (value2-value1) * (now-startTime)/duration;

      if ( now > startTime + duration ) throw EventService.UNSUBSCRIBE_EXCEPTION;
      });

      return false;
      });
      fn.apply(this, argsToArray(arguments));
      Events.onSet.pop();
      update();
      };
      },
    */

    // TODO: if this were an object then you could sub-class to modify playback
    compile: function (a, opt_rest) {
      function noop() {}

      function isPause(op) {
        return Array.isArray(op) && op[0] == 0;
      }

      function compilePause(op, rest) {
        return function() {
          document.onclick = function() {
            document.onclick = null;
            rest();
          };
        };
      }

      function isSimple(op) {
        return Array.isArray(op) && typeof op[0] === 'number';
      }

      function compileSimple(op, rest) {
        op[3] = Movement.seq(op[3], rest);
        return function() { Movement.animate.apply(null, op)(); };
      }

      function isParallel(op) {
        return Array.isArray(op) && Array.isArray(op[0]);
      }

      function compileParallel(op, rest) {
        var join = (function(num) {
          return function() { --num || rest(); };
        })(op.length);

        return function() {
          for ( var i = 0 ; i < op.length ; i++ )
            if ( isSimple(op[i]) )
              Movement.animate(op[i][0], op[i][1], op[i][2], Movement.seq(op[i][3], join))();
          else
            Movement.compile(op[i], join)();
        };
      }

      function compileFn(fn, rest) {
        return Movement.seq(fn, rest);
      }

      function compile_(a, i) {
        if ( i >= a.length ) return opt_rest || noop;

        var rest = compile_(a, i+1);
        var op = a[i];

        if ( isPause(op)    ) return compilePause(op, rest);
        if ( isSimple(op)   ) return compileSimple(op, rest);
        if ( isParallel(op) ) return compileParallel(op, rest);

        return compileFn(op, rest);
      }

      return compile_(a, 0);
    },

    onIntersect: function (o1, o2, fn) {
      if ( o1.model_.R ) {
        Events.dynamic(function() { o1.x; o1.y; o2.x; o2.y; }, function() {
          var dx = o1.x - o2.x;
          var dy = o1.y - o2.y;
          var d = dx*dx + dy*dy;
          var r2 = o1.r + o2.r;
          if ( d < r2*r2 )
            fn.call(null, o1, o2);
        });
      } else {
        Events.dynamic(function() { o1.x; o1.y; o2.x; o2.y; }, function() {
          if ( ( o1.x <= o2.x && o1.x + o1.width > o2.x    &&
                 o1.y <= o2.y && o1.y + o1.height > o2.y ) ||
               ( o2.x <= o1.x && o2.x + o2.width > o1.x    &&
                 o2.y <= o1.y && o2.y + o2.height > o1.y ) )
          {
            fn.call(null, o1, o2);
          }
        });
      }
    },

    stepTowards: function(src, dst, maxStep) {
      var dx = src.x - dst.x;
      var dy = src.y - dst.y;
      var theta = Math.atan2(dy,dx);
      var r     = Math.sqrt(dx*dx+dy*dy);
      r = r < 0 ? Math.max(-maxStep, r) : Math.min(maxStep, r);

      dst.x += r*Math.cos(-theta);
      dst.y -= r*Math.sin(-theta);
    },


    /**
     * Cause one object to move towards another at a specified rate.
     *
     * @arg t timer
     * @arg body body to be orbitted
     * @arg sat object to orbit body
     * @arg r radius of orbit
     * @arg p period of orbit
     */
    moveTowards: function (t, body, sat, v) {
      var bodyX = body.propertyValue('x');
      var bodyY = body.propertyValue('y');
      var satX  = sat.propertyValue('x');
      var satY  = sat.propertyValue('y');

      t.addListener(function() {
        var dx = bodyX.get() - satX.get();
        var dy = (bodyY.get() - satY.get());
        var theta = Math.atan2(dy,dx);
        var r     = Math.sqrt(dx*dx+dy*dy);

        r = r < 0 ? Math.max(-v, r) : Math.min(v, r);

        satX.set(satX.get() + r*Math.cos(-theta));
        satY.set(satY.get() - r*Math.sin(-theta));
      });
    },

    /**
     * Cause one object to orbit another.
     *
     * @arg t timer
     * @arg body body to be orbitted
     * @arg sat object to orbit body
     * @arg r radius of orbit
     * @arg p period of orbit
     */
    orbit: function (t, body, sat, r, p, opt_start) {
      var bodyX = body.x$;
      var bodyY = body.y$;
      var satX  = sat.x$;
      var satY  = sat.y$;
      var start = opt_start || 0;

      t.addListener(EventService.framed(function() {
        var time = t.time;
        satX.set(bodyX.get() + r*Math.sin(time/p*Math.PI*2 + start));
        satY.set(bodyY.get() + r*Math.cos(time/p*Math.PI*2 + start));
      }));
    },

    strut: function(mouse, c, dx, dy) {
      Events.dynamic(function() { mouse.x; mouse.y; }, function() {
        c.x = mouse.x + dx;
        c.y = mouse.y + dy;
      });
    },

    gravity: function(c, opt_a, opt_theta) {
      // TODO(kgr): implement opt_theta, the ability to control the direction
      var a = opt_a || 1;
      var theta = opt_theta || Math.PI * 1.5;
      Events.dynamic(function() { c.vx; c.vy; }, function() {
        c.vy += a;
      });
    },

    friction: function(c, opt_coef) {
      var coef = opt_coef || 0.9;
      Events.dynamic(function() { c.vx; c.vy; }, function() {
        c.vx = Math.abs(c.vx) < 0.001 ? 0 : c.vx * coef;
        c.vy = Math.abs(c.vy) < 0.001 ? 0 : c.vy * coef;
      });
    },

    inertia: function(c) {
      Events.dynamic(function() { c.vx; c.vy; c.x; c.y; }, function() {
        // Dynamic Friction
        if ( Math.abs(c.vx) > 0.001 ) c.x += c.vx;
        if ( Math.abs(c.vy) > 0.001 ) c.y += c.vy;
        // StaticFriction
//        if ( Math.abs(c.vx) < 0.001 ) c.vx = 0;
//        if ( Math.abs(c.vy) < 0.001 ) c.vy = 0;
      });
    },

    spring: function(mouse, c, dx, dy, opt_strength) {
      var strength = opt_strength || 6;
      var d        = Movement.distance(dx, dy);
      Events.dynamic(function() { mouse.x; mouse.y; c.x; c.y; c.vx; c.vy; }, function() {
        if ( dx === 0 && dy === 0 ) {
          c.x = mouse.x;
          c.y = mouse.y;
        } else {
          var dx2 = mouse.x + dx - c.x;
          var dy2 = mouse.y + dy - c.y;
          var d2  = Movement.distance(dx2, dy2);
          var dv  = strength * d2/d;
          if ( Math.abs(dv) < 0.01 ) return;
          var a = Math.atan2(dy2, dx2);
          c.vx += dv * Math.cos(a);
          c.vy += dv * Math.sin(a);
        }
      });
    },

    spring2: function(c1, c2, length, opt_strength) {
      var strength = opt_strength || 4;

      Events.dynamic(function() { c1.x; c1.y; c2.x; c2.y; }, function() {
        var d = c1.distanceTo(c2);
        var a = Math.atan2(c2.y-c1.y, c2.x-c1.x);
        if ( d > length ) {
          c1.applyMomentum( strength * (d/length-1), a);
          c2.applyMomentum(-strength * (d/length-1), a);
        } else if ( d < length ) {
          c1.applyMomentum(-strength * (length/d-1), a);
          c2.applyMomentum( strength * (length/d-1), a);
        }
      });
    },

    createAnimatedPropertyInstallFn: function(duration, interpolation) {
      /* Returns a function that can be assigned as a $$DOC{ref:'Property'}
      $$DOC{ref:'Property.install'} function. Any assignments to the property
      will be automatically animated.</p>
      <p><code>
      properties: [
      &nbsp;&nbsp;  { name: 'myProperty',
      &nbsp;&nbsp;&nbsp;&nbsp;    install: createAnimatedPropertyInstallFn(500, Movement.ease(0.2, 0.2)),
      &nbsp;&nbsp;&nbsp;&nbsp;    ...
      &nbsp;&nbsp;  }]
      </code>*/
      return function(prop) {
        this.defineProperty(
          {
            name: prop.name+"$AnimationLatch",
            defaultValue: 0,
            hidden: true,
            documentation: function() { /* The animation controller. */ },
          }
        );

        var actualSetter = this.__lookupSetter__(prop.name);
        this.defineProperty(
          {
            name: prop.name+"$AnimationSetValue",
            defaultValue: 0,
            hidden: true,
            documentation: function() { /* The animation value setter. */ },
            postSet: function(_, nu) {
              actualSetter.call(this, nu);
            }
          }
        );

        // replace setter with animater
        this.__defineSetter__(prop.name, function(nu) {
          // setter will be called on the instance, so "this" is an instance now
          var latch = this[prop.name+"$AnimationLatch"] ;
          latch && latch();

          var anim = Movement.animate(
            duration,
            function() {
              this[prop.name+"$AnimationSetValue"] = nu;
            }.bind(this),
            interpolation
          );
          this[prop.name+"$AnimationLatch"] = anim();
        });
      };
    }
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * JSONUtil -- Provides JSON++ marshalling support.
 *
 * Like regular JSON, with the following differences:
 *  1. Marshalls to/from FOAM Objects, rather than maps.
 *  2. Object Model information is encoded as 'model: "ModelName"'
 *  3. Default Values are not marshalled, saving disk space and network bandwidth.
 *  4. Support for marshalling functions.
 *  5. Support for property filtering, ie. only output non-transient properties.
 *  6. Support for 'pretty' and 'compact' modes.
 *
 *  TODO:
 *    Replace with JSONParser.js, when finished.
 *    Maybe rename to FON (FOAM Object Notation, pronounced 'phone') to avoid
 *    confusion with regular JSON syntax.
 **/

var AbstractFormatter = {
  keyify: function(str) { return '"' + str + '"'; },

  stringify: function(obj) {
    var buf = '';

    this.output(function() {
      for (var i = 0; i < arguments.length; i++)
        buf += arguments[i];
    }, obj);

    return buf;
  },

  stringifyObject: function(obj, opt_defaultModel) {
    var buf = '';

    this.outputObject_(function() {
      for (var i = 0; i < arguments.length; i++)
        buf += arguments[i];
    }, obj, opt_defaultModel);

    return buf;
  },

  /** @param p a predicate function or an mLang **/
  where: function(p) {
    return {
      __proto__: this,
      p: ( p.f && p.f.bind(p) ) || p
    };
  },

  p: function() { return true; }
};


var JSONUtil = {

  escape: function(str) {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\x00-\x1f]/g, function(c) {
        return "\\u00" + ((c.charCodeAt(0) < 0x10) ?
                          '0' + c.charCodeAt(0).toString(16) :
                          c.charCodeAt(0).toString(16));
      });
  },

  parseToMap: function(str) {
    return eval('(' + str + ')');
  },

  parse: function(X, str, seq) {
    return this.mapToObj(X, this.parseToMap(str), undefined, seq);
  },

  arrayToObjArray: function(X, a, opt_defaultModel, seq) {
    for ( var i = 0 ; i < a.length ; i++ ) {
      if ( ( ! DEBUG ) && a[i].debug ) {
        a.splice(i,1);
        i--;
      } else {
        a[i] = this.mapToObj(X, a[i], opt_defaultModel, seq);
      }
    }
    return a;
  },

  /**
   * Convert JS-Maps which contain the 'model_' property, into
   * instances of that model.
   **/
  mapToObj: function(X, obj, opt_defaultModel, seq) {
    if ( ! obj || typeof obj.model_ === 'object' ) return obj;

    if ( Array.isArray(obj) ) return this.arrayToObjArray(X, obj, undefined, seq);

    if ( obj instanceof Function ) return obj;

    if ( obj instanceof Date ) return obj;

    if ( obj instanceof Object ) {
      var j = 0;
      for ( var key in obj ) {
        if ( key != 'model_' && key != 'prototype_' ) obj[key] = this.mapToObj(X, obj[key], null, seq);
        j++;
      }

      if ( opt_defaultModel && ! obj.model_ ) return opt_defaultModel.create(obj);

      if ( obj.model_ ) {
        var newObj = X.lookup(obj.model_);
        if ( ( ! newObj || ! newObj.finished__ ) ) {
          var future = afuture();
          seq && seq.push(future.get);

          arequire(obj.model_, X)(function(model) {
            if ( ! model ) {
               if ( DEBUG && obj.model_ !== 'Template' && obj.model_ !== 'ArrayProperty' && obj.model_ !== 'ViewFactoryProperty' && obj.model_ !== 'Documentation' && obj.model_ !== 'DocumentationProperty' && obj.model_ !== 'CSSProperty' && obj.model_ !== 'FunctionProperty' )
                 console.warn('Failed to dynamically load: ', obj.model_);
              future.set(obj);
              return;
            }
            var tmp = model.create(obj);
            obj.become(tmp);
            future.set(obj);
          });

          return obj;
        }
        return newObj ? newObj.create(obj, X) : obj;
      }
      return obj
    }

    return obj;
  },

  compact: {
    __proto__: AbstractFormatter,

    output: function(out, obj, opt_defaultModel) {
      if ( Array.isArray(obj) ) {
        this.outputArray_(out, obj);
      }
      else if ( typeof obj === 'string' ) {
        out('"');
        out(JSONUtil.escape(obj));
        out('"');
      }
      else if ( obj instanceof Function ) {
        this.outputFunction_(out, obj);
      }
      else if ( obj instanceof Date ) {
        out(obj.getTime());
      }
      else if ( obj instanceof RegExp ) {
        out(obj.toString());
      }
      else if ( obj instanceof Object ) {
        if ( obj.model_ )
          this.outputObject_(out, obj, opt_defaultModel);
        else
          this.outputMap_(out, obj);
      }
      else if ( typeof obj === 'number' ) {
        if ( ! isFinite(obj) ) obj = null;
        out(obj);
      }
      else {
        out(obj === undefined ? null : obj);
      }
    },

    outputObject_: function(out, obj, opt_defaultModel) {
      var str   = '';
      var first = true;

      out('{');
      if ( obj.model_.id !== opt_defaultModel ) {
        this.outputModel_(out, obj);
        first = false;
     }

      var properties = obj.model_.getRuntimeProperties();
      for ( var key in properties ) {
        var prop = properties[key];

        if ( ! this.p(prop) ) continue;

        if ( prop.name in obj.instance_ ) {
          var val = obj[prop.name];
          if ( Array.isArray(val) && ! val.length ) continue;
          if ( ! first ) out(',');
          out(this.keyify(prop.name), ': ');
          if ( Array.isArray(val) && prop.subType ) {
            this.outputArray_(out, val, prop.subType);
          } else {
            this.output(out, val);
          }
          first = false;
        }
      }

      out('}');
    },

    outputModel_: function(out, obj) {
      out('model_:"')
      if ( obj.model_.package ) out(obj.model_.package, '.')
      out(obj.model_.name, '"');
    },

    outputMap_: function(out, obj) {
      var str   = '';
      var first = true;

      out('{');

      for ( var key in obj ) {
        var val = obj[key];

        if ( ! first ) out(',');
        out(this.keyify(key), ': ');
        this.output(out, val);

        first = false;
      }

      out('}');
    },

    outputArray_: function(out, a, opt_defaultModel) {
      if ( a.length == 0 ) { out('[]'); return out; }

      var str   = '';
      var first = true;

      out('[');

      for ( var i = 0 ; i < a.length ; i++, first = false ) {
        var obj = a[i];

        if ( ! first ) out(',');

        this.output(out, obj, opt_defaultModel);
      }

      out(']');
    },

    outputFunction_: function(out, obj) { out(obj); }
  },

  pretty: {
    __proto__: AbstractFormatter,

    output: function(out, obj, opt_defaultModel, opt_indent) {
      var indent = opt_indent || '';

      if ( Array.isArray(obj) ) {
        this.outputArray_(out, obj, null, indent);
      }
      else if ( typeof obj == 'string' ) {
        out('"');
        out(JSONUtil.escape(obj));
        out('"');
      }
      else if ( obj instanceof Function ) {
        this.outputFunction_(out, obj, indent);
      }
      else if ( obj instanceof Date ) {
        out(obj.getTime());
      }
      else if ( obj instanceof RegExp ) {
        out(obj.toString());
      }
      else if ( obj instanceof Object ) {
        if ( obj.model_ )
          this.outputObject_(out, obj, opt_defaultModel, indent);
        else
          this.outputMap_(out, obj, indent);
      } else if ( typeof obj === 'number' ) {
        if ( ! isFinite(obj) ) obj = null;
        out(obj);
      } else {
        if ( obj === undefined ) obj = null;
        out(obj);
      }
    },

    outputObject_: function(out, obj, opt_defaultModel, opt_indent) {
      var indent       = opt_indent || '';
      var nestedIndent = indent + '   ';
      var str          = '';
      var first        = true;

      out(/*"\n", */indent, '{\n');
      if ( obj.model_.id && obj.model_.id !== opt_defaultModel ) {
        this.outputModel_(out, obj, nestedIndent);
        first = false;
      }

      var properties = obj.model_.getRuntimeProperties();
      for ( var key in properties ) {
        var prop = properties[key];

        if ( ! this.p(prop) ) continue;

        if ( prop.name === 'parent' ) continue;
        if ( prop.name in obj.instance_ ) {
          var val = obj[prop.name];
          if ( Array.isArray(val) && ! val.length ) continue;
          if ( ! first ) out(',\n');
          out(nestedIndent, this.keyify(prop.name), ': ');
          if ( Array.isArray(val) && prop.subType ) {
            this.outputArray_(out, val, prop.subType, nestedIndent);
          } else {
            this.output(out, val, null, nestedIndent);
          }
          first = false;
        }
      }

      out('\n', indent, '}');
    },

    outputModel_: function(out, obj, indent) {
      out(indent, '"model_": "', obj.model_.id, '"');
    },

    outputMap_: function(out, obj, opt_indent) {
      var indent       = opt_indent || '';
      var nestedIndent = indent + '   ';
      var str          = '';
      var first        = true;

      out(/*"\n",*/ indent, '{\n', nestedIndent);

      for ( var key in obj ) {
        var val = obj[key];

        if ( ! first ) out(',\n');
        out(nestedIndent, this.keyify(key), ': ');
        this.output(out, val, null, nestedIndent);

        first = false;
      }

      out('\n', indent, '}');
    },

    outputArray_: function(out, a, opt_defaultModel, opt_indent) {
      if ( a.length == 0 ) { out('[]'); return out; }

      var indent       = opt_indent || '';
      var nestedIndent = indent + '   ';
      var str          = '';
      var first        = true;

      out('[\n');

      for ( var i = 0 ; i < a.length ; i++, first = false ) {
        var obj = a[i];

        if ( ! first ) out(',\n');

        this.output(out, obj, opt_defaultModel, nestedIndent);
      }

      out('\n', indent, ']');
    },

    outputFunction_: function(out, obj, indent) {
      var str = obj.toString();
      var lines = str.split('\n');

      if ( lines.length == 1 ) { out(str); return; }

      var minIndent = 10000;
      for ( var i = 0 ; i < lines.length ; i++ ) {
        var j = 0;
        for ( ; j < lines[i].length && lines[i].charAt(j) === ' ' && j < minIndent ; j++ );
        if ( j > 0 && j < minIndent ) minIndent = j;
      }

      if ( minIndent === 10000 ) { out(str); return; }

      for ( var i = 0 ; i < lines.length ; i++ ) {
        if ( lines[i].length && lines[i].charAt(0) === ' ' ) {
          lines[i] = indent + lines[i].substring(minIndent);
        }
        out(lines[i]);
        if ( i < lines.length-1 ) out('\n');
      }
    }
  },

  moreCompact: {
    __proto__: AbstractFormatter,
    // TODO: use short-names
  },

  compressed: {
    __proto__: AbstractFormatter,

    stringify: function(obj) {
      return Iuppiter.Base64.encode(Iuppiter.compress(JSONUtil.compact.stringify(obj),true));
    }
  }

};

JSONUtil.prettyModel = {
  __proto__: JSONUtil.pretty,

  outputModel_: function(out, obj, indent) {
    out(indent, 'model_: "', obj.model_.id, '"');
  },

  keys_: {},

  keyify: function(str) {
    if ( ! this.keys_.hasOwnProperty(str) ) {
      this.keys_[str] =
        /^[a-zA-Z\$_][0-9a-zA-Z$_]*$/.test(str) ?
        str :
        '"' + str + '"';
    }

    return this.keys_[str];
  }
};

JSONUtil.stringify       = JSONUtil.pretty.stringify.bind(JSONUtil.pretty);
JSONUtil.stringifyObject = JSONUtil.pretty.stringifyObject.bind(JSONUtil.pretty);
JSONUtil.output          = JSONUtil.pretty.output.bind(JSONUtil.pretty);
JSONUtil.where           = JSONUtil.pretty.where.bind(JSONUtil.pretty);

var NOT_TRANSIENT = function(prop) { return ! prop.transient; };

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var XMLParser = {
  __proto__: grammar,

  START: seq1(1, sym('whitespace'), sym('tag'), sym('whitespace')),

  tag: seq(
      '<',
      sym('tagName'),
      sym('whitespace'),
      repeat(sym('attribute'), sym('whitespace')),
      sym('whitespace'),
      '>',
      repeat(alt(
        sym('tag'),
        sym('text')
      )),
      '</', sym('tagName'), '>'
    ),

  label: str(plus(notChars(' =/\t\r\n<>\'"'))),

  tagName: sym('label'),

  text: str(plus(notChar('<'))),

  attribute: seq(sym('label'), '=', sym('value')),

  value: str(alt(
    seq1(1, '"', repeat(notChar('"')), '"'),
    seq1(1, "'", repeat(notChar("'")), "'")
  )),

  whitespace: repeat(alt(' ', '\t', '\r', '\n'))
};

XMLParser.addActions({
  // Trying to abstract all the details of the parser into one place,
  // and to use a more generic representation in XMLUtil.parse().
  tag: function(xs) {
    // < label ws attributes ws > children </ label >
    // 0 1     2  3          4  5 6        7  8     9

    // Mismatched XML tags
    // TODO: We should be able to set the error message on the ps here.
    if ( xs[1] != xs[8] ) return undefined;

    var obj = { tag: xs[1], attrs: {}, children: xs[6] };

    xs[3].forEach(function(attr) { obj.attrs[attr[0]] = attr[2]; });

    return obj;
  }
});


var XMLUtil = {

  escape: function(str) {
    return str && str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
  },

  unescape: function(str) {
    return str && str.toString()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
  },

  escapeAttr: function(str) {
    return str && str.replace(/"/g, '&quot;');
  },

  unescapeAttr: function(str) {
    return str && str.replace(/&quot;/g, '"');
  },

  parse: function(str) {
    var result = XMLParser.parseString(str);
    if ( ! result ) return result; // Parse error on undefined.

    // Otherwise result is the <foam> tag.
    return this.parseArray(result.children);
  },

  parseObject: function(tag) {
    var obj = {};
    var self = this;
    tag.children.forEach(function(c) {
      // Ignore children which are not tags.
      if (typeof c === 'object' && c.attrs && c.attrs.name) {
        var result;
        if ( c.attrs.type && c.attrs.type == 'function' ) {
          var code = XMLUtil.unescape(c.children.join(''));
          if ( code.startsWith('function') ) {
            result = eval('(' + code + ')');
          } else {
            result = new Function(code);
          }
        } else {
          result = self.parseArray(c.children);
        }

        obj[self.unescapeAttr(c.attrs.name)] = result;
      }
    });

    if ( !tag.attrs.model ) return obj;
    var model = this.unescapeAttr(tag.attrs.model);
    return GLOBAL[model] ?  GLOBAL[model].create(obj) : obj;
  },

  parseArray: function(a) {
    // Turn <i> tags into primitive values, everything else goes through
    // parseObject.
    // Any loose primitive values are junk whitespace, and ignored.
    var self = this;
    var ret = [];
    a.forEach(function(x) {
      if ( typeof x !== 'object' ) return;
      if ( x.tag == 'i' ) {
        ret.push(XMLUtil.unescape(x.children[0])); // Literal content.
      } else {
        ret.push(self.parseObject(x));
      }
    });

    // Special case: If we found nothing, return all children as a string.
    return ret.length ? ret : XMLUtil.unescape(a.join(''));
  },

  compact: {
    stringify: function(obj) {
      var buf = [];

      this.output(buf.push.bind(buf), obj);

      return '<foam>' + buf.join('') + '</foam>';
    },

    output: function(out, obj) {
      if ( Array.isArray(obj) ) {
        this.outputArray_(out, obj);
      }
      else if ( typeof obj == 'string' ) {
        out(XMLUtil.escape(obj));
      }
      else if ( obj instanceof Function ) {
        this.outputFunction_(out, obj);
      }
      else if ( obj instanceof Object ) {
        if ( obj.model_ )
          this.outputObject_(out, obj);
        else
          this.outputMap_(out, obj);
      }
      else {
        out(obj);
      }
    },

    outputObject_: function(out, obj) {
      out('<object model="', XMLUtil.escapeAttr(obj.model_.name), '">');

      var properties = obj.model_.getRuntimeProperties();
      for ( var key in properties ) {
        var prop = properties[key];

        if ( prop.name === 'parent' ) continue;
        if ( obj.instance_ && prop.name in obj.instance_ ) {
          var val = obj[prop.name];

          if ( Array.isArray(val) && val.length == 0 ) continue;

          if ( val == prop.defaultValue ) continue;

          out('<property name="', XMLUtil.escapeAttr(prop.name), '" ' +
              (typeof val === 'function' ? 'type="function"' : '') + '>');
          this.output(out, val);
          out('</property>');
        }
      }

      out('</object>');
    },

    outputMap_: function(out, obj) {
      out('<object>');

      for ( var key in obj ) {
        var val = obj[key];

        out('<property name="', XMLUtil.escapeAttr(key), '">');
        this.output(out, val);
        out('</property>');
      }

      out('</object>');
    },

    outputArray_: function(out, a) {
      if ( a.length == 0 ) return out;

      for ( var i = 0 ; i < a.length ; i++, first = false ) {
        var obj = a[i];

        if (typeof obj === 'string' || typeof obj === 'number')
          out('<i>', XMLUtil.escape(obj), '</i>');
        else
          this.output(out, obj);
      }
    },
    outputFunction_: function(out, f) {
      out(XMLUtil.escape(f.toString()));
    }
  },

  pretty: {
    stringify: function(obj) {
      var buf = [];

      this.output(buf.push.bind(buf), obj);

      return '<foam>\n' + buf.join('') + '</foam>\n';
    },

    output: function(out, obj, opt_indent) {
      var indent = opt_indent || "";

      if ( Array.isArray(obj) ) {
        this.outputArray_(out, obj, indent);
      }
      else if ( typeof obj == 'string' ) {
        out(XMLUtil.escape(obj));
      }
      else if ( obj instanceof Function ) {
        this.outputFunction_(out, obj, indent);
      }
      else if ( obj instanceof Object ) {
        try {
          if ( obj.model_ && typeof obj.model_ !== 'string' )
            this.outputObject_(out, obj, indent);
          else
            this.outputMap_(out, obj, indent);
        }
        catch (x) {
          console.log('toXMLError: ', x);
        }
      }
      else {
        out(obj);
      }
    },

    outputObject_: function(out, obj, opt_indent) {
      var indent       = opt_indent || "";
      var nestedIndent = indent + "  ";

      out(indent, '<object model="', XMLUtil.escapeAttr(obj.model_.name), '">');

      var properties = obj.model_.getRuntimeProperties();
      for ( var key in properties ) {
        var prop = properties[key];

        if ( prop.name === 'parent' ) continue;
        if ( obj.instance_ && prop.name in obj.instance_ ) {
          var val = obj[prop.name];

          if ( Array.isArray(val) && val.length == 0 ) continue;

          if ( val == prop.defaultValue ) continue;

          var type = typeof obj[prop.name] == 'function' ?
              ' type="function"' : '';
          out("\n", nestedIndent, '<property name="',
              XMLUtil.escapeAttr(prop.name), '"', type, '>');
          this.output(out, val, nestedIndent);
          out('</property>');
        }
      }

      out('\n', indent, '</object>');
      out('\n');
    },

    outputMap_: function(out, obj, opt_indent) {
      var indent       = opt_indent || "";
      var nestedIndent = indent + "  ";

      out(indent, '<object>');

      for ( var key in obj ) {
        var val = obj[key];

        out("\n", nestedIndent, '<property name="', XMLUtil.escapeAttr(key), '">');
        this.output(out, val, nestedIndent);
        out('</property>');
      }

      out("\n", indent, '</object>\n');
    },

    outputArray_: function(out, a, opt_indent) {
      if ( a.length == 0 ) return out;

      var indent       = opt_indent || "";
      var nestedIndent = indent + "  ";

      for ( var i = 0 ; i < a.length ; i++, first = false ) {
        var obj = a[i];

        out('\n');
        if (typeof obj === 'string' || typeof obj === 'number')
          out(nestedIndent, '<i>', XMLUtil.escape(obj), '</i>');
        else
          this.output(out, obj, nestedIndent);
      }
      out('\n',indent);
    },
    outputFunction_: function(out, f, opt_indent) {
      out(XMLUtil.escape(f.toString()) + '\n' + (opt_indent || ''));
    }
  }
};

XMLUtil.stringify = XMLUtil.pretty.stringify.bind(XMLUtil.pretty);
XMLUtil.output = XMLUtil.pretty.output.bind(XMLUtil.pretty);;

/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

GLOBAL.lookupCache_ = {};

function lookup(key) {
  if ( ! key ) return undefined;
  if ( ! ( typeof key === 'string' ) ) return key;

  var root  = this

  var cache;

//  if ( this.hasOwnProperty('lookupCache_') ) {
    cache = this.lookupCache_;
//  } else {
//    cache = this.lookupCache_ = {};
//  }

  var ret = cache[key];

  if ( ret === undefined ) {
    var path = key.split('.');
    for ( var i = 0 ; root && i < path.length ; i++ ) root = root[path[i]];
    ret = root;
    cache[key] = ret ? ret : null; // implements negative-caching
  }

  return ret;
}


/** Update a Context binding. **/
function set(key, value) {
  // It looks like the chrome debug console is overwriting sub.window
  // but this prevents it.
  Object.defineProperty(
    this,
    key,
    {
      value: value,
      writable: key !== 'window',
      configurable: true
    }
  );
}


function setValue(key, value) {
  var X = this;
  Object.defineProperty(
    this,
    key,
    {
      get: function() { X.set(key, value.get()); return X[key]; },
      configurable: true
    }
  );
}


/** Create a sub-context, populating with bindings from opt_args. **/
function sub(opt_args, opt_name) {
  var sub = Object.create(this);

  if ( opt_args ) for ( var key in opt_args ) {
    if ( opt_args.hasOwnProperty(key) ) {
      sub.set(key, opt_args[key]);
    }
  }

  if ( opt_name ) {
    sub.NAME = opt_name;
    // This was commented out because it appears to be very slow
//    sub.toString = function() { return 'CONTEXT(' + opt_name + ')'; };
//    sub.toString = function() { return 'CONTEXT(' + opt_name + ', ' + this.toString() + ')'; };
  }

//  console.assert(this.lookupCache_, 'Missing cache.');
//  sub.lookupCache_ = Object.create(this.lookupCache_);

  return sub;
}


function subWindow(w, opt_name, isBackground) {
  if ( ! w ) return this.sub();

  return foam.ui.Window.create({window: w, name: opt_name, isBackground: isBackground}, this).Y;
}

var X = sub({});

var foam = X.foam = {};

var registerFactory = function(model, factory) {
  // TODO
};

var registerModelForModel = function(modelType, targetModel, model) {

};

var registerFactoryForModel = function(factory, targetModel, model) {

};

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * JSON Parser.
 */
var JSONParser = SkipGrammar.create({
  __proto__: grammar,

  START: copyInput(sym('objAsString')),

  objAsString: copyInput(sym('obj')),

  obj: seq1(1, '{', repeat(sym('pair'), ','), '}'),
    pair: seq(sym('key'), ':', sym('value')),

      key: alt(
        sym('symbol'),
        sym('string')),

        symbol: noskip(str(seq(sym('char'), str(repeat(sym('alpha')))))),
          char: alt(range('a','z'), range('A','Z'), '_', '$'),
          // Slightly faster to inline sym('char') until AltParser does it automatically
          alpha: alt(range('a','z'), range('A','Z'), '_', '$', /* sym('char') */ range('0', '9')),

  // TODO(kgr): This should just be 'alt' but that isn't working for some
  // unknown reason. Probably related to SkipGrammar.  Fix and change to 
  // just 'alt'.
  value: simpleAlt(
    sym('function literal'),
    sym('expr'),
    sym('number'),
    sym('string'),
    sym('obj'),
    sym('bool'),
    sym('array')
  ),

  expr: str(seq(
    sym('symbol'), optional(str(alt(
      seq('.', sym('expr')),
      seq('(', str(repeat(sym('value'), ',')), ')')))))),

  number: noskip(seq(
    optional('-'),
    repeat(range('0', '9'), null, 1),
    optional(seq('.', repeat(range('0', '9')))))),

  string: noskip(alt(
    sym('single quoted string'),
    sym('double quoted string'))),

    'double quoted string': seq1(1, '"', str(repeat(sym('double quoted char'))), '"'),
    'double quoted char': alt(
      sym('escape char'),
      literal('\\"', '"'),
      notChar('"')),

    'single quoted string': seq1(1, "'", str(repeat(sym('single quoted char'))), "'"),
    'single quoted char': alt(
      sym('escape char'),
      literal("\\'", "'"),
      notChar("'")),

    'escape char': alt(
      literal('\\\\', '\\'),
      literal('\\n', '\n')),

  bool: alt(
    literal('true', true),
    literal('false', false)),

  array: seq1(1, '[', repeat(sym('value'), ','), ']'),

  'function literal': seq(
    'function',
    optional(sym('symbol')),
    '(',
    repeat(sym('symbol'), ','),
    ')',
    '{',
    repeat(notChar('}')), // TODO(kgr): this is a very cheap/limited hack, replace with real JS grammar.
//    repeat(sym('value'), ';'), // TODO(kgr): replace with 'statement'.
    '}')

}.addActions({
  obj: function(v) {
    var m = {};
    for ( var i = 0 ; i < v.length ; i++ ) m[v[i][0]] = v[i][2];
    return m;
  }
}), repeat0(alt(' ', '\t', '\n', '\r')));

/*
TODO: move to FUNTest
var res = JSONParser.parseString('{a:1,b:"2",c:false,d:f(),e:g(1,2),f:h.j.k(1),g:[1,"a",false,[]]}');
console.log(res);
*/
/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Simple template system modelled after JSP's.
 *
 * Syntax:
 *    <% code %>: code inserted into template, but nothing implicitly output
 *    <%= comma-separated-values %>: all values are appended to template output
 *    <%# expression %>: dynamic (auto-updating) expression is output
 *    \<new-line>: ignored
 *    %%value(<whitespace>|<): output a single value to the template output
 *    $$feature(<whitespace>|<): output the View or Action for the current Value
 */

MODEL({
  name: 'TemplateParser',
  extendsModel: 'grammar',

  methods: {
    START: sym('markup'),

    markup: repeat0(alt(
      sym('comment'),
      sym('foamTag'),
      sym('create child'),
      sym('simple value'),
      sym('live value tag'),
      sym('raw values tag'),
      sym('values tag'),
      sym('code tag'),
      sym('ignored newline'),
      sym('newline'),
      sym('single quote'),
      sym('text')
    )),

    'comment': seq1(1, '<!--', repeat0(not('-->', anyChar)), '-->'),

    'foamTag': sym('foamTag_'),
    'foamTag_': function() { }, // placeholder until gets filled in after HTMLParser is built

    'create child': seq(
      '$$',
      repeat(notChars(' $\n<{')),
      optional(JSONParser.export('objAsString'))),

    'simple value': seq('%%', repeat(notChars(' ()-"\n><:;,')), optional('()')),

    'live value tag': seq('<%#', repeat(not('%>', anyChar)), '%>'),

    'raw values tag': alt(
      seq('<%=', repeat(not('%>', anyChar)), '%>'),
      seq('{{{', repeat(not('}}}', anyChar)), '}}}')
    ),

    'values tag': seq('{{', repeat(not('}}', anyChar)), '}}'),

    'code tag': seq('<%', repeat(not('%>', anyChar)), '%>'),
    'ignored newline': literal('\\\n'),
    newline: literal('\n'),
    'single quote': literal("'"),
    text: anyChar
  }
});


var TemplateOutput = {
  /**
   * obj - Parent object.  If objects are output and have an initHTML() method, then they
   * are added to the parent by calling obj.addChild().
   **/
  // TODO(kgr): redesign, I think this is actually broken.  If we call appendHTML() of
  // a sub-view then it will be added to the wrong parent.
  create: function(obj) {
    var buf = [];
    var f = function templateOut(/* arguments */) {
      for ( var i = 0 ; i < arguments.length ; i++ ) {
        var o = arguments[i];
        if ( typeof o === 'string' ) {
          buf.push(o);
        } else {
          if ( o && o.toView_ ) o = o.toView_();
          if ( ! ( o === null || o === undefined ) ) {
            if ( o.appendHTML ) {
              o.appendHTML(this);
            } else if ( o.toHTML ) {
              buf.push(o.toHTML());
            } else {
              buf.push(o);
            }
            if ( o.initHTML && obj && obj.addChild ) obj.addChild(o);
          }
        }
      }
    };

    f.toString = function() {
      if ( buf.length === 0 ) return '';
      if ( buf.length > 1 ) buf = [buf.join('')];
      return buf[0];
    }

    return f;
  }
};


// Called from generated template code.
function elementFromString(str) {
  return str.element || ( str.element = HTMLParser.create().parseString(str).children[0] );
}

var ConstantTemplate = function(str) {
  var TemplateOutputCreate = TemplateOutput.create.bind(TemplateOutput);
  var f = function(opt_out) {
    var out = opt_out ? opt_out : TemplateOutputCreate(this);
    out(str);
    return out.toString();
  };

  f.toString = function() {
    return 'ConstantTemplate("' + str.replace(/\n/g, "\\n").replace(/"/g, '\\"') + '")';
  };

  return f;
};

var TemplateCompiler = {
  __proto__: TemplateParser,

  out: [],

  simple: true, // True iff the template is just one string literal.

  push: function() { this.simple = false; this.pushSimple.apply(this, arguments); },

  pushSimple: function() { this.out.push.apply(this.out, arguments); },

  header: 'var self = this, X = this.X, Y = this.Y;' +
    'var out = opt_out ? opt_out : TOC(this);' +
    "out('",

  footer: "');" +
    "return out.toString();"

}.addActions({
  markup: function (v) {
    var wasSimple = this.simple;
    var ret = wasSimple ? null : this.header + this.out.join('') + this.footer ;
    this.out = [];
    this.simple = true;
    return [wasSimple, ret];
  },

  'create child': function(v) {
    var name = v[1].join('');
    this.push(
      "', self.createTemplateView('", name, "'",
      v[2] ? ', ' + v[2] : '',
      "),\n'");
  },
  foamTag: function(e) {
    // A Feature
    var fName = e.getAttribute('f');
    if ( fName ) {
      this.push("', self.createTemplateView('", fName, "',{}).fromElement(FOAM(");
      this.push(JSONUtil.where(NOT_TRANSIENT).stringify(e));
      this.push('))');
    }
    // A Model
    else {
      this.push("', (function() { var tagView = X.foam.ui.FoamTagView.create({element: FOAM(");
      this.push(JSONUtil.where(NOT_TRANSIENT).stringify(e));
      this.push(')}, Y); self.addDataChild(tagView); return tagView; })() ');
    }

    this.push(",\n'");
  },
  'simple value': function(v) { this.push("',\n self.", v[1].join(''), v[2], ",\n'"); },
  'raw values tag': function (v) { this.push("',\n", v[1].join(''), ",\n'"); },
  'values tag':     function (v) { this.push("',\nescapeHTML(", v[1].join(''), "),\n'"); },
  'live value tag': function (v) { this.push("',\nself.dynamicTag('span', function() { return ", v[1].join(''), "; }.bind(this)),\n'"); },
  'code tag': function (v) { this.push("');\n", v[1].join(''), ";out('"); },
  'single quote': function () { this.pushSimple("\\'"); },
  newline: function () { this.pushSimple('\\n'); },
  text: function(v) { this.pushSimple(v); }
});


MODEL({
  name: 'TemplateUtil',

  methods: {
    /** Create a method which only compiles the template when first used. **/
    lazyCompile: function(t) {
      var delegate;

      var f = function() {
        if ( ! delegate ) {
          if ( ! t.template )
            throw 'Must arequire() template model before use for ' + this.name_ + '.' + t.name;
          else
            delegate = TemplateUtil.compile(Template.isInstance(t) ? t : Template.create(t));
        }

        return delegate.apply(this, arguments);
      };

      f.toString = function() { return delegate ? delegate.toString() : t.toString(); };

      return f;
    },

    compile_: function(t, code) {
      var args = ['opt_out'];
      for ( var i = 0 ; i < t.args.length ; i++ ) {
        args.push(t.args[i].name);
      }
      return eval('(function() { var escapeHTML = XMLUtil.escape, TOC = TemplateOutput.create.bind(TemplateOutput); return function(' + args.join(',') + '){' + code + '};})()');
    },
    compile: function(t) {
      // console.time('parse-template-' + t.name);
      var code = TemplateCompiler.parseString(t.template);
      // console.timeEnd('parse-template-' + t.name);

      // Simple case, just a string literal
      if ( code[0] ) return ConstantTemplate(t.template);

      // Need to compile an actual method
      try {
        return this.compile_(t, code[1]);
      } catch (err) {
        console.log('Template Error: ', err);
        console.log(code);
        return function() {};
      }
    },

    /**
     * Combinator which takes a template which expects an output parameter and
     * converts it into a function which returns a string.
     */
    stringifyTemplate: function (template) {
      return function() {
        var buf = [];

        this.output(buf.push.bind(buf), obj);

        return buf.join('');
      };
    },

    expandTemplate: function(self, t, opt_X) {
      /*
       * If a template is supplied as a function, treat it as a multiline string.
       * Parse function arguments to populate template.args.
       * Load template from file if external.
       * Setup template future.
       */
      var X = opt_X || self.X;

      if ( typeof t === 'function' ) {
        t = X.Template.create({
          name: t.name,
          // ignore first argument, which should be 'opt_out'
          args: t.toString().match(/\((.*?)\)/)[1].split(',').slice(1).map(function(a) {
            return X.Arg.create({name: a.trim()});
          }),
          template: multiline(t)});
      } else if ( typeof t === 'string' ) {
        t = docTemplate = X.Template.create({
          name: 'body',
          template: t
        });
      } else if ( ! t.template && ! t.code ) {
        var future = afuture();
        var path   = self.sourcePath;

        t.futureTemplate = future.get;
        path = path.substring(0, path.lastIndexOf('/')+1);
        path += self.name + '_' + t.name + '.ft';

        if ( window.XMLHttpRequest ) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", path);
          xhr.asend(function(data) {
            t.template = data;
            future.set(Template.create(t));
          });
        } else {
          var fs = require('fs');
          fs.readFile(path, function(err, data) {
            t.template = data.toString();
            future.set(Template.create(t));
          });
        }
      } else if ( typeof t.template === 'function' ) {
        t.template = multiline(t.template);
      }

      if ( ! t.futureTemplate ) t.futureTemplate = aconstant(t);

      // We haven't FOAMalized the template, and there's no crazy multiline functions.
      // Note that Model and boostrappy models must use this case, as Template is not
      // yet defined at bootstrap time. Use a Template object definition with a bare
      // string template body in those cases.
      if ( ! t.template$ ) {
        t = ( typeof X.Template !== 'undefined' ) ? JSONUtil.mapToObj(X, t, X.Template) : t ;
      }

      return t;
    },

    expandModelTemplates: function(self) {
      var templates = self.templates;
      for ( var i = 0; i < templates.length; i++ ) {
        templates[i] = TemplateUtil.expandTemplate(self, templates[i]);
      }
    }
  }
});


/** Is actually synchronous but is replaced in ChromeApp with an async version. **/
var aeval = function(src) {
  return aconstant(eval('(' + src + ')'));
};

var aevalTemplate = function(t, model) {
  return aseq(
    t.futureTemplate,
    function(ret, t) {
      ret(TemplateUtil.lazyCompile(t));
    });
};

var escapeHTML = XMLUtil.escape, TOC = TemplateOutput.create.bind(TemplateOutput);

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var $documents = [];

if ( window ) $documents.push(window.document);

// TODO: clean this up, hide $WID__ in closure
var $WID__ = 0;
function $addWindow(w) {
   w.window.$WID = $WID__++;
   $documents.push(w.document);
}
function $removeWindow(w) {
  for ( var i = $documents.length - 1 ; i >= 0 ; i-- ) {
    if ( ! $documents[i].defaultView || $documents[i].defaultView === w )
      $documents.splice(i,1);
  }
}

/** Replacement for getElementById **/
// TODO(kgr): remove this is deprecated, use X.$ instead()
var $ = function (id) {
  console.log('Deprecated use of GLOBAL.$.');
  for ( var i = 0 ; i < $documents.length ; i++ ) {
    if ( document.FOAM_OBJECTS && document.FOAM_OBJECTS[id] )
      return document.FOAM_OBJECTS[id];

    var ret = $documents[i].getElementById(id);

    if ( ret ) return ret;
  }
  return undefined;
};
/** Replacement for getElementByClassName **/
// TODO(kgr): remove this is deprecated, use X.$$ instead()
var $$ = function (cls) {
  console.log('Deprecated use of GLOBAL.$$.');
  for ( var i = 0 ; i < $documents.length ; i++ ) {
    var ret = $documents[i].getElementsByClassName(cls);

    if ( ret.length > 0 ) return ret;
  }
  return [];
};


var FOAM = function(map, opt_X, seq) {
   var obj = JSONUtil.mapToObj(opt_X || X, map, undefined, seq);
   return obj;
};

/**
 * Register a lazy factory for the specified name within a
 * specified context.
 * The first time the name is looked up, the factory will be invoked
 * and its value will be stored in the named slot and then returned.
 * Future lookups to the same slot will return the originally created
 * value.
 **/
FOAM.putFactory = function(ctx, name, factory) {
  ctx.__defineGetter__(name, function() {
    console.log('Bouncing Factory: ', name);
    delete ctx[name];
    return ctx[name] = factory();
  });
};


var   USED_MODELS = {};
var UNUSED_MODELS = {};
var NONMODEL_INSTANCES = {}; // for things such as interfaces

FOAM.browse = function(model, opt_dao, opt_X) {
   var Y = opt_X || X.sub(undefined, "FOAM BROWSER");

   if ( typeof model === 'string' ) model = Y[model];

   var dao = opt_dao || Y[model.name + 'DAO'] || Y[model.plural];

   if ( ! dao ) {
      Y[model.name + 'DAO'] = [].dao;
   }

   var ctrl = Y.foam.ui.DAOController.create({
     model:     model,
     dao:       dao,
     useSearchView: false
   });

  if ( ! Y.stack ) {
    var w = opt_X ? opt_X.window : window;
    Y.stack = Y.foam.ui.StackView.create();
    var win = Y.foam.ui.layout.Window.create({ window: w, data: Y.stack }, Y);
    document.body.insertAdjacentHTML('beforeend', win.toHTML());
    win.initHTML();
    Y.stack.setTopView(ctrl);
  } else {
    Y.stack.pushView(ctrl);
  }
};


var arequire = function(modelName, opt_X) {
  var X = opt_X || GLOBAL.X;
  var model = X.lookup(modelName);
  if ( ! model ) {
    if ( ! X.ModelDAO ) {
      // if ( modelName !== 'Template' ) console.warn('Unknown Model in arequire: ', modelName);
      return aconstant();
    }

    // check whether we have already hit the ModelDAO to load the model
    if ( ! X.arequire$ModelLoadsInProgress ) {
      X.set('arequire$ModelLoadsInProgress', {} );
    } else {
      if ( X.arequire$ModelLoadsInProgress[modelName] ) {
        return X.arequire$ModelLoadsInProgress[modelName];
      }
    }

    var future = afuture();
    X.arequire$ModelLoadsInProgress[modelName] = future.get;

    X.ModelDAO.find(modelName, {
      put: function(m) {
        // Contextualize the model for this context
        m.X = X;

        m.arequire()(function(m) {
          X.arequire$ModelLoadsInProgress[modelName] = false;
          X.registerModel(m);
          future.set(m);
        });
      },
      error: function() {
        var args = argsToArray(arguments);
        console.warn.apply(console, ['Could not load model: ', modelName].concat(args));
        X.arequire$ModelLoadsInProgress[modelName] = false;
        future.set(undefined);
      }
    });

    return future.get;
  }

  return model.arequire()
}

var FOAM_POWERED = '<a style="text-decoration:none;" href="https://github.com/foam-framework/foam/" target="_blank">\
<font size=+1 face="catull" style="text-shadow:rgba(64,64,64,0.3) 3px 3px 4px;">\
<font color="#3333FF">F</font><font color="#FF0000">O</font><font color="#FFCC00">A</font><font color="#33CC00">M</font>\
<font color="#555555" > POWERED</font></font></a>';

/** Lookup a '.'-separated package path, creating sub-packages as required. **/
function packagePath(X, path) {
  function packagePath_(Y, path, i) {
    if ( i === path.length ) return Y;
    if ( ! Y[path[i]] ) {
      Y[path[i]] = {};
      // console.log('************ Creating sub-path: ', path[i]);
      if ( i == 0 ) GLOBAL[path[i]] = Y[path[i]];
    }
    return packagePath_(Y[path[i]], path, i+1);
  }
  return path ? packagePath_(X, path.split('.'), 0) : GLOBAL;
}

function registerModel(model, opt_name, fastMode) {
  var root    = model.package ? this : GLOBAL;
  var name    = model.name;
  var package = model.package;

  if ( opt_name ) {
    var a = opt_name.split('.');
    name = a.pop();
    package = a.join('.');
  }

  var path = packagePath(root, package);
  if ( fastMode )
    path[name] = model;
  else
    Object.defineProperty(path, name, { value: model, configurable: true });

  // TODO: this is broken
  // update the cache if this model was already FOAM.lookup'd
  if ( root.lookupCache_ ) {
    var cache = root.lookupCache_;
    var modelRegName = (package ? package + '.' : '') + name;
//    if ( cache[modelRegName] ) {
      // console.log("registerModel: in lookupCache_, replaced model ", modelRegName );
      cache[modelRegName] = model;
//    }
  }

  this.onRegisterModel(model);
}


var CLASS = function(m) {

  // Don't Latch these Models, as we know that we'll need them on startup
  var EAGER = {
    'Method': true,
    'BooleanProperty': true,
    'Action': true,
    'FunctionProperty': true,
    'Constant': true,
    'Message': true,
    'ArrayProperty': true,
    'StringArrayProperty': true,
    'Template': true,
    'Arg': true,
    'Relationship': true,
    'ViewFactoryProperty': true,
    'FactoryProperty': true,
    'foam.ui.Window': true,
    'StringProperty': true,
    'foam.html.Element': true,
    'Expr': true,
    'AbstractDAO': true
  };

  /** Lazily create and register Model first time it's accessed. **/
  function registerModelLatch(path, m) {
    var id = m.package ? m.package + '.' + m.name : m.name;

    if ( EAGER[id] ) {
      USED_MODELS[id] = true;
      var work = [];
      var model = JSONUtil.mapToObj(X, m, Model, work);
      if ( work.length > 0 ) {
        model.extra__ = aseq.apply(null, work);
      }

      X.registerModel(model, undefined, true);

      return model;
    }

    GLOBAL.lookupCache_[id] = undefined;
    UNUSED_MODELS[id] = true;
    var triggered = false;

    //console.log("Model Getting defined: ", m.name, X.NAME);
    Object.defineProperty(m.package ? path : GLOBAL, m.name, {
      get: function triggerModelLatch() {
        if ( triggered ) return null;
        triggered = true;
        // console.time('registerModel: ' + id);
        USED_MODELS[id] = true;
        UNUSED_MODELS[id] = undefined;

        var work = [];
        // console.time('buildModel: ' + id);
        var model = JSONUtil.mapToObj(X, m, Model, work);
        // console.timeEnd('buildModel: ' + id);

        if ( work.length > 0 ) {
          model.extra__ = aseq.apply(null, work);
        }

        X.registerModel(model);

        // console.timeEnd('registerModel: ' + id);
        return model;
      },
      configurable: true
    });
  }

  if ( document && document.currentScript ) m.sourcePath = document.currentScript.src;

  registerModelLatch(packagePath(X, m.package), m);
}

var MODEL = CLASS;

function INTERFACE(imodel) {
  // Unless in DEBUG mode, just discard interfaces as they're only used for type checking.
  // if ( ! DEBUG ) return;
  var i = JSONUtil.mapToObj(X, imodel, Interface);
  packagePath(X, i.package)[i.name] = i;

  var id = i.package ? i.package + '.' + i.name : i.name;
  NONMODEL_INSTANCES[id] = true;
}


/** Called when a Model is registered. **/
function onRegisterModel(m) {
  // NOP
}

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The Prototype for all Generated Prototypes.
 * The common ancestor of all FOAM Objects.
 **/
var FObject = {
  __proto__: PropertyChangeSupport,

  name_: 'FObject',

  get Y() {
    return Object.prototype.hasOwnProperty.call(this, 'Y_') ?
        this.Y_ :
        ( this.Y_ = DEBUG ?
        this.X.sub({}, (this.X.NAME ? this.X.NAME : '') + 'Y') : this.X.sub() );
  },

  replaceModel_: function(model, otherModel, X) {
    while ( otherModel ) {
      // this name mangling has to use the primary model's package, otherwise
      // it's ambiguous which model a replacement is intended for:
      //     ReplacementThing -> package.Thing or foo.Thing or bar.Thing...
      //  vs foo.ReplacementThing -> foo.Thing
      // This means you must put your model-for-models in the same package
      // as the primary model-to-be-replaced.
      var replacementName =                                 // want: package.otherPrimaryModel
        ( model.package   ? model.package + '.' : '' ) +          // package.
        ( otherModel.name ? otherModel.name     : otherModel ) +  // other
        model.name ;                                              // PrimaryModel

      var replacementModel = X.lookup(replacementName);

      if ( replacementModel ) return replacementModel;

      otherModel = X.lookup(otherModel.extendsModel);
    }

    return undefined;
  },

  create_: function() { return Object.create(this); },

  create: function(args, opt_X) {
    // console.log('**** create ', this.model_.name, this.model_.count__ = (this.model_.count__ || 0)+1);
    // check for a model-for-model replacement, only if args.model is a Model instance
    if ( args && args.model && (opt_X || X).Model.isInstance(args.model) ) {
      var ret = this.replaceModel_(this.model_, args.model, opt_X || X);
      if ( ret ) return ret.create(args, opt_X);
    }

//    window.CREATES = (window.CREATES || {});
//    var id = this.model_.id ||
//      ((this.model_.package ? this.model_.package + '.' : '' ) + this.model_.name);

//    var log = window.CREATES[id] = window.CREATES[id] || {
//      count:0,
//      min: Infinity,
//      max: 0,
//      sum: 0,
//      all: []
//    };
//    log.count++;
//    var time = window.performance.now();

    var o = this.create_(this);
    o.instance_ = {};
    o.X = opt_X || X;

    if ( this.model_.instance_.imports_ && this.model_.instance_.imports_.length ) {
      if ( ! Object.prototype.hasOwnProperty.call(this, 'imports__') ) {
        this.imports__ = this.model_.instance_.imports_.map(function(e) {
          var s = e.split(' as ');
          return [s[0], s[1] || s[0]];
        });
      }
      for ( var i = 0 ; i < this.imports__.length ; i++ ) {
        var im = this.imports__[i];
        // Don't import from Context if explicitly passed in args
        if ( ( ! args || ! args.hasOwnProperty(im[1]) ) && typeof o.X[im[0]] !== 'undefined' ) o[im[1]] = o.X[im[0]];
      }
    }

//    if ( typeof args === 'object' ) o.copyFrom(args);

    if ( o.model_ ) {
      var agents = this.initAgents();
      for ( var i = 0 ; i < agents.length ; i++ ) agents[i][1](o, o.X, args);
    }

    o.init(args);

//    var end = window.performance.now();
//    time = end - time;
//    log.min = Math.min(time, log.min);
//    if ( time > log.max ) {
//      log.max = time;
//      log.maxObj = o;
//    }
//    log.all.push({
//      name: o.name,
//      time: time,
//      obj: o,
//    });
//    log.sum += time;
//    log.avg = log.sum / log.count;

    return o;
  },

  init: nop,

  // TODO: document
  xbind: function(map) {
    var newModel = {
      __proto__: this,
      create: function(args, X) {
        var createArgs = {};
        var key;

        // If args is a modelled object, just keep data from instance_.
        // TODO(kgr): Remove instance_ part when FObject.hasOwnProperty removed.
        args = args ? (args.instance_ || args) : {};

        for ( key in args ) {
          if ( args.hasOwnProperty(key) ) createArgs[key] = args[key];
        }
        for ( key in map ) {
          if ( ! createArgs.hasOwnProperty(key) ) createArgs[key] = map[key];
        }
        return this.__proto__.create(createArgs, X);
      },
      xbind: function(m2) {
        for ( var key in map ) {
          if ( ! m2.hasOwnProperty(key) ) m2[key] = map[key];
        }
        return this.__proto__.xbind(m2);
      }
    };

    if ( this.required__ )
      newModel.required__ = aseq(this.required__, aconstant(newModel));

    return newModel;
  },

  /** Context defaults to the global namespace by default. **/
  X: X,

  addInitAgent: function(priority, desc, agent) {
    agent.toString = function() { return desc; };
    this.initAgents_.push([priority, agent]);
  },

  initAgents: function() {
    if ( ! this.model_ ) return;

    // this == prototype
    if ( ! Object.hasOwnProperty.call(this, 'initAgents_') ) {
      var agents = this.initAgents_ = [];
      var self = this;

      // Four cases for export: 'this', a method, a property value$, a property
      Object_forEach(this.model_.instance_.exports_, function(e) {
        var exp = e.split('as ');

        if ( exp.length == 0 ) return;

        var key   = exp[0].trim();
        var alias = exp[1] || exp[0];

        if ( key ) {
          var asValue = key !== '$' && key != '$$' && key.charAt(key.length-1) == '$';
          if ( asValue ) key = key.slice(0, key.length-1);

          var prop = self.model_.getProperty(key);
          if ( prop ) {
            if ( asValue ) {
              self.addInitAgent(1, 'export property value ' + key, function(o, X) { o.Y.set(alias, o[prop.name$_]); });
            } else {
              self.addInitAgent(1, 'export property ' + key, function(o, X) { o.Y.setValue(alias, o[prop.name$_]); });
            }
          } else {
            self.addInitAgent(0, 'export other ' + key, function(o, X) {
              var out = typeof o[key] === "function" ? o[key].bind(o) : o[key];
              o.Y.set(alias, out);
            });
          }
        } else {
          // Exporting 'this'
          self.addInitAgent(0, 'export this', function(o, X) { o.Y.set(alias, o); });
        }
      });

      var fastInit = {
        Property: true,
        Method: true,
/*        Listener: true,
        Action: true,
        Constant: true,
        Message: true,
        Template: true,
        PropertyView: true,
//        TextFieldView: true,
        SimpleValue: true,
        DocumentationProperty: true,
//        Model: true,
        IntProperty: true,
        Element: true,
        StringProperty: true,
        BooleanProperty: true
*/      }[this.name_];

      if ( fastInit ) {
        var keys = {};
        var ps = this.model_.getRuntimeProperties();
        for ( var i = 0 ; i < ps.length ; i++ ) {
          var prop = ps[i];
          keys[prop.name] = keys[prop.name$_] = true;
        }
        this.addInitAgent(0, 'fast copy args', function fastCopyArgs(o, X, m) {
          if ( m.instance_ ) {
            m = m.instance_;
            for ( var key in m ) o[key] = m[key];
          } else {
            for ( var key in m ) if ( keys[key] ) o[key] = m[key];
          }
        });
      } /*else {
        this.addInitAgent(0, 'fast copy args', function(o, X, m) {
          console.log('slowInit: ', self.name_);
        });

      }*/

      var ps = this.model_.getRuntimeProperties();
      for ( var i = 0 ; i < ps.length ; i++ ) {
        var prop = ps[i];
        if ( prop.initPropertyAgents ) {
          prop.initPropertyAgents(self, fastInit);
        } else {
          (function (name) {
            self.addInitAgent(
              0,
              'set proto-property ' + name,
              function setProtoProperty(o, X, m) {
                if ( m && m.hasOwnProperty(name) )
                  o[name] = m[name];
              });
          })(prop.name);
        }
      }

      /*
      this.addInitAgent(9, 'copyFrom', function(o, X, m) {
        if( m ) for ( var key in m ) o[key] = m[key];
      });
      */
      // Add shortcut create() method to Models
      self.addInitAgent(0, 'Add create() to Model', function(o, X) {
        if ( Model.isInstance(o) && o.name != 'Model' ) o.create = BootstrapModel.create;
      });

      // Works if sort is 'stable', which it isn't in Chrome
      // agents.sort(function(o1, o2) { return o1[0] - o2[0]; });

      // TODO(kgr): make a stableSort() function in stdlib
      for ( var i = 0 ; i < agents.length ; i++ ) agents[i][2] = i;
      agents.sort(CompoundComparator(
        function(o1, o2) { return o1[0] - o2[0]; },
        function(o1, o2) { return o1[2] - o2[2]; }));

      // For debugging, prints list of init agents.
      /*
      for ( var i = 0 ; i < agents.length ; i++ )
        console.log(i, agents[i][0], agents[i][1].toString());
      */
    }

    return this.initAgents_;
  },

  fromElement: function(e) {
    var RESERVED_ATTRS = {
      id: true, model: true, view: true, showactions: true, oninit: true
    };
    var elements = this.elementMap_;

    // Build a map of properties keyed off of 'name'
    // TODO: do we have a method to lookupIC?
    if ( ! elements ) {
      elements = {};
      var properties = this.model_.getRuntimeProperties();
      for ( var i = 0 ; i < properties.length ; i++ ) {
        var p = properties[i];
        if ( ! RESERVED_ATTRS[p.name] ) {
          elements[p.name] = p;
          elements[p.name.toUpperCase()] = p;
        }
        elements['p:' + p.name] = p;
        elements['P:' + p.name.toUpperCase()] = p;
      }
      this.elementMap_ = elements;
    }

    for ( var i = 0 ; i < e.attributes.length ; i++ ) {
      var attr = e.attributes[i];
      var p    = elements[attr.name];
      var val  = attr.value;
      if ( p ) {
        if ( val.startsWith('#') ) {
          val = val.substring(1);
          var $val = this.X.$(val);
          if ( $val ) {
            this[attr.name] = this.X.$(val);
          } else {
            p.fromString.call(this, val, p);
          }
        } else {
          // Call fromString() for attribute values because they're
          // String values, not Elements.
          p.fromString.call(this, val, p);
        }
      } else {
        if ( ! RESERVED_ATTRS[attr.name] )
          console.warn('Unknown attribute name: "' + attr.name + '"');
      }
    }

    for ( var i = 0 ; i < e.children.length ; i++ ) {
      var c = e.children[i];
      var p = elements[c.nodeName];
      if ( p ) {
        p.fromElement.call(this, c, p);
      } else {
        console.warn('Unknown element name: "' + c.nodeName + '"');
      }
    }

    return this;
  },

  createFOAMGetter: function(name, getter) {
    var stack = Events.onGet.stack;
    return function FOAMGetter() {
      var value = getter.call(this, name);
      var f = stack[0];
      f && f(this, name, value);
      return value;
    };
  },

  createFOAMSetter: function(name, setter) {
    var stack = Events.onSet.stack;
    return function FOAMSetter(newValue) {
      var f = stack[0];
      if ( f && ! f(this, name, newValue) ) return;
      setter.call(this, newValue, name);
    };
  },

  toString: function() {
    // TODO: do something to detect loops which cause infinite recurrsions.
    // console.log(this.model_.name + "Prototype");
    return this.model_.name + "Prototype";
    // return this.toJSON();
  },

  hasOwnProperty: function(name) {
    return typeof this.instance_[name] !== 'undefined';
//    return this.instance_.hasOwnProperty(name);
  },

  writeActions: function(other, out) {
    var properties = this.model_.getRuntimeProperties();

    for ( var i = 0, property ; property = properties[i] ; i++ ) {
      if ( property.actionFactory ) {
        var actions = property.actionFactory(this, property.f(this), property.f(other));
        for (var j = 0; j < actions.length; j++)
          out(actions[j]);
      }
    }
  },

  equals: function(other) { return this.compareTo(other) == 0; },

  compareTo: function(other) {
    if ( other === this ) return 0;
    if ( this.model_ !== other.model_ ) {
      // TODO: This provides unstable ordering if two objects have a different model_
      // but they have the same id.
      return this.model_.id.compareTo(other.model_ && other.model_.id) || 1;
    }

    var ps = this.model_.getRuntimeProperties();

    for ( var i = 0 ; i < ps.length ; i++ ) {
      var r = ps[i].compare(this, other);

      if ( r ) return r;
    }

    return 0;
  },

  diff: function(other) {
    var diff = {};

    var properties = this.model_.getRuntimeProperties();
    for ( var i = 0, property ; property = properties[i] ; i++ ) {
      if ( Array.isArray(property.f(this)) ) {
        var subdiff = property.f(this).diff(property.f(other));
        if ( subdiff.added.length !== 0 || subdiff.removed.length !== 0 ) {
          diff[property.name] = subdiff;
        }
        continue;
      }

      if ( property.f(this).compareTo(property.f(other)) !== 0) {
        diff[property.name] = property.f(other);
      }
    }

    return diff;
  },

  /** Reset a property to its default value. **/
  clearProperty: function(name) { delete this.instance_[name]; },

  defineProperty: function(prop) {
    var name = prop.name;
    prop.name$_ = name + '$';

    // Add a 'name$' psedo-property if not already defined
    // Faster to define on __ROOT__, but not as good for auto-completion
    var obj = DEBUG ? this : __ROOT__;
    if ( ! obj.__lookupGetter__(prop.name$_) ) {
      Object.defineProperty(obj, prop.name$_, {
        get: function getValue() { return this.propertyValue(name); },
        set: function setValue(value) { Events.link(value, this.propertyValue(name)); },
        configurable: true
      });
    }

    var pgetter, psetter;

    if ( prop.getter ) {
      pgetter = this.createFOAMGetter(name, prop.getter);
    } else {
      if ( prop.lazyFactory || prop.factory ) {
        var f = prop.lazyFactory || prop.factory;
        getter = function factory() {
          if ( typeof this.instance_[name] === 'undefined' ) {
            this.instance_[name] = null; // prevents infinite recursion
            // console.log('Ahead of order factory: ', prop.name);
            //debugger;
            var val = f.call(this, prop);
            if ( typeof val === 'undefined' ) val = null;
            this[name] = val;
          }
          return this.instance_[name];
        };
      } else if ( prop.defaultValueFn ) {
        var f = prop.defaultValueFn;
        getter = function defaultValueFn() {
          return typeof this.instance_[name] !== 'undefined' ? this.instance_[name] : f.call(this, prop);
        };
      } else {
        var defaultValue = prop.defaultValue;
        getter = function getInstanceVar() {
          return typeof this.instance_[name] !== 'undefined' ? this.instance_[name] : defaultValue;
        };
      }
      pgetter = this.createFOAMGetter(name, getter);
    }

    if ( prop.setter ) {
      psetter = this.createFOAMSetter(name, prop.setter);
    } else {
      var setter = function setInstanceValue(oldValue, newValue) {
        this.instance_[name] = newValue;
      };

      if ( prop.type === 'int' || prop.type === 'float' ) {
        setter = (function(setter) { return function numberSetter(oldValue, newValue) {
          setter.call(this, oldValue, typeof newValue !== 'number' ? Number(newValue) : newValue);
        }; })(setter);
      }

      if ( prop.onDAOUpdate ) {
        if ( typeof prop.onDAOUpdate === 'string' ) {
          setter = (function(setter, onDAOUpdate, listenerName) { return function onDAOUpdateSetter(oldValue, newValue) {
            setter.call(this, oldValue, newValue);

            var listener = this[listenerName] || ( this[listenerName] = this[onDAOUpdate].bind(this) );

            if ( oldValue ) oldValue.unlisten(listener);
            if ( newValue ) {
              newValue.listen(listener);
              listener();
            }
          }; })(setter, prop.onDAOUpdate, prop.name + '_onDAOUpdate');
        } else {
          setter = (function(setter, onDAOUpdate, listenerName) { return function onDAOUpdateSetter2(oldValue, newValue) {
            setter.call(this, oldValue, newValue);

            var listener = this[listenerName] || ( this[listenerName] = onDAOUpdate.bind(this) );

            if ( oldValue ) oldValue.unlisten(listener);
            if ( newValue ) {
              newValue.listen(listener);
              listener();
            }
          }; })(setter, prop.onDAOUpdate, prop.name + '_onDAOUpdate');
        }
      }

      if ( prop.postSet ) {
        setter = (function(setter, postSet) { return function postSetSetter(oldValue, newValue) {
          setter.call(this, oldValue, newValue);
          postSet.call(this, oldValue, newValue, prop)
        }; })(setter, prop.postSet);
      }

      var propertyTopic = PropertyChangeSupport.propertyTopic(name);
      setter = (function(setter) { return function propertyChangeSetter(oldValue, newValue) {
        setter.call(this, oldValue, newValue);
        this.propertyChange_(propertyTopic, oldValue, newValue);
      }; })(setter);

      if ( prop.preSet ) {
        setter = (function(setter, preSet) { return function preSetSetter(oldValue, newValue) {
          setter.call(this, oldValue, preSet.call(this, oldValue, newValue, prop));
        }; })(setter, prop.preSet);
      }

      if ( prop.adapt ) {
        setter = (function(setter, adapt) { return function adaptSetter(oldValue, newValue) {
          setter.call(this, oldValue, adapt.call(this, oldValue, newValue, prop));
        }; })(setter, prop.adapt);
      }

      setter = (function(setter, defaultValue) { return function setInstanceVar(newValue) {
        setter.call(this, typeof this.instance_[name] === 'undefined' ? defaultValue : this.instance_[name], newValue);
      }; })(setter, prop.defaultValue);

      psetter = this.createFOAMSetter(name, setter);
    }

    Object.defineProperty(this, name, { get: pgetter, set: psetter, configurable: true });

    // Let the property install other features into the Prototype
    prop.install && prop.install.call(this, prop);
  },

  addMethod: function(name, method) {
    if ( this.__proto__[name] ) {
      override(this, name, method);
    } else {
      this[name] = method;
    }
  },

  hashCode: function() {
    var hash = 17;

    var properties = this.model_.getRuntimeProperties();
    for ( var i = 0 ; i < properties.length ; i++ ) {
      var prop = this[properties[i].name];
      var code = ! prop ? 0 :
        prop.hashCode   ? prop.hashCode()
                        : prop.toString().hashCode();

      hash = ((hash << 5) - hash) + code;
      hash &= hash;
    }

    return hash;
  },

  // TODO: this should be monkey-patched from a 'ProtoBuf' library
  toProtobuf: function() {
    var out = ProtoWriter.create();
    this.outProtobuf(out);
    return out.value;
  },

  // TODO: this should be monkey-patched from a 'ProtoBuf' library
  outProtobuf: function(out) {
    var proprties = this.model_getRuntimeProperties();
    for ( var i = 0 ; i < properties.length ; i++ ) {
      var prop = properties[i];
      if ( Number.isFinite(prop.prototag) )
        prop.outProtobuf(this, out);
    }
  },

  /** Create a shallow copy of this object. **/
  clone: function() {
    var c = Object.create(this.__proto__);
    c.instance_ = {};
    c.X = this.X;
    for ( var key in this.instance_ ) {
      var value = this[key];
      if ( value ) {
        var prop = this.model_.getProperty(key);
        if ( prop && prop.cloneProperty )
          c.instance_[key] = prop.cloneProperty.call(prop, value);
      }
    }
    return c;
  },

  /** Create a deep copy of this object. **/
  deepClone: function() {
    var c = Object.create(this.__proto__);
    c.instance_ = {};
    c.X = this.X;
    for ( var key in this.instance_ ) {
      var value = this[key];
      if ( value ) {
        var prop = this.model_.getProperty(key);
        if ( prop && prop.deepCloneProperty )
          c.instance_[key] = prop.deepCloneProperty.call(prop, value);
      }
    }
    return c;
  },

  /** @return this **/
  copyFrom: function(src) {
/*
    // TODO: remove the 'this.model_' check when all classes modelled
    if ( src && this.model_ ) {
      for ( var i = 0 ; i < this.model_.properties.length ; i++ ) {
        var prop = this.model_.properties[i];

        // If the src is modelled, and it has an instance_
        //   BUT the instance doesn't have a value for the property,
        //   then don't copy this value over since it's a default value.
        if ( src.model_ && src.instance_ &&
            !src.instance_.hasOwnProperty(prop.name) ) continue;

        if ( prop.name in src ) this[prop.name] = src[prop.name];
      }
    }
*/

    if ( src && this.model_ ) {
      var ps = this.model_.getRuntimeProperties();
      for ( var i = 0 ; i < ps.length ; i++ ) {
        var prop = ps[i];
        if ( src.hasOwnProperty(prop.name) ) this[prop.name] = src[prop.name];
        if ( src.hasOwnProperty(prop.name$_) ) this[prop.name$_] = src[prop.name$_];
      }
    }

    return this;
  },

  output: function(out) { return JSONUtil.output(out, this); },

  toJSON: function() { return JSONUtil.stringify(this); },

  toXML: function() { return XMLUtil.stringify(this); },

  write: function(document, opt_view) {
    //console.warn("FObject.write() for ", this.model_.id," is not safe when called from async code.");
    var view = (opt_view || X.foam.ui.DetailView).create({
      model: this.model_,
      data: this,
      showActions: true
    });

    view.write(document);
  },

  defaultView: function(opt_view) {
    return (opt_view || X.foam.ui.DetailView).create({
      model: this.model_,
      data: this,
      showActions: true
    });
  },

  decorate: function(name, func, that) {
    var delegate = this[name];
    this[name] = function() {
      return func.call(this, that, delegate.bind(this), arguments);
    };
    return this;
  },

  addDecorator: function(decorator) {
    if ( decorator.decorateObject )
      decorator.decorateObject(this);

    for ( var i = 0 ; i < decorator.model_.methods.length ; i++ ) {
      var method = decorator.model_.methods[i];
      if ( method.name !== 'decorateObject' )
        this.decorate(method.name, method.code, decorator);
    }
    return this;
  }

};

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Prototype for original proto-Models.
 * Used during bootstrapping to create the real Model
 * and PropertyModel.
 *
 * TODO: The handling of the various property types (properties,
 *   templates, listeners, etc.) shouldn't be handled here because
 *   it isn't extensible.  The handling should be defined in the
 *   properties property (so meta).
 *
 * TODO: Is still used by a few views in view.js.  Those views
 * should be fixed and then BootstrapModel should be deleted at
 * the end of metamodel.js once the real Model is created.
 **/

function defineLocalProperty(cls, name, factory) {
  Object.defineProperty(cls, name, { get: function() {
    console.assert(this !== cls, 'Called property getter from prototype: ' + name);
    var value = factory.call(this);
    Object.defineProperty(this, name, { configurable: true, value: value });
    return value;
  }, configurable: true });
}

this.Constant = null;
this.Method = null;
this.Action = null;
this.Relationship = null;

/**
 * Override a method, making calling the overridden method possible by
 * calling this.SUPER();
 **/

function override(cls, methodName, method) {
  var super_ = cls[methodName];

  var SUPER = function() { return super_.apply(this, arguments); };

  var slowF = function(OLD_SUPER, args) {
    try {
      return method.apply(this, args);
    } finally {
      this.SUPER = OLD_SUPER;
    }
  };
  var f = function() {
    var OLD_SUPER = this.SUPER;
    this.SUPER = SUPER;

    if ( OLD_SUPER ) return slowF.call(this, OLD_SUPER, arguments);

    // Fast-Path when it doesn't matter if we restore SUPER or not
    var ret = method.apply(this, arguments);
    this.SUPER = null;
    return ret;
  };
  f.toString = function() { return method.toString(); };
  f.super_ = super_;

  cls[methodName] = f;
}


var BootstrapModel = {

  __proto__: PropertyChangeSupport,

  name_: 'BootstrapModel <startup only, error if you see this>',

  addTraitToModel_: function(traitModel, parentModel) {
    var parentName = parentModel && parentModel.id ? parentModel.id.replace(/\./g, '__') : '';
    var traitName  = traitModel.id ? traitModel.id.replace(/\./g, '__') : '';
    var name       = parentName + '_ExtendedWith_' + traitName;

    if ( ! lookup(name) ) {
      var model = traitModel.clone();
      model.package = '';
      model.name = name;
      model.extendsModel = parentModel && parentModel.id;
      model.models = traitModel.models; // unclone sub-models, we don't want multiple copies of them floating around
      GLOBAL.X.registerModel(model);
    }

    var ret = GLOBAL.X.lookup(name);
    console.assert(ret, 'Error adding Trait to Model, unknown name: ', name);
    return ret;
  },

  buildProtoImports_: function(props) {
    // build imports as psedo-properties
    Object_forEach(this.instance_.imports_, function(i) {
      var imp   = i.split(' as ');
      var key   = imp[0];
      var alias = imp[1] || imp[0];

      if ( alias.length && alias.charAt(alias.length-1) == '$' )
        alias = alias.slice(0, alias.length-1);

      if ( ! this.getProperty(alias) ) {
        var prop = Property.create({
          name:      alias,
          transient: true,
          hidden:    true
        });
        // Prevent imports from being cloned.
        prop.cloneProperty = prop.deepCloneProperty = null;
        props.push(prop);
      }
    }.bind(this));
  },

  buildProtoProperties_: function(cls, extendsModel, props) {
    // build properties
    for ( var i = 0 ; i < props.length ; i++ ) {
      var p = props[i];
      if ( extendsModel ) {
        var superProp = extendsModel.getProperty(p.name);
        if ( superProp ) {
          var p0 = p;
          p = superProp.clone().copyFrom(p);
          // A more elegant way to do this would be to have a ModelProperty
          // which has a ModelPropertyProperty called 'reduceWithSuper'.
          if ( p0.adapt && superProp.adapt ) {
//            console.log('(DEBUG) sub adapt: ', this.name + '.' + p.name);
            p.adapt = (function(a1, a2) { return function(oldValue, newValue, prop) {
              return a2.call(this, oldValue, a1.call(this, oldValue, newValue, prop), prop);
            };})(p0.adapt, superProp.adapt);
          }
          if ( p0.preSet && superProp.preSet ) {
//            console.log('(DEBUG) sub preSet: ', this.name + '.' + p.name);
            p.preSet = (function(a1, a2) { return function(oldValue, newValue, prop) {
              return a2.call(this, oldValue, a1.call(this, oldValue, newValue, prop), prop);
            };})(p0.preSet, superProp.preSet);
          }
          if ( p0.postSet && superProp.postSet ) {
//            console.log('(DEBUG) sub postSet: ', this.name + '.' + p.name);
            p.postSet = (function(a1, a2) { return function(oldValue, newValue, prop) {
              a2.call(this, oldValue, newValue, prop);
              a1.call(this, oldValue, newValue, prop);
            };})(p0.postSet, superProp.postSet);
          }
          props[i] = p;
          this[constantize(p.name)] = p;
        }
      }
      cls.defineProperty(p);
    }
    this.propertyMap_ = null;
  },

  buildProtoMethods_: function(cls) {
    // add methods
    for ( key in this.methods ) {
      var m = this.methods[key];
      if ( Method && Method.isInstance(m) ) {
        cls.addMethod(m.name, m.generateFunction());
      } else {
        cls.addMethod(key, m);
      }
    }
  },

  buildPrototype: function() { /* Internal use only. */
    // save our pure state
    // Note: Only documentation browser uses this, and it will be replaced
    // by the new Feature Oriented bootstrapping process, so only use the
    // extra memory in DEBUG mode.
    if ( DEBUG ) BootstrapModel.saveDefinition(this);

    if ( this.extendsModel && ! this.X.lookup(this.extendsModel) ) throw 'Unknown Model in extendsModel: ' + this.extendsModel;

    var extendsModel = this.extendsModel && this.X.lookup(this.extendsModel);

    if ( this.traits ) for ( var i = 0 ; i < this.traits.length ; i++ ) {
      var trait      = this.traits[i];
      var traitModel = this.X.lookup(trait);

      console.assert(traitModel, 'Unknown trait: ' + trait);

      if ( traitModel ) {
        extendsModel = this.addTraitToModel_(traitModel, extendsModel);
      } else {
        console.warn('Missing trait: ', trait, ', in Model: ', this.name);
      }
    }

    var proto  = extendsModel ? extendsModel.getPrototype() : FObject;
    var cls    = Object.create(proto);

    cls.model_ = this;
    cls.name_  = this.name;

    // Install a custom constructor so that Objects are named properly
    // in the JS memory profiler.
    // Doesn't work for Model because of some Bootstrap ordering issues.
    /*
    if ( this.name && this.name !== 'Model' && ! ( window.chrome && chrome.runtime && chrome.runtime.id ) ) {
      var s = '(function() { var XXX = function() { }; XXX.prototype = this; return function() { return new XXX(); }; })'.replace(/XXX/g, this.name);
      try { cls.create_ = eval(s).call(cls); } catch (e) { }
    }*/

    // add sub-models
    //        this.models && this.models.forEach(function(m) {
    //          cls[m.name] = JSONUtil.mapToObj(m);
    //        });
    // Workaround for crbug.com/258552
    this.models && Object_forEach(this.models, function(m) {
      //cls.model_[m.name] = cls[m.name] = JSONUtil.mapToObj(X, m, Model);
      if ( this[m.name] ) cls[m.name] = this[m.name];
    }.bind(this));

// TODO(adamvy): This shouldn't be required, commenting out for now.
//    if ( extendsModel ) this.requires = this.requires.concat(extendsModel.requires);
    // build requires
    Object_forEach(this.requires, function(i) {
      var imp  = i.split(' as ');
      var m    = imp[0];
      var path = m.split('.');
      var key  = imp[1] || path[path.length-1];

      defineLocalProperty(cls, key, function() {
        var Y     = this.Y;
        var model = this.X.lookup(m);
        console.assert(model, 'Unknown Model: ' + m + ' in ' + this.name_);
        return {
          __proto__: model,
          create: function(args, X) { return model.create(args, X || Y); }
        };
      });
    });

    var props = this.instance_.properties_ = this.properties ? this.properties.clone() : [];

    this.instance_.imports_ = this.imports;
    if ( extendsModel ) this.instance_.imports_ = this.instance_.imports_.concat(extendsModel.instance_.imports_);

    this.buildProtoImports_(props);
    this.buildProtoProperties_(cls, extendsModel, props);

    // Copy parent Model's Property and Relationship Contants to this Model.
    if ( extendsModel ) {
      for ( var i = 0 ; i < extendsModel.instance_.properties_.length ; i++ ) {
        var p = extendsModel.instance_.properties_[i];
        var name = constantize(p.name);

        if ( ! this[name] ) this[name] = p;
      }
      for ( i = 0 ; i < extendsModel.relationships.length ; i++ ) {
        var r = extendsModel.relationships[i];
        var name = constantize(r.name);

        if ( ! this[name] ) this[name] = r;
      }
    }

    // Handle 'exports'
    this.instance_.exports_ = this.exports ? this.exports.clone() : [];
    if ( extendsModel ) this.instance_.exports_ = this.instance_.exports_.concat(extendsModel.instance_.exports_);

    // templates
    this.templates && Object_forEach(this.templates, function(t) {
      cls.addMethod(t.name, t.code ? t.code : TemplateUtil.lazyCompile(t));
    });

    // add actions
    this.instance_.actions_ = this.actions ? this.actions.clone() : [];
    if ( this.actions ) {
      for ( var i = 0 ; i < this.actions.length ; i++ ) {
        (function(a) {
          if ( extendsModel ) {
            var superAction = extendsModel.getAction(a.name);
            if ( superAction ) {
              a = superAction.clone().copyFrom(a);
            }
          }
          this.instance_.actions_[i] = a;
          if ( ! Object.prototype.hasOwnProperty.call(cls, constantize(a.name)) )
            cls[constantize(a.name)] = a;
          cls.addMethod(a.name, function(opt_x) { a.maybeCall(opt_x || this.X, this); });
        }.bind(this))(this.actions[i]);
      }
    }

    var key;

    // add constants
    if ( this.constants ) {
      for ( var i = 0 ; i < this.constants.length ; i++ ) {
        var c = this.constants[i];
        cls[c.name] = this[c.name] = c.value;
      }
    }

    // add messages
    if ( this.messages && this.messages.length > 0 && Message ) {
      Object_forEach(this.messages, function(m, key) {
        if ( ! Message.isInstance(m) ) {
          m = this.messages[key] = Message.create(m);
        }
        var clsProps = {}, mdlProps = {}, constName = constantize(m.name);
        clsProps[m.name] = { get: function() { return m.value; } };
        clsProps[constName] = { value: m };
        mdlProps[constName] = { value: m };
        Object.defineProperties(cls, clsProps);
        Object.defineProperties(this, mdlProps);
      }.bind(this));
    }

    this.buildProtoMethods_(cls);

    var self = this;
    // add relationships
    this.relationships && this.relationships.forEach(function(r) {
      // console.log('************** rel: ', r, r.name, r.label, r.relatedModel, r.relatedProperty);

      var name = constantize(r.name);
      if ( ! self[name] ) self[name] = r;
      defineLazyProperty(cls, r.name, function() {
        var m = this.X.lookup(r.relatedModel);
        var lcName = m.name[0].toLowerCase() + m.name.substring(1);
        var dao = this.X[lcName + 'DAO'] || this.X[m.name + 'DAO'] ||
            this.X[m.plural];
        if ( ! dao ) {
          console.error('Relationship ' + r.name + ' needs ' + (m.name + 'DAO') + ' or ' +
              m.plural + ' in the context, and neither was found.');
        }

        dao = RelationshipDAO.create({
          delegate: dao,
          relatedProperty: m.getProperty(r.relatedProperty),
          relativeID: this.id
        });

        return {
          get: function() { return dao; },
          configurable: true
        };
      });
    });

    // TODO: move this somewhere better
    var createListenerTrampoline = function(cls, name, fn, isMerged, isFramed, whenIdle) {
      // bind a trampoline to the function which
      // re-binds a bound version of the function
      // when first called
      console.assert( fn, 'createListenerTrampoline: fn not defined');
      fn.name = name;

      Object.defineProperty(cls, name, {
        get: function () {
          var l = fn.bind(this);
          /*
          if ( ( isFramed || isMerged ) && this.X.isBackground ) {
            console.log('*********************** ', this.model_.name);
          }
          */
          if ( whenIdle ) l = Movement.whenIdle(l);

          if ( isFramed ) {
            l = EventService.framed(l, this.X);
          } else if ( isMerged ) {
            l = EventService.merged(
              l,
              (isMerged === true) ? undefined : isMerged, this.X);
          }

          Object.defineProperty(this, name, { configurable: true, value: l });

          return l;
        },
        configurable: true
      });
    };

    // add listeners
    if ( Array.isArray(this.listeners) ) {
      for ( var i = 0 ; i < this.listeners.length ; i++ ) {
        var l = this.listeners[i];
        createListenerTrampoline(cls, l.name, l.code, l.isMerged, l.isFramed, l.whenIdle);
      }
    } else if ( this.listeners ) {
      //          this.listeners.forEach(function(l, key) {
      // Workaround for crbug.com/258522
      Object_forEach(this.listeners, function(l, key) {
        createListenerTrampoline(cls, key, l);
      });
    }

    // add topics
    //        this.topics && this.topics.forEach(function(t) {
    // Workaround for crbug.com/258522
    this.topics && Object_forEach(this.topics, function(t) {
      // TODO: something
    });

    // copy parent model's properties and actions into this model
    if ( extendsModel ) {
      this.getProperty('');
      var ips = []; // inherited properties
      var ps  = extendsModel.instance_.properties_;
      for ( var i = 0 ; i < ps.length ; i++ ) {
        var p = ps[i];
        if ( ! this.getProperty(p.name) ) {
          ips.push(p);
          this.propertyMap_[p.name] = p;
        }
      }
      if ( ips.length ) {
        this.instance_.properties_ = ips.concat(this.instance_.properties_);
      }

      var ias = [];
      var as = extendsModel.instance_.actions_;
      for ( var i = 0 ; i < as.length ; i++ ) {
        var a = as[i];
        if ( ! ( this.getAction && this.getAction(a.name) ) )
          ias.push(a);
      }
      if ( ias.length ) {
        this.instance_.actions_ = ias.concat(this.instance_.actions_);
      }
    }

    // build primary key getter and setter
    if ( this.instance_.properties_.length > 0 && ! cls.__lookupGetter__('id') ) {
      var primaryKey = this.ids;

      if ( primaryKey.length == 1 ) {
        cls.__defineGetter__('id', function() { return this[primaryKey[0]]; });
        cls.__defineSetter__('id', function(val) { this[primaryKey[0]] = val; });
      } else if (primaryKey.length > 1) {
        cls.__defineGetter__('id', function() {
          return primaryKey.map(function(key) { return this[key]; }.bind(this)); });
        cls.__defineSetter__('id', function(val) {
          primaryKey.map(function(key, i) { this[key] = val[i]; }.bind(this)); });
      }
    }

    return cls;
  },

  // ???(kgr): Who uses this?  If it's the build tool, then better putting it there.
  getAllRequires: function() {
    var requires = {};
    this.requires.forEach(function(r) { requires[r.split(' ')[0]] = true; });
    this.traits.forEach(function(t) { requires[t] = true; });
    if ( this.extendsModel ) requires[this.extendsModel] = true;

    function setModel(o) { if ( o && o.model_ ) requires[o.model_.id] = true; }

    this.properties.forEach(setModel);
    this.actions.forEach(setModel);
    this.templates.forEach(setModel);
    this.listeners.forEach(setModel);

    return Object.keys(requires);
  },

  getPrototype: function() { /* Returns the definition $$DOC{ref:'Model'} of this instance. */
    if ( ! this.instance_.prototype_ ) {
      //console.profile('getPrototype' + this.name);
      //for ( var i = 0 ; i < 0 ; i++ ) this.buildPrototype();
      //console.profileEnd();
    return this.instance_.prototype_ = this.buildPrototype();
    }
    return this.instance_.prototype_;
//    return this.instance_.prototype_ || ( this.instance_.prototype_ = this.buildPrototype() );
  },

  saveDefinition: function(self) {
    self.definition_ = {};
    // TODO: introspect Model, copy the other non-array properties of Model
    // DocumentationBootstrap's getter gets called here, which causes a .create() and an infinite loop
//       Model.properties.forEach(function(prop) {
//         var propVal = self[prop.name];
//         if (propVal) {
//           if (Array.isArray(propVal)) {
//             // force array copy, so we don't share changes made later
//             self.definition_[prop.name] = [].concat(propVal);
//           } else {
//             self.definition_[prop.name] = propVal;
//           }
//         }
//       }.bind(self));

    // TODO: remove these once the above loop works
    // clone feature lists to avoid sharing the reference in the copy and original
    if (Array.isArray(self.methods))       self.definition_.methods       = [].concat(self.methods);
    if (Array.isArray(self.templates))     self.definition_.templates     = [].concat(self.templates);
    if (Array.isArray(self.relationships)) self.definition_.relationships = [].concat(self.relationships);
    if (Array.isArray(self.properties))    self.definition_.properties    = [].concat(self.properties);
    if (Array.isArray(self.actions))       self.definition_.actions       = [].concat(self.actions);
    if (Array.isArray(self.listeners))     self.definition_.listeners     = [].concat(self.listeners);
    if (Array.isArray(self.models))        self.definition_.models        = [].concat(self.models);
    if (Array.isArray(self.tests))         self.definition_.tests         = [].concat(self.tests);
    if (Array.isArray(self.issues))        self.definition_.issues        = [].concat(self.issues);

    self.definition_.__proto__ = FObject;
  },

  create: function(args, opt_X) { return this.getPrototype().create(args, opt_X); },

  isSubModel: function(model) {
    /* Returns true if the given instance extends this $$DOC{ref:'Model'} or a descendant of this. */

    if ( ! model || ! model.getPrototype ) return false;

    var subModels_ = this.subModels_ || ( this.subModels_ = {} );

    if ( ! subModels_.hasOwnProperty(model.id) ) {
      subModels_[model.id] = ( model.getPrototype() === this.getPrototype() || this.isSubModel(model.getPrototype().__proto__.model_) );
    }

    return subModels_[model.id];
  },

  getRuntimeProperties: function() {
    if ( ! this.instance_.properties_ ) this.getPrototype();
    return this.instance_.properties_;
  },

  getProperty: function(name) { /* Returns the requested $$DOC{ref:'Property'} of this instance. */
    // NOTE: propertyMap_ is invalidated in a few places
    // when properties[] is updated.
    if ( ! this.propertyMap_ ) {
      var m = this.propertyMap_ = {};

      var properties = this.getRuntimeProperties();
      for ( var i = 0 ; i < properties.length ; i++ ) {
        var prop = properties[i];
        m[prop.name] = prop;
      }

      this.propertyMap_ = m;
    }

    return this.propertyMap_[name];
  },

  getAction: function(name) { /* Returns the requested $$DOC{ref:'Action'} of this instance. */
    for ( var i = 0 ; i < this.instance_.actions_.length ; i++ )
      if ( this.instance_.actions_[i].name === name ) return this.instance_.actions_[i];
  },

  hashCode: function() {
    var string = '';
    var properties = this.getRuntimeProperties();
    for ( var key in properties ) {
      string += properties[key].toString();
    }
    return string.hashCode();
  },

  isInstance: function(obj) { /* Returns true if the given instance extends this $$DOC{ref:'Model'}. */
    return obj && obj.model_ && this.isSubModel(obj.model_);
  },

  toString: function() { return "BootstrapModel(" + this.name + ")"; },

  arequire: function() {
    if ( this.required__ ) return this.required__;

    var future = afuture();
    this.required__ = future.get;

    var go = function() {
      var args = [];

      if ( this.extendsModel ) args.push(arequire(this.extendsModel, this.X));

      var i;
      if ( this.traits ) {
        for ( i = 0; i < this.traits.length; i++ ) {
          args.push(arequire(this.traits[i], this.X));
        }
      }
      var model = this;
      if ( this.templates ) for ( i = 0 ; i < this.templates.length ; i++ ) {
        var t = this.templates[i];
        args.push(
          aif(!t.code,
              aseq(
                aevalTemplate(this.templates[i], this),
                (function(t) { return function(ret, m) {
                  t.code = m;
                  ret();
                };})(t))));
      }
      if ( args.length ) args = [aseq.apply(null, args)];

      if ( this.requires ) {
        for ( var i = 0 ; i < this.requires.length ; i++ ) {
          var r = this.requires[i];
          var m = r.split(' as ');
          if ( m[0] == this.id ) {
            console.warn("Model requires itself: " + this.id);
          } else {
            args.push(arequire(m[0], this.X));
          }
        }
      }

      args.push(function(ret) {
        if ( this.X.i18nModel )
          this.X.i18nModel(ret, this, this.X);
        else
          ret();
      }.bind(this));

      aseq.apply(null, args)(function() {
        this.finished__ = true;
        future.set(this);
      }.bind(this));
    }.bind(this);

    if ( this.extra__ )
      this.extra__(go);
    else
      go();

    return this.required__
  },

  getMyFeature: function(featureName) {
    /* Returns the feature with the given name from the runtime
      object (the features available to an instance of the model). */
    if ( ! Object.prototype.hasOwnProperty.call(this, 'featureMap_') ) {
      var map = this.featureMap_ = {};
      function add(a) {
        if ( ! a ) return;
        for ( var i = 0 ; i < a.length ; i++ ) {
          var f = a[i];
          map[f.name.toUpperCase()] = f;
        }
      }
      add(this.getRuntimeProperties());
      add(this.instance_.actions_);
      add(this.methods);
      add(this.listeners);
      add(this.templates);
      add(this.models);
      add(this.tests);
      add(this.relationships);
      add(this.issues);
    }
    return this.featureMap_[featureName.toUpperCase()];
  },

  getRawFeature: function(featureName) {
    /* Returns the raw (not runtime, not inherited, non-buildPrototype'd) feature
      from the model definition. */
    if ( ! Object.prototype.hasOwnProperty.call(this, 'rawFeatureMap_') ) {
      var map = this.featureMap_ = {};
      function add(a) {
        if ( ! a ) return;
        for ( var i = 0 ; i < a.length ; i++ ) {
          var f = a[i];
          map[f.name.toUpperCase()] = f;
        }
      }
      add(this.properties);
      add(this.actions);
      add(this.methods);
      add(this.listeners);
      add(this.templates);
      add(this.models);
      add(this.tests);
      add(this.relationships);
      add(this.issues);
    }
    return this.featureMap_[featureName.toUpperCase()];
  },

  getAllMyRawFeatures: function() {
    /* Returns the raw (not runtime, not inherited, non-buildPrototype'd) list
      of features from the model definition. */
    var featureList = [];
    var arrayOrEmpty = function(arr) {
      return ( arr && Array.isArray(arr) ) ? arr : [];
    };
    [
      arrayOrEmpty(this.properties),
      arrayOrEmpty(this.actions),
      arrayOrEmpty(this.methods),
      arrayOrEmpty(this.listeners),
      arrayOrEmpty(this.templates),
      arrayOrEmpty(this.models),
      arrayOrEmpty(this.tests),
      arrayOrEmpty(this.relationships),
      arrayOrEmpty(this.issues)
    ].map(function(list) {
      featureList = featureList.concat(list);
    });
    return featureList;
  },

  getFeature: function(featureName) {
    /* Returns the feature with the given name, including
       inherited features. */
    var feature = this.getMyFeature(featureName);

    if ( ! feature && this.extendsModel ) {
      var ext = this.X.lookup(this.extendsModel);
      if ( ext ) return ext.getFeature(featureName);
    } else {
      return feature;
    }
  },

  // getAllFeatures accounts for inheritance through extendsModel
  getAllRawFeatures: function() {
    var featureList = this.getAllMyRawFeatures();

    if ( this.extendsModel ) {
      var ext = this.X.lookup(this.extendsModel);
      if ( ext ) {
        ext.getAllFeatures().map(function(subFeat) {
          var subName = subFeat.name.toUpperCase();
          if ( ! featureList.mapFind(function(myFeat) { // merge in features we don't already have
            return myFeat && myFeat.name && myFeat.name.toUpperCase() === subName;
          }) ) {
            featureList.push(subFeat);
          }
        });
      }
    }
    return featureList;
  },

  atest: function() {
    var seq = [];
    var allPassed = true;

    for ( var i = 0 ; i < this.tests.length ; i++ ) {
      seq.push(
        (function(test, model) {
          return function(ret) {
            test.atest(model)(function(passed) {
              if ( ! passed ) allPassed = false;
              ret();
            })
          };
        })(this.tests[i], this));
    }

    seq.push(function(ret) {
      ret(allPassed);
    });

    return aseq.apply(null, seq);
  }
};

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var BinaryProtoGrammar;

var DocumentationBootstrap = {
  name: 'documentation',
  type: 'Documentation',
  view: function() { return X.foam.ui.DetailView.create({model: Documentation}); },
  help: 'Documentation associated with this entity.',
  documentation: "The developer documentation for this $$DOC{ref:'.'}. Use a $$DOC{ref:'DocModelView'} to view documentation.",
  setter: function(nu) {
    if ( ! DEBUG ) return;
    this.instance_.documentation = nu;
  },
  getter: function() {
    if ( ! DEBUG ) return '';
    var doc = this.instance_.documentation;
    if ( doc && typeof Documentation != "undefined" && Documentation // a source has to exist (otherwise we'll return undefined below)
        && (  ! doc.model_ // but we don't know if the user set model_
           || ! doc.model_.getPrototype // model_ could be a string
           || ! Documentation.isInstance(doc) // check for correct type
        ) ) {
      // So in this case we have something in documentation, but it's not of the
      // "Documentation" model type, so FOAMalize it.
      if ( doc.body ) {
        this.instance_.documentation = Documentation.create( doc );
      } else {
        this.instance_.documentation = Documentation.create({ body: doc });
      }
    }
    // otherwise return the previously FOAMalized model or undefined if nothing specified.
    //console.log("getting ", this.instance_.documentation)
    return this.instance_.documentation;
  }
}


var Model = {
  __proto__: BootstrapModel,
  instance_: {},

  name:  'Model',
  plural:'Models',
  help:  "Describes the attributes and properties of an entity.",

  documentation: {
    body: function() { /*
      <p>In FOAM, $$DOC{ref:'Model'} is the basic unit for describing data and behavior.
      $$DOC{ref:'Model'} itself is a $$DOC{ref:'Model'}, since it defines what can be defined,
      but also defines itself. See
      $$DOC{ref:'developerDocs.Welcome.chapters.modelsAtRuntime', text: 'Models in Action'}
      for more details.</p>


      <p>To create an instance of a $$DOC{ref:'Model'}, add it in your
      $$DOC{ref:'Model.requires'} list, then, in Javascript:</p>
      <p>
        <code>this.YourModel.create({ propName: val... })</code> creates an instance.
      </p>
      <p>
      Under the covers, $$DOC{ref:'Model.requires'} is creating an alias for the
      $$DOC{ref:'Model'} instance that exists in your context. You can access it
      directly at <code>this.X.yourPackage.YourModel</code>.</p>

      <p>Note:
      <ul>
        <li>The definition of your model is a $$DOC{ref:'Model'} instance
        (with YourModel.model_ === Model), while instances
        of your model have your new type (myInstance.model_ === YourModel). This
        differs from other object-oriented systems where the definition of a class
        and instances of the class are completely separate entities. In FOAM every
        class definition
        is an instance of $$DOC{ref:'Model'}, including itself.</li>

        <li>$$DOC{ref:'Model.exports',text:'Exporting'} a model property allows
        seamless dependency injection. See the
        $$DOC{ref:'developerDocs.Context', text:'Context documentation'}
        for more information.</li>

        <li>Calling .create direclty on a $$DOC{ref:'Model'} from your context,
        without using the $$DOC{ref:'.requires'} shortcut, must include the
        context: <code>this.X.MyModel.create({args}, this.X);</code>. Use
        $$DOC{ref:'.requires'} unless you have some compelling reason not to!</li>
      </ul>
      </p>
      <p>For more information about how $$DOC{ref:'Model',usePlural:true} are instantiated,
      see $$DOC{ref:'developerDocs.Welcome.chapters.modelsAtRuntime',text:'Welcome to Models at Runtime'}.
    */ }
  },

  tableProperties: [
    'package', 'name', 'label', 'plural'
  ],

  properties: [
    {
      name: 'id',
      hidden: true,
      transient: true
    },
    {
      name:  'sourcePath',
      help: 'Source location of this Model.',
      defaultValue: '',
      mode: 'read-only',
      transient: true
    },
    {
      name:  'abstract',
      type: 'boolean',
      defaultValue: false,
      help: 'If the java class is abstract.',
      documentation: function() { /* When running FOAM in a Java environment, specifies whether the
        Java class built from this $$DOC{ref:'Model'} should be declared abstract.*/}
    },
    {
      name: 'package',
      help: 'Package that this Model belongs to.',
      defaultValue: '',
      postSet: function(_, p) { return this.id = p ? p + '.' + this.name : this.name; },
      documentation: function() { /*
        <p>The package (or namespace) in which the $$DOC{ref:'.'} belongs. The
        dot-separated package name is prepended to the $$DOC{ref:'.'} name.</p>
        <p>For example: </p>
        <p><code>MODEL ({ name: 'Train', package: 'com.company.modules' });<br/>
                 ...<br/>
                 // when creating an instance of the model (your $$DOC{ref:'developerDocs.Context', text:'context'}
                        is this.X):<br/>
                 this.X.com.company.modules.Train.create();<br/>
        </code></p>
        <p>Use $$DOC{ref:'Model.imports'} to avoid typing the package name repeatedly.</p>
        <p>When running FOAM in a Java environment, specifies the
        package in which to declare the Java class built from this $$DOC{ref:'Model'}.
        </p>
        */}
    },
    {
      name:  'name',
      type:  'String',
      postSet: function(_, n) { return this.id = this.package ? this.package + '.' + n : n; },
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the entity.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'Model.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'Model'} definition names should use CamelCase starting with a capital letter, while
        $$DOC{ref:'Property',usePlural:true}, $$DOC{ref:'Method',usePlural:true}, and other features
        defined inside a $$DOC{ref:'Model'} should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'label',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return labelize(this.name); },
      help: 'The display label for the entity.',
      documentation: function() { /* A human readable label for the $$DOC{ref:'Model'}. May
        contain spaces or other odd characters.
         */}
    },
    {
      name: 'javaClassName',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return (this.abstract ? 'Abstract' : '') + this.name; },
      help: 'The Java classname of this Model.',
      documentation: function() { /* When running FOAM in a Java environment, specifies the name of the
        Java class to be built from this $$DOC{ref:'Model'}.*/}
    },
    {
      name: 'extendsModel',
      label: 'Extends',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'The parent model of this model.',
      documentation: function() { /*
        <p>Specifies the $$DOC{ref:'Model.name'} of the $$DOC{ref:'Model'} that
        this model should inherit from. Like object-oriented inheritance, this $$DOC{ref:'Model'} will gain the
        $$DOC{ref:'Property',usePlural:true}, $$DOC{ref:'Method',usePlural:true}, and other features
        defined inside the $$DOC{ref:'Model'} you extend.</p>
        <p>You may override features by redefining them in your $$DOC{ref:'Model'}.</p>
        <p>Like most inheritance schemes, instances of your $$DOC{ref:'Model'} may be used in place of
        instances of the $$DOC{ref:'Model'} you extend.</p>
         */}
    },
    {
      name: 'traits',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() { return []; },
      help: 'Traits to mix-into this Model.',
      documentation: function() { /* Traits allow you to mix extra features into your $$DOC{ref:'Model'}
         through composition, avoiding inheritance where unecesssary. */}
    },
    {
      name: 'plural',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return this.name + 's'; },
      help: 'The plural form of this model\'s name.',
      documentation: function() { /* The plural form of $$DOC{ref:'Model.name'}, for use in database
        table naming, labels and documentation. The format generally follows the same
        contsraints as $$DOC{ref:'.name'}. */}
    },
    {
      name: 'version',
      type: 'int',
      defaultValue: 1,
      help: 'Version number of model.',
      documentation: function() { /* For backwards compatibility, major changes should be marked by
        incrementing the version number. */}

    },
    {
      name: 'ids',
      label: 'Key Properties',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() {
        var id = this.getProperty('id');
        if ( id ) return ['id'];
        return [this.getRuntimeProperties()[0].name];
      },
      help: 'Properties which make up unique id.',
      documentation: function() { /* An optional list of names of $$DOC{ref:'Property',usePlural:true} from
        this $$DOC{ref:'Model'}, which can be used together as a primary key. The $$DOC{ref:'Property',usePlural:true},
        when combined, should uniquely identify an instance of your $$DOC{ref:'Model'}.
        $$DOC{ref:'DAO',usePlural:true} that support indexing can use this as a suggestion on how to index
        instances of your $$DOC{ref:'Model'}. */}

    },
    {
      name: 'requires',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() { return []; },
      help: 'Model imports.',
      documentation: function() { /*
          <p>List of model imports, as strings of the form:
            <code>'Model-Path [as Alias]'</code>.</p>
          <p>Aliases are created on your instances that reference the full
            path of the model, taking it from your this.X
            $$DOC{ref:'developerDocs.Context', text:'context'}.</p>
          <p>For example:</p>
          <p><code>requires: [ 'mypackage.DataLayer.BigDAO',
                   'mypackage.UI.SmallTextView as TextView' ]<br/>
                   ...<br/>
                   // in your Model's methods: <br/>
                  this.BigDAO.create();   // equivalent to this.X.mypackage.DataLayer.BigDAO.create()<br/>
                  this.TextView.create(); // equivalent to this.X.mypackage.UI.SmallTextView.create()<br/>
                  </code></p>
        */}
    },
    {
      name: 'imports',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() { return []; },
      help: 'Context imports.',
      documentation: function() { /*
          <p>List of context items to import, as strings of the form:
          <code>Key [as Alias]</code>.</p>
          <p>Imported items are installed into your $$DOC{ref:'Model'}
          as pseudo-properties, using their $$DOC{ref:'Model.name', text:'name'}
          or the alias specified here.</p>
          <p><code>imports: [ 'selectedItem',
                   'selectionDAO as dao' ]<br/>
                   ...<br/>
                   // in your Model's methods: <br/>
                  this.selectedItem.get(); // equivalent to this.X.selectedItem.get()<br/>
                  this.dao.select(); // equivalent to this.X.selectionDAO.select()<br/>
                  </code></p>
          <p>If you have $$DOC{ref:'.exports',text:'exported'} properties from a
          $$DOC{ref:'Model'} in a parent context, you can import those items and give
          them aliases for convenient access without the <code>this.X</code>.</p>
          <p>You can also re-export items you have imported, either with a different
          name or to replace the item you imported with a different property. While
          everyone can see changes to the value inside the imported property, only
          children (instances you create in your $$DOC{ref:'Model'}) will see
          $$DOC{ref:'Model.exports'} replacing the property itself.
        */}
    },
    {
      name: 'exports',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() { return []; },
      help: 'Context exports.',
      documentation: function() { /*
          <p>A list of $$DOC{ref:'Property',usePlural:true} to export to your sub-context,
           as strings of the form:
          <code>PropertyName [as Alias]</code>.</p>
          <p>Properties you wish to share with other instances you create
            (like sub-$$DOC{ref:'foam.ui.View',usePlural:true})
            can be exported automatically by listing them here.
            You are automatically sub-contexted, so your parent context does not
            see exported properties. In other words, exports are seen by children,
            not by parents.</p>
            <p>Instances you create can declare $$DOC{ref:'Model.imports'} to
            conveniently grab your exported items from the context.<p>
          <p><code>MODEL({ name: firstModel<br/>
               &nbsp;&nbsp;   exports: [ 'myProperty', 'name as parentName' ],<br/>
               &nbsp;&nbsp;   properties: [<br/>
               &nbsp;&nbsp;     {<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp; name: 'proper',<br/>
                <br/>
                 &nbsp;&nbsp;&nbsp;&nbsp; // This property will create a DetailView for us<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp; view: { factory_: 'foam.ui.DetailView',<br/>
                <br/>
v                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // we can import the properties our creator exported.<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; imports: [ 'myProperty', 'parentName' ],<br/>
                <br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; methods: { toHTML: function() {<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // our context is provided by firstModel, so:<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.myProperty = 4; // we can see exported myProperty<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; out.print(this.parentName); // aliased, links back to our name<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;     }}},<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;     ...<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;     { name: 'myProperty' },<br/>
                 &nbsp;&nbsp;&nbsp;&nbsp;     { name: 'name' }<br/>
                 &nbsp;&nbsp; ]<br/>
                 &nbsp;&nbsp; ...<br/>
                  </code></p>
        */}
    },
    {
      name: 'implements',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValueFn: function() { return []; },
      help: 'Interfaces implemented by this Model.',
      documentation: function() { /* $$DOC{ref:'Interface',usePlural:true} implemented by this $$DOC{ref:'Model'} .*/}
    },
    {
      name: 'tableProperties',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      displayWidth: 70,
      lazyFactory: function() {
        return (this.properties || this.properties_).filter(function(o) {
          return !o.hidden;
        }).map(function(o) {
          return o.name;
        });
      },
      help: 'Properties to be displayed in table view. Defaults to all properties.',
      documentation: function() { /* Indicates the $$DOC{ref:'Property',usePlural:true} to display when viewing a list of instances
        of this $$DOC{ref:'Model'} in a table or other $$DOC{ref:'Property'} viewer. */}
    },
    {
      name: 'searchProperties',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      displayWidth: 70,
      defaultValueFn: function() {
        return this.tableProperties;
      },
      help: 'Properties display in a search view. Defaults to table properties.',
      documentation: function() { /* Indicates the $$DOC{ref:'Property',usePlural:true} to display when viewing
        of this $$DOC{ref:'Model'} in a search view. */}
    },
    {
//      model_: 'ArrayProperty',
      name: 'properties',
      subType: 'Property',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Properties associated with the entity.',
      preSet: function(oldValue, newValue) {
        // Convert Maps to Properties if required
        for ( var i = 0 ; i < newValue.length ; i++ ) {
          var p = newValue[i];

          if ( typeof p === 'string' ) newValue[i] = p = { name: p };

          if ( ( ( ! DEBUG ) && p.debug ) && ( ! p.model_ || typeof p.model_ === 'string' ) ) {
            newValue.splice(i,1);
            i--;
            continue;
          }

          if ( ! p.model_ ) {
            p = newValue[i] = Property.create(p);
          } else if ( typeof p.model_ === 'string' ) {
            p = newValue[i] = JSONUtil.mapToObj(this.X, p);
          }

          // create property constant
          this[constantize(p.name)] = newValue[i];
        }

        this.propertyMap_ = null;

        return newValue;
      },
      documentation: function() { /*
        <p>The $$DOC{ref:'Property',usePlural:true} of a $$DOC{ref:'Model'} act as data members
          and connection points. A $$DOC{ref:'Property'} can store a modelled value, and bind
          to other $$DOC{ref:'Property',usePlural:true} for easy reactive programming.</p>
        <p>Note that, like $$DOC{ref:'Model'} being a $$DOC{ref:'Model'} itself, the
          $$DOC{ref:'Model.properties'} feature of all models is itself a $$DOC{ref:'Property'}.
        */}
    },
    {
      name: 'actions',
      type: 'Array[Action]',
      subType: 'Action',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      help: 'Actions associated with the entity.',
      preSet: function(_, newValue) {
        if ( ! Action ) return newValue;

        // Convert Maps to Properties if required
        for ( var i = 0 ; i < newValue.length ; i++ ) {
          var p = newValue[i];

          if ( ! p.model_ ) {
            newValue[i] = Action.create(p);
          } else if ( typeof p.model_ === 'string' ) {
            newValue[i] = FOAM(p);
          }

          // create property constant
          if ( p.name ) this[constantize(p.name)] = newValue[i];
        }

        return newValue;
      },
      documentation: function() { /*
        <p>$$DOC{ref:'Action',usePlural:true} implement a behavior and attach a label, icon, and typically a
        button-like $$DOC{ref:'foam.ui.View'} or menu item to activate the behavior.</p>
        */}

    },
    {
      name: 'constants',
      type: 'Array[Constant]',
      subType: 'Constant',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      help: 'Constants associated with the entity.',
      preSet: function(_, newValue) {
        if ( ! Constant ) return newValue;

        if ( Array.isArray(newValue) ) return JSONUtil.arrayToObjArray(this.X, newValue, Constant);

        // convert a map of values to an array of Constant objects
        var constants = [];

        for ( var key in newValue ) {
          var oldValue = newValue[key];

          var constant = Constant.create({
            name:  key,
            value: oldValue
          });

          constants.push(constant);
        }

        return constants;
      }
    },
    {
      name: 'messages',
      type: 'Array[Message]',
      subType: 'Constant',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      help: 'Messages associated with the entity.',
      preSet: function(_, newValue) {
        if ( ! GLOBAL.Message ) return newValue;

        if ( Array.isArray(newValue) ) return JSONUtil.arrayToObjArray(this.X, newValue, Message);

        // convert a map of values to an array of Message objects
        var messages = [];

        for ( var key in newValue ) {
          var oldValue = newValue[key];

          var message = Message.create({
            name:  key,
            value: oldValue
          });

          messages.push(message);
        }

        return messages;
      }
    },
    {
      model_: 'ArrayProperty',
      name: 'methods',
      subType: 'Method',
      help: 'Methods associated with the entity.',
      adapt: function(_, a) {
        if ( ! Method ) return a;

        function createMethod(X, name, fn) {
          var method = Method.create({
            name: name,
            code: fn
          });

          if ( DEBUG && Arg ) {
            var str = fn.toString();
            method.args = str.
              match(/^function[ _$\w]*\(([ ,\w]*)/)[1].
              split(',').
              filter(function(name) { return name; }).
              map(function(name) { return Arg.create({name: name.trim()}); });
          }

          return method;
        }

        if ( Array.isArray(a) ) {
          for ( var i = 0 ; i < a.length ; i++ ) {
            a[i] = ( typeof a[i] === 'function' ) ?
              createMethod(this.X, a[i].name, a[i]) :
              JSONUtil.mapToObj(this.X, a[i], Method, seq) ;
          }
          return a;
        }

        // convert a map of functions to an array of Method instances, DEPRECATED
        var methods = [];
        for ( var key in a ) methods.push(createMethod(this.X, key, a[key]));
        return methods;
      },
      documentation: function() { /*
        <p>$$DOC{ref:'Method',usePlural:true} contain code that runs in the instance's scope, so code
        in your $$DOC{ref:'Method'} has access to the other $$DOC{ref:'Property',usePlural:true} and
        features of your $$DOC{ref:'Model'}.</p>
        <ul>
          <li><code>this.propertyName</code> gives the value of a $$DOC{ref:'Property'}</li>
          <li><code>this.propertyName$</code> is the binding point for the $$DOC{ref:'Property'}. Assignment
              will bind bi-directionally, or <code>Events.follow(src, dst)</code> will bind from
              src to dst.</li>
          <li><code>this.methodName</code> calls another $$DOC{ref:'Method'} of this
                  $$DOC{ref:'Model'}</li>
          <li><code>this.SUPER()</code> calls the $$DOC{ref:'Method'} implementation from the
                    base $$DOC{ref:'Model'} (specified in $$DOC{ref:'Model.extendsModel'}). Calling
                    <code>this.SUPER()</code> is extremely important in your <code>init()</code>
                     $$DOC{ref:'Method'}, if you provide one.</li>
        </ul>
        <p>In JSON, $$DOC{ref:'Model.methods'} may be specified as a dictionary:</p>
        <p><code>methods: { methodName: function(arg1) {  ...your code here... }, anotherMethod: ... }</code></p>
        */}
    },
    {
      name: 'listeners',
      type: 'Array[Method]',
      subType: 'Method',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      preSet: function(_, newValue) {
        if ( Array.isArray(newValue) ) return JSONUtil.arrayToObjArray(this.X, newValue, Method);
        return newValue;
      },
      defaultValue: [],
      help: 'Event listeners associated with the entity.',
      documentation: function() { /*
        <p>The $$DOC{ref:'Model.listeners'} $$DOC{ref:'Property'} contains a list of $$DOC{ref:'Method',usePlural:true},
          but is separate and differs from the $$DOC{ref:'Model.methods'} $$DOC{ref:'Property'} in how the scope
          is handled. For a listener, <code>this</code> is bound to your instance, so when the listener is
          invoked by an event from elsewhere in the system it can still access the features of its $$DOC{ref:'Model'}
          instance.</p>
        <p>In javascript, listeners are connected using
          <code>OtherProperty.addListener(myModelInstance.myListener);</code></p>
      */}
    },
    /*
      {
      name: 'topics',
      type: 'Array[topic]',
      subType: 'Topic',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Event topics associated with the entity.'
      },
    */
    {
      name: 'templates',
      type: 'Array[Template]',
      subType: 'Template',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      postSet: function(_, templates) { TemplateUtil.expandModelTemplates(this); },
      //         defaultValueFn: function() { return []; },
      help: 'Templates associated with this entity.',
      documentation: function() { /*
        The $$DOC{ref:'Template',usePlural:true} to process and install into instances of this
        $$DOC{ref:'Model'}. $$DOC{ref:'foam.ui.View',usePlural:true} created inside each $$DOC{ref:'Template'}
        using the $$DOC{ref:'.templates',text:'$$propertyName{args}'} view creation tag become available
        as <code>myInstance.propertyNameView</code>.
        */}
    },
    {
      name: 'models',
      type: 'Array[Model]',
      subType: 'Model',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      adapt: function(_, newValue) {
        if ( ! Model ) return newValue;
        return Array.isArray(newValue) ? JSONUtil.arrayToObjArray(this.X, newValue, Model) : newValue;
      },
      postSet: function(_, models) {
        for ( var i = 0 ; i < models.length ; i++ ) this[models[i].name] = models[i];
      },
      defaultValue: [],
      help: 'Sub-models embedded within this model.',
      documentation: function() { /*
        $$DOC{ref:'Model',usePlural:true} may be nested inside one another to better organize them.
        $$DOC{ref:'Model',usePlural:true} declared this way do not gain special access to their containing
        $$DOC{ref:'Model'}, but are only accessible through their container.
        */}
    },
    {
      name: 'tests',
      label: 'Unit Tests',
      type: 'Array[Unit Test]',
      subType: 'UnitTest',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      adapt: function(_, a) {
        if ( ! a ) return a;
        for ( var i = 0 ; i < a.length ; i++ ) {
          if ( typeof a[i] === "function" ) {
            a[i] = UnitTest.create({
              name: a[i].name,
              code: a[i]
            });
          }
        }
        return a;
      },
      defaultValue: [],
      help: 'Unit tests associated with this model.',
      documentation: function() { /*
          Create $$DOC{ref:'UnitTest',usePlural:true} that should run to test the functionality of this
          $$DOC{ref:'Model'} here.
        */}
    },
    {
      name: 'relationships',
      subType: 'Relationship',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      help: 'Relationships of this model to other models.',
      preSet: function(_, newValue) {
        if ( ! Relationship ) return newValue;

        // Convert Maps to Relationships if required
        for ( var i = 0 ; i < newValue.length ; i++ ) {
          var p = newValue[i];

          if ( ! p.model_ ) {
            p = newValue[i] = Relationship.create(p);
          } else if ( typeof p.model_ === 'string' ) {
            p = newValue[i] = FOAM(p);
          }

          // create property constant
          this[constantize(p.name)] = newValue[i];
        }

        return newValue;
      },
      documentation: function() { /*
          <p>$$DOC{ref:'Relationship',usePlural:true} indicate a parent-child relation between instances of
          this $$DOC{ref:'Model'} and the indicated $$DOC{ref:'Model',usePlural:true}, through the indicated
          $$DOC{ref:'Property',usePlural:true}. If your $$DOC{ref:'Model',usePlural:true} build a tree
          structure of instances, they could likely benefit from a declared $$DOC{ref:'Relationship'}.
          </p>
        */}
    },
    {
      name: 'issues',
      type: 'Array[Issue]',
      subType: 'Issue',
      debug: true,
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      propertyToJSON: function(visitor, output, o) {
        if ( o[this.name].length ) output[this.name] = o[this.name];
      },
      defaultValue: [],
      help: 'Issues associated with this model.',
      documentation: function() { /*
          Bug tracking inside the FOAM system can attach $$DOC{ref:'Issue',usePlural:true} directly to the
          affected $$DOC{ref:'Model',usePlural:true}.
        */}
    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      view: 'foam.ui.TextAreaView',
      defaultValue: '',
      help: 'Help text associated with the entity.',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'Model'} or
          $$DOC{ref:'Property'}, through field labels or tooltips.
        */}

    },
    {
      name: 'i18nComplete_',
      defaultValue: false,
      hidden: true,
      transient: true
    },
    {
      name: 'translationHint',
      label: 'Description for Translation',
      type: 'String',
      defaultValueFn: function() { return this.name; }
    },
    DocumentationBootstrap,
    {
      name: 'notes',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      view: 'foam.ui.TextAreaView',
      defaultValue: '',
      help: 'Internal documentation associated with this entity.',
      documentation: function() { /*
          Internal documentation or implementation-specific 'todo' notes.
        */}
    },
    {
      name: 'createActionFactory',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Factory to create the action object for creating this object',
      documentation: function() { /* Factory to create the action object for creating this object  */}
    },
    {
      name: 'deleteActionFactory',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Factory to create the action object for deleting this object',
      documentation: function() { /* Factory to create the action object for deleting this object  */}
    }
  ],

  //templates:[
  //  {
  //    model_: 'Template',
  //    name: 'javaSource',
  //    description: 'Java Source',
  //    "template": "// Generated by FOAM, do not modify.\u000a// Version <%= this.version %>\u000a<%\u000a  var className       = this.javaClassName;\u000a  var parentClassName = this.extendsModel ? this.extendsModel : 'FObject';\u000a\u000a  if ( GLOBAL[parentClassName] && GLOBAL[parentClassName].abstract ) parentClassName = 'Abstract' + parentClassName;\u000a\u000a%>\u000a<% if ( this.package ) { %>\\\u000apackage <%= this.package %>;\u000a\u000a<% } %>\\\u000aimport foam.core.*;\u000a\u000apublic<%= this.abstract ? ' abstract' : '' %> class <%= className %>\u000a   extends <%= parentClassName %>\u000a{\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a   public final static Property <%= constantize(prop.name) %> = new Abstract<%= prop.javaType.capitalize() %>Property() {\u000a     public String getName() { return \"<%= prop.name %>_\"; }\u000a     public String getLabel() { return \"<%= prop.label %>\"; }\u000a     public Object get(Object o) { return ((<%= this.name %>) o).get<%= prop.name.capitalize() %>(); }\u000a     public void set(Object o, Object v) { ((<%= this.name %>) o).set<%= prop.name.capitalize() %>(toNative(v)); }\u000a     public int compare(Object o1, Object o2) { return compareValues(((<%= this.name%>)o1).<%= prop.name %>_, ((<%= this.name%>)o2).<%= prop.name %>_); }\u000a   };\u000a   <% } %>\u000a\u000a   final static Model model__ = new AbstractModel(new Property[] {<% for ( var key in this.properties ) { var prop = this.properties[key]; %> <%= constantize(prop.name) %>,<% } %> }) {\u000a     public String getName() { return \"<%= this.name %>\"; }\u000a     public String getLabel() { return \"<%= this.label %>\"; }\u000a     public Property id() { return <%= this.ids.length ? constantize(this.ids[0]) : 'null' %>; }\u000a   };\u000a\u000a   public Model model() {\u000a     return model__;\u000a   }\u000a   public static Model MODEL() {\u000a     return model__;\u000a   }\u000a\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a   private <%= prop.javaType %> <%= prop.name %>_;   <% } %>\u000a\u000a   public <%= className %>()\u000a   {\u000a   }\u000a<% if ( this.properties.length ) { %> \u000a   public <%= className %>(<% for ( var key in this.properties ) { var prop = this.properties[key]; %><%= prop.javaType, ' ', prop.name, key < this.properties.length-1 ? ', ': '' %><% } %>)\u000a   {   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a      <%= prop.name %>_ = <%= prop.name %>;   <% } %>\u000a   }\u000a<% } %>\u000a\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a   public <%= prop.javaType %> get<%= prop.name.capitalize() %>() {\u000a       return <%= prop.name %>_;\u000a   };\u000a   public void set<%= prop.name.capitalize() %>(<%= prop.javaType, ' ', prop.name %>) {\u000a       <%= prop.name %>_ = <%= prop.name %>;\u000a   };\u000a   <% } %>\u000a\u000a   public int hashCode() { \u000a      int hash = 1;\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a      hash = hash * 31 + hash(<%= prop.name %>_);   <% } %>\u000a\u000a      return hash;\u000a   }\u000a\u000a   public int compareTo(Object obj) {\u000a      if ( obj == this ) return 0;\u000a      if ( obj == null ) return 1;\u000a\u000a      <%= this.name %> other = (<%= this.name %>) obj;\u000a \u000a      int cmp;\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\u000a      if ( ( cmp = compare(get<%= prop.name.capitalize() %>(), other.get<%= prop.name.capitalize() %>()) ) != 0 ) return cmp;   <% } %>\u000a\u000a      return 0;\u000a   }\u000a\u000a   public StringBuilder append(StringBuilder b) {\u000a      return b\u000a   <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\\\u000a      .append(\"<%= prop.name %>=\").append(get<%= prop.name.capitalize() %>())<%= key < this.properties.length-1 ? '.append(\", \")' : '' %> \u000a   <% } %>      ;\u000a   }\u000a\u000a   public Object fclone() {\u000a      <%= this.name %> c = new <%= this.name %>();\u000a      <% for ( var key in this.properties ) { var prop = this.properties[key]; %>\\\u000ac.set<%= prop.name.capitalize() %>(get<%= prop.name.capitalize() %>());\u000a      <% } %>\\\u000areturn c;\u000a   }\u000a\u000a}"
  //  },
  //  {
  //    model_: 'Template',
  //    name: 'closureExterns',
  //    description: 'Closure Externs JavaScript Source',
  //    template: '/**\n' +
  //      ' * @constructor\n' +
  //      ' */\n' +
  //      '<%= this.name %> = function() {};\n' +
  //      '<% for ( var i = 0 ; i < this.properties.length ; i++ ) { var prop = this.properties[i]; %>' +
  //      '\n<%= prop.closureSource(undefined, this.name) %>\n' +
  //      '<% } %>' +
  //      '<% for ( var i = 0 ; i < this.methods.length ; i++ ) { var meth = this.methods[i]; %>' +
  //      '\n<%= meth.closureSource(undefined, this.name) %>\n' +
  //      '<% } %>'
  //  },
  //  {
  //    model_: 'Template',
  //    name: 'dartSource',
  //    description: 'Dart Class Source',
  //    template: '<% out(this.name); %>\n{\n<% for ( var key in this.properties ) { var prop = this.properties[key]; %>   var <%= prop.name %>;\n<% } %>\n\n   <%= this.name %>()\n   {\n\n   }\n\n   <%= this.name %>(<% for ( var key in this.properties ) { var prop = this.properties[key]; %>this.<%= prop.name, key < this.properties.length-1 ? ", ": "" %><% } %>)\n}'
  //  },
  //  {
  //    model_: 'Template',
  //    name: 'protobufSource',
  //    description: 'Protobuf source',
  //    template: 'message <%= this.name %> {\n<% for (var i = 0, prop; prop = this.properties[i]; i++ ) { if ( prop.prototag == null ) continue; if ( prop.help ) { %>//<%= prop.help %>\n<% } %>  <% if ( prop.type.startsWith("Array") ) { %>repeated<% } else if ( false ) { %>required<% } else { %>optional<% } %>  <%= prop.protobufType %> <%= prop.name %> = <%= prop.prototag %>;\n\n<% } %>}\n'
  //  }
  //],

  toString: function() { return "Model"; }
};

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Property = {
  __proto__: BootstrapModel,
  instance_: {},

  name:  'Property',
  plural:'Properties',
  help:  'Describes a properties of a modelled entity.',

  ids: [ 'name' ],

  tableProperties: [
    'name',
    'label',
    'type',
    'required',
    'defaultValue'
  ],

  documentation: function() { /*
    <p>The $$DOC{ref:'Property',usePlural:true} of a $$DOC{ref:'Model'} act as data members
      and connection points. A $$DOC{ref:'Property'} can store a modelled value, and bind
      to other $$DOC{ref:'Property',usePlural:true} for easy reactive programming.</p>
    <p>Note that, like $$DOC{ref:'Model'} being a $$DOC{ref:'Model'} itself, the
      $$DOC{ref:'Model.properties'} feature of all models is itself a $$DOC{ref:'Property'}.
    <p>
  */},

  properties: [
    {
      name: 'name',
      type: 'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the property.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'label',
      type: 'String',
      required: false,
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return labelize(this.name); },
      help: 'The display label for the property.',
      documentation: function() { /* A human readable label for the $$DOC{ref:'.'}. May
        contain spaces or other odd characters.
         */}
    },
    {
      name: 'speechLabel',
      type: 'String',
      required: false,
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return this.label; },
      help: 'The speech label for the property.',
      documentation: function() { /* A speakable label for the $$DOC{ref:'.'}. Used for accesibility.
         */}
    },
    {
      name: 'tableLabel',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return this.label; },
      help: 'The table display label for the entity.',
      documentation: function() { /* A human readable label for the $$DOC{ref:'Model'} for use in tables. May
        contain spaces or other odd characters.
         */}
    },
    {
      name: 'type',
      type: 'String',
      required: true,
      // todo: curry arguments
      view: {
        factory_: 'foam.ui.ChoiceView',
        choices: [
          'Array',
          'Boolean',
          'Color',
          'Date',
          'DateTime',
          'Email',
          'Enum',
          'Float',
          'Function',
          'Image',
          'Int',
          'Object',
          'Password',
          'String',
          'String[]',
          'URL'
        ]
      },
      defaultValue: 'String',
      help: 'The type of the property.',
      documentation: function() { /* <p>The type of the $$DOC{ref:'.'}, either a primitive type or
          a $$DOC{ref:'Model'}.</p> <p>Primitives include:</p>
      <ul>
          <li>Array</li>
          <li>Boolean</li>
          <li>Color</li>
          <li>Date</li>
          <li>DateTime</li>
          <li>Email</li>
          <li>Enum</li>
          <li>Float</li>
          <li>Function</li>
          <li>Image</li>
          <li>Int</li>
          <li>Object</li>
          <li>Password</li>
          <li>String</li>
          <li>String[]</li>
          <li>URL</li>
      </ul>
         */}
    },
    {
      name: 'protobufType',
      type: 'String',
      required: false,
      help: 'The protobuf type that represents the type of this property.',
      defaultValueFn: function() { return this.type.toLowerCase(); },
      documentation: function() {/* When generating protobuf definitions, specifies the type to use for the field this represents. */}
    },
    {
      name: 'javaType',
      type: 'String',
      required: false,
      defaultValueFn: function() { return this.type; },
      help: 'The java type that represents the type of this property.',
      documentation: function() { /* When running FOAM in a Java environment, specifies the Java type
        or class to use. */}
    },
    {
      name: 'javascriptType',
      type: 'String',
      required: false,
      defaultValueFn: function() { return this.type; },
      help: 'The javascript type that represents the type of this property.',
      documentation: function() { /* When running FOAM in a javascript environment, specifies the javascript
         type to use. */}
    },
    {
      name: 'shortName',
      type: 'String',
      required: true,
      displayWidth: 10,
      displayHeight: 1,
      defaultValue: '',
      help: 'A short alternate name to be used for compact encoding.',
      documentation: "A short alternate $$DOC{ref:'.name'} to be used for compact encoding."
    },
    {
      name: 'singular',
      type: 'String',
      required: false,
      displayWidth: 70
    },
    {
      name: 'aliases',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      defaultValue: [],
      help: 'Alternate names for this property.',
      documentation: function() { /*
        Aliases can be used as synonyms for this $$DOC{ref:'Property'} in code or to look it up by name.
      */}
    },
    {
      name: 'mode',
      type: 'String',
      defaultValue: 'read-write',
      view: { factory_: 'foam.ui.ChoiceView', choices: ['read-only', 'read-write', 'final'] },
      documentation: function() { /*
        To restrict modification to a $$DOC{ref:'Property'}, the $$DOC{ref:'.mode'} can be set to read-only
        to block changes, or to final to block overriding this $$DOC{ref:'Property'} in descendents of
        the $$DOC{ref:'Model'} that owns this $$DOC{ref:'Property'}.
      */}
    },
    {
      name: 'subType',
      label: 'Sub-Type',
      type: 'String',
      displayWidth: 30,
      // todo: keyView of Models
      help: 'The type of the property.',
      documentation: function() { /*
        In array types, the $$DOC{ref:'.subType'} indicates the type that the array contains.
      */}
    },
    {
      name: 'units',
      type: 'String',
      required: true,
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'The units of the property.',
      documentation: function() { /*
        The units of the $$DOC{ref:'Property'}.
      */}
    },
    {
      name: 'required',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: true,
      help: 'Indicates if the property is a required field.',
      documentation: function() { /*
        Indicates whether the $$DOC{ref:'Property'} is required for its owner $$DOC{ref:'Model'} to
        function properly.
      */}
    },
    {
      name: 'hidden',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: false,
      help: 'Indicates if the property is hidden.',
      documentation: function() { /*
        Indicates whether the $$DOC{ref:'Property'} is for internal use and should be hidden from
        the user when viewing tables or other views of $$DOC{ref:'Model'}
        $$DOC{ref:'Property',usePlural:true}.
      */}
    },
    {
      name: 'transient',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: false,
      help: 'Indicates if the property is transient.',
      documentation: function() { /*
        Indicates whether the $$DOC{ref:'Property'} is transient, and should not be saved permanently
        or serialized.
      */}
    },
    {
      name: 'displayWidth',
      type: 'int',
      displayWidth: 8,
      displayHeight: 1,
      defaultValue: '30',
      help: 'The display width of the property.',
      documentation: function() { /*
        A width suggestion for views that automatically render the $$DOC{ref:'Property'}.
      */}
    },
    {
      name: 'displayHeight',
      type: 'int',
      displayWidth: 8,
      displayHeight: 1,
      defaultValue: 1,
      help: 'The display height of the property.',
      documentation: function() { /*
        A height suggestion for views that automatically render the $$DOC{ref:'Property'}.
      */}
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'view',
      type: 'view',
      defaultValue: 'foam.ui.TextFieldView',
      help: 'View component for the property.',
      documentation: function() { /*
        The default $$DOC{ref:'foam.ui.View'} to use when rendering the $$DOC{ref:'Property'}.
        Specify a string or an object with factory_ and other properties specified.
      */}
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'detailView',
      type: 'view',
      defaultValueFn: function() { return this.view; },
      help: 'View component for the property when rendering within a DetailView.',
      documentation: function() { /*
        The default $$DOC{ref:'foam.ui.View'} to use when rendering the $$DOC{ref:'Property'}
        as a part of a $$DOC{ref:'foam.ui.DetailView'}. Specify a string or an object with
        factory_ and other properties specified.
      */}
    },
    {
      model_: 'ViewFactoryProperty',
      name: 'citationView',
      type: 'view',
      defaultValueFn: function() { return this.view; },
      help: 'View component for the property when rendering within a CitationView.',
      documentation: function() { /*
        The default $$DOC{ref:'foam.ui.View'} to use when rendering the $$DOC{ref:'Property'}
        as a part of a $$DOC{ref:'CitationView'}. Specify a string or an object with
        factory_ and other properties specified.
      */}
    },
    {
//      model_: 'FunctionProperty',
      name: 'detailViewPreRow',
      defaultValue: function() { return ""; },
      help: 'Inject HTML before row in DetailView.',
      documentation: function() { /*
        An optional function to
        inject HTML before the row in $$DOC{ref:'foam.ui.DetailView'}.
      */}
    },
    {
//      model_: 'FunctionProperty',
      name: 'detailViewPostRow',
      defaultValue: function() { return ""; },
      help: 'Inject HTML before row in DetailView.',
      documentation: function() { /*
        An optional function to
        inject HTML after the row in $$DOC{ref:'foam.ui.DetailView'}.
      */}
    },
    {
      name: 'defaultValue',
      type: 'String',
      required: false,
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      postSet: function(old, nu) {
        if ( nu && this.defaultValueFn ) this.defaultValueFn = undefined;
      },
      help: 'The property\'s default value.',
      documentation: function() { /*
        An optional function to
        inject HTML before the row in $$DOC{ref:'foam.ui.DetailView'}.
      */}
    },
    {
      name: 'defaultValueFn',
      label: 'Default Value Function',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      postSet: function(old, nu) {
        if ( nu && this.defaultValue ) this.defaultValue = undefined;
      },
      help: 'The property\'s default value function.',
      documentation: function() { /*
        Optional function that is evaluated when a default value is required. Will unset any
        $$DOC{ref:'.defaultValue'} that has been set.
      */}
    },
    {
      name: 'dynamicValue',
      label: "Value's Dynamic Function",
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: "A dynamic function which computes the property's value.",
      documentation: function() { /*
        Allows the value of this $$DOC{ref:'Property'} to be calculated dynamically.
        Other $$DOC{ref:'Property',usePlural:true} and bindable objects used inside the function will be
        automatically bound and the function re-evaluated when a dependency changes.
      */}

    },
    {
      name: 'factory',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Factory for creating initial value when new object instantiated.',
      documentation: function() { /*
        An optional function that creates the instance used to store the $$DOC{ref:'Property'} value.
        This is useful when the $$DOC{ref:'Property'} type is a complex $$DOC{ref:'Model'} that requires
        construction parameters.
      */}
    },
    {
      name: 'lazyFactory',
      type: 'Function',
      required: false,
      view: 'foam.ui.FunctionView',
      help: 'Factory for creating the initial value. Only called when the property is accessed for the first time.',
      documentation: function() { /*
        Like the $$DOC{ref:'.factory'} function, but only evaulated when this $$DOC{ref:'Property'} is
        accessed for the first time.
      */}
    },
    {
      name: 'getter',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'The property\'s default value function.',
      documentation: function() { /*
        For advanced use. Supplying a $$DOC{ref:'.getter'} allows you to completely re-implement the $$DOC{ref:'Property'}
        storage mechanism, to calculcate the value, or cache, or pre-process the value as it is requested.
        In most cases you can just supply a $$DOC{ref:'.preSet'} or $$DOC{ref:'.postSet'} instead.
      */}
    },
    {
      name: 'adapt',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'An adapter function called before preSet.',
      documentation: function() { /*
        Allows you to modify the incoming value before it is set. Parameters <code>(old, nu)</code> are
        supplied with the old and new value. Return the value you want to be set.
      */}
    },
    {
      name: 'preSet',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'An adapter function called before normal setter logic.',
      documentation: function() { /*
        Allows you to modify the incoming value before it is set. Parameters <code>(old, nu)</code> are
        supplied with the old and new value. Return the value you want to be set.
      */}
    },
    {
      name: 'postSet',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'A function called after normal setter logic, but before property change event fired.',
      documentation: function() { /*
        Allows you to react after the value of the $$DOC{ref:'Property'} has been set,
        but before property change event is fired.
        Parameters <code>(old, nu)</code> are supplied with the old and new value.
      */}
    },
    {
      name: 'setter',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'The property\'s default value function.',
      documentation: function() { /*
        For advanced use. Supplying a $$DOC{ref:'.setter'} allows you to completely re-implement the $$DOC{ref:'Property'}
        storage mechanism, to calculcate the value, or cache, or pre-process the value as it is set.
        In most cases you can just supply a $$DOC{ref:'.preSet'} or $$DOC{ref:'.postSet'} instead.
      */}
    },
    {
      name: 'tableFormatter',
      label: 'Table Cell Formatter',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Function to format value for display in TableView.',
      documentation: "A function to format the value for display in a $$DOC{ref:'foam.ui.TableView'}."
    },
    {
      name: 'summaryFormatter',
      label: 'Summary Formatter',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Function to format value for display in SummaryView.',
      documentation: "A function to format the value for display in a $$DOC{ref:'SummaryView'}."
    },
    {
      name: 'tableWidth',
      type: 'String',
      required: false,
      defaultValue: '',
      help: 'Table View Column Width.',
      documentation: "A Suggestion for $$DOC{ref:'foam.ui.TableView'} column width."
    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      required: false,
      displayWidth: 70,
      displayHeight: 6,
      view: 'foam.ui.TextAreaView',
      defaultValue: '',
      help: 'Help text associated with the property.',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'Property'},
          through field labels or tooltips.
        */}
    },
    DocumentationBootstrap,
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.',
      documentation: 'The protobuf tag number for this field.'
    },
    {
      name: 'actionFactory',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: 'Factory to create the action objects for taking this property from value A to value B',
      documentation: "Factory to create the $$DOC{ref:'Action'} objects for taking this $$DOC{ref:'Property'} from value A to value B"
    },
    {
      name: 'compareProperty',
      type: 'Function',
      view: 'foam.ui.FunctionView',
      displayWidth: 70,
      displayHeight: 5,
      defaultValue: function(o1, o2) {
        if ( o1 === o2 ) return 0;
        if ( ! o1 && ! o2 ) return 0;
        if ( ! o1 ) return -1;
        if ( ! o2 ) return  1;
        if ( o1.localeCompare ) return o1.localeCompare(o2);
        if ( o1.compareTo ) return o1.compareTo(o2);
        return o1.$UID.compareTo(o2.$UID);
      },
      help: 'Comparator function.',
      documentation: "A comparator function two compare two instances of this $$DOC{ref:'Property'}."
    },
    {
      name: 'fromString',
      defaultValue: function(s, p) { this[p.name] = s; },
      help: 'Function to extract value from a String.'
    },
    {
      name: 'fromElement',
      defaultValue: function propertyFromElement(e, p) {
        if ( ! p.type || ! this.X.lookup || p.type === 'String' ) {
          p.fromString.call(this, e.innerHTML, p);
          return;
        }
        var model = this.X.lookup(p.type);
        if ( ! model ) {
          p.fromString.call(this, e.innerHTML, p);
          return;
        }
        var o = model.create();
        if ( ! o.fromElement ){
          p.fromString.call(this, e.innerHTML, p);
          return;
        }
        this[p.name] = o.fromElement(e);
      },
      help: 'Function to extract from a DOM Element.',
      documentation: "Function to extract a value from a DOM Element."
    },
    {
      name: 'propertyToJSON',
      defaultValue: function(visitor, output, o) {
        if ( ! this.transient ) output[this.name] = visitor.visit(o[this.name]);
      },
      help: 'Function to extract from a DOM Element.',
      documentation: "Function to extract a value from a DOM Element."
    },
    {
      name: 'autocompleter',
      subType: 'Autocompleter',
      help: 'Name or model for the autocompleter for this property.',
      documentation: function() { /*
        Name or $$DOC{ref:'Model'} for the $$DOC{ref:'Autocompleter'} for this $$DOC{ref:'Property'}.
      */}
    },
    {
      name: 'install',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      rows:3,
      view: 'foam.ui.FunctionView',
      defaultValue: '',
      help: "A function which installs additional features into the Model's prototype.",
      documentation: function() { /*
        A function which installs additional features into our $$DOC{ref:'Model'} prototype.
        This allows extra language dependent features or accessors to be added to instances
        for use in code.
      */}
    },
    {
      name: 'exclusive',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: true,
      help: 'Indicates if the property can only have a single value.',
      documentation: function() { /*
        Indicates if the $$DOC{ref:'Property'} can only have a single value.
      */}
    },
    {
      name: 'memorable',
      type: 'Boolean',
      help: 'True if this value should be included in a memento for this object.',
      defaultValue: false
    }
  ],

  methods: {
    partialEval: function() { return this; },
    f: function(obj) { return obj[this.name] },
    compare: function(o1, o2) {
      return this.compareProperty(this.f(o1), this.f(o2));
    },
    toSQL: function() { return this.name; },
    toMQL: function() { return this.name; },
    toBQL: function() { return this.name; },
    cloneProperty: function(/* this=prop, */ value) {
      return ( value && value.clone ) ? value.clone() : value;
    },
    deepCloneProperty: function(/* this=prop, */ value) {
      return ( value && value.deepClone ) ? value.deepClone() : value;
    },
    initPropertyAgents: function(proto, fastInit) {
      var prop   = this;
      var name   = prop.name;
      var name$_ = prop.name$_;

      if ( ! fastInit ) proto.addInitAgent(
        (this.postSet || this.setter) ? 9 : 0,
        name + ': ' + (this.postSet || this.setter ? 'copy arg (postSet)' : 'copy arg'),
        function(o, X, m) {
          if ( ! m ) return;
          if ( m.hasOwnProperty(name)   ) o[name]   = m[name];
          if ( m.hasOwnProperty(name$_) ) o[name$_] = m[name$_];
        }
      );

      if ( this.dynamicValue ) {
        var dynamicValue = prop.dynamicValue;
        if ( Array.isArray(dynamicValue) ) {
          proto.addInitAgent(10, name + ': dynamicValue', function(o, X) {
            Events.dynamic(
              dynamicValue[0].bind(o),
              function() { o[name] = dynamicValue[1].call(o); });
          });
        } else {
          proto.addInitAgent(10, name + ': dynamicValue', function(o, X) {
            Events.dynamic(
              dynamicValue.bind(o),
              function(value) { o[name] = value; });
          });
        }
      }

      if ( this.factory ) {
        proto.addInitAgent(11, name + ': factory', function(o, X) {
          if ( ! o.hasOwnProperty(name) ) o[name];
        });
      }
    }
  },

  //templates: [
  //  {
  //    model_: 'Template',
  //    name: 'closureSource',
  //    description: 'Closure Externs JavaScript Source',
  //    template:
  //    '/**\n' +
  //      ' * @type {<%= this.javascriptType %>}\n' +
  //      ' */\n' +
  //      '<%= arguments[1] %>.prototype.<%= this.name %> = undefined;'
  //  }
  //],

  toString: function() { return "Property"; }
};


Model.methods = {
  getProperty:              BootstrapModel.getProperty,
  getAction:                BootstrapModel.getAction,
  hashCode:                 BootstrapModel.hashCode,
  buildPrototype:           BootstrapModel.buildPrototype,
  addTraitToModel_:         BootstrapModel.addTraitToModel_,
  buildProtoImports_:       BootstrapModel.buildProtoImports_,
  buildProtoProperties_:    BootstrapModel.buildProtoProperties_,
  buildProtoMethods_:       BootstrapModel.buildProtoMethods_,
  getPrototype:             BootstrapModel.getPrototype,
  isSubModel:               BootstrapModel.isSubModel,
  isInstance:               BootstrapModel.isInstance,
  getAllRequires:           BootstrapModel.getAllRequires,
  arequire:                 BootstrapModel.arequire,
  getMyFeature:             BootstrapModel.getMyFeature,
  getRawFeature:            BootstrapModel.getRawFeature,
  getAllMyRawFeatures:      BootstrapModel.getAllMyRawFeatures,
  getFeature:               BootstrapModel.getFeature,
  getAllRawFeatures:        BootstrapModel.getAllRawFeatures,
  atest:                    BootstrapModel.atest,
  getRuntimeProperties:     BootstrapModel.getRuntimeProperties
};

// This is the coolest line of code that I've ever written
// or ever will write. Oct. 4, 2011 -- KGR
Model = Model.create(Model);
Model.model_ = Model;
Model.create = BootstrapModel.create;

Property = Model.create(Property);

// Property properties are still Bootstrap Models, so upgrade them.
var ps = Property.getRuntimeProperties();
for ( var i = 0 ; i < ps.length ; i++ ) {
  Property[constantize(ps[i].name)] = ps[i] = Property.create(ps[i]);
}

USED_MODELS.Property = true;
USED_MODELS.Model = true;

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'StringProperty',
  extendsModel: 'Property',

  help: 'Describes a properties of type String.',

  properties: [
    {
      name: 'displayHeight',
      type: 'int',
      displayWidth: 8,
      defaultValue: 1,
      help: 'The display height of the property.'
    },
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'String',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'adapt',
      defaultValue: function (_, v) {
        return v === undefined || v === null ? '' :
        typeof v === 'function'              ? multiline(v) : v.toString() ;
      }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 70,
      defaultValue: 'String',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.TextFieldView'
    },
    {
      name: 'pattern',
      help: 'Regex pattern for property.'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


CLASS({
  name: 'BooleanProperty',
  extendsModel: 'Property',

  help: 'Describes a properties of type Boolean.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Boolean',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 70,
      defaultValue: 'bool',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.BooleanView'
    },
    {
      name: 'defaultValue',
      defaultValue: false
    },
    {
      name: 'adapt',
      defaultValue: function (_, v) { return !!v; }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'fromString',
      defaultValue: function(s, p) {
        var txt = s.trim();
        this[p.name] =
          txt.equalsIC('y')    ||
          txt.equalsIC('yes')  ||
          txt.equalsIC('true') ||
          txt.equalsIC('t');
      },
      help: 'Function to extract value from a String.'
    }
  ]
});


CLASS({
  name:  'DateProperty',
  extendsModel: 'Property',

  help:  'Describes a properties of type Date.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Date',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 50
    },
    {
      name: 'javaType',
      type: 'String',
      defaultValue: 'Date',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      // TODO: create custom DateView
      defaultValue: 'foam.ui.DateFieldView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'adapt',
      defaultValue: function (_, d) {
        return typeof d === 'string' ? new Date(d) : d;
      }
    },
    {
      name: 'tableFormatter',
      defaultValue: function(d) {
        return d ? d.toRelativeDateString() : '';
      }
    },
    {
      name: 'compareProperty',
      defaultValue: function(o1, o2) {
        if ( ! o1 ) return ( ! o2 ) ? 0: -1;
        if ( ! o2 ) return 1;

        return o1.compareTo(o2);
      }
    }
  ]
});


CLASS({
  name: 'DateTimeProperty',
  extendsModel: 'DateProperty',

  help: 'Describes a properties of type DateTime.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 25,
      defaultValue: 'datetime',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'adapt',
      defaultValue: function(_, d) {
        if ( typeof d === 'number' ) return new Date(d);
        if ( typeof d === 'string' ) return new Date(d);
        return d;
      }
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.DateTimeFieldView'
    }
  ]
});


CLASS({
  name:  'IntProperty',
  extendsModel: 'Property',
  help:  'Describes a properties of type Int.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Int',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 10
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'int',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.IntFieldView'
    },
    {
      name: 'adapt',
      defaultValue: function (_, v) {
        return typeof v === 'number' ? Math.round(v) : v ? parseInt(v) : 0 ;
      }
    },
    {
      name: 'defaultValue',
      defaultValue: 0
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'compareProperty',
      defaultValue: function(o1, o2) {
        return o1 === o2 ? 0 : o1 > o2 ? 1 : -1;
      }
    }
  ]
});


CLASS({
  name:  'FloatProperty',
  extendsModel: 'Property',
  help:  'Describes a properties of type Float.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Float',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'defaultValue',
      defaultValue: 0.0
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'double',
      help: 'The Java type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 15
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.FloatFieldView'
    },
    {
      name: 'adapt',
      defaultValue: function (_, v) {
        return typeof v === 'number' ? v : v ? parseFloat(v) : 0.0 ;
      }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


CLASS({
  name:  'FunctionProperty',
  extendsModel: 'Property',
  help:  'Describes a properties of type Function.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Function',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'Function',
      help: 'The Java type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 15
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.FunctionView'
    },
    {
      name: 'defaultValue',
      defaultValue: function() {}
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        var txt = e.innerHTML.trim();

        this[p.name] = txt.startsWith('function') ?
          eval('(' + txt + ')') :
          new Function(txt) ;
      }
    },
    {
      name: 'adapt',
      defaultValue: function(_, value) {
        if ( typeof value === 'string' ) {
          return value.startsWith('function') ?
            eval('(' + value + ')') :
            new Function(value);
        }
        return value;
      }
    }
  ]
});


CLASS({
  name: 'ArrayProperty',
  extendsModel: 'Property',
  help: 'Describes a properties of type Array.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Array',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'singular',
      type: 'String',
      displayWidth: 70,
      defaultValueFn: function() { return this.name.replace(/s$/, ''); },
      help: 'The plural form of this model\'s name.',
      documentation: function() { /* The singular form of $$DOC{ref:'Property.name'}.*/}
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: '',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'protobufType',
      defaultValueFn: function() { return this.subType; }
    },
    {
      name: 'adapt',
      defaultValue: function(_, a, prop) {
        var m = prop.subType_ || ( prop.subType_ =
          this.X.lookup(prop.subType) || GLOBAL.lookup(prop.subType) );

        if ( m ) {
          for ( var i = 0 ; i < a.length ; i++ ) {
            if ( ! m.isInstance(a[i]) )
              a[i] = a[i].model_ ? FOAM(a[i]) : m.create(a[i]);
          }
        }

        return a;
      }
    },
    {
      name: 'postSet',
      defaultValue: function(oldA, a, prop) {
        var name = prop.nameArrayRelay_ || ( prop.nameArrayRelay_ = prop.name + 'ArrayRelay_' );
        var l = this[name] || ( this[name] = function() {
          this.propertyChange(prop.name, null, this[prop.name]);
        }.bind(this) );
        if ( oldA && oldA.unlisten ) oldA.unlisten(l);
        if ( a && a.listen ) a.listen(l);
      }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValueFn: function(p) { return p.subType + '[]'; },
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.ArrayView'
    },
    {
      name: 'factory',
      defaultValue: function() { return []; }
    },
    {
      name: 'propertyToJSON',
      defaultValue: function(visitor, output, o) {
        if ( ! this.transient && o[this.name].length )
          output[this.name] = visitor.visitArray(o[this.name]);
      }
    },
    {
      name: 'install',
      defaultValue: function(prop) {
        defineLazyProperty(this, prop.name + '$Proxy', function() {
          var proxy = this.X.lookup('foam.dao.ProxyDAO').create({delegate: this[prop.name].dao});

          this.addPropertyListener(prop.name, function(_, _, _, a) {
            proxy.delegate = a.dao;
          });

          return {
            get: function() { return proxy; },
            configurable: true
          };
        });

        this.addMethod('get' + capitalize(prop.singular), function(id) {
          for ( var i = 0; i < this[prop.name].length; i++ ) {
            if ( this[prop.name][i].id === id ) return this[prop.name][i];
          }
        });
      }
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        var model = this.X.lookup(e.getAttribute('model') || p.subType);
        var children = e.children;
        var a = [];
        for ( var i = 0 ; i < children.length ; i++ ) {
          var o = model.create(null, this.Y);
          o.fromElement(children[i], p);
          a.push(o);
        }
        this[p.name] = a;
      }
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


CLASS({
  name:  'ReferenceProperty',
  extendsModel: 'Property',
  help:  'A foreign key reference to another Entity.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Reference',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: '',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'subKey',
      type: 'EXPR',
      displayWidth: 20,
      defaultValue: 'ID',
      help: 'The foreign key that this property references.'
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      // TODO: should obtain primary-key type from subType
      defaultValueFn: function(p) { return 'Object'; },
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.TextFieldView'
// TODO: Uncomment when all usages of ReferenceProperty/ReferenceArrayProperty fixed.
//      defaultValue: 'KeyView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    }
  ]
});


CLASS({
  name: 'StringArrayProperty',
  extendsModel: 'Property',
  help: 'An array of String values.',

  properties: [
    {
      name: 'type',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'Array[]',
      help: 'The FOAM type of this property.'
    },
    {
      name: 'singular',
      type: 'String',
      displayWidth: 70,
      defaultValueFn: function() { return this.name.replace(/s$/, ''); },
      help: 'The plural form of this model\'s name.',
      documentation: function() { /* The singular form of $$DOC{ref:'Property.name'}.*/}
    },
    {
      name: 'subType',
      type: 'String',
      displayWidth: 20,
      defaultValue: 'String',
      help: 'The FOAM sub-type of this property.'
    },
    {
      name: 'displayWidth',
      defaultValue: 50
    },
    {
      name: 'adapt',
      defaultValue: function(_, v) { return Array.isArray(v) ? v : [v]; }
    },
    {
      name: 'factory',
      defaultValue: function() { return []; }
    },
    {
      name: 'javaType',
      type: 'String',
      displayWidth: 10,
      defaultValue: 'String[]',
      help: 'The Java type of this property.'
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.StringArrayView'
    },
    {
      name: 'prototag',
      label: 'Protobuf tag',
      type: 'Int',
      required: false,
      help: 'The protobuf tag number for this field.'
    },
    {
      name: 'exclusive',
      defaultValue: false
    },
    {
      name: 'fromString',
      defaultValue: function(s, p) {
        this[p.name] = s.split(',');
      }
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        var val = [];
        var name = p.singular || 'item';
        for ( var i = 0 ; i < e.children.length ; i++ )
          if ( e.children[i].nodeName === name ) val.push(e.children[i].innerHTML);
        this[p.name] = val;
      }
    }
  ]
});


CLASS({
  name: 'ModelProperty',
  extendsModel: 'Property',
  help: 'Describes a Model property.',

  properties: [
    {
      name: 'type',
      defaultValue: 'Model'
    },
    {
      name: 'getter',
      defaultValue: function(name) {
        var value = this.instance_[name];
        if ( typeof value === 'undefined' ) {
          var prop = this.model_.getProperty(name);
          if ( prop && prop.defaultValueFn )
            value = prop.defaultValueFn.call(this, prop);
          else
            value = prop.defaultValue;
        }
        return this.X.lookup(value);
      }
    },
    {
      name: 'propertyToJSON',
      defaultValue: function(visitor, output, o) {
        if ( ! this.transient ) output[this.name] = o[this.name].id;
      }
    }
  ]
});


CLASS({
  name: 'ViewProperty',
  extendsModel: 'Property',

  help: 'Describes a View-Factory property.',

  properties: [
    {
      name: 'adapt',
      doc: "Can be specified as either a function, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        if ( typeof f === 'function' ) return f;

        if ( typeof f === 'string' ) {
          return function(d, opt_X) {
            return (opt_X || this.X).lookup(f).create(d, opt_X || this.Y);
          }.bind(this);
        }

        if ( typeof f.create === 'function' ) return f.create.bind(f);
        if ( typeof f.model_ === 'string' ) return function(d, opt_X) {
          return FOAM(f, opt_X || this.Y).copyFrom(d);
        }

        console.error('******* Unknown view factory: ', f);
        return f;
      }
    },
    {
      name: 'defaultValue',
      adapt: function(_, f) { return ViewProperty.ADAPT.defaultValue.call(this, null, f); }
    }
  ]
});


CLASS({
  name: 'FactoryProperty',
  extendsModel: 'Property',

  help: 'Describes a Factory property.',

  properties: [
    {
      name: 'preSet',
      doc: "Can be specified as either a function, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        // A Factory Function
        if ( typeof f === 'function' ) return f;

        // A String Path to a Model
        if ( typeof f === 'string' ) return function(map, opt_X) {
          return (opt_X || this.X).lookup(f).create(map, opt_X || this.Y);
        }.bind(this);

        // An actual Model
        if ( Model.isInstance(f) ) return f.create.bind(f);

        // A JSON Model Factory: { factory_ : 'ModelName', arg1: value1, ... }
        if ( f.factory_ ) return function(map, opt_X) {
          var X = opt_X || this.X;
          var m = X.lookup(f.factory_);
          console.assert(m, 'Unknown Factory Model: ' + f.factory_);
          return m.create(f, opt_X || this.Y);
        }.bind(this);

        console.error('******* Invalid Factory: ', f);
        return f;
      }
    }
  ]
});


CLASS({
  name: 'ViewFactoryProperty',
  extendsModel: 'FactoryProperty',

  help: 'Describes a View Factory property.',

  /* Doesn't work yet!
  constants: {
    VIEW_CACHE: {}
  },
  */

  properties: [
    {
      name: 'defaultValue',
      preSet: function(_, f) { return ViewFactoryProperty.ADAPT.defaultValue.call(this, null, f); }
    },
    {
      name: 'defaultValueFn',
      preSet: function(_, f) {
        // return a function that will adapt the given f's return
        return function(prop) {
          // call the defaultValue function, adapt the result, return it
          return ViewFactoryProperty.ADAPT.defaultValue.call(this, null, f.call(this, prop));
        };
      }
    },
    {
      name: 'fromElement',
      defaultValue: function(e, p) {
        this[p.name] = e.innerHTML_ || ( e.innerHTML_ = e.innerHTML );
      }
    },
    {
      name: 'adapt',
      doc: "Can be specified as either a function, String markup, a Model, a Model path, or a JSON object.",
      defaultValue: function(_, f) {
        // Undefined values
        if ( ! f ) return f;

        // A Factory Function
        if ( typeof f === 'function' ) return f;

        var ret;

        // A String Path to a Model
        if ( typeof f === 'string' ) {
          // if not a valid model path then treat as a template
          if ( /[^0-9a-zA-Z$_.]/.exec(f) ) {
            // Cache the creation of an DetailView so that we don't
            // keep recompiling the template
            var VIEW_CACHE = ViewFactoryProperty.VIEW_CACHE ||
              ( ViewFactoryProperty.VIEW_CACHE = {} );
            var viewModel = VIEW_CACHE[f];
            if ( ! viewModel ) {
                viewModel = VIEW_CACHE[f] = Model.create({
                  name: 'InnerDetailView' + this.$UID,
                  extendsModel: 'foam.ui.DetailView',
                  templates:[{name: 'toHTML', template: f}]
                });
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

              // TODO(kgr): this isn't right because compiling the View
              // template is async.  Should create a FutureView to handle this.
              viewModel.arequire();
            }
            ret = function(args, X) { return viewModel.create(args, X || this.Y); };
          } else {
            ret = function(map, opt_X) {
              var model = (opt_X || this.X).lookup(f);
              console.assert(!!model, 'Unknown model: ' + f + ' in ' + this.name + ' property');
              return model.create(map, opt_X || this.Y);
            }.bind(this);
          }

          ret.toString = function() { return '"' + f + '"'; };
          return ret;
        }

        // An actual Model
        if ( Model.isInstance(f) ) return function(args, opt_X) {
          return f.create(args, opt_X || this.Y)
        }.bind(this);

        // A JSON Model Factory: { factory_ : 'ModelName', arg1: value1, ... }
        if ( f.factory_ ) {
          ret = function(map, opt_X) {
            var m = (opt_X || this.X).lookup(f.factory_);
            console.assert(m, 'Unknown ViewFactory Model: ' + f.factory_);
            return m.create(f, opt_X || this.Y).copyFrom(map);
          }.bind(this);

          ret.toString = function() { return JSON.stringify(f); };
          return ret;
        }

        if ( this.X.lookup('foam.ui.BaseView').isInstance(f) ) return constantFn(f);

        console.error('******* Invalid Factory: ', f);
        return f;
      }
    }
  ]
});


CLASS({
  name: 'ReferenceArrayProperty',
  extendsModel: 'ReferenceProperty',

  properties: [
    {
      name: 'type',
      defaultValue: 'Array',
      displayWidth: 20,
      help: 'The FOAM type of this property.'
    },
    {
      name: 'factory',
      defaultValue: function() { return []; },
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.StringArrayView',
// TODO: Uncomment when all usages of ReferenceProperty/ReferenceArrayProperty fixed.
//      defaultValue: 'DAOKeyView'
    }
  ]
});

CLASS({
  name: 'EMailProperty',
  extendsModel: 'StringProperty'
});

CLASS({
  name: 'ImageProperty',
  extendsModel: 'StringProperty'
});

CLASS({
  name: 'URLProperty',
  extendsModel: 'StringProperty'
});

CLASS({
  name: 'ColorProperty',
  extendsModel: 'StringProperty'
});

CLASS({
  name: 'PasswordProperty',
  extendsModel: 'StringProperty'
});

if ( DEBUG ) CLASS({
  name: 'DocumentationProperty',
  extendsModel: 'Property',
  help: 'Describes the documentation properties found on Models, Properties, Actions, Methods, etc.',
  documentation: "The developer documentation for this $$DOC{ref:'.'}. Use a $$DOC{ref:'DocModelView'} to view documentation.",

  properties: [
    {
      name: 'type',
      type: 'String',
      defaultvalue: 'Documentation'
    },
    { // Note: defaultValue: for the getter function didn't work. factory: does.
      name: 'getter',
      type: 'Function',
      debug: true,
      defaultValue: function(name) {
        var doc = this.instance_[name]
        if (doc && typeof Documentation != 'undefined' && Documentation // a source has to exist (otherwise we'll return undefined below)
            && (  !doc.model_ // but we don't know if the user set model_
                  || !doc.model_.getPrototype // model_ could be a string
                  || !Documentation.isInstance(doc) // check for correct type
               ) ) {
          // So in this case we have something in documentation, but it's not of the
          // "Documentation" model type, so FOAMalize it.
          if (doc.body) {
            this.instance_[name] = Documentation.create( doc );
          } else {
            this.instance_[name] = Documentation.create({ body: doc });
          }
        }
        // otherwise return the previously FOAMalized model or undefined if nothing specified.
        return this.instance_[name];
      }
    },
    {
      name: 'view',
      defaultValue: 'foam.ui.DetailView',
      debug: true
    },
    {
      name: 'help',
      defaultValue: 'Documentation for this entity.',
      debug: true
    },
    {
      name: 'documentation',
      factory: function() { return "The developer documentation for this $$DOC{ref:'.'}. Use a $$DOC{ref:'DocModelView'} to view documentation."; },
      debug: true
   }
  ]
});

/**
 * @license
 * Copyright 2012-2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Now remove BootstrapModel so nobody tries to use it
// TODO: do this once no views use it directly
// delete BootstrapModel;

CLASS({
  name: 'Action',
  plural: 'Actions',

  tableProperties: [
    'name',
    'label'
  ],

  documentation: function() {  /*
    <p>An executable behavior that can be triggered by the user.
      $$DOC{ref:'Action',usePlural:true} are typically represented as buttons
      or menu items. Activating the $$DOC{ref:'Action'} causes the
      $$DOC{ref:'.action'} function $$DOC{ref:'Property'} to run. The user-facing
      control's state is handled by $$DOC{ref:'.isEnabled'} and $$DOC{ref:'.isAvailable'}.
    </p>
  */},

  properties: [
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the action.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'label',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return labelize(this.name); },
      help: 'The display label for the action.',
      documentation: function() { /* A human readable label for the $$DOC{ref:'.'}. May
        contain spaces or other odd characters.
         */}
    },
    {
      name: 'speechLabel',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return this.label; },
      help: 'The speech label for the action.',
      documentation: "A speakable label for the $$DOC{ref:'.'}. Used for accessibility."
    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      defaultValue: '',
      help: 'Help text associated with the action.',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'.'},
          through field labels or tooltips.
        */}
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      documentation: 'The developer documentation.',
      debug: true
    },
    {
      name: 'default',
      type: 'Boolean',
      view: 'foam.ui.BooleanView',
      defaultValue: false,
      help: 'Indicates if this is the default action.',
      documentation: function() { /*
          Indicates if this is the default $$DOC{ref:'Action'}.
        */}
    },
    {
      model_: 'FunctionProperty',
      name: 'isAvailable',
      label: 'Available',
      displayWidth: 70,
      displayHeight: 3,
      defaultValue: function() { return true; },
      help: 'Function to determine if action is available.',
      documentation: function() { /*
            A function used to determine if the $$DOC{ref:'Action'} is available.
        */}
    },
    {
      model_: 'FunctionProperty',
      name: 'isEnabled',
      label: 'Enabled',
      displayWidth: 70,
      displayHeight: 3,
      defaultValue: function() { return true; },
      help: 'Function to determine if action is enabled.',
      documentation: function() { /*
            A function used to determine if the $$DOC{ref:'Action'} is enabled.
        */}
    },
    {
      model_: 'FunctionProperty',
      name: 'labelFn',
      label: 'Label Function',
      defaultValue: function(action) { return action.label; },
      help: "Function to determine label. Defaults to 'this.label'.",
      documentation: function() { /*
            A function used to determine the label. Defaults to $$DOC{ref:'.label'}.
        */}
    },
    {
      name: 'iconUrl',
      type: 'String',
      defaultValue: undefined,
      help: 'Provides a url for an icon to render for this action',
      documentation: function() { /*
            A url for the icon to render for this $$DOC{ref:'Action'}.
                */}
    },
    {
      name: 'showLabel',
      type: 'String',
      defaultValue: true,
      help: 'Property indicating whether the label should be rendered alongside the icon',
      documentation: function() { /*
            Indicates whether the $$DOC{ref:'.label'} should be rendered alongside the icon.
        */}
    },
    {
      name: 'children',
      type: 'Array',
      factory: function() { return []; },
      subType: 'Action',
      view: 'foam.ui.ArrayView',
      help: 'Child actions of this action.',
      persistent: false,
      documentation: function() { /*
            Child $$DOC{ref:'Action',usePlural:true} of this instance.
        */}
    },
    {
      name: 'parent',
      type: 'String',
      help: 'The parent action of this action',
      documentation: function() { /*
            The parent $$DOC{ref:'Action'} of this instance.
        */}
    },
    {
      model_: 'FunctionProperty',
      name: 'action',
      displayWidth: 80,
      displayHeight: 20,
      defaultValue: '',
      help: 'Function to implement action.',
      documentation: function() { /*
            This function supplies the execution of the $$DOC{ref:'Action'} when triggered.
        */}
    },
    {
      model_: 'StringArrayProperty',
      name: 'keyboardShortcuts',
      documentation: function() { /*
            Keyboard shortcuts for the $$DOC{ref:'Action'}.
        */}
    },
    {
      name: 'translationHint',
      label: 'Description for Translation',
      type: 'String',
      defaultValue: ''
    }
  ],
  methods: {
    maybeCall: function(X, that) { /* Executes this action if $$DOC{ref:'.isEnabled'} is allows it. */
      if ( this.isAvailable.call(that, this) && this.isEnabled.call(that, this) ) {
        this.action.call(that, X, this);
        that.publish(['action', this.name], this);
      }
    }
  }
});

//Action.getPrototype().maybeCall = function(X, that) {
//  if ( this.isEnabled.call(that, this) ) this.action.call(that, X, this);
//};


/* Not used yet
   MODEL({
   name: 'Topic',

   tableProperties: [
   'name',
   'description'
   ],

   properties: [
   {
   name:  'name',
   type:  'String',
   required: true,
   displayWidth: 30,
   displayHeight: 1,
   defaultValue: '',
   // todo: test this
   preSet: function (newValue) {
   return newValue.toUpperCase();
   },
   help: 'The coding identifier for this topic.'
   },
   {
   name: 'description',
   type: 'String',
   displayWidth: 70,
   displayHeight: 1,
   defaultValue: '',
   help: 'A brief description of this topic.'
   }
   ]
   });
*/

CLASS({
  name: 'Arg',

  tableProperties: [
    'type',
    'name',
    'description'
  ],

  documentation: function() { /*
      <p>Represents one $$DOC{ref:'Method'} argument, including the type information.</p>
  */},

  properties: [
    {
      name:  'type',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: 'Object',
      debug: true,
      help: 'The type of this argument.',
      documentation: function() { /* <p>The type of the $$DOC{ref:'.'}, either a primitive type or a $$DOC{ref:'Model'}.</p>
      */}
    },
    {
      name: 'javaType',
      type: 'String',
      required: false,
      defaultValueFn: function() { return this.type; },
      help: 'The java type that represents the type of this property.',
      debug: true,
      documentation: function() { /* When running FOAM in a Java environment, specifies the Java type
        or class to use. */}
    },
    {
      name: 'javascriptType',
      type: 'String',
      required: false,
      defaultValueFn: function() { return this.type; },
      help: 'The javascript type that represents the type of this property.',
      debug: true,
      documentation: function() { /* When running FOAM in a javascript environment, specifies the javascript
         type to use. */}
    },
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the entity.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      model_: 'BooleanProperty',
      name: 'required',
      defaultValue: true,
      debug: true,
      documentation: function() { /*
        Indicates that this arugment is required for calls to the containing $$DOC{ref:'Method'}.
      */}
    },
    {
      name: 'defaultValue',
      help: 'Default Value if not required and not provided.',
      debug: true,
      documentation: function() { /*
        The default value to use if this argument is not required and not provided to the $$DOC{ref:'Method'} call.
      */}
    },
    {
      name: 'description',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'A brief description of this argument.',
      debug: true,
      documentation: function() { /*
        A human-readable description of the argument.
      */}
    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      defaultValue: '',
      help: 'Help text associated with the entity.',
      debug: true,
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'.'},
          through field labels or tooltips.
        */}
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      documentation: 'The developer documentation.',
      debug: true
    }
  ],

  methods: {
    decorateFunction: function(f, i) {
      if ( this.type === 'Object' ) return f;
      var type = this.type;

      return this.required ?
        function() {
          console.assert(arguments[i] !== undefined, 'Missing required argument# ' + i);
          console.assert(typeof arguments[i] === type,  'argument# ' + i + ' type expected to be ' + type + ', but was ' + (typeof arguments[i]) + ': ' + arguments[i]);
          return f.apply(this, arguments);
        } :
        function() {
          console.assert(arguments[i] === undefined || typeof arguments[i] === type,
              'argument# ' + i + ' type expected to be ' + type + ', but was ' + (typeof arguments[i]) + ': ' + arguments[i]);
          return f.apply(this, arguments);
        } ;
    }
  },

  templates:[
    {
      model_: 'Template',

      name: 'javaSource',
      description: 'Java Source',
      template: '<%= this.type %> <%= this.name %>',
      debug: true
    },
    {
      model_: 'Template',

      name: 'closureSource',
      description: 'Closure JavaScript Source',
      template: '@param {<%= this.javascriptType %>} <%= this.name %> .',
      debug: true
    },
    {
      model_: 'Template',

      name: 'webIdl',
      description: 'Web IDL Source',
      template: '<%= this.type %> <%= this.name %>',
      debug: true
    }
  ]
});


CLASS({
  name: 'Constant',
  plural: 'constants',

  tableProperties: [
    'name',
    'value',
    'description'
  ],

  documentation: function() {/*
  */},

  properties: [
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the entity.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'description',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'A brief description of this method.',
      documentation: function() { /* A human readable description of the $$DOC{ref:'.'}.
         */}
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      documentation: 'The developer documentation.',
      debug: true
    },
    {
      name: 'value',
      help: 'The value of the constant..'
    },
    {
      name:  'type',
      defaultValue: '',
      help: 'Type of the constant.'
    },
    {
      name: 'translationHint',
      label: 'Description for Translation',
      type: 'String',
      defaultValue: ''
    }
  ]
});


CLASS({
  name: 'Message',
  plural: 'messages',

  tableProperties: [
    'name',
    'value',
    'translationHint'
  ],

  documentation: function() {/*
  */},

  properties: [
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the message.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'value',
      type: 'String',
      help: 'The message itself.'
    },
    {
      name: 'meaning',
      type: 'String',
      help: 'Linguistic clarification to resolve ambiguity.',
      documentation: function() {/* A human readable discussion of the
        $$DOC{ref:'.'} to resolve linguistic ambiguities.
      */}
    },
    {
      model_: 'ArrayProperty',
      name: 'placeholders',
      help: 'Placeholders to inject into the message.',
      documentation: function() {/* Array of plain Javascript objects
        describing in-message placeholders. The data can be expanded into
        $$DOC{ref:'foam.i18n.Placeholder'}, for example.
      */}
    },
    {
      model_: 'FunctionProperty',
      name: 'replaceValues',
      documentation: function() {/* Function that binds values to message
        contents.
      */},
      defaultValue: function() { return this.value; }
    },
    {
      name: 'translationHint',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'A brief description of this message and the context in which it used.',
      documentation: function() {/* A human readable description of the
        $$DOC{ref:'.'} and its context for the purpose of translation.
      */}
    }
  ]
});


CLASS({
  name: 'Method',
  plural: 'Methods',

  tableProperties: [
    'name',
    'description'
  ],

  documentation: function() {/*
    <p>A $$DOC{ref:'Method'} represents a callable piece of code with
    $$DOC{ref:'.args',text:'arguments'} and an optional return value.
    </p>
    <p>$$DOC{ref:'Method',usePlural:true} contain code that runs in the instance's scope, so code
    in your $$DOC{ref:'Method'} has access to the other $$DOC{ref:'Property',usePlural:true} and
    features of your $$DOC{ref:'Model'}.</p>
    <ul>
      <li><code>this.propertyName</code> gives the value of a $$DOC{ref:'Property'}</li>
      <li><code>this.propertyName$</code> is the binding point for the $$DOC{ref:'Property'}. Assignment
          will bind bi-directionally, or <code>Events.follow(src, dst)</code> will bind from
          src to dst.</li>
      <li><code>this.methodName</code> calls another $$DOC{ref:'Method'} of this
              $$DOC{ref:'Model'}</li>
      <li><p><code>this.SUPER()</code> calls the $$DOC{ref:'Method'} implementation from the
                base $$DOC{ref:'Model'} (specified in $$DOC{ref:'Model.extendsModel'}).</p>
                <ul>
                  <li>
                      <p>Calling
                      <code>this.SUPER()</code> is extremely important in your <code>init()</code>
                      $$DOC{ref:'Method'}, if you provide one.</p>
                      <p>You can also specify <code>SUPER</code> as the
                      first argument of your Javascript function, and it will be populated with the
                      correct base function automatically:</p>
                      <p><code>function(other_arg) {<br/>
                                  &nbsp;&nbsp; this.SUPER(other_arg); // calls super, argument is optional depending on what your base method takes.<br/>
                                  &nbsp;&nbsp; ...<br/></code>
                      </p>
                    </li>
                  </ul>
                </li>
    </ul>
  */},

  properties: [
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The coding identifier for the entity.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */}
    },
    {
      name: 'description',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'A brief description of this method.',
      documentation: function() { /* A human readable description of the $$DOC{ref:'.'}.
         */}

    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      defaultValue: '',
      debug: true,
      help: 'Help text associated with the entity.',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'.'},
          through field labels or tooltips.
        */}
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      documentation: 'The developer documentation.',
      debug: true
    },
    {
      name: 'code',
      type: 'Function',
      displayWidth: 80,
      displayHeight: 30,
      view: 'foam.ui.FunctionView',
      help: 'Javascript code to implement this method.',
      postSet: function() {
        if ( ! DEBUG ) return;
        // check for documentation in a multiline comment at the beginning of the code
        // accepts "/* comment */ function() {...." or "function() { /* comment */ ..."
        // TODO: technically unicode letters are valid in javascript identifiers, which we are not catching here for function arguments.
        var multilineComment = /^\s*function\s*\([\$\s\w\,]*?\)\s*{\s*\/\*([\s\S]*?)\*\/[\s\S]*$|^\s*\/\*([\s\S]*?)\*\/([\s\S]*)/.exec(this.code.toString());
        if ( multilineComment ) {
          var bodyFn = multilineComment[1];
          this.documentation = this.Y.Documentation.create({
            name: this.name,
            body: bodyFn
          })
        }
      },
      documentation: function() { /*
          <p>The code to execute for the $$DOC{ref:'Method'} call.</p>
          <p>In a special case for javascript documentation, an initial multiline comment, if present,
           will be pulled from your code and used as a documentation template:
            <code>function() { \/\* docs here \*\/ code... }</code></p>

        */}
    },
    {
      name:  'returnType',
      defaultValue: '',
      help: 'Return type.',
      documentation: function() { /*
          The return type of the $$DOC{ref:'Method'}.
        */},
      debug: true
    },
    {
      model_: 'BooleanProperty',
      name: 'returnTypeRequired',
      defaultValue: true,
      documentation: function() { /*
          Indicates whether the return type is checked.
        */},
      debug: true
    },
    {
      model_: 'ArrayProperty',
      name: 'args',
      type: 'Array[Arg]',
      subType: 'Arg',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Method arguments.',
      documentation: function() { /*
          The $$DOC{ref:'Arg',text:'Arguments'} for the method.
        */},
      debug: true
    },
    {
      name: 'whenIdle',
      help: 'Should this listener be deferred until the system is idle (ie. not running any animations).',
      documentation: function() { /*
          For a listener $$DOC{ref:'Method'}, indicates that the events should be delayed until animations are finished.
        */}
    },
    {
      name: 'isMerged',
      help: 'As a listener, should this be merged?',
      documentation: function() { /*
          For a listener $$DOC{ref:'Method'}, indicates that the events should be merged to avoid
          repeated activations.
        */}
    },
    {
      model_: 'BooleanProperty',
      name: 'isFramed',
      help: 'As a listener, should this be animated?',
      defaultValue: false,
      documentation: function() { /*
          For a listener $$DOC{ref:'Method'}, indicates that this listener is animated,
          and events should be merged to trigger only once per frame.
        */}
    },
  ],

  templates:[
    {
      model_: 'Template',

      name: 'javaSource',
      description: 'Java Source',
      template: '<%= this.returnType || "void" %> <%= this.name %>(' +
        '<% for ( var i = 0 ; i < this.args.length ; i++ ) { var arg = this.args[i]; %>' +
        '<%= arg.javaSource() %><% if ( i < this.args.length-1 ) out(", ");%>' +
        '<% } %>' +
        ')'
    },
    {
      model_: 'Template',

      name: 'closureSource',
      description: 'Closure JavaScript Source',
      // TODO:  Change returnType to returnType.javascriptType
      template:
      '/**\n' +
        '<% for ( var i = 0; i < this.args.length ; i++ ) { var arg = this.args[i]; %>' +
        ' * <%= arg.closureSource() %>\n' +
        '<% } %>' +
        '<% if (this.returnType) { %>' +
        ' * @return {<%= this.returnType %>} .\n' +
        '<% } %>' +
        ' */\n' +
        '<%= arguments[1] %>.prototype.<%= this.name %> = goog.abstractMethod;'
    },
    {
      model_: 'Template',

      name: 'webIdl',
      description: 'Web IDL Source',
      template:
      '<%= this.returnType || \'void\' %> <%= this.name %>(' +
        '<% for ( var i = 0 ; i < this.args.length ; i++ ) { var arg = this.args[i]; %>' +
        '<%= arg.webIdl() %><% if ( i < this.args.length-1 ) out(", "); %>' +
        '<% } %>' +
        ')'
    }
  ]
});

// initialize to empty object for the two methods added below
Method.getPrototype().decorateFunction = function(f) {
  for ( var i = 0 ; i < this.args.length ; i++ ) {
    var arg = this.args[i];

    f = arg.decorateFunction(f, i);
  }

  var returnType = this.returnType;

  return returnType ?
    function() {
      var ret = f.apply(this, arguments);
      console.assert(typeof ret === returnType, 'return type expected to be ' + returnType + ', but was ' + (typeof ret) + ': ' + ret);
      return ret;
    } : f ;
};

Method.getPrototype().generateFunction = function() {
  var f = this.code;

  return DEBUG ? this.decorateFunction(f) : f;
};

Method.methods = {
  decorateFunction: Method.getPrototype().decorateFunction,
  generateFunction: Method.getPrototype().generateFunction
};


CLASS({
  name: 'Template',

  tableProperties: [
    'name', 'description'
  ],

  documentation: function() {/*
    <p>A $$DOC{ref:'.'} is processed to create a method that generates content for a $$DOC{ref:'foam.ui.View'}.
    Sub-views can be created from inside the
    $$DOC{ref:'Template'} using special tags. The content is lazily processed, so the first time you ask for
    a $$DOC{ref:'Template'}
    the content is compiled, tags expanded and sub-views created. Generally a template is included in a
    $$DOC{ref:'foam.ui.View'}, since after compilation a method is created and attached to the $$DOC{ref:'foam.ui.View'}
    containing the template.
    </p>
    <p>For convenience, $$DOC{ref:'Template',usePlural:true} can be specified as a function with a block
    comment inside to avoid line wrapping problems:
    <code>templates: [ myTemplate: function() { \/\* my template content \*\/ }]</code>
    </p>
    <p>HTML $$DOC{ref:'Template',usePlural:true} can include the following JSP-style tags:
    </p>
    <ul>
       <li><code>&lt;% code %&gt;</code>: code inserted into template, but nothing implicitly output</li>
       <li><code>&lt;%= comma-separated-values %&gt;</code>: all values are appended to template output</li>
       <li><code>&lt;%# expression %&gt;</code>: dynamic (auto-updating) expression is output</li>
       <li><code>\\&lt;new-line&gt;</code>: ignored</li>
       <li><code>$$DOC{ref:'Template',text:'%%value'}(&lt;whitespace&gt;|{parameters})</code>: output a single value to the template output</li>
       <li><code>$$DOC{ref:'Template',text:'$$feature'}(&lt;whitespace&gt;|{parameters})</code>: output the View or Action for the current Value</li>
       <li><code>&lt;!-- comment --&gt;</code> comments are stripped from $$DOC{ref:'Template',usePlural:true}.</li>
    </ul>
  */},

  properties: [
    {
      name:  'name',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The template\'s unique name.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
      */}
    },
    {
      name:  'description',
      type:  'String',
      required: true,
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'The template\'s description.',
      documentation: "A human readable description of the $$DOC{ref:'.'}."
    },
    {
      model_: 'ArrayProperty',
      name: 'args',
      type: 'Array[Arg]',
      subType: 'Arg',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Method arguments.',
      documentation: function() { /*
          The $$DOC{ref:'Arg',text:'Arguments'} for the $$DOC{ref:'Template'}.
        */}
    },
    {
      name: 'template',
      type: 'String',
      displayWidth: 180,
      displayHeight: 30,
      rows: 30, cols: 80,
      defaultValue: '',
      view: 'foam.ui.TextAreaView',
      // Doesn't work because of bootstrapping issues.
      // preSet: function(_, t) { return typeof t === 'function' ? multiline(t) : t ; },
      help: 'Template text. <%= expr %> or <% out(...); %>',
      documentation: "The string content of the uncompiled $$DOC{ref:'Template'} body."
    },
    {
      name: 'futureTemplate',
      transient: true
    },
    {
      name: 'code',
      transient: true
    },
    /*
       {
       name: 'templates',
       type: 'Array[Template]',
       subType: 'Template',
       view: 'foam.ui.ArrayView',
       defaultValue: [],
       help: 'Sub-templates of this template.'
       },*/
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      debug: true
    }
  ]
});


CLASS({
  name: 'Documentation',

  tableProperties: [
    'name'
  ],

  documentation: function() {/*
      <p>The $$DOC{ref:'Documentation'} model is used to store documentation text to
      describe the use of other models. Set the $$DOC{ref:'Model.documentation'} property
      of your model and specify the body text:</p>
      <ul>
        <li><p>Fully define the Documentation model:</p><p>documentation:
        { model_: 'Documentation', body: function() { \/\* your doc text \*\/} }</p>
        </li>
        <li><p>Define as a function:</p><p>documentation:
            function() { \/\* your doc text \*\/} </p>
        </li>
        <li><p>Define as a one-line string:</p><p>documentation:
            "your doc text" </p>
        </li>
      </ul>
    */},

  properties: [
    {
      name: 'name',
      type: 'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: 'documentation',
      help: 'The Document\'s unique name.',
      documentation: "An optional name for the document. Documentation is normally referenced by the name of the containing Model."
    },
    {
      name:  'label',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      help: 'The Document\'s title or descriptive label.',
      documentation: "A human readable title to display. Used for books of documentation and chapters."
    },
    {
      name: 'body',
      type: 'Template',
      defaultValue: '',
      help: 'The main content of the document.',
      documentation: "The main body text of the document. Any valid template can be used, including the $$DOC{ref:'foam.documentation.DocView'} specific $$DOC{ref:'foam.documentation.DocView',text:'$$DOC{\"ref\"}'} tag.",
      preSet: function(_, template) {
        return TemplateUtil.expandTemplate(this, template);
      }
    },
    {
      model_: 'ArrayProperty',
      name: 'chapters',
      type: 'Array[Document]',
      subtype: 'Documentation',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Sub-documents comprising the full body of this document.',
      documentation: "Optional sub-documents to be included in this document. A viewer may choose to provide an index or a table of contents.",
      debug: true,
      preSet: function(old, nu) {
        if ( ! DEBUG ) return []; // returning undefined causes problems
        var self = this;
        var foamalized = [];
        // create models if necessary
        nu.forEach(function(chapter) {
          if (chapter && typeof self.Y.Documentation != "undefined" && self.Y.Documentation // a source has to exist (otherwise we'll return undefined below)
              && (  !chapter.model_ // but we don't know if the user set model_
                 || !chapter.model_.getPrototype // model_ could be a string
                 || !self.Y.Documentation.isInstance(chapter) // check for correct type
              ) ) {
            // So in this case we have something in documentation, but it's not of the
            // "Documentation" model type, so FOAMalize it.
            if (chapter.body) {
              foamalized.push(self.Y.Documentation.create( chapter ));
            } else {
              foamalized.push(self.Y.Documentation.create({ body: chapter }));
            }
          } else {
            foamalized.push(chapter);
          }
        });
        return foamalized;
      },
      //postSet: function() { console.log("post ",this.chapters); }
    }
  ]
});

// HACK to get around property-template bootstrap ordering issues
TemplateUtil.expandModelTemplates(Property);
TemplateUtil.expandModelTemplates(Method);
TemplateUtil.expandModelTemplates(Model);
TemplateUtil.expandModelTemplates(Arg);

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'Interface',
  plural: 'Interfaces',

  tableProperties: [
    'package', 'name', 'description'
  ],

  documentation: function() { /*
      <p>$$DOC{ref:'Interface',usePlural:true} specify a set of methods with no
      implementation. $$DOC{ref:'Model',usePlural:true} implementing $$DOC{ref:'Interface'}
      fill in the implementation as needed. This is analogous to
      $$DOC{ref:'Interface',usePlural:true} in object-oriented languages.</p>
    */},

  properties: [
    {
      name: 'id',
      transient: true,
      factory: function() { return this.package ? this.package + '.' + this.name : this.name; }
    },
    {
      name:  'name',
      required: true,
      help: 'Interface name.',
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} definition names should use CamelCase starting with a capital letter.
         */}
    },
    {
      name:  'package',
      help: 'Interface package.',
      documentation: Model.PACKAGE.documentation
    },
    {
      name: 'extends',
      type: 'Array[String]',
      view: 'foam.ui.StringArrayView',
      help: 'Interfaces extended by this interface.',
      documentation: function() { /*
        The other $$DOC{ref:'Interface',usePlural:true} this $$DOC{ref:'Interface'} inherits
        from. Like a $$DOC{ref:'Model'} instance can $$DOC{ref:'Model.extendsModel'} other
        $$DOC{ref:'Model',usePlural:true},
        $$DOC{ref:'Interface',usePlural:true} should only extend other
        instances of $$DOC{ref:'Interface'}.</p>
        <p>Do not specify <code>extendsModel: 'Interface'</code> unless you are
        creating a new interfacing system.
      */}
    },
    {
      name:  'description',
      type:  'String',
      required: true,
      displayWidth: 70,
      displayHeight: 1,
      defaultValue: '',
      help: 'The interface\'s description.',
      documentation: function() { /* A human readable description of the $$DOC{ref:'.'}. */ }
    },
    {
      name: 'help',
      label: 'Help Text',
      displayWidth: 70,
      displayHeight: 6,
      view: 'foam.ui.TextAreaView',
      help: 'Help text associated with the argument.',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'.'},
          through field labels or tooltips.
        */}
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      debug: true
    },
    {
      model_: 'ArrayProperty',
      name: 'methods',
      type: 'Array[Method]',
      subType: 'Method',
      view: 'foam.ui.ArrayView',
      factory: function() { return []; },
      defaultValue: [],
      help: 'Methods associated with the interface.',
      documentation: function() { /*
        <p>The $$DOC{ref:'Method',usePlural:true} that the interface requires
        extenders to implement.</p>
        */}
    }
  ],
  templates:[
    {
      model_: 'Template',

      name: 'javaSource',
      description: 'Java Source',
      template: 'public interface <% out(this.name); %>\n' +
        '<% if ( this.extends.length ) { %>   extends <%= this.extends.join(", ") %>\n<% } %>' +
        '{\n<% for ( var i = 0 ; i < this.methods.length ; i++ ) { var meth = this.methods[i]; %>' +
        '   <%= meth.javaSource() %>;\n' +
        '<% } %>' +
        '}'
    },
    {
      model_: 'Template',

      name: 'closureSource',
      description: 'Closure JavaScript Source',
      template:
      'goog.provide(\'<%= this.name %>\');\n' +
        '\n' +
        '/**\n' +
        ' * @interface\n' +
        '<% for ( var i = 0 ; i < this.extends.length ; i++ ) { var ext = this.extends[i]; %>' +
        ' * @extends {<%= ext %>}\n' +
        '<% } %>' +
        ' */\n' +
        '<%= this.name %> = function() {};\n' +
        '<% for ( var i = 0 ; i <  this.methods.length ; i++ ) { var meth = this.methods[i]; %>' +
        '\n<%= meth.closureSource(undefined, this.name) %>\n' +
        '<% } %>'
    },
    {
      model_: 'Template',

      name: 'webIdl',
      description: 'Web IDL Source',
      template:
      'interface <%= this.name %> <% if (this.extends.length) { %>: <%= this.extends[0] %> <% } %>{\n' +
        '<% for ( var i = 0 ; i < this.methods.length ; i++ ) { var meth = this.methods[i]; %>' +
        '  <%= meth.webIdl() %>;\n' +
        '<% } %>' +
        '}'
    }
  ]
});


CLASS({
  name: 'UnitTest',
  plural: 'Unit Tests',

  exports: [
    'log',
    'jlog',
    'assert',
    'fail',
    'ok',
    'append'
  ],

  documentation: function() {/*
    <p>A basic unit test. $$DOC{ref: ".atest"} is the main method, it executes this test.</p>

    <p>After the test has finished running, its $$DOC{ref: ".passed"} and $$DOC{ref: ".failed"} properties count the number of assertions that passed and failed in this test <em>subtree</em> (that is, including the children, if run).</p>

    <p>Test failure is abstracted by the $$DOC{ref: ".hasFailed"} method; this method should always be used, since other subclasses have different definitions of failure.</p>
  */},

  tableProperties: [ 'description', 'passed', 'failed' ],
  properties:
  [
    {
      model_: 'Property',
      name: 'name',
      type: 'String',
      required: true,
      displayWidth: 50,
      documentation: 'The unit test\'s name.'
    },
    {
      model_: 'StringProperty',
      name: 'modelId'
    },
    {
      model_: 'Property',
      name: 'description',
      type: 'String',
      displayWidth: 70,
      displayHeight: 5,
      defaultValue: '',
      // defaultValueFn: function() { return "Test " + this.name; },
      documentation: 'A multi-line description of the unit test.'
    },
    {
      model_: 'BooleanProperty',
      name: 'disabled',
      documentation: 'When true, this test is ignored. Test runners should exclude disabled tests from their DAOs.',
      defaultValue: false
    },
    {
      model_: 'IntProperty',
      name: 'passed',
      required: true,
      transient: true,
      displayWidth: 8,
      displayHeight: 1,
      view: 'foam.ui.IntFieldView',
      documentation: 'Number of assertions which have passed.'
    },
    {
      model_: 'IntProperty',
      name: 'failed',
      required: true,
      transient: true,
      displayWidth: 8,
      displayHeight: 1,
      documentation: 'Number of assertions which have failed.'
    },
    {
      model_: 'BooleanProperty',
      name: 'async',
      defaultValue: false,
      documentation: 'Set to make this test asynchronoous. Async tests receive a <tt>ret</tt> parameter as their first argument, and $$DOC{ref: ".atest"} will not return until <tt>ret</tt> is called by the test code.'
    },
    {
      model_: 'FunctionProperty',
      name: 'code',
      label: 'Test Code',
      displayWidth: 80,
      displayHeight: 30,
      documentation: 'The code for the test. Should not include the <tt>function() { ... }</tt>, just the body. Should expect a <tt>ret</tt> parameter when the test is async, see $$DOC{ref: ".async", text: "above"}.',
      fromElement: function(e, p) {
        var txt = e.innerHTML;

        txt =
          txt.trim().startsWith('function') ? txt                               :
          this.async                        ? 'function(ret) {\n' + txt + '\n}' :
                                              'function() {\n'    + txt + '\n}' ;

        this[p.name] = eval('(' + txt + ')');
      },
      adapt: function(_, value) {
        if ( typeof value === 'string' ) {
          if ( value.startsWith('function') ) {
            value = eval('(' + value + ')');
          } else {
            value = new Function(value);
          }
        }

        // Now value is a function either way.
        // We just need to check that if it's async it has an argument.
        if ( typeof value === 'function' && this.async && value.length === 0 ) {
          var str = value.toString();
          return eval('(function(ret)' + str.substring(str.indexOf('{')) + ')');
        }

        return value;
      }
    },
    {
      model_: 'Property',
      name: 'results',
      type: 'String',
      mode: 'read-only',
      view: 'foam.ui.UnitTestResultView',
      transient: true,
      required: true,
      displayWidth: 80,
      displayHeight: 20,
      documentation: 'Log output for this test. Written to by $$DOC{ref: ".log"}, as well as $$DOC{ref: ".assert"} and its friends $$DOC{ref: ".fail"} and $$DOC{ref: ".ok"}.'
    },
    {
      model_: 'StringArrayProperty',
      name:  'tags',
      label: 'Tags',
      documentation: 'A list of tags for this test. Gives the environment(s) in which a test can be run. Currently in use: node, web.'
    },
    {
      model_: 'BooleanProperty',
      name: 'running',
      defaultValue: false
    }
  ],

  methods:{
    atest: function(model) {
      return function(ret) {
        var exception = false;
        try {
          var obj = model.create(undefined, this.Y);
          var self = this;
          this.modelId = model.id;
          var finished = function() {
            ret(!self.hasFailed());
          };

          if ( this.async )
            this.code.call(obj, finished);
          else
            this.code.call(obj);
        } catch(e) {
          this.fail("Exception thrown: " + e.stack);
          exception = true;
          ret(false);
        }

        if ( ! this.async && ! exception ) finished();
      }.bind(this);
    },

    append: function(s) { this.results += s; },
    log: function(/*arguments*/) {
      for ( var i = 0 ; i < arguments.length ; i++ )
        this.append(arguments[i]);
      this.append('\n');
    },
    jlog: function(/*arguments*/) {
      for ( var i = 0 ; i < arguments.length ; i++ )
        this.append(JSONUtil.stringify(arguments[i]));
      this.append('\n');
    },
    addHeader: function(name) {
      this.log('<tr><th colspan=2 class="resultHeader">' + name + '</th></tr>');
    },
    assert: function(condition, comment) {
      if ( condition ) this.passed++; else this.failed++;
      this.log(
        (comment ? comment : '(no message)') +
        ' ' +
        (condition ? "<font color=green>OK</font>" : "<font color=red>ERROR</font>"));
    },
    fail: function(comment) {
      this.assert(false, comment);
    },
    ok: function(comment) {
      this.assert(true, comment);
    },
    hasFailed: function() {
      return this.failed > 0;
    }
  }
});


CLASS({
  name: 'RegressionTest',
  label: 'Regression Test',
  documentation: 'A $$DOC{ref: "UnitTest"} with a "gold master", which is compared with the output of the live test.',

  extendsModel: 'UnitTest',

  properties: [
    {
      name: 'master',
      documentation: 'The "gold" version of the output. Compared with the $$DOC{ref: ".results"} using <tt>.equals()</tt>, and the test passes if they match.'
    },
    {
      name: 'results',
      view: 'foam.ui.RegressionTestResultView'
    },
    {
      model_: 'BooleanProperty',
      name: 'regression',
      hidden: true,
      transient: true,
      defaultValue: false,
      documentation: 'Set after $$DOC{ref: ".atest"}: <tt>true</tt> if $$DOC{ref: ".master"} and $$DOC{ref: ".results"} match, <tt>false</tt> if they don\'t.'
    },
    {
      model_: 'BooleanProperty',
      name: 'hasRun',
      defaultValue: false,
      transient: true
    }
  ],

  methods: {
    atest: function(model) {
      // Run SUPER's atest, which returns the unexecuted afunc.
      var sup = this.SUPER(model);
      // Now we append a last piece that updates regression based on the results.
      return aseq(
        sup,
        function(ret) {
          this.regression = ! equals(this.results, this.master);
          this.hasRun = true;
          ret(!this.hasFailed());
        }.bind(this)
      );
    },
    hasFailed: function() {
      return this.regression;
    }
  },

  actions: [
    {
      name: 'approve',
      isEnabled: function() { return this.hasRun },
      action: function() {
        this.regression = this.results;
      }
    }
  ]
});


CLASS({
  name: 'UITest',
  label: 'UI Test',

  extendsModel: 'UnitTest',

  properties: [
    {
      name: 'results',
      view: 'foam.ui.UITestResultView'
    }
  ]
});


CLASS({
  name: 'Issue',
  plural: 'Issues',
  help: 'An issue describes a question, feature request, or defect.',
  ids: [
    'id'
  ],
  tableProperties:
  [
    'id', 'severity', 'status', 'summary', 'assignedTo'
  ],
  documentation: function() { /*
      An issue describes a question, feature request, or defect.
  */},
  properties:
  [
    {
      model_: 'IntProperty',
      name: 'id',
      label: 'Issue ID',
      displayWidth: 12,
      documentation: function() { /* $$DOC{ref:'Issue'} unique sequence number. */ },
      help: 'Issue\'s unique sequence number.'
    },
    {
      name: 'severity',
      view: {
        factory_: 'foam.ui.ChoiceView',
        choices: [
          'Feature',
          'Minor',
          'Major',
          'Question'
        ]
      },
      defaultValue: 'String',
      documentation: function() { /* The severity of the issue. */ },
      help: 'The severity of the issue.'
    },
    {
      name: 'status',
      type: 'String',
      required: true,
      view: {
        factory_: 'foam.ui.ChoiceView',
        choices: [
          'Open',
          'Accepted',
          'Complete',
          'Closed'
        ]
      },
      defaultValue: 'String',
      documentation: function() { /* The status of the $$DOC{ref:'Issue'}. */ },
      help: 'The status of the issue.'
    },
    {
      model_: 'Property',
      name: 'summary',
      type: 'String',
      required: true,
      displayWidth: 70,
      displayHeight: 1,
      documentation: function() { /* A one line summary of the $$DOC{ref:'Issue'}. */ },
      help: 'A one line summary of the issue.'
    },
    {
      model_: 'Property',
      name: 'created',
      type: 'DateTime',
      required: true,
      displayWidth: 50,
      displayHeight: 1,
      factory: function() { return new Date(); },
      documentation: function() { /* When this $$DOC{ref:'Issue'} was created. */ },
      help: 'When this issue was created.'
    },
    {
      model_: 'Property',
      name: 'createdBy',
      type: 'String',
      defaultValue: 'kgr',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      documentation: function() { /* Who created the $$DOC{ref:'Issue'}. */ },
      help: 'Who created the issue.'
    },
    {
      model_: 'Property',
      name: 'assignedTo',
      type: 'String',
      defaultValue: 'kgr',
      displayWidth: 30,
      displayHeight: 1,
      documentation: function() { /* Who the $$DOC{ref:'Issue'} is currently assigned to. */ },
      help: 'Who the issue is currently assigned to.'
    },
    {
      model_: 'Property',
      name: 'notes',
      displayWidth: 75,
      displayHeight: 20,
      view: 'foam.ui.TextAreaView',
      documentation: function() { /* Notes describing $$DOC{ref:'Issue'}. */ },
      help: 'Notes describing issue.'
    }
  ]
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'Relationship',
  tableProperties: [
    'name', 'label', 'relatedModel', 'relatedProperty'
  ],

  documentation: function() { /*
      $$DOC{ref:'Relationship',usePlural:true} indicate a parent-child relation
      between instances of
      a $$DOC{ref:'Model'} and some child $$DOC{ref:'Model',usePlural:true},
      through the indicated
      $$DOC{ref:'Property',usePlural:true}. If your $$DOC{ref:'Model',usePlural:true}
      build a tree
      structure of instances, they could likely benefit from a declared
      $$DOC{ref:'Relationship'}.
    */},

  properties: [
    {
      name:  'name',
      type:  'String',
      displayWidth: 30,
      displayHeight: 1,
      defaultValueFn: function() { return GLOBAL[this.relatedModel] ? GLOBAL[this.relatedModel].plural : ''; },
      documentation: function() { /* The identifier used in code to represent this $$DOC{ref:'.'}.
        $$DOC{ref:'.name'} should generally only contain identifier-safe characters.
        $$DOC{ref:'.'} names should use camelCase staring with a lower case letter.
         */},
      help: 'The coding identifier for the relationship.'
    },
    {
      name: 'label',
      type: 'String',
      displayWidth: 70,
      displayHeight: 1,
      defaultValueFn: function() { return this.name.labelize(); },
      documentation: function() { /* A human readable label for the $$DOC{ref:'.'}. May
        contain spaces or other odd characters.
         */},
      help: 'The display label for the relationship.'
    },
    {
      name: 'help',
      label: 'Help Text',
      type: 'String',
      displayWidth: 70,
      displayHeight: 6,
      defaultValue: '',
      documentation: function() { /*
          This $$DOC{ref:'.help'} text informs end users how to use the $$DOC{ref:'.'},
          through field labels or tooltips.
      */},
      help: 'Help text associated with the relationship.'
    },
    {
      model_: 'DocumentationProperty',
      name: 'documentation',
      documentation: function() { /*
          The developer documentation.
      */}
    },
    {
      name:  'relatedModel',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      documentation: function() { /* The $$DOC{ref:'Model.name'} of the related $$DOC{ref:'Model'}.*/},
      help: 'The name of the related Model.'
    },
    {
      name:  'relatedProperty',
      type:  'String',
      required: true,
      displayWidth: 30,
      displayHeight: 1,
      defaultValue: '',
      documentation: function() { /*
        The join $$DOC{ref:'Property'} of the related $$DOC{ref:'Model'}.
        This is the property that links back to this $$DOC{ref:'Model'} from the other
        $$DOC{ref:'Model',usePlural:true}.
      */},
      help: 'The join property of the related Model.'
    }
  ]/*,
  methods: {
    dao: function() {
      var m = this.X[this.relatedModel];
      return this.X[m.name + 'DAO'];
    },
    JOIN: function(sink, opt_where) {
      var m = this.X[this.relatedModel];
      var dao = this.X[m.name + 'DAO'] || this.X[m.plural];
      return MAP(JOIN(
        dao.where(opt_where || TRUE),
        m.getProperty(this.relatedProperty),
        []), sink);
    }
  }*/
});


(function() {
  for ( var i = 0 ; i < Model.templates.length ; i++ )
    Model.templates[i] = JSONUtil.mapToObj(X, Model.templates[i]);

  Model.properties = Model.properties;
  delete Model.instance_.prototype_;
  Model = Model.create(Model);
})();

// Go back over each model so far, assigning the new Model to remove any reference
// to the bootstrap Model, then FOAMalize any features that were missed due to
// the model for that feature type ("Method", "Documentation", etc.) being
// missing previously. This time the preSet for each should be fully operational.
function recopyModelFeatures(m) {
  m.model_ = Model;

  // the preSet for each of these does the work
//  m.methods       = m.methods;
//  m.templates     = m.templates;
  m.relationships = m.relationships;
  m.properties    = m.properties;
//  m.actions       = m.actions;
//  m.listeners     = m.listeners;
  m.models        = m.models;
  if ( DEBUG ) {
    m.tests       = m.tests;
    m.issues      = m.issues;
  }

  // check for old bootstrap Property instances
  if ( m.properties && m.properties[0] && ! Property.isInstance(m.properties[0]) ) {
    m.properties.forEach(function(p) {
      if ( p.model_.name === 'Property' ) p.model_ = Property;
    });
  }

  // keep copies of the updated lists
  if ( DEBUG ) BootstrapModel.saveDefinition(m);
}

/*
// Update Model in everything we've created so far
for ( var id in USED_MODELS ) {
  recopyModelFeatures(GLOBAL.lookup(id));
}
*/
recopyModelFeatures(Property);
recopyModelFeatures(Model);
recopyModelFeatures(Method);
recopyModelFeatures(Action);
recopyModelFeatures(Template);

if ( DEBUG ) {
  for ( var id in UNUSED_MODELS ) {
    if ( USED_MODELS[id] ) recopyModelFeatures(GLOBAL.lookup(id));
  }
}

USED_MODELS['Model'] = true;

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  package: 'foam.core.bootstrap',
  name: 'OrDAO',

  properties: [
    {
      name: 'primary',
      help: 'This is the DAO to look things up in first.'
    },
    {
      name: 'delegate'
    }
  ],

  methods: {
    find: function(id, sink) {
      this.primary.find(id, {
        put: sink.put.bind(sink),
        error: function() { this.delegate.find(id, sink); }.bind(this)
      });
    }
  }
});

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

MODEL({
  package: 'foam.core.bootstrap',
  name: 'BrowserFileDAO',

  imports: [
    'document',
    'window'
  ],

  properties: [
    {
      name: 'pending',
      factory: function() { return {}; }
    },
    {
      name: 'preload',
      factory: function() { return {}; }
    },
    {
      name: 'rootPath',
      factory: function() {
        return this.window.FOAM_BOOT_DIR + '../js/';
      }
    },
    'looking_'
  ],

  methods: {
    toURL_: function(key) {
      return this.rootPath + key.replace(/\./g, '/') + '.js';
    },
    find: function(key, sink) {
      if ( this.preload[key] ) {
        sink && sink.put && sink.put(this.preload[key]);
        delete this.preload[key];
        return;
      }

      if ( this.pending[key] ) {
        this.pending[key].push(sink);
        return;
      }

      this.pending[key] = [sink];

      var tag = this.document.createElement('script');
      var looking = key;

      var onerror = function() {
        var pending = this.pending[key];
        delete this.pending[key];
        for ( var i = 0 ; i < pending.length ; i++ ) {
          pending[i] && pending[i].error && pending[i].error.apply(null, arguments);
        }
        tag.remove();
      }.bind(this);

      tag.callback = function(data, latch) {
        var work = [anop];
        var obj = JSONUtil.mapToObj(this.X, data, undefined, work);

        if ( ! obj ) throw new Error('Failed to decode data: ' + data);

        if ( looking === obj.id ) looking = null;

        if ( ! this.pending[obj.id] ) {
          if ( latch ) {
            latch(data);
          } else {
            // Workaround for legacy apps that include extra models via
            // additional script tags.
            this.preload[obj.id] = obj;
          }
          return;
        }

        aseq.apply(null, work)(
          function(ret) {
            var sinks = this.pending[obj.id];
            delete this.pending[obj.id];
            if ( sinks ) {
              for ( var i = 0; i < sinks.length ; i++ ) {
                var sink = sinks[i];
                sink && sink.put && sink.put(obj);
              }
            }
          }.bind(this));
      }.bind(this);

      tag.onload = function() {
        if ( looking != null ) {
          onerror();
        }
        tag.remove();
      };
      tag.onerror = onerror;

      tag.src = this.toURL_(key);

      this.document.head.appendChild(tag);
    }
  }
});

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  package: 'foam.ui',

  name: 'Window',

  exports: [
    '$$',
    '$',
    'addStyle',
    'animate',
    'cancelAnimationFrame',
    'clearInterval',
    'clearTimeout',
    'console',
    'document',
    'dynamic',
    'error',
    'info',
    'installedModels',
    'log',
    'lookup',
    'requestAnimationFrame',
    'setInterval',
    'setTimeout',
    'warn',
    'window',
    'as FOAMWindow'
  ],

  properties: [
    {
      name: 'registeredModels',
      factory: function() { return {}; }
    },
    {
      model_: 'StringProperty',
      name: 'name',
      defaultValue: 'window'
    },
    {
      name: 'window',
      postSet: function(_, w) {
        // TODO: This would be better if ChromeApp.js added this behaviour
        // in a SubModel of Window, ie. ChromeAppWindow
        if ( this.X.subDocument ) this.X.subDocument(w.document);

        w.X = this.Y;
        this.document = w.document;
      }
    },
    {
      name: 'document'
      // postSet to reset installedModels?
    },
    {
      name: 'installedModels',
      documentation: "Each new Window context introduces a new document and resets installedModels so models will install again in the new document.",
      factory: function() { return {}; }
    },
    {
      model_: 'BooleanProperty',
      name: 'isBackground',
      defaultValue: false
    },
    {
      name: 'console',
      lazyFactory: function() { return this.window.console; }
    },
  ],

  methods: {
    lookup: function(key) {
      var ret = GLOBAL.lookup.call(this.Y, key);
      // var ret = this.X.lookup(key);
      if ( ret && ! this.registeredModels[key] ) {
        // console.log('Registering Model: ', key);
        this.registeredModels[key] = true;
      }
      return ret;
    },
    addStyle: function(css) {
      if ( ! this.document || ! this.document.createElement ) return;
      var s = this.document.createElement('style');
      s.innerHTML = css;
      this.document.head.insertBefore(
        s,
        this.document.head.firstElementChild);
    },
    log:   function() { this.console.log.apply(this.console, arguments); },
    warn:  function() { this.console.warn.apply(this.console, arguments); },
    info:  function() { this.console.info.apply(this.console, arguments); },
    error: function() { this.console.error.apply(this.console, arguments); },
    $: function(id) {
      return ( this.document.FOAM_OBJECTS && this.document.FOAM_OBJECTS[id] ) ?
        this.document.FOAM_OBJECTS[id] :
        this.document.getElementById(id);
    },
    $$: function(cls) {
      return this.document.getElementsByClassName(cls);
    },
    dynamic: function(fn, opt_fn) {
      return Events.dynamic(fn, opt_fn, this.Y);
    },
    animate: function(duration, fn, opt_interp, opt_onEnd) {
      return Movement.animate(duration, fn, opt_interp, opt_onEnd, this.Y);
    },
    setTimeout: function(f, t) {
      return this.window.setTimeout.apply(this.window, arguments);
    },
    clearTimeout: function(id) { this.window.clearTimeout(id); },
    setInterval: function(f, t) {
      return this.window.setInterval.apply(this.window, arguments);
    },
    clearInterval: function(id) { this.window.clearInterval(id); },
    requestAnimationFrame: function(f) {
      if ( this.isBackground ) return this.setTimeout(f, 16);

      console.assert(
        this.window.requestAnimationFrame,
        'requestAnimationFrame not defined');
      return this.window.requestAnimationFrame(f);
    },
    cancelAnimationFrame: function(id) {
      if ( this.isBackground ) {
        this.clearTimeout(id);
        return;
      }

      this.window.cancelAnimationFrame && this.window.cancelAnimationFrame(id);
    }
  }
});


// Using the existence of 'process' to determine that we're running in Node.
(function() {
  var w = foam.ui.Window.create(
    {
      window: window,
      name: 'DEFAULT WINDOW',
      isBackground: typeof process === 'object'
    }, X
  );
  FObject.X = X = w.Y;
})();

/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: standardize on either get()/set() or .value
CLASS({
  name: 'SimpleValue',

  properties: [ { name: 'value' } ],

  methods: {
    init: function(value) { this.value = value || ""; },
    get: function() { return this.value; },
    set: function(val) { this.value = val; },
    toString: function() { return "SimpleValue(" + this.value + ")"; }
  }
});

CLASS({
  name: 'SimpleReadOnlyValue',
  extendsModel: 'SimpleValue',

  documentation: "A simple value that can only be set during initialization.",
  
  properties: [
    { 
      name: 'value',
      preSet: function(old, nu) {
        if ( typeof this.instance_.value == 'undefined' ) {
          return nu;
        }
        return old;
      }
    } 
  ],
  
  methods: {
    set: function(val) {
      /* Only allow set once. The first initialized value is the only one. */
      if ( typeof this.instance_.value == 'undefined' ) {
        this.SUPER(val);
      }
    },
    toString: function() { return "SimpleReadOnlyValue(" + this.value + ")"; }
  }
});

/**
 * @license
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DOM = {
  /** Instantiate FOAM Objects in a document. **/
  init: function(X) {
    if ( ! X.document.FOAM_OBJECTS ) X.document.FOAM_OBJECTS = {};

    var fs = X.document.querySelectorAll('foam');
    var models = [];
    for ( var i = 0 ; i < fs.length ; i++ ) {
      var e = fs[i];
      X.lookup(e.getAttribute('view'));
      X.lookup(e.getAttribute('model'));
      if ( e.getAttribute('view') ) models.push(arequire(e.getAttribute('view')));
      if ( e.getAttribute('model') ) models.push(arequire(e.getAttribute('model')));
    }
    for ( var key in USED_MODELS ) {
      models.push(arequire(key));
    }

    atime('DOMInit', aseq(apar.apply(null, models), function(ret) {
      for ( var i = 0 ; i < fs.length ; i++ ) {
        var e = fs[i];
        // Check that the node is still in the DOM
        // (It won't be if it was the child of another FOAM tag.)
        var node = e;
        var body = X.document.body;
        while ( node && node !== body ) node = node.parentNode;
        if ( node ) {
          this.initElement(e, X, X.document);
          e.innerHTML = '';
        }
        ret();
      }
    }.bind(this)))();
  },

  initElementChildren: function(e, X) {
    var a = [];

    for ( var i = 0 ; i < e.children.length ; i++ ) {
      var c = e.children[i];

      if ( c.tagName === 'FOAM' ) {
        a.push(DOM.initElement(c, X));
      }
    }

    return a;
  },

  /**
   * opt_document -- if supplied the object's view will be added to the document.
   **/
  initElement: function(e, X, opt_document) {
    arequire('foam.ui.FoamTagView')(function(t) {
      foam.ui.FoamTagView.create({ element: e }, X);
    });
  },

  setClass: function(e, className, opt_enabled) {
    var oldClassName = e.className || '';
    var enabled = opt_enabled === undefined ? true : opt_enabled;
    e.className = oldClassName.replace(' ' + className, '').replace(className, '');
    if ( enabled ) e.className = e.className + ' ' + className;
  }
};


window &&
  window.addEventListener &&
  window.addEventListener('load', function() { DOM.init(X); }, false);


// TODO: document and make non-global
/** Convert a style size to an Int.  Ex. '10px' to 10. **/
function toNum(p) { return p.replace ? parseInt(p.replace('px','')) : p; };


// TODO(kgr): replace all instances of DomValue with new modelled DOMValue.
var DomValue = {
  DEFAULT_EVENT:    'change',
  DEFAULT_PROPERTY: 'value',

  create: function(element, opt_event, opt_property) {
    if ( ! element ) {
      throw "Missing Element in DomValue";
    }

    return {
      __proto__: this,
      element:   element,
      event:     opt_event    || this.DEFAULT_EVENT,
      property:  opt_property || this.DEFAULT_PROPERTY };
  },

  setElement: function ( element ) { this.element = element; },

  get: function() { return this.element[this.property]; },

  set: function(value) {
    if ( this.element[this.property] !== value )
      this.element[this.property] = value;
  },

  addListener: function(listener) {
    if ( ! this.event ) return;
    try {
      this.element.addEventListener(this.event, listener, false);
    } catch (x) {
    }
  },

  removeListener: function(listener) {
    if ( ! this.event ) return;
    try {
      this.element.removeEventListener(this.event, listener, false);
    } catch (x) {
      // could be that the element has been removed
    }
  },

  toString: function() {
    return "DomValue(" + this.event + ", " + this.property + ")";
  }
};


CLASS({
  name: 'DOMValue',

  properties: [
    {
      name: 'element',
      required: true
    },
    {
      name: 'property',
      defaultValue: 'value'
    },
    {
      name: 'event',
      defaultValue: 'change'
    },
    {
      name: 'value',
      postSet: function(_, value) { this.element[this.property] = value; }
    },
    {
      name: 'firstListener_',
      defaultValue: true
    }
  ],

  methods: {
    init: function() {
      this.SUPER();
      this.value = this.element[this.property];
    },

    get: function() { return this.value; },

    set: function(value) { this.value = value; },

    addListener: function(listener) {
      if ( this.firstListener_ ) {
        if ( this.event ) {
          this.element.addEventListener(
            this.event,
            function() { debugger; /* TODO */ },
            false);
        }

        this.firstListener_ = false;
      }
      this.value$.addListener(listener);
    },

    removeListener: function(listener) {
      this.value$.removeListener(listener);
    },

    toString: function() {
      return 'DOMValue(' + this.event + ', ' + this.property + ')';
    }
  }
});

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  package: 'foam.ui',
  name: 'FoamTagView',
  extendsModel: 'foam.ui.View',

  requires: [
    'foam.html.Element',
    'foam.ui.View',
    'foam.ui.DetailView' // TODO(kgr): arequire() manually, only if required
  ],

  imports: [ 'document' ],

  properties: [
    {
      name: 'element'
    },
    {
      name: 'className',
      defaultValue: 'foam-tag'
    }
  ],

  methods: {
    init: function() {
      this.SUPER();

      if ( ! this.Element.isInstance(this.element) ) this.install();
    },
    install: function() {
      var e = this.element;
      var models = [];
      var style     = e.getAttribute('style');
      var modelName = e.getAttribute('model');
      var viewName  = e.getAttribute('view');
      var onInit    = e.getAttribute('oninit');

      if ( modelName ) models.push(arequire(modelName, this.X));
      if ( viewName  ) models.push(arequire(viewName, this.X));

      aseq(apar.apply(null, models), function(ret) {
        if ( ! this.holder() ) return;

        var model = this.X.lookup(modelName);

        if ( ! model ) {
          this.error('Unknown Model: ', modelName);
          return;
        }

        model.getPrototype();

        var obj = model.create(null, this.X);
        obj.fromElement(e);

        if ( obj.model_.DATA && this.hasOwnProperty('data') )
          obj.data = this.data;

        var view;

        if ( viewName ) {
          var viewModel = this.X.lookup(viewName);
          view = viewModel.create({ model: model, data: obj }, this.X);
        } else if ( this.X.lookup('foam.ui.BaseView').isInstance(obj) ) {
          view = obj;
        } else if ( obj.toView_ ) {
          view = obj.toView_();
        } else {
          var a = this.element.getAttribute('showActions');
          var showActions = ! a || (
            a.equalsIC('y')     ||
            a.equalsIC('yes')   ||
            a.equalsIC('true')  ||
            a.equalsIC('t') );

          view = this.X.lookup('foam.ui.DetailView').create({
            model: model,
            data: obj,
            showActions: showActions
          }, obj.Y);
        }

        if ( e.id ) this.document.FOAM_OBJECTS[e.id] = obj;
        obj.view_ = view;
        this.holder().outerHTML = view.toHTML();
        if ( style ) {
          view.$.setAttribute('style', style);
        }
        view.initHTML();

        if ( onInit )
          aeval('function() { ' + onInit + ' }')(function(f) { f.call(obj); });

      }.bind(this))();
    },
    holder: function() {
      // TODO(kgr): Add an outerHTML setter to foam.html.Element instead
      return this.Element.isInstance(this.element) ? this.$ : this.element;
    },
    error: function(msg) {
      console.error(msg);
      this.holder.innerHTML = msg;
    },
    initHTML: function() {
      this.install();
    }
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** A Canvas View for embedding CView's in. **/
// TODO: add a 'mouse' property which creates and connects a Mouse model.
CLASS({
  name: 'Canvas',
  extendsModel: 'foam.ui.View',

  properties: [
    {
      name:  'background',
      label: 'Background Color',
      type:  'String',
      defaultValue: 'white'
    },
    {
      name:  'width',
      type:  'int',
      defaultValue: 100,
      postSet: function(_, width) {
        if ( this.$ ) this.$.width = width;
      }
    },
    {
      name:  'height',
      type:  'int',
      defaultValue: 100,
      postSet: function(_, height) {
        if ( this.$ ) this.$.height = height;
      }
    }
  ],

  listeners: [
    {
      name: 'paint',
      isFramed: true,
      code: function() {
        if ( ! this.$ ) throw EventService.UNSUBSCRIBE_EXCEPTION;
        this.erase();
        this.paintChildren();
      }
    }
  ],

  methods: {
    toHTML: function() {
      return '<canvas id="' + this.id + '" width="' + this.width + '" height="' + this.height + '"> </canvas>';
    },

    initHTML: function() {
      if ( ! this.$ ) return;
      this.canvas = this.$.getContext('2d');
    },

    addChild: function(child) {
      child.parent = null; // needed because super.addChild() skips childen with parents already

      this.SUPER(child);

      try {
        child.addListener(this.paint);
      } catch (x) { console.log(x); }

      return this;
    },

    erase: function() {
      this.canvas.fillStyle = this.background;
      this.canvas.fillRect(0, 0, this.width, this.height);
    },

    paintChildren: function() {
      for ( var i = 0 ; i < this.children.length ; i++ ) {
        var child = this.children[i];
        this.canvas.save();
        child.paint();
        this.canvas.restore();
      }
    }
  }
});


/**
 * Abstract Canvas View (CView).
 *
 * CView's can also be used as regular (DOM) Views because if you call
 * toHTML() on them they will create their own 'Canvas' View parent.
 **/
CLASS({
  name:  'CView',
  label: 'CView',

  properties: [
    {
      name:  'parent',
      type:  'CView',
      hidden: true
    },
    {
      name:  'x',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 10
    },
    {
      name:  'y',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 10
    },
    {
      name:  'width',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 10
    },
    {
      name:  'height',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 10
    },
    {
      name:  'children',
      type:  'CView[]',
      factory: function() { return []; },
      hidden: true
    },
    {
      name:  'background',
      label: 'Background Color',
      type:  'String',
      defaultValue: 'white'
    },
    {
      name:  'canvas',
      type:  'Canvas',
      getter: function() {
        return this.parent && this.parent.canvas;
      },
      setter: undefined,
      hidden: true
    }
  ],

  listeners: [
    {
      name: 'resizeParent',
      code: function(evt) {
        this.parent.width  = this.x + this.width + 1;
        this.parent.height = this.y + this.height + 2;
      }
    }
  ],

  methods: {
    toView_: function() { return this; },
    toHTML: function() {
      // If being added to HTML directly, then needs to create own Canvas as parent.
      // Calling addChild() will set this.parent = canvas.
      if ( ! this.parent ) {
        this.parent = this.X.Canvas.create();

        this.x$.addListener(this.resizeParent);
        this.y$.addListener(this.resizeParent);
        this.width$.addListener(this.resizeParent);
        this.height$.addListener(this.resizeParent);

        this.resizeParent();
      }
      return this.parent.toHTML();
    },

    initHTML: function() {
      var self = this;
      var parent = this.parent;

      parent.addChild(this);
      parent.initHTML();
      this.X.dynamic(
        function() { self.background; }, function() {
          parent.background = self.background;
        });
    },

    write: function(document) {
      document.writeln(this.toHTML());
      this.initHTML();
    },

    addChild: function(child) {
      this.children.push(child);
      child.parent = this;
      return this;
    },

    removeChild: function(child) {
      this.children.deleteI(child);
      child.parent = undefined;
      return this;
    },

    erase: function() {
      this.canvas.fillStyle = this.background;
      this.canvas.fillRect(0, 0, this.width, this.height);
    },

    paintChildren: function() {
      for ( var i = 0 ; i < this.children.length ; i++ ) {
        var child = this.children[i];
        this.canvas.save();
        child.paint();
        this.canvas.restore();
      }
    },

    paintSelf: function() {},

    paint: function() {
      if ( ! this.parent.$ ) return;
      this.erase();
      this.paintSelf();
      this.paintChildren();
    }
  }
});


CLASS({
  name:  'Label',

  properties: [
    {
      name:  'parent',
      type:  'CView',
      hidden: true
    },
    {
      name:  'text',
      type:  'String',
      defaultValue: ''
    },
    {
      name:  'align',
      label: 'Alignment',
      type:  'String',
      defaultValue: 'start' // values: left, right, center, start, end
    },
    {
      name:  'font',
      type:  'String',
      defaultValue: ''
    },
    {
      name:  'color',
      type:  'String',
      defaultValue: 'black'
    },
    {
      name:  'x',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'y',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'maxWidth',
      label: 'Maximum Width',
      type:  'int',
      defaultValue: -1
    }
  ],

  methods: {
    paint: function() {
      var canvas = this.parent.canvas;
      var oldFont = canvas.font;
      var oldAlign = canvas.textAlign;

      if ( this.font ) canvas.font = this.font;

      canvas.textAlign = this.align;
      canvas.fillStyle = this.color;
      canvas.fillText(this.text, this.x, this.y);

      canvas.font = oldFont;
      canvas.textAlign = oldAlign;
    }
  }
});


CLASS({
  name:  'Box',
  extendsModel: 'Label',

  properties: [
    {
      name:  'background',
      label: 'Background Color',
      type:  'String',
      defaultValue: 'white'
    },
    {
      name:  'border',
      label: 'Border Color',
      type:  'String',
      defaultValue: 'black'
    },
    {
      name:  'a',
      label: 'Angle',
      type:  'int',
      defaultValue: 0
    },
    {
      name:  'width',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'height',
      type:  'int',
      defaultValue: 100
    }
  ],

  methods: {
    paint: function() {
      var c = this.parent.canvas;

      c.save();

      if ( this.a ) {
        c.translate(this.x+this.width/2, this.y+this.height/2);
        c.rotate(this.a);
        c.translate(-this.x-this.width/2, -this.y-this.height/2);
      }

      c.fillStyle = this.background;
      c.fillRect(this.x, this.y, this.width, this.height);

      if ( this.border && this.width && this.height ) {
        c.strokeStyle = this.border;
        c.strokeRect(this.x, this.y, this.width, this.height);
      }

      var oldFont = c.font;
      var oldAlign = c.textAlign;

      if ( this.font ) c.font = this.font;

      c.textAlign = 'center'; //this.align;
      c.fillStyle = this.color;
      c.fillText(
        this.text,
        this.x + this.width/2,
        this.y+this.height/2+10);

      c.font = oldFont;
      c.textAlign = oldAlign;

      var grad = c.createLinearGradient(this.x, this.y, this.x+this.width, this.y+this.height);

      grad.addColorStop(  0, 'rgba(0,0,0,0.35)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0)');
      grad.addColorStop(  1, 'rgba(255,255,255,0.45)');
      c.fillStyle = grad;
      c.fillRect(this.x, this.y, this.width, this.height);

      c.restore();
    }
  }
});


CLASS({
  name:  'Circle',

  properties: [
    {
      name:  'parent',
      type:  'CView',
      hidden: true
    },
    {
      name:  'color',
      type:  'String',
      defaultValue: 'white'
    },
    {
      name:  'border',
      label: 'Border Color',
      type:  'String',
      defaultValue: undefined
    },
    {
      name:  'borderWidth',
      type:  'int',
      defaultValue: 1
    },
    {
      name:  'alpha',
      type:  'int',
      defaultValue: 1
    },
    {
      name:  'x',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'y',
      type:  'int',
      defaultValue: 100
    },
    {
      name: 'r',
      label: 'Radius',
      type: 'int',
      defaultValue: 20
    }
  ],

  methods: {

    paint3d: function() {
      var canvas = this.parent.canvas;

      var radgrad = canvas.createRadialGradient(this.x+this.r/6,this.y+this.r/6,this.r/3,this.x+2,this.y,this.r);
      radgrad.addColorStop(0, '#a7a7a7'/*'#A7D30C'*/);
      radgrad.addColorStop(0.9, this.color /*'#019F62'*/);
      radgrad.addColorStop(1, 'black');

      canvas.fillStyle = radgrad;;

      canvas.beginPath();
      canvas.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
      canvas.closePath();
      canvas.fill();
    },

    paint: function() {
      var canvas = this.parent.canvas;

      canvas.save();

      canvas.globalAlpha = this.alpha;

      canvas.fillStyle = this.color;

      if ( this.border && this.r ) {
        canvas.lineWidth = this.borderWidth;
        canvas.strokeStyle = this.border;
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        canvas.closePath();
        canvas.stroke();
      }

      if ( this.color ) {
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        canvas.closePath();
        canvas.fill();
      }

      canvas.restore();
    }
  }
});


CLASS({
  name:  'ImageCView',

  properties: [
    {
      name:  'parent',
      type:  'CView',
      hidden: true
    },
    {
      name:  'alpha',
      type:  'int',
      defaultValue: 1
    },
    {
      name:  'x',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'y',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'scale',
      type:  'int',
      defaultValue: 1
    },
    {
      name: 'src',
      label: 'Source',
      type: 'String'
    }
  ],

  methods: {

    init: function() {
      this.SUPER();

      this.image_ = new Image();
      this.image_.src = this.src;
    },

    paint: function() {
      var c = this.parent.canvas;

      c.translate(this.x, this.y);
      c.scale(this.scale, this.scale);
      c.translate(-this.x, -this.y);
      c.drawImage(this.image_, this.x, this.y);
    }
  }
});


CLASS({
  name: 'Rectangle',

  properties: [
    {
      name:  'parent',
      type:  'CView',
      hidden: true
    },
    {
      name:  'color',
      type:  'String',
      defaultValue: 'white',
    },
    {
      name:  'x',
      type:  'int',
      defaultValue: 1000
    },
    {
      name:  'y',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'width',
      type:  'int',
      defaultValue: 100
    },
    {
      name:  'height',
      type:  'int',
      defaultValue: 100
    }
  ],

  methods: {
    paint: function() {
      var canvas = this.parent.canvas;

      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    }
  }
});


CLASS({
  name:  'ProgressCView',
  extendsModel: 'CView',

  properties: [
    {
      name:  'value',
      type:  'Value',
      factory: function() { return SimpleValue.create(); },
      postSet: function(oldValue, newValue) {
        oldValue && oldValue.removeListener(this.updateValue);
        newValue.addListener(this.updateValue);
      }
    }
  ],

  listeners:  [
    {
      name: 'updateValue',
      code: function() {
        this.paint();
      }
    }
  ],

  methods: {

    paint: function() {
      var c = this.canvas;

      c.fillStyle = '#fff';
      c.fillRect(0, 0, 104, 20);

      c.strokeStyle = '#000';
      c.strokeRect(0, 0, 104, 20);
      c.fillStyle = '#f00';
      c.fillRect(2, 2, parseInt(this.value.get()), 16);
    },

    destroy: function( isParentDestroyed ) {
      this.SUPER(isParentDestroyed);
      this.value.removeListener(this.listener_);
    }
  }
});


CLASS({
  name:  'Graph',
  extendsModel: 'CView',

  properties: [
    {
      name:  'style',
      type:  'String',
      defaultValue: 'Line',
      // TODO: fix the view, it's not storabe
      view: {
        factory_: 'foam.ui.ChoiceView',
        choices: [
          'Bar',
          'Line',
          'Point'
        ]
      }
    },
    {
      name:  'width',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 5
    },
    {
      name:  'height',
      type:  'int',
      view:  'foam.ui.IntFieldView',
      defaultValue: 5
    },
    {
      name:  'graphColor',
      type:  'String',
      defaultValue: 'green'
    },
    {
      name:  'backgroundColor',
      type:  'String',
      defaultValue: undefined
    },
    {
      name:  'lineWidth',
      type:  'int',
      defaultValue: 6
    },
    {
      name:  'drawShadow',
      type:  'boolean',
      defaultValue: true
    },
    {
      name:  'capColor',
      type:  'String',
      defaultValue: ''
    },
    {
      name:  'axisColor',
      type:  'String',
      defaultValue: 'black'
    },
    {
      name:  'gridColor',
      type:  'String',
      defaultValue: undefined
    },
    {
      name:  'axisSize',
      type:  'int',
      defaultValue: 2
    },
    {
      name:  'xAxisInterval',
      type:  'int',
      defaultValue: 0
    },
    {
      name:  'yAxisInterval',
      type:  'int',
      defaultValue: 0
    },
    {
      name:  'maxValue',
      label: 'Maximum Value',
      type:  'float',
      defaultValue: -1
    },
    {
      name:  'data',
      type:  'Array[float]',
      factory: function() { return []; }
    },
    {
      name: 'f',
      label: 'Data Function',
      type: 'Function',
      required: false,
      displayWidth: 70,
      displayHeight: 3,
      view: 'foam.ui.FunctionView',
      defaultValue: function (x) { return x; },
      help: 'The graph\'s data function.'
    }
  ],

  issues: [
    {
      id: 1000,
      severity: 'Major',
      status: 'Open',
      summary: 'Make \'style\' view serializable',
      created: 'Sun Dec 23 2012 18:14:56 GMT-0500 (EST)',
      createdBy: 'kgr',
      assignedTo: 'kgr',
      notes: 'ChoiceView factory prevents Model from being serializable.'
    }
  ],

  methods: {
    paintLineData: function(canvas, x, y, xs, w, h, maxValue) {
      if ( this.graphColor ) {
        canvas.fillStyle = this.graphColor;
        canvas.beginPath();
        canvas.moveTo(x+xs, y+h-xs);
        for ( var i = 0 ; i < this.data.length ; i++ ) {
          var d = this.f(this.data[i]);
          var lx = x+xs+(i==0?0:w*i/(this.data.length-1));
          var ly = this.toY(d, maxValue);

          canvas.lineTo(lx, ly);
        }

        canvas.lineTo(x+this.width-1, y+h-xs);
        canvas.lineTo(x+xs, y+h-xs);
        canvas.fill();
      }

      if ( this.capColor ) {
        if ( this.drawShadow ) {
          canvas.shadowOffsetX = 0;
          canvas.shadowOffsetY = 2;
          canvas.shadowBlur = 2;
          canvas.shadowColor = "rgba(0, 0, 0, 0.5)";
        }

        canvas.strokeStyle = this.capColor;
        canvas.lineWidth = this.lineWidth;
        canvas.lineJoin = 'round';
        canvas.beginPath();
        for ( var i = 0 ; i < this.data.length ; i++ ) {
          var d = this.f(this.data[i]);
          var lx = this.toX(i)+0.5;
          var ly = this.toY(d, maxValue)/*+0.5*/-5;

          if ( i == 0 )
            canvas.moveTo(lx, ly);
          else
            canvas.lineTo(lx, ly);
        }

        canvas.stroke();
      }
    },

    paintPointData: function(canvas, x, y, xs, w, h, maxValue) {
      canvas.shadowOffsetX = 2;
      canvas.shadowOffsetY = 2;
      canvas.shadowBlur = 2;
      canvas.shadowColor = "rgba(0, 0, 0, 0.5)";

      canvas.strokeStyle = this.capColor;
      canvas.lineWidth = 2;
      canvas.lineJoin = 'round';
      canvas.beginPath();
      for ( var i = 0 ; i < this.data.length ; i++ ) {
        var d = this.f(this.data[i]);
        var lx = this.toX(i)+0.5;
        var ly = this.toY(d, maxValue)+0.5;

        if ( i == 0 ) canvas.moveTo(lx, ly); else canvas.lineTo(lx, ly);
      }

      canvas.stroke();

      canvas.lineWidth = 3;
      for ( var i = 0 ; i < this.data.length ; i++ ) {
        var d = this.f(this.data[i]);
        var lx = this.toX(i)+0.5;
        var ly = this.toY(d, maxValue)+0.5;

        canvas.beginPath();
        canvas.arc(lx,ly,4,0,-Math.PI/2);
        canvas.closePath();
        canvas.stroke();
      }
    },

    paintBarData: function(canvas, x, y, xs, w, h, maxValue) {
      canvas.fillStyle = this.graphColor;

      for ( var i = 0 ; i < this.data.length ; i++ ) {
        var d = this.f(this.data[i]);
        var x1 = x+xs+w*i/this.data.length;
        var y1 = this.toY(d, maxValue);

        canvas.fillRect(x1, y1, w/this.data.length+1.5, d*h/maxValue);
      }
    },

    paint: function() {
      var canvas = this.canvas;
      var x  = this.x;
      var y  = this.y;
      var xs = this.axisSize;
      var w  = this.width-xs;
      var h  = this.height-xs;
      var maxValue = this.maxValue;

      if ( this.backgroundColor ) {
        canvas.fillStyle = this.backgroundColor;
        canvas.fillRect(x,y,w,h);
      }

      if ( maxValue == -1 ) {
        maxValue = 0.001;

        for ( var i = 0 ; i < this.data.length ; i++ ) {
          var d = this.f(this.data[i]);

          maxValue = Math.max(maxValue, d);
        }
      }

      if ( this.style == 'Line' ) this.paintLineData(canvas, x, y, xs, w, h, maxValue);
      else if ( this.style == 'Bar' ) this.paintBarData(canvas, x, y, xs, w, h, maxValue);
      else if ( this.style == 'Point' ) this.paintPointData(canvas, x, y, xs, w, h, maxValue);

      if ( this.axisColor && xs != 0 ) {
        canvas.fillStyle = this.axisColor;
        // x-axis
        canvas.fillRect(x, y+h-xs*1.5, this.width, xs);
        // y-axis
        canvas.fillRect(x, y, xs, this.height-xs*1.5);
      }

      if ( this.xAxisInterval ) {
        for ( var i = this.xAxisInterval ; i <= this.data.length ; i += this.xAxisInterval ) {
          var x2 = this.toX(i);

          if ( this.gridColor ) {
            canvas.save();
            canvas.shadowOffsetX = 0;
            canvas.shadowOffsetY = 0;
            canvas.shadowBlur = 0;
            canvas.fillStyle = this.gridColor;
            canvas.fillRect(x2+1.5, this.toY(0,1)-2*xs, 0.5, -this.height);
            canvas.restore();
          }

          canvas.fillRect(x2, this.toY(0,1)-2*xs, xs/2, -xs);
        }
      }

      if ( this.yAxisInterval ) {
        for ( var i = this.yAxisInterval ; i <= maxValue ; i += this.yAxisInterval ) {
          var y = this.toY(i, maxValue);

          if ( this.gridColor ) {
            canvas.save();
            canvas.shadowOffsetX = 0;
            canvas.shadowOffsetY = 0;
            canvas.shadowBlur = 0;
            canvas.fillStyle = this.gridColor;
            canvas.fillRect(x+xs, y+3, this.width, 0.5);
            canvas.restore();
          }

          canvas.fillRect(x+xs, y, xs, xs/2);
        }
      }
    },

    toX: function(val) {
      var w = this.width - this.axisSize;
      return this.x+this.axisSize+(val==0?0:w*val/(this.data.length-1));
    },

    toY: function(val, maxValue) {
      var h = this.height - this.axisSize;
      return this.y+h-val*h/maxValue+0.5;
    },

    lastValue: function() {
      return this.data[this.data.length-1];
    },

    addData: function(value, opt_maxNumValues) {
      var maxNumValues = opt_maxNumValues || this.width;

      if ( this.data.length == maxNumValues ) this.data.shift();
      this.data.push(value);
    },

    watch: function(value, opt_maxNumValues) {
      var graph = this;

      value.addListener(function() {
        graph.addData(value.get(), opt_maxNumValues);
      });
    }
  }
});


var WarpedCanvas = {
  create: function(c, mx, my, w, h, mag) {
    return {
      __proto__: c,
      warp: function(x, y) {
        if ( Math.abs(mag) < 0.01 || ( mx < 1 && my < 1 ) ) { this.x = x; this.y = y; return; }

        var dx = x-mx;
        var dy = y-my;
        var r  = Math.sqrt(dx*dx + dy*dy);
        var t  = Math.atan2(dy, dx);

        var R = 400 * (1+mag);
        r = r/R;
        if ( r < 1 ) r += mag*3*r*Math.pow(1-r, 4);
        r = r*R;

        this.x = mx + Math.cos(t) * r;
        this.y = my + Math.sin(t) * r;
      },
      moveTo: function(x, y) { this.warp(x, y); c.moveTo(this.x, this.y); this.pX = x; this.pY = y; },
      lineTo: function(x2, y2) {
        var N = 100;
        var x1 = this.pX;
        var y1 = this.pY;
        var dx = (x2 - x1)/N;
        var dy = (y2 - y1)/N;
        var x = x1, y = y1;
        for ( var i = 0 ; i < N ; i++ ) {
          x += dx;
          y += dy;
          this.warp(x, y);
          c.lineTo(this.x, this.y);
        }
        this.pX = x2;
        this.pY = y2;
      },
      line: function(x1, y1, x2, y2) {
        c.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        c.stroke();
      },
      fillText: function(t, x, y) {
        this.warp(x, y);
        c.fillText(t, this.x, this.y);
      },
      fillRect: function(x, y, width, height) {
        c.beginPath();
        this.moveTo(x, y);
        this.lineTo(x+width, y);
        this.lineTo(x+width, y+height);
        this.lineTo(x, y+height);
        this.lineTo(x, y);
        c.closePath();
        c.fill();
      },
      get font()        { return c.linewidth; },   set font(v)        { c.linewidth = v; },
      get lineWidth()   { return c.linewidth; },   set lineWidth(v)   { c.linewidth = v; },
      get strokeStyle() { return c.strokeStyle; }, set strokeStyle(v) { c.strokeStyle = v; },
      get fillStyle()   { return c.fillStyle; },   set fillStyle(v)   { c.fillStyle = v; },
      get textAlign()   { return c.textAlign; },   set textAlign(v)   { c.textAlign = v; }
    };
  }
};


CLASS({
  name:  'GridCView',
  extendsModel: 'CView',
  label: 'GridCView',

  requires: ['foam.input.Mouse'],
  
  properties: [
    {
      name: 'grid',
      type: 'GridByExpr',
    },
    {
      name: 'mag',
      help: 'The current magnification level.  Animates to desiredMag.',
      defaultValue: 0.6
    },
    {
      name: 'desiredMag',
      postSet: function(_, mag) { this.mag = mag; },
      defaultValue: 0.6
    },
    {
      name: 'mouse',
      factory: function() { return this.Mouse.create(); }
    }
  ],

  listeners: [
    {
      name: 'onMouseMove',
      code: function(evt) {
        this.parent.paint()
      }
    }
  ],

  methods: {
    initHTML: function() {
      var self = this;

      this.SUPER();

      this.mouse.connect(this.parent.$);

      this.parent.$.addEventListener('mouseout', function() {
        this.animation_ && this.animation_();
        this.animation_ = Movement.animate(
          800,
          function() { self.mag = 0; },
          Movement.oscillate(0.8, self.mag/4))();
      });

      this.parent.$.addEventListener('mouseenter', function() {
        this.animation_ && this.animation_();
        this.animation_ = Movement.animate(
          400,
          function() { self.mag = self.desiredMag; })();
      });

      this.parent.$.onmousewheel = function(e) {
        if ( e.wheelDeltaY > 0 ) {
          this.desiredMag += 0.05;
        } else {
          this.desiredMag = Math.max(0, this.desiredMag-0.05);
        }
        this.parent.paint();
      }.bind(this);

      this.mouse.addListener(this.onMouseMove);
    },

    // TODO: move to CView
    line: function(x1, y1, x2, y2) {
      var c = this.canvas;

      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.closePath();
      c.stroke();
    },

    paint: function() {
      var ROW_LABEL_WIDTH = 140;
      var COL_LABEL_HEIGHT = 30;

      this.width  = this.parent.$.parentElement.clientWidth;
      this.height = this.parent.$.parentElement.clientHeight;

      var c = this.canvas;

      var g = this.grid;
      var cols = g.cols.groups;
      var rows = g.rows.groups;
      var sortedCols = g.sortedCols();
      var sortedRows = g.sortedRows();
      var w = this.width;
      var h = this.height;
      var wc = WarpedCanvas.create(c, this.mouse.x, this.mouse.y, w, h, this.mag);

      var xw = (w-ROW_LABEL_WIDTH) / sortedCols.length;
      var yw = (h-COL_LABEL_HEIGHT) / sortedRows.length;

      wc.fillStyle = '#eee';
      wc.fillRect(0, 0, this.width, COL_LABEL_HEIGHT);
      wc.fillRect(0, 0, ROW_LABEL_WIDTH, this.height);

      wc.lineWidth = 1;
      wc.strokeStyle = '#000';
      wc.fillStyle = '#000';
      wc.textAlign = 'left';
      wc.font = 'bold 10px arial';

      // Vertical Grid Lines
      for ( var i = 0 ; i < sortedCols.length ; i++ ) {
        var x = ROW_LABEL_WIDTH + i * xw;

        wc.fillText(sortedCols[i], x+2, COL_LABEL_HEIGHT/2+2);

        wc.line(x, 0, x, h);
      }
      // First line
      wc.line(0, 0, 0, h);
      // Last line
      wc.line(w, 0, w, h);

      // Horizontal Grid Lines
      for ( var i = 0 ; i < sortedRows.length ; i++ ) {
        var y = COL_LABEL_HEIGHT + i * yw;

        wc.fillText(sortedRows[i], 5, y + yw/2);

        wc.line(0, y, w, y);
      }

      // First line
      wc.line(0, 0, w, 0);
      // Last line
      wc.line(0, h, w, h);

      function wdist(x1, y1, x2, y2) {
        wc.warp(x2, y2);
        var dx = x1-wc.x;
        var dy = y1-wc.y;
        return dx*dx + dy*dy;
      }

      for ( var j = 0 ; j < sortedRows.length ; j++ ) {
        var y = sortedRows[j];
        for ( var i = 0 ; i < sortedCols.length ; i++ ) {
          var x = sortedCols[i];
          var value = rows[y].groups[x];

          if ( value && value.toCView ) {
            var cv = value.toCView();

            var cx = ROW_LABEL_WIDTH + xw * (i+0.5);
            var cy = COL_LABEL_HEIGHT + yw * (j+0.5);
            wc.warp(cx, cy);
            cv.x = wc.x;
            cv.y = wc.y;
            cv.r = Math.sqrt(Math.min(
              wdist(cv.x, cv.y, cx+xw/2, cy),
              wdist(cv.x, cv.y, cx-xw/2, cy),
              wdist(cv.x, cv.y, cx, cy+yw/2),
              wdist(cv.x, cv.y, cx, cy-yw/2)))-4;
            cv.x -= cv.r;
            cv.y -= cv.r;

            cv.parent = this.parent;

            if ( cv.r > 3 ) cv.paint();
          }
        }
      }
    }
  }
});

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A sub-set of the DOM Element interface that we use for FOAM tag parsing.
 * This lets us transparently build FOAM objects and views from either real DOM
 * or from the output of FOAM's HTML parser.
 **/
CLASS({
  package: 'foam.html',
  name: 'Element',

  constants: {
    OPTIONAL_CLOSE_TAGS: {
      HTML: true,
      HEAD: true,
      BODY: true,
      P: true,
      DT: true,
      DD: true,
      LI: true,
      OPTION: true,
      THEAD: true,
      TH: true,
      TBODY: true,
      TR: true,
      TD: true,
      TFOOT: true,
      COLGROUP: true,
    },
    ILLEGAL_CLOSE_TAGS: {
      IMG: true,
      INPUT: true,
      BR: true,
      HR: true,
      FRAME: true,
      AREA: true,
      BASE: true,
      BASEFONT: true,
      COL: true,
      ISINDEX: true,
      LINK: true,
      META: true,
      PARAM: true
    }
  },

  properties: [
    {
      name: 'id'
    },
    {
      name: 'nodeName'/*,
      preSet: function(_, v) {
        return v.toLowerCase();
      }*/
    },
    {
      name: 'attributeMap_',
      transient: true,
      factory: function() { return {}; }
    },
    {
      name: 'attributes',
      factory: function() { return []; },
      postSet: function(_, attrs) {
        for ( var i = 0 ; i < attrs.length ; i++ )
          this.attributeMap_[attrs[i].name] = attrs[i];
      }
    },
    {
      name: 'childNodes',
      factory: function() { return []; }
    },
    {
      name: 'children',
      transient: true,
      getter: function() {
        return this.childNodes.filter(function(c) { return typeof c !== 'string'; });
      }
    },
    {
      name: 'outerHTML',
      transient: true,
      getter: function() {
        var out = '<' + this.nodeName;
        if ( this.id ) out += ' id="' + this.id + '"';
        for ( key in this.attributeMap_ ) {
          var value = this.attributeMap_[key].value;

          out += value == undefined ?
            ' ' + key :
            ' ' + key + '="' + this.attributeMap_[key].value + '"';
        }
        if ( ! this.ILLEGAL_CLOSE_TAGS[this.nodeName] &&
             ( ! this.OPTIONAL_CLOSE_TAGS[this.nodeName] || this.childNodes.length ) ) {
          out += '>';
          out += this.innerHTML;
          out += '</' + this.nodeName;
        }
        out += '>';
        return out;
      }
    },
    {
      name: 'innerHTML',
      transient: true,
      getter: function() {
        var out = '';
        for ( var i = 0 ; i < this.childNodes.length ; i++ )
          out += this.childNodes[i].toString();
        return out;
      }
    }
  ],

  methods: {
    setAttribute: function(name, value) {
      var attr = this.getAttributeNode(name);

      if ( attr ) {
        attr.value = value;
      } else {
        attr = {name: name, value: value};
        this.attributes.push(attr);
        this.attributeMap_[name] = attr;
      }
    },
    getAttributeNode: function(name) { return this.attributeMap_[name]; },
    getAttribute: function(name) {
      var attr = this.getAttributeNode(name);
      return attr && attr.value;
    },
    appendChild: function(c) { this.childNodes.push(c); },
    removeChild: function(c) {
      for ( var i = 0; i < this.childNodes.length; ++i ) {
        if ( this.childNodes[i] === c ) {
          this.childNodes.splice(i, 1);
          break;
        }
      }
    },
    toString: function() { return this.outerHTML; }
  }
});


var HTMLParser = {
  __proto__: grammar,

  create: function() {
    return {
      __proto__: this,
      stack: [ X.foam.html.Element.create({nodeName: 'html'}) ]
    }
  },

  peek: function() { return this.stack[this.stack.length-1]; },

  START: sym('html'),

  // Use simpleAlt() because endTag() doesn't always look ahead and will
  // break the regular alt().
  html: repeat0(sym('htmlPart')),

  htmlPart: simpleAlt(
    sym('cdata'),
    sym('comment'),
    sym('text'),
    sym('endTag'),
    sym('startTag')),

  tag: seq(
    sym('startTag'),
    repeat(seq1(1, sym('matchingHTML'), sym('htmlPart')))),

  matchingHTML: function(ps) {
    return this.stack.length > 1 ? ps : null;
  },

  startTag: seq(
    '<',
    sym('tagName'),
    sym('whitespace'),
    sym('attributes'),
    sym('whitespace'),
    optional('/'),
    '>'),

  endTag: (function() {
    var endTag_ = sym('endTag_');
    return function(ps) {
      return this.stack.length > 1 ? this.parse(endTag_, ps) : undefined;
    };
  })(),

  endTag_: seq1(1, '</', sym('tagName'), '>'),

  cdata: seq1(1, '<![CDATA[', str(repeat(not(']]>', anyChar))), ']]>'),

  comment: seq('<!--', repeat0(not('-->', anyChar)), '-->'),

  attributes: repeat(sym('attribute'), sym('whitespace')),

  label: str(plus(notChars(' =/\t\r\n<>\'"'))),

  tagName: sym('label'),

  text: str(plus(alt('<%', notChar('<')))),

  attribute: seq(sym('label'), optional(seq1(1, '=', sym('value')))),

  value: str(alt(
    plus(alt(range('a','z'), range('A', 'Z'), range('0', '9'))),
    seq1(1, '"', repeat(notChar('"')), '"')
  )),

  whitespace: repeat0(alt(' ', '\t', '\r', '\n'))
}.addActions({
  START: function(xs) {
    // TODO(kgr): I think that this might be a bug if we get a failed compile then
    // we might not reset state properly.
    var ret = this.stack[0];
    this.stack = [ X.foam.html.Element.create({nodeName: 'html'}) ];
    return ret;
  },
  tag: function(xs) {
    var ret = this.stack[0];
    this.stack = [ X.foam.html.Element.create({nodeName: 'html'}) ];
    return ret.childNodes[0];
  },
  attribute: function(xs) { return { name: xs[0], value: xs[1] }; },
  cdata: function(xs) { this.peek() && this.peek().appendChild(xs); },
  text: function(xs) { this.peek() && this.peek().appendChild(xs); },
  startTag: function(xs) {
    var tag = xs[1];
    // < tagName ws attributes ws / >
    // 0 1       2  3          4  5 6
    var obj = X.foam.html.Element.create({nodeName: tag, attributes: xs[3]});
    this.peek() && this.peek().appendChild(obj);
    if ( xs[5] != '/' ) this.stack.push(obj);
    return obj;
  },
  endTag: function(tag) {
    var stack = this.stack;

    while ( stack.length > 1 ) {
      if ( this.peek().nodeName === tag ) {
        stack.pop();
        return;
      }
      var top = stack.pop();
      this.peek().childNodes = this.peek().childNodes.concat(top.childNodes);
      top.childNodes = [];
    }
  }
});

/*
// TODO: move tests to UnitTests
function test(html) {
  console.log('\n\nparsing: ', html);
  var p = HTMLParser.create();
  var res = p.parseString(html);
  if ( res ) {
    console.log('Result: ', res.toString());
  } else {
    console.log('error');
  }
}

test('<ba>foo</ba>');
test('<p>');
test('foo');
test('foo bar');
test('foo</end>');
test('<b>foo</b></foam>');
test('<pA a="1">foo</pA>');
test('<pA a="1" b="2">foo<b>bold</b></pA>');
*/

(function() {
  var registry = { };

  X.registerElement = function(name, model) {
//    console.log('registerElement: ', name);
    registry[name] = model;

    TemplateParser.foamTag_ = (function() {
      var start = seq(
        '<',
        simpleAlt.apply(null,
          Object.keys(registry).
            sort(function(o1, o2) { return o2.compareTo(o1); }).
            map(function(k) { return literal_ic(k); })),
        alt('/', ' ', '>'));

      var html = HTMLParser.create().export('tag');

      return function(ps) {
        var res = this.parse(start, ps) && this.parse(html, ps);
        if ( ! res ) return null;
        var elem  = res.value;
        var model = registry[elem.nodeName];
        if ( model ) elem.setAttribute('model', model);
        return res.setValue(elem);
      };
    })();
    invalidateParsers();
  };

  X.elementModel = function(name) {
    return registry[name];
  };
})();

X.registerElement('foam', null);

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: add type-checking in partialEval
//  (type-checking is a subset of partial-eval)

function compile_(a) {
  return /*Expr.isInstance(a) || Property.isInstance(a)*/ a.f ? a :
    a === true  ? TRUE        :
    a === false ? FALSE       :
    ConstantExpr.create({arg1:a});
}

function compileArray_(args) {
  var b = [];

  for ( var i = 0 ; i < args.length ; i++ ) {
    var a = args[i];

    if ( a !== null && a !== undefined ) b.push(compile_(a));
  }

  return b;
}


CLASS({
  name: 'Expr',

  documentation: 'Parent model for all mLang expressions. Contains default implementations for many methods.',

  methods: [
    function toMQL() { /* Outputs MQL for this expression. */ return this.label_; },
    function toSQL() { /* Outputs SQL for this expression. */ return this.label_; },
    function toBQL() { /* Outputs yet another query language for this expression. */ return this.label_; },
    function toString() {
      /* Converts to a string form for debugging; defaults to $$DOC{ref: ".toMQL", text: "MQL"}. */
      return this.toMQL();
    },
    function collectInputs(terms) {
      /* Recursively adds all inputs of an expression to an array. */
      terms.push(this);
    },
    function partialEval() {
      /* <p>Simplifies the expression by eliminating unnecessary clauses and combining others.</p>
       <p>Can sometimes reduce whole (sub)expressions to TRUE or FALSE.</p>
      */
      return this;
    },
    function minterm(index, term) {
      // True if this bit is set in the minterm number.
      return !!((term >>> index[0]--) & 1 );
    },
    function normalize() {
      return this;
      // Each input term to the expression.
      var inputs = [];
      this.collectInputs(inputs);

      // Truth table for every minterm (combination of inputs).
      var minterms = new Array(Math.pow(2, inputs.length));

      for ( var i = 0; i < minterms.length; i++ ) {
        minterms[i] = this.minterm([inputs.length - 1], i);
      }

      // TODO: Calculate prime implicants and reduce to minimal set.
      var terms = [];
      for ( i = 0; i < minterms.length; i++ ) {
        if ( minterms[i] ) {
          var subterms = [];
          for ( var j = 0; j < inputs.length; j++ ) {
            if ( i & (1 << (inputs.length - j - 1))) subterms.push(inputs[j]);
          }
          terms.push(AndExpr.create({ args: subterms }));
        }
      }
      var ret = OrExpr.create({ args: terms }).partialEval();
      console.log(this.toMQL(),' normalize-> ', ret.toMQL());
      return ret;
    },
    function pipe(sink) {
      /* Returns a $$DOC{ref: "Sink"} which applies this expression to every value <tt>put</tt> or <tt>remove</tt>d, calling the provided <tt>sink</tt> only for those values which match the expression. */
      var expr = this;
      return {
        __proto__: sink,
        put:    function(obj) { if ( expr.f(obj) ) sink.put(obj);   },
        remove: function(obj) { if ( expr.f(obj) ) sink.remove(obj); }
      };
    }
  ]
});


var TRUE = (FOAM({
  model_: 'Model',
  name: 'TrueExpr',
  extendsModel: 'Expr',

  documentation: 'Model for the primitive true value.',

  methods: {
    clone:     function() { return this; },
    deepClone: function() { return this; },
    toString:  function() { return '<true>'; },
    toSQL:     function() { return '( 1 = 1 )'; },
    toMQL:     function() { return ''; },
    toBQL:     function() { return ''; },
    f:         function() { return true; }
  }
})).create();


var FALSE = (FOAM({
  model_: 'Model',
  name: 'FalseExpr',
  extendsModel: 'Expr',

  documentation: 'Model for the primitive false value.',

  methods: {
    clone:     function() { return this; },
    deepClone: function() { return this; },
    toSQL: function(out) { return '( 1 <> 1 )'; },
    toMQL: function(out) { return '<false>'; },
    toBQL: function(out) { return '<false>'; },
    f:     function() { return false; }
  }
})).create();


var IDENTITY = (FOAM({
  model_: 'Model',
  name: 'IdentityExpr',
  extendsModel: 'Expr',

  documentation: 'The identity expression, which passes through its input unchanged.',

  methods: {
    clone:     function() { return this; },
    deepClone: function() { return this; },
    f: function(obj) { return obj; },
    toString: function() { return 'IDENTITY'; }
  }
})).create();

/** An n-ary function. **/
CLASS({
  name: 'NARY',

  extendsModel: 'Expr',
  abstract: true,

  documentation: 'Parent model for expressions which take an arbitrary number of arguments.',

  properties: [
    {
      name:  'args',
      label: 'Arguments',
      type:  'Expr[]',
      help:  'Sub-expressions',
      documentation: 'An array of subexpressions which are the arguments to this n-ary expression.',
      factory: function() { return []; }
    }
  ],

  methods: {
    toString: function() {
      var s = this.name_ + '(';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toString();
        if ( i < this.args.length-1 ) s += (', ');
      }
      return s + ')';
    },

    toSQL: function() {
      var s;
      s = this.model_.label;
      s += '(';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toSQL();
        if ( i < this.args.length-1 ) out.push(',');
      }
      s += ')';
      return s;
    },
    toMQL: function() {
      var s;
      s = this.model_.label;
      s += '(';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toMQL();
        if ( i < this.args.length-1 ) out.push(',');
      }
      s += ')';
      return str;
    },
    toBQL: function() {
      var s;
      s = this.model_.label;
      s += '(';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toBQL();
        if ( i < this.args.length-1 ) out.push(',');
      }
      s += ')';
      return str;
    }
  }
});


// Allow Singleton mLang's to be desearialized to properly.
var TrueExpr     = { finished__: true, arequire: function(ret) { return afuture().set(this).get; }, create: function() { return TRUE;  } };
var FalseExpr    = { finished__: true, arequire: function(ret) { return afuture().set(this).get; }, create: function() { return FALSE; } };
var IdentityExpr = { finished__: true, arequire: function(ret) { return afuture().set(this).get; }, create: function() { return IDENTITY; } };

/** An unary function. **/
CLASS({
  name: 'UNARY',

  extendsModel: 'Expr',
  abstract: true,

  documentation: 'Parent model for one-argument expressions.',

  properties: [
    {
      name:  'arg1',
      label: 'Argument',
      type:  'Expr',
      help:  'Sub-expression',
      documentation: 'The first argument to the expression.',
      defaultValue: TRUE
    }
  ],

  methods: {
    toSQL: function() {
      return this.label_ + '(' + this.arg1.toSQL() + ')';
    },
    toMQL: function() {
      return this.label_ + '(' + this.arg1.toMQL() + ')';
    },
    toBQL: function() {
      return this.label_ + '(' + this.arg1.toBQL() + ')';
    }
  }
});


/** An unary function. **/
CLASS({
  name: 'BINARY',

  extendsModel: 'UNARY',
  abstract: true,

  documentation: 'Parent model for two-argument expressions. Extends $$DOC{ref: "UNARY"} to include $$DOC{ref: ".arg2"}.',

  properties: [
    {
      name:  'arg2',
      label: 'Argument',
      type:  'Expr',
      help:  'Sub-expression',
      documentation: 'Second argument to the expression.',
      defaultValue: TRUE
    }
  ],

  methods: {
    toSQL: function() {
      return this.arg1.toSQL() + ' ' + this.label_ + ' ' + this.arg2.toSQL();
    },
    toMQL: function() {
      return this.arg1.toMQL() + ' ' + this.label_ + ' ' + this.arg2.toMQL();
    },
    toBQL: function() {
      return this.arg1.toBQL() + ' ' + this.label_ + ' ' + this.arg2.toBQL();
    }
  }
});


CLASS({
  name: 'CountExpr',

  extendsModel: 'Expr',

  properties: [
    {
      name:  'count',
      type:  'int',
      defaultValue: 0
    }
  ],

  methods: {
    reduce: function(other) {
      return CountExpr.create({count: this.count + other.count});
    },
    reduceI: function(other) {
      this.count = this.count + other.count;
    },
    pipe: function(sink) { sink.put(this); },
    put: function(obj) { this.count++; },
    remove: function(obj) { this.count--; },
    toString: function() { return this.count; }
  }
});

function COUNT() {
  return CountExpr.create();
}


CLASS({
  name: 'EqExpr',

  extendsModel: 'BINARY',
  abstract: true,

  documentation: function() { /*
    <p>Binary expression that compares its arguments for equality.</p>
    <p>When evaluated in Javascript, uses <tt>==</tt>.</p>
    <p>If the first argument is an array, returns true if any of its value match the second argument.</p>
  */},

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '=' + this.arg2.toSQL(); },
    toMQL: function() {
      if ( ! this.arg1.toMQL || ! this.arg2.toMQL ) return '';
      return this.arg2     === TRUE ? 'is:' + this.arg1.toMQL()   :
             this.arg2.f() == ''    ? '-has:' + this.arg1.toMQL() :
             this.arg1.toMQL() + '=' + this.arg2.toMQL()      ;
    },

    toBQL: function() {
      if ( ! this.arg1.toBQL || ! this.arg2.toBQL ) return '';
      return this.arg2     === TRUE ? this.arg1.toBQL() + ':true' :
             this.arg1.toBQL() + ':' + this.arg2.toBQL()      ;
    },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() == newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 !== newArg2 ?
        EqExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) {
      var arg1 = this.arg1.f(obj);
      var arg2 = this.arg2.f(obj);

      if ( Array.isArray(arg1) ) {
        return arg1.some(function(arg) {
          return arg == arg2;
        });
      }

      if ( arg2 === TRUE ) return !! arg1;
      if ( arg2 === FALSE ) return ! arg1;

      return arg1 == arg2;
    }
  }
});


function EQ(arg1, arg2) {
  var eq = EqExpr.create();
  eq.instance_.arg1 = compile_(arg1);
  eq.instance_.arg2 = compile_(arg2);
  return eq;
  //  return EqExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}


CLASS({
  name: 'ConstantExpr',

  extendsModel: 'UNARY',

  methods: {
    escapeSQLString: function(str) {
      return "'" +
        str.replace(/\\/g, "\\\\").replace(/'/g, "\\'") +
        "'";
    },
    escapeMQLString: function(str) {
      if ( str.length > 0 && str.indexOf(' ') == -1 && str.indexOf('"') == -1 && str.indexOf(',') == -1 ) return str;
      return '"' +
        str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') +
        '"';
    },
    toSQL: function() {
      return ( typeof this.arg1 === 'string' ) ?
        this.escapeSQLString(this.arg1) :
        this.arg1.toString() ;
    },
    toMQL: function() {
      return ( typeof this.arg1 === 'string' ) ?
        this.escapeMQLString(this.arg1) :
        (this.arg1.toMQL ? this.arg1.toMQL() :
         this.arg1.toString());
    },
    toBQL: function() {
      return ( typeof this.arg1 === 'string' ) ?
        this.escapeMQLString(this.arg1) :
        (this.arg1.toBQL ? this.arg1.toBQL() :
         this.arg1.toString());
    },
    f: function(obj) { return this.arg1; }
  }
});


CLASS({
  name: 'AndExpr',

  extendsModel: 'NARY',
  abstract: true,

  documentation: 'N-ary expression which is true only if each of its 0 or more arguments is true. AND() === TRUE',

  methods: {
    // AND has a higher precedence than OR so doesn't need parenthesis
    toSQL: function() {
      var s = '';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toSQL();
        if ( i < this.args.length-1 ) s += (' AND ');
      }
      return s;
    },
    toMQL: function() {
      var s = '';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        var sub = a.toMQL();
        if ( OrExpr.isInstance(a) ) {
          sub = '(' + sub + ')';
        }
        s += sub;
        if ( i < this.args.length-1 ) s += (' ');
      }
      return s;
    },
    toBQL: function() {
      var s = '';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        var sub = a.toBQL();
        if ( OrExpr.isInstance(a) ) {
          sub = '(' + sub + ')';
        }
        s += sub;
        if ( i < this.args.length-1 ) s += (' ');
      }
      return s;
    },
    collectInputs: function(terms) {
      for ( var i = 0; i < this.args.length; i++ ) {
        this.args[i].collectInputs(terms);
      }
    },
    minterm: function(index, term) {
      var out = true;
      for ( var i = 0; i < this.args.length; i++ ) {
        out = this.args[i].minterm(index, term) && out;
      }
      return out;
    }
  },

  constants: {
    PARTIAL_AND_RULES: [
      [ 'EqExpr', 'EqExpr',
        function(e1, e2) {
          return e1.arg1.exclusive ?
            e1.arg2.f() == e2.arg2.f() ? e1 : FALSE :
            e1.arg2.f() == e2.arg2.f() ? e1 : null ;
        }
      ],
      [ 'InExpr', 'InExpr',
        function(e1, e2) {
          var i = e1.arg1.exclusive ? e1.arg2.intersection(e2.arg2) : e1.arg2.union(e2.arg2) ;
          return i.length ? IN(e1.arg1, i) : FALSE;
        }
      ],
      [ 'InExpr', 'ContainedInICExpr',
        function(e1, e2) {
          if ( ! e1.arg1.exclusive ) return null;
          var i = e1.arg2.filter(function(o) { o = o.toUpperCase(); return e2.arg2.some(function(o2) { return o.indexOf(o2) != -1; }); });
          return i.length ? IN(e1.arg1, i) : FALSE;
        }
      ],
      [ 'ContainedInICExpr', 'ContainedInICExpr',
        function(e1, e2) {
          console.assert(false, 'AND.partialEval: ContainedInICExpr has no partialEval rule');
        }
      ],
      [ 'InExpr', 'ContainsICExpr',
        function(e1, e2) {
          if ( ! e1.arg1.exclusive ) return;
          var i = e1.arg2.filter(function(o) { return o.indexOfIC(e2.arg2.f()) !== -1; });
        }
      ],
      [ 'InExpr', 'ContainsExpr',
        function(e1, e2) {
          if ( ! e1.arg1.exclusive ) return;
          var i = e1.arg2.filter(function(o) { return o.indexOf(e2.arg2.f()) !== -1; });
          return i.length ? IN(e1.arg1, i) : FALSE;
        }
      ],
      [ 'EqExpr', 'InExpr',
        function(e1, e2) {
          if ( ! e1.arg1.exclusive ) return;
          return e2.arg2.indexOf(e1.arg2.f()) === -1 ? FALSE : e1;
        }
      ]
    ],

    partialAnd: function(e1, e2) {
      if ( OrExpr.isInstance(e2) ) { var tmp = e1; e1 = e2; e2 = tmp; }
      if ( OrExpr.isInstance(e1) ) {
        var args = [];
        for ( var i = 0 ; i < e1.args.length ; i++ ) {
          args.push(AND(e2, e1.args[i]));
        }
        return OrExpr.create({args: args}).partialEval();
      }

      if ( ! BINARY.isInstance(e1) ) return null;
      if ( ! BINARY.isInstance(e2) ) return null;
      if ( e1.arg1 != e2.arg1 ) return null;

      var RULES = this.PARTIAL_AND_RULES;
      for ( var i = 0 ; i < RULES.length ; i++ ) {
        if ( e1.model_.name == RULES[i][0] && e2.model_.name == RULES[i][1] ) return RULES[i][2](e1, e2);
        if ( e2.model_.name == RULES[i][0] && e1.model_.name == RULES[i][1] ) return RULES[i][2](e2, e1);
      }

      if ( DEBUG )
        console.log('Unknown partialAnd combination: ', e1.name_, e2.name_);

      return null;
    },

    partialEval: function() {
      var newArgs = [];
      var updated = false;

      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a    = this.args[i];
        var newA = this.args[i].partialEval();

        if ( newA === FALSE ) return FALSE;

        if ( AndExpr.isInstance(newA) ) {
          // In-line nested AND clauses
          for ( var j = 0 ; j < newA.args.length ; j++ ) {
            newArgs.push(newA.args[j]);
          }
          updated = true;
        }
        else {
          if ( newA === TRUE ) {
            updated = true;
          } else {
            newArgs.push(newA);
            if ( a !== newA ) updated = true;
          }
        }
      }

      for ( var i = 0 ; i < newArgs.length-1 ; i++ ) {
        for ( var j = i+1 ; j < newArgs.length ; j++ ) {
          var a = this.partialAnd(newArgs[i], newArgs[j]);
          if ( a ) {
            console.log('***************** ', newArgs[i].toMQL(), ' <PartialAnd> ', newArgs[j].toMQL(), ' -> ', a.toMQL());
            if ( a === FALSE ) return FALSE;
            newArgs[i] = a;
            newArgs.splice(j, 1);
          }
        }
      }

      if ( newArgs.length == 0 ) return TRUE;
      if ( newArgs.length == 1 ) return newArgs[0];

      return updated ? AndExpr.create({args: newArgs}) : this;
    },

    f: function(obj) {
      return this.args.every(function(arg) {
        return arg.f(obj);
      });
    }
  }
});


function AND() {
  return AndExpr.create({args: compileArray_.call(null, arguments)});
}

CLASS({
  name: 'NeqExpr',

  extendsModel: 'BINARY',
  abstract: true,

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '<>' + this.arg2.toSQL(); },
    toMQL: function() { return '-' + this.arg1.toMQL() + '=' + this.arg2.toMQL(); },
    toBQL: function() { return '-' + this.arg1.toBQL() + ':' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() != newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        NeqExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj) != this.arg2.f(obj); }
  }
});

function NEQ(arg1, arg2) {
  return NeqExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}


CLASS({
  name: 'UpperExpr',

  extendsModel: 'UNARY',

  properties: [
    { name: 'label_', defaultValue: 'UPPER' }
  ],
  methods: [
    function partialEval() {
      var newArg1 = this.arg1.partialEval();

      if ( ConstantExpr.isInstance(newArg1) ) {
        var val = newArg1.f();
        if ( typeof val === 'string' ) return compile_(val);
      } else if ( Array.isArray(newArg1) ) {
        debugger;
      }

      return this;
    },
    function f(obj) {
      var a = this.arg1.f(obj);
      return a && a.toUpperCase ? a.toUpperCase() : a ;
    }
  ]
});

function UPPER(arg1) { return UpperExpr.create({arg1: compile_(arg1)}); }
function EQ_IC(arg1, arg2) { return EQ(UPPER(arg1), UPPER(arg2)); }
function IN_IC(arg1, arg2) { return IN(UPPER(arg1), UPPER(arg2)); }

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'MaxExpr',

  extendsModel: 'UNARY',

  properties: [
    {
      name:  'max',
      type:  'int',
      help:  'Maximum value.',
      defaultValue: undefined
    }
  ],

  methods: {
    maximum: function(o1, o2) {
      return o1.compareTo(o2) > 0 ? o1 : o2;
    },
    reduce: function(other) {
      return MaxExpr.create({max: this.maximum(this.max, other.max)});
    },
    reduceI: function(other) {
      this.max = this.maximum(this.max, other.max);
    },
    pipe: function(sink) { sink.put(this); },
    put: function(obj) {
      var v = this.arg1.f(obj);
      this.max = this.max === undefined ? v : this.maximum(this.max, v);
    },
    remove: function(obj) { },
    toString: function() { return this.max; }
  }
});


function MAX(expr) {
  return MaxExpr.create({arg1: expr});
}


CLASS({
  name: 'InExpr',

  extendsModel: 'BINARY',

  documentation: 'Binary expression which is true if its first argument is EQ to any element of its second argument, which is an array.',

  properties: [
    {
      name:  'arg2',
      label: 'Argument',
      type:  'Expr',
      help:  'Sub-expression',
      postSet: function() { this.valueSet_ = undefined; }
    }
  ],

  methods: {
    partialEval: function() {
      if ( this.arg2.length == 1 ) return EQ(this.arg1, this.arg2[0]);
      return this;
    },
    valueSet: function() {
      if ( ! this.valueSet_ ) {
        var s = {};
        for ( var i = 0 ; i < this.arg2.length ; i++ ) s[this.arg2[i]] = true;
        this.valueSet_ = s;
      }
      return this.valueSet_;
    },
    toSQL: function() { return this.arg1.toSQL() + ' IN ' + this.arg2; },
    toMQL: function() { return this.arg1.toMQL() + '=' + this.arg2.join(',') },
    toBQL: function() { return this.arg1.toBQL() + ':(' + this.arg2.join('|') + ')' },

    f: function(obj) {
      return this.valueSet().hasOwnProperty(this.arg1.f(obj));
    }
  }
});


function IN(arg1, arg2) {
  return InExpr.create({arg1: compile_(arg1), arg2: arg2 });
}


CLASS({
  name: 'LtExpr',

  extendsModel: 'BINARY',
  abstract: true,

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '<' + this.arg2.toSQL(); },
    toMQL: function() { return this.arg1.toMQL() + '-before:' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + '<' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() < newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        LtExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj) < this.arg2.f(obj); }
  }
});

function LT(arg1, arg2) {
  return LtExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}


CLASS({
  name: 'GtExpr',

  extendsModel: 'BINARY',
  abstract: true,

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '>' + this.arg2.toSQL(); },
    toMQL: function() { return this.arg1.toMQL() + '-after:' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + '>' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() > newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        GtExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj) > this.arg2.f(obj); }
  }
});

function GT(arg1, arg2) {
  return GtExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}


CLASS({
  name: 'LteExpr',

  extendsModel: 'BINARY',
  abstract: true,

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '<=' + this.arg2.toSQL(); },
    toMQL: function() { return this.arg1.toMQL() + '-before:' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + '<=' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() <= newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        LtExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj) <= this.arg2.f(obj); }
  }
});


function LTE(arg1, arg2) {
  return LteExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}


CLASS({
  name: 'GteExpr',

  extendsModel: 'BINARY',
  abstract: true,

  methods: {
    toSQL: function() { return this.arg1.toSQL() + '>=' + this.arg2.toSQL(); },
    toMQL: function() { return this.arg1.toMQL() + '-after:' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + '>=' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f() >= newArg2.f());
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        GtExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj) >= this.arg2.f(obj); }
  }
});


function GTE(arg1, arg2) {
  return GteExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'ExplainExpr',

  extendsModel: 'UNARY',

  documentation: 'Pseudo-expression which outputs a human-readable description of its subexpression, and the plan for evaluating it.',

  properties: [
    {
      name:  'plan',
      help:  'Execution Plan',
      defaultValue: ""
    }
  ],

  methods: {
    toString: function() { return this.plan; },
    toSQL: function() { return this.arg1.toSQL(); },
    toMQL: function() { return this.arg1.toMQL(); },
    toBQL: function() { return this.arg1.toBQL(); },
    partialEval: function() {
      var newArg = this.arg1.partialEval();

      return this.arg1 === newArg ? this : EXPLAIN(newArg);
    },
    f: function(obj) { return this.arg1.f(obj); }
  }
});

function EXPLAIN(arg) {
  return ExplainExpr.create({arg1: arg});
}


CLASS({
  name: 'OrExpr',

  extendsModel: 'NARY',

  documentation: 'N-ary expression which is true if any one of its 0 or more subexpressions is true. OR() === FALSE',

  methods: {
    toSQL: function() {
      var s;
      s = '(';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toSQL();
        if ( i < this.args.length-1 ) s += (' OR ');
      }
      s += ')';
      return s;
    },

    toMQL: function() {
      var s = '';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toMQL();
        if ( i < this.args.length-1 ) s += (' OR ');
      }
      return s;
    },

    toBQL: function() {
      var s = '';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toBQL();
        if ( i < this.args.length-1 ) s += (' | ');
      }
      return s;
    },

    collectInputs: function(terms) {
      for ( var i = 0; i < this.args.length; i++ ) {
        this.args[i].collectInputs(terms);
      }
    },

    minterm: function(index, term) {
      var out = false;
      for ( var i = 0; i < this.args.length; i++ ) {
        out = this.args[i].minterm(index, term) || out;
      }
      return out;
    }
  },

  constants: {
    PARTIAL_OR_RULES: [
      [ 'InExpr', 'EqExpr',
        function(e1, e2) {
          return IN(e1.arg1, e1.arg1.union([e2.arg2.f()]));
        }
      ],
      [ 'InExpr', 'InExpr',
        function(e1, e2) {
          var i = e1.arg2.filter(function(o) { return e2.arg2.indexOf(o) !== -1; });
          return IN(e1.arg1, e1.arg2.union(e2.arg2));
        }
      ]
      /*
      [ 'InExpr', 'ContainsICExpr',
        function(e1, e2) {
          var i = e1.arg2.filter(function(o) { return o.indexOfIC(e2.arg2.f()) !== -1; });
          return i.length ? IN(e1.arg1, i) : FALSE;
        }
      ],
      [ 'InExpr', 'ContainsExpr',
        function(e1, e2) {
          var i = e1.arg2.filter(function(o) { return o.indexOf(e2.arg2.f()) !== -1; });
          return i.length ? IN(e1.arg1, i) : FALSE;
        }
      ],
      [ 'EqExpr', 'InExpr',
        function(e1, e2) {
          return e2.arg2.indexOf(e1.arg2.f()) === -1 ? FALSE : e1;
        }
      ]*/
    ],

    partialOr: function(e1, e2) {
      if ( ! BINARY.isInstance(e1) ) return null;
      if ( ! BINARY.isInstance(e2) ) return null;
      if ( e1.arg1 != e2.arg1 ) return null;

      var RULES = this.PARTIAL_OR_RULES;
      for ( var i = 0 ; i < RULES.length ; i++ ) {
        if ( e1.model_.name == RULES[i][0] && e2.model_.name == RULES[i][1] ) return RULES[i][2](e1, e2);
        if ( e2.model_.name == RULES[i][0] && e1.model_.name == RULES[i][1] ) return RULES[i][2](e2, e1);
      }

      console.log('************** Unknown partialOr combination: ', e1.name_, e2.name_);

      return null;
    },

    partialEval: function() {
      var newArgs = [];
      var updated = false;

      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a    = this.args[i];
        var newA = this.args[i].partialEval();

        if ( newA === TRUE ) return TRUE;

        if ( OrExpr.isInstance(newA) ) {
          // In-line nested OR clauses
          for ( var j = 0 ; j < newA.args.length ; j++ ) {
            newArgs.push(newA.args[j]);
          }
          updated = true;
        }
        else {
          if ( newA !== FALSE ) {
            newArgs.push(newA);
          }
          if ( a !== newA ) updated = true;
        }
      }

      for ( var i = 0 ; i < newArgs.length-1 ; i++ ) {
        for ( var j = i+1 ; j < newArgs.length ; j++ ) {
          var a = this.partialOr(newArgs[i], newArgs[j]);
          if ( a ) {
            console.log('***************** ', newArgs[i].toMQL(), ' <PartialOr> ', newArgs[j].toMQL(), ' -> ', a.toMQL());
            if ( a === TRUE ) return TRUE;
            newArgs[i] = a;
            newArgs.splice(j, 1);
          }
        }
      }

      if ( newArgs.length == 0 ) return FALSE;
      if ( newArgs.length == 1 ) return newArgs[0];

      return updated ? OrExpr.create({args: newArgs}) : this;
    },

    f: function(obj) {
      return this.args.some(function(arg) {
        return arg.f(obj);
      });
    }
  }
});


CLASS({
  name: 'NotExpr',

  extendsModel: 'UNARY',
  abstract: true,

  documentation: 'Unary expression which inverts the truth value of its argument.',

  methods: {
    toSQL: function() {
      return 'not ( ' + this.arg1.toSQL() + ' )';
    },
    toMQL: function() {
      // TODO: only include params if necessary
      return '-' + this.arg1.toMQL();
    },
    toBQL: function() {
      // TODO: only include params if necessary
      return '-' + this.arg1.toBQL();
    },
    collectInputs: function(terms) {
      this.arg1.collectInputs(terms);
    },

    minterm: function(index, term) {
      return ! this.arg1.minterm(index, term);
    },

    partialEval: function() {
      var newArg = this.arg1.partialEval();

      if ( newArg === TRUE ) return FALSE;
      if ( newArg === FALSE ) return TRUE;
      if ( NotExpr.isInstance(newArg) ) return newArg.arg1;
      if ( EqExpr.isInstance(newArg)  ) return NeqExpr.create(newArg);
      if ( NeqExpr.isInstance(newArg) ) return EqExpr.create(newArg);
      if ( LtExpr.isInstance(newArg)  ) return GteExpr.create(newArg);
      if ( GtExpr.isInstance(newArg)  ) return LteExpr.create(newArg);
      if ( LteExpr.isInstance(newArg) ) return GtExpr.create(newArg);
      if ( GteExpr.isInstance(newArg) ) return LtExpr.create(newArg);

      return this.arg1 === newArg ? this : NOT(newArg);
    },

    f: function(obj) { return ! this.arg1.f(obj); }
  }
});


CLASS({
  name: 'ContainedInICExpr',

  extendsModel: 'BINARY',

  documentation: 'Checks if the first argument is contained in the array-valued right argument, ignoring case in strings.',

  properties: [
    {
      name:  'arg2',
      label: 'Argument',
      type:  'Expr',
      help:  'Sub-expression',
      preSet: function(_, a) { return a.map(function(o) { return o.toUpperCase(); }); }
    }
  ],

  methods: {
    toSQL: function() { return this.arg1.toSQL() + ' IN ' + this.arg2; },
    toMQL: function() { return this.arg1.toMQL() + ':' + this.arg2.join(',') },
    toBQL: function() { return this.arg1.toBQL() + ':(' + this.arg2.join('|') + ')' },

    f: function(obj) {
      var v = this.arg1.f(obj);
      if ( Array.isArray(v) ) {
        for ( var j = 0 ; j < v.length ; j++ ) {
          var a = v[j].toUpperCase();
          for ( var i = 0 ; i < this.arg2.length ; i++ ) {
            if ( a.indexOf(this.arg2[i]) != -1 ) return true;
          }
        }
      } else {
        v = ('' + v).toUpperCase();
        for ( var i = 0 ; i < this.arg2.length ; i++ ) {
          if ( v.indexOf(this.arg2[i]) != -1 ) return true;
        }
      }
      return false;
    }
  }
});


CLASS({
  name: 'ContainsExpr',

  extendsModel: 'BINARY',

  //documentation: 'Checks

  methods: {
    toSQL: function() { return this.arg1.toSQL() + " like '%' + " + this.arg2.toSQL() + "+ '%'"; },
    toMQL: function() { return this.arg1.toMQL() + ':' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + ':' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f().indexOf(newArg2.f()) != -1);
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        ContainsExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) {
      var arg1 = this.arg1.f(obj);
      var arg2 = this.arg2.f(obj);

      if ( Array.isArray(arg1) ) {
        return arg1.some(function(arg) {
          return arg.indexOf(arg2) != -1;
        });
      }

      return arg1.indexOf(arg2) != -1;
    }
  }
});


CLASS({
  name: 'ContainsICExpr',

  extendsModel: 'BINARY',

  properties: [
    {
      name:  'arg2',
      label: 'Argument',
      type:  'Expr',
      help:  'Sub-expression',
      defaultValue: TRUE,
      postSet: function(_, value) { this.pattern_ = undefined; }
    }
  ],

  methods: {
    // No different that the non IC-case
    toSQL: function() { return this.arg1.toSQL() + " like '%' + " + this.arg2.toSQL() + "+ '%'"; },
    toMQL: function() { return this.arg1.toMQL() + ':' + this.arg2.toMQL(); },
    toBQL: function() { return this.arg1.toBQL() + ':' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f().toLowerCase().indexOf(newArg2.f()) != -1);
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        ContainsICExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) {
      var arg1 = this.arg1.f(obj);

      // Escape Regex escape characters
      var pattern = this.pattern_ ||
        ( this.pattern_ = new RegExp(this.arg2.f().toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') );

      if ( Array.isArray(arg1) ) {
        var pattern = this.pattern_;

        return arg1.some(function(arg) {
          return pattern.test(arg);
        });
      }

      return this.pattern_.test(arg1);
    }
  }
});



// TODO: A TrieIndex would be ideal for making this very fast.
CLASS({
  name: 'StartsWithExpr',

  extendsModel: 'BINARY',

  methods: {
    toSQL: function() { return this.arg1.toSQL() + " like '%' + " + this.arg2.toSQL() + "+ '%'"; },
    // TODO: Does MQL support this operation?
    toMQL: function() { return this.arg1.toMQL() + '-after:' + this.arg2.toMQL(); },
    // TODO: Likewise BQL.
    toBQL: function() { return this.arg1.toBQL() + '>=' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f().startsWith(newArg2.f()));
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        StartsWithExpr.create({arg1: newArg1, arg2: newArg2}) :
        this;
    },

    f: function(obj) {
      var arg1 = this.arg1.f(obj);
      var arg2 = this.arg2.f(obj);

      if ( Array.isArray(arg1) ) {
        return arg1.some(function(arg) {
          return arg.startsWith(arg2);
        });
      }

      return arg1.startsWith(arg2);
    }
  }
});


CLASS({
  name: 'StartsWithICExpr',

  extendsModel: 'BINARY',

  methods: {
    toSQL: function() { return this.arg1.toSQL() + " like '%' + " + this.arg2.toSQL() + "+ '%'"; },
    // TODO: Does MQL support this operation?
    toMQL: function() { return this.arg1.toMQL() + '-after:' + this.arg2.toMQL(); },
    // TODO: Does BQL support this operation?
    toBQL: function() { return this.arg1.toBQL() + '>=' + this.arg2.toBQL(); },

    partialEval: function() {
      var newArg1 = this.arg1.partialEval();
      var newArg2 = this.arg2.partialEval();

      if ( ConstantExpr.isInstance(newArg1) && ConstantExpr.isInstance(newArg2) ) {
        return compile_(newArg1.f().startsWithIC(newArg2.f()));
      }

      return this.arg1 !== newArg1 || this.arg2 != newArg2 ?
        StartsWithICExpr.create({arg1: newArg1, arg2: newArg2}) :
      this;
    },

    f: function(obj) { return this.arg1.f(obj).startsWithIC(this.arg2.f(obj)); }
  }
});


CLASS({
  name: 'ConcatExpr',
  extendsModel: 'NARY',

  label: 'concat',

  methods: {

    partialEval: function() {
      // TODO: implement
      return this;
    },

    f: function(obj) {
      var str = [];

      for ( var i = 0 ; i < this.args.length ; i++ ) {
        str.push(this.args[i].f(obj));
      }

      return str.join('');
    }
  }
});


CLASS({
  name: 'SumExpr',

  extendsModel: 'UNARY',

  properties: [
    {
      name:  'sum',
      type:  'int',
      help:  'Sum of values.',
      factory: function() { return 0; }
    }
  ],

  methods: {
    pipe: function(sink) { sink.put(this); },
    put: function(obj) { this.instance_.sum += this.arg1.f(obj); },
    remove: function(obj) { this.sum -= this.arg1.f(obj); },
    toString: function() { return this.sum; }
  }
});


CLASS({
  name: 'AvgExpr',

  extendsModel: 'UNARY',

  properties: [
    {
      name:  'count',
      type:  'int',
      defaultValue: 0
    },
    {
      name:  'sum',
      type:  'int',
      help:  'Sum of values.',
      defaultValue: 0
    },
    {
      name:  'avg',
      type:  'floag',
      help:  'Average of values.',
      getter: function() { return this.sum / this.count; }
    }
  ],

  methods: {
    pipe: function(sink) { sink.put(this); },
    put: function(obj) { this.count++; this.sum += this.arg1.f(obj); },
    remove: function(obj) { this.count--; this.sum -= this.arg1.f(obj); },
    toString: function() { return this.avg; }
  }
});


CLASS({
  name: 'MinExpr',

  extendsModel: 'UNARY',

  properties: [
    {
      name:  'min',
      type:  'int',
      help:  'Minimum value.',
      defaultValue: undefined
    }
  ],

  methods: {
    minimum: function(o1, o2) {
      return o1.compareTo(o2) > 0 ? o2 : o1;
    },
    reduce: function(other) {
      return MinExpr.create({max: this.mininum(this.min, other.min)});
    },
    reduceI: function(other) {
      this.min = this.minimum(this.min, other.min);
    },
    pipe: function(sink) { sink.put(this); },
    put: function(obj) {
      var v = this.arg1.f(obj);
      this.min = this.min === undefined ? v : this.minimum(this.min, v);
    },
    remove: function(obj) { },
    toString: function() { return this.min; }
  }
});


CLASS({
  name: 'DistinctExpr',

  extendsModel: 'BINARY',

  properties: [
    {
      name:  'values',
      help:  'Distinct values.',
      factory: function() { return {}; }
    }
  ],

  methods: {
    reduce: function(other) {
      // TODO:
    },
    reduceI: function(other) {
      // TODO:
    },
    put: function(obj) {
      var key = this.arg1.f(obj);
      if ( this.values.hasOwnProperty(key) ) return;
      this.values[key] = true;
      this.arg2.put(obj);
    },
    remove: function(obj) { /* TODO: */ },
    toString: function() { return this.arg2.toString(); },
    toHTML: function() { return this.arg2.toHTML(); }
  }
});


CLASS({
  name: 'GroupByExpr',

  extendsModel: 'BINARY',

  properties: [
    {
      name:  'groups',
      type:  'Map[Expr]',
      help:  'Groups.',
      factory: function() { return {}; }
    },
    {
      // Maintain a mapping of real keys because the keys in
      // 'groups' are actually the toString()'s of the real keys
      // and his interferes with the property comparator used to
      // sort groups.
      name: 'groupKeys',
      factory: function() { return [] }
    }
  ],

  methods: {
    sortedGroups: function(opt_comparator) {
      var c = opt_comparator || this.arg1.compareProperty;
      this.groupKeys.sort(c);
      var ret = {};
      for ( var i = 0 ; i < this.groupKeys.length ; i++ ) {
        ret[this.groupKeys[i]] = this.groups[i];
      }
      return ret;
    },
    reduce: function(other) {
      // TODO:
    },
    reduceI: function(other) {
      for ( var i in other.groups ) {
        if ( this.groups[i] ) this.groups[i].reduceI(other.groups[i]);
        else this.groups[i] = other.groups[i].deepClone();
      }
    },
    pipe: function(sink) {
      for ( key in this.groups ) {
        sink.push([key, this.groups[key].toString()]);
      }
      return sink;
    },
    putInGroup_: function(key, obj) {
      var group = this.groups.hasOwnProperty(key) && this.groups[key];
      if ( ! group ) {
        group = this.arg2.clone();
        this.groups[key] = group;
        this.groupKeys.push(key);
      }
      group.put(obj);
    },
    put: function(obj) {
      var key = this.arg1.f(obj);
      if ( Array.isArray(key) ) {
        if ( key.length ) {
          for ( var i = 0 ; i < key.length ; i++ ) this.putInGroup_(key[i], obj);
        } else {
          // Perhaps we should use a key value of undefiend instead of '', since
          // '' may actually be a valid key.
          this.putInGroup_('', obj);
        }
      } else {
        this.putInGroup_(key, obj);
      }
    },
    clone: function() {
      // Don't use default clone because we don't want to copy 'groups'
      return GroupByExpr.create({arg1: this.arg1, arg2: this.arg2});
    },
    remove: function(obj) { /* TODO: */ },
    toString: function() { return this.groups; },
    deepClone: function() {
      var cl = this.clone();
      cl.groups = {};
      for ( var i in this.groups ) {
        cl.groups[i] = this.groups[i].deepClone();
      }
      return cl;
    },
    toView_: function() { return this; },
    toHTML: function() {
      var out = [];

      out.push('<table border=1>');
      for ( var key in this.groups ) {
        var value = this.groups[key];
        var str = value.toView_ ? value.toView_().toHTML() : value;
        out.push('<tr><th>', key, '</th><td>', str, '</td></tr>');
      }
      out.push('</table>');

      return out.join('');
    },
    initHTML: function() {
      for ( var key in this.groups ) {
        var value = this.groups[key];
        value.toView_ && value.toView_().initHTML();
      }
    }
  }
});


CLASS({
  name: 'GridByExpr',

  extendsModel: 'Expr',

  properties: [
    {
      name:  'xFunc',
      label: 'X-Axis Function',
      type:  'Expr',
      help:  'Sub-expression',
      defaultValue: TRUE
    },
    {
      name:  'yFunc',
      label: 'Y-Axis Function',
      type:  'Expr',
      help:  'Sub-expression',
      defaultValue: TRUE
    },
    {
      name:  'acc',
      label: 'Accumulator',
      type:  'Expr',
      help:  'Sub-expression',
      defaultValue: TRUE
    },
    {
      name:  'rows',
      type:  'Map[Expr]',
      help:  'Rows.',
      factory: function() { return {}; }
    },
    {
      name:  'cols',
      label: 'Columns',
      type:  'Map[Expr]',
      help:  'Columns.',
      factory: function() { return {}; }
    },
    {
      model_: 'ArrayProperty',
      name: 'children'
    }
  ],

  methods: {
    init: function() {
      this.SUPER();

      var self = this;
      var f = function() {
        self.cols = GROUP_BY(self.xFunc, COUNT());
        self.rows = GROUP_BY(self.yFunc, GROUP_BY(self.xFunc, self.acc));
      };

      self.addPropertyListener('xFunc', f);
      self.addPropertyListener('yFunc', f);
      self.addPropertyListener('acc', f);
      f();
      /*
        Events.dynamic(
        function() { self.xFunc; self.yFunc; self.acc; },
        function() {
        self.cols = GROUP_BY(self.xFunc, COUNT());
        self.rows = GROUP_BY(self.yFunc, GROUP_BY(self.xFunc, self.acc));
        });
      */
    },

    reduce: function(other) {
    },
    reduceI: function(other) {
    },
    pipe: function(sink) {
    },
    put: function(obj) {
      this.rows.put(obj);
      this.cols.put(obj);
    },
    clone: function() {
      // Don't use default clone because we don't want to copy 'groups'
      return this.model_.create({xFunc: this.xFunc, yFunc: this.yFunc, acc: this.acc});
    },
    remove: function(obj) { /* TODO: */ },
    toString: function() { return this.groups; },
    deepClone: function() {
    },
    renderCell: function(x, y, value) {
      var str = value ? (value.toHTML ? value.toHTML() : value) : '';
      if ( value && value.toHTML && value.initHTML ) this.children.push(value);
      return '<td>' + str + '</td>';
    },
    sortAxis: function(values, f) { return values.sort(f.compareProperty); },
    sortCols: function(cols, xFunc) { return this.sortAxis(cols, xFunc); },
    sortRows: function(rows, yFunc) { return this.sortAxis(rows, yFunc); },
    sortedCols: function() {
      return this.sortCols(
        this.cols.groupKeys,
        this.xFunc);
    },
    sortedRows: function() {
      return this.sortRows(
        this.rows.groupKeys,
        this.yFunc);
    },
    toHTML_: function() {
      return this;
    },
    toHTML: function() {
      var out;
      this.children = [];
      var cols = this.cols.groups;
      var rows = this.rows.groups;
      var sortedCols = this.sortedCols();
      var sortedRows = this.sortedRows();

      out = '<table border=0 cellspacing=0 class="gridBy"><tr><th></th>';

      for ( var i = 0 ; i < sortedCols.length ; i++ ) {
        var x = sortedCols[i];
        var str = x.toHTML ? x.toHTML() : x;
        out += '<th>' + str + '</th>';
      }
      out += '</tr>';

      for ( var j = 0 ; j < sortedRows.length ; j++ ) {
        var y = sortedRows[j];
        out += '<tr><th>' + y + '</th>';

        for ( var i = 0 ; i < sortedCols.length ; i++ ) {
          var x = sortedCols[i];
          var value = rows[y].groups[x];
          if ( value ) {
            value.x = x;
            value.y = y;
          }
          out += this.renderCell(x, y, value);
        }

        out += '</tr>';
      }
      out += '</table>';

      return out;
    },

    initHTML: function() {
      for ( var i = 0; i < this.children.length; i++ ) {
        this.children[i].initHTML();
      }
      this.children = [];
    }
  }
});


CLASS({
  name: 'MapExpr',

  extendsModel: 'BINARY',

  methods: {
    reduce: function(other) {
      // TODO:
    },
    reduceI: function(other) {
    },
    pipe: function(sink) {
    },
    put: function(obj) {
      var val = this.arg1.f ? this.arg1.f(obj) : this.arg1(obj);
      var acc = this.arg2;
      acc.put(val);
    },
    clone: function() {
      // Don't use default clone because we don't want to copy 'groups'
      return MapExpr.create({arg1: this.arg1, arg2: this.arg2.clone()});
    },
    remove: function(obj) { /* TODO: */ },
    toString: function() { return this.arg2.toString(); },
    deepClone: function() {
    },
    toHTML: function() {
      return this.arg2.toHTML ? this.arg2.toHTML() : this.toString();
    },
    initHTML: function() {
      this.arg2.initHTML && this.arg2.initHTML();
    }
  }
});


CLASS({
  name: 'SeqExpr',

  extendsModel: 'NARY',

  methods: {
    pipe: function(sink) { sink.put(this); },
    put: function(obj) {
      var ret = [];
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        a.put(obj);
      }
    },
    f: function(obj) {
      var ret = [];
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];

        ret.push(a.f(obj));
      }
      return ret;
    },
    clone: function() {
      return SeqExpr.create({args:this.args.clone()});
    },
    toString: function(obj) {
      var out = [];
      out.push('(');
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        out.push(a.toString());
        if ( i < this.args.length-1 ) out.push(',');
      }
      out.push(')');
      return out.join('');
    },
    toHTML: function(obj) {
      var out = [];
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        out.push(a.toHTML ? a.toHTML() : a.toString());
        if ( i < this.args.length-1 ) out.push('&nbsp;');
      }
      return out.join('');
    }
  }
});


CLASS({
  name: 'UpdateExpr',
  extendsModel: 'NARY',

  label: 'UpdateExpr',

  properties: [
    {
      name: 'dao',
      type: 'DAO',
      transient: true,
      hidden: true
    }
  ],

  methods: {
    // TODO: put this back to process one at a time and then
    // have MDAO wait until it's done before pushing all data.
    put: function(obj) {
      (this.objs_ || (this.objs_ = [])).push(obj);
    },
    eof: function() {
      if ( ! this.objs_ ) return;
      for ( var i = 0 ; i < this.objs_.length ; i++ ) {
        var obj = this.objs_[i];
        var newObj = this.f(obj);
        if (newObj.id !== obj.id) this.dao.remove(obj.id);
        this.dao.put(newObj);
      }
      this.objs_ = undefined;
    },
    f: function(obj) {
      var newObj = obj.clone();
      for (var i = 0; i < this.args.length; i++) {
        this.args[i].f(newObj);
      }
      return newObj;
    },
    reduce: function(other) {
      return UpdateExpr.create({
        args: this.args.concat(other.args),
        dao: this.dao
      });
    },
    reduceI: function(other) {
      this.args = this.args.concat(other.args);
    },
    toString: function() {
      return this.toSQL();
    },
    toSQL: function() {
      var s = 'SET ';
      for ( var i = 0 ; i < this.args.length ; i++ ) {
        var a = this.args[i];
        s += a.toSQL();
        if ( i < this.args.length-1 ) s += ', ';
      }
      return s;
    }
  }
});

CLASS({
  name: 'SetExpr',
  label: 'SetExpr',

  extendsModel: 'BINARY',

  methods: {
    toSQL: function() { return this.arg1.toSQL() + ' = ' + this.arg2.toSQL(); },
    f: function(obj) {
      // TODO: This should be an assertion when arg1 is set rather than be checked
      // for every invocation.
      if ( Property.isInstance(this.arg1) ) {
        obj[this.arg1.name] = this.arg2.f(obj);
      }
    }
  }
});

function SUM(expr) {
  return SumExpr.create({arg1: expr});
}

function MIN(expr) {
  return MinExpr.create({arg1: expr});
}

function AVG(expr) {
  return AvgExpr.create({arg1: expr});
}

function SEQ() {
  //  return SeqExpr.create({args: compileArray_.call(null, arguments)});
  return SeqExpr.create({args: argsToArray(arguments)});
}

function UPDATE(expr, dao) {
  return UpdateExpr.create({
    args: compileArray_.call(null, Array.prototype.slice.call(arguments, 0, -1)),
    dao: arguments[arguments.length - 1]
  });
}

function SET(arg1, arg2) {
  return SetExpr.create({ arg1: compile_(arg1), arg2: compile_(arg2) });
}

function GROUP_BY(expr1, opt_expr2) {
  return GroupByExpr.create({arg1: expr1, arg2: opt_expr2 || [].sink});
}

function GRID_BY(xFunc, yFunc, acc) {
  return GridByExpr.create({xFunc: xFunc, yFunc: yFunc, acc: acc});
}

function MAP(fn, opt_sink) {
  return MapExpr.create({arg1: fn, arg2: opt_sink || [].sink});
}

function DISTINCT(fn, sink) {
  return DistinctExpr.create({arg1: fn, arg2: sink});
}

function OR() {
  return OrExpr.create({args: compileArray_.call(null, arguments)});
}

function NOT(arg) {
  return NotExpr.create({arg1: compile_(arg)});
}

// TODO: add EQ_ic

function STARTS_WITH(arg1, arg2) {
  return StartsWithExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}

function STARTS_WITH_IC(arg1, arg2) {
  return StartsWithICExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}

function CONTAINS(arg1, arg2) {
  return ContainsExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}

function CONTAINS_IC(arg1, arg2) {
  return ContainsICExpr.create({arg1: compile_(arg1), arg2: compile_(arg2)});
}

function CONCAT() {
  return ConcatExpr.create({args: compileArray_.call(null, arguments)});
}


CLASS({
  name: 'TreeExpr',

  extendsModel: 'Expr',

  properties: [
    {
      name: 'parentProperty'
    },
    {
      name: 'childrenProperty'
    },
    {
      name: 'items_',
      help: 'Temporary map to store collected objects.',
      factory: function() { return {}; },
      transient: true
    },
    {
      model_: 'ArrayProperty',
      name: 'roots'
    }
  ],

  methods: {
    put: function(o) {
      this.items_[o.id] = o;
      if ( ! this.parentProperty.f(o) ) {
        this.roots.push(o);
      }
    },
    eof: function() {
      var pprop = this.parentProperty;
      var cprop = this.childrenProperty;

      for ( var key in this.items_ ) {
        var item = this.items_[key];
        var parentId = pprop.f(item);
        if ( ! parentId ) continue;
        var parent = this.items_[parentId];

        parent[cprop.name] = cprop.f(parent).concat(item);
      }

      // Remove temporary holder this.items_.
      this.items_ = {};
    },
  }
});

function TREE(parentProperty, childrenProperty) {
  return TreeExpr.create({
    parentProperty: parentProperty,
    childrenProperty: childrenProperty
  });
}

CLASS({
  name: 'DescExpr',

  extendsModel: 'UNARY',

  methods: {
    toSQL: function() {
      return this.arg1.toMQL() + 'DESC';
    },
    toMQL: function() {
      return '-' + this.arg1.toMQL();
    },
    compare: function(o1, o2) {
      return -1 * this.arg1.compare(o1, o2);
    }
  }
});

CLASS({
  name: 'AddExpr',

  extendsModel: 'BINARY',

  methods: {
    toSQL: function() {
      return this.arg1.toSQL() + ' + ' + this.arg2.toSQL();
    },
    f: function(o) {
      return this.arg1.f(o) + this.arg2.f(o);
    }
  }
});

function ADD(arg1, arg2) {
  return AddExpr.create({ arg1: compile_(arg1), arg2: compile_(arg2) });
}

function DESC(arg1) {
  if ( DescExpr.isInstance(arg1) ) return arg1.arg1;
  return DescExpr.create({ arg1: arg1 });
}

var JOIN = function(dao, key, sink) {
  sink = sink || [].sink;
  return {
    f: function(o) {
      var s = sink.clone();
      dao.where(EQ(key, o.id)).select(s);
      return [o, s];
    }
  };
};


CLASS({
  name: 'MQLExpr',

  extendsModel: 'UNARY',

  documentation: 'Parse an MQL query string and use it as a predicate.',

  properties: [
    {
      name: 'specializations_',
      factory: function() { return {}; }
    }
  ],
  methods: {
    specialize: function(model) {
      var qp = QueryParserFactory(model, true /* keyword enabled */);
      return qp.parseString(this.arg1) || FALSE;
    },
    specialization: function(model) {
      return this.specializations_[model.name] ||
        ( this.specializations_[model.name] = this.specialize(model) );
    },
    // TODO: implement;
    toSQL: function() { return this.arg1; },
    toMQL: function() { return this.arg1; },

    partialEval: function() { return this; },

    f: function(obj) {
      return this.specialization(obj.model_).f(obj);
    }
  }
});


function MQL(mql) { return MQLExpr.create({arg1: mql}); }


CLASS({
  name: 'KeywordExpr',

  extendsModel: 'UNARY',

  documentation: 'Keyword search.',

  /*
  properties: [
    {
      name: 'model',
      factory: function() { return {}; }
    }
  ],
  */
  methods: {
    toSQL: function() { return this.arg1; },
    toMQL: function() { return this.arg1; },
    partialEval: function() { return this; },
    f: function(obj) {
      // Escape Regex escape characters
      var pattern = this.pattern_ ||
        ( this.pattern_ = new RegExp(this.arg1.toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') );

      return this.pattern_.test(obj.toJSON());
    }
  }
});


function KEYWORD(word) { return KeywordExpr.create({arg1: word}); }


// TODO: add other Date functions
var MONTH = function(p) { return {f: function (o) { return p.f(o).getMonth(); } }; };

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: move to package

/**
 * Generic Google-like query-language parser generator.
 *
 * key:value                  key contains "value"
 * key=value                  key exactly matches "value"
 * key:value1,value2          key contains "value1" OR "value2"
 * key:(value1|value2)        "
 * key1:value key2:value      key1 contains value AND key2 contains "value"
 * key1:value AND key2:value  "
 * key1:value and key2:value  "
 * key1:value OR key2:value   key1 contains value OR key2 contains "value"
 * key1:value or key2:value   "
 * key:(-value)               key does not contain "value"
 * (expr)                     groups expression
 * -expr                      not expression, ie. -pri:1
 * NOT expr                   not expression, ie. NOT pri:1
 * has:key                    key has a value
 * is:key                     key is a boolean TRUE value
 * key>value                  key is greater than value
 * key-after:value            "
 * key<value                  key is less than value
 * key-before:value           "
 * date:YY/MM/DD              date specified
 * date:today                 date of today
 * date-after:today-7         date newer than 7 days ago
 * date:d1..d2                date within range d1 to d2, inclusive
 * key:me                     key is the current user
 *
 * Date formats:
 * YYYY
 * YYYY-MM
 * YYYY-MM-DD
 * YYYY-MM-DDTHH
 * YYYY-MM-DDTHH:MM
 */
var QueryParserFactory = function(model, opt_enableKeyword) {
  var g = {
    __proto__: grammar,

    START: sym('query'),

    query: sym('or'),

    or: repeat(sym('and'), alt(literal_ic(' OR '), literal(' | ')), 1),

    and: repeat(
      sym('expr'),
      alt(literal_ic('AND '), not(alt(literal_ic(' OR'), literal(' |')), ' ')),
      1),

    expr: alt(
      sym('paren'),
      sym('negate'),
      sym('has'),
      sym('is'),
      sym('equals'),
      sym('before'),
      sym('after'),
      sym('id'),
      sym('keyword')
    ),

    paren: seq1(1, '(', sym('query'), ')'),

    negate: alt(
      seq('-', sym('expr')),
      seq('NOT ', sym('expr'))
    ),

    id: sym('number'),

    has: seq(literal_ic('has:'), sym('fieldname')),

    is: seq(literal_ic('is:'), sym('fieldname')),

    equals: seq(sym('fieldname'), alt(':', '='), sym('valueList')),

    // TODO: merge with 'equals'
    before: seq(sym('fieldname'), alt('<', '<=', '-before:'), sym('value')),

    // TODO: merge with 'equals'
    after: seq(sym('fieldname'), alt('>', '>=', '-after:'), sym('value')),

    value: alt(
      sym('me'),
      sym('date'),
      sym('string'),
      sym('number')),

    compoundValue: alt(
      sym('negateValue'),
      sym('orValue'),
      sym('andValue')),

    negateValue: seq('(', alt('-', literal_ic('not ')), sym('value'), ')'),

    orValue: seq(
      '(',
      repeat(sym('value'), alt('|', literal_ic(' or '), ' | '), 1),
      ')'),

    andValue: seq(
      '(',
      repeat(sym('value'), alt(literal_ic(' and '), ' '), 1),
      ')'),

    valueList: alt(sym('compoundValue'), repeat(sym('value'), ',', 1)),

    keyword: (function() {
      var keyword_ = sym('keyword_');
      return function(ps) {
        return opt_enableKeyword && this.parse(keyword_, ps);
      }
    })(),

    keyword_: str(plus(notChar(' '))),

    me: seq(literal_ic('me'), lookahead(not(sym('char')))),

    date: alt(
      sym('range date'),
      sym('literal date'),
      sym('relative date')),

    'range date': seq(sym('literal date'), '..', sym('literal date')),

    'literal date': alt(
      // YYYY-MM-DDTHH:MM
      seq(sym('number'), '-', sym('number'), '-', sym('number'), 'T',
          sym('number'), ':', sym('number')),
      // YYYY-MM-DDTHH
      seq(sym('number'), '-', sym('number'), '-', sym('number'), 'T',
          sym('number')),
      // YYYY-MM-DD
      seq(sym('number'), '-', sym('number'), '-', sym('number')),
      // YYYY-MM
      seq(sym('number'), '-', sym('number')),
      // YY/MM/DD
      seq(sym('number'), '/', sym('number'), '/', sym('number'))),

    'relative date': seq(literal_ic('today'), optional(seq('-', sym('number')))),

    string: alt(
      sym('word'),
      sym('quoted string')),

    'quoted string': str(seq1(1, '"', repeat(alt(literal('\\"', '"'), notChar('"'))), '"')),

    word: str(plus(sym('char'))),

    char: alt(range('a','z'), range('A', 'Z'), range('0', '9'), '-', '^', '_', '@', '%', '.'),

    number: str(plus(range('0', '9')))
  };

  var fields = [];

  var properties = model.getRuntimeProperties()
  for ( var i = 0 ; i < properties.length ; i++ ) {
    var prop = properties[i];
    fields.push(literal_ic(prop.name, prop));

    for ( var j = 0 ; j < prop.aliases.length ; j++ )
      if ( prop.aliases[j] ) fields.push(literal_ic(prop.aliases[j], prop));

    if ( prop.shortName ) fields.push(literal_ic(prop.shortName, prop));
  }

  fields.sort(function(a, b) {
    var d = a.length - b.length;

    if ( d !== 0 ) return d;

    if ( a == b ) return 0;

    return a < b ? 1 : -1;
  });

  g.fieldname = alt.apply(null, fields);

  g.addActions({
    id: function(v) { return EQ(model.ID, v); },

    or: function(v) { return OR.apply(OR, v); },

    and: function(v) { return AND.apply(AND, v); },

    negate: function(v) { return NOT(v[1]); },

    number: function(v) { return parseInt(v); },

    me: function() { return this.ME || this.X.ME || ""; },

    has: function(v) { return NEQ(v[1], ''); },

    is: function(v) { return EQ(v[1], TRUE); },

    before: function(v) {
      // If the value (v[2]) is a Date range, we take the appropriate end.
      if ( Array.isArray(v[2]) && v[2][0] instanceof Date ) {
        v[2] = v[1] === '<=' ? v[2][1] : v[2][0];
      }
      return (v[1] === '<=' ? LTE : LT) (v[0], v[2]);
    },

    after: function(v) {
      // If the value (v[2]) is a Date range, we take the appropriate end.
      if ( Array.isArray(v[2]) && v[2][0] instanceof Date ) {
        v[2] = v[1] === '>=' ? v[2][0] : v[2][1];
      }
      return (v[1] === '>=' ? GTE : GT) (v[0], v[2]);
    },

    equals: function(v) {
      // v[2], the values, is an array, which might have an 'and', 'or', or
      // 'negated' property on it. The default is 'or'. The partial evaluator
      // will simplify if these are needlessly complex.

      var prop    = v[0];
      var values  = v[2];
      var isInt   = IntProperty.isInstance(prop);
      var isNum   = isInt || FloatProperty.isInstance(prop);
      var isDateField = DateProperty.isInstance(prop) || DateTimeProperty.isInstance(prop);
      var isDateRange = Array.isArray(values[0]) && values[0][0] instanceof Date;

      if ( isDateField || isDateRange ) {
        if ( ! isDateRange ) {
          // Convert the number, a single year, into a date. Fortunately, years
          // are easy to add.
          var start = new Date(0); // Jan 1 1970 at midnight UTC.
          var end   = new Date(0);
          start.setUTCFullYear(values[0]);
          end.setUTCFullYear(+values[0] + 1);
          values = [[start, end]];
        }
        var q = AND(GTE(prop, values[0][0]), LT(prop, values[0][1]));
        return q;
      }

      var expr;

      if ( isNum ) {
        for ( var i = 0 ; i < values.length ; i++ )
          values[i] = isInt ? parseInt(values[i]) : parseFloat(values[i]);

        expr = IN(v[0], values);
      } else {
        expr = ( v[1] === '=' ) ?
          IN_IC(v[0], values) :
          ContainedInICExpr.create({arg1: compile_(prop), arg2: values}) ;
      }

      if ( values.negated ) {
        return NOT(expr);
      } else if ( values.and ) {
        return AndExpr.create({
          args: values.map(function(x) {
            return expr.model_.create({ arg1: expr.arg1, arg2: [x] });
          })
        });
      } else {
        return expr;
      }
    },

    keyword: function(v) { return KEYWORD(v); },

    negateValue: function(v) {
      v.negated = true;
      return v;
    },

    orValue: function(v) {
      v = v[1];
      v.or = true;
      return v;
    },

    andValue: function(v) {
      v = v[1];
      v.and = true;
      return v;
    },

    // All dates are actually treated as ranges. These are arrays of Date
    // objects: [start, end]. The start is inclusive and the end exclusive.
    // Using these objects, both ranges (date:2014, date:2014-05..2014-06) and
    // open-ended ranges (date>2014-01-01) can be computed higher up.

    // Date formats:
    // YYYY-MM-DDTHH:MM, YYYY-MM-DDTHH, YYYY-MM-DD, YYYY-MM, YY/MM/DD, YYYY
    'literal date': function(v) {
      var start, end, interval;

      start = new Date();
      end = new Date();
      var ops = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds'];
      var defaults = [0, 1, 1, 0, 0, 0];
      for (var i = 0; i < ops.length; i++) {
        var x = i*2 > v.length ? defaults[i] : v[i*2];
        // Adjust for months being 0-based.
        start['setUTC' + ops[i]](x - (i == 1 ? 1 : 0));
        end['setUTC' + ops[i]](x - (i == 1 ? 1 : 0));
      }

      // Start and end are currently clones of each other.
      // Bump the last portion of the date and set it in end.
      var last = Math.floor(v.length / 2);
      var op = 'UTC' + ops[last];
      end['set' + op](end['get' + op]() + 1);

      return [start, end];
    },

    'relative date': function(v) {
      var d = new Date();
      if ( v[1] ) d.setDate(d.getDate() - v[1][1]);
      return d;
    },

    'range date': function(v) {
      // This gives two dates, and we combined them, the range is from the start
      // of the first date to the end of the second.
      return [v[0][0], v[2][1]];
    }
  });

  return g;
};

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var OAM = {
  time: function(name, fn) {
    return function() {
      console.time(name);
      var ret = fn.apply(this, arguments);
      console.timeEnd(name);
      return ret;
    };
  },

  profile: function(fn) {
    return function() {
      console.profile();
      var ret = fn.apply(this, arguments);
      console.profileEnd();
      return ret;
    };
  }

};

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Visitor = {
  create: function() {
    return { __proto__: this, stack: [] };
  },

  push: function(o) { this.stack.push(o); },

  pop: function() { return this.stack.pop(); },

  top: function() {
    return this.stack.length && this.stack[this.stack.length-1];
  },

  visit: function(o) {
    return Array.isArray(o)           ? this.visitArray(o)    :
           ( typeof o === 'string' )  ? this.visitString(o)   :
           ( typeof o === 'number' )  ? this.visitNumber(o)   :
           ( o instanceof Function )  ? this.visitFunction(o) :
           ( o instanceof Date )      ? this.visitDate(o)     :
           ( o === true )             ? this.visitTrue()      :
           ( o === false )            ? this.visitFalse()     :
           ( o === null )             ? this.visitNull()      :
           ( o instanceof Object )    ? ( o.model_            ?
             this.visitObject(o)      :
             this.visitMap(o)
           )                          : this.visitUndefined() ;
  },

  visitArray: function(o) {
    var len = o.length;
    for ( var i = 0 ; i < len ; i++ ) this.visitArrayElement(o, i);
    return o;
  },
  visitArrayElement: function (arr, i) { this.visit(arr[i]); },

  visitString: function(o) { return o; },

  visitFunction: function(o) { return o; },

  visitNumber: function(o) { return o; },

  visitDate: function(o) { return o; },

  visitObject: function(o) {
    var properties = o.model_.getRuntimeProperties();
    for ( var key in properties ) {
      var prop = properties[key];

      if ( prop.name in o.instance_ ) {
        this.visitProperty(o, prop);
      }
    }
    return o;
  },
  visitProperty: function(o, prop) { this.visit(o[prop.name]); },

  visitMap: function(o) {
    for ( var key in o ) { this.visitMapElement(key, o[key]); };
    return o;
  },
  visitMapElement: function(key, value) { },

  visitTrue: function() { return true; },

  visitFalse: function() { return false; },

  visitNull: function() { return null; },

  visitUndefined: function() { return undefined; }

};

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'XHR',

  properties: [
    { model_: 'IntProperty', name: 'delay', defaultValue: 0 },
    { model_: 'IntProperty', name: 'retries', defaultValue: 0 },
    { name: 'authAgent' },
    { name: 'responseType', defaultValue: 'text' }
  ],

  methods: {
    init: function(args) {
      this.SUPER(args);

      if ( this.delay ) this.addDecorator(DelayDecorator.create({ delayMs: this.delay }));
      if ( this.authAgent ) this.addDecorator(OAuthXhrDecorator.create({ authAgent: this.authAgent }));
      if ( this.retries ) this.addDecorator(RetryDecorator.create({ maxAttempts: this.retries }));
    },

    makeXhr: function() { return new XMLHttpRequest(); },

    open: function(xhr, method, url) { xhr.open(method, url); },

    setRequestHeader: function(xhr, header, value) {
      xhr.setRequestHeader(header, value);
    },

    configure: function(xhr) {
      xhr.responseType = this.responseType;
      this.setRequestHeader(xhr, "Content-Type", "application/json");
    },

    bindListeners: function(xhr, ret) {
      var self = this;
      xhr.onreadystatechange = function() {
        if ( xhr.readyState == 4 ) {
          if ( self.responseType === "json" && typeof xhr.response == "string" )
            var response = JSON.parse(xhr.response);
          else response = xhr.response;
          ret(response, xhr);
        }
      }
    },

    send: function(xhr, data) {
      xhr.send(data);
    },

    asend: function(ret, url, data, method) {
      var xhr = this.makeXhr();
      this.open(xhr, method || "GET", url);
      this.configure(xhr);
      this.bindListeners(xhr, ret);
      this.send(xhr, (data && data.toJSON) ? data.toJSON() : data);
    },
  }
});


CLASS({
  name: "OAuthXhrDecorator",

  properties: [
    'authAgent'
  ],

  methods: {
    configure: function(decorator, delegate, args) {
      var xhr = args[0];
      xhr.setRequestHeader("Authorization", "Bearer " + decorator.authAgent.accessToken);
      return delegate.apply(this, args);
    },

    asend: function(decorator, delegate, args) {
      var ret = args[0];
      args[0] = function(response, xhr) {
        if ( xhr.status === 401 ) {
          decorator.authAgent.refresh(function() {
            ret(response, xhr);
          });
        } else {
          ret(response, xhr);
        }
      };
      return delegate.apply(null, args);
    }
  }
});


CLASS({
  name: 'RetryDecorator',

  properties: [
    { model_: 'IntProperty', name: 'maxAttempts', defaultValue: 3 }
  ],

  methods: {
    asend: function(decorator, delegate, args) {
      var originalRet = args[0];
      var attempts = 0;
      var self = this;
      var response;

      awhile(
        function() { return true; },
        aseq(
          function(ret) {
            args[0] = ret;
            delegate.apply(self, args);
          },
          function(ret, response, xhr) {
            if ( ( xhr.status >= 200 && xhr.status < 300 ) ||
                 xhr.status === 404 ||
                 ++attempts >= decorator.maxAttempts ) {
              finished = true;
              originalRet(response, xhr);
              return;
            }
            ret();
          }))(function(){});
    }
  }
});


CLASS({
  name: 'DelayDecorator',

  properties: [
    { model_: 'IntProperty', name: 'delayMs' },
  ],

  methods: {
    decorateObject: function(target) {
      var asend = adelay(target.asend.bind(target), this.delayMs);
      target.decorate('asend', function(_, _, args) {
        asend.apply(null, args);
      });
    }
  }
});


CLASS({
  name: 'XhrMessenger',
  properties: [
    { model_: 'URLProperty', name: 'url' },
    { model_: 'StringProperty', name: 'method', defaultValue: "POST" }
  ],

  methods: {
    put: function(obj, sink) {
      var xhr = this.Y.XHR.create();
      xhr.asend(function(response, xhr) {
        if ( xhr.status >= 200 && xhr.status < 300 ) {
          sink && sink.put && sink.put(response);
          return;
        }
        sink && sink.error && sink.error([response, xhr]);
      }, this.url, obj, this.method);
    }
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: model and move out of core
var LoggingDAO = {

  create: function(/*[logger], delegate*/) {
    var logger, delegate;
    if ( arguments.length == 2 ) {
      logger = arguments[0];
      delegate = arguments[1];
    } else {
      logger = console.log.bind(console);
      delegate = arguments[0];
    }

    return {
      __proto__: delegate,

      put: function(obj, sink) {
        logger('put', obj);
        delegate.put(obj, sink);
      },
      remove: function(query, sink) {
        logger('remove', query);
        delegate.remove(query, sink);
      },
      select: function(sink, options) {
        logger('select', options || "");
        return delegate.select(sink, options);
      },
      removeAll: function(sink, options) {
        logger('removeAll', options);
        return delegate.removeAll(sink, options);
      }
    };
  }
};


// TODO: model and move out of core
var TimingDAO = {

  create: function(name, delegate) {
    // Used to distinguish between concurrent operations
    var id;
    var activeOps = {put: 0, remove:0, find: 0, select: 0};
    function start(op) {
      var str = name + '-' + op;
      var key = activeOps[op]++ ? str + '-' + (id++) : str;
      console.time(id);
      return [key, str, window.performance.now(), op];
    }
    function end(act) {
      activeOps[act[3]]--;
      id--;
      console.timeEnd(act[0]);
      console.log('Timing: ', act[1], ' ', (window.performance.now()-act[2]).toFixed(3), ' ms');
    }
    function endSink(act, sink) {
      return {
        put:    function() { end(act); sink && sink.put    && sink.put.apply(sink, arguments); },
        remove: function() { end(act); sink && sink.remove && sink.remove.apply(sink, arguments); },
        error:  function() { end(act); sink && sink.error  && sink.error.apply(sink, arguments); },
        eof:    function() { end(act); sink && sink.eof    && sink.eof.apply(sink, arguments); }
      };
    }
    return {
      __proto__: delegate,

      put: function(obj, sink) {
        var act = start('put');
        delegate.put(obj, endSink(act, sink));
      },
      remove: function(query, sink) {
        var act = start('remove');
        delegate.remove(query, endSink(act, sink));
      },
      find: function(key, sink) {
        var act = start('find');
        delegate.find(key, endSink(act, sink));
      },
      select: function(sink, options) {
        var act = start('select');
        var fut = afuture();
        delegate.select(sink, options)(function(s) {
          end(act);
          fut.set(s);
        });
        return fut.get;
      }
    };
  }
};


var ObjectToJSON = {
  __proto__: Visitor.create(),

  visitFunction: function(o) {
    return o.toString();
  },

  visitObject: function(o) {
    this.push({
      model_: (o.model_.package ? o.model_.package + '.' : '') + o.model_.name
    });
    this.__proto__.visitObject.call(this, o);
    return this.pop();
  },
  visitProperty: function(o, prop) {
    prop.propertyToJSON(this, this.top(), o);
  },

  visitMap: function(o) {
    this.push({});
    Visitor.visitMap.call(this, o);
    return this.pop();
  },
  visitMapElement: function(key, value) { this.top()[key] = this.visit(value); },

  visitArray: function(o) {
    this.push([]);
    this.__proto__.visitArray.call(this, o);
    return this.pop();
  },
  visitArrayElement: function (arr, i) { this.top().push(this.visit(arr[i])); }
};


var JSONToObject = {
  __proto__: ObjectToJSON.create(),

  visitString: function(o) {
    try {
      return o.substr(0, 9) === 'function(' ?
        eval('(' + o + ')') :
        o ;
    } catch (x) {
      console.log(x, o);
      return o;
    }
  },

  visitObject: function(o) {
    var model   = X.lookup(o.model_);
    if ( ! model ) throw new Error('Unknown Model: ' + o.model_);
    var obj     = model.create();

    //    o.forEach((function(value, key) {
    // Workaround for crbug.com/258522
    Object_forEach(o, (function(value, key) {
      if ( key !== 'model_' ) obj[key] = this.visit(value);
    }).bind(this));

    return obj;
  },

  // Substitute in-place
  visitArray: Visitor.visitArray,
  visitArrayElement: function (arr, i) { arr[i] = this.visit(arr[i]); }
};


CLASS({
  name: 'FilteredDAO_',
  extendsModel: 'foam.dao.ProxyDAO',

  documentation: '<p>Internal use only.</p>',

  properties: [
    {
      name: 'query',
      required: true
    }
  ],
  methods: {
    select: function(sink, options) {
      return this.delegate.select(sink, options ? {
        __proto__: options,
        query: options.query ?
          AND(this.query, options.query) :
          this.query
      } : {query: this.query});
    },
    removeAll: function(sink, options) {
      return this.delegate.removeAll(sink, options ? {
        __proto__: options,
        query: options.query ?
          AND(this.query, options.query) :
          this.query
      } : {query: this.query});
    },
    listen: function(sink, options) {
      return this.SUPER(sink, options ? {
        __proto__: options,
        query: options.query ?
          AND(this.query, options.query) :
          this.query
      } : {query: this.query});
    },
    toString: function() {
      return this.delegate + '.where(' + this.query + ')';
    }
  }
});


CLASS({
  name: 'OrderedDAO_',
  extendsModel: 'foam.dao.ProxyDAO',

  documentation: function() {/*
        <p>Internal use only.</p>
      */},

  properties: [
    {
      name: 'comparator',
      required: true
    }
  ],
  methods: {
    select: function(sink, options) {
      if ( options ) {
        if ( ! options.order )
          options = { __proto__: options, order: this.comparator };
      } else {
        options = {order: this.comparator};
      }

      return this.delegate.select(sink, options);
    },
    toString: function() {
      return this.delegate + '.orderBy(' + this.comparator + ')';
    }
  }

});


CLASS({
  name: 'LimitedDAO_',
  extendsModel: 'foam.dao.ProxyDAO',

  documentation: function() {/*
        <p>Internal use only.</p>
      */},

  properties: [
    {
      name: 'count',
      required: true
    }
  ],
  methods: {
    select: function(sink, options) {
      if ( options ) {
        if ( 'limit' in options ) {
          options = {
            __proto__: options,
            limit: Math.min(this.count, options.limit)
          };
        } else {
          options = { __proto__: options, limit: this.count };
        }
      }
      else {
        options = { limit: this.count };
      }

      return this.delegate.select(sink, options);
    },
    toString: function() {
      return this.delegate + '.limit(' + this.count + ')';
    }
  }
});


CLASS({
  name: 'SkipDAO_',
  extendsModel: 'foam.dao.ProxyDAO',

  documentation: function() {/*
        <p>Internal use only.</p>
      */},

  properties: [
    {
      name: 'skip',
      required: true,
      postSet: function() {
        if ( this.skip !== Math.floor(this.skip) )
          console.warn('skip() called with non-integer value: ' + this.skip);
      }
    }
  ],
  methods: {
    select: function(sink, options) {
      options = options ? { __proto__: options, skip: this.skip } : { skip: this.skip };

      return this.delegate.select(sink, options);
    },
    toString: function() {
      return this.delegate + '.skip(' + this.skip + ')';
    }
  }
});


CLASS({
  name: 'RelationshipDAO',
  extendsModel: 'FilteredDAO_',
  documentation: 'Adapts a DAO based on a Relationship.',

  properties: [
    {
      name: 'relatedProperty',
      required: true
    },
    {
      name: 'relativeID',
      required: true
    },
    {
      name: 'query',
      lazyFactory: function() {
        return AND(NEQ(this.relatedProperty, ''),
            EQ(this.relatedProperty, this.relativeID));
      }
    },
  ],

  methods: [
    function put(obj, sink) {
      obj[this.relatedProperty.name] = this.relativeID;
      this.SUPER(obj, sink);
    }
  ]
});

function atxn(afunc) {
  return function(ret) {
    if ( GLOBAL.__TXN__ ) {
      afunc.apply(this, arguments);
    } else {
      GLOBAL.__TXN__ = {};
      var a = argsToArray(arguments);
      a[0] = function() {
        GLOBAL.__TXN__ = undefined;
        ret();
      };
      afunc.apply(this, a);
    }
  };
}


CLASS({
  name: 'AbstractDAO',

  documentation: function() {/*
    The base for most DAO implementations, $$DOC{ref:'.'} provides basic facilities for
    $$DOC{ref:'.where'}, $$DOC{ref:'.limit'}, $$DOC{ref:'.skip'}, and $$DOC{ref:'.orderBy'}
    operations, and provides for notifications of updates through $$DOC{ref:'.listen'}.
  */},

  requires: [
//     'FilteredDAO_', // can't require these due to cycle back to AbstractDAO.
//     'LimitedDAO_',
//     'SkipDAO_',
//     'OrderedDAO_'
  ],

  properties: [
    {
      name: 'daoListeners_',
      transient: true,
      hidden: true,
      factory: function() { return []; }
    }
  ],

  methods: {
    init: function() {
      arequire('FilteredDAO_');
      arequire('LimitedDAO_');
      arequire('SkipDAO_');
      arequire('OrderedDAO_');

      this.SUPER();
    },

    update: function(expr) { /* Applies a change to the DAO contents. */
      return this.select(UPDATE(expr, this));
    },

    select: function(sink, options) {
      /* Template method. Override to copy the contents of this DAO (filtered or ordered as
      necessary) to sink. */
    },
    remove: function(query, sink) {
      /* Template method. Override to remove matching items and put them into sink if supplied. */
    },

    pipe: function(sink, options) { /* A $$DOC{ref:'.select'} followed by $$DOC{ref:'.listen'}.
           Dump our contents to sink, then send future changes there as well. */
      sink = this.decorateSink_(sink, options, true);

      var fc   = this.createFlowControl_();
      var self = this;

      this.select({
        put: function() {
          sink.put && sink.put.apply(sink, arguments);
        },
        remove: function() {
          sink.remove && sink.remove.apply(sink, arguments);
        },
        error: function() {
          sink.error && sink.error.apply(sink, arguments);
        },
        eof: function() {
          if ( fc.stopped ) {
            sink.eof && sink.eof();
          } else {
            self.listen(sink, options);
          }
        }
      }, options, fc);
    },

    decorateSink_: function(sink, options, isListener, disableLimit) {
      if ( options ) {
        if ( ! disableLimit ) {
          if ( options.limit ) sink = limitedSink(options.limit, sink);
          if ( options.skip )  sink = skipSink(options.skip, sink);
        }

        if ( options.order && ! isListener ) {
          sink = orderedSink(options.order, sink);
        }

        if ( options.query ) {
          sink = predicatedSink(
            options.query.partialEval ?
              options.query.partialEval() :
              options.query,
            sink) ;
        }
      }

      return sink;
    },

    createFlowControl_: function() {
      return {
        stop: function() { this.stopped = true; },
        error: function(e) { this.errorEvt = e; }
      };
    },

    where: function(query) { /* Return a DAO that contains a filtered subset of this one. */
      // only use X if we are an invalid instance without a this.Y
      return (this.Y || X).lookup('FilteredDAO_').create({query: query, delegate: this});
    },

    limit: function(count) { /* Return a DAO that contains a count limited subset of this one. */
      return (this.Y || X).lookup('LimitedDAO_').create({count:count, delegate:this});
    },

    skip: function(skip) { /* Return a DAO that contains a subset of this one, skipping initial items. */
      return (this.Y || X).lookup('SkipDAO_').create({skip:skip, delegate:this});
    },

    orderBy: function() { /* Return a DAO that contains a subset of this one, ordered as specified. */
      return (this.Y || X).lookup('OrderedDAO_').create({ comparator: arguments.length == 1 ? arguments[0] : argsToArray(arguments), delegate: this });
    },

    listen: function(sink, options) { /* Send future changes to sink. */
      this.daoListeners_.push(this.decorateSink_(sink, options, true));
    },

    unlisten: function(sink) { /* Stop sending updates to the given sink. */
      var ls = this.daoListeners_;
//      if ( ! ls.length ) console.warn('Phantom DAO unlisten: ', this, sink);
      for ( var i = 0; i < ls.length ; i++ ) {
        if ( ls[i].$UID === sink.$UID ) {
          ls.splice(i, 1);
          return true;
        }
      }
      console.assert(! DEBUG, 'Phantom DAO unlisten: ', this, sink);
    },

    // Default removeAll: calls select() with the same options and
    // calls remove() for all returned values.
    removeAll: function(sink, options) { /* Default $$DOC{ref:'.removeAll'}: calls
            $$DOC{ref:'.select'} with the same options and calls $$DOC{ref:'.remove'}
             for all returned values. */
      var self = this;
      var future = afuture();
      this.select({
        put: function(obj) {
          self.remove(obj, { remove: sink && sink.remove });
        }
      })(function() {
        sink && sink.eof();
        future.set();
      });
      return future.get;
    },

    /**
     * Notify all listeners of update to DAO.
     * @param fName the name of the method in the listeners to call.
     *        possible values: 'put', 'remove'
     **/
    notify_: function(fName, args) {
      // console.log(this.name_, ' ***** notify ', fName, ' args: ', args, ' listeners: ', this.daoListeners_);
      for( var i = 0 ; i < this.daoListeners_.length ; i++ ) {
        var l = this.daoListeners_[i];
        var fn = l[fName];
        if ( fn ) {
          // Create flow-control object
          args[2] = {
            stop: (function(fn, l) {
              return function() { fn(l); };
            })(this.unlisten.bind(this), l),
            error: function(e) { /* Don't care. */ }
          };
          try {
            fn.apply(l, args);
          } catch(err) {
            if ( err !== this.UNSUBSCRIBE_EXCEPTION ) {
              console.error('Error delivering event (removing listener): ', fName, err);
            }
            this.unlisten(l);
          }
        }
      }
    }
  }
});


// Experimental, convert all functions into sinks
Function.prototype.put    = function() { this.apply(this, arguments); };
Function.prototype.remove = function() { this.apply(this, arguments); };
Function.prototype.reset = function() { this.call(this); };
//Function.prototype.error  = function() { this.apply(this, arguments); };
//Function.prototype.eof    = function() { this.apply(this, arguments); };

/**
 * @license
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  // Copy X.AbstractDAO methods in Array prototype

  var pmap = {};
  for ( var key in AbstractDAO.methods ) {
    pmap[AbstractDAO.methods[key].name] = AbstractDAO.methods[key].code;
  }

  for ( var key in pmap ) {
    Object.defineProperty(Array.prototype, key, {
      value: pmap[key],
      configurable: true,
      writable: true
    });
  }
})();

defineLazyProperty(Array.prototype, 'daoListeners_', function() {
  return {
    value: [],
    configurable: true
  };
});


var ArraySink = {
  __proto__: Array.prototype,
  put: function(obj, sink) {
    this.push(obj);
    this.notify_('put', arguments);
    sink && sink.put && sink.put(obj);
  },
  clone: function() {
    return this.slice().sink;
  },
  deepClone: function() {
    return Array.prototype.call(this).sink;
  }
};


MODEL0({
  extendsProto: 'Array',

  properties: [
    {
      name: 'dao',
      getter: function() { this.__proto__ = Array.prototype; return this; }
    },
    {
      name: 'sink',
      getter: function() { this.__proto__ = ArraySink; return this; }
    }
  ],
  methods: {
    listen:   AbstractDAO.getPrototype().listen,
    unlisten: AbstractDAO.getPrototype().unlisten,
    notify_:  AbstractDAO.getPrototype().notify_,

    // Clone this Array and remove 'v' (only 1 instance)
    // TODO: make faster by copying in one pass, without splicing
    deleteF: function(v) {
      var a = this.clone();
      for ( var i = 0 ; i < a.length ; i++ ) {
        if ( a[i] === v ) { a.splice(i, 1); break; }
      }
      return a;
    },
    // Remove 'v' from this array (only 1 instance removed)
    // return true iff the value was removed
    deleteI: function(v) {
      for ( var i = 0 ; i < this.length ; i++ ) {
        if ( this[i] === v ) { this.splice(i, 1); return true; }
      }
      return false;
    },
    // Clone this Array and remove first object where predicate 'p' returns true
    // TODO: make faster by copying in one pass, without splicing
    removeF: function(p) {
      var a = this.clone();
      for ( var i = 0 ; i < a.length ; i++ ) {
        if ( p.f(a[i]) ) { a.splice(i, 1); break; }
      }
      return a;
    },
    // Remove first object in this array where predicate 'p' returns true
    removeI: function(p) {
      for ( var i = 0 ; i < this.length ; i++ ) {
        if ( p.f(this[i]) ) { this.splice(i, 1); breeak; }
      }
      return this;
    },
    pushF: function(obj) {
      var a = this.clone();
      a.push(obj);
      return a;
    },
    id: function(obj) {
      return obj.id || obj.$UID;
    },
    put: function(obj, sink) {
      for ( var idx = 0; idx < this.length; idx++ ) {
        if ( this[idx].id === obj.id ) {
          this[idx] = obj;
          sink && sink.put && sink.put(obj);
          this.notify_('put', arguments);
          //        sink && sink.error && sink.error('put', obj, duplicate);
          return;
        }
      }

      this.push(obj);
      this.notify_('put', arguments);
      sink && sink.put && sink.put(obj);
    },
    find: function(query, sink) {
      if ( query.f ) {
        for ( var idx = 0 ; idx < this.length; idx++ ) {
          if ( query.f(this[idx]) ) {
            sink && sink.put && sink.put(this[idx]);
            return;
          }
        }
      } else {
        for ( var idx = 0 ; idx < this.length; idx++ ) {
          if ( this[idx].id === query ) {
            sink && sink.put && sink.put(this[idx]);
            return;
          }
        }
      }
      sink && sink.error && sink.error('find', query);
    },
    // TODO: make this faster, should stop after finding first item.
    remove: function(obj, sink) {
      if ( ! obj ) {
        sink && sink.error && sink.error('missing key');
        return;
      }
      var objId = obj.id;
      var id = (objId !== undefined && objId !== '') ? objId : obj;
      for ( var idx = 0 ; idx < this.length; idx++ ) {
        if ( this[idx].id === id ) {
          var rem = this.splice(idx,1)[0];
          //        this.notify_('remove', rem);
          sink && sink.remove && sink.remove(rem[0]);
          return;
        }
      }
      sink && sink.error && sink.error('remove', obj);
    },
    removeAll: function(sink, options) {
      if ( ! options ) options = {};
      if ( !options.query ) options.query = { f: function() { return true; } };

      for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if ( options.query.f(obj) ) {
          var rem = this.splice(i,1)[0];
          //        this.notify_('remove', [rem]);
          sink && sink.remove && sink.remove(rem);
          i--;
        }
      }
      sink && sink.eof && sink.eof();
      return anop();
    },
    select: function(sink, options) {
      sink = sink || [].sink;
      var hasQuery = options && ( options.query || options.order );
      var originalsink = sink;
      sink = this.decorateSink_(sink, options, false, ! hasQuery);

      // Short-circuit COUNT.
      if ( ! hasQuery && GLOBAL.CountExpr && CountExpr.isInstance(sink) ) {
        sink.count = this.length;
        return aconstant(originalsink);
      }

      var fc = this.createFlowControl_();
      var start = Math.max(0, hasQuery ? 0 : ( options && options.skip ) || 0);
      var end = hasQuery ?
        this.length :
        Math.min(this.length, start + ( ( options && options.limit ) || this.length));
      for ( var i = start ; i < end ; i++ ) {
        sink.put(this[i], null, fc);
        if ( fc.stopped ) break;
        if ( fc.errorEvt ) {
          sink.error && sink.error(fc.errorEvt);
          return aconstant(originalsink, fc.errorEvt);
        }
      }

      sink.eof && sink.eof();

      return aconstant(originalsink);
    }
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Index Interface:
 *   put(state, value) -> new state
 *   remove(state, value) -> new state
 *   removeAll(state) -> new state // TODO
 *   plan(state, sink, options) -> {cost: int, toString: fn, execute: fn}
 *   size(state) -> int
 * Add:
 *   get(key) -> obj
 *   update(oldValue, newValue)
 *
 * TODO:
 *  reuse plans
 *  add ability for indices to pre-populate data
 */

/** Plan indicating that there are no matching records. **/
var NOT_FOUND = {
  cost: 0,
  execute: function(_, sink, _) { return anop; },
  toString: function() { return "no-match(cost=0)"; }
};

/** Plan indicating that an index has no plan for executing a query. **/
var NO_PLAN = {
  cost: Number.MAX_VALUE,
  execute: function() { return anop; },
  toString: function() { return "no-plan"; }
};

function dump(o) {
  if ( Array.isArray(o) ) return '[' + o.map(dump).join(',') + ']';
  return o ? o.toString() : '<undefined>';
}

/** An Index which holds only a single value. **/
var ValueIndex = {
  put: function(s, newValue) { return newValue; },
  remove: function() { return undefined; },
  plan: (function() {
           var plan = {
             cost: 1,
             execute: function(s, sink) {
               sink.put(s);
               return anop;
             },
             toString: function() { return 'unique'; }
           };

           return function() { return plan; };
         })(),
  get: function(value, key) { return value; },
  select: function(value, sink, options) {
    if ( options ) {
      if ( options.query && ! options.query.f(value) ) return;
      if ( 'skip' in options && options.skip-- > 0 ) return;
      if ( 'limit' in options && options.limit-- < 1 ) return;
    }
    sink.put(value);
  },
  selectReverse: function(value, sink, options) { this.select(value, sink, options); },
  size:   function(obj) { return 1; },
  toString: function() { return 'value'; }
};

var KEY   = 0;
var VALUE = 1;
var SIZE  = 2;
var LEVEL = 3;
var LEFT  = 4;
var RIGHT = 5;

// TODO: investigate how well V8 optimizes static classes

// [0 key, 1 value, 2 size, 3 level, 4 left, 5 right]

/** An AATree (balanced binary search tree) Index. **/
var TreeIndex = {
  create: function(prop, tail) {
    tail = tail || ValueIndex;

    return {
      __proto__: this,
      prop: prop,
      tail: tail,
      selectCount: 0
    };
  },

  /**
   * Bulk load an unsorted array of objects.
   * Faster than loading individually, and produces a balanced tree.
   **/
  bulkLoad: function(a) {
    // Only safe if children aren't themselves trees
    if ( this.tail === ValueIndex ) {
      a.sort(toCompare(this.prop));
      return this.bulkLoad_(a, 0, a.length-1);
    }

    var s = undefined;
    for ( var i = 0 ; i < a.length ; i++ ) {
      s = this.put(s, a[i]);
    }
    return s;
  },

  bulkLoad_: function(a, start, end) {
    if ( end < start ) return undefined;

    var m    = start + Math.floor((end-start+1) / 2);
    var tree = this.put(undefined, a[m]);

    tree[LEFT] = this.bulkLoad_(a, start, m-1);
    tree[RIGHT] = this.bulkLoad_(a, m+1, end);
    tree[SIZE] += this.size(tree[LEFT]) + this.size(tree[RIGHT]);

    return tree;
  },

  // Set the value's property to be the same as the key in the index.
  // This saves memory by sharing objects.
  dedup: function(obj, value) {
    obj[this.prop.name] = value;
  },

  maybeClone: function(s) {
    if ( s && this.selectCount > 0 ) return s.clone();
    return s;
  },

  put: function(s, newValue) {
    return this.putKeyValue(s, this.prop.f(newValue), newValue);
  },

  putKeyValue: function(s, key, value) {
    if ( ! s ) {
      return [key, this.tail.put(null, value), 1, 1];
    }

    s = this.maybeClone(s);

    var r = this.compare(s[KEY], key);

    if ( r === 0 ) {
      this.dedup(value, s[KEY]);

      s[SIZE] -= this.tail.size(s[VALUE]);
      s[VALUE] = this.tail.put(s[VALUE], value);
      s[SIZE] += this.tail.size(s[VALUE]);
    } else {
      var side = r > 0 ? LEFT : RIGHT;

      if ( s[side] ) s[SIZE] -= s[side][SIZE];
      s[side] = this.putKeyValue(s[side], key, value);
      s[SIZE] += s[side][SIZE];
    }

    return this.split(this.skew(s));
  },

  //    input: T, a node representing an AA tree that needs to be rebalanced.
  //    output: Another node representing the rebalanced AA tree.

  skew: function(s) {
    if ( s && s[LEFT] && s[LEFT][LEVEL] === s[LEVEL] ) {
      // Swap the pointers of horizontal left links.
      var l = this.maybeClone(s[LEFT]);

      s[LEFT] = l[RIGHT];
      l[RIGHT] = s;

      this.updateSize(s);
      this.updateSize(l);

      return l;
    }

    return s;
  },

  updateSize: function(s) {
    s[SIZE] = this.size(s[LEFT]) + this.size(s[RIGHT]) + this.tail.size(s[VALUE]);
  },

  //  input: T, a node representing an AA tree that needs to be rebalanced.
  //  output: Another node representing the rebalanced AA tree.
  split: function(s) {
    if ( s && s[RIGHT] && s[RIGHT][RIGHT] && s[LEVEL] === s[RIGHT][RIGHT][LEVEL] ) {
      // We have two horizontal right links.  Take the middle node, elevate it, and return it.
      var r = this.maybeClone(s[RIGHT]);

      s[RIGHT] = r[LEFT];
      r[LEFT] = s;
      r[LEVEL]++;

      this.updateSize(s);
      this.updateSize(r);

      return r;
    }

    return s;
  },

  remove: function(s, value) {
    return this.removeKeyValue(s, this.prop.f(value), value);
  },

  removeKeyValue: function(s, key, value) {
    if ( ! s ) return s;

    s = this.maybeClone(s);

    var r = this.compare(s[KEY], key);

    if ( r === 0 ) {
      s[SIZE] -= this.tail.size(s[VALUE]);
      s[VALUE] = this.tail.remove(s[VALUE], value);

      // If the sub-Index still has values, then don't
      // delete this node.
      if ( s[VALUE] ) {
        s[SIZE] += this.tail.size(s[VALUE]);
        return s;
      }

      // If we're a leaf, easy, otherwise reduce to leaf case.
      if ( ! s[LEFT] && ! s[RIGHT] ) return undefined;

      var side = s[LEFT] ? LEFT : RIGHT;

      // TODO: it would be faster if successor and predecessor also deleted
      // the entry at the same time in order to prevent two traversals.
      // But, this would also duplicate the delete logic.
      var l = side === LEFT ?
        this.predecessor(s) :
        this.successor(s)   ;

      s[KEY] = l[KEY];
      s[VALUE] = l[VALUE];

      s[side] = this.removeNode(s[side], l[KEY]);
    } else {
      var side = r > 0 ? LEFT : RIGHT;

      s[SIZE] -= this.size(s[side]);
      s[side] = this.removeKeyValue(s[side], key, value);
      s[SIZE] += this.size(s[side]);
    }

    // Rebalance the tree. Decrease the level of all nodes in this level if
    // necessary, and then skew and split all nodes in the new level.
    s = this.skew(this.decreaseLevel(s));
    if ( s[RIGHT] ) {
      s[RIGHT] = this.skew(this.maybeClone(s[RIGHT]));
      if ( s[RIGHT][RIGHT] ) s[RIGHT][RIGHT] = this.skew(this.maybeClone(s[RIGHT][RIGHT]));
    }
    s = this.split(s);
    s[RIGHT] = this.split(this.maybeClone(s[RIGHT]));

    return s;
  },

  removeNode: function(s, key) {
    if ( ! s ) return s;

    s = this.maybeClone(s);

    var r = this.compare(s[KEY], key);

    if ( r === 0 ) return s[LEFT] ? s[LEFT] : s[RIGHT];

    var side = r > 0 ? LEFT : RIGHT;

    s[SIZE] -= this.size(s[side]);
    s[side] = this.removeNode(s[side], key);
    s[SIZE] += this.size(s[side]);

    return s;
  },

  predecessor: function(s) {
    if ( ! s[LEFT] ) return s;
    for ( s = s[LEFT] ; s[RIGHT] ; s = s[RIGHT] );
      return s;
  },

  successor: function(s) {
    if ( ! s[RIGHT] ) return s;
    for ( s = s[RIGHT] ; s[LEFT] ; s = s[LEFT] );
      return s;
  },

  // input: T, a tree for which we want to remove links that skip levels.
  // output: T with its level decreased.
  decreaseLevel: function(s) {
    var expectedLevel = Math.min(s[LEFT] ? s[LEFT][LEVEL] : 0, s[RIGHT] ? s[RIGHT][LEVEL] : 0) + 1;

    if ( expectedLevel < s[LEVEL] ) {
      s[LEVEL] = expectedLevel;
      if ( s[RIGHT] && expectedLevel < s[RIGHT][LEVEL] ) {
        s[RIGHT] = this.maybeClone(s[RIGHT]);
        s[RIGHT][LEVEL] = expectedLevel;
      }
    }

    return s;
  },

  get: function(s, key) {
    if ( ! s ) return undefined;

    var r = this.compare(s[KEY], key);

    if ( r === 0 ) return s[VALUE];

    return this.get(r > 0 ? s[LEFT] : s[RIGHT], key);
  },

  select: function(s, sink, options) {
    if ( ! s ) return;

    if ( options ) {
      if ( 'limit' in options && options.limit <= 0 ) return;

      var size = this.size(s);
      if ( options.skip >= size && ! options.query ) {
        options.skip -= size;
        return;
      }
    }

    this.select(s[LEFT], sink, options);
    this.tail.select(s[VALUE], sink, options);
    this.select(s[RIGHT], sink, options);
  },

  selectReverse: function(s, sink, options) {
    if ( ! s ) return;

    if ( options ) {
      if ( 'limit' in options && options.limit <= 0 ) return;

      var size = this.size(s);
      if ( options.skip >= size ) {
        options.skip -= size;
        return;
      }
    }

    this.selectReverse(s[RIGHT], sink, options);
    this.tail.selectReverse(s[VALUE], sink, options);
    this.selectReverse(s[LEFT], sink, options);
  },

  findPos: function(s, key, incl) {
    if ( ! s ) return 0;
    var r = this.compare(s[KEY], key);
    if ( r === 0 ) {
      return incl ?
        this.size(s[LEFT]) :
        this.size(s) - this.size(s[RIGHT]);
    }
    return r > 0 ?
      this.findPos(s[LEFT], key, incl) :
      this.findPos(s[RIGHT], key, incl) + this.size(s) - this.size(s[RIGHT]);
  },

  size: function(s) { return s ? s[SIZE] : 0; },

  compare: function(o1, o2) {
    return this.prop.compareProperty(o1, o2);
  },

  plan: function(s, sink, options) {
    var query = options && options.query;

    if ( query === FALSE ) return NOT_FOUND;

    if ( ! query && CountExpr.isInstance(sink) ) {
      var count = this.size(s);
      //        console.log('**************** COUNT SHORT-CIRCUIT ****************', count, this.toString());
      return {
        cost: 0,
        execute: function(unused, sink, options) { sink.count += count; return anop; },
        toString: function() { return 'short-circuit-count(' + count + ')'; }
      };
    }

//    if ( options && options.limit != null && options.skip != null && options.skip + options.limit > this.size(s) ) return NO_PLAN;

    var prop = this.prop;

    var isExprMatch = function(model) {
      if ( ! model ) return undefined;

      if ( query ) {

        if ( model.isInstance(query) && query.arg1 === prop ) {
          var arg2 = query.arg2;
          query = undefined;
          return arg2;
        }

        if ( AndExpr.isInstance(query) ) {
          for ( var i = 0 ; i < query.args.length ; i++ ) {
            var q = query.args[i];
            if ( model.isInstance(q) && q.arg1 === prop ) {
              query = query.clone();
              query.args[i] = TRUE;
              query = query.partialEval();
              if ( query === TRUE ) query = null;
              return q.arg2;
            }
          }
        }
      }

      return undefined;
    };

    // if ( sink.model_ === GroupByExpr && sink.arg1 === prop ) {
    // console.log('**************** GROUP-BY SHORT-CIRCUIT ****************');
    // TODO:
    // }

    var index = this;

    var arg2 = isExprMatch(GLOBAL.InExpr);
    if ( arg2 &&
         // Just scan if that would be faster.
         Math.log(this.size(s))/Math.log(2) * arg2.length < this.size(s) ) {
      var keys = arg2;
      var subPlans = [];
      var results  = [];
      var cost = 1;

      var newOptions = {};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = options.limit;
      if ( 'skip'  in options ) newOptions.skip  = options.skip;
      if ( 'order' in options ) newOptions.order = options.order;

      for ( var i = 0 ; i < keys.length ; i++) {
        var result = this.get(s, keys[i]);

        if ( result ) {
          var subPlan = this.tail.plan(result, sink, newOptions);

          cost += subPlan.cost;
          subPlans.push(subPlan);
          results.push(result);
        }
      }

      if ( subPlans.length == 0 ) return NOT_FOUND;

      return {
        cost: 1 + cost,
        execute: function(s2, sink, options) {
          var pars = [];
          for ( var i = 0 ; i < subPlans.length ; i++ ) {
            pars.push(subPlans[i].execute(results[i], sink, newOptions));
          }
          return apar.apply(null, pars);
        },
        toString: function() {
          return 'IN(key=' + prop.name + ', size=' + results.length + ')';
        }
      };
    }

    arg2 = isExprMatch(GLOBAL.EqExpr);
    if ( arg2 != undefined ) {
      var key = arg2.f();
      var result = this.get(s, key);

      if ( ! result ) return NOT_FOUND;

      //        var newOptions = {__proto__: options, query: query};
      var newOptions = {};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = options.limit;
      if ( 'skip' in options ) newOptions.skip = options.skip;
      if ( 'order' in options ) newOptions.order = options.order;

      var subPlan = this.tail.plan(result, sink, newOptions);

      return {
        cost: 1 + subPlan.cost,
        execute: function(s2, sink, options) {
          return subPlan.execute(result, sink, newOptions);
        },
        toString: function() {
          return 'lookup(key=' + prop.name + ', cost=' + this.cost + (query && query.toSQL ? ', query: ' + query.toSQL() : '') + ') ' + subPlan.toString();
        }
      };
    }

    arg2 = isExprMatch(GLOBAL.GtExpr);
    if ( arg2 != undefined ) {
      var key = arg2.f();
      var pos = this.findPos(s, key, false);
      var newOptions = {skip: ((options && options.skip) || 0) + pos};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = options.limit;
      if ( 'order' in options ) newOptions.order = options.order;
      options = newOptions;
    }

    arg2 = isExprMatch(GLOBAL.GteExpr);
    if ( arg2 != undefined ) {
      var key = arg2.f();
      var pos = this.findPos(s, key, true);
      var newOptions = {skip: ((options && options.skip) || 0) + pos};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = options.limit;
      if ( 'order' in options ) newOptions.order = options.order;
      options = newOptions;
    }

    arg2 = isExprMatch(GLOBAL.LtExpr);
    if ( arg2 != undefined ) {
      var key = arg2.f();
      var pos = this.findPos(s, key, true);
      var newOptions = {limit: (pos - (options && options.skip) || 0)};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = Math.min(options.limit, newOptions.limit);
      if ( 'skip' in options ) newOptions.skip = options.skip;
      if ( 'order' in options ) newOptions.order = options.order;
      options = newOptions;
    }

    arg2 = isExprMatch(GLOBAL.LteExpr);
    if ( arg2 != undefined ) {
      var key = arg2.f();
      var pos = this.findPos(s, key, false);
      var newOptions = {limit: (pos - (options && options.skip) || 0)};
      if ( query ) newOptions.query = query;
      if ( 'limit' in options ) newOptions.limit = Math.min(options.limit, newOptions.limit);
      if ( 'skip' in options ) newOptions.skip = options.skip;
      if ( 'order' in options ) newOptions.order = options.order;
      options = newOptions;
    }

    var cost = this.size(s);
    var sortRequired = false;
    var reverseSort = false;

    if ( options && options.order ) {
      if ( options.order === prop ) {
        // sort not required
      } else if ( GLOBAL.DescExpr && DescExpr.isInstance(options.order) && options.order.arg1 === prop ) {
        // reverse-sort, sort not required
        reverseSort = true;
      } else {
        sortRequired = true;
        if ( cost != 0 ) cost *= Math.log(cost) / Math.log(2);
      }
    }

    if ( options && ! sortRequired ) {
      if ( options.skip ) cost -= options.skip;
      if ( options.limit ) cost = Math.min(cost, options.limit);
    }

    return {
      cost: cost,
      execute: function() {
        /*
         var o = options && (options.skip || options.limit) ?
         {skip: options.skip || 0, limit: options.limit || Number.MAX_VALUE} :
         undefined;
         */
        if ( sortRequired ) {
          var a = [];
          index.selectCount++;
          index.select(s, a, {query: options.query});
          index.selectCount--;
          a.sort(toCompare(options.order));

          var skip = options.skip || 0;
          var limit = Number.isFinite(options.limit) ? options.limit : a.length;
          limit += skip;
          limit = Math.min(a.length, limit);

          for ( var i = skip; i < limit; i++ )
            sink.put(a[i]);
        } else {
// What did this do?  It appears to break sorting in saturn mail
/*          if ( reverseSort && options && options.skip )
            // TODO: temporary fix, should include range in select and selectReverse calls instead.
            options = {
              __proto__: options,
              skip: index.size(s) - options.skip - (options.limit || index.size(s)-options.skip)
            };*/
          index.selectCount++;
          reverseSort ?
            index.selectReverse(s, sink, options) :
            index.select(s, sink, options) ;
          index.selectCount--;
        }

        return anop;
      },
      toString: function() { return 'scan(key=' + prop.name + ', cost=' + this.cost + (query && query.toSQL ? ', query: ' + query.toSQL() : '') + ')'; }
    };
  },

  toString: function() {
    return 'TreeIndex(' + this.prop.name + ', ' + this.tail + ')';
  }

};


/** Case-Insensitive TreeIndex **/
var CITreeIndex = {
  __proto__: TreeIndex,

  create: function(prop, tail) {
    tail = tail || ValueIndex;

    return {
      __proto__: this,
      prop: prop,
      tail: tail
    };
  },

  put: function(s, newValue) {
    return this.putKeyValue(s, this.prop.f(newValue).toLowerCase(), newValue);
  },

  remove: function(s, value) {
    return this.removeKeyValue(s, this.prop.f(value).toLowerCase(), value);
  }

};


/** An Index for storing multi-valued properties. **/
var SetIndex = {
  __proto__: TreeIndex,

  create: function(prop, tail) {
    tail = tail || ValueIndex;

    return {
      __proto__: this,
      prop: prop,
      tail: tail
    };
  },

  // TODO: see if this can be done some other way
  dedup: function(obj, value) {
    // NOP, not safe to do here
  },

  put: function(s, newValue) {
    var a = this.prop.f(newValue);

    if ( a.length ) {
      for ( var i = 0 ; i < a.length ; i++ ) {
        s = this.putKeyValue(s, a[i], newValue);
      }
    } else {
      s = this.putKeyValue(s, '', newValue);
    }

    return s;
  },

  remove: function(s, value) {
    var a = this.prop.f(value);

    if ( a.length ) {
      for ( var i = 0 ; i < a.length ; i++ ) {
        s = this.removeKeyValue(s, a[i], value);
      }
    } else {
      s = this.removeKeyValue(s, '', value);
    }

    return s;
  }

};

var PositionQuery = {
  create: function(args) {
    return {
      __proto__: this,
      skip: args.skip,
      limit: args.limit,
      s: args.s
    };
  },
  reduce: function(other) {
    var otherFinish = other.skip + other.limit;
    var myFinish = this.skip + this.limit;

    if ( other.skip > myFinish ) return null;
    if ( other.skip >= this.skip ) {
      return PositionQuery.create({
        skip: this.skip,
        limit: Math.max(myFinish, otherFinish) - this.skip,
        s: this.s
      });
    }
    return other.reduce(this);
  },
  equals: function(other) {
    return this.skip === other.skip && this.limit === other.limit;
  }
};

var AutoPositionIndex = {
  create: function(factory, mdao, networkdao, maxage) {
    var obj = {
      __proto__: this,
      factory: factory,
      maxage: maxage,
      dao: mdao,
      networkdao: networkdao,
      sets: [],
      alt: AltIndex.create()
    };
    return obj;
  },

  put: function(s, value) { return this.alt.put(s, value); },
  remove: function(s, value) { return this.alt.remove(s, value); },

  bulkLoad: function(a) {
    return [];
  },

  addIndex: function(s, index) {
    return this;
  },

  addPosIndex: function(s, options) {
    var index = PositionIndex.create(
      options && options.order,
      options && options.query,
      this.factory,
      this.dao,
      this.networkdao,
      this.queue,
      this.maxage);

    this.alt.delegates.push(index);
    s.push(index.bulkLoad([]));
  },

  hasIndex: function(options) {
    for ( var i = 0; i < this.sets.length; i++ ) {
      var set = this.sets[i];
      if ( set[0].equals((options && options.query) || '') && set[1].equals((options && options.order) || '') ) return true;
    }
    return false;
  },

  plan: function(s, sink, options) {
    var subPlan = this.alt.plan(s, sink, options);

    if ( subPlan != NO_PLAN ) return subPlan;

    if ( ( options && options.skip != null && options.limit != null ) ||
         CountExpr.isInstance(sink) ) {
      if ( this.hasIndex(options) ) return NO_PLAN;
      this.sets.push([(options && options.query) || '', (options && options.order) || '']);
      this.addPosIndex(s, options);
      return this.alt.plan(s, sink, options);
    }
    return NO_PLAN;
  }
};

var PositionIndex = {
  create: function(order, query, factory, dao, networkdao, queue, maxage) {
    var obj = {
      __proto__: this,
      order: order || '',
      query: query || '',
      factory: factory,
      dao: dao,
      networkdao: networkdao.where(query).orderBy(order),
      maxage: maxage,
      queue: arequestqueue(function(ret, request) {
        var s = request.s;
        obj.networkdao
          .skip(request.skip)
          .limit(request.limit)
          .select()(function(objs) {
            var now = Date.now();
            for ( var i = 0; i < objs.length; i++ ) {
              s[request.skip + i] = {
                obj: objs[i].id,
                timestamp: now
              };
              s.feedback = objs[i].id;
              obj.dao.put(objs[i]);
              s.feedback = null;
            }
            ret();
          });
      }, undefined, 1)
    };
    return obj;
  },

  put: function(s, newValue) {
    if ( s.feedback === newValue.id ) return s;
    if ( this.query && ! this.query.f(newValue) ) return s;

    var compare = toCompare(this.order);

    for ( var i = 0; i < s.length; i++ ) {
      var entry = s[i]
      if ( ! entry ) continue;
      // TODO: This abuses the fact that find is synchronous.
      this.dao.find(entry.obj, { put: function(o) { entry = o; } });

      // Only happens when things are put into the dao from a select on this index.
      // otherwise objects are removed() first from the MDAO.
      if ( entry.id === newValue.id ) {
        break;
      }

      if ( compare(entry, newValue) > 0 ) {
        for ( var j = s.length; j > i; j-- ) {
          s[j] = s[j-1];
        }

        // If we have objects on both sides, put this one here.
        if ( i == 0 || s[i-1] ) s[i] = {
          obj: newValue.id,
          timestamp: Date.now()
        };
        break;
      }
    }
    return s;
  },

  remove: function(s, obj) {
    if ( s.feedback === obj.id ) return s;
    for ( var i = 0; i < s.length; i++ ) {
      if ( s[i] && s[i].obj === obj.id ) {
        for ( var j = i; j < s.length - 1; j++ ) {
          s[j] = s[j+1];
        }
        break;
      }
    }
    return s;
  },

  bulkLoad: function(a) { return []; },

  plan: function(s, sink, options) {
    var order = ( options && options.order ) || '';
    var query = ( options && options.query ) || '';
    var skip = options && options.skip;
    var limit = options && options.limit;

    var self = this;

    if ( ! order.equals(this.order) ||
         ! query.equals(this.query) ) return NO_PLAN;

    if ( CountExpr.isInstance(sink) ) {
      return {
        cost: 0,
        execute: function(s, sink, options) {
          if ( ! s.count ) {
            s.count = amemo(function(ret) {
              self.networkdao.select(COUNT())(function(c) {
                ret(c);
              });
            }, self.maxage);
          }

          return (function(ret, count) {
            sink.copyFrom(count);
            ret();
          }).ao(s.count);
        },
        toString: function() { return 'position-index(cost=' + this.cost + ', count)'; }
      }
    } else if ( skip == undefined || limit == undefined ) {
      return NO_PLAN;
    }

    var threshold = Date.now() - this.maxage;
    return {
      cost: 0,
      toString: function() { return 'position-index(cost=' + this.cost + ')'; },
      execute: function(s, sink, options) {
        var objs = [];

        var min;
        var max;

        for ( var i = 0 ; i < limit; i++ ) {
          var o = s[i + skip];
          if ( ! o || o.timestamp < threshold ) {
            if ( min == undefined ) min = i + skip;
            max = i + skip;
          }
          if ( o ) {
            // TODO: Works because find is actually synchronous.
            // this will need to fixed if find starts using an async function.
            self.dao.find(o.obj, { put: function(obj) { objs[i] = obj; } });
          } else {
            objs[i] = self.factory();
          }
          if ( ! objs[i] ) debugger;
        }

        if ( min != undefined ) {
          self.queue(PositionQuery.create({
            skip: min,
            limit: (max - min) + 1,
            s: s
          }));
        }


        for ( var i = 0; i < objs.length; i++ ) {
          sink.put(objs[i]);
        }

        return anop;
      }
    };
  }
};

var AltIndex = {
  // Maximum cost for a plan which is good enough to not bother looking at the rest.
  GOOD_ENOUGH_PLAN: 10, // put to 10 or more when not testing

  create: function() {
    return {
      __proto__: this,
      delegates: argsToArray(arguments)
    };
  },

  addIndex: function(s, index) {
    // Populate the index
    var a = [].sink;
    this.plan(s, a).execute(s, a);

    s.push(index.bulkLoad(a));
    this.delegates.push(index);

    return this;
  },

  bulkLoad: function(a) {
    for ( var i = 0 ; i < this.delegates.length ; i++ ) {
      this.root[i] = this.delegates[i].bulkLoad(a);
    }
  },

  get: function(s, key) {
    return this.delegates[0].get(s[0], key);
  },

  put: function(s, newValue) {
    s = s || [].sink;
    for ( var i = 0 ; i < this.delegates.length ; i++ ) {
      s[i] = this.delegates[i].put(s[i], newValue);
    }

    return s;
  },

  remove: function(s, obj) {
    s = s || [].sink;
    for ( var i = 0 ; i < this.delegates.length ; i++ ) {
      s[i] = this.delegates[i].remove(s[i], obj);
    }

    return s;
  },

  plan: function(s, sink, options) {
    var bestPlan;
    var bestPlanI = 0;
    //    console.log('Planning: ' + (options && options.query && options.query.toSQL && options.query.toSQL()));
    for ( var i = 0 ; i < this.delegates.length ; i++ ) {
      var plan = this.delegates[i].plan(s[i], sink, options);

      // console.log('  plan ' + i + ': ' + plan);
      if ( plan.cost <= AltIndex.GOOD_ENOUGH_PLAN ) {
        bestPlanI = i;
        bestPlan = plan;
        break;
      }

      if ( ! bestPlan || plan.cost < bestPlan.cost ) {
        bestPlanI = i;
        bestPlan = plan;
      }
    }

    //    console.log('Best Plan: ' + bestPlan);

    if ( bestPlan == undefined || bestPlan == NO_PLAN ) return NO_PLAN;

    return {
      __proto__: bestPlan,
      execute: function(unused, sink, options) { return bestPlan.execute(s[bestPlanI], sink, options); }
    };
  },

  size: function(obj) { return this.delegates[0].size(obj[0]); },

  toString: function() {
    return 'Alt(' + this.delegates.join(',') + ')';
  }
};


var mLangIndex = {
  create: function(mlang) {
    return {
      __proto__: this,
      mlang: mlang,
      PLAN: {
        cost: 0,
        execute: function(s, sink, options) { sink.copyFrom(s); return anop; },
        toString: function() { return 'mLangIndex(' + this.s + ')'; }
      }
    };
  },

  bulkLoad: function(a) {
    a.select(this.mlang);
    return this.mlang;
  },

  put: function(s, newValue) {
    // TODO: Should we clone s here?  That would be more
    // correct in terms of the purely functional interface
    // but maybe we can get away with it.
    s = s || this.mlang.clone();
    s.put(newValue);
    return s;
  },

  remove: function(s, obj) {
    // TODO: Should we clone s here?  That would be more
    // correct in terms of the purely functional interface
    // but maybe we can get away with it.
    s = s || this.mlang.clone();
    s.remove && s.remove(obj);
    return s;
  },

  size: function(s) { return Number.MAX_VALUE; },

  plan: function(s, sink, options) {
    // console.log('s');
    if ( options && options.query ) return NO_PLAN;

    if ( sink.model_ && sink.model_.isInstance(s) && s.arg1 === sink.arg1 ) {
      this.PLAN.s = s;
      return this.PLAN;
    }

    return NO_PLAN;
  },

  toString: function() {
    return 'mLangIndex(' + this.mlang + ')';
  }

};


/** An Index which adds other indices as needed. **/
var AutoIndex = {
  create: function(mdao) {
    return {
      __proto__: this,
      properties: { id: true },
      mdao: mdao
    };
  },

  put: function(s, newValue) { return s; },

  remove: function(s, obj) { return s; },

  bulkLoad: function(a) {
    return 'auto';
  },

  addIndex: function(prop) {
    if ( GLOBAL.DescExpr && DescExpr.isInstance(prop) ) prop = prop.arg1;

    console.log('Adding AutoIndex : ', prop.name);
    this.properties[prop.name] = true;
    this.mdao.addIndex(prop);
  },

  plan: function(s, sink, options) {
    if ( options ) {
      if ( options.order && Property.isInstance(options.order) && ! this.properties[options.order.name] ) {
        this.addIndex(options.order);
      } else if ( options.query ) {
        // TODO: check for property in query
      }
    }

    return NO_PLAN;
  },

  toString: function() { return 'AutoIndex()'; }
};


var MDAO = Model.create({
  extendsModel: 'AbstractDAO',

  name: 'MDAO',
  label: 'Indexed DAO',

  properties: [
    {
      name:  'model',
      type:  'Model',
      required: true
    },
    {
      model_: 'BooleanProperty',
      name: 'autoIndex',
      defaultValue: false
    }
  ],

  methods: {

    init: function() {
      this.SUPER();

      this.map = {};
      // TODO(kgr): this doesn't support multi-part keys, but should
      this.index = TreeIndex.create(this.model.getProperty(this.model.ids[0]));

      if ( this.autoIndex ) this.addRawIndex(AutoIndex.create(this));
    },

    /**
     * Add a non-unique index
     * args: one or more properties
     **/
    addIndex: function() {
      var props = argsToArray(arguments);

      // Add on the primary key(s) to make the index unique.
      for ( var i = 0 ; i < this.model.ids.length ; i++ ) {
        props.push(this.model.getProperty(this.model.ids[i]));
        if ( ! props[props.length - 1] ) throw "Undefined index property";
      }

      return this.addUniqueIndex.apply(this, props);
    },

    /**
     * Add a unique index
     * args: one or more properties
     **/
    addUniqueIndex: function() {
      var index = ValueIndex;

      for ( var i = arguments.length-1 ; i >= 0 ; i-- ) {
        var prop = arguments[i];
        // TODO: the index prototype should be in the property
        var proto = prop.type == 'Array[]' ? SetIndex : TreeIndex;
        index = proto.create(prop, index);
      }

      return this.addRawIndex(index);
    },

    // TODO: name 'addIndex' and renamed addIndex
    addRawIndex: function(index) {
      // Upgrade single Index to an AltIndex if required.
      if ( ! /*AltIndex.isInstance(this.index)*/ this.index.delegates ) {
        this.index = AltIndex.create(this.index);
        this.root = [this.root];
      }

      this.index.addIndex(this.root, index);

      return this;
    },

    /**
     * Bulk load data from another DAO.
     * Any data already loaded into this DAO will be lost.
     * @arg sink (optional) eof is called when loading is complete.
     **/
    bulkLoad: function(dao, sink) {
      var self = this;
      dao.select({ __proto__: [].sink, eof: function() {
        self.root = self.index.bulkLoad(this);
        sink && sink.eof && sink.eof();
      }});
    },

    put: function(obj, sink) {
      var oldValue = this.map[obj.id];
      if ( oldValue ) {
        this.root = this.index.put(this.index.remove(this.root, oldValue), obj);
        this.notify_('remove', [oldValue]);
      } else {
        this.root = this.index.put(this.root, obj);
      }
      this.map[obj.id] = obj;
      this.notify_('put', [obj]);
      sink && sink.put && sink.put(obj);
    },

    findObj_: function(key, sink) {
      var obj = this.map[key];
      // var obj = this.index.get(this.root, key);
      if ( obj ) {
        sink.put && sink.put(obj);
      } else {
        sink.error && sink.error('find', key);
      }
    },

    find: function(key, sink) {
      if ( key == undefined ) {
        sink && sink.error && sink.error('missing key');
        return;
      }
      if ( ! key.f ) { // TODO: make better test, use model
        this.findObj_(key, sink);
        return;
      }
      // How to handle multi value primary keys?
      var found = false;
      this.where(key).limit(1).select({
        // ???: Is 'put' needed?
        put: function(obj) {
          found = true;
          sink && sink.put && sink.put(obj);
        },
        eof: function() {
          if ( ! found ) sink && sink.error && sink.error('find', key);
        }
      });
    },

    remove: function(obj, sink) {
      if ( ! obj ) {
        sink && sink.error && sink.error('missing key');
        return;
      }
      var id = (obj.id !== undefined && obj.id !== '') ? obj.id : obj;
      var self = this;
      this.find(id, {
        put: function(obj) {
          self.root = self.index.remove(self.root, obj);
          delete self.map[obj.id];
          self.notify_('remove', [obj]);
          sink && sink.remove && sink.remove(obj);
        },
        error: function() {
          sink && sink.error && sink.error('remove', obj);
        }
      });
    },

    removeAll: function(sink, options) {
      if (!options) options = {};
      if (!options.query) options.query = TRUE;
      var future = afuture();
      this.where(options.query).select()(function(a) {
        for ( var i = 0 ; i < a.length ; i++ ) {
          this.root = this.index.remove(this.root, a[i]);
          delete this.map[a[i].id];
          this.notify_('remove', [a[i]]);
          sink && sink.remove && sink.remove(a[i]);
        }
        sink && sink.eof && sink.eof();
        future.set(sink);
      }.bind(this));
      return future.get;
    },

    select: function(sink, options) {
      sink = sink || [].sink;
      // Clone the options to prevent 'limit' from being mutated in the original.
      if ( options ) options = {__proto__: options};

      if ( GLOBAL.ExplainExpr && GLOBAL.ExplainExpr.isInstance(sink) ) {
        var plan = this.index.plan(this.root, sink.arg1, options);
        sink.plan = 'cost: ' + plan.cost + ', ' + plan.toString();
        sink && sink.eof && sink.eof();
        return aconstant(sink);
      }

      var plan = this.index.plan(this.root, sink, options);

      var future = afuture();
      plan.execute(this.root, sink, options)(
        function(ret) {
          sink && sink.eof && sink.eof();
          future.set(sink)
        });
      return future.get;
    },

    toString: function() {
      return 'MDAO(' + this.model.name + ',' + this.index + ')';
    }
  }
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Used when creating PersistentContext's.
 * Ex.
 * var persistentContext = PersistentContext.create({
 *  dao: IDBDAO.create({model: Binding}),
 *   predicate: NOT_TRANSIENT,
 *   context: GLOBAL
 *  });
 * ...
 * persistentContext.bindObject('userInfo', UserInfo, {});
 *
 * TODO: Make simpler to setup.
 **/
CLASS({
  name: 'Binding',

  documentation: function() {/*
      <p>Used when creating $$DOC{ref:'PersistentContext',usePlural:true}.</p>

      <p><code>var persistentContext = PersistentContext.create({<br/>
       dao: IDBDAO.create({model: Binding}),<br/>
        predicate: NOT_TRANSIENT,<br/>
        context: GLOBAL<br/>
       });<br/>
      ...<br/>
      persistentContext.bindObject('userInfo', UserInfo, {});<br/>
      </code></p>

    */},

  properties: [
    // TODO: add support for named sub-contexts
    {
      name:  'id',
      hidden: true
    },
    {
      name:  'value',
      hidden: true
    },
    {
      name: 'version',
      defaultValue: 1,
      hidden: true
    }
  ]
});


CLASS({
  name: 'PersistentContext',

  documentation: function() {/*
    <p>Persists a set of Objects. Despite the name, this has nothing to do with
    $$DOC{ref:'developerDocs.Context', text:'Contexts'}.</p>
  */},

  properties: [
    {
      name:  'dao',
      label: 'DAO',
      type: 'DAO',
      hidden: true
    },
    {
      name:  'context',
      hidden: true
    },
    {
      name: 'predicate',
      type: 'Expr',
      defaultValueFn: function() { return TRUE; },
      hidden: true
    }
  ],

  methods: {

    manage: function(name, obj, version) {
      var write = EventService.merged((function() {
        console.log('PersistentContext', 'updating', name);
        this.dao.put(this.Y.Binding.create({
          id:    name,
          value: JSONUtil.where(this.predicate).stringify(obj),
          version: version
        }));
      }).bind(this), undefined, this.Y);

      /*
       <p>Manage persistence for an object. Resave it in
       the DAO whenever it fires propertyChange events.</p>
       */
      obj.addListener(write);
      write();
    },
    bindObjects: function(a) {
      // TODO: implement
    },
    clearBinding: function(ret, name) {
      var self = this;
      self.dao.remove.ao(self.dao.find.bind(self.dao, name))(ret);
    },
    bindObject: function(name, factory, transientValues, version) {
      version = version || 1;
      console.log('PersistentContext', 'binding', name);
      var future = afuture();
      transientValues = transientValues || {};

      if ( this.context[name] ) {
        future.set(this.context[name]);
      } else {
        var newinit = (function() {
          console.log('PersistentContext', 'newInit', name);
          var obj = factory.create();
          obj.copyFrom(transientValues);
          this.context[name] = obj;
          this.manage(name, obj, version);
          future.set(obj);
        }).bind(this);

        this.dao.find(name, {
          put: function (binding) {
            if ( binding.version !== version ) {
              console.log('PersistentContext', 'verison mismatch', name);
              newinit();
              return;
            }
            console.log('PersistentContext', 'existingInit', name);
            //                  var obj = JSONUtil.parse(binding.value);
            //                  var obj = JSON.parse(binding.value);
            try {
              var json = JSON.parse(binding.value);
              var obj = JSONUtil.mapToObj(this.Y, json);
              obj.copyFrom(transientValues);
              this.context[name] = obj;
              this.manage(name, obj, version);
              future.set(obj);
            } catch(e) {
              console.log('PersistentContext', 'existingInit serialization error', name);
              newinit();
            }
          }.bind(this),
          error: newinit
        });
      }

      return future.get;
    }
  }
});


CLASS({
  name: 'UserInfo',
  label: 'UserInfo',

  properties: [
    {
      model_: 'StringProperty',
      name: 'email'
    }
  ]
});

/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function deferJsonP(X) {
  var future = afuture();
  X.ajsonp = function() {
    var args = arguments;
    return function(ret) {
      future.get(function(f) {
        f.apply(undefined, args)(ret);
      });
    };
  };

  return future;
}

// TODO: Register model for model, or fix the facade.

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var __DATA;
(function() {

  // If we're running a foam binary, i/e no ModelDAO, no need to hookup the
  // model dao.
  if ( ! window.FOAM_BOOT_DIR ) return;

  X.ModelDAO = X.foam.core.bootstrap.BrowserFileDAO.create();

  var path = document.location.pathname;
  path = path.substring(0, path.lastIndexOf('/'));

  var foamdir = new URL(window.FOAM_BOOT_DIR).pathname;
  foamdir = foamdir.substring(0, foamdir.lastIndexOf('/'));
  foamdir = foamdir.substring(0, foamdir.lastIndexOf('/'));

  // If this isn't FOAM's index.html
  // add an additional classpath for ./js/
  if ( foamdir === '' || path.indexOf(foamdir) == -1 ) {
    X.ModelDAO = X.foam.core.bootstrap.OrDAO.create({
      delegate: X.foam.core.bootstrap.BrowserFileDAO.create({
        rootPath: path + '/js/'
      }),
      primary: X.ModelDAO
    });
  }

  // Hookup ModelDAO callback as CLASS and __DATA global functions.
  var oldClass = CLASS;

  MODEL = CLASS = function(json) {
    json.model_ = 'Model';
    if ( document && document.currentScript )
      json.sourcePath = document.currentScript.src;

    if ( document && document.currentScript && document.currentScript.callback )
      document.currentScript.callback(json, oldClass);
    else
      oldClass(json);
  };
  __DATA = function(json) {
    if ( document && document.currentScript ) {
      json.sourcePath = document.currentScript.src;
      document.currentScript.callback &&
          document.currentScript.callback(json, oldClass);
    }
  };
})();
CLASS({"package": "com.todomvc","name": "Controller","traits": ["foam.ui.CSSLoaderTrait"],"requires": ["foam.ui.TextFieldView","foam.ui.DAOListView","foam.dao.EasyDAO","foam.memento.WindowHashValue","com.todomvc.Todo","com.todomvc.TodoDAO","com.todomvc.TodoFilterView"],"properties": [{"name": "input","view": {"factory_": "foam.ui.TextFieldView","placeholder": "What needs to be done?"},"setter": function (text) {
					// This is a fake property that adds the todo when its value gets saved.
					if (text) {
						this.dao.put(this.Todo.create({text: text}));
						this.propertyChange('input', text, '');
					}
				}},{"name": "dao"},{model_:"foam.core.types.DAOProperty","name": "filteredDAO","view": "foam.ui.DAOListView"},{model_:"IntProperty","name": "completedCount"},{model_:"IntProperty","name": "activeCount","postSet": function (_, c) { this.toggle = !c; }},{model_:"BooleanProperty","name": "toggle","postSet": function (_, n) {
				if (n === this.activeCount > 0) {
					this.dao.update(SET(this.Todo.COMPLETED, n));
				}
			}},{"name": "query","view": "com.todomvc.TodoFilterView","defaultValue": {model_:"TrueExpr"},"postSet": function (_, q) { this.filteredDAO = this.dao.where(q); }},{"name": "memento","factory": function () { return this.WindowHashValue.create(); }}],"actions": [{"name": "clear","label": "Clear completed","isEnabled": function () { return this.completedCount; },"action": function () { this.dao.where(this.Todo.COMPLETED).removeAll(); }}],"methods": [{"name": "init","code": function () {
				this.SUPER();
				this.filteredDAO = this.dao = this.TodoDAO.create({
					delegate: this.EasyDAO.create({model: this.Todo, seqNo: true, daoType: 'LOCAL', name: 'todos-foam'}) });
				this.dao.listen(this.onDAOUpdate);
				this.onDAOUpdate();
			}}],"listeners": [{"name": "onDAOUpdate","code": function () {
					this.dao.select(GROUP_BY(this.Todo.COMPLETED, COUNT()))(function (q) {
						this.completedCount = q.groups[true];
						this.activeCount = q.groups[false];
					}.bind(this));
				},"isFramed": true}],"templates": [{"name": "CSS","template": "\u000a\u0009\u0009\u0009\u0009#filters .selected { font-weight: bold; }\u000a\u0009\u0009\u0009\u0009#filters li { margin: 4px; }\u000a\u0009\u0009\u0009\u0009.actionButton-clear:disabled { display: none; }\u000a\u0009\u0009\u0009"},{"name": "toDetailHTML","template": "\u000a\u0009\u0009\u0009<section id=\"todoapp\">\u000a\u0009\u0009\u0009\u0009<header id=\"header\"><h1>todos</h1>$$input{id: 'new-todo'}</header>\u000a\u0009\u0009\u0009\u0009<section id=\"main\">\u000a\u0009\u0009\u0009\u0009\u0009$$toggle{id: 'toggle-all', showLabel: false}\u000a\u0009\u0009\u0009\u0009\u0009$$filteredDAO{tagName: 'ul', id: 'todo-list'}\u000a\u0009\u0009\u0009\u0009</section>\u000a\u0009\u0009\u0009\u0009<footer id=\"footer\">\u000a\u0009\u0009\u0009\u0009\u0009<span id=\"todo-count\">\u000a\u0009\u0009\u0009\u0009\u0009\u0009<strong>$$activeCount{mode: 'read-only'}</strong> item<%# this.data.activeCount == 1 ? '' : 's' %> left\u000a\u0009\u0009\u0009\u0009\u0009</span>\u000a\u0009\u0009\u0009\u0009\u0009$$query{id: 'filters'}\u000a\u0009\u0009\u0009\u0009\u0009$$clear{id: 'clear-completed'}\u000a\u0009\u0009\u0009\u0009</footer>\u000a\u0009\u0009\u0009</section>\u000a\u0009\u0009\u0009<footer id=\"info\">\u000a\u0009\u0009\u0009\u0009<p>Double-click to edit a todo</p>\u000a\u0009\u0009\u0009\u0009<p>Created by <a href=\"mailto:kgr@chromium.org\">Kevin Greer</a></p>\u000a\u0009\u0009\u0009\u0009<p>Part of <a href=\"http://todomvc.com\">TodoMVC</a></p>\u000a\u0009\u0009\u0009</footer>\u000a\u0009\u0009\u0009<%\u000a\u0009\u0009\u0009\u0009var f = function () { return this.completedCount + this.activeCount == 0; }.bind(this.data);\u000a\u0009\u0009\u0009\u0009this.setClass('hidden', f, 'main');\u000a\u0009\u0009\u0009\u0009this.setClass('hidden', f, 'footer');\u000a\u0009\u0009\u0009\u0009Events.relate(this.data.memento, this.queryView.text$,\u000a\u0009\u0009\u0009\u0009\u0009\u0009function (memento) {\u000a\u0009\u0009\u0009\u0009\u0009\u0009\u0009var s = memento && memento.substring(1);\u000a\u0009\u0009\u0009\u0009\u0009\u0009\u0009var t = s ? s.capitalize() : 'All';\u000a\u0009\u0009\u0009\u0009\u0009\u0009\u0009return t;\u000a\u0009\u0009\u0009\u0009\u0009\u0009},\u000a\u0009\u0009\u0009\u0009\u0009\u0009function (label) { return '/' + label.toLowerCase(); });\u000a\u0009\u0009\u0009\u0009this.addInitializer(function () {\u000a\u0009\u0009\u0009\u0009\u0009X.$('new-todo').focus();\u000a\u0009\u0009\u0009\u0009});\u000a\u0009\u0009\u0009%>\u000a\u0009\u0009\u0009"}]})
CLASS({"package": "foam.ui","name": "TextFieldView","label": "Text Field","extendsModel": "foam.ui.SimpleView","requires": ["foam.ui.AutocompleteView"],"properties": [{model_:"StringProperty","name": "name","defaultValue": "field"},{model_:"IntProperty","name": "displayWidth","defaultValue": 30},{model_:"IntProperty","name": "displayHeight","defaultValue": 1},{model_:"StringProperty","name": "type","defaultValue": "text"},{model_:"StringProperty","name": "placeholder","defaultValue": ""},{model_:"BooleanProperty","name": "onKeyMode","getter": function () {
        return this.updateMode === this.EACH_KEYSTROKE;
      },"setter": function (nu) {
        this.updateMode = nu ? this.EACH_KEYSTROKE : this.DONE_EDITING;
      },"help": "If true, value is updated on each keystroke."},{model_:"foam.core.types.StringEnumProperty","name": "updateMode","defaultValue": "DONE_EDITING","help": "Controls when the real .data is updated: on every keystroke, when the user presses enter or blurs the box, or on enter only.","choices": [["DONE_EDITING","Done editing"],["EACH_KEYSTROKE","Every keystroke"],["ENTER_ONLY","Enter only"]]},{model_:"BooleanProperty","name": "escapeHTML","help": "If true, HTML content is escaped in display mode.","defaultValue": true},{model_:"StringProperty","name": "mode","defaultValue": "read-write","view": {"factory_": "foam.ui.ChoiceView","choices": ["read-only","read-write","final"]}},{model_:"BooleanProperty","name": "required"},{model_:"StringProperty","name": "pattern"},{"name": "domValue","hidden": true},{"name": "data"},{model_:"StringProperty","name": "readWriteTagName","hidden": true,"defaultValueFn": function () {
        return this.displayHeight === 1 ? 'input' : 'textarea';
      }},{model_:"BooleanProperty","name": "autocomplete","defaultValue": true},{"name": "autocompleter"},{"name": "autocompleteView"}],"constants": [{"name": "ESCAPE","value": ["escape"]},{"name": "DONE_EDITING","value": "DONE_EDITING"},{"name": "EACH_KEYSTROKE","value": "EACH_KEYSTROKE"},{"name": "ENTER_ONLY","value": "ENTER_ONLY"}],"methods": [{"name": "toHTML","code": function () {
      /* Selects read-only versus read-write DOM output */
      return this.mode === 'read-write' ?
        this.toReadWriteHTML() :
        this.toReadOnlyHTML()  ;
    }},{"name": "toReadWriteHTML","code": function () {
      /* Supplies the correct element for read-write mode */
      var str = '<' + this.readWriteTagName + ' id="' + this.id + '"';
      str += ' type="' + this.type + '" ' + this.cssClassAttr();

      this.on('click', this.onClick, this.id);

      str += this.readWriteTagName === 'input' ?
        ' size="' + this.displayWidth + '"' :
        ' rows="' + this.displayHeight + '" cols="' + this.displayWidth + '"';

      if ( this.required ) str += ' required';
      if ( this.pattern  ) str += ' pattern="' + this.pattern + '"';

      str += this.extraAttributes();

      str += ' name="' + this.name + '">';
      str += '</' + this.readWriteTagName + '>';
      return str;
    }},{"name": "extraAttributes","code": function () { return ''; }},{"name": "toReadOnlyHTML","code": function () {
      /* Supplies the correct element for read-only mode */
      var self = this;
      this.setClass('placeholder', function() { return self.data === ''; }, this.id);

      return this.displayHeight === 1 ?
        '<' + this.tagName + ' id="' + this.id + '"' + this.cssClassAttr() + ' name="' + this.name + '"></' + this.tagName + '>' :
        '<textarea readonly id="' + this.id + '"' + this.cssClassAttr() + ' name="' + this.name + '" rows="' + this.displayHeight + '" cols="' + this.displayWidth + '"></textarea>' ;
    }},{"name": "setupAutocomplete","code": function () {
      /* Initializes autocomplete, if $$DOC{ref:'.autocomplete'} and
        $$DOC{ref:'.autocompleter'} are set. */
      if ( ! this.autocomplete || ! this.autocompleter ) return;

      var view = this.autocompleteView = this.AutocompleteView.create({
        autocompleter: this.autocompleter,
        target: this
      });

      this.bindAutocompleteEvents(view);
    }},{"name": "onAutocomplete","code": function (data) {
      this.data = data;
    }},{"name": "bindAutocompleteEvents","code": function (view) {
      this.$.addEventListener('blur', function() {
        // Notify the autocomplete view of a blur, it can decide what to do from there.
        view.publish('blur');
      });
      this.$.addEventListener('input', (function() {
        view.autocomplete(this.textToValue(this.$.value));
      }).bind(this));
      this.$.addEventListener('focus', (function() {
        view.autocomplete(this.textToValue(this.$.value));
      }).bind(this));
    }},{"name": "initHTML","code": function () {
      if ( ! this.$ ) return;

      this.SUPER();

      if ( this.mode === 'read-write' ) {
        if ( this.placeholder ) this.$.placeholder = this.placeholder;

        if ( this.updateMode === this.EACH_KEYSTROKE ) {
          this.domValue = DomValue.create(this.$, 'input');
        } else if ( this.updateMode === this.DONE_EDITING ) {
          this.domValue = DomValue.create(this.$, 'change');
        } else {
          this.domValue = this.OnEnterValue.create({ element: this.$ });
        }

        // In KeyMode we disable feedback to avoid updating the field
        // while the user is still typing.  Then we update the view
        // once they leave(blur) the field.
        Events.relate(
          this.data$,
          this.domValue,
          this.valueToText.bind(this),
          this.textToValue.bind(this),
          this.updateMode === this.EACH_KEYSTROKE);

        if ( this.updateMode === this.EACH_KEYSTROKE )
          this.$.addEventListener('blur', this.onBlur);

        this.$.addEventListener('keydown', this.onKeyDown);

        this.setupAutocomplete();
      } else {
        this.domValue = DomValue.create(
          this.$,
          'undefined',
          this.escapeHTML ? 'textContent' : 'innerHTML');

        Events.map(
          this.data$,
          this.domValue,
          this.valueToText.bind(this))
      }
    }},{"name": "textToValue","code": function (text) { /* Passthrough */ return text; }},{"name": "valueToText","code": function (value) { /* Filters for read-only mode */
      if ( this.mode === 'read-only' )
        return (value === '') ? this.placeholder : value;
      return value;
    }},{"name": "destroy","code": function ( isParentDestroyed ) { /* Unlinks key handler. */
      this.SUPER(isParentDestroyed);
      Events.unlink(this.domValue, this.data$);
    }}],"listeners": [{"name": "onKeyDown","code": function (e) {
        if ( e.keyCode == 27 /* ESCAPE KEY */ ) {
          this.domValue.set(this.data);
          this.publish(this.ESCAPE);
        } else {
          this.publish(['keydown'], e);
        }
      }},{"name": "onBlur","code": function (e) {
        if ( this.domValue.get() !== this.data )
          this.domValue.set(this.data);
      }},{"name": "onClick","code": function (e) { this.$ && this.$.focus(); }}],"models": [{"name": "OnEnterValue","properties": [{"name": "element"},{"name": "listeners","factory": function () {
            return [];
          }}],"methods": [{"name": "get","code": function get() { return this.element.value; }},{"name": "set","code": function set(value) {
          if ( this.get() !== value ) this.element.value = value;
        }},{"name": "addListener","code": function addListener(listener) {
          if ( ! listener ) return;
          if ( this.listeners.length === 0 )
            this.element.addEventListener('keydown', this.onKeyDown);
          this.listeners.push(listener);
        }},{"name": "removeListener","code": function removeListener(listener) {
          var index = this.listeners.indexOf(listener);
          if ( index >= 0 ) this.listeners.splice(i, 1);
        }},{"name": "fireListeners","code": function fireListeners(e) {
          for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](e);
          }
        }}],"listeners": [{"name": "onKeyDown","code": function (e) {
            if ( e.keyCode === 13 ) {
              this.fireListeners(e);
            }
          }}]}]})
CLASS({"package": "foam.ui","name": "AutocompleteView","extendsModel": "foam.ui.PopupView","properties": [{"name": "closeTimeout"},{"name": "autocompleter"},{"name": "completer"},{"name": "current"},{model_:"IntProperty","name": "closeTime","units": "ms","help": "Time to delay the actual close on a .close call.","defaultValue": 200},{"name": "view","postSet": function (prev, v) {
        if ( prev ) {
          prev.data$.removeListener(this.complete);
          prev.choices$.removeListener(this.choicesUpdate);
        }

        v.data$.addListener(this.complete);
        v.choices$.addListener(this.choicesUpdate);
      }},{"name": "target","postSet": function (prev, v) {
        prev && prev.unsubscribe(['keydown'], this.onKeyDown);
        v.subscribe(['keydown'], this.onKeyDown);
      }},{"name": "maxHeight","defaultValue": 400},{"name": "className","defaultValue": "autocompletePopup"}],"methods": [{"name": "autocomplete","code": function (partial) {
      if ( ! this.completer ) {
        var proto = this.X.lookup(this.autocompleter);
        this.completer = proto.create(null, this.Y);
      }
      if ( ! this.view ) {
        this.view = this.makeView();
      }

      this.current = partial;
      this.open(this.target);
      this.completer.autocomplete(partial);
    }},{"name": "makeView","code": function () {
      return this.X.ChoiceListView.create({
        dao: this.completer.autocompleteDao$Proxy,
        extraClassName: 'autocomplete',
        orientation: 'vertical',
        mode: 'final',
        objToChoice: this.completer.f,
        useSelection: true
      }, this.Y);
    }},{"name": "init","code": function (args) {
      this.SUPER(args);
      this.subscribe('blur', (function() {
        this.close();
      }).bind(this));
    }},{"name": "open","code": function (e, opt_delay) {
      if ( this.closeTimeout ) {
        this.X.clearTimeout(this.closeTimeout);
        this.closeTimeout = 0;
      }

      if ( this.$ ) { this.position(this.$.firstElementChild, e.$ || e); return; }

      var parentNode = e.$ || e;
      var document = parentNode.ownerDocument;

      console.assert( this.X.document === document, 'X.document is not global document');

      var div    = document.createElement('div');
      var window = document.defaultView;

      console.assert( this.X.window === window, 'X.window is not global window');

      parentNode.insertAdjacentHTML('afterend', this.toHTML().trim());

      this.position(this.$.firstElementChild, parentNode);
      this.initHTML();
    }},{"name": "close","code": function (opt_now) {
      if ( opt_now ) {
        if ( this.closeTimeout ) {
          this.X.clearTimeout(this.closeTimeout);
          this.closeTimeout = 0;
        }
        this.SUPER();
        return;
      }

      if ( this.closeTimeout ) return;

      var realClose = this.SUPER;
      var self = this;
      this.closeTimeout = this.X.setTimeout(function() {
        self.closeTimeout = 0;
        realClose.call(self);
      }, this.closeTime);
    }},{"name": "position","code": function (div, parentNode) {
      var document = parentNode.ownerDocument;

      var pos = findPageXY(parentNode);
      var pageWH = [document.firstElementChild.offsetWidth, document.firstElementChild.offsetHeight];

      if ( pageWH[1] - (pos[1] + parentNode.offsetHeight) < (this.height || this.maxHeight || 400) ) {
        div.style.bottom = parentNode.offsetHeight;
        document.defaultView.innerHeight - pos[1];
      }

      if ( pos[2].offsetWidth - pos[0] < 600 )
        div.style.left = 600 - pos[2].offsetWidth;
      else
        div.style.left = -parentNode.offsetWidth;

      if ( this.width ) div.style.width = this.width + 'px';
      if ( this.height ) div.style.height = this.height + 'px';
      if ( this.maxWidth ) {
        div.style.maxWidth = this.maxWidth + 'px';
        div.style.overflowX = 'auto';
      }
      if ( this.maxHeight ) {
        div.style.maxHeight = this.maxHeight + 'px';
        div.style.overflowY = 'auto';
      }
    }}],"listeners": [{"name": "onKeyDown","code": function (_,_,e) {
        if ( ! this.view ) return;

        if ( e.keyCode === 38 /* arrow up */ ) {
          this.view.index--;
          this.view.scrollToSelection(this.$);
          e.preventDefault();
        } else if ( e.keyCode  === 40 /* arrow down */ ) {
          this.view.index++;
          this.view.scrollToSelection(this.$);
          e.preventDefault();
        } else if ( e.keyCode  === 13 /* enter */ ) {
          this.view.commit();
          e.preventDefault();
        }
      }},{"name": "complete","code": function () {
        this.target.onAutocomplete(this.view.data);
        this.view = this.makeView();
        this.close(true);
      }},{"name": "choicesUpdate","code": function () {
        if ( this.view &&
             ( this.view.choices.length === 0 ||
               ( this.view.choices.length === 1 &&
                 this.view.choices[0][1] === this.current ) ) ) {
          this.close(true);
        }
      }}],"templates": [{"name": "toHTML","template": "\u000a  <span id=\"<%= this.id %>\" style=\"position:relative\"><div <%= this.cssClassAttr() %> style=\"position:absolute\"><%= this.view %></div></span>\u000a    "}],"help": "Default autocomplete popup."})
CLASS({"package": "foam.ui","name": "PopupView","extendsModel": "foam.ui.SimpleView","properties": [{"name": "view","type": "foam.ui.View"},{"name": "x"},{"name": "y"},{"name": "width","defaultValue": ""},{"name": "maxWidth","defaultValue": ""},{"name": "maxHeight","defaultValue": ""},{"name": "height","defaultValue": ""}],"methods": [{"name": "open","code": function (_, opt_delay) {
      if ( this.$ ) return;
      var document = this.X.document;
      var div      = document.createElement('div');
      div.style.left = this.x + 'px';
      div.style.top = this.y + 'px';
      if ( this.width )     div.style.width = this.width + 'px';
      if ( this.height )    div.style.height = this.height + 'px';
      if ( this.maxWidth )  div.style.maxWidth = this.maxWidth + 'px';
      if ( this.maxHeight ) div.style.maxHeight = this.maxHeight + 'px';
      div.style.position = 'absolute';
      div.id = this.id;
      div.innerHTML = this.view.toHTML();

      document.body.appendChild(div);
      this.view.initHTML();
    }},{"name": "close","code": function () {
      this.$ && this.$.remove();
    }},{"name": "destroy","code": function ( isParentDestroyed ) {
      this.SUPER(isParentDestroyed);
      this.close();
      this.view.destroy();
    }}]})
CLASS({"package": "foam.ui","name": "SimpleView","extendsModel": "foam.ui.BaseView","traits": ["foam.ui.HTMLViewTrait"],"requires": ["Property"],"exports": ["propertyViewProperty"],"properties": [{"name": "propertyViewProperty","type": "Property","defaultValueFn": function () { return this.Property.DETAIL_VIEW; }}]})
CLASS({"package": "foam.ui","name": "HTMLViewTrait","label": "HTMLView","requires": ["foam.input.touch.GestureTarget","foam.ui.ActionBorder","foam.ui.PropertyView","foam.ui.AsyncLoadingView"],"properties": [{"name": "id","label": "Element ID","type": "String","factory": function () { return this.instance_.id || this.nextID(); }},{model_:"foam.core.types.DocumentInstallProperty","name": "installCSS","documentInstallFn": function (X) {
        for ( var i = 0 ; i < this.model_.templates.length ; i++ ) {
          var t = this.model_.templates[i];
          if ( t.name === 'CSS' ) {
            t.futureTemplate(function() {
              X.addStyle(this.CSS());
            }.bind(this));
            return;
          }
        }
      }},{"name": "shortcuts","type": "Array[Shortcut]","factory": function () { return []; }},{"name": "$","mode": "read-only","hidden": true,"getter": function () { return this.X.document.getElementById(this.id); },"setter": function () { debugger; },"help": "DOM Element."},{"name": "tagName","defaultValue": "span"},{"name": "className","defaultValue": "","help": "CSS class name(s), space separated."},{"name": "tooltip"},{"name": "tabIndex"},{"name": "extraClassName","defaultValue": ""},{"name": "propertyViewProperty","type": "Property","defaultValueFn": function () { return this.X.Property.VIEW; }},{"name": "initializers_","factory": function () { return []; }},{"name": "destructors_","factory": function () { return []; }},{model_:"BooleanProperty","name": "showActions","postSet": function (oldValue, showActions) {
        // TODO: No way to remove the decorator.
        if ( ! oldValue && showActions ) {
          this.addDecorator(this.ActionBorder.create());
        }
      },"defaultValue": false},{"name": "minWidth","defaultValue": 300},{"name": "minHeight","defaultValue": 40},{"name": "preferredWidth","defaultValue": 400},{"name": "preferredHeight","defaultValue": 40},{"name": "maxWidth","defaultValue": 10000},{"name": "maxHeight","defaultValue": 40}],"constants": [{"name": "KEYPRESS_CODES","value": {"8": true,"33": true,"34": true,"37": true,"38": true,"39": true,"40": true}},{"name": "ON_HIDE","value": ["onHide"]},{"name": "ON_SHOW","value": ["onShow"]}],"methods": [{"name": "strToHTML","code": function (str) {
      /*
        Escape the string to make it HTML safe.
        */
      return XMLUtil.escape(str.toString())
    }},{"name": "cssClassAttr","code": function () {
      /*
        Returns the full CSS class to use for the $$DOC{ref:'foam.ui.View'} DOM element.
       */
      if ( ! this.className && ! this.extraClassName ) return '';

      var s = ' class="';
      if ( this.className ) {
        s += this.className
        if ( this.extraClassName ) s += ' ';
      }
      if ( this.extraClassName ) s += this.extraClassName;

      return s + '"';
    }},{"name": "bindSubView","code": function (view, prop) {
      /*
        Bind a sub-$$DOC{ref:'foam.ui.View'} to a $$DOC{ref:'Property'} of this.
       */
      view.setValue(this.propertyValue(prop.name));
    }},{"name": "focus","code": function () {
      /* Cause the view to take focus. */
      if ( this.$ && this.$.focus ) this.$.focus();
    }},{"name": "addChild","code": function (child) {
      /*
        Maintains the tree structure of $$DOC{ref:'foam.ui.View',usePlural:true}. When
        a sub-$$DOC{ref:'foam.ui.View'} is created, add it to the tree with this method.
      */
      // Checked needed for legacy CViews, remove once they're gone.
      if ( child.toView_ ) child = child.toView_();
      // Check prevents duplicate addChild() calls,
      // which can happen when you use creatView() to create a sub-view (and it calls addChild)
      // and then you write the View using TemplateOutput (which also calls addChild).
      // That should all be cleaned up and all outputHTML() methods should use TemplateOutput.
      if ( this.children.indexOf(child) != -1 ) return;

      return this.SUPER(child);
    }},{"name": "addShortcut","code": function (key, callback, context) {
      /* Add a keyboard shortcut. */
      this.shortcuts.push([key, callback, context]);
    }},{"name": "nextID","code": function () {
      /* Convenience method to return unique DOM element ids. */
      return "view" + (arguments.callee._nextId = (arguments.callee._nextId || 0) + 1);
    }},{"name": "addInitializer","code": function (f) {
      /* Adds a DOM initializer */
      this.initializers_.push(f);
    }},{"name": "addDestructor","code": function (f) {
      /* Adds a DOM destructor. */
      this.destructors_.push(f);
    }},{"name": "tapClick","code": function () {
    }},{"name": "resize","code": function () {
      /* Call when you've changed your size to allow for the possibility of relayout. */
      var e = this.X.document.createEvent('Event');
      e.initEvent('resize', true, true);
      if ( this.$ ) this.X.window.getComputedStyle(this.$);
      this.X.window.dispatchEvent(e);
    }},{"name": "on","code": function (event, listener, opt_id) {
      /*
        <p>To create DOM event handlers, use this method to set up your listener:</p>
        <p><code>this.on('click', this.myListener);</code></p>
      */
      opt_id = opt_id || this.nextID();
      listener = listener.bind(this);

      if ( event === 'click' && this.X.gestureManager ) {
        var self = this;
        var manager = this.X.gestureManager;
        var target = this.GestureTarget.create({
          containerID: opt_id,
          handler: {
            tapClick: function(pointMap) {
              // Create a fake event.
              return listener({
                preventDefault: function() { },
                stopPropagation: function() { },
                pointMap: pointMap
              });
            }
          },
          gesture: 'tap'
        });

        manager.install(target);
        this.addDestructor(function() {
          manager.uninstall(target);
        });
        return opt_id;
      }

      this.addInitializer(function() {
        var e = this.X.$(opt_id);
        // if ( ! e ) console.log('Error Missing element for id: ' + opt_id + ' on event ' + event);
        if ( e ) e.addEventListener(event, listener, false);
      }.bind(this));

      return opt_id;
    }},{"name": "setAttribute","code": function (attributeName, valueFn, opt_id) {
      /* Set a dynamic attribute on the DOM element. */
      opt_id = opt_id || this.nextID();
      valueFn = valueFn.bind(this);
      this.addInitializer(function() {
        this.X.dynamic(valueFn, function() {
          var e = this.X.$(opt_id);
          if ( ! e ) throw EventService.UNSUBSCRIBE_EXCEPTION;
          var newValue = valueFn(e.getAttribute(attributeName));
          if ( newValue == undefined ) e.removeAttribute(attributeName);
          else e.setAttribute(attributeName, newValue);
        }.bind(this))
      }.bind(this));
    }},{"name": "setClass","code": function (className, predicate, opt_id) {
      /* Set a dynamic CSS class on the DOM element. */
      opt_id = opt_id || this.nextID();
      predicate = predicate.bind(this);

      this.addInitializer(function() {
        this.addDestructor(
          this.X.dynamic(
            predicate,
            function() {
              var e = this.X.$(opt_id);
              if ( ! e ) throw EventService.UNSUBSCRIBE_EXCEPTION;
              DOM.setClass(e, className, predicate());
            }.bind(this)
          ).destroy
        );
      }.bind(this));

      return opt_id;
    }},{"name": "setClasses","code": function (map, opt_id) {
      /* Set a map of dynamic CSS classes on the DOM element. Mapped as
         className: predicate.*/
      opt_id = opt_id || this.nextID();
      var keys = Objects.keys(map);
      for ( var i = 0 ; i < keys.length ; i++ ) {
        this.setClass(keys[i], map[keys[i]], opt_id);
      }

      return opt_id;
    }},{"name": "insertInElement","code": function (name) {
      /* Insert this View's toHTML into the Element of the supplied name. */
      var e = this.X.$(name);
      e.innerHTML = this.toHTML();
      this.initHTML();
    }},{"name": "write","code": function (document) {
      /*  Write the View's HTML to the provided document and then initialize. */
      var html = this.toHTML();
      document.body.insertAdjacentHTML('beforeend', html);
      this.initHTML();
    }},{"name": "updateHTML","code": function () {
      /* Cause the HTML content to be recreated using a call to
        $$DOC{ref:'.toInnerHTML'}. */
      if ( ! this.$ ) return;

      this.destroy();
      this.construct();
    }},{"name": "construct","code": function () { /* rebuilds the children of the view */
      this.SUPER();
      this.generateContent();
    }},{"name": "generateContent","code": function () {
      /* by default, uses toInnerHTML() to generate content. Override to do something else. */
      if ( ! this.$ ) return;
      this.$.innerHTML = this.toInnerHTML();
      this.initInnerHTML();
    }},{"name": "toInnerHTML","code": function () {
      /* <p>In most cases you can override this method to provide all of your HTML
        content. Calling $$DOC{ref:'.updateHTML'} will cause this method to
        be called again, regenerating your content. $$DOC{ref:'Template',usePlural:true}
        are usually called from here, or you may create a
        $$DOC{ref:'.toInnerHTML'} $$DOC{ref:'Template'}.</p>
        <p>If you are generating your content here, you may also need to override
        $$DOC{ref:'.initInnerHTML'} to create event handlers such as
        <code>this.on('click')</code>. */
      return '';
    }},{"name": "toHTML","code": function () {
      /* Generates the complete HTML content of this view, including outermost
        element. This element is managed by $$DOC{ref:'foam.ui.View'}, so in most cases
        you should use $$DOC{ref:'.toInnerHTML'} to generate your content. */
      this.invokeDestructors();
      return '<' + this.tagName + ' id="' + this.id + '"' + this.cssClassAttr() + '>' +
        this.toInnerHTML() +
        '</' + this.tagName + '>';
    }},{"name": "initHTML","code": function () {
      /* This must be called once after your HTML content has been inserted into
        the DOM. Calling $$DOC{ref:'.updateHTML'} will automatically call
        $$DOC{ref:'.initHTML'}. */
      this.initInnerHTML();
      this.initKeyboardShortcuts();
      this.maybeInitTooltip();
    }},{"name": "maybeInitTooltip","code": function () {
      if ( ! this.tooltip || ! this.$ ) return;
      this.$.addEventListener('mouseenter', this.openTooltip);
      this.$.addEventListener('mouseleave', this.closeTooltip);
    }},{"name": "initInnerHTML","code": function () {
      /* Initialize this View and all of it's children. Usually just call
         $$DOC{ref:'.initHTML'} instead. When implementing a new $$DOC{ref:'foam.ui.View'}
         and adding listeners (including <code>this.on('click')</code>) that
         will be destroyed each time $$DOC{ref:'.toInnerHTML'} is called, you
         will have to override this $$DOC{ref:'Method'} and add them here.
       */
      // This mostly involves attaching listeners.
      // Must be called activate a view after it has been added to the DOM.

      this.invokeInitializers();
      this.initChildren();
    }},{"name": "initChildren","code": function () {
      /* Initialize all of the children. Usually just call
          $$DOC{ref:'.initHTML'} instead. */
      if ( this.children ) {
        // init children
        for ( var i = 0 ; i < this.children.length ; i++ ) {
          // console.log(i, 'init child: ' + this.children[i]);
          try {
            this.children[i].initHTML && this.children[i].initHTML();
          } catch (x) {
            console.log('Error on View.child.initHTML', x, x.stack);
          }
        }
      }
    }},{"name": "invokeInitializers","code": function () {
      /* Calls all the DOM $$DOC{ref:'.initializers_'}. */
      for ( var i = 0 ; i < this.initializers_.length ; i++ ) this.initializers_[i]();
      this.initializers_ = [];
    }},{"name": "invokeDestructors","code": function () {
      /* Calls all the DOM $$DOC{ref:'.destructors_'}. */
      for ( var i = 0; i < this.destructors_.length; i++ ) this.destructors_[i]();
      this.destructors_ = [];
    }},{"name": "evtToCharCode","code": function (evt) {
      /* Maps an event keycode to a string */
      var s = '';
      if ( evt.altKey   ) s += 'alt-';
      if ( evt.ctrlKey  ) s += 'ctrl-';
      if ( evt.shiftKey && evt.type === 'keydown' ) s += 'shift-';
      if ( evt.metaKey  ) s += 'meta-';
      s += String.fromCharCode(evt.type === 'keydown' ? evt.which : evt.charCode);
      return s;
    }},{"name": "initKeyboardShortcuts","code": function () {
      /* Initializes keyboard shortcuts. */
      var keyMap = {};
      var found  = false;
      var self   = this;

      function init(actions, opt_value) {
        actions.forEach(function(action) {
          for ( var j = 0 ; j < action.keyboardShortcuts.length ; j++ ) {
            var key = action.keyboardShortcuts[j];
            // Treat single character strings as a character to be recognized
            if ( typeof key === 'number' ) key = String.fromCharCode(key);
            keyMap[key] = opt_value ?
              function() { action.maybeCall(self.X, opt_value.get()); } :
              action.maybeCall.bind(action, self.X, self) ;
            found = true;
          }
        });
      }

      init(this.model_.actions);

      if ( this.data && this.data.model_ && this.data.model_.actions.length )
        init(this.data.model_.actions, this.data$);

      if ( found ) {
        // console.log('initKeyboardShortcuts ', this.name_, this.data && this.data.model_ && this.data.model_.name );
        console.assert(this.$, 'View must define outer id when using keyboard shortcuts: ' + this.name_);
        this.keyMap_ = keyMap;
        this.$.parentElement.addEventListener('keydown',  this.onKeyboardShortcut);
        this.$.parentElement.addEventListener('keypress', this.onKeyboardShortcut);
      }
    }},{"name": "destroy","code": function ( isParentDestroyed ) {
      /* Cleans up the DOM when regenerating content. You should call this before
         creating new HTML in your $$DOC{ref:'.toInnerHTML'} or $$DOC{ref:'.toHTML'}. */
      // TODO: remove listeners
      this.invokeDestructors();

      this.SUPER(isParentDestroyed);

      delete this.instance_.$;
    }},{"name": "close","code": function () {
      /* Call when permanently closing the $$DOC{ref:'foam.ui.View'}. */
      this.$ && this.$.remove();
      this.destroy();
      this.publish('closed');
    }},{"name": "rectOnPage","code": function () {
      /* Computes the XY coordinates of the given node
         relative to the containing elements.</p>
         <p>TODO: Check browser compatibility. */
      var node = this.$;
      var x = 0;
      var y = 0;
      var parent;
      var rect = this.$.getBoundingClientRect();

      while ( node ) {
        parent = node;
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent;
      }
      return {  top: y,
                left: x,
                right: x+rect.width,
                bottom: y+rect.height,
                width: rect.width,
                height: rect.height };
    }},{"name": "rectOnViewport","code": function () {
      /* Computes the XY coordinates of this view relative to the browser viewport. */
      return this.$.getBoundingClientRect();
    }},{"name": "viewportOnPage","code": function () {
      var bodyRect = this.X.document.documentElement.getBoundingClientRect();
      var vpSize = this.viewportSize();
      return { left: -bodyRect.left, top: -bodyRect.top,
               width: vpSize.width, height: vpSize.height,
               right: -bodyRect.left + vpSize.width,
               bottom: -bodyRect.top + vpSize.height };
    }},{"name": "viewportSize","code": function () {
      /* returns the rect of the current viewport, relative to the page. */
      return { height: (window.innerHeight || this.X.document.documentElement.clientHeight),
               width:  (window.innerWidth  || this.X.document.documentElement.clientWidth) };
    }},{"name": "createView","code": function (prop, opt_args) {
      /* Creates a sub-$$DOC{ref:'foam.ui.View'} from $$DOC{ref:'Property'} info. */
      var X = ( opt_args && opt_args.X ) || this.Y;
      var v = this.PropertyView.create({id: (this.nextID ? this.nextID() : this.id) +'PROP', prop: prop, copyFrom: opt_args}, X);
      this[prop.name + 'View'] = v.view;
      return v;
    }},{"name": "removeChild","code": function (child) {
      if ( this.PropertyView.isInstance(child) && child.prop ) {
        delete this[child.prop.name + 'View'];
      }
      this.SUPER(child);
    }},{"name": "createRelationshipView","code": function (r, opt_args) {
      if ( opt_args.model_ ) {
        // if a model is specified, switch to normal PropertyView path
        return this.createView(r, opt_args);
      }
      var X = ( opt_args && opt_args.X ) || this.Y;

      var v = this.AsyncLoadingView.create({
        id: this.nextID(),
        name: r.name,
        model: 'foam.ui.RelationshipView',
        args: { relationship: r },
        copyFrom: opt_args
      }, X);

      if ( v.view ) {
        v = v.view;
      }
      this[r.name + 'View'] = v;
      return v;
    }},{"name": "createActionView","code": function (action, opt_args) {
      /* Creates a sub-$$DOC{ref:'foam.ui.View'} from $$DOC{ref:'Property'} info
        specifically for $$DOC{ref:'Action',usePlural:true}. */
      var X = ( opt_args && opt_args.X ) || this.Y;
      var modelName = opt_args && opt_args.model_ ?
        opt_args.model_ :
        'foam.ui.ActionButton'  ;

      var v = this.AsyncLoadingView.create({
        id: this.nextID(),
        name: action.name,
        model: modelName,
        args: { action: action },
        copyFrom: opt_args
      }, X);

      if ( v.view ) {
        v = v.view;
      }
      this[action.name + 'View'] = v;
      return v;
    }},{"name": "createTemplateView","code": function (name, opt_args) {
      /*
        Used by the $$DOC{ref:'Template',text:'$$propName'} sub-$$DOC{ref:'foam.ui.View'}
        creation tag in $$DOC{ref:'Template',usePlural:true}.
      */
      var args = opt_args || {};
      var X = this.Y;
      // Look for the property on our data first
      var myData = this.data$;
      if ( myData && myData.value && myData.value.model_ ) {
        var o = myData.value.model_.getFeature(name);
        if ( o ) {
          var v;
          if ( Action.isInstance(o) )
            v = this.createActionView(o, args);
          else if ( Relationship.isInstance(o) )
            v = this.createRelationshipView(o, args);
          else
            v = this.createView(o, args);
          // link data and add child view
          this.addDataChild(v);
          return v;
        }
      }
      // fallback to check our own properties
      var o = this.model_.getFeature(name);
      if ( ! o )
        throw 'Unknown View Name: ' + name;
      var v;
      if ( Action.isInstance(o) )
        v = this.createActionView(o, args);
      else if ( Relationship.isInstance(o) )
        v = this.createRelationshipView(o, args);
      else
        v = this.createView(o, args);
      // set this-as-data and add child view
      this.addSelfDataChild(v);
      return v;
    }},{"name": "dynamicTag","code": function (tagName, f) {
      /*
        Creates a dynamic HTML tag whose content will be automatically updated.
       */
      var id = this.nextID();

      this.addInitializer(function() {
        this.X.dynamic(function() {
          var html = f();
          var e = this.X.$(id);
          if ( e ) e.innerHTML = html;
        }.bind(this));
      }.bind(this));

      return '<' + tagName + ' id="' + id + '"></' + tagName + '>';
    }}],"listeners": [{"name": "openTooltip","code": function (e) {
        console.assert(! this.tooltip_, 'Tooltip already defined');
        arequire('foam.ui.Tooltip')(function(Tooltip) {
          this.tooltip_ = Tooltip.create({
            text:   this.tooltip,
            target: this.$
          }, this.Y);
        }.bind(this));
      }},{"name": "closeTooltip","code": function (e) {
        if ( this.tooltip_ ) {
          this.tooltip_.close();
          this.tooltip_ = null;
        }
      }},{"name": "onKeyboardShortcut","code": function (evt) {
        // console.log(evt);
        if ( evt.type === 'keydown' && ! this.KEYPRESS_CODES[evt.which] ) return;
        var action = this.keyMap_[this.evtToCharCode(evt)];
        if ( action ) {
          action();
          evt.preventDefault();
          evt.stopPropagation();
        }
      }}]})
CLASS({"package": "foam.input.touch","name": "GestureTarget","properties": [{"name": "id"},{"name": "gesture","help": "The name of the gesture to be tracked."},{"name": "containerID","help": "The containing DOM node's ID. Used for checking what inputs are within which gesture targets."},{"name": "getElement","defaultValue": function () { return this.X.$(this.containerID); },"help": "Function to retrieve the element this gesture is attached to. Defaults to $(containerID)."},{"name": "handler","help": "The target for the gesture's events, after it has been recognized."}],"help": "Created by each view that wants to receive gestures."})
CLASS({"package": "foam.ui","name": "ActionBorder","methods": [{"name": "toHTML","code": function (border, delegate, args) {
      var str = "";
      str += delegate.apply(this, args);
      str += '<div class="actionToolbar">';

      // Actions on the View, are bound to the view
      var actions = this.model_.actions;
      for ( var i = 0 ; i < actions.length; i++ ) {
        var v = this.createActionView(actions[i]);
        //v.data = this;
        this.addSelfDataChild(v);
        str += ' ' + v.toView_().toHTML() + ' ';
      }

      // This is poor design, we should defer to the view and polymorphism
      // to make the distinction.
      if ( this.X.lookup('foam.ui.DetailView').isInstance(this) ) {

        // Actions on the data are bound to the data
        actions = this.model.actions;
        for ( var i = 0 ; i < actions.length; i++ ) {
          var v = this.createActionView(actions[i]);
          //v.data$ = this.data$;
          this.addDataChild(v);
          str += ' ' + v.toView_().toHTML() + ' ';
        }
      }

      str += '</div>';
      return str;
    }}]})
CLASS({"package": "foam.ui","name": "PropertyView","extendsModel": "foam.ui.AsyncLoadingView","properties": [{"name": "prop","type": "Property","postSet": function (old, nu) {
        if ( old && this.bound_ ) this.unbindData(this.data);
        if ( nu && ! this.bound_ ) this.bindData(this.data);
        this.args = nu;
        this.model = this.innerView || nu.view;
      }},{"name": "data","postSet": function (old, nu) {
        if ( old && this.bound_ ) this.unbindData(old);
        if ( nu ) this.bindData(nu);
      }},{"name": "childData"},{"name": "innerView","postSet": function (old,nu) {
        this.model = nu;
      },"help": "Override for prop.view"},{"name": "view","type": "foam.ui.View","adapt": function (_, v) { return v && v.toView_ ? v.toView_() : v; }},{model_:"BooleanProperty","name": "bound_","defaultValue": false},{"name": "parent","type": "foam.ui.View","postSet": function (_, p) {
        if ( ! p ) return; // TODO(jacksonic): We shouldn't pretend we aren't part of the tree
        p[this.prop.name + 'View'] = this.view;
        if ( this.view ) this.view.parent = p;
      }}],"methods": [{"name": "unbindData","code": function (oldData) {
      if ( ! this.bound_ || ! oldData || ! this.prop ) return;
      var pValue = oldData.propertyValue(this.prop.name);
      Events.unlink(pValue, this.childData$);
      this.bound_ = false;
    }},{"name": "bindData","code": function (data) {
      if ( this.bound_ || ! data || ! this.prop) return;
      var pValue = data.propertyValue(this.prop.name);
      Events.link(pValue, this.childData$);
      this.bound_ = true;
    }},{"name": "toString","code": function () { /* Name info. */ return 'PropertyView(' + this.prop.name + ', ' + this.view + ')'; }},{"name": "destroy","code": function ( isParentDestroyed ) { /* Passthrough to $$DOC{ref:'.view'} */
      // always unbind, since if our parent was the top level destroy we need
      // to unhook if we were created as an addSelfDataChild
      this.unbindData(this.data);
      this.SUPER( isParentDestroyed );
    }},{"name": "construct","code": function () {
      // if not bound yet and we do have data set, bind it
      this.bindData(this.data);
      this.SUPER();
    }},{"name": "finishRender","code": function (view) {
      this.SUPER(view);
      this.view.prop = this.prop;
    }},{"name": "addDataChild","code": function (child) {
      Events.link(this.childData$, child.data$);
      this.addChild(child);
    }}]})
CLASS({"package": "foam.ui","name": "AsyncLoadingView","extendsModel": "foam.ui.BaseView","requires": ["Model"],"properties": [{"name": "id","label": "Element ID","type": "String"},{"name": "name","label": "The parent view's name for this"},{"name": "model","label": "View model name, model definition, or JSON with a factory_ specified."},{"name": "args","label": "View construction arguments","defaultValueFn": function () { return {}; }},{"name": "copyFrom","label": "Additional arguments to this.copyFrom(...) when ready.","lazyFactory": function () { return {}; }},{"name": "view","type": "foam.ui.View"}],"methods": [{"name": "init","code": function () {
      this.SUPER();
      this.construct();
    }},{"name": "mergeWithCopyFrom","code": function (other) { /* Override/Append to args, typically
      used to merge in $$DOC{ref:'.model'} if it is a JSON object. */
      for (var key in other) {
        if ( key == 'factory_' ) continue;
        this.copyFrom[key] = other[key];
      }
    }},{"name": "construct","code": function () { /* Picks the model to create, then passes off to $$DOC{ref:'.finishRender'}. */
      // Decorators to allow us to skip over keys without copying them
      // as create() args
      var skipKeysArgDecorator = {
        __proto__: this.args,
        __SKD_SKIP_KEYS: {
          factory_: true,
          model_: true,
          view: true
        },
        hasOwnProperty: function(name) {
          if ( ! this.__SKD_SKIP_KEYS[name] ) {
            return this.__proto__.hasOwnProperty(name);
          }
          return false;
        }
      };

      // HACK to ensure model-for-model works. It requires that 'model', if specified,
      // be present in the create({ args }). Since we set Actions and Properties as
      // the create arg object sometimes, we must temporarily transfer the model
      // value from copyFrom to args, but since we are wrapping it anyways we can
      // piggyback our model value on the wrapper.
      if ( this.copyFrom && this.copyFrom.model ) {
        skipKeysArgDecorator.model = this.copyFrom.model;
      }

      if ( this.copyFrom && this.copyFrom.model_ ) {
        if ( typeof this.copyFrom.model_ === 'string' ) { // string model_ in copyFrom
          return this.requireModelName(this.copyFrom.model_, skipKeysArgDecorator);
        } else if ( this.Model.isInstance(this.copyFrom.model_) ) { // or model instance
          return this.finishRender(this.copyFrom.model_.create(skipKeysArgDecorator, this.X));
        }
      }
      if ( typeof this.model === 'string' ) { // string model name
        return this.requireModelName(this.model, skipKeysArgDecorator);
      }
      if ( this.model.model_ && typeof this.model.model_ === 'string' ) { // JSON instance def'n
        // FOAMalize the definition
        return this.requireViewInstance(FOAM(this.model));
      }
      if ( this.model.model_ ) {
        if ( this.Model.isInstance(this.model) ) { // is a model instance
          return this.finishRender(this.model.create(skipKeysArgDecorator, this.X));
        } else {
          // JSON with Model instance specified in model_
          this.mergeWithCopyFrom(this.model);
          return this.finishRender(this.model.model_.create(skipKeysArgDecorator, this.X));
        }
      }
      if ( this.model.factory_ ) { // JSON with string factory_ name
        // TODO: previously 'view' was removed from copyFrom to support CViews not getting their view stomped. Put back...
        this.mergeWithCopyFrom(this.model);
        return this.requireModelName(this.model.factory_, skipKeysArgDecorator);
      }
      if ( typeof this.model === 'function' ) { // factory function
        return this.finishRender(this.model(skipKeysArgDecorator, this.X));
      }
      console.warn("AsyncLoadingView: View load with invalid model. ", this.model, this.args, this.copyFrom);
    }},{"name": "requireViewInstance","code": function (view) {
      view.arequire(this.X)(function(m) {
        this.finishRender(view);
      }.bind(this));
    }},{"name": "requireModelName","code": function (name, args) {
      arequire(name, this.X)(function(m) {
        this.finishRender(m.create(args, this.X));
      }.bind(this));
    }},{"name": "finishRender","code": function (view) {
      if ( this.copyFrom ) {
        // don't copy a few special cases
        var skipKeysCopyFromDecorator = {
          __proto__: this.copyFrom,
          __SKD_SKIP_KEYS: {
            factory_: true,
            model_: true,
            view: true,
          },
          hasOwnProperty: function(name) {
            if ( ! this.__SKD_SKIP_KEYS[name] ) {
              return this.__proto__.hasOwnProperty(name);
            }
            return false;
          }
        }
        view.copyFrom(skipKeysCopyFromDecorator);
      }
      this.view = view.toView_();
      this.addDataChild(this.view);

      var el = this.X.$(this.id);
      if ( el ) {
        el.outerHTML = this.toHTML();
        this.initHTML();
      }
    }},{"name": "toHTML","code": function () {
      /* If the view is ready, pass through to it. Otherwise create a place
      holder tag with our id, which we replace later. */
      return this.view ? this.view.toHTML() : ('<div id="'+this.id+'"></div>');
    }},{"name": "initHTML","code": function () {
      this.view && this.view.initHTML();
    }},{"name": "toString","code": function () { /* Name info. */ return 'AsyncLoadingView(' + this.model + ', ' + this.view + ')'; }},{"name": "fromElement","code": function (e) { /* passthru */
      this.view.fromElement(e);
      return this;
    }}]})
CLASS({"package": "foam.ui","name": "BaseView","extendsModel": "foam.patterns.ChildTreeTrait","properties": [{"name": "data"}],"methods": [{"name": "addDataChild","code": function (child) {
      /* For children that link to data$. Override to track the
        connections, if required. */
      Events.link(this.data$, child.data$);
      this.addChild(child);
    }},{"name": "addSelfDataChild","code": function (child) {
      /* For views created from properties of this view (not our data),
         this method sets the child's data to 'this'. */
      child.data = this;
      this.addChild(child);
    }},{"name": "toView_","code": function () {
      /* if you are a BaseView that can be converted into an html View,
         convert here */
      return this;
    }}]})
CLASS({"package": "foam.patterns","name": "ChildTreeTrait","properties": [{"name": "parent","type": "foam.patterns.ChildTreeTrait","hidden": true},{"name": "children","type": "Array[foam.patterns.ChildTreeTrait]","factory": function () { return []; }}],"methods": [{"name": "onAncestryChange_","code": function () {
      /* Called when our parent or an ancestor's parent changes. Override to
        react to ancestry changes. Remember to call <code>this.SUPER()</code>. */

      Array.prototype.forEach.call(this.children, function(c) { c.onAncestryChange_ && c.onAncestryChange_() } );
    }},{"name": "addChild","code": function (child) {
      /*
        Maintains the tree structure of $$DOC{ref:'foam.ui.View',usePlural:true}. When
        a sub-$$DOC{ref:'foam.ui.View'} is created, add it to the tree with this method.
      */
      //if (arguments.callee.caller.super_) this.SUPER(child);

      // Check prevents duplicate addChild() calls,
      // which can happen when you use creatView() to create a sub-view (and it calls addChild)
      // and then you write the View using TemplateOutput (which also calls addChild).
      // That should all be cleaned up and all outputHTML() methods should use TemplateOutput.
      if ( child.parent === this ) return;

      child.parent = this;
      child.onAncestryChange_ && child.onAncestryChange_();

      var children = this.children;
      children.push(child);
      this.children = children;

      return this;
    }},{"name": "removeChild","code": function (child) {
      /*
        Maintains the tree structure of $$DOC{ref:'foam.ui.View',usePlural:true}. When
        a sub-$$DOC{ref:'foam.ui.View'} is destroyed, remove it from the tree with this method.
        The isParentDestroyed argument is passed to the child's destroy().
      */
      child.destroy && child.destroy(true);
      this.children.deleteI(child);
      child.parent = undefined;
      //child.onAncestryChange_();

      return this;
    }},{"name": "removeAllChildren","code": function (isParentDestroyed) {
      // unhook the children list, then destroy them all
      var list = this.children;
      this.children = [];
      Array.prototype.forEach.call(list, function(child) {
        this.removeChild(child);
      }.bind(this));
    }},{"name": "addChildren","code": function () {
      /* Adds multiple children at once. Specify each child to add as an argument. */
      for ( var i = 0; i < arguments.length; ++i ) {
        this.addChild(arguments[i]);
      }
      return this;
    }},{"name": "destroy","code": function ( isParentDestroyed ) {
      /* Destroys children and removes them from this. Override to include your own
       cleanup code, but always call this.SUPER(isParentDestroyed)
       after you are done. When isParentDestroyed is true, your parent has already
       been destroyed. You may choose to omit unecessary cleanup. */

      if ( isParentDestroyed ) {
//        console.log(this.name_, " FAST destroying ", this.children.length," children");
        Array.prototype.forEach.call(this.children, function(child) {
          child.destroy && child.destroy(true);
        });
      } else {
//        console.log(this.name_, " SLOW removing ", this.children.length," children--------------------------------------");
        this.removeAllChildren();
      }

      return this;
    }},{"name": "construct","code": function () {
      /* After a destroy(), construct() is called to fill in the object again. If
         any special children need to be re-created, do it here. */

      return this;
    }},{"name": "deepPublish","code": function (topic) {
      /*
       Publish an event and cause all children to publish as well.
       */
      var count = this.publish.apply(this, arguments);

      if ( this.children ) {
        for ( var i = 0 ; i < this.children.length ; i++ ) {
          var child = this.children[i];
          count += child.deepPublish.apply(child, arguments);
        }
      }

      return count;
    }}]})
CLASS({"package": "foam.core.types","name": "DocumentInstallProperty","extendsModel": "Property","properties": [{model_:"FunctionProperty","name": "documentInstallFn"}],"methods": [{"name": "initPropertyAgents","code": function (proto, fastInit) {
        this.SUPER(proto, fastInit);

        var thisProp = this;
        var DocumentInstallProperty = thisProp.model_;

        // add the agent for this model
        proto.addInitAgent(12, ': install in document ', function(o, X, Y) {
          // o is a a newly created instance of a model that has a DocumentInstallProperty
          var model = o.model_;
          // if not a model instance, no document, or we are already installed
          //   in document, we're done.
          if ( ! model || ! X.installedModels || X.installedModels[model.id] ) return;
          // call this document installer function on the current proto
          thisProp.documentInstallFn.call(proto, X);
        });

        // Also run our base models' DocumentInstallProperty inits, in case no
        // instances of our base models have been created.
        if ( proto.__proto__.model_ ) {
          var recurse = function(baseProto) {
            // if the base model also has/inherits this property, init on base too
            var baseProp = baseProto.model_.getProperty(thisProp.name);
            if ( baseProp ) {
              // add a special init agent that has the proto hardcoded.
              proto.addInitAgent(12, ': inherited install in document ', function(o, X, Y) {
                var model = baseProto.model_;
                if ( ! model || ! X.installedModels || X.installedModels[model.id] ) return;
                baseProp.documentInstallFn.call(baseProto, X);
              });
              // many of these may be added, but won't hurt
              proto.addInitAgent(13, ': completed inherited install in document ', function(o, X, Y) {
                X.installedModels[baseProto.model_.id] = true;
              });
              // continue recursing
              if ( baseProto.__proto__.model_ ) {
                recurse(baseProto.__proto__);
              }
            } // else this property is not declared or inherited at this level, so we are done.
          }
          recurse(proto.__proto__);
        }

        // run after all the install in document agents to mark completion
        proto.addInitAgent(13, ': completed install in document ', function(o, X, Y) {
          X.installedModels[o.model_.id] = true;
        });
      }}],"help": "Describes a function property that runs once per document"})
CLASS({"package": "foam.core.types","name": "StringEnumProperty","extendsModel": "StringProperty","traits": ["foam.core.types.EnumPropertyTrait"]})
CLASS({"package": "foam.core.types","name": "EnumPropertyTrait","properties": [{"name": "choices","type": "Array","required": true,"preSet": function (_, a) { return a.map(function(c) { return Array.isArray(c) ? c : [c, c]; }); },"help": "Array of [value, label] choices."},{"name": "view","defaultValue": "foam.ui.ChoiceView"}]})
CLASS({"package": "foam.ui","name": "DAOListView","extendsModel": "foam.ui.View","traits": ["foam.ui.DAODataViewTrait"],"requires": ["SimpleValue"],"properties": [{model_:"BooleanProperty","name": "isHidden","postSet": function (_, isHidden) {
        if ( this.dao && ! isHidden ) this.onDAOUpdate();
      },"defaultValue": false},{model_:"ViewFactoryProperty","name": "rowView","defaultValue": "foam.ui.DetailView"},{"name": "mode","view": {"factory_": "foam.ui.ChoiceView","choices": ["read-only","read-write","final"]},"defaultValue": "read-write"},{"name": "useSelection","postSet": function (old, nu) {
        if ( this.useSelection && !this.X.selection$ ) this.X.selection$ = this.SimpleValue.create();
        this.selection$ = this.X.selection$;
      },"help": "Backward compatibility for selection mode. Create a X.selection$ value in your context instead."},{"name": "selection","factory": function () {
        return this.SimpleValue.create();
      },"help": "Backward compatibility for selection mode. Create a X.selection$ value in your context instead."},{"name": "scrollContainer","help": "Containing element that is responsible for scrolling."},{"name": "chunkSize","defaultValue": 0,"help": "Number of entries to load in each infinite scroll chunk."},{"name": "chunksLoaded","defaultValue": 1,"help": "The number of chunks currently loaded."},{model_:"BooleanProperty","name": "painting","transient": true,"defaultValue": false},{model_:"BooleanProperty","name": "repaintRequired","transient": true,"defaultValue": false}],"constants": [{"name": "ROW_CLICK","value": ["row-click"]}],"methods": [{"name": "init","code": function () {
      this.SUPER();

      var self = this;
      this.subscribe(this.ON_HIDE, function() {
        self.isHidden = true;
      });

      this.subscribe(this.ON_SHOW, function() {
        self.isHidden = false;
      });

      // bind to selection, if present
      if (this.X.selection$) {
        this.selection$ = this.X.selection$;
      }
    }},{"name": "initHTML","code": function () {
      this.SUPER();

      // If we're doing infinite scrolling, we need to find the container.
      // Either an overflow: scroll element or the window.
      // We keep following the parentElement chain until we get null.
      if ( this.chunkSize > 0 ) {
        var e = this.$;
        while ( e ) {
          if ( window.getComputedStyle(e).overflow === 'scroll' ) break;
          e = e.parentElement;
        }
        this.scrollContainer = e || window;
        this.scrollContainer.addEventListener('scroll', this.onScroll, false);
      }

      if ( ! this.isHidden ) this.updateHTML();
    }},{"name": "construct","code": function () {
      if ( ! this.dao || ! this.$ ) return;
      if ( this.painting ) {
        this.repaintRequired = true;
        return;
      }
      this.painting = true;
      var out = [];
      this.children = [];
      this.initializers_ = [];

      var doneFirstItem = false;
      var d = this.dao;
      if ( this.chunkSize ) {
        d = d.limit(this.chunkSize * this.chunksLoaded);
      }
      d.select({put: function(o) {
        if ( this.mode === 'read-write' ) o = o.model_.create(o, this.Y); //.clone();
        var view = this.rowView({data: o, model: o.model_}, this.Y);
        // TODO: Something isn't working with the Context, fix
        view.DAO = this.dao;
        if ( this.mode === 'read-write' ) {
          o.addPropertyListener(null, function(o, topic) {
            var prop = o.model_.getProperty(topic[1]);
            // TODO(kgr): remove the deepClone when the DAO does this itself.
            if ( ! prop.transient ) view.DAO.put(o.deepClone());
          });
        }
        this.addChild(view);

        if ( ! doneFirstItem ) {
          doneFirstItem = true;
        } else {
          this.separatorToHTML(out); // optional separator
        }

        if ( this.X.selection$ ) {
          out.push('<div class="' + this.className + '-row' + '" id="' + this.on('click', (function() {
            this.selection = o;
            this.publish(this.ROW_CLICK);
          }).bind(this)) + '">');
        }
        out.push(view.toHTML());
        if ( this.X.selection$ ) {
          out.push('</div>');
        }
      }.bind(this)})(function() {
        if (this.repaintRequired) {
          this.repaintRequired = false;
          this.painting = false;
          this.realDAOUpdate();
          return;
        }

        var e = this.$;

        if ( ! e ) return;

        e.innerHTML = out.join('');
        this.initInnerHTML();
        this.painting = false;
      }.bind(this));
    }},{"name": "fromElement","code": function (e) {
      var children = e.children;
      if ( children.length == 1 && children[0].nodeName === 'rowView' ) {
        this.SUPER(e);
      } else {
        this.rowView = e.innerHTML;
      }
    }},{"name": "separatorToHTML","code": function (out) {
      /* Template method. Override to provide a separator if required. This
      method is called <em>before</em> each list item, except the first. Use
      out.push("<myhtml>...") for efficiency. */
    }}],"listeners": [{"name": "onDAOUpdate","code": function () {
        this.realDAOUpdate();
      }},{"name": "realDAOUpdate","code": function () {
        if ( ! this.isHidden ) this.updateHTML();
      },"isFramed": true},{"name": "onScroll","code": function () {
        var e = this.scrollContainer;
        if ( this.chunkSize > 0 && e.scrollTop + e.offsetHeight >= e.scrollHeight ) {
          this.chunksLoaded++;
          this.updateHTML();
        }
      }}]})
CLASS({"package": "foam.ui","name": "DAODataViewTrait","exports": ["dao$ as daoViewCurrentDAO$"],"properties": [{"name": "data","preSet": function (old, nu) {
        if ( this.dao !== nu ) {
          this.dao = nu;
        }
        return nu;
      }},{model_:"foam.core.types.DAOProperty","name": "dao","label": "DAO","postSet": function (oldDAO, dao) {
        if ( ! dao ) {
          this.data = '';
        } else if ( ! equals(this.data, dao) ) {
          this.data = dao;
        }
      },"help": "An alias for the data property.","onDAOUpdate": "onDAOUpdate"}],"methods": [{"name": "onDAOUpdate","code": function () { /* Implement this $$DOC{ref:'Method'} in
      sub-models to respond to changes in $$DOC{ref:'.dao'}. */
    }}]})
CLASS({"package": "foam.core.types","name": "DAOProperty","extendsModel": "Property","requires": ["foam.dao.FutureDAO","foam.dao.ProxyDAO"],"imports": ["console"],"properties": [{"name": "type","defaultValue": "DAO","help": "The FOAM type of this property."},{model_:"ModelProperty","name": "model","help": "The model for objects stored in the DAO."},{"name": "view","defaultValue": "foam.ui.DAOListView"},{"name": "onDAOUpdate"},{"name": "install","defaultValue": function (prop) {
        defineLazyProperty(this, prop.name + '$Proxy', function() {
          if ( ! this[prop.name] ) {
            var future = afuture();
            var delegate = prop.FutureDAO.create({
              future: future.get
            });
          } else
            delegate = this[prop.name];

          var proxy = prop.ProxyDAO.create({delegate: delegate});

          this.addPropertyListener(prop.name, function(_, _, _, dao) {
            if ( future ) {
              future.set(dao);
              future = null;
              return;
            }
            proxy.delegate = dao;
          });

          return {
            get: function() { return proxy; },
            configurable: true
          };
        });
      }},{"name": "fromElement_","defaultValue": function (e, p, model) {
          var children = e.children;
          for ( var i = 0 ; i < children.length ; i++ ) {
            this[p.name].put(model.create(null, this.Y).fromElement(
                children[i], p));
          }
      }},{"name": "fromElement","defaultValue": function (e, p) {
        var model = e.getAttribute('model') ||
            (this[p.name] && this[p.name].model) || p.model || '';
        if ( ! model ) {
          this.console.warn('Attempt to load DAO from element without model');
          return;
        }
        if ( typeof model === 'string' ) {
          arequire(model, this.X)(function(model) {
            p.fromElement_.call(this, e, p, model);
          }.bind(this));
        } else {
          p.fromElement_.call(this, e, p, model);
        }
      }}],"help": "Describes a DAO property."})
CLASS({"package": "foam.dao","name": "FutureDAO","extendsModel": "foam.dao.ProxyDAO","properties": [{"name": "delegate","factory": function () { return null; },"postSet": function (oldDAO, newDAO) {
        if ( this.daoListeners_.length ) {
          if ( oldDAO ) oldDAO.unlisten(this.relay());
          newDAO.listen(this.relay());
        }
      }},{"name": "future","required": true},{"name": "model","defaultValueFn": function () { return this.delegate ? this.delegate.model : ''; }}],"methods": [{"name": "init","code": function () { /* Sets up the future to provide us with the delegate when it becomes available. */
      this.SUPER();

      this.future(function(delegate) {
        this.delegate = delegate;
      }.bind(this));
    }},{"name": "put","code": function (value, sink) { /* Passthrough to delegate or the future, if delegate not set yet. */
      if ( this.delegate ) {
        this.delegate.put(value, sink);
      } else {
        this.future(this.put.bind(this, value, sink));
      }
    }},{"name": "remove","code": function (query, sink) { /* Passthrough to delegate or the future, if delegate not set yet. */
      if ( this.delegate ) {
        this.delegate.remove(query, sink);
      } else {
        this.future(this.remove.bind(this, query, sink));
      }
    }},{"name": "removeAll","code": function () { /* Passthrough to delegate or the future, if delegate not set yet. */
      if ( this.delegate ) {
        return this.delegate.removeAll.apply(this.delegate, arguments);
      }

      var a = arguments;
      var f = afuture();
      this.future(function(delegate) {
        this.removeAll.apply(this, a)(f.set);
      }.bind(this));

      return f.get;
    }},{"name": "find","code": function (key, sink) {/* Passthrough to delegate or the future, if delegate not set yet. */
      if ( this.delegate ) {
        this.delegate.find(key, sink);
      } else {
        this.future(this.find.bind(this, key, sink));
      }
    }},{"name": "select","code": function (sink, options) {/* Passthrough to delegate or the future, if delegate not set yet. */
      if ( this.delegate ) {
        return this.delegate.select(sink, options);
      }

      var a = arguments;
      var f = afuture();
      this.future(function() {
        this.select.apply(this, a)(f.set);
      }.bind(this));

      return f.get;
    }}]})
CLASS({"package": "foam.dao","name": "ProxyDAO","extendsModel": "AbstractDAO","requires": ["foam.dao.NullDAO"],"properties": [{"name": "delegate","type": "DAO","mode": "read-only","required": true,"hidden": true,"transient": true,"factory": function () { return this.NullDAO.create(); },"postSet": function (oldDAO, newDAO) {
        if ( this.daoListeners_.length ) {
          if ( oldDAO ) oldDAO.unlisten(this.relay());
          newDAO.listen(this.relay());
          // FutureDAOs will put via the future. In that case, don't put here.
          if ( this.X.lookup('foam.dao.FutureDAO') && this.X.lookup('foam.dao.FutureDAO').isInstance(oldDAO) ) {
            // do nothing
          } else {
            this.notify_('reset', []);
          }
        }
      }},{model_:"ModelProperty","name": "model","defaultValueFn": function () { return this.delegate.model; },"type": "Model"}],"methods": [{"name": "relay","code": function () { /* Sets up relay for listening to delegate changes. */
      if ( ! this.relay_ ) {
        var self = this;

        this.relay_ = {
          put:    function() { self.notify_('put', arguments);    },
          remove: function() { self.notify_('remove', arguments); },
          reset: function() { self.notify_('reset', arguments); },
          toString: function() { return 'RELAY(' + this.$UID + ', ' + self.model_.name + ', ' + self.delegate + ')'; }
        };
      }

      return this.relay_;
    }},{"name": "put","code": function (value, sink) { /* Passthrough to delegate. */
      this.delegate.put(value, sink);
    }},{"name": "remove","code": function (query, sink) { /* Passthrough to delegate. */
      this.delegate.remove(query, sink);
    }},{"name": "removeAll","code": function () { /* Passthrough to delegate. */
      return this.delegate.removeAll.apply(this.delegate, arguments);
    }},{"name": "find","code": function (key, sink) { /* Passthrough to delegate. */
      this.delegate.find(key, sink);
    }},{"name": "select","code": function (sink, options) { /* Passthrough to delegate. */
      return this.delegate.select(sink, options);
    }},{"name": "listen","code": function (sink, options) { /* Passthrough to delegate, using $$DOC{ref:'.relay'}. */
      // Adding first listener, so listen to delegate
      if ( ! this.daoListeners_.length && this.delegate ) {
        this.delegate.listen(this.relay());
      }

      this.SUPER(sink, options);
    }},{"name": "unlisten","code": function (sink) { /* Passthrough to delegate, using $$DOC{ref:'.relay'}. */
      this.SUPER(sink);

      // Remove last listener, so unlisten to delegate
      if ( this.daoListeners_.length === 0 && this.delegate ) {
        this.delegate.unlisten(this.relay());
      }
    }},{"name": "toString","code": function () { /* String representation. */
      return this.name_ + '(' + this.delegate + ')';
    }}]})
CLASS({"package": "foam.dao","name": "NullDAO","methods": [{"name": "put","code": function (obj, sink) { sink && sink.put && sink.put(obj); }},{"name": "remove","code": function (obj, sink) { sink && sink.remove && sink.remove(obj); }},{"name": "select","code": function (sink) {
      sink && sink.eof && sink.eof();
      return aconstant(sink || [].sink);
    }},{"name": "find","code": function (q, sink) { sink && sink.error && sink.error('find', q); }},{"name": "listen","code": function () {}},{"name": "removeAll","code": function () {}},{"name": "unlisten","code": function () {}},{"name": "pipe","code": function () {}},{"name": "where","code": function () { return this; }},{"name": "limit","code": function () { return this; }},{"name": "skip","code": function () { return this; }}],"help": "A DAO that stores nothing and does nothing."})
CLASS({"package": "foam.ui","name": "View","extendsModel": "foam.ui.DestructiveDataView","traits": ["foam.ui.HTMLViewTrait"],"requires": ["Property"],"exports": ["propertyViewProperty"],"properties": [{"name": "propertyViewProperty","type": "Property","defaultValueFn": function () { return this.Property.DETAIL_VIEW; }}]})
CLASS({"package": "foam.ui","name": "DestructiveDataView","extendsModel": "foam.ui.BaseView","requires": ["SimpleValue"],"properties": [{"name": "data","preSet": function (old,nu) {
        if ( this.shouldDestroy(old,nu) ) {
          // destroy children
          this.destroy();
        }
        return nu;
      },"postSet": function (old,nu) {
        if ( this.shouldDestroy(old,nu) ) {
          // rebuild children with new data (propagation will happen implicitly)
          this.construct();
        }
      }},{"name": "dataLinkedChildren","type": "Array[foam.patterns.ChildTreeTrait]","factory": function () { return []; }}],"methods": [{"name": "shouldDestroy","code": function (old,nu) {
      /* Override to provide the destruct condition. When data changes,
         this method is called. Return true to destroy(), cut loose children
         and construct(). Return false to retain children and just propagate
         the data change. */
      return true;
    }},{"name": "destroy","code": function ( isParentDestroyed ) {
      if ( ! isParentDestroyed ) {
        // unlink children
        this.dataLinkedChildren.forEach(function(child) {
          Events.unfollow(this.data$, child.data$);
        }.bind(this));
        this.dataLinkedChildren = [];
      }// else {
//        var parentName = this.parent.name_;
//         this.data$.addListener(function() {
//           console.warn("Data changed after fast-destroy! ", this.name_, parentName);
//         }.bind(this));
//      }
      this.SUPER(isParentDestroyed);
    }},{"name": "addDataChild","code": function (child) {
      /* For children that link to data$, this method tracks them
        for disconnection when we destroy. */
      Events.follow(this.data$, child.data$);
      this.dataLinkedChildren.push(child);
      this.addChild(child);
    }}]})
CLASS({"package": "foam.dao","name": "EasyDAO","extendsModel": "foam.dao.ProxyDAO","requires": ["MDAO","foam.core.dao.CloningDAO","foam.core.dao.MigrationDAO","foam.core.dao.StorageDAO","foam.dao.CachingDAO","foam.dao.ContextualizingDAO","foam.dao.DeDupDAO","foam.dao.GUIDDAO","foam.dao.SeqNoDAO"],"properties": [{"name": "name","defaultValueFn": function () { return this.model.plural; }},{model_:"BooleanProperty","name": "seqNo","defaultValue": false},{model_:"BooleanProperty","name": "guid","label": "GUID","defaultValue": false},{"name": "seqProperty","type": "Property"},{model_:"BooleanProperty","name": "cache","defaultValue": false},{model_:"BooleanProperty","name": "dedup","defaultValue": false},{model_:"BooleanProperty","name": "logging","defaultValue": false},{model_:"BooleanProperty","name": "timing","defaultValue": false},{model_:"BooleanProperty","name": "contextualize","defaultValue": false},{model_:"BooleanProperty","name": "cloning","defaultValue": false},{"name": "daoType","defaultValue": "foam.dao.IDBDAO"},{model_:"BooleanProperty","name": "autoIndex","defaultValue": false},{model_:"ArrayProperty","name": "migrationRules","subType": "foam.core.dao.MigrationRule"}],"constants": [{"name": "ALIASES","value": {"IDB": "foam.dao.IDBDAO","LOCAL": "foam.core.dao.StorageDAO","SYNC": "foam.core.dao.StorageDAO"}}],"methods": [{"name": "init","code": function init(args) {
      /*
        <p>On initialization, the $$DOC{ref:'.'} creates an appropriate chain of
        internal $$DOC{ref:'DAO'} instances based on the $$DOC{ref:'.'}
        property settings.</p>
        <p>This process is transparent to the developer, and you can use your
        $$DOC{ref:'.'} like any other $$DOC{ref:'DAO'}.</p>
      */
      this.SUPER(args);

      if ( window.chrome && chrome.storage ) {
        this.ALIASES.LOCAL = 'foam.core.dao.ChromeStorageDAO';
        this.ALIASES.SYNC  = 'foam.core.dao.ChromeSyncStorageDAO';
      }

      var daoType  = typeof this.daoType === 'string' ? this.ALIASES[this.daoType] || this.daoType : this.daoType;
      var daoModel = typeof daoType === 'string' ? this.X.lookup(daoType) : daoType;
      var params   = { model: this.model, autoIndex: this.autoIndex };

      if ( this.name  ) params.name = this.name;
      if ( this.seqNo || this.guid ) params.property = this.seqProperty;

      var dao = daoModel.create(params);

      if ( MDAO.isInstance(dao) ) {
        this.mdao = dao;
        if ( this.dedup ) dao = this.DeDupDAO.create({delegate: dao});
      } else {
        if ( this.migrationRules && this.migrationRules.length ) {
          dao = this.MigrationDAO.create({
            delegate: dao,
            rules: this.migrationRules,
            name: this.model.name + "_" + daoModel.name + "_" + this.name
          }, this.Y);
        }
        if ( this.cache ) {
          this.mdao = this.MDAO.create(params);
          dao = this.CachingDAO.create({
            cache: this.dedup ?
              this.mdao :
              this.DeDupDAO.create({delegate: this.mdao}),
            src: dao,
            model: this.model});
        }
      }

      if ( this.seqNo && this.guid ) throw "EasyDAO 'seqNo' and 'guid' features are mutually exclusive.";

      if ( this.seqNo ) {
        var args = {__proto__: params, delegate: dao, model: this.model};
        if ( this.seqProperty ) args.property = this.seqProperty;
        dao = this.SeqNoDAO.create(args);
      }

      if ( this.guid ) {
        var args = {__proto__: params, delegate: dao, model: this.model};
        if ( this.seqProperty ) args.property = this.seqProperty;
        dao = this.GUIDDAO.create(args);
      }

      if ( this.contextualize ) dao = this.ContextualizingDAO.create({
        delegate: dao
      });

      if ( this.cloning ) dao = this.CloningDAO.create({
        delegate: dao
      });

      if ( this.timing  ) dao = TimingDAO.create(this.name + 'DAO', dao);
      if ( this.logging ) dao = LoggingDAO.create(dao);

      this.delegate = dao;
    }},{"name": "addIndex","code": function addIndex() {
      /* <p>Only relevant if $$DOC{ref:'.cache'} is true or if $$DOC{ref:'.daoType'}
         was set to $$DOC{ref:'MDAO'}, but harmless otherwise.</p>
         <p>See $$DOC{ref:'MDAO.addIndex', text:'MDAO.addIndex()'}.</p> */
      this.mdao && this.mdao.addIndex.apply(this.mdao, arguments);
      return this;
    }},{"name": "addRawIndex","code": function addRawIndex() {
      /* <p>Only relevant if $$DOC{ref:'.cache'} is true or if $$DOC{ref:'.daoType'}
         was set to $$DOC{ref:'MDAO'}, but harmless otherwise.</p>
         <p>See $$DOC{ref:'MDAO.addRawIndex', text:'MDAO.addRawIndex()'}. */
      this.mdao && this.mdao.addRawIndex.apply(this.mdao, arguments);
      return this;
    }}],"help": "A facade for easy DAO setup."})
CLASS({"package": "foam.core.dao","name": "CloningDAO","extendsModel": "foam.dao.ProxyDAO","properties": [{model_:"BooleanProperty","name": "onSelect","defaultValue": false}],"methods": [{"name": "select","code": function (sink, options) {
      if ( ! this.onSelect ) return this.SUPER(sink, options);

      sink = sink || [].sink;
      var future = afuture();
      this.delegate.select({
        put: function(obj, s, fc) {
          obj = obj.deepClone();
          sink.put && sink.put(obj, s, fc);
        },
        error: function() {
          sink.error && sink.error.apply(sink, argumentS);
        },
        eof: function() {
          sink.eof && sink.eof();
          future.set(sink);
        }
      }, options);
      return future.get;
    }},{"name": "find","code": function (key, sink) {
      return this.SUPER(key, {
        put: function(o) {
          var clone = o.deepClone();
          sink && sink.put && sink.put(clone);
        },
        error: sink && sink.error && sink.error.bind(sink)
      });
    }}]})
CLASS({"package": "foam.core.dao","name": "MigrationDAO","extendsModel": "foam.dao.ProxyDAO","requires": ["foam.core.dao.MigrationRule","foam.dao.FutureDAO","foam.dao.DAOVersion"],"imports": ["daoVersionDao"],"properties": [{"name": "delegate"},{model_:"ArrayProperty","name": "rules","subType": "foam.core.dao.MigrationRule"},{"name": "name"}],"methods": [{"name": "init","code": function () {
      var dao = this.delegate;
      var future = afuture()
      this.delegate = this.FutureDAO.create({future: future.get});

      var self = this;
      var version;
      aseq(
        function(ret) {
          self.daoVersionDao.find(self.name, {
            put: function(c) {
              version = c;
              ret();
            },
            error: function() {
              version = self.DAOVersion.create({
                name: self.name,
                version: 0
              });
              ret();
            }
          });
        },
        function(ret) {
          function updateVersion(ret, v) {
            var c = version.clone();
            c.version = v;
            self.daoVersionDao.put(c, ret);
          }

          var rulesDAO = self.rules.dao;
          rulesDAO
            .where(AND(GT(self.MigrationRule.VERSION, version.version)))
            .select()(function(rules) {
              var seq = [];
              for ( var i = 0; i < rules.length; i++ ) {
                     (function(rule) {
                       seq.push(
                         aseq(
                           function(ret) {
                             rule.migration(ret, dao);
                           },
                           function(ret) {
                             updateVersion(ret, rule.version);
                           }));
                     })(self.rules[i]);
              }
              if ( seq.length > 0 ) aseq.apply(null, seq)(ret);
              else ret();
            });
        })(function() {
          future.set(dao);
        });
      this.SUPER();
    }}]})
CLASS({"package": "foam.core.dao","name": "MigrationRule","ids": ["modelName"],"properties": [{model_:"StringProperty","name": "modelName"},{model_:"IntProperty","name": "version"},{model_:"FunctionProperty","name": "migration"}]})
CLASS({"package": "foam.dao","name": "DAOVersion","ids": ["name"],"properties": [{"name": "name"},{"name": "version"}]})
CLASS({"package": "foam.core.dao","name": "StorageDAO","extendsModel": "MDAO","properties": [{"name": "name","label": "Store Name","type": "String","defaultValueFn": function () {
        return this.model.plural;
      }}],"methods": [{"name": "init","code": function () {
      this.SUPER();

      var objs = localStorage.getItem(this.name);
      if ( objs ) JSONUtil.parse(this.Y, objs).select(this);

      this.addRawIndex({
        execute: function() {},
        bulkLoad: function() {},
        toString: function() { return "StorageDAO Update"; },
        plan: function() {
          return { cost: Number.MAX_VALUE };
        },
        put: this.updated,
        remove: this.updated
      });
    }}],"listeners": [{"name": "updated","code": function () {
        this.select()(function(a) {
          localStorage.setItem(this.name, JSONUtil.compact.where(NOT_TRANSIENT).stringify(a));
        }.bind(this));
      },"isMerged": 100}]})
CLASS({"package": "foam.dao","name": "CachingDAO","extendsModel": "foam.dao.ProxyDAO","requires": ["foam.dao.FutureDAO"],"properties": [{"name": "src"},{"name": "cache","getter": function () { return this.delegate },"setter": function (dao) { this.delegate = dao; },"help": "Alias for delegate."},{"name": "model","defaultValueFn": function () { return this.src.model || this.cache.model; }}],"methods": [{"name": "init","code": function () {
      this.SUPER();

      var src   = this.src;
      var cache = this.cache;

      var futureDelegate = afuture();
      this.cache = this.FutureDAO.create({future: futureDelegate.get});

      src.select(cache)(function() {
        // Actually means that cache listens to changes in the src.
        src.listen(cache);
        futureDelegate.set(cache);
        this.cache = cache;
      }.bind(this));
    }},{"name": "put","code": function (obj, sink) { this.src.put(obj, sink); }},{"name": "remove","code": function (query, sink) { this.src.remove(query, sink); }},{"name": "removeAll","code": function (sink, options) { return this.src.removeAll(sink, options); }}]})
CLASS({"package": "foam.dao","name": "ContextualizingDAO","extendsModel": "foam.dao.ProxyDAO","methods": [{"name": "find","code": function (id, sink) {
      var X = this.Y;
      this.delegate.find(id, {
        put: function(o) {
          o.X = X;
          sink && sink.put && sink.put(o);
        },
        error: function() {
          sink && sink.error && sink.error.apply(sink, arguments);
        }
      });
    }}]})
CLASS({"package": "foam.dao","name": "DeDupDAO","extendsModel": "foam.dao.ProxyDAO","methods": [{"name": "put","code": function put(obj, sink) {
      this.dedup(obj);
      this.delegate.put(obj, sink);
    }},{"name": "dedup","code": function dedup(obj) {
      var inst = obj.instance_;
      for ( var key in inst ) {
        var val = inst[key];
        if ( typeof val === 'string' ) {
          inst[key] = val.intern();
        }
      }
    }}]})
CLASS({"package": "foam.dao","name": "GUIDDAO","label": "foam.dao.GUIDDAO","extendsModel": "foam.dao.ProxyDAO","properties": [{"name": "property","type": "Property","required": true,"hidden": true,"transient": true,"defaultValueFn": function () {
        return this.delegate.model ? this.delegate.model.ID : undefined;
      }}],"methods": [{"name": "put","code": function (obj, sink) {
      if ( ! obj.hasOwnProperty(this.property.name) )
        obj[this.property.name] = createGUID();

      this.delegate.put(obj, sink);
    }}]})
CLASS({"package": "foam.dao","name": "SeqNoDAO","label": "foam.dao.SeqNoDAO","extendsModel": "foam.dao.ProxyDAO","properties": [{"name": "property","type": "Property","required": true,"hidden": true,"transient": true,"defaultValueFn": function () {
        return this.delegate.model ? this.delegate.model.ID : undefined;
      }},{model_:"IntProperty","name": "sequenceValue","defaultValue": 1}],"methods": [{"name": "init","code": function () {
      this.SUPER();

      var future = afuture();
      this.WHEN_READY = future.get;

      // Scan all DAO values to find the largest
      this.delegate.select(MAX(this.property))(function(max) {
        if ( max.max ) this.sequenceValue = max.max + 1;
        future.set(true);
      }.bind(this));
    }},{"name": "put","code": function (obj, sink) {
      this.WHEN_READY(function() {
        var val = this.property.f(obj);

        if ( ! val || val == this.property.defaultValue ) {
          obj[this.property.name] = this.sequenceValue++;
        }

        this.delegate.put(obj, sink);
      }.bind(this));
    }}]})
CLASS({"package": "foam.memento","name": "WindowHashValue","imports": ["window"],"methods": [{"name": "get","code": function () { return this.window.location.hash ? this.window.location.hash.substring(1) : ''; }},{"name": "set","code": function (value) {
      this.window.location.hash = value;
    }},{"name": "addListener","code": function (listener) {
      this.window.addEventListener('hashchange', listener, false);
    }},{"name": "removeListener","code": function (listener) {
      this.window.removeEventListener('hashchange', listener, false);
    }},{"name": "toString","code": function () { return "WindowHashValue(" + this.get() + ")"; }}]})
CLASS({"package": "com.todomvc","name": "Todo","properties": [{"name": "id"},{model_:"BooleanProperty","name": "completed"},{"name": "text","preSet": function (_, text) { return text.trim(); }}],"templates": [{"name": "toDetailHTML","template": "\u000a\u0009\u0009\u0009\u0009<li id=\"%%id\">\u000a\u0009\u0009\u0009\u0009\u0009<div class=\"view\">\u000a\u0009\u0009\u0009\u0009\u0009\u0009$$completed{className: 'toggle'}\u000a\u0009\u0009\u0009\u0009\u0009\u0009$$text{mode: 'read-only', tagName: 'label'}\u000a\u0009\u0009\u0009\u0009\u0009\u0009<button class=\"destroy\" id=\"<%= this.on('click', function () { this.parent.dao.remove(this.data); }) %>\"></button>\u000a\u0009\u0009\u0009\u0009\u0009</div>\u000a\u0009\u0009\u0009\u0009\u0009$$text{className: 'edit'}\u000a\u0009\u0009\u0009\u0009</li>\u000a\u0009\u0009\u0009\u0009<%\u000a\u0009\u0009\u0009\u0009\u0009var toEdit    = function () { DOM.setClass(this.$, 'editing'); this.textView.focus(); }.bind(this);\u000a\u0009\u0009\u0009\u0009\u0009var toDisplay = function () { DOM.setClass(this.$, 'editing', false); }.bind(this);\u000a\u0009\u0009\u0009\u0009\u0009this.on('dblclick', toEdit, this.id);\u000a\u0009\u0009\u0009\u0009\u0009this.on('blur', toDisplay, this.textView.id);\u000a\u0009\u0009\u0009\u0009\u0009this.textView.subscribe(this.textView.ESCAPE, toDisplay);\u000a\u0009\u0009\u0009\u0009\u0009this.setClass('completed', function () { return this.data.completed; }.bind(this), this.id);\u000a\u0009\u0009\u0009\u0009%>\u000a\u0009\u0009\u0009"}]})
CLASS({"package": "com.todomvc","name": "TodoDAO","extendsModel": "foam.dao.ProxyDAO","methods": [{"name": "put","code": function put(issue, s) {
				// If the user tried to put an empty text, remove the entry instead.
				if (!issue.text) {
					this.remove(issue.id, { remove: s && s.put });
				} else {
					this.SUPER(issue, s);
				}
			}}]})
CLASS({"package": "com.todomvc","name": "TodoFilterView","extendsModel": "foam.ui.ChoiceListView","requires": ["com.todomvc.Todo"],"properties": [{"name": "choices","factory": function () {
					return [[TRUE, 'All'], [NOT(this.Todo.COMPLETED), 'Active'], [this.Todo.COMPLETED, 'Completed']];
				}}],"methods": [{"name": "choiceToHTML","code": function choiceToHTML(id, choice) {
				var self = this;
				this.setClass('selected', function () { return self.text === choice[1]; }, id);
				return '<li><a id="' + id + '" class="choice">' + choice[1] + '</a></li>';
			}}]})
CLASS({"package": "foam.ui","name": "ChoiceListView","extendsModel": "foam.ui.AbstractChoiceView","properties": [{"name": "orientation","view": {"factory_": "foam.ui.ChoiceView","choices": [["horizontal","Horizontal"],["vertical","Vertical"]]},"defaultValue": "horizontal","postSet": function (old, nu) {
        if ( this.$ ) {
          DOM.setClass(this.$, old, false);
          DOM.setClass(this.$, nu);
        }
      }},{"name": "className","defaultValueFn": function () { return 'foamChoiceListView ' + this.orientation; }},{"name": "tagName","defaultValue": "ul"},{"name": "innerTagName","defaultValue": "li"}],"methods": [{"name": "init","code": function () {
      this.SUPER();
      // Doing this at the low level rather than with this.setClass listeners
      // to avoid creating loads of listeners when autocompleting or otherwise
      // rapidly changing this.choices.
      this.index$.addListener(this.updateSelected);
      this.choices$.addListener(this.updateSelected);
    }},{"name": "choiceToHTML","code": function (id, choice) {
      return '<' + this.innerTagName + ' id="' + id + '" class="choice">' +
          choice[1] + '</' + this.innerTagName + '>';
    }},{"name": "toInnerHTML","code": function () {
      var out = [];
      for ( var i = 0 ; i < this.choices.length ; i++ ) {
        var choice = this.choices[i];
        var id     = this.nextID();

        this.on(
          'click',
          function(index) {
            this.choice = this.choices[index];
          }.bind(this, i),
          id);

        out.push(this.choiceToHTML(id, choice));
      }
      return out.join('');
    }},{"name": "initInnerHTML","code": function () {
      this.SUPER();
      this.updateSelected();
    }},{"name": "scrollToSelection","code": function () {
      // Three cases: in view, need to scroll up, need to scroll down.
      // First we determine the parent's scrolling bounds.
      var e = this.$.children[this.index];
      if ( ! e ) return;
      var parent = e.parentElement;
      while ( parent ) {
        var overflow = this.X.window.getComputedStyle(parent).overflow;
        if ( overflow === 'scroll' || overflow === 'auto' ) {
          break;
        }
        parent = parent.parentElement;
      }
      parent = parent || this.X.window;

      if ( e.offsetTop < parent.scrollTop ) { // Scroll up
        e.scrollIntoView(true);
      } else if ( e.offsetTop + e.offsetHeight >=
          parent.scrollTop + parent.offsetHeight ) { // Down
        e.scrollIntoView();
      }
    }}],"listeners": [{"name": "updateSelected","code": function () {
        if ( ! this.$ || ! this.$.children ) return;
        for ( var i = 0 ; i < this.$.children.length ; i++ ) {
          var c = this.$.children[i];
          DOM.setClass(c, 'selected', i === this.index);
        }
      }}],"templates": [{"name": "CSS","template": "\u000a.foamChoiceListView {\u000a  list-style-type: none;\u000a}\u000a\u000a.foamChoiceListView .selected {\u000a  font-weight: bold;\u000a}\u000a\u000a.foamChoiceListView.vertical {\u000a  padding: 0;\u000a}\u000a.foamChoiceListView.vertical .choice {\u000a  margin: 4px;\u000a}\u000a\u000a.foamChoiceListView.horizontal {\u000a  padding: 0;\u000a}\u000a.foamChoiceListView.horizontal .choice {\u000a  display: inline;\u000a  margin: 12px;\u000a}"}]})
CLASS({"package": "foam.ui","name": "AbstractChoiceView","extendsModel": "foam.ui.View","properties": [{model_:"BooleanProperty","name": "autoSetData","help": "If true, this.data is set when choices update and the current data is not one of the choices.","defaultValue": true},{"name": "prop","hidden": true},{"name": "label","help": "The user-visible label for the ChoiceView. Not to be confused with $$DOC{ref:\".text\"}, the name of the currently selected choice."},{"name": "text","postSet": function (_, d) {
        for ( var i = 0 ; i < this.choices.length ; i++ ) {
          if ( this.choices[i][1] === d ) {
            if ( this.index !== i ) this.index = i;
            return;
          }
        }
      },"help": "The user-visible text of the current choice (ie. [value, text] -> text)."},{"name": "choice","getter": function () {
        var value = this.data;
        for ( var i = 0 ; i < this.choices.length ; i++ ) {
          var choice = this.choices[i];
          if ( value === choice[0] ) return choice;
        }
        return undefined;
      },"setter": function (choice) {
        var oldValue = this.choice;
        this.data = choice[0];
        this.text = choice[1];
        this.propertyChange('choice', oldValue, this.choice);
      },"help": "The current choice (ie. [value, text])."},{"name": "choices","type": "Array[StringField]","preSet": function (_, a) {
        // If a is a map, instead of an array, we make [key, value] pairs.
        if ( typeof a === 'object' && ! Array.isArray(a) ) {
          var out = [];
          for ( var key in a ) {
            if ( a.hasOwnProperty(key) )
              out.push([key, a[key]]);
          }
          return out;
        }

        a = a.clone();
        // Upgrade single values to [value, value]
        for ( var i = 0 ; i < a.length ; i++ )
          if ( ! Array.isArray(a[i]) )
            a[i] = [a[i], a[i]];
        return a;
      },"postSet": function (oldValue, newValue) {
        var value = this.data;

        // Update current choice when choices update.
        for ( var i = 0 ; i < newValue.length ; i++ ) {
          var choice = newValue[i];

          if ( value === choice[0] ) {
            if ( this.useSelection )
              this.index = i;
            else
              this.choice = choice;
            break;
          }
        }

        if ( this.autoSetData && i === newValue.length ) {
          if ( this.useSelection )
            this.index = 0;
          else
            this.data = newValue.length ? newValue[0][0] : undefined;
        }

        // check if the display labels changed
        var labelsChanged = true;
        if ( (oldValue && oldValue.length) == (newValue && newValue.length) ) {
          labelsChanged = false;
          for (var i = 0; i < oldValue.length; ++i) {
            if ( ! equals(oldValue[i][1], newValue[i][1]) ) {
              labelsChanged = true;
              break;
            }
          }
        }
        if ( labelsChanged ) {
          this.updateHTML();
        }
      }},{model_:"IntProperty","name": "index","transient": true,"preSet": function (_, i) {
        if ( i < 0 || this.choices.length == 0 ) return 0;
        if ( i >= this.choices.length ) return this.choices.length - 1;
        return i;
      },"postSet": function (_, i) {
        // If useSelection is enabled, don't update data or choice.
        if ( this.useSelection ) return;
        if ( this.choices.length && this.data !== this.choices[i][0] ) this.data = this.choices[i][0];
      },"help": "The index of the current choice.","defaultValue": -1},{model_:"FunctionProperty","name": "objToChoice","help": "A Function which adapts an object from the DAO to a [key, value, ...] choice."},{model_:"BooleanProperty","name": "useSelection","help": "When set, data and choice do not update until an entry is firmly selected"},{model_:"foam.core.types.DAOProperty","name": "dao","onDAOUpdate": "onDAOUpdate"},{"name": "data","postSet": function (old, nu) {
        for ( var i = 0 ; i < this.choices.length ; i++ ) {
          if ( this.choices[i][0] === nu ) {
            if ( this.index !== i ) {
              this.text = this.choices[i][1];
              this.index = i;
            }
            return;
          }
        }
        if ( nu && this.choices.length )
          console.warn('ChoiceView data set to invalid choice: ', nu);
      }}],"methods": [{"name": "initHTML","code": function () {
      this.SUPER();

      this.dao = this.dao;
    }},{"name": "findChoiceIC","code": function (name) {
      name = name.toLowerCase();
      for ( var i = 0 ; i < this.choices.length ; i++ ) {
        if ( this.choices[i][1].toLowerCase() == name )
          return this.choices[i];
      }
    }},{"name": "commit","code": function () {
      if ( this.useSelection && this.choices[this.index] )
        this.choice = this.choices[this.index];
    }}],"listeners": [{"name": "onDAOUpdate","code": function () {
        this.dao.select(MAP(this.objToChoice))(function(map) {
          // console.log('***** Update Choices ', map.arg2, this.choices);
          this.choices = map.arg2;
        }.bind(this));
      },"isMerged": 100}]})
CLASS({"package": "foam.ui","name": "CSSLoaderTrait","properties": [{model_:"foam.core.types.DocumentInstallProperty","name": "installCSS","documentInstallFn": function (X) {
        for ( var i = 0 ; i < this.model_.templates.length ; i++ ) {
          var t = this.model_.templates[i];
          if ( t.name === 'CSS' ) {
            t.futureTemplate(function() {
              X.addStyle(this.CSS());
            }.bind(this));
            return;
          }
        }
      }}]})
CLASS({"package": "foam.ui","name": "BooleanView","extendsModel": "foam.ui.SimpleView","properties": [{"name": "data"},{"name": "name","label": "Name","type": "String","defaultValue": "field"}],"methods": [{"name": "toHTML","code": function () {
      return '<input type="checkbox" id="' + this.id + '" ' + ( this.data ? 'checked ' : '' ) + 'name="' + this.name + '"' + this.cssClassAttr() + '/>';
    }},{"name": "initHTML","code": function () {
      this.domValue = DomValue.create(this.$, 'change', 'checked');
      this.$.addEventListener('click', this.onClick);

      Events.link(this.data$, this.domValue);
    }},{"name": "destroy","code": function (isParentDestroyed) {
      this.SUPER(isParentDestroyed);
      Events.unlink(this.domValue, this.data$);
    }}],"listeners": [{"name": "onClick","code": function (e) {
        e.stopPropagation();
      }}]})
CLASS({"package": "foam.ui","name": "DetailView","extendsModel": "foam.ui.View","requires": ["Property","foam.ui.TextFieldView","foam.ui.IntFieldView","foam.ui.FloatFieldView","foam.ui.DAOController"],"exports": ["propertyViewProperty"],"properties": [{"name": "className","defaultValue": "detailView"},{"name": "data","preSet": function (old,nu) {
        if ( nu.model_ ) {
          this.model = nu.model_;
        }
        return nu;
      }},{"name": "model","type": "Model"},{"name": "title","defaultValueFn": function () { return "Edit " + this.model.label; }},{model_:"StringProperty","name": "mode","defaultValue": "read-write"},{model_:"BooleanProperty","name": "showRelationships","defaultValue": false},{"name": "propertyViewProperty","type": "Property","defaultValueFn": function () { return this.Property.DETAIL_VIEW; }}],"methods": [{"name": "shouldDestroy","code": function (old,nu) {
      if ( ! old || ! old.model_ || ! nu || ! nu.model_ ) return true;
      return old.model_ !== nu.model_;
    }},{"name": "generateContent","code": function () { /* rebuilds the children of the view */
      if ( ! this.$ ) return;
      this.$.outerHTML = this.toHTML();
      this.initHTML();
    }},{"name": "titleHTML","code": function () {
      /* Title text HTML formatter */
      var title = this.title;

      return title ?
        '<tr><th colspan=2 class="heading">' + title + '</th></tr>' :
        '';
    }},{"name": "startForm","code": function () { /* HTML formatter */ return '<table>'; }},{"name": "endForm","code": function () { /* HTML formatter */ return '</table>'; }},{"name": "startColumns","code": function () { /* HTML formatter */ return '<tr><td colspan=2><table valign=top><tr><td valign=top><table>'; }},{"name": "nextColumn","code": function () { /* HTML formatter */ return '</table></td><td valign=top><table valign=top>'; }},{"name": "endColumns","code": function () { /* HTML formatter */ return '</table></td></tr></table></td></tr>'; }},{"name": "rowToHTML","code": function (prop, view) {
      /* HTML formatter for each $$DOC{ref:'Property'} row. */
      var str = "";

      if ( prop.detailViewPreRow ) str += prop.detailViewPreRow(this);

      str += '<tr class="detail-' + prop.name + '">';
      if ( this.DAOController.isInstance(view) ) {
        str += "<td colspan=2><div class=detailArrayLabel>" + prop.label + "</div>";
        str += view.toHTML();
        str += '</td>';
      } else {
        str += "<td class='label'>" + prop.label + "</td>";
        str += '<td>';
        str += view.toHTML();
        str += '</td>';
      }
      str += '</tr>';

      if ( prop.detailViewPostRow ) str += prop.detailViewPostRow(this);

      return str;
    }},{"name": "toHTML","code": function () {
      /* Overridden to create the complete HTML content for the $$DOC{ref:'foam.ui.View'}.</p>
         <p>$$DOC{ref:'Model',usePlural:true} may specify a .toDetailHTML() $$DOC{ref:'Method'} or
         $$DOC{ref:'Template'} to render their contents instead of the
          $$DOC{ref:'foam.ui.DetailView.defaultToHTML'} we supply here.
      */

      if ( ! this.data ) return '<span id="' + this.id + '"></span>';

      if ( ! this.model ) throw "DetailView: either 'data' or 'model' must be specified.";

      return (this.model.getPrototype().toDetailHTML || this.defaultToHTML).call(this);
    }},{"name": "defaultToHTML","code": function () {
      /* For $$DOC{ref:'Model',usePlural:true} that don't supply a .toDetailHTML()
        $$DOC{ref:'Method'} or $$DOC{ref:'Template'}, a default listing of
        $$DOC{ref:'Property'} editors is implemented here.
        */
      this.children = [];
      var model = this.model;
      var str  = "";

      str += '<div id="' + this.id + '" ' + this.cssClassAttr() + '" name="form">';
      str += this.startForm();
      str += this.titleHTML();

      var properties = model.getRuntimeProperties();
      for ( var i = 0 ; i < properties.length ; i++ ) {
        var prop = properties[i];

        if ( prop.hidden ) continue;

        var view = this.createView(prop);
        //view.data$ = this.data$;
        this.addDataChild(view);
        str += this.rowToHTML(prop, view);
      }

      str += this.endForm();

      if ( this.showRelationships ) {
        var view = this.X.lookup('foam.ui.RelationshipsView').create({
          data: this.data
        });
        //view.data$ = this.data$;
        this.addDataChild(view);
        str += view.toHTML();
      }

      str += '</div>';

      return str;
    }}],"templates": [{"name": "CSS","template": "\u000a          .detailView {\u000a            border: solid 2px #dddddd;\u000a            background: #fafafa;\u000a            width: 99%;\u000a          }\u000a\u000a          .detailView .heading {\u000a            float: left;\u000a            font-size: 14px;\u000a            font-weight: bold;\u000a            margin-bottom: 8px;\u000a          }\u000a\u000a          .detailView .propertyLabel {\u000a            font-size: 14px;\u000a            display: block;\u000a            font-weight: bold;\u000a            text-align: right;\u000a            float: left;\u000a          }\u000a\u000a          .detailView input {\u000a            font-size: 12px;\u000a            padding: 4px 2px;\u000a            border: solid 1px #aacfe4;\u000a            margin: 2px 0 0px 10px;\u000a          }\u000a\u000a          .detailView textarea {\u000a            float: left;\u000a            font-size: 12px;\u000a            padding: 4px 2px;\u000a            border: solid 1px #aacfe4;\u000a            margin: 2px 0 0px 10px;\u000a            width: 98%;\u000a            overflow: auto;\u000a          }\u000a\u000a          .detailView select {\u000a            font-size: 12px;\u000a            padding: 4px 2px;\u000a            border: solid 1px #aacfe4;\u000a            margin: 2px 0 0px 10px;\u000a          }\u000a\u000a          .detailView .label {\u000a            vertical-align: top;\u000a          }\u000a\u000a          .detailArrayLabel {\u000a            font-size: medium;\u000a          }\u000a\u000a          .detailArrayLabel .foamTable {\u000a            margin: 1px;\u000a            width: 99%;\u000a          }\u000a      "}]})
CLASS({"package": "foam.ui","name": "IntFieldView","extendsModel": "foam.ui.AbstractNumberFieldView","methods": [{"name": "textToValue","code": function (text) { return parseInt(text) || '0'; }},{"name": "valueToText","code": function (value) { return value ? value : '0'; }}]})
CLASS({"package": "foam.ui","name": "AbstractNumberFieldView","extendsModel": "foam.ui.TextFieldView","properties": [{"name": "type","defaultValue": "number"},{"name": "step"}],"methods": [{"name": "extraAttributes","code": function () {
      return this.step ? ' step="' + this.step + '"' : '';
    }}]})
CLASS({"package": "foam.ui","name": "FloatFieldView","extendsModel": "foam.ui.AbstractNumberFieldView","properties": [{"name": "precision","defaultValue": ""}],"methods": [{"name": "formatNumber","code": function (val) {
      if ( ! val ) return '0';
      val = val.toFixed(this.precision);
      var i = val.length-1;
      for ( ; i > 0 && val.charAt(i) === '0' ; i-- );
      return val.substring(0, val.charAt(i) === '.' ? i : i+1);
    }},{"name": "valueToText","code": function (val) {
      return this.hasOwnProperty('precision') ?
        this.formatNumber(val) :
        '' + val ;
    }},{"name": "textToValue","code": function (text) { return parseFloat(text) || 0; }}]})
CLASS({"package": "foam.ui","name": "DAOController","label": "DAO Controller","extendsModel": "foam.ui.View","properties": [{model_:"ModelProperty","name": "model"},{"name": "subType","setter": function (v) {
        this.model = v;
      }},{"name": "dao","view": "foam.ui.TableView"},{"name": "data","getter": function () {
        return this.dao;
      },"setter": function (v) {
        this.dao = v;
      }},{"name": "selection"},{model_:"BooleanProperty","name": "useSearchView","defaultValue": false}],"actions": [{"name": "new","help": "Create a new record.","action": function () {
        var createView = this.X.DAOCreateController.create({
          model: this.model,
          dao:   this.dao,
          showActions: true
        });

        createView.parentController = this;

        this.X.stack.pushView(createView, 'New');
      }},{"name": "edit","help": "Edit the current record.","default": "true","action": function () {
        // Todo: fix, should already be connected
        this.selection = this.daoView.selection;

        var obj = this.selection;
        var actions = this.X.DAOUpdateController.actions.slice(0);

        for ( var i = 0 ; i < this.model.actions.length ; i++ ) {
          var action = this.model.actions[i];

          var newAction = this.X.Action.create(action);
          newAction.action = function (oldAction) {
            return function() {
              oldAction.call(obj);
            };
          }(action.action);

          actions.push(newAction);
        }

        console.log(["selection: ", this.selection]);
        var updateView = this.X.DAOUpdateController.create({
          data:  this.selection/*.deepClone()*/,
          model: this.model,
          dao:   this.dao,
          showActions: true
        });

        this.X.stack.pushView(updateView, 'Edit');
      }},{"name": "delete","help": "Delete the current record.","action": function ()      {
        // Todo: fix, should already be connected
        this.selection = this.daoView.selection;
        var self = this;
        this.dao.remove(this.selection);
      }}],"methods": [{"name": "init","code": function () {
      this.SUPER();
      this.showActions = true;
    }},{"name": "initHTML","code": function () {
      this.SUPER();
      this.daoView.subscribe(this.daoView.DOUBLE_CLICK, this.onDoubleClick);
      this.daoView.selection$.addListener(this.onSelection);
    }}],"listeners": [{"name": "onDoubleClick","code": function (evt) {
        for ( var i = 0 ; i < this.model_.actions.length ; i++ ) {
          var action = this.model_.actions[i];

          if ( action.default ) {
            action.action.call(this);
            break;
          }
        }
      }},{"name": "onSelection","code": function (evt) {
        var obj = this.daoView.selection;
        if ( ! obj ) return;

        this.X.stack.setPreview(
          this.X.SummaryView.create({
            model: this.model,
            data: this.daoView.selection
          }));
      }}],"templates": [{"name": "toInnerHTML","template": " $$dao{ model: this.model } "}]})
CLASS({"package": "foam.ui","name": "ActionButton","extendsModel": "foam.ui.BaseView","traits": ["foam.ui.HTMLViewTrait"],"properties": [{"name": "action","postSet": function (old, nu) {
        old && old.removeListener(this.render)
        nu.addListener(this.render);
      }},{"name": "data"},{"name": "className","factory": function () { return 'actionButton actionButton-' + this.action.name; }},{"name": "tagName","defaultValue": "button"},{"name": "showLabel","defaultValueFn": function () { return this.action.showLabel; }},{"name": "label","defaultValueFn": function () {
        return this.data ?
            this.action.labelFn.call(this.data, this.action) :
            this.action.label;
      }},{"name": "iconUrl","defaultValueFn": function () { return this.action.iconUrl; }},{"name": "tooltip","defaultValueFn": function () { return this.action.help; }}],"methods": [{"name": "toHTML","code": function () {
      var superResult = this.SUPER(); // get the destructors done before doing our work

      var self = this;

      this.on('click', function() {
        self.action.maybeCall(self.X, self.data);
      }, this.id);

      this.setAttribute('disabled', function() {
        self.closeTooltip();
        return self.action.isEnabled.call(self.data, self.action) ? undefined : 'disabled';
      }, this.id);

      this.setClass('available', function() {
        self.closeTooltip();
        return self.action.isAvailable.call(self.data, self.action);
      }, this.id);

      this.X.dynamic(function() { self.action.labelFn.call(self.data, self.action); self.updateHTML(); });

      return superResult;
    }},{"name": "toInnerHTML","code": function () {
      var out = '';

      if ( this.iconUrl ) {
        out += '<img src="' + XMLUtil.escapeAttr(this.iconUrl) + '">';
      }

      if ( this.showLabel ) {
        out += this.label;
      }

      return out;
    }},{"name": "initKeyboardShortcuts","code": function () { /* Not needed, will be done by parent View. */ }}],"listeners": [{"name": "render","code": function () { this.updateHTML(); },"isFramed": true}]})
