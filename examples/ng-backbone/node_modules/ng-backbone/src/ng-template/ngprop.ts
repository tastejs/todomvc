import { AbstractDirective } from "./abstract-directive";
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
export class NgProp extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter );
    this.nodes =  this.initNodes( el, "ng-prop",
      ( node: HTMLElement, expr: string, compile: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: compile( expr, "__toArray", reporter ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( args: any[] ) => {
        let el = <NgTemplate.Element>node.el;
        el[ args[ 0 ] ] = args[ 1 ];
      });
    });
  }
}

