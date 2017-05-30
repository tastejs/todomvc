import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-if="expression">Error</span>
 */
export class NgIf extends AbstractDirective  implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter );
    this.nodes =  this.initNodes( el, "ng-if",
      ( node: HTMLElement, expr: string, compile: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        anchor: <HTMLElement>document.createElement( "ng" ),
        exp: compile( expr, "Boolean", reporter ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( val: boolean ) => {
        if ( val ) {
          return this.enable( node );
        }
        this.disable( node );
      });
    });
  }

  private disable( node: NgTemplate.DirectiveNode ): void{
    if ( node.anchor.parentNode ) {
      return;
    }
    node.anchor.style.display = "none";
    node.el.parentNode.insertBefore( node.anchor, node.el );
    node.el.parentNode.removeChild( node.el );
  }

  private enable( node: NgTemplate.DirectiveNode ): void{
    if ( !node.anchor.parentNode ) {
      return;
    }
    node.anchor.parentNode.insertBefore( node.el, node.anchor );
    node.anchor.parentNode.removeChild( node.anchor );
  }

}
