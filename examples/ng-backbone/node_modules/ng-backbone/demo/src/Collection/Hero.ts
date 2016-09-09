import { Collection } from "../../../src/core";
import { HeroModel } from "../Model/Hero";

export class HeroCollection extends Collection {
  localStorage = new Backbone.LocalStorage( "heroes" );
  model = HeroModel;
  
  getSelectedNum(){
    return this.filter(( model: HeroModel ) => {
      return model.get( "selected" );
    }).length;
  }
  
  getOrder(){
    return this.comparator;
  }

  /**
   * Shortcut for sorting
   */
  orderBy( key: string ): Collection {
    this.comparator = key;
    this.sort();
    return this;
  }
}
