export class Model extends Backbone.Model {
  private options: NgBackbone.DataMap<any>;
  constructor( attributes?: NgBackbone.DataMap<any>, options?: NgBackbone.DataMap<any>) {
    super( attributes, options );
    this.options = options || {};
  }
}

