import { Mixin } from "ng-backbone";

@Mixin({
  routes: {
    "*filter": "setFilter"
  }
})
export class TodoRouter extends Backbone.Router {
  private listeners: Backbone.Events[] = [];

  addListener( listener: Backbone.Events ){
    this.listeners.push( listener );
  }
  // delegate the even to TODO view
  setFilter( param: string ) {
    this.listeners.forEach(( listener: Backbone.Events ) => {
      listener.trigger( "filter", param );
    })
  }
}

