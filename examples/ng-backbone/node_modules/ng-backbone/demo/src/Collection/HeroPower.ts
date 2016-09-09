import { Collection, Model } from "../../../src/core";

export class HeroPowerModel extends Model {
  parse( data: string ){
    return {
      item: data
    };
  }
}

export class HeroPowerCollection extends Collection {
  url= "./powers.json";
  model = HeroPowerModel;
}
