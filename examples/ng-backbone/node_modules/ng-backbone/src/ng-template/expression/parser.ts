import { tokenizer, InvalidToken, Token, StringToken } from "./tokenizer";

export class Parser {

  static split( expr: string ): string[] {
    let re = /(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)/;

    return expr
      .split( re )
      .map( ( i: string ) => i.trim() )
      .filter( ( i: string ) => Boolean( i ) );
  }

  static parse( expr: string ): Token[] {
    // if the whole expr is a string
    if ( StringToken.valid( expr ) ) {
      let token: Token = tokenizer( expr.trim() );
      return [ token ];
    }
    let com = Parser.split( expr );
    // case 3: foo + bar
    // case 1: foo (no operators found)
    if ( com.length !== 3 && com.length !== 1 ) {
      return [];
    }
    let tokens: Token[] = com.map( ( i: string ) => tokenizer( i ) );
    // any of tokens is invalid
    if ( tokens.find(( i: Token ) => i instanceof InvalidToken ) ) {
      return [];
    }
    return tokens;
  }
}
