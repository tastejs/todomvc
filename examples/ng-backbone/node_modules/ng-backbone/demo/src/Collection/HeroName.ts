import { Collection, Model } from "../../../src/core";

export class HeroNameModel extends Model {
  parse( data: string ){
    return {
      item: data
    };
  }
}

export class HeroNameCollection extends Collection {
  url= "./names.json";
  model = HeroNameModel;
}
