import { AbstractDirective } from "./abstract-directive";
/**
 * <i data-ng-class-list-toggle="'is-hidden', isHidden"></i>
 */
export class NgClassListToggle extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-class-list-toggle",
      ( node: HTMLElement, expr: string, evaluate: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: evaluate( expr, "__toArray" ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( args: any[] ) => {
        node.el.classList.toggle( args[ 0 ], args[ 1 ] );
      });
    });
  }
}
