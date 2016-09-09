import { compile } from "./expression";
import { Cache } from "./cache";

export class AbstractDirective {

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
  }

  initNodes( el: HTMLElement, identifier: string, cb: Function ): NgTemplate.DirectiveNode[]{
    let datakey: string = this.getDataKey( identifier ),
        selector: string = this.getSelector( identifier ),
        targets = <HTMLElement[]>( el.matches( selector )
          ? [ el ] : Array.from( el.querySelectorAll( selector ) ) );

    return targets.map(( el: HTMLElement ) => {
      let expr = el.dataset[ datakey ];
      delete el.dataset[ datakey ];
      return cb( el, expr, compile, new Cache() );
    });
  }

  /**
   * Converts foo-bar-baz to `[data-foo-bar-baz]`
   */
  private getSelector( raw: string ) {
    return `[data-${raw}]`;
  }
  /**
   * Converts foo-bar-baz to fooBarBaz
   */
  private getDataKey( raw: string ) {
    return raw
      .split( "-" ).map( ( part: string, inx: number ) => {
        if ( !inx ) {
          return part;
        }
        return part.substr( 0, 1 ).toUpperCase() + part.substr( 1 );
    })
    .join( "" );
  }
  /**
   * researched strategies
   * el.innerText = str; - no standard
   * el.textContent = str; - fast
   * el.appendChild( document.createTextNode( str ) ) - slower
   */
  setText( el: HTMLElement, str: string ) {
    el.textContent = str;
  }

  escape( str: string ){
    let div = document.createElement( "div" );
    this.setText( div, str );
    return div.innerHTML;
  }


}

