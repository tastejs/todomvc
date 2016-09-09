
export class Collection extends Backbone.Collection<Backbone.Model>  {
  private options: NgBackbone.DataMap<any>;
  constructor( models?: Backbone.Model[], options?: NgBackbone.DataMap<any>) {
    super( models, options );
    this.options = options || {};
  }
}


