import { Component, View, Model, Collection } from "../../src/core";
import { mapFrom } from "../../src/core/utils";


export default function SubviewSpec(){
  describe("Subview", function(){


    describe("View with nested views straigtforward", function(){
      it( "renders both parent and child views", function() {
        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>"
        })
        class TestView extends View {
        }
        @Component({
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
        }

        let view = new TestView();
        view.render();
        let child = new TestChildView({
          el: view.el.querySelector( "ng-child" )
        });
        child.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });

    describe("View with nested views as @Component.views = [Ctor, Ctor]", function(){

      it( "renders both parent and child views", function() {

        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize(){
            this.render();
          }
        }

        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>",
          views: {
            foo: TestChildView
          }
        })
        class TestView extends View {
        }


        let view = new TestView();
        view.render();
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo" ).parent instanceof TestView ).toBeTruthy();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });

      it( "binds nested view to multiple elements", function() {
        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize(){
            this.render();
          }
        }
        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child><ng-child></ng-child>",
          views: {
            foo: TestChildView
          }
        })
        class TestView extends View {
        }

        let view = new TestView();
        view.render();
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo", 1 ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo" ).parent instanceof TestView ).toBeTruthy();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });

      it( "binds nested view to dinamically added elements", function( done ) {
        let items = new Collection([ new Model() ]);
        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize(){
            this.render();
          }
        }
        @Component({
          tagName: "ng-component",
          template: "<ng-child data-ng-for=\"let item of items\"></ng-child>",
          collections: {
            items: items
          },
          views: {
            foo: TestChildView
          }
        })
        class TestView extends View {
        }

        let view = new TestView();
        view.render();
        expect( view.views.getAll( "foo" ).length ).toBe( 1 );
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        view.views.get( "foo" ).id = "foo";
        items.add([ new Model() ]);
        view.on( "component-did-update", () => {
          expect( view.views.getAll( "foo" ).length ).toBe( 2 );
          expect( view.views.get( "foo", 1 ) instanceof TestChildView ).toBeTruthy();
          expect( view.views.get( "foo", 0 ).id ).toBe( "foo" );
          done();
        });

      });

      it( "removes orphan views", function( done ) {
        let model = new Model(),
            items = new Collection([ model, new Model() ]);
        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize(){
            this.render();
          }
        }
        @Component({
          tagName: "ng-component",
          template: "<ng-child data-ng-for=\"let item of items\"></ng-child>",
          collections: {
            items: items
          },
          views: {
            foo: TestChildView
          }
        })
        class TestView extends View {
        }

        let view = new TestView();
        view.render();
        expect( view.views.getAll( "foo" ).length ).toBe( 2 );

        items.remove([ model ]);
        view.on( "component-did-update", () => {
          expect( view.views.getAll( "foo" ).length ).toBe( 1 );
          done();
        });
      });

    });

    describe("View with nested views as @Component.views = [[Ctor, options]]", function(){
      it( "renders both parent and child views", function() {

        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize( options: any ){
            expect( options.id ).toBe( "ngId" );
            this.render();
          }
        }

        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>",
          views: {
            foo: [ TestChildView, { id: "ngId" } ]
          }
        })
        class TestView extends View {
        }


        let view = new TestView();
        view.render();
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo" ).parent instanceof TestView ).toBeTruthy();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });



  });
}
