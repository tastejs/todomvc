import { Debounce, mapAssign, mapFrom } from "../../src/core/utils";

export default function UtilsSpec(){
  describe("Utils", function(){

    describe("#mapFrom", function(){

      it( "converts object literal for map ", function() {
        let map = mapFrom({
          foo: 1,
          bar: 2
        });
        expect( map instanceof Map ).toBe( true );
        expect( map.get( "foo" ) ).toBe( 1 );
      });
    });


    describe("#mapAssign", function(){

      it( "mixes in object literal into map ", function() {
        let map = new Map();
        map.set( "foo", 1 );
        mapAssign( map, {
          bar: 2
        });
        expect( map instanceof Map ).toBe( true );
        expect( map.get( "foo" ) ).toBe( 1 );
        expect( map.get( "bar" ) ).toBe( 2 );
      });
    });


    describe("#Debounce", function(){

      it( "debounces a method", function( done ) {
        class Foo {
          @Debounce( 50 )
          bar(): any {
            return "bar";
          }
        }
        let foo = new Foo();
        foo.bar().then(( val: string ) => {
          expect( val ).toBe( "bar" );
          done();
        });
      });

    });

  });
}
