import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-text="foo">...</span>
 */
export class NgText extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter );
    this.nodes =  this.initNodes( el, "ng-text",
      ( node: HTMLElement, expr: string, compile: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: compile( expr, "String", reporter ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( val: string ) => {
        this.setText( node.el, val );
      });
    });
  }
}
