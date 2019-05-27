/* import * as R from 'ramda';
const Rx = require('rxjs');
import {SpyneTrait} from '../../spyne/utils/view-stream-enhancer';
*/
import { Enhancer } from '../mocks/enhancer.test';
class MyClass {
  constructor() {
    this.props = {
      vsid: 1234234
    };
    this.loadEnhancer();
  }

  loadEnhancer() {
    this.enhancer = new Enhancer(this);
   // this.enhancer.initAutoBinder();
  }

  testMethods() {
  }

  myClassFn() {
  }
}

describe('SpyneTrait Tests', () => {
  let theClass = new MyClass();

  describe('should add enhancer methods to a class instance object', () => {
    // let methodScope = theClass.getMethodConstructor();
    // expect(methodScope).to.equal(theClass.constructor.name);
    return true;
  });
  describe('should add enhancer static methods to a class instance object', () => {
    // let methodScope = theClass.getStaticFnConstructor();
    // expect(methodScope).to.equal(theClass.constructor.name);
    return true;
  });
});
