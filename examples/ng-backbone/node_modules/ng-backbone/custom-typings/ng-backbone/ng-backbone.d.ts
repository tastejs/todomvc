declare namespace NgBackbone {

  interface ViewMap {
    clear(): void;
    delete( key: string ): boolean;
    forEach(
      cb: ( value: View[], index: string, map: Map<string, View[]> ) => void,
      thisArg?: any ): void;
    forEachView(
      cb: ( value:View,
          index: number,
          key: string,
          map: Map<string,View[]> ) => void ): void;
    get( key: string, inx?: number ): View;
    getAll( key: string ): View[];
    has( key: string ): boolean;
    hasElement( el: HTMLElement ): boolean;
    set( key: string, value?: View[] ): Map<string, View[]>;
    size: number;
  }

  interface ModelData {
    id?: string | number;
    [key: string]: any;
  }

  interface DataMap<V> {
    [key: string]: V;
  }


  interface AbstractState extends Backbone.Model {
    isCheckboxRadio( el: HTMLElement ): boolean;
    checkValidity(): void;
    validateRequired( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    validateRange( el: HTMLInputElement ): void;
    patternMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    validateTypeMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void>;
    onInputChange( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    setState( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void>;
    onInputFocus(): void;
  }
  interface GroupState extends AbstractState {
  }
  interface ControlState extends AbstractState {
  }

  interface GroupStateValidationMsg {
    control: string;
    message: string;
  }
  interface GroupStateAttrs {
    valid:  boolean;
    dirty:  boolean;
    validationMessage: string;
    validationMessages: GroupStateValidationMsg[];
  }
  interface ControlStateAttrs {
    valid:  boolean;
    dirty:  boolean;
    touched: boolean;
    validationMessage: string;
    valueMissing: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    typeMismatch: boolean;
    patternMismatch: boolean;
  }

  interface Model extends Backbone.Model {

  }
  interface Collection extends Backbone.Collection<Backbone.Model> {
  }

  interface ModelMap extends  Map<string, Backbone.Model> {
  }

  interface CollectionMap extends Map<string, Collection> {
  }

  interface Models {
    [key: string]: any;
  }
  interface Collections {
    [key: string]: Backbone.Collection<Backbone.Model>;
  }

  interface View extends Backbone.NativeView<Backbone.Model> {
    models: ModelMap;
    collections: CollectionMap;
    views: ViewMap;
    parent?: View;
    __ngbComponent: ComponentDto;
    options?: ViewOptions;
    el: HTMLElement;
    template: any;
    errors?: string[];
    // is this view ever mounted
    didComponentMount: boolean;
    componentWillMount(): void;
    componentDidMount(): void ;
    shouldComponentUpdate( nextScope: DataMap<any> ): boolean;
    componentWillUpdate( nextScope: DataMap<any> ): void;
    componentDidUpdate( prevScope: DataMap<any> ): void;
    render( source?: Model | Collection ): any;
  }

  interface ViewCtorOptions {
    [index: number]: Function | ViewOptions;
  }

  interface Views {
    [index: number]: Function | ViewCtorOptions;
  }

  interface ViewCtorMap extends Map<string, Function | ViewCtorOptions> {
  }


  interface LoggerHandler {
     ( msg: string, ...args: any[] ): void
  }

  interface LoggerOption extends DataMap<any> {
  }

  interface ViewOptions extends Backbone.ViewOptions<Backbone.Model>{
    [key: string]: any;
    models?: Models;
    collections?: Collections;
    views?: Views;
    formValidators?: { [key: string]: Function; };
    logger?: LoggerOption;
    template?: string;
    templateUrl?: string;
    parent?: View;
  }

  interface ComponentDto {
    models: Models;
    collections: Collections;
    template?: string;
    templateUrl?: string;
    views?: ViewCtorMap;
  }

  interface ComponentOptions {
    template?: string;
    templateUrl?: string;
    models?: Models;
    collections?: Collections;
    views?: Views;
    el?: any;
    events?: Backbone.EventsHash;
    id?: string;
    className?: string;
    tagName?: string;
    formValidators?: { [key: string]: Function; };
  }
}

