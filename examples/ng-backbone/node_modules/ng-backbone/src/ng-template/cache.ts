export class Cache {
  private cache: any;

  match( exVal: any ): boolean {
    if ( exVal === this.cache ) {
      return true;
    }
    this.cache = exVal;
    return false;
  }

  evaluate( exVal: any, cb: NgTemplate.CacheCb ) {
    if ( this.match( exVal ) ) {
      return;
    }
    cb( exVal );
  }
};
