class NotComponent {
  bender() {}
}

class LikelyComponent {
  render() {}
}

let Something = (Math.random() > .5) ?
  class ComponentInsideCondition { render() { } } :
  class AnotherComponentInsideCondition { render() { } };

function factory() {
  class ComponentInsideFunction {
    render() { }
  }

  return class ComponentInsideFunction {
    render() { }
  };
}
