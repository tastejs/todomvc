import { View } from "../../src/core";
import { ViewMap } from "../../src/core/view/map";


export default function ViewMapSpec(){
  describe("ViewMap", function(){
    beforeEach(function(){
      this.map = new ViewMap()
    });
    describe("#set/#getAll", function(){
      it( "mutates/accesses", function() {
        let view = new View(),
            res: View[];
        this.map.set( "foo", [ view ] );
        res = this.map.getAll( "foo" );
        expect( res[ 0 ] ).toBe( view );
      });
    });
    describe("#get", function(){
      it( "accesses a single View without index", function() {
        let view = new View(),
            res: View[];
        this.map.set( "foo", [ view ] );
        res = this.map.get( "foo" );
        expect( res ).toBe( view );
      });
      it( "accesses a single View with index", function() {
        let foo = new View(),
            bar = new View();
        this.map.set( "foo", [ foo, bar ] );
        expect( this.map.get( "foo", 0 ) ).toBe( foo );
        expect( this.map.get( "foo", 1 ) ).toBe( bar );
      });
    });
    describe("#size", function(){
      it( "calcs the size", function() {
        let foo = new View(),
            bar = new View();
        this.map.set( "foo", [ foo, bar ] );
        expect( this.map.size ).toBe( 1 );
      });
    });
    describe("#has", function(){
      it( "tests if map has the key", function() {
        let foo = new View();
        this.map.set( "foo", [ foo ] );
        expect( this.map.has( "foo" ) ).toBe( true );
      });
    });
    describe("#delete", function(){
      it( "deletes an item", function() {
        let foo = new View();
        this.map.set( "foo", [ foo ] );
        this.map.delete( "foo" );
        expect( this.map.has( "foo" ) ).toBe( false );
      });
    });
    describe("#clear", function(){
      it( "deletes all items", function() {
        let foo = new View();
        this.map.set( "foo", [ foo ] );
        this.map.set( "bar", [ foo ] );
        this.map.clear();
        expect( this.map.has( "foo" ) ).toBe( false );
        expect( this.map.has( "bar" ) ).toBe( false );
        expect( this.map.size ).toBe( 0 );
      });
    });
    describe("#forEach", function(){
      it( "iterate the map", function() {
        let foo = new View(),
            keys: string[] = [];
        this.map.set( "foo", [ foo ] );
        this.map.set( "bar", [ foo ] );
        this.map.forEach(( value: View[], key: string ) => {
          keys.push( key );
        });
        expect( keys ).toContain( "foo" );
        expect( keys ).toContain( "bar" );
      });
    });

    describe("#forEachView", function(){
      it( "iterate the map", function() {
        let foo = new View(),
            bar = new View(),
            baz = new View(),
            keys: string[] = [];
        this.map.set( "foo", [ foo ] );
        this.map.set( "bar", [ bar, baz ] );
        this.map.forEachView(( view: View ) => {
          view.id = "id";
        });
        expect( foo.id ).toContain( "id" );
        expect( bar.id ).toContain( "id" );
        expect( baz.id ).toContain( "id" );
      });
    });

    describe("#hasElement", function(){
      it( "finds one", function() {
        let foo = new View(),
            bar = new View(),
            el = bar.el;
        this.map.set( "foo", [ foo ] );
        this.map.set( "bar", [ foo, bar ] );
        expect( this.map.hasElement( el ) ).toBeTruthy();
      });
      it( "does not find one", function() {
        let foo = new View(),
            bar = new View(),
            el = document.createElement( "div" );
        this.map.set( "foo", [ foo ] );
        this.map.set( "bar", [ foo, bar ] );
        expect( this.map.hasElement( el ) ).not.toBeTruthy();
      });
    });

  });
}
