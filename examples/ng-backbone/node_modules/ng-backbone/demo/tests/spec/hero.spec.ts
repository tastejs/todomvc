import { Collection } from "../../../src/core";
import { HeroView } from "../../src/View/Hero";

class MockCollection extends Collection {
  fetch( options?: Backbone.ModelFetchOptions ): JQueryXHR {
    return <JQueryXHR>null;
  }
}

export default function HeroSpec(){


  describe("Hero", function(){

    beforeEach(function(){
      this.view = new HeroView({
         el: null,
         tagName: "ng-hero",
         collections: {
           heroes: new MockCollection(),
           powers: new MockCollection(),
           names: new MockCollection()
         }
       });
    });

    it( "tests if any syntax errors in template", function() {
      expect( this.view.template.report().errors.length ).toBe( 0 );
    });

    it( "shows error msg when power not selected", function() {
      expect( this.view.el.textContent ).not.toMatch( "Power is required" );
       this.view.models
        .get( "hero.power" )
        .set({ "dirty": true, "valid": false });
       expect( this.view.el.textContent ).toMatch( "Power is required" );
    });

    it( "disable submit when power not selected", function() {
       this.view.models
        .get( "hero.power" )
        .set({ "dirty": true, "valid": false });
       let btn = this.view.$( "button[type=submit]" ).item( 0 );
       expect( btn.disabled ).toBeTruthy();
    });

    it( "shows error msg when name not provided", function() {
      expect( this.view.el.textContent ).not.toMatch( "Name is required" )
       this.view.models
        .get( "hero.name" )
        .set({ "dirty": true, "valid": false });
       expect( this.view.el.textContent ).toMatch( "Name is required" );
    });

    it( "disable submit when name not provided", function() {
       this.view.models
        .get( "hero.name" )
        .set({ "dirty": true, "valid": false });
       let btn = this.view.$( "button[type=submit]" ).item( 0 );
       expect( btn.disabled ).toBeTruthy();
    });

    it( "shows no error and enable submit when form is valid", function() {
       let power = this.view.$( "select[name=power]" ).item( 0 ),
           name = this.view.$( "input[name=name]" ).item( 0 ),
           btn = this.view.$( "button[type=submit]" ).item( 0 );

       power.value = "foo";
       name.value = "bar";

       this.view.models
        .get( "hero.group" )
        .checkValidity();

       expect( this.view.el.textContent ).not.toMatch( "Power is required" );
       expect( this.view.el.textContent ).not.toMatch( "Name is required" );
       expect( btn.disabled ).toBeFalsy();
    });


  });

}
