// NgBackbone extends Backbone.Nativeview, but if it's not loaded, works also fine
if ( !( "NativeView" in Backbone ) ) {
  Backbone.NativeView = <any>Backbone.View;
}
/**
 * Facade
 */
export * from "./core/exception";
export * from "./core/component";
export * from "./core/utils";
export * from "./core/view";
export * from "./core/formview";
export * from "./core/model";
export * from "./core/collection";


