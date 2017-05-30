import { Model } from "./model";
import { Exception } from "./exception";
import { FormValidators } from "./formvalidators";
import { Debounce } from "./utils";


const VALIDITY_STATE = [
        "badInput", "customError", "stepMismatch", "tooLong",
        "valueMissing", "rangeOverflow", "rangeUnderflow",
        "typeMismatch", "patternMismatch", "valueMissing" ],

      SILENT = { silent: true };

export class FormState extends Model {

  private formValidators: FormValidators;



  initialize( options: any ){
    this.formValidators = new FormValidators();
    // Inject custom formValidators
    if ( options && "formValidators" in options ) {
      this._assignFormValidators( options.formValidators );
    }
  }

  /**
   *
   */
  private _assignFormValidators( formValidators: any ): void {
      if ( typeof formValidators !== "function" ) {
        Object.assign( this.formValidators, formValidators );
        return;
      }
      this.formValidators = new formValidators();
      if ( !( this.formValidators instanceof FormValidators ) ) {
        throw new Exception( "Specified option formValidators has invalid type" );
      }
  }


  /**
   * Update `valid` and `validationMessage` according to the current model state
   */
  checkValidity(){
    let invalid = VALIDITY_STATE.some(( key: string ) => {
      return this.attributes[ key ];
    });
    if ( !invalid ) {
      this.set( "validationMessage", "", SILENT );
    }
    this.set( "valid", !invalid );
  }
  /**
   * Run validators from the list data-ng-validate="foo, bar, baz"
   */
  testCustomValidators( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<any> {
    if ( !el.dataset[ "ngValidate" ] ) {
      return Promise.resolve();
    }
    let value = el.value,
        validators = el.dataset[ "ngValidate" ].trim().split( "," );

    if ( !validators ) {
      return Promise.resolve();
    }
    let all = validators.map(( validator: string ) => {
      return this.formValidators[ validator.trim() ]( value );
    });

    return Promise.all( all )
      .then( () => {
        el.setCustomValidity( "" );
      })
      .catch (( err: string | Error ) => {
        if (  err instanceof Error ) {
          throw new Exception( err.message );
        }
        this.set( "customError", true, SILENT );
        this.set( "validationMessage", err, SILENT );
        el.setCustomValidity( <string>err );
      });
  }

  @Debounce( 100 )
  /**
   * Handle change/input events on the input
   */
  onInputChange( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ){
    this.get( "dirty" ) || this.set( "dirty", true );
    this.setState( el );
  }

  setState( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void>{
    if ( "validity" in el ) {
       this.set( "value", el.value, SILENT );

       VALIDITY_STATE.forEach(( method: string ) => {
         let ValidityState = <any>el.validity;
         this.set( method, ValidityState[ method ], SILENT );
       });

       this.set( "validationMessage", el.validationMessage, SILENT );

       return this.testCustomValidators( el )
         .then(() => {
           this.checkValidity();
         });

     } else {
       this.set( "value", ( <HTMLInputElement>el ).checked, SILENT );
       this.checkValidity();
       return Promise.resolve();
     }
  }

  /**
   * Handle focus event on the input
   */
  onInputFocus(){
    this.set( "touched", true );
  }
}


export class GroupState extends FormState {
  defaults() {
    return <NgBackbone.GroupStateAttrs>{
      "valid":    true,  // Control's value is valid
      "dirty":    false, // Control's value has changed
      "validationMessage": "",
      "validationMessages": []
    };
  }
}

export class ControlState extends FormState {
  defaults() {
    return <NgBackbone.ControlStateAttrs>{
      "value":    "",
      "touched":  false, // Control has been visited
      "dirty":    false, // Control's value has changed

       // ValidityState
      "valid":    true,  // Control's value is valid
      "badInput": false, // indicating the user has provided input that the browser is unable to convert
      "customError": false, // from setCustomValidity() / custom validators
      "stepMismatch": false, // indicating the value does not fit the rules determined by the step attribute
      "tooLong": false, // ndicating the value exceeds the specified maxlength for HTMLInputElement/HTMLTextAreaElement
      "valueMissing": false, // indicating the element has a required attribute, but no value.
      "rangeOverflow": false, // indicating the value is greater than the maximum specified by the max attribute.
      "rangeUnderflow": false, // indicating the value is less than the minimum specified by the min attribute.
      "typeMismatch": false, // indicating the value is not in the required syntax
      "patternMismatch": false, // indicating the value does not match the specified pattern
      "validationMessage": ""
    };
  }
}
