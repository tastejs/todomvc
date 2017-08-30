"use strict";

var _myCustomModuleWrap2 = require("my-custom-module/wrap");

var _myCustomModuleWrap3 = _interopRequireDefault(_myCustomModuleWrap2);

var _react = require("react");

var _myOtherCustomModuleWrap2 = require("my-other-custom-module/wrap");

var _myOtherCustomModuleWrap3 = _interopRequireDefault(_myOtherCustomModuleWrap2);

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _components = {
  _$LikelyComponent: {
    displayName: "LikelyComponent"
  },
  _$ComponentInsideCondition: {
    displayName: "ComponentInsideCondition"
  },
  _$AnotherComponentInsideCondition: {
    displayName: "AnotherComponentInsideCondition"
  },
  _$ComponentInsideFunction: {
    displayName: "ComponentInsideFunction",
    isInFunction: true
  },
  _$ComponentInsideFunction2: {
    displayName: "ComponentInsideFunction",
    isInFunction: true
  }
};

var _reactComponentWrapper = (0, _myCustomModuleWrap3["default"])({
  filename: "%FIXTURE_PATH%",
  components: _components,
  locals: [module],
  imports: [_react]
});

var _reactComponentWrapper2 = (0, _myOtherCustomModuleWrap3["default"])({
  filename: "%FIXTURE_PATH%",
  components: _components,
  locals: [],
  imports: []
});

function _wrapComponent(uniqueId) {
  return function (ReactClass) {
    return _reactComponentWrapper2(_reactComponentWrapper(ReactClass, uniqueId), uniqueId);
  };
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var NotComponent = (function () {
  function NotComponent() {
    _classCallCheck(this, NotComponent);
  }

  _createClass(NotComponent, [{
    key: "bender",
    value: function bender() {}
  }]);

  return NotComponent;
})();

var LikelyComponent = (function () {
  function LikelyComponent() {
    _classCallCheck(this, _LikelyComponent);
  }

  _createClass(LikelyComponent, [{
    key: "render",
    value: function render() {}
  }]);

  var _LikelyComponent = LikelyComponent;
  LikelyComponent = _wrapComponent("_$LikelyComponent")(LikelyComponent) || LikelyComponent;
  return LikelyComponent;
})();

var Something = Math.random() > .5 ? (function () {
  function ComponentInsideCondition() {
    _classCallCheck(this, _ComponentInsideCondition);
  }

  _createClass(ComponentInsideCondition, [{
    key: "render",
    value: function render() {}
  }]);

  var _ComponentInsideCondition = ComponentInsideCondition;
  ComponentInsideCondition = _wrapComponent("_$ComponentInsideCondition")(ComponentInsideCondition) || ComponentInsideCondition;
  return ComponentInsideCondition;
})() : (function () {
  function AnotherComponentInsideCondition() {
    _classCallCheck(this, _AnotherComponentInsideCondition);
  }

  _createClass(AnotherComponentInsideCondition, [{
    key: "render",
    value: function render() {}
  }]);

  var _AnotherComponentInsideCondition = AnotherComponentInsideCondition;
  AnotherComponentInsideCondition = _wrapComponent("_$AnotherComponentInsideCondition")(AnotherComponentInsideCondition) || AnotherComponentInsideCondition;
  return AnotherComponentInsideCondition;
})();

function factory() {
  var ComponentInsideFunction = (function () {
    function ComponentInsideFunction() {
      _classCallCheck(this, _ComponentInsideFunction);
    }

    _createClass(ComponentInsideFunction, [{
      key: "render",
      value: function render() {}
    }]);

    var _ComponentInsideFunction = ComponentInsideFunction;
    ComponentInsideFunction = _wrapComponent("_$ComponentInsideFunction")(ComponentInsideFunction) || ComponentInsideFunction;
    return ComponentInsideFunction;
  })();

  return (function () {
    function ComponentInsideFunction() {
      _classCallCheck(this, _ComponentInsideFunction2);
    }

    _createClass(ComponentInsideFunction, [{
      key: "render",
      value: function render() {}
    }]);

    var _ComponentInsideFunction2 = ComponentInsideFunction;
    ComponentInsideFunction = _wrapComponent("_$ComponentInsideFunction2")(ComponentInsideFunction) || ComponentInsideFunction;
    return ComponentInsideFunction;
  })();
}
