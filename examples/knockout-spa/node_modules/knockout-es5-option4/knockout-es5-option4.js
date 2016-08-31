(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout'], factory)
  } else if (typeof exports === 'object' && typeof module === 'object') {
    /*global module*/
    module.exports = factory(require('knockout'))
  } else {
    /*global ko*/
    factory(ko)
  }
})(function(ko) {

  var deepObservifyArray = function(arr, merge, options) {
    for (var i = 0, len = merge.length; i < len; i++) {
      // TODO circular reference protection
      if (merge[i] != null && typeof merge[i] === 'object' &&
          arr[i] != null && typeof arr[i] === 'object') {
        if (options.deep !== false && Array.isArray(arr[i])) {
          deepObservifyArray(arr[i], merge[i], options)
        } else {
          ko.observe(arr[i], merge[i], options)
        }
      } else if (arr[i] !== merge[i]) {
        arr[i] = ko.observableObject(merge[i])
      }
    }
  },
  defineProperty = function(type, obj, prop, def /* definition or default */, options) {
    if (obj == null || typeof obj !== 'object' || typeof prop !== 'string') {
      throw new Error('invalid arguments passed')
    }

    if (Object.prototype.toString.call(def) === '[object Array]' && type === 'observable') {
      type = 'observableArray'
    }

    var descriptor = Object.getOwnPropertyDescriptor(obj, prop), observable
    if (!descriptor || (!descriptor.get && !descriptor.set)) {
      if (descriptor) delete obj[prop]

      observable = ko[type](def)
      Object.defineProperty(obj, prop, {
        set: ko.isWritableObservable(observable) ? observable : undefined,
        get: observable,
        enumerable: true,
        configurable: true
      })

      Object.defineProperty(obj, '_' + prop, {
        get: function() { return observable },
        enumerable: false
      })

      if (type === 'observableArray') {
        var update = function(arr) {
          if (Array.isArray(arr) && !Object.getOwnPropertyDescriptor(arr, 'push')) {
            ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(f) {
              // sadly we can't just use ko.observableArray.fn's functions, as it doesn't call
              // Array.prototype[f].apply but on the object, resulting in infinite recursion.
              Object.defineProperty(arr, f, {
                value: function() {
                  observable.valueWillMutate()
                  var result = Array.prototype[f].apply(observable.peek(), arguments)
                  observable.valueHasMutated()
                  return result
                }
              })
            });
            ['remove', 'replace', 'removeAll'].forEach(function(f) {
              Object.defineProperty(arr, f, { value: ko.observableArray.fn[f].bind(observable) })
            })
          }
        }
        observable.subscribe(update)
        update(def)
      }
    }

    var current = obj[prop]
    if ((!options || options.deep !== false) && (current != null && typeof current === 'object')) {
      ko.observe(current, def, options, prop)
      // if the current propery is an observable array property, notify it's subscribers that it changed
      if (Array.isArray(current) && current !== def && obj['_' + prop]) {
        obj['_' + prop].notifySubscribers()
      }
    } else if (current !== def && !observable) {
      obj[prop] = def
    }
  }

  ko.defineObservableProperty = defineProperty.bind(null, 'observable')
  ko.defineComputedProperty = function(obj, prop, definition) {
    if (typeof definition === 'function') {
      definition = definition.bind(obj)
    }
    return defineProperty('computed', obj, prop, definition)
  }

  ko.observe = function(model, defaults, options, /* private */ parentProp) {
    var def, prop
    options = options || {}

    if (arguments.length < 2) {
      defaults = model
    }
    if (defaults == null || typeof defaults !== 'object') {
      return defaults
    }

    if (Array.isArray(model)) {
      // specially handle merging arrays if a mapping exists at all, a map exists for
      // this particular array, and if both sides are an array
      if (options.arrayMapping && parentProp && typeof options.arrayMapping === 'object' &&
          options.arrayMapping[parentProp] && Array.isArray(defaults)) {
        var itemProp = options.arrayMapping[parentProp],
            len = defaults.length,
            mappedDefaults = []

        model.forEach(function(modelItem) {
          var defaultsItem, def, idx
          if (modelItem != null && typeof modelItem === 'object') {
            var modelItemProp = modelItem[itemProp]
            for (idx = 0; idx < len; idx++) {
              def = defaults[idx]
              if (def && (def[itemProp] === modelItemProp)) {
                defaultsItem = def
                break
              }
            }
          }

          if (defaultsItem != null) {
            mappedDefaults.push(defaultsItem)
            delete defaults[idx]
          } else {
            mappedDefaults.push(modelItem)
          }
        })
        // filter (x) -> true makes an array not sparse
        defaults = mappedDefaults.concat(defaults.filter(function(x) { return true }))
      }

      deepObservifyArray(model, defaults, options)
    } else {
      for (prop in defaults) {
        if (defaults.hasOwnProperty(prop)) {
          def = defaults[prop]
          if (!def || !ko.isSubscribable(def)) {
            ko.defineObservableProperty(model, prop, def, options)
          } else {
            model[prop] = def
          }
        }
      }
    }

    return model
  }

  ko.observableObject = function(defaults, options) {
    return ko.observe({}, defaults, options)
  }

  ko.track = function(obj, props) {
    (props || Object.getOwnPropertyNames(obj)).forEach(function(prop) {
      ko.defineObservableProperty(obj, prop, obj[prop], { deep: false })
    })
    return obj
  }

  return ko
})