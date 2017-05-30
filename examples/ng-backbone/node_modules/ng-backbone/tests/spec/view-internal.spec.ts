import { View, Model, Collection } from "../../src/core";
import { ViewHelper } from "../../src/core/view/helper";
import { mapFrom } from "../../src/core/utils";


export default function ViewInternalSpec(){
  describe("View (internal)", function(){
    
    describe("#getterToScope", function(){
      it( "converts flat into scope", function() {
        let data = {
          foo: "foo",
          getFoo(){
            return this.foo;
          },
          getBar(){
            return "bar";
          }
        },
        scope = ViewHelper.getterToScope( data );
        expect( scope["foo"] ).toBe( "foo" );
        expect( scope["bar"] ).toBe( "bar" );
      });
    });
    describe("#modelsToScope", function(){

      it( "converts flat into scope", function() {
        let models = mapFrom({
          foo: new Model({ name: "foo" }),
          bar: new Model({ name: "bar" })
        }),
        scope = ViewHelper.modelsToScope( models );
        expect( scope["foo"].name ).toBe( "foo" );
        expect( scope["bar"].name ).toBe( "bar" );
      });

      it( "converts form states into scope", function() {
        let models = mapFrom({
          "foo.bar": new Model({ name: "bar" }),
          "bar.baz": new Model({ name: "baz" })
        }),
        scope = ViewHelper.modelsToScope( models );
        expect( scope["foo"]["bar"].name ).toBe( "bar" );
        expect( scope["bar"]["baz"].name ).toBe( "baz" );
      });

    });

    describe("#collectionsToScope", function(){

      it( "converts collections into scope", function() {
        let collections = mapFrom({
          foo: new Collection([ new Model({ name: "foo" }) ]),
          bar: new Collection([ new Model({ name: "bar" }) ])
        }),
        scope = ViewHelper.collectionsToScope( collections );

        expect( scope["foo"][ 0 ].name ).toBe( "foo" );
        expect( scope["bar"][ 0 ].name ).toBe( "bar" );
      });
    });


  });
}
