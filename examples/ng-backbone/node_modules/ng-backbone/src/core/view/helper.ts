import { NgTemplate } from "../../ngtemplate";
import { mapFrom, mapAssign } from "../utils";
import { ViewMap } from "./map";

export class ViewHelper {

  private debounceTimer: number;

  constructor( private view: NgBackbone.View ) {
    this.view.listenTo( this.view, "component-did-update", () => {
      this.view.__ngbComponent.views.size && this.initSubViews( this.view.__ngbComponent.views );
    });
    this.view.views = new ViewMap();
  }

  /**
   * Translate { getFoo(), getBar() } into { foo: "value", bar: "value" }
   */
  static getterToScope( data: any ): NgBackbone.DataMap<any> {
    const re = /^get[A-Z]/;
    let key: string,
        getters: NgBackbone.DataMap<any> = {};
    for ( key in data ) {
      if ( re.test( key ) && typeof data[ key ] === "function" ){
        let prop = key.substr( 3 );
        prop = prop.substr( 0, 1 ).toLowerCase() + prop.substr( 1 );
        getters[ prop ] = data[ key ]();
      }
    }
    return getters;
  }


  /**
   * Subscribe logger handlers from options
   */
  subscribeLogger( logger: NgBackbone.LoggerOption ): void {
    Object.keys( logger ).forEach(( events: string ) => {
      this.view.listenTo( this.view, events, logger[ events ] );
    });
  }


  /**
   * collections/models passed in options, take them
   */
  initializeOptions( options: NgBackbone.ViewOptions ) {
    // When @Component isn't defined
    if ( !( "__ngbComponent" in this.view ) ) {
      this.resetComponentDto();
    }

    this.asyncInitializeTemplate( this.view.options );

    this.view.models = mapFrom( this.view.__ngbComponent.models );
    this.view.collections = mapFrom( this.view.__ngbComponent.collections );



    if ( "collections" in options ) {
      mapAssign( this.view.collections, options.collections );
    }
    if ( "models" in options ) {
      mapAssign( this.view.models, options.models );
    }

    if ( "this.views" in options ) {
      mapAssign( this.view.__ngbComponent.views, options.views );
    }
  }


  /**
   * Bind specified models to the template
   */
  bindModels(){
      this.view.models.forEach(( model: Backbone.Model ): void => {
        this.view.stopListening( model );
        this.view.options.logger && this.view.trigger( "log:listen", "subscribes for `change`", model );
        this.view.listenTo( model, "change", this.debounceRender.bind( this ) );
      });
  }
  /**
   * Bind specified collections to the template
   */
  bindCollections(){
    this.view.collections.forEach(( collection: Backbone.Collection<Backbone.Model> ) => {
      this.view.stopListening( collection );
      this.view.options.logger &&
        this.view.trigger( "log:listen", "subscribes for `change destroy sync sort add remove`", collection );
      this.view.listenTo( collection, "change destroy sync sort add remove", this.debounceRender.bind( this ) );
    });
  }
  /**
   * Slightly debounced for repeating calls like collection.sync/sort
   */
  debounceRender( ...args: any[] ) {
    clearTimeout( this.debounceTimer );
    this.debounceTimer = <any>setTimeout(() => {
      this.debounceTimer = null;
      this.view.render.apply( this.view, args );
    }, 50 );
  }


  /**
   * Converts { foo: Collection, bar: Collection } into
   * { foo: [{},{}], bar: [{},{}] }
   */
  static collectionsToScope(
    collections: NgBackbone.CollectionMap ): NgBackbone.DataMap<NgBackbone.ModelData> {
    let scope: NgBackbone.DataMap<NgBackbone.ModelData> = {};
    collections.forEach(( collection: Backbone.Collection<Backbone.Model>, key: string ) => {
      scope[ key ] = [];
      collection.forEach(( model: Backbone.Model ) => {
          let data: NgBackbone.ModelData = model.toJSON();
          if ( model.id ) {
            data.id = model.id;
          }
          ( <any[]> scope[ key ] ).push( data );
      });
      let getters = ViewHelper.getterToScope( collection );
      getters && Object.assign( scope[ key ], getters );
    });
    return scope;
  }
  /**
   * Converts model map into JSON
   */
  static modelsToScope( models: NgBackbone.ModelMap ): NgBackbone.ModelData {
    let scope: NgBackbone.ModelData = {};
   models.forEach(( model: Backbone.Model, key: string ) => {
      // "groupName.controlName" -> { groupName: { controlName: val } }
      if ( key.indexOf( "." ) !== -1 ) {
        let ref = key.split( "." );
        scope[ ref[ 0 ] ] = scope[ ref[ 0 ] ] || {};
        scope[ ref[ 0 ] ][ ref[ 1 ] ] = model.toJSON();
        return;
      }
      scope[ key ] = model.toJSON();
    });
    return scope;
  }

  private resetComponentDto() {
      this.view.__ngbComponent = {
        models: {},
        collections: {},
        views: mapFrom({}),
        template: null,
        templateUrl: null
      };
  }

  private asyncInitializeTemplate( options: NgBackbone.ViewOptions ): void {
    let template = this.view.__ngbComponent.template,
        templateUrl = this.view.__ngbComponent.templateUrl;
    // shared template
    if ( "template" in options && this.view.options.template ) {
      template = this.view.options.template;
    }
    if ( "templateUrl" in options && this.view.options.templateUrl ) {
      templateUrl = this.view.options.templateUrl;
    }

    if ( !templateUrl ) {
      this.initializeTemplate( template );
      return;
    }
    Backbone.ajax({
      url: templateUrl,
      error( err ){
        throw new Error( `Cannot reach ${templateUrl}` );
      },
      success: ( tpl ) => {
        this.initializeTemplate( tpl );
        this.view.render();
      }
    });
  }

  onComponentDidMount(){
    this.view.didComponentMount = true;
    this.view.componentDidMount();
    this.view.trigger( "component-did-mount" );
  }

  private initializeTemplate( template: string ) {
    // process Component's payload
    this.view.template = new NgTemplate( this.view.el, template, {
      willMount: () => {
        this.view.trigger( "component-will-mount" );
        this.view.componentWillMount();
      }
    });
  }
  /**
   * When after parent DOM update any bound node disappear, let's ditch the orphan views
   */
  private cleanupOrphanSubViews(){
    this.view.views.forEachView((
          view: NgBackbone.View,
          inx: number,
          key: string,
          map: Map<string, NgBackbone.View[]> ) => {
      if ( ! view.el.parentNode ) {
        let views = map.get( key );
        view.remove();
        delete views[ inx ];
        map.set( key, views
          .filter(( value: any ) => typeof value !== "undefined" ) );
      }
    });
  }

   /**
   * Initialize subview
   */
  private initSubViews( viewCtorMap: NgBackbone.ViewCtorMap ): void {
    this.cleanupOrphanSubViews();
    viewCtorMap.forEach(( Ctor: any, key: string ) => {
      let dto: NgBackbone.ViewCtorOptions,
          views: NgBackbone.View[];

      if ( typeof Ctor === "function" ) {
        // populate views by specified Constructor
        views = this.createSubViews( <ViewConstructor>Ctor );
      } else {
        // populate views by pair Constructor/Options
        dto = <NgBackbone.ViewCtorOptions>Ctor;
        views = this.createSubViews( <ViewConstructor>dto[ 0 ],  dto[ 1 ] );
      }
      if ( !views.length ) {
        return;
      }
      if ( this.view.views.has( key ) ) {
        this.view.views.set( key, this.view.views.getAll( key ).concat( views ) );
        return;
      }
      this.view.views.set( key, views );
    });
  }

  /**
   * Factory: create a subview per element found by the selector
   */
  private createSubViews( ViewCtor: ViewConstructor, payload: any = {}): NgBackbone.View[] {
    let views: NgBackbone.View[] = [],
        els = this.findMatchingElements( ViewCtor.prototype[ "el" ] );

    els.forEach(( el: HTMLElement ) => {
      let options = payload;
      if ( this.view.views.hasElement( el ) ) {
        return null;
      }
      // when options is a function
      if ( typeof payload === "function" ) {
        options = payload.call( this.view, this.view, el );
      }
      views.push( new ViewCtor( Object.assign( options, { el: el, parent: this.view }) ) );
    });
    return views;
  }

  /**
   * Find all matching elements into DOM
   */
  private findMatchingElements( selector: string ): HTMLElement[] {
    if ( typeof selector !== "string" ) {
      throw new SyntaxError( "Invalid options.el type, must be a string" );
    }
    return Array.from( this.view.el.querySelectorAll( selector ) ) as HTMLElement[];
  }

}

interface ViewConstructor {
    new( options?: NgBackbone.ViewOptions ): NgBackbone.View;
}
