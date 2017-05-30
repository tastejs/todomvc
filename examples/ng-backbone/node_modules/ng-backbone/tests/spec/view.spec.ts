import { Component, View, Model, Collection } from "../../src/core";
import { mapFrom } from "../../src/core/utils";


export default function ViewSpec(){
  describe("View", function(){

    describe("@Component + View + no state", function(){
      it( "applies tagName and template", function() {
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
      it( "applies tagName and className and template", function() {
        @Component({
          tagName: "ng-component",
          className: "ng-class",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        expect( view.el.classList.contains( "ng-class" ) ).toBeTruthy();
      });

      it( "loads template from a remote source", function( done ) {
        let ajax = Backbone.ajax;
        Backbone.ajax = <any> function( options: any ): any {
          options.success( "<ng-el></ng-el>" );
        };
        @Component({
          tagName: "ng-component",
          templateUrl: "/tests/fixture/ng-el.html"
        })
        class TestView extends View {
          componentDidMount(){
            expect( this.el.querySelector( "ng-el" ) ).toBeTruthy();
            done();
          }
        }
        let view = new TestView();
        Backbone.ajax = ajax;
      });
    });

    describe("View events", function(){
      beforeEach(function(){
        @Component({
          tagName: "ng-component",
          models: {
            foo: new Model({ bar: "bar" })
          },
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
        }
        this.view = new TestView();
      });

      it( "fires component-will-update", function( done ) {
        this.view.once( "component-will-update", ( scope: any ) => {
          expect( "foo" in scope ).toBeTruthy();
          done();
        });
        this.view.render();
      });
      it( "fires component-did-update", function( done ) {
        this.view.once( "component-did-update", ( scope: any ) => {
          expect( "foo" in scope ).toBeTruthy();
          done();
        });
        this.view.render();
      });

    });

    describe("@Component + View + Models", function(){
      it( "binds specified models", function() {
        @Component({
          tagName: "ng-component",
          models: {
            foo: new Model({ bar: "bar" })
          },
          template: `<ng-el data-ng-text="foo.bar">none</ng-el>`
        })
        class TestView extends View {
        }
        let view = new TestView(),
            errors = view.render().errors,
            el = view.el.querySelector( "ng-el" );
        expect( el ).toBeTruthy();
        expect( el.textContent ).toBe( "bar" );
        expect( errors.length ).toBe( 0 );
      });
    });

    describe("@Component + View + Collections", function(){
      it( "binds specified collections", function() {
        @Component({
          tagName: "ng-component",
          collections: {
            foo: new Collection([
              new Model({ bar: 1 }),
              new Model({ bar: 2 })
            ])
          },
          template: `<ng-el data-ng-for="let i of foo" data-ng-text="i.bar">none</ng-el>`
        })
        class TestView extends View {
        }
        let view = new TestView(),
            errors = view.render().errors,
            els = Array.from( view.el.querySelectorAll( "ng-el" ) );
          expect( els.length ).toBe( 2 );
          expect( els[ 0 ].textContent ).toBe( "1" );
          expect( els[ 1 ].textContent ).toBe( "2" );
      });
    });

    describe("View Lifecycle Methods", function(){
      it( "invokes lifecycle methods", function() {
        let called: string[] = [];
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
          componentWillMount(): void {
            called.push( "componentWillMount" );
          }
          componentDidMount(): void {
            called.push( "componentDidMount" );
          }
          shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean {
            called.push( "shouldComponentUpdate" );
            return true;
          }
          componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentWillUpdate" );
          }
          componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentDidUpdate" );
          }
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        expect( called ).toContain( "componentWillMount" );
        expect( called ).toContain( "componentDidMount" );
        expect( called ).toContain( "shouldComponentUpdate" );
        expect( called ).toContain( "componentWillUpdate" );
        expect( called ).toContain( "componentDidUpdate" );
      });

      it( "prevents rendering if shouldComponentUpdate returns false", function() {
        let called: string[] = [];
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
          componentWillMount(): void {
            called.push( "componentWillMount" );
          }
          componentDidMount(): void {
            called.push( "componentDidMount" );
          }
          shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean {
            called.push( "shouldComponentUpdate" );
            return false;
          }
          componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentWillUpdate" );
          }
          componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentDidUpdate" );
          }
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).not.toBeTruthy();
        expect( called ).not.toContain( "componentWillMount" );
        expect( called ).not.toContain( "componentDidMount" );
        expect( called ).not.toContain( "componentWillUpdate" );
        expect( called ).not.toContain( "componentDidUpdate" );
      });

    });


    describe("collection getters", function(){
      it( "binds getters", function() {
        class TestCollection extends Collection {
          getSize(){
            return this.length;
          }
        }
        @Component({
          tagName: "ng-component",
          collections: {
            foo: new TestCollection([
              new Model({ bar: 1 }),
              new Model({ bar: 2 })
            ])
          },
          template: `<ng-el data-ng-text="foo.size">none</ng-el>
          <ng-li data-ng-for="let i of foo" data-ng-text="i.bar">none</ng-li>`
        })
        class TestView extends View {
        }
        let view = new TestView(),
            errors = view.render().errors,
            el = view.el.querySelector( "ng-el" ),
            els = Array.from( view.el.querySelectorAll( "ng-li" ) );
          expect( el.textContent ).toBe( "2" );
          expect( els.length ).toBe( 2 );
          expect( els[ 0 ].textContent ).toBe( "1" );
          expect( els[ 1 ].textContent ).toBe( "2" );
      });
    });


  });
}
