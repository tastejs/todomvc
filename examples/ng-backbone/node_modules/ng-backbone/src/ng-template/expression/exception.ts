import { Exception } from "../exception";

export class ExpressionException extends Exception {
  constructor( message: string ) {
    super( message );
    this.name = "NgTemplateExpressionException",
    this.message = message;
  }
}
