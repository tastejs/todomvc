import { Component, FormView, Model } from "../../../src/core";
import { HeroNameCollection } from "../Collection/HeroName";
import { HeroPowerCollection } from "../Collection/HeroPower";


@Component({
  el: "ng-hero",
  events: {
    "submit form": "onSubmitForm"
  },

  collections: {
    names: new HeroNameCollection(),
    powers: new HeroPowerCollection()
  },

  template: `
    <form data-ng-group="hero" novalidate>
      <div class="form-group">
        <i class="glyphicon glyphicon-user"></i>
        <label for="name">Name</label>
        <input id="name" list="names" name="name" type="text" class="form-control" required >
        <datalist id="names">
          <option data-ng-for="let n of names" data-ng-prop="'value', n.item">
        </datalist>
        <div class="alert alert-danger" data-ng-if="hero.group.dirty && !hero.name.valid">
          Name is required
        </div>
      </div>
      <div class="form-group">
        <i class="glyphicon glyphicon-star-empty"></i>
        <label for="power">Hero Power</label>
        <select id="power" name="power" class="form-control" required>
          <option data-ng-for="let p of powers" data-ng-text="p.item" >Nothing here</option>
        </select>
        <div class="alert alert-danger" data-ng-if="hero.group.dirty && !hero.power.valid">
          Power is required
        </div>
      </div>
       <button type="submit" class="btn btn-default" data-ng-prop="'disabled', !hero.group.valid">Submit</button>

    </form>

`
})

export class HeroView extends FormView {
  el: HTMLElement;
  collections: NgBackbone.CollectionMap;

  initialize() {
    this.collections.get( "powers" ).fetch();
    this.collections.get( "names" ).fetch();
    this.render();
  }

  onSubmitForm( e:Event ){
    let el = <HTMLFormElement> e.target;
    e.preventDefault();
    let collection = this.collections.get( "heroes" ),
        data = this.getData( "hero" );

    el.reset();
    this.reset( "hero" );
    if ( data[ "name" ] ) {
      collection.create( data, {
        error: console.error
      });
    }
  }

}
