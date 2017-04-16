
import React = require('react/addons');

class ReactComponent<P,S> extends React.Component<P,S>
{

  public getDerivedInitialState(): S {
    return null;
  }

  public getInitialState = (): S => {
    return this.getDerivedInitialState();
  };

  /**
   * @see React.createClass
   */
  constructor(props:P, context:any)
  {
    super(props, context);

    this.props = props;
    this.context = context;
    this.state = this.getInitialState();

    // Nasty trick to avoid warnings.
    this.getInitialState = null;
  }
}

export = ReactComponent;
