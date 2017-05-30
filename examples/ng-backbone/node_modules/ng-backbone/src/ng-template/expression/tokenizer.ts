import { ExpressionException } from "./exception";

export class Token {
  name: string = "Token";
  constructor( public value: string, public negation: boolean = false ) {
  }
  resolveValue( data: NgTemplate.DataMap ): any {

  }
  toJSON(): NgTemplate.DataMap {
    return {
      "type": this.name,
      "value": this.value,
      "negation": this.negation
    };
  }
}

export class InvalidToken extends Token {
  name: string = "InvalidToken";
}

export class OperatorToken extends Token {
  name: string = "OperatorToken";
  static valid( value: string ){
    let re = /^(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)$/;
    return re.test( value );
  }
}

export class StringToken extends Token {
  name: string = "StringToken";
  static valid( value: string ){
    let single: RegExp = /^\'[^\']+\'$/i,
        double: RegExp = /^\"[^\"]+\"$/i;
    return single.test( value ) || double.test( value );
  }
  resolveValue( data: NgTemplate.DataMap ): any {
     let val = this.value;
     return val.substr( 1, val.length - 2 );
  }
}

export class NumberToken extends Token {
  name: string = "NumberToken";
  static valid( value: string ){
    let re: RegExp = /^\d+$/;
    return re.test( value );
  }
  resolveValue( data: NgTemplate.DataMap ): any {
     let val = Number( this.value );
     return this.negation ? !val : val;
  }
}

export class BooleanToken extends Token {
  name: string = "BooleanToken";
  static valid( value: string ){
    let re: RegExp = /^(true|false)$/i;
    return re.test( value );
  }

  resolveValue( data: NgTemplate.DataMap ): any {
     let val = this.value.toUpperCase() === "TRUE";
     return this.negation ? !val : val;
  }
}

export class ReferenceToken extends Token {
  name: string = "ReferenceToken";
  static valid( value: string ){
    let re: RegExp = /^[a-zA-Z_\$][a-zA-Z0-9\._\$]+$/;
    return value.substr( 0, 5 ) !== "this." && re.test( value );
  }

  static findValue( path: string, data: NgTemplate.DataMap ): any {
    let value: any = data;
    path.split( "\." ).forEach(( key: string ) => {
      if ( typeof value !== "object" ) {
        throw new ExpressionException( `'${path}' is undefined` );
      }
      if ( !( key in value ) ) {
        throw new ExpressionException( `'${path}' is undefined` );
      }
      value = value[ key ];
    });
    return value;
  }

  resolveValue( data: NgTemplate.DataMap ): any {
     let val = ReferenceToken.findValue( this.value, data );
     return this.negation ? !val : val;
  }
}



/**
 * Removes leading negotiation
 */
function removeNegotiation( value: string ){
  let re: RegExp = /^\!\s*/;
  return value.replace( re, "" );
}

export function tokenizer( rawValue: string ): Token {
  let value = removeNegotiation( rawValue ),
      negation = rawValue !== value;

  switch ( true ) {
    case OperatorToken.valid( rawValue ):
      return new OperatorToken( rawValue, false );
    case StringToken.valid( value ):
      return new StringToken( value, negation );
    case NumberToken.valid( value ):
      return new NumberToken( value, negation );
    case BooleanToken.valid( value ):
      return new BooleanToken( value, negation );
    case ReferenceToken.valid( value ):
      return new ReferenceToken( value, negation );
    default:
      return new InvalidToken( value, negation );
  }
}

