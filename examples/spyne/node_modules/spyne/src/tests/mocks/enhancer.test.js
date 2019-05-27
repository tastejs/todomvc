import { SpyneTrait } from '../../spyne/utils/spyne-trait';

export class Enhancer extends SpyneTrait {
  constructor(context) {
    super(context, 'get');
    this.name = 'TEST';
  }

  getTestDupeMethod1() {

  }

  getMethodConstructor() {
    return this.constructor.name;
  }

  static getStaticFnConstructor() {
    return this.constructor.name;
  }
}
