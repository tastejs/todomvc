import { fromEventPattern } from 'rxjs';
import { map } from 'rxjs/operators';
import {mapObjIndexed} from 'ramda';

export class SpyneUtilsChannelWindow {
  /**
   * @module SpyneUtilsChannelWindow
   * @type internal
   *
   * @constructor
   * @desc
   * Internal utility methods for SpyneWindowChannel
   *
   *
   */
  constructor() {
    this.createDomObservableFromEvent = SpyneUtilsChannelWindow.createDomObservableFromEvent.bind(
      this);
  }

  static createDomObservableFromEvent(eventName, mapFn, isPassive = true, element=window) {
    let addHandler = handler => element.addEventListener(eventName, handler,
      { passive: isPassive });
    let removeHandler = () => { element[eventName] = (p) => p; };
    mapFn = mapFn === undefined ? (p) => p : mapFn;
    return fromEventPattern(addHandler, removeHandler).pipe(map(mapFn));
  }

  // MEDIA QUERIES
  static createMediaQuery(str) {
    const mq = window.matchMedia(str);
    this.checkIfValidMediaQuery(mq, str);
    return mq;
  }

  static checkIfValidMediaQuery(mq, str) {
    const noSpaces = str => str.replace(/\s+/gm, '');
    const isValidBool = mq.matches!==undefined  && noSpaces(mq.media).indexOf(noSpaces(str))>=0;
    const warnMsg = str => console.warn(`Spyne Info: the following query string, "${str}", has been optimized to "${mq.media}" by the browser and may not be a valid Media Query item!`);
    if (isValidBool === false) {
      warnMsg(str);
    }
    return isValidBool;
  }

  static createMediaQueryHandler(query, key) {
    let keyFn = key => p => {
      p['mediaQueryName'] = key;
      return p;
    };

    let mapKey = keyFn(key);

    let handlers = (q) => {
      return {
        addHandler: (handler) => { q.addListener(handler); },
        removeHandler: (handler) => { q.onchange = () => {}; }
      };
    };
    let mediaQueryHandler = handlers(query);
    /* eslint-disable new-cap */
    return new fromEventPattern(
      mediaQueryHandler.addHandler,
      mediaQueryHandler.removeHandler)
      .pipe(map(mapKey));
  }

  static createMergedObsFromObj(config) {
    let mediaQueriesObj = config.mediqQueries;
    let arr = [];

    const loopQueries = (val, key, obj) => {
      let mq = SpyneUtilsChannelWindow.createMediaQuery(val);
      arr.push(SpyneUtilsChannelWindow.createMediaQueryHandler(mq, key));
      // return arr;
    };

    mapObjIndexed(loopQueries, mediaQueriesObj);
    // let obs$ = Observable.merge(...arr);
    // console.log('arr is ',arr);
    return arr;
  }
}
