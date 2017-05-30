export class Reporter {
  private data: NgTemplate.Report;
  constructor() {
    this.data = {
      errors: [],
      log: [],
      tokens: []
    };
  }
  addError( msg: string ): void {
    this.data.errors.push( msg );
  }
  addLog( msg: string ): void {
    this.data.log.push( msg );
  }
  addTokens( tokens: NgTemplate.Token[] ): void {
    let merge: any[] =  tokens.map(( token: NgTemplate.Token ) => token.toJSON() );
    this.data.tokens = this.data.tokens.concat( merge );
  }
  get( key?: string ): NgTemplate.Report {
    return key ? this.data[ key ] : this.data;
  }
  isParsed(): boolean {
    return this.data.tokens.length > 0;
  }
}
