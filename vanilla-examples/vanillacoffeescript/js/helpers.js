/*
Cache the querySelector/All for easier and faster reuse
*/


(function() {
  window.$ = document.querySelectorAll.bind(document);

  window.$$ = document.querySelector.bind(document);

  /*
  Register events on elements that may or may not exist yet:
  $live('div a', 'click', function (e) {});
  */


  window.$live = (function() {
    var eventRegistry, globalEventDispatcher;
    eventRegistry = {};
    globalEventDispatcher = function(e) {
      var targetElement;
      targetElement = e.target;
      if (eventRegistry[e.type]) {
        return eventRegistry[e.type].forEach(function(entry) {
          var hasMatch, potentialElements;
          potentialElements = document.querySelectorAll(entry.selector);
          hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;
          if (hasMatch) {
            return entry.handler(e);
          }
        });
      }
    };
    return function(selector, event, handler) {
      if (!eventRegistry[event]) {
        document.documentElement.addEventListener(event, globalEventDispatcher, true);
        eventRegistry[event] = [];
      }
      return eventRegistry[event].push({
        selector: selector,
        handler: handler
      });
    };
  })();

  /*
  Find the element's parent with the given tag name:
  $parent($$('a'), 'div');
  */


  window.$parent = function(element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  /*
  Allow for looping on nodes by chaining:
  $('.foo').forEach(function () {})
  */


  NodeList.prototype.forEach = Array.prototype.forEach;

}).call(this);
