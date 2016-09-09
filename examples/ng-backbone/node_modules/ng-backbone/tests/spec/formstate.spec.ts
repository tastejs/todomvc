import { ControlState, GroupState } from "../../src/core/formstate";
import { FormValidators } from "../../src/core/formvalidators";
import { Debounce } from "../../src/core/utils";

export default function FormStateSpec(){
  describe("ControlState", function(){

    beforeEach(function(){
      this.boundingBox = document.createElement( "div" );
    });


    describe("#testCustomValidators", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.input.value = "invalid";
        this.state = new ControlState();
      });

      describe("custom validators (injected as object literal)", function(){
        it( "validates", function() {
          this.state = new ControlState({
            formValidators: {
              foo( value: string ): Promise<void> {
                let pattern = /^(foo|bar)$/;
                if ( pattern.test( value  ) ) {
                  return Promise.resolve();
                }
                return Promise.reject( "Invalid value" );
              }
            }
          });
          this.input.dataset.ngValidate = "foo";
          this.state.testCustomValidators( this.input )
            .then(() => {
              expect( this.state.get( "customError" ) ).toBe( true );
             expect( this.state.get( "validationMessage" ).length ).toBeTruthy();
            });
        });
      });

      describe("custom validators (multiple)", function(){
        it( "validates", function() {
          this.state = new ControlState({
            formValidators: {
              foo( value: string ): Promise<void> {
                return Promise.resolve();
              },
              bar( value: string ): Promise<void> {
                return Promise.reject( "Invalid value" );
              }
            }
          });
          this.input.dataset.ngValidate = "foo, bar";
          this.state.testCustomValidators( this.input )
            .then(() => {
              expect( this.state.get( "customError" ) ).toBe( true );
             expect( this.state.get( "validationMessage" ).length ).toBeTruthy();
            });
        });
      });


      describe("custom validators (injected as class)", function(){
        it( "validates", function() {

          class CustomValidators extends FormValidators {
            foo( value: string ): Promise<void> {
              let pattern = /^(foo|bar)$/;
              if ( pattern.test( value  ) ) {
                return Promise.resolve();
              }
              return Promise.reject( "Invalid value" );
            }
          }

          this.state = new ControlState({
            formValidators: CustomValidators
          });
          this.input.dataset.ngValidate = "foo";
          this.state.testCustomValidators( this.input )
            .then(() => {
              expect( this.state.get( "customError" ) ).toBe( true );
             expect( this.state.get( "validationMessage" ).length ).toBeTruthy();
            });
        });
      });

      describe("custom validators debounced", function(){
        it( "validates", function() {

          class CustomValidators extends FormValidators {
            @Debounce( 200 )
            foo( value: string ): Promise<void> {
              let pattern = /^(foo|bar)$/;
              if ( pattern.test( value  ) ) {
                return Promise.resolve();
              }
              return Promise.reject( "Invalid value" );
            }
          }

          this.state = new ControlState({
            formValidators: CustomValidators
          });
           this.input.dataset.ngValidate = "foo";
          this.state.testCustomValidators( this.input )
            .then(() => {
              expect( this.state.get( "customError" ) ).toBe( true );
             expect( this.state.get( "validationMessage" ).length ).toBeTruthy();
            });
        });
      });




    });


    describe("#onInputChange", function(){

      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.state = new ControlState();
      });

      it( "populates state on required", function( done ) {
        this.input.value = "";
        this.input.setAttribute( "required", true );
        this.state.on( "change", () => {
          expect( this.state.get( "value" ) ).toBe( this.input.value );
          expect( this.state.get( "valueMissing" ) ).toBe( true );
          expect( this.state.get( "valid" ) ).toBe( false );
          // PhantomJS/Opera doesn't fill in validationMessage
          done();
        });
        this.state.setState( this.input );
      });

      it( "populates state on type=email", function( done ) {
        this.input.setAttribute( "type", "email" );
        this.input.value = "invalid";

        this.state.on( "change", () => {
          expect( this.state.get( "value" ) ).toBe( this.input.value );
          expect( this.state.get( "typeMismatch" ) ).toBe( true );
          expect( this.state.get( "valid" ) ).toBe( false );
          // PhantomJS/Opera doesn't fill in validationMessage
          done();
        });
        this.state.setState( this.input );
      });

    });


  });

};