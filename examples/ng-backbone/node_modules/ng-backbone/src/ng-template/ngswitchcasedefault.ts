import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-switch-default></span>
 */
export class NgSwitchCaseDefault extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];
  private el: HTMLElement;

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter );
    this.el = el;
    this.nodes =  this.initNodes( el, "ng-switch-case-default",
      ( node: HTMLElement, expr: string, compile: Function ) => {
      return {
        el: node,
        outerHTML: node.outerHTML,
        exp: compile( expr, "", reporter )
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    if ( !this.nodes.length ) {
      return;
    }
    if ( !this.el.innerHTML ) {
      let node = this.nodes.shift();
      this.el.innerHTML = node.outerHTML;
    }
  }

}
