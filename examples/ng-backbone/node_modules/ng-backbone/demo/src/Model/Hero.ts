import { Model } from "../../../src/core";
export class HeroModel extends Model {
  defaults(){ 
    return {
      name: "",
      power: "",
      selected: false
    }
  }
}
