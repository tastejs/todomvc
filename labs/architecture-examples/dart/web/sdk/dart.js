// Copyright (c) 2012, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

// Bootstrap support for Dart scripts on the page as this script.
if (navigator.webkitStartDart) {
  if (!navigator.webkitStartDart()) {
    document.body.innerHTML = 'This build has expired.  Please download a new Dartium at http://www.dartlang.org/dartium/index.html';
  }
} else {
  // TODO:
  // - Support in-browser compilation.
  // - Handle inline Dart scripts.
  window.addEventListener("DOMContentLoaded", function (e) {
    // Fall back to compiled JS. Run through all the scripts and
    // replace them if they have a type that indicate that they source
    // in Dart code.
    //
    //   <script type="application/dart" src="..."></script>
    //
    var scripts = document.getElementsByTagName("script");
    var length = scripts.length;
    for (var i = 0; i < length; ++i) {
      if (scripts[i].type == "application/dart") {
        // Remap foo.dart to foo.dart.js.
        if (scripts[i].src && scripts[i].src != '') {
          var script = document.createElement('script');
          script.src = scripts[i].src + '.js';
          var parent = scripts[i].parentNode;
          parent.replaceChild(script, scripts[i]);
        }
      }
    }
  }, false);
}

// ---------------------------------------------------------------------------
// Experimental support for JS interoperability
// ---------------------------------------------------------------------------
function SendPortSync() {
}

function ReceivePortSync() {
  this.id = ReceivePortSync.id++;
  ReceivePortSync.map[this.id] = this;
}

(function() {
  // Serialize the following types as follows:
  //  - primitives / null: unchanged
  //  - lists: [ 'list', internal id, list of recursively serialized elements ]
  //  - maps: [ 'map', internal id, map of keys and recursively serialized values ]
  //  - send ports: [ 'sendport', type, isolate id, port id ]
  //
  // Note, internal id's are for cycle detection.
  function serialize(message) {
    var visited = [];
    function checkedSerialization(obj, serializer) {
      // Implementation detail: for now use linear search.
      // Another option is expando, but it may prohibit
      // VM optimizations (like putting object into slow mode
      // on property deletion.)
      var id = visited.indexOf(obj);
      if (id != -1) return [ 'ref', id ];
      var id = visited.length;
      visited.push(obj);
      return serializer(id);
    }

    function doSerialize(message) {
      if (message == null) {
        return null;  // Convert undefined to null.
      } else if (typeof(message) == 'string' ||
                 typeof(message) == 'number' ||
                 typeof(message) == 'boolean') {
        return message;
      } else if (message instanceof Array) {
        return checkedSerialization(message, function(id) {
          var values = new Array(message.length);
          for (var i = 0; i < message.length; i++) {
            values[i] = doSerialize(message[i]);
          }
          return [ 'list', id, values ];
        });
      } else if (message instanceof LocalSendPortSync) {
        return [ 'sendport', 'nativejs', message.receivePort.id ];
      } else if (message instanceof DartSendPortSync) {
        return [ 'sendport', 'dart', message.isolateId, message.portId ];
      } else {
        return checkedSerialization(message, function(id) {
          var keys = Object.getOwnPropertyNames(message);
          var values = new Array(keys.length);
          for (var i = 0; i < keys.length; i++) {
            values[i] = doSerialize(message[keys[i]]);
          }
          return [ 'map', id, keys, values ];
        });
      }
    }
    return doSerialize(message);
  }

  function deserialize(message) {
    return deserializeHelper(message);
  }

  function deserializeHelper(message) {
    if (message == null ||
        typeof(message) == 'string' ||
        typeof(message) == 'number' ||
        typeof(message) == 'boolean') {
      return message;
    }
    switch (message[0]) {
      case 'map': return deserializeMap(message);
      case 'sendport': return deserializeSendPort(message);
      case 'list': return deserializeList(message);
      default: throw 'unimplemented';
    }
  }

  function deserializeMap(message) {
    var result = { };
    var id = message[1];
    var keys = message[2];
    var values = message[3];
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = deserializeHelper(keys[i]);
      var value = deserializeHelper(values[i]);
      result[key] = value;
    }
    return result;
  }

  function deserializeSendPort(message) {
    var tag = message[1];
    switch (tag) {
      case 'nativejs':
        var id = message[2];
        return new LocalSendPortSync(ReceivePortSync.map[id]);
      case 'dart':
        var isolateId = message[2];
        var portId = message[3];
        return new DartSendPortSync(isolateId, portId);
      default:
        throw 'Illegal SendPortSync type: $tag';
    }
  }

  function deserializeList(message) {
    var values = message[2];
    var length = values.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = deserializeHelper(values[i]);
    }
    return result;
  }

  window.registerPort = function(name, port) {
    var stringified = JSON.stringify(serialize(port));
    window.localStorage['dart-port:' + name] = stringified;
  };

  window.lookupPort = function(name) {
    var stringified = window.localStorage['dart-port:' + name];
    return deserialize(JSON.parse(stringified));
  };

  ReceivePortSync.id = 0;
  ReceivePortSync.map = {};

  ReceivePortSync.dispatchCall = function(id, message) {
    // TODO(vsm): Handle and propagate exceptions.
    var deserialized = deserialize(message);
    var result = ReceivePortSync.map[id].callback(deserialized);
    return serialize(result);
  };

  ReceivePortSync.prototype.receive = function(callback) {
    this.callback = callback;
  };

  ReceivePortSync.prototype.toSendPort = function() {
    return new LocalSendPortSync(this);
  };

  ReceivePortSync.prototype.close = function() {
    delete ReceivePortSync.map[this.id];
  };

  if (navigator.webkitStartDart) {
    window.addEventListener('js-sync-message', function(event) {
      var data = JSON.parse(getPortSyncEventData(event));
      var deserialized = deserialize(data.message);
      var result = ReceivePortSync.map[data.id].callback(deserialized);
      // TODO(vsm): Handle and propagate exceptions.
      dispatchEvent('js-result', serialize(result));
    }, false);
  }

  function LocalSendPortSync(receivePort) {
    this.receivePort = receivePort;
  }

  LocalSendPortSync.prototype = new SendPortSync();

  LocalSendPortSync.prototype.callSync = function(message) {
    // TODO(vsm): Do a direct deepcopy.
    message = deserialize(serialize(message));
    return this.receivePort.callback(message);
  }

  function DartSendPortSync(isolateId, portId) {
    this.isolateId = isolateId;
    this.portId = portId;
  }

  DartSendPortSync.prototype = new SendPortSync();

  function dispatchEvent(receiver, message) {
    var string = JSON.stringify(message);
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(receiver, false, false, string);
    window.dispatchEvent(event);
  }

  function getPortSyncEventData(event) {
    return event.detail;
  }

  DartSendPortSync.prototype.callSync = function(message) {
    var serialized = serialize(message);
    var target = 'dart-port-' + this.isolateId + '-' + this.portId;
    // TODO(vsm): Make this re-entrant.
    // TODO(vsm): Set this up set once, on the first call.
    var source = target + '-result';
    var result = null;
    var listener = function (e) {
      result = JSON.parse(getPortSyncEventData(e));
    };
    window.addEventListener(source, listener, false);
    dispatchEvent(target, [source, serialized]);
    window.removeEventListener(source, listener, false);
    return deserialize(result);
  }
})();
