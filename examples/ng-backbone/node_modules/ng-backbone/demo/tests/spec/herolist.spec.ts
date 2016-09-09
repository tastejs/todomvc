import { Collection, Model } from "../../../src/core";
import { HeroListView } from "../../src/View/HeroList";

class MockCollection extends Collection {
  fetch( options?: Backbone.ModelFetchOptions ): JQueryXHR {
    return <JQueryXHR>null;
  }
  getSelectedNum(){
    return 0;
  }

  getOrder(){
    return "name";
  }

  orderBy( key: string ): Collection {
    this.comparator = key;
    this.sort();
    return this;
  }
}

export default function HeroListSpec(){

   describe("Hero View", function(){

    beforeEach(function(){
      this.view = new HeroListView({
         el: null,
         tagName: "ng-herolist",
         collections: {
           heroes: new MockCollection([
             new Model({ name: "name1", power: "power3" }),
             new Model({ name: "name2", power: "power2" }),
             new Model({ name: "name3", power: "power1" })
           ])
         }
       });
    });

     it( "tests if any syntax errors in template", function() {
      expect( this.view.template.report().errors.length ).toBe( 0 );
    });

    it( "renders into view all the models of the specified collection ", function() {
      this.view.render();
      let items = this.view.$( "tr.list__tool-row" );
      expect( items.length ).toBe( this.view.collections.get( "heroes" ).length );
    });

    it( "sorts the table by a given key", function( done ) {
      this.view.render();
      this.view.once( "component-did-update", () => {
        let first = this.view.$( "tr.list__tool-row" ).item( 0 );
        expect( first.textContent ).toMatch( "power1" );
        done();
      })
      this.view.collections.get( "heroes" )
        .orderBy( "power" );

    });

  });

}
