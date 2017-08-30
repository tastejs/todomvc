var React = require('react');
var connect = require('some-hoc');
var twice = require('other-hoc');

var A = React.createClass({
  displayName: 'A',

  render() {}
});

var A2 = connect(twice(React.createClass({
  displayName: 'A2',

  render() {}
})));

module.exports.B = React.createClass({
  displayName: 'B',

  render() {}
});

module.exports.B2 = connect(twice(React.createClass({
  displayName: 'B2',

  render() {}
})));

var more = {
  C: React.createClass({
    displayName: 'C',

    render() {}
  }),

  C2: connect(twice(React.createClass({
    displayName: 'C2',

    render() {}
  }))),

  nested: {
    D: React.createClass({
      displayName: 'D',

      render() {}
    }),

    D2: connect(twice(React.createClass({
      displayName: 'D2',

      render() {}
    })))
  }
};

export default React.createClass({
  displayName: 'E',

  render() {}
});

var Untitled = React.createClass({
  render() {}
});

var DynamicName = React.createClass({
  displayName: Math.random(),

  render() {}
});

var Something = (Math.random() > .5) ?
  React.createClass({ displayName: 'ComponentInsideCondition', render() { } }) :
  React.createClass({ displayName: 'AnotherComponentInsideCondition', render() { } });

function factory() {
  var ComponentInsideFunction = React.createClass({
    displayName: 'ComponentInsideFunction',
    render() { }
  });

  return React.createClass({
    displayName: 'ComponentInsideFunction',
    render() { }
  });
}
