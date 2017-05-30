import { Collection, Component, View, Model } from "../../../src/core";
import { HeroCollection } from "../Collection/Hero";

@Component({
  el: "ng-herolist",
  events: {
    "change [data-bind=checkbox]": "onSelect",
    "click [data-sort]": "onClickSort",
    "click [data-bind=remove]": "onClickRemoveGroup",
    "click [data-bind=markall]": "onSelectAll"
  },
  template: `
<table class="table">
<tr>
  <th data-bind="markall"><i class="glyphicon glyphicon-ok"></i>&nbsp;</th>
  <th data-sort="name">Name <i data-ng-class="'is-inactive', heroes.order !== 'name'" class="glyphicon glyphicon-chevron-down pull-right is-inactive"></i></th>
  <th data-sort="power">Power <i data-ng-class="'is-inactive', heroes.order !== 'power'" class="glyphicon glyphicon-chevron-down pull-right is-inactive"></i></th>
</tr>
<tr data-ng-for="let hero of heroes" class="list__tool-row">

  <td>
    <label>
    <input data-bind="checkbox" type="checkbox" data-ng-data="'id', hero.id" data-ng-attr="'checked', hero.selected" />
    </label>
  </td>

  <td data-ng-text="hero.name" ></td>
  <td data-ng-text="hero.power" ></td>

</tr>

</table>

<div class="row">
  <span><span data-ng-text="heroes.selectedNum">0</span> selected items</span>
  <button data-bind="remove" class="btn btn-danger" data-ng-if="heroes.selectedNum">Remove selected</button>
</div>

`
})

export class HeroListView extends View {
  el: HTMLElement;
  collections: NgBackbone.CollectionMap;
  heroes: NgBackbone.Collection;
  toggle: boolean = false;
  

  initialize() {
    this.heroes = this.collections.get( "heroes" );
    this.heroes.fetch();
    this.render();
  }

  onSelect( e: Event ){
    let el = e.target as HTMLInputElement,
        model = this.heroes.get( el.dataset[ "id" ] ),
        selected = model.get( "selected" );
    model.set( "selected", !selected );
  }

  onSelectAll(){
    this.toggle= !this.toggle;
    this.heroes.forEach(( model: Model ) => {
      model.set( "selected", this.toggle);
    });
  }

  onClickRemoveGroup(){
    this.heroes.forEach(( model: Model ) => {
      model.get( "selected" ) && model.destroy();
    });
  }


  onClickSort( e:Event ) {
    let el = <HTMLElement>e.target,
        order: string = el.dataset[ "sort" ],
        heroes = this.heroes as HeroCollection;
    e.preventDefault();
    heroes.orderBy( order );
  }

}
