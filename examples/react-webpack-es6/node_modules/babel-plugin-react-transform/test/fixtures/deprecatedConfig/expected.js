'use strict';

var _myCustomModuleWrap2 = require('my-custom-module/wrap');

var _myCustomModuleWrap3 = _interopRequireDefault(_myCustomModuleWrap2);

var _react = require('react');

var _myOtherCustomModuleWrap2 = require('my-other-custom-module/wrap');

var _myOtherCustomModuleWrap3 = _interopRequireDefault(_myOtherCustomModuleWrap2);

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _components = {
  _$A: {
    displayName: 'A'
  },
  _$A2: {
    displayName: 'A2'
  },
  _$B: {
    displayName: 'B'
  },
  _$B2: {
    displayName: 'B2'
  },
  _$C: {
    displayName: 'C'
  },
  _$C2: {
    displayName: 'C2'
  },
  _$D: {
    displayName: 'D'
  },
  _$D2: {
    displayName: 'D2'
  },
  _$E: {
    displayName: 'E'
  },
  _$Unknown: {},
  _$Unknown2: {},
  _$ComponentInsideCondition: {
    displayName: 'ComponentInsideCondition'
  },
  _$AnotherComponentInsideCondition: {
    displayName: 'AnotherComponentInsideCondition'
  },
  _$ComponentInsideFunction: {
    displayName: 'ComponentInsideFunction',
    isInFunction: true
  },
  _$ComponentInsideFunction2: {
    displayName: 'ComponentInsideFunction',
    isInFunction: true
  }
};

var _reactComponentWrapper = (0, _myCustomModuleWrap3['default'])({
  filename: '%FIXTURE_PATH%',
  components: _components,
  locals: [module],
  imports: [_react]
});

var _reactComponentWrapper2 = (0, _myOtherCustomModuleWrap3['default'])({
  filename: '%FIXTURE_PATH%',
  components: _components,
  locals: [],
  imports: []
});

function _wrapComponent(uniqueId) {
  return function (ReactClass) {
    return _reactComponentWrapper2(_reactComponentWrapper(ReactClass, uniqueId), uniqueId);
  };
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var React = require('react');
var connect = require('some-hoc');
var twice = require('other-hoc');

var A = _wrapComponent('_$A')(React.createClass({
  displayName: 'A',

  render: function render() {}
}));

var A2 = connect(twice(_wrapComponent('_$A2')(React.createClass({
  displayName: 'A2',

  render: function render() {}
}))));

module.exports.B = _wrapComponent('_$B')(React.createClass({
  displayName: 'B',

  render: function render() {}
}));

module.exports.B2 = connect(twice(_wrapComponent('_$B2')(React.createClass({
  displayName: 'B2',

  render: function render() {}
}))));

var more = {
  C: _wrapComponent('_$C')(React.createClass({
    displayName: 'C',

    render: function render() {}
  })),

  C2: connect(twice(_wrapComponent('_$C2')(React.createClass({
    displayName: 'C2',

    render: function render() {}
  })))),

  nested: {
    D: _wrapComponent('_$D')(React.createClass({
      displayName: 'D',

      render: function render() {}
    })),

    D2: connect(twice(_wrapComponent('_$D2')(React.createClass({
      displayName: 'D2',

      render: function render() {}
    }))))
  }
};

exports['default'] = _wrapComponent('_$E')(React.createClass({
  displayName: 'E',

  render: function render() {}
}));

var Untitled = _wrapComponent('_$Unknown')(React.createClass({
  render: function render() {}
}));

var DynamicName = _wrapComponent('_$Unknown2')(React.createClass({
  displayName: Math.random(),

  render: function render() {}
}));

var Something = Math.random() > .5 ? _wrapComponent('_$ComponentInsideCondition')(React.createClass({ displayName: 'ComponentInsideCondition', render: function render() {} })) : _wrapComponent('_$AnotherComponentInsideCondition')(React.createClass({ displayName: 'AnotherComponentInsideCondition', render: function render() {} }));

function factory() {
  var ComponentInsideFunction = _wrapComponent('_$ComponentInsideFunction')(React.createClass({
    displayName: 'ComponentInsideFunction',
    render: function render() {}
  }));

  return _wrapComponent('_$ComponentInsideFunction2')(React.createClass({
    displayName: 'ComponentInsideFunction',
    render: function render() {}
  }));
}
module.exports = exports['default'];