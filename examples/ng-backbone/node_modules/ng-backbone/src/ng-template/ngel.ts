import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-el="this.setAttribute('ss', 11)">Error</span>
 */
export class NgEl extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter );
    this.nodes =  this.initNodes( el, "ng-el", ( node: HTMLElement, expr: string, compile: Function ) => {
      return {
        el: node,
        exp: compile( expr, "", reporter )
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.exp.call( node.el, data );
    });
  }
}
