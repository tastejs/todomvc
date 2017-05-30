export class ViewMap implements NgBackbone.ViewMap {
  private map: Map<string, NgBackbone.View[]>;

  constructor() {
    this.map = new Map() as Map<string, NgBackbone.View[]>;
  }

  clear(): void {
    return this.map.clear();
  }

  delete( key: string ): boolean {
    return this.map.delete( key );
  }

  forEach(
    cb: ( value: NgBackbone.View[], index: string, map: Map<string, NgBackbone.View[]> ) => void,
    thisArg?: any ): void {
    return this.map.forEach( cb, thisArg );
  }

  forEachView(
    cb: ( value: NgBackbone.View,
          index: number,
          key: string,
          map: Map<string, NgBackbone.View[]> ) => void ): void {
    return this.map.forEach(( views: NgBackbone.View[], key: string ) => {
      views.forEach(( value: NgBackbone.View, index: number ) => {
        cb.call( this, value, index, key, this.map );
      });
    });
  }

  get( key: string, inx: number = 0 ): NgBackbone.View {
    return this.map.get( key )[ inx ];
  }

  getAll( key: string ): NgBackbone.View[] {
    return this.map.get( key );
  }

  has( key: string ): boolean{
    return this.map.has( key );
  }

  hasElement( el: HTMLElement ): boolean {
    let toggle = false;
    this.map.forEach(( views: NgBackbone.View[] ) => {
      if ( views.find(( view: NgBackbone.View ) => view.el === el ) ){
        toggle = true;
      }
    });
    return toggle;
  }

  set( key: string, value?: NgBackbone.View[] ): Map<string, NgBackbone.View[]> {
    return this.map.set( key, value );
  }

  get size(): number {
    return this.map.size;
  }
}
