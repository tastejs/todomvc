import { fromEventPattern } from 'rxjs';
import {last, pick, prop, pickAll, equals, compose, keys, filter, propEq, uniq, map, __, chain, includes, fromPairs, toPairs, values} from 'ramda';

export class SpyneUtilsChannelRoute {
  constructor() {
    /**
     * @module SpyneUtilsChannelRoute
     * @type internal
     *
     * @constructor
     * @desc
     * Internal utility methods for the SpyneRouteChannel
     *
     */
    this.createPopStateStream = SpyneUtilsChannelRoute.createPopStateStream.bind(this);
  }

  static createPopStateStream(subscribeFn) {
    let addHandler = function(handler) {
      window.onpopstate = handler;
    };
    let removeHandler = function() {
      window.onpopstate = function() {};
    };
    let popupObs$ = fromEventPattern(addHandler, removeHandler);

    popupObs$.subscribe(subscribeFn);
  }

  static getLastArrVal(arr) {
    const getLastParam = (a) => last(a) !== undefined ? last(a) : '';
    return getLastParam(arr);
  }

  static compareRouteKeywords(obj = {}, arr) {
    const pickValues = (o, a) => a !== undefined ? pick(a, o) : o;
    let obj1 = pickValues(obj, arr);
    return {
      pickValues,
      compare: (obj = {}, arr) => {
        let obj2 = pickValues(obj, arr);
        const compareProps = p => {
          let p1 = prop(p, obj1);
          let p2 = prop(p, obj2);
          let same = equals(p1, p2);
          let previousExists = p1 !== undefined;
          let nextExists = p2 !== undefined;
          let changed = !same;
          let added = previousExists === false && nextExists === true;
          let removed = previousExists === true && nextExists === false;
          // console.log("P: ",p,{same, previousExists, nextExists});
          let obj = {};
          obj[p] = { same, changed, added, removed, previousExists, nextExists };
          return obj;
        };

        const createPred = p => compose(keys, filter(propEq(p, true)));

        const getPropsState = compose(map(compareProps), uniq, chain(keys))([obj1, obj2]);
        let pathsChanged = chain(createPred('changed'), getPropsState);
        let pathsAdded = chain(createPred('added'), getPropsState);
        let pathsRemoved = chain(createPred('removed'), getPropsState);
        // console.log("GET KEYS ", pathsChanged);
        obj1 = obj2;
        return { pathsAdded, pathsRemoved, pathsChanged };
      },

      getComparer: () => obj1

    };
  }

  static getRouteArrData(routeArr, paramsArr) {
    let paths =  filter(includes(__, routeArr), paramsArr);
    const pathInnermost = SpyneUtilsChannelRoute.getLastArrVal(paths);
    // console.log('arr and routeName ',{paths, pathInnermost});
    return { paths, pathInnermost };
  }

  static flattenConfigObject(obj) {
    const go = obj_ => chain(([k, v]) => {
      if (Object.prototype.toString.call(v) === '[object Object]') {
        return map(([k_, v_]) => [`${k}.${k_}`, v_], go(v));
      } else {
        return [[k, v]];
      }
    }, toPairs(obj_));

    // console.log("FLATTEN: ",values(fromPairs(go(obj))));

    /**
     * TODO: PARSE PAIRS TO ALLOW FOR ARRAYS OR REGEX IN ROUTE CONFIG
     *
     */
    return values(fromPairs(go(obj)));
  }

  static getLocationData() {
    const locationParamsArr = [
      'href',
      'origin',
      'protocol',
      'host',
      'hostname',
      'port',
      'pathname',
      'search',
      'hash'];
    return pickAll(locationParamsArr, window.location);
  }
}
