import { NgTemplate } from "../ngtemplate";
import { mapFrom } from "./utils";

export function Component( options: NgBackbone.ComponentOptions ): Function {

  let mixin = {
      __ngbComponent: {
        models: options.models,
        collections: options.collections,
        views: mapFrom( options.views ),
        template: options.template,
        templateUrl: options.templateUrl,
      },
      el: options.el || null,
      events: options.events || null,
      id: options.id || null,
      className: options.className || null,
      tagName: options.tagName || null,
      formValidators: options.formValidators || null
    };

  return function( target: Function ){

    Object.assign( target.prototype, mixin );
    // This way we trick invokation of this.initialize after constructor
    // Keeping in mind that @Component belongs to View that knows about this.__ngbInitialize
    if ( "initialize" in target.prototype ) {
      [ target.prototype[ "__ngbInitialize" ], target.prototype[ "initialize" ] ] =
        [ target.prototype[ "initialize" ], () => {} ];
    }
  };
}

