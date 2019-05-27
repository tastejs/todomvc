/*import { Enhancer } from '../mocks/enhancer.test';

import * as R from 'ramda';
import { SpyneTrait } from '../../spyne/utils/spyne-trait';
import { ViewStreamEnhancerLoader } from '../../spyne/views/view-stream-enhancer-loader';

class MyClass {
  constructor() {
    this.props = {

    };
    let enhancersArr = [Enhancer];
    this.loadEnhancers(enhancersArr);
    // this.props['enhancersMap'] = this.loadEnhancers.getEnhancersMap();
  }

  testDupeMethod() {

  }

  loadEnhancers(arr) {
    let enhancerLoader = new ViewStreamEnhancerLoader(this, arr);
    this.props['enhancersMap'] = enhancerLoader.getEnhancersMap();
  }
}

describe('ViewStream Enhancer Loader', () => {
  let theClass = new MyClass();

  describe('should return  method ', () => {
    let methodScope = theClass.getMethodConstructor();
    expect(methodScope).to.equal(theClass.constructor.name);
  });

  describe('should return static method ', () => {
    let methodStaticScope = theClass.getStaticFnConstructor();
    expect(methodStaticScope).to.equal(theClass.constructor.name);
  });

  describe('enhancer map should incorporate all methods', () => {
    let theMap = theClass.props.enhancersMap;
    // assert(theMap).to.equal('asdfasd');
    // console.log('the Map is ', theMap.get('ALL'), theMap.get('TEST'), theMap.get('LOCAL'));
    return true;
  });
});
*/